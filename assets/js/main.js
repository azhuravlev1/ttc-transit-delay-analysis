import { initPaper } from './reader.js';

initPaper({ pdf: 'paper/TTC_Delay_Analysis_Report.pdf', meta: '4.4 MB' });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mode tabs: swap figure image and caption ---------- */
document.querySelectorAll('[data-tabfig]').forEach((fig) => {
  const img = fig.querySelector('.tab-img img');
  const cap = fig.querySelector('figcaption');
  const tabs = fig.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-selected') === 'true') return;
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      const next = new Image();
      next.src = tab.dataset.src;
      img.classList.add('fading');
      const swap = () => {
        img.src = tab.dataset.src;
        cap.textContent = tab.dataset.caption;
        requestAnimationFrame(() => img.classList.remove('fading'));
      };
      const ready = next.decode ? next.decode().catch(() => {}) : Promise.resolve();
      Promise.all([ready, new Promise((r) => setTimeout(r, reduceMotion ? 0 : 200))]).then(swap);
    });
  });
});

/* ---------- strip map: active station + train position ---------- */
const stations = [...document.querySelectorAll('.stn')];
const sections = stations.map((s) => document.getElementById(s.dataset.target));
const train = document.getElementById('train');
const progress = document.getElementById('stripProgress');
const stripLine = document.querySelector('.strip-line');

function updateStrip() {
  const probe = window.scrollY + window.innerHeight * 0.35;
  let idx = -1;
  let frac = 0;
  sections.forEach((sec, i) => {
    const top = sec.offsetTop;
    if (probe >= top) {
      idx = i;
      const next = sections[i + 1];
      const end = next ? next.offsetTop : top + sec.offsetHeight;
      frac = Math.min(1, (probe - top) / Math.max(1, end - top));
    }
  });
  stations.forEach((s, i) => s.classList.toggle('active', i === idx));
  const lineBox = stripLine.getBoundingClientRect();
  const innerBox = stripLine.parentElement.getBoundingClientRect();
  const xs = stations.map((s) => {
    const b = s.querySelector('i').getBoundingClientRect();
    return b.left + b.width / 2 - innerBox.left;
  });
  let x;
  if (idx < 0) x = xs[0];
  else if (idx >= xs.length - 1) x = xs[xs.length - 1];
  else x = xs[idx] + (xs[idx + 1] - xs[idx]) * frac;
  train.style.left = `${x}px`;
  progress.style.width = `${Math.max(0, x - (lineBox.left - innerBox.left))}px`;
}
window.addEventListener('scroll', updateStrip, { passive: true });
window.addEventListener('resize', updateStrip);
updateStrip();

/* ---------- 658 vs 70 dot grids ---------- */
function fillDots(id, n, green) {
  const el = document.getElementById(id);
  if (!el) return;
  if (green) el.classList.add('green');
  el.innerHTML = '<i></i>'.repeat(n);
  return el;
}
const raw = fillDots('dotsRaw', 658, false);
const real = fillDots('dotsReal', 70, true);
const dotIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    dotIO.unobserve(e.target);
    const dots = [...e.target.querySelectorAll('i')];
    if (reduceMotion) { e.target.classList.add('show'); return; }
    dots.forEach((d, i) => { d.style.transitionDelay = `${Math.min(i * 2, 1200)}ms`; });
    requestAnimationFrame(() => e.target.classList.add('show'));
  });
}, { threshold: 0.3 });
[raw, real].forEach((el) => el && dotIO.observe(el));

/* ---------- reveal sections ---------- */
const reveal = document.querySelectorAll('.section');
if (!reduceMotion && 'IntersectionObserver' in window) {
  reveal.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveal.forEach((el) => io.observe(el));
}
