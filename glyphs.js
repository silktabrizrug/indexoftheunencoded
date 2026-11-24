// Glyph hover zones, measured from the 1440 × 900 desktop frames in Figma (page "Page 2").
// Hover spec from Figma frame "ON HOVER EXAMPLE": the glyph grows ×1.5619, anchored near its
// lower-left (origin 21% 88%), and its number turns red (#ff0000).
const FRAME_W = 1440, FRAME_H = 900;

const NAMES = ['', 'Akai','Avoiuli (Vanuatu)','Bedifeera','Kaidā','Kokborok','Lampung','Loma','Naoriya Phulo','Ranjana','Zungkayu',
  'Gar','Shaaldaa (Oromo)','Dongba (Naxi)','Naxi Geba','Abkhaz-Kabardian','Lontara Bilang-Bilang','Lontara coda marks','Kamarupi (Assamese)',
  'Tulu-Tigalari','Syloti Nagri digits',"N'Ko",'Arabic (Ingush letter)','Cyrillic','Greek','Latin (Zulu click letter)','Bopomofo (Formosan)',
  'Kana','Korean (DPRK 1948–54 orthography)','Telugu','Thai','Malayalam','North Korean symbols (KPS 9566)','Book Pahlavi','Bronze script',
  'Oracle bone script','Silk script','Slip script','Khitan large script','Indus script','Rongorongo','Maya','Aztec','Urartian','Counting rods',
  'Phaistos disc','Pentadic runes','Blissymbols','Coelbren y Beirdd','Tengwar','LoCos','Sitelen Sitelen','Toki Pona (sitelen pona)','Theban',
  'Ygyde','Standard Galactic','Visible Speech','Tramp signs','Irony mark','Love mark','Acclamation mark','Authority mark','Conviction mark',
  'Doubt mark','Indignation mark','Exclamation comma'];

// Each grid: first glyph at (56, ys[row]), columns `step` apart; number sits `numGap` below the glyph top.
function grid({ step, cols, ys, size, numGap, numSize, numBox, labels }) {
  return labels.map((label, i) => {
    const x = 56 + (i % cols) * step, y = ys[Math.floor(i / cols)];
    return { label, x, y, size, nx: x, ny: y + numGap, numSize, numBox };
  });
}
const range = (a, b, pre = '') => Array.from({ length: b - a + 1 }, (_, k) => pre + (a + k));
const pad2 = n => String(n).padStart(2, '0');
const big = { numSize: 13, numBox: 16 }, small = { numSize: 11, numBox: 13 };

const GLYPHS = {
  C: grid({ ...big, step: 226, cols: 6, ys: [154, 391, 628], size: 198, numGap: 202, labels: range(1, 16) }),
  D: grid({ ...big, step: 226, cols: 6, ys: [154, 391, 628], size: 198, numGap: 202, labels: range(17, 32) }),
  E: grid({ ...big, step: 227, cols: 5, ys: [154, 392, 630], size: 199, numGap: 203, labels: range(33, 46) }),
  F: grid({ ...big, step: 193, cols: 7, ys: [154, 358, 562], size: 165, numGap: 169, labels: range(47, 65) }),
  G: grid({ ...small, step: 103, cols: 13, ys: [154, 271, 388, 505, 622, 739], size: 89, numGap: 93, labels: range(1, 75, 'C') }),
  H: grid({ ...small, step: 100, cols: 13, ys: [173, 287, 401, 515, 629, 743], size: 86, numGap: 90, labels: range(76, 150, 'C') }),
};
const BG = { C: '#ff6543', D: '#ff6543', E: '#f6ff00', F: '#f6ff00', G: '#ff6543', H: '#ff6543' };

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
