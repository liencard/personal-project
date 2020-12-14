import "./style.css";
import "./js/revealMask";
import "./js/cast/castImage";
import "./js/cursor";

if (window.location.pathname === "/detail.html") {
  require("./js/cast/castImage");
}

import barba from "@barba/core";
import { gsap } from "gsap";
import LocomotiveScroll from "locomotive-scroll";

let scroll;

const fadeOutContent = (container) => {
  console.log(container);
  console.log("test out");
  gsap.to(container, {
    opacity: 0,
  });
};

const fadeInContent = (container) => {
  console.log("test in");
  gsap.from(container, {
    opacity: 0.5,
  });
};

const animateContentIn = () => {
  gsap.from(".info", {
    y: 600,
  });
};

const smooth = () => {
  scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
  });
};

barba.hooks.after(() => {
  scroll.update();
});

barba.init({
  debug: true,
  transitions: [
    {
      name: "general-transition",
      once: ({ next }) => {
        fadeInContent(next.container);
        smooth();
      },
      leave: ({ current }) => {
        fadeOutContent(current.container);
      },
      enter: ({ next }) => {
        fadeInContent(next.container);
        animateContentIn();
      },
      beforeEnter() {
        scroll.setScroll(0, 0);
      },
    },
  ],
});
