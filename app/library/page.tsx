"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Library = () => {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data.results);
      });
  }, []);

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getIdFromUrl = (url: string) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-800 to-gray-100 p-10 ">
      {/* Search */}
      <div className="relative flex justify-around mb-10">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[60%] bg-zinc-200 text-red-700 text-xl font-extrabold p-4 rounded-full  border-gray-800 border-4 shadow-9xl focus:outline-none focus:ring-7 focus:ring-red-800"
        />
        <Link href="/" className="flex px-4 py-2 bg-zinc-200 text-red-700 font-extrabold items-center text-center border-gray-800 border-4 shadow-9xl justify-center text-xl rounded-full hover:bg-gray-400 transition-colors z-10">
            &larr; Back to Main Menu
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-20">
        {filteredPokemon.map((p, idx) => {
            
          const id = getIdFromUrl(p.url);
          return (
            <Link href={`/pokemon/${p.name}`} key={p.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="bg-zinc-500 rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={p.name}
                  className="w-24 h-24"
                />
                <h3 className="mt-3 text-lg font-bold capitalize">{p.name}</h3>
              </motion.div>
            </Link>
          );
        })}
      </div>
      </div>
  );
};

export default Library;
