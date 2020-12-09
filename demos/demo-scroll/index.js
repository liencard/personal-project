	function addModelToBG() {

		//Variables for setup

		let container;
		let camera;
		let renderer;
		let scene;
		let box;


		function init() {

			container = document.querySelector(".scene.one");

			//Create scene
			scene = new THREE.Scene();

			const fov = 35;
			const aspect = container.clientWidth/container.clientHeight;
			const near = 0.9;
			const far = 1000;

			//Camera setup
			camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


			//Renderer
			renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
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
			const gltfLoader = new THREE.GLTFLoader();

			model = new THREE.Object3D();

			gltfLoader.load('./house/house-test.gltf', (gltf)=> {

					model = gltf.scene;
					model.name = 'model';

					// Add gltf model to scene
					scene.add(model);

					model.position.set(0, 0, 0);
					model.scale.set(.01, .01, .01);
				}
			);
			animate();

		}


		function animate() {
			requestAnimationFrame(animate);      
			renderer.render(scene, camera);
		}

		init();

		function onWindowResize() {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}

		window.addEventListener("resize", onWindowResize);


    


	  gsap.registerPlugin(ScrollTrigger);
    
    
    scene.rotation.set(0, 1.88, 0)
    camera.position.set(2, 0, 5)
    
    
    ScrollTrigger.defaults({
      immediateRender: false,
      ease: "power1.inOut",
      scrub: true
    });
    

		let house_anim = gsap.timeline()
    

		// Full Height

		house_anim.to(scene.rotation, { y: 4.79, scrollTrigger: {
      
			trigger: ".section-two",

			endTrigger: ".section-four",
			end: "top bottom",      
      
    }})


		// Slide 2

		house_anim.to(camera.position, { x: -0.1, scrollTrigger: {
      
			trigger: ".section-two",
			
			start: "top bottom",
			end: "top top",
      
    }}) 
    
    
		
		// Slide 3
		
		house_anim.to(scene.rotation, { z: -1.4, scrollTrigger: {
      
			trigger: ".section-three",

			start: "top bottom",
			end: "top top",
      
    }})

		


		// // Slide 4 
		
		house_anim.to(scene.rotation, { z: 0.02, y: 3.1, scrollTrigger: {
      
			trigger: ".section-four",

			start: "top bottom",
			end: "top top",
      
    }})
       
    
		
		house_anim.to(camera.position, { x: 0.16, scrollTrigger: {
      
			trigger: ".section-four",

			start: "top top",
			end: "bottom top",
      
    }})

    
    
	}
	addModelToBG();