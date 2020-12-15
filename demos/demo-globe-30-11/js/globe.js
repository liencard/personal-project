var DAT = DAT || {};
import { ObjectControls } from '../js/ObjectControls.js';
import currentMovie from './model/currentMovie.js';

DAT.Globe = function (container) {
  // getal uit Data omzetten naar bruikbaar kleur
  var colorFn = function (hue) {
    const c = new THREE.Color();
    c.setHSL(hue, 1.0, 0.5);
    return c;
  };

  const imgDir = 'assets/img/';

  const Shaders = {
    earth: {
      uniforms: {
        texture: { type: 't', value: null },
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        'vNormal = normalize( normalMatrix * normal );',
        'vUv = uv;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
        'vec3 diffuse = texture2D( texture, vUv ).xyz;',
        'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
        'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
        'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}',
      ].join('\n'),
    },
  };

  let camera, scene, renderer, projector, group;
  let sphere, point, text;
  let pointMesh = [],
    textMesh = [];
  let circleMesh,
    focusCircles = [],
    innerRadius;
  let movies = [],
    activeMovie = -1;

  const overRenderer = false;
  const curZoomSpeed = 0,
    zoomSpeed = 50;
  const spinInterval = 100;
  let mouse = { x: 0, y: 0 },
    mouseOnDown = { x: 0, y: 0 };
  let mouseDownOn = false;
  let rotation = { x: 0, y: 0 };
  let target = { x: (Math.PI * 3) / 2, y: Math.PI / 6.0 },
    targetOnDown = { x: 0, y: 0 };
  let distance = 10000,
    distanceTarget = 10000;
  let delayTimer, focusTimer, spinTimer;
  let controls;

  function init() {
    console.log(currentMovie);

    let shader, uniforms, material;
    let w, h;
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;

    // camera & scene
    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    camera.position.z = 1500;
    camera.position.y = 0;
    camera.position.x = -200;
    window.camera = camera;

    projector = new THREE.Projector();
    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add(group);

    // ----- Globe
    let geometry = new THREE.SphereGeometry(180, 32, 32);

    shader = Shaders['earth'];
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms['texture'].value = THREE.ImageUtils.loadTexture(
      imgDir + 'globe-darkblue.jpeg'
    );

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });

    sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.y = Math.PI;
    group.add(sphere);
    sphere.position.setZ(200);

    // ------ Hollow-circle && focus-circle MARKER
    geometry = new THREE.Geometry();
    for (let i = 0; i <= 32; i += 1) {
      const x = Math.cos((i / 32) * 2 * Math.PI);
      const y = Math.sin((i / 32) * 2 * Math.PI);
      const vertex = new THREE.Vector3(x, y, 0);
      geometry.vertices.push(vertex);
    }
    material = new THREE.LineBasicMaterial({
      color: 0xcccccc,
      linewidth: 2,
    });
    circleMesh = new THREE.Line(geometry, material);
    for (let i = 0; i < 3; i += 1) {
      focusCircles.push(circleMesh.clone());
    }
    for (let i = 0; i < 3; i += 1) {
      focusCircles[i].visible = false;
      scene.add(focusCircles[i]);
    }

    // auto-spin
    spinTimer = setInterval(function () {
      rotate(0.005);
    }, spinInterval);

    // ------ Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    //renderer.domElement.style.position = 'absolute';

    container.appendChild(renderer.domElement);

    container.addEventListener('mousedown', onMouseDown, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mousewheel', onMouseWheel, false);
    container.addEventListener(
      'mouseover',
      function () {
        overRenderer = true;
      },
      false
    );
    container.addEventListener(
      'mouseout',
      function () {
        overRenderer = false;
        clearActiveMovie();
      },
      false
    );

    document.addEventListener('keydown', onDocumentKeyDown, false);
    window.addEventListener('resize', onWindowResize, false);

    controls = new ObjectControls(camera, renderer.domElement, group);
    controls.setDistance(8, 200); // set min - max distance for zoom
    controls.setZoomSpeed(0.5); // set zoom speed
    controls.enableVerticalRotation();
    controls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4);
    controls.setRotationSpeed(0.05);
  }

  // DATA TOEVOEGEN UIT JSON
  this.addData = function (data) {
    let movie, lat, lng, color, uri, i, colorFnWrapper;

    colorFnWrapper = function (data, i) {
      return colorFn(data[i][3]);
    };

    // Loop over array en ken waardes toe
    for (let i = 0; i < data.length; i += 1) {
      movie = data[i][0];
      lat = data[i][1];
      lng = data[i][2];
      color = colorFnWrapper(data, i);
      uri = data[i][4];

      addMovie(lat, lng, movie, color, uri);
      pointMesh.push(point);
      textMesh.push(text);
      group.add(point);
      point.position.setZ(200);
      group.add(text);
    }
  };

  // MARKER TOEVOEGEN ADHV OPGEHAALDE DATA
  function addMovie(lat, lng, movie, color, uri) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: THREE.FaceColors,
    });

    const phi = ((90 - lat) * Math.PI) / 180,
      theta = ((180 - lng) * Math.PI) / 180;

    const point3d = new THREE.SphereGeometry(5, 10, 10);
    point = new THREE.Mesh(point3d, material);

    point.position.x = 180 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 180 * Math.cos(phi);
    point.position.z = 180 * Math.sin(phi) * Math.sin(theta);
    point.lookAt(sphere.position);

    for (let i = 0; i < point.geometry.faces.length; i++) {
      point.geometry.faces[i].color = color;
    }

    movies.push({ position: point.position.clone(), name: movie, uri: uri });

    // text
    const text3d = new THREE.TextGeometry(movie, {
      size: 5,
      height: 0.5, // thickness of the text
      curveSegments: 2,
      font: 'helvetiker',
    });
    text = new THREE.Mesh(text3d, material);

    text.position.x = 200 * Math.sin(phi) * Math.cos(theta - Math.PI / 120);
    text.position.y = 200 * Math.cos(phi);
    text.position.z = 200 * Math.sin(phi) * Math.sin(theta - Math.PI / 120);
    text.position.multiplyScalar(1.001);
    text.scale.x = 0;
    text.scale.y = 0;
    text.updateMatrix();

    text.lookAt(text.position.clone().multiplyScalar(2));

    for (let i = 0; i < text.geometry.faces.length; i++) {
      text.geometry.faces[i].color = color;
    }

    text.visible = false;
  }

  function objectPick(event) {
    const vector = new THREE.Vector3(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    projector.unprojectVector(vector, camera);
    const raycaster = new THREE.Raycaster(
      camera.position,
      vector.sub(camera.position).normalize()
    );
    const intersects = raycaster.intersectObject(sphere);

    if (intersects.length > 0) {
      return intersects[0].point;
    }

    return null;
  }

  function findClosestMovie(point) {
    point.sub(sphere.position).normaliz;
    let movie;
    let index = -1,
      best,
      dist;

    for (let i = 0; i < movies.length; i += 1) {
      movie = movies[i].position.clone();
      movie.sub(sphere.position).normalize();
      dist = movie.dot(point);
      if (index === -1 || dist > best) {
        index = i;
        best = dist;
      }
    }

    if (index === -1 || best < 0.9998) {
      return -1;
    }
    return index;
  }

  function clearActiveMovie() {
    if (activeMovie !== -1) {
      const saved = activeMovie;
      const tween = new TWEEN.Tween({ scalePoint: 2, scaleText: 1 })
        .to({ scalePoint: 1, scaleText: 0 }, 200)
        .easing(TWEEN.Easing.Cubic.EaseOut)
        .onUpdate(function () {
          pointMesh[saved].scale.x = this.scalePoint;
          pointMesh[saved].scale.y = this.scalePoint;
          textMesh[saved].scale.x = this.scaleText;
          textMesh[saved].scale.y = this.scaleText;
          pointMesh[saved].updateMatrix();
          textMesh[saved].updateMatrix();
        })
        .onComplete(function () {
          textMesh[saved].visible = false;
        })
        .start();

      for (let i = 0; i < 3; i += 1) {
        focusCircles[i].visible = false;
        focusCircles[i].scale.x = 1;
        focusCircles[i].scale.y = 1;
      }
      clearInterval(focusTimer);
    }
    activeMovie = -1;
  }

  function setActiveMovie(newMovie) {
    activeMovie = newMovie;
    if (newMovie !== -1) {
      textMesh[newMovie].visible = true;
      const tween = new TWEEN.Tween({ scalePoint: 1, scaleText: 0 })
        .to({ scalePoint: 2, scaleText: 1 }, 200)
        .easing(TWEEN.Easing.Cubic.EaseIn)
        .onUpdate(function () {
          pointMesh[newMovie].scale.x = this.scalePoint;
          pointMesh[newMovie].scale.y = this.scalePoint;
          textMesh[newMovie].scale.x = this.scaleText;
          textMesh[newMovie].scale.y = this.scaleText;
          pointMesh[newMovie].updateMatrix();
          textMesh[newMovie].updateMatrix();
        })
        .start();

      for (let i = 0; i < 3; i += 1) {
        focusCircles[i].position = movies[activeMovie].position;
        focusCircles[i].lookAt(sphere.position);
      }
      innerRadius = 0;
      focusTimer = setInterval(function () {
        const radius = innerRadius;
        for (let i = 0; i < 3; i += 1) {
          if (radius <= 12) {
            focusCircles[i].scale.x = radius / 4 + 1;
            focusCircles[i].scale.y = radius / 4 + 1;
          }
          radius += 3;
        }
        innerRadius += 1;
        if (innerRadius >= 12) {
          innerRadius = 0;
        }
      }, 120);
      for (let i = 0; i < 3; i += 1) {
        focusCircles[i].visible = true;
      }
    }
  }

  function onMouseDown(event) {
    event.preventDefault();

    // container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = -event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = 'move';

    mouseDownOn = true;

    console.log(clickedMovie);
    console.log('test');
  }

  function onMouseMove(event) {
    if (mouseDownOn === true) {
      mouse.x = -event.clientX;
      mouse.y = event.clientY;

      let zoomDamp = distance / 1000;

      target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
      target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

      target.y = target.y > Math.PI / 2 ? Math.PI / 2 : target.y;
      target.y = target.y < -Math.PI / 2 ? -Math.PI / 2 : target.y;

      clearActiveMovie();
    } else {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(function () {
        const intersectPoint = objectPick(event);
        if (intersectPoint !== null) {
          const movie = findClosestMovie(intersectPoint);
          if (movie !== activeMovie) {
            clearActiveMovie();
            setActiveMovie(movie);
          }
        }
      }, 200);
    }
  }

  function onMouseUp(event) {
    // container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';

    if (activeMovie != -1) {
      window.open(movies[activeMovie].uri);
    }
    mouseDownOn = false;
  }

  function onMouseOut(event) {
    //  container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);

    mouseDownOn = false;
  }

  function onMouseWheel(event) {
    event.preventDefault();
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 38:
        zoom(100);
        event.preventDefault();
        break;
      case 40:
        zoom(-100);
        event.preventDefault();
        break;
      case 37:
        rotate(1);
        event.preventDefault();
        break;
      case 39:
        rotate(-1);
        event.preventDefault();
        break;
    }
  }

  function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function zoom(delta) {
    distanceTarget -= delta;
    distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
    distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
  }

  function rotate(delta) {
    target.x -= delta;
  }

  function animate() {
    requestAnimationFrame(animate);

    zoom(curZoomSpeed);

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;
    distance += (distanceTarget - distance) * 0.3;

    renderer.render(scene, camera);

    //console.log(currentMovie);
    //console.log('test');
  }

  init();

  this.animate = animate;
  this.renderer = renderer;
  this.scene = scene;

  return this;
};

export default DAT;
