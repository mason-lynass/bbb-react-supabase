import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewReview from "./NewReview";
import BathroomPageMap from "./BathroomPageMap";
import {
  fetchOneBathroom,
  fetchOneBathroomFavorites,
  fetchOneBathroomReviews,
  fetchOneBathroomReviewsUsers,
  fetchUsers,
} from "../fetch-functions";
import { useQuery, useMutation } from "@tanstack/react-query";
import { globalStore } from "../Zustand";
import { Wrapper } from "@googlemaps/react-wrapper";
import { GMKey } from "../ReactQueryApp";
import { supabase } from "../ReactQueryApp";
import Marker from "./Marker";

export default function BathroomPage({ params }) {
  const id = useParams();
  const [showReview, setShowReview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [userBathroomFavorite, setUserBathroomFavorite] = useState(null);

  const profile = globalStore((state) => state.profile);

  // console.log(id)

  const {
    status: oBStatus,
    error: oBError,
    data: bathroom,
  } = useQuery({
    queryKey: ["bathrooms", parseInt(id.bathroomid)],
    queryFn: async () => fetchOneBathroom(id),
  });

  const {
    status: oBReviewStatus,
    error: oBReviewError,
    data: bathroomReviews,
  } = useQuery({
    queryKey: ["reviews", { bathroom: parseInt(id.bathroomid) }],
    queryFn: async () => fetchOneBathroomReviews(id),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => fetchUsers(),
  });

  const {
    status: oBFavoritesStatus,
    error: oBFavoritesError,
    data: oBFavorites,
  } = useQuery({
    queryKey: ["favorites", { favorite: parseInt(id.bathroomid) }],
    queryFn: async () => fetchOneBathroomFavorites(id),
  });

  const favoriteMutation = useMutation({
    mutationFn: () => {
      // console.log(bathroomSupabase)
      return supabase
        .from("favorites")
        .insert({
          bathroom_id: bathroom.id,
          user_id: profile.id,
        })
        .select();
    },
    onSuccess: (data) => {
      console.log("first success!");
      setUserBathroomFavorite(data);
      console.log(data);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () => {
      return supabase
        .from("favorites")
        .delete()
        .eq("id", userBathroomFavorite.id);
    },
    onSuccess: (data) => {
      console.log("DELETED");
      setUserBathroomFavorite(null);
      console.log(data);
    },
  });

  useEffect(() => {
    if (users && bathroomReviews) setLoaded(true);
  }, [users, bathroomReviews]);

  useEffect(() => {
    if (bathroom)
      setLocation({
        lat: bathroom.latitude,
        lng: bathroom.longitude,
      });
  }, [bathroom]);

  useEffect(() => {
    if (profile && oBFavorites) {
      let thisFav = oBFavorites.filter(
        (favs) => favs.user_id === profile.id
      )[0];
      if (thisFav !== undefined) setUserBathroomFavorite(thisFav)
    }
  }, [profile, oBFavorites]);

  function singleBathroom(bathroom) {
    const bathroomPublic = bathroom.public == "true" ? "public restroom" : "";
    const ADACompliant =
      bathroom.ada_compliant == "true" ? "ADA compliant facilities" : "";
    const genderNeutral =
      bathroom.gender_neutral == "true" ? "gender neutral facilities" : "";
    let numberOfReviews = 0;
    if (bathroomReviews) numberOfReviews = bathroomReviews.length;

    return (
      <>
        <div id="single-bathroom-container">
          <h1 id="bathroom-name">{bathroom.location_name}</h1>
          <div id="one-bathroom-location">
            <h3>{bathroom.address}</h3>
            <h3>{bathroom.neighborhood}</h3>
          </div>
          <p id="one-bathroom-description">{bathroom.description}</p>
          <div id="one-bathroom-stats">
            <p>
              Average review score: {bathroom.average_score} ({numberOfReviews}{" "}
              reviews)
            </p>
            <p>Number of favorites: {bathroom.number_of_favorites}</p>
          </div>
          <div id="one-bathroom-filters">
            <p>{bathroomPublic}</p>
            <p>{genderNeutral}</p>
            <p>{ADACompliant}</p>
          </div>
        </div>
      </>
    );
  }

  function favoriteButton() {
    if (!userBathroomFavorite)
      return <button onClick={() => addFavorite()}>Add to Favorites</button>;
    else
      return (
        <button onClick={() => removeFavorite()}>Remove from Favorites</button>
      );
  }

  // this should be a request to Supabase to add a row to the favorites table with a user_id and a bathroom_id
  function addFavorite() {
    favoriteMutation.mutate({});
  }

  function removeFavorite() {
    removeFavoriteMutation.mutate({});
  }

  function singleBathroomButtons() {
    if (profile)
      return (
        <div id="one-bathroom-buttons">
          {/* this will open up a modal over the whole window that displays the NewReview component */}
          <button onClick={() => setShowReview(true)}>Write a Review</button>
          {/* this will make a DB request to create a new favorite with the user id and bathroom id */}
          {favoriteButton()}
        </div>
      );
  }

  function oneReview(review) {
    const user = users.find((u) => u.id === review.user_id);
    return (
      <div className="one-bathroom-one-review" key={review.id}>
        <div>
          <p>{user.username}</p>
          <p>{review.average_rating}</p>
        </div>
        <p>{review.description}</p>
        <div>
          <p>cleanliness: {review.cleanliness_rating}</p>
          <p>{review.cleanliness}</p>
        </div>
        <div>
          <p>function: {review.function_rating}</p>
          <p>{review.function}</p>
        </div>
        <div>
          <p>style: {review.style_rating}</p>
          <p>{review.style}</p>
        </div>
      </div>
    );
  }

  function singleBathroomReviews() {
    // console.log(bathroomReviews);
    return (
      <>
        <h2 id="reviews-title">Reviews</h2>
        <div id="one-bathroom-reviews">
          {bathroomReviews.map((r) => oneReview(r))}
        </div>
      </>
    );
  }

  if (oBStatus === "loading") return <p>loading...</p>;

  function renderMap() {
    if (location) {
      return (
        <Wrapper apiKey={GMKey}>
          <BathroomPageMap center={location} zoom={14}>
            <Marker position={location} />
          </BathroomPageMap>
        </Wrapper>
      );
    }
  }

  // maybe NewReview comes up in a modal after a button press?
  return (
    <main>
      <div id="bathroom-top-split">
        <section>
          {singleBathroom(bathroom)}
          {singleBathroomButtons()}
        </section>
        {renderMap()}
      </div>
      {loaded === true ? (
        <section>{singleBathroomReviews(bathroom)}</section>
      ) : (
        ""
      )}
      {showReview === true ? <NewReview bathroom={bathroom} setShowReview={setShowReview}/> : ""}
    </main>
  );
}
