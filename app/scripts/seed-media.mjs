// One-off generator for clearly-labeled placeholder seed media (committed).
// Replaced by real assets via the CMS media library.
import { writeFileSync, mkdirSync } from 'node:fs';

const C = {
  yellow: '#ffde59',
  pink: '#ff1fa9',
  red: '#d62839',
  black: '#000000',
  charcoal: '#17130f',
  cream: '#f7f2e7',
  white: '#ffffff',
};

const poster = (
  name,
  label,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280" role="img">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.charcoal}"/><stop offset="1" stop-color="${C.red}"/>
  </linearGradient></defs>
  <rect width="720" height="1280" fill="url(#g)"/>
  <circle cx="540" cy="260" r="190" fill="${C.pink}" opacity="0.85"/>
  <circle cx="150" cy="1010" r="230" fill="${C.yellow}" opacity="0.9"/>
  <text x="48" y="640" font-family="Georgia, serif" font-size="86" fill="${C.white}">${label}</text>
  <text x="48" y="700" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="6" fill="${C.yellow}">PLACEHOLDER POSTER</text>
  <text x="48" y="1220" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${C.cream}" opacity="0.8">${name} — replace via the CMS</text>
</svg>`;

const pic = (
  name,
  label,
  bg,
  fg,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" role="img">
  <rect width="800" height="1000" fill="${bg}"/>
  <circle cx="400" cy="420" r="260" fill="${fg}" opacity="0.25"/>
  <circle cx="400" cy="420" r="180" fill="${fg}" opacity="0.35"/>
  <text x="50" y="800" font-family="Georgia, serif" font-size="64" fill="${fg}">${label}</text>
  <text x="50" y="850" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="5" fill="${fg}" opacity="0.75">PLACEHOLDER IMAGE</text>
  <text x="50" y="950" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${fg}" opacity="0.6">${name} — replace via the CMS</text>
</svg>`;

const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" role="img">
  <rect width="800" height="1000" fill="${C.yellow}"/>
  <circle cx="400" cy="380" r="230" fill="${C.charcoal}"/>
  <circle cx="400" cy="330" r="86" fill="${C.cream}"/>
  <path d="M170 820 q230 -190 460 0 v180 h-460 z" fill="${C.pink}"/>
  <rect x="0" y="800" width="800" height="200" fill="${C.red}" opacity="0.12"/>
  <text x="60" y="120" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="8" fill="${C.charcoal}">PLACEHOLDER ARTWORK</text>
  <text x="60" y="960" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${C.charcoal}" opacity="0.7">Hero portrait — replace via the CMS</text>
</svg>`;

const about = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img">
  <rect width="800" height="800" fill="${C.charcoal}"/>
  <circle cx="400" cy="330" r="190" fill="${C.pink}" opacity="0.9"/>
  <circle cx="400" cy="300" r="70" fill="${C.cream}"/>
  <path d="M140 690 q260 -200 520 0 v110 h-520 z" fill="${C.yellow}"/>
  <text x="60" y="770" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${C.cream}" opacity="0.6">About portrait — replace via the CMS</text>
  <text x="60" y="90" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="8" fill="${C.cream}" opacity="0.8">PLACEHOLDER</text>
</svg>`;

mkdirSync('src/assets/media/posters', { recursive: true });
mkdirSync('src/assets/media/gallery', { recursive: true });
const posters = [
  ['lemon-potatoes', 'Lemon Potatoes'],
  ['village-salad', 'Village Salad'],
  ['baklava', 'Baklava'],
  ['souvlaki', 'Souvlaki'],
  ['moussaka', 'Moussaka'],
  ['tsoureki', 'Tsoureki'],
];
for (const [slug, label] of posters)
  writeFileSync(`src/assets/media/posters/${slug}.svg`, poster(slug, label));

const pics = [
  ['sunset-dinner', 'Sunset Dinner', C.charcoal, C.yellow],
  ['seafood-platter', 'Seafood Platter', C.red, C.cream],
  ['fig-harvest', 'Fig Harvest', C.charcoal, C.pink],
  ['fresh-herbs', 'Fresh Herbs', C.cream, C.charcoal],
  ['olive-grove', 'Olive Grove', C.red, C.yellow],
  ['prep-session', 'Prep Session', C.cream, C.pink],
];
for (const [slug, label, bg, fg] of pics)
  writeFileSync(`src/assets/media/gallery/${slug}.svg`, pic(slug, label, bg, fg));

writeFileSync('src/assets/media/hero.svg', hero);
writeFileSync('src/assets/media/about.svg', about);
console.log('SVG seeds written');
