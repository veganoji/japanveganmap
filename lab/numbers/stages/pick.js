/* 06 きょうの 1軒 — ガチャで お店を 1軒 */
(() => {
'use strict';
const TYPES = { teishoku: '定食', sweets: 'スイーツ', curry: 'カレー', bakery: 'パン', bowl: '丼・ボウル', course: 'コース', ramen: 'ラーメン', drink: 'ドリンク', noodles: '麺', salad: 'サラダ', burger: 'バーガー', pizza: 'ピザ', bento: 'お弁当', pasta: 'パスタ', fried: '揚げもの', sushi: '寿司', gyoza: '餃子', tofu: '豆腐', otsumami: 'おつまみ' };
const CAPS = ['#C9223A', '#5E8C52', '#D4A847', '#E9895B', '#6FA6C9', '#C9223A', '#D4A847', '#5E8C52', '#E9895B'];
const SPOTS = [[62, 96], [100, 104], [138, 96], [48, 68], [82, 72], [118, 72], [152, 68], [70, 44], [128, 44]];
const FOODS = ['ramen', 'curry', 'sushi', 'burger', 'sweets', 'pizza', 'bowl', 'bakery'];
const LINES = [
  ['こんどは ここ！ 行ってみたい お店は あった？', 'happy'],
  ['おっ、ここも よさそう！ なんどでも まわせるよ。', 'winking'],
  ['ここは どう？ 気になったら、お店の ページを 見てみて！', 'presenting'],
  ['いいね！ 近くに 行ったら、ぜひ よってみて。', 'excited'],
];
const CSS = `
.viz-pick .sc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:min(3.4cqh,22px)}
.viz-pick .gm{height:min(70cqh,112cqw,520px);aspect-ratio:200/250;overflow:visible;filter:drop-shadow(4px 4px 0 var(--ink))}
.viz-pick .gm *{vector-effect:non-scaling-stroke}
.viz-pick .gm .cap{transform-box:fill-box;transform-origin:center;animation:pk-jig 2.6s ease-in-out infinite;animation-delay:calc(var(--i) * -.33s)}
.viz-pick .gm.spin{animation:pk-shake .5s linear}
.viz-pick .gm.spin .cap{animation:pk-tumble .5s ease-in-out}
.viz-pick .gm .dial{transform-box:fill-box;transform-origin:center;transition:transform .5s cubic-bezier(.3,1.4,.5,1)}
.viz-pick .gm.spin .dial{transform:rotate(360deg)}
.viz-pick .spin-b{font-size:clamp(21px,6.4cqw,32px);padding:.42em 1.5em;border-radius:999px}
.viz-pick .tg{font-size:clamp(14.5px,4cqw,19px);padding:8px 16px;min-height:44px;border-radius:999px;background:var(--white)}
.viz-pick .tg::before{content:"";width:1em;height:1em;border-radius:50%;border:2.5px solid currentColor;background:transparent;flex:none}
.viz-pick .tg[aria-pressed=true]{background:var(--leaf);color:#fff}
.viz-pick .tg[aria-pressed=true]::before{background:#fff}
.viz-pick .cw{position:relative;width:min(96cqw,600px);display:grid;place-items:center}
.viz-pick .card{width:100%;display:flex;align-items:center;gap:clamp(10px,3.4cqw,24px);background:var(--white);border:2.5px solid var(--ink);border-radius:20px;box-shadow:5px 5px 0 var(--ink);padding:clamp(11px,3.4cqw,24px);text-align:left;min-height:clamp(128px,36cqh,230px)}
.viz-pick .card .ic{width:clamp(76px,24cqw,160px);height:auto;aspect-ratio:1;object-fit:contain;flex:none}
.viz-pick .card .tx{min-width:0;flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:clamp(4px,1.2cqh,10px)}
.viz-pick .tags{display:flex;flex-wrap:wrap;gap:5px}
.viz-pick .bd{font:900 clamp(13px,3.5cqw,17px)/1.3 var(--round);border:2px solid var(--ink);border-radius:999px;padding:2px 10px;background:var(--cream);white-space:nowrap}
.viz-pick .bd.f{background:var(--leaf);color:#fff}
.viz-pick .bd.o{background:#F6DF9B}
.viz-pick .nm{font:900 clamp(19px,5.6cqw,34px)/1.28 var(--round);color:var(--ink);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere}
.viz-pick .ar{font:700 clamp(13.5px,3.7cqw,19px)/1.35 var(--sans);color:var(--muted);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.viz-pick .card.roll .nm,.viz-pick .card.roll .ar,.viz-pick .card.roll .tags{opacity:.45}
.viz-pick .card.roll .ic{animation:pk-wob .16s linear infinite}
.viz-pick .card.pop{animation:pk-pop .5s cubic-bezier(.3,1.5,.5,1)}
.viz-pick .card.hid{opacity:0;transform:scale(.5)}
.viz-pick .egg{position:absolute;height:min(46cqh,62cqw,300px);aspect-ratio:1;overflow:visible;pointer-events:none;opacity:0;filter:drop-shadow(4px 4px 0 var(--ink))}
.viz-pick .egg *{vector-effect:non-scaling-stroke}
.viz-pick .egg .h{transform-box:fill-box;transform-origin:center;transition:transform .36s cubic-bezier(.4,0,.7,1),opacity .36s}
.viz-pick .egg.in{opacity:1;animation:pk-drop .5s cubic-bezier(.3,1.4,.5,1)}
.viz-pick .egg.open{opacity:1}
.viz-pick .egg.open .t{transform:translateY(-70%) rotate(-24deg);opacity:0}
.viz-pick .egg.open .b{transform:translateY(70%) rotate(18deg);opacity:0}
.viz-pick .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.viz-pick .row .btn{font-size:clamp(16px,4.4cqw,21px);min-height:48px;padding:9px 16px}
.viz-pick .s2{gap:min(4cqh,26px)}
.viz-pick .ring{position:relative;width:min(92cqw,96cqh,560px);aspect-ratio:1.5;display:grid;place-items:center}
.viz-pick .ring .fd{position:absolute;width:clamp(58px,19cqw,120px);height:auto;left:calc(50% + var(--x) * 1%);top:calc(50% + var(--y) * 1%);translate:-50% -50%;scale:0;transition:scale .45s cubic-bezier(.3,1.6,.5,1);transition-delay:calc(var(--i) * 70ms)}
.viz-pick .ring.on .fd{scale:1;animation:pk-bob 3s ease-in-out infinite;animation-delay:calc(var(--i) * -.4s)}
.viz-pick .big{position:relative;display:flex;flex-direction:column;align-items:center;line-height:1}
.viz-pick .big .wc{font-size:clamp(46px,15cqw,96px)}
.viz-pick .big .u{font-size:clamp(22px,7cqw,44px);margin-left:2px}
.viz-pick .map-b{font-size:clamp(20px,6cqw,30px);padding:.5em 1.2em;border-radius:999px}
@keyframes pk-jig{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(0,-2.5px) rotate(9deg)}}
@keyframes pk-tumble{0%{transform:translate(0,0) rotate(0)}30%{transform:translate(7px,-12px) rotate(140deg)}65%{transform:translate(-8px,-5px) rotate(260deg)}100%{transform:translate(0,0) rotate(360deg)}}
@keyframes pk-shake{0%,100%{transform:translateX(0) rotate(0)}20%{transform:translateX(-4px) rotate(-2deg)}40%{transform:translateX(4px) rotate(2deg)}60%{transform:translateX(-3px) rotate(-1.5deg)}80%{transform:translateX(3px) rotate(1.5deg)}}
@keyframes pk-wob{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes pk-pop{0%{transform:scale(.86)}60%{transform:scale(1.04)}100%{transform:scale(1)}}
@keyframes pk-drop{0%{transform:translateY(-60%) rotate(-30deg)}60%{transform:translateY(4%) rotate(8deg)}80%{transform:translateY(-3%) rotate(-6deg)}100%{transform:translateY(0) rotate(0)}}
@keyframes pk-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7px) rotate(3deg)}}
@media (prefers-reduced-motion:reduce){.viz-pick .gm .cap,.viz-pick .ring.on .fd,.viz-pick .card.roll .ic{animation:none}.viz-pick .ring .fd{transition:none}}
`;
const capsule = (x, y, c, i) => `<g class="cap" style="--i:${i}"><circle cx="${x}" cy="${y}" r="15" fill="#FFFDF8" stroke="#1F1812" stroke-width="2.5"/><path d="M${x - 15} ${y}a15 15 0 0 1 30 0z" fill="${c}" stroke="#1F1812" stroke-width="2.5" stroke-linejoin="round"/></g>`;
const MACHINE = `<svg class="gm" viewBox="0 0 200 250" aria-hidden="true">
<rect x="36" y="226" width="26" height="16" rx="5" fill="#1F1812"/><rect x="138" y="226" width="26" height="16" rx="5" fill="#1F1812"/>
<rect x="24" y="14" width="152" height="118" rx="58" fill="#FFFDF8" fill-opacity=".8" stroke="#1F1812" stroke-width="2.5"/>
${SPOTS.map((p, i) => capsule(p[0], p[1], CAPS[i], i)).join('')}
<path d="M44 40q12-14 30-17" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
<rect x="16" y="118" width="168" height="114" rx="16" fill="#C9223A" stroke="#1F1812" stroke-width="2.5"/>
<rect x="16" y="118" width="168" height="18" rx="9" fill="#D4A847" stroke="#1F1812" stroke-width="2.5"/>
<circle cx="100" cy="170" r="25" fill="#FDF1DA" stroke="#1F1812" stroke-width="2.5"/>
<g class="dial"><rect x="78" y="163" width="44" height="14" rx="7" fill="#D4A847" stroke="#1F1812" stroke-width="2.5"/><circle cx="100" cy="170" r="4" fill="#1F1812"/></g>
<rect x="68" y="204" width="64" height="20" rx="9" fill="#1F1812"/>
<circle cx="40" cy="160" r="5" fill="#FDF1DA"/><circle cx="160" cy="160" r="5" fill="#FDF1DA"/>
</svg>`;
const EGG = `<svg class="egg" viewBox="0 0 120 120" aria-hidden="true">
<g class="h b"><path d="M10 60a50 50 0 0 0 100 0z" fill="#FFFDF8" stroke="#1F1812" stroke-width="2.5" stroke-linejoin="round"/></g>
<g class="h t"><path d="M10 60a50 50 0 0 1 100 0z" fill="#C9223A" stroke="#1F1812" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 38q8-12 22-15" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>
</svg>`;

(window.StageViz = window.StageViz || {}).pick = {
  init(viz, ctx) {
    const K = ctx.kit, box = ctx.box, R = ctx.reduced, total = ctx.data.on + ctx.data.next;
    K.style('viz-pick-css', CSS); box.classList.add('viz-pick');
    const s0 = K.el('div', 'sc s0', MACHINE + '<button class="btn btn-go spin-b" type="button">まわす！</button>');
    const s1 = K.el('div', 'sc s1', '<button class="btn tg" type="button" aria-pressed="false">まるごとヴィーガンだけ</button>' +
      '<div class="cw"><div class="card hid"><img class="ic" alt="" width="160" height="160"><div class="tx"><div class="tags"></div><b class="nm"></b><span class="ar"></span></div></div>' + EGG + '</div>' +
      '<div class="row"><button class="btn again" type="button">もう1回</button><a class="btn btn-go shop" target="_blank" rel="noopener">お店の ページへ →</a></div>');
    const s2 = K.el('div', 'sc s2', '<div class="ring">' + FOODS.map((f, i) => { const a = i / FOODS.length * Math.PI * 2 - Math.PI / 2; return `<img class="fd" src="/images/menu2/${f}.webp" alt="" style="--i:${i};--x:${(Math.cos(a) * 43).toFixed(1)};--y:${(Math.sin(a) * 40).toFixed(1)}">`; }).join('') +
      `<p class="big"><span><b class="wc r n" data-t="0">0</b><span class="wc u" data-t="軒">軒</span></span></p></div><a class="btn btn-go map-b" href="/">マップで さがす →</a>`);
    box.append(s0, s1, s2);
    const layers = [s0, s1, s2], gm = s0.querySelector('.gm'), spinB = s0.querySelector('.spin-b');
    const tg = s1.querySelector('.tg'), card = s1.querySelector('.card'), egg = s1.querySelector('.egg'), ic = card.querySelector('.ic'), tags = card.querySelector('.tags'), nm = card.querySelector('.nm'), ar = card.querySelector('.ar'), again = s1.querySelector('.again'), shopA = s1.querySelector('.shop');
    const ring = s2.querySelector('.ring'), num = s2.querySelector('.n');
    let shops = null, cur = null, onlyFull = false, timers = [], stop = [], scene = -1, rolls = 0;
    const ready = fetch('/data/search.json').then(r => r.json()).then(j => { shops = (j.shops || []).filter(s => s[0] && s[1]); }).catch(() => { shops = []; });
    const later = (fn, ms) => { const t = setTimeout(fn, R ? 0 : ms); timers.push(t); return t; };
    const clear = () => { timers.forEach(clearTimeout); timers = []; stop.forEach(f => f()); stop = []; gm.classList.remove('spin'); card.classList.remove('roll', 'pop'); };
    const pool = () => { const p = onlyFull ? shops.filter(s => s[5]) : shops; return p.length ? p : shops; };
    const rand = () => { const p = pool(); if (!p.length) return null; let s = p[Math.floor(Math.random() * p.length)]; if (p.length > 1 && cur && s[0] === cur[0]) s = p[(p.indexOf(s) + 1) % p.length]; return s; };
    function paint(s, final) {
      if (!s) { ic.src = '/images/menu2/pin.webp'; tags.innerHTML = ''; nm.textContent = 'マップで さがしてみてね'; ar.textContent = ''; shopA.href = '/'; shopA.removeAttribute('target'); return; }
      const src = `/images/menu2/${TYPES[s[6]] ? s[6] : 'pin'}.webp`; if (final || !ic.getAttribute('src')) ic.src = src;
      tags.innerHTML = `<span class="bd ${s[5] ? 'f' : 'o'}">${s[5] ? 'お店まるごとヴィーガン' : 'ヴィーガンメニューあり'}</span>` + (TYPES[s[6]] ? `<span class="bd">${TYPES[s[6]]}</span>` : '');
      nm.textContent = s[1]; ar.textContent = s[3] || '';
      if (final) { shopA.href = `/shop/${s[0]}/`; shopA.target = '_blank'; }
    }
    function settle(s, pop) { cur = s; paint(s, true); card.classList.remove('roll', 'hid'); if (pop && !R) { void card.offsetWidth; card.classList.add('pop'); } }
    /* カプセルが おちて ひらく → カード */
    function reveal() {
      const s = rand(); card.classList.add('hid'); egg.classList.remove('open', 'in'); paint(s, true);
      if (R) { settle(s, false); return; }
      void egg.offsetWidth; egg.classList.add('in');
      later(() => { egg.classList.remove('in'); egg.classList.add('open'); card.style.transition = 'opacity .3s,transform .45s cubic-bezier(.3,1.5,.5,1)'; settle(s, false); }, 620);
      later(() => { egg.classList.remove('open'); card.style.transition = ''; }, 1100);
    }
    /* スロットのように 名前が くるくる → 決定 */
    function reroll(sayIt) {
      clear(); egg.classList.remove('open', 'in'); const s = rand();
      if (sayIt !== false) { const l = LINES[rolls++ % LINES.length]; ctx.say(l[0], l[1]); }
      if (R || !s) { settle(s, false); return; }
      card.classList.remove('hid'); card.classList.add('roll'); let n = 0; const p = pool();
      const tick = () => { if (n++ < 9) { paint(p[Math.floor(Math.random() * p.length)], false); later(tick, 55 + n * 9); } else settle(s, true); };
      tick();
    }
    spinB.addEventListener('click', () => { if (gm.classList.contains('spin')) return; if (R) { ctx.next(); return; } gm.classList.add('spin'); later(() => ctx.next(), 560); });
    again.addEventListener('click', () => ready.then(() => { if (scene === 1) reroll(); }));
    tg.addEventListener('click', () => { onlyFull = !onlyFull; tg.setAttribute('aria-pressed', onlyFull ? 'true' : 'false');
      ready.then(() => { if (scene !== 1) return; ctx.say(onlyFull ? 'お店まるごと ヴィーガンの ところだけで、まわすよ！' : 'ぜんぶの お店から、まわすよ！', 'pointing-up'); reroll(false); }); });

    return {
      go(k, dir) {
        const from = scene; scene = k; clear(); layers.forEach((l, j) => l.classList.toggle('on', j === k));
        if (k === 1) ready.then(() => { if (scene !== 1) return; if (cur && from === 2) { egg.classList.remove('open', 'in'); settle(cur, false); } else reveal(); });
        if (k === 2) { ring.classList.remove('on'); void ring.offsetWidth; ring.classList.add('on'); stop.push(K.count(num, total, 1100)); }
      },
    };
  },
  scenes(ctx) {
    const total = ctx.fmt(ctx.data.on + ctx.data.next);
    return [
      { pose: 'welcoming', name: 'ガチャ', html: 'さいごは おたのしみ！ ガチャを まわして、きょうの <b>1軒</b>を 見つけよう。' },
      { pose: 'presenting', name: 'きょうの1軒', html: 'ここは どう？ 気になったら、お店の ページを 見てみて！' },
      { pose: 'happy', name: 'マップでさがす', html: `日本じゅうで <b>${total}軒</b>が まってるよ。つぎの ごはんは、マップで さがしてみてね！` },
    ];
  },
};
})();
