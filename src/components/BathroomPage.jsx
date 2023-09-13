import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewReview from "./NewReview";
import BathroomPageMap from "./BathroomPageMap";
import { fetchOneBathroom, fetchOneBathroomReviews } from "../fetch-functions";
import { useQuery } from "@tanstack/react-query";
import { globalStore } from "../Zustand";

export default function BathroomPage({ params }) {

  const id = useParams();
  const users = globalStore((state) => state.users);
  const [showReview, setShowReview] = useState(false);

  const {
    status: oBStatus,
    error: oBError,
    data: bathroom,
  } = useQuery({
    queryKey: ["bathrooms", parseInt(id.bathroomid)],
    queryFn: () => fetchOneBathroom(id),
  });

  const {
    status: oBReviewStatus,
    error: oBReviewError,
    data: bathroomReviews,
  } = useQuery({
    queryKey: ["reviews", { bathroom: parseInt(id) }],
    queryFn: () => fetchOneBathroomReviews(id),
  });

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
          <p id="one-bathroom-description">{bathroom.description}</p>
          <div id="one-bathroom-stats">
            <p>
              Average review score: {bathroom.average_score} (
              {bathroomReviews.length || 0} reviews)
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

  // this should be a request to Supabase to add a row to the favorites table with a user_id and a bathroom_id
  function addFavorite() {}

  function singleBathroomButtons() {
    return (
      <div id="one-bathroom-buttons">
        {/* this will open up a modal over the whole window that displays the NewReview component */}
        <button onClick={() => setShowReview(true)}>Write a Review</button>
        {/* this will make a DB request to create a new favorite with the user id and bathroom id */}
        <button onClick={() => console.log("favorite")}>Favorite</button>
      </div>
    );
  }

  function oneReview(review) {
    const user = users.find((u) => u.id === review.user_id);
    return (
      <div className="one-bathroom-one-review">
        <div>
          <p>{user.username}</p>
          <p>{review.average_rating}</p>
        </div>
        <p>{review.description}</p>
        <div>
          <p>cleanliness: {review.cleanliness_rating}</p>
          <p>{review.cleanliness}</p>
        </div>
        <div>
          <p>function: {review.function_rating}</p>
          <p>{review.function}</p>
        </div>
        <div>
          <p>style: {review.style_rating}</p>
          <p>{review.style}</p>
        </div>
      </div>
    );
  }

  function singleBathroomReviews() {
    console.log(bathroomReviews);
    return (
      <>
        <h2 id="reviews-title">Reviews</h2>
        <div id="one-bathroom-reviews">
          {bathroomReviews.map((r) => oneReview(r))}
        </div>
      </>
    );
  }

  if (oBStatus === "loading") return <p>loading...</p>;

  console.log(users);

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
      {bathroomReviews.length ? <section>{singleBathroomReviews(bathroom)}</section> : ''}
      {showReview === true ? <NewReview /> : ""}
    </main>
  );
}
