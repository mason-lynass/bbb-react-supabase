import { useState } from "react";
import { supabase } from "../../ReactQueryApp";
import { useNavigate } from "react-router-dom";
import { motion as m } from "framer-motion";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPw, setConfirmedPw] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault();
    if (password !== confirmedPw) {
      alert(
        "Please ensure that both password fields are identical and try again."
      );
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return alert(error.error_description || error.message);
    } else navigate("/account");
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form id="signup-form" onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmedPw}
          required={true}
          onChange={(e) => setConfirmedPw(e.target.value)}
        />
        <button disabled={loading}>signup</button>
      </form>
      <button onClick={() => navigate("/login")}>Log In</button>
    </m.div>
  );
}
