"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ParallaxSection } from "../src/hooks/parralax";

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-400 to-purple-500 animate-gradient bg-fixed bg-center bg-cover">
      <ParallaxSection speed={-100}>
          <motion.img
            src="/charmander.png"
            alt="Pokeball"
            initial={{ x: 20 }}
            animate={{ x: [0, -20, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-70 right-40 rotate-10 opacity-50 z-30 lg:w-170 md:w-0 sm:w-0 "
          />
        </ParallaxSection>
        <ParallaxSection speed={-100}>
          <motion.img
            src="/pokeball.png"
            alt="Pokeball"
            initial={{ x: 20, y: -20 }}
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute lg:top-20 lg:left-10  opacity-30 z-30 lg:w-200 md:top-35 md:left-0 sm:center"
          />
        </ParallaxSection>
      <div className="relative min-h-screen overflow-hidden">
        {/* Hero */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 text-white bg-fixed bg-center bg-cover">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-7xl font-extrabold drop-shadow-lg"
          >
            Pokédex 3D
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 text-lg md:text-2xl max-w-xl text-white/90"
          >
            Explore the world of Pokémon with stunning visuals and an
            interactive 3D experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10"
          >
            <Link href="/library">
              <button className="px-8 py-4 bg-white text-red-600 font-bold text-xl rounded-2xl shadow-lg hover:scale-105 transition-transform">
                Go to Library →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
      </div>
  );
}
