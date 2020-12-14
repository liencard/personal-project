import gsap from "gsap";

let clientX = -100;
let clientY = -100;

const easing = "power3.inOut";

const init = () => {
  const cursorWrapper = document.querySelector(".cursor-wrapper");
  const innerCursor = document.querySelector(".custom-cursor__inner");
  const outerCursor = document.querySelector(".custom-cursor__outer");
  const selectCursor = document.querySelector(".cursor-select");

  document.addEventListener("mousemove", (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
  });

  const render = () => {
    gsap.set(cursorWrapper, {
      x: clientX,
      y: clientY,
    });
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  const fullCursorSize = 40;
  const enlargeCursorTween = gsap.to(outerCursor, 0.3, {
    backgroundColor: "transparent",
    width: fullCursorSize,
    height: fullCursorSize,
    ease: easing,
    paused: true,
  });

  const mainNavHoverTween = gsap.to(outerCursor, 0.3, {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    opacity: 0.3,
    width: fullCursorSize,
    height: fullCursorSize,
    ease: easing,
    paused: true,
  });

  const handleMouseEnter = () => {
    enlargeCursorTween.play();
    selectCursor.classList.add("custom-cursor__inner");
  };

  const handleMouseLeave = () => {
    enlargeCursorTween.reverse();
    selectCursor.classList.remove("custom-cursor__inner");
  };

  const listItems = document.querySelectorAll(".movie__item");
  listItems.forEach((el) => {
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
  });

  const mainNavItems = document.querySelectorAll("svg");
  mainNavItems.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      mainNavHoverTween.play();
    });
    el.addEventListener("mouseleave", () => {
      mainNavHoverTween.reverse();
    });
  });
};

init();
