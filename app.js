// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== TERMINAL TYPEWRITER =====
const lines = [
  'AI Engineer · Python · LLMs · Agentic Systems · Unity/C#',
  'Building LLMs · RAG · Computer Vision',
  'Open to exciting opportunities →',
];
let lineIdx = 0, charIdx = 0, deleting = false, pause = 0;
const termEl = document.getElementById('terminalText');
function typeWriter() {
  if (pause > 0) { pause--; setTimeout(typeWriter, 50); return; }
  const line = lines[lineIdx];
  if (!deleting) {
    charIdx++;
    termEl.textContent = line.slice(0, charIdx);
    if (charIdx === line.length) { deleting = true; pause = 40; }
    setTimeout(typeWriter, 55);
  } else {
    charIdx--;
    termEl.textContent = line.slice(0, charIdx);
    if (charIdx === 0) { deleting = false; lineIdx = (lineIdx + 1) % lines.length; pause = 8; }
    setTimeout(typeWriter, 28);
  }
}
typeWriter();

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], mouse = { x: -1000, y: -1000 };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    // mouse repulsion
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      this.x += dx / dist * 1.2;
      this.y += dy / dist * 1.2;
    }
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99,102,241,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((W * H) / 8000), 160);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}
animate();

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger sibling reveals
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      let delay = 0;
      siblings.forEach(s => {
        if (s === entry.target || s.getBoundingClientRect().top < window.innerHeight) {
          setTimeout(() => s.classList.add('visible'), delay);
          delay += 80;
        }
      });
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
}, { passive: true });
