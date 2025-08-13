import { useEffect, useRef, useState } from 'react';
import './App.css';
import Cake from './components/Cake.js';
import Music from './components/Music.js';
import Relight from './components/Relight.js';
import Title from './components/Title.js';

function App() {
  const [isLit, setIsLit] = useState(true);
  const isLitRef = useRef(isLit);
  const canvasRef = useRef(null);
  const confettiParticles = useRef([]);

  const handleRelight = () => {
    setIsLit(true);
    isLitRef.current = true;
  };

  useEffect(() => {
    isLitRef.current = isLit;
  }, [isLit]);

  //Confetti generator
  const startConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const colors = ['#ff0', '#0f0', '#00f', '#f0f', '#f00', '#0ff', '#ffa500'];
    const numParticles = 150;

    confettiParticles.current = Array.from({ length: numParticles }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * numParticles + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.current.forEach((p) => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 5);
        ctx.stroke();
      });
      update();
    };

    const update = () => {
      let remaining = 0;
      confettiParticles.current.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle - remaining / 3) * 15;

        if (p.y <= canvas.height) remaining++;
      });

      if (remaining > 0) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  useEffect(() => {
    let audioContext;
    let analyser;
    let mic;
    let animationId;

    async function initMic() {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(mic);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        function detectBlow() {
          analyser.getByteFrequencyData(dataArray);
          let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          const BLOW_THRESHOLD = 30;
          if (volume > BLOW_THRESHOLD && isLitRef.current) {
            setIsLit(false);
            isLitRef.current = false;
            startConfetti();
          }

          animationId = requestAnimationFrame(detectBlow);
        }
        detectBlow();
      } catch (err) {
        console.error('Microphone access denied or error:', err);
      }
    }

    initMic();

    return () => {
      if (mic) mic.getTracks().forEach((track) => track.stop());
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
    };
  }, []);
  
  return (
    <div className="app-container">
      <Title />
      <div className="cake-wrapper">
        <Cake isLit={isLit} />
      </div>
      <div className="bottom-bar">
        <div className="left">
          <Music />
        </div>
        <div className="right">
          <Relight onRelight={handleRelight} />
        </div>
      </div>

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
}

export default App;
