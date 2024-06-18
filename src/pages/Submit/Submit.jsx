import { motion as m } from "framer-motion";
import BathroomForm from "./BathroomForm";
import { globalStore } from "../../global/Zustand";
import { fetchAllBathrooms } from "../../React-Query/fetch-functions";
import { useQuery } from "@tanstack/react-query";
import Login from "../Login/Login";
import "./Submit.css";

export default function Submit({ setBathrooms }) {
  const { data: bathrooms} = useQuery({
    queryKey: ['all-bathrooms'],
    queryFn: fetchAllBathrooms
})
  const profile = globalStore((state) => state.profile);

  // check to see if there's a logged in user, if not, make them log in
  if (!profile) {
    return (
      <m.div
        id="please-login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ textAlign: "center" }}>
          Please log in to submit a bathroom.
        </h2>
        <Login />
      </m.div>
    );
  } else
    return (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <main id="submit">
          <BathroomForm
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            profile={profile}
          />
        </main>
      </m.div>
    );
}
