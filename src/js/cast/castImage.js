import { gsap } from "gsap";
import FotoItem from "./fotoItem";
import { Howl, Howler } from "howler";

const init = () => {
  const listItems = document.querySelectorAll(".list__item");

  const animatableProperties = {
    // translationX
    tx: { previous: 0, current: 0, amt: 0.08 },
    // translationY
    ty: { previous: 0, current: 0, amt: 0.08 },
    // Rotation angle
    rotation: { previous: 0, current: 0, amt: 0.08 },
    // CSS filter (brightness) value
    brightness: { previous: 1, current: 1, amt: 0.08 },
  };

  let ListImages = [];
  listItems.forEach((item, pos) =>
    ListImages.push(new FotoItem(item, pos, animatableProperties))
  );

  // audio
  listItems.forEach((item) => {
    console.log(item);
    item.addEventListener("mouseenter", handlePlay);
  });
};

const handlePlay = (e) => {
  const soundHover = new Howl({
    src: ["./../../assets/audio/hover.mp3"],
    volume: 0.5,
  });
  soundHover.play();
};

init();
