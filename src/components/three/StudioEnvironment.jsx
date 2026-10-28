import { Suspense } from 'react';
import { Environment, Lightformer } from '@react-three/drei';

/**
 * Procedural "studio" environment built from lightformers.
 * Fully local — no HDR downloads, so reflections work offline and load instantly.
 */
export function StudioEnvironment({ intensity = 1 }) {
  return (
    <Suspense fallback={null}>
      <Environment resolution={256} frames={1} environmentIntensity={intensity}>
        <color attach="background" args={['#08080a']} />
        {/* key softbox above */}
        <Lightformer
          form="rect"
          intensity={5}
          color="#ffffff"
          position={[0, 5, 1]}
          rotation-x={Math.PI / 2}
          scale={[10, 4, 1]}
        />
        {/* cool strip left */}
        <Lightformer
          form="rect"
          intensity={3}
          color="#dbe2f7"
          position={[-6, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[6, 9, 1]}
        />
        {/* warm strip right */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffe8cf"
          position={[6, 0, 2]}
          rotation-y={-Math.PI / 2}
          scale={[6, 9, 1]}
        />
        {/* bounce from below */}
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ffffff"
          position={[0, -5, 3]}
          rotation-x={-Math.PI / 2.6}
          scale={[9, 3, 1]}
        />
        {/* specular ring highlight */}
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[3, 4, 4]} scale={2.5} />
        <Lightformer form="ring" intensity={2} color="#c9ccdb" position={[-3, 3, 4]} scale={1.6} />
      </Environment>
    </Suspense>
  );
}
