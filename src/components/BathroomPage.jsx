import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// i'm thinking that a lot of this will be unnecessary once I figure out how the loader function in React Router works
// let me work on this one for a bit

export default function BathroomPage({
  profile,
  reviews,
  bathrooms,
  setReviews,
  setBathrooms,
  supabase,
}) {
  const [bathroomFound, setBathroomFound] = useState(false);
  const [thisBathroom, setThisBathroom] = useState({});

  // this is an object with one key/value pair: { bathroomid: 'number'}
  let params = useParams();

  async function getThisBathroom() {
    console.log("we here");
    const { bathroomFromSupabase } = await supabase
      .from("bathrooms")
      .select()
      .eq("id", params.bathroomid[0]);
    setThisBathroom(await bathroomFromSupabase)
    console.log(bathroomFromSupabase);
  }

  useEffect(() => {
    console.log(params, bathrooms);
    // bathrooms.filter returns an array with one element, we need to access that element
    if (bathrooms.length && params.bathroomid) {
      console.log("this");
      setThisBathroom(
        bathrooms.filter((bathroom) => bathroom.id == params.bathroomid)[0]
      );
      setBathroomFound(true)
    } else {
      console.log("else");
      getThisBathroom();
    }
  }, []);

    // if (thisBathroom.id) setBathroomFound(true);

  function singleBathroom(bathroom) {
    const bathroomPublic = bathroom.public == "true" ? "public" : "private";
    const genderNeutral =
      bathroom.gender_neutral == "true" ? "gender neutral facilities" : "";

    return (
      <div>
        <h2>{bathroom.location_name}</h2>
        <h3>{bathroom.address}</h3>
        <h4>{bathroom.neighborhood}</h4>
        <p>{bathroom.description}</p>
        <p>Average review score: {bathroom.average_score}</p>
        <p>Number of favorites: {bathroom.number_of_favorites}</p>
        <p>{genderNeutral}</p>
        <p>{bathroomPublic}</p>
      </div>
    );
  }

  // console.log(thisBathroom)

  return (
    <main>
      {bathroomFound === true ? (
        singleBathroom(thisBathroom)
      ) : (
        <p>loading...</p>
      )}
    </main>
  );
}
