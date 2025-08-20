"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";


const Library = () => {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<{ name: string; url: string }[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;
  const router = useRouter();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data.results);
      });

    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => {
        setTypes(data.results.map((t: { name: string }) => t.name));
      });
  }, []);

  const getIdFromUrl = (url: string) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  let filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const [typeMap, setTypeMap] = useState<{ [key: string]: string[] }>({});
  useEffect(() => {
    const fetchTypes = async () => {
      const map: { [key: string]: string[] } = {};
      for (const t of types) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${t}`);
        const data = await res.json();
        map[t] = data.pokemon.map((p: { pokemon: { name: string } }) => p.pokemon.name);
      }
      setTypeMap(map);
    };
    if (types.length > 0) fetchTypes();
  }, [types]);

  if (selectedType !== "all" && typeMap[selectedType]) {
    filteredPokemon = filteredPokemon.filter((p) =>
      typeMap[selectedType].includes(p.name)
    );
  }

  const totalPages = Math.ceil(filteredPokemon.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedPokemon = filteredPokemon.slice(start, start + perPage);

  const generatePages = () => {
    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handleSurpriseMe = () => {
    if (filteredPokemon.length === 0) return;
    const random = filteredPokemon[Math.floor(Math.random() * filteredPokemon.length)];
    router.push(`/pokemon/${random.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-gray-900 p-10 font-mono">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        {/* Search + Surprise Me button */}
        <div className="flex w-[60%]">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow bg-yellow-200 text-red-900 text-xl font-extrabold p-4
            rounded-none border-4 border-black shadow-[4px_4px_0px_#000]
            focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
          <button
            onClick={handleSurpriseMe}
            className="ml-2 px-4 py-2 bg-pink-400 text-black font-bold border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-pink-500 transition-colors"
          >
            <Image
              src="/random.png"
              width={32}
              height={32}
              className="text-black"
              alt="Random Pokemon"
            />
          </button>
        </div>

        {/* Type filter */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 bg-yellow-200 text-red-900 text-lg font-bold max-h-[20vh] border-4 border-black shadow-[4px_4px_0px_#000] rounded-none overflow-y-auto no-scrollbar"
        >
          <option value="all">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Back button */}
        <Link
          href="/"
          className="px-6 py-3 bg-yellow-200 text-red-900 font-extrabold 
          border-4 border-black shadow-[4px_4px_0px_#000] 
          text-xl rounded-none hover:bg-yellow-300 transition-colors"
        >
          &larr; Back
        </Link>
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
        {paginatedPokemon.map((p, idx) => {
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

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 border-4 border-black text-black font-bold bg-yellow-200 hover:bg-yellow-300 disabled:opacity-50"
        >
          &lt;
        </button>

        {generatePages().map((p, i) =>
          typeof p === "number" ? (
            <button
              key={i}
              onClick={() => setCurrentPage(p)}
              className={`px-4 py-2 border-4 border-black font-bold ${
                currentPage === p
                  ? "bg-yellow-400 text-red-900 shadow-[4px_4px_0px_#000]"
                  : "bg-yellow-200 text-red-900 hover:bg-yellow-300"
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-3 text-yellow-200 font-bold">
              {p}
            </span>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 border-4 border-black text-black font-bold bg-yellow-200 hover:bg-yellow-300 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Library;

