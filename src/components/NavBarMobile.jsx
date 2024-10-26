import { NavLink } from "react-router-dom";
import { globalStore } from "../global/Zustand";
import { useState } from "react";
import Logo3 from "../assets/bbb-molly-logo-3.png";

export default function NavBarMobile() {
  const session = globalStore((state) => state.session);

  const [navOpen, setNavOpen] = useState(false);

  function loginOrAccount() {
    if (!session) {
      return (
        <NavLink id="login" to="/login" onClick={() => setNavOpen(false)}>
          Log In
        </NavLink>
      );
    } else if (session.length === 0) {
      return (
        <NavLink id="login" to="/login" onClick={() => setNavOpen(false)}>
          Log In
        </NavLink>
      );
    } else
      return (
        <NavLink to="/account" onClick={() => setNavOpen(false)}>
          Account
        </NavLink>
      );
  }

  function openCloseNav() {
    if (navOpen === true) {
      return (
        <div id="mobile-open-menu">
          <NavLink to="/bathrooms" onClick={() => setNavOpen(false)}>
            All Bathrooms
          </NavLink>
          <NavLink to="/best" onClick={() => setNavOpen(false)}>
            Best Bathrooms
          </NavLink>
          <NavLink to="/near-me" onClick={() => setNavOpen(false)}>
            Near Me
          </NavLink>
          <NavLink to="/submit" onClick={() => setNavOpen(false)}>
            Submit
          </NavLink>
          <NavLink to="/about" onClick={() => setNavOpen(false)}>
            About
          </NavLink>
          {loginOrAccount()}
        </div>
      );
    }
  }

  return (
    <div id="nav-bar-mobile">
      <NavLink to="/" id='nav-left'>
        <div id="logo-container">
          <img src={Logo3} id="logo-mobile" />
        </div>
        <h1 id="nav-title-mobile">Better Bathroom Bureau</h1>
      </NavLink>
      <button id="mobile-menu-button" onClick={() => setNavOpen(!navOpen)}>
        Menu
      </button>
      {openCloseNav()}
    </div>
  );
}
