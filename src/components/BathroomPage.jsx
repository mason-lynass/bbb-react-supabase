import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";

export default function BathroomPage() {

  let loaderData = useLoaderData();
  const params = loaderData[0];
  const bathroom = loaderData[1][0];
  console.log(loaderData);

  function singleBathroom(bathroom) {
    const bathroomPublic = bathroom.public == "true" ? "public" : "private";
    const genderNeutral =
      bathroom.gender_neutral == "true" ? "gender neutral facilities" : "";

    return (
      <div>
        <h2>{bathroom.location_name}</h2>
        <h3>{bathroom.address}</h3>
        <h4>{bathroom.neighborhood}</h4>
        <p>{bathroom.description}</p>
        <p>Average review score: {bathroom.average_score}</p>
        <p>Number of favorites: {bathroom.number_of_favorites}</p>
        <p>{genderNeutral}</p>
        <p>{bathroomPublic}</p>
      </div>
    );
  }

  return (
    <main>
      {singleBathroom(bathroom)}
    </main>
  );
}
