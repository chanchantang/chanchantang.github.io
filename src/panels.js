export const PANEL_CONTENT = {
  orion: `
    <h2>Projects</h2>
    <span class="panel-constellation">✦ Orion · The Hunter</span>
    <div class="project-card">
      <h3>Drip</h3>
      <p class="stack">Swift · Python · PostgreSQL · PyTorch · OpenCV · MediaPipe · Docker</p>
      <p>Full-stack clothing management platform that automatically removes backgrounds from garment photos
         and organises items into a searchable digital wardrobe. Implemented computer vision pipelines for
         clothing segmentation, metadata extraction, and outfit recommendation using AI image embeddings.
         Deployed AWS inference services for image processing and AI-powered outfit generation.</p>
    </div>
    <div class="project-card">
      <h3>Wall-E Discord Bot</h3>
      <p class="stack">Python · Discord.py · Jenkins</p>
      <p>Maintains a 10K+ member community bot with commands for course lookups via the SFU API,
         improving user query speed by 70%. Refactored core components to Flake8 and DRY standards,
         improving long-term maintainability.</p>
    </div>
    <div class="project-card">
      <h3>Personal Portfolio</h3>
      <p class="stack">Three.js · GSAP · Canvas 2D · JavaScript</p>
      <p>This website. Interactive portfolio with a galaxy/constellation theme, custom cursor trail,
         warp-speed page transitions, and an animated earth scene with aurora, bioluminescence,
         and shooting stars. Built with full mobile support.</p>
    </div>
    <div class="project-card">
      <h3>GestureGenius</h3>
      <p class="stack">Python · MediaPipe · OpenCV · TensorFlow · Unity</p>
      <p>Real-time social-signal recognition system for classroom interaction. Trained an LSTM classifier
         achieving 92% cross-validation accuracy, deployed in a Unity agent for live feedback.
         Reduced inference latency to 50 ms/frame for smooth virtual-agent responses.</p>
    </div>
  `,

  taurus: `
    <h2>About Me</h2>
    <span class="panel-constellation">✦ Taurus · The Bull</span>
    <p>Hi — I'm Chanson, a software engineer based in Vancouver, BC, finishing my B.Sc. in Computer Science
       at Simon Fraser University (graduating 2026).</p>
    <p>I enjoy working across the full stack — from Python ETL pipelines and REST APIs to React frontends
       and computer vision systems. I've shipped production code at both a health-tech startup and a
       hospitality SaaS company, and I like building things that are fast, reliable, and actually useful.</p>
    <p>Outside of work I've been playing floor hockey for 10+ years and picked up volleyball about 3 years
       ago — both keep me sane. I also tinker with ML projects, contribute to community tools, and spend
       too much time tweaking my dev setup. The galaxy theme felt fitting — I've always been drawn to
       the scale of things.</p>
  `,

  lyra: `
    <h2>Skills</h2>
    <span class="panel-constellation">✦ Lyra · The Lyre</span>
    <div class="skill-grid">
      <div class="skill-tag">Python</div>
      <div class="skill-tag">Java</div>
      <div class="skill-tag">C#</div>
      <div class="skill-tag">JavaScript</div>
      <div class="skill-tag">SQL</div>
      <div class="skill-tag">C / C++</div>
      <div class="skill-tag">React</div>
      <div class="skill-tag">Electron</div>
      <div class="skill-tag">Node.js</div>
      <div class="skill-tag">Express</div>
      <div class="skill-tag">PostgreSQL</div>
      <div class="skill-tag">MongoDB</div>
      <div class="skill-tag">Docker</div>
      <div class="skill-tag">Git</div>
      <div class="skill-tag">Prefect</div>
      <div class="skill-tag">TensorFlow</div>
      <div class="skill-tag">MediaPipe</div>
      <div class="skill-tag">OpenCV</div>
      <div class="skill-tag">OpenAI API</div>
      <div class="skill-tag">GitHub Actions</div>
      <div class="skill-tag">Qt</div>
      <div class="skill-tag">MATLAB</div>
    </div>
  `,

  scorpius: `
    <h2>Experience</h2>
    <span class="panel-constellation">✦ Scorpius · The Scorpion</span>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-left">
          <div class="tl-dot"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-content">
          <div class="tl-date">Jan 2025 – Sept 2025</div>
          <h3 class="tl-role">Junior Full Stack Developer</h3>
          <div class="tl-org">Operto Guest Technologies · Vancouver, BC</div>
          <p>Built a Prefect ETL pipeline transferring data from Amazon S3 to a centralized repository,
             increasing throughput by 30% and cutting memory usage by 25%. Automated user onboarding and
             churn workflows, reducing setup time by 70%. Developed C integrations between Operto One and
             hotel management platforms, and added reservation-import support for new PMS clients via Java
             and REST APIs.</p>
        </div>
      </div>
      <div class="tl-item tl-last">
        <div class="tl-left">
          <div class="tl-dot"></div>
        </div>
        <div class="tl-content">
          <div class="tl-date">May 2022 – Apr 2023</div>
          <h3 class="tl-role">Software Engineer</h3>
          <div class="tl-org">Voronoi Health Analytics · Vancouver, BC</div>
          <p>Developed an Electron-based medical imaging application with a Qt front-end, delivering a 40%
             faster analysis workflow for clinicians. Engineered a TCP communication layer between Qt/C++ and
             JavaScript, reducing data-fetch latency. Refactored legacy C++ tooling into Python scripts and
             created MATLAB validation scripts that brought test coverage to 95%.</p>
        </div>
      </div>
    </div>
  `,

  aquarius: `
    <h2>Contact</h2>
    <span class="panel-constellation">✦ Aquarius · The Water Bearer</span>
    <p>Whether it's a job opportunity, a side-project collaboration, or just a good conversation
       about full-stack dev or computer vision — I'd love to hear from you.</p>
    <a class="contact-link" href="mailto:chansonltang@hotmail.com">
      <span class="link-icon">✉</span>
      chansonltang@hotmail.com
    </a>
    <a class="contact-link" href="https://github.com/chanchantang" target="_blank" rel="noopener">
      <span class="link-icon">⌥</span>
      github.com/chanchantang
    </a>
    <a class="contact-link" href="https://linkedin.com/in/chansontang" target="_blank" rel="noopener">
      <span class="link-icon">in</span>
      linkedin.com/in/chansontang
    </a>
    <a class="contact-link" href="/resume.pdf" download>
      <span class="link-icon">↗</span>
      Resume — PDF
    </a>
  `
};
