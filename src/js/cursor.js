import gsap from "gsap";

let clientX = -100;
let clientY = -100;

const easing = "power3.inOut";

const init = () => {
  const cursorWrapper = document.querySelector(".cursor-wrapper");
  const innerCursor = document.querySelector(".custom-cursor__inner");
  const outerCursor = document.querySelector(".custom-cursor__outer");

  // const cursorWrapperBox = cursorWrapper.getBoundingClientRect();
  // const innerCursorBox = innerCursor.getBoundingClientRect();
  // const outerCursorBox = outerCursor.getBoundingClientRect();

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
    opacity: 0.3,
    width: fullCursorSize,
    height: fullCursorSize,
    ease: easing,
    paused: true,
  });

  const handleMouseEnter = () => {
    enlargeCursorTween.play();
  };

  const handleMouseLeave = () => {
    enlargeCursorTween.reverse();
  };

  const listItems = document.querySelectorAll(".list__item");
  listItems.forEach((el) => {
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
  });

  // const pswpContainer = document.querySelector(".pswp__container");
  // pswpContainer.addEventListener("mouseenter", handleMouseEnter);

  const mainNavItems = document.querySelectorAll("svg");
  mainNavItems.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      mainNavHoverTween.play();
    });
    el.addEventListener("mouseleave", () => {
      mainNavHoverTween.reverse();
    });
  });

  const bumpCursorTween = gsap.to(outerCursor, 0.1, {
    scale: 0.7,
    paused: true,
    onComplete: () => {
      gsap.to(outerCursor, 0.2, {
        scale: 1,
        ease: easing,
      });
    },
  });

  const openGalleryActions = () => {
    bumpCursorTween.play();
    innerCursor.classList.add("is-closing");
    cursorWrapper.classList.add("has-blend-mode");
    //cursorWrapper.classList.remove("is-outside");
  };

  const closeGalleryactions = () => {
    bumpCursorTween.play();
    innerCursor.classList.remove("is-closing");
    cursorWrapper.classList.remove("has-blend-mode");
    setTimeout(() => {
      const elementMouseIsOver = document.elementFromPoint(clientX, clientY);
      if (!elementMouseIsOver.classList.contains("movie__poster")) {
        enlargeCursorTween.reverse();
      }
    }, 400);
  };

  openGalleryActions();
  closeGalleryactions();
};

init();
