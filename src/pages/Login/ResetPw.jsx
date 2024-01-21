import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../ReactQueryApp";

export default function ResetPw() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHide, setShowHide] = useState(false);

  async function updatePW(e) {
    e.preventDefault();

    setLoading(true);
    if (password !== confirmedPassword) {
      alert(
        "Please ensure that both password fields are identical and try again."
      );
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.error_description || error.message);
    } else if (data) {
      navigate("/account");
      alert("password successfully updated");
    }
    setLoading(false);
  }

  function showHidePassword() {
    setShowHide((prev) => !prev);
  }

  return (
    <section id="reset-pw">
      <form id="reset-pw-form" onSubmit={(e) => updatePW(e)}>
        <div>
          <input
            type={showHide === false ? "password" : "text"}
            placeholder="Password"
            value={password}
            required={true}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type={showHide === false ? "password" : "text"}
            placeholder="Confirm Password"
            value={confirmedPassword}
            required={true}
            name="confirmed-password"
            onChange={(e) => setConfirmedPw(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            Reset Password
          </button>
        </div>
      </form>
      <button id="show-hide-pw" onClick={showHidePassword}>
        {showHide === false ? "Show" : "Hide"} password
      </button>
    </section>
  );
}
