import type { SceneEffectType } from '../../types';
import './SceneEffects.css';

interface SceneEffectsProps {
  effect: SceneEffectType;
}

export function SceneEffects({ effect }: SceneEffectsProps) {
  if (effect === 'none') return null;

  const renderEffect = () => {
    switch (effect) {
      case 'shooting-stars':
        return (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shooting-star" style={{ '--delay': `${i * 1.5}s`, '--top': `${10 + i * 15}%` } as React.CSSProperties} />
            ))}
          </>
        );

      case 'twinkle':
        return (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="twinkle-dot" 
                style={{ 
                  '--delay': `${Math.random() * 3}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--top': `${Math.random() * 100}%`,
                  '--size': `${2 + Math.random() * 4}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'bubbles':
        return (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="bubble" 
                style={{ 
                  '--delay': `${i * 0.6}s`,
                  '--left': `${3 + i * 6.5}%`,
                  '--size': `${12 + Math.random() * 25}px`,
                  '--duration': `${5 + Math.random() * 5}s`,
                  '--wobble': `${-15 + Math.random() * 30}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'dust':
        return (
          <>
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className="dust-particle" 
                style={{ 
                  '--delay': `${Math.random() * 10}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--top': `${Math.random() * 100}%`,
                  '--drift': `${-20 + Math.random() * 40}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'waves':
        return (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="light-wave" style={{ '--delay': `${i * 0.8}s`, '--opacity': `${0.15 - i * 0.02}` } as React.CSSProperties} />
            ))}
          </>
        );

      case 'spinning-stars':
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="spin-star" 
                style={{ 
                  '--delay': `${i * 0.4}s`,
                  '--left': `${Math.random() * 90 + 5}%`,
                  '--top': `${Math.random() * 90 + 5}%`,
                  '--size': `${14 + Math.random() * 12}px`,
                  '--rotation': `${Math.random() * 360}deg`,
                } as React.CSSProperties}
              >
                ✦
              </div>
            ))}
          </>
        );

      case 'snow':
        return (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="snowflake" 
                style={{ 
                  '--delay': `${Math.random() * 10}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--size': `${6 + Math.random() * 12}px`,
                  '--duration': `${6 + Math.random() * 8}s`,
                  '--drift': `${-30 + Math.random() * 60}px`,
                } as React.CSSProperties}
              >
                ❄
              </div>
            ))}
          </>
        );

      case 'orbs':
        return (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="glow-orb" 
                style={{ 
                  '--delay': `${i * 1.5}s`,
                  '--left': `${8 + i * 16}%`,
                  '--top': `${15 + (i % 3) * 30}%`,
                  '--size': `${60 + Math.random() * 80}px`,
                  '--hue': `${i * 30}`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'rings':
        return (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="ring" 
                style={{ 
                  '--delay': `${i * 0.4}s`,
                  '--left': `${5 + (i % 4) * 25}%`,
                  '--top': `${10 + Math.floor(i / 4) * 50}%`,
                  '--size': `${35 + Math.random() * 40}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'lines':
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="moving-line" 
                style={{ 
                  '--delay': `${i * 0.5}s`,
                  '--left': `${3 + i * 8}%`,
                  '--height': `${30 + Math.random() * 50}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      // === NEW EFFECTS ===
      
      case 'particles':
        return (
          <>
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{ 
                  '--delay': `${Math.random() * 8}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--top': `${Math.random() * 100}%`,
                  '--size': `${3 + Math.random() * 5}px`,
                  '--duration': `${3 + Math.random() * 4}s`,
                  '--direction': Math.random() > 0.5 ? 1 : -1,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'fireflies':
        return (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="firefly" 
                style={{ 
                  '--delay': `${Math.random() * 5}s`,
                  '--start-x': `${Math.random() * 100}%`,
                  '--start-y': `${Math.random() * 100}%`,
                  '--end-x': `${Math.random() * 100}%`,
                  '--end-y': `${Math.random() * 100}%`,
                  '--duration': `${8 + Math.random() * 7}s`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'aurora':
        return (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="aurora-wave" 
                style={{ 
                  '--delay': `${i * 2}s`,
                  '--hue-start': `${i * 60 + 120}`,
                  '--hue-end': `${i * 60 + 180}`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'galaxy':
        return (
          <>
            <div className="galaxy-core" />
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className="galaxy-star" 
                style={{ 
                  '--delay': `${Math.random() * 3}s`,
                  '--angle': `${Math.random() * 360}deg`,
                  '--distance': `${20 + Math.random() * 35}%`,
                  '--size': `${1 + Math.random() * 3}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'matrix':
        return (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="matrix-column" 
                style={{ 
                  '--delay': `${Math.random() * 5}s`,
                  '--left': `${i * 5}%`,
                  '--duration': `${3 + Math.random() * 4}s`,
                } as React.CSSProperties}
              >
                {Array.from({ length: 15 }).map((_, j) => (
                  <span key={j} style={{ '--char-delay': `${j * 0.1}s` } as React.CSSProperties}>
                    {String.fromCharCode(0x0600 + Math.floor(Math.random() * 100))}
                  </span>
                ))}
              </div>
            ))}
          </>
        );

      case 'heartbeat':
        return (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="heartbeat-ring" 
                style={{ 
                  '--delay': `${i * 0.3}s`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'confetti':
        return (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="confetti-piece" 
                style={{ 
                  '--delay': `${Math.random() * 5}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--hue': `${Math.random() * 360}`,
                  '--duration': `${4 + Math.random() * 4}s`,
                  '--rotation': `${Math.random() * 720}deg`,
                  '--shape': Math.random() > 0.5 ? '50%' : '0',
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'rain':
        return (
          <>
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="raindrop" 
                style={{ 
                  '--delay': `${Math.random() * 2}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--duration': `${0.5 + Math.random() * 0.5}s`,
                  '--size': `${15 + Math.random() * 20}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'leaves':
        return (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="leaf" 
                style={{ 
                  '--delay': `${Math.random() * 8}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--duration': `${8 + Math.random() * 6}s`,
                  '--rotation': `${Math.random() * 360}deg`,
                  '--sway': `${20 + Math.random() * 40}px`,
                } as React.CSSProperties}
              >
                🍂
              </div>
            ))}
          </>
        );

      case 'geometric':
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="geometric-shape" 
                style={{ 
                  '--delay': `${Math.random() * 5}s`,
                  '--left': `${Math.random() * 90}%`,
                  '--top': `${Math.random() * 90}%`,
                  '--size': `${30 + Math.random() * 50}px`,
                  '--rotation': `${Math.random() * 360}deg`,
                  '--shape-type': i % 3,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'laser':
        return (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="laser-beam" 
                style={{ 
                  '--delay': `${i * 0.3}s`,
                  '--angle': `${-30 + i * 10}deg`,
                  '--hue': `${i * 45}`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'prism':
        return (
          <>
            <div className="prism-center" />
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i} 
                className="prism-ray" 
                style={{ 
                  '--delay': `${i * 0.2}s`,
                  '--angle': `${i * 15 - 45}deg`,
                  '--hue': `${i * 51}`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'energy':
        return (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className="energy-field" 
                style={{ 
                  '--delay': `${i * 0.5}s`,
                  '--size': `${150 + i * 80}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'smoke':
        return (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="smoke-puff" 
                style={{ 
                  '--delay': `${i * 1.5}s`,
                  '--left': `${20 + i * 8}%`,
                  '--size': `${80 + Math.random() * 60}px`,
                  '--duration': `${8 + Math.random() * 4}s`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      case 'sparkle-trail':
        return (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="sparkle" 
                style={{ 
                  '--delay': `${Math.random() * 3}s`,
                  '--path-x': `${Math.sin(i * 0.5) * 40}%`,
                  '--path-y': `${Math.cos(i * 0.5) * 40}%`,
                  '--size': `${4 + Math.random() * 6}px`,
                } as React.CSSProperties} 
              />
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`scene-effects effect-${effect}`}>
      {renderEffect()}
    </div>
  );
}
