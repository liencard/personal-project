////require {makeObservable, observable, action} from "https://unpkg.com/mobx/lib/mobx.umd.js";
//var { makeObservable, observable, action } = require("https://unpkg.com/mobx/lib/mobx.umd.js");
//import {makeObservable, observable, action} from 'mobx';
import { makeObservable, observable, action } from 'node:mobx';

class CurrentMovie {
  constructor({ id, long, lat }) {
    this.id = id;
    this.long = long;
    this.lat = lat;
  }

  updateMovie({ id, long, lat }) {
    this.id = id;
    this.long = long;
    this.lat = lat;
  }
}

// makeObservable(currentMovie, {
//    id: observable,
//    long: observable,
//    lat: observable,
//    updateMovie: action
// });

const currentMovie = new CurrentMovie({ id: 1, long: 33, lat: 22 });

export default currentMovie;
