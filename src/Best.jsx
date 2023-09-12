import { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import { useLoaderData, Link } from "react-router-dom";

import "./CSS/Best.css";
import BestBathroom from "./components/BestBathroom";
import { globalStore } from "./Zustand";
import { getBathrooms } from "./NewApp";
import { fetchBathrooms } from "./fetch-functions";
import { useQuery } from "@tanstack/react-query";

// export async function bestBathroomsLoader() {
//   const bathrooms = globalStore((state) => state.bathrooms)
//   if (bathrooms.length <= 1) getBathrooms();
//   return null;
// }

export default function Best({ }) {

  const { status, error, data: bathrooms} = useQuery({
    queryKey: ['bathrooms'],
    queryFn: fetchBathrooms
})

  const [loaded, setLoaded] = useState(false);
  const [best, setBest] = useState([]);

  // const bathrooms = useLoaderData();

  console.log(bathrooms);

  // the length in the dependency array should only change from null -> all of the bathrooms
  useEffect(() => {
    // setBest(bathrooms)
    if (bathrooms) {
      // change this to filter best bathrooms and not public ones
      setBest(
        [...bathrooms]
          .filter((bathroom) => bathroom.average_score >= 8)
          .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))

      );
      setLoaded(true);
    }
  }, [bathrooms]);

  function bestBathrooms() {
    return (
      <div id="best-bathrooms">
        {best.map((bathroom) => {
          return (
            <Link to={`/bathrooms/${bathroom.id}`} key={bathroom.location_name}>
              <BestBathroom bathroom={bathroom} key={bathroom.location_name} />
            </Link>
          );
        })}
      </div>
    );
  }

  if (status === 'loading') return <p>loading...</p>

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loaded === true ? bestBathrooms() : <h2>loading...</h2>}
    </m.div>
  );
}
