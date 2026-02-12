'use client';

import Image from 'next/image';

interface ImpactProps {
  totalPoints: number;
  totalAssists: number;
  totalRebounds: number;
  gamesPlayed: number;
}

export default function Impact({ totalPoints, totalAssists, totalRebounds, gamesPlayed }: ImpactProps) {
  const toggleMute = () => {
    const video = document.querySelector('#impact video') as HTMLVideoElement;
    const btn = document.querySelector('#impact .volume-btn') as HTMLButtonElement;
    if (video && btn) {
      video.muted = !video.muted;
      btn.textContent = video.muted ? '🔇' : '🔊';
    }
  };

  return (
    <section id="impact">
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/assets/videos/3BlocksC.mp4" type="video/mp4" />
        </video>
        <div className="video-controls">
          <button className="volume-btn" onClick={toggleMute}>🔇</button>
        </div>
      </div>
      
      <div className="container">
        <div className="impact-content">
          <Image 
            src="/assets/images/victor1.jpg" 
            alt="Victor Wembanyama" 
            className="victor-main"
            width={300}
            height={300}
          />
          <h2 className="section-title">IMPACT GLOBAL</h2>
          <div className="impact-grid">
            <div className="impact-stat">
              <span className="impact-value">{totalPoints}</span>
              <span className="impact-label">Points Totaux</span>
            </div>
            <div className="impact-stat">
              <span className="impact-value">{totalAssists}</span>
              <span className="impact-label">Passes Décisives</span>
            </div>
            <div className="impact-stat">
              <span className="impact-value">{totalRebounds}</span>
              <span className="impact-label">Rebonds Totaux</span>
            </div>
            <div className="impact-stat">
              <span className="impact-value">{gamesPlayed}</span>
              <span className="impact-label">Matchs Joués</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
