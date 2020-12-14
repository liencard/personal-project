import { gsap } from "gsap";

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
  gsap.from(".header", {
    opacity: 0,
    delay: 0.2,
  });
};

const init = () => {
  {
    console.log("test");
    animateTextIn();
  }
};

init();
