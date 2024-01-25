export default function BathroomPageReview({ review, users }) {
  let user = { username: "" };
  if (users.length > 0) user = users.find((u) => u.id === review.user_id);
  return (
    <div className="one-bathroom-one-review" key={review.id}>
      <div id="review-top">
        <p>average rating: {review.average_rating}</p>
      </div>
      <p>{review.description}</p>
      <div id="review-cleanliness">
        <p>cleanliness: {review.cleanliness_rating}</p>
        <p>{review.cleanliness}</p>
      </div>
      <div id="review-function">
        <p>function: {review.function_rating}</p>
        <p>{review.function}</p>
      </div>
      <div id="review-style">
        <p>style: {review.style_rating}</p>
        <p>{review.style}</p>
      </div>
      <div id='review-user'>
        <p>- {user.username}</p>
      </div>
    </div>
  );
}
