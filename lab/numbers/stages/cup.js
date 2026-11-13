/* 03 コップ1杯の ちから — 豆乳が そそがれる コップ */
(() => {
'use strict';

const CSS = `
.viz-cup{--sw:2.2px;--milk:#F2DDA9;--water:#6FB7E6}
.viz-cup svg{display:block;overflow:visible}
.viz-cup .k{stroke:var(--ink);stroke-width:var(--sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.viz-cup .pp{opacity:0}
.viz-cup .pp.in{opacity:1;animation:cupPop .5s cubic-bezier(.3,1.5,.5,1) both}
@keyframes cupPop{from{opacity:0;scale:.3}}

/* コップ */
.viz-cup .g{position:relative;flex:none;aspect-ratio:120/150;height:min(56cqh,56cqw)}
.viz-cup .g svg{width:100%;height:100%;filter:drop-shadow(3px 4px 0 rgba(31,24,18,.16))}
.viz-cup .g-body{fill:rgba(255,255,255,.66)}
.viz-cup .g-milk{fill:var(--milk)}
.viz-cup .g-surf{fill:none;stroke-width:2px}
.viz-cup .g-mark{fill:none;stroke:var(--ink-soft);stroke-width:2px;stroke-dasharray:5 5;vector-effect:non-scaling-stroke;opacity:0;transition:opacity .4s}
.viz-cup .g-mark.in{opacity:.8}
.viz-cup .g-shine{fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;opacity:.92}
.viz-cup .g-out{fill:none;stroke-width:calc(var(--sw) + .5px)}
.viz-cup .g-rim{fill:rgba(255,255,255,.9);stroke-width:calc(var(--sw) + .5px)}

/* 0・1：2008年 と 2025年 */
.viz-cup .s-a{display:flex;flex-direction:column;align-items:center;justify-content:center}
.viz-cup .a-big{height:min(20cqh,21.5cqw);display:flex;align-items:center;justify-content:center}
.viz-cup .a-big .wc{font-size:min(14.5cqh,15.5cqw);line-height:1.2;rotate:-4deg;white-space:nowrap}
.viz-cup .a-row{display:flex;align-items:flex-end;justify-content:center;gap:6cqw;transition:transform .6s cubic-bezier(.3,1.3,.5,1)}
.viz-cup .s-a.q .a-row{transform:translateY(calc(min(20cqh,21.5cqw) * -.5))}
.viz-cup .a-col{display:flex;flex-direction:column;align-items:center;gap:min(2.6cqh,2.6cqw)}
.viz-cup .v-chip{font-size:clamp(16px,min(4.4cqw,3.4cqh),26px)}
.viz-cup .a-val{position:absolute;left:50%;translate:-50% 0;white-space:nowrap;font-size:clamp(15px,min(5cqw,5.8cqh),34px);line-height:1.2;transition:opacity .3s}
.viz-cup .a-val b{font-family:var(--pop);font-weight:400;color:var(--royal);font-size:1.3em;margin-right:.06em}
.viz-cup .s-a.q .a-val{opacity:0}
.viz-cup .a-q{position:absolute;left:50%;top:47%;translate:-50% -50%;font-size:min(24cqh,25cqw);line-height:1.2}
.viz-cup .a-q.in{animation:cupQ 1.3s cubic-bezier(.3,1.5,.5,1) both}
@keyframes cupQ{0%{opacity:0;scale:.3}35%{opacity:1;scale:1;rotate:-9deg}55%{rotate:8deg}75%{rotate:-4deg}100%{rotate:0deg}}

/* 2：コップ1杯のちがい */
.viz-cup .s-b{display:flex;align-items:center;justify-content:center;gap:3cqw}
.viz-cup .b-l{flex:none;display:flex;flex-direction:column;align-items:center;gap:min(2.6cqh,2.6cqw)}
.viz-cup .b-l .g{height:min(44cqh,31cqw)}
.viz-cup .b-r{flex:none;width:68cqw;display:flex;flex-direction:column;justify-content:center;gap:min(3cqh,3cqw)}
.viz-cup .b-row{display:flex;align-items:center;gap:2.4cqw}
.viz-cup .b-pic{flex:none;width:min(25cqh,20cqw);aspect-ratio:1;background:var(--white);border:2.5px solid var(--ink);border-radius:22%;box-shadow:3px 3px 0 var(--ink);overflow:hidden}
.viz-cup .b-pic svg{width:100%;height:100%}
.viz-cup .b-tx{display:flex;flex-direction:column;align-items:flex-start;min-width:0}
.viz-cup .b-tx .v-lab{font-size:clamp(15px,min(4.6cqw,5.4cqh),30px);line-height:1.2}
.viz-cup .b-tx .wc{font-size:min(8.3cqw,11cqh);line-height:1.2;white-space:nowrap}
.viz-cup .b-tx .v-note{font-size:clamp(13px,min(3.7cqw,4.4cqh),24px);white-space:nowrap;font-weight:900}
.viz-cup .cl-g{fill:none;stroke:var(--ink-soft);stroke-width:1.6px;stroke-dasharray:4 4;vector-effect:non-scaling-stroke;opacity:.7}
.viz-cup .cl{fill:#CFC9BF;transform-box:fill-box;transform-origin:50% 62%;scale:.6}
.viz-cup .in .cl{animation:cupShrink 1s .3s cubic-bezier(.5,0,.3,1) both}
@keyframes cupShrink{from{scale:1}}
.viz-cup .tb-in{fill:#fff}
.viz-cup .tb-w{fill:var(--water)}
.viz-cup .tb-o{fill:none}
.viz-cup .tb-d{fill:var(--water)}
.viz-cup .in .tb-w{animation:cupRise 1s .25s cubic-bezier(.3,.9,.4,1) both}
@keyframes cupRise{from{transform:translateY(20px)}}
.viz-cup .in .tb-d{animation:cupDrop .42s .1s 3 ease-in backwards}
@keyframes cupDrop{0%{transform:translateY(-8px);opacity:0}25%{opacity:1}100%{transform:translateY(26px);opacity:0}}
.viz-cup .ld-s{fill:#B88A5B}
.viz-cup .ld-g{fill:#8FBB7B}
.viz-cup .ld-t{fill:none}
.viz-cup .ld{transform-box:fill-box;transform-origin:50% 70%}
.viz-cup .in .ld{animation:cupPop .6s .2s cubic-bezier(.3,1.6,.5,1) both}

/* 3：1年つづけると（シミュレーター） */
.viz-cup .s-c{--h:min(11.5cqh,12cqw);--rows:7;--cols:63;display:flex;flex-direction:column;gap:min(2cqh,2cqw);padding:0 1cqw}
.viz-cup .c-chips{flex:none;display:grid;grid-template-columns:repeat(4,1fr);gap:min(7px,1.7cqw);padding:0 4px 4px 0}
.viz-cup .c-chips .btn{min-width:0;min-height:clamp(44px,8cqh,60px);padding:0 2px;font-size:clamp(14px,4.1cqw,22px);border-radius:14px;touch-action:manipulation}
.viz-cup .c-rows{flex:1;min-height:0;display:grid;grid-template-rows:repeat(3,1fr)}
.viz-cup .c-row{display:flex;flex-direction:column;justify-content:center;gap:min(1cqh,5px);min-height:0}
.viz-cup .c-tx{display:flex;align-items:baseline;gap:.22em;white-space:nowrap;font-size:clamp(15px,min(4.5cqw,5.2cqh),30px);line-height:1.2}
.viz-cup .c-tx .wc{font-size:1.9em;line-height:1.15}
.viz-cup .c-sub{margin-left:auto;align-self:center;background:var(--white);border:2px solid var(--ink);border-radius:999px;padding:1px 10px;font-size:clamp(13px,min(3.6cqw,4cqh),20px);line-height:1.45;-webkit-text-stroke:0}
.viz-cup .c-sub i{font-style:normal;color:var(--royal)}
.viz-cup .c-ic{height:var(--h);display:flex;align-items:flex-end}
.viz-cup .c-ic .k{stroke-width:1.6px}
.viz-cup .t{flex:none;width:calc(var(--h) * .56);height:var(--h);transform-origin:50% 100%;animation:cupTree .36s cubic-bezier(.3,1.6,.5,1) both;animation-delay:calc(var(--i) * var(--d))}
.viz-cup .t + .t{margin-left:min(1px,calc((96cqw - var(--h) * .56 * var(--n)) / (var(--n) - 1)))}
.viz-cup .t svg{width:100%;height:100%}
@keyframes cupTree{from{opacity:0;scale:0}}
.viz-cup .t-f{fill:var(--leaf)}
.viz-cup .t-w{fill:#A9763F}
.viz-cup .c-bath{align-items:center;gap:1.6cqw}
.viz-cup .c-tub{flex:none;width:var(--h);height:var(--h)}
.viz-cup .c-tub svg{width:100%;height:100%}
.viz-cup .c-dots{--p:calc((96cqw - var(--h) - 1.6cqw) / var(--cols));position:relative;flex:none;width:calc(var(--p) * var(--cols));height:calc(var(--p) * var(--rows))}
.viz-cup .c-dots i{position:absolute;left:0;bottom:0;background:radial-gradient(circle at 50% 50%,#3C95D2 0 37%,transparent 41%) 0 100%/var(--p) var(--p)}
.viz-cup .c-dots .dg{width:100%;height:100%;opacity:.16}
.viz-cup .c-dots .df{height:100%;width:calc(var(--p) * var(--c,0))}
.viz-cup .c-dots .dr{left:calc(var(--p) * var(--c,0));width:var(--p);height:calc(var(--p) * var(--r,0))}
.viz-cup .c-courts{gap:1.5cqw;align-items:center}
.viz-cup .ct{position:relative;flex:1;height:calc(var(--h) * .84)}
.viz-cup .ct svg{position:absolute;inset:0;width:100%;height:100%}
.viz-cup .ct-f{position:absolute;inset:0;clip-path:inset(-5px calc(100% - var(--w,0%)) -5px -5px)}
.viz-cup .ct-0{fill:rgba(255,255,255,.5);stroke:var(--ink-soft);stroke-width:1.5px;stroke-dasharray:4 4;vector-effect:non-scaling-stroke}
.viz-cup .ct-g{fill:#7FB06E}
.viz-cup .ct-l{fill:none;stroke:#fff;stroke-width:1.4px;vector-effect:non-scaling-stroke}
.viz-cup .ct-n{fill:none;stroke-dasharray:2 2}

/* 4：日本ぜんたいでは */
.viz-cup .s-d{display:flex;flex-direction:column;justify-content:center;gap:min(2.4cqh,12px);padding:0 4px 4px 0}
.viz-cup .d-card{flex:1;min-height:0;display:flex;align-items:center;gap:2.5cqw;padding:0 2.6cqw;background:rgba(255,253,247,.9);border:2.5px solid var(--ink);border-radius:min(5cqw,26px);box-shadow:3px 3px 0 var(--ink);opacity:0}
.viz-cup .d-card.in{opacity:1;animation:cupLand .6s cubic-bezier(.3,1.45,.5,1) both}
@keyframes cupLand{from{opacity:0;transform:translateY(-10cqh) rotate(-2.5deg)}}
.viz-cup .d-tx{flex:none;width:51cqw;display:flex;flex-direction:column;align-items:flex-start;gap:min(.7cqh,5px)}
.viz-cup .d-k{font:900 clamp(14px,min(4.2cqw,4.6cqh),28px)/1.25 var(--round)}
.viz-cup .d-tx .wc{font-size:min(8cqw,9.4cqh);line-height:1.2;white-space:nowrap}
.viz-cup .d-s{font:900 clamp(13px,min(3.8cqw,4.1cqh),24px)/1.3 var(--round);white-space:nowrap}
.viz-cup .d-pic{position:relative;flex:1;min-width:0;display:flex;align-items:center;justify-content:center}
.viz-cup .d-pic .k{stroke-width:1.6px}
.viz-cup .d-hs{--hw:min(5.3cqw,5.6cqh);display:grid;grid-template-columns:repeat(7,var(--hw));gap:min(.9cqh,.9cqw) 0}
.viz-cup .hs{width:var(--hw);height:var(--hw)}
.viz-cup .hs svg{width:100%;height:100%}
.viz-cup .h-r{fill:var(--royal)}
.viz-cup .hs:nth-child(3n+2) .h-r{fill:var(--gold)}
.viz-cup .hs:nth-child(4n+3) .h-r{fill:var(--leaf)}
.viz-cup .h-b{fill:#fff}
.viz-cup .h-d{fill:#C9A678}
.viz-cup .d-card.in .hs{animation:cupPop .4s cubic-bezier(.3,1.5,.5,1) both;animation-delay:calc(.25s + var(--i) * 32ms)}
.viz-cup .d-dome{position:relative;width:min(37cqw,36cqh)}
.viz-cup .d-dome svg{width:100%;height:auto}
.viz-cup .dm-b{fill:#fff}
.viz-cup .dm-w{fill:var(--water)}
.viz-cup .dm-q{fill:none;stroke:var(--ink);stroke-width:1.2px;vector-effect:non-scaling-stroke;opacity:.45}
.viz-cup .dm-o{fill:none}
.viz-cup .dm-e{fill:#fff}
.viz-cup .d-card.in .dm-w{animation:cupFillD 1.1s .3s cubic-bezier(.3,.9,.4,1) both}
@keyframes cupFillD{from{transform:translateY(54px)}}
.viz-cup .d-x{position:absolute;right:-3%;top:-7%;rotate:7deg;font-size:clamp(13px,min(3.6cqw,3.8cqh),22px);padding:1px 9px;border-width:2px;box-shadow:2px 2px 0 var(--ink);color:var(--royal)}
.viz-cup .d-card.in .d-x{animation:cupPop .5s .8s cubic-bezier(.3,1.5,.5,1) both}
.viz-cup .d-land{position:relative;width:min(38cqw,54cqh)}
.viz-cup .d-land svg{width:100%;height:auto}
.viz-cup .td-b{transform-box:fill-box;transform-origin:50% 50%}
.viz-cup .td-k{fill:var(--ink);stroke:var(--ink);stroke-width:182;stroke-linejoin:round}
.viz-cup .td-g{fill:#8FBB7B;stroke:#8FBB7B;stroke-width:150;stroke-linejoin:round}
.viz-cup .td-t{fill:rgba(255,253,247,.62);stroke:var(--ink);stroke-width:1.6px;stroke-dasharray:4 3;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.viz-cup .d-card.in .td-b{animation:cupGrow .8s .35s cubic-bezier(.3,1.5,.5,1) both}
@keyframes cupGrow{from{scale:.84}}
.viz-cup .td-n{position:absolute;left:50%;top:50%;translate:-50% -50%;white-space:nowrap;font:900 clamp(13px,min(3.6cqw,3.8cqh),22px)/1.2 var(--round);-webkit-text-stroke:4px var(--paper);paint-order:stroke fill}

@container (max-aspect-ratio:3/4){
  .viz-cup .a-big{height:30cqw}
  .viz-cup .a-big .wc{font-size:19cqw}
  .viz-cup .s-a.q .a-row{transform:translateY(-15cqw)}
  .viz-cup .s-c{--h:min(11.5cqh,16.5cqw);--rows:9;--cols:49}
  .viz-cup .ct{height:min(calc(var(--h) * .84),10.5cqw)}
}
/* スマホ：コップを 上に、3つの けっかを 下に */
@container (max-width:520px){
  .viz-cup .s-b{flex-direction:column;gap:min(3cqh,5cqw)}
  .viz-cup .b-l{flex-direction:row;gap:4cqw}
  .viz-cup .b-l .g{height:min(23cqh,40cqw)}
  .viz-cup .b-r{width:auto;gap:min(2.4cqh,4cqw)}
  .viz-cup .b-row{gap:3.4cqw}
  .viz-cup .b-pic{width:min(19.5cqh,26cqw)}
  .viz-cup .b-tx .wc{font-size:min(10.4cqh,12cqw)}
  .viz-cup .b-tx .v-lab{font-size:clamp(15px,min(4.6cqh,5cqw),22px)}
  .viz-cup .b-tx .v-note{font-size:clamp(13px,min(3.6cqh,4cqw),18px)}
}

@media (min-width:900px){.viz-cup{--sw:3px}.viz-cup .b-pic{border-width:3px;box-shadow:4px 4px 0 var(--ink)}.viz-cup .c-ic .k{stroke-width:2.2px}.viz-cup .ct-l{stroke-width:2px}}
@media (prefers-reduced-motion:reduce){.viz-cup *{animation:none!important;transition:none!important}}
`;

const BODY = 'M12 9V128Q12 145 29 145H91Q108 145 108 128V9';
const CLOUD = 'M23 58Q10 58 10 46.5Q10 36 21 35Q23.500 22 37 22Q47 22 51.500 30.500Q54.500 28 59 28Q70 28 70 40Q76 42.500 76 49.500Q76 58 66 58Z';
const TREE = '<svg viewBox="0 0 28 50" aria-hidden="true"><path class="t-w k" d="M12 38H16V48H12Z"/><path class="t-f k" d="M14 3L22 18H18.500L24.500 30H20L26 41H2L8 30H3.500L9.500 18H6Z"/></svg>';
const COURT0 = '<svg viewBox="0 0 78 38" preserveAspectRatio="none" aria-hidden="true"><rect class="ct-0" x="1.5" y="1.5" width="75" height="35" rx="3"/></svg>';
const COURT = '<svg viewBox="0 0 78 38" preserveAspectRatio="none" aria-hidden="true"><rect class="ct-g k" x="1.5" y="1.5" width="75" height="35" rx="3"/><path class="ct-l" d="M7 6H71V32H7ZM7 10.500H71M7 27.500H71M22 10.500V27.500M56 10.500V27.500M22 19H56"/><path class="ct-n k" d="M39 2V36"/></svg>';
let uid = 0;

/* おふろの絵（f = 水の高さ 0〜1） */
function tubSvg(f, drop) {
  const id = 'cup-tub' + (++uid), y = (62 - 26 * f).toFixed(1);
  return `<svg viewBox="0 0 80 80" aria-hidden="true"><defs><clipPath id="${id}"><path d="M15 36H65V48Q65 62 51 62H29Q15 62 15 48Z"/></clipPath></defs>` +
    `<path class="tb-in" d="M13 36V48Q13 64 29 64H51Q67 64 67 48V36Z"/>` +
    `<g clip-path="url(#${id})"><path class="tb-w" d="M8 ${y}q4-2.600 8 0t8 0 8 0 8 0 8 0 8 0 8 0 8 0V70H8Z"/></g>` +
    `<path class="tb-o k" d="M13 36V48Q13 64 29 64H51Q67 64 67 48V36M7 36H73M26 64L23 71M54 64L57 71"/>` +
    (drop ? `<path class="tb-d k" d="M40 8Q46 17 46 21A6 6 0 0 1 34 21Q34 17 40 8Z"/>` : '') + `</svg>`;
}

(window.StageViz = window.StageViz || {}).cup = {
  init(viz, ctx) {
    const { el, style, count, tween, ease } = ctx.kit, EX = ctx.EX, R = ctx.reduced, box = ctx.box;
    box.classList.add('viz-cup'); style('viz-cup-css', CSS);

    /* 動きの管理：go() のたびに ぜんぶ止める */
    let jobs = [];
    const stop = () => { jobs.forEach(f => f()); jobs = []; };
    const later = (ms, fn) => { if (R || ms <= 0) { fn(); return; } const t = setTimeout(fn, ms); jobs.push(() => clearTimeout(t)); };
    const run = (ms, fn, done) => jobs.push(tween(ms, fn, done));
    const cnt = (e, to, ms, from, f) => jobs.push(count(e, to, ms, from, f));
    const pop = (e, on) => { e.classList.remove('in'); if (on) { void e.offsetWidth; e.classList.add('in'); } };
    const layer = cls => { const s = el('div', 'sc ' + cls); box.appendChild(s); return s; };

    /* コップ（set(f) = 豆乳の高さ 0〜1） */
    function glass() {
      const id = 'cup-clip' + (++uid), g = el('div', 'g');
      g.innerHTML = `<svg viewBox="0 0 120 150" aria-hidden="true"><defs><clipPath id="${id}"><path d="M16 9H104V127Q104 140 91 140H29Q16 140 16 127Z"/></clipPath></defs>` +
        `<path class="g-body" d="${BODY}Z"/><g clip-path="url(#${id})"><path class="g-milk"/><path class="g-surf k"/><path class="g-mark"/></g>` +
        `<path class="g-shine" d="M26 27V86M26 98V105"/><path class="g-out k" d="${BODY}"/><ellipse class="g-rim k" cx="60" cy="9" rx="48" ry="4.500"/></svg>`;
      const milk = g.querySelector('.g-milk'), surf = g.querySelector('.g-surf'), mark = g.querySelector('.g-mark');
      const o = { el: g, mark, f: 0,
        set(f, amp = 1.3, ph = 0) {
          o.f = f; const y = 140 - 122 * f; let d = '';
          for (let x = 12; x <= 108; x += 4) d += (d ? 'L' : 'M') + x + ' ' + (y + amp * Math.sin(x / 13 + ph)).toFixed(2);
          milk.setAttribute('d', d + 'V150H12Z'); surf.setAttribute('d', d);
          milk.style.opacity = surf.style.opacity = f > .004 ? 1 : 0;
        },
        fill(from, to, ms, each) { run(ms, p => { o.set(from + (to - from) * ease.out(p), 1.3 + 7 * Math.pow(1 - p, 1.4), p * 15); if (each) each(o.f, p); }); },
        at: f => ((10 + 122 * f) / 150 * 100 + 2.5) + '%' };
      o.set(0); return o;
    }

    /* ---------- 0・1：2008年 → 2025年 ---------- */
    const soy = y => EX.soy.find(r => r[0] === y)[1], s0 = soy(2008), s1 = soy(2025), F1 = .82, F0 = F1 * s0 / s1, man = v => (v / 1e4).toFixed(1);
    const A = layer('s-a');
    A.innerHTML = `<div class="a-big"><span class="wc r pp" data-t="約${(s1 / s0).toFixed(1)}倍">約${(s1 / s0).toFixed(1)}倍</span></div><div class="a-row"><div class="a-col"></div><div class="a-col"></div></div>`;
    const aBig = A.querySelector('.a-big .wc'), aCols = A.querySelectorAll('.a-col'), g1 = glass(), g2 = glass();
    const v1 = el('span', 'a-val v-lab', `<b>${man(s0)}</b>万kL`), v2 = el('span', 'a-val v-lab', `<b>${man(s1)}</b>万kL`), v2n = v2.querySelector('b');
    const aQ = el('span', 'a-q wc r pp', '？'); aQ.setAttribute('data-t', '？');
    g1.el.appendChild(v1); g2.el.append(v2, aQ);
    aCols[0].append(g1.el, el('span', 'v-chip', '2008年')); aCols[1].append(g2.el, el('span', 'v-chip', '2025年'));
    g2.mark.setAttribute('d', `M12 ${140 - 122 * F0}H108`); v1.style.bottom = g1.at(F0);

    function playQuiz() {
      A.classList.add('q'); pop(aBig, false); g2.mark.classList.remove('in'); g2.set(0); v2.style.bottom = g2.at(0);
      g1.set(0); g1.fill(0, F0, 900); later(350, () => pop(aQ, true));
    }
    function playReveal() {
      A.classList.remove('q'); pop(aQ, false); g1.set(F0); g2.set(0); v2.style.bottom = g2.at(0); g2.mark.classList.add('in');
      v2n.textContent = man(s0);
      later(250, () => { g2.fill(0, F1, 1500, f => { v2.style.bottom = g2.at(f); }); cnt(v2n, s1 / 1e4, 1500, s0 / 1e4, v => v.toFixed(1)); });
      later(1350, () => pop(aBig, true));
    }

    /* ---------- 2：コップ1杯のちがい ---------- */
    const B = layer('s-b'), gB = glass(), c = EX.cup;
    const bL = el('div', 'b-l'), bR = el('div', 'b-r'); bL.append(gB.el, el('span', 'v-chip', 'コップ 1杯')); B.append(bL, bR);
    const bRows = [
      { k: 'CO₂', to: c.co2, f: v => '−' + v.toFixed(2) + 'kg',
        pic: `<svg viewBox="0 0 80 80" aria-hidden="true"><path class="cl-g" d="${CLOUD}"/><path class="cl k" d="${CLOUD}"/></svg>` },
      { k: '水', to: c.water, f: v => '−' + Math.round(v) + 'L', sub: `おふろ ${(c.water / EX.bath).toFixed(1)}杯ぶん`, pic: tubSvg(c.water / EX.bath, true) },
      { k: '土地', to: c.land, f: v => '−' + v.toFixed(2) + '㎡',
        pic: `<svg viewBox="0 0 80 80" aria-hidden="true"><g class="ld"><path class="ld-s k" d="M8 41L40 59L72 41V50L40 68L8 50Z"/><path class="ld-g k" d="M40 23L72 41L40 59L8 41Z"/>` +
          `<path class="ld-t k" d="M31 42v-7M31 38q-5-1-5-6M31 39q5-1 5-6M50 46v-7M50 42q-5-1-5-6M50 43q5-1 5-6"/></g></svg>` },
    ].map(r => {
      const row = el('div', 'b-row pp', `<div class="b-pic">${r.pic}</div><div class="b-tx"><span class="v-lab">${r.k}</span><span class="wc r" data-t="${r.f(r.to)}">${r.f(r.to)}</span>${r.sub ? `<span class="v-note">${r.sub}</span>` : ''}</div>`);
      bR.appendChild(row); return { row, num: row.querySelector('.wc'), to: r.to, f: r.f };
    });
    function playCup() {
      gB.set(0); gB.fill(0, .86, 900);
      bRows.forEach((r, i) => { pop(r.row, false); later(300 + i * 650, () => { pop(r.row, true); cnt(r.num, r.to, 800, 0, r.f); }); });
    }

    /* ---------- 3：1年つづけると ---------- */
    const C = layer('s-c'), fmt = ctx.fmt;
    const PACE = [['週1杯', '週 1杯', 52], ['週3杯', '週 3杯', 156], ['毎日1杯', '毎日 1杯', 365], ['毎日2杯', '毎日 2杯', 730]];
    const cChips = el('div', 'c-chips'); cChips.setAttribute('role', 'group'); cChips.setAttribute('aria-label', 'のむ ペース');
    const cRow = (k, u, sub, ic) => `<div class="c-row"><p class="c-tx v-lab"><span>${k}</span><b class="wc r" data-t="0">0</b><span>${u}</span><span class="c-sub">${sub}</span></p>${ic}</div>`;
    const cRows = el('div', 'c-rows',
      cRow('スギ', '本ぶん', 'CO₂ <i></i>kg', '<div class="c-ic c-trees"></div>') +
      cRow('おふろ', '杯ぶん', '水 <i></i>L', `<div class="c-ic c-bath"><div class="c-tub">${tubSvg(.82, true)}</div><div class="c-dots"><i class="dg"></i><i class="df"></i><i class="dr"></i></div></div>`) +
      cRow('テニスコート', '面ぶん', '土地 <i></i>㎡', `<div class="c-ic c-courts">${`<div class="ct">${COURT0}<div class="ct-f">${COURT}</div></div>`.repeat(5)}</div>`));
    C.append(cChips, cRows);
    const cNum = [...cRows.querySelectorAll('.wc')], cSub = [...cRows.querySelectorAll('.c-sub i')], cTrees = cRows.querySelector('.c-trees'), cDots = cRows.querySelector('.c-dots'), cCts = [...cRows.querySelectorAll('.ct-f')];
    const cBtns = PACE.map((pc, j) => { const b = el('button', 'btn', pc[0]); b.type = 'button'; b.addEventListener('click', () => showPace(j, true)); cChips.appendChild(b); return b; });
    /* おふろの点：1つ = 1杯。たての数（--rows）は 画面の形で かわる */
    let dRows = 7, dNow = 0;
    const readRows = () => { dRows = +getComputedStyle(cDots).getPropertyValue('--rows') || 7; };
    const dots = m => { dNow = m; cDots.style.setProperty('--c', Math.floor(m / dRows)); cDots.style.setProperty('--r', m % dRows); };
    function showPace(i, talk) {
      stop(); readRows(); cBtns.forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
      const n = PACE[i][2], kg = n * c.co2, L = n * c.water, m2 = n * c.land;
      const trees = Math.round(kg / EX.cedar), baths = Math.round(L / EX.bath), courts = Math.round(m2 / EX.court * 10) / 10;
      [kg, L, m2].forEach((v, j) => { cSub[j].textContent = fmt(v); });
      cnt(cNum[0], trees, 800); cnt(cNum[1], baths, 900); cnt(cNum[2], courts, 900, 0, v => v.toFixed(1));
      cTrees.style.setProperty('--n', trees); cTrees.style.setProperty('--d', (700 / trees).toFixed(1) + 'ms');
      cTrees.innerHTML = Array.from({ length: trees }, (_, j) => `<span class="t" style="--i:${j}">${TREE}</span>`).join('');
      run(900, p => dots(Math.round(baths * ease.out(p))));
      run(900, p => { const v = courts * ease.out(p); cCts.forEach((e, j) => e.style.setProperty('--w', (Math.max(0, Math.min(1, v - j)) * 100).toFixed(1) + '%')); });
      if (talk) ctx.say(`${PACE[i][1]}なら、1年で スギ <b>${trees}本</b>ぶんの CO₂、おふろ <b>${baths}杯</b>ぶんの 水に なるよ。<small>試算</small>`);
    }
    function playYear() { showPace(2, false); }

    /* ---------- 4：日本ぜんたいでは ---------- */
    const D = layer('s-d');
    const HOUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="h-b k" d="M5 11H19V21H5Z"/><path class="h-d k" d="M10.500 21V15.500H13.500V21"/><path class="h-r k" d="M12 3L22.500 11.500H1.500Z"/></svg>';
    const DOME = 'M12 70V50Q16 17 60 17Q104 17 108 50V70Z';
    /* 鳥取県の かたち（地図データから。なければ まるい かたち） */
    const land = (() => {
      const t = (ctx.jp || []).find(r => +r[0] === 31), r = t && t[1] && t[1][0];
      if (!r || r.length < 12) return { d: 'M40 250Q200 60 560 120T1090 150Q1160 330 1010 450T480 520T60 430Z', w: 1125, h: 557 };
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, d = '';
      for (let i = 0; i < r.length; i += 2) { x0 = Math.min(x0, r[i]); x1 = Math.max(x1, r[i]); y0 = Math.min(y0, r[i + 1]); y1 = Math.max(y1, r[i + 1]); }
      for (let i = 0; i < r.length; i += 2) d += (d ? 'L' : 'M') + Math.round((r[i] - x0) * .816) + ' ' + Math.round(y1 - r[i + 1]);
      return { d: d + 'Z', w: Math.round((x1 - x0) * .816), h: Math.round(y1 - y0) };
    })();
    const dCards = [
      { k: '温室効果ガス', to: 96, f: v => '約' + Math.round(v) + '万トン', s: '約27万世帯の 1年分',
        pic: `<div class="d-hs">${Array.from({ length: 27 }, (_, i) => `<span class="hs" style="--i:${i}">${HOUSE}</span>`).join('')}</div>` },
      { k: '水', to: 2.7, f: v => '約' + v.toFixed(1) + '億㎥', s: '東京ドーム 約215杯分',
        pic: `<div class="d-dome"><svg viewBox="0 0 120 80" aria-hidden="true"><defs><clipPath id="cup-dome"><path d="${DOME}"/></clipPath></defs><path class="dm-b" d="${DOME}"/>` +
          `<g clip-path="url(#cup-dome)"><path class="dm-w" d="M0 25q5-2.500 10 0t10 0 10 0 10 0 10 0 10 0 10 0 10 0 10 0 10 0 10 0 10 0V84H0Z"/></g>` +
          `<path class="dm-q" d="M60 17V50M37 21Q30 34 29 50M83 21Q90 34 91 50M17 39Q60 30 103 39M14 60H106"/>` +
          `<path class="dm-o k" d="${DOME}"/><path class="dm-e k" d="M7 48H113V53H7Z"/><path class="dm-o k" d="M3 70H117"/></svg><span class="v-chip d-x">約215杯</span></div>` },
      { k: '土地', to: 3700, f: v => '約' + fmt(Math.round(v / 10) * 10) + 'k㎡', s: '鳥取県より 広い',
        pic: `<div class="d-land"><svg viewBox="-100 -100 ${land.w + 200} ${land.h + 200}" aria-hidden="true"><g class="td-b"><path class="td-k" d="${land.d}"/><path class="td-g" d="${land.d}"/></g><path class="td-t" d="${land.d}"/></svg><span class="td-n">鳥取県</span></div>` },
    ].map(r => {
      const card = el('div', 'd-card', `<div class="d-tx"><span class="d-k">${r.k}</span><b class="wc r" data-t="${r.f(r.to)}">${r.f(r.to)}</b><span class="d-s">${r.s}</span></div><div class="d-pic">${r.pic}</div>`);
      D.appendChild(card); return { card, num: card.querySelector('.wc'), to: r.to, f: r.f };
    });
    function playJapan() {
      dCards.forEach((r, i) => { pop(r.card, false); later(i * 600, () => { pop(r.card, true); cnt(r.num, r.to, 700, 0, r.f); }); });
    }

    const layers = [A, A, B, C, D], plays = [playQuiz, playReveal, playCup, playYear, playJapan];
    return {
      go(k) { stop(); [A, B, C, D].forEach(l => l.classList.toggle('on', l === layers[k])); plays[k](); },
      resize() { readRows(); dots(dNow); },
    };
  },
  scenes() {
    return [
      { pose: 'questioning', name: 'クイズ', html: 'クイズ！ 日本の 豆乳の 生産量は、2008年から 2025年で 何倍に なった でしょう？', quiz: { opts: ['約1.5倍', '約2.7倍', '約5倍'], ans: 1 } },
      { pose: 'excited', name: 'こたえ', html: a => a.pre + 'こたえは <b>約2.7倍</b>！ 16.3万kL から 44.5万kL に ふえたんだ。' },
      { pose: 'teaching', name: 'コップ1杯のちがい', html: '牛乳の かわりに 豆乳を えらぶと、コップ 1杯で これだけ ちがうよ。<small>世界平均の試算。コップ1杯＝200mL</small>' },
      { pose: 'curious', name: '1年つづけると', html: 'じぶんの ペースを えらんでみて！ 1年 つづけると どうなるかな？<small>試算</small>' },
      { pose: 'presenting', name: '日本ぜんたいでは', html: 'もし 去年の 豆乳が ぜんぶ 牛乳だったら？ 日本ぜんたいで、これだけ かるく なってるんだ。<small>上限の試算</small>' },
    ];
  },
};
})();
