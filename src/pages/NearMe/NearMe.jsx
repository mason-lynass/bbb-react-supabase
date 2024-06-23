import { useState } from "react";
import { motion as m } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GMKey, seattle } from "../../global/constants";
import { globalStore } from "../../global/Zustand";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { fetchApprovedBathrooms } from "../../React-Query/fetch-functions";
import "./NearMe.css";

// lex and I figured a lot of this out here:
// https://github.com/alexbriannaughton/bbb-app/blob/main/client/src/components/MapViewHomepage.js

export default function NearMe() {
  const [userLocation, setUserLocation] = useState("");
  const [userLocationError, setUserLocationError] = useState([]);
  const [clickedPin, setClickedPin] = useState("");
  const [mapCenter, setMapCenter] = useState(seattle);
  const [publicBool, setPublicBool] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [ADABool, setADABool] = useState(false);
  const [GNBool, setGNBool] = useState(false);
  const [GeoDialogStatus, setGeoDialogStatus] = useState("open");
  const profile = globalStore((state) => state.profile);
  const userGeolocationPreference = globalStore(
    (state) => state.allowGeolocation
  );
  const tempUserLocation = globalStore((state) => state.tempUserLocation);

  const {
    isLoading: bathroomsLoading,
    // error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  function pinClick() {
    if (clickedPin.id) {
      const linkTo = `bathrooms/${clickedPin.id}`;
      return (
        <div id="clicked-pin-info">
          <h4>
            {clickedPin.location_name} - {clickedPin.address}
          </h4>
          <a href={linkTo}>check out this bathroom page</a>
        </div>
      );
    } else return <div></div>;
  }

  if (bathroomsLoading == true) return <h2 id="loading">loading...</h2>;

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

      if (profile && bathroom.submitted_by === profile.id) {
        return (
          <AdvancedMarker
            key={bathroom.id}
            position={position}
            bathroom={bathroom}
            bathrooms={bathrooms}
            onClick={() => setClickedPin(bathroom)}
          >
            <Pin
              background={"#5facd0"}
              glyphColor={"#FFFFFF"}
              borderColor={"#101e53"}
            />
          </AdvancedMarker>
        );
      } else
        return (
          <AdvancedMarker
            key={bathroom.id}
            position={position}
            bathroom={bathroom}
            bathrooms={bathrooms}
            onClick={() => setClickedPin(bathroom)}
          >
            <Pin
              background={"#101e53"}
              glyphColor={"#FFFFFF"}
              borderColor={"#5facd0"}
            />
          </AdvancedMarker>
        );
    });
  }

  function renderMap() {
    let mapID = `NEAR_ME_MAP_ID`;
    return (
      <Map
        defaultCenter={seattle}
        center={mapCenter}
        defaultZoom={window.screen.availWidth <= 600 ? 11 : 12}
        zoom={zoom}
        mapId={mapID}
        reuseMaps={true}
      >
        {allBathrooms()}
      </Map>
    );
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();
    if (userLocation !== "") {
      const googleResp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation},seattle&key=${GMKey}`
      );
      const newGeocode = await googleResp.json();
      if (newGeocode.error_message && newGeocode.status === "REQUEST_DENIED")
        setUserLocationError([
          "This address cannot be geolocated. Please avoid using symbols, apartment / suite numbers, city names or zip codes",
        ]);
      else {
        setUserLocationError([]);
        setMapCenter(newGeocode.results[0].geometry.location);
        setZoom(15);
      }
    }
  }

  function displayLocationErrors() {
    return userLocationError.map((err) => {
      let errorStyle = {
        color: "red",
        fontSize: "12px",
        width: "70vw",
        maxWidth: "400px",
        margin: "20px auto",
        textAlign: "center",
      };
      return (
        <p style={errorStyle} key={err}>
          {err}
        </p>
      );
    });
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

  function handleGeolocation() {
    function handleAllowAccess() {
      globalStore.setState({ allowGeolocation: true });
      setGeoDialogStatus("thanks");
    }

    function handleDialogClose() {
      navigator.geolocation.getCurrentPosition((position) => {
        const latLng = [position.coords.latitude, position.coords.longitude];
        setMapCenter({ lat: latLng[0], lng: latLng[1] });
        globalStore.setState({
          tempUserLocation: { lat: latLng[0], lng: latLng[1] },
        });
        setZoom(15);
      });
      setGeoDialogStatus("close");
    }

    if (GeoDialogStatus === "open" && tempUserLocation !== null) {
      setMapCenter(tempUserLocation);
      setZoom(15);
      setGeoDialogStatus("close");
    } else if (GeoDialogStatus === "open" && userGeolocationPreference === null)
      return (
        <div>
          <dialog>
            <p>
              Do you want to allow this website to access your current location?
            </p>
            <p>
              With permission, this page can use your device's location to
              display bathrooms closest to you, without the need to manually
              input your address.
            </p>
            <p>
              We'll ask for this permission every time you access the site, and
              you can temporarily update this setting on the Account page.
            </p>
            <button autoFocus onClick={() => handleAllowAccess()}>
              Allow Location Access
            </button>
            <button onClick={() => setGeoDialogStatus("close")}>
              Not right now
            </button>
          </dialog>
        </div>
      );
    else if (GeoDialogStatus === "thanks")
      return (
        <div>
          <dialog>
            <p>Thanks!</p>
            <p>You can temporarily update this setting on the Account page.</p>
            <button onClick={() => handleDialogClose()}>Sounds great</button>
          </dialog>
        </div>
      );
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
          <div id="near-me-top-flex">
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
                  setMapCenter(seattle);
                  setZoom(11);
                  setUserLocation("");
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
          {displayLocationErrors()}
          {pinClick()}
        </section>
        <div id="all-bathrooms-map">{renderMap()}</div>
      </main>
      {handleGeolocation()}
    </m.div>
  );
}
