// ---------- the stage ----------
const PA={x:70,y:100,w:510,h:340}, PB={x:1340,y:100,w:510,h:340};   // the two little worlds
const SHY=462, SHH=338, FS=21, IND=25, RY=i=>510+i*33;               // the two shelves, one row per line
const VALX=46, VERX=298;                                              // inside a shelf panel: the value column, then the version column
const SIDE={A:{P:PA},B:{P:PB}};
const EFS=19, EIND=21, EVALX=34, EVERX=250, ENVW=430;                // the change: a small shelf of its own
const EXA=PA.x+PA.w+22, EXB=PB.x-22-ENVW;
const lampX=P=>P.x+140, swXY=(P,i)=>[lampX(P)+(i-1)*46,P.y+312];
// rich text: segs = [[text, color, weight]], centered or left at x
function rich(segs,x,y,sz,al='center',a=1){const tws=segs.map(s=>{g.save();g.font=`${s[2]||''} ${sz}px ${FONT}`;const w=g.measureText(s[0]).width;g.restore();return w});
 let X=al=='center'?x-tws.reduce((p,q)=>p+q,0)/2:x;segs.forEach((s,i)=>{txt(s[0],X,y,sz,s[1]||C.txt,'left',s[2]||'',a);X+=tws[i]})}
// one value row: key in blue, value in white, a color dot after color values
function row(r,x,y,sz,a,col=C.txt){if(a<=0)return;const k=keyTxt(r),v=restTxt(r);mtxt(k,x,y,sz,C.key,a);mtxt(v,x+mw(k,sz),y,sz,col,a);
 if(r.kind=='leaf'&&COLS[r.val]){const dx=x+mw(k+v,sz)+sz*0.55;g.save();g.globalAlpha*=a;g.beginPath();g.arc(dx,y,sz*0.28,0,7);g.fillStyle=COLS[r.val];g.fill();g.restore()}}
// one version row: the same keys; a leaf's version is a number, an object's is [n, {…}]
const numCX=(r,x,sz,n)=>x+mw(r.key!=null?r.key+': ':'',sz)+(r.kind=='open'?mw('[',sz):0)+mw(''+n,sz)/2;
function verRow(r,x,y,sz,a,n0,n1,k=0,ring=0,pop=0){if(a<=0)return;
 if(r.kind=='close'){mtxt('}]',x,y,sz,C.dim,a);return}
 const kt=r.key!=null?r.key+': ':'';mtxt(kt,x,y,sz,C.key,a);let X=x+mw(kt,sz);
 if(r.kind=='open'){mtxt('[',X,y,sz,C.dim,a);X+=mw('[',sz)}
 const nw=mw(''+n1,sz),cx=X+nw/2;
 if(ring>0){g.save();g.globalAlpha*=a*ring;g.shadowColor=C.gold;g.shadowBlur=18;g.strokeStyle=C.gold;g.lineWidth=2.5;g.beginPath();g.arc(cx,y,sz*0.75,0,7);g.stroke();g.restore()}
 g.save();g.translate(cx,y);const sc=1+0.6*pop;g.scale(sc,sc);if(k<1)mtxt(''+n0,0,1,sz,C.gold,a*(1-k),'center','bold');if(k>0)mtxt(''+n1,0,1,sz,'#fff',a*k,'center','bold');g.restore();
 if(r.kind=='open')mtxt(', {',X+nw,y,sz,C.dim,a)}
// the outer [ … ] of a shelf
function bigBr(x,y0,y1,dir,a,col='#6a7c8e'){if(a<=0)return;g.save();g.globalAlpha*=a;g.strokeStyle=col;g.lineWidth=3;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(x+dir*12,y0);g.lineTo(x,y0);g.lineTo(x,y1);g.lineTo(x+dir*12,y1);g.stroke();g.restore()}
// a whole shelf, [value, version]: rows R0 → R1 (values change at tv, versions at tvr)
function shelf(side,R0,R1,tv,tvr,a,hl=()=>0,ring=()=>0){if(a<=0)return;const P=SIDE[side].P,ox=P.x,y0=RY(0)-20,y1=RY(R0.length-1)+20;
 bigBr(ox+24,y0,y1,1,a);bigBr(ox+P.w-22,y0,y1,-1,a);
 txt('value',ox+VALX,SHY+22,16,C.dim,'left','',a);txt('version',ox+VERX,SHY+22,16,C.gold,'left','',a*0.8);
 R0.forEach((r0,i)=>{const r1=R1[i],y=RY(i),h=hl(i);
  if(h>0){g.save();g.globalAlpha*=a*h;rr(ox+34,y-15,P.w-62,30,8);g.fillStyle='#ffffff14';g.fill();g.restore()}
  const x=ox+VALX+r0.ind*IND,kv=restTxt(r0)!=restTxt(r1)?ease((tt-tv)/0.45):0;
  if(kv<1)row(r0,x,y,FS,a*(1-kv));if(kv>0)row(r1,x,y,FS,a*kv,'#fff');
  if(r0.kind=='close'&&r0.path.length==0)mtxt(',',x+mw('}',FS),y,FS,C.dim,a);
  const ch=r0.kind!='close'&&r0.ver!=r1.ver;
  verRow(r0,ox+VERX+r0.ind*IND,y,FS,a,r0.ver,r1.ver,ch?ease((tt-tvr)/0.3):0,r0.kind=='close'?0:ring(i),ch?bump(tvr,0.7):0)})}
// the change's rows, at the shelf rows they belong to (the outer closing brace sits right after the last row)
const ERALL=(()=>{const R=treeRows(...CH);let prev=0;return R.map(r=>{let i;if(r.kind!='close')i=RI[pkey(r)];else i=r.path.length?RA0.findIndex(q=>q.kind=='close'&&q.path.join('.')==r.path.join('.')):prev+1;prev=Math.max(prev,i);return{...r,i}})})();
