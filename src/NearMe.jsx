import { motion as m } from "framer-motion";
import AllBathroomsMap from "./components/NearMeMap";
import Marker from "./components/Marker";
import { useLoaderData } from "react-router-dom";

// this page will be a big map from Google Maps JavaScript API
// lex and I figured a lot of this out here:
// https://github.com/alexbriannaughton/bbb-app/blob/main/client/src/components/MapViewHomepage.js

export default function NearMe() {

  const loaderData = useLoaderData()
  const bathrooms = loaderData[0]
  const GMKey = loaderData[1]


  const seattle = { lat: 47.6062, lng: -122.3321 };

  const allBathrooms = bathrooms.map((bathroom) => {
    let position = {
      lat: bathroom.latitude,
      lng: bathroom.longitude,
    };

    // return Marker component from @googlemaps/react-wrapper
    // <Marker key={bathroom.id} position={position} bathroom={bathroom} bathrooms={bathrooms}/>
  });

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main>
        {/* // this won't work until we get a Google Maps key */}
        {/* <Wrapper classname="Wrapper" apiKey={GMKey}>
          <AllBathroomsMap center={seattle} zoom={11}>
            {allBathrooms}
          </AllBathroomsMap>
        </Wrapper> */}
      </main>
    </m.div>
  );
}
