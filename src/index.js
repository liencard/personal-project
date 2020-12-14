import "./style.css";
import "./js/revealMask";
import "./js/globe";
import "./js/movieList";
import "./js/cursor";

import { gsap } from "gsap";

const animateIntro = () => {
  gsap.from(".title", {
    duration: 2,
    scale: 0,
    opacity: 0,
  });

  gsap.from(".subtitle", {
    duration: 2,
    opacity: 0,
  });
};

const init = () => {
  console.log("test index");
  //animateIntro();
};

init();
