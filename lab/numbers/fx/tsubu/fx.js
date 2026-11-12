/* つぶつぶ変身: つぶ ひとつ = お店 ひとつ。
   initFx(rootEl, data, jp, opts) だけで完結。opts = { plot(W,H) -> {x,y,w,h}, onScene(i, api), reduced } */
function initFx(rootEl, data, jp, opts) {
  opts = opts || {};
  /* 色はここだけ。入れかえたいときは full と opt を入れかえる */
  const COL = { full: '#5E8C52', opt: '#D4A847', ink: '#1F1812', inkSoft: '#3C2E22', royal: '#C9223A', goldDeep: '#8A6D1C', leafDeep: '#3F6A3A', halo: 'rgba(255,249,238,.94)' };
  const LON0 = 128.3, LON1 = 149.0, LAT0 = 30.0, LAT1 = 45.6, K = Math.cos(38 * Math.PI / 180), TAU = Math.PI * 2;
  const REGIONS = [['北海道', '北海道'], ['東北', '青森 岩手 宮城 秋田 山形 福島'], ['関東', '茨城 栃木 群馬 埼玉 千葉 東京 神奈川'],
    ['中部', '新潟 富山 石川 福井 山梨 長野 岐阜 静岡 愛知'], ['近畿', '三重 滋賀 京都 大阪 兵庫 奈良 和歌山'], ['中国', '鳥取 島根 岡山 広島 山口'],
    ['四国', '徳島 香川 愛媛 高知'], ['九州・沖縄', '福岡 佐賀 長崎 熊本 大分 宮崎 鹿児島 沖縄']];
  const reduced = opts.reduced != null ? opts.reduced : matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = v => v.toLocaleString('ja-JP'), clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  let seed = 20261112; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const FR = '"Zen Maru Gothic","Noto Sans JP",sans-serif', FS = '"Noto Sans JP",sans-serif';
  const font = (w, px, fam) => w + ' ' + px + 'px ' + (fam || FR);

  /* ---------- データ（数字はぜんぶ ここで数える） ---------- */
  const prefName = data.pref.map(p => p[0]);
  const regOfPref = prefName.map(nm => { const s = nm.replace(/[都府県]$/, ''); return REGIONS.findIndex(r => r[1].split(' ').includes(s)); });
  const D = data.pts.filter(p => p[2] !== 2).map(p => ({ la: p[0], lo: p[1], pr: p[3], full: p[2] === 3 || p[2] === 4, inset: p[0] < 29.6 && p[1] < 131.6 }));
  const n = D.length;
  const prefCount = prefName.map(() => [0, 0]);
  const regions = REGIONS.map((r, k) => ({ name: r[0], count: 0, full: 0, k }));
  D.forEach((d, i) => { d.i = i; d.reg = regOfPref[d.pr]; d.ph = rnd() * TAU; d.rn = rnd(); prefCount[d.pr][0]++; regions[d.reg].count++; if (d.full) { prefCount[d.pr][1]++; regions[d.reg].full++; } });
  const ranked = prefName.map((nm, i) => ({ name: nm, i, count: prefCount[i][0], full: prefCount[i][1] })).sort((a, b) => b.count - a.count);
  const TOPN = 10, top = ranked.slice(0, TOPN), rest = ranked.slice(TOPN);
  const other = { name: 'その他' + rest.length + (rest.every(r => /県$/.test(r.name)) ? '県' : '都道府県'), n: rest.length, count: rest.reduce((s, r) => s + r.count, 0), full: rest.reduce((s, r) => s + r.full, 0) };
  const fullN = D.reduce((s, d) => s + (d.full ? 1 : 0), 0);
  const stats = { total: n, full: fullN, opt: n - fullN, regions, top, other, oneIn: Math.round(n / fullN),
    topShare: Math.round(top.reduce((s, r) => s + r.count, 0) / n * 100), topRegion: regions.slice().sort((a, b) => b.count - a.count)[0] };
  const barOfPref = prefName.map(() => TOPN); top.forEach((t, r) => { barOfPref[t.i] = r; });
  D.forEach(d => { d.bar = barOfPref[d.pr]; });
  const byBar = D.slice().sort((a, b) => a.bar - b.bar || (b.full - a.full) || a.lo - b.lo);
  const byWaffle = D.slice().sort((a, b) => (b.full - a.full) || a.bar - b.bar || a.lo - b.lo);
  const gi = [], fi = []; D.forEach(d => (d.full ? fi : gi).push(d.i));

  /* ---------- キャンバス ---------- */
  const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; rootEl.prepend(cv);
  const ctx = cv.getContext('2d'), land = document.createElement('canvas');
  let W = 0, H = 0, dpr = 1, P = { x: 0, y: 0, w: 0, h: 0 }, small = false, L = [], scatter = null, fin = { x: 0, y: 0 };
  const F = () => new Float32Array(n), cx = F(), cy = F(), cr = F(), sx = F(), sy = F(), sr = F(), tx = F(), ty = F(), tr = F(), kx = F(), ky = F(), dl = F();
  const textW = parts => { let w = 0; for (const p of parts) { ctx.font = p[2]; w += ctx.measureText(p[0]).width; } return w; };
  const put = (pos, d, x, y, r) => { pos[3 * d.i] = x; pos[3 * d.i + 1] = y; pos[3 * d.i + 2] = r; };

  /* 1. 日本地図 */
  function layMap() {
    const s = Math.min(P.w / ((LON1 - LON0) * K), P.h / (LAT1 - LAT0)), mw = (LON1 - LON0) * K * s, mh = (LAT1 - LAT0) * s;
    const OX = P.x + (P.w - mw) / 2, OY = P.y + (P.h - mh) / 2, si = s * .62, IX = OX + 2, IY = OY + 2, IW = (131.6 - 122.9) * K * si + 28, IH = (29.6 - 24.0) * si + 42;
    const pm = (lo, la) => [OX + (lo - LON0) * K * s, OY + (LAT1 - la) * s], pi = (lo, la) => [IX + 14 + (lo - 122.9) * K * si, IY + 30 + (29.6 - la) * si];
    const pos = new Float32Array(3 * n), rr = clamp(s * .062, 1.4, 2.7);
    D.forEach(d => { const q = d.inset ? pi(d.lo, d.la) : pm(d.lo, d.la); d.mx = q[0]; d.my = q[1]; put(pos, d, q[0], q[1], rr); });
    land.width = W * dpr; land.height = H * dpr; const g = land.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const all = new Path2D();
    jp.forEach(([id, rings]) => rings.forEach(rg => {
      let maxLa = -90, minLo = 999; for (let i = 0; i < rg.length; i += 2) { const lo = (rg[i] + 122000) / 1000, la = (rg[i + 1] + 24000) / 1000; if (la > maxLa) maxLa = la; if (lo < minLo) minLo = lo; }
      const ins = maxLa < 29.6 && minLo < 131.6;
      for (let i = 0; i < rg.length; i += 2) { const lo = (rg[i] + 122000) / 1000, la = (rg[i + 1] + 24000) / 1000, q = ins ? pi(lo, la) : pm(lo, la); i ? all.lineTo(q[0], q[1]) : all.moveTo(q[0], q[1]); }
      all.closePath();
    }));
    g.lineJoin = 'round'; g.strokeStyle = 'rgba(60,46,34,.42)'; g.lineWidth = small ? 2 : 2.6; g.stroke(all);
    g.fillStyle = '#FFFDF7'; g.fill(all); g.strokeStyle = 'rgba(120,97,72,.2)'; g.lineWidth = .8; g.stroke(all);
    g.setLineDash([5, 5]); g.strokeStyle = 'rgba(120,97,72,.65)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(IX, IY, IW, IH, 12); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#786148'; g.font = font(700, 16); g.textBaseline = 'top'; g.fillText('沖縄・奄美', IX + 10, IY + 8);
    return { pos, labels: [] };
  }

  /* 2. 地方ごと: ひまわりの種ならべ。まんなかの緑 = まるごとヴィーガン */
  function layRegions() {
    const A = regions.map(() => [0, 0, 0]); D.forEach(d => { if (!d.inset) { const a = A[d.reg]; a[0] += d.mx; a[1] += d.my; a[2]++; } });
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    A.forEach(a => { a[0] /= a[2]; a[1] /= a[2]; x0 = Math.min(x0, a[0]); x1 = Math.max(x1, a[0]); y0 = Math.min(y0, a[1]); y1 = Math.max(y1, a[1]); });
    const nPx = small ? 17 : 22, cPx = small ? 22 : 31, nameF = font(900, nPx), cntF = font(900, cPx, FS), kenF = font(700, small ? 16 : 20), lh = nPx + cPx + 8, gap = 5, pad = small ? 7 : 14;
    const B = regions.map((rg, k) => ({ k, m: rg.count, lw: Math.max(textW([[rg.name, 0, nameF]]), textW([[fmt(rg.count), 0, cntF], ['軒', 0, kenF]])) + 8,
      ax: P.x + P.w * (.14 + .72 * (A[k][0] - x0) / (x1 - x0)), ay: P.y + P.h * (.2 + .68 * (A[k][1] - y0) / (y1 - y0)), x: 0, y: 0, R: 0 }));
    const rc = (a, b) => { const ry1 = a.y - a.R - gap, qx = clamp(b.x, a.x - a.lw / 2, a.x + a.lw / 2), qy = clamp(b.y, ry1 - lh, ry1); return b.R + pad * .6 - Math.hypot(b.x - qx, b.y - qy); };
    const overlap = (a, b) => {
      let o = Math.max(a.R + b.R + pad - Math.hypot(a.x - b.x, a.y - b.y), rc(a, b), rc(b, a));
      const ox = (a.lw + b.lw) / 2 + pad - Math.abs(a.x - b.x), oy = lh + pad * .5 - Math.abs((a.y - a.R) - (b.y - b.R));
      if (ox > 0 && oy > 0) o = Math.max(o, Math.min(ox, oy));
      return o;
    };
    const worst = () => { let w = 0; for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) w = Math.max(w, overlap(B[i], B[j])); return w; };
    const trial = sp => {
      const c = sp / 1.77; B.forEach(b => { b.R = c * Math.sqrt(b.m) + sp * .5; b.x = b.ax; b.y = b.ay; });
      for (let it = 0; it < 700; it++) {
        for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
          const a = B[i], b = B[j], ov = overlap(a, b); if (ov <= 0) continue;
          const dx = b.x - a.x || .01, dy = b.y - a.y, d = Math.hypot(dx, dy), px = dx / d * (ov / 2 + .2), py = dy / d * (ov / 2 + .2);
          a.x -= px; a.y -= py; b.x += px; b.y += py;
        }
        B.forEach(b => { const hw = Math.max(b.R, b.lw / 2); b.x += (b.ax - b.x) * .01; b.y += (b.ay - b.y) * .01; b.x = clamp(b.x, P.x + hw, P.x + P.w - hw); b.y = clamp(b.y, P.y + b.R + gap + lh, P.y + P.h - b.R); });
      }
      return worst();
    };
    let sp = Math.sqrt(P.w * P.h / n) * .86; while (sp > 1.6 && trial(sp) > pad * .55) sp *= .96;
    const pos = new Float32Array(3 * n), labels = [], c = sp / 1.77, rr = sp * .41, ang = (x, y, ox, oy) => Math.atan2(y - oy, x - ox);
    B.forEach(b => {
      const mem = D.filter(d => d.reg === b.k), slots = [], fN = regions[b.k].full;
      for (let i = 0; i < b.m; i++) { const rad = c * Math.sqrt(i + .5), th = i * 2.399963; slots.push([b.x + rad * Math.cos(th), b.y + rad * Math.sin(th)]); }
      [[mem.filter(d => d.full), slots.slice(0, fN)], [mem.filter(d => !d.full), slots.slice(fN)]].forEach(([ds, ss]) => {
        ds.sort((p, q) => ang(p.mx, p.my, A[b.k][0], A[b.k][1]) - ang(q.mx, q.my, A[b.k][0], A[b.k][1]));
        ss.sort((p, q) => ang(p[0], p[1], b.x, b.y) - ang(q[0], q[1], b.x, b.y));
        ds.forEach((d, j) => put(pos, d, ss[j][0], ss[j][1], rr));
      });
      const base = b.y - b.R - gap - 3;
      labels.push({ parts: [[regions[b.k].name, COL.ink, nameF]], x: b.x, y: base - cPx - 2, align: 'c' },
        { parts: [[fmt(b.m), COL.royal, cntF], ['軒', COL.ink, kenF]], x: b.x, y: base, align: 'c' });
    });
    return { pos, labels, sp };
  }

  /* 3. 都道府県ランキング: つぶの棒グラフ（どの棒も 同じ大きさのつぶ） */
  function layBars() {
    const groups = top.concat([other]), G = groups.length, fpx = small ? 16 : 20, labH = fpx + 9, gapY = small ? 7 : 12, maxC = Math.max.apply(null, groups.map(g => g.count));
    let R = 3, sp = 0; for (let r = 3; r <= 26; r++) { const s = Math.min(P.w / Math.ceil(maxC / r), (P.h / G - labH - gapY) / r); if (s > sp) { sp = s; R = r; } }
    sp = Math.min(sp, 9);
    const rowH = labH + R * sp + gapY, y0 = P.y + (P.h - (rowH * G - gapY)) / 2, rr = sp * .41, pos = new Float32Array(3 * n), labels = [];
    const bw = Math.ceil(maxC / R) * sp, bx = P.x + Math.max(0, (P.w - bw) / 2) * (small ? 1 : .35);
    let idx = 0;
    groups.forEach((g, r) => {
      const yt = y0 + r * rowH;
      for (let j = 0; j < g.count; j++, idx++) put(pos, byBar[idx], bx + sp * (((j / R) | 0) + .5), yt + labH + sp * (j % R + .5), rr);
      labels.push({ parts: [[r < TOPN ? (r + 1) + '位 ' : '', COL.royal, font(900, fpx)], [g.name + ' ', COL.ink, font(900, fpx)], [fmt(g.count), COL.royal, font(900, fpx + 2, FS)], ['軒', COL.ink, font(700, fpx)]], x: bx, y: yt + labH - 7, align: 'l' });
    });
    return { pos, labels, R, sp };
  }

  /* 4. まるごとヴィーガンは何軒？: 緑を まえに ならべた ワッフル */
  function layWaffle() {
    const f = stats.full, o = stats.opt, fpx = small ? 16 : 21, labH = fpx + 13, mid = small ? 8 : 16;
    const num = v => [[fmt(v), COL.ink, font(900, fpx + 3, FS)], ['軒', COL.ink, font(700, fpx)]];
    const lf = [['お店まるごとヴィーガン ', COL.leafDeep, font(900, fpx)]].concat(num(f)), lo = [['ヴィーガンメニューあり ', COL.goldDeep, font(900, fpx)]].concat(num(o));
    const note = [['およそ' + stats.oneIn + '軒に1軒', COL.royal, font(900, fpx)]];
    const two = textW(lf) + textW(note) + 16 > P.w, head = labH * (two ? 2 : 1), availH = P.h - head - labH - mid;
    let cols = 12, sp = 0; for (; cols < 400; cols++) { sp = Math.min(P.w / cols, 22); if ((Math.ceil(f / cols) + Math.ceil(o / cols)) * sp <= availH) break; }
    const rf = Math.ceil(f / cols), ro = Math.ceil(o / cols), gw = cols * sp, x0 = P.x + (P.w - gw) / 2, y0 = P.y + (P.h - (head + rf * sp + mid + labH + ro * sp)) / 2;
    const yf = y0 + head, yo = yf + rf * sp + mid + labH, rr = sp * .41, pos = new Float32Array(3 * n);
    byWaffle.forEach((d, j) => { const g = j < f, q = g ? j : j - f; put(pos, d, x0 + sp * (q % cols + .5), (g ? yf : yo) + sp * (((q / cols) | 0) + .5), rr); });
    const labels = [{ parts: lf, x: x0, y: y0 + labH - 9, align: 'l' }, { parts: lo, x: x0, y: yo - 9, align: 'l' },
      two ? { parts: note, x: x0, y: y0 + 2 * labH - 9, align: 'l' } : { parts: note, x: x0 + gw, y: y0 + labH - 9, align: 'r' }];
    return { pos, labels, cols, sp };
  }

  /* 5. フィナーレ: つぶで 数字を かく */
  function layFinale() {
    const txt = fmt(n), kenPx = clamp(P.w * .13, 44, 120), gapK = kenPx * .1, targetW = P.w * .97 - kenPx - gapK;
    const m = document.createElement('canvas'), g = m.getContext('2d', { willReadFrequently: true });
    g.font = '900 200px ' + FS; let mt = g.measureText(txt);
    const fs = 200 * targetW / (mt.actualBoundingBoxLeft + mt.actualBoundingBoxRight); g.font = '900 ' + fs + 'px ' + FS; mt = g.measureText(txt);
    const asc = mt.actualBoundingBoxAscent, gh = asc + mt.actualBoundingBoxDescent, st = clamp(P.h * .56 / gh, 1, small ? 1.9 : 1.25);
    const mw = Math.ceil(targetW) + 4, mh = Math.ceil(gh * st) + 4; m.width = mw; m.height = mh;
    g.font = '900 ' + fs + 'px ' + FS; g.fillStyle = '#000'; g.setTransform(1, 0, 0, st, 0, 0); g.fillText(txt, 2 + mt.actualBoundingBoxLeft, 2 / st + asc);
    const im = g.getImageData(0, 0, mw, mh).data, inside = (x, y) => im[((y | 0) * mw + (x | 0)) * 4 + 3] > 120;
    const sample = gs => { const pts = []; let j = 0; for (let y = gs * .5; y < mh; y += gs * .866, j++) for (let x = (j & 1 ? gs : gs * .5); x < mw; x += gs) if (inside(x, y)) pts.push([x, y]); return pts; };
    let lo = .5, hi = 40; for (let it = 0; it < 32; it++) { const md = (lo + hi) / 2; if (sample(md).length >= n) lo = md; else hi = md; }
    let pts = sample(lo); const ex = pts.length - n;
    if (ex > 0) { const keep = []; let acc = 0; pts.forEach(p => { acc += ex; if (acc >= pts.length) acc -= pts.length; else keep.push(p); }); pts = keep; }
    const subPx = small ? 17 : 23, x0 = P.x + (P.w - (targetW + gapK + kenPx)) / 2, y0 = P.y + (P.h - mh - subPx - 22) / 2, pos = new Float32Array(3 * n), rr = lo * .47;
    byWaffle.forEach((d, j) => { const p = pts[Math.min(j, pts.length - 1)]; put(pos, d, x0 + p[0] - 2, y0 + p[1] - 2, rr); });
    fin = { x: x0 + targetW / 2, y: y0 + mh / 2 };
    return { pos, sp: lo, labels: [{ parts: [['軒', COL.ink, font(900, kenPx)]], x: x0 + targetW + gapK, y: y0 + asc * st, align: 'l' },
      { parts: [['日本で 見つけた ヴィーガンのお店', COL.inkSoft, font(700, subPx)]], x: P.x + P.w / 2, y: y0 + mh + subPx + 18, align: 'c' }] };
  }

  /* 0. ばらばら（はじまり） */
  function layScatter() {
    const pos = new Float32Array(3 * n), r0 = L[0].pos[2];
    D.forEach(d => put(pos, d, (rnd() * 1.1 - .05) * W, (rnd() * 1.1 - .05) * H, r0 * (.7 + rnd() * .9)));
    return { pos, labels: [] };
  }

  function build() {
    const b = rootEl.getBoundingClientRect(); W = Math.round(b.width); H = Math.round(b.height); if (!W || !H) return false;
    dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr;
    P = opts.plot ? opts.plot(W, H) : { x: 16, y: 16, w: W - 32, h: H - 32 }; small = P.w < 560;
    L = [layMap()]; L.push(layRegions(), layBars(), layWaffle(), layFinale()); scatter = layScatter();
    return true;
  }

  /* ---------- うごき ---------- */
  const NS = 5, SPREAD = .78, TRAVEL = 1.15, NOISE = .1, la = new Float32Array(NS);
  let scene = -1, raf = 0, running = false, started = false, t0 = 0, dur = 0, travel = TRAVEL, flip = 1, clock = 0, last = 0, hiddenAt = 0, mapA = 0, token = 0, breatheAt = 0;
  const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const setCur = Lk => { for (let i = 0; i < n; i++) { cx[i] = Lk.pos[3 * i]; cy[i] = Lk.pos[3 * i + 1]; cr[i] = Lk.pos[3 * i + 2]; } };

  /* いまの場所から つぎの形へ。とちゅうで押されても いまの場所から出発するので ワープしない */
  function launch(Lk, o) {
    o = o || {}; const spread = o.spread != null ? o.spread : SPREAD, a = o.angle || 0, ux = Math.cos(a), uy = Math.sin(a); let lo = 1e9, hi = -1e9;
    travel = o.travel || TRAVEL; flip = -flip;
    for (let i = 0; i < n; i++) {
      sx[i] = cx[i]; sy[i] = cy[i]; sr[i] = cr[i]; tx[i] = Lk.pos[3 * i]; ty[i] = Lk.pos[3 * i + 1]; tr[i] = Lk.pos[3 * i + 2];
      const pj = sx[i] * ux + sy[i] * uy; dl[i] = pj; if (pj < lo) lo = pj; if (pj > hi) hi = pj;
    }
    for (let i = 0; i < n; i++) {
      const d = D[i], dx = tx[i] - sx[i], dy = ty[i] - sy[i], curl = (.14 + d.rn * .2) * flip;
      dl[i] = (o.random ? d.rn : (dl[i] - lo) / ((hi - lo) || 1)) * spread + d.ph / TAU * NOISE;
      kx[i] = (sx[i] + tx[i]) / 2 - dy * curl; ky[i] = (sy[i] + ty[i]) / 2 + dx * curl;
    }
    dur = spread + NOISE + travel; t0 = performance.now(); running = true; kick();
  }

  function frame(now) {
    const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now; clock += dt; let prog = 1, busy = false;
    if (running) {
      const t = (now - t0) / 1000; prog = clamp(t / dur, 0, 1); busy = true;
      for (let i = 0; i < n; i++) {
        const u = clamp((t - dl[i]) / travel, 0, 1), e = ease(u), m = 1 - e, ph = D[i].ph, wob = Math.sin(e * Math.PI) * 2.2;
        cx[i] = m * m * sx[i] + 2 * m * e * kx[i] + e * e * tx[i] + Math.sin(ph + e * 7) * wob;
        cy[i] = m * m * sy[i] + 2 * m * e * ky[i] + e * e * ty[i] + Math.cos(ph * 1.3 + e * 6) * wob;
        cr[i] = sr[i] + (tr[i] - sr[i]) * e;
      }
      if (t >= dur) { running = false; breatheAt = now; }
    } else if (scene === NS - 1 && started) {
      /* フィナーレ: そっと 息をする */
      const Lk = L[NS - 1], k = clamp((now - breatheAt) / 1600, 0, 1), s = 1 + Math.sin(clock * .9) * .012 * k, amp = Math.max(.35, Lk.sp * .17) * k;
      for (let i = 0; i < n; i++) {
        const ph = D[i].ph, x = Lk.pos[3 * i], y = Lk.pos[3 * i + 1];
        cx[i] = fin.x + (x - fin.x) * s + Math.sin(clock * 1.3 + ph) * amp; cy[i] = fin.y + (y - fin.y) * s + Math.cos(clock * 1.1 + ph * 1.7) * amp;
        cr[i] = Lk.pos[3 * i + 2] * (1 + Math.sin(clock * 1.7 + ph) * .1 * k);
      }
      busy = true;
    }
    for (let k = 0; k < NS; k++) {
      const tg = k === scene && (!running || prog > .7) ? 1 : 0;
      if (la[k] !== tg) { la[k] = tg > la[k] ? Math.min(1, la[k] + dt / .4) : Math.max(0, la[k] - dt / .2); busy = true; }
    }
    const mt = scene === 0 ? 1 : 0; if (mapA !== mt) { mapA = mt > mapA ? Math.min(1, mapA + dt / .9) : Math.max(0, mapA - dt / .45); busy = true; }
    draw();
    raf = busy && !document.hidden ? requestAnimationFrame(frame) : 0;
  }
  function kick() { if (!raf && !document.hidden && started) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    if (mapA > .01) { ctx.globalAlpha = mapA; ctx.drawImage(land, 0, 0, W, H); }
    ctx.globalAlpha = .94;
    [[gi, COL.opt], [fi, COL.full]].forEach(([list, col]) => {
      ctx.fillStyle = col; ctx.beginPath();
      for (let j = 0; j < list.length; j++) { const i = list[j], r = cr[i]; ctx.moveTo(cx[i] + r, cy[i]); ctx.arc(cx[i], cy[i], r, 0, TAU); }
      ctx.fill();
    });
    ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = COL.halo;
    for (let k = 0; k < L.length; k++) {
      if (la[k] < .01) continue; ctx.globalAlpha = la[k];
      for (const lb of L[k].labels) {
        const w = textW(lb.parts), x0 = lb.align === 'c' ? lb.x - w / 2 : lb.align === 'r' ? lb.x - w : lb.x;
        for (let pass = 0; pass < 2; pass++) { let x = x0; for (const p of lb.parts) { ctx.font = p[2]; if (pass) { ctx.fillStyle = p[1]; ctx.fillText(p[0], x, lb.y); } else ctx.strokeText(p[0], x, lb.y); x += ctx.measureText(p[0]).width; } }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- そうさ ---------- */
  const ANG = [0, 2.36, 1.57, 1.57, 0];
  function show(k) { if (reduced) { running = false; setCur(L[k]); la.fill(0); la[k] = 1; mapA = k === 0 ? 1 : 0; draw(); } }
  function go(k, o) {
    if (!started) return; k = clamp(k | 0, 0, NS - 1); if (k === scene && !(o && o.force)) return;
    token++; scene = k; if (reduced) show(k); else launch(L[k], Object.assign({ angle: ANG[k] }, o));
    if (opts.onScene) opts.onScene(k, api);
  }
  function enter(wait) { const tk = ++token; setTimeout(() => { if (tk === token) launch(L[0], { random: true, spread: .95, travel: 1.2 }); }, wait); }
  function start() {
    if (started || !build()) return; started = true; setCur(scatter); scene = 0; draw(); if (opts.onScene) opts.onScene(0, api);
    if (reduced) show(0); else { kick(); enter(450); }
  }
  function replay() {
    if (!started) return; scene = 0; if (opts.onScene) opts.onScene(0, api);
    if (reduced) return show(0);
    launch(scatter, { spread: .45, travel: .9, angle: 1.57 }); enter(dur * 1000 + 200);
  }
  function resize() { if (!started) return; const k = clamp(scene, 0, NS - 1); if (!build()) return; running = false; token++; setCur(L[k]); breatheAt = performance.now(); if (reduced) show(k); else { draw(); kick(); } }
  let rt = 0; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { const b = rootEl.getBoundingClientRect(); if (Math.round(b.width) !== W || Math.round(b.height) !== H) resize(); }, 140); }).observe(rootEl);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; hiddenAt = performance.now(); }
    else { const gap = performance.now() - hiddenAt; if (running) t0 += gap; breatheAt += gap; kick(); }
  });
  const sum = a => a.reduce((s, r) => s + r.count, 0);
  const api = { stats, count: NS, start, go, replay, resize, next: () => go(scene + 1), prev: () => go(scene - 1),
    get scene() { return scene; }, get busy() { return !started || running || la[Math.max(0, scene)] < 1; },
    check: () => ({ dots: n, regionSum: sum(regions), barSum: sum(top) + other.count, waffleSum: stats.full + stats.opt, finite: L.every(l => l.pos.every(Number.isFinite)), plot: P, sp: L.map(l => +(l.sp || l.pos[2]).toFixed(2)), r: L.map(l => +l.pos[2].toFixed(2)) }) };
  return api;
}
