---
title: p5.xr
---

<a href="https://p5xr.org/">p5.xr</a> is an add-on for p5.js, a Javascript library that makes coding accessible for artists, designers, educators, and beginners. p5.xr adds the ability to run p5 sketches in Augmented Reality or Virtual Reality.

p5.xr also works in the <a href="https://editor.p5js.org/">p5.js online editor</a>, simply add a script tag pointing to the latest p5.xr release in the index.html file.

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.2.0/lib/p5.js"></script>
    <script src="https://github.com/stalgiag/p5.xr/releases/download/0.3.2-rc.3/p5xr.min.js"></script>
</head>
<body>
    <script>
        function preload() {
            createVRCanvas();
        }

        function setup() {
            setVRBackgroundColor(0, 0, 255);
            angleMode(DEGREES);
        }

        function draw() {
            rotateX(-90);
            fill(0, 255, 0);
            noStroke();
            plane(10, 10);
        }
    </script>
</body>
</html>
```
