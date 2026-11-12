// 立体ジャパン: initFx(rootEl, data, jp, opts) — 紙の模型みたいな日本にお店の柱が立つ
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const KX = 0.809, LON0 = 136.5, LAT0 = 36, TOP = 0.21, END = 20;
const PX = lon => (lon - LON0) * KX, PZ = lat => LAT0 - lat;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = t => { const c = 1.5, u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; };
const hOf = n => 0.10 + 0.20 * Math.sqrt(n);
function rng(seed) {
  return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function hexKey(x, z, s) {
  const hh = s * 0.866, r0 = Math.floor(z / hh); let best = '', bd = 1e9;
  for (let r = r0; r <= r0 + 1; r++) {
    const off = (r & 1) * 0.5, c = Math.round(x / s - off), d = (x - (c + off) * s) ** 2 + (z - r * hh) ** 2;
    if (d < bd) { bd = d; best = c + ',' + r; }
  }
  return best;
}
function binPts(pts, s, r0) {
  const m = new Map();
  for (const p of pts) {
    const k = hexKey(p.x, p.z, s); let b = m.get(k);
    if (!b) m.set(k, b = { x: 0, z: 0, n: 0, full: 0, pc: {} });
    b.x += p.x; b.z += p.z; b.n++; if (p.full) b.full++; b.pc[p.pref] = (b.pc[p.pref] || 0) + 1;
  }
  const out = [...m.values()];
  for (const b of out) { b.x /= b.n; b.z /= b.n; b.h = hOf(b.n); b.f = b.full / b.n; b.r = r0 * (0.72 + 0.28 * Math.min(1, b.n / 12)); b.pref = +Object.keys(b.pc).sort((u, v) => b.pc[v] - b.pc[u])[0]; }
  return out;
}
function ringArea(r) { let a = 0; for (let i = 0, n = r.length; i < n; i++) { const p = r[i], q = r[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a) / 2; }
function prepGeo(jp) {
  return jp.map(([id, rings]) => {
    let rs = rings.map(r => { const o = []; for (let i = 0; i < r.length; i += 2) o.push([PX(r[i] / 1000 + 122), PZ(r[i + 1] / 1000 + 24)]); return o; }).filter(r => r.length >= 3);
    rs.sort((a, b) => ringArea(b) - ringArea(a));
    return { idx: id - 1, rings: rs };
  });
}
const CSS = `
.rt-root{position:relative;overflow:hidden;border-radius:22px;border:2.5px solid #1F1812;box-shadow:4px 4px 0 #1F1812;background:linear-gradient(180deg,#FFE9CF 0%,#FFF3E0 30%,#FFF9EE 100%);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.rt-root canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab;outline:none}
.rt-root canvas.rt-drag{cursor:grabbing}
.rt-labels{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.rt-lab{position:absolute;left:0;top:0;font:900 16px/1 "Zen Maru Gothic","Noto Sans JP",sans-serif;color:#1F1812;background:#FFF9EE;border:2px solid #1F1812;border-radius:999px;padding:5px 11px 6px;white-space:nowrap;opacity:0;transition:opacity .3s}
.rt-lab::after{content:"";position:absolute;left:calc(50% + var(--lx,0px));top:100%;width:2px;height:var(--lh,10px);margin-left:-1px;background:#1F1812}
.rt-count{position:absolute;left:12px;top:12px;pointer-events:none;background:rgba(255,249,238,.92);border:2.5px solid #1F1812;border-radius:18px;box-shadow:3px 3px 0 #1F1812;padding:7px 14px 8px;font-family:"Zen Maru Gothic","Noto Sans JP",sans-serif;color:#1F1812;line-height:1}
.rt-count small{display:block;font:700 14px/1.2 "Noto Sans JP",sans-serif;margin-bottom:3px}
.rt-count b{display:block;white-space:nowrap;font-weight:900;font-size:26px}
.rt-count b span{font-size:46px;color:#C9223A;font-variant-numeric:tabular-nums;letter-spacing:-.01em;margin-right:2px}
.rt-zoom{position:absolute;right:12px;bottom:12px;display:flex;flex-direction:column;gap:10px}
.rt-zoom button{width:46px;height:46px;border-radius:14px;border:2.5px solid #1F1812;background:#FFF9EE;box-shadow:3px 3px 0 #1F1812;font:900 24px/1 "Zen Maru Gothic",sans-serif;color:#1F1812;cursor:pointer;padding:0}
.rt-zoom button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #1F1812}
.rt-hint{position:absolute;left:12px;bottom:12px;max-width:calc(100% - 82px);pointer-events:none;background:rgba(255,249,238,.9);border-radius:999px;padding:7px 13px;font:700 14px/1.3 "Noto Sans JP",sans-serif;color:#1F1812;transition:opacity .5s}
@media (max-width:600px){.rt-count{padding:5px 12px 7px;border-radius:16px}.rt-count small{display:none}.rt-count b{font-size:22px}.rt-count b span{font-size:40px}}
@media (min-width:900px){.rt-lab{font-size:18px}.rt-count b span{font-size:60px}.rt-count b{font-size:30px}.rt-count small{font-size:15px}.rt-hint{font-size:15px}}
`;
function buildDom(rootEl) {
  if (!document.getElementById('rt-css')) { const st = document.createElement('style'); st.id = 'rt-css'; st.textContent = CSS; document.head.appendChild(st); }
  rootEl.classList.add('rt-root'); rootEl.innerHTML = '';
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; rootEl.appendChild(e); return e; };
  const cv = mk('canvas'); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', '日本の立体地図。お店の数だけ柱がのびています');
  const labels = mk('div', 'rt-labels');
  const count = mk('div', 'rt-count', '<small>ビーガン対応のお店</small><b><span>0</span>軒</b>');
  const hint = mk('div', 'rt-hint', 'ドラッグでまわす・県をタップ');
  const zoom = mk('div', 'rt-zoom', '<button type="button" aria-label="大きくする">＋</button><button type="button" aria-label="小さくする">－</button>');
  return { cv, labels, count, num: count.querySelector('span'), hint, zoom };
}
// WebGLが使えないとき用の、止まった絵
function drawStill(cv, geo, bins) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext('2d'); if (!g) return; g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const az = H > W * 1.05 ? -0.72 : 0.6, ca = Math.cos(az), sa = Math.sin(az), ct = 0.66, st = 0.75;
  const U = (x, z) => x * ca - z * sa, V = (x, z) => -x * sa - z * ca;
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (const p of geo) for (const r of p.rings) for (const q of r) { const u = U(q[0], q[1]), v = V(q[0], q[1]) * ct; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
  const S = Math.min(W * 0.9 / (u1 - u0), H * 0.7 / (v1 - v0 + 2)), cx = W / 2 - S * (u0 + u1) / 2, cy = H * 0.56 + S * (v0 + v1) / 2;
  const sx = (x, z) => cx + S * U(x, z), sy = (x, z, y = 0) => cy - S * (V(x, z) * ct + y * st);
  const sea = g.createRadialGradient(W / 2, H * 0.55, 10, W / 2, H * 0.55, Math.max(W, H) * 0.62);
  sea.addColorStop(0, '#C4E2E8'); sea.addColorStop(0.6, '#D8ECEC'); sea.addColorStop(1, 'rgba(255,249,238,0)');
  g.fillStyle = sea; g.fillRect(0, 0, W, H);
  const path = (r, dy) => { g.beginPath(); r.forEach((q, i) => { const X = sx(q[0], q[1]), Y = sy(q[0], q[1]) + dy; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.closePath(); };
  g.fillStyle = '#D8C39A'; for (const p of geo) for (const r of p.rings) { path(r, 4); g.fill(); }
  g.fillStyle = '#FBF0D9'; g.strokeStyle = '#C6AE82'; g.lineWidth = 1; for (const p of geo) for (const r of p.rings) { path(r, 0); g.fill(); g.stroke(); }
  const bs = bins.slice().sort((a, b) => V(b.x, b.z) - V(a.x, a.z));
  for (const b of bs) {
    const w = Math.max(3.5, S * b.r * 2), X = sx(b.x, b.z), Y0 = sy(b.x, b.z), Y1 = sy(b.x, b.z, b.h), Yg = lerp(Y1, Y0, b.f), t = clamp(b.h / 3.2, 0, 1);
    g.fillStyle = t > 0.5 ? '#3F6A3A' : t > 0.18 ? '#5E8C52' : '#8FB57F'; g.fillRect(X - w / 2, Yg, w, Y0 - Yg);
    if (b.f > 0) { g.fillStyle = '#D4A847'; g.fillRect(X - w / 2, Y1, w, Yg - Y1); }
    g.beginPath(); g.ellipse(X, Y1, w / 2, w * 0.3, 0, 0, 7); g.fillStyle = b.f > 0 ? '#E6C160' : '#A9CB98'; g.fill();
  }
}
const CITIES = [['東京', 139.76, 35.68], ['大阪', 135.50, 34.69], ['札幌', 141.35, 43.06], ['福岡', 130.40, 33.59], ['那覇', 127.68, 26.21], ['名古屋', 136.91, 35.17], ['京都', 135.77, 35.01], ['仙台', 140.87, 38.27], ['広島', 132.46, 34.39]];
const SPOTS = {
  tokyo: { lon: 139.6, lat: 35.72, d: 11.5, polar: 1.05, az: -0.4, ty: 2.7, sway: 0.2 },
  kansai: { lon: 135.45, lat: 34.86, d: 7.5, polar: 0.98, az: 0.35, ty: 1.9, sway: 0.2 },
  hokkaido: { lon: 142.7, lat: 43.35, d: 15, polar: 0.9, az: -0.3, ty: 0.4, sway: 0.2 },
  fukuoka: { lon: 130.45, lat: 33.5, d: 7.5, polar: 0.98, az: 0.3, ty: 0.7, sway: 0.2 },
  okinawa: { lon: 127.74, lat: 26.36, d: 4.7, polar: 1.0, az: 0.85, ty: 1.15, sway: 0.18 },
};

export async function initFx(rootEl, data, jp, opts = {}) {
  const reduce = opts.reduceMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pts = data.pts.filter(p => p[2] !== 2).map(p => ({ x: PX(p[1]), z: PZ(p[0]), full: p[2] >= 3, pref: p[3] }));
  const TOTAL = pts.length, geo = prepGeo(jp);
  const coarse = binPts(pts, 0.36, 0.15), fine = binPts(pts, 0.13, 0.056);
  const onLand = (x, z) => { for (const g of geo) for (const r of g.rings) { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[i], b = r[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } if (c) return true; } return false; };
  for (const b of [...coarse, ...fine]) b.off = !onLand(b.x, b.z);
  const rnd = rng(20261112), cmap = new Map();
  for (const b of coarse) { b.t0 = rnd() * (END - 2.2); cmap.set(hexKey(b.x, b.z, 0.36), b); }
  for (const b of fine) { const par = cmap.get(hexKey(b.x, b.z, 0.36)); b.t0 = (par ? par.t0 : rnd() * (END - 2.2)) + rnd() * 0.7; }
  const ui = buildDom(rootEl), cv = ui.cv;
  const fmt = n => Math.round(n).toLocaleString('ja-JP');
  const noop = () => {};
  const still = () => { drawStill(cv, geo, coarse); ui.num.textContent = fmt(TOTAL); ui.zoom.remove(); ui.hint.remove(); const ro = new ResizeObserver(() => drawStill(cv, geo, coarse)); ro.observe(rootEl); return { fly: noop, replay: noop, zoom: noop, select: noop, still: true, destroy: () => ro.disconnect() }; };
  let THREE, renderer;
  try {
    if (opts.forceStill) throw new Error('still');
    THREE = await import(THREE_URL);
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return still(); }
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(new THREE.Color('#FFF2E0'), 30, 150);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);
  scene.add(new THREE.HemisphereLight(new THREE.Color('#FFFAF0'), new THREE.Color('#EEDFC6'), 2.0));
  const sun = new THREE.DirectionalLight(new THREE.Color('#FFE9CC'), 1.7);
  sun.position.set(15, 17, 9); sun.target.position.set(0, 0, 1); scene.add(sun, sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 70 }); sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; sun.shadow.radius = 4;

  // 海: 紙ににじんだ水彩の青 + 岸の白いぼかし + 小さな波
  const SEA = 70, SCX = 0, SCZ = 1.2, sc = document.createElement('canvas'); sc.width = sc.height = small ? 1536 : 2048;
  { const g = sc.getContext('2d'), N = sc.width, k = N / SEA, r2 = rng(7), X = x => (x - SCX) * k + N / 2, Y = z => (z - SCZ) * k + N / 2;
    const gr = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
    gr.addColorStop(0, '#A3D3EC'); gr.addColorStop(0.36, '#BADFF0'); gr.addColorStop(0.66, 'rgba(206,232,240,.85)'); gr.addColorStop(0.9, 'rgba(232,242,238,.28)'); gr.addColorStop(1, 'rgba(255,246,232,0)');
    g.fillStyle = gr; g.fillRect(0, 0, N, N);
    g.globalCompositeOperation = 'source-atop';
    const tints = ['255,255,255', '255,255,255', '96,168,210', '120,196,214', '150,205,236'];
    for (let i = 0; i < 170; i++) { const x = r2() * N, y = r2() * N, r = (0.025 + r2() * 0.085) * N, c = tints[i % 5], a = i % 5 < 2 ? 0.2 : 0.15, b = g.createRadialGradient(x, y, 0, x, y, r); b.addColorStop(0, `rgba(${c},${a})`); b.addColorStop(0.7, `rgba(${c},${a * 0.45})`); b.addColorStop(1, `rgba(${c},0)`); g.fillStyle = b; g.fillRect(x - r, y - r, r * 2, r * 2); }
    const boxes = geo.flatMap(p => p.rings.map(r => { let a = 1e9, b = -1e9, c = 1e9, d = -1e9; for (const q of r) { a = Math.min(a, q[0]); b = Math.max(b, q[0]); c = Math.min(c, q[1]); d = Math.max(d, q[1]); } return [a - 0.7, b + 0.7, c - 0.5, d + 0.5]; }));
    g.strokeStyle = 'rgba(255,255,255,.62)'; g.lineWidth = Math.max(1.5, k * 0.075); g.lineCap = 'round'; g.lineJoin = 'round';
    for (let i = 0, n = 0; i < 900 && n < 110; i++) {
      const x = (r2() - 0.5) * 44, z = SCZ + (r2() - 0.5) * 40, w = 0.34 + r2() * 0.3; if (boxes.some(b => x > b[0] - w && x < b[1] + w && z > b[2] && z < b[3])) continue; n++;
      g.beginPath(); g.moveTo(X(x - w), Y(z)); g.quadraticCurveTo(X(x - w / 2), Y(z - 0.2), X(x), Y(z)); g.quadraticCurveTo(X(x + w / 2), Y(z - 0.2), X(x + w), Y(z)); g.stroke();
    }
    const land = () => { for (const p of geo) for (const r of p.rings) { g.beginPath(); r.forEach((q, i) => (i ? g.lineTo(X(q[0]), Y(q[1])) : g.moveTo(X(q[0]), Y(q[1])))); g.closePath(); g.fill(); } };
    const isl = () => { for (const b of fine) if (b.off) { g.beginPath(); g.arc(X(b.x), Y(b.z), Math.max(2, k * 0.13), 0, 7); g.fill(); } };
    g.shadowColor = 'rgba(84,160,204,.5)'; g.shadowBlur = N * 0.03; g.fillStyle = 'rgba(84,160,204,.5)'; land();
    g.shadowColor = 'rgba(255,255,255,.95)'; g.shadowBlur = N * 0.009; g.fillStyle = 'rgba(255,255,255,.95)'; land(); land(); isl();
  }
  const seaTex = new THREE.CanvasTexture(sc); seaTex.colorSpace = THREE.SRGBColorSpace; seaTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(SEA, SEA), new THREE.MeshBasicMaterial({ map: seaTex, transparent: true, depthWrite: false }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(SCX, 0.02, SCZ); sea.renderOrder = -2; scene.add(sea);
  const seaSh = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), new THREE.ShadowMaterial({ color: new THREE.Color('#3C6E90'), opacity: 0.26, depthWrite: false }));
  seaSh.rotation.x = -Math.PI / 2; seaSh.position.set(0, 0.03, 1); seaSh.renderOrder = -1; seaSh.receiveShadow = true; scene.add(seaSh);

  // 島: 県ごとに紙を切りぬいて重ねた感じ
  const prefMeshes = [], linePos = [], cBase = new THREE.Color(), cGlow = new THREE.Color('#FFCB45'), cEm = new THREE.Color('#7A4E00');
  const ext = { depth: 0.14, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.028, bevelOffset: -0.028, bevelSegments: 2, curveSegments: 1 };
  for (const p of geo) {
    const shapes = p.rings.map(r => new THREE.Shape(r.map(q => new THREE.Vector2(q[0], -q[1]))));
    const gm = new THREE.ExtrudeGeometry(shapes, ext); gm.rotateX(-Math.PI / 2); gm.translate(0, 0.035, 0);
    const hsh = (p.idx * 37) % 9 / 8; cBase.set('#FFF5E1').offsetHSL(0.006 * (hsh - 0.5), 0, 0.03 * (hsh - 0.5));
    const mat = new THREE.MeshStandardMaterial({ color: cBase.clone(), roughness: 1, metalness: 0 });
    const mesh = new THREE.Mesh(gm, mat); mesh.castShadow = true; mesh.receiveShadow = true;
    let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9; for (const q of p.rings[0]) { a0 = Math.min(a0, q[0]); a1 = Math.max(a1, q[0]); b0 = Math.min(b0, q[1]); b1 = Math.max(b1, q[1]); }
    mesh.userData = { idx: p.idx, base: cBase.clone(), hl: 0, to: 0, cx: (a0 + a1) / 2, cz: (b0 + b1) / 2, rad: Math.max(a1 - a0, b1 - b0) / 2 }; prefMeshes.push(mesh); scene.add(mesh);
    for (const r of p.rings) for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; linePos.push(a[0], 0.182, a[1], b[0], 0.182, b[1]); }
  }
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: new THREE.Color('#B59C6E'), transparent: true, opacity: 0.55 })));

  // 柱: 遠くは太め(coarse)、近づくと細かく(fine)
  const cylG = new THREE.CylinderGeometry(1, 1, 1, 14, 1, true); cylG.translate(0, 0.5, 0);
  const capG = new THREE.SphereGeometry(1, 14, 5, 0, Math.PI * 2, 0, Math.PI / 2);
  const pMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, metalness: 0 });
  const isleG = new THREE.CylinderGeometry(0.9, 1, 1, 18); isleG.translate(0, 0.5, 0);
  const isleMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#FFF5E1'), roughness: 1, metalness: 0 });
  const cA = new THREE.Color('#A4C891'), cB = new THREE.Color('#5E8C52'), cC = new THREE.Color('#3F6A3A'), cG = new THREE.Color('#D4A847'), cG2 = new THREE.Color('#EBC766'), tmpC = new THREE.Color();
  const green = (t, out) => (t < 0.45 ? out.copy(cA).lerp(cB, t / 0.45) : out.copy(cB).lerp(cC, (t - 0.45) / 0.55));
  function mkLevel(bins) {
    const n = bins.length, mk = g => { const m = new THREE.InstancedMesh(g, pMat, n); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); return m; };
    const L = { bins, body: mk(cylG), gold: mk(cylG), cap: mk(capG), offs: bins.filter(b => b.off) };
    L.isle = new THREE.InstancedMesh(isleG, isleMat, Math.max(1, L.offs.length)); L.isle.count = L.offs.length; L.isle.castShadow = L.isle.receiveShadow = true; L.isle.frustumCulled = false; scene.add(L.isle);
    bins.forEach((b, i) => {
      const t = clamp((b.h - 0.3) / 3.4, 0, 1);
      L.body.setColorAt(i, green(Math.pow(t, 0.75), tmpC)); L.gold.setColorAt(i, cG);
      L.cap.setColorAt(i, b.f > 0 ? cG2 : green(Math.max(0, Math.pow(t, 0.75) - 0.22), tmpC));
    });
    for (const m of [L.body, L.gold, L.cap]) m.instanceColor.needsUpdate = true;
    return L;
  }
  const LV = [mkLevel(coarse), mkLevel(fine)];
  // カメラ
  const TAU = Math.PI * 2, v3 = new THREE.Vector3();
  const view = { tx: 0, ty: 0.4, tz: 1, az: 0, polar: 0.8, d: 40 }, cur = { ...view };
  let home = { ...view, sway: 0.3 }, preset = 'all', swayOn = !reduce, swayPhase = -1.25, swayGain = 1, swayAmp = 0.3, tween = null;
  let idle = 0, T = reduce ? END : 0, lod = 0, lodTo = 0, pillDirty = true, raf = 0, last = 0, inView = true, dead = false;
  function place(s) {
    const sp = Math.sin(s.polar);
    camera.position.set(s.tx + s.d * sp * Math.sin(s.az), s.ty + s.d * Math.cos(s.polar), s.tz + s.d * sp * Math.cos(s.az));
    camera.lookAt(s.tx, s.ty, s.tz); camera.updateMatrixWorld();
  }
  const KEY = [[141.9, 45.5, 0.3], [145.6, 43.4, 0.3], [140.9, 35.7, 0.3], [139.72, 35.68, 6.4], [129.7, 31.2, 0.3], [130.2, 33.6, 0.3], [127.7, 26.1, 0.6], [124.1, 24.4, 0.3], [135.5, 34.7, 3], [136.9, 37.4, 0.3]].map(k => [PX(k[0]), k[2], PZ(k[1])]);
  function fitAt(az, polar, amp, box) {
    const s = { tx: 0, ty: 0.4, tz: 1, az, polar, d: 40 }, th = Math.tan(camera.fov * Math.PI / 360);
    for (let i = 0; i < 16; i++) {
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for (const o of [-amp, 0, amp]) { place({ ...s, az: az + o }); for (const k of KEY) { v3.set(k[0], k[1], k[2]).project(camera); x0 = Math.min(x0, v3.x); x1 = Math.max(x1, v3.x); y0 = Math.min(y0, v3.y); y1 = Math.max(y1, v3.y); } }
      const k = Math.max((x1 - x0) / (box.r - box.l), (y1 - y0) / (box.t - box.b));
      const dx = (x0 + x1) / 2 - (box.l + box.r) / 2, dy = (y0 + y1) / 2 - (box.b + box.t) / 2, hh = s.d * th, hw = hh * camera.aspect;
      s.tx += Math.cos(az) * dx * hw * 0.8 - Math.sin(az) * dy * hh / Math.cos(polar) * 0.6;
      s.tz += -Math.sin(az) * dx * hw * 0.8 - Math.cos(az) * dy * hh / Math.cos(polar) * 0.6;
      s.d *= Math.pow(k, 0.85);
    }
    return s;
  }
  function fitHome() {
    const a = camera.aspect, amp = reduce ? 0 : a < 0.95 ? 0.2 : 0.26, polar = a > 1.6 ? 0.96 : 0.88;
    const chh = ui.count.offsetHeight + 24, H = cv.clientHeight;
    const box = { l: -0.9, r: 0.9, b: -0.84, t: a > 1.6 ? 0.7 : Math.min(0.8, 1 - 2 * (chh * 0.55) / H) };
    let best = null;
    for (const az of [-0.95, -0.75, -0.55, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65]) { const s = fitAt(az, polar, amp, box); if (!best || s.d < best.d) best = s; }
    home = { ...best, sway: amp };
  }
  function spotState(key) { const p = SPOTS[key]; return { tx: PX(p.lon), ty: p.ty, tz: PZ(p.lat), az: p.az, polar: p.polar, d: p.d * clamp(1.1 / camera.aspect, 1, 1.6), sway: p.sway }; }
  function go(to, dur, amp) {
    const from = { ...cur }; to = { ...to }; to.az = from.az + ((((to.az - from.az) % TAU) + TAU * 1.5) % TAU - Math.PI); swayAmp = amp; idle = 0;
    if (reduce) { Object.assign(view, to); tween = null; } else { tween = { from, to, t: 0, dur }; swayGain = 0; swayPhase = 0; swayOn = amp > 0; }
    wake();
  }
  function fly(key, dur = 1.6) {
    const sp = key === 'all' || !SPOTS[key] ? home : spotState(key); preset = SPOTS[key] ? key : 'all';
    go({ tx: sp.tx, ty: sp.ty, tz: sp.tz, az: sp.az, polar: sp.polar, d: sp.d }, dur, sp.sway); opts.onView?.(preset);
  }
  // タップした県が小さく見えているときは、そっと近づく
  function focus(idx) {
    const m = prefMeshes.find(q => q.userData.idx === idx); if (!m) return; const u = m.userData;
    const dTo = Math.min(home.d * 0.78, clamp(u.rad * 9, 7.5, home.d * 0.6) * clamp(1.1 / camera.aspect, 1, 1.4)); if (cur.d < dTo * 1.3) return;
    preset = null; opts.onView?.(null); go({ tx: u.cx, ty: 0.7, tz: u.cz, az: cur.az, polar: 0.72, d: dTo }, 1.4, 0.12);
  }
  function userTook() { if (swayOn || tween || preset) { Object.assign(view, cur); swayOn = false; tween = null; preset = null; opts.onView?.(null); } ui.hint.style.opacity = 0; }
  function zoom(f) { userTook(); const to = { ...view, d: clamp(view.d * f, 3.5, home.d * 1.25) }; if (reduce) Object.assign(view, to); else tween = { from: { ...view }, to, t: 0, dur: 0.35 }; wake(); }

  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3();
  const grow = b => { const g0 = clamp((T - b.t0) / 1.3, 0, 1); return g0 <= 0 ? 0 : easeBack(g0); };
  function updPillars() {
    const e = easeIO(lod), mult = [1 - e, e]; let cnt = 0;
    for (const b of coarse) cnt += b.n * clamp((T - b.t0) / 1.6, 0, 1);
    LV.forEach((L, li) => {
      const m = mult[li]; L.body.visible = L.gold.visible = L.cap.visible = L.isle.visible = m > 0.001; if (m <= 0.001) return;
      L.offs.forEach((b, i) => { const r = Math.max(b.r * 1.7, 0.09) * (0.35 + 0.65 * m); M.compose(P.set(b.x, 0, b.z), Q, S.set(r, TOP - 0.014, r)); L.isle.setMatrixAt(i, M); }); L.isle.instanceMatrix.needsUpdate = true;
      L.bins.forEach((b, i) => {
        const g = grow(b), r = Math.max(1e-4, b.r * Math.min(1, g * 2.2) * (0.35 + 0.65 * m)), h = Math.max(1e-4, b.h * g * m), hg = h * (1 - b.f);
        M.compose(P.set(b.x, TOP - 0.02, b.z), Q, S.set(r, hg + 0.02, r)); L.body.setMatrixAt(i, M);
        M.compose(P.set(b.x, TOP + hg, b.z), Q, S.set(r, Math.max(1e-4, h * b.f), r)); L.gold.setMatrixAt(i, M);
        M.compose(P.set(b.x, TOP + h, b.z), Q, S.set(r, r * 0.6, r)); L.cap.setMatrixAt(i, M);
      });
      for (const k of [L.body, L.gold, L.cap]) k.instanceMatrix.needsUpdate = true;
    });
    ui.num.textContent = fmt(T >= END ? TOTAL : cnt); renderer.shadowMap.needsUpdate = true;
  }

  // 都市ラベル
  const labs = CITIES.map(([name, lon, lat]) => {
    const el = document.createElement('div'); el.className = 'rt-lab'; el.textContent = name; ui.labels.appendChild(el);
    const x = PX(lon), z = PZ(lat), top = (bins, R) => bins.reduce((m, b) => ((b.x - x) ** 2 + (b.z - z) ** 2 < R * R && (!m || b.h > m.h) ? b : m), null);
    return { el, x, z, b0: top(coarse, 0.45), b1: top(fine, 0.22), w: 60, hh: 31 };
  });
  function updLabels() {
    const W = cv.clientWidth, H = cv.clientHeight, e = easeIO(lod), placed = [[0, 0, ui.count.offsetLeft + ui.count.offsetWidth + 9, ui.count.offsetTop + ui.count.offsetHeight + 9], [W - 70, H - 126, W, H]];
    if (ui.hint.style.opacity !== '0') placed.push([0, H - 58, ui.hint.offsetWidth + 22, H]);
    const hit = r => placed.some(p => r[0] < p[2] && r[2] > p[0] && r[1] < p[3] && r[3] > p[1]);
    const pts = labs.map(l => {
      const y = TOP + 0.12 + lerp(l.b0 ? l.b0.h * grow(l.b0) : 0, l.b1 ? l.b1.h * grow(l.b1) : 0, e);
      v3.set(lerp(l.b0 ? l.b0.x : l.x, l.b1 ? l.b1.x : l.x, e), y, lerp(l.b0 ? l.b0.z : l.z, l.b1 ? l.b1.z : l.z, e)).project(camera);
      const x = (v3.x * 0.5 + 0.5) * W, sy = (-v3.y * 0.5 + 0.5) * H;
      return { x, y: sy, on: v3.z < 1 && sy < H - 4 && x > 36 && x < W - 36 };
    });
    labs.forEach((l, i) => {
      const { x: sx, y: sy, on } = pts[i], s = l.w / 2 - 13; let best = null;
      if (on) for (const [lh, dx] of [[10, 0], [10, -s], [10, s], [36, 0], [36, -s], [36, s]]) {
        const cx = sx + dx, bx = [cx - l.w / 2 - 4, sy - l.hh - lh - 4, cx + l.w / 2 + 4, sy - lh + 5], ld = [sx - 3, sy - lh + 5, sx + 3, sy - 1];
        if (!(bx[0] > 4 && bx[2] < W - 4 && bx[1] > 4 && !hit(bx) && !hit(ld))) continue;
        const cov = pts.some((q, k) => k !== i && q.on && Math.hypot(q.x - sx, q.y - sy) > 18 && q.x > bx[0] && q.x < bx[2] && q.y > bx[1] && q.y < bx[3] + 6);
        if (!best || !cov) best = { lh, dx, bx, ld };
        if (!cov) break;
      }
      if (best) {
        const { lh, dx, bx, ld } = best; placed.push(bx, ld); l.el.style.setProperty('--lh', lh + 'px'); l.el.style.setProperty('--lx', (-dx).toFixed(1) + 'px');
        const tb = e > 0.5 ? l.b1 : l.b0; if (tb && tb.h > 1.2) { v3.set(tb.x, TOP, tb.z).project(camera); placed.push([sx - 9, sy, sx + 9, (-v3.y * 0.5 + 0.5) * H]); }
        l.el.style.transform = `translate(${(sx + dx - l.w / 2).toFixed(1)}px,${(sy - l.hh - lh - 1).toFixed(1)}px)`;
      }
      l.el.style.opacity = best ? 1 : 0;
    });
  }

  // 県タップ
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function select(idx) { for (const m of prefMeshes) m.userData.to = m.userData.idx === idx ? 1 : 0; wake(); }
  function pickAt(cx, cy) {
    const r = cv.getBoundingClientRect(); ndc.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); const L = LV[lod > 0.5 ? 1 : 0], hit = ray.intersectObjects([...prefMeshes, L.body, L.gold, L.cap], false)[0];
    if (hit) { const i = hit.object.isInstancedMesh ? L.bins[hit.instanceId].pref : hit.object.userData.idx; select(i); focus(i); ui.hint.style.opacity = 0; opts.onPick?.(i); } else select(-1);
  }
  // 1コマ進める
  function step(dt) {
    let moving = false;
    if (T < END) { T = Math.min(END, T + dt); pillDirty = true; moving = true; }
    if (tween) {
      tween.t = Math.min(1, tween.t + dt / tween.dur); const e = easeIO(tween.t);
      for (const k of ['tx', 'ty', 'tz', 'az', 'polar']) view[k] = lerp(tween.from[k], tween.to[k], e);
      view.d = Math.exp(lerp(Math.log(tween.from.d), Math.log(tween.to.d), e)); if (tween.t >= 1) tween = null; moving = true;
    }
    Object.assign(cur, view);
    if (swayOn && !reduce) { if (!tween) swayGain = Math.min(1, swayGain + dt / 2.5); swayPhase += dt * 0.135; cur.az += swayAmp * swayGain * Math.sin(swayPhase); moving = true;
      if (T >= END && !tween && (idle += dt) > 40 && Math.abs(Math.cos(swayPhase)) < 0.03) { view.az = cur.az; swayOn = false; } }
    lodTo = cur.d < Math.min(19, home.d * 0.62) * (lodTo ? 1.1 : 1) ? 1 : 0;
    if (lod !== lodTo) { lod = reduce ? lodTo : clamp(lod + Math.sign(lodTo - lod) * dt * 2, 0, 1); pillDirty = true; moving = true; }
    for (const m of prefMeshes) {
      const u = m.userData; if (Math.abs(u.to - u.hl) < 0.004) { if (u.hl !== u.to) u.hl = u.to; else continue; } else u.hl = reduce ? u.to : u.hl + (u.to - u.hl) * Math.min(1, dt * 6);
      m.material.color.copy(u.base).lerp(cGlow, u.hl); m.material.emissive.copy(cEm).multiplyScalar(u.hl * 0.42); m.position.y = 0.1 * u.hl;
      renderer.shadowMap.needsUpdate = true; moving = true;
    }
    return moving;
  }
  function frame(now) {
    raf = 0; if (dead) return;
    const dt = Math.min(0.1, (now - last) / 1000) || 0.016; last = now;
    const moving = step(dt);
    if (pillDirty) { updPillars(); pillDirty = false; }
    place(cur); scene.fog.near = cur.d * 0.95; scene.fog.far = cur.d * 3.3 + 30;
    renderer.render(scene, camera); updLabels();
    if (moving && inView && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function wake() { if (!raf && !dead && inView && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function resize() {
    for (const l of labs) { l.w = l.el.offsetWidth || 60; l.hh = l.el.offsetHeight || 31; }
    const W = cv.clientWidth, H = cv.clientHeight; if (!W || !H) return;
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); fitHome();
    if (preset === 'all' && !tween) { Object.assign(view, home); swayAmp = home.sway; }
    for (const l of labs) { l.w = l.el.offsetWidth; l.hh = l.el.offsetHeight; }
    if (inView && !document.hidden) { cancelAnimationFrame(raf); raf = 0; last = performance.now(); frame(last); } else wake();
  }

  // 操作: ドラッグでまわす / 2本指・ホイールでズーム / タップで県
  const ptrs = new Map(); let down = null, pinch = null;
  const pd = () => { const a = [...ptrs.values()]; return { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), y: (a[0].y + a[1].y) / 2 }; };
  cv.addEventListener('pointerdown', e => {
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    if (ptrs.size === 1) down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 }; else if (ptrs.size === 2) { down = null; pinch = pd(); userTook(); }
  });
  cv.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 1 && down) {
      down.moved += Math.abs(dx) + Math.abs(dy); if (down.moved < 7) return;
      userTook(); cv.classList.add('rt-drag'); view.az -= dx * 0.0055; view.polar = clamp(view.polar - dy * 0.004, 0.22, 1.36); wake();
    } else if (ptrs.size === 2 && pinch) {
      const n = pd(); view.d = clamp(view.d * pinch.d / Math.max(20, n.d), 3.5, home.d * 1.25); view.polar = clamp(view.polar - (n.y - pinch.y) * 0.004, 0.22, 1.36); pinch = n; wake();
    }
  });
  const up = (e, tap) => {
    if (!ptrs.delete(e.pointerId)) return; cv.classList.remove('rt-drag');
    if (tap && down && down.moved < 9 && performance.now() - down.t < 500) pickAt(e.clientX, e.clientY);
    down = null; pinch = null;
  };
  cv.addEventListener('pointerup', e => up(e, true)); cv.addEventListener('pointercancel', e => up(e, false));
  const two = e => { if (e.touches.length > 1 && e.cancelable) e.preventDefault(); };
  cv.addEventListener('touchstart', two, { passive: false }); cv.addEventListener('touchmove', two, { passive: false });
  cv.addEventListener('wheel', e => {
    const scrolls = document.documentElement.scrollHeight > window.innerHeight + 4; if (!e.ctrlKey && scrolls) return;
    e.preventDefault(); userTook(); view.d = clamp(view.d * Math.exp(e.deltaY * (e.ctrlKey ? 0.012 : 0.0016)), 3.5, home.d * 1.25); wake();
  }, { passive: false });
  const zb = ui.zoom.querySelectorAll('button'); zb[0].addEventListener('click', () => zoom(0.7)); zb[1].addEventListener('click', () => zoom(1 / 0.7));

  const ro = new ResizeObserver(resize); ro.observe(rootEl);
  const io = new IntersectionObserver(es => { inView = es[es.length - 1].isIntersecting; if (inView) wake(); }, { threshold: 0.05 }); io.observe(rootEl);
  const onVis = () => { if (!document.hidden) wake(); }; document.addEventListener('visibilitychange', onVis);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!dead) resize(); });
  resize(); setTimeout(() => { ui.hint.style.opacity = 0; wake(); }, 9000);
  return {
    fly, zoom, select, still: false,
    replay() { T = reduce ? END : 0; pillDirty = true; select(-1); fly('all', 1.2); swayPhase = -1.25; },
    destroy() { dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); renderer.dispose(); },
    _dbg: () => ({ T, lod, cur: { ...cur }, preset, swayOn }),
    _proj: (lon, lat, y = TOP) => { v3.set(PX(lon), y, PZ(lat)).project(camera); const r = cv.getBoundingClientRect(); return [r.left + (v3.x * 0.5 + 0.5) * r.width, r.top + (-v3.y * 0.5 + 0.5) * r.height]; },
  };
}

