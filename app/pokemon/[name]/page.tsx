"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Grid } from "@react-three/drei";
import React, { useEffect, useState, Suspense, useMemo, Component, ErrorInfo } from "react";
import { Box3, Vector3 } from "three";
import Loader from "../../../src/components/Loader";
import Link from "next/link";

// --- TYPE DEFINITIONS ---
type PokemonForm = { name: string; model: string; formName: string };
type Pokemon3D = { id: number; forms: PokemonForm[] };
type PokemonStat = { base_stat: number; stat: { name: string; }; };
type PokemonType = { type: { name: string; }; };
type PokemonAbility = { ability: { name: string; }; };
type PokemonDetails = { id: number; stats: PokemonStat[]; types: PokemonType[]; abilities: PokemonAbility[]; sprites: { front_default: string; }; };

// --- MOCK DATA & CONFIG ---
const typeColors: { [key: string]: string } = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-300",
    fighting: "bg-orange-700",
    poison: "bg-purple-600",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-700",
    ghost: "bg-indigo-800",
    dragon: "bg-indigo-600",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
};


// --- UI COMPONENTS ---




// Error boundary specifically for the 3D model
class ModelErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(_: Error) { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("3D Model failed to load:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-white bg-red-900/50 rounded-lg">
          <p className="text-center font-semibold">3D Model<br/>Not Available</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Component to load and display the 3D model
function PokemonModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { scale, position } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 3 / maxDim;
    const newPosition: [number, number, number] = [0, -1 - (box.min.y * scaleFactor), 0];
    return { scale: scaleFactor, position: newPosition };
  }, [scene]);
  return <primitive object={scene} scale={scale} position={position} />;
}

// --- MAIN PAGE COMPONENT ---
export default function PokemonDetail() {
  // Replaced next/navigation with a simple URL parser to work in any environment.
  // It defaults to 'bulbasaur' if the name isn't in the URL path.
  const name = useMemo(() => {
      if (typeof window === 'undefined') return 'bulbasaur';
      const pathParts = window.location.pathname.split('/');
      return pathParts[pathParts.length - 1] || 'bulbasaur';
  }, []);


  // --- STATE MANAGEMENT ---
  const [pokemon, setPokemon] = useState<Pokemon3D | null>(null);
  const [selectedForm, setSelectedForm] = useState<PokemonForm | null>(null);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [prevPokemon, setPrevPokemon] = useState<Pokemon3D | null>(null);
  const [nextPokemon, setNextPokemon] = useState<Pokemon3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isControlsInfoVisible, setIsControlsInfoVisible] = useState(false);

  // --- DATA FETCHING EFFECTS ---
  useEffect(() => {
    setIsLoading(true);
    setPokemonDetails(null); 
    fetch("https://pokemon-3d-api.onrender.com/v1/pokemon")
      .then(res => res.json())
      .then((data: Pokemon3D[]) => {
        const currentIndex = data.findIndex(item => item.forms.some(f => f.name.toLowerCase() === name.toLowerCase()));
        if (currentIndex !== -1) {
          const currentEntry = data[currentIndex];
          setPokemon(currentEntry);
          const regular = currentEntry.forms.find(f => f.formName === "regular") || currentEntry.forms[0];
          setSelectedForm(regular);
          setPrevPokemon(currentIndex > 0 ? data[currentIndex - 1] : null);
          setNextPokemon(currentIndex < data.length - 1 ? data[currentIndex + 1] : null);
        } else {
          throw new Error("Pokémon not found in 3D database.");
        }
      })
      .catch(err => {
        console.error("Failed to fetch 3D Pokemon data:", err);
        setError("Could not load Pokémon data.");
        setIsLoading(false);
      });
  }, [name]);

  useEffect(() => {
    if (!pokemon) return;
    const baseName = pokemon.forms[0].name.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${baseName}`)
      .then(res => {
        if (!res.ok) throw new Error("Pokémon not found in PokéAPI.");
        return res.json();
      })
      .then((data: PokemonDetails) => setPokemonDetails(data))
      .catch(err => {
        console.error("Failed to fetch PokéAPI details:", err);
        setError("Could not load Pokémon details.");
      })
      .finally(() => setIsLoading(false));
  }, [pokemon]);

  // --- RENDER LOGIC ---
  if (isLoading) {
    return <Loader />;
  }

  if (error || !pokemon || !selectedForm || !pokemonDetails) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 text-xl font-semibold mb-4">{error || "Failed to load Pokémon."}</p>
        <Link href="/" className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
            &larr; Back to Library
        </Link>
      </div>
    );
  }

  const modelUrl = selectedForm.model;

  return (
    <div className="h-screen flex flex-col md:flex-row w-full bg-gray-100 font-sans">
      {/* 3D Model Section */}
      <div className="relative w-full h-[50vh] md:h-auto md:flex-1 bg-black">
        <ModelErrorBoundary>
          <Canvas camera={{ position: [0, 2, 8], fov: 50 }} >
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            
            <color attach="background" args={["#101010"]} />
            <Grid
              position={[0, -1, 0]}
              infiniteGrid
              cellSize={0.6}
              cellThickness={0.6}
              sectionSize={3}
              sectionThickness={1.5}
              sectionColor={"#EF4444"}
              fadeDistance={25}
            />
            <Suspense fallback={null}>
              <PokemonModel url={modelUrl} />
            </Suspense>
            <OrbitControls
              enableZoom={true}
              autoRotate
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </ModelErrorBoundary>

        {/* Controls Info Button */}
        <button
          onClick={() => setIsControlsInfoVisible(true)}
          className="absolute top-4 left-4 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Show camera controls"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Controls Info Modal/Overlay */}
        {isControlsInfoVisible && (
          <div 
            className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setIsControlsInfoVisible(false)} // Close on overlay click
          >
            <div 
              className="bg-gray-800/90 text-white p-6 rounded-lg shadow-xl max-w-xs w-full relative border border-gray-600"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <button
                onClick={() => setIsControlsInfoVisible(false)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded-full"
                aria-label="Close controls info"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold mb-4 text-center">Camera Controls</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-4">
                  <span className="font-bold text-lg w-20">Rotate:</span>
                  <span className="text-gray-300">Hold Left Click + Drag</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="font-bold text-lg w-20">Pan:</span>
                  <span className="text-gray-300">Hold Right Click + Drag</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="font-bold text-lg w-20">Zoom:</span>
                  <span className="text-gray-300">Scroll Wheel</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 p-4 md:p-8 flex flex-col justify-between overflow-y-auto">
        <div className="mb-5">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
          >
            &larr; Back to Main Menu
          </Link>
        </div>

        {/* Pokémon Info */}
        <div className="flex-grow flex flex-col justify-center pt-6 md:pt-0">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <img
              src={pokemonDetails.sprites.front_default}
              alt={selectedForm.name}
              className="w-12 h-12 md:w-16 md:h-16 bg-white/50 rounded-full border-2 border-gray-400"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold capitalize text-gray-800">
                {selectedForm.name.replace("-", " ")}
              </h1>
              <span className="text-2xl md:text-4xl font-light text-gray-500">
                #{pokemonDetails.id.toString().padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* Types */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {pokemonDetails.types.map(({ type }) => (
              <span
                key={type.name}
                className={`px-4 py-1 rounded-full text-white text-lg font-semibold capitalize shadow ${
                  typeColors[type.name] || "bg-gray-500"
                }`}
              >
                {type.name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Base Stats</h2>
            {pokemonDetails.stats.map(({ stat, base_stat }) => (
              <div key={stat.name} className="grid grid-cols-3 items-center gap-2">
                <span className="font-semibold capitalize text-gray-600">
                  {stat.name.replace("-", " ")}
                </span>
                <div className="col-span-2 bg-gray-300 rounded-full h-5 shadow-inner">
                  <div
                    className="bg-red-500 h-5 rounded-full flex items-center justify-end px-2 text-white font-bold text-sm"
                    style={{ width: `${(base_stat / 255) * 100}%` }}
                  >
                    {base_stat}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Abilities</h2>
            <div className="flex flex-wrap gap-3">
              {pokemonDetails.abilities.map(({ ability }) => (
                <span
                  key={ability.name}
                  className="px-3 py-1 bg-white rounded-md font-medium text-gray-700 capitalize shadow-sm border"
                >
                  {ability.name.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Forms */}
          {pokemon.forms.length > 1 && (
            <div className="pt-6 border-t border-gray-300">
              <h3 className="text-xl font-bold text-gray-700 mb-3">
                Available Forms
              </h3>
              <div className="flex flex-wrap gap-3">
                {pokemon.forms.map((form) => (
                  <button
                    key={form.name}
                    onClick={() => setSelectedForm(form)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-transform duration-200 hover:scale-105 ${
                      form.formName === selectedForm.formName
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                    }`}
                  >
                    {form.formName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center gap-2">
          {prevPokemon ? (
            <Link
              href={`/pokemon/${prevPokemon.forms[0].name.toLowerCase()}`}
              className="flex items-center gap-2 px-3 py-2 md:px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
              <span className="text-xl">&larr;</span>
              <div>
                <p className="text-xs text-red-200">Previous</p>
                <p className="font-bold capitalize">{prevPokemon.forms[0].name}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPokemon ? (
            <Link
              href={`/pokemon/${nextPokemon.forms[0].name.toLowerCase()}`}
              className="flex items-center gap-2 px-3 py-2 md:px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors text-right"
            >
              <div>
                <p className="text-xs text-red-200">Next</p>
                <p className="font-bold capitalize">{nextPokemon.forms[0].name}</p>
              </div>
              <span className="text-xl">&rarr;</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
