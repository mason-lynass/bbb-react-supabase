import { motion as m } from "framer-motion";
import { fetchBathrooms, fetchReviews } from "./fetch-functions";
import { globalStore } from "./Zustand";
import { useQuery } from "@tanstack/react-query";

// export const reviewsQuery = useQuery({
//   queryKey: ["reviews"],
//   queryFn: console.log('fuckin a'),
//   queryFn: getReviews
// });

// export const homepageLoader = (queryClient) => {
//     console.log("homepage loader");
// //     globalStore.setBathrooms(data);
// //   globalStore.setReviews(data);

//   const bathrooms = globalStore((state) => state.bathrooms);
//   const reviews = globalStore((state) => state.reviews);
//   //   if (reviews.length < 1 && bathrooms.length <= 1) {
//   //     console.log("first");
//   //     globalStore.setBathrooms();
//   //     getReviews();
//   //   } else if (bathrooms.length < 1 && reviews.length >= 1) {
//   //     getBathrooms();
//   //     console.log("second");
//   //   } else if (bathrooms.length >= 1 && reviews.length < 1) {
//   //     getReviews();
//   //     console.log("third");
//   //   }
//   return [bathrooms, reviews];
// };

export default function Home() {
  //   const bathrooms = globalStore((state) => state.bathrooms);
  //   const reviews = globalStore((state) => state.reviews);

  const {
    status,
    error,
    data: bathrooms,
  } = useQuery({
    queryKey: ["bathrooms"],
    queryFn: fetchBathrooms,
  });

  const {
    status: rstatus,
    error: rerror,
    data: reviews,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

//   console.log(bathrooms, reviews);
  //   console.log(globalStore((state) => state.bathrooms))
  // for this page I was thinking it would be nice to see:

  // "Welcome to the Better Bathroom Bureau"
  // a link to the app on the App Store, something like "on the go? get the app!"
  // a brief description of what BBB is - something like the text on the Mission page
  // one bathroom - maybe the most recently submitted, or the highest rated, or the closest to you?
  // one review - maybe the most recent, or something specific that we choose?
  // mayyyyybe a map with all of the bathrooms on it as pins? might be an expensive feature if we load a map and all the pins every homepage visit

  // if a user lands on /bathrooms, or /bathroom/:bathroomid, they might have some or all of the bathrooms in state,
  // but all of the reviews, because we didn't fetch them from the DB in the allBathroomsLoader

  if (status === 'loading' || rstatus === 'loading') return (<main id="home-main">
  <m.div
    id="home"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h1>loading...</h1>
  </m.div>
</main>)

  else return (
    <main id="home-main">
      <m.div
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>you're on the home page babes</h1>
      </m.div>
    </main>
  );
}
