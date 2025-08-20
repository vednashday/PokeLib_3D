// src/components/Loader.tsx
"use client";

import React, { JSX, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Ring } from '@react-three/drei';
import { Group } from 'three';

function Pokeball(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF('/models/pokeball.glb');
  
  useFrame((state, delta) => {
    scene.rotation.y += delta * 0.5;
    scene.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return <primitive object={scene} scale={1} {...props} />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Pokeball />
    </>
  );
}

export default function Loader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900">
      <div className="w-full h-1/2">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
      <p className="text-white text-2xl font-semibold -mt-16 animate-pulse">
        Loading Pokédex...
      </p>
    </div>
  );
}