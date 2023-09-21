import { useMemo, useState } from "react";
import "./CSS/AllBathrooms.css";
import { motion as m } from "framer-motion";
import { Link} from "react-router-dom"
import { globalStore } from "./Zustand";
import { fetchApprovedBathrooms } from "./fetch-functions";
import { useQuery } from "@tanstack/react-query";

export default function AllBathrooms() {

  const { status, error, data: bathrooms} = useQuery({
    queryKey: ['approved-bathrooms'],
    queryFn: fetchApprovedBathrooms
})

  // this is for the search filter
  const [query, setQuery] = useState("");

  const filteredBathrooms = useMemo(() => {
    if (bathrooms) return bathrooms.filter((b) =>
      b.location_name.toLowerCase().includes(query.toLowerCase())
    );
  }, [bathrooms, query]);

  function allTheBathrooms() {
    if (status === 'loading') return <p className='loading-component'>loading....</p>
    
    return (
      <div id="all-bathrooms">
        {filteredBathrooms.map((bathroom) => (
          <Link to={`/bathrooms/${bathroom.id}`} key={bathroom.location_name}>
            <div
              className="one-bathroom-all"
              id={bathroom.location_name}
            >
              <h2>{bathroom.location_name}</h2>
              <h3>{bathroom.address}</h3>
              <p>{bathroom.description.slice(0, 80)}{bathroom.description.length > 80 ?  '...' : ''}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div id="all-bathrooms-search">
        <label htmlFor="search">Search:</label>
        <input
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
        ></input>
      </div>
      {bathrooms !== undefined ? allTheBathrooms() : <h2>loading...</h2>}
    </m.div>
  );
}
