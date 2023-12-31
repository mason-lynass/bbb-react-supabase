// hey we are not using this version of App, we are using ReactQueryApp.jsx

import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion as m } from "framer-motion";

import Home from "./home.jsx";
import About from "./About.jsx";
import Best from "./Best.jsx";
import NearMe from "./NearMe.jsx";
import Submit from "./Submit.jsx";
import Account from "./Account.jsx";
import Login from "./Login.jsx";
import AllBathrooms from "./AllBathrooms.jsx";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import BathroomPage from "../components/BathroomPage.jsx";

import "./CSS/App.css";

// keys to Supabase
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

const queryClient = new QueryClient()

const GMKey = "";


function OldApp() {
  const [session, setSession] = useState(null);
  const [sessionSwitch, setSessionSwitch] = useState(false);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [bathrooms, setBathrooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // initial loading of data from database
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionSwitch(true); // this is mostly for console logs, I guess
      getUsers(session); // this function needs session to setProfile
    });
    // getBathrooms();
    // getReviews();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe(); // cleanup function
  }, []);

  async function getUsers(session) {
    async function fetchUsers() {
      const { data, error } = await supabase.from("users").select(); // get the data from Supabase
      if (session)
        setProfile(data.filter((user) => session.user.id === user.id)[0]); // setProfile by filtering the data
      return data;
    }

    setUsers(await fetchUsers());
    // getProfile()
    // setTimeout(() => getProfile(), 1000)
  }

  async function getBathrooms() {
    async function fetchBathrooms() {
      const { data, error } = await supabase.from("bathrooms").select();
      return data;
    }
    setBathrooms(await fetchBathrooms());
  }

  async function getReviews() {
    async function fetchReviews() {
      const { data, error } = await supabase.from("reviews").select();
      return data;
    }
    setReviews(await fetchReviews());
  }

  // console.log(session, sessionSwitch)

  // console.log(session, profile)

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar session={session} sessionSwitch={sessionSwitch} />
      <Routes>
        <Route
          path="/"
          element={<Home bathrooms={bathrooms} reviews={reviews} />}
        />
        <Route
          path="/bathrooms"
          element={
            <AllBathrooms
              bathrooms={bathrooms}
              reviews={reviews}
              setBathrooms={setBathrooms}
              setReviews={setReviews}
            />
          }
        />
        {/* gonna need things like userReviews, setUserReviews, userFavorites, setUserFavorites */}
        <Route
          path='/bathrooms/:bathroomid'
          element={
            <BathroomPage
              profile={profile}
              bathrooms={bathrooms}
              reviews={reviews}
              setBathrooms={setBathrooms}
              setReviews={setReviews}
              supabase={supabase}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/best"
          // getBestBathrooms
          // gQL request for bathrooms.average_score >= 8
          // loader={}
          element={
            <Best
              bathrooms={bathrooms}
              reviews={reviews}
              setBathrooms={setBathrooms}
              setReviews={setReviews}
            />
          }
        />
        <Route
          path="/submit"
          element={
            <Submit
              bathrooms={bathrooms}
              setBathrooms={setBathrooms}
              profile={profile}
              GMKey={GMKey}
              supabase={supabase}
            />
          }
        />
        <Route
          path="/near-me"
          element={
            <NearMe
              bathrooms={bathrooms}
              reviews={reviews}
              setBathrooms={setBathrooms}
              setReviews={setReviews}
              GMKey={GMKey}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              supabase={supabase}
              users={users}
              session={session}
              setProfile={setProfile}
              profile={profile}
            />
          }
        />
        <Route
          path="/account"
          element={
            <Account
              session={session}
              profile={profile}
              setProfile={setProfile}
              supabase={supabase}
            />
          }
        />
      </Routes>
      <Footer />
    </m.div>
  );
}

export default OldApp;
