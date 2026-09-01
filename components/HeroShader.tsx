'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  void main() {
    // 1. Normalize coordinates to screen aspect ratio
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // 2. Mouse influence vector adjustment
    vec2 mouse = u_mouse / u_resolution;
    float distToMouse = length(st - mouse);

    // 3. Dynamic color waves based on time and mouse proximity
    vec3 color1 = vec3(0.09, 0.09, 0.15); // Dark Slate
    vec3 color2 = vec3(0.05, 0.45, 0.35); // Emerald Accent
    vec3 color3 = vec3(0.25, 0.15, 0.45); // Deep Indigo

    float wave = sin(st.x * 3.0 + u_time * 0.8) * cos(st.y * 3.0 + u_time * 0.5);
    wave += sin(distToMouse * 5.0 - u_time * 1.2) * 0.3;

    vec3 finalColor = mix(color1, color2, clamp(wave + 0.5, 0.0, 1.0));
    finalColor = mix(finalColor, color3, st.y);

    // 4. Subtle noise/grain pass for texture depth
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.04;
    finalColor += grain;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    }),
    [size]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.getElapsedTime();
      material.uniforms.u_mouse.value.set(
        state.mouse.x * (size.width / 2) + size.width / 2,
        state.mouse.y * (size.height / 2) + size.height / 2
      );
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function HeroShader() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Reduced-Motion Static Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-indigo-950 opacity-100 hidden prefers-reduced-motion:block" />

      {/* R3F Dynamic Canvas */}
      <div className="absolute inset-0 prefers-reduced-motion:hidden">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 1] }}>
          <ShaderPlane />
        </Canvas>
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
          Frontend AI Engineering Capstone
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl drop-shadow-sm">
          Interactive AI Interfaces, 3D Canvas Renders, and High-Performance Web Architecture.
        </p>
      </div>
    </div>
  );
}