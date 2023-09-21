import { motion as m } from "framer-motion";
import NearMeMap from "./components/NearMeMap";
import Marker from "./components/Marker";
import { fetchApprovedBathrooms } from "./fetch-functions";
import { useQuery } from "@tanstack/react-query";
import { GMKey } from "./ReactQueryApp";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import "./CSS/NearMe.css";
import { useState } from "react";

// this page will be a big map from Google Maps JavaScript API
// lex and I figured a lot of this out here:
// https://github.com/alexbriannaughton/bbb-app/blob/main/client/src/components/MapViewHomepage.js

export default function NearMe() {
  const [userLocation, setUserLocation] = useState(null);
  const [userGeocode, setUserGeocode] = useState(null);

  const {
    isLoading: bathroomsLoading,
    error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  const seattle = { lat: 47.6262, lng: -122.3321 };

  if (bathroomsLoading == true) return <h2>loading...</h2>;

  const allBathrooms = bathrooms.map((bathroom) => {
    let position = {
      lat: bathroom.latitude,
      lng: bathroom.longitude,
    };

    // return Marker component from @googlemaps/react-wrapper
    return (
      <Marker
        key={bathroom.id}
        position={position}
        bathroom={bathroom}
        bathrooms={bathrooms}
      />
    );
  });

  // const render = (status) => {
  //   switch (status) {
  //     case Status.LOADING:
  //       return <h2>loading...</h2>;
  //     case Status.FAILURE:
  //       return <h2>uh oh!</h2>;
  //     case Status.SUCCESS:
  //       return (
  //         <NearMeMap center={userGeocode ? userGeocode : seattle} zoom={11.5}>
  //           {allBathrooms}
  //         </NearMeMap>
  //       );
  //   }
  // };

  console.log(userGeocode)

  function renderMap() {
    if (userGeocode) return (
      <Wrapper classname="Wrapper" apiKey={GMKey}>
        <NearMeMap center={userGeocode} zoom={11}>
          {allBathrooms}
        </NearMeMap>
      </Wrapper>
    )

    else return (
      <Wrapper classname="Wrapper" apiKey={GMKey}>
        <NearMeMap center={seattle} zoom={11}>
          {allBathrooms}
        </NearMeMap>
      </Wrapper>
    );
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();
    if (userLocation) {
      const googleResp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation},seattle&key=${GMKey}`
      );
      const newGeocode = await googleResp.json();
      setUserGeocode(newGeocode.results[0].geometry.location);
    }
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main id='near-me'>
        <section id='where-are-you'>
          <h3>Where are you?</h3>
          <form onSubmit={handleAddressSubmit}>
            <label htmlFor="address">Address:</label>
            <input
              id="address"
              type="text"
              placeholder="400 Broad St"
              onChange={(e) => setUserLocation(e.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>
        </section>
        {renderMap()}
      </main>
    </m.div>
  );
}
