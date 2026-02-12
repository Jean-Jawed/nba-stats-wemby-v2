import Image from 'next/image';

interface DefenseProps {
  avgSteals: string;
  totalDefReb: number;
}

export default function Defense({ avgSteals, totalDefReb }: DefenseProps) {
  return (
    <section id="defense">
      <div className="container">
        <h2 className="section-title">DÉFENSE D&apos;ÉLITE</h2>
        <div className="defense-grid">
          <div className="defense-card">
            <Image 
              src="/assets/images/guard1.jpeg" 
              alt="Defense 1"
              width={600}
              height={400}
            />
            <div className="defense-stat">
              <h3>{avgSteals}</h3>
              <p>Interceptions/Match</p>
            </div>
          </div>
          <div className="defense-card">
            <Image 
              src="/assets/images/guard2.jpeg" 
              alt="Defense 2"
              width={600}
              height={400}
            />
            <div className="defense-stat">
              <h3>{totalDefReb}</h3>
              <p>Rebonds Défensifs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
