import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate, useNavigate } from "react-router-dom";
import "./BathroomForm.css";
import RatingButton from "../../components/RatingButton";
import SubmittedDialog from "./SubmittedDialog";
import { globalStore } from "../../global/Zustand";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import { supabase } from "../../ReactQueryApp";
import { GMKey } from "../../ReactQueryApp";
import { submitBathroom, submitReview } from "../../React-Query/mutations";

export default function BathroomForm({ bathrooms }) {
  const profile = globalStore((state) => state.profile);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState("submit");

  // bathroom fields
  const [address, setAddress] = useState("");
  const [locationName, setLocationName] = useState("");
  const [bathroomDescription, setBathroomDescription] = useState("");
  const [publicBool, setPublicBool] = useState(false);
  const [gnBool, setGNBool] = useState(false);
  const [ADABool, setADABool] = useState(false);
  const [bathroomid, setBathroomId] = useState(null);

  // review fields
  const [date, setDate] = useState(new Date());
  const [reviewDescription, setReviewDescription] = useState("");
  const [cleanliness, setCleanliness] = useState("");
  const [cleanlinessRating, setCleanlinessRating] = useState(null);
  const [bathroomFunction, setBathroomFunction] = useState("");
  const [bathroomFunctionRating, setBathroomFunctionRating] = useState(null);
  const [style, setStyle] = useState("");
  const [styleRating, setStyleRating] = useState(null);

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

  async function updateUsersAverageReviewScoreRPC(id) {
    const userid = id
    const { data, error } = await supabase.rpc('update_user_average_review_score', { userid })
  }

  const bathroomMutation = useMutation({
    mutationFn: (bathroomData) => {
      return supabase.from("bathrooms").insert(bathroomData).select();
    },
    onSuccess: (data) => {
      reviewSupabase.bathroom_id = data.data[0].id;
      // don't need to call update_bathroom_average_score here because it only has one review, and we sent average_rating inside bathroomData
      queryClient.invalidateQueries({ queryKey: ['bathrooms'] })
      reviewMutation.mutate(reviewSupabase);
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => {
      return supabase.from("reviews").insert(reviewData).select();
    },
    onSuccess: (data) => {
      setBathroomId(data.data[0].bathroom_id);
      updateUsersAverageReviewScoreRPC(profile.id)
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setLoading("finished");
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading("submitting");

    try {
      if (locationName.length < 3)
        throw ["Please enter a Name of business or place."];
      if (address.length < 3) throw ["Please enter a Street Address."];
      if (bathroomDescription.length < 5)
        throw ["Please enter a Location description."];

      if ((cleanlinessRating + bathroomFunctionRating + styleRating) / 3 === 10)
        throw [
          "Was this really the best bathroom of all time? Please don't abuse our database.",
        ];

      const googleResp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}%20Seattle&key=${GMKey}`
      );
      const newGeocode = await googleResp.json();

      if (
        !googleResp.ok ||
        newGeocode.results[0].geometry === undefined ||
        newGeocode.results[0].geometry.location.lat == 47.6061389
      ) {
        throw ["Please enter a valid address"];
      }

      // starting this mutation will start the reviewMutation if it's successful
      // see line 60, "onSuccess" of the bathroomMutation
      bathroomMutation.mutate({
        address: address,
        location_name: locationName,
        // latitude: 47.62656,
        // longitude: -122.306983,
        // neighborhood: "Stevens",
        latitude: newGeocode.results[0].geometry.location.lat,
        longitude: newGeocode.results[0].geometry.location.lng,
        neighborhood: newGeocode.results[0].address_components[2].long_name,
        description: bathroomDescription,
        public: publicBool,
        gender_neutral: gnBool,
        ada_compliant: ADABool,
        average_score:
          (cleanlinessRating + styleRating + bathroomFunctionRating) / 3,
        submitted_by: profile.id,
      });

    } catch (error) {
      setErrors(error);
      setLoading("submit");
    }
  }

  function displayErrors() {
    return (
      <p key={errors} className="display-error">
        {errors}
      </p>
    );
  }
  // if (bathroomid !== null) return <Navigate to={`/bathrooms/${bathroomid}`} />

  return (
    <div id="new-bathroom-container">
      <form id="new-bathroom-form" onSubmit={handleSubmit}>
        <div id="new-bathroom-flex">
          <div id="left-side">
            <h2 id="submit-bathroom-title">Add a new bathroom</h2>
            <section id="bathroom-fields">
              <div>
                <label htmlFor="nb-location-name">
                  Name of business or place:
                </label>
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
                  <label htmlFor="nb-ada-check">
                    ADA compliant facilities?
                  </label>
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
          </div>
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
              <label htmlFor="nr-cleanliness-rating">
                Cleanliness rating: {cleanlinessRating}
              </label>
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
              <label htmlFor="nr-function-rating">
                Function rating: {bathroomFunctionRating}
              </label>
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
              <label htmlFor="nr-style-rating">
                Style rating: {styleRating}
              </label>
              <RatingButton rating={styleRating} setRating={setStyleRating} />
            </div>
          </section>
        </div>
        {displayErrors()}
        <button id="new-bathroom-submit" type="submit">
          {loading === "submit" ? "Submit" : "Loading..."}
        </button>
        <br />
        {bathroomid ? <SubmittedDialog locationName={locationName} /> : ""}
      </form>
    </div>
  );
}
