import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BathroomForm.css";
import RatingButton from "../../components/RatingButton";
import SubmittedDialog from "./SubmittedDialog";
import { globalStore } from "../../global/Zustand";
import { useMutation } from "@tanstack/react-query";
import {
  englishDataset,
  RegExpMatcher,
  englishRecommendedTransformers,
} from "obscenity";

import { queryClient } from "../../main";
import { supabase, GMKey, neighborhoods } from "../../global/constants";

export default function BathroomForm() {
  const profile = globalStore((state) => state.profile);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState("submit");

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  // bathroom fields
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [locationName, setLocationName] = useState("");
  const [bathroomDescription, setBathroomDescription] = useState("");
  const [publicBool, setPublicBool] = useState(false);
  const [gnBool, setGNBool] = useState(false);
  const [ADABool, setADABool] = useState(false);
  const [bathroomid, setBathroomId] = useState(null);
  const [geocodeRequested, setGeocodeRequested] = useState(false);
  const [geocodeErrors, setGeocodeErrors] = useState([]);

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
    const userid = id;
    const { error } = await supabase.rpc("update_user_average_review_score", {
      userid,
    });
    if (error) console.error(error);
  }

  const bathroomMutation = useMutation({
    mutationFn: (bathroomData) => {
      return supabase.from("bathrooms").insert(bathroomData).select();
    },
    onSuccess: (data) => {
      reviewSupabase.bathroom_id = data.data[0].id;
      // don't need to call update_bathroom_average_score here because it only has one review, and we sent average_rating inside bathroomData
      queryClient.invalidateQueries({ queryKey: ["bathrooms"] });
      reviewMutation.mutate(reviewSupabase);
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => {
      return supabase.from("reviews").insert(reviewData).select();
    },
    onSuccess: (data) => {
      setBathroomId(data.data[0].bathroom_id);
      updateUsersAverageReviewScoreRPC(profile.id);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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

      if (
        matcher.hasMatch(bathroomDescription) ||
        matcher.hasMatch(reviewDescription) ||
        matcher.hasMatch(cleanliness) ||
        matcher.hasMatch(bathroomFunction) ||
        matcher.hasMatch(style)
      ) {
        const bathroomBad = matcher.getAllMatches(reviewDescription);
        const reviewBad = matcher.getAllMatches(reviewDescription);
        const cleanBad = matcher.getAllMatches(cleanliness);
        const funcBad = matcher.getAllMatches(bathroomFunction);
        const styleBad = matcher.getAllMatches(style);
        const badWords = [bathroomBad, reviewBad, cleanBad, funcBad, styleBad];
        const theWords = [];
        for (const wordsArray of badWords) {
          for (const word of wordsArray) {
            if (word.termId) {
              const { phraseMetadata } =
                englishDataset.getPayloadWithPhraseMetadata(word);
              theWords.push(phraseMetadata.originalWord);
            }
          }
        }
        throw [
          `Please avoid using obscene language on this website. Bad words: ${theWords}`,
        ];
      }

      if (geocodeRequested(true)) {
        bathroomMutation.mutate({
          address: address,
          location_name: locationName,
          latitude: latLng.lat,
          longitude: latLng.lng,
          neighborhood: neighborhood,
          description: bathroomDescription,
          public: publicBool,
          gender_neutral: gnBool,
          ada_compliant: ADABool,
          average_score: (
            (cleanlinessRating + styleRating + bathroomFunctionRating) /
            3
          ).toFixed(2),
          submitted_by: profile.id,
        });
      } else {
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

        if (
          newGeocode.results[0].address_components.filter(
            (comp) => comp.short_name === "Seattle"
          ) === 0
        ) {
          throw [
            "Please limit submissions to locations inside the city of Seattle.",
          ];
        }

        // starting this mutation will start the reviewMutation if it's successful
        // see "onSuccess" of the bathroomMutation
        bathroomMutation.mutate({
          address: address,
          location_name: locationName,
          latitude: newGeocode.results[0].geometry.location.lat,
          longitude: newGeocode.results[0].geometry.location.lng,
          neighborhood: newGeocode.results[0].address_components[2].long_name,
          description: bathroomDescription,
          public: publicBool,
          gender_neutral: gnBool,
          ada_compliant: ADABool,
          average_score: (
            (cleanlinessRating + styleRating + bathroomFunctionRating) /
            3
          ).toFixed(2),
          submitted_by: profile.id,
        });
      }
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

  function displayGeocodeErrors() {
    return (
      <p id="geocode-error" className="display-error">
        {geocodeErrors}
      </p>
    );
  }

  async function getAddressFromPlace(e) {
    e.preventDefault()
    const googleResp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationName
      )}%20Seattle&key=${GMKey}`
    );
    const newGeocode = await googleResp.json();

    console.log(newGeocode);

    if (newGeocode.status === "OK" && !newGeocode.results[0].partial_match) {
      const commaIndex = newGeocode.results[0].formatted_address.indexOf(",");
      setAddress(newGeocode.results[0].formatted_address.slice(0, commaIndex));
      setNeighborhood(
        newGeocode.results[0].address_components.filter((com) =>
          com.types.includes("neighborhood")
        )[0].long_name
      );
      setLatLng({
        lat: newGeocode.results[0].geometry.location.lat,
        lng: newGeocode.results[0].geometry.location.lng,
      });
      setGeocodeErrors([])
      setGeocodeRequested(true);
    } else {
      setGeocodeErrors(
        "Failed to find information about this place. Try adding a neighborhood or street to this field before another attempt."
      );
    }
  }

  console.log(address, neighborhood, latLng, geocodeRequested);

  return (
    <div id="new-bathroom-container">
      <form id="new-bathroom-form" onSubmit={handleSubmit}>
        <h2 id="submit-bathroom-title">Add a new bathroom</h2>
        <div id="new-bathroom-flex">
          <div id="left-side">
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
                <button id="get-address" onClick={(e) => getAddressFromPlace(e)}>
                  Get Address from Place Name
                </button>
                {displayGeocodeErrors()}
                <p id="get-address-disclaimer">
                  If there might be more than one location with your place name
                  (ex. "Safeway", "Dick's", "Taco Time"), please check the
                  address this provides, or leave more information about the
                  neighborhood or surrounding area. Thanks!
                </p>
              </div>
              <div id="nb-neighborhood">
                <label htmlFor="neighborhood-dropdown">
                  Neighborhood (optional):
                </label>
                <select
                  aria-label="Neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  id="neighborhood-dropdown"
                >
                  <option value="none" key="null">
                    - Neighborhood -
                  </option>
                  {neighborhoods.map((n) => {
                    return (
                      <option value={n} key={n}>
                        {n}
                      </option>
                    );
                  })}
                </select>
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
                    onChange={() => setPublicBool(!publicBool)}
                  ></input>
                </div>
                <div className="nb-checks" id="nb-gn">
                  <label htmlFor="nb-gn-check">Gender neutral?</label>
                  <input
                    className="nb-gn-check"
                    name="gn-check-true"
                    type="checkbox"
                    value={true}
                    onChange={() => setGNBool(!gnBool)}
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
                    onChange={() => setADABool(!ADABool)}
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
        <button id="new-bathroom-submit" type="submit" onClick={(e) => handleSubmit(e)}>
          {loading === "submit" ? "Submit" : "Loading..."}
        </button>
        <br />
        {bathroomid ? <SubmittedDialog locationName={locationName} /> : ""}
      </form>
    </div>
  );
}
