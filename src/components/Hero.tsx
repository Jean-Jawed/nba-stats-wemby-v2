'use client';

import Image from 'next/image';

interface HeroProps {
  ppg: string;
  bpg: string;
  rpg: string;
}

export default function Hero({ ppg, bpg, rpg }: HeroProps) {
  const scrollToLastGame = () => {
    const section = document.getElementById('last-game');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero">
      <div className="hero-overlay" />
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/assets/videos/10playsRookie.mp4" type="video/mp4" />
      </video>
      <VideoControls videoSelector=".hero-video" />
      
      <div className="hero-content">
        <a 
          href="https://www.nba.com/spurs/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="spurs-logo-link"
        >
          <Image 
            src="/assets/images/spurs.png" 
            alt="San Antonio Spurs" 
            className="spurs-logo"
            width={120}
            height={120}
          />
        </a>
        <h1 className="hero-title">VICTOR WEMBANYAMA</h1>
        <p className="hero-subtitle">L&apos;ALIEN DE SAN ANTONIO</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">{ppg}</span>
            <span className="stat-label">PPG</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">{bpg}</span>
            <span className="stat-label">BPG</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">{rpg}</span>
            <span className="stat-label">RPG</span>
          </div>
        </div>
      </div>
      
      <button className="scroll-cta" onClick={scrollToLastGame}>
        <span>Découvrir les stats</span>
        <div className="arrow-icon">↓</div>
      </button>
    </section>
  );
}

// Sous-composant pour les contrôles vidéo
function VideoControls({ videoSelector }: { videoSelector: string }) {
  const toggleMute = () => {
    const video = document.querySelector(videoSelector) as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
      const btn = document.querySelector(`[data-video-selector="${videoSelector}"]`);
      if (btn) {
        btn.textContent = video.muted ? '🔇' : '🔊';
      }
    }
  };

  return (
    <div className="video-controls hero-video-controls">
      <button 
        className="volume-btn" 
        data-video-selector={videoSelector}
        onClick={toggleMute}
      >
        🔇
      </button>
    </div>
  );
}
