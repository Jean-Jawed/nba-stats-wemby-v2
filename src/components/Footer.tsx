import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <Image
          src="/assets/images/nba.png"
          alt="NBA"
          className="nba-logo"
          width={100}
          height={50}
        />
        <p>
          By <a href="https://javed.fr" target="_blank" rel="noopener noreferrer">Jawed</a> 2025
        </p>
      </div>
    </footer>
  );
}
