import React from "react";

export default function NearMeMap({ seattle, zoom, children, userGeocode }) {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState();
  let center = seattle

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
  }, [ref, map]);

  React.useEffect(() => {
    if (userGeocode !== null) {
      center = userGeocode
      setMap(new window.google.maps.Map(ref.current, { center, zoom: 15 }))
    }
    else {
      center = seattle
      setMap(new window.google.maps.Map(ref.current, { center, zoom: 11 }))
    }
  }, [userGeocode])

  return (
    <>
      <div id="all-bathrooms-map" ref={ref}/>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
}
