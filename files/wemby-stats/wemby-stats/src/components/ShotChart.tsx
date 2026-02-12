'use client';

import { useEffect, useRef } from 'react';
import type { Shot } from '@/lib/db';

interface ShotChartProps {
  shots: Shot[];
}

export default function ShotChart({ shots }: ShotChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 470;

    // Dessiner le terrain
    drawCourt(ctx, canvas.width, canvas.height);

    // Dessiner les tirs
    if (shots && shots.length > 0) {
      shots.forEach(shot => {
        // Conversion des coordonnées NBA vers canvas
        const x = shot.loc_x + canvas.width / 2;
        const y = canvas.height - shot.loc_y - 50;
        
        const made = shot.shot_made === 1;

        ctx.fillStyle = made ? 'rgba(0, 255, 0, 0.6)' : 'rgba(255, 68, 68, 0.6)';
        ctx.strokeStyle = made ? 'rgba(0, 200, 0, 0.8)' : 'rgba(200, 50, 50, 0.8)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }
  }, [shots]);

  return (
    <section id="shot-chart">
      <div className="container">
        <h2 className="section-title">CARTE DES TIRS</h2>
        <canvas ref={canvasRef} className="shot-chart-canvas" />
        <div className="shot-chart-legend">
          <div className="legend-item">
            <span className="legend-color made" />
            <span>Réussi</span>
          </div>
          <div className="legend-item">
            <span className="legend-color missed" />
            <span>Raté</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function drawCourt(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = '#c0c0c0';
  ctx.fillStyle = '#c0c0c0';
  ctx.lineWidth = 2;

  // Périmètre
  ctx.strokeRect(0, 0, width, height);

  // Ligne des 3 points
  ctx.beginPath();
  ctx.arc(width / 2, height - 40, 237.5, 0.3, Math.PI - 0.3);
  ctx.stroke();

  // Ligne de lancer franc
  ctx.strokeRect(width / 2 - 80, height - 230, 160, 190);

  // Cercle du lancer franc
  ctx.beginPath();
  ctx.arc(width / 2, height - 230, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Panier
  ctx.beginPath();
  ctx.arc(width / 2, height - 40, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Zone restreinte
  ctx.beginPath();
  ctx.arc(width / 2, height - 40, 40, 0, Math.PI, true);
  ctx.stroke();
}
