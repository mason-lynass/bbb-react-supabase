import { motion as m } from "framer-motion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import BathroomForm from "./components/BathroomForm";
import "./CSS/Submit.css";

import { supabase, GMKey } from "./ReactQueryApp";
import { globalStore } from "./Zustand";
import { fetchBathrooms } from "./fetch-functions";
import { useQuery } from "@tanstack/react-query";

// // this might be how you submit things to the database, add an action to the route and import it in NewApp
// export function submitAction() {
//   console.log("submit");
// }

export default function Submit({ setBathrooms }) {
  const { status, error, data: bathrooms} = useQuery({
    queryKey: ['bathrooms'],
    queryFn: fetchBathrooms
})
  const profile = globalStore((state) => state.bathrooms);

  // check to see if there's a logged in user, if not, make them log in
  if (!profile) {
    return (
      <m.div
        id="Auth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ textAlign: "center" }}>
          Please log in to submit a bathroom.
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
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
          <h1 id="submit-bathroom-title">Add a new bathroom</h1>
          <BathroomForm
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            profile={profile}
            GMKey={GMKey}
            supabase={supabase}
          />
        </main>
      </m.div>
    );
}
