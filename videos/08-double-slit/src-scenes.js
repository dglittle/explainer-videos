// ---------- the stage ----------
const LP=70, X0=250, XE=1200, WY=[250,370,490], SLX=390, CPX=490, MXX=990;
const SW1=swarm('in',20261026,[FACE,[W/2-760,30,W/2+760,215]],0.7,0.93,30);
const ENDBOX=[W/2-700,250,W/2+560,760];
const SW2=swarm('out',4141,[FACE,ENDBOX],0.2,0.93,24);
// the two runs: which gates are in the diagram, where, and the matrices (as row-vector matrices)
const RUN1=[{x:SLX,M:S4},{x:MXX,M:B4}], RUN2=[{x:SLX,M:up(S4)},{x:CPX,M:CP8},{x:MXX,M:up(B4)}];
function stateAt(x,run){let v=run==1?A0.slice():W0.slice();for(const G of(run==1?RUN1:RUN2))if(x>G.x)v=vm(v,G.M);return v}
const pWire=(v,w)=>w==0?ptop(v):w==1?pbot(v):pspy(v);
// the cursor ("now", moving left to right through the diagram): keyframes [time, x], per run
function cursor(t){const l4=LK('top qubit is a 1'),l5=LK('randomizes which'),l6=LK('distance travelled'),l8=LK('lo and behold'),l11=LK('spy on'),l12=LK('tells us the truth');
 const K1=[[at(l4,0.35),X0+14],[at(l5,0.15),X0+14],[at(l5,0.42),SLX+90],[at(l6,0.15),SLX+90],[E[l6]+0.6,MXX-90],[at(l8,0.12),MXX-90],[at(l8,0.42),XE-40]];
 const K2=[[at(l11,0.25),X0+14],[at(l11,0.6),X0+14],[at(l12,0.3),XE-40]];
 const run=t>=K2[0][0]?2:1, K=run==1?K1:K2;if(t<K[0][0])return{run,x:K[0][0],a:0};
 let x=K[K.length-1][1];for(let i=1;i<K.length;i++)if(t<K[i][0]){x=lerp(K[i-1][1],K[i][1],ease((t-K[i-1][0])/(K[i][0]-K[i-1][0])));break}
 const a=run==1?ease((t-K1[0][0])/0.4)*(1-ease((t-K2[0][0]+0.4)/0.4)):ease((t-K2[0][0])/0.4);return{run,x,a}}
function drawWires(nw,a,spyA){const names=['top','bottom','spy'],kets=['|1⟩','|0⟩','|0⟩'];
 for(let w=0;w<3;w++){const wa=a*(w<2?1:spyA);if(wa<=0)continue;g.save();g.globalAlpha*=wa*0.8;g.strokeStyle=WC[w];g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(X0,WY[w]);g.lineTo(XE,WY[w]);g.stroke();g.restore();
  txt(names[w],LP,WY[w],30,WC[w],'left','bold',wa);txt(kets[w],X0-14,WY[w],30,WC[w],'right','',wa)}}
function gateBox(x,label,sub,col,a,lit=0){if(a<=0)return;const y0=WY[0]-44,h=WY[1]-WY[0]+88,w=86;g.save();g.globalAlpha*=a;
 if(lit>0){g.save();g.globalAlpha*=lit;g.shadowColor=col;g.shadowBlur=36;g.fillStyle=col+'44';rr(x-w/2,y0,w,h,14);g.fill();g.restore()}
 rr(x-w/2,y0,w,h,14);g.fillStyle=C.panel;g.fill();g.strokeStyle=col;g.lineWidth=3;g.stroke();
 txt(label,x,(WY[0]+WY[1])/2-(sub?14:0),28,col,'center','bold');if(sub)txt(sub,x,(WY[0]+WY[1])/2+22,22,C.dim,'center','');g.restore()}
function copyGate(x,a){if(a<=0)return;g.save();g.globalAlpha*=a;const r=18;g.strokeStyle='#e8eef4';g.lineWidth=3;g.beginPath();g.moveTo(x,WY[0]);g.lineTo(x,WY[2]+r);g.stroke();
 g.fillStyle='#e8eef4';g.beginPath();g.arc(x,WY[0],8,0,7);g.fill();g.beginPath();g.arc(x,WY[2],r,0,7);g.fillStyle=C.panel;g.fill();g.stroke();
 g.beginPath();g.moveTo(x-r,WY[2]);g.lineTo(x+r,WY[2]);g.moveTo(x,WY[2]-r);g.lineTo(x,WY[2]+r);g.stroke();g.restore();txt('copy',x,WY[2]+44,22,C.dim,'center','',a)}
// the particle: each wire glows with the chance the particle is on it (behind "now"), plus a bright blob at "now"
function drawParticle(c,nw){if(c.a<=0)return;for(let w=0;w<nw;w++){
  for(let x=X0+4;x<c.x;x+=8){const p=pWire(stateAt(x,c.run),w);if(p<1e-3)continue;g.save();g.globalAlpha*=c.a*p*0.55;g.strokeStyle='#fff';g.shadowColor=WC[w];g.shadowBlur=12;g.lineWidth=5;g.beginPath();g.moveTo(x,WY[w]);g.lineTo(Math.min(x+8,c.x),WY[w]);g.stroke();g.restore()}
  const p=pWire(stateAt(c.x,c.run),w);if(p>1e-3){const gr=g.createRadialGradient(c.x,WY[w],0,c.x,WY[w],34);gr.addColorStop(0,'#ffffff');gr.addColorStop(0.35,WC[w]);gr.addColorStop(1,WC[w]+'00');g.save();g.globalAlpha*=c.a*Math.min(1,0.15+p);g.fillStyle=gr;g.beginPath();g.arc(c.x,WY[w],34*(0.5+0.5*Math.sqrt(p)),0,7);g.fill();g.restore()}}}
// a little 2×2 matrix on (top, bottom)
function little(x,y,m,col,a,title){if(a<=0)return;const s=58,lab=['top','bot'];for(let r=0;r<2;r++)for(let c=0;c<2;c++){cell(x+c*s,y+r*s,s,col,{a});num(x+c*s,y+r*s,s,m[r][c],'#fff',a)}
 brackets(x,y,2*s,2*s,col,a);for(let k=0;k<2;k++){txt(lab[k],x-10,y+k*s+s/2,18,WC[k],'right','bold',a);txt(lab[k],x+k*s+s/2,y+2*s+16,18,WC[k],'center','bold',a)}
 if(title)txt(title,x+s,y-22,20,C.dim,'center','',a)}
// the vector row (bottom), and the "if we measure now" bars (right)
function vecRow(v,a,nb){if(a<=0)return;const s=nb==2?72:62,x0=LP+60,y=800;txt('the vector:',x0-10,y-30,22,C.dim,'left','',a);
 v.forEach((x,i)=>{cell(x0+i*s,y,s,C.gold,{a});num(x0+i*s,y,s,x,C.gold,a);sname(i,x0+i*s+s/2,y+s+20,22,a,'center','',nb)})}
function bars(v,a,spyA){if(a<=0)return;const x0=1300,y0=190;txt('if we measure now:',x0,y0,26,C.dim,'left','',a);
 [['top',ptop(v)],['bottom',pbot(v)],['spy',pspy(v)]].forEach(([n,p],k)=>{const ka=a*(k<2?1:spyA);if(ka<=0)return;const y=y0+56+k*64;
  txt(n,x0,y,26,WC[k],'left','bold',ka);g.save();g.globalAlpha*=ka;rr(x0+110,y-14,200,28,7);g.fillStyle='#ffffff14';g.fill();rr(x0+110,y-14,Math.max(4,200*p),28,7);g.fillStyle=WC[k];g.fill();g.restore();
  txt(`${(p*100).toFixed(p>0.995||p<0.005||close(p,0.5,1e-6)?0:1)}%`,x0+320,y,26,C.txt,'left','bold',ka)})}
function scMain(){
 const l3=LK('split into two'),l4=LK('top qubit is a 1'),l5=LK('randomizes which'),l6=LK('distance travelled'),l7=LK('25% chance'),l8=LK('lo and behold'),l9=LK('coin flip'),
  l10=LK('interference pattern'),l11=LK('try to examine'),l12=LK('spy on'),l13=LK('tells us the truth'),l14=LK('end in different');
 const out=1-ev(l14,0.85,0.8);if(out<=0)return;g.save();g.globalAlpha*=out;
 const c=cursor(tt), wa=ev(l4,0,0.6), spyA=ev(l11,0.4,0.6), nw=c.run==2?3:2;
 drawWires(3,wa,spyA);
 // gates
 const near=x=>Math.max(0,1-Math.abs(c.x-x)/60)*c.a;
 gateBox(SLX,'slit','',C.q,ev(l5,0,0.4),near(SLX));
 gateBox(MXX,'mix','25%',C.a,ev(l7,0.15,0.5),near(MXX));
 copyGate(CPX,ev(l12,0.12,0.5));
 // travel
 const tv=ev(l6,0.1,0.6);
 if(tv>0){g.save();g.globalAlpha*=tv*0.7;g.strokeStyle=C.dim;g.lineWidth=2;g.setLineDash([6,8]);const y=WY[0]-62;g.beginPath();g.moveTo(SLX+70,y);g.lineTo(MXX-70,y);g.stroke();g.restore();
  txt('travel',(SLX+MXX)/2,WY[0]-80,24,C.dim,'center','',tv)}
 drawParticle(c,nw);
 // the little matrices under the gates
 const insA=1-ev(l9,0,0.5);
 little(SLX-58,560,SL,C.q,ev(l5,0.35,0.5)*insA*(1-ev(l11,0,0.5)),'slit');
 little(MXX-58,560,MX2,C.a,ev(l7,0.45,0.5)*insA*(1-ev(l11,0,0.5)),'mix');
 txt(`a definite top or bottom flips with (½)² = ${(MX2[0][1]**2*100).toFixed(0)}%`,MXX+90,720,22,C.dim,'center','',ev(l7,0.7,0.5)*insA*(1-ev(l8,0.3,0.5)));
 if(NOTE_TRAVEL)txt('travelling: the numbers don’t change',(SLX+MXX)/2,600,24,C.dim,'center','',ev(l6,0.5,0.6)*(1-ev(l7,0.1,0.5)));
 // the vector and the bars, read at "now"
 const v=stateAt(c.x,c.run), vA=c.a*ev(l4,0.3,0.5);
 vecRow(v,vA,c.run==2?3:2);
 bars(v,c.a*ev(l5,0.5,0.5),spyA*(c.run==2?1:0));
 // "?!"
 const q=ev(l8,0.5,0.4)*(1-ev(l9,0.2,0.5));txt('?!',1780,250,80,C.gold,'center','bold',q);
 // OPTIONAL: coin flip vs amplitudes
 const a9=ev(l9,0.1,0.5)*(1-ev(l10,0,0.5)), b9=ev(l9,0.45,0.5)*(1-ev(l10,0,0.5)), cx9=(X0+XE)/2;
 rich([['coin-flip math:  ',C.dim,''],[`50%·75% + 50%·25% = ${(COIN*100).toFixed(0)}%`,C.txt,'bold']],cx9,580,28,'center',a9);
 const at_=A1[TOP],ab=A1[BOT];
 rich([['amplitudes, top:  ',C.dim,''],[`${at_.toFixed(2)}·${MX2[0][0].toFixed(2)} + ${ab.toFixed(2)}·½ = ${A2[TOP].toFixed(2)}`,WC[0],'bold'],[`  → ${(A2[TOP]**2*100).toFixed(0)}%`,C.txt,'bold']],cx9,640,28,'center',b9);
 rich([['bottom:  ',C.dim,''],[`${at_.toFixed(2)}·(−½) + ${ab.toFixed(2)}·${MX2[1][1].toFixed(2)} = ${A2[BOT].toFixed(2)}`,WC[1],'bold'],[`  → ${(A2[BOT]**2*100).toFixed(0)}%`,C.txt,'bold']],cx9,690,28,'center',b9);
 // the fringes: make one path longer by a phase φ, and P(top) swings between the two extremes
 if(NOTE_FRINGE)fringe(ev(l10,0.2,0.6)*(1-ev(l11,0,0.5)));
 // the spy run's notes
 const a13=ev(l13,0.2,0.5)*(1-ev(l14,0,0.5)), agree=W2.every((x,i)=>close(x,0)||((i>>2)&1)==(i&1));
 rich([['the spy = the path at the slit, every time  ',C.dim,''],[agree?'✓':'✗',C.ok,'bold']],(X0+XE)/2,600,26,'center',a13);
 const a14=ev(l14,0.1,0.5)*(1-ev(l14,0.85,0.5));
 if(a14>0){rich([['top, spy 1:  ',C.dim,''],[`${W1[4].toFixed(2)}·${MX2[0][0].toFixed(2)} = ${W3[5].toFixed(2)}`,C.gold,'bold'],['     top, spy 0:  ',C.dim,''],[`${W1[2].toFixed(2)}·½ = ${W3[4].toFixed(2)}`,C.gold,'bold']],(X0+XE)/2,590,26,'center',a14);
  rich([['different cells, so nothing cancels:  ',C.dim,''],[`${W3[5].toFixed(2)}² + ${W3[4].toFixed(2)}² = ${(ptop(W3)*100).toFixed(0)}%`,C.txt,'bold']],(X0+XE)/2,640,26,'center',a14)}
 g.restore()}
function fringe(a){if(a<=0)return;const x0=1300,y0=470,w=320,h=160;txt('if one path is a bit longer (φ):',x0,y0-26,22,C.dim,'left','',a);
 g.save();g.globalAlpha*=a;g.strokeStyle='#ffffff30';g.lineWidth=1.5;g.strokeRect(x0,y0,w,h);g.strokeStyle=WC[0];g.lineWidth=3;g.beginPath();
 for(let k=0;k<=100;k++){const ph=k/100*4*Math.PI,p=FRINGE(ph),X=x0+k/100*w,Y=y0+h-p*h;k?g.lineTo(X,Y):g.moveTo(X,Y)}g.stroke();
 for(let k=0;k<64;k++){const p=FRINGE(k/64*4*Math.PI);g.fillStyle=`rgba(255,240,200,${p})`;g.fillRect(x0+k/64*w,y0+h+12,w/64+0.5,26)}
 g.fillStyle=C.gold;g.beginPath();g.arc(x0,y0+h-FRINGE(0)*h,7,0,7);g.fill();g.restore();
 txt('P(top)',x0-8,y0+12,18,WC[0],'right','',a);txt('φ →',x0+w,y0+h+56,18,C.dim,'right','',a);txt('like the bright and dark stripes on the screen',x0,y0+h+80,20,C.dim,'left','',a)}
// the double-slit cartoon (intro): a source, a wall with two slits, a screen with stripes from the same formula
function cartoon(a){if(a<=0)return;const cx=W/2,cy=600;g.save();g.globalAlpha*=a;
 glowDot(cx-380,cy,12,C.gold,1);
 g.fillStyle='#8a99a8';g.fillRect(cx-60,cy-200,16,150);g.fillRect(cx-60,cy-30,16,60);g.fillRect(cx-60,cy+50,16,150);
 for(let k=0;k<6;k++){g.strokeStyle=`rgba(255,209,102,${0.35-k*0.05})`;g.lineWidth=2;g.beginPath();g.arc(cx-380,cy,40+k*55,-0.5,0.5);g.stroke()}
 for(const sy of[-40,40])for(let k=0;k<5;k++){g.strokeStyle=`rgba(255,209,102,${0.3-k*0.05})`;g.beginPath();g.arc(cx-52,cy+sy,40+k*60,-0.9,0.9);g.stroke()}
 for(let k=0;k<80;k++){const y=cy-200+k*5,p=FRINGE((y-cy)/400*6*Math.PI)*Math.exp(-(((y-cy)/260)**2));g.fillStyle=`rgba(255,240,200,${p})`;g.fillRect(cx+300,y,22,5)}
 g.restore();txt('source',cx-380,cy+40,20,C.dim,'center','',a);txt('two slits',cx-52,cy+230,20,C.dim,'center','',a);txt('screen',cx+311,cy+230,20,C.dim,'center','',a)}
function scIntro(){const l1=LK('very confusing'),l2=LK('just matrix multiplication'),l3=LK('split into two'),a=1-ev(l2,0,0.6);
 txt('understanding quantum mechanics',W/2,90,62,C.txt,'center','bold',ev(l1,0.05,0.7)*a);
 txt('with quantum computation',W/2,160,48,C.gold,'center','bold',ev(l1,0.4,0.6)*a);
 const b=ev(l2,0,0.6)*(1-ev(l3,0.1,0.6));
 txt('the double-slit experiment',W/2,120,56,C.txt,'center','bold',ev(l2,0.3,0.6)*b);
 txt('as a quantum computation',W/2,190,44,C.gold,'center','bold',ev(l2,0.5,0.6)*b);
 cartoon(ev(l2,0.4,0.8)*(1-ev(l3,0.1,0.6)));
 // "split into two": one qubit can't become two
 const s=ev(l3,0.2,0.5)*(1-ev(LK('top qubit is a 1'),0,0.5));
 if(s>0){const x0=W/2-260,y0=470,sp=ease((tt-at(l3,0.25))/0.8);glowDot(x0,y0,16,WC[0],s);
  for(const dy of[-90,90]){const x1=lerp(x0,x0+420,sp),y1=lerp(y0,y0+dy,sp);g.save();g.globalAlpha*=s*0.6;g.setLineDash([8,8]);g.strokeStyle=C.dim;g.lineWidth=2;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.restore();glowDot(x1,y1,12,WC[0],s*sp*0.7)}
  const x=ev(l3,0.6,0.4)*s;g.save();g.globalAlpha*=x;g.strokeStyle=C.bad;g.lineWidth=8;g.lineCap='round';g.beginPath();g.moveTo(x0+170,y0-50);g.lineTo(x0+270,y0+50);g.moveTo(x0+270,y0-50);g.lineTo(x0+170,y0+50);g.stroke();g.restore();
  txt('one qubit → two?',W/2,y0+180,40,C.txt,'center','bold',s);txt('qubits can’t be created or destroyed',W/2,y0+234,30,C.dim,'center','',x)}}
function scEnd(){const l14=LK('end in different'),k=ev(l14,0.9,0.7),k2=after(l14,0.4,0.7),k3=after(l14,1.0,0.7),cxm=(ENDBOX[0]+ENDBOX[2])/2;
 txt('interference: the amplitudes of the two paths',cxm,340,46,C.txt,'center','bold',k);txt('add up, or cancel',cxm,400,46,C.gold,'center','bold',k);
 txt('spying which way: the paths end in different places,',cxm,500,36,C.txt,'center','',k2);txt('so they can’t meet again: 50/50',cxm,550,36,C.txt,'center','',k2);
 if(NOTE_MZ)txt('(this setup is a Mach–Zehnder interferometer, a cousin of the double slit)',cxm,650,24,C.dim,'center','',k3)}
function drawFrame(t){tt=t;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;const grd=g.createRadialGradient(W/2,H*0.45,200,W/2,H/2,1200);grd.addColorStop(0,'#131f2c');grd.addColorStop(1,'#070c12');g.fillStyle=grd;g.fillRect(0,0,W,H);
 const l1=LK('very confusing'),l2=LK('just matrix multiplication'),l14=LK('end in different');
 const dive=ev(l2,0,0.9);
 if(dive<1){g.save();const z=1+0.35*dive;g.translate(W/2,H/2);g.scale(z,z);g.translate(-W/2,-H/2);swarmDraw(SW1,0.2,1-dive,[W/2-760,30,W/2+760,215],ev(l1,0.05,0.7));g.restore()}
 if(tt>at(l14,0.85))swarmDraw(SW2,at(l14,0.85)+0.3,0.8,null,0);
 scIntro();
 if(t>S[LK('top qubit is a 1')]-1)scMain();
 scEnd();
 return cv}
const VK=SCRIPT.map(([k],i)=>[k,[S[i]+0.15,(S[i]+E[i])/2,E[i]+Math.min(0.3,SCRIPT[i][2])]]);
