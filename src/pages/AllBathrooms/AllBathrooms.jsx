import { useMemo, useState } from "react";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { globalStore } from "../../global/Zustand";
import { fetchApprovedBathrooms } from "../../React-Query/fetch-functions";
import { neighborhoods } from "../../global/constants";
import "./AllBathrooms.css";

export default function AllBathrooms() {
  const {
    status,
    error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  // this is for the search filter
  const [query, setQuery] = useState("");
  const [publicBool, setPublicBool] = useState(false);
  const [ADABool, setADABool] = useState(false);
  const [GNBool, setGNBool] = useState(false);
  const [neighborhood, setNeighborhood] = useState("none");

  const filteredBathrooms = useMemo(() => {
    if (bathrooms)
      return bathrooms.filter((b) =>
        b.location_name.toLowerCase().includes(query.toLowerCase())
      );
  }, [bathrooms, query]);

  function handleFilterClick(button, e) {
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
        console.log("nothing");
        break;
    }
  }

  function allTheBathrooms() {
    if (status === "loading") return <p>loading....</p>;

    let allTheBathrooms = filteredBathrooms;

    const publicBathrooms = filteredBathrooms.filter((b) => b.public === true);
    const ADABathrooms = filteredBathrooms.filter(
      (b) => b.ada_compliant === true
    );
    const GNBathrooms = filteredBathrooms.filter(
      (b) => b.gender_neutral === true
    );

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

    if (neighborhood !== "none") {
      // console.log(neighborhood)
      allTheBathrooms = allTheBathrooms.filter(
        (b) => b.neighborhood === neighborhood
      );
      // console.log(allTheBathrooms)
    }

    return (
      <div id="all-bathrooms">
        {allTheBathrooms.map((bathroom) => (
          <Link to={`/bathrooms/${bathroom.id}`} key={bathroom.location_name}>
            <div className="one-bathroom-all" id={bathroom.location_name}>
              <h3>{bathroom.location_name}</h3>
              <h4>{bathroom.address}</h4>
              <p>
                {bathroom.description.slice(0, 80)}
                {bathroom.description.length > 80 ? "..." : ""}
              </p>
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
      id="all-bathrooms-flex"
    >
      <div id="all-filters">
        <div id="all-bathrooms-search">
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search by bathroom name"
          ></input>
        </div>
        <div id="filters-and-neighborhood">
          <div id="neighborhood">
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              id="neighborhood-dropdown"
            >
              <option value="none" key="null">
                - Neighborhood -
              </option>
              {neighborhoods.map((n) => {
                return (
                  <option value={n} key={n}>
                    {n}
                  </option>
                );
              })}
            </select>
          </div>
          <div id="filter-buttons">
            <button
              id="public-button"
              onClick={(e) => handleFilterClick("public", e)}
            >
              Public restroom
            </button>
            <button id="ADA-button" onClick={(e) => handleFilterClick("ADA")}>
              ADA compliant
            </button>
            <button id="GN-button" onClick={(e) => handleFilterClick("GN")}>
              Gender neutral
            </button>
          </div>
        </div>
      </div>
      {bathrooms !== undefined ? allTheBathrooms() : <h2>loading...</h2>}
    </m.div>
  );
}
