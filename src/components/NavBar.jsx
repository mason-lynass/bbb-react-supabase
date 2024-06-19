import { NavLink } from "react-router-dom";
import { globalStore } from "../global/Zustand";
import useSound from "use-sound"
import Logo3 from "../assets/bbb-molly-logo-3.png";
import sinkRunning from '../assets/audio/sink-running.mp3'

export default function NavBar() {
  const session = globalStore((state) => state.session);
  const [playSink] = useSound(sinkRunning)

  function loginOrAccount() {
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
    } else return <NavLink to="/account" onClick={playSink}>Account</NavLink>;
  }

  return (
    <div id="nav-bar">
      <NavLink to="/" id='nav-left'>
        <div id="logo-container">
          <img src={Logo3} id="logo" alt='the BBB logo - a roll of toilet paper with some paper floating up to the left, which sort of looks like a lowercase b'/>
        </div>
        <h1 id="nav-title">Better Bathroom Bureau</h1>
      </NavLink>
      <nav>
        <div>
          <NavLink to="/bathrooms">All Bathrooms</NavLink>
          <NavLink to="/best">Best Bathrooms</NavLink>
          <NavLink to="/near-me">Bathrooms Near Me</NavLink>
          <NavLink to="/submit">Submit a Bathroom</NavLink>
          <NavLink to="/about">Our Mission</NavLink>
        </div>
        <div>{loginOrAccount()}</div>
      </nav>
    </div>
  );
}
