'use client';

import { useEffect, useRef } from 'react';

interface PointsChartProps {
  pointsData: number[];
}

export default function PointsChart({ pointsData }: PointsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pointsData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = 500;

    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxPoints = Math.max(...pointsData) + 5;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les axes
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Labels Y
    ctx.fillStyle = '#c0c0c0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxPoints / 5) * i);
      const y = canvas.height - padding - (chartHeight / 5) * i;
      ctx.fillText(value.toString(), padding - 10, y + 4);

      // Lignes de grille
      ctx.strokeStyle = 'rgba(192, 192, 192, 0.2)';
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Dessiner la ligne
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.beginPath();

    pointsData.forEach((point, index) => {
      const x = padding + (chartWidth / (pointsData.length - 1)) * index;
      const y = canvas.height - padding - (point / maxPoints) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Dessiner les points
    ctx.fillStyle = '#00d4ff';
    pointsData.forEach((point, index) => {
      const x = padding + (chartWidth / (pointsData.length - 1)) * index;
      const y = canvas.height - padding - (point / maxPoints) * chartHeight;

      ctx.beginPath();
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 10;
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Labels X (tous les 5 matchs)
    ctx.fillStyle = '#c0c0c0';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    pointsData.forEach((_, index) => {
      if (index % 5 === 0 || index === pointsData.length - 1) {
        const x = padding + (chartWidth / (pointsData.length - 1)) * index;
        ctx.fillText(`M${index + 1}`, x, canvas.height - padding + 20);
      }
    });
  }, [pointsData]);

  return (
    <section id="points-evolution">
      <div className="container">
        <h2 className="section-title">ÉVOLUTION DES POINTS</h2>
        <canvas ref={canvasRef} className="points-chart-canvas" />
      </div>
    </section>
  );
}
