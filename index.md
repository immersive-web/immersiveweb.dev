---
layout: default
title: WebXR
description: Learn about WebXR - the API for building virtual and augmented reality experiences on the web.
nav: webxr
---

<section class="hero">
  <model id="hero-model" src="{{ site.baseurl }}/models/webxr-logo.glb" alt="WebXR Logo"></model>
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
