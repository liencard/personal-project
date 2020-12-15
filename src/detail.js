import "./style.css";
import "./js/revealMask";
import "./js/cast/castImage";
import "./js/cursor";
import "./js/detailTextAnimation";
import "./js/globe";
//import "./js/audioToggle";
import { Howl, Howler } from "howler";

import currentMovie from "./js/model/currentMovie";
import data from "./assets/data/movies.json";
import { autorun } from "mobx";

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
    opacity: 0,
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
  gsap.from(".btn__synopsis", {
    scaleY: 0,
    scaleX: 0,
    y: 300,
    opacity: 0,
    delay: 1.5,
  });
};

const moveGlobe = () => {
  gsap.from(".container", {
    duration: 0.3,
    x: 500,
    scaleX: 0,
    scaleY: 0,
  });
};

const animateList = () => {
  const tl = gsap.timeline();
  tl.addLabel("animateList");
  // LIST
  tl.from(".overview__title", {
    duration: 0.5,
    x: -500,
    delay: 0.8,
  });

  tl.from(
    ".movie__poster",
    {
      duration: 0.5,
      scale: 0,
      stagger: 0.2,
      delay: 0.8,
    },
    "animateList"
  );

  tl.from(
    ".movie__info",
    {
      duration: 0.5,
      scale: 0,
      x: 100,
      opacity: 0,
      stagger: 0.2,
      delay: 0.8,
    },
    "animateList"
  );
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
        smooth();
      },
      beforeEnter() {
        scroll.setScroll(0, 0);
      },
    },
    {
      name: "to-detail",
      from: {
        namespace: ["trailer"],
      },
      to: {
        namespace: ["detail"],
      },
      once: ({ next }) => {
        console.log("test once");
        fadeInContent(next.container);
      },
      leave: ({ current }) => {
        console.log("test leave");
        fadeOutContent(current.container);
      },
      enter: ({ next }) => {
        console.log("test enter");
        fadeInContent(next.container);
        animateContentIn();
        animateTextIn();
      },
    },
    {
      name: "to-overview",
      from: {
        namespace: ["detail", "trailer"],
      },
      to: {
        namespace: ["overview"],
      },
      once: ({ next }) => {
        fadeInContent(next.container);
      },
      leave: ({ current }) => {
        fadeOutContent(current.container);
      },
      enter: ({ next }) => {
        fadeInContent(next.container);
        showMovies();
        animateList();
        moveGlobe();
        changeBG();
      },
    },
  ],
});

const changeBG = () => {
  const bg = document.querySelector(".gradient-bg");
  bg.style.background = "linear-gradient(107.07deg, #29469a, #29245e)";
};

const showMovies = () => {
  data.movies.forEach((movie) => {
    makeListItem(movie);
  });
};

const makeListItem = (movie) => {
  const $li = document.createElement(`li`);
  $li.classList.add(`movie__item`);
  $li.addEventListener(`click`, handleClickList);
  $li.addEventListener(`mouseenter`, handleMouseOver);
  $li.dataset.id = movie.id;
  $li.innerHTML = `
      <a class="list__itemLink" href="${movie.pagelink}">
        <img class="movie__poster" src="./assets/img/${movie.poster}" width="154px" height="238px" alt="movies poster ${movie.title}">
        <div class="movie__info">
            <p class="movie__title">${movie.title}</p>
            <p class="movie__country">${movie.country}  <span class="movie__status">${movie.status}</span> </p>
        </div>
      </a>
    `;
  document.querySelector(`.movieList`).appendChild($li);
};

const handleMouseOver = (e) => {
  console.log("testlog");
  const soundHover = new Howl({
    src: ["./../assets/audio/hover.mp3"],
    volume: 0.5,
  });
  soundHover.play();
};

const handleClickList = (e) => {
  e.preventDefault();
  console.log(e);
  const clickedMovie = data.movies.find(
    (movie) => movie.id === parseInt(e.currentTarget.dataset.id)
  );

  // clickedMovie => store/model opslaan zodat ik dit in een andere file kan oproepen/gekend
  currentMovie.setMovie({
    id: clickedMovie.id,
    rotX: clickedMovie.rotX,
    rotY: clickedMovie.rotY,
    rotZ: clickedMovie.rotZ,
  });

  autorun(() => {
    console.log("autorun - list");
    console.log(currentMovie);
  });
};
