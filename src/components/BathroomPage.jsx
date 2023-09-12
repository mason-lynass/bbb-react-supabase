import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import NewReview from "./NewReview";
import BathroomPageMap from "./BathroomPageMap";
import { fetchOneBathroom } from "../fetch-functions";
import { useQuery } from "@tanstack/react-query";

// export async function oneBathroomLoader({ params }) {
//   // if there are no bathrooms, or one bathroom, then we need to get ONE bathroom from the database
//   // because we could either not have any bathroom, or possibly have a different single bathroom stored in state
//   if (bathrooms.length <= 1) {
//     return [params, await fetchOneBathroom(params)];
//   } else {
//     // if there is more than one bathroom, then we should have ALL of the bathrooms
//     // so we just need to filter all of the bathrooms
//     let bathroom = bathrooms.filter(
//       (b) => b.id == parseInt(params.bathroomid)
//     );
//     return [params, bathroom];
//   }
// }

export default function BathroomPage({ params }) {
  const id = useParams()
  console.log(id)
  const { status: oBStatus, error: oBError, data: bathroom} = useQuery({
    queryKey: ['bathrooms', parseInt(id.bathroomid)],
    queryFn: () => fetchOneBathroom(id)
})

  // let loaderData = useLoaderData();
  // const params = loaderData[0];
  // const bathroom = loaderData[1][0];
  // console.log(loaderData);



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

  if (oBStatus === 'loading') return <p>loading...</p>

  console.log(oBStatus)

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
