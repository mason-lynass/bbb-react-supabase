import { useState } from "react";
import { motion as m } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Wrapper } from "@googlemaps/react-wrapper";
import { GMKey, seattle } from "../../global/constants";
import NearMeMap from "./NearMeMap";
import Marker from "../../components/Marker";
import { fetchApprovedBathrooms } from "../../React-Query/fetch-functions";
import "./NearMe.css";

// lex and I figured a lot of this out here:
// https://github.com/alexbriannaughton/bbb-app/blob/main/client/src/components/MapViewHomepage.js

export default function NearMe() {
  const [userLocation, setUserLocation] = useState('');
  const [userGeocode, setUserGeocode] = useState(null);
  const [publicBool, setPublicBool] = useState(false);
  const [ADABool, setADABool] = useState(false);
  const [GNBool, setGNBool] = useState(false);

  const {
    isLoading: bathroomsLoading,
    // error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  if (bathroomsLoading == true) return <h2>loading...</h2>;

  function allBathrooms() {

    let allTheBathrooms = [...bathrooms];

    const publicBathrooms = [...bathrooms].filter((b) => b.public === true);
    const ADABathrooms = [...bathrooms].filter((b) => b.ada_compliant === true);
    const GNBathrooms = [...bathrooms].filter((b) => b.gender_neutral === true);

    switch (true) {
      case publicBool && ADABool && GNBool:
        allTheBathrooms = publicBathrooms
          .filter((b) => b.ada_compliant === true)
          .filter((b) => b.gender_neutral === true);
        break;
      case publicBool && ADABool:
        allTheBathrooms = publicBathrooms.filter(
          (b) => b.ada_compliant === true
        );
        break;
      case publicBool && GNBool:
        allTheBathrooms = publicBathrooms.filter(
          (b) => b.gender_neutral === true
        );
        break;
      case ADABool && GNBool:
        allTheBathrooms = ADABathrooms.filter((b) => b.gender_neutral === true);
        break;
      case publicBool:
        allTheBathrooms = publicBathrooms;
        break;
      case ADABool:
        allTheBathrooms = ADABathrooms;
        break;
      case GNBool:
        allTheBathrooms = GNBathrooms;
        break;
      default:
        break;
    }

    return allTheBathrooms.map((bathroom) => {
      let position = {
        lat: bathroom.latitude,
        lng: bathroom.longitude,
      };

      return (
        <Marker
          key={bathroom.id}
          position={position}
          bathroom={bathroom}
          bathrooms={bathrooms}
        />
      );
    });
  }

  function renderMap() {
    return (
      <Wrapper classname="Wrapper" apiKey={GMKey}>
        <NearMeMap seattle={seattle} zoom={11} userGeocode={userGeocode}>
          {allBathrooms()}
        </NearMeMap>
      </Wrapper>
    );
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();
    if (userLocation !== '') {
      const googleResp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation},seattle&key=${GMKey}`
      );
      const newGeocode = await googleResp.json();
      setUserGeocode(newGeocode.results[0].geometry.location);
    }
  }

  function handleFilterClick(button) {
    const publicButton = document.getElementById("public-button");
    const ADAButton = document.getElementById("ADA-button");
    const GNButton = document.getElementById("GN-button");

    switch (button) {
      case "public":
        setPublicBool(!publicBool);
        if (publicButton.classList.contains("button-active")) {
          publicButton.classList.remove("button-active");
        } else {
          publicButton.classList.add("button-active");
        }
        break;
      case "ADA":
        setADABool(!ADABool);
        if (ADAButton.classList.contains("button-active")) {
          ADAButton.classList.remove("button-active");
        } else {
          ADAButton.classList.add("button-active");
        }
        break;
      case "GN":
        setGNBool(!GNBool);
        if (GNButton.classList.contains("button-active")) {
          GNButton.classList.remove("button-active");
        } else {
          GNButton.classList.add("button-active");
        }
        break;
      default:
        break;
    }
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main id="near-me">
        <section id="where-are-you">
          <h3>Where are you?</h3>
          <div id='near-me-top-flex'>
            <form onSubmit={handleAddressSubmit}>
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                type="text"
                placeholder="400 Broad St"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
              ></input>
              <button type="submit">Submit</button>
              <button
                onClick={() => {
                  setUserGeocode(null);
                  setUserLocation(null);
                }}
              >
                Clear
              </button>
            </form>
            <div id="map-filter-buttons" className="filter-buttons">
              <button
                id="public-button"
                onClick={() => handleFilterClick("public")}
              >
                Public restroom
              </button>
              <button id="ADA-button" onClick={() => handleFilterClick("ADA")}>
                ADA compliant
              </button>
              <button id="GN-button" onClick={() => handleFilterClick("GN")}>
                Gender neutral
              </button>
            </div>
          </div>
        </section>
        {renderMap()}
      </main>
    </m.div>
  );
}
