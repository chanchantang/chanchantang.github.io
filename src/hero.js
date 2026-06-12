export function createHero() {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  }

  // Smooth sine-wave mountain layer
  function drawWave(baseY, amplitude, freq, phase, steps, fillTop, fillBot) {
    const w = canvas.width, h = canvas.height;
    const topY = (baseY - Math.abs(amplitude)) * h;
    const grad = ctx.createLinearGradient(0, topY, 0, h);
    grad.addColorStop(0, fillTop);
    grad.addColorStop(1, fillBot);

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i <= steps; i++) {
      const xf = i / steps;
      const yf = baseY + amplitude * Math.sin(xf * Math.PI * 2 * freq + phase);
      ctx.lineTo(xf * w, yf * h);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function render() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // ── Sky ──
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0,    'rgba(0,0,0,0)');
    sky.addColorStop(0.15, 'rgba(2,5,16,0.35)');
    sky.addColorStop(0.35, 'rgba(8,14,36,0.78)');
    sky.addColorStop(0.52, 'rgba(14,20,52,0.93)');
    sky.addColorStop(0.64, 'rgba(20,13,44,0.97)');
    sky.addColorStop(0.76, 'rgba(32,13,28,1)');
    sky.addColorStop(0.86, 'rgba(40,12,9,1)');
    sky.addColorStop(0.93, 'rgba(18,5,5,1)');
    sky.addColorStop(1.0,  'rgba(3,2,5,1)');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Warm horizon bloom
    const bloom = ctx.createRadialGradient(w*0.45, h*0.80, 0, w*0.45, h*0.80, w*0.52);
    bloom.addColorStop(0, 'rgba(115,52,16,0.22)');
    bloom.addColorStop(0.45, 'rgba(65,26,7,0.08)');
    bloom.addColorStop(1, 'transparent');
    ctx.fillStyle = bloom; ctx.fillRect(0, 0, w, h);

    // ── Moon ──
    const mx = w * 0.70, my = h * 0.26;
    const mr = Math.max(18, Math.min(w, h) * 0.036);
    const corona = ctx.createRadialGradient(mx, my, mr*0.4, mx, my, mr*9);
    corona.addColorStop(0, 'rgba(208,224,255,0.15)');
    corona.addColorStop(0.3, 'rgba(182,210,255,0.05)');
    corona.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(mx, my, mr*9, 0, Math.PI*2);
    ctx.fillStyle = corona; ctx.fill();

    const disc = ctx.createRadialGradient(mx-mr*0.22, my-mr*0.28, 0, mx, my, mr);
    disc.addColorStop(0,    'rgba(252,255,255,1)');
    disc.addColorStop(0.50, 'rgba(228,240,255,0.97)');
    disc.addColorStop(0.82, 'rgba(198,220,255,0.82)');
    disc.addColorStop(1,    'rgba(158,192,255,0)');
    ctx.save();
    ctx.shadowColor = 'rgba(200,220,255,0.50)'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.fillStyle = disc; ctx.fill();
    ctx.restore();

    // ── Sine-wave mountain layers ──
    // On mobile the canvas is narrow, so scale down frequency to avoid cramped peaks
    const freqScale = w < 600 ? 0.58 : 1.0;

    // Layer A — distant wide gentle hills
    drawWave(0.640, -0.095, 1.8 * freqScale, 0.0, 300,
      'rgba(28,44,92,0.48)', 'rgba(14,24,68,0.74)');

    // Layer B — mid-far, tighter waves
    drawWave(0.700, -0.078, 2.5 * freqScale, 1.1, 300,
      'rgba(16,26,68,0.72)', 'rgba(7,13,44,0.91)');

    // Layer C — mid-near, narrower
    drawWave(0.762, -0.062, 3.2 * freqScale, 2.4, 300,
      'rgba(9,16,48,0.88)', 'rgba(3,9,28,0.97)');

    // Layer D — foreground dark, fast ripple
    drawWave(0.840, -0.048, 4.1 * freqScale, 0.7, 300,
      'rgba(3,7,20,0.97)', 'rgba(1,2,8,1)');

    // Ground mist
    const mist = ctx.createLinearGradient(0, h * 0.91, 0, h);
    mist.addColorStop(0, 'transparent');
    mist.addColorStop(1, 'rgba(5,8,24,0.70)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, h * 0.91, w, h * 0.09);
  }

  function update(scrollY) {
    const t = Math.min(1, scrollY / window.innerHeight);
    // Rise into the sky: stay fully visible much longer, then fade gently at the end.
    // Scale up slightly (zooming in toward horizon) and translate down so mountains
    // appear to stay grounded while we ascend past them.
    const opacity   = Math.max(0, 1 - Math.pow(Math.max(0, t - 0.55) / 0.45, 1.6));
    const scale     = 1 + t * 0.10;                  // zoom in as we lift off
    const translateY = t * 28;                        // mountains slip downward (px %)
    canvas.style.opacity   = opacity.toString();
    canvas.style.transform = `scale(${scale}) translateY(${translateY}%)`;
  }

  window.addEventListener('resize', resize);
  resize();

  return { update };
}
