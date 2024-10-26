import React, { useState } from "react";

const Marker = (options) => {
  const [marker, setMarker] = useState();

  // this section until the useEffect is unnecessary if we're on a OneBathroomMap
  let contentString = "";

  if (options.bathroom) {
    contentString = `<a class='marker-content-string' href='bathrooms/${options.bathroom.id}'>${options.bathroom.location_name}</a>`;
  }

  const infowindow = new window.google.maps.InfoWindow({
    content: contentString,
  });

  if (marker) {
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
      });
    });
  }

  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker({ class: 'something' }));
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);
  return null;
};

export default Marker;
