export default function ReviewSubmitted({ locationName, setShowSubmitted }) {
  const body = document.querySelector("body");

  body.classList.add("bodyBlur");

  function handleClick() {
    body.classList.remove("bodyBlur");
    setShowSubmitted(false)
  }
  return (
    <dialog id='review-submitted'>
      <h3>Thanks for leaving a review for {locationName}!</h3>
      <p>
        Your experience and insight is a valuable resource to our community.
      </p>
      <p>
        Your submission will be reviewed by our team and only modified if necessary.
      </p>
      <button onClick={handleClick}>Got it</button>
    </dialog>
  );
}
