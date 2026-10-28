import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * Procedural chrome monolith.
 * A beveled, tapered, twisted column generated entirely in code — no model
 * files, no external assets. Rounded-rectangle cross section extruded with a
 * heavy bevel, then twisted and tapered vertex-by-vertex.
 */
export function createMonolithGeometry({
  height = 3.6,
  width = 0.95,
  depth = 1.18,
  radius = 0.22,
  twist = 0.5,
  taper = 0.16,
  bevel = 0.085,
} = {}) {
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(radius, w * 0.92, d * 0.92);

  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.9,
    bevelSegments: 5,
    curveSegments: 18,
    steps: 90,
  });

  geometry.center();
  geometry.rotateX(-Math.PI / 2); // extrusion axis becomes vertical (Y)

  // Twist + taper for a sculptural silhouette
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    const tNorm = THREE.MathUtils.clamp(y / height + 0.5, 0, 1);
    const angle = (tNorm - 0.5) * twist * Math.PI;
    const scale = 1 - taper * tNorm;
    const x = positions.getX(i) * scale;
    const z = positions.getZ(i) * scale;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    positions.setX(i, x * cos - z * sin);
    positions.setZ(i, x * sin + z * cos);
  }
  positions.needsUpdate = true;

  // ExtrudeGeometry is non-indexed, so plain computeVertexNormals() would give
  // flat per-triangle shading (visible banding). Welding first lets the twist
  // read as one continuous polished chrome surface.
  geometry.deleteAttribute('uv');
  geometry.deleteAttribute('normal');
  const welded = mergeVertices(geometry, 1e-4);
  geometry.dispose();
  welded.computeVertexNormals();
  return welded;
}

/** The monolith mesh with a physically based chrome material. */
export function Monolith({
  twist = 0.5,
  roughness = 0.13,
  color = '#e9e9ee',
  envMapIntensity = 1.35,
  ...props
}) {
  const geometry = useMemo(() => createMonolithGeometry({ twist }), [twist]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow {...props}>
      <meshPhysicalMaterial
        color={color}
        metalness={1}
        roughness={roughness}
        clearcoat={0.55}
        clearcoatRoughness={0.22}
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
}

/** Small polished companion objects for depth. */
export function ChromePebble(props) {
  return (
    <mesh castShadow {...props}>
      <icosahedronGeometry args={[1, 3]} />
      <meshPhysicalMaterial
        color="#dcdce4"
        metalness={1}
        roughness={0.22}
        envMapIntensity={1.1}
      />
    </mesh>
  );
}
