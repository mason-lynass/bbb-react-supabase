import { motion as m } from "framer-motion";
import { fetchApprovedBathrooms, fetchReviews } from "../../React-Query/fetch-functions";
import { globalStore } from "../../global/Zustand";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
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

  // for this page I was thinking it would be nice to see:

  // "Welcome to the Better Bathroom Bureau"
  // a link to the app on the App Store, something like "on the go? get the app!"
  // a brief description of what BBB is - something like the text on the Mission page
  // one bathroom - maybe the most recently submitted, or the highest rated, or the closest to you?
  // one review - maybe the most recent, or something specific that we choose?
  // mayyyyybe a map with all of the bathrooms on it as pins? might be an expensive feature if we load a map and all the pins every homepage visit

  

  function mostRecentBathroom () {
    const bathroom = bathrooms.sort((a, b) => b.id - a.id)[0]
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
          <h1>you're on the home page babes</h1>
          <div>
            {mostRecentBathroom()}
          </div>
        </m.div>
      </main>
    );
}
