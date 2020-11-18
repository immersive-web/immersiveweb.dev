---
title: Babylon.js
---
Babylon.js is an easy to use real-time 3D game engine built using TypeScript. It has full WebXR support out of the box, including gaze and teleportation support, AR experimental features and more. To simplify WebXR development Babylon.js offers the [WebXR Experience Helper](https://doc.babylonjs.com/how_to/webxr#webxrexperiencehelper), which is the one-stop-shop for all XR-related functionalities.

To get started use the [Babylon.js playground](https://playground.babylonjs.com), or try these demos:

- https://playground.babylonjs.com/#PPM311
- https://playground.babylonjs.com/#JA1ND3#164

To start on your own use this simple template:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
        <title>Babylon - Getting Started</title>
        <!--- Link to the last version of BabylonJS --->
        <script src="https://preview.babylonjs.com/babylon.js"></script>
        <style>
            html,
            body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }

            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        </style>
    </head>

    <body>
        <canvas id="renderCanvas"></canvas>
        <script>
            window.addEventListener('DOMContentLoaded', async function () {
                // get the canvas DOM element
                var canvas = document.getElementById('renderCanvas');
                // load the 3D engine
                var engine = new BABYLON.Engine(canvas, true);
                // createScene function that creates and return the scene
                var createScene = async function () {
                    // create a basic BJS Scene object
                    var scene = new BABYLON.Scene(engine);
                    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
                    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
                    // target the camera to scene origin
                    camera.setTarget(BABYLON.Vector3.Zero());
                    // attach the camera to the canvas
                    camera.attachControl(canvas, false);
                    // create a basic light, aiming 0,1,0 - meaning, to the sky
                    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
                    // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation 
                    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
                    // move the sphere upward 1/2 of its height
                    sphere.position.y = 1;
                    // create a built-in "ground" shape;
                    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

                    // Add XR support
                    var xr = await scene.createDefaultXRExperienceAsync({/* configuration options, as needed */})
                    // return the created scene
                    return scene;
                }

                // call the createScene function
                var scene = await createScene();

                // run the render loop
                engine.runRenderLoop(function () {
                    scene.render();
                });

                // the canvas/window resize event handler
                window.addEventListener('resize', function () {
                    engine.resize();
                });
            });
        </script>
    </body>
</html>
```

For advanced examples and documentation see the [Babylon.js WebXR documentation page](https://doc.babylonjs.com/how_to/introduction_to_webxr)
