import { useEffect, useState } from "react";
import BBBEx1 from "../../assets/bbb-home-1.webp";
import BBBEx2 from "../../assets/bbb-home-2.webp";
import BBBEx3 from "../../assets/bbb-home-3.webp";
import BBBEx4 from "../../assets/bbb-home-4.webp";
import "./Home.css";
import { motion as m } from "framer-motion";

export default function HomeSlideshow() {

  const [imageNumber, setImageNumber] = useState(0);

  const slides = [
    { url: BBBEx1, text: "Know before you go" },
    { url: BBBEx2, text: "Find your pipe dreams" },
    { url: BBBEx3, text: "Explore, rate, share" },
    { url: BBBEx4, text: "Relief is a click away" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setImageNumber((prevNumber) =>
        prevNumber === slides.length - 1 ? 0 : prevNumber + 1
      );
    }, 10000);
    return () => {};
  }, [imageNumber, slides.length]);

  return (
    <div id="home-slideshow">
      <div
        id="all-slides"
        style={{ transform: `translate3d(${-imageNumber * 100}%, 0, 0)` }}
      >
        {slides.map((slide, imageNumber) => {
          return (
            <div className="slides" key={imageNumber}>
              <img src={slide.url} className="slide-image" alt='interior of a bathroom in Seattle'/>

            <m.div animate={{opacity: 1}} transition={{ ease: "easeOut", duration: 2 }}><p className="slide-text">{slide.text}</p></m.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}