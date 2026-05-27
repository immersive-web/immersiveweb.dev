// Wait for the WebGL fallback to finish if it's loading
if (window.modelFallbackReady) await window.modelFallbackReady;

const model = document.getElementById('hero-model');
if (model) {
  let yaw = Math.PI/2;
  let velocity = 0;
  let isDragging = false;
  let lastX = 0;
  let lastTime = 0;
  let snapBackRAF = null;
  let momentumRAF = null;

  const TILT_RAD = 0.6;
  const TILT_DEG = TILT_RAD * (180 / Math.PI);
  const FRICTION = 0.95;
  const MIN_VELOCITY = 0.0005;
  const SETTLE_THRESHOLD = 0.001;

  async function init() {
    if (model.ready) await model.ready;

    // Extract scale from the default transform
    const base = model.entityTransform;
    const scale = Math.sqrt(base.m11 ** 2 + base.m21 ** 2 + base.m31 ** 2);

    // Model-space center and bounding sphere
    const center = model.boundingBoxCenter;
    const extents = model.boundingBoxExtents;
    const sphereRadius = Math.sqrt(extents.x ** 2 + extents.y ** 2 + extents.z ** 2) / 2;
    const finalZ = -scale * sphereRadius;

    // Switch to none stagemode so we can set entityTransform
    model.stageMode = 'none';

    // Build and apply the transform for a given yaw angle
    function applyTransform(yawRad) {
      const yawDeg = yawRad * (180 / Math.PI);
      const m = new DOMMatrix();
      m.translateSelf(0, 0, finalZ);
      m.rotateSelf(TILT_DEG, 0, 0);
      m.rotateSelf(0, yawDeg, 0);
      m.scaleSelf(scale * 0.8, scale * 0.8, scale * 0.8);
      m.translateSelf(-center.x, -center.y, -center.z);
      model.entityTransform = m;
    }

    // Set initial tilted state
    applyTransform(yaw);

    // Pointer-based Y-only rotation
    model.addEventListener('pointerdown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastTime = performance.now();
      velocity = 0;
      cancelMomentum();
      cancelSnapBack();
      model.setPointerCapture(e.pointerId);
    });

    model.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = now - lastTime;
      if (dt > 0) {
        velocity = (dx * 0.005) / dt * 16; // normalize to ~per-frame
      }
      lastX = e.clientX;
      lastTime = now;
      yaw += dx * 0.005;
      applyTransform(yaw);
    });

    model.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      model.releasePointerCapture(e.pointerId);
      startMomentum();
    });

    function startMomentum() {
      cancelMomentum();

      function step() {
        velocity *= FRICTION;
        yaw += velocity;
        applyTransform(yaw);

        if (Math.abs(velocity) > MIN_VELOCITY) {
          momentumRAF = requestAnimationFrame(step);
        } else {
          velocity = 0;
          momentumRAF = null;
          // Snap to nearest quarter turn
          const QUARTER = Math.PI / 2;
          const targetYaw = Math.round(yaw / QUARTER) * QUARTER;
          if (Math.abs(yaw - targetYaw) > SETTLE_THRESHOLD) {
            snapTo(targetYaw);
          }
        }
      }
      momentumRAF = requestAnimationFrame(step);
    }

    function snapTo(targetYaw) {
      cancelSnapBack();
      const startYaw = yaw;
      const startTime = performance.now();
      const duration = 400;

      function step(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        yaw = startYaw + (targetYaw - startYaw) * ease;
        applyTransform(yaw);
        if (t < 1) {
          snapBackRAF = requestAnimationFrame(step);
        }
      }
      snapBackRAF = requestAnimationFrame(step);
    }

    function cancelSnapBack() {
      if (snapBackRAF) {
        cancelAnimationFrame(snapBackRAF);
        snapBackRAF = null;
      }
    }

    function cancelMomentum() {
      if (momentumRAF) {
        cancelAnimationFrame(momentumRAF);
        momentumRAF = null;
      }
    }
  }

  init();
}
