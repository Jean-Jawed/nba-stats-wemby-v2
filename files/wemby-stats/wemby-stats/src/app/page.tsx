import { getGames, getAllShots } from '@/lib/db';
import Hero from '@/components/Hero';
import LastGame from '@/components/LastGame';
import Blocks from '@/components/Blocks';
import PointsChart from '@/components/PointsChart';
import Shooting from '@/components/Shooting';
import Defense from '@/components/Defense';
import Impact from '@/components/Impact';
import ShotChart from '@/components/ShotChart';
import Footer from '@/components/Footer';

export const revalidate = 3600; // Revalider toutes les heures

export default async function Home() {
  // Fetch des données côté serveur
  const games = await getGames();
  const allShots = await getAllShots();
  
  // Calculs des stats agrégées
  const totalGames = games.length;
  const totalPoints = games.reduce((sum, g) => sum + g.pts, 0);
  const totalBlocks = games.reduce((sum, g) => sum + g.blk, 0);
  const totalRebounds = games.reduce((sum, g) => sum + g.reb, 0);
  const totalAssists = games.reduce((sum, g) => sum + g.ast, 0);
  const totalSteals = games.reduce((sum, g) => sum + g.stl, 0);
  const totalDefReb = games.reduce((sum, g) => sum + g.dreb, 0);
  const totalFGM = games.reduce((sum, g) => sum + g.fgm, 0);
  const totalFGA = games.reduce((sum, g) => sum + g.fga, 0);
  const totalFG3M = games.reduce((sum, g) => sum + g.fg3m, 0);
  const totalFG3A = games.reduce((sum, g) => sum + g.fg3a, 0);
  const totalFTM = games.reduce((sum, g) => sum + g.ftm, 0);
  const totalFTA = games.reduce((sum, g) => sum + g.fta, 0);
  
  const ppg = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : '--';
  const bpg = totalGames > 0 ? (totalBlocks / totalGames).toFixed(1) : '--';
  const rpg = totalGames > 0 ? (totalRebounds / totalGames).toFixed(1) : '--';
  const avgBlocks = totalGames > 0 ? (totalBlocks / totalGames).toFixed(1) : '--';
  const maxBlocks = totalGames > 0 ? Math.max(...games.map(g => g.blk)) : 0;
  const avgSteals = totalGames > 0 ? (totalSteals / totalGames).toFixed(1) : '--';
  
  const fgPct = totalFGA > 0 ? ((totalFGM / totalFGA) * 100).toFixed(1) : '--';
  const fg3Pct = totalFG3A > 0 ? ((totalFG3M / totalFG3A) * 100).toFixed(1) : '--';
  const ftPct = totalFTA > 0 ? ((totalFTM / totalFTA) * 100).toFixed(1) : '--';
  
  const lastGame = games[0] || null;
  
  // Points par match pour le graphique (ordre chronologique)
  const pointsData = [...games].reverse().map(g => g.pts);

  return (
    <main>
      <Hero ppg={ppg} bpg={bpg} rpg={rpg} />
      
      <LastGame game={lastGame} />
      
      <Blocks 
        totalBlocks={totalBlocks} 
        avgBlocks={avgBlocks} 
        maxBlocks={maxBlocks} 
      />
      
      <PointsChart pointsData={pointsData} />
      
      <Shooting 
        fgPct={fgPct} 
        fg3Pct={fg3Pct} 
        ftPct={ftPct} 
      />
      
      <Defense 
        avgSteals={avgSteals} 
        totalDefReb={totalDefReb} 
      />
      
      <Impact 
        totalPoints={totalPoints}
        totalAssists={totalAssists}
        totalRebounds={totalRebounds}
        gamesPlayed={totalGames}
      />
      
      <ShotChart shots={allShots} />
      
      <Footer />
    </main>
  );
}
