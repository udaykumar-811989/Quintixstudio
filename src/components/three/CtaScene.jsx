import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SceneCanvas } from './SceneCanvas.jsx';
import { StudioEnvironment } from './StudioEnvironment.jsx';
import { Particles } from './Particles.jsx';
import { scrollState } from '../../lib/scrollStore.js';
import { damp, clamp } from '../../lib/utils.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';

/** Chrome sculptural knot — slow idle rotation + scroll-linked turn. */
function ChromeSculpture({ restX }) {
  const mesh = useRef();
  const { camera } = useThree();
  const reduced = useReducedMotion();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const m = mesh.current;
    if (!m) return;

    const t = state.clock.elapsedTime;
    const p = clamp(scrollState.progress, 0, 1);
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;

    m.rotation.y = damp(m.rotation.y, (reduced ? 0.4 : t * 0.14) + p * 2.4 + px * 0.3, 2, dt);
    m.rotation.x = damp(m.rotation.x, -0.25 + py * 0.18 + Math.sin(t * 0.3) * 0.06, 2, dt);
    m.position.y = damp(m.position.y, reduced ? 0 : Math.sin(t * 0.45) * 0.14, 2.4, dt);
    m.position.x = damp(m.position.x, restX + px * 0.15, 2.2, dt);

    camera.position.x = damp(camera.position.x, px * 0.4, 2, dt);
    camera.position.y = damp(camera.position.y, py * 0.25, 2, dt);
    camera.lookAt(restX * 0.5, 0, 0);
  });

  return (
    <mesh ref={mesh} position={[restX, 0, 0]} castShadow>
      <torusKnotGeometry args={[1.15, 0.32, 240, 40, 2, 3]} />
      <meshPhysicalMaterial
        color="#e6e6ec"
        metalness={1}
        roughness={0.12}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
        envMapIntensity={1.3}
      />
    </mesh>
  );
}

export default function CtaScene() {
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 820px)');
  const restX = isDesktop ? 2.6 : 0;

  return (
    <SceneCanvas
      camera={{ fov: 34, position: [0, 0, 7.2], near: 0.1, far: 40 }}
      aria-hidden="true"
    >
      <StudioEnvironment intensity={1} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <pointLight position={[-6, -2, 3]} intensity={30} color="#c9d2f2" decay={2} />
      <pointLight position={[6, 2, -2]} intensity={22} color="#ffe4c8" decay={2} />

      <ChromeSculpture restX={restX} />
      <Particles
        count={isMobile ? 90 : 220}
        spread={[12, 9, 6]}
        size={0.04}
        opacity={0.32}
        speed={0.016}
      />
    </SceneCanvas>
  );
}
