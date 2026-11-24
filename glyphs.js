// Glyph hover zones, measured from the Figma frames (coordinates in the 2132 × 3000 frame space).
// Hover spec from Figma frame "ON HOVER EXAMPLE": glyph grows 388 → 606 px (×1.5619),
// anchored near its lower-left (origin 21% 88%), and its number turns red (#ff0000).
const FRAME_W = 2132, FRAME_H = 3000;

const NAMES = ['', 'Akai','Avoiuli (Vanuatu)','Bedifeera','Kaidā','Kokborok','Lampung','Loma','Naoriya Phulo','Ranjana','Zungkayu',
  'Gar','Shaaldaa (Oromo)','Dongba (Naxi)','Naxi Geba','Abkhaz-Kabardian','Lontara Bilang-Bilang','Lontara coda marks','Kamarupi (Assamese)',
  'Tulu-Tigalari','Syloti Nagri digits',"N'Ko",'Arabic (Ingush letter)','Cyrillic','Greek','Latin (Zulu click letter)','Bopomofo (Formosan)',
  'Kana','Korean (DPRK 1948–54 orthography)','Telugu','Thai','Malayalam','North Korean symbols (KPS 9566)','Book Pahlavi','Bronze script',
  'Oracle bone script','Silk script','Slip script','Khitan large script','Indus script','Rongorongo','Maya','Aztec','Urartian','Counting rods',
  'Phaistos disc','Pentadic runes','Blissymbols','Coelbren y Beirdd','Tengwar','LoCos','Sitelen Sitelen','Toki Pona (sitelen pona)','Theban',
  'Ygyde','Standard Galactic','Visible Speech','Tramp signs','Irony mark','Love mark','Acclamation mark','Authority mark','Conviction mark',
  'Doubt mark','Indignation mark','Exclamation comma'];

function grid({ xs, ys, size, numGap, numSize, numBox, labels }) {
  const out = []; let i = 0;
  for (const y of ys) for (const x of xs) {
    if (i >= labels.length) break;
    out.push({ label: labels[i++], x, y, size, nx: x, ny: y + numGap, numSize, numBox });
  }
  return out;
}
const range = (a, b, pre = '') => Array.from({ length: b - a + 1 }, (_, k) => pre + (a + k));
const big = { size: 388, numGap: 396, numSize: 28, numBox: 35 };
const small = { size: 164, numGap: 170, numSize: 22, numBox: 27 };
const xs4a = [140, 608, 1076, 1544], xs4b = [120, 588, 1056, 1524];
const xs8a = Array.from({ length: 8 }, (_, i) => 140 + 234 * i), xs8b = Array.from({ length: 8 }, (_, i) => 120 + 234 * i);
const pad2 = n => String(n).padStart(2, '0');

const GLYPHS = {
  C: grid({ ...big, xs: xs4a, ys: [364, 993, 1622, 2251], labels: range(1, 16) }),
  D: grid({ ...big, xs: xs4b, ys: [364, 993, 1622, 2251], labels: range(17, 32) }),
  E: grid({ ...big, xs: xs4a, ys: [364, 867, 1370, 1874], labels: range(33, 46) }),
  F: grid({ ...big, xs: xs4b, ys: [364, 867, 1370, 1874, 2377], labels: range(47, 65) }),
  G: grid({ ...small, xs: xs8a, ys: [364, 616, 867, 1119, 1370, 1622, 1874, 2125, 2377, 2628], labels: range(1, 75, 'C') }),
  H: grid({ ...small, xs: xs8b, ys: [402, 650, 898, 1145, 1393, 1641, 1889, 2137, 2384, 2632], labels: range(76, 150, 'C') }),
};
const BG = { C: '#ff6543', D: '#ff6543', E: '#f7ff00', F: '#f7ff00', G: '#ff6543', H: '#ff6543' };

function addGlyphHovers(section, id) {
  const list = GLYPHS[id]; if (!list) return;
  const pct = (v, total) => (v / total * 100) + '%';
  const layer = document.createElement('div'); layer.className = 'glyphs';
  layer.style.setProperty('--bg', BG[id]);
  for (const g of list) {
    const isNum = /^\d+$/.test(g.label);
    const shown = isNum ? pad2(g.label) : (g.label.length < 3 ? 'C0' + g.label.slice(1) : g.label);
    const name = isNum ? NAMES[+g.label] : 'Chinese character ' + g.label;
    const el = document.createElement('div');
    el.className = 'glyph'; el.tabIndex = 0; el.setAttribute('role', 'img'); el.setAttribute('aria-label', `${shown}: ${name}`);
    el.title = `${shown} · ${name}`;
    // hit area covers glyph + number
    Object.assign(el.style, { left: pct(g.x, FRAME_W), top: pct(g.y, FRAME_H), width: pct(g.size, FRAME_W),
                              height: pct(g.ny + g.numBox - g.y, FRAME_H) });
    const z = document.createElement('div'); z.className = 'zoom';
    Object.assign(z.style, {
      height: (g.size / (g.ny + g.numBox - g.y) * 100) + '%',
      backgroundImage: `url(frames/${id}.webp)`,
      backgroundSize: `${FRAME_W / g.size * 100}% ${FRAME_H / g.size * 100}%`,
      backgroundPosition: `${g.x / (FRAME_W - g.size) * 100}% ${g.y / (FRAME_H - g.size) * 100}%`,
    });
    const n = document.createElement('span'); n.className = 'num'; n.textContent = shown;
    Object.assign(n.style, { top: ((g.ny - g.y) / (g.ny + g.numBox - g.y) * 100) + '%',
                             fontSize: `calc(${g.numSize / FRAME_W * 100} * var(--cq))`, lineHeight: (g.numBox / g.numSize) });
    // cover hides the original glyph underneath while the enlarged one is shown
    const c = document.createElement('div'); c.className = 'cover'; c.style.height = z.style.height;
    el.append(c, z, n); layer.appendChild(el);
  }
  section.appendChild(layer);
}
