import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import NewReview from "./NewReview";
import BathroomPageMap from "./BathroomPageMap";

export default function BathroomPage() {
  let loaderData = useLoaderData();
  const params = loaderData[0];
  const bathroom = loaderData[1][0];
  console.log(loaderData);

  const [showReview, setShowReview] = useState(false)

  function singleBathroom(bathroom) {
    const bathroomPublic = bathroom.public == "true" ? "public restroom" : "";
    const ADACompliant =
      bathroom.ada_compliant == "true" ? "ADA compliant facilities" : "";
    const genderNeutral =
      bathroom.gender_neutral == "true" ? "gender neutral facilities" : "";

    return (
      <>
        <div id="single-bathroom-container">
          <h1 id="bathroom-name">{bathroom.location_name}</h1>
          <div id="one-bathroom-location">
            <h3>{bathroom.address}</h3>
            <h3>{bathroom.neighborhood}</h3>
          </div>
          <p id='one-bathroom-description'>{bathroom.description}</p>
          <div id="one-bathroom-stats">
            <p>
              Average review score: {bathroom.average_score} (number reviews)
            </p>
            <p>Number of favorites: {bathroom.number_of_favorites}</p>
          </div>
          <div id="one-bathroom-filters">
            <p>{bathroomPublic}</p>
            <p>{genderNeutral}</p>
            <p>{ADACompliant}</p>
          </div>
        </div>
      </>
    );
  }

  function addFavorite () {
    
  }

  function singleBathroomButtons() {
    return (
      <div id='one-bathroom-buttons'>
        {/* this will open up a modal over the whole window that displays the NewReview component */}
        <button onClick={() => setShowReview(true)}>Write a Review</button>
        {/* this will make a DB request to create a new favorite with the user id and bathroom id */}
        <button onClick={() => console.log("favorite")}>Favorite</button>
      </div>
    );
  }

  function singleBathroomReviews(bathroom) {
    return <p>da reviews</p>;
  }

  // maybe NewReview comes up in a modal after a button press?
  return (
    <main>
      <div id="bathroom-top-split">
        <section>
          {singleBathroom(bathroom)}
          {singleBathroomButtons()}
        </section>
        {/* <BathroomPageMap /> */}
      </div>
      {singleBathroomReviews(bathroom)}
      {showReview === true ? <NewReview /> : "" }
    </main>
  );
}
