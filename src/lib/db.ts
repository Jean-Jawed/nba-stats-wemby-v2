import { neon } from '@neondatabase/serverless';

// Vérifier que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL non définie dans .env.local');
}

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

// Parser les shots (JSONB peut être retourné comme string)
function parseShots(shots: unknown): Shot[] {
  if (!shots) return [];
  if (typeof shots === 'string') {
    try {
      return JSON.parse(shots);
    } catch {
      return [];
    }
  }
  if (Array.isArray(shots)) return shots;
  return [];
}

// Transformer une row brute en Game typé
function parseGame(row: Record<string, unknown>): Game {
  return {
    game_id: String(row.game_id || ''),
    season_id: String(row.season_id || ''),
    game_date: String(row.game_date || ''),
    matchup: String(row.matchup || ''),
    wl: (row.wl === 'W' ? 'W' : 'L') as 'W' | 'L',
    min: Number(row.min) || 0,
    pts: Number(row.pts) || 0,
    reb: Number(row.reb) || 0,
    ast: Number(row.ast) || 0,
    stl: Number(row.stl) || 0,
    blk: Number(row.blk) || 0,
    tov: Number(row.tov) || 0,
    pf: Number(row.pf) || 0,
    fgm: Number(row.fgm) || 0,
    fga: Number(row.fga) || 0,
    fg_pct: Number(row.fg_pct) || 0,
    fg3m: Number(row.fg3m) || 0,
    fg3a: Number(row.fg3a) || 0,
    fg3_pct: Number(row.fg3_pct) || 0,
    ftm: Number(row.ftm) || 0,
    fta: Number(row.fta) || 0,
    ft_pct: Number(row.ft_pct) || 0,
    oreb: Number(row.oreb) || 0,
    dreb: Number(row.dreb) || 0,
    plus_minus: Number(row.plus_minus) || 0,
    shots: parseShots(row.shots),
    created_at: String(row.created_at || ''),
  };
}

// Récupérer tous les matchs (triés par date décroissante)
export async function getGames(): Promise<Game[]> {
  try {
    const rows = await sql`
      SELECT * FROM games 
      ORDER BY game_date DESC
    `;
    console.log(`✅ ${rows.length} matchs récupérés de Neon`);
    return rows.map(row => parseGame(row as Record<string, unknown>));
  } catch (error) {
    console.error('❌ Erreur getGames:', error);
    return [];
  }
}

// Récupérer le dernier match
export async function getLastGame(): Promise<Game | null> {
  try {
    const rows = await sql`
      SELECT * FROM games 
      ORDER BY game_date DESC 
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return parseGame(rows[0] as Record<string, unknown>);
  } catch (error) {
    console.error('❌ Erreur getLastGame:', error);
    return null;
  }
}

// Récupérer tous les shots de tous les matchs
export async function getAllShots(): Promise<Shot[]> {
  try {
    const rows = await sql`
      SELECT shots FROM games 
      ORDER BY game_date DESC
    `;
    
    const allShots: Shot[] = [];
    for (const row of rows) {
      const shots = parseShots((row as Record<string, unknown>).shots);
      allShots.push(...shots);
    }
    
    console.log(`✅ ${allShots.length} tirs récupérés`);
    return allShots;
  } catch (error) {
    console.error('❌ Erreur getAllShots:', error);
    return [];
  }
}

export { sql };
