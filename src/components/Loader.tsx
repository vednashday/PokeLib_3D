// src/components/Loader.tsx
"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Ring } from '@react-three/drei';
import { Group } from 'three';

function Pokeball(props: any) {
  const { scene } = useGLTF('/models/pokeball.glb');
  
  useFrame((state, delta) => {
    scene.rotation.y += delta * 0.5;
    scene.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return <primitive object={scene} scale={1} {...props} />;
}

function Scene() {
  const ring1 = useRef<Group>(null);
  const ring2 = useRef<Group>(null);
  const ring3 = useRef<Group>(null);

  useFrame((state, delta) => {
    if (ring1.current && ring2.current && ring3.current) {
      ring1.current.rotation.x = ring1.current.rotation.y += delta * 0.4;
      ring2.current.rotation.x = ring2.current.rotation.y += delta * 0.6;
      ring3.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      
      <Pokeball />

      <group ref={ring1}>
        <Ring args={[0.9, 1, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0077ff" emissive="#0077ff" emissiveIntensity={2} toneMapped={false} />
        </Ring>
      </group>
      <group ref={ring2}>
        <Ring args={[1.2, 1.3, 64]} rotation={[Math.PI / 2, Math.PI / 3, 0]}>
          <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={2} toneMapped={false} />
        </Ring>
      </group>
      <group ref={ring3}>
        <Ring args={[1.5, 1.6, 64]} rotation={[Math.PI / 2, Math.PI / 1.5, 0]}>
          <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={2} toneMapped={false} />
        </Ring>
      </group>
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