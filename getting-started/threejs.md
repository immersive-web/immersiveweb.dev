---
title: ThreeJS
---
[Three.js](https://threejs.org/) is a cross-browser JavaScript library used to create and display animated 3D computer graphics in a web browser. It has a large community, good [docs](https://threejs.org/docs/), and many [examples](https://threejs.org/examples/). 

Using VR is largely the same as regular ThreeJS applications. Setup the scene, camera, and renderer. The major difference
is setting the `vr.enabled` flag to true on the renderer.  There is an optional VRButton class to make a button that
will enter and exit VR for you.

For more info, see [this guide to VR in ThreeJS](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content) and the [WebXR examples](https://threejs.org/examples/?q=webxr).

Here is a full example that sets up a scene with a rotating red cube.


```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style type="text/css">
        body {
            margin: 0;
            background-color: #000;
            color: #fff;
            font-family: Monospace;
            font-size: 13px;
            line-height: 24px;
            overscroll-behavior: none;
        }
    </style>
</head>
<body>


<script type="module">
    //import three
    import * as THREE from 'https://threejs.org/build/three.module.js';
    //import the default VRButton
    import { VRButton } from 'https://threejs.org/examples/jsm/webxr/VRButton.js';
    let container, scene, camera, renderer
    let clock = new THREE.Clock();
    let cube

    function init() {
        //setup the container
        container = document.createElement('div');
        document.body.appendChild(container);
        //make a new scene
        scene = new THREE.Scene();
        //set background color of the scene to gray
        scene.background = new THREE.Color(0x505050);
        //make a camera. note that far is set to 100, which is better for realworld sized environments
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        //position & add the camera
        camera.position.set(0, 1.6, 3);
        scene.add(camera);
        //make a renderer that fills the screen
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        //turn on VR support
        renderer.vr.enabled = true;
        //add canvas to the page
        container.appendChild(renderer.domElement);
        //handle resizes properly
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }, false);

        //add a button to enter/exit vr to the page
        document.body.appendChild(VRButton.createButton(renderer));


        //add some lights
        var light = new THREE.DirectionalLight(0xffffff,0.5);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff,0.5))

        //make a red cube
        cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,1),
            new THREE.MeshLambertMaterial({color:'red'})
        )
        cube.position.z = -10
        cube.position.y = 1.5
        scene.add(cube)
    }
    function render() {
        var delta = clock.getDelta() * 60;
        //rotate the cube
        cube.rotation.y += 0.01*delta;
        //draw everything
        renderer.render( scene, camera );
    }
    init()
    renderer.setAnimationLoop( render );
</script>
</body>
</html>
```
