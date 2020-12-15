import * as THREE from "three";
import { WEBGL } from "./scripts/webgl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { fontHelvetiker } from "three/examples/fonts/helvetiker_bold.typeface.json";
import { gsap } from "gsap";
import { autorun } from "mobx";

import data from "./../assets/data/movies.json";
import currentMovie from "./model/currentMovie.js";
import gltfPath from "../assets/model/globe.gltf";

let container;
let camera, renderer, scene, controls;
let globe, group, marker;
let raycaster,
  mouse = { x: 0, y: 0 };
let markers = [];

if (WEBGL.isWebGLAvailable()) {
  container = document.createElement(`div`);
  container.classList.add(`container`);
  document.body.appendChild(container);

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.9;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // x = rotatie op er rechter op te kijken, z = dichtheid,
  camera.position.set(4, 0, 2);

  //Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  //OrbitControls
  controls = new OrbitControls(camera, container);
  controls.autoRotate = true;
  controls.autoRotateSpeed = +1.0;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 5.5;

  // GROUP - Globe & Markers
  group = new THREE.Group();
  scene.add(group);

  // lighting
  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 100, 100);
  spotLight.castShadow = true;
  scene.add(spotLight);
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}

const render = () => {
  renderer.render(scene, camera);
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

const onMouseClick = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  console.log(intersects);

  for (let i = 0; i < intersects.length; i++) {
    const tl = gsap.timeline();
    tl.addLabel("zoomGlobe");
    // GLOBE
    tl.to(
      globe.scale,
      {
        duration: 2,
        x: 15,
        y: 15,
        z: 15,
        onComplete: goToDetailPage,
      },
      "zoomGlobe"
    );
    tl.to(
      globe.position,
      {
        duration: 1.5,
        x: -1,
        y: -0.6,
        z: 0,
      },
      "zoomGlobe"
    );

    // MARKERS
    markers.forEach((marker) => {
      gsap.fromTo(
        marker.scale,
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 0, z: 0, duration: 0.3 }
      );
    }, "zoomGlobe");

    // LIST
    tl.to(
      ".movie__item",
      {
        duration: 1,
        x: -500,
        stagger: -0.2,
      },
      "zoomGlobe"
    );

    tl.to(
      ".overview__title",
      {
        duration: 0.5,
        x: -500,
        delay: 0.8,
      },
      "zoomGlobe"
    );

    tl.to(
      ".active__movie",
      {
        duration: 0.5,
        x: 500,
        delay: 0.8,
      },
      "zoomGlobe"
    );

    document.body.style.background = "#29245e";
    controls.autoRotate = false;
  }
};

const goToDetailPage = () => {
  window.location.href = "trailer.html";
};

const onMouseMove = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    findClickedMovie(intersects[i]);
  }
};

const findClickedMovie = (intersectData) => {
  const clickedMovie = data.movies.find(
    (movie) => movie.posX === intersectData.object.position.x
  );

  // clickedMovie => store/model opslaan zodat ik dit in een andere file kan oproepen/gekend
  currentMovie.setMovie({
    id: clickedMovie.id,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  autorun(() => {
    console.log("auto run - globe");
  });

  const activeMovieTitle = document.querySelector(".active__movie-title");
  activeMovieTitle.textContent = "";
  activeMovieTitle.textContent = clickedMovie.title;
  const activeMovieCountry = document.querySelector(".active__movie-country");
  activeMovieCountry.textContent = "";
  activeMovieCountry.textContent = clickedMovie.country;
  const activeMovieStatus = document.querySelector(".active__movie-status");
  activeMovieStatus.textContent = "";
  activeMovieStatus.textContent = clickedMovie.status;
};

const onClickIntro = () => {
  const tl = gsap.timeline();
  tl.addLabel("moveGlobe");

  // GLOBE ANIMATION
  tl.to(
    globe.position,
    {
      duration: 1.5,
      repeat: 0,
      x: 0,
      y: -0.3,
      z: 0,
      ease: "power3.in",
      onComplete: createMarkers,
    },
    "moveGlobe"
  );

  tl.to(
    globe.scale,
    { duration: 1.5, ease: "power3.in", x: 1.3, y: 1.3, z: 1.3 },
    "moveGlobe"
  );
};

const createMarkers = () => {
  data.movies.forEach((movie) => {
    let material = new THREE.MeshPhongMaterial({
      color: 0x0bb4fa,
    });
    marker = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.03, 32, 32),
      material
    );
    marker.name = "marker";
    scene.add(marker);
    console.log(marker);
    marker.position.set(movie.posX, movie.posY, movie.posZ);
    markers.push(marker);
  });
};

const loadGlobe = () => {
  // load C4D file
  const loader = new GLTFLoader();
  loader.load(gltfPath, (gltf) => {
    globe = gltf.scene;
    globe.name = "globe";

    if (window.location.pathname === "/") {
      globe.scale.set(5, 5, 5);
      globe.position.set(-1, -5.4, 0);
    } else {
      globe.position.set(0, -0.4, 0);
      globe.scale.set(1.4, 1.4, 1.4);
      createMarkers();
    }

    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.material.emissive = child.material.color;
        child.material.emissiveMap = child.material.map;
      }
    });

    scene.add(globe);
  });
};

const init = () => {
  loadGlobe();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  container.addEventListener("click", onMouseClick, false);
  container.addEventListener("mousemove", onMouseMove, false);

  if (window.location.pathname === "/") {
    const button = document.querySelector(".btn__intro");
    button.addEventListener("click", onClickIntro, false);
  }

  render();
  animate();
};

init();
