/* ステージ式ページの土台：1画面 = 図 + 王子のふきだし + つぎへ */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fmt = n => Math.round(n).toLocaleString('ja-JP');
const EX = { soy: [[2008, 162979], [2018, 362794], [2025, 444552]],
  cup: { co2: .434, water: 120, land: 1.66 }, cedar: 8.8, bath: 200, court: 260,
  visitors: 42683600,
  ev: [[2,1,'ナチュラルヴィーガンつながるマルシェ vol.19','東京'],[2,23,'ナチュラルビーガンマルシェ','東京'],[3,22,'つながるマルシェ vol.20','東京'],[4,12,'人と地球と動物に優しいマルシェ in 京都','京都'],[4,19,'東京ビーガングルメ祭り 春','東京・木場公園'],[4,26,'京都ビーガングルメ祭り 春','京都・梅小路公園'],[4,26,'ナチュラルビーガンマルシェ','東京'],[5,10,'名古屋ビーガングルメ祭り 春','愛知・鶴舞公園'],[5,10,'Ethical VEGAN Fest','兵庫・尼崎'],[5,17,'西宮ヴィーガンフェス','兵庫・西宮'],[5,17,'まあるい VEGAN FESTA 春','埼玉・神川町'],[5,24,'つながるマルシェ vol.21','東京'],[7,5,'つながるマルシェ vol.22','東京'],[9,6,'つながるマルシェ vol.23','東京'],[10,4,'東京ビーガングルメ祭り 秋','東京・木場公園'],[10,11,'名古屋ビーガングルメ祭り 秋','愛知・鶴舞公園'],[11,1,'まあるい VEGAN FESTA 秋','埼玉・神川町'],[11,3,'ASIAN VEGAN CONNECT','東京・五反田'],[11,7,'Plantful Inspirations','東京・代官山'],[11,15,'Vegan Gathering Fukuoka Vol.2','福岡'],[11,29,'ヴィーガンマルシェ in 那須乃木神社','栃木'],[11,29,'沖縄ヴィーガンフードフェス','沖縄']] };
window.StageViz = window.StageViz || {};

/* 図のモジュールが使える小道具 */
const Kit = {
  el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; },
  style(id, css) { if (document.getElementById(id)) return; const s = document.createElement('style'); s.id = id; s.textContent = css; document.head.appendChild(s); },
  /* 数字のカウントアップ（data-t があれば一緒に更新）。止める関数を返す */
  count(el, to, ms = 900, from = 0, f = fmt) {
    const set = v => { const t = f(v); el.textContent = t; if (el.hasAttribute('data-t')) el.setAttribute('data-t', t); };
    if (reduced || ms <= 0) { set(to); return () => {}; }
    const t0 = performance.now(); let id = 0;
    const step = now => { const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3); set(from + (to - from) * e); if (p < 1) id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step); return () => cancelAnimationFrame(id);
  },
  /* 0→1 のアニメーション。止める関数を返す */
  tween(ms, fn, done) {
    if (reduced || ms <= 0) { fn(1); done && done(); return () => {}; }
    const t0 = performance.now(); let id = 0;
    const step = now => { const p = Math.min(1, (now - t0) / ms); fn(p); if (p < 1) id = requestAnimationFrame(step); else done && done(); };
    id = requestAnimationFrame(step); return () => cancelAnimationFrame(id);
  },
  ease: { out: p => 1 - Math.pow(1 - p, 3), io: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, back: p => 1 + 2.7 * Math.pow(p - 1, 3) + 1.7 * Math.pow(p - 1, 2) },
};

let fontsLate = false;
const fontJobs = new Map();
function fontsFor(text) {
  const key = text || '';
  if (!fontJobs.has(key)) {
    const t = '0123456789,.%軒位約倍万人年' + key;
    const all = Promise.all(['900 20px "Zen Maru Gothic"', '700 20px "Zen Maru Gothic"', '900 20px "Noto Sans JP"', '400 20px "Mochiy Pop One"'].map(d => document.fonts.load(d, t))).catch(() => {});
    fontJobs.set(key, { all, race: Promise.race([all, new Promise(r => setTimeout(() => { fontsLate = true; r(); }, 2500))]) });
  }
  return fontJobs.get(key);
}

function makeStage(sec, shared) {
  const mod = window.StageViz[sec.dataset.viz];
  const viz = $('.viz', sec), panel = $('.panel', sec), head = $('.st-head', sec);
  panel.innerHTML = '<div class="legend"></div><div class="guide"><div class="oji"><img alt="" width="160" height="220"></div><p class="bubble" aria-live="polite"></p></div>' +
    '<div class="opts" hidden></div><div class="nav"><button class="btn prev" type="button">← まえ</button><div class="pips"></div><button class="btn btn-go next" type="button">つぎ →</button></div>';
  const box = Kit.el('div', 'plot'); viz.appendChild(box);
  const stamp = Kit.el('img', 'stamp'); stamp.alt = ''; sec.appendChild(stamp);
  const oji = $('.oji img', panel), cap = $('.bubble', panel), opts = $('.opts', panel), nav = $('.nav', panel), prev = $('.prev', panel), next = $('.next', panel), pipBox = $('.pips', panel);
  let inst = null, scenes = [], cur = -1, typeT = 0, pose = '', entered = false, pips = [];
  const answered = {};

  const plot = () => {
    const s = sec.getBoundingClientRect(), p = panel.getBoundingClientRect(), h = head.getBoundingClientRect(), W = s.width, H = s.height;
    if (innerWidth >= 900) { const x = p.right - s.left + 44; return { x, y: 34, w: W - x - 36, h: H - 34 - 28 }; }
    const y = h.bottom - s.top + 8; return { x: 12, y, w: W - 24, h: Math.max(120, p.top - s.top - 10 - y) };
  };
  const placeBox = () => { const p = plot(); box.style.cssText = `left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px`; };
  const ctx = { data: shared.data, jp: shared.jp, chains: shared.chains, EX, fmt, reduced, kit: Kit, sec, box, plot, small: () => innerWidth < 900,
    say(html, p) { if (p) setPose(p); typeIn(html); }, next: () => step(1) };

  const lastAns = k => { for (let j = k - 1; j >= 0; j--) if (answered[j]) return answered[j]; return { ok: null, picked: -1, pre: '' }; };
  const htmlOf = (k, a) => { const h = scenes[k].html; return typeof h === 'function' ? h(a || lastAns(k), ctx) : h; };
  function setPose(p) { if (p === pose) return; pose = p; oji.src = `/images/oji2/oji-${p}.webp`; oji.classList.remove('pop'); void oji.offsetWidth; oji.classList.add('pop'); }
  function typeIn(html) {
    clearInterval(typeT); cap.innerHTML = html; if (reduced) return;
    const tw = document.createTreeWalker(cap, NodeFilter.SHOW_TEXT), nodes = [], spans = []; while (tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach(nd => { const fr = document.createDocumentFragment(); [...nd.data].forEach(ch => { const e = document.createElement('span'); e.className = 'c'; e.textContent = ch; fr.appendChild(e); spans.push(e); }); nd.replaceWith(fr); });
    let i = 0; typeT = setInterval(() => { for (let k = 0; k < 3 && i < spans.length; k++) spans[i++].classList.add('on'); if (i >= spans.length) clearInterval(typeT); }, 34);
  }
  function measure() {
    clearInterval(typeT); const keep = cap.innerHTML; cap.style.minHeight = ''; let h = 0;
    scenes.forEach((s, k) => { cap.innerHTML = htmlOf(k, { ok: false, picked: 0, pre: 'ざんねん！ ' }); h = Math.max(h, cap.offsetHeight); });
    cap.style.minHeight = h + 'px'; cap.innerHTML = cur >= 0 ? htmlOf(cur) : keep; placeBox();
  }
  function showStamp(ok) {
    const p = plot(); stamp.src = ok ? 'img/seikai.webp' : 'img/zannen.webp'; stamp.style.left = (p.x + p.w / 2) + 'px'; stamp.style.top = (p.y + p.h * .45) + 'px';
    stamp.classList.remove('on'); void stamp.offsetWidth; stamp.classList.add('on');
  }
  function buildOpts(k) {
    const q = scenes[k].quiz; opts.innerHTML = ''; opts.classList.remove('done');
    q.opts.forEach((t, j) => { const b = Kit.el('button', 'btn', t); b.type = 'button'; opts.appendChild(b);
      b.addEventListener('click', () => {
        if (answered[k]) return; const ok = j === q.ans; answered[k] = { ok, picked: j, pre: ok ? 'せいかい！ ' : 'ざんねん！ ' };
        [...opts.children].forEach((c, n) => { if (n === q.ans) c.classList.add('ok'); else if (n === j) c.classList.add('ng'); }); opts.classList.add('done');
        showStamp(ok); setTimeout(() => { if (cur === k) show(k + 1, 1); }, reduced ? 600 : 1200);
      }); });
  }
  function show(k, dir) {
    k = Math.max(0, Math.min(scenes.length - 1, k)); cur = k; const sc = scenes[k], open = !!sc.quiz && !answered[k], last = k === scenes.length - 1;
    setPose(sc.pose); typeIn(htmlOf(k)); nav.hidden = open; opts.hidden = !open; if (open) buildOpts(k);
    prev.disabled = k === 0; next.textContent = last ? (sec.dataset.next || 'つぎへ ↓') : 'つぎ →'; next.classList.toggle('long', last);
    pips.forEach((p, j) => p.setAttribute('aria-current', j === k ? 'true' : 'false'));
    sec.dataset.scene = k; inst.go(k, dir || 1, lastAns(k));
  }
  function step(d) {
    if (cur < 0) return; const k = cur + d;
    if (d > 0 && scenes[cur].quiz && !answered[cur]) return;
    if (k >= scenes.length) { const nx = sec.nextElementSibling; if (nx) nx.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); return; }
    if (k >= 0) show(k, d);
  }
  prev.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));

  return {
    sec, step,
    init() {
      if (inst) return; placeBox(); inst = mod.init(viz, ctx) || {}; inst.go = inst.go || (() => {}); scenes = mod.scenes(ctx, inst);
      if (mod.legend) $('.legend', panel).innerHTML = mod.legend.map(l => `<span style="--c:${l[0]}">${l[1]}</span>`).join('');
      scenes.forEach((s, j) => { const b = Kit.el('button', 'pip'); b.type = 'button'; b.setAttribute('aria-label', (j + 1) + '. ' + s.name); b.addEventListener('click', () => { if (cur >= 0) show(j, j > cur ? 1 : -1); }); pipBox.appendChild(b); pips.push(b); });
      oji.src = `/images/oji2/oji-${scenes[0].pose}.webp`; pose = scenes[0].pose; measure();
    },
    async enter() {
      if (entered) return; entered = true; this.init();
      const f = fontsFor(mod.glyphs ? mod.glyphs(ctx, inst) : ''); await f.race; measure(); if (inst.resize) inst.resize(); show(0, 1);
      if (fontsLate) f.all.then(() => this.resize());
    },
    resize() { if (!inst) return; measure(); if (inst.resize) inst.resize(); },
  };
}
window.__stageKit = { Kit, makeStage, EX, fmt, reduced, $, $$ };
})();
