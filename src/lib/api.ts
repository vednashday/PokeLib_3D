export async function getPokemons(limit: number = 151) {
  const results = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!results.ok) throw new Error("Failed to fetch pokemons");
  return results.json();
}