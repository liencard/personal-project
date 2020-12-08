//import CurrentMovie from "./model/currentMovie.js";
import currentMovie from "./model/currentMovie.js";

import { autorun } from "mobx";
let movies = [];

const loadMovies = async () => {
  const jsonFile = "./src/assets/data/movies.json";
  const response = await fetch(jsonFile);
  const data = await response.json();

  movies = data.movies;
  showMovies(data.movies);
};

const showMovies = (movies) => {
  movies.forEach((movie) => {
    makeListItem(movie);
  });
};

const makeListItem = (movie) => {
  const $li = document.createElement(`li`);
  $li.classList.add(`list__item`);
  $li.addEventListener(`click`, handleClickList);
  $li.dataset.id = movie.id;
  $li.innerHTML = `
        <img class="movie__poster" src="./src/assets/img/${movie.poster}" width="154px" height="238px" alt="movies poster ${movie.title}">
        <div class="movie__info">
            <p class="movie__title">${movie.title}</p>
            <p class="movie__country">${movie.country}</p>
        </div>
    `;
  document.querySelector(`.list`).appendChild($li);
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
};

const init = () => {
  loadMovies();
};

init();
