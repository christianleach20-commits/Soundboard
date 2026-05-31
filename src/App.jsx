import { useState, useCallback } from 'react';
import { sounds } from './sounds';
import './App.css';

function SoundButton({ sound, isPlaying, onClick }) {
  return (
    <button
      className={`sound-btn ${isPlaying ? 'playing' : ''}`}
      style={{ '--accent': sound.color }}
      onClick={() => onClick(sound)}
      aria-label={sound.name}
    >
      <span className="emoji">{sound.emoji}</span>
      <span className="label">{sound.name}</span>
      {isPlaying && <span className="ripple" />}
    </button>
  );
}

export default function App() {
  const [playing, setPlaying] = useState(null);

  const handlePlay = useCallback((sound) => {
    sound.play();
    setPlaying(sound.id);
    setTimeout(() => setPlaying(null), 800);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          <span className="title-icon">🎵</span>
          Meme Soundboard
          <span className="title-icon">🎵</span>
        </h1>
        <p className="subtitle">Click a button. Annoy everyone nearby.</p>
      </header>

      <main className="grid">
        {sounds.map((sound) => (
          <SoundButton
            key={sound.id}
            sound={sound}
            isPlaying={playing === sound.id}
            onClick={handlePlay}
          />
        ))}
      </main>

      <footer className="footer">
        <p>Made with Web Audio API · No sounds were harmed in the making of this board</p>
      </footer>
    </div>
  );
}
