---
layout: default
title: WebXR
description: Learn about WebXR - the API for building virtual and augmented reality experiences on the web.
nav: webxr
---

<section class="hero">
  <model id="hero-model" alt="WebXR Logo">
    <source src="{{ site.baseurl }}/models/webxr-logo.usdz" type="model/vnd.usdz+zip">
    <source src="{{ site.baseurl }}/models/webxr-logo.glb" type="model/gltf-binary">
  </model>
  <div class="hero-text">
    <h1>WebXR</h1>
    <p>A web standard for accessing virtual and augmented reality hardware from the browser.</p>
  </div>
</section>

<script type="module" src="{{ site.baseurl }}/scripts/hero-spin.js"></script>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="about" markdown="1">

## What is WebXR?

The **WebXR Device API** provides access to the input and output capabilities of VR and AR hardware,
including head tracking, motion controllers, hand tracking, and display output,
through standard web APIs.
It lets a web page detect whether XR capabilities are available,
query what the device supports,
poll device and input state each frame,
and present imagery at the appropriate frame rate.

The "X" in XR is not part of an acronym.
It is used as an algebraic variable to stand in for the many forms "_____ Reality" can take:
Virtual Reality, Augmented Reality, Mixed Reality, and whatever comes next.
The API is designed to cover all of them without being limited to any one.

WebXR supports three broad modes of use:
**inline sessions**, which render XR-responsive content within a normal web page (sometimes called "Magic Window" mode);
**immersive-vr sessions**, which present content directly to a headset;
and **immersive-ar sessions**, which overlay content on a view of the real world.

Because WebXR content is delivered over the web, a few things follow naturally from that:

- **Accessed by URL**: no app store submission or installation step is involved.
- **Updated in place**: a change to the hosted content is immediately reflected for anyone who visits.
- **Device-agnostic**: the same page can run on a standalone headset, a tethered PC rig, an AR-capable phone, or an inline preview in a desktop browser.
- **Hardware-independent**: the API targets capabilities, not specific devices, so it continues to work as new compatible hardware appears.

Learn more in the [WebXR Explainer on GitHub](https://github.com/immersive-web/webxr/blob/main/explainer.md).

</section>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="support">
  <h2>Does your device support WebXR?</h2>
  <p>
    The results below are generated live from your current browser. Support for individual WebXR modules means
    the browser can expose the feature when the underlying hardware provides it.
  </p>

  <div id="xr-support-results">
    <p class="support-loading">Checking WebXR support&hellip;</p>
  </div>

  <script type="module">
    const container = document.getElementById('xr-support-results');

    let topLevelStatus;
    let topLevelClass;
    if ('xr' in navigator) {
      topLevelStatus = '✔ Your browser supports WebXR';
      topLevelClass = 'status-supported';
    } else if ('getVRDisplays' in navigator) {
      topLevelStatus = '⚠ Your browser supports WebVR (deprecated), but not WebXR';
      topLevelClass = 'status-partial';
    } else {
      topLevelStatus = '✗ Your browser does not support WebXR';
      topLevelClass = 'status-unsupported';
    }

    const modules = [
      { name: 'WebXR Device API (core)', url: 'https://immersive-web.github.io/webxr/', supported: 'xr' in navigator },
      { name: 'WebXR Gamepads', url: 'https://immersive-web.github.io/webxr-gamepads-module/', supported: 'gamepad' in (window.XRInputSource?.prototype ?? {}) },
      { name: 'WebXR Augmented Reality', url: 'https://immersive-web.github.io/webxr-ar-module/', supported: 'environmentBlendMode' in (window.XRSession?.prototype ?? {}) },
      { name: 'WebXR Hit Test', url: 'https://immersive-web.github.io/hit-test/', supported: 'requestHitTestSource' in (window.XRSession?.prototype ?? {}) },
      { name: 'WebXR DOM Overlays', url: 'https://immersive-web.github.io/dom-overlays/', supported: 'domOverlayState' in (window.XRSession?.prototype ?? {}) },
      { name: 'WebXR Layers', url: 'https://immersive-web.github.io/layers/', supported: 'XRProjectionLayer' in window },
      { name: 'WebXR Anchors', url: 'https://immersive-web.github.io/anchors/', supported: 'createAnchor' in (window.XRFrame?.prototype ?? {}) },
      { name: 'WebXR Lighting Estimation', url: 'https://immersive-web.github.io/lighting-estimation/', supported: 'requestLightProbe' in (window.XRSession?.prototype ?? {}) },
      { name: 'WebXR Hand Input', url: 'https://www.w3.org/TR/webxr-hand-input/', supported: 'hand' in (window.XRInputSource?.prototype ?? {}) },
      { name: 'WebXR/WebGPU Bindings', url: 'https://immersive-web.github.io/WebXR-WebGPU-Binding/', supported: 'XRGPUBinding' in window },
    ];

    const sessionModeNames = ['inline', 'immersive-vr', 'immersive-ar'];
    const swatchColors = ['var(--cyan)', 'var(--magenta)', 'var(--yellow)'];

    function icon(supported) {
      return supported
        ? '<span class="support-icon support-icon--yes" aria-label="Supported">✔</span>'
        : '<span class="support-icon support-icon--no" aria-label="Not supported">✗</span>';
    }

    function buildModulesTable() {
      const rows = modules.map((m, i) => {
        const color = swatchColors[i % swatchColors.length];
        return `
        <tr>
          <td><a href="${m.url}">${m.name}</a></td>
          <td data-supported="${m.supported}"><span class="support-swatch" style="background:${color}"></span>${icon(m.supported)} ${m.supported ? 'Supported' : 'Not supported'}</td>
        </tr>`;
      }).join('');
      return `
        <table class="support-table">
          <caption>WebXR Modules</caption>
          <thead><tr><th scope="col">Module</th><th scope="col">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    function buildSessionTable(sessionResults) {
      const rows = sessionResults.map(s => `
        <tr>
          <td><code>${s.name}</code></td>
          <td data-supported="${s.supported}">${icon(s.supported)} ${s.supported ? 'Available' : 'Unavailable'}</td>
        </tr>`).join('');
      return `
        <table class="support-table">
          <caption>Session Modes</caption>
          <thead><tr><th scope="col">Mode</th><th scope="col">Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    async function checkSessionModes() {
      if (!('xr' in navigator)) {
        return sessionModeNames.map(name => ({ name, supported: false }));
      }
      return Promise.all(
        sessionModeNames.map(async name => {
          const supported = await navigator.xr.isSessionSupported(name).catch(() => false);
          return { name, supported };
        })
      );
    }

    container.innerHTML = `
      <p class="support-status ${topLevelClass}">${topLevelStatus}</p>
      ${buildModulesTable()}
      <p class="support-loading support-loading--sessions">Checking session mode availability&hellip;</p>
    `;

    const sessionResults = await checkSessionModes();
    const loadingEl = container.querySelector('.support-loading--sessions');
    if (loadingEl) {
      loadingEl.outerHTML = buildSessionTable(sessionResults);
    }
  </script>
</section>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="getting-started" markdown="1">

## Getting Started with WebXR Development

WebXR is a relatively low-level API: it handles immersive sessions, tracking and input, while scene management and rendering are generally handled by your application. 

Many developers use a 3D framework, library or engine to take care of this additional setup. Below are minimal starter scenes for a few widely used tools, listed alphabetically. 

Each scene shows a lit, rotating cube and provides a way to enter immersive AR or VR, depending on what the device and browser support. You can save one of these examples as an `.html` file, serve it from a secure context—for example, over HTTPS or from `http://localhost` during local development—and open it in a browser that supports WebXR.

Browsers require immersive WebXR sessions to be requested in response to user activation, such as clicking a button. Each example below handles this user-initiated entry in its own way.

<details name="framework" markdown="1">
<summary><strong>A-Frame</strong></summary>

A-Frame's `<a-scene>` element sets up the renderer, camera, lights and WebXR support automatically.

Its built-in UI shows Enter VR and/or Enter AR controls depending on what the browser supports, while `hide-on-enter-ar` hides the plane and sky in AR so they do not obscure the real-world view.

```html
<!DOCTYPE html>
<html>

<head>
  <script src="https://aframe.io/releases/1.8.0/aframe.min.js"></script>
</head>

<body>
  <a-scene xr-mode-ui="XRMode: xr">
    <!-- 70° FOV for a consistent inline preview; WebXR supplies the immersive projection -->
    <a-camera fov="70"></a-camera>
    <a-box position="0 1.2 -1.5" depth="0.35" height="0.35" width="0.35" color="#F3CB00"
      animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"></a-box>
    <a-plane position="0 0 -1.5" rotation="-90 0 0" width="4" height="4" color="#E65FDE" hide-on-enter-ar></a-plane>
    <a-sky color="#00C0E2" hide-on-enter-ar></a-sky>
  </a-scene>
</body>

</html>
```

[Full A-Frame guide →](https://aframe.io/docs/1.8.0/introduction/)

</details>

<details name="framework" markdown="1">
<summary><strong>Babylon.js</strong></summary>

Babylon.js provides a default XR experience helper sets up the XR camera, input handling, common interactions and enter-XR UI in a single call.

This example checks for `immersive-ar` support first and configures the helper for `immersive-vr` otherwise.

```html
<!DOCTYPE html>
<html>

<head>
  <script src="https://cdn.jsdelivr.net/npm/babylonjs@9.22.0/babylon.js"></script>
  <style>
    html,
    body {
      overflow: hidden;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    canvas {
      width: 100%;
      height: 100%;
      touch-action: none;
    }
  </style>
</head>

<body>
  <canvas id="canvas"></canvas>
  <script>
    const engine = new BABYLON.Engine(document.getElementById('canvas'), true);

    const createScene = async () => {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = BABYLON.Color4.FromHexString('#00C0E2FF');
      const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1.6, 0), scene);
      camera.setTarget(new BABYLON.Vector3(0, 1.6, 1.5));
      camera.fov = 70 * Math.PI / 180; // 70° FOV for a consistent inline preview
      new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

      const box = BABYLON.MeshBuilder.CreateBox('box', { size: 0.35 }, scene);
      box.position.set(0, 1.2, 1.5); // Babylon uses a left-handed coordinate system by default, so +z is forward
      box.material = new BABYLON.StandardMaterial('boxMat', scene);
      box.material.diffuseColor = BABYLON.Color3.FromHexString('#F3CB00');
      scene.onBeforeRenderObservable.add(() =>
        box.rotate(BABYLON.Axis.Y, (Math.PI / 5) * (engine.getDeltaTime() / 1000)));

      const floor = BABYLON.MeshBuilder.CreateGround('floor', { width: 4, height: 4 }, scene);
      floor.position.z = 1.5;
      floor.material = new BABYLON.StandardMaterial('floorMat', scene);
      floor.material.diffuseColor = BABYLON.Color3.FromHexString('#E65FDE');

      const ar = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

      const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: ar ? [] : [floor],
        uiOptions: { sessionMode: ar ? 'immersive-ar' : 'immersive-vr' }
      });

      xr.baseExperience.onStateChangedObservable.add((state) => {
        if (ar && state === BABYLON.WebXRState.IN_XR) {
          scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
          floor.setEnabled(false);
        }
      });
      return scene;
    };

    createScene().then(scene => engine.runRenderLoop(() => scene.render()));
  </script>
</body>

</html>
```

[Full Babylon.js WebXR guide →](https://doc.babylonjs.com/features/featuresDeepDive/webXR/introToWebXR)

</details>

<details name="framework" markdown="1">
<summary><strong>PlayCanvas</strong></summary>

PlayCanvas can be used through its collaborative online editor or, as here, directly as a JavaScript engine.

Starting a session is an explicit `app.xr.start()` call, made inside a click handler.

```html
<!DOCTYPE html>
<html>

<head>
  <script src="https://cdn.jsdelivr.net/npm/playcanvas@2.21.4/build/playcanvas.min.js"></script>
  <style>
    html,
    body,
    canvas {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
    }

    #enter-xr {
      position: absolute;
      bottom: 1em;
      left: 50%;
      translate: -50%;
    }
  </style>
</head>

<body>
  <canvas id="canvas"></canvas>
  <button id="enter-xr">Enter WebXR</button>
  <script>
    const app = new pc.Application(document.getElementById('canvas'));
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.start();

    const camera = new pc.Entity();
    camera.addComponent('camera', {
      clearColor: new pc.Color().fromString('#00C0E2'),
      fov: 70 // 70° FOV for a consistent inline preview
    });
    camera.setPosition(0, 1.6, 0);
    app.root.addChild(camera);

    const light = new pc.Entity();
    light.addComponent('light');
    light.setEulerAngles(45, 30, 0);
    app.root.addChild(light);

    const boxMaterial = new pc.StandardMaterial();
    boxMaterial.diffuse.fromString('#F3CB00');
    boxMaterial.update();

    const box = new pc.Entity();
    box.addComponent('render', { type: 'box', material: boxMaterial });
    box.setLocalScale(0.35, 0.35, 0.35);
    box.setPosition(0, 1.2, -1.5);
    app.root.addChild(box);
    app.on('update', dt => box.rotate(0, 36 * dt, 0));

    const floorMaterial = new pc.StandardMaterial();
    floorMaterial.diffuse.fromString('#E65FDE');
    floorMaterial.update();

    const floor = new pc.Entity();
    floor.addComponent('render', { type: 'plane', material: floorMaterial });
    floor.setLocalScale(4, 1, 4);
    floor.setPosition(0, 0, -1.5);
    app.root.addChild(floor);

    const button = document.getElementById('enter-xr');
    button.addEventListener('click', () => {
      const ar = app.xr.isAvailable(pc.XRTYPE_AR);
      if (!ar && !app.xr.isAvailable(pc.XRTYPE_VR)) {
        button.textContent = 'Immersive WebXR unavailable';
        return;
      }
      if (ar) {
        camera.camera.clearColor = new pc.Color(0, 0, 0, 0);
        floor.enabled = false;
      }
      app.xr.start(camera.camera, ar ? pc.XRTYPE_AR : pc.XRTYPE_VR, pc.XRSPACE_LOCALFLOOR);
    });
  </script>
</body>

</html>
```

[Full PlayCanvas WebXR guide →](https://developer.playcanvas.com/user-manual/xr/)

</details>

<details name="framework" markdown="1">
<summary><strong>Three.js</strong></summary>

three.js exposes WebXR through its renderer: enable `renderer.xr`, drive rendering with `setAnimationLoop` and add the `XRButton` helper, which offers `immersive-ar` where supported and falls back to `immersive-vr` otherwise.

```html
<!DOCTYPE html>
<html>

<head>
  <style>
    body {
      margin: 0;
    }
  </style>
  <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/"
        }
      }
    </script>
</head>

<body>
  <script type="module">
    import * as THREE from 'three';
    import { XRButton } from 'three/addons/webxr/XRButton.js';

    const sky = new THREE.Color(0x00c0e2);
    const scene = new THREE.Scene();
    scene.background = sky;
    // 70° FOV for a consistent inline preview; WebXR supplies the immersive projection
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.xr.enabled = true;
    document.body.append(renderer.domElement, XRButton.createButton(renderer));

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xf3cb00 })
    );
    box.position.set(0, 1.2, -1.5);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshStandardMaterial({ color: 0xe65fde })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -1.5;

    scene.add(box, floor, new THREE.HemisphereLight(0xffffff, 0x444444, 2));

    renderer.xr.addEventListener('sessionstart', () => {
      const ar = renderer.xr.getSession().environmentBlendMode !== 'opaque';
      scene.background = ar ? null : sky;
      floor.visible = !ar;
    });

    renderer.setAnimationLoop((time) => {
      box.rotation.y = (time / 1000) * (Math.PI / 5);
      renderer.render(scene, camera);
    });
  </script>
</body>

</html>
```

[Full three.js WebXR guide →](https://threejs.org/manual/#en/webxr-basics)

</details>

These four are only a small sample of a much larger ecosystem—many other libraries, engines and tools support WebXR, and the ones above are shown for illustration rather than endorsement.

Check out the community maintained [Awesome WebXR](https://github.com/msub2/awesome-webxr) repo for more options. If you would rather work with the WebXR Device API directly, the [WebXR Samples](https://immersive-web.github.io/webxr-samples/) page demonstrates direct API usage, while the [WebXR explainer](https://github.com/immersive-web/webxr/blob/main/explainer.md) covers the underlying concepts.

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="demo" markdown="1">

## Try WebXR

To embed WebXR content in an iframe, add `allow="xr-spatial-tracking"` so the embedded page can access the WebXR Device API.
This embed is the [Input Selection sample](https://github.com/immersive-web/webxr-samples) from the Immersive Web Working Group.

<!-- WebXR input-selection sample from the immersive-web/webxr-samples repo.
     allow="xr-spatial-tracking" grants WebXR Device API access. -->
<iframe
  src="https://immersive-web.github.io/webxr-samples/input-selection.html"
  allow="xr-spatial-tracking"
  allowfullscreen
  style="width:100%;height:420px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg)">
</iframe>

</section>
