---
layout: default
title: The Model Element
description: The HTML model element, a proposed standard for embedding 3D content directly in web pages.
nav: model
---

<section class="hero">
  <h1>The <code>&lt;model&gt;</code> Element</h1>
  <p>A proposed HTML element for embedding 3D content directly in web pages, rendered by the browser, not by script.</p>
</section>

<div class="accent-bar" aria-hidden="true"></div>
<section class="card" id="about" markdown="1">

## What is the `<model>` Element?

HTML allows the display of many media types through elements like `<img>`, `<picture>`, and `<video>`,
but it does not provide a declarative way to embed 3D content directly.
Displaying a 3D object today requires scripting a `<canvas>` element through WebGL,
a process that depends on third-party libraries
and cannot work in all contexts
(for example, in augmented reality where the browser needs to render from the user's physical viewpoint without exposing sensitive spatial data to the page).

The `<model>` element is a proposed solution:
a new [replaced element](https://drafts.csswg.org/css-display/#replaced-element) that embeds 3D content the same way `<video>` embeds video.

The content of the 3D model file appears as a 3D figure,
inside a portal in the page.

The browser itself is responsible for rendering the model,
which means it can take advantage of platform capabilities
like stereoscopic display, environment lighting, and casting shadows from real-world objects
that page-level code cannot safely access.

It is being developed by the [W3C Immersive Web Community Group](https://www.w3.org/groups/cg/immersive-web/).
Native support currently ships in **Safari on visionOS**.

### How does this relate to the rest of the immersive web?

The `<model>` element handles *inline* 3D:
content anchored to a page layout that does not take over the screen or the camera feed.
[WebXR]({{ site.baseurl }}/) covers the other end of the spectrum:
fully immersive sessions on headsets and AR overlays.
Think of them the way you think of `<video>` versus a full-screen streaming app:
one is a page element, the other is an experience.
Both are designed to work together.

</section>

<div class="accent-bar" aria-hidden="true"></div>
<section class="card" id="support">
  <h2>Does your browser support <code>&lt;model&gt;</code>?</h2>

  <div id="model-support-results">
    <p class="support-loading">Checking support&hellip;</p>
  </div>

  <script type="module">
    const container = document.getElementById('model-support-results');
    const native = 'HTMLModelElement' in window;

    const statusText = native
      ? '✔ Your browser natively supports the <code>&lt;model&gt;</code> element'
      : '⚠ No native support — this page is using a WebGL-based fallback';
    const statusClass = native ? 'status-supported' : 'status-partial';

    const features = [
      { name: 'Native <code>&lt;model&gt;</code> element', check: native }
    ];

    const swatchColors = ['var(--cyan)', 'var(--magenta)', 'var(--yellow)'];

    function icon(ok) {
      return ok
        ? '<span class="support-icon support-icon--yes" aria-label="Supported">✔</span>'
        : '<span class="support-icon support-icon--no" aria-label="Not supported">✗</span>';
    }

    const rows = features.map((f, i) => {
      const color = swatchColors[i % swatchColors.length];
      return `<tr>
        <td>${f.name}</td>
        <td data-supported="${f.check}"><span class="support-swatch" style="background:${color}"></span>${icon(f.check)} ${f.check ? 'Supported' : 'Not supported'}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <p class="support-status ${statusClass}">${statusText}</p>
      <table class="support-table">
        <thead><tr><th scope="col">Feature</th><th scope="col">Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  </script>
</section>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="example" markdown="1">

## Live Example

Drag to rotate the helmet below.
The `stagemode="orbit"` attribute tells the browser to present the model on a turntable that the user can spin and zoom freely.

<figure>
  <model stagemode="orbit" alt="Damaged flight helmet 3D model" style="max-width: 300px; width: 100%; height: auto; aspect-ratio: 1;">
    <source src="{{ site.baseurl }}/models/DamagedHelmet.usdz" type="model/vnd.usdz+zip">
    <source src="{{ site.baseurl }}/models/DamagedHelmet.glb" type="model/gltf-binary">
    <img src="{{ site.baseurl }}/models/DamagedHelmet.jpg" alt="Damaged flight helmet 3D model">
  </model>
  <figcaption>
    Flight helmet with damage — <a href="https://sketchfab.com/3d-models/battle-damaged-sci-fi-helmet-pbr-b81008d513954189a063ff901f7abfe4">model by theblueturtle_</a> (CC BY-NC 4.0), <a href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/DamagedHelmet">glTF rebuild by ctxwing</a> (CC BY 4.0). Converted to USDZ for this example.
  </figcaption>
</figure>

The markup for this example:

```html
<model style="width: 300px; height: 300px" stagemode="orbit" alt="Damaged flight helmet 3D model">
  <source src="DamagedHelmet.usdz" type="model/vnd.usdz+zip">
  <source src="DamagedHelmet.glb" type="model/gltf-binary">
  <img src="DamagedHelmet.jpg" alt="Damaged flight helmet 3D model">
</model>
```

</section>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="quickstart" markdown="1">

## Quick Start

Like `<video>`, the `<model>` element uses `<source>` children to offer the same asset in multiple formats.
The browser selects the first format it supports:

```html
<model style="width: 400px; height: 300px">
  <source src="chair.usdz" type="model/vnd.usdz+zip">
  <source src="chair.glb" type="model/gltf-binary">
</model>
```

Setting `stagemode="orbit"` allows the user to rotate the model directly within the element:

```html
<model style="width: 400px; height: 300px" stagemode="orbit">
  <source src="chair.usdz" type="model/vnd.usdz+zip">
  <source src="chair.glb" type="model/gltf-binary">
</model>
```

Without `stagemode`, the model is displayed at its authored orientation with no built-in user interaction.
The `entityTransform` JavaScript property can be used to control the view programmatically in that case.

### Key attributes

<dl>
  <dt><code>stagemode</code></dt>
  <dd>Controls how the model responds to user input. When set to <code>"orbit"</code>, the browser provides built-in rotate interaction. When omitted, the model is displayed using its authored transform with no built-in manipulation.</dd>

  <dt><code>autoplay</code></dt>
  <dd>Boolean attribute. When present, any animation embedded in the model file begins playing on load.</dd>

  <dt><code>loop</code></dt>
  <dd>Boolean attribute. When present, any animation repeats continuously.</dd>

  <dt><code>width</code> / <code>height</code></dt>
  <dd>Intrinsic dimensions of the element in pixels, just like <code>&lt;img&gt;</code> or <code>&lt;video&gt;</code>. The element can also be sized with CSS.</dd>
</dl>

### Model API

The `<model>` element exposes a JavaScript API for controlling the 3D scene programmatically.

#### The `ready` promise

Know when your model is loaded and ready to use.

Because model files need to be fetched and decoded,
the element provides a `ready` promise that resolves once the source has been loaded and processed.
At that point, properties like `boundingBoxCenter`, `boundingBoxExtents`, and `duration` are available.
The bounding box properties are useful for understanding the size and position of the loaded content,
for example to place labels relative to the model or to calculate a custom camera framing:

```js
const model = document.querySelector('model');

model.ready.then(() => {
  console.log('Center:', model.boundingBoxCenter);
  console.log('Extents:', model.boundingBoxExtents);
  console.log('Animation duration:', model.duration);
});
```

The promise rejects if the source cannot be fetched or is not a valid model asset.

#### `entityTransform`

Control the position, rotation, and scale of the model programmatically.

The `entityTransform` property is a read-write `DOMMatrixReadOnly` that controls the position, rotation, and scale of the model within the element's viewport.
The coordinate system is right-handed and Y-up, with the origin at the centre of the view plane.
One unit equals one CSS metre.
A 10 cm (0.1 units) box inside a square 10 cm portal fills it exactly when the `entityTransform` is the identity matrix.

The browser computes an initial `entityTransform` that centres the model on its bounding box
and scales it to fit within the element's portal.
Because `DOMMatrixReadOnly` methods like `translate()` and `rotate()` return new matrices,
you can derive transforms from the initial one without mutating it:

```js
const model = document.querySelector('model');
let initialTransform;
await model.ready;
initialTransform = model.entityTransform;
model.entityTransform = initialTransform.translate(0, 0, -0.05).rotate(0, 45, 0);
```

Note that when `stagemode` is set to a value other than `none`,
the browser manages `entityTransform` in response to user input
and **writes to the property are ignored**.
Remove the `stagemode` attribute if you need programmatic control of the transform.

### Fallback content

When a browser does not support `<model>`, it ignores the tag and renders whatever is inside it,
the same pattern as `<video>`.
This makes progressive enhancement straightforward:
place an `<img>`, a `<video>`, or any other content after the `<source>` elements as a fallback:

```html
<model stagemode="orbit">
  <source src="chair.usdz" type="model/vnd.usdz+zip">
  <source src="chair.glb" type="model/gltf-binary">
  <img src="chair-preview.jpg" alt="A red chair">
</model>
```

The fallback can be anything:
a static image, a `<video>` with captions and audio descriptions,
or a WebGL-based component like [`<model-viewer>`](https://modelviewer.dev).
The explainer includes [an expanded example](https://github.com/WebKit/explainers/blob/main/model/explainer.md#fallback-content) showing a `<video>` fallback with full accessibility tracks.

</section>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="animations" markdown="1">

## Animations

Models can carry embedded animations. Set the `autoplay` attribute to start playback on load and `loop` to repeat. The [`playbackRate`](https://github.com/WebKit/explainers/blob/main/model/explainer.md#animation) property scales playback speed in real time, the same way it does on `<video>`.

Try speeding up or slowing down the propeller:

<div class="animation-demo">
  <model id="plane-model" autoplay loop alt="Small animated plane with a spinning propeller" style="max-width: 480px; width: 100%; height: auto; aspect-ratio: 16/9;">
    <source src="{{ site.baseurl }}/models/plane-mini.usdz" type="model/vnd.usdz+zip">
    <source src="{{ site.baseurl }}/models/plane-optim.glb" type="model/gltf-binary">
  </model>
  <div class="animation-controls">
    <label for="plane-rate">Propeller speed <output id="plane-rate-output">1.0×</output></label>
    <input type="range" id="plane-rate" min="0" max="10" step="0.1" value="1">
    <label><input type="checkbox" id="plane-playing" switch checked> Playing</label>
  </div>
</div>

<script type="module">
  if (window.modelFallbackReady) await window.modelFallbackReady;

  const model = document.getElementById('plane-model');
  const rate = document.getElementById('plane-rate');
  const rateOutput = document.getElementById('plane-rate-output');
  const playingSwitch = document.getElementById('plane-playing');

  await model.ready;

  const initialTransform = window.initialTransform = model.entityTransform;
  const portalHalfHeightUnits = model.getBoundingClientRect().height / 2 * (0.0254 / 96);
  // Browser's initial transform centers the bbox at the portal centre. Shift so the
  // model origin lands at the portal bottom (the plane's authored ground level).
  const deltaY = -portalHalfHeightUnits - initialTransform.m42;
  const baseTransform = new DOMMatrix().translate(0, deltaY, 0).multiply(initialTransform);
  model.entityTransform = baseTransform.rotate(0, 45, 0);

  rate.addEventListener('input', () => {
    const value = Number(rate.value).toFixed(1);
    model.playbackRate = value;
    rateOutput.textContent = `${value}×`;
  });

  playingSwitch.addEventListener('change', () => {
    if (playingSwitch.checked) {
      model.play();
    } else {
      model.pause();
    }
  });
</script>

The minimal markup:

```html
<model src="plane.usdz" autoplay loop></model>
```

Add a speed slider by reading and writing `playbackRate`:

```js
const model = document.querySelector('model');
const slider = document.querySelector('#speed');

await model.ready;
slider.addEventListener('input', () => {
  model.playbackRate = Number(slider.value);
});
```

</section>

<div class="accent-bar" aria-hidden="true"></div>

<section class="card" id="resources" markdown="1">

## Resources

- [Model Element Explainer](https://github.com/WebKit/explainers/blob/main/model/explainer.md): motivation, design decisions, and usage examples
- [Model Element Specification](https://immersive-web.github.io/model-element/): the draft W3C spec, including the full IDL interface and attribute definitions
- [Model Element on GitHub](https://github.com/immersive-web/model-element): spec source, issue tracker, and discussion

</section>
