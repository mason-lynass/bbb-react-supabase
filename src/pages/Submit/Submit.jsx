import { motion as m } from "framer-motion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import BathroomForm from "./BathroomForm";
import "./Submit.css";

import { supabase, GMKey } from "../../ReactQueryApp";
import { globalStore } from "../../global/Zustand";
import { fetchAllBathrooms } from "../../React-Query/fetch-functions";
import { useQuery } from "@tanstack/react-query";

// // this might be how you submit things to the database, add an action to the route and import it in NewApp
// export function submitAction() {
//   console.log("submit");
// }

export default function Submit({ setBathrooms }) {
  const { status, error, data: bathrooms} = useQuery({
    queryKey: ['all-bathrooms'],
    queryFn: fetchAllBathrooms
})
  const profile = globalStore((state) => state.profile);

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
          <h2 id="submit-bathroom-title">Add a new bathroom</h2>
          <BathroomForm
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            profile={profile}
          />
        </main>
      </m.div>
    );
}
