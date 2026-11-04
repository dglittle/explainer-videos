// ---------- small helpers ----------
function rngS(seed){let s=seed%2147483647||1;return()=>(s=(s*16807)%2147483647)/2147483647}
const FACE=[1650,815,1920,1080];                                      // the webcam circle's corner: always kept free
C.q='#ff6b9a'; C.bad='#ff5d5d';
const WC=['#6fd0ff','#ffb36b','#a6ee7c'];                            // one color per wire (and per bit in the state names)
const close=(a,b,e=1e-9)=>Math.abs(a-b)<e;
// the numbers we write: 0, ±1, ±1/√2, ±½
function fmt(x){if(close(x,0))return'0';const s=x<0?'−':'',a=Math.abs(x);return s+(close(a,1)?'1':close(a,R2)?'1/√2':close(a,0.5)?'½':a.toFixed(2))}
// a state name, each bit in its wire's color
function sname(k,x,y,sz,a=1,al='center',wt='',nb=NQ){if(a<=0)return;rich(k.toString(2).padStart(nb,'0').split('').map((b,w)=>[b,WC[w],wt]),x,y,sz,al,a)}
function glowLine(pts,u,col,a=1,w=6){if(a<=0||u<=0)return;let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
 let left=L*cl(u),X=pts[0][0],Y=pts[0][1];g.save();g.globalAlpha*=a;g.shadowColor=col;g.shadowBlur=18;g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(X,Y);
 for(let i=1;i<pts.length&&left>0;i++){const k=Math.min(1,left/seg[i-1]);X=lerp(pts[i-1][0],pts[i][0],k);Y=lerp(pts[i-1][1],pts[i][1],k);g.lineTo(X,Y);left-=seg[i-1]}
 g.stroke();g.restore();glowDot(X,Y,w*1.4,'#fff',a)}
// a number in a matrix/vector cell
function num(x,y,s,v,col,a=1){if(a<=0)return;const z=close(v,0),f=fmt(v);txt(f,x+s/2,y+s/2+s*0.02,z?s*0.3:f.length>2?s*0.27:s*0.42,z?C.dim:col,'center',z?'':'bold',a*(z?0.45:1))}
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
