---
title: model-viewer
---
[Model viewer](https://modelviewer.dev/) is a custom HTML element for displaying 3D models and vieweing them in AR

# AR

```html
<!-- Import the component -->
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.js"></script>
<script nomodule src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"></script>

<!-- Use it like any other HTML element -->
<model-viewer src="examples/assets/Astronaut.glb" ar alt="A 3D model of an astronaut" auto-rotate camera-controls background-color="#455A64"></model-viewer>
```
