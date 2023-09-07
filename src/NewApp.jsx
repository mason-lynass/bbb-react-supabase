import { createContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Routes,
  Route,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { motion as m } from "framer-motion";

import Home from "./home.jsx";
import About from "./About.jsx";
import Best from "./Best.jsx";
import NearMe from "./NearMe.jsx";
import Submit from "./Submit.jsx";
import Account from "./Account.jsx";
import Login from "./Login.jsx";
import AllBathrooms from "./AllBathrooms.jsx";
import BathroomPage from "./components/BathroomPage.jsx";
import Layout from "./Layout.jsx";

import "./CSS/app.css";

// keys to Supabase
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

// key to Google Maps JavaScript API
const GMKey = "";

// i think i want to start using this but I don't really know how to use it yet
const UserContext = createContext();

// this version uses createBrowserRouter
function NewApp() {
  const [session, setSession] = useState(null);
  const [sessionSwitch, setSessionSwitch] = useState(false);
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [bathrooms, setBathrooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  // const [loading, setLoading] = useState(true);

  // initial loading of data from database
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionSwitch(true); // this is mostly for console logs, I guess
      getUsers(session); // this function needs session to setProfile
      // setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe(); // cleanup function
  }, []);

  // this is where we define all of the routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout session={session} sessionSwitch={sessionSwitch} />,
      children: [
        {
          Component: Home,
          index: true,
          loader: homepageLoader,
        },
        {
          Component: AllBathrooms,
          path: "/bathrooms",
          loader: allBathroomsLoader,
        },
        {
          element: (
            <BathroomPage setBathrooms={setBathrooms} setReviews={setReviews} />
          ),
          path: "/bathrooms/:bathroomid",
          loader: oneBathroomLoader,
        },
        {
          Component: About,
          path: "/about",
        },
        {
          Component: Best,
          path: "/best",
          loader: bestBathroomsLoader,
        },
        {
          element: <Submit setBathrooms={setBathrooms} />,
          path: "/submit",
          loader: submitLoader,
        },
        {
          Component: NearMe,
          path: "/near-me",
          loader: nearMeLoader,
        },
        {
          element: <Login setProfile={setProfile} />,
          path: "/login",
          loader: loginLoader,
        },
        {
          element: <Account setProfile={setProfile} />,
          path: "/account",
          loader: accountLoader,
        },
      ],
    },
  ]);

  console.log(profile)

  // fetch functions, getting data from Supabase
  // sometimes we will need to get individual rows instead of all of the rows
  // like fetchOneBathroom for the case where a user lands on /bathrooms/:bathroom_id without first going to any other page where we get all of the bathrooms
  async function fetchUsers() {
    const { data, error } = await supabase.from("users").select(); // get the data from Supabase
    if (session)
      setProfile(data.filter((user) => session.user.id === user.id)[0]); // setProfile by filtering the data
    return data;
  }

  async function fetchBathrooms() {
    const { data, error } = await supabase.from("bathrooms").select();
    return data;
  }

  async function fetchOneBathroom(params) {
    const { data, error } = await supabase
      .from("bathrooms")
      .select()
      .eq("id", params.bathroomid);
    return data;
  }

  async function fetchReviews() {
    const { data, error } = await supabase.from("reviews").select();
    return data;
  }

  // get functions (or maybe set functions)
  // get data from Supabase and store it in state
  // most of the time we will use these
  async function getUsers(session) {
    setUsers(await fetchUsers());
    // getProfile()
    // setTimeout(() => getProfile(), 1000)
  }

  async function getBathrooms() {
    setBathrooms(await fetchBathrooms());
    // console.log(await fetchBathrooms(), "bathrooms data");
  }

  async function getReviews() {
    setReviews(await fetchReviews());
    // console.log(await fetchReviews(), "reviews data");
  }


  // loader functions, which are called when a user navigates to a route
  // these functions fetch, access, or modify data BEFORE rendering components
  // this way we can avoid rendering a component before datat has been fetched or appropriately modified
  // you can pass data to components through these functions by returning the data
  // instead of passing them down as a props

  // if a user lands on /bathrooms, or /bathroom/:bathroomid, they might have some or all of the bathrooms in state,
  // but all of the reviews, because we didn't fetch them from the DB in the allBathroomsLoader
  async function homepageLoader() {
    // console.log(users, bathrooms, reviews);
    if (reviews.length < 1 && bathrooms.length <= 1) {
      getBathrooms();
      getReviews();
    } else if (bathrooms.length < 1 && reviews.length >= 1) getBathrooms();
    else if (bathrooms.length >= 1 && reviews.length < 1) getReviews();
    return [bathrooms, reviews];
  }

  async function allBathroomsLoader() {
    // console.log(users, bathrooms, reviews);
    if (bathrooms.length <= 1) getBathrooms();
    return bathrooms;
  }

  async function oneBathroomLoader({ params }) {
    // if there are no bathrooms, or one bathroom, then we need to get ONE bathroom from the database
    // because we could either not have any bathroom, or possibly have a different single bathroom stored in state
    if (bathrooms.length <= 1) {
      return [params, await fetchOneBathroom(params)];
    } else {
      // if there is more than one bathroom, then we should have ALL of the bathrooms
      // so we just need to filter all of the bathrooms
      let bathroom = bathrooms.filter(
        (b) => b.id == parseInt(params.bathroomid)
      );
      return [params, bathroom];
    }
  }

  async function bestBathroomsLoader() {
    if (bathrooms.length <= 1) getBathrooms();
    return bathrooms;
  }

  async function nearMeLoader() {
    if (bathrooms.length <= 1) getBathrooms();
    return [bathrooms, GMKey];
  }

  async function submitLoader() {
    if (bathrooms.length <= 1) getBathrooms();
    return [bathrooms, profile, GMKey, supabase];
  }

  async function loginLoader() {
    // console.log(session, profile, users);
    if (users.length < 1) getUsers();
    return [session, profile, supabase, users];
  }

  async function accountLoader() {
    // console.log(session, profile);
    return [session, profile, supabase, bathrooms, reviews];
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <RouterProvider router={router} />
    </m.div>
  );
}

export default NewApp;
