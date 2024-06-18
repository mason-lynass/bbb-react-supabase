import { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import "./Best.css";
import BestBathroom from "./BestBathroom";
import { fetchApprovedBathrooms } from "../../React-Query/fetch-functions";

export default function Best() {
  const [loaded, setLoaded] = useState(false);
  const [best, setBest] = useState([]);

  // we could write a new fetch function and queryKey to fetch only bathrooms with a review >= 8
  // instead of using bestBathrooms, the useEffect, etc.
  // but users are most likely coming to this page after first visiting the homepage,
  // where they will already fetch approvedBathrooms, so might as well just use that instead of making a separate DB request
  const {
    status: bathroomsStatus,
    // error: bathroomsError,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

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

  if (bathroomsStatus === "loading") return <p>loading...</p>;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 id='best-bathrooms-title'>🏆 Best Bathrooms 🏆</h1>
      {loaded === true ? bestBathrooms() : <h2>loading...</h2>}
    </m.div>
  );
}
