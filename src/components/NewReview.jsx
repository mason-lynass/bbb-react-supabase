import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../main";
import { globalStore } from "../Zustand";
import { useMutation } from "@tanstack/react-query";
import RatingButton from "./RatingButton";
import { supabase } from "../ReactQueryApp";

export default function NewReview({ bathroom, setShowReview }) {
  const profile = globalStore((state) => state.profile);

  const [errors, setErrors] = useState([]);

  const [date, setDate] = useState(new Date());
  const [reviewDescription, setReviewDescription] = useState("");
  const [cleanliness, setCleanliness] = useState("");
  const [cleanlinessRating, setCleanlinessRating] = useState(null);
  const [bathroomFunction, setBathroomFunction] = useState("");
  const [bathroomFunctionRating, setBathroomFunctionRating] = useState(null);
  const [style, setStyle] = useState("");
  const [styleRating, setStyleRating] = useState(null);

  const reviewSupabase = {
    user_id: profile.id,
    bathroom_id: bathroom.id,
    date: date.toDateString(),
    description: reviewDescription,
    cleanliness,
    cleanliness_rating: cleanlinessRating,
    function: bathroomFunction,
    function_rating: bathroomFunctionRating,
    style,
    style_rating: styleRating,
    average_rating: (
      (cleanlinessRating + bathroomFunctionRating + styleRating) /
      3
    ).toFixed(2),
  };

  const reviewMutation = useMutation({
    mutationFn: () => {
      console.log(reviewSupabase);
      return supabase.from("reviews").insert(reviewSupabase).select();
    },
    onSuccess: (data) => {
      console.log(data);
      // setTimeout(() => queryClient.invalidateQueries({
      //   queryKey: ["reviews", { bathroom: bathroom.id }],
      // }), 20000);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    try {
      if (reviewDescription === "") throw ["Please leave a brief description."];
      if (
        cleanlinessRating === null ||
        bathroomFunctionRating === null ||
        styleRating === null
      )
        throw [
          "Please rate cleanliness, function, and style on a scale from 1-10.",
        ];
      reviewMutation.mutate();
    } catch (error) {
      console.log(error);
      setErrors(error);
    }
  }

  function displayErrors() {
    return errors.map((e) => {
      return <p className="display-error">{e}</p>;
    });
  }

  return (
    <div>
      <dialog id="new-review-dialog" open>
      <button id="new-review-close" onClick={() => setShowReview(false)}>x</button>
        <h2 id="new-review-title">
          Add your review for {bathroom.location_name}
        </h2>
        <form id="new-review-form" onSubmit={handleSubmit}>
          <section id="review-fields">
            <div>
              <label htmlFor="nr-bathroom-description">
                Bathroom description:
              </label>
              <textarea
                id="nr-bathroom-description"
                name="bathroom-description"
                type=""
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
              />
            </div>
            <div className="nr-flex">
              <div>
                <label htmlFor="nr-cleanliness">Cleanliness:</label>
                <textarea
                  id="nr-cleanliness"
                  type="text"
                  value={cleanliness}
                  onChange={(e) => setCleanliness(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="nr-cleanliness-rating">
                  Cleanliness rating:
                </label>
                <RatingButton
                  rating={cleanlinessRating}
                  setRating={setCleanlinessRating}
                />
              </div>
            </div>
            <div className="nr-flex">
              <div>
                <label htmlFor="nr-function">Function:</label>
                <textarea
                  id="nr-function"
                  type="text"
                  value={bathroomFunction}
                  onChange={(e) => setBathroomFunction(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="nr-function-rating">Function rating:</label>
                <RatingButton
                  rating={bathroomFunctionRating}
                  setRating={setBathroomFunctionRating}
                />
              </div>
            </div>
            <div className="nr-flex">
              <div>
                <label htmlFor="nr-style">Style:</label>
                <textarea
                  id="nr-style"
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="nr-style-rating">Style rating:</label>
                <RatingButton rating={styleRating} setRating={setStyleRating} />
              </div>
            </div>
            <button id="new-review-submit" type="submit">
              {/* {loading === "submit" ? "Submit" : "Loading..."} */}
              Submit
            </button>
            {displayErrors()}
          </section>
        </form>
      </dialog>
    </div>
  );
}
