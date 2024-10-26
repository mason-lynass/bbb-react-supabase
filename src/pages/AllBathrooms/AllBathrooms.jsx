import { useEffect, useMemo, useState } from "react";
import { motion as m } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchApprovedBathrooms,
  fetchReviewIDs,
} from "../../React-Query/fetch-functions";
import { neighborhoods } from "../../global/constants";
import "./AllBathrooms.css";


export default function AllBathrooms() {
  const location = useLocation();

  const {
    status,
    // error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  const {
    // reviewsStatus,
    // reviewsError,
    data: reviewIDs,
  } = useQuery({
    queryKey: ["review-ids"],
    queryFn: fetchReviewIDs,
  });

  let reviewIDsArray;

  // this is for the search filter
  const [query, setQuery] = useState("");
  const [publicBool, setPublicBool] = useState(false);
  const [ADABool, setADABool] = useState(false);
  const [GNBool, setGNBool] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [neighborhood, setNeighborhood] = useState("none");

  // this handles whatever user interaction happened on the homepage that took us to AllBathrooms
  // if user navigates to AllBathrooms and doesn't interact with the homepage, nothing happens
  useEffect(() => {
    if (location.state.GNBool) {
      setGNBool(true);
    } else if (location.state.ADABool) {
      setADABool(true);
    } else if (location.state.publicBool) {
      setPublicBool(true);
    } else if (location.state.neighborhood) {
      setNeighborhood(location.state.neighborhood);
    } else if (location.state.query) {
      setQuery(location.state.query);
    }
  }, [location.state]);

  const filteredBathrooms = useMemo(() => {
    if (bathrooms)
      return bathrooms.filter((b) =>
        b.location_name.toLowerCase().includes(query.toLowerCase())
      );
  }, [bathrooms, query]);

  const reviewedBathrooms = useMemo(() => {
    if (reviewIDs && bathrooms) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      reviewIDsArray = [
        ...new Set(reviewIDs.map((r) => r.bathroom_id).sort((a, b) => a - b)),
      ];
      return filteredBathrooms.filter((b) => reviewIDsArray.includes(b.id));
    }
  }, [reviewIDs, bathrooms]);

  function handleFilterClick(button) {
    const publicButton = document.getElementById("public-button");
    const ADAButton = document.getElementById("ADA-button");
    const GNButton = document.getElementById("GN-button");
    const reviewedButton = document.getElementById("reviewed-button");

    switch (button) {
      case "public":
        if (publicBool) {
          publicButton.classList.remove("button-active");
        } else {
          publicButton.classList.add("button-active");
        }
        setPublicBool(!publicBool);
        break;
      case "ADA":
        if (ADABool) { //Checking true/false against boolean values is redundant and could make it less legible
          ADAButton.classList.remove("button-active");
        } else {
          ADAButton.classList.add("button-active");
        }
        setADABool(!ADABool);
        break;
      case "GN":
        if (GNBool) {
          GNButton.classList.remove("button-active");
        } else {
          GNButton.classList.add("button-active");
        }
        setGNBool(!GNBool);
        break;
      case "reviewed":
        if (reviewed) {
          reviewedButton.classList.remove("button-active");
        } else {
          reviewedButton.classList.add("button-active");
        }
        setReviewed(!reviewed);
        break;
      default:
        break;
    }
  }

  // handles displaying the bathrooms on the page, based on the filter booleans
  function allTheBathrooms() {
    if (status === "loading") return <p>loading....</p>;

    let allTheBathrooms = filteredBathrooms;

    if (neighborhood !== "none") {
      allTheBathrooms = allTheBathrooms.filter(
        (b) => b.neighborhood === neighborhood
      );
    }

    const publicBathrooms = filteredBathrooms.filter((b) => b.public === true);
    const ADABathrooms = filteredBathrooms.filter(
      (b) => b.ada_compliant === true
    );
    const GNBathrooms = filteredBathrooms.filter(
      (b) => b.gender_neutral === true
    );

    switch (true) {
      case publicBool && ADABool && GNBool && reviewed:
        allTheBathrooms = reviewedBathrooms
          .filter((b) => b.ada_compliant === true && b.gender_neutral === true && b.public === true); //reduce how many times it loops through the data
          break;
      case publicBool && ADABool && GNBool:
        allTheBathrooms = publicBathrooms
          .filter((b) => b.ada_compliant === true)
          .filter((b) => b.gender_neutral === true);
        break;
      case reviewed && ADABool && GNBool:
        allTheBathrooms = reviewedBathrooms
          .filter((b) => b.ada_compliant === true)
          .filter((b) => b.gender_neutral === true);
        break;
      case publicBool && reviewed && GNBool:
        allTheBathrooms = reviewedBathrooms
          .filter((b) => b.public === true)
          .filter((b) => b.gender_neutral === true);
        break;
      case publicBool && ADABool && reviewed:
        allTheBathrooms = reviewedBathrooms
          .filter((b) => b.ada_compliant === true)
          .filter((b) => b.public === true);
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
      case publicBool && reviewed:
        allTheBathrooms = reviewedBathrooms.filter((b) => b.public === true);
        break;
      case ADABool && GNBool:
        allTheBathrooms = ADABathrooms.filter((b) => b.gender_neutral === true);
        break;
      case ADABool && reviewed:
        allTheBathrooms = reviewedBathrooms.filter(
          (b) => b.ada_compliant === true
        );
        break;
      case GNBool && reviewed:
        allTheBathrooms = reviewedBathrooms.filter(
          (b) => b.gender_neutral === true
        );
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
      case reviewed:
        allTheBathrooms = reviewedBathrooms;
        break;
      default:
        break;
    }

    return (
      <div id="all-bathrooms">
        {allTheBathrooms.map((bathroom) => (
          <Link to={`/bathrooms/${bathroom.id}`} 
          key={bathroom.location_name}
          //if location_name ever has a space, this will break the key or id! This could be a good spot to use Lodash's kebabCase method and confirm the text consistency
          >
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
        <div id="search-and-neighborhood">
          <div id="all-bathrooms-search">
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search by bathroom name"
            ></input>
          </div>
          <div id="neighborhood">
            <select
              aria-label="Neighborhood"
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
        </div>
        <div id="filters">
          <div id="filter-buttons">
            <button
              id="public-button"
              className={publicBool === true ? "button-active" : ""}
              onClick={() => handleFilterClick("public")}
            >
              Public bathrooms
            </button>
            <button
              id="ADA-button"
              className={ADABool === true ? "button-active" : ""}
              onClick={() => handleFilterClick("ADA")}
            >
              ADA compliant
            </button>
            <button
              id="GN-button"
              className={GNBool === true ? "button-active" : ""}
              onClick={() => handleFilterClick("GN")}
            >
              Gender neutral
            </button>
            <button
              id="reviewed-button"
              className={reviewed === true ? "button-active" : ""}
              onClick={() => handleFilterClick("reviewed")}
            >
              Reviewed bathrooms
            </button>
          </div>
        </div>
      </div>
      {bathrooms !== undefined ? allTheBathrooms() : <h2>loading...</h2>}
    </m.div>
  );
}
