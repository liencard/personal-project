import { makeAutoObservable, autorun } from "mobx";

class CurrentMovie {
  id;
  rotX;
  rotY;
  rotZ;

  constructor({ id, rotX, rotY, rotZ }) {
    this.id = id;
    this.rotX = rotX;
    this.rotY = rotY;
    this.rotZ = rotZ;
    makeAutoObservable(this);

    autorun(() => {
      console.log("auto run - model");
      //console.log(this.rotX);
      //RotX();
      //RotY();
      //RotZ();
    });
  }

  setMovie({ id, rotX, rotY, rotZ }) {
    this.id = id;
    this.rotX = rotX;
    this.rotY = rotY;
    this.rotZ = rotZ;
  }

  get RotX() {
    return rotX;
  }
  get RotY() {
    return rotY;
  }
  get RotZ() {
    return rotZ;
  }
}

const currentMovie = new CurrentMovie({
  id: 1,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
});

export default currentMovie;
