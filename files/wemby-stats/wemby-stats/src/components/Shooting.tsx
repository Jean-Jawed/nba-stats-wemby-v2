'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface ShootingProps {
  fgPct: string;
  fg3Pct: string;
  ftPct: string;
}

export default function Shooting({ fgPct, fg3Pct, ftPct }: ShootingProps) {
  const toggleMute = () => {
    const video = document.querySelector('#shooting video') as HTMLVideoElement;
    const btn = document.querySelector('#shooting .volume-btn') as HTMLButtonElement;
    if (video && btn) {
      video.muted = !video.muted;
      btn.textContent = video.muted ? '🔇' : '🔊';
    }
  };

  return (
    <section id="shooting">
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/assets/videos/7ShootsA.mp4" type="video/mp4" />
        </video>
        <div className="video-controls">
          <button className="volume-btn" onClick={toggleMute}>🔇</button>
        </div>
      </div>
      
      <div className="container">
        <div className="shooting-content">
          <h2 className="section-title">CAPACITÉS DE SHOOT</h2>
          <div className="shooting-images">
            <Image 
              src="/assets/images/Three1.jpg" 
              alt="Three pointer 1" 
              className="shoot-img"
              width={600}
              height={400}
            />
            <Image 
              src="/assets/images/Three2.jpg" 
              alt="Three pointer 2" 
              className="shoot-img"
              width={600}
              height={400}
            />
          </div>
          <div className="shooting-stats">
            <StatCircle 
              value={fgPct} 
              label="FG%" 
              color="#00ff00" 
              id="fg-circle"
            />
            <StatCircle 
              value={fg3Pct} 
              label="3P%" 
              color="#ffd700" 
              id="three-circle"
            />
            <StatCircle 
              value={ftPct} 
              label="FT%" 
              color="#00bfff" 
              id="ft-circle"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatCircleProps {
  value: string;
  label: string;
  color: string;
  id: string;
}

function StatCircle({ value, label, color, id }: StatCircleProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const percentage = parseFloat(value) || 0;
    
    // Initial state
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    // Animate after a short delay
    setTimeout(() => {
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDashoffset = `${offset}`;
    }, 100);
  }, [value, circumference]);

  return (
    <div className="stat-circle">
      <svg className="progress-ring" width="120" height="120">
        <circle 
          className="progress-ring-circle" 
          stroke="#c0c0c0" 
          strokeWidth="8" 
          fill="transparent" 
          r={radius} 
          cx="60" 
          cy="60"
        />
        <circle 
          ref={circleRef}
          id={id}
          className="progress-ring-circle progress" 
          stroke={color} 
          strokeWidth="8" 
          fill="transparent" 
          r={radius} 
          cx="60" 
          cy="60"
        />
      </svg>
      <div className="stat-center">
        <span>{value}%</span>
        <span className="stat-label-small">{label}</span>
      </div>
    </div>
  );
}
