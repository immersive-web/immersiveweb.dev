#!/bin/bash
# Convert GLTF → GLB, resize textures to 512px, then Draco-compress.
# Outputs clean {name}_1k.glb files into xr-demo/models/

set -e
MODELS_DIR="$(cd "$(dirname "$0")/xr-demo/models" && pwd)"
GLTF_DIR="${MODELS_DIR}/gltf"

for gltf in "$GLTF_DIR"/*/*.gltf; do
  name="$(basename "$gltf" .gltf)"
  out="${MODELS_DIR}/${name}.glb"
  tmp="${MODELS_DIR}/${name}_tmp.glb"

  echo "  ${name}"
  echo "    copy   → glb"
  npx --yes @gltf-transform/cli copy "$gltf" "$tmp"

  echo "    resize → 512"
  npx --yes @gltf-transform/cli resize "$tmp" "$tmp" --width 512 --height 512

  echo "    optimize + draco"
  npx --yes @gltf-transform/cli optimize "$tmp" "$out" --compress draco

  rm -f "$tmp"
  echo "    done   $(du -h "$out" | cut -f1)"
done

echo ""
echo "  All models processed."
