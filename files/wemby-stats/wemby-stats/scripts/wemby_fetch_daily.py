"""
Wemby Fetch Daily
==================
Script à exécuter via Task Scheduler toutes les 3h.
Récupère les stats du dernier match de Wembanyama et les stocke dans Neon (PostgreSQL).
"""

import os
import json
from datetime import datetime
from pathlib import Path

# Charger les variables d'environnement depuis .env.local
from dotenv import load_dotenv

# ============================================================================
# CONFIGURATION
# ============================================================================

PLAYER_ID = '1641705'  # Victor Wembanyama
TEAM_ID = '1610612759'  # San Antonio Spurs
CURRENT_SEASON = '2025-26'

# Chemins
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ENV_FILE = PROJECT_ROOT / '.env.local'
LAST_RUN_FILE = SCRIPT_DIR / 'last_run.txt'
LOG_FILE = SCRIPT_DIR / 'wemby_fetch.log'

# Charger .env.local
load_dotenv(ENV_FILE)
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    raise ValueError("DATABASE_URL non définie dans .env.local")


# ============================================================================
# LOGGING
# ============================================================================

def log(message: str):
    """Log un message avec timestamp dans le fichier et la console."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {message}"
    print(log_line)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_line + '\n')


# ============================================================================
# CHECK LAST RUN
# ============================================================================

def should_run() -> bool:
    """
    Vérifie si le script doit s'exécuter.
    Retourne True si:
    - last_run.txt n'existe pas
    - last_run.txt est vide
    - la dernière exécution date de plus de 12h
    """
    if not LAST_RUN_FILE.exists():
        log("last_run.txt n'existe pas -> on lance le fetch")
        return True
    
    content = LAST_RUN_FILE.read_text().strip()
    if not content:
        log("last_run.txt est vide -> on lance le fetch")
        return True
    
    try:
        last_run = datetime.fromisoformat(content)
        hours_since = (datetime.now() - last_run).total_seconds() / 3600
        
        if hours_since >= 12:
            log(f"Dernière exécution il y a {hours_since:.1f}h (>= 12h) -> on lance le fetch")
            return True
        else:
            log(f"Dernière exécution il y a {hours_since:.1f}h (< 12h) -> on skip")
            return False
            
    except ValueError as e:
        log(f"Erreur parsing date dans last_run.txt: {e} -> on lance le fetch")
        return True


def update_last_run():
    """Met à jour last_run.txt avec la date/heure actuelle."""
    now = datetime.now().isoformat()
    LAST_RUN_FILE.write_text(now)
    log(f"last_run.txt mis à jour: {now}")


# ============================================================================
# FETCH NBA DATA
# ============================================================================

def fetch_game_log():
    """
    Récupère le game log de Wembanyama pour la saison en cours.
    Retourne un DataFrame pandas.
    """
    from nba_api.stats.endpoints import playergamelog
    import time
    
    log(f"Fetch PlayerGameLog pour player_id={PLAYER_ID}, season={CURRENT_SEASON}")
    
    gamelog = playergamelog.PlayerGameLog(
        player_id=PLAYER_ID,
        season=CURRENT_SEASON,
        season_type_all_star='Regular Season',
        timeout=60
    )
    
    time.sleep(1)  # Petit délai pour éviter le rate limiting
    
    df = gamelog.get_data_frames()[0]
    log(f"Game log récupéré: {len(df)} matchs")
    
    return df


def fetch_shot_chart(game_id: str):
    """
    Récupère le shot chart pour un match spécifique.
    Retourne une liste de dictionnaires (un par tir).
    """
    from nba_api.stats.endpoints import shotchartdetail
    import time
    
    log(f"Fetch ShotChartDetail pour game_id={game_id}")
    
    shots = shotchartdetail.ShotChartDetail(
        player_id=PLAYER_ID,
        team_id=0,
        game_id_nullable=game_id,
        season_nullable=CURRENT_SEASON,
        context_measure_simple='FGA',
        timeout=60
    )
    
    time.sleep(1)
    
    df = shots.get_data_frames()[0]
    log(f"Shot chart récupéré: {len(df)} tirs")
    
    # Convertir en liste de dicts avec seulement les colonnes utiles
    shot_list = []
    for _, row in df.iterrows():
        shot_list.append({
            'loc_x': int(row['LOC_X']),
            'loc_y': int(row['LOC_Y']),
            'shot_made': int(row['SHOT_MADE_FLAG']),
            'shot_type': row['SHOT_TYPE'],
            'shot_zone': row['SHOT_ZONE_BASIC'],
            'shot_distance': int(row['SHOT_DISTANCE']),
            'period': int(row['PERIOD']),
            'action_type': row['ACTION_TYPE']
        })
    
    return shot_list


# ============================================================================
# DATABASE (NEON)
# ============================================================================

def get_db_connection():
    """Crée une connexion à la base Neon."""
    import psycopg2
    return psycopg2.connect(DATABASE_URL)


def get_existing_game_ids() -> set:
    """Récupère les game_id déjà présents dans la base."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT game_id FROM games")
            existing = {row[0] for row in cur.fetchall()}
            log(f"{len(existing)} matchs déjà en base")
            return existing
    finally:
        conn.close()


def insert_game(game_data: dict) -> bool:
    """Insère un nouveau match dans la base."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO games (
                    game_id, season_id, game_date, matchup, wl,
                    min, pts, reb, ast, stl, blk, tov, pf,
                    fgm, fga, fg_pct, fg3m, fg3a, fg3_pct,
                    ftm, fta, ft_pct, oreb, dreb, plus_minus, shots
                ) VALUES (
                    %(game_id)s, %(season_id)s, %(game_date)s, %(matchup)s, %(wl)s,
                    %(min)s, %(pts)s, %(reb)s, %(ast)s, %(stl)s, %(blk)s, %(tov)s, %(pf)s,
                    %(fgm)s, %(fga)s, %(fg_pct)s, %(fg3m)s, %(fg3a)s, %(fg3_pct)s,
                    %(ftm)s, %(fta)s, %(ft_pct)s, %(oreb)s, %(dreb)s, %(plus_minus)s, %(shots)s
                )
            """, game_data)
            conn.commit()
            log(f"Match {game_data['game_id']} inséré avec succès")
            return True
    except Exception as e:
        log(f"Erreur insertion match: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()


def prepare_game_data(game_row, shots: list) -> dict:
    """
    Transforme une ligne du DataFrame en dictionnaire pour PostgreSQL.
    """
    return {
        'game_id': game_row['Game_ID'],
        'season_id': game_row['SEASON_ID'],
        'game_date': game_row['GAME_DATE'],
        'matchup': game_row['MATCHUP'],
        'wl': game_row['WL'],
        'min': int(game_row['MIN']) if game_row['MIN'] else 0,
        'pts': int(game_row['PTS']),
        'reb': int(game_row['REB']),
        'ast': int(game_row['AST']),
        'stl': int(game_row['STL']),
        'blk': int(game_row['BLK']),
        'tov': int(game_row['TOV']),
        'pf': int(game_row['PF']),
        'fgm': int(game_row['FGM']),
        'fga': int(game_row['FGA']),
        'fg_pct': float(game_row['FG_PCT']) if game_row['FG_PCT'] else 0,
        'fg3m': int(game_row['FG3M']),
        'fg3a': int(game_row['FG3A']),
        'fg3_pct': float(game_row['FG3_PCT']) if game_row['FG3_PCT'] else 0,
        'ftm': int(game_row['FTM']),
        'fta': int(game_row['FTA']),
        'ft_pct': float(game_row['FT_PCT']) if game_row['FT_PCT'] else 0,
        'oreb': int(game_row['OREB']),
        'dreb': int(game_row['DREB']),
        'plus_minus': int(game_row['PLUS_MINUS']) if game_row['PLUS_MINUS'] else 0,
        'shots': json.dumps(shots)  # Shot chart en JSON
    }


# ============================================================================
# MAIN
# ============================================================================

def main():
    log("=" * 60)
    log("Démarrage Wemby Fetch Daily")
    log("=" * 60)
    
    # 1. Vérifier si on doit exécuter
    if not should_run():
        log("Fin du script (skip)")
        return
    
    try:
        # 2. Fetch le game log
        game_log_df = fetch_game_log()
        
        if game_log_df.empty:
            log("Aucun match trouvé pour cette saison")
            update_last_run()
            return
        
        # 3. Récupérer les matchs déjà en base
        existing_ids = get_existing_game_ids()
        
        # 4. Traiter uniquement les nouveaux matchs
        new_games_count = 0
        
        for idx, game_row in game_log_df.iterrows():
            game_id = game_row['Game_ID']
            
            if game_id in existing_ids:
                log(f"Match {game_id} déjà en base, skip")
                continue
            
            # Fetch le shot chart pour ce match
            try:
                shots = fetch_shot_chart(game_id)
            except Exception as e:
                log(f"Erreur fetch shot chart pour {game_id}: {e}")
                shots = []
            
            # Préparer et insérer les données
            game_data = prepare_game_data(game_row, shots)
            
            if insert_game(game_data):
                new_games_count += 1
        
        log(f"{new_games_count} nouveau(x) match(s) ajouté(s)")
        
        # 5. Mettre à jour last_run
        update_last_run()
        
    except Exception as e:
        log(f"ERREUR: {e}")
        import traceback
        log(traceback.format_exc())
    
    log("Fin du script")


if __name__ == '__main__':
    main()
