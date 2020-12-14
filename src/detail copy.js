import "./style.css";
import "./js/revealMask";
import "./js/cast/castImage";
import "./js/cursor";
import "./js/detailTextAnimation";

if (window.location.pathname === "/detail.html") {
  require("./js/cast/castImage");
}

import barba from "@barba/core";
import { gsap } from "gsap";
import LocomotiveScroll from "locomotive-scroll";

let scroll;

const fadeOutContent = (container) => {
  gsap.to(container, {
    opacity: 0,
  });
};

const fadeInContent = (container) => {
  gsap.from(container, {
    opacity: 0.5,
  });
};

const animateContentIn = () => {
  gsap.from(".info", {
    y: 600,
  });
};

const animateTextIn = () => {
  gsap.from(".info__title", {
    y: 300,
    opacity: 0,
    delay: 0.2,
  });
  gsap.from(".info__country", {
    y: 300,
    opacity: 0,
    delay: 0.3,
  });
  gsap.from(".credits", {
    y: 300,
    opacity: 0,
    delay: 0.4,
    stagger: 0.2,
  });
  gsap.from(".info__description", {
    y: 300,
    opacity: 0,
    delay: 0.5,
  });
  gsap.from(".synopsis__link", {
    y: 300,
    opacity: 0,
    delay: 0.6,
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

// barba.hooks.enter(() => {
//   window.scrollTo(0, 0);
// });

barba.init({
  debug: true,
  transitions: [
    {
      name: "general-transition",
      once: ({ next }) => {
        fadeInContent(next.container);
        smooth();
      },
      leave: ({ current }) => fadeOutContent(current.container),
      enter: ({ next }) => {
        fadeInContent(next.container);
      },
      beforeEnter() {
        scroll.setScroll(0, 0);
      },
    },
    // {
    //   name: "to-detail",
    //   from: {
    //     namespace: ["trailer"],
    //   },
    //   to: {
    //     namespace: ["detail"],
    //   },
    //   once: ({ next }) => {
    //     console.log("test once");
    //   },
    //   leave: ({ current }) => {
    //     console.log("test leave");
    //   },
    //   enter: ({ next }) => {
    //     console.log("test enter");
    //     animateContentIn();
    //     animateTextIn();
    //   },
    // },
  ],
});
