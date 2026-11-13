/* ページの起動：データ読みこみ → ヒーロー → ステージ */
(async () => {
  'use strict';
  const { Kit, makeStage, fmt, reduced, $, $$ } = window.__stageKit;
  const only = new URLSearchParams(location.search).get('only');
  if (only) $$('.hero, .stage, .src').forEach(s => { if (s.dataset.viz !== only) s.hidden = true; });
  const [data, jp, chains] = await Promise.all(['data.json', 'jp.json', 'chains.json'].map(u => fetch(u).then(r => r.json())));
  window.__report = { data, chains };

  const total = $('#total');
  if (total) setTimeout(() => Kit.count(total, data.on + data.next, 1500), reduced ? 0 : 700);
  $$('[data-go]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }));
  $$('[data-fill]').forEach(e => { const v = e.dataset.fill.split('.').reduce((o, k) => o && o[k], { data, chains }); if (v != null) e.textContent = typeof v === 'number' ? fmt(v) : v; });

  /* 出典・CSV */
  const [y, m, d] = data.asof.split('-').map(Number), asofJa = `${y}年${m}月${d}日`;
  const asof = $('#asof'), cite = $('#citeText'), copy = $('#copyCite'), csv = $('#csv');
  if (asof) asof.textContent = asofJa;
  if (cite) cite.textContent = `出典：JFFIサステナビリティ報告書 2026（日本ビーガンマップ／veganmapjapan.org）${asofJa}時点`;
  if (copy) copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(cite.textContent); copy.textContent = 'コピーしました ✓'; } catch (e) { const r = document.createRange(); r.selectNodeContents(cite); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } });
  if (csv) csv.addEventListener('click', () => {
    const rows = [['都道府県', 'マップ掲載中', 'まもなく追加', '合計', 'うちお店まるごとヴィーガン']].concat(data.pref.map(r => [r[0], r[1], r[2], r[1] + r[2], r[3]]));
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' })); a.download = `jffi-report-2026-prefectures-${data.asof}.csv`; a.click();
  });

  const stages = $$('.stage').filter(s => !s.hidden && window.StageViz[s.dataset.viz]).map(s => makeStage(s, { data, jp, chains }));
  const by = new Map(stages.map(s => [s.sec, s])); let active = null;
  const lazy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { by.get(e.target).init(); lazy.unobserve(e.target); } }), { rootMargin: '120% 0px' });
  const act = new IntersectionObserver(es => es.forEach(e => { const st = by.get(e.target); if (e.intersectionRatio >= .55) { active = st; st.enter(); } else if (active === st) active = null; }), { threshold: [0, .55, 1] });
  stages.forEach(s => { lazy.observe(s.sec); act.observe(s.sec); });
  window.__stages = stages;

  addEventListener('keydown', e => { if (!active || e.metaKey || e.ctrlKey || e.altKey) return; if (e.key === 'ArrowRight') active.step(1); else if (e.key === 'ArrowLeft') active.step(-1); });
  let rt = 0, lw = innerWidth, lh = stages[0] ? stages[0].sec.offsetHeight : 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { const h = stages[0] ? stages[0].sec.offsetHeight : 0; if (innerWidth === lw && h === lh) return; lw = innerWidth; lh = h; stages.forEach(s => s.resize()); }, 160); });
})();
