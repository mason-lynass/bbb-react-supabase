import { AdvancedImage, lazyload} from '@cloudinary/react'
import {cld} from '../../global/constants.jsx'
import { scale } from '@cloudinary/url-gen/actions/resize'
// import { byRadius } from '@cloudinary/url-gen/actions/roundCorners'

export default function BathroomPageReview({ review, users }) {

  function renderReviewPhoto () {
    const image = cld.image(`${review.id}_${review.bathroom_id}_${review.date}`)

    if (image) {
      image.quality(80).resize(scale().width(600))
      return (
        <div id='review-image'>
          <AdvancedImage cldImg={image} plugins={[lazyload()]}/>
        </div>
      )
    }
  }

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
      {review.photo_approved === true ? renderReviewPhoto() : ''}
      <div id='review-user'>
        <p>{user.username} - {review.date}</p>
      </div>
    </div>
  );
}
