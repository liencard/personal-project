import { makeObservable, observable, action } from "mobx";

class currentMovie {
  constructor({id, title, country, long, lat, poster}) {
    this.id = id;
    this.title = title;
    this.country = country;
    this.long = long;
    this.lat = lat;
    this.poster = poster;
  }


}

makeObservable(currentMovie, {
   name: observable,
   title: observable,
   country: observable,
   long: observable,
   lat: observable,
   poster: observable
});

export default currentMovie;