import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// we don't use this anymore, we were only using this with the createBrowserRouter version, NewApp
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
