// ---------- the cool animation: lots of little "vector × matrix" machines, classical ones (a 1 hopping) and quantum ones (arrows) ----------
function rngS(seed){let s=seed%2147483647||1;return()=>(s=(s*16807)%2147483647)/2147483647}
const FACE=[1650,815,1920,1080];                                      // the webcam circle's corner: always kept free
C.q='#ff6b9a'; C.bad='#ff5d5d';
const swCache={};
// a random d×d unitary: layers of 2×2 rotations (with a phase) on random pairs of states; or a random permutation (classical)
function randMachine(r,d,classical){const Z=()=>[...Array(d)].map(()=>[...Array(d)].map(()=>cx(0)));let M=Z();
 if(classical){const p=[...Array(d).keys()];for(let i=d-1;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}
  if(p.every((v,i)=>v==i))p.push(p.shift());p.forEach((to,from)=>M[to][from]=cx(1));return M}
 M=M.map((row,i)=>row.map((_,j)=>cx(i==j?1:0)));
 for(let L=0;L<d*2;L++){const a=Math.floor(r()*d);let b=Math.floor(r()*(d-1));if(b>=a)b++;const th=r()*Math.PI,ph=r()*2*Math.PI,c=Math.cos(th),s=Math.sin(th),e=[Math.cos(ph),Math.sin(ph)];
  const ra=M[a].slice(),rb=M[b].slice();
  for(let j=0;j<d;j++){M[a][j]=cadd(ra[j].map(x=>x*c),cmul(e,rb[j]).map(x=>-x*s));M[b][j]=cadd(ra[j].map(x=>x*s),cmul(e,rb[j]).map(x=>x*c))}}
 return M}
const mvd=(A,v)=>A.map(r=>r.reduce((s,x,k)=>cadd(s,cmul(x,v[k])),cx(0)));
// keep: boxes to stay out of; dt0/dec: first gap between arrivals and how fast the gaps shrink
function swarm(key,seed,keep,dt0,dec,s0){if(swCache[key])return swCache[key];const r=rngS(seed);
 const out=[],boxes=keep.map(b=>b.slice());let t=0,s=s0;
 for(let k=0;k<500&&s>=7;k++,s*=0.985){const opts=s>=26?[2,4,4,8]:s>=12?[2,4,4]:[2,2,4];let d=opts[Math.floor(r()*opts.length)];if(k==0)d=4;
  const gb=Math.max(3,s*0.3),w=(d+1)*s+gb,h=(d+1)*s+gb,pad=Math.max(7,s*0.35);let ok=null;
  for(let tr=0;tr<300&&!ok;tr++){const x=20+r()*(W-40-w),y=20+r()*(H-40-h);
   if(boxes.every(([x1,y1,x2,y2])=>x+w+pad<x1||x>x2+pad||y+h+pad<y1||y>y2+pad))ok=[x,y]}
  if(!ok)continue;
  const classical=r()<0.4, M=randMachine(r,d,classical), V=[onehotD(d,Math.floor(r()*d))];
  for(let i=0;i<12;i++)V.push(mvd(M,V[i]));
  out.push({t,x:ok[0],y:ok[1],w,h,s,gb,d,M,V,classical,per:1.5+r()*1.2,ph:r()});
  boxes.push([ok[0],ok[1],ok[0]+w,ok[1]+h]);t+=Math.max(0.06,dt0*Math.pow(dec,out.length))}
 return swCache[key]=out}
function onehotD(d,k){return[...Array(d)].map((_,i)=>cx(i==k?1:0))}
// one value in a cell: a little complex plane (arrow = the number), or the digit 0/1 when dig = 1
function val(x,y,s,z,col,a=1,dig=0){if(a<=0)return;const m=cabs(z),R=s*0.4,X=x+s/2,Y=y+s/2;g.save();g.globalAlpha*=a;
 if(dig<1){const k=1-dig;
  if(s>=16){g.globalAlpha*=1;g.strokeStyle=col;g.lineWidth=Math.max(1,s*0.018);g.save();g.globalAlpha*=0.22*k;g.beginPath();g.arc(X,Y,R,0,7);g.stroke();g.restore()}
  if(m>1e-6){const th=carg(z),ex=X+R*m*Math.cos(th),ey=Y-R*m*Math.sin(th),hw=Math.min(s*0.13,R*m*0.55);
   g.save();g.globalAlpha*=k;g.strokeStyle=col;g.fillStyle=col;g.lineWidth=Math.max(1.3,s*0.05);g.lineCap='round';
   g.beginPath();g.moveTo(X,Y);g.lineTo(ex-hw*0.8*Math.cos(th),ey+hw*0.8*Math.sin(th));g.stroke();
   if(s>=12){g.beginPath();g.moveTo(ex,ey);g.lineTo(ex-hw*Math.cos(th)+hw*0.6*Math.sin(th),ey+hw*Math.sin(th)+hw*0.6*Math.cos(th));g.lineTo(ex-hw*Math.cos(th)-hw*0.6*Math.sin(th),ey+hw*Math.sin(th)-hw*0.6*Math.cos(th));g.closePath();g.fill()}
   g.restore()}}
 if(dig>0){const one=m>0.5;
  if(s>=16)txt(one?'1':'0',X,Y+s*0.03,s*(one?0.5:0.36),one?col:C.dim,'center',one?'bold':'',dig*(one?1:0.45));
  else if(one){g.save();g.globalAlpha*=dig;g.fillStyle=col;g.fillRect(X-s*0.25,Y-s*0.25,s*0.5,s*0.5);g.restore()}}
 g.restore()}
// a little machine, q seconds after it arrived: the matrix and the vector pop in, then step after step the result comes out on the right and swings up
const close=(a,b,e=1e-9)=>Math.abs(a-b)<e;
const bez=(p0,pc,p1,u)=>(1-u)*(1-u)*p0+2*u*(1-u)*pc+u*u*p1;
function mini(e,q,a){if(a<=0||q<0)return;const{x,y,s,gb,d,M,V}=e,col=e.classical?C.gold:C.q;
 const tx=c=>x+c*s, my=r=>y+s+gb+r*s, rx=x+d*s+gb;
 const aIn=eo(q/0.3), st0=0.6+e.ph*0.6, k=Math.max(0,Math.floor((q-st0)/e.per)), u=q<st0?-1:(q-st0)/e.per-k;
 const vin=V[k%12], vout=V[k%12+1], dig=e.classical?1:0;
 g.save();g.globalAlpha*=a;
 for(let r=0;r<d;r++)for(let c=0;c<d;c++){const lit=u>0.05&&u<0.6?cabs(M[r][c])*cabs(vin[c])*Math.sin(Math.PI*cl((u-0.05)/0.55)):0;
  if(s>=10)cell(tx(c),my(r),s,C.a,{a:aIn*0.9,lit});val(tx(c),my(r),s,M[r][c],C.a,aIn,dig)}
 const fl=u>0.72?eo((u-0.72)/0.28):0;
 for(let c=0;c<d;c++){if(s>=10)cell(tx(c),y,s,col,{a:aIn*(1-fl)});val(tx(c),y,s,vin[c],col,aIn*(1-fl),dig)}
 const rin=u>0.4?ease((u-0.4)/0.2):0;
 for(let r=0;r<d;r++){const X=bez(rx,rx,tx(r),fl),Y=bez(my(r),y,y,fl);if(rin>0){if(s>=10)cell(X,Y,s,col,{a:rin});val(X,Y,s,vout[r],col,rin,dig)}}
 g.restore()}
const hits=(e,[x1,y1,x2,y2])=>!(e.x+e.w<x1||e.x>x2||e.y+e.h<y1||e.y>y2);
function swarmDraw(list,t0,a,dimBox,dimK){if(a<=0)return;for(const e of list){const q=tt-t0-e.t;if(q<0)break;mini(e,q,a*(dimK>0&&hits(e,dimBox)?1-0.88*dimK:1))}}
// ---------- the main stage: the vector on top (one cell per state), the matrix under it, the result on the right ----------
const CS=74, MX=650, MY=290, TY=MY-CS-24, RX=MX+N*CS+24;
const TXc=j=>MX+j*CS, MYr=i=>MY+i*CS, LBX=RX+CS+18, VTX=LBX+78;
const FD=0.8, PD=1.0;                                        // a step: the result swings up (FD s), then the new one is computed (PD s)
const TAPEX=96, TAPEY=226, TCS=96;                           // the small tape, top-left
const LP=70;                                                 // the left panel's text margin
const SW1=swarm('in',20261024,[FACE,[W/2-640,30,W/2+640,200]],0.8,0.93,92);
const ENDBOX=[W/2-560,250,W/2+480,700];
const SW2=swarm('out',4242,[FACE,ENDBOX,[W/2-760,880,W/2+600,1010]],0.25,0.93,60);
// the story's timeline of vectors: appear / step (through P or U) / morph / collapse
const L_=k=>LK(k);
const TL=(()=>{const l6=L_('except a single'),l7=L_('giant square matrix'),l8=L_('relax the'),l9=L_('complex too'),l10=L_('also require'),l12=L_('when we look'),l13=L_('sort of the turing');
 return[{t:at(l6,0.15),k:'appear',v:V0},
  {t:at(l7,0.3),k:'step',vin:V0,vout:V1,M:'P'},{t:E[l7]+0.35,k:'step',vin:V1,vout:V2,M:'P'},
  {t:at(l8,0.42),k:'morph',from:V2,to:VR,d:1.4},{t:at(l9,0.12),k:'morph',from:VR,to:VC,d:1.2},
  {t:at(l10,0.25),k:'step',vin:VC,vout:Q1,M:'U'},{t:E[l10]+0.3,k:'step',vin:Q1,vout:Q2,M:'U'},
  {t:at(l12,0.62),k:'morph',from:Q2,to:VS,d:0.7},
  {t:at(l13,0.2),k:'step',vin:VS,vout:Q3,M:'U'},{t:E[l13]+0.25,k:'step',vin:Q3,vout:Q4,M:'U'}]})();
const isHot=v=>v.every(z=>cabs(z)<1e-9||Math.abs(cabs(z)-1)<1e-9);
function mixV(a,b,u){const w=a.map((z,i)=>[lerp(z[0],b[i][0],u),lerp(z[1],b[i][1],u)]),n=norm(w);return w.map(z=>[z[0]/n,z[1]/n])}
function vecState(t){let R=null,Top=null,fly=null,prop=null;
 for(const e of TL){if(e.t>t)break;const q=t-e.t;
  if(e.k=='appear')R={v:e.v,a:ease(q/0.5),dig:1};
  else if(e.k=='morph'){const u=ease(q/e.d),d0=isHot(e.from)?1:0,d1=isHot(e.to)?1:0;R={v:mixV(e.from,e.to,u),a:1,dig:lerp(d0,d1,u),since:q-e.d};if(Top)Top={...Top,a:Top.a*(1-ease(q/0.6))}}
  else{const dg=isHot(e.vin)?1:0;
   if(q<FD){fly={v:e.vin,u:ease(q/FD),dig:dg};if(Top)Top={...Top,a:Top.a*(1-ease(q/FD*1.6))};R=null}
   else{fly=null;Top={v:e.vin,a:1,dig:dg};R=q>FD+PD*0.62?{v:e.vout,a:ease((q-FD-PD*0.62)/0.35),dig:isHot(e.vout)?1:0}:null;prop=q<FD+PD+0.4?{e,u:(q-FD)/PD}:null}}}
 return{R,Top,fly,prop}}
// the exact values we can write out: 0, ±1, ±½, ±½i
function fmt(z){const f=x=>Math.abs(x-1)<1e-9?'1':Math.abs(x+1)<1e-9?'−1':Math.abs(x-0.5)<1e-9?'½':Math.abs(x+0.5)<1e-9?'−½':Math.abs(x)<1e-9?'0':null;
 if(Math.abs(z[1])<1e-9)return f(z[0]);if(Math.abs(z[0])<1e-9){const s=f(z[1]);return s==null?null:s=='1'?'i':s=='−1'?'−i':s+'i'}return null}
function tapeBits(t){let k=K0,lit=1;for(const e of TL){if(e.t>t)break;const q=t-e.t;if(e.k=='step'&&q>FD+PD*0.62&&isHot(e.vout))k=e.vout.findIndex(z=>cabs(z)>0.5);if(e.k=='morph'&&q>e.d*0.6&&isHot(e.to))k=e.to.findIndex(z=>cabs(z)>0.5)}
 return BITS(k)}
function glowLine(pts,u,col,a=1,w=6){if(a<=0||u<=0)return;let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
 let left=L*cl(u),X=pts[0][0],Y=pts[0][1];g.save();g.globalAlpha*=a;g.shadowColor=col;g.shadowBlur=18;g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(X,Y);
 for(let i=1;i<pts.length&&left>0;i++){const k=Math.min(1,left/seg[i-1]);X=lerp(pts[i-1][0],pts[i][0],k);Y=lerp(pts[i-1][1],pts[i][1],k);g.lineTo(X,Y);left-=seg[i-1]}
 g.stroke();g.restore();glowDot(X,Y,w*1.4,'#fff',a)}
function scMain(){
 const l5=LK('could possibly be in'),l6=LK('except a single'),l7=LK('giant square matrix'),l8=LK('relax the'),l9=LK('complex too'),l10=LK('also require'),
  l11=LK('called unitary'),l12=LK('when we look'),l13=LK('sort of the turing'),l14=LK('boils down');
 const out=1-ev(l14,0,0.8);if(out<=0)return;g.save();g.globalAlpha*=out;
 const st=vecState(tt);
 // the matrix: P (digits) morphing into U (arrows) in "also require"; dimmed while we talk about the vector
 const mIn=ev(l7,0.12,0.7), mK=ev(l10,0.0,0.9), dimM=lerp(1,0.2,ev(l8,0,0.6)*(1-ev(l10,0,0.6))), dimV=lerp(1,0.25,ev(l11,0,0.5)*(1-ev(l12,0,0.5)));
 const pr=st.prop, ME=pr?pr.e:null;
 const litM=(i,j)=>{if(!pr||pr.u<0)return 0;const u=pr.u,M=ME.M=='P'?P:U,w=cabs(M[i][j])*cabs(ME.vin[j]);if(w<1e-9)return 0;
  const yi=(MYr(i)+CS/2-MY)/(N*CS), xi=(TXc(j)+CS/2-MX)/(RX-MX);
  if(ME.M=='P')return cl((u*2-yi*0.9)/0.15)*(1-cl((u-1)/0.3));
  return Math.sqrt(w)*Math.max(0,1-Math.abs(u*2-yi-xi*0.5)*2.2)};
 if(mIn>0){g.save();g.globalAlpha*=mIn*dimM*dimV;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const l=litM(i,j);cell(TXc(j),MYr(i),CS,C.a,{a:1,lit:l,ring:l*0.8});
   val(TXc(j),MYr(i),CS,P[i][j],C.a,1-mK,1);val(TXc(j),MYr(i),CS,U[i][j],C.a,mK,0)}
  brackets(MX,MY,N*CS,N*CS,C.a,0.8);
  txt('M',MX-46,MY+N*CS/2,58,C.a,'center','bold',1-mK);txt('U',MX-46,MY+N*CS/2,58,C.a,'center','bold',mK);
  g.restore()}
 // state names: along the right (first), and along the top (with the matrix)
 const hotR=st.R&&st.R.dig>0.5?st.R.v.findIndex(z=>cabs(z)>0.5):-1, hotT=st.Top&&st.Top.dig>0.5?st.Top.v.findIndex(z=>cabs(z)>0.5):-1;
 for(let i=0;i<N;i++){const a=ev(l5,0.08+0.05*i,0.3);txt(BITS(i),LBX,MYr(i)+CS/2,30,i==hotR?C.gold:C.dim,'left',i==hotR?'bold':'',a*dimV);
  txt(BITS(i),TXc(i)+CS/2,TY-26,24,i==hotT?C.gold:C.dim,'center',i==hotT?'bold':'',mIn*dimV)}
 const vec=(v,X,Y,a,dig)=>{for(let i=0;i<N;i++){const x=X(i),y=Y(i);cell(x,y,CS,C.gold,{a:a});val(x,y,CS,v[i],C.gold,a,dig)}};
 // the right column: empty slots appear with the list of states, then the vector
 const slots=ev(l6,0,0.5);
 for(let i=0;i<N;i++)cell(RX,MYr(i),CS,C.gold,{a:slots*0.5*dimV,dash:1});
 if(st.R){vec(st.R.v,()=>RX,i=>MYr(i),st.R.a*dimV,st.R.dig);
  // the exact values, written out, while there's something nice to write
  if(st.R.dig==0&&st.R.since!=null&&st.R.v.every(z=>fmt(z)!=null)){const k=ease(st.R.since/0.4);
   st.R.v.forEach((z,i)=>{const s=fmt(z);if(s&&s!='0')txt(s,VTX,MYr(i)+CS/2,32,C.gold,'left','bold',k*st.R.a*(1-ev(l10,0,0.4)))})}}
 if(st.Top)vec(st.Top.v,j=>TXc(j),()=>TY,st.Top.a*dimV,st.Top.dig);
 if(st.fly){const u=st.fly.u;for(let i=0;i<N;i++){const x=bez(RX,RX,TXc(i),u),y=bez(MYr(i),TY,TY,u);cell(x,y,CS,C.gold,{a:dimV});val(x,y,CS,st.fly.v[i],C.gold,dimV,st.fly.dig)}}
 // the computing light: classical = the 1 drops down its column to the matrix's 1, then goes right; quantum = every column, then every row
 if(pr&&pr.u>=0){const u=pr.u,f=1-cl((u-1)/0.4);
  if(ME.M=='P'){const j=ME.vin.findIndex(z=>cabs(z)>0.5),i=STEP(j),X=TXc(j)+CS/2;
   glowLine([[X,TY+CS],[X,MYr(i)+CS/2],[RX,MYr(i)+CS/2]],u*1.05,'#fff',0.9*f,6)}
  else{for(let j=0;j<N;j++){const w=cabs(ME.vin[j]);if(w>1e-6)glowLine([[TXc(j)+CS/2,TY+CS],[TXc(j)+CS/2,MY+N*CS]],u*2,'#fff',0.75*w*f*(1-cl((u-0.5)/0.3)),4)}
   for(let i=0;i<N;i++){const w=cabs(ME.vout[i]);if(w>1e-6)glowLine([[MX,MYr(i)+CS/2],[RX,MYr(i)+CS/2]],(u-0.35)*1.6,'#fff',0.85*Math.sqrt(w)*f,4)}}}
 // the small tape (top-left), and its link to the 1 in "except a single"
 // (the small tape itself is drawn by drawFrame: smallTape())
 const lk=ev(l6,0.55,0.5)*(1-ev(l7,0.1,0.5));
 if(lk>0){const k0=TL[0].v.findIndex(z=>z[0]>0.5),x1=TAPEX+NB*TCS+12,y1=TAPEY+TCS/2,x2=RX-10,y2=MYr(k0)+CS/2;
  g.save();g.globalAlpha*=lk;g.setLineDash([12,10]);g.strokeStyle=C.gold;g.lineWidth=3;g.beginPath();g.moveTo(x1,y1);g.bezierCurveTo(x1+300,y1,x2-300,y2,x2,y2);g.stroke();g.restore()}
 // ---- the left panel ----
 const P1=(s,y,a,sz=34,col=C.txt,wt='bold')=>txt(s,LP,y,sz,col,'left',wt,a);
 const a5=ev(l5,0.55,0.5)*(1-ev(l6,0.6,0.5));
 P1(`${NB} cells → 2${'³'} = ${N} states`,430,a5,36);
 P1(`(300 cells: 2³⁰⁰ ≈ ${BIGM.toFixed(1)}·10${sup(BIGE)} states)`,480,a5,25,C.dim,'');
 const a6=ev(l6,0.7,0.5)*(1-ev(l7,0.1,0.5));
 P1('the 1 marks the current state',430,a6,30,C.gold);
 const a7=ev(l7,0.2,0.5)*(1-ev(l8,0,0.5));
 rich([['new vector = ',C.txt,'bold'],['M',C.a,'bold'],[' · vector',C.txt,'bold']],LP,430,34,'left',a7);
 const a7b=after(l7,0.2,0.6)*(1-ev(l8,0,0.5));
 rich([['M',C.a,'bold'],[': exactly one 1',C.txt,''],],LP,500,30,'left',a7b);P1('in every column',540,a7b,30,C.txt,'');
 P1('(this M adds 1: a binary counter)',600,a7b,24,C.dim,'');
 // relax: length 1 = the sum of the squares is 1
 const a8=ev(l8,0.45,0.6)*(1-ev(l9,0,0.5)), nz=VR.filter(z=>cabs(z)>1e-9).map(z=>fmt(z));
 P1('length 1:',430,a8,34);
 P1(nz.map(s=>s[0]=='−'?`(${s})²`:`${s}²`).join(' + ')+' = 1',490,a8,32,C.gold);
 P1(`(and the one-hot vector had length 1 too)`,550,a8,24,C.dim,'');
 const a9=ev(l9,0.6,0.5)*(1-ev(l10,0,0.5)), zi=VC.findIndex(z=>Math.abs(z[1])>0.1&&z[1]>0), z=VC[zi], zz=cmul(z,conj(z));
 rich([['|z|² = z · ',C.txt,'bold'],['z̄',C.q,'bold']],LP,430,40,'left',a9);
 P1(`(${fmt(z)})·(${fmt(conj(z))}) = ${close(zz[0],0.25)?'¼':zz[0].toFixed(3)}`,495,a9,32,C.gold);
 P1(`Σ |aᵢ|² = ${VC.filter(z=>cabs(z)>1e-9).map(z=>close(abs2(z),0.25)?'¼':abs2(z).toFixed(2)).join(' + ')} = 1`,560,after(l9,0.1,0.5)*(1-ev(l10,0,0.5)),32,C.gold);
 // the length stays 1 through the matrix
 const a10=ev(l10,0.3,0.5)*(1-ev(l11,0,0.4));
 const nIn=st.Top?norm(st.Top.v):norm(VC), nOut=st.R?norm(st.R.v):null;
 P1(`length in   = ${nIn.toFixed(3)}`,430,a10,34);
 P1(`length out = ${nOut==null?'…':nOut.toFixed(3)}`,485,a10,34,C.gold);
 P1('for every input vector',545,ev(l10,0.6,0.5)*(1-ev(l11,0,0.4)),26,C.dim,'');
 // OPTIONAL: unitary ⇒ reversible
 const a11=ev(l11,0.05,0.5)*(1-ev(l12,0,0.5)), b11=ev(l11,0.3,0.5)*(1-ev(l12,0,0.5)), c11=ev(l11,0.62,0.5)*(1-ev(l12,0,0.5));
 rich([['U',C.a,'bold'],[' is ',C.txt,''],['unitary',C.txt,'bold'],[':  U',C.txt,''],['†',C.txt,''],['U = I',C.txt,'']],LP,400,34,'left',a11);
 P1('so it can always be undone',448,a11,28,C.dim,'');
 P1('a classical step must be reversible:',520,b11,28,C.txt,'');
 P1('a permutation, one 1 in every row and column',560,b11,24,C.gold,'');
 P1('an erasing step (two states → one):',630,c11,26,C.dim,'');
 P1(`[1 1; 0 0]·(${EV.map(x=>x.toFixed(2)).join(', ')}) = (${EOUT.map(x=>x.toFixed(2)).join(', ')})`,668,c11,26,C.txt,'');
 P1(`length ${ELEN.toFixed(2)} ✗`,706,c11,26,C.bad,'bold');
 P1('fix: extra scratch tape (Bennett, 1973)',764,after(l11,0.0,0.5)*(1-ev(l12,0,0.5)),26,C.ok,'');
 // OPTIONAL: looking (the Born rule): probabilities |aᵢ|², they add up to 1, and one state is what we see
 const a12=ev(l12,0.12,0.5), bars=a12*(1-ev(l12,0.62,0.6)), seen=ev(l12,0.5,0.4)*(1-ev(l13,0,0.5));
 for(let i=0;i<N;i++){const p=PROB[i],w=p*360,y=MYr(i)+CS*0.3;if(bars<=0)break;
  g.save();g.globalAlpha*=bars;g.fillStyle=i==SEEN&&seen>0?C.gold:mix(C.gold,C.panel,0.45);rr(VTX,y,Math.max(3,w*eo(a12)),CS*0.4,5);g.fill();g.restore();
  txt(p.toFixed(2),VTX+w+12,y+CS*0.2,24,C.dim,'left','',bars)}
 const sum=PROB.reduce((s,p)=>s+p,0);
 P1('when we look, we see state i',430,a12*(1-ev(l13,0,0.5)),30);
 P1('with probability |aᵢ|²',475,a12*(1-ev(l13,0,0.5)),30,C.gold);
 P1(`they add up to ${sum.toFixed(3)}  ✓`,530,ev(l12,0.3,0.5)*(1-ev(l13,0,0.5)),26,C.dim,'');
 rich([['we see ',C.txt,''],[BITS(SEEN),C.gold,'bold'],[`  (probability ${PROB[SEEN].toFixed(2)})`,C.dim,'']],LP,600,30,'left',seen);
 // the end of the explanation
 const a13=ev(l13,0.35,0.6);
 P1('the Turing machine of',430,a13,40);P1('quantum computation',485,a13,40,C.gold);
 if(NOTE_GATES){const n=after(l13,0.1,0.6);
  P1('in practice, the giant matrix is a product',580,n,24,C.dim,'');P1('of small gates, each touching a few cells',614,n,24,C.dim,'');
  P1(`(this U is ${GATES.length} of them)`,648,n,24,C.dim,'')}
 g.restore()}
function sup(n){return(''+n).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')}
function smallTape(){const l8=LK('relax the'),l11=LK('called unitary'),l12=LK('when we look'),l13=LK('sort of the turing'),l14=LK('boils down');
 const a=lerp(1,0.25,ev(l8,0.3,0.8)*(1-ev(l12,0.62,0.5)))*lerp(1,0.25,ev(l13,0.15,0.5))*lerp(1,0.25,ev(l11,0,0.5)*(1-ev(l12,0,0.5)))*(1-ev(l14,0,0.8));
 drawSmallTape(tapeBits(tt),a)}
function drawSmallTape(bits,a){for(let c=0;c<NB;c++)cell(TAPEX+c*TCS,TAPEY,TCS,C.txt,{a,v:bits[c]});
 finger(TAPEX+TCS/2,TAPEY-4,Math.PI/2,a,0.7,C.gold)}
// the long tape: a strip of 0s and 1s with a head that moves and writes; at "tape is finite" all but 3 cells fly off and the 3 go top-left
const LT=29, LTS=88, LTY=560, LTX=c=>W/2-LTS*1.5+(c-13)*LTS;
const LBITS=(()=>{const r=rngS(31);return[...Array(LT)].map((_,c)=>c>=13&&c<16?BITS(K0)[c-13]:r()<0.5?'1':'0')})();
const HEADP=[13,14,15,16,17,16,15,14,13,12,11,10,11,12,13];
function scTape(){const l2=LK('long tape'),l3=LK('tape is finite'),l4=LK('rather funny way');
 const a=ev(l2,0,0.6), shrink=ev(l3,0.2,1.0), go=ev(l3,0.55,1.0);if(a<=0)return;
 const q=Math.max(0,tt-at(l2,0.15)), hp=Math.min(HEADP.length-1,Math.floor(q/0.45));
 const bits=LBITS.slice();for(let k=1;k<=hp;k++){const c=HEADP[k];if(c<13||c>15)bits[c]=bits[c]=='1'?'0':'1'}
 for(let c=0;c<LT;c++){const keep=c>=13&&c<16, x0=LTX(c), edge=1-cl((Math.abs(x0+LTS/2-W/2)-560)/380);
  if(!keep){const ca=a*edge*(1-shrink);if(ca>0)cell(x0,LTY+shrink*(c%2?200:-200),LTS,C.txt,{a:ca,v:bits[c]});continue}
  const x=lerp(x0,TAPEX+(c-13)*TCS,go), y=lerp(LTY,TAPEY,go), s=lerp(LTS,TCS,go);cell(x,y,s,C.txt,{a,v:bits[c]})}
 const hc=hp<HEADP.length-1||shrink<=0?HEADP[hp]:13, hx=lerp(LTX(hc)+LTS/2,TAPEX+TCS/2,go), hy=lerp(LTY-4,TAPEY-4,go);
 finger(hx,hy,Math.PI/2,a,0.7,C.gold);
 txt('a Turing machine',W/2,250,56,C.txt,'center','bold',ev(l2,0.3,0.6)*(1-ev(l3,0,0.5)));
 txt('a long tape of 0s and 1s, and a head that reads and writes',W/2,322,32,C.dim,'center','',ev(l2,0.55,0.6)*(1-ev(l3,0,0.5)));
 txt('a finite tape: 3 cells',W/2,250,48,C.txt,'center','bold',ev(l3,0.3,0.6)*(1-go))}
function scIntro(){const l1=LK('my understanding');
 txt('quantum computation',W/2,92,72,C.txt,'center','bold',ev(l1,0.12,0.7));
 txt('for someone who knows regular computation',W/2,166,40,C.gold,'center','',ev(l1,0.55,0.6))}
function scFunny(){const l4=LK('rather funny way'),l5=LK('could possibly be in');
 const a=ev(l4,0.1,0.5)*(1-ev(l5,0.3,0.5));
 txt('a step of computation,',LP,430,36,C.txt,'left','bold',a);txt('the funny way',LP,480,36,C.gold,'left','bold',a);
 if(NOTE_HEAD){const n=after(LK('tape is finite'),0.2,0.6)*(1-ev(l5,0.3,0.5));
  txt('(the head’s position and the machine’s own',LP,580,24,C.dim,'left','',n);txt('state can be written on the tape too)',LP,612,24,C.dim,'left','',n)}}
function scEnd(){const l14=LK('boils down'), k=ev(l14,0.1,0.7), k2=ev(l14,0.45,0.7), k3=after(l14,0.2,0.7);
 const cxm=(ENDBOX[0]+ENDBOX[2])/2;
 txt('any quantum computation',cxm,330,58,C.txt,'center','bold',k);txt('boils down to this:',cxm,398,58,C.txt,'center','bold',k);
 rich([['vector  ←  ',C.gold,'bold'],['U',C.a,'bold'],[' · vector',C.gold,'bold']],cxm,500,52,'center',k2);
 txt('(length 1 in, length 1 out)',cxm,566,30,C.dim,'center','',k2);
 txt('then look: you see state i with probability |aᵢ|²',cxm,640,30,C.dim,'center','',k3);
 if(CREDIT){const c=after(l14,1.2,0.8);
  rich([['related: ',C.dim],['Scott Aaronson',C.txt,'bold'],[', quantum mechanics as probability theory with the 2-norm (and complex numbers),',C.dim]],W/2-80,912,23,'center',c);
  rich([['Quantum Computing Since Democritus',C.txt,''],[', ch. 9  ·  quantum Turing machines: ',C.dim],['Deutsch 1985, Bernstein–Vazirani 1993',C.txt,'']],W/2-80,948,23,'center',c);
  rich([['reversible computation: ',C.dim],['Bennett 1973',C.txt,'']],W/2-80,984,23,'center',c)}}
function drawFrame(t){tt=t;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;const grd=g.createRadialGradient(W/2,H*0.45,200,W/2,H/2,1200);grd.addColorStop(0,'#131f2c');grd.addColorStop(1,'#070c12');g.fillStyle=grd;g.fillRect(0,0,W,H);
 const l1=LK('my understanding'), l2=LK('long tape'), l14=LK('boils down');
 const dive=ev(l2,0,0.9);
 if(dive<1){g.save();const z=1+0.35*dive;g.translate(W/2,H/2);g.scale(z,z);g.translate(-W/2,-H/2);
  swarmDraw(SW1,0.2,1-dive,[W/2-700,30,W/2+700,210],ev(l1,0.05,0.7));g.restore()}
 if(tt>S[l14])swarmDraw(SW2,S[l14]+0.3,0.8,null,0);
 g.save();g.globalAlpha=1-ev(l2,0,0.6);scIntro();g.restore();
 if(tt<S[LK('rather funny way')]){if(dive>0)scTape()}else smallTape();
 scFunny();
 if(t>S[LK('could possibly be in')]-1)scMain();
 scEnd();
 return cv}
// the booth's frames per line: [key, [start, middle, end anim times]]
const VK=SCRIPT.map(([k],i)=>[k,[S[i]+0.15,(S[i]+E[i])/2,E[i]+Math.min(0.3,SCRIPT[i][2])]]);
