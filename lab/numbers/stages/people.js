/* 05 食べたい人は こんなに いる — 人のむれ（人 1つ = 10万人）と まつりの ちょうちん */
(() => {
'use strict';
const INK = '#1F1812', SKIN = '#F8D9B8', LEAF = '#5E8C52', PAPER = '#FFF9EE';
const WARM = ['#E2705A', '#EBA63F', '#D9475C', '#F2C55C', '#C9804E'];

const CSS = `
.viz-people{--big:clamp(42px,min(14.5cqw,12.5cqh),96px)}
.viz-people .sc{display:flex;flex-direction:column;align-items:center}
.viz-people .pp-cv{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .35s;pointer-events:none}
.viz-people .pp-cv.on{opacity:1}
.viz-people .pp-f{display:block;width:var(--fw,20px);height:auto;aspect-ratio:24/31;flex:none;overflow:visible}

.viz-people .s0{justify-content:center;gap:min(2cqh,12px)}
.viz-people .q-sky{position:relative;align-self:stretch;flex:none;--pw:min(38cqw,44cqh);height:calc(var(--pw)*.6)}
.viz-people .q-trail{position:absolute;left:0;top:26%;width:calc(98% - var(--pw)*.9);height:72%;overflow:visible}
.viz-people .q-plane{position:absolute;right:2%;top:0;width:var(--pw)}
.viz-people .q-plane svg{display:block;width:100%;height:auto;overflow:visible;filter:drop-shadow(3px 4px 0 rgba(31,24,18,.2))}
.viz-people .q-mark{flex:none;font-size:min(38cqh,54cqw);line-height:1.08}
.viz-people .q-row{display:flex;justify-content:center;align-items:flex-end;gap:1.4cqw;flex:none;--fw:min(10.5cqw,12cqh)}
.viz-people .q-row .pp-f:nth-child(odd){--fw:min(9.2cqw,10.5cqh)}
.viz-people .s0.play .q-plane{animation:ppFly 1.25s cubic-bezier(.2,.7,.3,1) both}
.viz-people .s0.play .q-trail{animation:ppWipe 1.1s .1s ease-out both}
.viz-people .s0.play .q-mark{animation:ppPop .6s .75s cubic-bezier(.3,1.5,.5,1) both}
.viz-people .s0.play .q-row .pp-f{animation:ppUp .5s calc(.9s + var(--i)*.09s) cubic-bezier(.3,1.4,.5,1) both}
@keyframes ppFly{from{transform:translate(-80cqw,26cqh) rotate(-12deg) scale(.55)}}
@keyframes ppWipe{from{clip-path:inset(-20% 100% -20% 0)}to{clip-path:inset(-20% 0 -20% 0)}}
@keyframes ppPop{from{transform:scale(0) rotate(-20deg)}}
@keyframes ppUp{from{transform:translateY(70%) scale(.2);opacity:0}}

.viz-people .cr-top{display:flex;flex-direction:column;align-items:center;flex:none;max-width:100%}
.viz-people .cr-big{display:flex;align-items:baseline;justify-content:center;gap:.05em;font-size:var(--big);line-height:1.22;height:1.22em;white-space:nowrap}
.viz-people .cr-big .u{font-size:.56em}
.viz-people .cr-big .t{font-size:.78em}
.viz-people .cr-mid{flex:1;align-self:stretch;min-height:0;margin:5px 0 7px}
.viz-people .cr-bot{flex:none;padding:0 4px 4px}
.viz-people .cr-bot .pp-f{--fw:.9em}
.viz-people .s1.play .cr-bot,.viz-people .s2.play .cr-bot{animation:ppUp .5s 1.5s cubic-bezier(.3,1.4,.5,1) both}
.viz-people .s2.play .cr-big{animation:ppPop .55s .1s cubic-bezier(.3,1.5,.5,1) both}

.viz-people.pp-rm *{animation:none!important;transition:none!important}

.viz-people .s3{gap:6px}
.viz-people .ev-top{display:flex;align-items:center;gap:10px;align-self:stretch;flex:none;padding:0 5px 0 2px}
.viz-people .ev-n{display:flex;align-items:baseline;white-space:nowrap;flex:none;font-size:clamp(46px,min(17cqw,15cqh),116px);line-height:1.2}
.viz-people .ev-n .u{font-size:.55em}
.viz-people .ev-card{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;background:var(--white);border:2.5px solid var(--ink);border-radius:14px;box-shadow:3px 3px 0 var(--ink);
  padding:4px 10px;height:calc(4.2em + 14px);font:900 clamp(14px,3.9cqw,25px)/1.32 var(--round);overflow:hidden;word-break:keep-all;overflow-wrap:anywhere}
.viz-people .ev-card .d{font:700 clamp(13px,3cqw,19px)/1.4 var(--sans);color:var(--royal-deep);white-space:nowrap}
.viz-people .ev-card .h{font-size:1.22em;color:var(--leaf-deep)}
.viz-people .ev-year{position:relative;flex:1;align-self:stretch;min-height:0;display:grid;grid-template-columns:repeat(12,1fr);container-type:size;
  --ms:clamp(13px,3.3cqw,21px);--lw:min(7.7cqw,calc((100cqh - 2.2*var(--ms))/7.2));--gp:clamp(0px,calc((100cqh - 2.2*var(--ms) - 7.2*var(--lw))/6),calc(var(--lw)*.5))}
.viz-people .ev-rope{position:absolute;left:0;right:0;top:calc(1.5*var(--ms) + 1px);height:0;border-top:2.5px solid var(--ink)}
.viz-people .ev-col{position:relative;display:flex;flex-direction:column;align-items:center;min-width:0}
.viz-people .ev-m{font:900 var(--ms)/1.5 var(--round);letter-spacing:-.04em;white-space:nowrap;-webkit-text-stroke:4px var(--paper);paint-order:stroke fill}
.viz-people .ev-m.z{color:var(--muted)}
.viz-people .ev-w{display:flex;flex-direction:column;align-items:center;padding-top:var(--gp);background:linear-gradient(var(--ink),var(--ink)) center top/1.6px var(--gp) no-repeat}
.viz-people .ev-m+.ev-w{padding-top:calc(var(--gp)*.5 + 3px);background-size:1.6px calc(var(--gp)*.5 + 3px)}
.viz-people .ev-l{display:block;width:var(--lw);height:auto;aspect-ratio:30/36;overflow:visible;transform-origin:50% 0}
.viz-people .ev-l .b{fill:#FBEFD8;stroke-dasharray:2.5 3}
.viz-people .ev-w.on .ev-l .b{fill:var(--lc);stroke-dasharray:none}
.viz-people .ev-w.on .ev-l{filter:drop-shadow(0 0 calc(var(--lw)*.2) rgba(242,178,56,.95));animation:ppPop .38s cubic-bezier(.3,1.6,.5,1)}
.viz-people .ev-pl{flex:none;gap:0;margin:0 4px 4px;padding:4px 14px;font-size:clamp(14px,3.85cqw,22px)}
.viz-people .ev-pl .p{display:inline-block;color:#D9C8A6}
.viz-people .ev-pl .p.on{color:var(--ink);animation:ppPop .4s cubic-bezier(.3,1.6,.5,1)}
.viz-people .ev-pl i{font-style:normal;margin:0 -.2em;color:var(--muted)}

.viz-people .s4{justify-content:center;gap:min(1.6cqh,10px)}
.viz-people .fs-top{display:flex;flex-direction:column;align-items:center;flex:none}
.viz-people .fs-big{font-size:clamp(38px,min(11.6cqw,12cqh),92px);line-height:1.22;white-space:nowrap}
.viz-people .fs-row{display:flex;align-items:flex-start;justify-content:center;gap:1.5cqw;align-self:stretch;flex:none}
.viz-people .fs-st{flex:1;min-width:0;max-width:42cqh;display:flex;flex-direction:column;align-items:center}
.viz-people .fs-sign{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;background:var(--white);border:2.5px solid var(--ink);border-radius:12px;box-shadow:3px 3px 0 var(--ink);
  padding:2px 8px 3px;margin-bottom:-2px;font:900 clamp(14px,3.9cqw,24px)/1.22 var(--round);white-space:nowrap}
.viz-people .fs-sign span{color:var(--royal);font-size:.94em}
.viz-people .fs-tent{display:block;width:100%;height:auto;aspect-ratio:100/58;overflow:visible}
.viz-people .fs-cr{display:flex;flex-direction:column;align-items:center;width:100%;margin-top:3%;--fw:clamp(13px,min(5.1cqw,5.4cqh),44px)}
.viz-people .fs-r{display:flex;justify-content:center}
.viz-people .fs-r+.fs-r{margin-top:calc(var(--fw)*-.36)}
.viz-people .fs-r .pp-f{margin:0 calc(var(--fw)*-.02)}
.viz-people .s4.play .fs-big{animation:ppPop .55s cubic-bezier(.3,1.5,.5,1) both}
.viz-people .s4.play .fs-sign,.viz-people .s4.play .fs-tent{animation:ppUp .5s calc(.15s + var(--k)*.12s) cubic-bezier(.3,1.4,.5,1) both}
.viz-people .s4.play .fs-cr .pp-f{animation:ppUp .42s calc(.45s + var(--i)*7ms) cubic-bezier(.3,1.4,.5,1) both,ppHop .46s calc(1.25s + var(--h)*.4s) ease-out 2}
@keyframes ppHop{40%{transform:translateY(-34%)}}
`;

const LANT = `<svg class="ev-l" viewBox="0 0 30 36" aria-hidden="true"><path d="M15 0v5" stroke="${INK}" stroke-width="1.6"/><ellipse class="b" cx="15" cy="19" rx="12.5" ry="12" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M9 8.5q-5 10.5 0 21M21 8.5q5 10.5 0 21M15 7v24" fill="none" stroke="${INK}" stroke-width="1" opacity=".3"/><rect x="9.5" y="4.5" width="11" height="4" rx="1.2" fill="${INK}"/><rect x="9.5" y="29.5" width="11" height="4" rx="1.2" fill="${INK}"/></svg>`;
const tent = c => { let st = '', sc = ''; const n = 7, r = v => +v.toFixed(1);
  for (let i = 0; i < n; i++) { const a = r(5 + i * 90 / n), b = r(5 + (i + 1) * 90 / n), ta = r(18 + i * 64 / n), tb = r(18 + (i + 1) * 64 / n), f = i % 2 ? '#FFFDF8' : c;
    st += `<path d="M${ta} 6H${tb}L${b} 28H${a}Z" fill="${f}" stroke-width="1.1"/>`; sc += `<path d="M${a} 28a${r(45 / n)} 7 0 0 0 ${r(b - a)} 0Z" fill="${f}" stroke-width="2"/>`; }
  return `<svg class="fs-tent" viewBox="0 0 100 58" aria-hidden="true"><g stroke="${INK}" stroke-linejoin="round" stroke-linecap="round"><path d="M13 30v26M87 30v26" fill="none" stroke-width="2.6"/>` +
    `<rect x="8" y="41" width="84" height="15" rx="3" fill="#FDF1DA" stroke-width="2.4"/>${st}${sc}<path d="M18 6H82L95 28H5Z" fill="none" stroke-width="2.6"/></g></svg>`; };

/* 人のかたち（DOM用）：まるい頭 + からだ */
const fig = (c, cheer, face, i, h) => `<svg class="pp-f" viewBox="-2 -2 24 31" style="color:${c};--i:${i || 0};--h:${h || 0}" aria-hidden="true">` +
  (cheer ? `<path d="M5.4 15.6 1.2 8.4M14.6 15.6 18.8 8.4" fill="none" stroke="${INK}" stroke-width="2.3" stroke-linecap="round"/>` : '') +
  `<path d="M3.5 26 5.2 15.5Q6.2 11.5 10 11.5 13.8 11.5 14.8 15.5L16.5 26Q16.6 27 15.5 27H4.5Q3.4 27 3.5 26Z" fill="currentColor" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"/>` +
  `<circle cx="10" cy="6.5" r="5.5" fill="${SKIN}" stroke="${INK}" stroke-width="1.7"/>` +
  (face ? `<circle cx="8" cy="6.2" r=".85" fill="${INK}"/><circle cx="12" cy="6.2" r=".85" fill="${INK}"/><path d="M8.2 8.5Q10 10 11.8 8.5" fill="none" stroke="${INK}" stroke-width=".9" stroke-linecap="round"/>` : '') + '</svg>';

const PLANE = `<svg viewBox="0 0 124 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M13 27 5 6h13l15 17z" fill="#C9223A"/>
<path d="M9 35Q8 25 24 23l62-3q23 0 29 12-6 10-27 10H23Q10 42 9 35Z" fill="#FFFDF8"/>
<path d="M52 35 35 58h15l27-23z" fill="#D4A847"/>
<path d="M97 22q8 1 12 6H98z" fill="#9CC7D8" stroke-width="2.4"/>
<g fill="#13213F" stroke="none"><circle cx="44" cy="29" r="2.7"/><circle cx="55" cy="28.5" r="2.7"/><circle cx="66" cy="28" r="2.7"/><circle cx="77" cy="27.5" r="2.7"/><circle cx="88" cy="27" r="2.7"/></g></g></svg>`;

const mix = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')'; };

(window.StageViz = window.StageViz || {}).people = {
  init(viz, ctx) {
    const K = ctx.kit, box = ctx.box, RM = ctx.reduced, EX = ctx.EX;
    const N = Math.round(EX.visitors / 1e5), MAN = Math.floor(EX.visitors / 1e4);
    box.classList.add('viz-people'); if (RM) box.classList.add('pp-rm');
    K.style('viz-people-css', CSS);

    const cv = K.el('canvas', 'pp-cv'); box.appendChild(cv);
    const L = [0, 1, 2, 3, 4].map(k => { const l = K.el('div', 'sc s' + k); box.appendChild(l); return l; });

    /* 0 クイズ：飛行機と ？ */
    L[0].innerHTML = `<div class="q-sky"><svg class="q-trail" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M1 39Q50 40 99 4" fill="none" stroke="${INK}" stroke-width="2.6" stroke-dasharray="1 9" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>` +
      `<div class="q-plane">${PLANE}</div></div><b class="wc r q-mark" data-t="？">？</b>` +
      `<div class="q-row">${[0, 1, 2, 3, 4, 5, 6].map(i => fig(WARM[(i * 3 + 1) % 5], false, true, i)).join('')}</div>`;

    /* 1・2 人のむれ（canvas）+ 文字 */
    L[1].innerHTML = `<div class="cr-top"><p class="v-lab">2025年の 訪日客（過去最高）</p><p class="cr-big"><b class="wc r n" data-t="${ctx.fmt(MAN)}">${ctx.fmt(MAN)}</b><span class="wc r u" data-t="万人">万人</span></p></div>` +
      `<div class="cr-mid"></div><div class="cr-bot"><span class="v-chip">${fig(WARM[0])}人 1つ ＝ 10万人</span></div>`;
    L[2].innerHTML = `<div class="cr-top"><p class="v-lab">ベジタリアン・ヴィーガンは</p><p class="cr-big"><b class="wc t" data-t="約20人に 1人">約20人に 1人</b></p></div>` +
      `<div class="cr-mid"></div><div class="cr-bot"><span class="v-chip">${fig(LEAF)}年間 約200〜260万人（試算）</span></div>`;
    const num = L[1].querySelector('.n'), mid = L[1].querySelector('.cr-mid');

    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    /* 3 イベント：12か月の ひもに 22この ちょうちん */
    const ev = EX.ev, prefs = [], LC = ['#E4475B', '#F0A93B', '#E4475B', '#EE7B4E'];
    const prefOf = ev.map(e => { const p = e[3].split('・')[0]; if (!prefs.includes(p)) prefs.push(p); return prefs.indexOf(p); });
    const IDLE = '<span class="d">2026年の</span><b class="h">ヴィーガンイベント</b>';
    L[3].innerHTML = `<div class="ev-top"><p class="ev-n"><b class="wc r n" data-t="${ev.length}">${ev.length}</b><span class="wc r u" data-t="回">回</span></p><p class="ev-card">${IDLE}</p></div>` +
      `<div class="ev-year"><i class="ev-rope"></i>${Array.from({ length: 12 }, (_, m) => { const li = ev.map((e, i) => e[0] === m + 1 ? `<div class="ev-w" data-i="${i}" style="--lc:${LC[i % 4]}">${LANT}</div>` : '').join('');
        return `<div class="ev-col"><span class="ev-m${li ? '' : ' z'}">${m + 1}月</span>${li}</div>`; }).join('')}</div>` +
      `<p class="v-chip ev-pl">${prefs.map(p => `<span class="p">${p}</span>`).join('<i>・</i>')}</p>`;
    const evN = L[3].querySelector('.n'), card = L[3].querySelector('.ev-card'), pls = [...L[3].querySelectorAll('.p')];
    const lans = []; L[3].querySelectorAll('.ev-w').forEach(w => { lans[+w.dataset.i] = w; });

    /* 4 ビーガングルメ祭り：3つの やたいと 人だかり */
    const FES = [['東京', '約7,000人〜', 28, '#D9475C'], ['名古屋', '約4,500人〜', 18, '#EBA63F'], ['京都', '約2,500人〜', 10, LEAF]], CROWD = WARM.concat(LEAF);
    const rows = n => { const ks = []; for (let i = 0, r = 0; i < n; r++) { const k = Math.min(n - i, r % 2 ? 5 : 6); ks.push(k); i += k; }
      for (let m = ks.length - 1; m > 0 && ks[m] < 3 && ks[m] < ks[m - 1] - 1;) { ks[m]++; ks[m - 1]--; }   // さいごの 列が 1人だけに ならないように
      let i = 0; return ks.map(k => { const h = `<div class="fs-r">${Array.from({ length: k }, (_, j) => fig(CROWD[(rnd() * CROWD.length) | 0], true, false, i + j, rnd().toFixed(2))).join('')}</div>`; i += k; return h; }).join(''); };
    const TOTAL = '2万4,000人以上';
    L[4].innerHTML = `<div class="fs-top"><p class="v-lab">ビーガングルメ祭り 2025年</p><p class="fs-big"><b class="wc r n" data-t="${TOTAL}">${TOTAL}</b></p></div>` +
      `<div class="fs-row">${FES.map((f, k) => `<div class="fs-st" style="--k:${k}"><p class="fs-sign"><b>${f[0]}</b><span>${f[1]}</span></p>${tent(f[3])}` +
        `<div class="fs-cr">${rows(f[2])}</div></div>`).join('')}</div>` +
      `<p class="v-note">主催者発表（2024〜25年）</p>`;
    const fsN = L[4].querySelector('.n');
    const fsFmt = v => { v = Math.round(v); return (v >= 1e4 ? Math.floor(v / 1e4) + '万' + ctx.fmt(v % 1e4) : ctx.fmt(v)) + '人以上'; };
    const ppl = []; for (let i = 0; i < N; i++) ppl.push({ c: WARM[(rnd() * WARM.length) | 0], jx: rnd() - .5, jy: rnd() - .5, r1: rnd(), r2: rnd(), g: false });
    for (let b = 0; b + 20 <= N; b += 20) ppl[b + ((rnd() * 20) | 0)].g = true;   // 20人ごとに 1人
    let gi = 0; ppl.forEach(p => { if (p.g) p.gi = gi++; });
    let W = 0, H = 0, dpr = 1, S = 10, sig = '';

    /* 大きさが 変わった ときだけ 並べなおす（変わったら true） */
    function layout() {
      const w = box.clientWidth, h = box.clientHeight; if (!w || !h) return false;
      const R = { x: mid.offsetLeft, y: mid.offsetTop, w: mid.offsetWidth, h: mid.offsetHeight }, OV = .8, AS = 1.35;
      const d = Math.min(3, window.devicePixelRatio || 1), sg = [w, h, d, R.x, R.y, R.w, R.h].join();
      if (sg === sig || R.w < 20 || R.h < 20) return false;
      sig = sg; W = w; H = h; dpr = d; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      let b = null;
      for (let c = 12; c <= 50; c++) { const r = Math.ceil(N / c), cw = R.w / (c + .5), s = Math.min(cw * .94, R.h / ((r - 1) * OV + 1) / AS); if (!b || s > b.s) b = { c, r, cw, s }; }
      S = b.s; const fh = S * AS, ph = Math.min(fh * 1.05, (R.h - fh) / Math.max(1, b.r - 1)), y0 = R.y + (R.h - (ph * (b.r - 1) + fh)) / 2 + fh;
      ppl.forEach((p, i) => { const col = i % b.c, row = (i / b.c) | 0;
        p.x = R.x + (col + .5 + (row % 2) * .5) * b.cw + p.jx * b.cw * .12; p.y = y0 + row * ph + p.jy * S * .12;
        p.sx = -S - p.r1 * W * .3; p.d = (1 - col / b.c) * 900 + (row / b.r) * 150 + p.r2 * 150; });
      return true;
    }

    function man(g, x, y, s, body, skin, ink, lw) {
      const u = s / 20, X = v => x + (v - 10) * u, Y = v => y + (v - 27) * u;
      g.lineWidth = lw; g.strokeStyle = ink; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(X(3.5), Y(26)); g.lineTo(X(5.2), Y(15.5)); g.quadraticCurveTo(X(6.2), Y(11.5), X(10), Y(11.5)); g.quadraticCurveTo(X(13.8), Y(11.5), X(14.8), Y(15.5));
      g.lineTo(X(16.5), Y(26)); g.quadraticCurveTo(X(16.6), Y(27), X(15.5), Y(27)); g.lineTo(X(4.5), Y(27)); g.quadraticCurveTo(X(3.4), Y(27), X(3.5), Y(26)); g.closePath();
      g.fillStyle = body; g.fill(); g.stroke();
      g.beginPath(); g.arc(X(10), Y(6.5), 5.5 * u, 0, 6.2832); g.fillStyle = skin; g.fill(); g.stroke();
      if (s >= 19) { g.fillStyle = ink; g.beginPath(); g.arc(X(8), Y(6.3), .9 * u, 0, 6.2832); g.arc(X(12), Y(6.3), .9 * u, 0, 6.2832); g.fill(); }
    }
    /* tf = 入場アニメの経過ms（Infinity = 完了）、tg = みどりアニメの経過ms（-1 = なし） */
    function render(tf, tg) {
      if (!W) return N; const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const lw = Math.max(.9, S * .075), f = tg < 0 ? 0 : Math.min(1, tg / 450) * .66;
      const cols = {}; WARM.forEach(c => cols[c] = f ? mix(c, PAPER, f) : c); const skin = f ? mix(SKIN, PAPER, f) : SKIN, ink = f ? mix(INK, PAPER, f * .8) : INK;
      const top = []; let here = 0;
      for (const p of ppl) {
        let x = p.x, y = p.y;
        if (tf < 1e9) { const q = (tf - p.d) / 700; if (q <= 0) continue; if (q >= .6) here++; if (q < 1) { x = p.sx + (p.x - p.sx) * (1 - Math.pow(1 - q, 3)); y -= Math.abs(Math.sin(q * Math.PI * 3)) * S * 1.2 * (1 - q); } }
        if (tg >= 0 && p.g && tg >= 150 + p.gi * 60) { top.push(p); continue; }
        man(g, x, y, S, cols[p.c], skin, ink, lw);
      }
      for (const p of top) { const t = tg - 150 - p.gi * 60, a = t / 520, b = (t - 520) / 380;
        const hop = a < 1 ? Math.sin(a * Math.PI) * S * 1.7 : b < 1 ? Math.sin(b * Math.PI) * S * .7 : 0, sc = 1 + .32 * Math.min(1, t / 200);
        man(g, p.x, p.y - hop + S * (sc - 1) * .3, S * sc, LEAF, SKIN, INK, Math.max(1, lw * 1.15)); }
      return tf < 1e9 ? here : N;
    }

    let stops = [], cur = -1;
    const setNum = v => { const t = ctx.fmt(v); if (num.textContent !== t) { num.textContent = t; num.setAttribute('data-t', t); } };
    const stopAll = () => { stops.forEach(f => f()); stops = []; };
    const run = (ms, fn) => { if (RM) { fn(Infinity); return; } const t0 = performance.now(); let id = 0;
      const step = now => { const t = now - t0; if (t < ms) { fn(t); id = requestAnimationFrame(step); } else fn(Infinity); };
      fn(0); id = requestAnimationFrame(step); stops.push(() => cancelAnimationFrame(id)); };

    const play = [
      () => {},
      () => { run(2000, t => setNum(Math.round(MAN * render(t, -1) / N))); },
      () => { run(2400, t => render(Infinity, t)); },
      () => {
        const set = n => { evN.textContent = n; evN.setAttribute('data-t', n); };
        const light = i => { lans[i].classList.add('on'); pls[prefOf[i]].classList.add('on'); set(i + 1); };
        lans.forEach(l => l.classList.remove('on')); pls.forEach(p => p.classList.remove('on')); card.innerHTML = IDLE;
        if (RM) { ev.forEach((e, i) => light(i)); return; }
        set(0);
        ev.forEach((e, i) => later(250 + i * 85, () => { light(i); card.innerHTML = `<span class="d">${e[0]}月${e[1]}日　${e[3]}</span><b>${e[2]}</b>`; }));
        later(250 + ev.length * 85 + 450, () => { card.innerHTML = IDLE; });
      },
      () => { stops.push(K.count(fsN, 24000, 1500, 0, fsFmt)); },
    ];
    const later = (ms, fn) => { const t = setTimeout(fn, ms); stops.push(() => clearTimeout(t)); };
    function go(k) {
      stopAll(); cur = k;
      L.forEach((l, j) => { l.classList.toggle('on', j === k); l.classList.remove('play'); });
      cv.classList.toggle('on', k === 1 || k === 2);
      if (k === 1 || k === 2) layout();
      void box.offsetWidth; L[k].classList.add('play'); play[k]();
    }
    function resize() {
      if (!layout()) return;
      if (cur === 1) { stopAll(); setNum(MAN); render(Infinity, -1); } else if (cur === 2) { stopAll(); render(Infinity, Infinity); }
    }
    layout();
    return { go, resize };
  },
  scenes() {
    return [
      { pose: 'questioning', name: 'クイズ', html: 'クイズ！ 2025年に 日本へ 来た 旅行者は、何人くらい でしょう？', quiz: { opts: ['約1,200万人', '約2,700万人', '約4,300万人'], ans: 2 } },
      { pose: 'surprised-3', name: 'こたえ', html: a => a.pre + 'こたえは <b>4,268万人</b>。過去最高 なんだ！ 人 ひとりが 10万人だよ。' },
      { pose: 'pointing-up', name: '20人に1人', html: 'この うち、ベジタリアン・ヴィーガンは <b>約20人に 1人</b>。年間 約200〜260万人が、食べられる お店を さがしてるんだ。<small>観光庁の調査をもとにした試算</small>' },
      { pose: 'explaining', name: 'イベント', html: '日本の なかでも 広がってるよ。2026年の ヴィーガンイベントは <b>22回</b>、8都府県で 開催！' },
      { pose: 'excited', name: 'ビーガングルメ祭り', html: 'ビーガングルメ祭りには、2025年に <b>2万4,000人以上</b>が 来場！ 「食べたい」は、もう ここに あるね。<small>主催者発表</small>' },
    ];
  },
};
})();
