export function createAudio() {
  let ctx = null, master = null, playing = false, bellTimer = null;

  // Build a convolution reverb from a generated impulse response
  function makeReverb(ctx, duration = 3.8, decay = 2.2) {
    const sr     = ctx.sampleRate;
    const len    = sr * duration;
    const buf    = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  // One detuned oscillator voice for the choir pad
  function makeVoice(ctx, freq, type, detune, gainVal, dest) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value    = detune;
    const g = ctx.createGain();
    g.gain.value = gainVal;
    osc.connect(g);
    g.connect(dest);
    osc.start();
    return osc;
  }

  // Short bell/celeste note — Mario Galaxy uses high bright plucks
  function playBell(freq, when, gain = 0.18) {
    const osc  = ctx.createOscillator();
    const env  = ctx.createGain();
    const rev  = ctx.createGain();
    osc.type            = 'sine';
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(gain, when + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 3.2);
    osc.connect(env);
    env.connect(rev);
    rev.gain.value = 0.55;
    rev.connect(reverbNode);
    reverbNode.connect(master);
    osc.start(when);
    osc.stop(when + 3.5);

    // Harmonic partial (octave + fifth = bell-like)
    const osc2 = ctx.createOscillator();
    const env2 = ctx.createGain();
    osc2.type             = 'sine';
    osc2.frequency.value  = freq * 2.756; // inharmonic partial, characteristic of bells
    env2.gain.setValueAtTime(0, when);
    env2.gain.linearRampToValueAtTime(gain * 0.35, when + 0.008);
    env2.gain.exponentialRampToValueAtTime(0.0001, when + 1.4);
    osc2.connect(env2);
    env2.connect(rev);
    osc2.start(when);
    osc2.stop(when + 2.0);
  }

  // The Mario Galaxy space theme uses a floating Bb major / G minor feel.
  // These are the bell pitches that evoke that spacious, wonder-like quality.
  const BELL_SCALE = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, // C4 major
    523.25, 587.33, 659.25, 698.46, 783.99,                  // C5 major
    1046.50, 1174.66, 1318.51,                               // C6 high
  ];
  // Weighted toward the upper register for that signature shimmer
  const BELL_WEIGHTS = [1,1,2,1,2,3,2, 2,2,3,2,3, 4,3,4];

  let reverbNode = null;

  function scheduleBells() {
    if (!playing) return;
    const now  = ctx.currentTime;
    // Pick 1–3 notes in a soft chord
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      // Weighted random pick
      const total = BELL_WEIGHTS.reduce((a, b) => a + b, 0);
      let rnd = Math.random() * total, idx = 0;
      for (let j = 0; j < BELL_WEIGHTS.length; j++) {
        rnd -= BELL_WEIGHTS[j];
        if (rnd <= 0) { idx = j; break; }
      }
      const freq   = BELL_SCALE[idx];
      const offset = i * (0.08 + Math.random() * 0.18);
      const gain   = 0.10 + Math.random() * 0.14;
      playBell(freq, now + offset, gain);
    }
    // Next bell cluster: 4–11 seconds, mimicking the sparse Galaxy feel
    const next = 4 + Math.random() * 7;
    bellTimer = setTimeout(scheduleBells, next * 1000);
  }

  function init() {
    if (ctx) return;
    ctx    = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    reverbNode = makeReverb(ctx, 5.5, 2.8);
    reverbNode.connect(master);

    // ── Choir pad — the heart of Mario Galaxy's ambience ──
    // Built from detuned triangle + sawtooth layers through a warm LPF
    const padLPF = ctx.createBiquadFilter();
    padLPF.type            = 'lowpass';
    padLPF.frequency.value = 1100;
    padLPF.Q.value         = 0.6;
    padLPF.connect(reverbNode);
    padLPF.connect(master); // dry signal too, just quieter

    // Warm pad base — C2 root cluster
    const padGain = ctx.createGain(); padGain.gain.value = 0.042; padGain.connect(padLPF);
    [65.41, 130.81, 196.00, 261.63, 329.63].forEach((f, i) => {
      makeVoice(ctx, f, 'triangle', [-8,-4,0,5,10][i], [0.7,0.5,0.4,0.3,0.2][i], padGain);
    });
    // Sawtooth shimmer — upper choir voices
    const shimGain = ctx.createGain(); shimGain.gain.value = 0.018; shimGain.connect(padLPF);
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      makeVoice(ctx, f, 'sawtooth', [-12, 0, 7, 14][i], [0.4, 0.3, 0.2, 0.1][i], shimGain);
    });

    // ── Breath noise — the "space wind" layer ──
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf; noiseSrc.loop = true;
    const nbpf = ctx.createBiquadFilter(); nbpf.type = 'bandpass';
    nbpf.frequency.value = 380; nbpf.Q.value = 0.4;
    const nGain = ctx.createGain(); nGain.gain.value = 0.008;
    noiseSrc.connect(nbpf); nbpf.connect(nGain); nGain.connect(reverbNode);
    noiseSrc.start();

    // ── Deep sub bass pulse — low gravity rumble ──
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 32.7; // C1
    const subG = ctx.createGain(); subG.gain.value = 0.055;
    sub.connect(subG); subG.connect(master); sub.start();

    // ── Slow LFO swell on the pad — breathing quality ──
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.055;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.010;
    lfo.connect(lfoG); lfoG.connect(padGain.gain); lfo.start();

    // ── Gentle high shimmer — stars twinkling ──
    const hOsc = ctx.createOscillator(); hOsc.frequency.value = 2093; hOsc.type = 'sine';
    const hLFO = ctx.createOscillator(); hLFO.frequency.value  = 0.13;
    const hLFOg = ctx.createGain(); hLFOg.gain.value = 0.003;
    const hG = ctx.createGain(); hG.gain.value = 0.003;
    hOsc.connect(hG); hG.connect(master);
    hLFO.connect(hLFOg); hLFOg.connect(hG.gain);
    hOsc.start(); hLFO.start();
  }

  function toggle() {
    init();
    playing = !playing;
    master.gain.setTargetAtTime(playing ? 0.62 : 0, ctx.currentTime, playing ? 3.0 : 2.0);
    if (playing) {
      scheduleBells();
    } else {
      if (bellTimer) { clearTimeout(bellTimer); bellTimer = null; }
    }
    return playing;
  }

  return { toggle, isPlaying: () => playing };
}
