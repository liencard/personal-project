let isPlaying = false;

let elems = document.querySelectorAll("video, audio");

const mute = (elem) => {
  elem.muted = true;
};

const unmute = (elem) => {
  elem.muted = false;
};

const audioToggle = () => {
  const toggle = document.querySelector(".icon__sound");
  if (isPlaying) {
    console.log("on");
    isPlaying = false;
    console.log(isPlaying);
    elems.forEach((elem) => unmute(elem));
    toggle.classList.add("icon__sound-on");
    toggle.classList.remove("icon__sound-off");
  } else {
    console.log("off");
    isPlaying = true;
    console.log(isPlaying);
    elems.forEach((elem) => mute(elem));
    toggle.classList.add("icon__sound-off");
    toggle.classList.remove("icon__sound-on");
  }
};

const init = () => {
  const audioButton = document.querySelector(".audio-trailer");
  audioButton.addEventListener("click", audioToggle);
};

init();
