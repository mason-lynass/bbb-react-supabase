import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Routes, Route, Link } from "react-router-dom";
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
import NavBar from "./components/NavBar.jsx";

import "./CSS/App.css";

import { useQuery } from "@tanstack/react-query";
import { globalStore } from "./Zustand.jsx";

// keys to Supabase
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);

// export const GMKey = "";
export const GMKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// this version uses BrowserRouter instead of createBrowserRouter
// we're gonna use this version of the main App component
function RQApp() {
  // const session = globalStore((state) => state.bathrooms);
  // const users = globalStore((state) => state.users);
  const profile = globalStore((state) => state.profile);

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select(); // get the data from Supabase
      globalStore.setState({ users: data });
      return data;
    },
  });

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        globalStore.setState({ session: data.session });
        setSessionSwitch(true);
      }
      return data.session;
    },
  });

  const [sessionSwitch, setSessionSwitch] = useState(false);

  // initial loading of data from database
  useEffect(() => {
    if (session && users) {
      globalStore.setState({
        profile: users.find((user) => session.user.id === user.id),
      }); // this function needs session to setProfile
      // setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      globalStore.setState({ session: session });
    });

    return () => subscription.unsubscribe(); // cleanup function
  }, [users, session]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar session={session} sessionSwitch={sessionSwitch} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bathrooms" element={<AllBathrooms />} />
        <Route path="/bathrooms/:bathroomid" element={<BathroomPage />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/best"
          // gQL request for bathrooms.average_score >= 8
          // loader={}
          element={<Best />}
        />
        <Route path="/submit" element={<Submit />} />
        <Route path="/near-me" element={<NearMe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      {/* <Footer /> */}
    </m.div>
  );
}

export default RQApp;
