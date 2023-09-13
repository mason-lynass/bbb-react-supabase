import { useState } from "react";
import DatePicker from "react-datepicker";
import { Navigate, useNavigate } from "react-router-dom";
import "../CSS/BathroomForm.css";

import RatingButton from "./RatingButton";
import { globalStore } from "../Zustand";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../ReactQueryApp";
import { submitBathroom, submitReview } from "../mutations";

// this works for now but once we start using the Google Maps APIs we'll need to make sure that the Geocoding is working correctly
export default function BathroomForm({ GMKey, bathrooms }) {

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
    mutationFn: () => {
      // console.log(bathroomSupabase)
      return supabase.from("bathrooms").insert(bathroomSupabase).select()
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
      // const googleResp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location},seattle&key=${GMKey}`)
      // const newGeocode = await googleResp.json()

      // if (!googleResp.ok || newGeocode.results[0].geometry === undefined) {
      //     throw ["You need to enter a valid address"]
      // }

      // these are the fields that we'll need to provide in order to successfully add a row to the bathrooms table in the DB
      // there are other columns that have default values that we do not need to provide here
      

      // const bathroomResult = await supabase
      //   .from("bathrooms")
      //   .insert(bathroomSupabase)
      //   .select();
      // console.log(await bathroomResult)
      // const createdBathroom = await bathroomResult.data[0];

      bathroomMutation.mutate(bathroomSupabase)
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

  if (bathroomid !== null) return <Navigate to={`/bathrooms/${bathroomid}`} />

  return (
    <div id="new-bathroom-container">
      <form id="new-bathroom-form" onSubmit={handleSubmit}>
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
          <div id="all-nb-radios">
            <div className="nb-radios" id="nb-public">
              <label htmlFor="nb-public-bool">Public?</label>
              <div className="nb-bool" id="nb-public-bool">
                <label>Yes</label>
                <input
                  className="nb-public-radio"
                  name="public-radio-true"
                  type="radio"
                  value={true}
                  onChange={(e) => setPublicBool(e.target.value === "true")}
                ></input>
                <label>No</label>
                <input
                  className="nb-public-radio"
                  name="public-radio-false"
                  type="radio"
                  value={false}
                  onChange={(e) => setPublicBool(e.target.value === "true")}
                ></input>
              </div>
            </div>
            <div className="nb-radios" id="nb-gn">
              <label htmlFor="nb-gn-bool">Gender neutral?</label>
              <div className="nb-bool" id="nb-gn-bool">
                <label>Yes</label>
                <input
                  className="nb-gn-radio"
                  name="gn-radio-true"
                  type="radio"
                  value={true}
                  onChange={(e) => setGNBool(e.target.value === "true")}
                ></input>

                <label>No</label>
                <input
                  className="nb-gn-radio"
                  name="gn-radio-false"
                  type="radio"
                  value={false}
                  onChange={(e) => setGNBool(e.target.value === "true")}
                ></input>
              </div>
            </div>
            <div className="nb-radios" id="nb-ada">
              <label htmlFor="nb-ada-bool">ADA compliant facilities?</label>
              <div className="nb-bool" id="nb-ada-bool">
                <label>Yes</label>
                <input
                  className="nb-ada-radio"
                  name="ada-radio-true"
                  type="radio"
                  value={true}
                  onChange={(e) => setADABool(e.target.value === "true")}
                ></input>
                <label>No</label>
                <input
                  className="nb-ada-radio"
                  name="ada-radio-false"
                  type="radio"
                  value={false}
                  onChange={(e) => setADABool(e.target.value === "true")}
                ></input>
              </div>
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
            <label htmlFor="nr-cleanliness-rating">Cleanliness rating:</label>
            <RatingButton
              rating={cleanlinessRating}
              setRating={setCleanlinessRating}
            />
          </div>
          <div>
            <label htmlFor="nr-function">Function:</label>
            <textarea
              id="nr-function"
              type="text"
              value={bathroomFunction}
              onChange={(e) => setBathroomFunction(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nr-function-rating">Function rating:</label>
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
            <label htmlFor="nr-style-rating">Style rating:</label>
            <RatingButton rating={styleRating} setRating={setStyleRating} />
          </div>
        </section>
        <button id="new-bathroom-submit" type="submit">
          {loading === 'submit' ? "Submit" : "Loading..."}
        </button>
        <br />
        {/* {errors.map((err) => (
                    <p key={err}>{err}</p>
                ))} */}
      </form>
    </div>
  );
}
