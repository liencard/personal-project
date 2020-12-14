import currentMovie from "./model/currentMovie.js";
import data from "./../assets/data/movies.json";

import { gsap } from "gsap";
import { autorun } from "mobx";

let movies = data.movies;

const showMovies = () => {
  data.movies.forEach((movie) => {
    makeListItem(movie);
  });
};

const makeListItem = (movie) => {
  const $li = document.createElement(`li`);
  $li.classList.add(`movie__item`);
  $li.addEventListener(`click`, handleClickList);
  $li.dataset.id = movie.id;
  $li.innerHTML = `
      <a class="list__itemLink" href="./trailer.html">
        <img class="movie__poster" src="./assets/img/${movie.poster}" width="154px" height="238px" alt="movies poster ${movie.title}">
        <div class="movie__info">
            <p class="movie__title">${movie.title}</p>
            <p class="movie__country">${movie.country}</p>
        </div>
      </a>
    `;
  document.querySelector(`.movieList`).appendChild($li);
};

const handleClickList = (e) => {
  e.preventDefault();
  console.log(e);
  const clickedMovie = movies.find(
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

  goToDetailPage();
};

const goToDetailPage = () => {
  window.location.href = "trailer.html";
};

const animateList = () => {
  const tl = gsap.timeline();
  tl.addLabel("animateList");
  // LIST
  tl.from(
    ".overview__title",
    {
      duration: 0.5,
      x: -500,
    },
    "animateList"
  );

  tl.from(
    ".movie__poster",
    {
      duration: 0.5,
      scale: 0,
      stagger: 0.2,
      delay: 0.4,
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
      delay: 0.4,
    },
    "animateList"
  );

  tl.from(
    ".icon__menu",
    {
      duration: 0.2,
      scale: 0,
      opacity: 0,
      delay: 0.4,
    },
    "animateList"
  );

  tl.from(
    ".icon__sound",
    {
      duration: 0.2,
      scale: 0,
      opacity: 0,
      delay: 0.4,
    },
    "animateList"
  );
};

const init = () => {
  showMovies();
  animateList();
};

init();
