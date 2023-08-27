import { useState } from "react";
import DatePicker from "react-datepicker";
import { Navigate, useNavigate } from "react-router-dom";

import RatingButton from "./RatingButton";

export default function BathroomForm({
  profile,
  bathrooms,
  setBathrooms,
  GMKey,
  supabase,
}) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // bathroom fields
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState("");
  const [bathroomDescription, setBathroomDescription] = useState("");
  const [publicBool, setPublicBool] = useState(null);

  // review fields
  const [date, setDate] = useState(new Date());
  const [reviewDescription, setReviewDescription] = useState("");
  const [cleanliness, setCleanliness] = useState("");
  const [cleanlinessRating, setCleanlinessRating] = useState(null);
  const [bathroomFunction, setBathroomFunction] = useState("");
  const [bathroomFunctionRating, setBathroomFunctionRating] = useState(null);
  const [style, setStyle] = useState("");
  const [styleRating, setStyleRating] = useState(null);

  console.log();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // const googleResp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location},seattle&key=${GMKey}`)
      // const newGeocode = await googleResp.json()

      // if (!googleResp.ok || newGeocode.results[0].geometry === undefined) {
      //     throw ["You need to enter a valid address"]
      // }

      // these are the fields that we'll need to provide in order to successfully add a row to the bathrooms table in the DB
      // there are other columns that have default values that we do not need to provide here
      const bathroomSupabase = {
        address: address,
        location_name: locationName,
        // latitude: newGeocode.results[0].geometry.location.lat,
        // longitude: newGeocode.results[0].geometry.location.lng,
        latitude: 47.3,
        longitude: -122.5,
        // neighborhood: newGeocode.results[0].address_components[2].long_name,
        neighborhood: "Capitol Hill",
        description: bathroomDescription,
        public: publicBool,
      };

      const bathroomResult = await supabase
        .from("bathrooms")
        .insert(bathroomSupabase)
        .select();
      // console.log(await bathroomResult)
      const createdBathroom = await bathroomResult.data[0];

      // // i changed this line to throw instead of console.log, fwiw
      if (!bathroomResult) throw bathroomResult.error;

      const reviewSupabase = {
        user_id: profile.id,
        bathroom_id: await createdBathroom.id,
        date: date.toDateString(),
        description: reviewDescription,
        cleanliness,
        cleanliness_rating: cleanlinessRating,
        function: bathroomFunction,
        function_rating: bathroomFunctionRating,
        style,
        style_rating: styleRating,
      };

      // console.log(reviewSupabase)

      const reviewResult = await supabase
        .from("reviews")
        .insert(reviewSupabase)
        .select();
      const createdReview = await reviewResult.data[0];
      if (!reviewResult) throw createdReview.error;

      console.log(bathroomResult, reviewResult, errors);
      // Navigate(`/bathrooms/${createdBathroom.id}`)
      // maybe this needs to be inside another array?
      setBathrooms([...bathrooms], createdBathroom);
    } catch (error) {
      console.log(error);
      setErrors(error);
      setLoading(false);
    }
  }

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
          <div>
            <label htmlFor="nb-public-bool">Public?</label>
            <div id="nb-public-bool">
              <input
                className="nb-public-radio"
                name="public-radio-true"
                type="radio"
                value={true}
                onChange={(e) => setPublicBool(e.target.value === "true")}
              ></input>
              <label>True</label>
              <input
                className="nb-public-radio"
                name="public-radio-false"
                type="radio"
                value={false}
                onChange={(e) => setPublicBool(e.target.value === "true")}
              ></input>
              <label>False</label>
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
          {loading ? "Loading..." : "Submit"}
        </button>
        <br />
        {/* {errors.map((err) => (
                    <p key={err}>{err}</p>
                ))} */}
      </form>
    </div>
  );
}
