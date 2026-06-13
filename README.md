# Chanson Tang — Portfolio

An interactive personal portfolio with a galaxy/constellation theme. Built with Three.js, GSAP, and Canvas 2D.

**Live site:** [chanchantang.github.io](https://chanchantang.github.io)

## Tech Stack

- [Three.js](https://threejs.org/) — 3D starfield and WebGL rendering
- [GSAP](https://gsap.com/) — panel zoom animations
- Canvas 2D API — constellations, earth scene, cursor trail, warp effect
- [Vite](https://vitejs.dev/) — dev server and build tool

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Project Structure

```
├── index.html
├── src/
│   ├── main.js          # Core animation loop, scroll logic, interactions
│   ├── hero.js          # Hero mountain scene
│   ├── constellations.js # Constellation star data and SVG illustrations
│   ├── panels.js        # Panel content (About, Experience, Projects, Skills, Contact)
│   ├── audio.js         # Ambient audio engine
│   ├── starfield.js     # Three.js star particles
│   ├── figures.js       # 3D constellation figure models
│   └── style.css        # All styles
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Pages deployment
```
