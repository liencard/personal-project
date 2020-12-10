import * as THREE from "three";
import { WEBGL } from "./scripts/webgl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
//import gltfPath from "../assets/model/house/scene.gltf";
import gltfPath from "../assets/model/parasite3.gltf";

let container;
let camera;
let renderer;
let scene;
let model;

const init = () => {
  container = document.querySelector(".scene-one");

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.9;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  //Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  // lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(200, 200, 200);
  spotLight.castShadow = true;
  scene.add(spotLight);

  var spotLight2 = new THREE.SpotLight(0xffffff);
  spotLight2.position.set(-200, 50, -200);
  scene.add(spotLight2);

  function render() {
    renderer.render(scene, camera);
  }

  // ADD C4D model
  const loader = new GLTFLoader();

  model = new THREE.Object3D();

  loader.load(gltfPath, (gltf) => {
    model = gltf.scene;
    model.name = "house";

    model.position.set(0, 0, 0);
    model.scale.set(0.0005, 0.0005, 0.0005);

    // gltf.scene.traverse(function (child) {
    //   if (child.isMesh) {
    //     child.material.emissive = child.material.color;
    //     child.material.emissiveMap = child.material.map;
    //   }
    // });

    // Add gltf model to scene
    scene.add(model);
  });

  animate();
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

gsap.registerPlugin(ScrollTrigger);

scene.rotation.set(0, 1.5, 0);
camera.position.set(0.2, 0.5, 3);

ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true,
});

let house_anim = gsap.timeline();

// Full Height

gsap.to(".one-wrapper", {
  x: 700,
  scrollTrigger: {
    trigger: ".section-two",
    start: "top bottom",
    end: "top center",
  },
});

gsap.from(".two-wrapper", {
  x: -600,
  scrollTrigger: {
    trigger: ".section-two",
    start: "top center",
    end: "top top",
  },
});

// gsap.from(".two-wrapper", {
//   x: -600,
//   scrollTrigger: {
//     trigger: ".section-three",
//     start: "top bottom",
//     end: "top center",
//   },
// });

house_anim.to(scene.rotation, {
  y: 4.79,
  scrollTrigger: {
    trigger: ".section-two",

    endTrigger: ".section-four",
    end: "top bottom",
  },
});

// Slide 2

house_anim.to(camera.position, {
  x: -0.1,
  scrollTrigger: {
    trigger: ".section-two",

    start: "top bottom",
    end: "top top",
  },
});

// Slide 3

house_anim.to(scene.rotation, {
  z: -1.4,
  scrollTrigger: {
    trigger: ".section-three",

    start: "top bottom",
    end: "top top",
  },
});

// // Slide 4

house_anim.to(scene.rotation, {
  z: 0.02,
  y: 3.1,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top bottom",
    end: "top top",
  },
});

house_anim.to(camera.position, {
  x: 0.16,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top top",
    end: "bottom top",
  },
});
