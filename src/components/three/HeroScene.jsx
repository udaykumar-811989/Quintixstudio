import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { SceneCanvas } from './SceneCanvas.jsx';
import { StudioEnvironment } from './StudioEnvironment.jsx';
import { Particles } from './Particles.jsx';
import { Monolith, ChromePebble } from './Monolith.jsx';
import { scrollState } from '../../lib/scrollStore.js';
import { clamp, damp } from '../../lib/utils.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';

/** Elegant camera move: mouse parallax + a gentle scroll-driven dolly. */
function CameraRig() {
  const { camera } = useThree();
  const reduced = useReducedMotion();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const heroProgress = clamp(scrollState.y / Math.max(1, window.innerHeight), 0, 1);
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;

    camera.position.x = damp(camera.position.x, px * 0.55, 2.4, dt);
    camera.position.y = damp(camera.position.y, 0.15 + py * 0.3 + heroProgress * 1.1, 2.4, dt);
    camera.position.z = damp(camera.position.z, 9.4 - heroProgress * 1.4, 2.4, dt);
    camera.lookAt(0, heroProgress * 0.7, 0);
  });

  return null;
}

/** The hero sculpture group — slow idle spin, mouse response, scroll response. */
function HeroSculpture({ isDesktop }) {
  const group = useRef();
  const satellites = useRef();
  const reduced = useReducedMotion();
  const restX = isDesktop ? 2.15 : 0;
  const restScale = isDesktop ? 0.98 : 0.62;
  const restY = isDesktop ? 0 : 1.35;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = group.current;
    const s = satellites.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    const heroProgress = clamp(scrollState.y / Math.max(1, window.innerHeight), 0, 1);
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;

    // Continuous slow rotation (damped toward a steadily advancing target)
    const spin = reduced ? 0.5 : t * 0.11;
    g.rotation.y = damp(g.rotation.y, spin + px * 0.28 + heroProgress * 1.5, 2, dt);
    g.rotation.x = damp(g.rotation.x, py * 0.07 + heroProgress * 0.12, 2, dt);
    g.rotation.z = damp(g.rotation.z, px * -0.04, 2, dt);

    // Floating bob + scroll lift
    const bob = reduced ? 0 : Math.sin(t * 0.55) * 0.09;
    g.position.y = damp(g.position.y, restY + bob + heroProgress * 1.6, 2.6, dt);
    g.position.x = damp(g.position.x, restX + px * 0.12, 2.2, dt);
    g.scale.setScalar(damp(g.scale.x, restScale * (1 - heroProgress * 0.12), 2.4, dt));

    if (s) {
      s.rotation.y = damp(s.rotation.y, -t * 0.16 + px * 0.1, 1.8, dt);
      s.rotation.x = damp(s.rotation.x, t * 0.05, 1.6, dt);
      s.position.y = damp(s.position.y, heroProgress * 1.2, 2.4, dt);
    }
  });

  return (
    <>
      <group ref={group} position={[restX, 0, 0]}>
        <Monolith twist={0.52} />
        <ChromePebble position={[-1.05, -1.35, 0.85]} scale={0.16} />
        <ChromePebble position={[1.15, 1.65, -0.65]} scale={0.1} />
      </group>
      <group ref={satellites}>
        <ChromePebble position={[-2.6, 1.4, -2.2]} scale={0.22} />
        <ChromePebble position={[3.1, -1.1, -3.1]} scale={0.3} />
        <ChromePebble position={[-3.4, -1.9, -1.4]} scale={0.12} />
      </group>
    </>
  );
}

export default function HeroScene() {
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 820px)');

  return (
    <SceneCanvas
      shadows={!isMobile}
      camera={{ fov: 32, position: [0, 0.15, 9.4], near: 0.1, far: 60 }}
      aria-hidden="true"
    >
      <StudioEnvironment intensity={1.05} />
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[4.5, 7, 4]}
        intensity={1.5}
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-6, -1.5, 2]} intensity={34} color="#cdd6f5" decay={2} />
      <pointLight position={[6.5, 1.5, -1]} intensity={26} color="#ffe3c4" decay={2} />

      <CameraRig />
      <HeroSculpture isDesktop={isDesktop} />
      <Particles count={isMobile ? 130 : 360} size={isMobile ? 0.05 : 0.042} opacity={0.4} />

      {!isMobile && (
        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.5}
          scale={11}
          blur={2.8}
          far={4.5}
          resolution={256}
          color="#000000"
        />
      )}
    </SceneCanvas>
  );
}
