import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Navigate, useNavigate } from "react-router-dom";
import { motion as m } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { globalStore } from "../../global/Zustand";
import { supabase } from "../../ReactQueryApp";
import { fetchUsers } from "../../React-Query/fetch-functions";
import "./Login.css";

export default function Login() {
  // const [hasAccount, setHasAccount] = useState(false)
  const session = globalStore((state) => state.session);
  const profile = globalStore((state) => state.profile);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPw, setForgotPw] = useState(false);
  // the below success message is for success in sending the password reset email
  const [successMessage, setSuccessMessge] = useState(false);

  const navigate = useNavigate();

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => fetchUsers(),
  });

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert(error.error_description || error.message);
    }
    setLoading(false);
  }

  async function sendForgotPwEmail(event) {
    event.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://better-bathroom-bureau.vercel.app/account",
    });
    if (error) alert(error.error_description || error.message);
    if (data) setSuccessMessge(true);
  }

  async function handleSubmit(event) {
    forgotPw ? sendForgotPwEmail(event) : handleLogin(event);
  }

  function renderButtonText() {
    if (loading) {
      return <span>Loading</span>;
    }
    if (forgotPw) {
      return <span>Send password reset link</span>;
    }
    return <span>Login</span>;
  }

  useEffect(() => {
    // console.log("useEffect");
    if (session && !profile && usersLoading === false) {
      // first option is what happens if you log in, because there's already a user created;
      // second option is what happens if you sign up, because we don't re-fetch the users, so this time
      // we'll use the session data until the page reloads
      globalStore.setState({
        profile: users.filter((user) => session.user.id === user.id)[0] || {
          username: null,
          email: session.user.email,
          id: session.user.id,
        },
      });
    }
    // I left the dependency array open because it won't re-render very often;
    // if there's no session we'll go straight to Auth
    // whatever happens at Auth, when they're done there will be a session
    // so then if there's not a profile, we'll do whatever is inside this useEffect
    // which will set a profile, which will navigate us away from this component
  });

  if (usersLoading == true) return <h2>loading...</h2>;

  if (session && profile) {
    return <Navigate to="/account" replace={true} />;
  }

  // if there's no session, then you need to log in
  if (!session)
    return (
      <m.div
        id="Auth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* this component comes straight from Supabase Auth UI React */}
        {/* // it would be nice if I could add some functionality to this component but I don't think that I can */}
        {/* // like it would be nice to do everything else in the if statements here */}
        {/* <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        /> */}
        <form id="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          {forgotPw ? null : (
            <input
              type="password"
              placeholder="Password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <button disabled={loading}>{renderButtonText()}</button>
        </form>
        {successMessage ? <p id='check-your-email'>nice! check your email</p> : null}
        <div id='bottom-buttons'>
          <button id="forgot-password" onClick={() => setForgotPw(!forgotPw)}>
            {forgotPw ? "Back to Login" : "Forgot Password"}
          </button>
          <button id="sign-up" onClick={() => navigate("/sign-up")}>
            Sign Up
          </button>
        </div>
      </m.div>
    );
  else return <p>uh oh!</p>;
}
