import * as THREE from "three";
import { WEBGL } from "./scripts/webgl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import { autorun } from "mobx";

import data from "./../assets/data/movies.json";
//import CurrentMovie from "./model/currentMovie.js";
import currentMovie from "./model/currentMovie.js";
import gltfPath from "../assets/model/globe.gltf";

let container;
let camera, renderer, scene, controls;
let globe, group, sphere;
let raycaster,
  mouse = { x: 0, y: 0 };

if (WEBGL.isWebGLAvailable()) {
  container = document.getElementById("container");

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.9;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(4, 0, 5);

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
  controls.minDistance = 5;
  controls.maxDistance = 6;
  //controls.target = new THREE.Vector3(-0.2, 0, 0);

  // GROUP - Globe & Markers
  group = new THREE.Group();
  scene.add(group);
  group.position.set(1, -0.3, 0);

  // lighting
  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(200, 200, 200);
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

const raycast = (e) => {
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
    console.log(currentMovie);

    // console.log(clickedMovie.rotX);

    // camera.position.x = currentMovie.RotX();
    // camera.position.y = currentMovie.RotY();
    // camera.position.z = currentMovie.RotZ();
  });
};

const onClickIntro = () => {
  gsap.to(globe.position, {
    duration: 3,
    repeat: 0,
    x: 0.7,
    y: -0.2,
    z: 0,
  });

  gsap.to(globe.scale, { duration: 3, x: 1.3, y: 1.3, z: 1.3 });

  gsap.to(".content", { duration: 2, x: 0, y: -600, z: 0 });

  document.querySelector(".overview").style.display = "block";

  gsap.from(".overview__title", { duration: 2, opacity: 0, delay: 2 });

  gsap.from(".list__item", {
    duration: 0.5,
    x: -300,
    opacity: 0,
    delay: 2,
    stagger: 0.2,
    force3D: true,
  });
};

const init = () => {
  // load C4D file
  const loader = new GLTFLoader();
  loader.load(gltfPath, (gltf) => {
    globe = gltf.scene;
    globe.scale.set(5, 5, 5);
    globe.position.set(-0.5, -5.4, 0);

    //globe.scale.set(1.4, 1.4, 1.4);

    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.material.emissive = child.material.color;
        child.material.emissiveMap = child.material.map;
      }
    });

    scene.add(globe);
  });

  // MARKERS
  data.movies.forEach((movie) => {
    let material = new THREE.MeshPhongMaterial({
      color: 0x0bb4fa,
    });
    let sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1, 32, 32),
      material
    );
    scene.add(sphere);
    sphere.position.set(movie.posX, movie.posY, movie.posZ);
  });

  raycaster = new THREE.Raycaster();
  container.addEventListener("click", raycast, false);

  // camera.position.x = 0;
  // camera.position.y = 5;
  // camera.position.z = 5;

  const button = document.querySelector("button");
  button.addEventListener("click", onClickIntro, false);

  render();
  animate();
};

init();
