import * as THREE from 'three';

// ── Geometry helpers ─────────────────────────────────────────────────────────

function cyl(rt, rb, h, m, s) { s = s || 12;
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m); }
function sph(r, m, s) { s = s || 14;
  return new THREE.Mesh(new THREE.SphereGeometry(r, s, s), m); }
function bx(w, h, d, m) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); }
function con(r, h, m, s) { s = s || 8;
  return new THREE.Mesh(new THREE.ConeGeometry(r, h, s), m); }
function tor(R, r, m, ts, rs) { ts = ts || 20; rs = rs || 8;
  return new THREE.Mesh(new THREE.TorusGeometry(R, r, rs, ts), m); }
function pos(mesh, x, y, z) {
  mesh.position.set(x, y, z); return mesh; }
function rot(mesh, rx, ry, rz) {
  mesh.rotation.set(rx, ry || 0, rz || 0); return mesh; }
function place(mesh, x, y, z, rx, ry, rz) {
  mesh.position.set(x, y, z);
  if (rx !== undefined) mesh.rotation.set(rx, ry || 0, rz || 0);
  return mesh; }

// ── Orion: armoured warrior with shield + spiked club ───────────────────────

function buildOrion(m) {
  const g = new THREE.Group();
  const add = (...items) => items.forEach(i => g.add(i));

  // Head + helmet
  add(place(sph(0.22, m, 16), 0, 2.70, 0));
  add(place(tor(0.25, 0.055, m, 24, 8), 0, 2.57, 0, Math.PI/2, 0, 0));
  add(place(cyl(0.08, 0.20, 0.38, m, 6), 0, 2.98, 0, 0, 0, 0.3));
  add(place(cyl(0.03, 0.06, 0.32, m, 6), 0.05, 3.20, 0));

  // Neck
  add(place(cyl(0.09, 0.12, 0.18, m, 8), 0, 2.36, 0));

  // Torso + breastplate + belt
  add(place(cyl(0.30, 0.38, 1.0, m, 12), 0, 1.65, 0));
  add(place(bx(0.22, 0.28, 0.12, m), -0.12, 1.80, 0.22));
  add(place(bx(0.22, 0.28, 0.12, m),  0.12, 1.80, 0.22));
  add(place(cyl(0.39, 0.38, 0.10, m, 12), 0, 1.06, 0));
  add(place(bx(0.16, 0.10, 0.10, m), 0, 1.06, 0.38));
  [-0.13, 0, 0.13].forEach(x => add(place(sph(0.045, m, 8), x, 1.06, 0.40)));

  // Left shoulder + shield arm
  add(place(sph(0.17, m, 10), -0.45, 2.10, 0));
  add(rot(place(cyl(0.10, 0.09, 0.55, m, 8), -0.70, 1.78, 0.08), 0.18, 0, Math.PI/3.8));
  add(place(sph(0.10, m, 8), -1.04, 1.52, 0.20));
  add(rot(place(cyl(0.08, 0.07, 0.50, m, 8), -1.26, 1.24, 0.28), 0.12, 0, Math.PI/2.6));

  // Shield
  const sd = place(new THREE.Mesh(new THREE.CircleGeometry(0.46, 26), m), -1.60, 1.08, 0.38);
  sd.rotation.set(0.10, 0.45, 0); add(sd);
  const sr = place(tor(0.46, 0.06, m, 26, 8), -1.60, 1.08, 0.38);
  sr.rotation.set(0.10, 0.45, 0); add(sr);
  add(place(sph(0.10, m, 8), -1.60, 1.08, 0.44));
  const sb1 = place(bx(0.07, 0.76, 0.06, m), -1.60, 1.08, 0.38); sb1.rotation.set(0.10, 0.45, 0); add(sb1);
  const sb2 = place(bx(0.76, 0.07, 0.06, m), -1.60, 1.08, 0.38); sb2.rotation.set(0.10, 0.45, 0); add(sb2);

  // Right shoulder + club arm (raised)
  add(place(sph(0.17, m, 10), 0.45, 2.10, 0));
  add(rot(place(cyl(0.10, 0.09, 0.56, m, 8), 0.52, 2.30, -0.06), -0.28, 0, -Math.PI/5.5));
  add(place(sph(0.10, m, 8), 0.84, 2.52, -0.22));
  add(rot(place(cyl(0.08, 0.07, 0.50, m, 8), 1.08, 2.74, -0.36), -0.22, 0, -Math.PI/4));
  add(rot(place(cyl(0.05, 0.06, 0.60, m, 8), 1.30, 3.04, -0.48), -0.18, 0, -Math.PI/3.5));
  add(place(sph(0.15, m, 10), 1.52, 3.32, -0.60));
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    const sp = place(con(0.03, 0.12, m, 6), 1.52+Math.cos(a)*0.16, 3.32+Math.sin(a)*0.16, -0.60);
    sp.lookAt(1.52+Math.cos(a)*0.5, 3.32+Math.sin(a)*0.5, -0.60); add(sp);
  }

  // Hips + kilt
  add(place(cyl(0.34, 0.30, 0.30, m, 12), 0, 0.72, 0));
  const kilt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 0.48, 12, 1, true), m);
  kilt.position.set(0, 0.36, 0); add(kilt);

  // Legs
  [{sx:-0.19, fwd:0.16, s:1}, {sx:0.19, fwd:-0.12, s:-1}].forEach(({sx,fwd,s}) => {
    add(place(sph(0.15, m, 8), sx, 0.55, 0));
    add(rot(place(cyl(0.13, 0.11, 0.66, m, 8), sx+s*0.03, -0.02, fwd*0.6), fwd*0.28, 0, s*0.09));
    add(place(sph(0.12, m, 8), sx+s*0.04, -0.42, fwd));
    add(rot(place(cyl(0.10, 0.08, 0.60, m, 8), sx+s*0.03, -0.80, fwd*0.6), -fwd*0.15, 0, s*0.05));
    add(place(bx(0.20, 0.15, 0.36, m), sx+s*0.02, -1.13, fwd*0.25));
    add(place(sph(0.11, m, 8), sx+s*0.02, -1.15, fwd*0.38));
  });

  add(place(bx(0.05, 0.56, 0.04, m), -0.08, 0.50, 0.36));
  add(place(bx(0.22, 0.05, 0.04, m), -0.08, 0.78, 0.36));

  g.position.y = -0.60;
  return g;
}

// ── Cassiopeia: seated queen on ornate throne ────────────────────────────────

function buildCassiopeia(m) {
  const g = new THREE.Group();
  const add = (...items) => items.forEach(i => g.add(i));

  // Throne
  add(place(bx(1.20, 2.40, 0.12, m), 0, 0.80, -0.55));
  add(place(bx(1.20, 0.12, 0.80, m), 0, -0.28, -0.12));
  add(place(cyl(0.07, 0.07, 1.10, m), -0.50, -0.88, -0.12));
  add(place(cyl(0.07, 0.07, 1.10, m),  0.50, -0.88, -0.12));
  add(place(bx(1.28, 0.10, 0.12, m), 0, 2.00, -0.55));
  add(place(bx(0.10, 0.30, 0.10, m), 0, 2.20, -0.55));
  add(place(bx(0.10, 0.10, 0.70, m), -0.50, -0.16, -0.12));
  add(place(bx(0.10, 0.10, 0.70, m),  0.50, -0.16, -0.12));

  // Crown
  add(place(cyl(0.26, 0.28, 0.12, m, 8), 0, 2.82, 0));
  [-0.20, -0.10, 0, 0.10, 0.20].forEach((x, i) => {
    const tall = i % 2 === 0;
    add(place(con(0.06, tall ? 0.28 : 0.20, m, 6), x, 3.00 + (tall ? 0.14 : 0.10), 0));
    add(place(sph(0.04, m, 6), x, 3.14 + (tall ? 0.28 : 0.20), 0));
  });

  // Head + hair + neck
  add(place(sph(0.24, m, 16), 0, 2.50, 0));
  add(place(sph(0.12, m, 10), -0.20, 2.62, -0.15));
  add(place(sph(0.12, m, 10),  0.20, 2.62, -0.15));
  add(place(cyl(0.10, 0.13, 0.18, m, 8), 0, 2.18, 0));

  // Torso
  add(place(cyl(0.32, 0.40, 0.88, m, 12), 0, 1.64, 0));

  // Right arm — raised with scepter
  add(place(sph(0.16, m, 8), 0.44, 2.06, 0));
  add(rot(place(cyl(0.10, 0.09, 0.52, m, 8), 0.56, 2.28, -0.05), -0.22, 0, -0.55));
  add(place(sph(0.09, m, 8), 0.80, 2.52, -0.14));
  add(rot(place(cyl(0.08, 0.07, 0.48, m, 8), 0.90, 2.74, -0.16), -0.15, 0, -0.30));
  add(rot(place(cyl(0.03, 0.03, 0.80, m, 6), 1.04, 3.12, -0.20), -0.12, 0, -0.28));
  add(place(sph(0.09, m, 10), 1.18, 3.54, -0.28));
  add(place(tor(0.10, 0.025, m, 12, 6), 1.18, 3.54, -0.28));

  // Left arm — resting
  add(place(sph(0.16, m, 8), -0.44, 2.06, 0));
  add(rot(place(cyl(0.10, 0.09, 0.50, m, 8), -0.52, 1.82, 0.10), 0.15, 0, 0.60));
  add(place(sph(0.09, m, 8), -0.68, 1.55, 0.22));
  add(rot(place(cyl(0.08, 0.07, 0.48, m, 8), -0.66, 1.28, 0.28), 0.22, 0, 0.05));
  add(place(sph(0.08, m, 8), -0.64, 1.02, 0.32));

  // Seated robe
  add(place(cyl(0.50, 0.44, 0.38, m, 12), 0, 1.06, 0.10));
  add(place(cyl(0.44, 0.52, 0.55, m, 12), 0, 0.56, 0.12));
  add(place(cyl(0.50, 0.56, 0.30, m, 12), 0, 0.15, 0.14));

  const necklace = place(tor(0.20, 0.025, m, 20, 6), 0, 2.10, 0.10);
  necklace.rotation.set(0.35, 0, 0); add(necklace);

  g.position.y = -0.70;
  return g;
}

// ── Lyra: golden lyre instrument ─────────────────────────────────────────────

function buildLyra(m) {
  const g = new THREE.Group();
  const add = (...items) => items.forEach(i => g.add(i));

  // Resonator body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 12, 0, Math.PI*2, 0, Math.PI*0.65), m);
  body.position.set(0, -0.60, 0); add(body);
  add(place(sph(0.68, m, 16), 0, -0.60, 0));

  const sndHole = place(tor(0.24, 0.04, m, 20, 8), 0, -0.48, 0.68);
  sndHole.rotation.set(Math.PI/2, 0, 0); add(sndHole);

  const bRing = place(tor(0.72, 0.035, m, 24, 6), 0, -0.60, 0);
  bRing.rotation.set(Math.PI/2, 0, 0); add(bRing);

  // Two curved arms
  [-1, 1].forEach(sign => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(sign*0.50, -0.18, 0), new THREE.Vector3(sign*0.70, 0.60, 0),
      new THREE.Vector3(sign*0.60, 1.60, 0),  new THREE.Vector3(sign*0.44, 2.40, 0));
    const pts = curve.getPoints(18);
    for (let i = 0; i < pts.length - 1; i++) {
      const mid = pts[i].clone().add(pts[i+1]).multiplyScalar(0.5);
      const len = pts[i].distanceTo(pts[i+1]);
      const seg = cyl(0.06, 0.055, len, m, 8);
      seg.position.copy(mid); seg.lookAt(pts[i+1]); seg.rotateX(Math.PI/2);
      add(seg);
    }
    add(place(tor(0.14, 0.055, m, 16, 8), sign*0.44, 2.54, 0));
    add(place(sph(0.07, m, 8), sign*0.44, 2.54, 0));
  });

  const yoke = place(cyl(0.055, 0.055, 0.95, m, 8), 0, 2.42, 0);
  yoke.rotation.set(0, 0, Math.PI/2); add(yoke);

  for (let i = 0; i < 7; i++) {
    const peg = place(cyl(0.03, 0.02, 0.14, m, 6), -0.38 + i*(0.76/6), 2.52, 0);
    peg.rotation.set(0, 0, Math.PI/2); add(peg);
  }

  add(place(bx(0.80, 0.06, 0.06, m), 0, -0.10, 0.68));
  for (let i = 0; i < 7; i++) {
    const str = place(cyl(0.008, 0.008, 2.52, m, 4), -0.38 + i*(0.76/6), 1.21, 0.24);
    str.rotation.set(-0.12, 0, 0); add(str);
  }

  g.position.y = -0.50;
  return g;
}

// ── Scorpius: detailed arachnid with curving tail ────────────────────────────

function buildScorpius(m) {
  const g = new THREE.Group();
  const add = (...items) => items.forEach(i => g.add(i));

  const ceph = new THREE.Mesh(new THREE.SphereGeometry(0.58, 14, 10), m);
  ceph.scale.set(1.0, 0.55, 1.3); ceph.position.set(0, 0.40, 0); add(ceph);

  [-0.14, 0.14].forEach(x => {
    add(place(sph(0.07, m, 8), x, 0.60, 0.60));
    add(place(sph(0.04, m, 6), x, 0.62, 0.68));
  });

  [-0.12, 0.12].forEach(x => {
    const ch = place(cyl(0.06, 0.04, 0.30, m, 6), x, 0.18, 0.70);
    ch.rotation.set(-0.50, 0, x > 0 ? 0.25 : -0.25); add(ch);
    add(place(sph(0.06, m, 6), x + (x > 0 ? 0.06 : -0.06), 0.06, 0.86));
  });

  [-1, 1].forEach(s => {
    const a1 = place(cyl(0.08, 0.07, 0.55, m, 8), s*0.32, 0.38, 0.42); a1.rotation.set(-0.30, 0, s*0.60); add(a1);
    const a2 = place(cyl(0.07, 0.06, 0.55, m, 8), s*0.70, 0.38, 0.70); a2.rotation.set(-0.25, 0, s*0.40); add(a2);
    const p1 = place(cyl(0.05, 0.03, 0.40, m, 6), s*1.06, 0.42, 0.90); p1.rotation.set(-0.10, 0, s*0.70); add(p1);
    const p2 = place(cyl(0.04, 0.02, 0.36, m, 6), s*1.06, 0.28, 0.90); p2.rotation.set(0.30, 0, s*0.65); add(p2);
    const t1 = place(con(0.03, 0.12, m, 6), s*1.30, 0.48, 1.04); t1.rotation.set(-0.10, 0, s*1.10); add(t1);
    const t2 = place(con(0.03, 0.12, m, 6), s*1.22, 0.26, 0.98); t2.rotation.set(0.40, 0, s*1.10); add(t2);
  });

  [{z:0.38,y:0.30},{z:0.18,y:0.32},{z:-0.05,y:0.28},{z:-0.26,y:0.26}].forEach((lo, li) => {
    [-1, 1].forEach(s => {
      const ang = s * (0.8 + li * 0.1);
      const l1 = place(cyl(0.05, 0.04, 0.48, m, 6), s*0.52+s*0.22, lo.y-0.05, lo.z); l1.rotation.set(0.20, 0, ang); add(l1);
      const l2 = place(cyl(0.04, 0.03, 0.44, m, 6), s*0.52+s*0.60, lo.y-0.24, lo.z+0.04); l2.rotation.set(0.30, 0, ang*0.7); add(l2);
      const l3 = place(cyl(0.03, 0.03, 0.36, m, 6), s*0.52+s*0.90, lo.y-0.48, lo.z+0.06); l3.rotation.set(0.55, 0, ang*0.4); add(l3);
    });
  });

  [{r:0.50,y:-0.18},{r:0.44,y:-0.56},{r:0.38,y:-0.90},{r:0.32,y:-1.20},
   {r:0.26,y:-1.46},{r:0.20,y:-1.68},{r:0.15,y:-1.86}].forEach(({r,y}) => {
    const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), m);
    seg.scale.set(1, 0.70, 1.15); seg.position.set(0, y, 0); add(seg);
  });

  const tailCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0,-1.90,0), new THREE.Vector3(-0.30,-2.10,-0.40),
    new THREE.Vector3(-0.60,-1.60,-0.90), new THREE.Vector3(-0.20,-0.80,-1.30));
  const tailPts = tailCurve.getPoints(20);
  const tailR = [0.14,0.13,0.12,0.11,0.10,0.09,0.08,0.07,0.065];
  for (let i = 0; i < tailPts.length-1; i++) {
    const mid = tailPts[i].clone().add(tailPts[i+1]).multiplyScalar(0.5);
    const len = tailPts[i].distanceTo(tailPts[i+1]);
    const ri  = Math.min(i, tailR.length-1);
    const seg = cyl(tailR[ri]||0.06, tailR[ri+1]||0.055, len*1.02, m, 8);
    seg.position.copy(mid); seg.lookAt(tailPts[i+1]); seg.rotateX(Math.PI/2);
    add(seg);
  }
  const te = tailPts[tailPts.length-1];
  add(place(sph(0.12, m, 10), te.x, te.y, te.z));
  const stng = place(con(0.04, 0.28, m, 6), te.x-0.08, te.y+0.14, te.z-0.18);
  stng.rotation.set(-0.55, 0, 0.25); add(stng);

  g.position.y = 0.85;
  g.rotation.y = 0.3;
  return g;
}

// ── Aquarius: water-bearer with flowing streams ──────────────────────────────

function buildAquarius(m) {
  const g = new THREE.Group();
  const add = (...items) => items.forEach(i => g.add(i));

  // Head + nemes headdress
  add(place(sph(0.22, m, 16), 0, 2.64, 0));
  const nL = place(cyl(0.10, 0.08, 0.50, m, 6), -0.20, 2.44, -0.10); nL.rotation.set(0, 0, -0.35); add(nL);
  const nR = place(cyl(0.10, 0.08, 0.50, m, 6),  0.20, 2.44, -0.10); nR.rotation.set(0, 0,  0.35); add(nR);
  const hband = place(tor(0.24, 0.045, m, 20, 6), 0, 2.72, 0); hband.rotation.set(Math.PI/2, 0, 0); add(hband);
  add(place(cyl(0.22, 0.22, 0.04, m, 16), 0, 2.94, 0));
  add(place(cyl(0.09, 0.12, 0.18, m, 8), 0, 2.34, 0));

  // Torso + belt
  add(place(cyl(0.28, 0.36, 0.92, m, 12), 0, 1.68, 0));
  const belt = place(tor(0.36, 0.055, m, 20, 6), 0, 1.14, 0); belt.rotation.set(Math.PI/2, 0, 0); add(belt);

  // Left arm raised holding urn
  add(place(sph(0.15, m, 8), -0.40, 2.10, 0));
  const lUA = place(cyl(0.10, 0.09, 0.54, m, 8), -0.44, 2.28, 0.05); lUA.rotation.set(0.22, 0, 0.50); add(lUA);
  add(place(sph(0.09, m, 8), -0.62, 2.52, 0.14));
  const lFA = place(cyl(0.08, 0.07, 0.50, m, 8), -0.60, 2.74, 0.08); lFA.rotation.set(-0.14, 0, 0.18); add(lFA);

  const urnBody = new THREE.Mesh(new THREE.SphereGeometry(0.30, 12, 10), m);
  urnBody.scale.set(0.85, 1.30, 0.85); urnBody.position.set(-0.56, 3.06, -0.04); urnBody.rotation.z = 0.55; add(urnBody);
  const uN = place(cyl(0.10, 0.16, 0.22, m, 8), -0.44, 3.44, -0.10); uN.rotation.set(0, 0, 0.55); add(uN);
  const uL = place(cyl(0.16, 0.12, 0.08, m, 10), -0.38, 3.58, -0.14); uL.rotation.set(0, 0, 0.55); add(uL);
  const uB = place(cyl(0.12, 0.18, 0.10, m, 10), -0.72, 2.72, 0.06); uB.rotation.set(0, 0, 0.55); add(uB);
  const uH = place(tor(0.18, 0.03, m, 12, 6), -0.72, 3.04, -0.04); uH.rotation.set(Math.PI/2, 0.55, 0); add(uH);

  // Right arm extended
  add(place(sph(0.15, m, 8), 0.40, 2.10, 0));
  const rUA = place(cyl(0.10, 0.09, 0.52, m, 8), 0.56, 1.90, 0.05); rUA.rotation.set(0.10, 0, -0.60); add(rUA);
  add(place(sph(0.09, m, 8), 0.84, 1.68, 0.12));
  const rFA = place(cyl(0.08, 0.07, 0.48, m, 8), 0.98, 1.46, 0.18); rFA.rotation.set(0.24, 0, -0.28); add(rFA);
  add(place(sph(0.08, m, 8), 1.08, 1.24, 0.24));

  // Water streams
  const wMat = m.clone(); wMat.color.setHex(0x88ccee); wMat.emissive = new THREE.Color(0x112233);
  [
    [new THREE.Vector3(-0.38,3.54,-0.14), new THREE.Vector3(-0.10,3.20,0.10), new THREE.Vector3(0.10,2.60,0.14), new THREE.Vector3(-0.06,1.80,0.10)],
    [new THREE.Vector3(-0.40,3.52,-0.18), new THREE.Vector3(-0.18,3.14,0.04), new THREE.Vector3(-0.02,2.50,0.08), new THREE.Vector3(-0.20,1.60,0.04)],
    [new THREE.Vector3(-0.36,3.50,-0.10), new THREE.Vector3(-0.04,3.22,0.14), new THREE.Vector3(0.16,2.64,0.18), new THREE.Vector3(0.04,1.74,0.14)],
  ].forEach(([p0,p1,p2,p3]) => {
    const pts = new THREE.CubicBezierCurve3(p0,p1,p2,p3).getPoints(16);
    for (let i = 0; i < pts.length-1; i++) {
      const mid = pts[i].clone().add(pts[i+1]).multiplyScalar(0.5);
      const len = pts[i].distanceTo(pts[i+1]);
      const t = i/(pts.length-1);
      const seg = cyl(0.025*(1-t*0.5), 0.022*(1-t*0.5), len*1.05, wMat, 5);
      seg.position.copy(mid); seg.lookAt(pts[i+1]); seg.rotateX(Math.PI/2); add(seg);
    }
  });

  // Robe
  add(place(cyl(0.36, 0.42, 0.55, m, 12), 0, 0.85, 0));
  add(place(cyl(0.42, 0.50, 0.50, m, 12), 0, 0.38, 0));
  add(place(cyl(0.48, 0.44, 0.40, m, 12), 0, -0.02, 0));
  const hem = place(tor(0.47, 0.04, m, 20, 6), 0, -0.24, 0); hem.rotation.set(Math.PI/2, 0, 0); add(hem);
  [-0.16, 0.16].forEach(x => add(place(sph(0.10, m, 8), x, -0.38, 0.12)));
  const collar = place(tor(0.22, 0.04, m, 20, 6), 0, 2.12, 0.08); collar.rotation.set(0.35, 0, 0); add(collar);

  g.position.y = -0.60;
  return g;
}

// ── Renderer factory ─────────────────────────────────────────────────────────

export function createFigureRenderer() {
  const W = 440, H = 620;
  const dpr = Math.min(window.devicePixelRatio, 2);

  const canvas = document.createElement('canvas');
  canvas.id = 'figure-canvas';
  Object.assign(canvas.style, {
    position:      'fixed',
    width:         W + 'px',
    height:        H + 'px',
    pointerEvents: 'none',
    zIndex:        '2',
    transform:     'translate(-50%, -50%)',
    opacity:       '0',
  });
  document.body.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100);
  camera.position.set(0, 0.30, 7.2);
  camera.lookAt(0, 0.10, 0);

  // Dramatic product-photography lighting
  const kl = new THREE.DirectionalLight(0xfff4e0, 4.0); kl.position.set(3, 5, 4); scene.add(kl);
  const rl = new THREE.DirectionalLight(0x88aaff, 2.2); rl.position.set(-3, 2, -5); scene.add(rl);
  const fl = new THREE.DirectionalLight(0xffe8d0, 0.8); fl.position.set(0, -3, 3); scene.add(fl);
  const r2 = new THREE.DirectionalLight(0xffd0aa, 1.0); r2.position.set(4, 0, -4); scene.add(r2);
  scene.add(new THREE.AmbientLight(0x1a1030, 0.55));

  const mkMat = (col, spec, shin, emis) => new THREE.MeshPhongMaterial({
    color: new THREE.Color(col), specular: new THREE.Color(spec),
    shininess: shin, emissive: new THREE.Color(emis),
  });
  const mats = {
    orion:      mkMat(0xb87333, 0xff7722, 110, 0x0d0500),
    cassiopeia: mkMat(0xd4af37, 0xffee88, 130, 0x0a0800),
    lyra:       mkMat(0xe8c84a, 0xffff99, 150, 0x0c0900),
    scorpius:   mkMat(0x8b2010, 0xff4422,  70, 0x1a0200),
    aquarius:   mkMat(0x3a8a9a, 0x88eeff,  95, 0x010810),
  };

  const figures = {
    orion:      buildOrion(mats.orion),
    cassiopeia: buildCassiopeia(mats.cassiopeia),
    lyra:       buildLyra(mats.lyra),
    scorpius:   buildScorpius(mats.scorpius),
    aquarius:   buildAquarius(mats.aquarius),
  };

  let activeKey = null, activeGroup = null, rotY = 0, lastT = 0;

  function render(key, progress, now) {
    const dt = lastT ? Math.min((now - lastT) / 1000, 0.05) : 0.016;
    lastT = now;

    if (!key || progress < 0.005) { canvas.style.opacity = '0'; return; }
    canvas.style.opacity = Math.min(1, progress * 1.6).toString();

    if (activeKey !== key) {
      if (activeGroup) scene.remove(activeGroup);
      activeKey = key; activeGroup = figures[key];
      if (activeGroup) scene.add(activeGroup);
    }

    if (activeGroup) { rotY += dt * 0.28; activeGroup.rotation.y = rotY; }
    renderer.render(scene, camera);
  }

  function setCenter(x, y) {
    canvas.style.left = x + 'px';
    canvas.style.top  = y + 'px';
  }

  return { render, setCenter };
}
