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
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-gray-900 p-10 font-mono">
      {/* Search */}
      <div className="relative flex justify-around mb-10">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[60%] bg-yellow-200 text-red-900 text-xl font-extrabold p-4 
          rounded-none border-4 border-black shadow-[4px_4px_0px_#000] 
          focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
        <Link
          href="/"
          className="flex px-6 py-3 bg-yellow-200 text-red-900 font-extrabold 
          items-center text-center border-4 border-black shadow-[4px_4px_0px_#000] 
          text-xl rounded-none hover:bg-yellow-300 transition-colors"
        >
          &larr; Back
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
                className="relative bg-zinc-800 border-4 border-black 
                rounded-none shadow-[6px_6px_0px_#000] 
                p-4 flex flex-col items-center group cursor-pointer 
                overflow-hidden"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                translate-x-[-100%] group-hover:translate-x-[100%] 
                transition-transform duration-700 skew-x-12" />

                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={p.name}
                  className="w-24 h-24 pixelated"
                />
                <h3 className="mt-3 text-lg font-bold capitalize text-yellow-300">
                  {p.name}
                </h3>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
