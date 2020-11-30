import currentMovie from './currentMovie.js';
import {decorate, observable, action, computed, configure} from 'mobx';

configure({enforceActions: 'observed'});
class Store {

  constructor() {
    this.currentMovie = [];
  }

  seed(data) {
    //this.messages = data;
    this.messages.push(...data);
  }

  loadMovies() {
    const jsonFile = "assets/data/list.json";
    const response = await fetch(jsonFile);
    const data = await response.json();

    movies.forEach(movie => {
        new Movie({})
    });

  }

  addMovie(content) {
    this.curentMovie.push(new currentMovie({id, long, lat}));
  }

}

decorate(Store, {
  curentMovie: observable,
  addMovie: action,
  seed: action
});

export default Store;
