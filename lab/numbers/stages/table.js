/* 04 日本の 食卓は どこから？ — 100皿・100つぶの大豆・穀物のふくろ・ひろがる畑 */
(() => {
'use strict';
const CSS = `
.viz-table .sc{display:flex;align-items:center;justify-content:center;gap:3cqw}
.viz-table .side{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.4cqh;text-align:center}
.viz-table .big{font-size:13cqw;line-height:1.2;white-space:nowrap}
.viz-table .keys{display:flex;flex-direction:column;align-items:stretch;gap:1.8cqh}
.viz-table .key{display:flex;align-items:center;gap:.5em;background:var(--white);border:2.5px solid var(--ink);border-radius:14px;box-shadow:3px 3px 0 var(--ink);padding:.3em .7em;
  font:900 clamp(13px,4cqw,24px)/1.25 var(--round);text-align:left;white-space:nowrap}
.viz-table .key b{display:block;font-size:1.3em;color:var(--royal)}
.viz-table .key.off b{color:var(--ink-soft)}
.viz-table .key i{flex:none;width:1.7em;height:1.7em;font-size:1em}

/* 皿 */
.viz-table .grid{--g:min(96cqh,61cqw);width:var(--g);height:var(--g);font-size:calc(var(--g)/10);flex:none;display:grid;grid-template-columns:repeat(10,1fr);gap:.12em;padding:.04em}
.viz-table .grid.tb{gap:.1em;padding:.24em;border:2.5px solid var(--ink);border-radius:.5em;box-shadow:4px 4px 0 var(--ink);background:repeating-linear-gradient(90deg,transparent 0 1.9em,rgba(150,110,60,.16) 1.9em 2em),#EBCF9F}
.viz-table .pl{position:relative;display:block;border-radius:50%;border:max(1.5px,.07em) solid #A8977A;background:var(--cream);aspect-ratio:1}
.viz-table .tb .pl{background:#FFF6E2;border-color:#B0976C}
.viz-table .pl::before{content:"";position:absolute;inset:17%;border-radius:50%;border:max(1px,.035em) solid rgba(120,97,72,.35)}
.viz-table .pl.jp{background:var(--white);border-color:var(--ink);border-width:max(1.5px,.06em);box-shadow:.05em .07em 0 var(--ink)}
.viz-table .pl.jp::before{inset:12%;border-color:rgba(31,24,18,.16)}
.viz-table .pl.jp::after{content:"";position:absolute;inset:31%;border-radius:50%;background:var(--royal)}
.viz-table .s0.run .pl{animation:tbPop .45s calc(var(--w)*45ms) cubic-bezier(.3,1.6,.5,1) both}
@container (min-aspect-ratio:101/100){.viz-table .s0 .big{font-size:19cqw}.viz-table .s0 .v-chip{font-size:23px;padding:7px 20px}}
.viz-table .s1.run .pl.jp{animation:tbFlip .5s calc(var(--n)*34ms + .15s) ease-out both}
.viz-table .s1.run .pl.jp::after{animation:tbDot .5s calc(var(--n)*34ms + .15s) cubic-bezier(.3,1.7,.5,1) both}
.viz-table .run .rise{animation:tbRise .5s var(--d,0s) cubic-bezier(.3,1.5,.5,1) both}
@keyframes tbPop{from{opacity:0;transform:scale(.2)}}
@keyframes tbFlip{0%{background:#FFF6E2;border-color:#B0976C;box-shadow:0 0 0 var(--ink);transform:rotateY(180deg) scale(.8)}55%{transform:rotateY(0) scale(1.25)}}
@keyframes tbDot{0%,45%{transform:scale(0)}}
@keyframes tbRise{from{opacity:0;transform:translateY(14px) scale(.85)}}

@container (max-aspect-ratio:1/1){
  .viz-table .sc{flex-direction:column;gap:2cqh}
  .viz-table .grid{--g:min(100cqw - 8px,78cqh)}
  .viz-table .side{flex:none;flex-direction:row;gap:4cqw;order:-1}
  .viz-table .big{font-size:min(17cqw,12cqh)}
  .viz-table .keys{gap:1.2cqh}
  .viz-table .key{padding:.12em .7em}
  .viz-table .key b{display:inline;margin-left:.35em}
}
@media (prefers-reduced-motion:reduce){.viz-table *,.viz-table *::before,.viz-table *::after{animation:none!important;transition:none!important}}
`;

(window.StageViz = window.StageViz || {}).table = {
  init(viz, ctx) {
    const { el, style, count } = ctx.kit, box = ctx.box, R = ctx.reduced;
    box.classList.add('viz-table'); style('viz-table-css', CSS);
    const L = [0, 1, 2, 3, 4].map(i => { const s = el('div', 'sc s' + i); box.appendChild(s); return s; });
    let stops = [];
    const stop = () => { stops.forEach(f => f()); stops = []; };
    const later = (fn, ms) => { if (R) return fn(); const id = setTimeout(fn, ms); stops.push(() => clearTimeout(id)); };
    const pct = v => Math.round(v) + '%';
    const play = [];

    /* 皿を 100まい ならべる（jp = 国産に する まい数） */
    const plates = jp => { const g = el('div', 'grid tb'); g.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 100; i++) { const p = el('i', 'pl' + (i < jp ? ' jp' : '')); p.style.setProperty('--w', (i % 10) + Math.floor(i / 10)); p.style.setProperty('--n', i); g.appendChild(p); }
      return g; };

    /* 0 クイズ：100皿、まだ どれも わからない */
    L[0].appendChild(plates(0));
    L[0].appendChild(el('div', 'side', '<b class="big wc g rise" data-t="？">？</b><span class="v-chip rise" style="--d:.15s">100皿</span>'));

    /* 1 こたえ：37皿が 国産 */
    L[1].appendChild(plates(37));
    L[1].appendChild(el('div', 'side', '<b class="big wc r" data-t="37%">37%</b><div class="keys">' +
      '<span class="key rise" style="--d:1.2s"><i class="pl jp"></i><span>国産<b>37皿</b></span></span>' +
      '<span class="key off rise" style="--d:1.45s"><i class="pl"></i><span>海外から<b>63皿</b></span></span></div>'));
    const big1 = L[1].querySelector('.big');
    play[1] = () => { stops.push(count(big1, 37, 1500, 0, pct)); };

    /* 2 大豆：100つぶの うち 7つぶが 国産 */
    style('viz-table-css2', `
.viz-table .col{flex:none;display:flex;flex-direction:column;align-items:center;gap:1.6cqh}
.viz-table .s2 .grid{--g:min(72cqh,56cqw);gap:0;padding:0}
.viz-table .bn{position:relative;display:block;place-self:center;width:82%;height:68%;border-radius:50%;border:max(1.5px,.06em) solid #A8977A;background:radial-gradient(ellipse 13% 9% at 70% 56%,#B9A98C 96%,transparent) var(--cream);transform:rotate(var(--r))}
.viz-table .bn::after{content:"";position:absolute;left:16%;top:16%;width:30%;height:22%;border-radius:50%;background:#fff;opacity:.75;transform:rotate(-24deg)}
.viz-table .bn.jp{background:radial-gradient(ellipse 13% 9% at 70% 56%,var(--ink) 96%,transparent) #F0C95C;border-color:var(--ink);box-shadow:.05em .07em 0 var(--ink)}
.viz-table .key i.bn{width:1.5em;height:1.25em;place-self:auto}
.viz-table .key i.ring{margin:0;vertical-align:0}
.viz-table .ring{display:inline-block;vertical-align:-.12em;width:.95em;height:.95em;margin-right:.25em;border-radius:50%;border:2px solid var(--ink);background:conic-gradient(var(--leaf) 0 24%,var(--cream) 0)}
.viz-table .key.sub b{color:var(--leaf-deep)}
.viz-table .foods{display:flex;align-items:flex-end;justify-content:center;gap:5cqw}
.viz-table .fd{display:flex;flex-direction:column;align-items:center;font:900 clamp(13px,3.8cqw,22px)/1.3 var(--round);-webkit-text-stroke:4px var(--paper);paint-order:stroke fill;white-space:nowrap}
.viz-table .fd svg,.viz-table .fd img{display:block;width:clamp(34px,10cqmin,76px);height:clamp(34px,10cqmin,76px);object-fit:contain;filter:drop-shadow(1.5px 2px 0 rgba(31,24,18,.25))}
.viz-table .s2.run .bn{animation:tbRoll .75s calc(var(--w)*1ms) cubic-bezier(.2,.8,.3,1) both}
.viz-table .s2.run .bn.jp{animation:tbRoll .75s calc(var(--w)*1ms) cubic-bezier(.2,.8,.3,1) both,tbGlow .5s calc(1.3s + var(--n)*90ms) both}
@keyframes tbRoll{0%{opacity:0;transform:translateX(-70cqw) rotate(-600deg)}18%{opacity:1}}
@keyframes tbGlow{0%{background:var(--cream);border-color:#A8977A;box-shadow:0 0 0 var(--ink);scale:1}60%{scale:1.55}}
@container (max-aspect-ratio:1/1){
  .viz-table .s2 .grid{--g:min(100cqw - 8px,61cqh)}
}`);
    const beans = el('div', 'grid'); beans.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 100; i++) { const b = el('i', 'bn' + (i < 7 ? ' jp' : '')); b.style.cssText = `--r:${(i * 37) % 44 - 22}deg;--w:${(9 - i % 10) * 45 + Math.floor(i / 10) * 28};--n:${i}`; beans.appendChild(b); }
    const INK = 'stroke="#1F1812" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
    const miso = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M15 10c-2-3 2-3 0-6M25 10c-2-3 2-3 0-6" fill="none" stroke="#786148" stroke-width="1.8" stroke-linecap="round"/><rect x="14" y="31" width="12" height="5" rx="1.5" fill="#9C1428" ${INK}/><path d="M4 18h32c0 9-6 15-16 15S4 27 4 18z" fill="#C9223A" ${INK}/><ellipse cx="20" cy="18" rx="16" ry="4.5" fill="#C98A4B" ${INK}/></svg>`;
    const shoyu = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 14c-5 4-6 8-6 14 0 6 3 9 12 9s12-3 12-9c0-6-1-10-6-14z" fill="#FFFDF8" ${INK}/><path d="M9.3 25c-.3 7 1.7 10.7 10.7 10.7S31 32 30.7 25z" fill="#4A2A1A"/><rect x="13" y="5" width="14" height="9" rx="2.5" fill="#C9223A" ${INK}/><path d="M27 9h5" fill="none" ${INK}/></svg>`;
    const foods = el('div', 'foods', `<span class="fd rise" style="--d:.5s">${miso}みそ</span><span class="fd rise" style="--d:.65s">${shoyu}しょうゆ</span><span class="fd rise" style="--d:.8s"><img src="/images/menu2/tofu.webp" alt="">とうふ</span>`);
    const col2 = el('div', 'col'); col2.appendChild(beans); col2.appendChild(foods); L[2].appendChild(col2);
    L[2].appendChild(el('div', 'side', '<b class="big wc r" data-t="7%">7%</b><div class="keys">' +
      '<span class="key rise" style="--d:1.9s"><i class="bn jp"></i><span>国産<b>7つぶ</b></span></span>' +
      '<span class="key sub rise" style="--d:2.1s"><i class="ring"></i><span>食用だけなら<b>24%</b></span></span></div>'));
    const big2 = L[2].querySelector('.big');
    play[2] = () => { if (!R) { big2.textContent = '0%'; big2.setAttribute('data-t', '0%'); } later(() => stops.push(count(big2, 7, 800, 0, pct)), 1300); };
    /* 3 えさの穀物：ふくろ 1つ = 穀物 1kg */
    style('viz-table-css3', `
.viz-table .s3{--sh:min(6.5cqh,10cqw);flex-direction:column;gap:1.2cqh}
.viz-table .s3 .v-lab{flex:none;text-align:center;white-space:nowrap;font-size:clamp(15px,4.4cqw,28px)}
.viz-table .stacks{position:relative;flex:none;align-self:stretch;display:flex;align-items:flex-end;justify-content:space-around}
.viz-table .stk{display:flex;flex-direction:column;align-items:center;gap:.8cqh;width:24%}
.viz-table .pile{display:flex;flex-direction:column-reverse;align-items:center;border-bottom:3px solid var(--ink);border-radius:2px;padding:0 .6cqw 1px}
.viz-table .sk{display:block;flex:none;height:var(--sh);width:calc(var(--sh)*2.1);margin-top:calc(var(--sh)*-.09);overflow:visible}
.viz-table .sk.half{width:calc(var(--sh)*1.1);align-self:flex-start}
.viz-table .nm{font:900 clamp(13px,4cqw,24px)/1.2 var(--round);text-align:center;white-space:nowrap;-webkit-text-stroke:4px var(--paper);paint-order:stroke fill}
.viz-table .nm b{display:block;font-size:1.3em;color:var(--royal)}
.viz-table .info{position:absolute;right:1cqw;top:0;display:flex;flex-direction:column;align-items:flex-end;gap:1.6cqh}
.viz-table .info .one{display:flex;align-items:center;gap:.4em;font:900 clamp(13px,3.8cqw,22px)/1.2 var(--round);-webkit-text-stroke:4px var(--paper);paint-order:stroke fill}
.viz-table .info .one .sk{--sh:1.5em;margin:0}
.viz-table .s3.run .pile .sk{animation:tbDrop .45s calc(.25s + var(--n)*.13s) cubic-bezier(.3,1.25,.5,1) both}
@keyframes tbDrop{0%{opacity:0;transform:translateY(-55cqh) rotate(-8deg)}30%{opacity:1}}
`);
    const SK = 'stroke="#1F1812" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"';
    const sack = n => `<svg class="sk" style="--n:${n}" viewBox="0 0 50 24" aria-hidden="true"><path d="M6 3.5l-3.5-2.5M44 3.5l3.5-2.5" fill="none" ${SK}/><path d="M6 3.5C16 1.5 34 1.5 44 3.5c3.6 2 3.6 15 0 17C34 22.5 16 22.5 6 20.5 2.4 18.5 2.4 5.5 6 3.5z" fill="#E7C88F" ${SK}/><path d="M16 12h18" fill="none" stroke="#B08A50" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
    const half = n => `<svg class="sk half" style="--n:${n}" viewBox="0 0 26 24" aria-hidden="true"><path d="M6 3.5l-3.5-2.5" fill="none" ${SK}/><path d="M6 3.5C11 2.2 16 2 22 2.4l-3 4 3 4-3 4 3 4-2 3.6C15 22 10 21.6 6 20.5 2.4 18.5 2.4 5.5 6 3.5z" fill="#E7C88F" ${SK}/></svg>`;
    const stk = (name, kg, n, hf) => { let h = ''; for (let i = 0; i < n; i++) h += sack(i); if (hf) h += half(n);
      return `<div class="stk"><div class="pile">${h}</div><span class="nm">${name}<b class="rise" style="--d:${(.45 + (n + (hf ? 1 : 0)) * .13).toFixed(2)}s">${kg}</b></span></div>`; };
    L[3].appendChild(el('span', 'v-lab', '1kgを つくるのに ひつような 穀物'));
    L[3].appendChild(el('div', 'stacks', stk('牛肉', '11kg', 11) + stk('豚肉', '6〜7kg', 6, true) + stk('鶏肉', '4kg', 4) + stk('鶏卵', '3kg', 3)));
    L[3].lastChild.appendChild(el('div', 'info', '<span class="key sub rise" style="--d:1.9s"><i class="ring"></i><span>飼料自給率<b>24%</b></span></span>' +
      `<span class="one rise" style="--d:.1s">${sack(0)}＝ 1kg</span>`));
    /* 4 これから：大豆の畑が 26 → 39（1かぶ = 1万トン） */
    style('viz-table-css4', `
.viz-table .s4{flex-direction:column;gap:1.6cqh}
.viz-table .hd{flex:none;display:flex;align-items:center;justify-content:center;gap:3cqw}
.viz-table .hd .arw{flex:none;width:clamp(26px,8cqw,60px);height:auto}
.viz-table .goal{display:flex;flex-direction:column;align-items:center}
.viz-table .goal .v-lab{font-size:clamp(15px,4.3cqw,26px);white-space:nowrap}
.viz-table .num{display:flex;align-items:baseline;gap:.5cqw;white-space:nowrap}
.viz-table .s4 .big{font-size:min(14cqw,19cqh);line-height:1.15}
.viz-table .num .u{font-size:min(7cqw,9cqh);line-height:1.15}
.viz-table .field{--pw:min(9.6cqw,9.5cqh);position:relative;flex:none;width:calc(100cqw - 8px);padding-top:11cqmin;display:flex;flex-direction:column;gap:1.4cqh}
.viz-table .sunbox{position:absolute;right:7cqw;top:0;width:22cqmin;height:11.4cqmin;overflow:hidden}
.viz-table .sunbox svg{display:block;width:100%;height:auto}
.viz-table .rw{display:grid;grid-template-columns:repeat(13,minmax(0,1fr));padding:0 2.2cqw;border-bottom:max(6px,1.7cqmin) solid #B98556;border-radius:0 0 12px 12px;box-shadow:0 2.5px 0 var(--ink)}
.viz-table .pt{display:block;width:var(--pw);justify-self:center;height:auto;overflow:visible;transform-origin:50% 100%;margin-bottom:-1px}
.viz-table .s4.run .pt{animation:tbPop .4s calc(var(--w)*22ms) cubic-bezier(.3,1.6,.5,1) both}
.viz-table .s4.run .pt.new{animation:tbGrow .5s calc(.7s + var(--n)*.1s) cubic-bezier(.3,1.7,.5,1) both}
.viz-table .s4.run .sunbox svg{animation:tbSun 1.3s .7s cubic-bezier(.2,.8,.3,1) both}
.viz-table .s4.run .num{animation:tbBump .5s 2.1s both}
@keyframes tbGrow{from{opacity:0;transform:scaleY(0)}}
@keyframes tbSun{from{transform:translateY(100%)}}
@keyframes tbBump{50%{scale:1.14}}
@container (max-aspect-ratio:3/4){
  .viz-table .hd{flex-direction:column;gap:1cqh}
  .viz-table .hd .arw{transform:rotate(90deg)}
  .viz-table .s4 .big{font-size:min(24cqw,14cqh)}
  .viz-table .num .u{font-size:min(11cqw,6.5cqh)}
  .viz-table .field{gap:3cqh;padding-top:13cqmin}
  .viz-table .sunbox{width:26cqmin;height:13.4cqmin}
}
`);
    const P = 'stroke="#1F1812" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"';
    const plant = (i, nw) => `<svg class="pt${nw ? ' new' : ''}" style="--w:${i % 13 + Math.floor(i / 13) * 3};--n:${i - 26}" viewBox="0 0 28 46" aria-hidden="true"><path d="M14 45V19" fill="none" ${P}/>` +
      `<path d="M15 40c3.5-1.6 6.6-.2 8 3.4-3.5 1.6-6.6.200-8-3.4z" fill="#EDC867" ${P}/>` +
      `<g fill="${nw ? '#93C75B' : '#5E8C52'}" ${P}><path d="M14 36C8 36 4 33 3.5 28 9 27.5 13.5 30.5 14 36z"/><path d="M14 36c6 0 10-3 10.5-8-5.5-.5-10 2.5-10.5 8z"/><path d="M14 26C7.5 26 3 22 3 16.5 9.5 16 14 20 14 26z"/><path d="M14 26c6.5 0 11-4 11-9.5C18.5 16 14 20 14 26z"/><path d="M14 19c-4.5-4.5-4.5-10.5 0-16 4.5 5.5 4.5 11.5 0 16z"/></g></svg>`;
    const row = r => { let h = ''; for (let c = 0; c < 13; c++) h += plant(r * 13 + c, r === 2); return `<div class="rw">${h}</div>`; };
    const SUN = 'stroke="#1F1812" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"';
    L[4].appendChild(el('div', 'hd', '<span class="key off"><span>2023年<b>26万トン</b></span></span>' +
      `<svg class="arw" viewBox="0 0 30 20" aria-hidden="true"><path d="M2 7h14V2l12 8-12 8v-5H2z" fill="#D4A847" stroke="#1F1812" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>` +
      '<span class="goal"><span class="v-lab">2030年度 目標</span><span class="num"><b class="big wc r" data-t="39">39</b><b class="u wc r" data-t="万トン">万トン</b></span></span>'));
    L[4].appendChild(el('div', 'field', `<div class="sunbox" aria-hidden="true"><svg viewBox="0 0 60 31"><path d="M30 3v5M9 12l4 4M51 12l-4 4M2 29h5M53 29h5M18 5.5l2.5 4.5M42 5.5L39.5 10" fill="none" ${SUN}/><path d="M13 31a17 17 0 0134 0z" fill="#F2C14E" ${SUN}/></svg></div>` + row(0) + row(1) + row(2)));
    const big4 = L[4].querySelector('.big'), set4 = v => { big4.textContent = v; big4.setAttribute('data-t', v); };
    play[4] = () => { if (!R) set4(26); later(() => stops.push(ctx.kit.tween(1300, p => set4(26 + Math.round(13 * p)))), 700); };

    const fin = () => [[big1, '37%'], [big2, '7%'], [big4, '39']].forEach(([b, v]) => { b.textContent = v; b.setAttribute('data-t', v); });

    return {
      go(k) {
        stop(); fin(); L.forEach((s, i) => { s.classList.toggle('on', i === k); if (i !== k) s.classList.remove('run'); });
        L[k].classList.remove('run'); void L[k].offsetWidth; L[k].classList.add('run');
        if (play[k]) play[k]();
      },
      resize() {},
    };
  },
  scenes() {
    return [
      { pose: 'questioning', name: 'クイズ', html: 'クイズ！ 日本の 食料自給率（カロリーベース）は、どれくらい でしょう？', quiz: { opts: ['約37%', '約57%', '約77%'], ans: 0 } },
      { pose: 'surprised-3', name: 'こたえ', html: a => a.pre + 'こたえは <b>37%</b>。100皿の うち、国産は 37皿 なんだ。' },
      { pose: 'explaining', name: '大豆', html: 'みそ、しょうゆ、とうふ…。和食に かかせない 大豆の 自給率は <b>7%</b>。<small>食用に かぎると 24%</small>' },
      { pose: 'teaching', name: 'えさの穀物', html: '牛肉 1kgを つくるには、えさの 穀物が <b>11kg</b> いるよ。その えさの 自給率は 24% なんだ。<small>とうもろこし換算・農林水産省</small>' },
      { pose: 'happy', name: 'これから', html: '国は 国産大豆を 26万トンから <b>39万トン</b>へ ふやす 目標。国産の 大豆を えらぶと、日本の 畑が 元気に なるよ！' },
    ];
  },
};
})();
