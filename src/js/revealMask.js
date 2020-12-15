import { gsap } from "gsap";

const tl = gsap.timeline();
tl.addLabel("topAndBottom", 1);
tl.addLabel("navItems", 2);

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

tl.from(
  ".btn__detail",
  {
    scaleY: 0,
    scaleX: 0,
    transformOrigin: "center center",
    opacity: 0,
    ease: "power3.in",
  },
  "navItems"
);

tl.from(
  ".trailer .btn__back",
  {
    scaleY: 0,
    scaleX: 0,
    transformOrigin: "center center",
    opacity: 0,
    ease: "power3.in",
  },
  "navItems"
);

tl.from(
  ".movie__title-trailer",
  {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.in",
  },
  "navItems"
);

tl.from(
  ".movie__title-country",
  {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.in",
    delay: 0.2,
  },
  "navItems"
);
