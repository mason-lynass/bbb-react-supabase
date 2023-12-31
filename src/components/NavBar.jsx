import { NavLink } from "react-router-dom";
import { globalStore } from "../global/Zustand";
import Logo from "../assets/bbb-logo-1.png";
import Logo2 from "../assets/bbb-molly-logo-1.png";
import Logo3 from "../assets/bbb-molly-logo-3.png";
import Logo4 from "../assets/bbb-molly-logo-small-1.png";
import Logo5 from "../assets/bbb-molly-logo-small-2.png";

export default function NavBar({ sessionSwitch }) {
  const session = globalStore((state) => state.session);

  function loginOrAccount() {
    // console.log(session, sessionSwitch)
    if (!session) {
      return (
        <NavLink id="login" to="/login">
          <p id="underline">Log In</p>
        </NavLink>
      );
    } else if (session.length === 0) {
      return (
        <NavLink id="login" to="/login">
          <p id="underline">Log In</p>
        </NavLink>
      );
    } else return <NavLink to="/account">Account</NavLink>;
  }

  return (
    <div id="nav-bar">
      <NavLink to="/" id='nav-left'>
        <div id="logo-container">
          <img src={Logo3} id="logo" />
        </div>
        <h1 id="nav-title">Better Bathroom Bureau</h1>
      </NavLink>
      <nav>
        <div>
          <NavLink to="/bathrooms">All Bathrooms</NavLink>
          <NavLink to="/best">Best New Bathrooms</NavLink>
          <NavLink to="/near-me">Bathrooms Near Me</NavLink>
          <NavLink to="/submit">Submit a Bathroom</NavLink>
          <NavLink to="/about">Our Mission</NavLink>
        </div>
        <div>{loginOrAccount()}</div>
      </nav>
    </div>
  );
}
