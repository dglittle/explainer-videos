// ---------- small helpers ----------
function rngS(seed){let s=seed%2147483647||1;return()=>(s=(s*16807)%2147483647)/2147483647}
const FACE=[1650,815,1920,1080];                                      // the webcam circle's corner: always kept free
C.q='#ff6b9a'; C.bad='#ff5d5d';
const WC=['#6fd0ff','#ffb36b','#a6ee7c'];                            // one color per wire (and per bit in the state names)
const close=(a,b,e=1e-9)=>Math.abs(a-b)<e;
// the numbers we write: 0, ±1, ±1/√2, ±½
function fmt(x){if(close(x,0))return'0';const s=x<0?'−':'',a=Math.abs(x);return s+(close(a,1)?'1':close(a,R2)?'1/√2':close(a,0.5)?'½':a.toFixed(2))}
// a state name, each bit in its wire's color
function sname(k,x,y,sz,a=1,al='center',wt=''){if(a<=0)return;rich(BITS(k).split('').map((b,w)=>[b,WC[w],wt]),x,y,sz,al,a)}
function glowLine(pts,u,col,a=1,w=6){if(a<=0||u<=0)return;let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
 let left=L*cl(u),X=pts[0][0],Y=pts[0][1];g.save();g.globalAlpha*=a;g.shadowColor=col;g.shadowBlur=18;g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(X,Y);
 for(let i=1;i<pts.length&&left>0;i++){const k=Math.min(1,left/seg[i-1]);X=lerp(pts[i-1][0],pts[i][0],k);Y=lerp(pts[i-1][1],pts[i][1],k);g.lineTo(X,Y);left-=seg[i-1]}
 g.stroke();g.restore();glowDot(X,Y,w*1.4,'#fff',a)}
// a number in a matrix/vector cell
function num(x,y,s,v,col,a=1){if(a<=0)return;const z=close(v,0),f=fmt(v);txt(f,x+s/2,y+s/2+s*0.02,z?s*0.3:f.length>2?s*0.27:s*0.42,z?C.dim:col,'center',z?'':'bold',a*(z?0.45:1))}
// ---------- the circuit diagram: wires, gates, and a cursor ----------
// gates: H = a box; CNOT = a dot on the control, ⊕ on the target. x0,y0 = the top wire's left end; sc = scale
const CW=440, CG=70, GX=k=>110+k*120;
function circuit(x0,y0,sc,o={}){const a=o.a??1;if(a<=0)return;g.save();g.globalAlpha*=a;
 const X=u=>x0+u*sc, Y=w=>y0+w*CG*sc, draw=o.draw??1;
 for(let w=0;w<NQ;w++){g.save();g.strokeStyle=WC[w];g.globalAlpha*=0.85;g.lineWidth=3*sc;g.lineCap='round';g.beginPath();g.moveTo(X(0),Y(w));g.lineTo(X(lerp(0,CW,draw)),Y(w));g.stroke();g.restore();
  txt('|0⟩',X(-14),Y(w),26*sc,WC[w],'right','',o.kets??1)}
 GATES.forEach((G,k)=>{const ga=o.gates?o.gates(k):1;if(ga<=0)return;const x=X(GX(k)),lit=o.lit?o.lit(k):0;g.save();g.globalAlpha*=ga;
  if(lit>0){g.save();g.globalAlpha*=lit;g.shadowColor='#fff';g.shadowBlur=30*sc;g.fillStyle='#ffffff22';rr(x-34*sc,Y(Math.min(...G.wires))-34*sc,68*sc,(Math.max(...G.wires)-Math.min(...G.wires))*CG*sc+68*sc,12*sc);g.fill();g.restore()}
  if(G.name=='H'){const y=Y(G.wires[0]),s=46*sc;rr(x-s/2,y-s/2,s,s,8*sc);g.fillStyle=C.panel;g.fill();g.strokeStyle='#e8eef4';g.lineWidth=2.5*sc;g.stroke();txt('H',x,y+1,28*sc,'#fff','center','bold')}
  else{const yc=Y(G.wires[0]),yt=Y(G.wires[1]),r=17*sc;g.strokeStyle='#e8eef4';g.lineWidth=2.5*sc;g.beginPath();g.moveTo(x,yc);g.lineTo(x,yt+(yt>yc?r:-r));g.stroke();
   g.fillStyle='#e8eef4';g.beginPath();g.arc(x,yc,7*sc,0,7);g.fill();g.beginPath();g.arc(x,yt,r,0,7);g.fillStyle=C.panel;g.fill();g.stroke();g.beginPath();g.moveTo(x-r,yt);g.lineTo(x+r,yt);g.moveTo(x,yt-r);g.lineTo(x,yt+r);g.stroke()}
  if(o.labels){txt(`M${'₁₂₃'[k]}`,x,Y(NQ-1)+44*sc,24*sc,C.gold,'center','bold',o.labels(k))}
  g.restore()});
 if(o.cursor!=null){const x=X(o.cursor);g.save();g.globalAlpha*=o.curA??1;g.shadowColor='#fff';g.shadowBlur=14;g.strokeStyle='#ffffffb0';g.lineWidth=2.5;g.setLineDash([6,6]);g.beginPath();g.moveTo(x,Y(0)-34*sc);g.lineTo(x,Y(NQ-1)+34*sc);g.stroke();g.restore()}
 g.restore()}
// ---------- the swarm: little circuits, each with its own matrix next to it (computed with the same expand rule) ----------
const swCache={};
function miniCircuit(r,d){const cols=3+Math.floor(r()*3),gs=[];
 for(let c=0;c<cols;c++){if(d>1&&r()<0.45){const a=Math.floor(r()*d);let b=Math.floor(r()*(d-1));if(b>=a)b++;gs.push({name:'CNOT',wires:[a,b]})}else gs.push({name:['H','X','Z'][Math.floor(r()*3)],wires:[Math.floor(r()*d)]})}
 const n=1<<d, b=(i,w)=>(i>>(d-1-w))&1, little={H:HM,X:[[0,1],[1,0]],Z:[[1,0],[0,-1]],CNOT:CNM};
 let M=null;for(const G of gs){const E=zeros(n),ws=G.wires;for(let i=0;i<n;i++)for(let j=0;j<n;j++){if([...Array(d).keys()].every(w=>ws.includes(w)||b(i,w)==b(j,w)))E[i][j]=little[G.name][ws.reduce((s,w)=>s*2+b(i,w),0)][ws.reduce((s,w)=>s*2+b(j,w),0)]}
  M=M?mmul(M,tr(E)):tr(E)}
 return{gs,M,n}}
function swarm(key,seed,keep,dt0,dec,s0){if(swCache[key])return swCache[key];const r=rngS(seed);
 const out=[],boxes=keep.map(b=>b.slice());let t=0,s=s0;
 for(let k=0;k<500&&s>=6;k++,s*=0.982){const d=s>=14?2+Math.floor(r()*3):2+Math.floor(r()*2),mc=miniCircuit(r,d);
  const cw=(mc.gs.length+1)*s*1.3, h=(d-1)*s+s*1.2, ms=h/mc.n, w=cw+s*0.8+h, pad=Math.max(7,s*0.4);let ok=null;
  for(let tr2=0;tr2<300&&!ok;tr2++){const x=20+r()*(W-40-w),y=20+r()*(H-40-h);if(boxes.every(([x1,y1,x2,y2])=>x+w+pad<x1||x>x2+pad||y+h+pad<y1||y>y2+pad))ok=[x,y]}
  if(!ok)continue;
  out.push({t,x:ok[0],y:ok[1],w,h,s,d,cw,ms,...mc,per:2+r()*1.5,ph:r()});boxes.push([ok[0],ok[1],ok[0]+w,ok[1]+h]);t+=Math.max(0.06,dt0*Math.pow(dec,out.length))}
 return swCache[key]=out}
function mini(e,q,a){if(a<=0||q<0)return;const{x,y,s,d,gs,M,n,cw,ms}=e,aIn=eo(q/0.4),y0=y+s*0.6,gx=c=>x+(c+0.9)*s*1.3;
 const cyc=((q+e.ph*e.per)%e.per)/e.per, cur=x+cyc*cw;
 g.save();g.globalAlpha*=a*aIn;
 for(let w=0;w<d;w++){g.strokeStyle=WC[w%3];g.globalAlpha=a*aIn*0.7;g.lineWidth=Math.max(1,s*0.07);g.beginPath();g.moveTo(x,y0+w*s);g.lineTo(x+cw,y0+w*s);g.stroke()}
 g.globalAlpha=a*aIn;
 gs.forEach((G,c)=>{const X=gx(c),near=Math.max(0,1-Math.abs(cur-X)/(s*0.8));g.strokeStyle=mix('#7d8b99','#ffffff',near);g.fillStyle=mix(C.panel,'#3a4a5a',near);g.lineWidth=Math.max(1,s*0.06);
  if(G.name=='CNOT'){const yc=y0+G.wires[0]*s,yt=y0+G.wires[1]*s,r=s*0.24;g.beginPath();g.moveTo(X,yc);g.lineTo(X,yt);g.stroke();g.beginPath();g.arc(X,yc,s*0.1,0,7);g.fillStyle=g.strokeStyle;g.fill();g.beginPath();g.arc(X,yt,r,0,7);g.stroke()}
  else{const yy=y0+G.wires[0]*s,b=s*0.62;rr(X-b/2,yy-b/2,b,b,b*0.18);g.fill();g.stroke();if(s>=16)txt(G.name,X,yy+1,s*0.4,'#e8eef4','center','bold')}});
 // the matrix: bright = big entry; gold = positive, pink = negative. It glows as the cursor finishes the diagram
 const mx=x+cw+s*0.8, my=y, gl=0.55+0.45*Math.max(0,1-Math.abs(cyc-0.97)*6);
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){const v=M[i][j];if(Math.abs(v)<1e-9){if(ms>=6){g.fillStyle='#ffffff10';g.fillRect(mx+j*ms+0.5,my+i*ms+0.5,ms-1,ms-1)}continue}
  g.globalAlpha=a*aIn*Math.abs(v)*gl;g.fillStyle=v>0?C.gold:C.q;g.fillRect(mx+j*ms+0.5,my+i*ms+0.5,ms-1,ms-1)}
 g.restore()}
const hits=(e,[x1,y1,x2,y2])=>!(e.x+e.w<x1||e.x>x2||e.y+e.h<y1||e.y>y2);
function swarmDraw(list,t0,a,dimBox,dimK){if(a<=0)return;for(const e of list){const q=tt-t0-e.t;if(q<0)break;mini(e,q,a*(dimK>0&&hits(e,dimBox)?1-0.88*dimK:1))}}
// ---------- the main stage (same as last video): vector row bottom-left, matrix up-right, result row under the matrix ----------
const CS=62, SX=600, GQ=24, MX=SX+N*CS+GQ, MY=196, VY=MY+N*CS+GQ, LY=VY+CS+24;
const vX=i=>SX+i*CS, wX=j=>MX+j*CS, rowY=k=>MY+k*CS;
const LP=70, FD=0.8, PD=1.2;
const SW1=swarm('in',20261025,[FACE,[W/2-700,30,W/2+700,215]],0.7,0.93,30);
const ENDBOX=[W/2-640,250,W/2+560,720];
const SW2=swarm('out',777,[FACE,ENDBOX],0.2,0.93,26);
// timeline of the vector: appear / step (through matrix k) / reset
const MATS=[...MS,UT];
const TL=(()=>{const l5=LK('three wires'),l9=LK('one after another'),l11=LK('all together');
 const s1=S[l9]+0.3, s2=s1+FD+PD+0.7, s3=s2+FD+PD+0.7;
 return[{t:at(l5,0.55),k:'appear',v:V0},{t:s1,k:'step',vin:V0,vout:V1,M:0},{t:s2,k:'step',vin:V1,vout:V2,M:1},{t:s3,k:'step',vin:V2,vout:V3,M:2},
  {t:at(l11,0.1),k:'appear',v:V0},{t:at(l11,0.45),k:'step',vin:V0,vout:VU,M:3}]})();
const STEPT=TL.filter(e=>e.k=='step').map(e=>e.t);
function vecState(t){let R=null,Top=null,fly=null,prop=null;
 for(const e of TL){if(e.t>t)break;const q=t-e.t;
  if(e.k=='appear'){fly=null;Top=Top&&q<0.3?{...Top,a:Top.a*(1-q/0.3)}:{v:e.v,a:ease((q-0.3)/0.4)};R=R&&q<0.4?{...R,a:R.a*(1-q/0.4)}:null}
  else{if(q<FD){fly=null;if(R){fly={v:R.v,u:ease(q/FD)};if(Top)Top={...Top,a:Top.a*(1-ease(q/FD*1.6))};R=null}}
   else{fly=null;Top={v:e.vin,a:1};R=q>FD+PD*0.62?{v:e.vout,a:ease((q-FD-PD*0.62)/0.35)}:null;prop=q<FD+PD+0.4?{e,u:(q-FD)/PD}:null}}}
 return{R,Top,fly,prop}}
// which big matrix is showing: M₁ (built by copying in), then each step's, then the product
function matShown(t){const st=TL.filter(e=>e.k=='step');let k=0,p=0,since=99;
 st.forEach((e,n)=>{if(t>=e.t){p=n?st[n-1].M:0;k=e.M;since=t-e.t}});return{k,p,a:k==p?1:ease(since/0.6)}}
function scMain(){
 const l4=LK('back of your mind'),l5=LK('three wires'),l6=LK('its own little'),l7=LK('copy it in'),l8=LK('leaves the other'),l9=LK('one after another'),
  l10=LK('same order'),l11=LK('all together'),l12=LK('compact way');
 const out=1-ev(l12,0,0.8);if(out<=0)return;g.save();g.globalAlpha*=out;
 const st=vecState(tt), mIn=ev(l7,0,0.6), ms=matShown(tt), pr=st.prop;
 // ---- the big matrix area: diagonal "mirror" with the state names, then the matrix ----
 if(mIn>0){g.save();g.globalAlpha*=mIn;g.setLineDash([10,10]);g.strokeStyle=C.dim;g.lineWidth=2;g.globalAlpha*=0.5;g.beginPath();g.moveTo(SX+8,MY+8);g.lineTo(SX+N*CS-8,MY+N*CS-8);g.stroke();g.restore();
  for(let k=0;k<N;k++){const X=vX(k)+CS/2,Y=rowY(k)+CS/2,hl=pairHL(k);g.save();g.globalAlpha*=mIn;rr(X-28,Y-15,56,30,8);g.fillStyle=hl>0?mix('#0d1620','#3a4a5a',hl):'#0d1620';g.fill();g.restore();
   sname(k,X,Y,22,mIn*(0.55+0.45*hl),'center',hl>0.5?'bold':'')}}
 // stamping: the little H's four entries fly into the big matrix, once per setting of the other two wires
 const stT=m=>at(l7,0.42)+m*0.6, stDone=stT(3)+0.6;
 const landed=(i,j)=>{for(const s of STAMPS)for(const c of s.cells)if(c.i==i&&c.j==j)return ease((tt-stT(s.o)-0.45)/0.15);return ease((tt-stDone)/0.5)};
 const litM=(i,j)=>{if(!pr||pr.u<0)return 0;const M=MATS[pr.e.M],w=Math.abs(M[i][j])*Math.abs(pr.e.vin[i]);if(w<1e-9)return 0;return Math.sqrt(w)*Math.max(0,1-Math.abs(pr.u-0.42-0.22*j/N)*4)};
 if(mIn>0){g.save();g.globalAlpha*=mIn;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const l=Math.max(litM(i,j),pairCell(i,j));cell(wX(j),rowY(i),CS,C.gold,{a:1,lit:l,ring:l*0.7});
   if(tt<STEPT[0]+FD)num(wX(j),rowY(i),CS,MATS[0][i][j],C.gold,landed(i,j));
   else{num(wX(j),rowY(i),CS,MATS[ms.k][i][j],C.gold,ms.a);if(ms.a<1)num(wX(j),rowY(i),CS,MATS[ms.p][i][j],C.gold,1-ms.a)}}
  brackets(MX,MY,N*CS,N*CS,C.gold,0.8);
  const lab=tt<STEPT[0]+FD?0:ms.k, la=tt<STEPT[0]+FD?1:ms.a;
  txt(['M₁  (H on the top wire)','M₂  (CNOT, top → middle)','M₃  (CNOT, middle → bottom)','M₁·M₂·M₃  (the whole diagram)'][lab],MX+N*CS/2,MY-46,34,C.gold,'center','bold',la);
  if(ms.a<1&&tt>=STEPT[0]+FD){const pk=ms.p;txt(['M₁  (H on the top wire)','M₂  (CNOT, top → middle)','M₃  (CNOT, middle → bottom)','M₁·M₂·M₃  (the whole diagram)'][pk],MX+N*CS/2,MY-46,34,C.gold,'center','bold',1-ms.a)}
  g.restore()}
 // the flying entries
 for(const s of STAMPS){const q=tt-stT(s.o);if(q<0||q>0.6)continue;const u=eo(q/0.45);
  for(const c of s.cells){const x0=LHX+c.c*LHS,y0=LHY+c.r*LHS,x1=wX(c.j),y1=rowY(c.i),x=lerp(x0,x1,u),y=lerp(y0,y1,u)-Math.sin(Math.PI*u)*60,sz=lerp(LHS,CS,u);
   cell(x,y,sz,C.q,{a:1,lit:0.5});num(x,y,sz,HM[c.r][c.c],'#fff',1)}}
 // ---- the vector (row, bottom-left) and the result (row, under the matrix) ----
 const vecIn=ev(l5,0.35,0.5);
 const hot=v=>v.findIndex(x=>Math.abs(x)>0.999);
 const hotT=st.Top&&st.Top.a>0.5?hot(st.Top.v):-1, hotR=st.R&&st.R.a>0.5?hot(st.R.v):-1;
 for(let i=0;i<N;i++){sname(i,vX(i)+CS/2,LY,24,ev(l5,0.15+0.05*i,0.3),'center',i==hotT?'bold':'');sname(i,wX(i)+CS/2,LY,24,mIn,'center',i==hotR?'bold':'')}
 for(let i=0;i<N;i++){cell(vX(i),VY,CS,C.gold,{a:vecIn*0.5,dash:1});cell(wX(i),VY,CS,C.gold,{a:mIn*0.5,dash:1})}
 const vec=(v,X,a)=>{for(let i=0;i<N;i++){cell(X(i),VY,CS,C.gold,{a});num(X(i),VY,CS,v[i],C.gold,a)}};
 if(st.Top)vec(st.Top.v,vX,st.Top.a);
 if(st.R)vec(st.R.v,wX,st.R.a);
 if(st.fly)vec(st.fly.v,i=>lerp(wX(i),vX(i),st.fly.u),1);
 if(pr&&pr.u>=0){const u=pr.u,f=1-cl((u-1)/0.4);
  for(let k=0;k<N;k++){const w=Math.abs(pr.e.vin[k]);if(w>1e-6)glowLine([[vX(k)+CS/2,VY],[vX(k)+CS/2,rowY(k)+CS/2],[MX+N*CS,rowY(k)+CS/2]],u*1.6,'#fff',0.8*Math.sqrt(w)*f*(1-cl((u-0.7)/0.3)),4)}
  for(let j=0;j<N;j++){const w=Math.abs(pr.e.vout[j]);if(w>1e-6)glowLine([[wX(j)+CS/2,MY],[wX(j)+CS/2,VY]],(u-0.5)*2,'#fff',0.85*Math.sqrt(w)*f,4)}}
 // ---- the left panel ----
 const P1=(s,y,a,sz=30,col=C.txt,wt='bold')=>txt(s,LP,y,sz,col,'left',wt,a);
 const a5=ev(l5,0.2,0.5)*(1-ev(l6,0,0.5));
 P1(`${NQ} wires → 2³ = ${N} states`,470,a5,34);
 rich([['the top wire is the ',C.dim,''],['first',WC[0],'bold'],[' bit, then ',C.dim,''],['second',WC[1],'bold'],[', ',C.dim,''],['third',WC[2],'bold']],LP,520,24,'left',a5);
 P1('every wire starts at 0: the state 000',570,ev(l5,0.55,0.5)*(1-ev(l6,0,0.5)),24,C.dim,'');
 // the little matrices
 const a6=ev(l6,0.15,0.5)*(1-ev(l8,0,0.5)), b6=ev(l6,0.55,0.5)*(1-ev(l7,0,0.5));
 littleH(a6);littleCNOT(b6);
 // copying in
 const a7=ev(l7,0.3,0.4)*(1-ev(l8,0,0.5));
 for(const s of STAMPS){const q=tt-stT(s.o), k=ease(q/0.25)*(1-ease((q-0.55)/0.2));if(k<=0||a7<=0)continue;
  rich([['middle, bottom wires = ',C.dim,''],[s.obits[0],WC[1],'bold'],[s.obits[1],WC[2],'bold']],LP,700,26,'left',k*a7);
  rich([['→ rows and columns ',C.dim,''],...[s.cells[0].i,s.cells[3].i].flatMap((i,n)=>[...(n?[[' and ',C.dim,'']]:[]),...BITS(i).split('').map((b,w)=>[b,WC[w],'bold'])])],LP,740,26,'left',k*a7)}
 if(NOTE_TENSOR)P1('(math name: the tensor product, H ⊗ I ⊗ I)',790,after(l7,0.1,0.6)*(1-ev(l8,0,0.5)),22,C.dim,'');
 // mixing pairs
 const a8=ev(l8,0.1,0.5)*(1-ev(l9,0,0.5));
 rich([['H only mixes ',C.txt,''],['0',WC[0],'bold'],['xy ↔ ',C.txt,''],['1',WC[0],'bold'],['xy',C.txt,'']],LP,470,30,'left',a8);
 P1('states that differ on the top wire only',515,a8,24,C.dim,'');
 P1('(a zero everywhere else)',550,a8,24,C.dim,'');
 // running it
 const a9=ev(l9,0.1,0.5)*(1-ev(l10,0,0.5));
 const nT=st.Top?norm(st.Top.v):1;
 P1(`length: ${nT.toFixed(3)}`,470,a9,28,C.dim,'');
 if(NOTE_LOOK){const n=after(l9,2.6,0.6)*(1-ev(l10,0,0.5));
  rich([['looking, we’d see ',C.dim,''],...BITS(0).split('').map((b,w)=>[b,WC[w],'bold']),[' or ',C.dim,''],...BITS(7).split('').map((b,w)=>[b,WC[w],'bold'])],LP,530,26,'left',n);
  P1(`each with probability ${PROB[0]===PROB[7]&&close(PROB[0],0.5)?'½':PROB[0].toFixed(2)}: the wires always agree`,568,n,24,C.dim,'')}
 // OPTIONAL: same order
 const a10=ev(l10,0.25,0.5)*(1-ev(l11,0,0.5));
 if(a10>0){const y=470;txt('v',LP+8,y,34,C.gold,'center','bold',a10);
  GATES.forEach((G,k)=>{const x=CX0+GX(k)*CSC,xp=k?CX0+GX(k-1)*CSC:LP+8;txt('·',lerp(xp,x,0.5),y,34,C.dim,'center','',a10);txt(`M${'₁₂₃'[k]}`,x,y,34,C.gold,'center','bold',a10)});
  P1('(with column vectors, it’s backwards: M₃·M₂·M₁·v)',525,ev(l10,0.6,0.5)*(1-ev(l11,0,0.5)),22,C.dim,'')}
 // all together
 const a11=ev(l11,0.3,0.5);
 rich([['v · (M₁·M₂·M₃)',C.gold,'bold']],LP,470,32,'left',a11);
 P1(`= the same result: ${close(norm(VU.map((x,i)=>x-V3[i])),0)?'✓':'✗'}`,515,ev(l11,0.7,0.5),26,C.dim,'');
 g.restore()}
// the little matrices, with their own state names (bits of THEIR wires)
const LHX=110, LHY=420, LHS=64, LCX=330, LCY=420, LCS=44;
function littleH(a){if(a<=0)return;for(let r=0;r<2;r++)for(let c=0;c<2;c++){cell(LHX+c*LHS,LHY+r*LHS,LHS,C.q,{a});num(LHX+c*LHS,LHY+r*LHS,LHS,HM[r][c],'#fff',a)}
 brackets(LHX,LHY,2*LHS,2*LHS,C.q,a);txt('H',LHX+LHS,LHY-34,30,C.q,'center','bold',a);
 for(let k=0;k<2;k++){txt(''+k,LHX-20,LHY+k*LHS+LHS/2,22,WC[0],'center','bold',a);txt(''+k,LHX+k*LHS+LHS/2,LHY+2*LHS+22,22,WC[0],'center','bold',a)}
 txt('2 × 2',LHX+LHS,LHY+2*LHS+58,22,C.dim,'center','',a)}
function littleCNOT(a){if(a<=0)return;for(let r=0;r<4;r++)for(let c=0;c<4;c++){cell(LCX+c*LCS,LCY+r*LCS,LCS,C.a,{a});num(LCX+c*LCS,LCY+r*LCS,LCS,CNM[r][c],'#fff',a)}
 brackets(LCX,LCY,4*LCS,4*LCS,C.a,a);txt('CNOT',LCX+2*LCS,LCY-34,30,C.a,'center','bold',a);
 for(let k=0;k<4;k++){const s=k.toString(2).padStart(2,'0');rich([[s[0],WC[0],'bold'],[s[1],WC[1],'bold']],LCX-24,LCY+k*LCS+LCS/2,18,'center',a)}
 txt('4 × 4',LCX+2*LCS,LCY+4*LCS+30,22,C.dim,'center','',a)}
// "leaves the other": cycle through H's four copies; light the cells and the state names
function pairPhase(){const l8=LK('leaves the other'),t0=at(l8,0.2),q=tt-t0;if(q<0||tt>E[l8]+SCRIPT[l8][2])return null;const m=Math.floor(q/0.9)%4;return{m,k:Math.sin(Math.PI*cl((q%0.9)/0.9))}}
function pairCell(i,j){const p=pairPhase();if(!p)return 0;return STAMPS[p.m].cells.some(c=>c.i==i&&c.j==j)?p.k*0.8:0}
function pairHL(k){const p=pairPhase();if(!p)return 0;return STAMPS[p.m].cells.some(c=>c.i==k)?p.k:0}
// the circuit's place: big in the middle while we introduce it, then small, top-left
const CX0=110, CY0=170, CSC=1;
function scCircuit(){const l2=LK('horizontal line'),l3=LK('exists physically'),l4=LK('back of your mind'),l9=LK('one after another'),l10=LK('same order'),l11=LK('all together'),l12=LK('compact way');
 const a=ev(l2,0,0.5)*(1-ev(l12,0,0.8)), mv=ev(l4,0.7,1.2), sc=lerp(1.7,CSC,mv), x0=lerp(W/2-CW*1.7/2+20,CX0,mv), y0=lerp(H/2-CG*1.7+10,CY0,mv);
 if(a<=0)return;
 // which gate is running: the cursor sits on it during its step
 const sT=TL.filter(e=>e.k=='step');let cur=null,curA=0,lit=k=>0;
 for(let n=0;n<3;n++){const q=tt-sT[n].t;if(q>-0.2&&q<FD+PD+0.5){cur=GX(n);curA=ease((q+0.2)/0.3)*(1-ease((q-FD-PD)/0.4));const n0=n;lit=k=>k==n0?curA:0}}
 if(tt>sT[3].t-0.3){const q=tt-sT[3].t;cur=null;lit=k=>ease((q+0.3)/0.4)*(1-ease((q-FD-PD)/0.5))}
 circuit(x0,y0,sc,{a,draw:ease((tt-at(l2,0.15))/1.2),gates:k=>ev(l2,0.45+0.12*k,0.4),kets:ev(l2,0.3,0.5),cursor:cur,curA,lit,
  labels:k=>ev(l9,0,0.5)*(1-ev(l12,0,0.5))*0.9});
 // time flows left to right
 const ta=ev(l3,0.5,0.6)*(1-ev(l4,0.6,0.5));
 if(ta>0){const yA=y0+(NQ-1)*CG*sc+70;g.save();g.globalAlpha*=ta;g.strokeStyle=C.dim;g.lineWidth=3;g.beginPath();g.moveTo(x0+20,yA);g.lineTo(x0+CW*sc-20,yA);g.stroke();
  g.fillStyle=C.dim;g.beginPath();g.moveTo(x0+CW*sc-6,yA);g.lineTo(x0+CW*sc-26,yA-10);g.lineTo(x0+CW*sc-26,yA+10);g.fill();g.restore();txt('time',x0+CW*sc/2,yA+30,28,C.dim,'center','',ta)}
 txt('one line per qubit',x0+CW*sc/2,y0-90,34,C.txt,'center','bold',ev(l2,0.25,0.5)*(1-ev(l3,0,0.5)));
 txt('gates: where qubits interact',x0+CW*sc/2,y0-90,34,C.txt,'center','bold',ev(l2,0.7,0.5)*(1-ev(l3,0,0.5))*0);
 txt('→  vector × matrix',x0+CW*sc+40,y0+CG*sc,40,C.gold,'left','bold',ev(l4,0.35,0.5)*(1-ev(l4,0.75,0.4)));
 // the whole diagram = one matrix
 const b=ev(l11,0.2,0.5)*(1-ev(l12,0,0.5));
 if(b>0){g.save();g.globalAlpha*=b;g.strokeStyle=C.gold;g.lineWidth=3;g.setLineDash([8,7]);rr(x0+GX(0)*sc-48,y0-46,GX(2)*sc-GX(0)*sc+96,(NQ-1)*CG*sc+122,14);g.stroke();g.restore()}}
function scIntro(){const l1=LK('usually draw'),a=1-ev(LK('horizontal line'),0,0.6);if(a<=0)return;
 txt('from circuit diagrams',W/2,90,66,C.txt,'center','bold',ev(l1,0.05,0.7)*a);
 txt('to  vector × matrix',W/2,165,52,C.gold,'center','bold',ev(l1,0.45,0.6)*a)}
function scEnd(){const l12=LK('compact way'),k=ev(l12,0.1,0.7),k2=ev(l12,0.5,0.7),k3=after(l12,0.3,0.7),cxm=(ENDBOX[0]+ENDBOX[2])/2;
 txt('a circuit diagram is a compact way',cxm,330,54,C.txt,'center','bold',k);txt('to write down a giant matrix',cxm,396,54,C.txt,'center','bold',k);
 txt(`n wires  →  a 2ⁿ × 2ⁿ matrix`,cxm,500,44,C.gold,'center','bold',k2);
 txt(`(300 wires: 2³⁰⁰ ≈ ${BIGM.toFixed(1)}·10⁹⁰ rows)`,cxm,566,30,C.dim,'center','',k2);
 txt('each gate: copy its little matrix in; then multiply them, left to right',cxm,640,28,C.dim,'center','',k3);
 if(NOTE_NEXT)txt('next: the double-slit experiment?',cxm,700,30,C.txt,'center','',after(l12,1.2,0.8))}
function drawFrame(t){tt=t;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;const grd=g.createRadialGradient(W/2,H*0.45,200,W/2,H/2,1200);grd.addColorStop(0,'#131f2c');grd.addColorStop(1,'#070c12');g.fillStyle=grd;g.fillRect(0,0,W,H);
 const l1=LK('usually draw'),l2=LK('horizontal line'),l12=LK('compact way');
 const dive=ev(l2,0,0.9);
 if(dive<1){g.save();const z=1+0.35*dive;g.translate(W/2,H/2);g.scale(z,z);g.translate(-W/2,-H/2);
  swarmDraw(SW1,0.2,1-dive,[W/2-700,30,W/2+700,215],ev(l1,0.05,0.7));g.restore()}
 if(tt>S[l12])swarmDraw(SW2,S[l12]+0.3,0.8,null,0);
 scIntro();
 scCircuit();
 if(t>S[LK('three wires')]-1)scMain();
 scEnd();
 return cv}
// the booth's frames per line: [key, [start, middle, end anim times]]
const VK=SCRIPT.map(([k],i)=>[k,[S[i]+0.15,(S[i]+E[i])/2,E[i]+Math.min(0.3,SCRIPT[i][2])]]);
