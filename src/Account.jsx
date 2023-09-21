import { useState, useEffect } from "react";
import { Link, redirect, useNavigate, Navigate } from "react-router-dom";
import { motion as m } from "framer-motion";

import "./CSS/Account.css";
import { globalStore } from "./Zustand";
import { supabase } from "./ReactQueryApp";
import {
  fetchAllBathrooms,
  fetchFavorites,
  fetchReviews,
} from "./fetch-functions";
import { useQuery } from "@tanstack/react-query";

export default function Account({ setProfile }) {
  const {
    status,
    error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["all-bathrooms"],
    queryFn: fetchAllBathrooms,
  });

  const {
    status: reviewStatus,
    error: reviewError,
    data: reviews,
  } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: fetchReviews,
  });

  const {
    status: favStatus,
    error: favError,
    data: favorites,
  } = useQuery({
    queryKey: ["all-favorites"],
    queryFn: async () => {
      const { data: favs, error } = await supabase
        .from("favorites")
        .select("*");
      return favs;
    },
  });

  const session = globalStore((state) => state.session);
  const profile = globalStore((state) => state.profile);

  const [username, setUsername] = useState("");
  const [profileBathrooms, setProfileBathrooms] = useState([]);
  const [profileReviews, setProfileReviews] = useState([]);
  const [profileFavorites, setProfileFavorites] = useState([]);
  const [open, setOpen] = useState(null);

  async function handleUsernameSubmit(e) {
    e.preventDefault();
    // this updates the username in the users table where the id === logged in user id
    const { newName, error } = await supabase
      .from("users")
      .update({ username: username })
      .eq("id", profile.id);
    // DB doesn't re-fetch (I think?), or there's a lag at least, so we update state
    setProfile({
      id: profile.id,
      email: profile.email,
      username: await newName,
    });
  }

  useEffect(() => {
    if (profile && bathrooms && reviews && favorites) {
      setProfileBathrooms(
        bathrooms.filter((b) => b.submitted_by === profile.id)
      );
      setProfileReviews(
        reviews.filter((review) => review.user_id === profile.id)
      );
      setProfileFavorites(
        favorites.filter((favorite) => favorite.user_id === profile.id)
      );
    }
  }, [profile, bathrooms, reviews, favorites]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    globalStore.setState({ profile: null });
  }

  function myBathrooms() {
    if (open === "bathrooms") {
      return profileBathrooms.map((bathroom) => {
        let linkto = `/bathrooms/${bathroom.id}`;
        return (
          <Link to={linkto}>
            <div className="one-bathroom" key={bathroom.id}>
              <p>{bathroom.location_name}</p>
              <p>{bathroom.address}</p>
              <p>{bathroom.approved === true ? "" : "NA"}</p>
              <p>{bathroom.number_of_favorites}</p>
            </div>
          </Link>
        );
      });
    }
  }

  function myReviews() {
    if (open === "reviews") {
      return profileReviews.map((review) => {
        let thisBathroom = bathrooms.filter(
          (bathroom) => bathroom.id === review.bathroom_id
        )[0];
        let linkto = `/bathrooms/${thisBathroom.id}`;
        if (thisBathroom.approved === true) {
          return (
            <Link to={linkto} key={review.id}>
              <div className="one-review">
                <p>{thisBathroom.location_name}</p>
                <p>
                  {review.description.slice(0, 80)}
                  {review.description.length > 80 ? "..." : ""}
                </p>
                <p>{review.average_rating}</p>
              </div>
            </Link>
          );
        } else
          return (
            <div className="one-review">
              <p>{thisBathroom.location_name}</p>
              <p>
                {review.description.slice(0, 80)}
                {review.description.length > 80 ? "..." : ""}
              </p>
              <p>{review.average_rating}</p>
            </div>
          );
      });
    }
  }

  function myFavorites() {
    console.log(profileFavorites);
    if (open === "favorites") {
      return profileFavorites.map((fav) => {
        let thisBathroom = bathrooms.filter(
          (bathroom) => bathroom.id === fav.bathroom_id
        )[0];
        let linkto = `/bathrooms/${thisBathroom.id}`;
        return (
          <Link to={linkto}>
            <div className="one-favorite" key={fav.bathroom_id}>
              <p>{thisBathroom.location_name}</p>
              <p>{thisBathroom.neighborhood}</p>
            </div>
          </Link>
        );
      });
    }
  }

  if (profile) {
    // if you have a profile, but you don't have a username, you just haven't made one yet
    if (!profile.username)
      return (
        <main id="account">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Hi there, {profile.email}!</h2>
            <h2 id="no-username">You don't have a username!</h2>
            <form id="choose-username" onSubmit={handleUsernameSubmit}>
              <label htmlFor="username">Claim your username:</label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <input id="username-submit" type="submit" value="Submit"></input>
            </form>
            <div id="sign-out">
              <button onClick={signOut}>Sign Out</button>
            </div>
          </m.div>
        </main>
      );
    else
      return (
        <main id="account">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Hi there, {profile.username}!</h2>
            <section className="account-section" id="account-bathrooms">
              <h3
                onClick={(e) =>
                  open === "bathrooms" ? setOpen(null) : setOpen("bathrooms")
                }
              >
                You've submitted {profileBathrooms.length} bathrooms:
              </h3>
              <div id="my-bathrooms">{myBathrooms()}</div>
            </section>
            <section className="account-section" id="account-reviews">
              <h3
                onClick={(e) =>
                  open === "reviews" ? setOpen(null) : setOpen("reviews")
                }
              >
                You've submitted {profileReviews.length}{" "}
                {profileReviews.length === 1 ? "review" : "reviews"}:
              </h3>
              <div id="my-reviews">{myReviews()}</div>
            </section>
            <section className="account-section" id="account-favorites">
              {/* this will change once we tie users to favorites */}
              <h3
                onClick={(e) =>
                  open === "favorites" ? setOpen(null) : setOpen("favorites")
                }
              >
                Here are your favorite bathrooms:
              </h3>
              <div id="account-favorites">{myFavorites()}</div>
            </section>
            <div id="sign-out">
              <button onClick={signOut}>Sign Out</button>
            </div>
          </m.div>
        </main>
      );
  }

  // if you don't have a profile, you're not supposed to end up here on the Account page,
  // you're only supposed to get to the account page if you have a profile
  else return <Navigate to="/login" replace={true} />;
}
