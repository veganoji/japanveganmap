/* 水彩にじみマップ
   initFx(rootEl, data, jp): builds its own markup, styles and canvases inside rootEl.
   data = lab/numbers/data.json, jp = lab/numbers/jp.json. Needs the page's colour/font tokens (--ink, --royal, --round ...). */
function initFx(rootEl, data, jp){
  const LON0=128.3,LON1=149.0,LAT1=45.6,K=Math.cos(38*Math.PI/180);
  const T_TOTAL=24000,WET=1500,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt=n=>n.toLocaleString('ja-JP');
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h||w;return c};

  /* ---------- markup + styles ---------- */
  if(!document.getElementById('sx-css')){const st=document.createElement('style');st.id='sx-css';st.textContent=`
.sx{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;grid-template-areas:"count" "stage" "legend" "guide" "btns"}
.sx-count{grid-area:count;display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.sx-lab{font:900 18px/1.3 var(--round);color:var(--ink-soft,#3C2E22)}
.sx-num{white-space:nowrap;font:900 clamp(52px,15vw,62px)/.95 var(--sans);letter-spacing:-.03em;color:var(--royal);font-variant-numeric:tabular-nums}
.sx-num b{font-weight:inherit}
.sx-num i{font:900 .62em/1 var(--round);font-style:normal;color:var(--ink);margin-left:.08em;letter-spacing:0}
.sx-stage{grid-area:stage;justify-self:center;width:100%;border:2.5px solid var(--ink);border-radius:22px;box-shadow:5px 5px 0 var(--ink);overflow:hidden;background:#FBF5E6;line-height:0}
.sx-cv{display:block;width:100%;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.sx-legend{grid-area:legend;list-style:none;padding:0;margin:2px 0 0;display:flex;flex-wrap:wrap;gap:2px 20px;font:900 17.5px/1.3 var(--sans)}
.sx-legend li{display:flex;align-items:center;gap:8px}
.sx-legend canvas{width:38px;height:38px;flex:none}
.sx-guide{grid-area:guide;display:flex;gap:10px;align-items:flex-end}
.sx-oji{flex:none;width:84px;height:153px;display:flex;align-items:flex-end}.sx-oji img{display:block;width:100%;height:auto;max-height:100%;object-fit:contain;object-position:50% 100%}
.sx-oji.hop img{animation:sxHop .6s}
@keyframes sxHop{0%{transform:none}30%{transform:translateY(-14px) scale(1.04,.96)}60%{transform:translateY(0) scale(1.06,.92)}100%{transform:none}}
.sx-bub{position:relative;flex:1;min-width:0;min-height:calc(19.5px*1.55*3 + 30px);background:#fff;border:2.5px solid var(--ink);border-radius:22px;padding:13px 14px 15px;box-shadow:4px 4px 0 var(--ink);font:700 19.5px/1.55 var(--round);color:var(--ink)}

.sx-txt span{display:inline-block;white-space:nowrap}.sx-txt i{font-style:normal;visibility:hidden}
.sx-bub::before{content:"";position:absolute;left:-10.5px;bottom:28px;width:17px;height:17px;background:#fff;border-left:2.5px solid var(--ink);border-bottom:2.5px solid var(--ink);transform:rotate(45deg)}
.sx-btns{grid-area:btns;display:flex;flex-wrap:wrap;gap:12px;padding-bottom:6px}
.sx-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:2.5px solid var(--ink);box-shadow:4px 4px 0 var(--ink);border-radius:16px;padding:10px 18px;font:700 17.5px/1.3 var(--sans);background:var(--white,#FFFDF8);color:var(--ink);cursor:pointer;transition:transform .18s,box-shadow .18s,background .18s;-webkit-tap-highlight-color:transparent}
.sx-btn:hover{background:var(--cream,#FDF1DA)}
.sx-btn:active{transform:translate(3px,3px);box-shadow:1px 1px 0 var(--ink)}
@media(min-width:900px){
 .sx{grid-template-columns:minmax(0,1fr) 400px;grid-template-rows:auto auto 1fr auto;column-gap:34px;row-gap:18px;grid-template-areas:"stage count" "stage legend" "stage guide" "stage btns"}
 .sx-stage{max-width:min(700px,calc(100svh - 150px))}
 .sx-count{flex-direction:column;align-items:flex-start;gap:6px;padding-top:6px}
 .sx-lab{font-size:20px}.sx-num{font-size:96px}
 .sx-legend{flex-direction:column;gap:10px;font-size:19px}.sx-legend canvas{width:50px;height:50px}
 .sx-guide{align-self:end}.sx-oji{width:108px;height:197px}
 .sx-bub{font-size:20.5px;min-height:calc(20.5px*1.55*3 + 30px)}
}`;document.head.appendChild(st)}
  rootEl.innerHTML=`<div class="sx">
<div class="sx-count"><span class="sx-lab">いま塗ったお店</span><span class="sx-num"><b>0</b><i>軒</i></span></div>
<div class="sx-stage"><canvas class="sx-cv" role="img" aria-label="ビーガン対応のお店を、水彩のしずくで塗った日本地図"></canvas></div>
<ul class="sx-legend"><li><canvas data-c="0"></canvas>👑 お店まるごとヴィーガン</li><li><canvas data-c="1"></canvas>🌱 ヴィーガンメニューあり</li></ul>
<div class="sx-guide"><div class="sx-oji"><img src="/images/oji2/oji-explaining.webp" alt="ビーガン王子"></div><div class="sx-bub"><p class="sx-txt" aria-hidden="true"></p></div></div>
<div class="sx-btns"><button type="button" class="sx-btn" data-a="again">🔁 もう一度</button><button type="button" class="sx-btn" data-a="all">⏩ ぜんぶ表示</button></div>
</div>`;
  const $=s=>rootEl.querySelector(s),stage=$('.sx-stage'),cv=$('.sx-cv'),c=cv.getContext('2d'),numEl=$('.sx-num b'),
        oji=$('.sx-oji'),ojiImg=$('.sx-oji img'),bub=$('.sx-bub'),txt=$('.sx-txt');

  /* ---------- noise, paper tiles, pigment sprites (made once) ---------- */
  let seed=20261112;const srnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  function vnoise(size,cell){ /* tileable value noise, 0..1 */
    const g=Math.max(2,Math.round(size/cell)),lat=new Float32Array(g*g);for(let i=0;i<g*g;i++)lat[i]=srnd();
    const out=new Float32Array(size*size);
    for(let y=0;y<size;y++){const fy=y/size*g,y0=fy|0,ty=fy-y0,sy=ty*ty*(3-2*ty),ya=y0%g,yb=(y0+1)%g;
      for(let x=0;x<size;x++){const fx=x/size*g,x0=fx|0,tx=fx-x0,sx=tx*tx*(3-2*tx),xa=x0%g,xb=(x0+1)%g;
        const a=lat[ya*g+xa],b=lat[ya*g+xb],d=lat[yb*g+xa],e=lat[yb*g+xb];
        out[y*size+x]=a+(b-a)*sx+(d-a)*sy+(a-b-d+e)*sx*sy}}
    return out}
  const sstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
  function tile(rgb,fn){const S=256,cn=mk(S),x=cn.getContext('2d'),im=x.createImageData(S,S),d=im.data;
    for(let i=0;i<S*S;i++){d[i*4]=rgb[0];d[i*4+1]=rgb[1];d[i*4+2]=rgb[2];d[i*4+3]=Math.min(255,fn(i)*255)}
    x.putImageData(im,0,0);return cn}
  const n3=vnoise(256,3),n7=vnoise(256,7),n20=vnoise(256,20),g2=vnoise(256,2.4),g5=vnoise(256,5.5);
  /* cold-press dimples: fine tooth + wider bumps */
  const grainT=tile([118,94,60],i=>Math.pow(.45*n3[i]+.33*n7[i]+.22*srnd(),1.5)*.2+sstep(.55,.9,n20[i])*.035);
  /* granulation: pigment drops out of the paper's high points */
  const granT=tile([0,0,0],i=>sstep(.5,.86,.62*g2[i]+.38*g5[i])*.42);
  const SP=112,SR=40;
  function blob(rgb,inA,ringA){const cn=mk(SP),x=cn.getContext('2d'),im=x.createImageData(SP,SP),d=im.data,nz=vnoise(SP,5);
    const k1=2+(srnd()*2|0),k2=4+(srnd()*3|0),k3=7+(srnd()*5|0),p1=srnd()*6.283,p2=srnd()*6.283,p3=srnd()*6.283;
    for(let y=0;y<SP;y++)for(let xx=0;xx<SP;xx++){const dx=xx-SP/2+.5,dy=y-SP/2+.5,th=Math.atan2(dy,dx),
      rr=SR*(1+.09*Math.sin(k1*th+p1)+.055*Math.sin(k2*th+p2)+.03*Math.sin(k3*th+p3)),u=Math.hypot(dx,dy)/rr,i=(y*SP+xx)*4;
      let a=0;if(u<1.25){const ring=Math.exp(-(((u-.9)/.078)**2));a=((u<.9?inA*(.62+.38*u):inA*ring)+ringA*ring)*(.74+.52*nz[y*SP+xx])}
      d[i]=rgb[0];d[i+1]=rgb[1];d[i+2]=rgb[2];d[i+3]=Math.min(255,a*255)}
    x.putImageData(im,0,0);return cn}
  function soft(rgb,amp,a0,a1){const cn=mk(SP),x=cn.getContext('2d'),g=x.createRadialGradient(SP/2,SP/2,SR*a0,SP/2,SP/2,SR*a1);
    g.addColorStop(0,`rgba(${rgb},${amp})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(0,0,SP,SP);return cn}
  const GREENS=[[66,128,70],[56,122,82],[84,134,62],[62,128,92],[76,124,58],[52,116,72]],GOLDS=[[247,208,96],[249,214,112],[244,202,88],[251,219,126]];
  const sprG=GREENS.map(v=>blob(v,.34,.5)),sprY=GOLDS.map(v=>blob(v,.22,.42)),
        sprGD=[[36,98,60],[30,90,70],[46,102,50]].map(v=>blob(v,.34,.5)),sprYD=[[240,190,66],[236,182,58]].map(v=>blob(v,.24,.44)),
        /* freshly re-wet paint: the same pigments, brighter */
        sprGB=[[64,156,80],[54,150,96],[88,162,66]].map(v=>blob(v,.34,.5)),sprYB=[[252,216,98],[253,224,122]].map(v=>blob(v,.24,.46));
  const coreG=soft('46,104,58',.6,.12,1),coreY=soft('196,136,14',.66,.12,1),liftS=soft('255,255,255',1,.5,.96),
        coreGB=soft('62,150,82',.6,.12,1),coreYB=soft('232,168,28',.66,.12,1);

  /* ---------- geometry ---------- */
  let W=0,H=0,dpr=1,s,si,OX,OY,IX=10,IY=10,IW,IH,R0,HL=2,paths=[],bbs=[];
  const paperC=mk(2),bakeC=mk(2),wetC=mk(2),snapC=mk(2),halo=[mk(2),mk(2),mk(2)],snapH=mk(2),bx=bakeC.getContext('2d'),wx=wetC.getContext('2d'),sx=snapC.getContext('2d');
  let granPat=null;
  const pm=(lo,la)=>[OX+(lo-LON0)*K*s,OY+(LAT1-la)*s],pin=(lo,la)=>[IX+14+(lo-122.9)*K*si,IY+30+(29.6-la)*si];
  const P=data.pts.filter(p=>p[2]!==2).map(p=>({la:p[0],lo:p[1],pr:p[3],gold:!(p[2]===3||p[2]===4),u:Math.random(),v:Math.random()*6|0,w:Math.random(),sp:null,x:0,y:0,R:4,a:1}));
  const N=P.length;
  const PREF=data.pref.map((r,i)=>({name:r[0],t:r[1]+r[2],f:r[3],rk:0}));
  PREF.forEach(r=>{r.rk=1+PREF.filter(o=>o.t>r.t).length});

  function size(){
    dpr=Math.min(2,window.devicePixelRatio||1);W=stage.clientWidth;H=Math.round(Math.min(W,700)*.94);
    s=Math.min(W*.92/((LON1-LON0)*K),H*.93/(LAT1-30));const mw=(LON1-LON0)*K*s;OX=(W-mw)/2+W*.02;OY=H*.035;
    si=s*.62;IW=(131.6-122.9)*K*si+28;IH=(29.6-24)*si+42;R0=Math.max(3.3,W*.0088);HL=W<480?1:2;
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cv.style.height=H+'px';
    [paperC,bakeC,wetC,snapC].forEach(k=>{k.width=cv.width;k.height=cv.height});
    halo.forEach((h,i)=>{h.width=Math.ceil(cv.width/(2<<i));h.height=Math.ceil(cv.height/(2<<i))});snapH.width=halo[HL].width;snapH.height=halo[HL].height;
    P.forEach(p=>{[p.x,p.y]=p.la<29.6&&p.lo<131.6?pin(p.lo,p.la):pm(p.lo,p.la)});
    bbs=[];
    paths=jp.map(([id,rings])=>{const q=new Path2D(),bb=[1e9,1e9,-1e9,-1e9];rings.forEach(r=>{let maxLa=-90,minLo=999;
        for(let i=0;i<r.length;i+=2){const lo=(r[i]+122000)/1000,la=(r[i+1]+24000)/1000;if(la>maxLa)maxLa=la;if(lo<minLo)minLo=lo}
        const inset=maxLa<29.6&&minLo<131.6;
        for(let i=0;i<r.length;i+=2){const lo=(r[i]+122000)/1000,la=(r[i+1]+24000)/1000,[x,y]=inset?pin(lo,la):pm(lo,la);i?q.lineTo(x,y):q.moveTo(x,y);
          if(x<bb[0])bb[0]=x;if(y<bb[1])bb[1]=y;if(x>bb[2])bb[2]=x;if(y>bb[3])bb[3]=y}
        q.closePath()});bbs[id-1]=bb;return{i:id-1,q}});
    /* more paint in one place spreads further: radius grows with the local crowd */
    const cs=Math.max(6,W*.02),gw=Math.ceil(W/cs)+3,grid=new Uint16Array(gw*(Math.ceil(H/cs)+3));
    P.forEach(p=>{p.g=((p.y/cs|0)+1)*gw+(p.x/cs|0)+1;grid[p.g]++});
    P.forEach(p=>{let n=0;for(let dy=-1;dy<2;dy++)for(let dx=-1;dx<2;dx++)n+=grid[p.g+dy*gw+dx]||0;
      const m=1+.38*Math.log2(1+n/14),dk=Math.min(1,Math.max(0,(Math.log2(1+n)-4)/4.5));
      p.R=R0*(1+(m-1)*Math.pow(p.u,3))*(p.gold?1:1.18);p.a=Math.pow(1+n/10,-.5)*Math.pow(R0/p.R,.3); /* thinner paint per drop where many land, so tone keeps building */
      p.sp=p.gold?(p.w<dk?sprYD[p.v%2]:sprY[p.v%4]):(p.w<dk?sprGD[p.v%3]:sprG[p.v])});
    granPat=wx.createPattern(granT,'repeat');
    buildPaper();
  }
  /* ---------- the sheet: paper, sea wash, pale land wash, pencil lines, grain ---------- */
  function buildPaper(){
    const x=paperC.getContext('2d'),cw=cv.width,ch=cv.height;
    x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#FBF5E6';x.fillRect(0,0,cw,ch);
    const q=5,lw=Math.ceil(W/q),lh=Math.ceil(H/q);
    /* sea: loose blotchy wash painted small then enlarged (soft), with a darker rim where it stopped */
    const lo=mk(lw,lh),lx=lo.getContext('2d'),im=lx.createImageData(lw,lh),d=im.data;
    const l2=mk(lw,lh),l2x=l2.getContext('2d'),im2=l2x.createImageData(lw,lh),d2=im2.data;
    for(let y=0;y<lh;y++)for(let xx=0;xx<lw;xx++){
      const nx=xx/lw,ny=y/lh,wob=n20[((y*3)&255)*256+((xx*3)&255)]-.5,bl=n20[((y*2+90)&255)*256+((xx*2+40)&255)],b2=n7[((y+31)&255)*256+((xx+77)&255)],
        e=Math.min(nx,ny,1-nx,1-ny)+wob*.06,m=sstep(.012,.06,e),band=Math.exp(-(((e-.04)/.014)**2)),i=(y*lw+xx)*4;
      d[i]=146+36*bl;d[i+1]=198+20*bl;d[i+2]=216+12*bl;d[i+3]=255*Math.min(1,m*(.36+.42*bl+.1*b2)+band*.22*m);
      const t=.6*bl+.4*b2;d2[i]=222+28*t;d2[i+1]=230+8*t;d2[i+2]=196+22*t;d2[i+3]=205}
    lx.putImageData(im,0,0);l2x.putImageData(im2,0,0);
    const sea=mk(cw,ch),sc=sea.getContext('2d');sc.imageSmoothingEnabled=true;sc.imageSmoothingQuality='high';sc.drawImage(lo,0,0,cw,ch);
    sc.setTransform(dpr,0,0,dpr,0,0);sc.lineJoin='round';
    sc.strokeStyle='rgba(100,158,188,.2)';sc.lineWidth=Math.max(5,W*.013);paths.forEach(p=>sc.stroke(p.q));
    sc.strokeStyle='rgba(78,136,170,.4)';sc.lineWidth=2;paths.forEach(p=>sc.stroke(p.q));
    sc.globalCompositeOperation='destination-out';sc.fillStyle='#000';paths.forEach(p=>sc.fill(p.q));
    x.drawImage(sea,0,0);
    /* land: a very pale straw-and-sage wash kept inside the coast */
    const land=mk(cw,ch),lc=land.getContext('2d');lc.setTransform(dpr,0,0,dpr,0,0);lc.fillStyle='#F0ECD4';paths.forEach(p=>lc.fill(p.q));
    lc.setTransform(1,0,0,1,0,0);lc.globalCompositeOperation='source-atop';lc.imageSmoothingEnabled=true;lc.imageSmoothingQuality='high';lc.drawImage(l2,0,0,cw,ch);
    x.globalAlpha=.86;x.drawImage(land,0,0);x.globalAlpha=1;
    x.setTransform(dpr,0,0,dpr,0,0);x.lineJoin='round';
    x.strokeStyle='rgba(150,152,104,.2)';x.lineWidth=1.8;paths.forEach(p=>x.stroke(p.q));
    x.strokeStyle='rgba(84,70,54,.2)';x.lineWidth=.6;paths.forEach(p=>x.stroke(p.q));
    /* Okinawa and Amami sit in a pencil box */
    x.strokeStyle='rgba(74,60,44,.6)';x.lineWidth=1.2;x.setLineDash([6,5]);x.beginPath();
    x.roundRect?x.roundRect(IX,IY,IW,IH,14):x.rect(IX,IY,IW,IH);x.stroke();x.setLineDash([]);
    x.fillStyle='rgba(60,46,34,.88)';x.font=`700 ${Math.max(14,Math.round(W*.024))}px "Zen Maru Gothic","Noto Sans JP",sans-serif`;x.textBaseline='alphabetic';
    x.fillText('沖縄・奄美',IX+12,IY+24);
    x.setTransform(1,0,0,1,0,0);x.fillStyle=x.createPattern(grainT,'repeat');x.fillRect(0,0,cw,ch);
  }
  /* ---------- painting state ---------- */
  const order=new Uint16Array(N),tBirth=new Float32Array(N);
  for(let i=0;i<N;i++){order[i]=i;tBirth[i]=T_TOTAL*Math.pow((i+.5)/N,1/2.3)} /* slow start: first drops land one by one */
  const shuffle=()=>{for(let i=N-1;i>0;i--){const j=Math.random()*(i+1)|0,t=order[i];order[i]=order[j];order[j]=t}};
  let born=0,baked=0,clock=0,ui=0,last=0,raf=0,started=false,done=false,inView=false,sel=-1,dim=0,xf=0,cntF=0,shown=-1,ripples=[],rewet=[];
  const amt=new Float32Array(47),HK=SP/SR/2;
  /* one drop at dryness pr (0 just landed, 1 dry): water pushes old pigment aside, pigment starts in the middle and settles at the rim */
  function stamp(x,p,pr,sp){
    const r=p.R*(.2+.8*(1-Math.pow(1-pr,3))),hs=r*HK;
    x.globalCompositeOperation='destination-out';x.globalAlpha=(p.gold?.13:.3)*pr*p.a;x.drawImage(liftS,p.x-hs,p.y-hs,hs*2,hs*2);
    x.globalCompositeOperation='source-over';x.globalAlpha=p.a*(.35+.65*pr);x.drawImage(sp||p.sp,p.x-hs,p.y-hs,hs*2,hs*2);
    if(pr<1){const hc=hs*.9;x.globalAlpha=Math.min(1,p.a*Math.pow(1-pr,1.3));x.drawImage(p.gold?coreY:coreG,p.x-hc,p.y-hc,hc*2,hc*2)}
  }
  function bakeTo(n){bx.setTransform(dpr,0,0,dpr,0,0);while(baked<n){const p=P[order[baked]];stamp(bx,p,1);
    for(const l of selL)if(l.i===p.pr){const x=l.cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);stamp(x,p,1,bright(p))}baked++}}
  const bright=p=>p.gold?sprYB[p.v%2]:sprGB[p.v%3];
  /* the chosen prefecture's own paint, kept on its own sheet so it can be brought back to full strength */
  const selL=[];
  function selLayer(i){
    let L=selL.find(l=>l.i===i)||selL.find(l=>l.i<0||amt[l.i]<.02);
    if(!L){if(selL.length<3){L={i:-1,cv:mk(2)};selL.push(L)}else L=selL.reduce((a,b)=>amt[a.i]<=amt[b.i]?a:b)}
    L.i=i;if(L.cv.width!==cv.width||L.cv.height!==cv.height){L.cv.width=cv.width;L.cv.height=cv.height}
    const x=L.cv.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';x.globalAlpha=1;x.clearRect(0,0,cv.width,cv.height);
    x.setTransform(dpr,0,0,dpr,0,0);for(let k=0;k<baked;k++){const p=P[order[k]];if(p.pr===i)stamp(x,p,1,bright(p))}
    x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='destination-out';x.fillStyle=granPat;x.fillRect(0,0,cv.width,cv.height);
  }
  function draw(){
    const cw=cv.width,ch=cv.height;
    wx.setTransform(1,0,0,1,0,0);wx.globalAlpha=1;wx.globalCompositeOperation='copy';wx.drawImage(bakeC,0,0);
    wx.setTransform(dpr,0,0,dpr,0,0);
    for(let i=baked;i<born;i++)stamp(wx,P[order[i]],Math.min(1,Math.max(0,(clock-tBirth[i])/WET)));
    wx.setTransform(1,0,0,1,0,0);wx.globalAlpha=1;wx.globalCompositeOperation='destination-out';wx.fillStyle=granPat;wx.fillRect(0,0,cw,ch);
    /* pigment that crept into the damp paper: a soft, low-resolution copy of the layer */
    let lowS=wetC;for(let i=0;i<=HL;i++){const h=halo[i],hx=h.getContext('2d');hx.globalCompositeOperation='copy';hx.drawImage(lowS,0,0,h.width,h.height);lowS=h}
    c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.drawImage(paperC,0,0);
    c.globalCompositeOperation='multiply';c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const base=1-.45*dim,e=xf*xf*(3-2*xf),BL=.45;
    if(e>0){c.globalAlpha=base*e*BL;c.drawImage(snapH,0,0,cw,ch);c.globalAlpha=base*e;c.drawImage(snapC,0,0)}
    c.globalAlpha=base*(1-e)*BL;c.drawImage(lowS,0,0,cw,ch);c.globalAlpha=base*(1-e);c.drawImage(wetC,0,0);
    for(const p of paths){const a=amt[p.i];if(a<.01)continue; /* the chosen prefecture: damp paper, deeper colour, water pooled along its edge */
      const bb=bbs[p.i];c.save();c.setTransform(dpr,0,0,dpr,0,0);c.clip(p.q);
      c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=a*.62;c.drawImage(paperC,0,0); /* water lifts the old paint here */
      c.setTransform(dpr,0,0,dpr,0,0);c.globalCompositeOperation='multiply';
      c.globalAlpha=a*.75;c.fillStyle='rgb(212,232,224)';c.fillRect(bb[0]-2,bb[1]-2,bb[2]-bb[0]+4,bb[3]-bb[1]+4);
      c.globalAlpha=a*.5;c.strokeStyle='rgb(150,196,206)';c.lineWidth=Math.max(7,W*.016);c.lineJoin='round';c.stroke(p.q);
      c.restore()}
    c.setTransform(1,0,0,1,0,0);
    for(const l of selL){const a=l.i<0?0:amt[l.i];if(a<.01)continue;c.globalAlpha=Math.min(1,a*(.45*dim+.55));c.drawImage(l.cv,0,0)}
    c.setTransform(dpr,0,0,dpr,0,0); /* fresh water reaching each drop */
    for(const w of rewet){const q=(ui-w.t0)/760;if(q<=0||q>=1)continue;const p=w.p,hs=p.R*(.75+.55*q)*HK;
      c.globalAlpha=Math.sin(Math.PI*q)*.6*w.k*Math.max(.16,p.a);c.drawImage(p.gold?coreYB:coreGB,p.x-hs,p.y-hs,hs*2,hs*2)}
    c.globalCompositeOperation='source-over';c.setTransform(dpr,0,0,dpr,0,0);c.lineJoin='round';
    for(const p of paths){const a=amt[p.i];if(a<.01)continue;c.globalAlpha=a;
      c.strokeStyle='rgba(118,178,208,.42)';c.lineWidth=5.5;c.stroke(p.q);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=2.4;c.stroke(p.q);
      c.strokeStyle='rgba(44,84,54,.88)';c.lineWidth=1.1;c.stroke(p.q)}
    for(const r of ripples)for(let k=0;k<(r.soft?2:3);k++){ /* rings of clear water */
      const q=(ui-r.t0)/r.dur-k*.15;if(q<=0||q>=1)continue;const rad=r.R*(1-Math.pow(1-q,3))*(1-k*.1),al=Math.pow(1-q,1.4)*(r.soft?.7:1);
      c.globalAlpha=al;c.beginPath();c.arc(r.x,r.y,rad,0,6.2832);if(!k){c.fillStyle='rgba(206,233,245,.2)';c.fill()}
      c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=3.4*(1-.5*q)+.6;c.stroke();
      c.beginPath();c.arc(r.x,r.y,rad+2.6,0,6.2832);c.strokeStyle='rgba(84,144,180,.55)';c.lineWidth=1.1;c.stroke()}
    c.globalAlpha=1;
  }
  function frame(now){
    raf=0;const dt=last?Math.min(50,now-last):16;last=now;ui+=dt;let moving=false;
    if(started&&!done){clock+=dt;
      while(born<N&&tBirth[born]<=clock){if(born<14){const p=P[order[born]];ripples.push({x:p.x,y:p.y,t0:ui,R:20+R0*3,dur:950,soft:true})}born++}
      bakeTo(Math.min(born,(()=>{let n=baked;while(n<born&&clock-tBirth[n]>=WET)n++;return n})()));
      if(baked>=N){done=true;finish()}}
    const k=RM?1:1-Math.exp(-dt/190),tg=sel>=0?1:0;
    if(dim!==tg){dim+=(tg-dim)*k;if(Math.abs(tg-dim)<.004)dim=tg;else moving=true}
    for(let i=0;i<47;i++){const t=i===sel?1:0;if(amt[i]!==t){amt[i]+=(t-amt[i])*k;if(Math.abs(t-amt[i])<.004)amt[i]=t;else moving=true}}
    if(xf>0){xf=RM?0:Math.max(0,xf-dt/650);moving=true}
    const tgt=done?N:born;if(cntF!==tgt){cntF+=(tgt-cntF)*(RM?1:Math.min(1,dt/110));if(Math.abs(tgt-cntF)<.6)cntF=tgt;else moving=true}
    const n=Math.round(cntF);if(n!==shown){shown=n;numEl.textContent=fmt(n)}
    ripples=ripples.filter(r=>ui-r.t0<r.dur*1.35);rewet=rewet.filter(w=>ui-w.t0<760);
    draw();
    if((started&&!done)||moving||ripples.length||rewet.length)kick();else last=0;
  }
  function kick(){if(!raf&&!document.hidden&&inView)raf=requestAnimationFrame(frame)}
  /* ---------- Oji ---------- */
  const MSG_START=['一滴が','お店ひとつ。','色が濃いほど、','お店が','ぎゅっと','集まってるよ！'],
        MSG_DONE=[`ぜんぶで${fmt(N)}軒！`,'気になる県を','タップしてね！'];
  const lineFor=r=>[`${r.name}は`,`${fmt(r.t)}軒で`,`全国${r.rk}位${r.rk===1?'！':'。'}`,'まるごと'].concat(r.f>0?['ヴィーガンは',`${fmt(r.f)}軒だよ！`]:['ヴィーガンは','まだ0軒…！']);
  ['explaining','excited','wondering','pointing-up','happy'].forEach(n=>{new Image().src=`/images/oji2/oji-${n}.webp`});
  const sr=document.createElement('span');sr.setAttribute('aria-live','polite');sr.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';bub.appendChild(sr);
  let tyT=0,said='';
  function say(parts,pose){ /* parts = phrases: lines only break between them */
    const s=parts.join('');if(s===said)return;said=s;clearInterval(tyT);sr.textContent=s;
    const src=`/images/oji2/oji-${pose||'explaining'}.webp`;if(!ojiImg.src.endsWith(src))ojiImg.src=src;
    txt.textContent='';
    const cells=parts.map(t=>{const sp=document.createElement('span'),on=document.createTextNode(RM?t:''),off=document.createElement('i');
      off.textContent=RM?'':t;sp.append(on,off);txt.appendChild(sp);return{on,off,ch:[...t],k:0}});
    if(RM)return;
    oji.classList.remove('hop');void oji.offsetWidth;oji.classList.add('hop');
    let pi=0;tyT=setInterval(()=>{const cl=cells[pi];cl.k++;cl.on.data=cl.ch.slice(0,cl.k).join('');cl.off.textContent=cl.ch.slice(cl.k).join('');
      if(cl.k>=cl.ch.length&&++pi>=cells.length)clearInterval(tyT)},32);
  }
  function finish(){if(sel<0)say(MSG_DONE,'happy')}

  /* ---------- taps ---------- */
  function hitAt(x,y){
    c.setTransform(dpr,0,0,dpr,0,0);for(const p of paths)if(c.isPointInPath(p.q,x*dpr,y*dpr))return p.i;
    let bd=18*18,h=-1;for(const p of P){const dd=(p.x-x)**2+(p.y-y)**2;if(dd<bd){bd=dd;h=p.pr}}return h}
  function pick(i,x,y){
    if(i===sel)i=-1;const changed=i!==sel;sel=i;
    if(i>=0){
      const bb=bbs[i],R=Math.min(W*.6,Math.max(64,Math.hypot(Math.max(x-bb[0],bb[2]-x),Math.max(y-bb[1],bb[3]-y))+10));
      selLayer(i);
      if(!RM){ripples.push({x,y,t0:ui,R,dur:1150});
        let list=[];for(let k=0;k<baked;k++){const p=P[order[k]];if(p.pr===i)list.push(p)}
        if(list.length>420){const f=420/list.length;list=list.filter(()=>Math.random()<f)}
        const k=Math.min(1,Math.sqrt(60/Math.max(1,list.length))); /* crowded places: a gentler flash per drop */
        for(const p of list){const d=Math.min(.999,Math.hypot(p.x-x,p.y-y)/R);rewet.push({p,k,t0:ui+(1-Math.cbrt(1-d))*1150})}}
      const r=PREF[i];say(lineFor(r),r.rk<=3?'excited':r.f===0?'wondering':'pointing-up');
    }else{
      if(!RM)ripples.push({x,y,t0:ui,R:46,dur:800,soft:true});
      if(changed)say(done?MSG_DONE:MSG_START,done?'happy':'explaining');
    }
    kick();
  }
  cv.addEventListener('click',ev=>{const b=cv.getBoundingClientRect(),x=(ev.clientX-b.left)*W/b.width,y=(ev.clientY-b.top)*H/b.height;pick(hitAt(x,y),x,y)});

  /* ---------- buttons ---------- */
  function snap(){sx.setTransform(1,0,0,1,0,0);sx.globalAlpha=1;sx.globalCompositeOperation='copy';sx.drawImage(wetC,0,0);
    const hx=snapH.getContext('2d');hx.globalCompositeOperation='copy';hx.drawImage(halo[HL],0,0);xf=1}
  function again(){
    snap();bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,bakeC.width,bakeC.height);shuffle();born=baked=0;clock=0;cntF=0;done=false;started=true;sel=-1;rewet=[];ripples=[];
    if(RM){showAll();return}
    said='';say(MSG_START,'explaining');kick();
  }
  function showAll(){if(done)return;snap();born=N;bakeTo(N);clock=T_TOTAL+WET+1;started=true;done=true;finish();kick()}
  $('.sx-btns').addEventListener('click',ev=>{const b=ev.target.closest('button');if(b)b.dataset.a==='again'?again():showAll()});

  /* ---------- legend swatches, sizing, start ---------- */
  rootEl.querySelectorAll('.sx-legend canvas').forEach(k=>{const gold=k.dataset.c==='1',S=100;k.width=k.height=S;const x=k.getContext('2d');
    [[54,56,34,0],[36,40,21,1],[68,38,19,2],[54,56,34,3]].forEach(([px,py,r,v])=>{const hs=r*HK;x.drawImage(gold?sprY[v]:sprG[v],px-hs,py-hs,hs*2,hs*2)});
    x.globalCompositeOperation='destination-out';x.fillStyle=x.createPattern(granT,'repeat');x.fillRect(0,0,S,S)});
  function relayout(){size();selL.forEach(l=>{l.i=-1});bx.setTransform(1,0,0,1,0,0);bx.clearRect(0,0,bakeC.width,bakeC.height);baked=0;bakeTo(born);if(sel>=0)selLayer(sel);xf=0;draw()}
  shuffle();size();
  if(RM){born=N;bakeTo(N);clock=T_TOTAL+WET+1;started=done=true;cntF=N;shown=N;numEl.textContent=fmt(N);say(MSG_DONE,'happy')}
  draw();
  let rt=0;new ResizeObserver(()=>{if(stage.clientWidth===W)return;clearTimeout(rt);rt=setTimeout(relayout,140)}).observe(stage);
  new IntersectionObserver(es=>{inView=es[es.length-1].isIntersecting;if(inView){if(!started){started=true;say(MSG_START,'explaining')}kick()}},{threshold:.2}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0}else kick()});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{buildPaper();draw()});
  /* select(i): prefecture index 0-46, -1 clears */
  const select=i=>{if(i===sel)return;if(i<0)pick(-1,W/2,H/2);else{const b=bbs[i];pick(i,(b[0]+b[2])/2,(b[1]+b[3])/2)}};
  return{again,showAll,select};
}
