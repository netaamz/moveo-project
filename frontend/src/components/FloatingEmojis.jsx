import { useEffect, useState } from 'react';

const emojis = ['🎵', '🎼', '🎸', '🎹', '🎺', '🥁', '🎻', '🎤'];

export default function FloatingEmojis() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 12 }, () => createParticle());
    setParticles(initialParticles);

    // Animation loop
    const interval = setInterval(() => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Update position
          const newY = particle.y - particle.speed;
          
          // Reset if particle reaches top
          if (newY < -50) {
            return createParticle(true);
          }
          
          return {
            ...particle,
            y: newY,
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Create a new particle
  const createParticle = (atBottom = false) => {
    return {
      id: Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100, 
      y: atBottom ? 110 : Math.random() * 100, 
      speed: 0.1 + Math.random() * 0.2, 
      size: 20 + Math.random() * 20, 
      opacity: 0.3 + Math.random() * 0.3,
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute transition-transform duration-1000 ease-linear select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.y * 2}deg)`,
            color: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
} 