import { useState } from "react";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";
import {
  fetchApprovedBathrooms,
  fetchReviews,
} from "../../React-Query/fetch-functions";
import { useQuery } from "@tanstack/react-query";
import "./Home.css";
import { neighborhoods } from "../../global/constants";
import HomeSlideshow from "./HomeSlideshow";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const neighborhood = 'none'

  const {
    status,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  const {
    status: rstatus,
    // error: rerror,
    data: reviews,
  } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: fetchReviews,
  });

  // clicking a filter button takes you to AllBathrooms with bathrooms filtered according to button press
  function handleFilterClick(button) {
    if (button === "public") {
      navigate("/bathrooms", { state: { publicBool: true } });
    }
    if (button === "ADA") {
      navigate("/bathrooms", { state: { ADABool: true } });
    }
    if (button === "GN") {
      navigate("/bathrooms", { state: { GNBool: true } });
    }
  }

  function mostRecentBathroom() {
    const bathroom = bathrooms.sort((a, b) => b.id - a.id)[0];

    const bathroomPublic = bathroom.public == "true" ? "public restroom" : "";
    const ADACompliant =
      bathroom.ada_compliant == "true" ? "ADA compliant facilities" : "";
    const genderNeutral =
      bathroom.gender_neutral == "true" ? "gender neutral facilities" : "";

    return (
      <Link to={`/bathrooms/${bathroom.id}`} key={bathroom.location_name}>
        <div id="single-bathroom-container">
          <h1 id="bathroom-name">{bathroom.location_name}</h1>
          <div id="one-bathroom-location">
            <p>{bathroom.address}</p>
            <p>{bathroom.neighborhood}</p>
          </div>
          <p id="one-bathroom-description">{bathroom.description}</p>
          <div id="one-bathroom-filters">
            <p>{bathroomPublic}</p>
            <p>{genderNeutral}</p>
            <p>{ADACompliant}</p>
          </div>
        </div>
      </Link>
    );
  }

  function mostRecentReview() {
    const bathroomIDs = [...bathrooms].map((b) => b.id);
    const approvedReviews = [...reviews].filter((review) =>
      bathroomIDs.includes(review.bathroom_id)
    );
    const review = approvedReviews.sort((a, b) => b.id - a.id)[0];
    const targetBathroom = [...bathrooms].find(
      (b) => b.id === review.bathroom_id
    );

    return (
      <Link
        to={`/bathrooms/${targetBathroom.id}`}
        key={targetBathroom.location_name}
      >
        <div className="one-bathroom-one-review" key={review.id}>
          <div id="review-top">
            <p>{targetBathroom.location_name}</p>
            <p>{review.average_rating}</p>
          </div>
          <p>{review.description}</p>
          <div id="review-cleanliness">
            <p>cleanliness: {review.cleanliness_rating}</p>
            <p>{review.cleanliness}</p>
          </div>
          <div id="review-function">
            <p>function: {review.function_rating}</p>
            <p>{review.function}</p>
          </div>
          <div id="review-style">
            <p>style: {review.style_rating}</p>
            <p>{review.style}</p>
          </div>
        </div>
      </Link>
    );
  }

  if (status === "loading" || rstatus === "loading")
    return (
      <main id="home-main">
        <m.div
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h5 style={{ textAlign: "center" }}>loading...</h5>
        </m.div>
      </main>
    );
  else
    return (
      <main id="home-main">
        <m.div
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div id="home-top-flex">
            <section id="where-are-you-home">
              <h1>Find a bathroom in Seattle</h1>
              <div id="homepage-filters">
                <div id="homepage-bathrooms-search">
                  <input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Search by bathroom name"
                  ></input>
                  <button
                    onClick={() =>
                      navigate("/bathrooms", { state: { query: query } })
                    }
                  >
                    Go
                  </button>
                </div>
                <div id="homepage-filters-and-neighborhood">
                  <div id="neighborhood">
                    <select
                      aria-label="Neighborhood"
                      value={neighborhood}
                      onChange={(e) =>
                        navigate("/bathrooms", {
                          state: { neighborhood: e.target.value },
                        })
                      }
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
                      onClick={() => handleFilterClick("public")}
                    >
                      Public restroom
                    </button>
                    <button
                      id="ADA-button"
                      onClick={() => handleFilterClick("ADA")}
                    >
                      ADA compliant
                    </button>
                    <button
                      id="GN-button"
                      onClick={() => handleFilterClick("GN")}
                    >
                      Gender neutral
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <HomeSlideshow />
          <div id="homepage-about">
            <h1>
              The Better Bathroom Bureau is a resource and community dedicated
              to help people in Seattle find, submit, and review bathroom
              facilities around the city.
            </h1>
            <h2>Check out our most recently submitted bathroom:</h2>
            <div>{mostRecentBathroom()}</div>
            <h2>and our most recent review:</h2>
            <div>{mostRecentReview()}</div>
          </div>
        </m.div>
      </main>
    );
}
