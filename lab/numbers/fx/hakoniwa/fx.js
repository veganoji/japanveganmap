/* ビーガン箱庭ニッポン: one self-contained visual. Usage: initFx(rootEl, data, jp) */
function initFx(root, D, JP) {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const sstep = (a, b, v) => { v = clamp((v - a) / (b - a), 0, 1); return v * v * (3 - 2 * v); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const back = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  let seed = 20261112; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const fmt = n => n.toLocaleString('en-US');

  /* ---------- styles + DOM ---------- */
  if (!document.getElementById('hk-css')) {
    const st = document.createElement('style'); st.id = 'hk-css';
    st.textContent = `
.hk{position:relative;overflow:hidden;background:#AEE3E4;font-family:"Noto Sans JP",sans-serif;color:#1F1812;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;--rw:84px;--bw:260px}
.hk *{box-sizing:border-box}
.hk-cv{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:pointer}
.hk-count{position:absolute;left:12px;top:12px;z-index:3;background:#FFF9EE;border:2.5px solid #1F1812;border-radius:18px;box-shadow:4px 4px 0 #1F1812;padding:8px 14px 8px;display:flex;flex-direction:column;line-height:1.1;pointer-events:none}
.hk-lab{font-weight:700;font-size:14px;color:#3F6A3A;white-space:nowrap}
.hk-num{font-family:"Zen Maru Gothic",sans-serif;font-weight:900;font-size:46px;color:#C9223A;white-space:nowrap;font-variant-numeric:tabular-nums;min-width:3.5em}
.hk-num small{font-size:.5em;color:#1F1812;margin-left:3px}
.hk-tod{position:absolute;right:12px;top:12px;z-index:3;display:flex;border:2.5px solid #1F1812;border-radius:999px;box-shadow:4px 4px 0 #1F1812;background:#FFF9EE;overflow:hidden}
.hk-tod button{appearance:none;border:0;background:none;margin:0;cursor:pointer;font:700 15px/1 "Zen Maru Gothic",sans-serif;padding:11px 11px;color:#1F1812;white-space:nowrap}
.hk-tod button+button{border-left:2.5px solid #1F1812}
.hk-tod button[aria-pressed="true"]{background:#D4A847}
.hk-tod button[data-t="night"][aria-pressed="true"]{background:#13213F;color:#FFF9EE}
.hk-tod button:focus-visible,.hk-b:focus-visible{outline:3px solid #C9223A;outline-offset:-3px}
.hk-bottom{position:absolute;left:0;right:0;bottom:12px;z-index:3;display:flex;flex-direction:column;align-items:center;gap:9px;pointer-events:none;padding:0 8px}
.hk-bottom>*{pointer-events:auto}
.hk-leg{display:flex;gap:2px 12px;flex-wrap:wrap;justify-content:center;font-weight:700;font-size:14px;line-height:1.35;background:rgba(255,249,238,.94);border-radius:999px;padding:6px 14px;border:2px solid #1F1812;white-space:nowrap}
.hk-btns{display:flex;gap:12px}
.hk-b{appearance:none;font:900 16px/1 "Zen Maru Gothic",sans-serif;color:#1F1812;background:#FFF9EE;border:2.5px solid #1F1812;border-radius:999px;box-shadow:4px 4px 0 #1F1812;padding:12px 16px;margin:0 4px 4px 0;cursor:pointer;white-space:nowrap;transition:transform .12s,box-shadow .12s}
.hk-b:active{transform:translate(3px,3px);box-shadow:1px 1px 0 #1F1812}
.hk-b[hidden]{display:none}
.hk-red{background:#C9223A;color:#FFF9EE}
.hk-gold{background:#D4A847}
.hk-oji{position:absolute;left:0;top:0;z-index:2;transform-origin:0 0;will-change:transform;pointer-events:none}
.hk-rider{position:relative;width:var(--rw);height:calc(var(--rw)*1.46)}
.hk-rider i{position:absolute;left:0;top:0;width:100%;height:calc(var(--rw)*1.22);overflow:hidden;display:block}
.hk-rider img{width:100%;display:block}
.hk-rider svg{position:absolute;left:-24%;width:148%;top:60%;overflow:visible}
.hk-say{position:absolute;left:calc(var(--rw) + 24px);top:2px;margin:0;width:var(--bw);background:#FFF9EE;border:2.5px solid #1F1812;border-radius:18px;box-shadow:4px 4px 0 #1F1812;padding:11px 14px;font:700 19px/1.5 "Zen Maru Gothic","Noto Sans JP",sans-serif;opacity:0;transform:scale(.88);transform-origin:0 40%;transition:opacity .18s,transform .28s cubic-bezier(.3,1.5,.5,1)}
.hk-say.on{opacity:1;transform:none}
.hk-say::before{content:"";position:absolute;left:-14px;top:24px;border:9px solid transparent;border-right:12px solid #1F1812;border-left:0}
.hk-say::after{content:"";position:absolute;left:-9px;top:26px;border:7px solid transparent;border-right:10px solid #FFF9EE;border-left:0}
.hk-say .g{visibility:hidden}
.hk-say .t{position:absolute;left:14px;right:14px;top:11px}
.hk-wide .hk-count{left:24px;top:20px;padding:10px 20px 12px}
.hk-wide .hk-lab{font-size:17px}
.hk-wide .hk-num{font-size:66px}
.hk-wide .hk-tod{right:24px;top:20px}
.hk-wide .hk-tod button{font-size:17px;padding:13px 16px}
.hk-wide .hk-bottom{left:auto;right:20px;bottom:20px;align-items:flex-end}
.hk-wide .hk-leg{font-size:16px;padding:8px 18px}
.hk-wide .hk-b{font-size:18px;padding:14px 20px}
.hk-wide .hk-say{font-size:22px;padding:14px 18px}
.hk-wide .hk-say .t{left:18px;right:18px;top:14px}
@media (prefers-reduced-motion:reduce){.hk-say,.hk-b{transition:none}}`;
    document.head.appendChild(st);
  }
  root.classList.add('hk');
  root.innerHTML = `
<canvas class="hk-cv" role="img" aria-label="日本列島にビーガン対応のお店がならぶ箱庭の地図"></canvas>
<div class="hk-count"><span class="hk-lab">ビーガン対応のお店</span><b class="hk-num"><span class="hk-n">0</span><small>軒</small></b></div>
<div class="hk-tod" role="group" aria-label="時間をえらぶ"><button type="button" data-t="day" aria-pressed="false">☀️ ひる</button><button type="button" data-t="night" aria-pressed="false">🌙 よる</button></div>
<div class="hk-oji"><div class="hk-rider"><i><img src="/images/oji2/oji-pointing-up.webp" alt="ビーガン王子" draggable="false"></i>
<svg viewBox="0 0 200 92" aria-hidden="true"><g fill="#1F1812"><ellipse cx="100" cy="66" rx="90" ry="23"/><ellipse cx="50" cy="52" rx="38" ry="29"/><ellipse cx="98" cy="40" rx="43" ry="35"/><ellipse cx="146" cy="50" rx="40" ry="31"/><ellipse cx="176" cy="64" rx="24" ry="20"/><ellipse cx="22" cy="66" rx="21" ry="18"/></g><g fill="#fff"><ellipse cx="100" cy="66" rx="86" ry="19"/><ellipse cx="50" cy="52" rx="34" ry="25"/><ellipse cx="98" cy="40" rx="39" ry="31"/><ellipse cx="146" cy="50" rx="36" ry="27"/><ellipse cx="176" cy="64" rx="20" ry="16"/><ellipse cx="22" cy="66" rx="17" ry="14"/></g><g fill="none" stroke="#BFDCE8" stroke-width="4" stroke-linecap="round"><path d="M40 70q14 8 30 2"/><path d="M104 74q18 7 38 0"/></g></svg></div>
<p class="hk-say"><span class="g"></span><span class="t"></span></p></div>
<div class="hk-bottom"><div class="hk-leg"><span>👑 まるごとヴィーガン</span><span>🌱 ヴィーガンメニューあり</span></div>
<div class="hk-btns"><button type="button" class="hk-b" data-a="again">🔁 もう一度</button><button type="button" class="hk-b hk-gold" data-a="all">⏩ ぜんぶ表示</button><button type="button" class="hk-b hk-red" data-a="home" hidden>🗾 全国にもどる</button></div></div>`;
  const $ = s => root.querySelector(s);
  const cv = $('.hk-cv'), ctx = cv.getContext('2d');
  const elN = $('.hk-n'), elOji = $('.hk-oji'), elSay = $('.hk-say'), elG = $('.hk-say .g'), elT = $('.hk-say .t');
  const bAgain = $('[data-a="again"]'), bAll = $('[data-a="all"]'), bHome = $('[data-a="home"]');
  const todBtns = [...root.querySelectorAll('.hk-tod button')];

  /* ---------- palette (day, golden hour, night) ---------- */
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const PAL = {}; const pal = (k, d, g, n) => { PAL[k] = [hex(d), hex(g), hex(n)]; };
  pal('skyT', '#BFE6F2', '#FFC78C', '#0D1731'); pal('skyB', '#FFF4DD', '#FFE2B2', '#33488A');
  pal('seaT', '#B4E6E4', '#F9D0A6', '#263E7A'); pal('seaB', '#72C3D8', '#D8989E', '#0F1A38');
  pal('land', '#EEF2CC', '#F8E8B6', '#42676A'); pal('blot', '#B5D788', '#E2C27A', '#2E5358');
  pal('edge', '#5E8C52', '#8F7C40', '#14262E'); pal('bord', '#86AE72', '#B89F5E', '#7FA3A0');
  pal('selc', '#FFF7D0', '#FFF0C2', '#8DB3A0'); pal('fuji', '#8094CF', '#B287B6', '#5367A8');
  pal('ink', '#1F1812', '#1F1812', '#FFF9EE'); pal('foam', '#FFFFFF', '#FFF3DC', '#9FB6E8');
  let N = 0, G = 0;
  const mixv = k => { const p = PAL[k]; return [0, 1, 2].map(i => Math.round(lerp(lerp(p[0][i], p[1][i], G), p[2][i], N))); };
  const col = (k, a) => { const v = mixv(k); return a == null ? `rgb(${v})` : `rgba(${v},${a})`; };

  /* ---------- data ---------- */
  const shops = [];
  D.pts.forEach(p => { if (p[2] !== 2) shops.push({ la: p[0], lo: p[1], f: p[2] >= 3, pr: p[3], x: 0, y: 0, b: 0, c: null, c0: null }); });
  const TOTAL = shops.length, OPEN = 22;
  { const ord = shops.map((_, i) => i); for (let i = ord.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; const t = ord[i]; ord[i] = ord[j]; ord[j] = t; }
    ord.forEach((si, i) => { shops[si].b = .5 + (OPEN - .5) * Math.pow(i / TOTAL, .92); }); }
  const births = shops.map(s => s.b).sort((a, b) => a - b);
  const P = D.pref.map((r, i) => ({ i, p: r[0], t: r[1] + r[2], f: r[3] }));
  P.forEach(a => { a.rk = 1 + P.filter(b => b.t > a.t).length; });
  const line = i => { const a = P[i];
    const head = a.rk === 1 ? `${a.p}は${fmt(a.t)}軒で、堂々の全国1位！` : `${a.p}は${fmt(a.t)}軒で全国${a.rk}位。`;
    return head + (a.f > 0 ? `👑は${fmt(a.f)}軒だよ！` : '👑はこれからだね！'); };

  /* ---------- sprites ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  function mkEmoji(ch) {
    const S = 160, c = mk(S, S), x = c.getContext('2d', { willReadFrequently: true });
    x.font = '104px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(ch, S / 2, S / 2 + 6);
    const sil = mk(S, S), sx = sil.getContext('2d'); sx.drawImage(c, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#FFFDF6'; sx.fillRect(0, 0, S, S);
    const o = mk(S, S), ox = o.getContext('2d', { willReadFrequently: true });
    for (let a = 0; a < 16; a++) ox.drawImage(sil, Math.cos(a * Math.PI / 8) * 6, Math.sin(a * Math.PI / 8) * 6);
    ox.drawImage(c, 0, 0);
    const d = ox.getImageData(0, 0, S, S).data; let x0 = S, y0 = S, x1 = 0, y1 = 0;
    for (let y = 0; y < S; y++) for (let X = 0; X < S; X++) if (d[(y * S + X) * 4 + 3] > 24) { if (X < x0) x0 = X; if (X > x1) x1 = X; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0) { x0 = y0 = 0; x1 = y1 = S - 1; }
    const t = mk(x1 - x0 + 1, y1 - y0 + 1); t.getContext('2d').drawImage(o, -x0, -y0);
    return { cv: t, w: t.width, h: t.height };
  }
  const SPR = { o: mkEmoji('🌱'), f: mkEmoji('👑') };
  const GLOW = (() => { const c = mk(128, 128), x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,226,140,.95)'); g.addColorStop(.35, 'rgba(255,190,90,.5)'); g.addColorStop(1, 'rgba(255,170,70,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c; })();
  function mkCloud(top, shade) {
    const c = mk(220, 124), x = c.getContext('2d'), puffs = [[60, 72, 34], [102, 54, 42], [148, 68, 36], [180, 82, 22], [32, 84, 20]];
    const lay = (dy, f) => { x.fillStyle = f; puffs.forEach(p => { x.beginPath(); x.arc(p[0], p[1] + dy, p[2], 0, 7); x.fill(); }); x.beginPath(); x.ellipse(108, 92 + dy, 88, 16, 0, 0, 7); x.fill(); };
    lay(7, shade); lay(0, top); return c;
  }
  const CLOUD = { d: mkCloud('#FFFFFF', '#D5E9F1'), g: mkCloud('#FFE8D2', '#F5BFA6'), n: mkCloud('#8D9FD0', '#6A7CB4'), s: mkCloud('#13213F', '#13213F') };

  /* ---------- layout + geometry ---------- */
  const LON0 = 128.3, LON1 = 149.0, LAT0 = 30.0, LAT1 = 45.6, K = Math.cos(38 * Math.PI / 180);
  let W = 0, H = 0, dpr = 1, phone = true, U = 1, skyH = 128, botPad = 236, rw = 84, rh = 123, s = 1, OX = 0, OY = 0, mw = 0, si = 1, IX = 0, IY = 0, IW = 0, IH = 0, FX = 0, FY = 0;
  let paths = [], landAll = null, bbox = [], marks = [], sparks = [], blots = [], stars = [], clouds = [], routes = [], fuji = [0, 0];
  let parkX = 8, parkY = 0, laneY = 0, drS = .62, driftV = 13, sunX = 0, sunY = 0;
  const pm = (lo, la) => [OX + (lo - LON0) * K * s, OY + (LAT1 - la) * s], pi = (lo, la) => [IX + 14 + (lo - 122.9) * K * si, IY + 30 + (29.6 - la) * si];
  const proj = (la, lo) => la < 29.6 && lo < 131.6 ? pi(lo, la) : pm(lo, la);

  function layout() {
    const r = root.getBoundingClientRect(); W = Math.max(280, Math.round(r.width)); H = Math.max(420, Math.round(r.height));
    dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    phone = W < 700; U = phone ? 1 : 1.3; root.classList.toggle('hk-wide', !phone);
    rw = phone ? 84 : 122; rh = rw * 1.46; skyH = phone ? 128 : 140;
    const bw = phone ? W - 8 - rw - 24 - 14 : 340;
    root.style.setProperty('--rw', rw + 'px'); root.style.setProperty('--bw', bw + 'px');
    botPad = phone ? 110 + rh + 8 : 34;
    const ah = H - skyH - botPad;
    s = Math.min(W * .94 / ((LON1 - LON0) * K), ah * .97 / (LAT1 - LAT0));
    mw = (LON1 - LON0) * K * s; const mh = (LAT1 - LAT0) * s;
    OX = phone ? (W - mw) / 2 + W * .02 : Math.max((W - mw) / 2, Math.min(W - mw - 36, 28 + rw + 24 + bw + 34));
    OY = skyH + (ah - mh) / 2 + (phone ? 8 : 14);
    si = s * .62; IW = (131.6 - 122.9) * K * si + 28; IH = (29.6 - 24.0) * si + 42;
    IX = phone ? 8 : Math.max(16, OX - IW - 6); IY = skyH + (phone ? 16 : 34);
    FX = phone ? W / 2 : OX + mw * .5; FY = skyH + ah / 2 + 6;
    parkX = phone ? 8 : 28; parkY = phone ? H - 110 - rh : H - 30 - rh; drS = phone ? .62 : .8; laneY = skyH - rh * drS * .56; driftV = phone ? 13 : 26;
    sunX = phone ? W - 64 : W - 300; sunY = phone ? 90 : 76;

    paths = []; bbox = []; landAll = new Path2D();
    JP.forEach(([id, rings]) => {
      const pa = new Path2D(); let best = null, bestA = -1;
      rings.forEach(rg => {
        let mnLo = 1e9, mxLa = -1e9;
        for (let i = 0; i < rg.length; i += 2) { const lo = (rg[i] + 122000) / 1000, la = (rg[i + 1] + 24000) / 1000; if (lo < mnLo) mnLo = lo; if (la > mxLa) mxLa = la; }
        const f = mxLa < 29.6 && mnLo < 131.6 ? pi : pm; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, ar = 0, px = 0, py = 0;
        for (let i = 0; i < rg.length; i += 2) { const q = f((rg[i] + 122000) / 1000, (rg[i + 1] + 24000) / 1000);
          if (i) { pa.lineTo(q[0], q[1]); ar += px * q[1] - q[0] * py; } else pa.moveTo(q[0], q[1]);
          px = q[0]; py = q[1]; if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; }
        pa.closePath(); ar = Math.abs(ar); if (ar > bestA) { bestA = ar; best = { x0, y0, x1, y1 }; }
      });
      paths[id - 1] = pa; bbox[id - 1] = best; landAll.addPath(pa);
    });
    for (const sh of shops) { const q = proj(sh.la, sh.lo); sh.x = q[0]; sh.y = q[1]; }
    fuji = pm(138.73, 35.36);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const sea = () => { for (let k = 0; k < 40; k++) { const x = rnd() * W, y = skyH + 26 + rnd() * (H - skyH - 34); if (!ctx.isPointInPath(landAll, x, y)) return [x, y]; } return [W * .92, H * .8]; };
    seed = 4242;
    marks = []; for (let i = 0; i < (phone ? 36 : 80); i++) { const q = sea(); marks.push({ x: q[0], y: q[1], ph: rnd() * 6.28, r: (3.5 + rnd() * 3) * U }); }
    sparks = []; for (let i = 0; i < (phone ? 34 : 70); i++) { const q = sea(); sparks.push({ x: q[0], y: q[1], ph: rnd() * 6.28, sp: .7 + rnd() * 1.3, r: (2.2 + rnd() * 2.4) * U }); }
    blots = [[141.4, 43.3], [143.6, 43.4], [140.7, 40.3], [140.3, 38.2], [139.2, 36.9], [137.9, 36.1], [136.6, 35.3], [135.1, 34.5], [133.3, 34.9], [131.3, 33.3], [130.8, 32.0], [133.5, 33.6], [138.9, 35.1], [140.4, 36.2], [142.4, 44.1]]
      .map(a => { const q = pm(a[0], a[1]); return { x: q[0] + (rnd() - .5) * s * .5, y: q[1] + (rnd() - .5) * s * .5, r: s * (1.0 + rnd() * 1.1) }; });
    stars = []; for (let i = 0; i < (phone ? 46 : 110); i++) stars.push({ x: rnd() * W, y: 5 + rnd() * (skyH - 6), r: .7 + rnd() * 1.3, ph: rnd() * 6.28, sp: .8 + rnd() * 1.6 });
    clouds = []; for (let i = 0; i < (phone ? 4 : 7); i++) clouds.push({ x: rnd() * (W + 300) - 150, y: skyH + 46 + rnd() * (H - skyH - botPad * .6 - 90), sc: (.3 + rnd() * .26) * U, v: (4 + rnd() * 7) * U });
    const rt = a => a.map(q => pm(q[0], q[1]));
    routes = [rt([[132.6, 31.4], [136.8, 32.4], [141.6, 33.9], [143.3, 37.4], [144.6, 40.6]]), rt([[130.6, 35.9], [134.4, 37.4], [137.1, 38.8], [138.2, 40.7], [138.4, 42.6]]), rt([[146.2, 33.2]])];
  }

  /* ---------- clusters ---------- */
  let CL = [], CLold = null, trans = null;
  function build(z) {
    const cell = lerp(phone ? 30 : 38, phone ? 17 : 19, sstep(1.5, 4.5, z)) / z, m = new Map();
    for (const sh of shops) {
      const o = sh.f ? cell * .5 : 0, k = (sh.f ? 1e9 : 0) + Math.floor((sh.x + o) / cell) * 8192 + Math.floor((sh.y + o) / cell); let c = m.get(k);
      if (!c) { c = { x: 0, y: 0, n: 0, bo: [], bf: [], io: 0, jf: 0, s0: sh, pr: sh.pr, born: -9, tw: -9, ph: 0, fx: 0, fy: 0, tx: 0, ty: 0 }; m.set(k, c); }
      c.x += sh.x; c.y += sh.y; c.n++; (sh.f ? c.bf : c.bo).push(sh.b); sh.c = c;
    }
    const arr = [...m.values()], num = (a, b) => a - b;
    for (const c of arr) { c.x /= c.n; c.y /= c.n; c.bo.sort(num); c.bf.sort(num); c.ph = (c.x * 12.9898 + c.y * 78.233) % 6.283; }
    arr.sort((a, b) => a.y - b.y); return arr;
  }
  let now = 0, ot = 0, otSpeed = 1, done = false, bi = 0, shown = -1;
  function count(silent) {
    for (const c of CL) {
      const b = c.io + c.jf;
      while (c.io < c.bo.length && c.bo[c.io] <= ot) c.io++;
      while (c.jf < c.bf.length && c.bf[c.jf] <= ot) c.jf++;
      if (!silent && c.io + c.jf > b) { if (!b) c.born = now; else if (now - c.tw > .45 && now - c.born > .55) c.tw = now; }
    }
    while (bi < TOTAL && births[bi] <= ot) bi++;
    if (bi !== shown) { shown = bi; elN.textContent = fmt(bi); }
  }
  function recluster(z, split) {
    for (const sh of shops) sh.c0 = sh.c;
    const old = CL; CL = build(z);
    for (const c of CL) { const o = c.s0.c0; c.fx = o ? o.x : c.x; c.fy = o ? o.y : c.y; }
    for (const o of old) { const n = o.s0.c; o.tx = n.x; o.ty = n.y; }
    count(true);
    if (reduce) { CLold = null; trans = null; } else { CLold = old; trans = { t0: now, d: .72, split }; }
  }

  /* ---------- camera ---------- */
  const cam = { x: 0, y: 0, z: 1 }; let camA = null;
  const homeCam = () => ({ x: W / 2, y: H / 2, z: 1 });
  function prefCam(i) {
    const b = bbox[i], vw = phone ? W : Math.min(mw, W - OX), vh = H - skyH - botPad;
    const z = clamp(Math.min(vw * .64 / (b.x1 - b.x0), vh * .58 / (b.y1 - b.y0)), 1.8, phone ? 14 : 10);
    return { x: (b.x0 + b.x1) / 2 - (FX - W / 2) / z, y: (b.y0 + b.y1) / 2 - (FY - H / 2) / z, z };
  }
  function camTo(to) { if (reduce) { cam.x = to.x; cam.y = to.y; cam.z = to.z; camA = null; return; } camA = { f: { x: cam.x, y: cam.y, z: cam.z }, to, t0: now, d: .72 }; }
  function stepCam() {
    if (!camA) return;
    const u = clamp((now - camA.t0) / camA.d, 0, 1), e = ease(u), f = camA.f, t = camA.to, hi = t.z >= f.z ? t : f;
    const ax = hi.x + (FX - W / 2) / hi.z, ay = hi.y + (FY - H / 2) / hi.z, z = f.z * Math.pow(t.z / f.z, e);
    cam.z = z; cam.x = ax - lerp((ax - f.x) * f.z, (ax - t.x) * t.z, e) / z; cam.y = ay - lerp((ay - f.y) * f.z, (ay - t.y) * t.z, e) / z;
    if (u >= 1) camA = null;
  }

  /* ---------- state: selection, opening, time of day, Oji ---------- */
  let sel = -1, selT = 0, selA = 0, pin = null, dc = 0;
  const oji = { x: -70, y: 60, s: .62, mode: 'drift', dx: -70, leave: 0, arr: false, chars: [], ti: -1, t0: 0 };
  function ui() { const zoomed = selT === 1; bAgain.hidden = zoomed; bAll.hidden = zoomed || done; bHome.hidden = !zoomed; }
  function say(text, leave) {
    oji.mode = 'park'; oji.chars = Array.from(text); oji.arr = false; oji.ti = -1; oji.leave = leave ? now + leave + .034 * oji.chars.length + 1 : 0;
    elSay.classList.remove('on'); elG.textContent = text; elT.textContent = reduce ? text : '';
  }
  function select(i) { if (i === sel && selT === 1) return; sel = i; selT = 1; const c = prefCam(i); const split = c.z > cam.z; camTo(c); recluster(c.z, split); say(line(i)); ui(); kick(); }
  function goHome() { if (selT !== 1) return; selT = 0; camTo(homeCam()); recluster(1, false); say('次はどの県にする？', 3); ui(); kick(); }
  function restart() {
    ot = 0; otSpeed = 1; done = false; bi = 0; for (const c of CL) { c.io = c.jf = 0; c.born = -9; c.tw = -9; }
    if (!pin) dc = 0; oji.mode = 'drift'; oji.dx = oji.x; elSay.classList.remove('on'); count(true); ui(); kick();
  }
  function finish() { done = true; otSpeed = 1; ui(); if (selT === 0) say(`ぜんぶで${fmt(TOTAL)}軒！気になる県をタップしてね。`, reduce ? 0 : 9); }
  function setPin(t) {
    pin = pin === t ? null : t; if (!pin) dc = N > .5 ? 25 : 0;
    todBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === pin))); kick();
  }
  function stepTod(dt) {
    let n = 0, g = 0;
    if (pin === 'night') n = 1;
    else if (!pin) { dc += dt; const p = (dc / 40) % 1;
      g = sstep(.36, .47, p) * (1 - sstep(.52, .6, p)) + .6 * sstep(.9, .95, p) * (1 - sstep(.96, 1, p));
      n = sstep(.5, .6, p) * (1 - sstep(.9, .985, p)); }
    if (reduce) { N = n; G = g; } else { const k = 1 - Math.exp(-dt * 2.6); N += (n - N) * k; G += (g - G) * k; }
  }
  function stepOji(dt) {
    let tx, ty, ts;
    if (oji.mode === 'drift') { oji.dx += dt * driftV; if (oji.dx > W + 24) oji.dx = -rw * drS - 40; tx = oji.dx; ty = laneY + Math.sin(now * 1.1) * 5; ts = drS; }
    else { tx = parkX; ty = parkY + Math.sin(now * 1.7) * 3; ts = 1; }
    const k = reduce ? 1 : 1 - Math.exp(-dt * 5.5); oji.x += (tx - oji.x) * k; oji.y += (ty - oji.y) * k; oji.s += (ts - oji.s) * k;
    if (oji.mode === 'park') {
      if (!oji.arr && Math.abs(oji.x - tx) + Math.abs(oji.y - ty) < 12) { oji.arr = true; oji.t0 = now; elSay.classList.add('on'); }
      if (oji.arr && !reduce) { const n = clamp(((now - oji.t0 - .12) / .034) | 0, 0, oji.chars.length); if (n !== oji.ti) { oji.ti = n; elT.textContent = oji.chars.slice(0, n).join(''); } }
      if (oji.leave && now > oji.leave && selT === 0) { oji.mode = 'drift'; oji.dx = oji.x; oji.leave = 0; elSay.classList.remove('on'); }
    }
    elOji.style.transform = `translate3d(${oji.x.toFixed(1)}px,${oji.y.toFixed(1)}px,0) scale(${oji.s.toFixed(3)})`;
  }
  function step(dt) {
    if (!done) { ot += dt * otSpeed; if (ot >= OPEN + .3) { ot = 1e9; count(false); finish(); } }
    count(false); stepCam(); stepTod(dt);
    if (reduce) selA = selT; else selA += (selT - selA) * (1 - Math.exp(-dt * 7));
    if (selT === 0 && selA < .01 && sel >= 0) { sel = -1; selA = 0; }
    if (trans && now - trans.t0 >= trans.d) { trans = null; CLold = null; }
    stepOji(dt);
  }

  /* ---------- drawing ---------- */
  const TAU = Math.PI * 2;
  const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); } };
  const cr = (p, u) => { const n = p.length - 1, f = clamp(u, 0, .9999) * n, i = f | 0, t = f - i, a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], d = p[Math.min(n, i + 2)];
    const q = k => .5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t * t * t); return [q(0), q(1)]; };
  function boat(x, y, dir, t, k) {
    const L = 11 * U / Math.sqrt(cam.z);
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + k) * L * .08); ctx.rotate(Math.sin(t * 1.7 + k * 2) * .09); ctx.scale(dir, 1);
    ctx.strokeStyle = col('foam', 1); ctx.lineWidth = L * .11; ctx.lineCap = 'round';
    for (let i = 1; i <= 3; i++) { ctx.globalAlpha = .7 - i * .17; ctx.beginPath(); ctx.arc(-L * (.75 + i * .5), L * .22, L * .22, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.fillStyle = k === 1 ? '#D4A847' : '#C9223A'; ctx.strokeStyle = '#1F1812'; ctx.lineWidth = L * .09; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-L * .8, -L * .05); ctx.lineTo(L * .9, -L * .05); ctx.lineTo(L * .55, L * .38); ctx.lineTo(-L * .55, L * .38); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FFF9EE';
    ctx.beginPath(); ctx.moveTo(L * .06, -L * 1.35); ctx.lineTo(L * .75, -L * .2); ctx.lineTo(L * .06, -L * .2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-L * .1, -L * 1.05); ctx.lineTo(-L * .1, -L * .2); ctx.lineTo(-L * .6, -L * .2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    if (N > .05) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = N * .85; ctx.drawImage(GLOW, x - L * 1.5, y - L * 1.8, L * 3, L * 3); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
  }

  function draw() {
    const z = cam.z, tx = W / 2 - cam.x * z, ty = H / 2 - cam.y * z, lw = 1 / Math.pow(z, .72), t = now;
    const world = () => ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * tx, dpr * ty), screen = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vx0 = -tx / z, vy0 = -ty / z, vx1 = (W - tx) / z, vy1 = (H - ty) / z;

    /* sea */
    world(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    let g = ctx.createLinearGradient(0, skyH, 0, H); g.addColorStop(0, col('seaT')); g.addColorStop(1, col('seaB'));
    ctx.fillStyle = g; ctx.fillRect(vx0 - 2, vy0 - 2, vx1 - vx0 + 4, vy1 - vy0 + 4);
    const nb = 7, bh = (H - skyH) / nb, sx = Math.max(5, 18 / z), xa = vx0 - 20, xb = vx1 + 20;
    for (let b = 0; b < nb; b++) {
      const y0 = skyH + (b + .3) * bh; if (y0 + bh < vy0 || y0 - 14 > vy1) continue;
      const dir = b % 2 ? -1 : 1, kx = TAU / ((110 + b * 23) * U), amp = (3.5 + (b % 3)) * U;
      ctx.beginPath(); ctx.moveTo(xa, y0 + Math.sin(xa * kx + dir * t * .32 + b * 1.7) * amp);
      for (let x = xa + sx; x <= xb; x += sx) ctx.lineTo(x, y0 + Math.sin(x * kx + dir * t * .32 + b * 1.7) * amp);
      for (let x = xb; x >= xa; x -= sx) ctx.lineTo(x, y0 + bh * .42 + Math.sin(x * kx * 1.31 - dir * t * .24 + b) * amp * 1.2);
      ctx.closePath(); ctx.fillStyle = col('foam', (.17 - .1 * N) * (b % 2 ? .75 : 1)); ctx.fill();
    }
    ctx.lineCap = 'round'; ctx.strokeStyle = col('foam', 1); ctx.lineWidth = 1.5 * U * lw;
    for (const m of marks) {
      if (m.x < vx0 - 12 || m.x > vx1 + 12 || m.y < vy0 - 12 || m.y > vy1 + 12) continue;
      const a = .3 + .3 * Math.sin(t * .8 + m.ph); if (a < .03) continue; ctx.globalAlpha = a * (1 - .55 * N);
      const x = m.x + Math.sin(t * .4 + m.ph) * 5, mr = m.r * Math.pow(lw, .85);
      ctx.beginPath(); ctx.arc(x, m.y, mr, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + mr * 1.7, m.y, mr, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
    ctx.fillStyle = N > .5 ? '#FFE9A8' : '#FFFFFF';
    for (const p of sparks) {
      const a = Math.pow(Math.max(0, Math.sin(t * p.sp + p.ph)), 5); if (a < .03) continue;
      ctx.globalAlpha = a * (.95 - .35 * N); const r = p.r * (.6 + .4 * a) * 1.6 * lw, x = p.x, y = p.y;
      ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.setLineDash([5 * lw * U, 5 * lw * U]); ctx.lineWidth = 1.6 * lw * U; ctx.strokeStyle = col('foam', .9); ctx.fillStyle = col('foam', .12);
    rr(IX, IY, IW, IH, 12 * U); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col('ink', .66); ctx.font = `700 ${13 * U}px "Zen Maru Gothic","Noto Sans JP",sans-serif`; ctx.textBaseline = 'top'; ctx.textAlign = 'left'; ctx.fillText('沖縄・奄美', IX + 10 * U, IY + 8 * U);

    /* light on the water */
    screen();
    const colm = (x, a, c) => { if (a < .02) return; ctx.fillStyle = c;
      for (let i = 0; i < 6; i++) { const y = skyH + 30 + i * 11 * U, w = (7 + i * 2.2 + Math.sin(t * 1.6 + i * 1.3) * 3.5) * U; ctx.globalAlpha = a * (1 - i / 6.5) * (.6 + .4 * Math.sin(t * 2.1 + i)); rr(x - w / 2 + Math.sin(t * .9 + i) * 3, y, w, 2.6 * U, 1.3 * U); ctx.fill(); }
      ctx.globalAlpha = 1; };
    
    if (N > .03) {
      ctx.globalCompositeOperation = 'lighter';
      for (const c of CL) { const n = c.io + c.jf; if (!n) continue; const x = c.x * z + tx, y = c.y * z + ty; if (x < -60 || x > W + 60 || y < -60 || y > H + 20) continue;
        const r = Math.min(46, 9 + 4.2 * Math.sqrt(n)) * U; ctx.globalAlpha = N * .2 * (.72 + .28 * Math.sin(t * 2.3 + c.ph * 5)); ctx.drawImage(GLOW, x - r, y - r * .25, r * 2, r * 3.1); }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }

    /* boats, land */
    world();
    for (let k = 0; k < 3; k++) { let p, dir;
      if (k < 2) { const v = (t * (k ? .015 : .012) + k * .37 + .22) % 2, u = sstep(0, 1, v < 1 ? v : 2 - v); p = cr(routes[k], u); const p2 = cr(routes[k], clamp(u + (v < 1 ? .01 : -.01), 0, 1)); dir = p2[0] >= p[0] ? 1 : -1; }
      else { const a = t * .05 + 1, c = routes[2][0]; p = [c[0] + Math.cos(a) * s * 1.9, c[1] + Math.sin(a) * s]; dir = Math.sin(a) <= 0 ? 1 : -1; }
      boat(p[0], p[1], dir, t, k); }
    ctx.lineJoin = 'round';
    ctx.save(); ctx.translate(2.4 * U * lw, 4.8 * U * lw); ctx.fillStyle = `rgba(14,38,66,${.27 + .12 * N})`; ctx.fill(landAll); ctx.restore();
    ctx.strokeStyle = col('edge'); ctx.lineWidth = 4.4 * U * lw; ctx.stroke(landAll);
    ctx.fillStyle = col('land'); ctx.fill(landAll);
    ctx.save(); ctx.clip(landAll); const bc = mixv('blot');
    for (const b of blots) { if (b.x + b.r < vx0 || b.x - b.r > vx1 || b.y + b.r < vy0 || b.y - b.r > vy1) continue;
      const gr = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${bc},.55)`); gr.addColorStop(.6, `rgba(${bc},.24)`); gr.addColorStop(1, `rgba(${bc},0)`);
      ctx.fillStyle = gr; ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2); }
    ctx.restore();
    ctx.strokeStyle = col('bord', .6); ctx.lineWidth = .9 * lw; for (const p of paths) if (p) ctx.stroke(p);
    if (sel >= 0 && selA > .01) {
      ctx.fillStyle = `rgba(19,33,63,${.3 * selA})`; ctx.fillRect(vx0 - 2, vy0 - 2, vx1 - vx0 + 4, vy1 - vy0 + 4);
      ctx.globalAlpha = selA; ctx.fillStyle = col('selc'); ctx.fill(paths[sel]); ctx.strokeStyle = '#C9223A'; ctx.lineWidth = 3 * U * lw; ctx.stroke(paths[sel]); ctx.globalAlpha = 1;
    }
    { const h = 15 * U / Math.sqrt(z), x = fuji[0], y = fuji[1] + h * .3;
      ctx.beginPath(); ctx.moveTo(x - h * .95, y); ctx.quadraticCurveTo(x - h * .3, y - h * .5, x - h * .17, y - h); ctx.lineTo(x + h * .17, y - h); ctx.quadraticCurveTo(x + h * .3, y - h * .5, x + h * .95, y); ctx.closePath();
      ctx.fillStyle = col('fuji'); ctx.fill(); ctx.strokeStyle = col('edge'); ctx.lineWidth = h * .09; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - h * .17, y - h); ctx.lineTo(x + h * .17, y - h); ctx.lineTo(x + h * .36, y - h * .58); ctx.lineTo(x + h * .18, y - h * .68); ctx.lineTo(x, y - h * .55); ctx.lineTo(x - h * .18, y - h * .68); ctx.lineTo(x - h * .36, y - h * .58); ctx.closePath();
      ctx.fillStyle = '#FFFDF6'; ctx.fill(); }
    const ca = 1 - sstep(1.12, 1.9, z), cw = W + 320, cx = c => ((c.x + c.v * t) % cw + cw) % cw - 160;
    if (ca > .01) for (const c of clouds) { ctx.globalAlpha = ca * (.11 - .05 * N); ctx.drawImage(CLOUD.s, cx(c) + 16 * U, c.y + 30 * U, 220 * c.sc, 100 * c.sc); }
    ctx.globalAlpha = 1;

    /* clouds */
    if (ca > .01) { world();
      for (const c of clouds) { const w = 220 * c.sc, h = 124 * c.sc, x = cx(c), A = ca * .94;
        ctx.globalAlpha = A * (1 - N) * (1 - G * .7); ctx.drawImage(CLOUD.d, x, c.y, w, h);
        if (G > .02) { ctx.globalAlpha = A * G * (1 - N); ctx.drawImage(CLOUD.g, x, c.y, w, h); }
        if (N > .02) { ctx.globalAlpha = A * N * .62; ctx.drawImage(CLOUD.n, x, c.y, w, h); } }
      ctx.globalAlpha = 1; }

    /* markers */
    screen();
    if (oji.s < .9) { ctx.fillStyle = 'rgba(19,33,63,.13)'; ctx.beginPath(); ctx.ellipse(oji.x + rw * oji.s * .5, oji.y + rh * oji.s + 14 * U, rw * oji.s * .52, 5 * U, 0, 0, TAU); ctx.fill(); }
    const zf = 1 + .2 * Math.min(z - 1, 4), badgeMin = z < 1.5 ? (phone ? 50 : 40) : 10, bd = [];
    const szO = n => Math.min(56, 15 + 2.1 * Math.pow(n - 1, .42)) * U * zf, szF = n => Math.min(52, 13.5 + 1.9 * Math.pow(n - 1, .42)) * U * zf;
    const drawC = (c, wx, wy, al, sc) => {
      const nO = c.io, nF = c.jf; if (!nO && !nF) return;
      const x = wx * z + tx, y = wy * z + ty; if (x < -60 || x > W + 60 || y < -40 || y > H + 80) return;
      if (sel >= 0 && c.pr !== sel) al *= 1 - .78 * selA;
      let kx = sc, ky = sc; const a = t - c.born;
      if (a < .6) { const u = a / .6, b = back(u), st = Math.sin(u * Math.PI) * (1 - u); kx *= b * (1 - .25 * st); ky *= b * (1 + .5 * st); }
      const wa = t - c.tw; if (wa < .5) { const w = Math.exp(-7 * wa) * Math.sin(wa * 24) * .14; ky *= 1 + w; kx *= 1 - w * .6; }
      const hO = nO ? szO(nO) : 0; let hF = nF ? szF(nF) : 0; if (nO && nF) hF = clamp(hF, hO * .42, hO * .82);
      const base = y + (nO ? hO : hF) * .32;
      if (N > .03) { const r = (nO ? hO : hF) * 1.12; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = al * N * (1 - .35 * sstep(1.5, 5, z)) * (.36 + .12 * Math.sin(t * 3.1 + c.ph * 7));
        ctx.drawImage(GLOW, x - r, base - r * 1.45, r * 2, r * 2); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = al;
      const sw = Math.sin(t * 1.5 + c.ph) * .06, cs = Math.cos(sw), sn = Math.sin(sw);
      ctx.setTransform(dpr * kx * cs, dpr * kx * sn, -dpr * ky * sn, dpr * ky * cs, dpr * x, dpr * base);
      if (nO) { const w = hO * SPR.o.w / SPR.o.h; ctx.drawImage(SPR.o.cv, -w / 2, -hO, w, hO); }
      if (nF) { const w = hF * SPR.f.w / SPR.f.h; ctx.drawImage(SPR.f.cv, -w / 2, nO ? -hO * .92 - hF * .5 : -hF, w, hF); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nO + nF >= badgeMin && al > .7 && a > .45) bd.push([x + (nO ? hO : hF) * .16, base - 5 * U, nO + nF]);
    };
    if (trans && CLold) { const e = ease(clamp((t - trans.t0) / trans.d, 0, 1));
      if (trans.split) { const ao = 1 - sstep(0, .5, e); if (ao > .01) for (const c of CLold) drawC(c, c.x, c.y, ao, 1 - .25 * e);
        const an = sstep(0, .4, e); for (const c of CL) drawC(c, lerp(c.fx, c.x, e), lerp(c.fy, c.y, e), an, lerp(.6, 1, e)); }
      else { const ao = 1 - sstep(.5, 1, e); for (const c of CLold) drawC(c, lerp(c.x, c.tx, e), lerp(c.y, c.ty, e), ao, lerp(1, .7, e));
        const an = sstep(.4, 1, e); if (an > .01) for (const c of CL) drawC(c, c.x, c.y, an, lerp(.7, 1, e)); } }
    else for (const c of CL) drawC(c, c.x, c.y, 1, 1);
    ctx.globalAlpha = 1; ctx.font = `900 ${12.5 * U}px "Zen Maru Gothic","Noto Sans JP",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 1.6;
    bd.sort((a, b) => b[2] - a[2]); const put = [];
    for (const b of bd) { const tx2 = fmt(b[2]), bw2 = ctx.measureText(tx2).width + 10 * U, bh2 = 17 * U;
      if (put.some(q => b[0] < q[0] + q[2] + 4 && b[0] + bw2 + 4 > q[0] && b[1] < q[1] + bh2 + 4 && b[1] + bh2 + 4 > q[1])) continue; put.push([b[0], b[1], bw2]);
      ctx.fillStyle = '#FFF9EE'; ctx.strokeStyle = '#1F1812'; rr(b[0], b[1], bw2, bh2, bh2 / 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#1F1812'; ctx.fillText(tx2, b[0] + bw2 / 2, b[1] + bh2 / 2 + .5); }

    /* sky */
    screen();
    const sb = mixv('skyB'); g = ctx.createLinearGradient(0, 0, 0, skyH + 34); g.addColorStop(0, col('skyT')); g.addColorStop(.74, `rgba(${sb},1)`); g.addColorStop(.82, `rgba(${sb},.9)`); g.addColorStop(1, `rgba(${sb},0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, skyH + 34);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, skyH + 4); ctx.clip();
    if (N > .02) { ctx.fillStyle = '#FFF4C4';
      for (const p of stars) { const tw = Math.sin(t * p.sp + p.ph); ctx.globalAlpha = N * (.4 + .6 * tw * tw) * clamp((skyH - 8 - p.y) / 30, 0, 1); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); }
      const k = Math.floor(t / 7), u = (t - k * 7) / .8;
      if (u < 1 && N > .6 && !reduce) { const x = ((k * 97) % 100) / 100 * W * .55 + W * .1 + u * 100, y = 14 + ((k * 31) % 40) + u * 38; ctx.globalAlpha = (1 - u) * N; ctx.strokeStyle = '#FFF4C4'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30, y - 11); ctx.stroke(); }
      ctx.globalAlpha = 1; }
    const R = phone ? 17 : 24, sy = lerp(sunY, skyH + R * 1.6, sstep(0, 1, G * .55 + N * 1.2));
    if (N < .98) { ctx.globalAlpha = 1 - N;
      let gr = ctx.createRadialGradient(sunX, sy, R * .5, sunX, sy, R * 2.7); gr.addColorStop(0, 'rgba(255,220,120,.6)'); gr.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(sunX, sy, R * 2.7, 0, TAU); ctx.fill();
      ctx.strokeStyle = G > .3 ? '#FF9E57' : '#F4B63A'; ctx.lineWidth = 2.8 * U; ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + t * .25, c = Math.cos(a), sn = Math.sin(a); ctx.beginPath(); ctx.moveTo(sunX + c * R * 1.38, sy + sn * R * 1.38); ctx.lineTo(sunX + c * R * 1.78, sy + sn * R * 1.78); ctx.stroke(); }
      ctx.fillStyle = `rgb(255,${Math.round(lerp(212, 152, G))},${Math.round(lerp(84, 78, G))})`; ctx.beginPath(); ctx.arc(sunX, sy, R, 0, TAU); ctx.fill(); }
    if (N > .02) { const my = lerp(skyH + R * 1.8, sunY - 2, sstep(.15, 1, N)), mr = R * .92; ctx.globalAlpha = N;
      let gr = ctx.createRadialGradient(sunX, my, mr * .6, sunX, my, mr * 3); gr.addColorStop(0, 'rgba(255,241,184,.5)'); gr.addColorStop(1, 'rgba(255,241,184,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(sunX, my, mr * 3, 0, TAU); ctx.fill();
      ctx.fillStyle = '#FFF3C4'; ctx.beginPath(); ctx.arc(sunX, my, mr, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(214,188,116,.55)'; [[-.3, -.25, .22], [.32, .1, .16], [-.1, .42, .13]].forEach(q => { ctx.beginPath(); ctx.arc(sunX + q[0] * mr, my + q[1] * mr, q[2] * mr, 0, TAU); ctx.fill(); }); }
    ctx.restore(); ctx.globalAlpha = 1;

    /* seagulls */
    if (N < .95) for (let k = 0; k < 2; k++) {
      const Pk = 19 + k * 11, tt = t + 4 + k * 8, cyc = Math.floor(tt / Pk), u = (tt - cyc * Pk) / (Pk * .6); if (u > 1) continue;
      const x = lerp(-24, W + 24, u), y = skyH + 46 + ((cyc * 53 + k * 29) % 100) / 100 * (H - skyH - botPad - 70) + Math.sin(t * 1.3 + k) * 8;
      const f = Math.sin(t * 8 + k * 2), w = 8 * U, wy = (-4.5 - 3.5 * f) * U;
      ctx.globalAlpha = 1 - N; ctx.beginPath(); ctx.moveTo(x - w, y + wy * .25); ctx.quadraticCurveTo(x - w * .45, y + wy, x, y); ctx.quadraticCurveTo(x + w * .45, y + wy, x + w, y + wy * .25);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1F1812'; ctx.lineWidth = 3.6 * U; ctx.stroke(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.9 * U; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  /* ---------- loop, input, start ---------- */
  let raf = 0, last = 0, visible = !document.hidden, onscreen = true;
  function frame(ts) { raf = 0; if (!visible || !onscreen) return; const dt = Math.min(.05, last ? (ts - last) / 1000 : 0); last = ts; now += dt; step(dt); draw(); raf = requestAnimationFrame(frame); }
  function kick() { if (reduce) { step(0); draw(); return; } if (!raf && visible && onscreen) { last = 0; raf = requestAnimationFrame(frame); } }
  cv.addEventListener('click', e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; if (y < skyH - 12) return;
    const wx = (x - W / 2) / cam.z + cam.x, wy = (y - H / 2) / cam.z + cam.y; ctx.setTransform(1, 0, 0, 1, 0, 0);
    let hit = -1; for (let i = 0; i < paths.length; i++) if (paths[i] && ctx.isPointInPath(paths[i], wx, wy)) { hit = i; break; }
    if (hit < 0) { let best = (phone ? 24 : 18) / cam.z; for (let i = 0; i < bbox.length; i++) { const b = bbox[i]; if (!b) continue; const d = Math.hypot(Math.max(b.x0 - wx, 0, wx - b.x1), Math.max(b.y0 - wy, 0, wy - b.y1)); if (d < best) { best = d; hit = i; } } }
    if (hit >= 0) select(hit);
  });
  const showAll = () => { if (!done) otSpeed = 45; kick(); };
  bAgain.addEventListener('click', restart); bAll.addEventListener('click', showAll); bHome.addEventListener('click', goHome);
  todBtns.forEach(b => b.addEventListener('click', () => setPin(b.dataset.t)));
  function relayout() { layout(); const c = sel >= 0 && selT === 1 ? prefCam(sel) : homeCam(); cam.x = c.x; cam.y = c.y; cam.z = c.z; camA = null; CL = build(c.z); CLold = null; trans = null; count(true); kick(); }
  layout(); { const c = homeCam(); cam.x = c.x; cam.y = c.y; } CL = build(1);
  oji.x = oji.dx = phone ? -50 : 330; oji.y = laneY; oji.s = drS;
  if (reduce) { ot = OPEN + 1; bAgain.style.display = 'none'; pin = 'day'; todBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === 'day'))); }
  count(true); ui();
  let rz = 0;
  if ('ResizeObserver' in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(() => { const r = root.getBoundingClientRect(); if (Math.round(r.width) !== W || Math.round(r.height) !== H) relayout(); }, 120); }).observe(root);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) kick(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { onscreen = es[es.length - 1].isIntersecting; if (onscreen) kick(); }).observe(root);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (reduce) kick(); });
  kick();
  return { restart, showAll, select, home: goHome, pin: setPin, state: () => ({ ot, done, sel, N, G, z: cam.z, clusters: CL.length, shown }) };
}
