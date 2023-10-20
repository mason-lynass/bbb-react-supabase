import { useState } from "react";
import DatePicker from "react-datepicker";
import { Navigate, useNavigate } from "react-router-dom";
import "./BathroomForm.css";

import RatingButton from "../../components/RatingButton";
import SubmittedDialog from "./SubmittedDialog";
import { globalStore } from "../../global/Zustand";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../ReactQueryApp";
import { GMKey } from "../../ReactQueryApp";
import { submitBathroom, submitReview } from "../../React-Query/mutations";

// this works for now but once we start using the Google Maps APIs we'll need to make sure that the Geocoding is working correctly
export default function BathroomForm({ bathrooms }) {
  
  const profile = globalStore((state) => state.profile);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState('submit');

  // bathroom fields
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState("");
  const [bathroomDescription, setBathroomDescription] = useState("");
  const [publicBool, setPublicBool] = useState(false);
  const [gnBool, setGNBool] = useState(false);
  const [ADABool, setADABool] = useState(false);

  // review fields
  const [date, setDate] = useState(new Date());
  const [reviewDescription, setReviewDescription] = useState("");
  const [cleanliness, setCleanliness] = useState("");
  const [cleanlinessRating, setCleanlinessRating] = useState(null);
  const [bathroomFunction, setBathroomFunction] = useState("");
  const [bathroomFunctionRating, setBathroomFunctionRating] = useState(null);
  const [style, setStyle] = useState("");
  const [styleRating, setStyleRating] = useState(null);

  const [bathroomid, setBathroomId] = useState(null)

  const bathroomSupabase = {
    address: address,
    location_name: locationName,
    // latitude: newGeocode.results[0].geometry.location.lat,
    // longitude: newGeocode.results[0].geometry.location.lng,
    latitude: 47.3,
    longitude: -122.5,
    // neighborhood: newGeocode.results[0].address_components[2].long_name,
    neighborhood: "Columbia City",
    description: bathroomDescription,
    public: publicBool,
  };

  const reviewSupabase = {
    user_id: profile.id,
    bathroom_id: null,
    date: date.toDateString(),
    description: reviewDescription,
    cleanliness,
    cleanliness_rating: cleanlinessRating,
    function: bathroomFunction,
    function_rating: bathroomFunctionRating,
    style,
    style_rating: styleRating,
    average_rating: (
      (cleanlinessRating + bathroomFunctionRating + styleRating) /
      3
    ).toFixed(2),
  };

  const reviewMutation = useMutation({
    mutationFn: () =>  {
      console.log(reviewSupabase)
      return supabase.from("reviews").insert(reviewSupabase).select()
    },
    onSuccess: (data) => {
      console.log(data)
      setBathroomId(data.data[0].bathroom_id);
      setLoading('finished')
    },
  });

  const bathroomMutation = useMutation({
    mutationFn: (bathroomData) => {
      // console.log(bathroomSupabase)
      return supabase.from("bathrooms").insert(bathroomData).select()
    },
    onSuccess: (data) => {
      // console.log('first success!')
      // console.log(reviewSupabase)
      // console.log(data)
      reviewSupabase.bathroom_id = data.data[0].id;
      reviewMutation.mutate()
    },
  });



  async function handleSubmit(e) {
    e.preventDefault();
    setLoading('submitting');

    try {

      if (((cleanlinessRating + bathroomFunctionRating + styleRating) /
      3) === 10) throw ["Was this really the best bathroom of all time? Please don't abuse our database."]

      const googleResp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address},seattle&key=${GMKey}`)
      const newGeocode = await googleResp.json()

      console.log(newGeocode)

      if (!googleResp.ok || newGeocode.results[0].geometry === undefined) {
          throw ["You need to enter a valid address"]
      }

      // these are the fields that we'll need to provide in order to successfully add a row to the bathrooms table in the DB
      // there are other columns that have default values that we do not need to provide here
      

      // const bathroomResult = await supabase
      //   .from("bathrooms")
      //   .insert(bathroomSupabase)
      //   .select();
      // console.log(await bathroomResult)
      // const createdBathroom = await bathroomResult.data[0];

      bathroomMutation.mutate({
        address: address,
        location_name: locationName,
        latitude: newGeocode.results[0].geometry.location.lat,
        longitude: newGeocode.results[0].geometry.location.lng,
        neighborhood: newGeocode.results[0].address_components[2].long_name,
        description: bathroomDescription,
        public: publicBool,
      })
      // .then(reviewMutation.mutate);

      // const createdBathroom = postBathroom

      // console.log(createdBathroom)

      // // i changed this line to throw instead of console.log, fwiw
      // if (!bathroomResult) throw bathroomResult.error;

      // reviewMutation.mutate(reviewSupabase)

      // const reviewResult = await supabase
      //   .from("reviews")
      //   .insert(reviewSupabase)
      //   .select();
      // const createdReview = await reviewMutation.data[0];
      // const createdReview = await reviewMutation.data.data[0];
      // if (!reviewResult) throw createdReview.error;

      console.log(
        // bathroomMutation,
        reviewSupabase.bathroom_id,
        errors
      );

      
      
      // maybe this needs to be inside another array?
      // globalStore.setState({ bathrooms: [...bathrooms], createdBathroom });
      // setBathrooms([...bathrooms], createdBathroom);
    } catch (error) {
      console.log(error);
      setErrors(error);
      setLoading(error);
    }
  }

  console.log(publicBool, gnBool, ADABool)

  // if (bathroomid !== null) return <Navigate to={`/bathrooms/${bathroomid}`} />

  return (
    <div id="new-bathroom-container">
      <form id="new-bathroom-form" onSubmit={handleSubmit}>
        <div id='new-bathroom-flex'>
        <section id="bathroom-fields">
          <div>
            <label htmlFor="nb-location-name">Name of business or place:</label>
            <input
              id="nb-location-name"
              name="location-name"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="nb-address">Street Address:</label>
            <input
              id="nb-address"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="date-picker">Date visited:</label>
            <DatePicker
              id="date-picker"
              name="date"
              selected={date}
              onChange={(date) => setDate(date)}
            />
          </div>
          <div>
            <label htmlFor="nb-location-description">
              Location description:
            </label>
            <textarea
              id="nb-location-description"
              name="location-description"
              type="text"
              value={bathroomDescription}
              onChange={(e) => setBathroomDescription(e.target.value)}
            ></textarea>
          </div>
          <div id="all-nb-checks">
            <div className="nb-checks" id="nb-public">
              <label htmlFor="nb-public-check">Public?</label>
                <input
                  className="nb-public-check"
                  name="public-check-true"
                  type="checkbox"
                  value={true}
                  onChange={(e) => setPublicBool(!publicBool)}
                ></input>
            </div>
            <div className="nb-checks" id="nb-gn">
              <label htmlFor="nb-gn-check">Gender neutral?</label>
                <input
                  className="nb-gn-check"
                  name="gn-check-true"
                  type="checkbox"
                  value={true}
                  onChange={(e) => setGNBool(!gnBool)}
                ></input>
            </div>
            <div className="nb-checks" id="nb-ada">
              <label htmlFor="nb-ada-check">ADA compliant facilities?</label>
                <input
                  className="nb-ada-check"
                  name="ada-check-true"
                  type="checkbox"
                  value={true}
                  onChange={(e) => setADABool(!ADABool)}
                ></input>
            </div>
          </div>
        </section>
        <section id="review-fields">
          <div>
            <label htmlFor="nr-bathroom-description">
              Bathroom description:
            </label>
            <textarea
              id="nr-bathroom-description"
              name="bathroom-description"
              type=""
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nr-cleanliness">Cleanliness:</label>
            <textarea
              id="nr-cleanliness"
              type="text"
              value={cleanliness}
              onChange={(e) => setCleanliness(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nr-cleanliness-rating">Cleanliness rating: {cleanlinessRating}</label>
            <RatingButton
              rating={cleanlinessRating}
              setRating={setCleanlinessRating}
            />
          </div>
          <div>
            <label htmlFor="nr-function">Function: </label>
            <textarea
              id="nr-function"
              type="text"
              value={bathroomFunction}
              onChange={(e) => setBathroomFunction(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nr-function-rating">Function rating: {bathroomFunctionRating}</label>
            <RatingButton
              rating={bathroomFunctionRating}
              setRating={setBathroomFunctionRating}
            />
          </div>
          <div>
            <label htmlFor="nr-style">Style:</label>
            <textarea
              id="nr-style"
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nr-style-rating">Style rating: {styleRating}</label>
            <RatingButton rating={styleRating} setRating={setStyleRating} />
          </div>
          
        </section>
        </div>
        <button id="new-bathroom-submit" type="submit">
          {loading === 'submit' ? "Submit" : "Loading..."}
        </button>
        <br />
        {bathroomid ? <SubmittedDialog locationName={locationName} /> : ''}
      </form>
    </div>
  );
}
