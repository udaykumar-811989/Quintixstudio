import { useCallback, useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { SceneCanvas, WebGLFallback } from './SceneCanvas.jsx';
import { StudioEnvironment } from './StudioEnvironment.jsx';
import { Monolith, ChromePebble } from './Monolith.jsx';
import { clamp, damp } from '../../lib/utils.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';

/**
 * Drag-to-rotate monolith with inertia, damping and clamped tilt.
 * Uses raw pointer events on the canvas so it also works with touch;
 * the canvas is styled `touch-action: pan-y` so vertical page scrolling
 * is never hijacked on mobile.
 */
function DragMonolith({ onFirstInteraction }) {
  const group = useRef();
  const { gl } = useThree();
  const reduced = useReducedMotion();

  const state = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    velX: 0,
    velY: 0,
    rotX: -0.06,
    rotY: 0.6,
    idle: 0,
  });

  useEffect(() => {
    const el = gl.domElement;
    const s = state.current;

    const onPointerDown = (event) => {
      s.dragging = true;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      s.velX = 0;
      s.velY = 0;
      s.idle = 0;
      onFirstInteraction?.();
      if (el.setPointerCapture) {
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          /* capture is a nicety, not a requirement */
        }
      }
    };

    const onPointerMove = (event) => {
      if (!s.dragging) return;
      const dx = event.clientX - s.lastX;
      const dy = event.clientY - s.lastY;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      s.velY = clamp(dx * 0.0062, -0.22, 0.22);
      s.velX = clamp(dy * 0.004, -0.14, 0.14);
    };

    const endDrag = (event) => {
      if (!s.dragging) return;
      s.dragging = false;
      s.idle = 0;
      if (event && el.releasePointerCapture && el.hasPointerCapture?.(event.pointerId)) {
        try {
          el.releasePointerCapture(event.pointerId);
        } catch {
          /* noop */
        }
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [gl, onFirstInteraction]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = state.current;
    const g = group.current;
    if (!g) return;

    // Inertia: apply accumulated velocity even after release, then damp it.
    s.rotY += s.velY;
    s.rotX = clamp(s.rotX + s.velX, -0.5, 0.5);

    if (!s.dragging) {
      const decay = Math.pow(0.935, dt * 60);
      s.velY *= decay;
      s.velX *= decay;
      if (Math.abs(s.velY) < 0.0012) s.velY = 0;
      if (Math.abs(s.velX) < 0.0008) s.velX = 0;

      // Gentle idle rotation once things settle
      s.idle += dt;
      if (!reduced && s.idle > 1.6 && s.velY === 0) s.rotY += dt * 0.16;
    }

    g.rotation.y = damp(g.rotation.y, s.rotY, 9, dt);
    g.rotation.x = damp(g.rotation.x, s.rotX, 9, dt);
  });

  return (
    <group ref={group} rotation={[-0.06, 0.6, 0]}>
      <Monolith twist={0.62} roughness={0.11} envMapIntensity={1.45} />
      <ChromePebble position={[0.95, -1.6, 0.9]} scale={0.13} />
      <ChromePebble position={[-1.0, 1.55, -0.7]} scale={0.08} />
    </group>
  );
}

export default function MonolithViewer() {
  const [interacted, setInteracted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 820px)');
  const onFirstInteraction = useCallback(() => setInteracted(true), []);

  return (
    <div className="monolith-viewer">
      <SceneCanvas
        shadows={!isMobile}
        camera={{ fov: 32, position: [0, 0.15, 8.9], near: 0.1, far: 40 }}
        fallback={<WebGLFallback label="Chrome monolith illustration" />}
        aria-hidden="true"
      >
        <StudioEnvironment intensity={1.1} />
        <ambientLight intensity={0.14} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.4}
          castShadow={!isMobile}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, -1, 3]} intensity={28} color="#ccd4f2" decay={2} />
        <pointLight position={[5, 2, -1]} intensity={20} color="#ffe6cb" decay={2} />

        <DragMonolith onFirstInteraction={onFirstInteraction} />

        {!isMobile && (
          <ContactShadows
            position={[0, -2.15, 0]}
            opacity={0.55}
            scale={9}
            blur={2.6}
            far={4}
            resolution={256}
            color="#000000"
          />
        )}
      </SceneCanvas>

      <div className="monolith-viewer__frame" aria-hidden="true" />
      <span className="monolith-viewer__corner monolith-viewer__corner--tr" aria-hidden="true">
        QX / 001
      </span>
      <span className={`monolith-viewer__label${interacted ? ' is-hidden' : ''}`} aria-hidden="true">
        Touch &amp; Rotate
      </span>
    </div>
  );
}
