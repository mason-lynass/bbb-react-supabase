import { useState, useEffect } from "react";
import { Link, redirect, useNavigate, Navigate } from "react-router-dom";
import { motion as m } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import "./Account.css";
import { globalStore } from "../../global/Zustand";
import { supabase } from "../../ReactQueryApp";
import {
  fetchAllBathrooms,
  fetchFavorites,
  fetchReviews,
} from "../../React-Query/fetch-functions";
import ResetPw from "../Login/ResetPw";

export default function Account({ setProfile }) {
  const [username, setUsername] = useState("");
  const [profileBathrooms, setProfileBathrooms] = useState([]);
  const [profileReviews, setProfileReviews] = useState([]);
  const [profileFavorites, setProfileFavorites] = useState([]);
  const [open, setOpen] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState(null);

  const session = globalStore((state) => state.session);
  const profile = globalStore((state) => state.profile);
  const navigate = useNavigate();

  const {
    status: bathroomStatus,
    error: bathroomError,
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
    queryFn: fetchFavorites,
  });

  async function handleUsernameSubmit(e) {
    e.preventDefault();
    // this updates the username in the users table where the id === logged in user id
    try {
      const { error, data: newName } = await supabase
        .from("users")
        .update({ username: username })
        .eq("email", profile.email)
        .select();

      //
      if (error) throw ["Sorry, that username is not available."];
      // DB doesn't re-fetch (I think?), or there's a lag at least, so we update state)
      if (newName) {
        globalStore.setState({
          profile: {
            id: profile.id,
            email: profile.email,
            username: username,
          },
        });
      }
    } catch (error) {
      setErrors(error);
    }
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

  function resetPassword() {
    setShowResetPassword(!showResetPassword);
  }

  function myBathrooms() {
    if (open === "bathrooms") {
      return profileBathrooms.map((bathroom) => {
        let linkto = `/bathrooms/${bathroom.id}`;
        return (
          <Link to={linkto} key={bathroom.id}>
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
      });
    }
  }

  function myFavorites() {
    if (open === "favorites") {
      return profileFavorites.map((fav) => {
        let thisBathroom = bathrooms.filter(
          (bathroom) => bathroom.id === fav.bathroom_id
        )[0];
        let linkto = `/bathrooms/${thisBathroom.id}`;
        return (
          <Link to={linkto} key={thisBathroom.id}>
            <div className="one-favorite" key={fav.bathroom_id}>
              <p>{thisBathroom.location_name}</p>
              <p>{thisBathroom.neighborhood}</p>
            </div>
          </Link>
        );
      });
    }
  }

  function displayErrors() {
    return (
      <p key={errors} className="display-error">
        {errors}
      </p>
    );
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
            {displayErrors()}
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
              <h3
                onClick={(e) =>
                  open === "favorites" ? setOpen(null) : setOpen("favorites")
                }
              >
                Here are your favorite bathrooms:
              </h3>
              <div id="my-favorites">{myFavorites()}</div>
            </section>
            <div id="action-buttons">
              <div id="sign-out">
                <button onClick={signOut}>Sign Out</button>
              </div>
              <div id="reset-password">
                <button onClick={resetPassword}>
                  {showResetPassword === true ? "Nevermind" : "Reset Password"}
                </button>
              </div>
            </div>
            <div>{showResetPassword === true ? <ResetPw /> : ""}</div>
          </m.div>
        </main>
      );
  }

  // if you don't have a profile, you're not supposed to end up here on the Account page,
  // you're only supposed to get to the account page if you have a profile
  else return <Navigate to="/login" replace={true} />;
}
