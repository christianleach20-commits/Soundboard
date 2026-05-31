const ctx = () => new (window.AudioContext || window.webkitAudioContext)();

function resume(ac) {
  if (ac.state === 'suspended') ac.resume();
}

export const sounds = [
  {
    id: 'airhorn',
    name: 'Air Horn',
    emoji: '📯',
    color: '#ff4757',
    play() {
      const ac = ctx();
      resume(ac);
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const dist = ac.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) curve[i] = i < 128 ? 1 : -1;
      dist.curve = curve;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(230, ac.currentTime + 0.05);
      gain.gain.setValueAtTime(0, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + 0.05);
      gain.gain.setValueAtTime(0.4, ac.currentTime + 1.5);
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
      osc.connect(dist);
      dist.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 2);
    },
  },
  {
    id: 'sadtrombone',
    name: 'Sad Trombone',
    emoji: '🎺',
    color: '#ffa502',
    play() {
      const ac = ctx();
      resume(ac);
      const notes = [494, 440, 415, 311];
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const start = ac.currentTime + i * 0.4;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.05);
        gain.gain.setValueAtTime(0.25, start + 0.3);
        gain.gain.linearRampToValueAtTime(0, start + 0.5);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    },
  },
  {
    id: 'vineboom',
    name: 'Vine Boom',
    emoji: '💥',
    color: '#2ed573',
    play() {
      const ac = ctx();
      resume(ac);
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ac.currentTime + 0.8);
      gain.gain.setValueAtTime(1, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.9);
    },
  },
  {
    id: 'rimshot',
    name: 'Rimshot',
    emoji: '🥁',
    color: '#1e90ff',
    play() {
      const ac = ctx();
      resume(ac);
      // Snare
      const bufSize = ac.sampleRate * 0.2;
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
      const snare = ac.createBufferSource();
      snare.buffer = buf;
      const snareGain = ac.createGain();
      snareGain.gain.value = 0.5;
      snare.connect(snareGain);
      snareGain.connect(ac.destination);
      snare.start();
      // Cymbal after
      setTimeout(() => {
        const bufC = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
        const dataC = bufC.getChannelData(0);
        for (let i = 0; i < dataC.length; i++) dataC[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / dataC.length, 3);
        const cymbal = ac.createBufferSource();
        cymbal.buffer = bufC;
        const filt = ac.createBiquadFilter();
        filt.type = 'highpass';
        filt.frequency.value = 8000;
        const cGain = ac.createGain();
        cGain.gain.value = 0.3;
        cymbal.connect(filt);
        filt.connect(cGain);
        cGain.connect(ac.destination);
        cymbal.start();
      }, 300);
    },
  },
  {
    id: 'coin',
    name: 'Mario Coin',
    emoji: '🪙',
    color: '#eccc68',
    play() {
      const ac = ctx();
      resume(ac);
      [[1319, 0, 0.1], [1760, 0.1, 0.2]].forEach(([freq, start, stop]) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ac.currentTime + start);
        gain.gain.linearRampToValueAtTime(0, ac.currentTime + stop + 0.05);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(ac.currentTime + start);
        osc.stop(ac.currentTime + stop + 0.1);
      });
    },
  },
  {
    id: 'levelup',
    name: 'Level Up!',
    emoji: '⬆️',
    color: '#a29bfe',
    play() {
      const ac = ctx();
      resume(ac);
      [261, 330, 392, 523, 659, 784].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
        gain.gain.linearRampToValueAtTime(0, t + 0.15);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    },
  },
  {
    id: 'gameover',
    name: 'Game Over',
    emoji: '💀',
    color: '#636e72',
    play() {
      const ac = ctx();
      resume(ac);
      [392, 330, 311, 261].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.25;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    },
  },
  {
    id: 'error',
    name: 'Windows Error',
    emoji: '🪟',
    color: '#0078d4',
    play() {
      const ac = ctx();
      resume(ac);
      [[784, 0], [523, 0.15], [659, 0.3], [415, 0.5]].forEach(([freq, delay]) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ac.currentTime + delay;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.12);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    },
  },
  {
    id: 'ching',
    name: 'Cha-Ching',
    emoji: '💰',
    color: '#f9ca24',
    play() {
      const ac = ctx();
      resume(ac);
      [2000, 2500, 3000].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    },
  },
  {
    id: 'fart',
    name: 'Fart',
    emoji: '💨',
    color: '#78e08f',
    play() {
      const ac = ctx();
      resume(ac);
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const lfo = ac.createOscillator();
      const lfoGain = ac.createGain();
      lfo.frequency.value = 30;
      lfoGain.gain.value = 80;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ac.currentTime + 0.4);
      gain.gain.setValueAtTime(0.4, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ac.destination);
      lfo.start();
      osc.start();
      osc.stop(ac.currentTime + 0.5);
      lfo.stop(ac.currentTime + 0.5);
    },
  },
  {
    id: 'dramatic',
    name: 'DUN DUN DUN',
    emoji: '😱',
    color: '#6c5ce7',
    play() {
      const ac = ctx();
      resume(ac);
      [196, 185, 175].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.5;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
        gain.gain.setValueAtTime(0.35, t + 0.3);
        gain.gain.linearRampToValueAtTime(0, t + 0.5);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    },
  },
  {
    id: 'victory',
    name: 'Victory!',
    emoji: '🏆',
    color: '#fd9644',
    play() {
      const ac = ctx();
      resume(ac);
      const melody = [523, 523, 523, 415, 523, 659, 784];
      const times =   [0,   0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
      melody.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const t = ac.currentTime + times[i];
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    },
  },
  {
    id: 'nope',
    name: 'Nope!',
    emoji: '🚫',
    color: '#ee5a24',
    play() {
      const ac = ctx();
      resume(ac);
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ac.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.4);
    },
  },
  {
    id: 'notification',
    name: 'Ping!',
    emoji: '🔔',
    color: '#00cec9',
    play() {
      const ac = ctx();
      resume(ac);
      [1047, 1319].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    },
  },
  {
    id: 'laugh',
    name: 'Evil Laugh',
    emoji: '😈',
    color: '#b71540',
    play() {
      const ac = ctx();
      resume(ac);
      const freqs = [220, 233, 220, 233, 220, 196, 185, 175];
      freqs.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
        gain.gain.linearRampToValueAtTime(0, t + 0.15);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    },
  },
  {
    id: 'womp',
    name: 'Womp Womp',
    emoji: '🐸',
    color: '#badc58',
    play() {
      const ac = ctx();
      resume(ac);
      [[220, 0], [196, 0.35], [185, 0.7], [165, 1.0]].forEach(([freq, delay]) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
        osc.frequency.linearRampToValueAtTime(freq * 0.85, ac.currentTime + delay + 0.3);
        gain.gain.setValueAtTime(0, ac.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.25, ac.currentTime + delay + 0.05);
        gain.gain.linearRampToValueAtTime(0, ac.currentTime + delay + 0.3);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + 0.35);
      });
    },
  },
];
