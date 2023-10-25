export default function BathroomPageReview({ review, users }) {
  console.log(review)

    let user = {username: ""}
    console.log(user, users)
    if (users.length > 0) user = users.find((u) => u.id === review.user_id);
    console.log(user, users)
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