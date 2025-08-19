"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

type PokemonModelProps = {
  modelUrl: string;
};

function Model({ modelUrl }: PokemonModelProps) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={2} />;
}

export default function PokemonModel({ modelUrl }: PokemonModelProps) {
  return (
    <div style={{ width: "500px", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stage environment="city" intensity={0.6}>
          <Model modelUrl={modelUrl} />
        </Stage>
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}
