export type PokemonForm = {
  name: string;
  model: string;
  formName: string;
};

export type PokemonStats = {
  base_stat: number;
  stat: { name: string };
};

export type Pokemon3D = {
  id: number;
  forms: PokemonForm[];
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: PokemonStats[];
  moves: { name: string; level_learned_at: number }[];
  evolutions: string[];
  shinyModel?: string; 
};