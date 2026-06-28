import { useEffect, useState, useRef } from "react";
import { introPixels } from "./introPixelData";
import "../../styles/introLoader.css";

const STORAGE_KEY = "pp_intro_seen";


const colorForT = (t) => {
  const pink = [255, 45, 120];
  const violet = [162, 61, 255];
  const blue = [45, 139, 255];

  const mix = (a, b, f) => Math.round(a + (b - a) * f);

  let c;
  if (t < 0.5) {
    const f = t / 0.5;
    c = [mix(pink[0], violet[0], f), mix(pink[1], violet[1], f), mix(pink[2], violet[2], f)];
  } else {
    const f = (t - 0.5) / 0.5;
    c = [mix(violet[0], blue[0], f), mix(violet[1], blue[1], f), mix(violet[2], blue[2], f)];
  }
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};


export const hasSeenIntro = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
 
    return true;
  }
};

const markIntroSeen = () => {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    
  }
};


const IntroLoader = ({ onFinish }) => {
  const [phase, setPhase] = useState("assembling"); // assembling -> holding -> exiting
  const timers = useRef([]);

  useEffect(() => {
    markIntroSeen();

    const t1 = setTimeout(() => setPhase("holding"), 1500);
    const t2 = setTimeout(() => setPhase("exiting"), 2300);
    const t3 = setTimeout(() => onFinish?.(), 2900);
    timers.current = [t1, t2, t3];

    return () => timers.current.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div className={`pp-intro-overlay pp-intro-${phase}`} role="presentation" aria-hidden="true">
      <div className="pp-intro-stage">
        <svg viewBox="0 0 100 100" className="pp-intro-svg">
          {introPixels.map((p, i) => (
            <rect
              key={i}
              className="pp-intro-pixel"
              width={p.size}
              height={p.size}
              rx={p.size * 0.16}
              style={{
                "--final-x": `${p.x}px`,
                "--final-y": `${p.y}px`,
                "--start-x": `${p.sx - p.x}px`,
                "--start-y": `${p.sy - p.y}px`,
                "--start-rot": `${p.rot}deg`,
                "--pixel-color": colorForT(p.t),
                "--delay": `${p.delay}s`,
                transform: `translate(${p.x}px, ${p.y}px)`,
              }}
            />
          ))}
        </svg>

        <p className="pp-intro-wordmark">
          Pixel<span className="pp-gradient-text">Play</span>
        </p>
      </div>
    </div>
  );
};

export default IntroLoader;
