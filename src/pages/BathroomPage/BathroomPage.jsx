import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import "./BathroomPage.css";
import NewReview from "./NewReview";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import BathroomPageReview from "./BathroomPageReview";
import {
  fetchOneBathroom,
  fetchOneBathroomFavorites,
  fetchOneBathroomReviews,
  fetchUsers,
} from "../../React-Query/fetch-functions";
import { globalStore } from "../../global/Zustand";
import { supabase } from "../../global/constants";
import NoBathroomFound from "./NoBathroomFound";
import ReviewSubmitted from "./ReviewSubmitted";
import { queryClient } from "../../main";

export default function BathroomPage() {
  const id = useParams();
  const profile = globalStore((state) => state.profile);
  const [showReview, setShowReview] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [userBathroomFavorite, setUserBathroomFavorite] = useState(null);
  const [thisFavorites, setThisFavorites] = useState(0);

  // RQ queries
  const {
    status: oBStatus,
    // error: oBError,
    data: bathroom,
  } = useQuery({
    queryKey: ["bathrooms", parseInt(id.bathroomid)],
    queryFn: async () => fetchOneBathroom(id),
  });

  const {
    // status: oBReviewStatus,
    // error: oBReviewError,
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
    // status: oBFavoritesStatus,
    // error: oBFavoritesError,
    data: oBFavorites,
  } = useQuery({
    queryKey: ["favorites", { favorite: parseInt(id.bathroomid) }],
    queryFn: async () => fetchOneBathroomFavorites(id),
  });

  // useEffects
  useEffect(() => {
    if (users && bathroomReviews && oBFavorites) setLoaded(true);
  }, [users, bathroomReviews, oBFavorites]);

  useEffect(() => {
    if (bathroom)
      setLocation({
        lat: bathroom.latitude,
        lng: bathroom.longitude,
      });
  }, [bathroom]);

  useEffect(() => {
    if (oBFavorites) {
      setThisFavorites(oBFavorites.length);
    }
  }, [oBFavorites]);

  useEffect(() => {
    if (profile && oBFavorites) {
      let thisFav = oBFavorites.filter(
        (favs) => favs.user_id === profile.id
      )[0];
      if (thisFav !== undefined) setUserBathroomFavorite(thisFav);
    }
  }, [profile, oBFavorites]);

  // RQ mutations
  const favoriteMutation = useMutation({
    mutationFn: () => {
      return supabase
        .from("favorites")
        .insert({
          bathroom_id: bathroom.id,
          user_id: profile.id,
        })
        .select();
    },
    onSuccess: (data) => {
      setUserBathroomFavorite(data);
      updateBathroomNumberOfFavoritesRPC(parseInt(id.bathroomid));
      queryClient.invalidateQueries({
        queryKey: ["favorites", { favorite: parseInt(id.bathroomid) }],
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () => {
      return supabase
        .from("favorites")
        .delete()
        .eq("id", userBathroomFavorite.id);
    },
    onSuccess: () => {
      setUserBathroomFavorite(null);
      updateBathroomNumberOfFavoritesRPC(parseInt(id.bathroomid));
      queryClient.invalidateQueries({
        queryKey: ["favorites", { favorite: parseInt(id.bathroomid) }],
      });
    },
  });

  async function updateBathroomNumberOfFavoritesRPC(bathroom_id) {
    const bathroomid = bathroom_id;
    const { error } = await supabase.rpc(
      "update_bathroom_number_of_favorites",
      { bathroomid }
    );
    if (error) console.error(error)
  }

  function addFavorite() {
    favoriteMutation.mutate({});
    setThisFavorites(thisFavorites + 1);
  }

  function removeFavorite() {
    removeFavoriteMutation.mutate({});
    setThisFavorites(thisFavorites - 1);
  }

  function singleBathroom(bathroom) {
    const bathroomPublic = bathroom.public == true ? "public restroom" : "";
    const ADACompliant =
      bathroom.ada_compliant == true ? "ADA compliant facilities" : "";
    const genderNeutral =
      bathroom.gender_neutral == true ? "gender neutral facilities" : "";
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
          <h3>
            Average review score: {bathroom.average_score} ({numberOfReviews}{" "}
            reviews)
          </h3>
          <p id="one-bathroom-description">{bathroom.description}</p>
          <p>Number of favorites: {thisFavorites}</p>

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

  function singleBathroomReviews() {
    if (bathroomReviews.length < 1)
      return (
        <>
          <h2 id="reviews-title">No Reviews</h2>
        </>
      );
    else
      return (
        <>
          <h2 id="reviews-title">Reviews</h2>
          <div id="one-bathroom-reviews">
            {bathroomReviews.map((r) => (
              <BathroomPageReview review={r} users={users} key={r.id} />
            ))}
          </div>
        </>
      );
  }

  function renderMap() {
    if (location) {
      const mapID = `${bathroom.location_name}_MAP_ID`
      return (
        <Map defaultCenter={location} defaultZoom={14} 
        mapId={mapID} reuseMaps={true}
        >
          <AdvancedMarker key={bathroom.location_name} position={location}>
            <Pin/>
          </AdvancedMarker>
        </Map>
      );
    }
  }

  if (oBStatus === "loading") return <p id="loading">loading...</p>;

  if (bathroom === "undefined")
    return <NoBathroomFound bathroomID={id.bathroomid} />;

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
      {showReview === true ? (
        <NewReview
          bathroom={bathroom}
          setShowReview={setShowReview}
          bathroomReviews={bathroomReviews}
          setShowSubmitted={setShowSubmitted}
        />
      ) : (
        ""
      )}
      {showSubmitted === true ? (
        <ReviewSubmitted
          locationName={bathroom.location_name}
          setShowSubmitted={setShowSubmitted}
        />
      ) : (
        ""
      )}
    </main>
  );
}
