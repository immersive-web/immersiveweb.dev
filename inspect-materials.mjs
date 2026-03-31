#!/usr/bin/env node

// Inspect GLB materials — reports alpha mode, transmission, opacity, and transparent flag.
// Usage: node inspect-materials.mjs xr-demo/models/alarm_clock_01_1k.glb

import { readFile } from 'fs/promises';
import { resolve } from 'path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node inspect-materials.mjs <path-to-glb>');
  process.exit(1);
}

const buf = await readFile(resolve(file));

// Parse GLB header
const magic = buf.readUInt32LE(0);
if (magic !== 0x46546C67) {
  console.error('Not a valid GLB file');
  process.exit(1);
}

// First chunk is JSON
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf-8');
const gltf = JSON.parse(jsonStr);

console.log(`\n  ${file}`);
console.log(`  ${'—'.repeat(60)}`);

if (!gltf.materials || gltf.materials.length === 0) {
  console.log('  No materials found.');
  process.exit(0);
}

// List extensions used
if (gltf.extensionsUsed) {
  console.log(`  Extensions used: ${gltf.extensionsUsed.join(', ')}`);
}
console.log('');

for (let i = 0; i < gltf.materials.length; i++) {
  const mat = gltf.materials[i];
  const name = mat.name || `(unnamed #${i})`;

  const props = [];

  // Alpha mode
  const alphaMode = mat.alphaMode || 'OPAQUE';
  props.push(`alphaMode: ${alphaMode}`);
  if (mat.alphaCutoff !== undefined) props.push(`alphaCutoff: ${mat.alphaCutoff}`);

  // Double sided
  if (mat.doubleSided) props.push('doubleSided');

  // PBR base color alpha
  const pbr = mat.pbrMetallicRoughness;
  if (pbr?.baseColorFactor) {
    const a = pbr.baseColorFactor[3];
    if (a < 1.0) props.push(`baseColorAlpha: ${a}`);
  }
  if (pbr?.baseColorTexture !== undefined) props.push('has baseColorTexture');

  // Extensions
  if (mat.extensions) {
    for (const [ext, val] of Object.entries(mat.extensions)) {
      if (ext === 'KHR_materials_transmission') {
        props.push(`transmission: ${val.transmissionFactor ?? 0}`);
        if (val.transmissionTexture) props.push('has transmissionTexture');
      }
      if (ext === 'KHR_materials_volume') {
        props.push(`volume thicknessFactor: ${val.thicknessFactor ?? 0}`);
      }
      if (ext === 'KHR_materials_ior') {
        props.push(`ior: ${val.ior ?? 1.5}`);
      }
      if (ext === 'KHR_materials_specular') {
        props.push('has KHR_materials_specular');
      }
      if (ext === 'KHR_materials_clearcoat') {
        props.push(`clearcoat: ${val.clearcoatFactor ?? 0}`);
      }
      if (ext === 'KHR_materials_unlit') {
        props.push('unlit');
      }
    }
  }

  // Flag materials that look like they should be transparent
  const isTransparent = alphaMode !== 'OPAQUE'
    || (pbr?.baseColorFactor && pbr.baseColorFactor[3] < 1.0)
    || mat.extensions?.KHR_materials_transmission;

  const marker = isTransparent ? ' *** TRANSPARENT ***' : '';

  console.log(`  [${i}] ${name}${marker}`);
  console.log(`       ${props.join(', ')}`);
}

console.log('');
