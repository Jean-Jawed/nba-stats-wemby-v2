import type { Game } from '@/lib/db';

interface LastGameProps {
  game: Game | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default function LastGame({ game }: LastGameProps) {
  if (!game) {
    return (
      <section id="last-game">
        <div className="container">
          <h2 className="section-title">DERNIER MATCH</h2>
          <div className="last-game-card">
            <div className="loading">Aucune donnée disponible</div>
          </div>
        </div>
      </section>
    );
  }

  const fgPct = game.fga > 0 ? ((game.fgm / game.fga) * 100).toFixed(1) : '0.0';

  return (
    <section id="last-game">
      <div className="container">
        <h2 className="section-title">DERNIER MATCH</h2>
        <div className="last-game-card">
          <div className="game-header">
            <div className="game-date">{formatDate(game.game_date)}</div>
            <div className="game-matchup">{game.matchup}</div>
            <div className={`game-result ${game.wl === 'W' ? 'win' : 'loss'}`}>
              {game.wl === 'W' ? 'VICTOIRE' : 'DÉFAITE'}
            </div>
          </div>
          <div className="game-stats-grid">
            <div className="game-stat-item">
              <span className="game-stat-value">{game.pts}</span>
              <span className="game-stat-label">Points</span>
            </div>
            <div className="game-stat-item">
              <span className="game-stat-value">{game.reb}</span>
              <span className="game-stat-label">Rebonds</span>
            </div>
            <div className="game-stat-item">
              <span className="game-stat-value">{game.ast}</span>
              <span className="game-stat-label">Passes</span>
            </div>
            <div className="game-stat-item">
              <span className="game-stat-value">{game.blk}</span>
              <span className="game-stat-label">Contres</span>
            </div>
            <div className="game-stat-item">
              <span className="game-stat-value">{game.stl}</span>
              <span className="game-stat-label">Interceptions</span>
            </div>
            <div className="game-stat-item">
              <span className="game-stat-value">{fgPct}%</span>
              <span className="game-stat-label">FG%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
