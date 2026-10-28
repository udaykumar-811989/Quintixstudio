import { Component, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { hasWebGL } from '../../lib/webgl.js';
import { useInView } from '../../hooks/useInView.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';

/** CSS-only sculpture used when WebGL is unavailable or the scene crashes. */
export function WebGLFallback({ label }) {
  return (
    <div className="webgl-fallback" role="img" aria-label={label || 'Abstract chrome sculpture illustration'}>
      <div className="webgl-fallback__glow" />
      <div className="webgl-fallback__shape" />
    </div>
  );
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('[QUINTIX] 3D scene failed — showing CSS fallback.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Canvas wrapper handling the boring-but-critical parts:
 *  • WebGL capability check + runtime error fallback (never a blank screen)
 *  • Lazy mounting (canvas mounts when near the viewport)
 *  • Frameloop pausing when scrolled away
 *  • Reduced-motion support (single static render)
 *  • Device-aware pixel ratio
 */
export function SceneCanvas({
  children,
  className,
  style,
  fallback,
  dpr,
  camera,
  shadows = false,
  ...canvasProps
}) {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 820px)');
  const supported = useMemo(() => hasWebGL(), []);
  const [ref, inView] = useInView({ rootMargin: '500px 0px' });

  const resolvedDpr = dpr ?? [1, isMobile ? 1.3 : 1.75];
  const resolvedFallback = fallback ?? <WebGLFallback />;
  const frameloop = reduced ? 'demand' : inView ? 'always' : 'never';

  if (!supported) {
    return (
      <div ref={ref} className={className} style={{ width: '100%', height: '100%', ...style }}>
        {resolvedFallback}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%', ...style }}>
      <SceneErrorBoundary fallback={resolvedFallback}>
        <Canvas
          dpr={resolvedDpr}
          frameloop={frameloop}
          shadows={shadows ? 'percentage' : false}
          camera={camera ?? { fov: 32, position: [0, 0, 7], near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          {...canvasProps}
        >
          {children}
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
