import { useState } from "react";
import { supabase } from "../../global/constants";
import { useNavigate } from "react-router-dom";
import { motion as m } from "framer-motion";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPw, setConfirmedPw] = useState("");
  const [loading, setLoading] = useState("");
  const [errors, setErrors] = useState([]);
  const [showTC, setShowTC] = useState(false);

  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault();

    try {
      if (password !== confirmedPw)
        throw [
          "Please ensure that both password fields are identical and try again.",
        ];
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError)
        throw [signUpError.error_description || signUpError.message];
      else navigate("/account");
    } catch (error) {
      setErrors(error);
      setLoading(false);
    }
  }

  function termsAndConditions() {
    if (showTC === true) {
      return (
        <dialog id="terms-and-conditions">
          <div>
            <h4>Terms and Conditions</h4>
            <p>
              By accessing and using the Better Bathroom Bureau app, you agree
              to abide by the following rules. Failure to comply with these
              terms may result in the suspension or termination of your account:
            </p>
            <p>
              <b>Prohibited Content:</b> Users are strictly prohibited
              from posting any explicit, obscene, or offensive images. The
              Better Bathroom Bureau maintains a zero-tolerance policy for such
              content.
            </p>
            <p>
              <b>Language Use:</b> The use of profanity, vulgar
              language, or any form of hate speech is strictly forbidden. Please
              maintain respectful and courteous communication at all times.
            </p>
            <p>
              <b>No Spamming:</b> Repeatedly posting the same
              bathroom, review, or content in a manner that disrupts the user
              experience or community will not be tolerated.
            </p>
            <p>
              We reserve the right to take appropriate action, including account
              suspension or termination, against any user who violates these
              terms.
            </p>
            <p>
              By proceeding, you acknowledge that you have read, understood, and
              agree to these Terms and Conditions.
            </p>
          </div>
          <button onClick={() => setShowTC(false)}>Close</button>
        </dialog>
      );
    }
  }

  function displayErrors() {
    return (
      <p key={errors} className="display-error">
        {errors}
      </p>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {termsAndConditions()}
      <form id="signup-form" onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          autoComplete="confirm-password"
          value={confirmedPw}
          required={true}
          onChange={(e) => setConfirmedPw(e.target.value)}
        />
        <div id="t-and-c">
          <p>
            By clicking Sign Up, you agree to our{" "}
            <a onClick={() => setShowTC(true)}>Terms and Conditions</a>.
          </p>
        </div>
        <button disabled={loading}>Sign Up</button>
        {displayErrors()}
      </form>

      <div id="bottom-buttons">
        <button onClick={() => navigate("/login")}>Log In</button>
      </div>
    </m.div>
  );
}
