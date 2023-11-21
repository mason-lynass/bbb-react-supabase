import { useState } from "react";
import { motion as m } from "framer-motion";
import {
  fetchApprovedBathrooms,
  fetchReviews,
} from "../../React-Query/fetch-functions";
import { globalStore } from "../../global/Zustand";
import { useQuery } from "@tanstack/react-query";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "../../ReactQueryApp";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import "./Home.css";
import { neighborhoods } from "../../global/constants";
import HomeSlideshow from "./HomeSlideshow";
import Logo from "../../assets/bbb-logo-1.png";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home({ session }) {
  const {
    status,
    error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["approved-bathrooms"],
    queryFn: fetchApprovedBathrooms,
  });

  const {
    status: rstatus,
    error: rerror,
    data: reviews,
  } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: fetchReviews,
  });

  const [query, setQuery] = useState("");
  const [publicBool, setPublicBool] = useState(false);
  const [ADABool, setADABool] = useState(false);
  const [GNBool, setGNBool] = useState(false);
  const [neighborhood, setNeighborhood] = useState("none");

  const navigate = useNavigate();

  // for this page I was thinking it would be nice to see:

  // "Welcome to the Better Bathroom Bureau"
  // a link to the app on the App Store, something like "on the go? get the app!"
  // a brief description of what BBB is - something like the text on the Mission page
  // one bathroom - maybe the most recently submitted, or the highest rated, or the closest to you?
  // one review - maybe the most recent, or something specific that we choose?
  // mayyyyybe a map with all of the bathrooms on it as pins? might be an expensive feature if we load a map and all the pins every homepage visit

  // homepage should have an Auth or Login / SignUp on it
  // "Find your pipe dreams"




  // okay so this doesn't work yet because
  // i took all of the state variables from AllBathrooms and moved them to home
  // so that I could allow users to search / filter from the home page and end up on /bathrooms
  // with the results already filtered, instead of landing with fresh state variables
  // but sometimes I want fresh state variables? if someone just clicks on the page in the navbar
  // so I need to figure out what to do here

  function handleFilterClick(button, e) {
    const publicButton = document.getElementById("public-button");
    const ADAButton = document.getElementById("ADA-button");
    const GNButton = document.getElementById("GN-button");

    if ((button === "public")) {
      console.log("this one");
      navigate('/bathrooms', { state: {publicBool: true}})
    }
    if ((button === "ADA")) {
      navigate('/bathrooms', { state: {ADABool: true}})
    }
    if ((button === "GN")) {
      navigate('/bathrooms', { state: {GNBool: true}})
    }
  }
  //

  function HomePageAuth() {
    return (
      <div id="home-page-auth">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    );
  }

  function mostRecentBathroom() {
    const bathroom = bathrooms.sort((a, b) => b.id - a.id)[0];
    // console.log(theBathroom)

    const bathroomPublic = bathroom.public == "true" ? "public restroom" : "";
    const ADACompliant =
      bathroom.ada_compliant == "true" ? "ADA compliant facilities" : "";
    const genderNeutral =
      bathroom.gender_neutral == "true" ? "gender neutral facilities" : "";

    return (
      <>
        <div id="single-bathroom-container">
          <h1 id="bathroom-name">{bathroom.location_name}</h1>
          <div id="one-bathroom-location">
            <h3>{bathroom.address}</h3>
            <h3>{bathroom.neighborhood}</h3>
          </div>
          <p id="one-bathroom-description">{bathroom.description}</p>
          <div id="one-bathroom-filters">
            <p>{bathroomPublic}</p>
            <p>{genderNeutral}</p>
            <p>{ADACompliant}</p>
          </div>
        </div>
      </>
    );
  }

  console.log(query);

  if (status === "loading" || rstatus === "loading")
    return (
      <main id="home-main">
        <m.div
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>loading...</h1>
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
            <img src={Logo} id="logo" />
            <section id="where-are-you">
              <h1>Where are you?</h1>
              <div id="homepage-filters">
                <div id="homepage-bathrooms-search">
                  <input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Search by bathroom name"
                  ></input>
                  <button onClick={(e) => navigate('/bathrooms', { state: {query: query}})}>Go</button>
                </div>
                <div id="homepage-filters-and-neighborhood">
                  <div id="neighborhood">
                    <select
                      value={neighborhood}
                      onChange={(e) => navigate('/bathrooms', { state: {neighborhood: e.target.value}})}
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
                    <button
                      id="ADA-button"
                      onClick={(e) => handleFilterClick("ADA")}
                    >
                      ADA compliant
                    </button>
                    <button
                      id="GN-button"
                      onClick={(e) => handleFilterClick("GN")}
                    >
                      Gender neutral
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <HomeSlideshow />
          {/* {session ? '' : HomePageAuth()} */}
          <div>{mostRecentBathroom()}</div>
        </m.div>
      </main>
    );
}
