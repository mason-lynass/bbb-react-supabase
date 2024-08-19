/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export default function SubmittedDialog({ locationName }) {
  const body = document.querySelector("body");

  body.classList.add('bodyBlur')

    const navigate = useNavigate()

  function handleClick() {
    body.classList.remove('bodyBlur')
    navigate('/account')
    // return <Navigate to={`/account`} />;
  }
  return (
    <dialog id='submitted-dialog'>
      <h3>Thanks for submitting {locationName} and leaving a review!</h3>
      <p>
        Your bathroom submission will be verified by our team and approved
        shortly.
      </p>
      <button onClick={handleClick}>Got it</button>
    </dialog>
  );
}
