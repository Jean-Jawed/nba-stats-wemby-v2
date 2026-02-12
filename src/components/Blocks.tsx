'use client';

import Image from 'next/image';

interface BlocksProps {
  totalBlocks: number;
  avgBlocks: string;
  maxBlocks: number;
}

export default function Blocks({ totalBlocks, avgBlocks, maxBlocks }: BlocksProps) {
  const toggleMute = () => {
    const video = document.querySelector('#blocks video') as HTMLVideoElement;
    const btn = document.querySelector('#blocks .volume-btn') as HTMLButtonElement;
    if (video && btn) {
      video.muted = !video.muted;
      btn.textContent = video.muted ? '🔇' : '🔊';
    }
  };

  return (
    <section id="blocks">
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/assets/videos/3BlocksA.mp4" type="video/mp4" />
        </video>
        <div className="video-controls">
          <button className="volume-btn" onClick={toggleMute}>🔇</button>
        </div>
      </div>
      
      <div className="container">
        <div className="blocks-content">
          <h2 className="section-title">LE ROI DES CONTRES</h2>
          <div className="blocks-grid">
            <Image 
              src="/assets/images/block1.png" 
              alt="Block 1" 
              className="block-img"
              width={400}
              height={300}
            />
            <Image 
              src="/assets/images/block2.png" 
              alt="Block 2" 
              className="block-img"
              width={400}
              height={300}
            />
            <Image 
              src="/assets/images/block3.png" 
              alt="Block 3" 
              className="block-img"
              width={400}
              height={300}
            />
          </div>
          <div className="blocks-stats">
            <div className="stat-box">
              <h3>{totalBlocks}</h3>
              <p>Blocks Total Saison</p>
            </div>
            <div className="stat-box">
              <h3>{avgBlocks}</h3>
              <p>Blocks Par Match</p>
            </div>
            <div className="stat-box">
              <h3>{maxBlocks}</h3>
              <p>Record en un Match</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
