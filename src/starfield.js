import * as THREE from 'three';

function makeStarTexture() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.15, 'rgba(220,235,255,0.90)');
  g.addColorStop(0.5,  'rgba(170,210,255,0.30)');
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makeNebulaTexture(r, g, b, sharp) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  // Multi-layer for cloud-like look
  const stops = sharp
    ? [[0, 0.30], [0.3, 0.18], [0.6, 0.08], [1, 0]]
    : [[0, 0.22], [0.25, 0.14], [0.55, 0.07], [0.85, 0.02], [1, 0]];
  const gr = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  stops.forEach(([t, a]) => gr.addColorStop(t, `rgba(${r},${g},${b},${a})`));
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(c);
}

export function createStarfield(scene) {
  const tex = makeStarTexture();

  // Layer 1 — distant small stars (dense, blue-tinted like photo)
  const geo1 = new THREE.BufferGeometry();
  const n1 = 8000;
  const p1 = new Float32Array(n1 * 3);
  const c1 = new Float32Array(n1 * 3);
  const clusters = [
    { x:  280, y:  160, z: -620, r: 240, n: 700 },
    { x: -380, y: -180, z: -700, r: 280, n: 800 },
    { x:   60, y:  320, z: -520, r: 200, n: 550 },
    { x:  420, y: -220, z: -580, r: 160, n: 400 },
  ];
  let idx = 0;
  clusters.forEach(cl => {
    for (let i = 0; i < cl.n && idx < n1; i++, idx++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = cl.r * Math.cbrt(Math.random());
      p1[idx*3]   = cl.x + r * Math.sin(phi) * Math.cos(theta);
      p1[idx*3+1] = cl.y + r * Math.sin(phi) * Math.sin(theta);
      p1[idx*3+2] = cl.z + r * Math.cos(phi);
      const rnd = Math.random();
      if (rnd < 0.6) { c1[idx*3]=0.72; c1[idx*3+1]=0.85; c1[idx*3+2]=1.0; }      // blue-white
      else if (rnd < 0.8) { c1[idx*3]=1.0; c1[idx*3+1]=1.0; c1[idx*3+2]=1.0; }  // white
      else { c1[idx*3]=0.9; c1[idx*3+1]=0.8; c1[idx*3+2]=0.6; }                  // warm
    }
  });
  for (; idx < n1; idx++) {
    p1[idx*3]   = (Math.random() - 0.5) * 2800;
    p1[idx*3+1] = (Math.random() - 0.5) * 2800;
    p1[idx*3+2] = (Math.random() - 0.5) * 2400;
    const rnd = Math.random();
    if (rnd < 0.55) { c1[idx*3]=0.68; c1[idx*3+1]=0.82; c1[idx*3+2]=1.0; }
    else if (rnd < 0.80) { c1[idx*3]=1.0; c1[idx*3+1]=1.0; c1[idx*3+2]=1.0; }
    else { c1[idx*3]=0.95; c1[idx*3+1]=0.78; c1[idx*3+2]=0.55; }
  }
  geo1.setAttribute('position', new THREE.BufferAttribute(p1, 3));
  geo1.setAttribute('color',    new THREE.BufferAttribute(c1, 3));
  const mat1 = new THREE.PointsMaterial({
    map: tex, vertexColors: true, size: 1.4, transparent: true, opacity: 0.62,
    depthWrite: false, sizeAttenuation: true,
  });
  const stars1 = new THREE.Points(geo1, mat1);
  scene.add(stars1);

  // Layer 2 — mid stars, slightly blue-purple tint
  const geo2 = new THREE.BufferGeometry();
  const n2 = 1400;
  const p2 = new Float32Array(n2 * 3);
  for (let i = 0; i < n2; i++) {
    p2[i*3]   = (Math.random() - 0.5) * 1800;
    p2[i*3+1] = (Math.random() - 0.5) * 1800;
    p2[i*3+2] = (Math.random() - 0.5) * 900;
  }
  geo2.setAttribute('position', new THREE.BufferAttribute(p2, 3));
  const mat2 = new THREE.PointsMaterial({
    map: tex, size: 2.2, transparent: true, opacity: 0.80,
    depthWrite: false, sizeAttenuation: true, color: 0xbbd0ff,
  });
  const stars2 = new THREE.Points(geo2, mat2);
  scene.add(stars2);

  // Layer 3 — foreground bright stars
  const geo3 = new THREE.BufferGeometry();
  const n3 = 220;
  const p3 = new Float32Array(n3 * 3);
  for (let i = 0; i < n3; i++) {
    p3[i*3]   = (Math.random() - 0.5) * 800;
    p3[i*3+1] = (Math.random() - 0.5) * 800;
    p3[i*3+2] = (Math.random() - 0.5) * 350;
  }
  geo3.setAttribute('position', new THREE.BufferAttribute(p3, 3));
  const mat3 = new THREE.PointsMaterial({
    map: tex, size: 5.0, transparent: true, opacity: 0.92,
    depthWrite: false, sizeAttenuation: true, color: 0xeef6ff,
  });
  const stars3 = new THREE.Points(geo3, mat3);
  scene.add(stars3);

  // ── Milky Way — vivid multi-band matching reference photo ──
  // Main band: rich blue-purple with warm core and teal edges
  const geoMW = new THREE.BufferGeometry();
  const nMW   = 9000;
  const pMW   = new Float32Array(nMW * 3);
  const cMW   = new Float32Array(nMW * 3);
  for (let i = 0; i < nMW; i++) {
    const t      = (Math.random() - 0.5) * 2800;
    const spread = 12 + Math.random() * 130;
    const ang    = Math.random() * Math.PI * 2;
    const core   = Math.random() < 0.28;
    const cs     = core ? spread * 0.22 : spread;
    pMW[i*3]   = t * 0.82 + Math.cos(ang) * cs;
    pMW[i*3+1] = t * 0.18 + Math.sin(ang) * cs * 0.40;
    pMW[i*3+2] = -340 - Math.random() * 200;

    const rnd = Math.random();
    if (core) {
      // Warm golden-orange core (bottom of reference image)
      cMW[i*3]   = 1.0;
      cMW[i*3+1] = 0.65 + Math.random() * 0.25;
      cMW[i*3+2] = 0.20 + Math.random() * 0.30;
    } else if (rnd < 0.20) {
      // Vivid blue-white — dominant in photo
      cMW[i*3]   = 0.55 + Math.random() * 0.35;
      cMW[i*3+1] = 0.80 + Math.random() * 0.18;
      cMW[i*3+2] = 1.0;
    } else if (rnd < 0.38) {
      // Deep violet/purple (major color in photo)
      cMW[i*3]   = 0.72 + Math.random() * 0.22;
      cMW[i*3+1] = 0.25 + Math.random() * 0.30;
      cMW[i*3+2] = 1.0;
    } else if (rnd < 0.50) {
      // Teal-green (bottom of photo)
      cMW[i*3]   = 0.08 + Math.random() * 0.12;
      cMW[i*3+1] = 0.72 + Math.random() * 0.22;
      cMW[i*3+2] = 0.72 + Math.random() * 0.18;
    } else if (rnd < 0.58) {
      // Pink/magenta dust
      cMW[i*3]   = 0.85 + Math.random() * 0.15;
      cMW[i*3+1] = 0.28 + Math.random() * 0.28;
      cMW[i*3+2] = 0.70 + Math.random() * 0.25;
    } else {
      // Blue-purple blend (background fill)
      const w = Math.random();
      cMW[i*3]   = 0.38 + w * 0.42;
      cMW[i*3+1] = 0.52 + w * 0.28;
      cMW[i*3+2] = 0.92 + Math.random() * 0.08;
    }
  }
  geoMW.setAttribute('position', new THREE.BufferAttribute(pMW, 3));
  geoMW.setAttribute('color',    new THREE.BufferAttribute(cMW, 3));
  const matMW = new THREE.PointsMaterial({
    map: tex, vertexColors: true,
    size: 2.0, transparent: true, opacity: 0.78, depthWrite: false,
  });
  const milkyWay = new THREE.Points(geoMW, matMW);
  milkyWay.rotation.z = Math.PI / 7;
  scene.add(milkyWay);

  // ── Second arc — cool blue sweep across top (matching photo's blue band) ──
  const geoMW2 = new THREE.BufferGeometry();
  const nMW2   = 4000;
  const pMW2   = new Float32Array(nMW2 * 3);
  const cMW2   = new Float32Array(nMW2 * 3);
  for (let i = 0; i < nMW2; i++) {
    const t   = (Math.random() - 0.5) * 2200;
    const sp2 = 8 + Math.random() * 75;
    const a2  = Math.random() * Math.PI * 2;
    pMW2[i*3]   = t * 0.60 + Math.cos(a2) * sp2;
    pMW2[i*3+1] = t * 0.42 + Math.sin(a2) * sp2 * 0.44;
    pMW2[i*3+2] = -420 - Math.random() * 150;
    const rnd2 = Math.random();
    if (rnd2 < 0.50) {
      // Electric blue
      cMW2[i*3]   = 0.30 + Math.random() * 0.28;
      cMW2[i*3+1] = 0.65 + Math.random() * 0.28;
      cMW2[i*3+2] = 1.0;
    } else if (rnd2 < 0.78) {
      // Blue-violet
      cMW2[i*3]   = 0.55 + Math.random() * 0.35;
      cMW2[i*3+1] = 0.35 + Math.random() * 0.30;
      cMW2[i*3+2] = 1.0;
    } else {
      // Teal
      cMW2[i*3]   = 0.10;
      cMW2[i*3+1] = 0.68 + Math.random() * 0.22;
      cMW2[i*3+2] = 0.78 + Math.random() * 0.18;
    }
  }
  geoMW2.setAttribute('position', new THREE.BufferAttribute(pMW2, 3));
  geoMW2.setAttribute('color',    new THREE.BufferAttribute(cMW2, 3));
  const matMW2 = new THREE.PointsMaterial({
    map: tex, vertexColors: true,
    size: 1.5, transparent: true, opacity: 0.55, depthWrite: false,
  });
  const milkyWay2 = new THREE.Points(geoMW2, matMW2);
  milkyWay2.rotation.z = -Math.PI / 5;
  milkyWay2.rotation.x =  Math.PI / 11;
  scene.add(milkyWay2);

  // ── Nebula cloud sprites — positioned to match reference image ──
  const nebulaDefs = [
    // Big purple-violet (left, dominant in photo)
    { r: 90,  g: 20,  b: 210, x: -260, y:  130, z: -360, s: 800, sh: false },
    { r: 110, g: 15,  b: 190, x: -160, y:   50, z: -390, s: 600, sh: false },
    { r: 80,  g: 10,  b: 200, x: -340, y:   -30, z: -370, s: 550, sh: false },
    // Vivid blue sweep (center-right of photo)
    { r: 18,  g: 80,  b: 230, x:  100, y:  170, z: -350, s: 700, sh: false },
    { r: 25,  g: 100, b: 210, x:  240, y:   90, z: -370, s: 550, sh: false },
    { r: 10,  g: 60,  b: 200, x:   20, y:  240, z: -340, s: 480, sh: false },
    // Warm amber-gold core (bottom of photo)
    { r: 230, g: 140, b:  25, x:   20, y: -210, z: -330, s: 500, sh: true  },
    { r: 210, g: 110, b:  18, x: -100, y: -250, z: -360, s: 420, sh: false },
    { r: 240, g: 160, b:  40, x:  140, y: -180, z: -350, s: 380, sh: true  },
    // Pink-magenta dust (middle of photo)
    { r: 190, g:  38, b: 130, x:  110, y:  -60, z: -390, s: 450, sh: false },
    { r: 160, g:  20, b: 110, x: -140, y: -120, z: -410, s: 380, sh: false },
    // Teal-green (bottom corners of photo)
    { r:  12, g: 150, b: 140, x: -320, y: -160, z: -380, s: 480, sh: false },
    { r:  18, g: 130, b: 110, x:  380, y: -110, z: -400, s: 360, sh: false },
    // Extra deep blue background wash
    { r:  10, g:  40, b: 180, x: -80,  y:  280, z: -330, s: 600, sh: false },
    { r:  20, g:  55, b: 200, x:  300, y:  200, z: -350, s: 500, sh: false },
  ];
  const nebulaSprites = [];
  const nebulaOrigPos = nebulaDefs.map(d => ({ x: d.x, y: d.y, z: d.z }));
  nebulaDefs.forEach(d => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeNebulaTexture(d.r, d.g, d.b, d.sh),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    sprite.position.set(d.x, d.y, d.z);
    sprite.scale.set(d.s, d.s, 1);
    scene.add(sprite);
    nebulaSprites.push(sprite);
  });

  return { stars1, stars2, stars3, milkyWay, nebulaSprites, nebulaOrigPos };
}


export function spawnShootingStar(scene) {
  const startX = -700 + Math.random() * 300;
  const startY =  200 + Math.random() * 300;
  const endX   = startX + 900 + Math.random() * 500;
  const endY   = startY + (Math.random() - 0.6) * 200;

  const N = 100;
  const positions = new Float32Array((N + 1) * 3);
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    positions[i * 3]     = startX + (endX - startX) * t;
    positions[i * 3 + 1] = startY + (endY - startY) * t;
    positions[i * 3 + 2] = -60;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setDrawRange(0, 0);

  const mat = new THREE.LineBasicMaterial({ color: 0xddeeff, transparent: true, opacity: 0.88 });
  const line = new THREE.Line(geo, mat);
  scene.add(line);

  const totalFrames = 130, trailLen = 28;
  let frame = 0;
  const tick = setInterval(() => {
    frame++;
    const sweep   = (N + trailLen) * (frame / totalFrames);
    const headIdx = Math.min(N + 1, Math.floor(sweep));
    const tailIdx = Math.max(0, headIdx - trailLen);
    geo.setDrawRange(tailIdx, Math.max(0, headIdx - tailIdx));
    const t = frame / totalFrames;
    mat.opacity = t > 0.80 ? 0.88 * (1 - (t - 0.80) / 0.20) : 0.88;
    if (frame >= totalFrames) {
      clearInterval(tick);
      scene.remove(line);
      geo.dispose();
      mat.dispose();
    }
  }, 16);
}
