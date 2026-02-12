import { neon } from '@neondatabase/serverless';

// Créer le client SQL
const sql = neon(process.env.DATABASE_URL!);

// Types pour les données
export interface Game {
  game_id: string;
  season_id: string;
  game_date: string;
  matchup: string;
  wl: 'W' | 'L';
  min: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  fgm: number;
  fga: number;
  fg_pct: number;
  fg3m: number;
  fg3a: number;
  fg3_pct: number;
  ftm: number;
  fta: number;
  ft_pct: number;
  oreb: number;
  dreb: number;
  plus_minus: number;
  shots: Shot[];
  created_at: string;
}

export interface Shot {
  loc_x: number;
  loc_y: number;
  shot_made: number;
  shot_type: string;
  shot_zone: string;
  shot_distance: number;
  period: number;
  action_type: string;
}

// Récupérer tous les matchs (triés par date décroissante)
export async function getGames(): Promise<Game[]> {
  const games = await sql`
    SELECT * FROM games 
    ORDER BY game_date DESC
  `;
  return games as Game[];
}

// Récupérer le dernier match
export async function getLastGame(): Promise<Game | null> {
  const games = await sql`
    SELECT * FROM games 
    ORDER BY game_date DESC 
    LIMIT 1
  `;
  return games[0] as Game || null;
}

// Récupérer tous les shots de tous les matchs
export async function getAllShots(): Promise<Shot[]> {
  const games = await sql`
    SELECT shots FROM games 
    ORDER BY game_date DESC
  `;
  
  const allShots: Shot[] = [];
  for (const game of games) {
    if (game.shots && Array.isArray(game.shots)) {
      allShots.push(...game.shots);
    }
  }
  
  return allShots;
}

export { sql };
