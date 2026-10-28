import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Soft round sprite generated on a canvas — no texture files needed. */
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Subtle atmospheric dust. Cheap on the GPU: positions are static and the
 * whole cloud drifts/rotates as one group instead of updating per-point.
 */
export function Particles({ count = 380, spread = [11, 8, 7], size = 0.045, opacity = 0.42, speed = 0.012 }) {
  const group = useRef();

  const { positions, texture } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
    }
    return { positions, texture: makeDotTexture() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, spread[0], spread[1], spread[2]]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = t * speed;
    g.position.y = Math.sin(t * 0.18) * 0.18;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={size}
          sizeAttenuation
          map={texture}
          alphaMap={texture}
          transparent
          opacity={opacity}
          depthWrite={false}
          color="#d6d6de"
        />
      </points>
    </group>
  );
}
