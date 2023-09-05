import "./CSS/About.css";
import ANewTab from "./components/ANewTab";
import { motion as m } from "framer-motion";

export default function About() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main id="about">
        <h1>BBB Mission & Vision</h1>
        <div id="about-flex">
          <div>
            <h3>Mission</h3>
            <p>
              Better Bathroom Bureau is an organization dedicated to helping
              residents and visitors of Seattle access bathroom facilities
              around the city.
            </p>
            <p>
              Our web app catalogues bathrooms that users of the site submit,
              along with user reviews and ratings for each facility.
            </p>
          </div>
          <div>
            <h3>Vision</h3>
            <p>
              {" "}
              Our goal is to share insight into available bathrooms and collect
              first-hand accounts of user experiences, in order to help users
              have a better bathroom experience.
            </p>
          </div>
        </div>
        <div>
          <h3>About our data:</h3>
          <p>
            Better Bathroom Bureau maintains a database of bathrooms and reviews
            - some of these are submitted by site developers, while many others
            are submitted by users and community members.
          </p>
          <p>
            Bathrooms submitted by users are manually approved by the BBB team,
            and may take up to 24 hours to appear (or more, we're not getting
            paid!). If you submit a bathroom, it should show up on your account
            page - double check there before resubmitting.
          </p>
          <p>
            Bathroom neighborhoods are automatically populated by making a
            request with the bathroom address to the Google Maps Geocoding API.
            All of us, including Google Maps, have our own opinions about
            neighborhood boundaries and legitimacy, but we try to correct
            outliers like "Northeast Seattle," "Greater Duwamish," and "Uptown".
            The BBB team will try to stick to{" "}
            <ANewTab
              text="these neighborhood boundaries"
              href="https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::neighborhood-map-atlas-neighborhoods/explore"
            />{" "}
            as much as possible. Please don't write to us with your opinions
            about neighborhoods unless we miss something truly egregious.
          </p>
          <p>
            Bathroom features like diaper changing stations, gender-neutral
            facilities, and ADA compliant facilities, are "false" by default,
            and these check boxes in the Bathroom submission form should not be
            checked unless you're 100% sure. We don't want to send anyone to
            facilities that aren't accessible in the way they were expecting!
          </p>
        </div>
        <hr/>
        <div>
          <p>
            Many public bathrooms in our database come from the{" "}
            <ANewTab
              href="https://www.spl.org/hours-and-locations"
              text="Seattle Public Libraries website"
            />{" "}
            and a City of Seattle ArcGIS Online map of{" "}
            <ANewTab
              href="https://seattlecitygis.maps.arcgis.com/apps/mapviewer/index.html?layers=fd5fe297236a40e582041d56346c1222"
              text="City Funded Restrooms and Hygiene services"
            />
            .
          </p>
          <p>
            If you have any questions about Bathroom data, notice any errors or
            inconsistencies, or would like to leave a suggestion, feel free to
            reach out at{" "}
            <a href="mailto:betterbathroombureau@gmail.com">
              betterbathroombureau [at] gmail.com
            </a>
          </p>
        </div>
      </main>
    </m.div>
  );
}
