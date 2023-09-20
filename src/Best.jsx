import { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";

import "./CSS/Best.css";
import BestBathroom from "./components/BestBathroom";
import { globalStore } from "./Zustand";
import { fetchApprovedBathrooms } from "./fetch-functions";
import { useQuery } from "@tanstack/react-query";

export default function Best({}) {
  // we could write a new fetch function and queryKey to fetch only bathrooms with a review >= 8
  // instead of using bestBathrooms, the useEffect, etc.
  const {
    status,
    error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  const [loaded, setLoaded] = useState(false);
  const [best, setBest] = useState([]);

  console.log(bathrooms);

  // the dependency in the dependency array should only change from undefined -> all of the bathrooms
  useEffect(() => {
    if (bathrooms) {
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

  if (status === "loading") return <p>loading...</p>;

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
