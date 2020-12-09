//const { default: currentMovie } = require("./model/currentMovie");
import currentMovie from './model/currentMovie.js';
let movies = [];

const loadMovies = async () => {
  const jsonFile = 'assets/data/list.json';
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
        <img class="movie__poster" src="assets/img/${movie.poster}" width="154px" height="238px" alt="movies poster ${movie.title}">
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
  console.log(clickedMovie);

  //  clickedMovie => store/model opslaan zodat ik dit in een andere file kan oproepen/gekend
  currentMovie.updateMovie({
    id: clickedMovie.id,
    long: clickedMovie.long,
    lat: clickedMovie.lat,
  });
  //console.log(currentMovie);
};

const init = () => {
  loadMovies();
  // console.log(currentMovie);
};

init();
