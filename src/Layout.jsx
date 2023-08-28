import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function Layout({ session, sessionSwitch }) {
  return (
    <>
      <NavBar session={session} sessionSwitch={sessionSwitch} />
      <div id="layout-outlet">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
