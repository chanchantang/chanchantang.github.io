export const CONSTELLATIONS = {
  taurus: {
    name: 'Taurus', section: 'About Me', myth: 'The Bull',
    color: '#b080ff', rgb: '176,128,255',
    anchor: { x: 0.34, y: 0.50 },
    stars: [
      { x:  0.20, y:  0.05, size: 4.8, name: 'Aldebaran' },  // 0 — eye, biggest
      { x: -0.18, y: -0.68, size: 3.0, name: 'Elnath' },      // 1 — north horn tip
      { x:  0.50, y: -0.60, size: 2.6, name: 'Alheka' },      // 2 — south horn tip
      { x: -0.06, y:  0.18, size: 2.8, name: 'Theta Tau' },   // 3 — Hyades
      { x:  0.02, y:  0.28, size: 2.4, name: 'Gamma Tau' },   // 4 — Hyades
      { x:  0.14, y:  0.38, size: 2.4, name: 'Delta Tau' },   // 5 — Hyades
      { x: -0.14, y:  0.30, size: 2.4, name: 'Epsilon Tau' }, // 6 — Hyades
      { x: -0.42, y:  0.46, size: 2.2, name: 'Lambda Tau' },  // 7 — lower left
    ],
    lines: [
      [6,3],[3,0],          // ε–θ–Aldebaran (left side of V)
      [5,4],[4,3],          // δ–γ–θ (right side of V)
      [3,1],                // θ–Elnath (north horn)
      [0,2],                // Aldebaran–Alheka (south horn)
      [6,7],                // ε–λ (lower extension)
    ]
  },

  scorpius: {
    name: 'Scorpius', section: 'Experience', myth: 'The Divine Scorpion',
    color: '#ff7878', rgb: '255,120,120',
    anchor: { x: 0.34, y: 0.50 },
    stars: [
      { x:  0.00, y:  0.66, size: 4.8, name: 'Antares' },
      { x: -0.12, y:  0.50, size: 2.3, name: 'Sigma Sco' },
      { x:  0.12, y:  0.50, size: 2.3, name: 'Tau Sco' },
      { x: -0.26, y:  0.36, size: 2.1, name: 'Al Niyat L' },
      { x:  0.26, y:  0.36, size: 2.1, name: 'Al Niyat R' },
      { x: -0.32, y:  0.20, size: 2.3, name: 'Pi Sco' },
      { x:  0.32, y:  0.20, size: 2.3, name: 'Rho Sco' },
      { x:  0.00, y:  0.02, size: 2.6, name: 'Dschubba' },
      { x:  0.10, y: -0.16, size: 2.3, name: 'Graffias' },
      { x:  0.00, y: -0.32, size: 2.1, name: 'Larawag' },
      { x: -0.08, y: -0.50, size: 2.8, name: 'Sargas' },
      { x: -0.22, y: -0.66, size: 3.5, name: 'Shaula' },
      { x: -0.14, y: -0.76, size: 2.3, name: 'Lesath' },
    ],
    lines: [
      [5,3],[3,1],[1,0],[0,2],[2,4],[4,6],
      [1,7],[7,8],[8,9],[9,10],[10,11],[11,12]
    ]
  },

  orion: {
    name: 'Orion', section: 'Projects', myth: 'The Hunter',
    color: '#5ab4ff', rgb: '90,180,255',
    anchor: { x: 0.66, y: 0.50 },
    stars: [
      { x: -0.24, y:  0.38, size: 4.2, name: 'Betelgeuse' },
      { x:  0.22, y:  0.40, size: 2.8, name: 'Bellatrix' },
      { x: -0.10, y:  0.13, size: 2.4, name: 'Mintaka' },
      { x:  0.00, y:  0.10, size: 2.4, name: 'Alnilam' },
      { x:  0.10, y:  0.07, size: 2.4, name: 'Alnitak' },
      { x: -0.28, y: -0.38, size: 3.6, name: 'Rigel' },
      { x:  0.24, y: -0.36, size: 2.6, name: 'Saiph' },
      { x: -0.06, y:  0.60, size: 2.0, name: 'Meissa' },
      { x:  0.00, y:  0.76, size: 1.6, name: 'Head-a' },
      { x: -0.02, y: -0.12, size: 1.8, name: 'Sword1' },
      { x:  0.02, y: -0.26, size: 1.9, name: 'ONC' },
    ],
    lines: [
      [0,2],[1,3],[2,3],[3,4],[0,7],[1,7],[7,8],
      [0,5],[1,6],[4,9],[9,10]
    ]
  },

  lyra: {
    name: 'Lyra', section: 'Skills', myth: 'The Lyre of Orpheus',
    color: '#40d8ff', rgb: '64,216,255',
    anchor: { x: 0.66, y: 0.50 },
    stars: [
      { x:  0.00, y:  0.44, size: 5.0, name: 'Vega' },
      { x: -0.18, y:  0.02, size: 2.4, name: 'Sheliak' },
      { x:  0.18, y:  0.02, size: 2.4, name: 'Sulafat' },
      { x: -0.22, y: -0.28, size: 2.1, name: 'Delta2 Lyr' },
      { x:  0.22, y: -0.28, size: 2.1, name: 'Zeta Lyr' },
    ],
    lines: [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]]
  },

  aquarius: {
    name: 'Aquarius', section: 'Contact', myth: 'The Water Bearer',
    color: '#30f0c0', rgb: '48,240,192',
    anchor: { x: 0.50, y: 0.44 },
    stars: [
      { x:  0.00, y:  0.36, size: 3.6, name: 'Sadalsuud' },
      { x: -0.26, y:  0.18, size: 2.8, name: 'Sadalmelik' },
      { x:  0.24, y:  0.20, size: 2.3, name: 'Sadaltager' },
      { x: -0.16, y:  0.02, size: 2.1, name: 'Albali' },
      { x:  0.12, y: -0.10, size: 2.1, name: 'Eta Aqr' },
      { x: -0.30, y: -0.14, size: 2.3, name: 'Zeta Aqr' },
      { x: -0.14, y: -0.34, size: 2.1, name: 'Lambda Aqr' },
      { x:  0.18, y: -0.34, size: 2.1, name: 'Tau Aqr' },
    ],
    lines: [[0,1],[0,2],[1,3],[3,5],[3,4],[5,6],[4,7]]
  }
};

// ── Engraving-style SVG illustrations ────────────────────────────────────────
// Rendered large behind constellations on hover (screen blend mode on dark bg)
// All strokes are white-silver so they glow through on the dark canvas.

export const MYTH_SVGS = {

  // ORION — The Hunter
  orion: `<svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg">
<defs>
  <pattern id="oh" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(230,240,255,0.28)" stroke-width="0.8"/>
  </pattern>
  <pattern id="oh2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(230,240,255,0.18)" stroke-width="0.7"/>
  </pattern>
</defs>
<g fill="none" stroke="rgba(220,235,255,0.90)" stroke-linecap="round" stroke-linejoin="round">

  <!-- Helmet & Head -->
  <ellipse cx="130" cy="38" rx="20" ry="24" stroke-width="1.4"/>
  <path d="M110 30 Q105 18 112 10 Q122 4 130 6 Q138 4 148 10 Q155 18 150 30" stroke-width="1.2"/>
  <path d="M118 8 L114 0 M130 6 L130 0 M142 8 L146 0" stroke-width="0.9"/>
  <path d="M108 22 Q106 26 108 30" stroke-width="0.8"/>
  <path d="M152 22 Q154 26 152 30" stroke-width="0.8"/>
  <!-- Face features -->
  <path d="M122 34 Q125 32 128 34" stroke-width="0.9"/>
  <path d="M132 34 Q135 32 138 34" stroke-width="0.9"/>
  <path d="M126 40 Q130 43 134 40" stroke-width="0.9"/>
  <!-- Neck -->
  <line x1="124" y1="60" x2="122" y2="70" stroke-width="1.0"/>
  <line x1="136" y1="60" x2="138" y2="70" stroke-width="1.0"/>

  <!-- Torso outline -->
  <path d="M88 78 Q108 68 130 66 Q152 68 172 78 L170 168 Q152 178 130 178 Q108 178 90 168 Z" stroke-width="1.6"/>
  <!-- Torso fill hatch -->
  <path d="M88 78 Q108 68 130 66 Q152 68 172 78 L170 168 Q152 178 130 178 Q108 178 90 168 Z" fill="url(#oh)" stroke="none"/>
  <path d="M88 78 Q108 68 130 66 Q152 68 172 78 L170 168 Q152 178 130 178 Q108 178 90 168 Z" fill="url(#oh2)" stroke="none"/>
  <!-- Torso detail lines -->
  <path d="M94 100 Q130 96 166 100" stroke-width="0.7" stroke-opacity="0.5"/>
  <path d="M92 120 Q130 116 168 120" stroke-width="0.7" stroke-opacity="0.5"/>
  <path d="M92 140 Q130 136 168 140" stroke-width="0.7" stroke-opacity="0.4"/>

  <!-- Belt — three stars (Mintaka, Alnilam, Alnitak) -->
  <line x1="88" y1="128" x2="172" y2="128" stroke-width="1.3"/>
  <circle cx="104" cy="128" r="4.5" fill="rgba(230,240,255,0.35)" stroke-width="1.2"/>
  <circle cx="130" cy="128" r="5.5" fill="rgba(230,240,255,0.40)" stroke-width="1.4"/>
  <circle cx="156" cy="128" r="4.5" fill="rgba(230,240,255,0.35)" stroke-width="1.2"/>
  <!-- Belt buckle detail -->
  <rect x="122" y="122" width="16" height="12" rx="3" stroke-width="1.0"/>

  <!-- Right arm — raised high with club -->
  <path d="M172 84 Q188 74 200 58 Q210 44 206 28 Q202 18 192 22 Q184 28 186 48 Q188 62 178 78" stroke-width="1.5"/>
  <!-- Club -->
  <path d="M192 22 Q186 10 194 6 Q204 4 208 14 Q210 24 202 28" stroke-width="1.4"/>
  <path d="M194 8 Q196 4 200 6 M198 6 Q202 4 206 8" stroke-width="0.8"/>
  <!-- Arm hatch -->
  <path d="M178 80 Q192 66 204 46" stroke-width="0.6" stroke-opacity="0.4"/>
  <path d="M182 82 Q196 68 206 50" stroke-width="0.6" stroke-opacity="0.4"/>

  <!-- Left arm — shield -->
  <path d="M88 84 Q72 78 58 68 Q46 60 42 72 Q40 86 52 96 Q60 104 72 110 Q80 116 88 120" stroke-width="1.5"/>
  <!-- Shield — large rounded -->
  <ellipse cx="46" cy="104" rx="22" ry="30" stroke-width="1.6"/>
  <ellipse cx="46" cy="104" rx="16" ry="22" stroke-width="0.8" stroke-opacity="0.6"/>
  <!-- Shield hatch shading -->
  <ellipse cx="46" cy="104" rx="22" ry="30" fill="url(#oh)" stroke="none"/>
  <!-- Shield boss (center knob) -->
  <circle cx="46" cy="104" r="5" fill="rgba(230,240,255,0.30)" stroke-width="1.1"/>
  <!-- Shield decorative lines -->
  <path d="M30 90 Q46 84 62 90 M28 100 Q46 94 64 100 M28 112 Q46 106 64 112" stroke-width="0.6" stroke-opacity="0.45"/>

  <!-- Hips / loincloth -->
  <path d="M90 170 Q130 180 170 170 L174 196 Q154 206 130 206 Q106 206 86 196 Z" stroke-width="1.3"/>
  <path d="M90 170 Q130 180 170 170 L174 196 Q154 206 130 206 Q106 206 86 196 Z" fill="url(#oh2)" stroke="none"/>
  <!-- Loincloth fringe -->
  <path d="M94 206 L90 220 M106 208 L104 222 M118 208 L118 224 M130 208 L130 224 M142 208 L142 222 M154 208 L150 220 M166 206 L164 220" stroke-width="0.9"/>

  <!-- Left leg -->
  <path d="M96 200 Q82 230 72 264 Q66 288 70 310 Q76 324 90 326 Q104 326 106 310 Q108 290 102 264 Q98 238 104 200" stroke-width="1.5"/>
  <!-- Left leg hatch -->
  <path d="M74 270 L104 258 M72 282 L104 272 M72 294 L104 284 M72 306 L102 298" stroke-width="0.55" stroke-opacity="0.35"/>
  <!-- Left foot/boot -->
  <path d="M66 310 Q72 320 84 324 Q96 324 104 316 Q108 308 102 302" stroke-width="1.2"/>

  <!-- Right leg -->
  <path d="M164 200 Q178 230 188 264 Q194 288 190 310 Q184 324 170 326 Q156 326 154 310 Q152 290 158 264 Q162 238 156 200" stroke-width="1.5"/>
  <!-- Right leg hatch -->
  <path d="M156 258 L186 270 M156 270 L188 282 M156 282 L188 294 M158 294 L188 306" stroke-width="0.55" stroke-opacity="0.35"/>
  <!-- Right foot/boot -->
  <path d="M194 310 Q188 320 176 324 Q164 324 156 316 Q152 308 158 302" stroke-width="1.2"/>

  <!-- Sword hanging from belt -->
  <line x1="118" y1="134" x2="110" y2="218" stroke-width="1.1"/>
  <line x1="108" y1="166" x2="122" y2="166" stroke-width="1.2"/>
  <path d="M106 218 Q110 226 114 218" stroke-width="1.0"/>

  <!-- Cloak/cape flowing behind -->
  <path d="M172 86 Q194 110 200 148 Q204 180 196 208 Q186 230 172 240" stroke-width="1.0" stroke-opacity="0.55" stroke-dasharray="4,2"/>
  <path d="M174 90 Q194 116 198 154 Q202 184 194 210" stroke-width="0.7" stroke-opacity="0.35" stroke-dasharray="3,2"/>

  <!-- Stars glow hints at key positions -->
  <circle cx="88" cy="88" r="7" fill="rgba(230,240,255,0.12)" stroke-width="0.8" stroke-opacity="0.6"/>
  <circle cx="172" cy="88" r="5" fill="rgba(230,240,255,0.10)" stroke-width="0.8" stroke-opacity="0.5"/>
</g></svg>`,

  // CASSIOPEIA — The Queen
  taurus: `<svg viewBox="0 0 280 420" xmlns="http://www.w3.org/2000/svg">
<defs>
  <pattern id="tf" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(220,210,255,0.22)" stroke-width="0.8"/>
  </pattern>
</defs>
<g fill="none" stroke="rgba(220,210,255,0.90)" stroke-linecap="round" stroke-linejoin="round">

  <!-- Horns — long sweeping curves -->
  <path d="M100 120 Q70 80 50 40 Q44 22 56 14 Q68 8 80 24 Q90 40 100 70" stroke-width="1.8"/>
  <path d="M180 120 Q210 80 230 40 Q236 22 224 14 Q212 8 200 24 Q190 40 180 70" stroke-width="1.8"/>
  <!-- Horn tips glow -->
  <circle cx="55" cy="16" r="4" fill="rgba(220,210,255,0.28)" stroke-width="1.1"/>
  <circle cx="225" cy="16" r="4" fill="rgba(220,210,255,0.28)" stroke-width="1.1"/>

  <!-- Head — large rounded bull skull -->
  <path d="M82 70 Q82 48 100 44 Q140 38 180 44 Q198 48 198 70 L200 120 Q200 148 178 158 Q158 166 140 166 Q122 166 102 158 Q80 148 80 120 Z" stroke-width="1.8"/>

  <!-- Muzzle -->
  <ellipse cx="140" cy="156" rx="32" ry="20" stroke-width="1.4"/>
  <!-- Nostrils -->
  <ellipse cx="128" cy="158" rx="6" ry="4" stroke-width="1.1"/>
  <ellipse cx="152" cy="158" rx="6" ry="4" stroke-width="1.1"/>

  <!-- Eyes -->
  <circle cx="108" cy="100" r="9" stroke-width="1.4"/>
  <circle cx="108" cy="100" r="4" fill="rgba(220,210,255,0.20)" stroke-width="1.0"/>
  <circle cx="172" cy="100" r="9" stroke-width="1.4"/>
  <circle cx="172" cy="100" r="4" fill="rgba(220,210,255,0.20)" stroke-width="1.0"/>
  <!-- Aldebaran — glowing right eye highlight -->
  <circle cx="172" cy="100" r="5" fill="rgba(220,210,255,0.35)" stroke="none"/>

  <!-- Brow ridge -->
  <path d="M88 88 Q108 80 128 86" stroke-width="1.1" stroke-opacity="0.7"/>
  <path d="M152 86 Q172 80 192 88" stroke-width="1.1" stroke-opacity="0.7"/>

  <!-- Ears -->
  <path d="M84 90 Q68 80 66 100 Q68 116 84 112" stroke-width="1.4"/>
  <path d="M196 90 Q212 80 214 100 Q212 116 196 112" stroke-width="1.4"/>

  <!-- Neck -->
  <path d="M96 162 Q90 190 88 220 Q86 250 90 270" stroke-width="1.6"/>
  <path d="M184 162 Q190 190 192 220 Q194 250 190 270" stroke-width="1.6"/>

  <!-- Chest / body — powerful barrel chest -->
  <path d="M90 270 Q80 290 76 320 Q74 350 80 380 Q100 398 140 400 Q180 398 200 380 Q206 350 204 320 Q200 290 190 270 Q170 260 140 258 Q110 260 90 270 Z" stroke-width="1.6"/>
  <path d="M90 270 Q80 290 76 320 Q74 350 80 380 Q100 398 140 400 Q180 398 200 380 Q206 350 204 320 Q200 290 190 270 Q170 260 140 258 Q110 260 90 270 Z" fill="url(#tf)" stroke="none" opacity="0.6"/>

  <!-- Chest fur texture lines -->
  <path d="M108 275 Q120 268 140 266 Q160 268 172 275" stroke-width="0.7" stroke-opacity="0.45"/>
  <path d="M100 295 Q120 286 140 284 Q160 286 180 295" stroke-width="0.7" stroke-opacity="0.40"/>
  <path d="M94 316 Q118 306 140 304 Q162 306 186 316" stroke-width="0.7" stroke-opacity="0.35"/>

  <!-- Front legs -->
  <path d="M100 370 Q94 390 90 410" stroke-width="1.5"/>
  <path d="M180 370 Q186 390 190 410" stroke-width="1.5"/>
  <!-- Hooves -->
  <path d="M84 408 Q90 416 98 414 Q104 410 102 404" stroke-width="1.3"/>
  <path d="M196 408 Q190 416 182 414 Q176 410 178 404" stroke-width="1.3"/>

  <!-- Dewlap -->
  <path d="M116 168 Q130 180 140 182 Q150 180 164 168" stroke-width="1.0" stroke-opacity="0.6"/>
  <path d="M122 178 Q136 194 140 196 Q144 194 158 178" stroke-width="0.8" stroke-opacity="0.45"/>

</g></svg>`,

  // LYRA — The Lyre of Orpheus
  lyra: `<svg viewBox="0 0 260 380" xmlns="http://www.w3.org/2000/svg">
<defs>
  <pattern id="lh" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
    <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(180,240,255,0.22)" stroke-width="0.7"/>
  </pattern>
</defs>
<g fill="none" stroke="rgba(180,240,255,0.92)" stroke-linecap="round" stroke-linejoin="round">

  <!-- Main lyre body — tortoise shell resonator -->
  <ellipse cx="130" cy="280" rx="72" ry="80" stroke-width="2.0"/>
  <ellipse cx="130" cy="280" rx="72" ry="80" fill="url(#lh)" stroke="none"/>
  <!-- Shell texture lines -->
  <path d="M70 248 Q100 240 130 242 Q160 240 190 248" stroke-width="0.8" stroke-opacity="0.45"/>
  <path d="M62 266 Q96 256 130 258 Q164 256 198 266" stroke-width="0.8" stroke-opacity="0.45"/>
  <path d="M60 284 Q96 274 130 276 Q164 274 200 284" stroke-width="0.8" stroke-opacity="0.40"/>
  <path d="M62 302 Q96 292 130 294 Q164 292 198 302" stroke-width="0.8" stroke-opacity="0.38"/>
  <path d="M68 320 Q100 310 130 312 Q160 310 192 320" stroke-width="0.8" stroke-opacity="0.35"/>
  <!-- Shell plate boundaries (tortoise pattern) -->
  <path d="M88 244 Q82 270 84 296 Q86 316 94 332" stroke-width="0.7" stroke-opacity="0.40"/>
  <path d="M110 242 Q108 268 108 294 Q108 314 112 334" stroke-width="0.7" stroke-opacity="0.38"/>
  <path d="M130 242 Q130 268 130 294 Q130 314 130 334" stroke-width="0.7" stroke-opacity="0.38"/>
  <path d="M150 242 Q152 268 152 294 Q152 314 148 334" stroke-width="0.7" stroke-opacity="0.38"/>
  <path d="M172 244 Q178 270 176 296 Q174 316 166 332" stroke-width="0.7" stroke-opacity="0.40"/>
  <!-- Sound hole -->
  <ellipse cx="130" cy="286" rx="24" ry="28" stroke-width="1.2" stroke-opacity="0.70"/>
  <ellipse cx="130" cy="286" rx="14" ry="17" stroke-width="0.9" stroke-opacity="0.50"/>
  <circle cx="130" cy="286" r="5" fill="rgba(180,240,255,0.18)" stroke-width="0.9"/>

  <!-- Left arm of lyre -->
  <path d="M68 224 Q52 200 48 160 Q44 120 52 84 Q58 60 72 44 Q82 32 90 38 Q98 46 92 64 Q86 84 80 110 Q74 140 74 180 Q74 206 78 224" stroke-width="1.8"/>
  <!-- Left arm detail lines -->
  <path d="M52 164 Q60 158 68 162" stroke-width="0.8" stroke-opacity="0.5"/>
  <path d="M50 184 Q58 178 66 182" stroke-width="0.8" stroke-opacity="0.5"/>
  <path d="M50 204 Q58 198 66 202" stroke-width="0.8" stroke-opacity="0.5"/>
  <!-- Left arm top spiral -->
  <path d="M72 44 Q62 30 58 18 Q58 8 68 6 Q80 4 84 16 Q86 28 80 36" stroke-width="1.4"/>
  <circle cx="64" cy="10" r="5" fill="rgba(180,240,255,0.22)" stroke-width="1.0"/>

  <!-- Right arm of lyre -->
  <path d="M192 224 Q208 200 212 160 Q216 120 208 84 Q202 60 188 44 Q178 32 170 38 Q162 46 168 64 Q174 84 180 110 Q186 140 186 180 Q186 206 182 224" stroke-width="1.8"/>
  <!-- Right arm detail lines -->
  <path d="M208 164 Q200 158 192 162" stroke-width="0.8" stroke-opacity="0.5"/>
  <path d="M210 184 Q202 178 194 182" stroke-width="0.8" stroke-opacity="0.5"/>
  <path d="M210 204 Q202 198 194 202" stroke-width="0.8" stroke-opacity="0.5"/>
  <!-- Right arm top spiral -->
  <path d="M188 44 Q198 30 202 18 Q202 8 192 6 Q180 4 176 16 Q174 28 180 36" stroke-width="1.4"/>
  <circle cx="196" cy="10" r="5" fill="rgba(180,240,255,0.22)" stroke-width="1.0"/>

  <!-- Crossbar (yoke) connecting the two arms -->
  <path d="M72 44 Q130 30 188 44" stroke-width="2.0"/>
  <path d="M72 44 Q130 32 188 44" fill="none" stroke-width="0.8" stroke-opacity="0.50"/>
  <!-- Tuning pegs on crossbar -->
  <circle cx="90" cy="40" r="4" fill="rgba(180,240,255,0.28)" stroke-width="1.1"/>
  <circle cx="108" cy="36" r="4" fill="rgba(180,240,255,0.28)" stroke-width="1.1"/>
  <circle cx="126" cy="34" r="4" fill="rgba(180,240,255,0.28)" stroke-width="1.1"/>
  <circle cx="144" cy="34" r="4" fill="rgba(180,240,255,0.28)" stroke-width="1.1"/>
  <circle cx="162" cy="36" r="4" fill="rgba(180,240,255,0.28)" stroke-width="1.1"/>
  <circle cx="178" cy="40" r="4" fill="rgba(180,240,255,0.28)" stroke-width="1.1"/>
  <!-- Peg box detail -->
  <path d="M80 38 L80 52 M96 36 L96 50 M112 34 L112 48 M128 32 L128 46 M148 32 L148 46 M164 34 L164 48 M180 36 L180 50" stroke-width="0.7" stroke-opacity="0.55"/>

  <!-- Strings — 7 strings from crossbar to bridge -->
  <line x1="90" y1="52" x2="90" y2="248" stroke-width="0.9" stroke-opacity="0.85"/>
  <line x1="103" y1="48" x2="103" y2="248" stroke-width="0.9" stroke-opacity="0.85"/>
  <line x1="116" y1="46" x2="116" y2="248" stroke-width="0.9" stroke-opacity="0.85"/>
  <line x1="130" y1="44" x2="130" y2="248" stroke-width="1.0" stroke-opacity="0.90"/>
  <line x1="144" y1="46" x2="144" y2="248" stroke-width="0.9" stroke-opacity="0.85"/>
  <line x1="157" y1="48" x2="157" y2="248" stroke-width="0.9" stroke-opacity="0.85"/>
  <line x1="170" y1="52" x2="170" y2="248" stroke-width="0.9" stroke-opacity="0.85"/>
  <!-- String highlight (plucked effect) -->
  <path d="M130 120 Q132 130 130 140 Q128 150 130 160" stroke-width="0.7" stroke-opacity="0.55"/>

  <!-- Bridge on body -->
  <path d="M88 246 Q130 240 172 246 L172 252 Q130 248 88 252 Z" stroke-width="1.2"/>

  <!-- Decorative flourishes -->
  <path d="M46 50 Q36 60 34 78 Q32 96 42 108" stroke-width="1.0" stroke-opacity="0.50"/>
  <path d="M214 50 Q224 60 226 78 Q228 96 218 108" stroke-width="1.0" stroke-opacity="0.50"/>

  <!-- Vega star glow at top center -->
  <circle cx="130" cy="22" r="9" fill="rgba(180,240,255,0.20)" stroke-width="1.0" stroke-opacity="0.7"/>
  <circle cx="130" cy="22" r="4" fill="rgba(220,248,255,0.45)" stroke-width="1.2"/>
  <!-- Star rays from Vega -->
  <path d="M130 8 L130 2 M118 13 L113 8 M142 13 L147 8 M116 22 L110 22 M144 22 L150 22" stroke-width="0.8" stroke-opacity="0.60"/>

</g></svg>`,

  // SCORPIUS — The Divine Scorpion
  scorpius: `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
<defs>
  <pattern id="sh" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,180,180,0.24)" stroke-width="0.7"/>
  </pattern>
</defs>
<g fill="none" stroke="rgba(255,200,200,0.90)" stroke-linecap="round" stroke-linejoin="round">

  <!-- HEAD — cephalothorax (front body plate) -->
  <ellipse cx="150" cy="60" rx="46" ry="38" stroke-width="2.0"/>
  <ellipse cx="150" cy="60" rx="46" ry="38" fill="url(#sh)" stroke="none"/>
  <!-- Head segment lines -->
  <path d="M108 52 Q150 46 192 52" stroke-width="0.8" stroke-opacity="0.5"/>
  <path d="M106 64 Q150 58 194 64" stroke-width="0.8" stroke-opacity="0.45"/>
  <!-- Eyes (4 pairs typical of arachnids, show 2 prominent) -->
  <circle cx="134" cy="52" r="6" fill="rgba(255,180,180,0.30)" stroke-width="1.2"/>
  <circle cx="136" cy="52" r="2.5" fill="rgba(255,200,200,0.55)" stroke="none"/>
  <circle cx="166" cy="52" r="6" fill="rgba(255,180,180,0.30)" stroke-width="1.2"/>
  <circle cx="168" cy="52" r="2.5" fill="rgba(255,200,200,0.55)" stroke="none"/>
  <!-- Head top detail — median eyes -->
  <circle cx="142" cy="42" r="3" fill="rgba(255,180,180,0.22)" stroke-width="0.9"/>
  <circle cx="158" cy="42" r="3" fill="rgba(255,180,180,0.22)" stroke-width="0.9"/>
  <!-- Central ridge -->
  <line x1="150" y1="22" x2="150" y2="96" stroke-width="0.9" stroke-opacity="0.45"/>

  <!-- CHELICERAE (mouth parts) -->
  <path d="M130 94 Q118 108 112 124 Q108 138 114 150 Q120 160 130 154 Q138 148 136 134 Q134 118 140 104" stroke-width="1.4"/>
  <path d="M138 148 L130 168 M136 152 Q128 166 122 172" stroke-width="1.0"/>
  <path d="M170 94 Q182 108 188 124 Q192 138 186 150 Q180 160 170 154 Q162 148 164 134 Q166 118 160 104" stroke-width="1.4"/>
  <path d="M162 148 L170 168 M164 152 Q172 166 178 172" stroke-width="1.0"/>

  <!-- PEDIPALPS (large claws) -->
  <!-- Left claw arm -->
  <path d="M110 70 Q86 66 62 56 Q40 46 28 30 Q18 16 24 6 Q32 0 44 8 Q52 16 48 32 Q44 48 56 58 Q72 68 90 76" stroke-width="1.6"/>
  <!-- Left claw pincer -->
  <path d="M24 8 Q14 14 12 28 Q12 40 22 44 Q32 46 38 38 Q44 30 40 20" stroke-width="1.4"/>
  <path d="M22 10 Q16 20 18 30" stroke-width="0.8" stroke-opacity="0.5"/>
  <!-- Left claw detail -->
  <path d="M44 34 Q36 26 30 28 Q24 32 26 38" stroke-width="1.1"/>
  <!-- Right claw arm -->
  <path d="M190 70 Q214 66 238 56 Q260 46 272 30 Q282 16 276 6 Q268 0 256 8 Q248 16 252 32 Q256 48 244 58 Q228 68 210 76" stroke-width="1.6"/>
  <!-- Right claw pincer -->
  <path d="M276 8 Q286 14 288 28 Q288 40 278 44 Q268 46 262 38 Q256 30 260 20" stroke-width="1.4"/>
  <path d="M278 10 Q284 20 282 30" stroke-width="0.8" stroke-opacity="0.5"/>
  <!-- Right claw detail -->
  <path d="M256 34 Q264 26 270 28 Q276 32 274 38" stroke-width="1.1"/>

  <!-- LEGS — 4 pairs (8 legs total) -->
  <!-- Left legs -->
  <path d="M112 76 Q86 80 60 72 Q40 66 28 52" stroke-width="1.2"/>
  <path d="M110 88 Q82 96 56 90 Q36 84 24 70" stroke-width="1.2"/>
  <path d="M112 100 Q84 112 60 108 Q40 104 28 90" stroke-width="1.2"/>
  <path d="M116 112 Q90 126 66 124 Q46 122 34 108" stroke-width="1.2"/>
  <!-- Right legs -->
  <path d="M188 76 Q214 80 240 72 Q260 66 272 52" stroke-width="1.2"/>
  <path d="M190 88 Q218 96 244 90 Q264 84 276 70" stroke-width="1.2"/>
  <path d="M188 100 Q216 112 240 108 Q260 104 272 90" stroke-width="1.2"/>
  <path d="M184 112 Q210 126 234 124 Q254 122 266 108" stroke-width="1.2"/>
  <!-- Leg spines/bristles -->
  <path d="M50 74 L44 68 M58 86 L52 80 M56 102 L50 96" stroke-width="0.6" stroke-opacity="0.5"/>
  <path d="M250 74 L256 68 M242 86 L248 80 M244 102 L250 96" stroke-width="0.6" stroke-opacity="0.5"/>

  <!-- ABDOMEN — 7 segments getting narrower -->
  <ellipse cx="150" cy="128" rx="36" ry="22" stroke-width="1.6"/>
  <ellipse cx="150" cy="128" rx="36" ry="22" fill="url(#sh)" stroke="none"/>
  <ellipse cx="150" cy="162" rx="30" ry="19" stroke-width="1.5"/>
  <ellipse cx="150" cy="194" rx="24" ry="16" stroke-width="1.4"/>
  <ellipse cx="150" cy="222" rx="19" ry="13" stroke-width="1.3"/>
  <ellipse cx="150" cy="246" rx="14" ry="10" stroke-width="1.2"/>
  <ellipse cx="148" cy="268" rx="10" ry="8"  stroke-width="1.1"/>
  <ellipse cx="144" cy="286" rx="7"  rx="7" ry="6"  stroke-width="1.0"/>
  <!-- Abdominal segment dividers -->
  <path d="M116 118 Q150 112 184 118" stroke-width="0.8" stroke-opacity="0.5"/>
  <path d="M122 150 Q150 144 178 150" stroke-width="0.8" stroke-opacity="0.45"/>
  <path d="M128 182 Q150 176 172 182" stroke-width="0.8" stroke-opacity="0.42"/>
  <path d="M132 210 Q150 204 168 210" stroke-width="0.8" stroke-opacity="0.40"/>
  <path d="M134 234 Q150 228 166 234" stroke-width="0.8" stroke-opacity="0.38"/>
  <!-- Abdominal keel line -->
  <line x1="150" y1="106" x2="148" y2="288" stroke-width="0.7" stroke-opacity="0.40"/>

  <!-- TAIL — 5 metasomal segments curving up and over -->
  <path d="M144 290 Q132 310 126 334 Q120 358 126 378 Q134 396 150 400 Q168 402 178 388 Q188 372 182 352 Q176 332 164 314 Q158 302 152 292" stroke-width="1.8"/>
  <!-- Tail segment rings -->
  <path d="M138 302 Q148 298 158 302" stroke-width="1.0" stroke-opacity="0.6"/>
  <path d="M132 318 Q148 314 162 318" stroke-width="1.0" stroke-opacity="0.58"/>
  <path d="M126 336 Q146 332 162 338" stroke-width="1.0" stroke-opacity="0.55"/>
  <path d="M126 356 Q148 354 168 358" stroke-width="1.0" stroke-opacity="0.52"/>
  <path d="M130 374 Q152 374 172 376" stroke-width="1.0" stroke-opacity="0.50"/>
  <!-- TELSON — the stinger bulb and needle -->
  <ellipse cx="158" cy="390" rx="14" ry="18" stroke-width="1.5"/>
  <ellipse cx="158" cy="390" rx="14" ry="18" fill="url(#sh)" stroke="none"/>
  <path d="M152 406 Q158 420 162 406" stroke-width="1.4"/>
  <!-- Stinger point -->
  <path d="M157 420 Q158 428 159 420" stroke-width="1.2"/>
  <!-- Venom droplet -->
  <circle cx="158" cy="428" r="3" fill="rgba(255,180,180,0.35)" stroke-width="0.9"/>

  <!-- Antares star — heart of the scorpion -->
  <circle cx="150" cy="96" r="10" fill="rgba(255,140,100,0.25)" stroke-width="1.2" stroke="rgba(255,160,120,0.8)"/>
  <circle cx="150" cy="96" r="5" fill="rgba(255,160,120,0.45)" stroke="none"/>

</g></svg>`,

  // AQUARIUS — The Water Bearer
  aquarius: `<svg viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg">
<defs>
  <pattern id="aqh" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(180,255,220,0.24)" stroke-width="0.8"/>
  </pattern>
  <pattern id="aqh2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(180,255,220,0.16)" stroke-width="0.7"/>
  </pattern>
</defs>
<g fill="none" stroke="rgba(180,255,220,0.90)" stroke-linecap="round" stroke-linejoin="round">

  <!-- Head with headdress -->
  <ellipse cx="130" cy="34" rx="20" ry="23" stroke-width="1.4"/>
  <!-- Headdress — nemesis cloth / nemes -->
  <path d="M110 28 Q106 16 114 8 Q122 2 130 4 Q138 2 146 8 Q154 16 150 28" stroke-width="1.2"/>
  <path d="M110 28 Q104 36 102 50 Q100 64 106 76" stroke-width="1.1"/>
  <path d="M150 28 Q156 36 158 50 Q160 64 154 76" stroke-width="1.1"/>
  <!-- Headdress stripes -->
  <path d="M104 40 Q116 36 128 38 M104 48 Q116 44 128 46 M104 56 Q116 52 128 54 M104 64 Q116 60 128 62" stroke-width="0.65" stroke-opacity="0.45"/>
  <path d="M132 38 Q144 36 156 40 M132 46 Q144 44 156 48 M132 54 Q144 52 156 56 M132 62 Q144 60 156 64" stroke-width="0.65" stroke-opacity="0.45"/>
  <!-- Headdress top ornament -->
  <path d="M118 4 L116 -4 M130 2 L130 -6 M142 4 L144 -4" stroke-width="0.9"/>
  <circle cx="130" cy="-6" r="4" fill="rgba(180,255,220,0.30)" stroke-width="1.0"/>
  <!-- Face -->
  <path d="M120 30 Q123 27 126 30" stroke-width="0.9"/>
  <path d="M134 30 Q137 27 140 30" stroke-width="0.9"/>
  <path d="M124 38 Q130 42 136 38" stroke-width="1.0"/>
  <!-- Beard (traditional water god) -->
  <path d="M118 44 Q120 54 122 64 M124 46 Q126 56 126 68 M130 46 Q130 58 130 70 M136 46 Q136 56 136 68 M142 44 Q140 54 138 64" stroke-width="0.7" stroke-opacity="0.50"/>
  <path d="M116 66 Q130 72 144 66" stroke-width="0.9" stroke-opacity="0.55"/>

  <!-- Neck -->
  <line x1="123" y1="55" x2="120" y2="66" stroke-width="1.0"/>
  <line x1="137" y1="55" x2="140" y2="66" stroke-width="1.0"/>

  <!-- Upper body / robes -->
  <path d="M88 74 Q108 64 130 62 Q152 64 172 74 L176 190 Q158 200 130 200 Q102 200 84 190 Z" stroke-width="1.6"/>
  <path d="M88 74 Q108 64 130 62 Q152 64 172 74 L176 190 Q158 200 130 200 Q102 200 84 190 Z" fill="url(#aqh)" stroke="none"/>
  <path d="M88 74 Q108 64 130 62 Q152 64 172 74 L176 190 Q158 200 130 200 Q102 200 84 190 Z" fill="url(#aqh2)" stroke="none"/>
  <!-- Robe folds -->
  <path d="M94 92 Q130 86 166 92" stroke-width="0.7" stroke-opacity="0.45"/>
  <path d="M90 112 Q130 106 170 112" stroke-width="0.7" stroke-opacity="0.42"/>
  <path d="M88 132 Q130 126 172 132" stroke-width="0.7" stroke-opacity="0.40"/>
  <path d="M88 152 Q130 146 172 152" stroke-width="0.7" stroke-opacity="0.38"/>
  <path d="M88 172 Q130 166 172 172" stroke-width="0.7" stroke-opacity="0.35"/>

  <!-- Left arm — extended, holding/pouring amphora -->
  <path d="M88 78 Q70 74 54 64 Q40 54 34 40 Q30 28 36 20 Q44 14 54 20 Q62 28 60 44 Q60 58 72 70" stroke-width="1.4"/>

  <!-- Amphora / water jug -->
  <!-- Jug neck -->
  <path d="M28 16 Q22 8 18 0 Q14 -8 20 -14 Q28 -18 36 -12 Q42 -4 38 8 Q36 16 30 18" stroke-width="1.3"/>
  <!-- Jug body -->
  <path d="M14 -4 Q4 4 2 20 Q0 38 8 52 Q16 64 28 68 Q42 70 52 60 Q62 50 60 36 Q58 18 48 8 Q40 0 30 -2 Q22 -4 16 0" stroke-width="1.5"/>
  <path d="M14 -4 Q4 4 2 20 Q0 38 8 52 Q16 64 28 68 Q42 70 52 60 Q62 50 60 36 Q58 18 48 8 Q40 0 30 -2 Q22 -4 16 0" fill="url(#aqh)" stroke="none"/>
  <!-- Jug handle -->
  <path d="M8 20 Q-4 26 -2 42 Q0 56 12 58" stroke-width="1.2"/>
  <!-- Jug horizontal bands -->
  <path d="M4 24 Q30 18 56 26 M2 36 Q28 30 58 38 M4 48 Q28 42 56 52" stroke-width="0.65" stroke-opacity="0.45"/>
  <!-- Jug base -->
  <path d="M12 64 Q28 70 44 66 L46 72 Q28 78 14 72 Z" stroke-width="1.1"/>

  <!-- WATER STREAMS pouring out -->
  <!-- Stream 1 -->
  <path d="M6 -6 Q-2 14 4 34 Q10 54 2 74 Q-4 94 4 114 Q10 134 4 154 Q-2 174 8 194" stroke-width="1.4" stroke-opacity="0.85"/>
  <!-- Stream 2 -->
  <path d="M16 -12 Q8 10 14 32 Q20 54 12 76 Q4 98 14 118 Q22 138 14 160 Q6 180 16 200" stroke-width="1.2" stroke-opacity="0.75"/>
  <!-- Stream 3 -->
  <path d="M26 -14 Q20 8 26 30 Q32 52 24 74 Q16 96 26 116 Q34 136 28 158 Q22 178 30 198" stroke-width="1.0" stroke-opacity="0.65"/>
  <!-- Stream wave highlights -->
  <path d="M1 30 Q6 26 11 30 M1 60 Q6 56 11 60 M1 90 Q6 86 11 90 M1 120 Q6 116 11 120 M1 150 Q6 146 11 150" stroke-width="0.6" stroke-opacity="0.45"/>

  <!-- Right arm -->
  <path d="M172 78 Q190 80 206 88 Q218 96 222 110 Q224 122 216 128 Q206 132 198 124 Q190 116 192 100" stroke-width="1.4"/>

  <!-- Lower robe / seated or kneeling posture -->
  <path d="M84 192 Q130 206 176 192 L180 320 Q158 334 130 334 Q102 334 80 320 Z" stroke-width="1.5"/>
  <path d="M84 192 Q130 206 176 192 L180 320 Q158 334 130 334 Q102 334 80 320 Z" fill="url(#aqh)" stroke="none"/>
  <!-- Lower robe folds -->
  <path d="M86 212 Q130 206 174 212" stroke-width="0.7" stroke-opacity="0.40"/>
  <path d="M84 236 Q130 230 176 236" stroke-width="0.7" stroke-opacity="0.38"/>
  <path d="M82 260 Q130 254 178 260" stroke-width="0.7" stroke-opacity="0.36"/>
  <path d="M80 284 Q130 278 180 284" stroke-width="0.7" stroke-opacity="0.34"/>
  <path d="M80 306 Q130 300 180 306" stroke-width="0.7" stroke-opacity="0.32"/>
  <!-- Hem -->
  <path d="M82 318 Q130 328 178 318" stroke-width="1.1"/>
  <!-- Feet/sandals peek below -->
  <path d="M102 328 Q96 338 88 344 Q80 348 76 344 Q72 338 78 334" stroke-width="1.1"/>
  <path d="M158 328 Q164 338 172 344 Q180 348 184 344 Q188 338 182 334" stroke-width="1.1"/>
  <!-- Sandal straps -->
  <path d="M78 336 Q90 340 100 336 M78 342 Q90 346 100 342" stroke-width="0.6" stroke-opacity="0.45"/>
  <path d="M182 336 Q170 340 160 336 M182 342 Q170 346 160 342" stroke-width="0.6" stroke-opacity="0.45"/>

  <!-- Decorative collar / necklace -->
  <path d="M106 68 Q130 76 154 68" stroke-width="1.0" stroke-opacity="0.70"/>
  <path d="M110 72 Q130 80 150 72" stroke-width="0.7" stroke-opacity="0.50"/>
  <!-- Collar gems -->
  <circle cx="120" cy="70" r="2.5" fill="rgba(180,255,220,0.38)"/>
  <circle cx="130" cy="73" r="3" fill="rgba(180,255,220,0.42)"/>
  <circle cx="140" cy="70" r="2.5" fill="rgba(180,255,220,0.38)"/>

</g></svg>`
};
