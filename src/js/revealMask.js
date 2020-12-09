import { gsap } from "gsap";

const tl = gsap.timeline();
tl.addLabel("topAndBottom");

tl.from(".line", 0.75, { scaleX: 0, transformOrigin: "center" });
tl.to(".line", 0.01, { opacity: 0 });

tl.to(
  ".top",
  {
    scaleY: 0,
    transformOrigin: "top top",
    duration: 1.5,
    ease: "power3.in",
  },
  "topAndBottom",
  "+=.5"
);

tl.to(
  ".bottom",
  {
    scaleY: 0,
    transformOrigin: "bottom bottom",
    duration: 1.5,
    ease: "power3.in",
  },
  "topAndBottom",
  "+=.5"
);
