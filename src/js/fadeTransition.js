import barba from "@barba/core";
import { gsap } from "gsap";

const fadeOutContent = (data) => {
  gsap.to(data.current.container, {
    opacity: 0,
  });
};

const fadeInContent = (data) => {
  gsap.from(data.current.container, {
    opacity: 0,
  });
};

// init Barba
barba.init({
  sync: true,

  transitions: [
    {
      name: "home",
      async leave(data) {
        fadeOutContent(data);
      },
      async enter(data) {
        fadeInContent(data);
      },
    },
  ],
});
