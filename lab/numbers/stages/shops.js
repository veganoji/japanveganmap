/* 01 お店は どこに ある？ — つぶつぶ変身（1つぶ = 1軒） */
(window.StageViz = window.StageViz || {}).shops = {
  legend: [['var(--leaf)', 'お店まるごとヴィーガン'], ['var(--gold)', 'ヴィーガンメニューあり']],
  init(viz, ctx) {
    const fx = initFx(viz, ctx.data, ctx.jp, { plot: () => ctx.plot(), reduced: ctx.reduced });
    let started = false;
    return { fx,
      go(k) { if (!started) { started = true; fx.start(); if (k) fx.go(k); } else fx.go(k); },
      resize() { fx.resize(); } };
  },
  glyphs(ctx, inst) { const s = inst.fx.stats; return '沖縄・奄美その他都道府県お店まるごとヴィーガンメニューありよに日本で見つけた' + s.regions.map(r => r.name).join('') + s.top.map(r => r.name).join(''); },
  scenes(ctx, inst) {
    const s = inst.fx.stats, f = ctx.fmt;
    return [
      { pose: 'greeting', name: '日本地図', html: `つぶ ひとつが、お店 ひとつ。日本じゅうで <b>${f(s.total)}軒</b> 見つけたよ！` },
      { pose: 'explaining', name: '地方ごと', html: `地方ごとに まとめたよ。いちばんは <b>${s.topRegion.name}</b>の ${f(s.topRegion.count)}軒。まんなかの 緑が まるごとヴィーガン！` },
      { pose: 'pointing-up', name: '都道府県ランキング', html: `都道府県で ならべると、1位は <b>${s.top[0].name}</b>。トップ${s.top.length}だけで ぜんたいの <b>${s.topShare}%</b> だよ。` },
      { pose: 'presenting', name: 'まるごとヴィーガンは何軒？', html: `お店まるごと ヴィーガンは <b>${f(s.full)}軒</b>。およそ <b>${s.oneIn}軒に 1軒</b> なんだ。` },
      { pose: 'excited', name: 'フィナーレ', html: `ぜんぶ あわせて <b>${f(s.total)}軒</b>！ ひとつぶ ひとつぶが、だれかの 「おいしい」に なるよ。` },
    ];
  },
};
