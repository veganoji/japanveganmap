/* 02 ことし、どれだけ ふえた？ — 畑に 芽が 出る（芽 1つ = 10軒） */
(() => {
'use strict';
const JOINED = 1560, N = 156, COLS = 13, ROWS = 12, ONE = 8 * COLS + 6, PALE = 14, CLOSED = 143, TIMES = 11;
const uri = s => `url("data:image/svg+xml,${s.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
const SVG = b => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${b}`;
const SPROUT = uri(SVG("24 24'>") +
  "<ellipse cx='12' cy='21.4' rx='6.4' ry='2.1' fill='#8C5E33'/>" +
  "<path d='M12 21.2C12.2 17.6 11.5 15 12 11.6' fill='none' stroke='#1F1812' stroke-width='4.2' stroke-linecap='round'/>" +
  "<path d='M12 21.2C12.2 17.6 11.5 15 12 11.6' fill='none' stroke='#79B25C' stroke-width='1.9' stroke-linecap='round'/>" +
  "<path d='M12 12.8C7.2 13.2 2.6 10.8 2 5C7.6 4.2 12 7.6 12 12.8Z' fill='#7DBA5E' stroke='#1F1812' stroke-width='1.6' stroke-linejoin='round'/>" +
  "<path d='M12 11.8C11.8 6.8 15.6 2.6 21.9 2.8C22.3 8.8 17.6 12.2 12 11.8Z' fill='#A3D074' stroke='#1F1812' stroke-width='1.6' stroke-linejoin='round'/></svg>");
const SHOP = uri(SVG("28 28'>") +
  "<rect x='4.6' y='11' width='18.8' height='14.6' rx='1.6' fill='#FFFDF8' stroke='#1F1812' stroke-width='1.8'/>" +
  "<rect x='15.4' y='16.4' width='5' height='9.2' fill='#D4A847' stroke='#1F1812' stroke-width='1.5'/>" +
  "<rect x='7.2' y='16.2' width='5.6' height='5' rx='.8' fill='#FDF1DA' stroke='#1F1812' stroke-width='1.5'/>" +
  "<path d='M2.5 11.5L5.5 4.5H22.5L25.5 11.5A2.875 2.5 0 0 1 19.75 11.5A2.875 2.5 0 0 1 14 11.5A2.875 2.5 0 0 1 8.25 11.5A2.875 2.5 0 0 1 2.5 11.5Z' fill='#5E8C52' stroke='#1F1812' stroke-width='1.8' stroke-linejoin='round'/>" +
  "<path d='M9.6 5.4H12.4L11.9 11.2H8.6ZM15.6 5.4H18.4L19.4 11.2H16.1Z' fill='#FFFDF8'/></svg>");

const CSS = `
.viz-grow{user-select:none;-webkit-user-select:none}
.viz-grow i{font-style:normal}
.viz-grow .g-ic{display:inline-block;flex:none;width:1.35em;height:1.35em;background:${SPROUT} center/contain no-repeat;vertical-align:-.28em}
.viz-grow .g-ic.shop{background-image:${SHOP}}
.viz-grow .g-ic.pale{filter:grayscale(1) brightness(1.18) opacity(.62)}
.viz-grow .g-num{display:inline-flex;align-items:baseline;gap:.04em;white-space:nowrap;line-height:1.15}
.viz-grow .g-num .g-u{font-size:.5em}
.viz-grow .v-chip b{color:var(--royal)}

/* ---- 畑（シーン 0〜2） ---- */
.viz-grow .g-f{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.6cqh;--hh:clamp(72px,21cqh,160px)}
.viz-grow .g-top{position:relative;flex:none;width:100%;height:var(--hh)}
.viz-grow .g-h{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:clamp(8px,2.6cqw,24px);opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.viz-grow .g-f[data-s="1"] .g-h1,.viz-grow .g-f[data-s="2"] .g-h2{opacity:1;visibility:visible;transition-delay:0s}
.viz-grow .g-h1 .g-num{font-size:clamp(40px,min(12.4cqw,15cqh),100px)}
.viz-grow .g-h1 .g-n{min-width:2.9em;text-align:right}
.viz-grow .g-key{font-size:clamp(14px,3.9cqw,22px)}
.viz-grow .g-chips{display:flex;flex-direction:column;align-items:flex-start;gap:clamp(5px,1.6cqh,12px)}
.viz-grow .g-chips .v-chip{font-size:clamp(13.5px,3.75cqw,21px);padding:3px 11px 3px 8px;gap:5px}
.viz-grow .g-h2 .g-num{font-size:clamp(42px,min(13cqw,16cqh),108px)}
.viz-grow .g-fld{position:relative;flex:none;width:100%;height:min(calc(100cqh - var(--hh) - 1.6cqh - 6px),112cqw)}
.viz-grow .g-soil{position:absolute;inset:0 4px 4px 0;border:2.5px solid var(--ink);border-radius:clamp(14px,4.5cqw,30px);box-shadow:4px 4px 0 var(--ink);background:#B5804D}
.viz-grow .g-rows{position:absolute;inset:8.5% calc(2.5% + 4px) calc(2.5% + 4px) 2.5%;container-type:size}
.viz-grow .g-rdg{position:absolute;left:-.6%;right:-.6%;height:calc(100% / ${ROWS} * .6);border-radius:999px;box-shadow:0 max(2px,.5cqh) 0 #94643A;
  background:radial-gradient(circle at 50% 34%,#A06F40 .42cqh,transparent calc(.42cqh + .6px)) var(--o) 0/11.3cqw 100%,radial-gradient(circle at 50% 70%,#EFD3A8 .38cqh,transparent calc(.38cqh + .6px)) calc(var(--o) * -1.7) 0/14.9cqw 100%,linear-gradient(180deg,#DDB583,#C8996A)}
.viz-grow .g-sp{position:absolute;--z:min(calc(100cqw / ${COLS} * .98),calc(100cqh / ${ROWS} * 1.17));width:var(--z);height:var(--z);margin:calc(var(--z) * -1) 0 0 calc(var(--z) / -2);
  background:${SPROUT} center/contain no-repeat;transform-origin:50% 90%;scale:0;transition:scale .3s,filter .9s var(--pd,0s)}
.viz-grow .g-sp.g-one,.viz-grow .g-f[data-s="1"] .g-sp,.viz-grow .g-f[data-s="2"] .g-sp{scale:1}
.viz-grow .g-f[data-s="2"] .g-sp.g-pale{filter:grayscale(1) brightness(1.2) opacity(.6)}
.viz-grow .g-q{position:absolute;left:50%;bottom:60%;translate:-50% 0;font-size:min(46cqh,52cqw,250px);line-height:1;opacity:0;visibility:hidden;transition:opacity .3s,visibility 0s .3s}
.viz-grow .g-f[data-s="0"] .g-q{opacity:1;visibility:visible;transition-delay:0s}

/* ---- チェーン店（シーン 3） ---- */
.viz-grow .g-c{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(6px,2cqh,18px)}
.viz-grow .g-sum{flex:none;font-size:clamp(15px,4.2cqw,24px)}
.viz-grow .g-shops{flex:none;width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(20px,5.6cqh,46px) clamp(8px,2.6cqw,22px);padding:clamp(16px,4.6cqw,36px) 5px 4px 4px}
.viz-grow .g-shop{position:relative;display:flex;flex-direction:column;transform-origin:50% 100%}
.viz-grow .g-shop .g-ic{position:absolute;z-index:1;left:50%;bottom:100%;margin:0 0 -3px -.6em;font-size:clamp(15px,4.4cqw,30px);width:1.2em;height:1.2em;transform-origin:50% 90%}
.viz-grow .g-aw{position:relative;z-index:2;height:clamp(13px,3.9cqh,30px);margin:0 -4px;border:2.5px solid var(--ink);border-radius:9px 9px 4px 4px;background:repeating-linear-gradient(100deg,var(--leaf) 0 9px,var(--white) 9px 18px)}
.viz-grow .g-wall{flex:1;display:flex;flex-direction:column;margin-top:-2.5px;border:2.5px solid var(--ink);border-radius:0 0 12px 12px;box-shadow:3px 3px 0 var(--ink);background:var(--white);text-align:center;overflow:hidden}
.viz-grow .g-nm{display:flex;align-items:center;justify-content:center;min-height:2.1em;padding:2px 3px;background:var(--cream);border-bottom:2px solid var(--ink);font:900 clamp(13px,3.65cqw,25px)/1.2 var(--round);word-break:keep-all;overflow-wrap:anywhere}
.viz-grow .g-ct{padding-top:clamp(2px,.8cqh,8px);font:400 clamp(23px,7cqw,58px)/1.15 var(--pop);color:var(--royal);white-space:nowrap}
.viz-grow .g-ct small{font:900 .52em/1 var(--round);color:var(--ink);margin-left:.08em}
.viz-grow .g-mn{padding:clamp(1px,.5cqh,6px) 2px clamp(5px,1.6cqh,14px);margin:auto 0;font:700 clamp(12px,3.28cqw,18.5px)/1.32 var(--sans);color:var(--ink-soft);word-break:keep-all;line-break:strict;overflow-wrap:anywhere}
@container (max-width:520px){.viz-grow .g-nm{min-height:calc(2.2em + 6px);line-height:1.1}}
@container (max-height:420px){.viz-grow .g-sum{display:none}}
@container (max-aspect-ratio:7/10) and (min-height:530px){
  .viz-grow .g-shops{grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(20px,4.2cqh,30px) 14px}
  .viz-grow .g-aw{height:clamp(14px,3.2cqh,22px)}
  .viz-grow .g-nm{font-size:16px;min-height:1.9em}
  .viz-grow .g-ct{font-size:clamp(30px,6cqh,36px)}
  .viz-grow .g-mn{font-size:13.5px;padding-bottom:clamp(5px,1.3cqh,10px)}
}

/* ---- あわせると（シーン 4） ---- */
.viz-grow .g-t{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(3px,1.6cqh,14px)}
.viz-grow .g-eq{flex:none;width:100%;display:flex;align-items:center;justify-content:center;gap:clamp(4px,1.6cqw,14px);padding-right:4px}
.viz-grow .g-card{flex:0 1 42cqw;min-width:0;display:flex;flex-direction:column;align-items:center;background:var(--white);border:2.5px solid var(--ink);border-radius:clamp(14px,4cqw,24px);box-shadow:4px 4px 0 var(--ink);padding:clamp(5px,1.7cqh,14px) 4px clamp(4px,1.3cqh,12px)}
.viz-grow .g-card span{display:flex;align-items:center;gap:.3em;font:900 clamp(15px,4.5cqw,26px)/1.3 var(--round);white-space:nowrap}
.viz-grow .g-card b{font:400 clamp(28px,min(9.4cqw,10cqh),66px)/1.2 var(--pop);color:var(--leaf-deep);white-space:nowrap}
.viz-grow .g-card b small{font:900 .5em/1 var(--round);color:var(--ink);margin-left:.08em}
.viz-grow .g-op{flex:none;font-size:clamp(26px,min(8cqw,8.6cqh),60px);line-height:1.1}
.viz-grow .g-tot{flex:none;font-size:clamp(60px,min(21cqw,25cqh),156px)}
.viz-grow .g-tot.g-num{line-height:1.12}
.viz-grow .g-tot .g-u{font-size:.4em}
.viz-grow .g-tot .g-n{min-width:2.75em;text-align:right}
.viz-grow .g-town{flex:none;position:relative;display:flex;align-items:flex-end;justify-content:center;gap:clamp(2px,1.1cqw,12px);padding:0 3cqw clamp(5px,1.4cqh,10px);margin-top:clamp(2px,1cqh,10px)}
.viz-grow .g-town::before{content:"";position:absolute;left:0;right:0;bottom:0;height:clamp(9px,2.6cqh,18px);border:2.5px solid var(--ink);border-radius:999px;background:linear-gradient(180deg,#E3BC8A,#C99A66);box-shadow:3px 3px 0 var(--ink)}
.viz-grow .g-town .g-ic{position:relative;font-size:min(7.8cqw,11cqh,60px);width:1em;height:1em;transform-origin:50% 90%}
.viz-grow .g-town .g-ic.shop{font-size:min(10.4cqw,14.6cqh,80px)}
@container (max-aspect-ratio:8/10){
  .viz-grow .g-t{gap:clamp(4px,1.8cqh,14px)}
  .viz-grow .g-eq{flex-direction:column;gap:clamp(2px,1cqh,8px)}
  .viz-grow .g-card{flex:none;width:calc(100cqw - 18px);flex-direction:row;justify-content:space-between;padding:clamp(6px,1.7cqh,12px) 16px clamp(6px,1.7cqh,12px) 13px}
  .viz-grow .g-card span{font-size:17px}
  .viz-grow .g-card b{font-size:clamp(34px,10.8cqw,44px)}
  .viz-grow .g-tot{font-size:23cqw}
  .viz-grow .g-town{margin-top:1.6cqh}
}

@media (prefers-reduced-motion:no-preference){
  .viz-grow .g-f.on .g-sp{animation:gSway 2.8s var(--s) ease-in-out infinite alternate}
  .viz-grow .g-f.on.g-play[data-s="1"] .g-sp:not(.g-one){animation:gPop .55s var(--d) cubic-bezier(.3,1.6,.5,1) backwards,gSway 2.8s var(--s) ease-in-out infinite alternate}
  .viz-grow .g-f.on.g-play[data-s="1"] .g-one{animation:gHop .6s ease-out,gSway 2.8s var(--s) ease-in-out infinite alternate}
  .viz-grow .g-f.on[data-s="0"] .g-one{animation:gHop2 2.6s 1s ease-in-out infinite}
  .viz-grow .g-f.on[data-s="0"] .g-q{animation:gBob 2.4s ease-in-out infinite alternate}
  .viz-grow .g-f.on.g-play[data-s="0"] .g-q{animation:gIn .6s cubic-bezier(.3,1.6,.5,1) backwards,gBob 2.4s .6s ease-in-out infinite alternate}
  .viz-grow .g-f.g-play[data-s="1"] .g-key{animation:gIn .5s .25s cubic-bezier(.3,1.5,.5,1) backwards}
  .viz-grow .g-f.g-play[data-s="2"] .g-chips .v-chip{animation:gSlide .5s cubic-bezier(.3,1.3,.5,1) backwards}
  .viz-grow .g-f.g-play[data-s="2"] .g-chips .v-chip+.v-chip{animation-delay:.55s}
  .viz-grow .g-f.g-play[data-s="2"] .g-h2 .g-num{animation:gIn .6s 1.25s cubic-bezier(.3,1.7,.5,1) backwards}
  .viz-grow .g-c.g-play .g-shop{animation:gUp .6s calc(var(--i) * .27s) cubic-bezier(.3,1.5,.5,1) backwards}
  .viz-grow .g-c.g-play .g-shop .g-ic{animation:gPop .5s calc(var(--i) * .27s + .45s) cubic-bezier(.3,1.6,.5,1) backwards}
  .viz-grow .g-c.on .g-shop .g-ic{rotate:calc(var(--i) * 3deg - 7deg)}
  .viz-grow .g-c.g-play .g-sum{animation:gIn .5s cubic-bezier(.3,1.5,.5,1) backwards}
  .viz-grow .g-t.g-play .g-card{animation:gDrop .55s cubic-bezier(.3,1.4,.5,1) backwards}
  .viz-grow .g-t.g-play .g-card.b{animation-delay:.6s}
  .viz-grow .g-t.g-play .g-op{animation:gIn .4s .45s cubic-bezier(.3,1.8,.5,1) backwards}
  .viz-grow .g-t.g-play .g-op.eq{animation-delay:1.1s}
  .viz-grow .g-t.g-play .g-tot{animation:gIn .6s 1.2s cubic-bezier(.3,1.5,.5,1) backwards}
  .viz-grow .g-t.g-play .g-town::before{animation:gFade .4s 1.2s backwards}
  .viz-grow .g-t.g-play .g-town .g-ic{animation:gPop .5s calc(1.3s + var(--i) * .07s) cubic-bezier(.3,1.6,.5,1) backwards}
  .viz-grow .g-t.on .g-town .g-ic:not(.shop){animation:gSway 2.6s calc(var(--i) * -.37s) ease-in-out infinite alternate}
  .viz-grow .g-t.on.g-play .g-town .g-ic:not(.shop){animation:gPop .5s calc(1.3s + var(--i) * .07s) cubic-bezier(.3,1.6,.5,1) backwards,gSway 2.6s calc(var(--i) * -.37s) ease-in-out infinite alternate}
}
@media (prefers-reduced-motion:reduce){.viz-grow .g-sp,.viz-grow .g-h,.viz-grow .g-q{transition:none}}
@keyframes gSway{from{rotate:-5deg}to{rotate:5deg}}
@keyframes gPop{from{scale:0}}
@keyframes gHop{40%{translate:0 -38%}}
@keyframes gHop2{0%,22%,100%{translate:0 0;rotate:0deg}8%{translate:0 -30%;rotate:-8deg}15%{translate:0 0;rotate:6deg}}
@keyframes gBob{from{translate:-50% 2%}to{translate:-50% -4%}}
@keyframes gIn{from{opacity:0;scale:.3}}
@keyframes gFade{from{opacity:0}}
@keyframes gSlide{from{opacity:0;transform:translateX(-26px)}}
@keyframes gUp{from{transform:scaleY(0)}}
@keyframes gDrop{from{opacity:0;transform:translateY(-34px) scale(.8)}}
`;

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
/* メニュー名を ことばの 切れ目で 折り返す（切れ目が わからない ときは そのまま） */
const phrase = s => {
  s = String(s);
  if (typeof Intl === 'undefined' || !Intl.Segmenter) return esc(s);
  const cuts = new Set(), kanji = /^[一-鿿々]+$/, kata = /^[ァ-ヶー]+$/;
  let prev = '';
  for (const { segment: g, index: i } of new Intl.Segmenter('ja', { granularity: 'word' }).segment(s)) {
    const last = prev.slice(-1);
    if (i && !(/^[、。・」』）)！？!?,.\s]+$/.test(g) || /[「『（(]$/.test(prev) || /^[のをにはがとでもへや]$/.test(g) || (kanji.test(g) && kanji.test(last)) || (kata.test(g) && kata.test(last)))) cuts.add(i);
    prev = g;
  }
  /* カタカナが つづく ところは、食べものの ことばの 前で 切る */
  const word = /(?!^)(?=ヴィーガン|ビーガン|ベジ|プラント|ベース|ラーメン|バーガー|バジル|カレー|スープ|フード|ボール|ドーナツ)/;
  for (const m of s.matchAll(/[ァ-ヶー]{6,}/g)) {
    const parts = m[0].split(word).reduce((a, q) => { const z = a.length - 1; if (z >= 0 && a[z].length < 3) a[z] += q; else a.push(q); return a; }, []);
    let i = m.index; parts.slice(0, -1).forEach(q => cuts.add(i += q.length));
  }
  let o = '', p = 0;
  for (const i of [...cuts].sort((a, b) => a - b)) { o += esc(s.slice(p, i)) + '<wbr>'; p = i; }
  return o + esc(s.slice(p));
};
/* いつも同じ ならびに なる 乱数 */
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

(window.StageViz = window.StageViz || {}).grow = {
  init(viz, ctx) {
    const { el, style, count } = ctx.kit, f = ctx.fmt, box = ctx.box;
    style('viz-grow-css', CSS); box.classList.add('viz-grow');
    const chains = [...ctx.chains.chains].sort((a, b) => b.stores - a.stores);
    const chainSum = chains.reduce((s, c) => s + c.stores, 0), mapSum = ctx.data.on + ctx.data.next, total = mapSum + chainSum;
    const num = (cls, v, pre, unit) => `<span class="g-num ${cls}">${pre ? `<i class="wc r g-u" data-t="${pre}">${pre}</i>` : ''}<b class="wc r g-n" data-t="${v}">${v}</b><i class="wc r g-u" data-t="${unit}">${unit}</i></span>`;

    /* 畑 */
    const F = el('div', 'sc g-f'); F.dataset.s = '0';
    F.innerHTML = `<div class="g-top">
      <div class="g-h g-h1">${num('', f(JOINED), '約', '軒')}<span class="v-chip g-key"><i class="g-ic"></i>芽 1つ ＝ 10軒</span></div>
      <div class="g-h g-h2"><div class="g-chips"><span class="v-chip"><i class="g-ic"></i>マップに 加わった <b>約${f(JOINED)}軒</b></span><span class="v-chip"><i class="g-ic pale"></i>閉店を 確認 <b>${f(CLOSED)}軒</b></span></div>${num('', TIMES, '約', '倍')}</div>
    </div><div class="g-fld"><div class="g-soil"></div><div class="g-rows"></div><b class="g-q wc g" data-t="？">？</b></div>`;
    const r = rng(20261113), rows = F.querySelector('.g-rows'), r0 = Math.floor(ONE / COLS), c0 = ONE % COLS, sprouts = [];
    for (let j = 0; j < ROWS; j++) { const u = el('u', 'g-rdg'); u.style.cssText = `top:${((j + .42) / ROWS * 100).toFixed(2)}%;--o:${(r() * 40).toFixed(1)}cqw`; rows.appendChild(u); }
    for (let i = 0; i < N; i++) {
      const row = Math.floor(i / COLS), col = i % COLS, s = el('i', 'g-sp' + (i === ONE ? ' g-one' : ''));
      const x = (col + .5 + (row % 2 ? .2 : -.2) + (r() - .5) * .18) / COLS, y = (row + .82 + (r() - .5) * .1) / ROWS;
      s.style.cssText = `left:${(x * 100).toFixed(2)}%;top:${(y * 100).toFixed(2)}%;--d:${(Math.hypot(row - r0, (col - c0) * .9) * .15 + r() * .08).toFixed(2)}s;--s:${(-r() * 5.6).toFixed(2)}s`;
      rows.appendChild(s); sprouts.push(s);
    }
    /* 色が うすくなる 14の 芽：ちらばるように えらぶ */
    const picked = [];
    for (let guard = 0; picked.length < PALE && guard < 4000; guard++) {
      const i = Math.floor(r() * N), row = Math.floor(i / COLS), col = i % COLS;
      if (i === ONE || picked.some(p => Math.abs(Math.floor(p / COLS) - row) <= 1 && Math.abs(p % COLS - col) <= 2)) continue;
      picked.push(i);
    }
    picked.forEach((i, n) => { sprouts[i].classList.add('g-pale'); sprouts[i].style.setProperty('--pd', (.25 + n * .085).toFixed(2) + 's'); });

    /* チェーン店 */
    const C = el('div', 'sc g-c');
    C.innerHTML = '<div class="g-shops">' + chains.map((c, i) =>
      `<div class="g-shop" style="--i:${i}"><i class="g-ic"></i><div class="g-aw"></div><div class="g-wall"><p class="g-nm">${esc(c.short)}</p><p class="g-ct"><b>${f(c.stores)}</b><small>店</small></p><p class="g-mn">${phrase(c.what)}</p></div></div>`).join('') + `</div><span class="v-chip g-sum">あわせて <b><i>${f(chainSum)}</i>店</b></span>`;
    const cNums = [...C.querySelectorAll('.g-ct b')], cSum = C.querySelector('.g-sum i');

    /* あわせると */
    const T = el('div', 'sc g-t'), town = 'sSsSsSsSs';
    T.innerHTML = `<div class="g-eq"><div class="g-card a"><span><i class="g-ic"></i>マップの お店</span><b><i>${f(mapSum)}</i><small>軒</small></b></div><b class="g-op wc" data-t="＋">＋</b>` +
      `<div class="g-card b"><span><i class="g-ic shop"></i>チェーン店</span><b><i>${f(chainSum)}</i><small>店</small></b></div></div><b class="g-op eq wc" data-t="＝">＝</b>` +
      num('g-tot', f(total), '', 'か所') + '<div class="g-town">' + [...town].map((t, i) => `<i class="g-ic${t === 'S' ? ' shop' : ''}" style="--i:${i}"></i>`).join('') + '</div>';
    const tA = T.querySelector('.g-card.a b i'), tB = T.querySelector('.g-card.b b i'), tN = T.querySelector('.g-tot .g-n');

    box.append(F, C, T);
    const fN = F.querySelector('.g-h1 .g-n'), layers = [F, F, F, C, T], jobs = [];
    const later = (ms, fn) => { const id = setTimeout(fn, ctx.reduced ? 0 : ms); jobs.push(() => clearTimeout(id)); };
    const run = (e, to, ms, from) => jobs.push(count(e, to, ms, from || 0));
    const set = (e, v) => { const t = f(v); e.textContent = t; if (e.hasAttribute('data-t')) e.setAttribute('data-t', t); };
    const replay = L => { L.classList.remove('g-play'); void L.offsetWidth; L.classList.add('g-play'); };
    /* せまい 画面で はみ出す ときだけ、全体を 少し 小さくする */
    const fit = L => {
      L.style.scale = ''; const kids = [...L.children].filter(e => e.offsetHeight); if (!kids.length || !L.clientHeight) return;
      const need = kids[kids.length - 1].offsetTop + kids[kids.length - 1].offsetHeight - kids[0].offsetTop + 8;
      if (need > L.clientHeight) L.style.scale = (L.clientHeight / need).toFixed(3);
    };

    return {
      mapSum, chainSum, total, chains,
      go(k) {
        jobs.splice(0).forEach(stop => stop());
        const L = layers[k]; [F, C, T].forEach(x => x.classList.toggle('on', x === L));
        if (k <= 2) {
          if (k === 2 && F.dataset.s === '2') { F.dataset.s = '1'; void F.offsetWidth; }   /* もういちど 色が かわる ところから */
          F.dataset.s = String(k); set(fN, JOINED);
          if (k === 1) run(fN, JOINED, 1700);
        } else if (k === 3) {
          set(cSum, chainSum); cNums.forEach((e, i) => set(e, chains[i].stores));
          if (!ctx.reduced) { set(cSum, 0); let acc = 0; cNums.forEach((e, i) => { const a = acc, b = acc += chains[i].stores; set(e, 0); later(i * 270 + 120, () => { run(e, chains[i].stores, 650); run(cSum, b, i < 5 ? 240 : 500, a); }); }); }
        } else {
          set(tA, mapSum); set(tB, chainSum); set(tN, total);
          if (!ctx.reduced) { set(tA, 0); set(tB, 0); set(tN, mapSum); run(tA, mapSum, 600); later(650, () => run(tB, chainSum, 600)); later(1250, () => run(tN, total, 1050, mapSum)); }
        }
        if (k > 2) fit(L);
        replay(L);
      },
      resize() { fit(C); fit(T); },
    };
  },
  scenes(ctx, inst) {
    const f = ctx.fmt;
    return [
      { pose: 'questioning', name: 'クイズ', html: 'クイズ！ 2026年に マップへ 加わった お店は、何軒くらい でしょう？', quiz: { opts: ['約160軒', '約560軒', '約1,560軒'], ans: 2 } },
      { pose: 'surprised-3', name: 'こたえ', html: a => a.pre + 'こたえは <b>約1,560軒</b>！ 芽 ひとつが 10軒。畑が いっぱいに なったよ。' },
      { pose: 'explaining', name: '閉店したお店', html: '閉店を 確認した お店は <b>143軒</b>。閉店 1軒に たいして、マップに 加わった お店は <b>約11軒</b> だよ。' },
      { pose: 'pointing-up', name: 'チェーン店', html: `チェーン店でも えらべるよ。${inst.chains.length}つの チェーンを あわせると <b>${f(inst.chainSum)}店</b>！` },
      { pose: 'excited', name: 'あわせると', html: `マップの お店と あわせると、ヴィーガンを 食べられる 場所は <b>${f(inst.total)}か所</b>！<small>店舗数は各社の公表値。メニューは店舗・時期によって異なります。</small>` },
    ];
  },
};
})();
