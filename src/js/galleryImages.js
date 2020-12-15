import * as PIXI from "pixi.js";

import backgroundShader from "./shaders/backgroundFragment.glsl";
import stageShader from "./shaders/stageFragment.glsl";

import data from "./gallery.json";

let imagesArray = [];
imagesArray = data;

console.log(imagesArray[0][0]);
console.log(Math.floor(Math.random() * imagesArray.length));

const gallery = () => {
  // Class to generate a random masonry layout, using a square grid as base
  class Grid {
    constructor(gridSize, gridColumns, gridRows, gridMin) {
      this.gridSize = gridSize;
      this.gridColumns = gridColumns;
      this.gridRows = gridRows;
      this.gridMin = gridMin;
      this.rects = [];
      this.currentRects = [
        { x: 0, y: 0, w: this.gridColumns, h: this.gridRows },
      ];
    }

    // Takes the first rectangle on the list, and divides it in 2 more rectangles if possible
    splitCurrentRect() {
      if (this.currentRects.length) {
        const currentRect = this.currentRects.shift();
        const cutVertical = currentRect.w > currentRect.h;
        const cutSide = cutVertical ? currentRect.w : currentRect.h;
        const cutSize = cutVertical ? "w" : "h";
        const cutAxis = cutVertical ? "x" : "y";
        if (cutSide > this.gridMin * 2) {
          const rect1Size = randomInRange(this.gridMin, this.gridMin);

          const rect1 = Object.assign({}, currentRect, {
            [cutSize]: rect1Size,
          });
          const rect2 = Object.assign({}, currentRect, {
            [cutAxis]: currentRect[cutAxis] + rect1Size,
            [cutSize]: currentRect[cutSize] - rect1Size,
          });
          this.currentRects.push(rect1, rect2);
        } else {
          this.rects.push(currentRect);
          this.splitCurrentRect();
        }
      }
    }

    // Call `splitCurrentRect` until there is no more rectangles on the list
    // Then return the list of rectangles
    generateRects() {
      while (this.currentRects.length) {
        this.splitCurrentRect();
      }
      return this.rects;
    }
  }

  // Generate a random integer in the range provided
  function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const view = document.querySelector(".images-canvas");
  // Loaded resources will be here
  const resources = PIXI.Loader.shared.resources;
  // Target for pointer. If down, value is 1, else value is 0
  let pointerDownTarget = 0;
  let pointerStart = new PIXI.Point();
  let pointerDiffStart = new PIXI.Point();
  let width, height;
  let container, background;
  let uniforms;
  let app;
  let diffX, diffY;

  // Variables and settings for grid
  const gridSize = 120;
  const gridMin = 3;
  const imagePadding = 15;
  let gridColumnsCount, gridRowsCount, gridColumns, gridRows, grid;
  let widthRest, heightRest, centerX, centerY;
  let rects, images, imagesUrls;

  // Set dimensions
  function initDimensions() {
    width = window.innerWidth;
    height = window.innerHeight;
    diffX = 0;
    diffY = 0;
  }

  // Set initial values for uniforms
  function initUniforms() {
    uniforms = {
      uResolution: new PIXI.Point(width, height),
      uPointerDiff: new PIXI.Point(),
      uPointerDown: pointerDownTarget,
    };
  }

  // Initialize the random grid layout
  function initGrid() {
    gridColumnsCount = Math.ceil(width / gridSize);
    gridRowsCount = Math.ceil(height / gridSize);
    gridColumns = gridColumnsCount * 4;
    gridRows = gridRowsCount * 4;
    grid = new Grid(gridSize, gridColumns, gridRows, gridMin);
    // Calculate the center position for the grid in the viewport
    widthRest = Math.ceil(gridColumnsCount * gridSize - width);
    heightRest = Math.ceil(gridRowsCount * gridSize - height);
    centerX = (gridColumns * gridSize) / 2 - (gridColumnsCount * gridSize) / 2;
    centerY = (gridRows * gridSize) / 2 - (gridRowsCount * gridSize) / 2;
    rects = grid.generateRects();
    images = [];
    imagesUrls = {};
  }

  // Init the PixiJS Application
  function initApp() {
    // Create a PixiJS Application, using the view (canvas) provided
    app = new PIXI.Application({ view });
    app.renderer.autoDensity = true;
    app.renderer.resize(width, height);

    // Set the distortion filter for the entire stage
    const stageFragmentShader = stageShader;
    const stageFilter = new PIXI.Filter(
      undefined,
      stageFragmentShader,
      uniforms
    );
    app.stage.filters = [stageFilter];
  }

  // Init the gridded background
  function initBackground() {
    background = new PIXI.Sprite();
    background.width = width;
    background.height = height;
    const backgroundFragmentShader =
      resources["./shaders/backgroundFragment.glsl"].data;
    const backgroundFilter = new PIXI.Filter(
      undefined,
      backgroundFragmentShader,
      uniforms
    );
    background.filters = [backgroundFilter];
    app.stage.addChild(background);
  }

  // Initialize a Container element for solid rectangles and images
  function initContainer() {
    container = new PIXI.Container();
    app.stage.addChild(container);
  }

  // Load texture for an image, giving its index
  function loadTextureForImage(index) {
    const image = images[index];
    image.width = 300;
    image.height = 300;
    const url = imagesArray[Math.floor(Math.random() * imagesArray.length)][0];
    // Get the corresponding rect, to store more data needed (it is a normal Object)
    const rect = rects[index];

    image.texture = PIXI.Texture.from(url);
    rect.loaded = true;
  }

  // Add solid rectangles and images
  function initRectsAndImages() {
    rects.forEach((rect) => {
      // Create a new Sprite element for each image
      const image = new PIXI.Sprite();
      image.x = rect.x * gridSize;
      image.y = rect.y * gridSize;
      image.width = rect.w * gridSize - imagePadding;
      image.height = rect.h * gridSize - imagePadding;
      image.alpha = 0;
      images.push(image);
    });
    images.forEach((image) => {
      container.addChild(image);
    });
  }

  // Check if rects intersects with the viewport
  // and loads corresponding image
  function checkRectsAndImages() {
    rects.forEach((rect, index) => {
      const image = images[index];
      if (rectIntersectsWithViewport(rect)) {
        if (!rect.discovered) {
          rect.discovered = true;
          loadTextureForImage(index);
        }
        // If image is loaded, increase alpha if possible
        if (rect.loaded && image.alpha < 1) {
          image.alpha += 0.01;
        }
      }
    });
  }

  // Check if a rect intersects the viewport
  function rectIntersectsWithViewport(rect) {
    return (
      rect.x * gridSize + container.x <= width &&
      0 <= (rect.x + rect.w) * gridSize + container.x &&
      rect.y * gridSize + container.y <= height &&
      0 <= (rect.y + rect.h) * gridSize + container.y
    );
  }

  function initEvents() {
    // Make stage interactive, so it can listen to events
    app.stage.interactive = true;

    app.stage
      .on("pointerdown", onPointerDown)
      .on("pointerup", onPointerUp)
      .on("pointerupoutside", onPointerUp)
      .on("pointermove", onPointerMove);
  }

  // On pointer down, save coordinates and set pointerDownTarget, initialised r68??
  function onPointerDown(e) {
    console.log("down");
    const { x, y } = e.data.global;
    pointerDownTarget = 1;
    pointerStart.set(x, y);
    pointerDiffStart = uniforms.uPointerDiff.clone();
  }

  // On pointer up, set pointerDownTarget
  function onPointerUp() {
    console.log("up");
    pointerDownTarget = 0;
  }

  // On pointer move, calculate coordinates diff
  function onPointerMove(e) {
    const { x, y } = e.data.global;
    if (pointerDownTarget) {
      diffX = pointerDiffStart.x + (x - pointerStart.x);
      diffY = pointerDiffStart.y + (y - pointerStart.y);
      diffX =
        diffX > 0
          ? Math.min(diffX, centerX + imagePadding)
          : Math.max(diffX, -(centerX + widthRest));
      diffY =
        diffY > 0
          ? Math.min(diffY, centerY + imagePadding)
          : Math.max(diffY, -(centerY + heightRest));
    }
  }

  // Init everything
  function init() {
    initDimensions();
    initUniforms();
    initGrid();
    initApp();
    initBackground();
    initContainer();
    initRectsAndImages();
    initEvents();

    // Animation loop
    app.ticker.add(() => {
      uniforms.uPointerDown +=
        (pointerDownTarget - uniforms.uPointerDown) * 0.075;
      uniforms.uPointerDiff.x += (diffX - uniforms.uPointerDiff.x) * 0.2;
      uniforms.uPointerDiff.y += (diffY - uniforms.uPointerDiff.y) * 0.2;
      // Set position for the container
      container.x = uniforms.uPointerDiff.x - centerX;
      container.y = uniforms.uPointerDiff.y - centerY;
      // Check rects and load/cancel images as needded
      checkRectsAndImages();
    });
  }

  function clean() {
    app.ticker.stop();

    app.stage
      .off("pointerdown", onPointerDown)
      .off("pointerup", onPointerUp)
      .off("pointerupoutside", onPointerUp)
      .off("pointermove", onPointerMove);

    rects.forEach((rect) => {
      if (rect.discovered && !rect.loaded) {
        rect.controller.abort();
      }
    });
  }

  let resizeTimer;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      clean();
      init();
    }, 200);
  }

  window.addEventListener("resize", onResize);

  // Load resources, then init the app
  PIXI.Loader.shared
    .add(["./shaders/stageFragment.glsl", "./shaders/backgroundFragment.glsl"])
    .load(init);
};

gallery();
