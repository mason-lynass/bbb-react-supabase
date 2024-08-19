import { useState } from "react";
import { globalStore } from "../../global/Zustand";
import { useMutation } from "@tanstack/react-query";
import RatingButton from "../../components/RatingButton";
import { supabase, cld } from "../../global/constants";
import DatePicker from "react-datepicker";
import { englishDataset, RegExpMatcher, englishRecommendedTransformers } from "obscenity";

export default function NewReview({
  bathroom,
  setShowReview,
  bathroomReviews,
  setShowSubmitted,
}) {
  const body = document.querySelector("body");
  body.classList.add("bodyBlurAB");

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
  const [photoPath, setPhotoPath] = useState(null);


  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers
  })

  // to see if the user recently submitted a review recently (one month)
  const today = Date.now();
  const userBathroomReviews = bathroomReviews.filter(
    (r) => r.user_id === profile.id
  );
  const recentReview = userBathroomReviews.sort((a, b) => b.date - a.date)[0];
  let recentReviewDate;
  if (!recentReview) recentReviewDate = 0;
  else recentReviewDate = new Date(recentReview.created_at);

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

  async function updateBathroomAverageScoreRPC(bathroom_id) {
    const newbathroomid = bathroom_id;
    const { error } = await supabase.rpc(
      "update_bathroom_average_score",
      { newbathroomid }
    );
    if (error) console.error(error)
  }

  async function updateUsersAverageReviewScoreRPC(id) {
    const userid = id;
    const { error } = await supabase.rpc(
      "update_user_average_review_score",
      { userid }
    );
    if (error) console.error(error)
  }

  const reviewMutation = useMutation({
    mutationFn: () => {
      return supabase.from("reviews").insert(reviewSupabase).select();
    },
    onSuccess: () => {
      updateBathroomAverageScoreRPC(bathroom.id);
      updateUsersAverageReviewScoreRPC(profile.id);
      setShowReview(false);
      setShowSubmitted(true);
    },
  });

  async function handlePhotoUpload() {

    const url = `https://api.cloudinary.com/v1_1/${cld.cloudinaryConfig.cloud.cloudName}/upload`;
    const fd = new FormData();
    const preset = 'bbb_review_upload'
    const photoDate = new Date(reviewSupabase.date).toISOString().split('T')[0]
    fd.append("upload_preset", preset);
    fd.append("file", photoPath);
    fd.append('public_id', `${reviewSupabase.bathroom_id}_XXX_${photoDate}`)

    try {
      const response = await fetch(url, {
        method: "POST",
        body: fd,
      })

      if (!response.ok) {
        throw new Error('Photo upload failed')
      }

      const data = await response.json()
      const cldURL = data.secure_url
      return cldURL
    }

    catch (error) {
      console.error("Error uploading the file:", error);
      return null; // Return null in case of an error
    }
  }

  async function handleSubmit(e) {
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
      if (userBathroomReviews.length > 0) {
        if (today - recentReviewDate.valueOf() < 2629746000) {
          throw [
            "Please wait at least one month to leave another review for this bathroom",
          ];
        }
      }
      if (matcher.hasMatch(reviewDescription) || matcher.hasMatch(cleanliness) || matcher.hasMatch(bathroomFunction) || matcher.hasMatch(style)) {
        const reviewBad = matcher.getAllMatches(reviewDescription)
        const cleanBad = matcher.getAllMatches(cleanliness)
        const funcBad = matcher.getAllMatches(bathroomFunction)
        const styleBad = matcher.getAllMatches(style)
        const badWords = [reviewBad, cleanBad, funcBad, styleBad]
        const theWords = []
        for (const wordsArray of badWords) {
          for (const word of wordsArray) {
            if (word.termId) {
              const { phraseMetadata } = englishDataset.getPayloadWithPhraseMetadata(word);
              theWords.push(phraseMetadata.originalWord)
            }
          }
        }
        throw [
          `Please avoid using obscene language on this website. Bad words: ${theWords}`
        ]
      }
      if (photoPath) {
        const cldURL = await handlePhotoUpload()
        if (cldURL) reviewMutation.mutate();
      }
      else reviewMutation.mutate();
    } catch (error) {
      setErrors(error);
    }
  }

  function displayErrors() {
    return errors.map((e) => {
      return (
        <p className="display-error" key={e}>
          {e}
        </p>
      );
    });
  }

  function newReviewClose() {
    setShowReview(false);
    body.classList.remove("bodyBlurAB");
  }

  return (
    <div>
      <dialog id="new-review-dialog" open>
        <button id="new-review-close" onClick={() => newReviewClose()}>
          x
        </button>
        <h2 id="new-review-title">
          Add your review for <br></br> {bathroom.location_name}
        </h2>
        <form id="new-review-form" onSubmit={handleSubmit}>
          <section id="nr-review-fields">
          <p style={{textAlign: 'right', fontSize: '12px', margin: '0 auto'}}>* - optional</p>

            <div>
              <label htmlFor="date-picker">Date visited:</label>
              <DatePicker
                id="date-picker"
                name="date"
                selected={date}
                onChange={(date) => setDate(date)}
              />
            </div>
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
            <div id='photo-div'>
              <label>* Upload a photo:</label>
              <input
                id="nr-photo"
                name="new-review-photo"
                type="file"
                accept="image/png, image/jpeg, image/heic"
                onChange={(e) => setPhotoPath(e.target.files[0])}
              />
            </div>
            <div className="nr-flex">
              <div>
                <label htmlFor="nr-cleanliness">* Cleanliness:</label>
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
                <label htmlFor="nr-function">* Function:</label>
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
                <label htmlFor="nr-style">* Style:</label>
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
