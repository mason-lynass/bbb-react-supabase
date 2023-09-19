// hey we are not using this version of App now because we are using ReactQueryApp.jsx

import { createContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion as m } from "framer-motion";

import Home
// { homepageLoader } 
from "./home.jsx";
import About from "./About.jsx";
import Best
// { bestBathroomsLoader } 
from "./Best.jsx";
import NearMe
// { nearMeLoader } 
from "./NearMe.jsx";
import Submit
// { submitLoader } 
from "./Submit.jsx";
import Account
//  { accountLoader } 
 from "./Account.jsx";
import Login
// { loginLoader }
from "./Login.jsx";
import AllBathrooms
//  { allBathroomsLoader } 
 from "./AllBathrooms.jsx";
import BathroomPage
// { oneBathroomLoader } 
from "./components/BathroomPage.jsx";
import Layout from "./Layout.jsx";

import { globalStore } from "./Zustand.jsx";
import {
  fetchBathrooms,
  fetchOneBathroom,
  fetchReviews,
  fetchUsers,
} from "./fetch-functions.jsx";

import "./CSS/App.css";

// keys to Supabase
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(url, key);

// key to Google Maps JavaScript API
export const GMKey = "";

// i think i want to start using this but I don't really know how to use it yet
// const UserContext = createContext();

// // get functions (or maybe set functions)
// // get data from Supabase and store it in state
// // most of the time we will use these
export const getUsers = (session) => {
  globalStore.setState({ users: fetchUsers() });
  // getProfile()
  // setTimeout(() => getProfile(), 1000)
};

export const getBathrooms = () => {
  globalStore.setState({ bathrooms: fetchBathrooms() });
  // console.log(await fetchBathrooms(), "bathrooms data");
};

export const getReviews = () => {
  globalStore.setState({ reviews: fetchReviews() });
  // console.log(await fetchReviews(), "reviews data");
};

// this version uses createBrowserRouter
function NewApp() {
  const session = globalStore((state) => state.bathrooms);
  const users = globalStore((state) => state.users);
  const bathrooms = globalStore((state) => state.bathrooms);
  const reviews = globalStore((state) => state.reviews);
  const profile = globalStore((state) => state.profile);

  const [sessionSwitch, setSessionSwitch] = useState(false);
  // const [loading, setLoading] = useState(true);

  const { getTheUsers, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select(); // get the data from Supabase
      globalStore.setState({ users: data });
      return data;
    },
  });

  // initial loading of data from database
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      globalStore.setState({ session: session });
      setSessionSwitch(true); // this is mostly for console logs, I guess
      
      if (session && users.length) {
        globalStore.setState({
          profile: users.find((user) => session.user.id === user.id)[0],
        }); // this function needs session to setProfile
        // setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      globalStore.setState({ session: session });
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
          // loader: homepageLoader,
        },
        {
          Component: AllBathrooms,
          path: "/bathrooms",
          // loader: allBathroomsLoader,
          children: [
            {
              element: <BathroomPage />,
              path: ":bathroomid",
              // loader: oneBathroomLoader,
            }
          ]
        },
        ,
        {
          Component: About,
          path: "/about",
        },
        {
          Component: Best,
          path: "/best",
          // loader: bestBathroomsLoader,
        },
        {
          element: <Submit />,
          path: "/submit",
          // loader: submitLoader,
        },
        {
          Component: NearMe,
          path: "/near-me",
          // loader: nearMeLoader,
        },
        {
          element: <Login />,
          path: "/login",
          // loader: loginLoader,
        },
        {
          element: <Account />,
          path: "/account",
          // loader: accountLoader,
        },
      ],
    },
  ]);

  // loader functions, which are called when a user navigates to a route
  // these functions fetch, access, or modify data BEFORE rendering components
  // this way we can avoid rendering a component before datat has been fetched or appropriately modified
  // you can pass data to components through these functions by returning the data
  // instead of passing them down as a props

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
