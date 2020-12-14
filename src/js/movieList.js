import currentMovie from "./model/currentMovie.js";
import data from "./../assets/data/movies.json";

import barba from "@barba/core";
import { gsap } from "gsap";
import { autorun } from "mobx";

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

const moveGlobe = () => {
  gsap.from(".container", {
    duration: 0.5,
    x: -300,
  });
};

barba.init({
  sync: true,

  transitions: [
    {
      name: "home",
      async leave(data) {
        fadeOutContent(data);
        moveGlobe;
      },
      async enter(data) {
        fadeInContent(data);
        showMovies();
      },
      async afterEnter() {
        //
      },
    },
  ],
});
