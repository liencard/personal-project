        
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.SphereGeometry( 580, 32, 32 );
    const material = new THREE.MeshLambertMaterial( { color: 0x7777ff} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.setY(-680); 
    cube.position.setZ(200); 
    scene.add( cube );

    camera.position.z = 300;

    // lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(200, 400, 300);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const pathOriginal = [
        {x: 0, y: 0, z: -100},
        {x: 100, y: 200, z: -200},
        {x: 200, y: 200, z: -50},
        {x: 240, y: 100, z: -250}
    ];

    const path = [
        {x: 0, y: -680, z: 200},
        {x: 100, y: 30, z: 0},
        {x: 200, y: 0, z: -100}
    ];

    const proxy = document.createElement("div");

    // button animation
    const button = document.querySelector('button');
    button.addEventListener('click', onClick, false );
    
    function onClick() {
        gsap.to(proxy, {
            duration: 3, 
            repeat: 0, 
            motionPath: { 
                path, // equivalent to path: path
                autoRotate: true,
                useRadians: true
            },
            onUpdate: updateMesh
        });
        gsap.to(cube.scale, {duration: 3, x: .3, y: .3, z: .3});

        gsap.to( ".content", {duration: 2, x: 0, y: -600, z: 0} );

        document.querySelector('.overview').style.display = "block";

        gsap.from( ".overview__title", {duration: 2, opacity: 0, delay: 2} );

        gsap.from(".list__item", {
            duration: .5,
            x: -300,
            opacity: 0, 
            delay: 2, 
            stagger: 0.2,
            force3D: true
        });
        
    }

    const setX = gsap.quickSetter(cube.position, "x");
    const setY = gsap.quickSetter(cube.position, "y");
    const setZ = gsap.quickSetter(cube.position, "z");
    const setRot = gsap.quickSetter(cube.rotation, "z");

    function updateMesh() {
        setX(gsap.getProperty(proxy, "x"));
        setY(gsap.getProperty(proxy, "y"));
        setZ(gsap.getProperty(proxy, "z"));
        setRot(gsap.getProperty(proxy, "rotation"));
    }

    gsap.ticker.add(function () {
    renderer.render( scene, camera );
    });
