import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import gltfPath from "../assets/model/parasite.gltf";
// credits: used this model as a working base, https://sketchfab.com/3d-models/parasite-house-17af0a201ff74a9f9d84da8d13266076

let container;
let camera, renderer, scene;
let model;
let house_anim = gsap.timeline();

const creatScene = () => {
  container = document.querySelector(".scene-house");

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

  scene.rotation.set(0.2, -2, 0);
  camera.position.set(0.2, 0.3, 2.5);

  //scene.rotation.set(0.2, -0.3, 0);
  //camera.position.set(0.2, 0.3, 2.5);

  loadModel();
  window.addEventListener("resize", onWindowResize);

  render();
  animate();
};

const loadModel = () => {
  // ADD C4D model
  const loader = new GLTFLoader();

  model = new THREE.Object3D();

  loader.load(gltfPath, (gltf) => {
    model = gltf.scene;
    model.name = "house";
    model.position.set(0, 0, 0);
    model.scale.set(0.0005, 0.0005, 0.0005);

    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.material.emissive = child.material.color;
        child.material.emissiveMap = child.material.map;
      }
    });

    // Add gltf model to scene
    scene.add(model);
  });
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

const render = () => {
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
};

ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true,
});

const init = () => {
  creatScene();
};

init();

// ANIMATE TITLE
gsap.to(".detail__title", {
  x: -700,
  scrollTrigger: {
    trigger: ".section-two",
    start: "top bottom",
    end: "top center",
  },
});

// TEXT BLOKKEN
// TEXT - ONE
gsap.from(".one-wrapper", {
  x: -700,
  opacity: 0,
  duration: 2,
  scrollTrigger: {
    trigger: ".section-two",
    start: "top bottom",
    end: "top center",
  },
});

gsap.to(".one-wrapper", {
  x: -500,
  opacity: 0,
  scrollTrigger: {
    trigger: ".section-two",
    start: "top top",
    end: "top center",
  },
});

// TEXT - TWO
gsap.from(".two-wrapper", {
  x: 800,
  opacity: 0,
  duration: 2,
  scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top center",
  },
});

gsap.to(".two-wrapper", {
  x: 800,
  opacity: 0,
  scrollTrigger: {
    trigger: ".section-three",
    start: "top top",
    //end: "top top",
  },
});

// TEXT - THREE
gsap.from(".three-wrapper", {
  x: -800,
  opacity: 0,
  duration: 2,
  scrollTrigger: {
    trigger: ".section-four",
    start: "top center",
    end: "top top",
  },
});

// TEXT - FOUR
gsap.from(".four-wrapper", {
  y: 800,
  opacity: 0,
  duration: 2,
  scrollTrigger: {
    trigger: ".section-five",
    start: "top center",
    end: "top top",
  },
});

// ANIMATE LAST TITLE
gsap.from(".endnote", {
  x: -700,
  scrollTrigger: {
    trigger: ".section-six",
    start: "top bottom",
    end: "top center",
  },
});

// HOUSE ANIMATION
// Section 2
house_anim.to(scene.rotation, {
  y: -3,
  scrollTrigger: {
    trigger: ".section-two",

    endTrigger: ".section-four",
    end: "top bottom",
  },
});

house_anim.to(camera.position, {
  x: -0.7,
  z: 3,
  scrollTrigger: {
    trigger: ".section-two",

    start: "top bottom",
    end: "top top",
  },
});

// Section 3
house_anim.to(camera.position, {
  x: 0.8,
  scrollTrigger: {
    trigger: ".section-three",

    start: "top bottom",
    end: "top top",
  },
});

// Section 3
house_anim.to(scene.rotation, {
  z: -0.2,
  y: -2.1,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top bottom",
    end: "top top",
  },
});

house_anim.to(camera.position, {
  x: -0.5,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top center",
    end: "bottom bottom",
  },
});

// Section 5
house_anim.to(scene.rotation, {
  z: 0.2,
  y: -1.5,
  scrollTrigger: {
    trigger: ".section-five",

    start: "top bottom",
    end: "top top",
  },
});

house_anim.to(camera.position, {
  x: -3,
  scrollTrigger: {
    trigger: ".section-five",

    start: "top top",
    end: "bottom center",
  },
});
