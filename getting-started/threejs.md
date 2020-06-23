---
title: Three.js
---
[Three.js](https://threejs.org/) is a cross-browser JavaScript library used to create and display animated 3D computer graphics in a web browser. It has a large community, good [docs](https://threejs.org/docs/), and many [examples](https://threejs.org/examples/). 

Using VR is largely the same as regular Three.js applications. Setup the scene, camera, and renderer. The major difference
is setting the `vr.enabled` flag to true on the renderer.  There is an optional VRButton class to make a button that
will enter and exit VR for you.

For more info, see [this guide to VR in Three.js](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content) and the [WebXR examples](https://threejs.org/examples/?q=webxr).

Here is a full example that sets up a scene with a rotating red cube.


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style type="text/css">
        body {
            margin: 0;
            background-color: #000;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <script type="module">
        // Import three
        import * as THREE from 'https://unpkg.com/three/build/three.module.js';
        // Import the default VRButton
        import { VRButton } from 'https://unpkg.com/three/examples/jsm/webxr/VRButton.js';

        // Make a new scene
        let scene = new THREE.Scene();
        // Set background color of the scene to gray
        scene.background = new THREE.Color(0x505050);

        // Make a camera. note that far is set to 100, which is better for realworld sized environments
        let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1.6, 3);
        scene.add(camera);

        // Add some lights
        var light = new THREE.DirectionalLight(0xffffff,0.5);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff,0.5))

        // Make a red cube
        let cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,1),
            new THREE.MeshLambertMaterial({color:'red'})
        );
        cube.position.set(0, 1.5, -10);
        scene.add(cube);

        // Make a renderer that fills the screen
        let renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Turn on VR support
        renderer.vr.enabled = true;
        // Set animation loop
        renderer.setAnimationLoop(render);
        // Add canvas to the page
        document.body.appendChild(renderer.domElement);

        // Add a button to enter/exit vr to the page
        document.body.appendChild(VRButton.createButton(renderer));

        // For AR instead, import ARButton at the top
        //    import { ARButton } from 'https://unpkg.com/three/examples/jsm/webxr/ARButton.js';
        // then create the button
        //  document.body.appendChild(ARButton.createButton(renderer));

        // Handle browser resize
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function render(time) {
            // Rotate the cube
            cube.rotation.y = time / 1000;
            // Draw everything
            renderer.render(scene, camera);
        }
    </script>
</body>
</html>
```

Here is a full example of an immersive-ar demo made using three.js

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js ar - cones</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<link type="text/css" rel="stylesheet" href="main.css">
	</head>
	<body>

		<div id="info">
			<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> ar - cones<br/>(Chrome Android 81+)
		</div>

		<script type="module">

            import * as THREE from 'https://unpkg.com/three/build/three.module.js';
			import { ARButton } from 'https://unpkg.com/three/examples/jsm/webxr/ARButton.js';

			var container;
			var camera, scene, renderer;
			var controller;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

				var light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
				light.position.set( 0.5, 1, 0.25 );
				scene.add( light );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				//

				document.body.appendChild( ARButton.createButton( renderer ) );

				//

				var geometry = new THREE.CylinderBufferGeometry( 0, 0.05, 0.2, 32 ).rotateX( Math.PI / 2 );

				function onSelect() {

					var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
					mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
					scene.add( mesh );

				}

				controller = renderer.xr.getController( 0 );
				controller.addEventListener( 'select', onSelect );
				scene.add( controller );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				renderer.setAnimationLoop( render );

			}

			function render() {

				renderer.render( scene, camera );

			}

		</script>
	</body>
</html>
```

