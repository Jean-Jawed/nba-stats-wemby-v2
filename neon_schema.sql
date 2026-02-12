-- ============================================================================
-- SCHEMA NEON POUR WEMBY STATS
-- ============================================================================
-- À exécuter dans la console SQL de Neon (Dashboard > SQL Editor)
-- ============================================================================

-- Table principale : un match par ligne
CREATE TABLE IF NOT EXISTS games (
    -- Identifiant unique du match (fourni par l'API NBA)
    game_id TEXT PRIMARY KEY,
    
    -- Métadonnées du match
    season_id TEXT NOT NULL,
    game_date DATE NOT NULL,
    matchup TEXT NOT NULL,           -- Ex: "SAS vs LAL" ou "SAS @ PHX"
    wl CHAR(1) NOT NULL,             -- "W" ou "L"
    
    -- Minutes jouées
    min INTEGER DEFAULT 0,
    
    -- Stats principales
    pts INTEGER NOT NULL DEFAULT 0,
    reb INTEGER NOT NULL DEFAULT 0,
    ast INTEGER NOT NULL DEFAULT 0,
    stl INTEGER NOT NULL DEFAULT 0,
    blk INTEGER NOT NULL DEFAULT 0,
    tov INTEGER NOT NULL DEFAULT 0,  -- Turnovers
    pf INTEGER NOT NULL DEFAULT 0,   -- Personal fouls
    
    -- Field Goals
    fgm INTEGER NOT NULL DEFAULT 0,  -- Field Goals Made
    fga INTEGER NOT NULL DEFAULT 0,  -- Field Goals Attempted
    fg_pct DECIMAL(5,3) DEFAULT 0,   -- Field Goal Percentage (0.000 à 1.000)
    
    -- 3 Points
    fg3m INTEGER NOT NULL DEFAULT 0, -- 3PT Made
    fg3a INTEGER NOT NULL DEFAULT 0, -- 3PT Attempted
    fg3_pct DECIMAL(5,3) DEFAULT 0,  -- 3PT Percentage
    
    -- Free Throws
    ftm INTEGER NOT NULL DEFAULT 0,  -- Free Throws Made
    fta INTEGER NOT NULL DEFAULT 0,  -- Free Throws Attempted
    ft_pct DECIMAL(5,3) DEFAULT 0,   -- Free Throw Percentage
    
    -- Rebonds détaillés
    oreb INTEGER NOT NULL DEFAULT 0, -- Offensive Rebounds
    dreb INTEGER NOT NULL DEFAULT 0, -- Defensive Rebounds
    
    -- Impact
    plus_minus INTEGER DEFAULT 0,
    
    -- Shot chart (JSON array des tirs)
    -- Structure: [{"loc_x": 15, "loc_y": 120, "shot_made": 1, "shot_type": "2PT", ...}, ...]
    shots JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamp d'insertion
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date DESC);
CREATE INDEX IF NOT EXISTS idx_games_season ON games(season_id);

-- ============================================================================
-- EXEMPLE DE DONNÉES (optionnel, pour tester)
-- ============================================================================
/*
INSERT INTO games (
    game_id, season_id, game_date, matchup, wl,
    min, pts, reb, ast, stl, blk, tov, pf,
    fgm, fga, fg_pct, fg3m, fg3a, fg3_pct, ftm, fta, ft_pct,
    oreb, dreb, plus_minus, shots
) VALUES (
    '0022500001', '22025', '2025-10-22', 'SAS vs LAL', 'W',
    35, 32, 12, 4, 1, 3, 2, 3,
    12, 22, 0.545, 2, 5, 0.400, 6, 8, 0.750,
    3, 9, 15,
    '[{"loc_x": 15, "loc_y": 120, "shot_made": 1, "shot_type": "2PT Field Goal", "shot_zone": "Mid-Range", "shot_distance": 12, "period": 1, "action_type": "Jump Shot"}]'::jsonb
);
*/

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
-- Après exécution, tu peux vérifier avec:
-- SELECT * FROM games ORDER BY game_date DESC LIMIT 5;
