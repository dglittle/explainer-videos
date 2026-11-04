// ---------- the stage ----------
const LP=70, X0=250, XE=1210, HX=330, CX=430, XD0=480, XD1=640, XB=880, XM=1080;
const YA0=300, YB0=400, YA1=220, YB1=520;
const SW1=swarm('in',20261027,[FACE,[W/2-760,30,W/2+760,215]],0.7,0.93,30);
const ENDBOX=[W/2-760,240,W/2+600,760];
const SW2=swarm('out',5151,[FACE,ENDBOX],0.2,0.93,24);
const wy=(w,x)=>{const u=ease((x-XD0)/(XD1-XD0));return w==0?lerp(YA0,YA1,u):lerp(YB0,YB1,u)};
// the runs of the cursor ("now"): first through the tie gates; then one run per pair of buttons pressed
const RUNS=(()=>{const l3=LK('tie them together'),l6=LK('same button'),l7=LK('neighboring buttons'),l8=LK('top and bottom buttons'),l10=LK('each side alone');
 const R=[{a:-1,t0:at(l3,0.12),t1:at(LK('far apart'),0.8),x0:X0+14,x1:XB-90}];
 const P=(a,b,t)=>R.push({a,b,t0:t,t1:t+1.1,x0:XD1,x1:XE-30});
 P(1,1,at(l6,0.2));P(0,0,E[l6]+0.25);P(2,2,E[l6]+1.65);
 P(0,1,at(l7,0.3));P(1,2,E[l7]+0.35);
 P(0,2,at(l8,0.3));
 P(0,0,at(l10,0.25));P(0,1,at(l10,0.25)+1.35);P(0,2,at(l10,0.25)+2.7);
 return R})();
function cursor(t){let r=null;for(const q of RUNS)if(t>=q.t0)r=q;if(!r)return null;
 const x=lerp(r.x0,r.x1,ease((t-r.t0)/(r.t1-r.t0))), al=r.a<0?ease((t-r.t0)/0.4):ease((t-r.t0)/0.25);return{...r,x,al}}
const vecOf=c=>c.a===-1?(c.x<HX?V0:c.x<CX?V1:V2):(c.x<XB?V2:press(c.a,c.b));
// table: which pairs have been tried so far (a cell shows once its run passes the buttons)
function tried(a,b,t){let k=0;for(const q of RUNS)if(q.a>=0&&((q.a==a&&q.b==b)||(q.a==b&&q.b==a))){k=Math.max(k,ease((t-lerp(q.t0,q.t1,0.5))/0.4))}return k}
// drawing pieces
function wires(a){const names=['Alice','Bob'];for(let w=0;w<2;w++){g.save();g.globalAlpha*=a*0.85;g.strokeStyle=WC[w];g.lineWidth=3;g.lineCap='round';g.beginPath();
  for(let x=X0;x<=XE;x+=6){const y=wy(w,x);x==X0?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();g.restore();
  txt(names[w],LP,wy(w,X0),30,WC[w],'left','bold',a);txt('|0⟩',X0-14,wy(w,X0),30,WC[w],'right','',a)}}
function hGate(a,lit){if(a<=0)return;const y=YA0,s=50;g.save();g.globalAlpha*=a;if(lit>0){g.shadowColor='#fff';g.shadowBlur=30*lit}rr(HX-s/2,y-s/2,s,s,9);g.fillStyle=C.panel;g.fill();g.strokeStyle='#e8eef4';g.lineWidth=2.5;g.stroke();g.restore();txt('H',HX,y+1,28,'#fff','center','bold',a)}
function cnot(a,lit){if(a<=0)return;const r=17;g.save();g.globalAlpha*=a;if(lit>0){g.shadowColor='#fff';g.shadowBlur=30*lit}g.strokeStyle='#e8eef4';g.lineWidth=2.5;g.beginPath();g.moveTo(CX,YA0);g.lineTo(CX,YB0+r);g.stroke();
 g.fillStyle='#e8eef4';g.beginPath();g.arc(CX,YA0,7,0,7);g.fill();g.beginPath();g.arc(CX,YB0,r,0,7);g.fillStyle=C.panel;g.fill();g.stroke();g.beginPath();g.moveTo(CX-r,YB0);g.lineTo(CX+r,YB0);g.moveTo(CX,YB0-r);g.lineTo(CX,YB0+r);g.stroke();g.restore()}
// a button gate: a little dial (like a polarizer) turned to the pressed button's angle
function dial(x,y,ang,a,col,r=22){if(a<=0)return;g.save();g.globalAlpha*=a;g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.arc(x,y,r,0,7);g.stroke();const t=-ang*Math.PI/180;
 g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x-Math.cos(t)*r*0.8,y-Math.sin(t)*r*0.8);g.lineTo(x+Math.cos(t)*r*0.8,y+Math.sin(t)*r*0.8);g.stroke();g.restore()}
function buttonGate(w,ang,a,lit){if(a<=0)return;const y=wy(w,XB),s=70;g.save();g.globalAlpha*=a;if(lit>0){g.shadowColor=WC[w];g.shadowBlur=34*lit}rr(XB-s/2,y-s/2,s,s,12);g.fillStyle=C.panel;g.fill();g.strokeStyle=WC[w];g.lineWidth=3;g.stroke();g.restore();
 if(ang!=null){dial(XB,y-6,ang,a,'#e8eef4',20);txt(`${ang}°`,XB,y+24,16,C.dim,'center','',a)}else txt('turn',XB,y,20,WC[w],'center','bold',a)}
// a phone with three buttons; the pressed one glows
function phone(x,y,pressed,a,col){if(a<=0)return;g.save();g.globalAlpha*=a;rr(x-26,y-46,52,92,10);g.fillStyle='#0d1620';g.fill();g.strokeStyle=col;g.lineWidth=2;g.stroke();
 for(let k=0;k<3;k++){const by=y-26+k*26,on=k===pressed;g.beginPath();g.arc(x,by,9,0,7);g.fillStyle=on?col:'#2a3a4a';if(on){g.shadowColor=col;g.shadowBlur=16}g.fill();g.shadowBlur=0}g.restore()}
function meter(w,a){if(a<=0)return;const y=wy(w,XM),s=50;g.save();g.globalAlpha*=a;rr(XM-s/2,y-s/2,s,s,9);g.fillStyle=C.panel;g.fill();g.strokeStyle='#e8eef4';g.lineWidth=2;g.stroke();
 g.beginPath();g.arc(XM,y+10,16,Math.PI,2*Math.PI);g.stroke();g.beginPath();g.moveTo(XM,y+10);g.lineTo(XM+11,y-7);g.stroke();g.restore();if(w==0)txt('look',XM,y-42,20,C.dim,'center','',a)}
// the particle-ish glow on each wire: the chance of seeing a 1 there, at "now"
function glow(c){if(!c)return;const v=vecOf(c);for(let w=0;w<2;w++){const p=w==0?pA1(v):pB1(v),y=wy(w,c.x);if(p<1e-3)continue;
  const gr=g.createRadialGradient(c.x,y,0,c.x,y,30);gr.addColorStop(0,'#ffffff');gr.addColorStop(0.35,WC[w]);gr.addColorStop(1,WC[w]+'00');g.save();g.globalAlpha*=c.al*Math.min(1,0.2+p);g.fillStyle=gr;g.beginPath();g.arc(c.x,y,30*(0.5+0.5*Math.sqrt(p)),0,7);g.fill();g.restore()}}
function vecRow(v,a){if(a<=0)return;const s=72,x0=LP+60,y=830;txt('the vector:',x0-10,y-30,22,C.dim,'left','',a);
 v.forEach((x,i)=>{cell(x0+i*s,y,s,C.gold,{a});num(x0+i*s,y,s,x,C.gold,a);sname(i,x0+i*s+s/2,y+s+20,22,a,'center','',2)})}
function bar(x0,y,n,p,col,a){if(a<=0)return;txt(n,x0,y,24,col,'left','bold',a);g.save();g.globalAlpha*=a;rr(x0+150,y-13,170,26,7);g.fillStyle='#ffffff14';g.fill();rr(x0+150,y-13,Math.max(4,170*p),26,7);g.fillStyle=col;g.fill();g.restore();
 txt(`${(p*100).toFixed(close(p,Math.round(p*2)/2,1e-6)?0:1)}%`,x0+330,y,24,C.txt,'left','bold',a)}
function scMain(){
 const l2=LK('one for alice'),l3=LK('tie them together'),l4=LK('far apart'),l5=LK('turns their qubit'),l6=LK('same button'),l7=LK('neighboring buttons'),l8=LK('top and bottom buttons'),
  l9=LK('written down'),l10=LK('each side alone'),l11=LK('few matrices');
 const out=1-ev(l11,0.85,0.8);if(out<=0)return;g.save();g.globalAlpha*=out;
 const c=cursor(tt), wa=ev(l2,0,0.6), near=x=>c?Math.max(0,1-Math.abs(c.x-x)/60)*c.al:0;
 wires(wa);
 // the tie gates and their dashed box
 const ta=ev(l3,0,0.5);hGate(ta,near(HX));cnot(ta,near(CX));
 if(ta>0){g.save();g.globalAlpha*=ta*0.6;g.setLineDash([7,7]);g.strokeStyle=C.dim;g.lineWidth=2;rr(HX-48,YA0-50,CX-HX+96,YB0-YA0+100,14);g.stroke();g.restore();txt('tie them together',(HX+CX)/2,YA0-72,22,C.dim,'center','',ta)}
 // far apart
 const fa=ev(l4,0.2,0.6);txt('far apart:  no wires between them',(XD1+XB)/2+10,(YA1+YB1)/2,24,C.dim,'center','',fa*(1-ev(l5,0,0.5)*0.6));
 // the buttons
 const ba=ev(l5,0,0.5), cur=c&&c.a>=0?c:null, la=cur?BUT[cur.a]:null, lb=cur?BUT[cur.b]:null;
 buttonGate(0,la,ba,near(XB));buttonGate(1,lb,ba,near(XB));meter(0,ba);meter(1,ba);
 phone(XB,YA1-120,cur?cur.a:-1,ba,WC[0]);phone(XB,YB1+118,cur?cur.b:-1,ba,WC[1]);
 // the turn matrix (example: the middle button, 22.5°)
 const ia=ev(l5,0.4,0.5)*(1-ev(l6,0,0.5));
 if(ia>0){const M=RT(22.5),s=46,x=XB-s,y=(YA1+YB1)/2-s;for(let r=0;r<2;r++)for(let k=0;k<2;k++){cell(x+k*s,y+r*s,s,C.a,{a:ia});num(x+k*s,y+r*s,s,M[r][k],'#fff',ia)}
  brackets(x,y,2*s,2*s,C.a,ia);txt('turn by 22.5°',XB,y-22,20,C.dim,'center','',ia)}
 glow(c);
 // the vector and the bars, at "now"
 const v=c?vecOf(c):V0;vecRow(v,ev(l2,0.3,0.5));
 const x0=1300,b0=ev(l3,0.6,0.5);txt('if they look now:',x0,190,24,C.dim,'left','',b0);
 bar(x0,236,'same',psame(v),C.ok,b0);bar(x0,276,'different',pdiff(v),C.bad,b0);
 const sa=ev(l10,0.1,0.5)*(1-ev(l11,0.85,0.5));bar(x0,326,'Alice: 1',pA1(v),WC[0],sa);bar(x0,366,'Bob: 1',pB1(v),WC[1],sa);
 // the table of "same" for every pair of buttons
 table(ev(l6,0.1,0.5)*(1-sa*0.85));
 // written-down answers
 const a9=ev(l9,0.15,0.5)*(1-ev(l10,0,0.5)),b9=ev(l9,0.45,0.5)*(1-ev(l10,0,0.5)),c9=ev(l9,0.75,0.5)*(1-ev(l10,0,0.5)),cx9=700;
 txt('written-down answers:  if top ≠ bottom, the middle differs from one of them',cx9,690,24,C.dim,'center','',a9);
 rich([['so  different(top, bottom)  ≤  ',C.txt,''],[`${(D01*100).toFixed(1)}% + ${(D12*100).toFixed(1)}% = ${(BOUND*100).toFixed(1)}%`,C.gold,'bold']],cx9,735,28,'center',b9);
 rich([['the qubits:  different(top, bottom) = ',C.txt,''],[`${(D02*100).toFixed(0)}%  ✗`,C.bad,'bold']],cx9,780,28,'center',c9);
 // each side alone
 const a10=ev(l10,0.5,0.5)*(1-ev(l11,0,0.5));
 rich([['Alice alone:  ',C.dim,''],['50 / 50',WC[0],'bold'],[', whatever Bob presses  ',C.dim,''],[RUNS.filter(q=>q.a>=0).every(q=>close(pA1(press(q.a,q.b)),0.5))?'✓':'✗',C.ok,'bold'],['   (so: no messages)',C.dim,'']],700,700,26,'center',a10);
 if(MIRROR)mirror(c);
 g.restore()}
function table(a){if(a<=0)return;const x0=1385,y0=430,cw=78,ch=40;txt('same, for each pair of buttons:',1300,y0-44,20,C.dim,'left','',a);
 for(let k=0;k<3;k++){txt(['top','mid','bot'][k],x0+k*cw+cw/2,y0-12,18,WC[1],'center','bold',a);txt(['top','mid','bot'][k],x0-10,y0+k*ch+ch/2,18,WC[0],'right','bold',a)}
 const hl=ev(LK('written down'),0.3,0.5)*(1-ev(LK('each side alone'),0,0.5));
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){const k=tried(i,j,tt),p=SAME[i][j],H=(i==0&&j==1)||(i==1&&j==2)||(i==0&&j==2)?hl:0;
  g.save();g.globalAlpha*=a;rr(x0+j*cw+3,y0+i*ch+3,cw-6,ch-6,6);g.fillStyle=k>0?mix(C.panel,p>0.99?'#3ecf6e':p>0.6?'#ffd166':'#ff5d5d',0.35*k):C.panel;g.fill();if(H>0){g.strokeStyle=C.gold;g.lineWidth=2.5*H;g.stroke()}g.restore();
  if(k>0)txt(`${(p*100).toFixed(p>0.995||close(p,0.5,1e-6)?0:1)}%`,x0+j*cw+cw/2,y0+i*ch+ch/2,18,C.txt,'center','bold',a*k)}
 txt('Alice',x0-60,y0+1.5*ch,16,WC[0],'right','',a);txt('Bob',x0+1.5*cw,y0+3*ch+16,16,WC[1],'center','',a)}
// the mirror panel: a source of entangled photon pairs, and two polarizers turned to the pressed buttons' angles
function mirror(c){const l3=LK('tie them together'),l11=LK('few matrices'),a=ev(l3,0.5,0.6)*(1-ev(l11,0.85,0.6));if(a<=0)return;
 const sx=1465,y=715,lx=1335,rx=1595,cur=c&&c.a>=0?c:null;
 txt('the real experiment:',1300,620,20,C.dim,'left','',a);glowDot(sx,y,10,C.gold,a);
 const u=cur?ease((c.x-c.x0)/(c.x1-c.x0)):0;
 if(cur&&u<1){glowDot(lerp(sx,lx,u),y,6,'#fff',a*cur.al);glowDot(lerp(sx,rx,u),y,6,'#fff',a*cur.al)}
 dial(lx,y,cur?BUT[cur.a]:0,a,WC[0],24);dial(rx,y,cur?BUT[cur.b]:0,a,WC[1],24);
 txt('Alice',lx,y+44,18,WC[0],'center','',a);txt('Bob',rx,y+44,18,WC[1],'center','',a);txt('source',sx,y+30,16,C.dim,'center','',a);
 txt('polarizers at 0°, 22.5°, 45°',1300,y+82,18,C.dim,'left','',a*ev(LK('turns their qubit'),0.3,0.5))}
function scIntro(){const l1=LK('why the epr'),l2=LK('one for alice'),a=1-ev(l2,0,0.6);
 txt('the EPR paradox',W/2,92,64,C.txt,'center','bold',ev(l1,0.05,0.7)*a);
 txt('as a quantum computation',W/2,164,46,C.gold,'center','bold',ev(l1,0.5,0.6)*a)}
function scEnd(){const l11=LK('few matrices'),k=ev(l11,0.9,0.7),cxm=(ENDBOX[0]+ENDBOX[2])/2;
 txt('the circuit  ↔  the real EPR experiment',cxm,300,46,C.txt,'center','bold',k);
 const rows=[['the two tie gates','a source of entangled photon pairs'],['the three buttons (turns)','polarizers at 0°, 22.5°, 45°'],['looking','the detectors'],
  [`${(SAME[0][0]*100).toFixed(0)}% / ${(SAME[0][1]*100).toFixed(0)}% / ${(SAME[0][2]*100).toFixed(0)}% same`,'cos² of the angle between'],[`written-down answers: ≤ ${(BOUND*100).toFixed(0)}% different`,'Bell’s inequality']];
 rows.forEach(([a,b],i)=>{const kk=after(l11,0.3+i*0.35,0.6),y=380+i*56;txt(a,cxm-30,y,30,C.gold,'right','bold',kk);txt('↔',cxm,y,30,C.dim,'center','',kk);txt(b,cxm+30,y,30,C.txt,'left','',kk)});
 if(NOTE_BELL)txt('(real experiments side with the qubits: Clauser, Aspect, … Nobel Prize 2022)',cxm,700,24,C.dim,'center','',after(l11,2.2,0.7))}
function drawFrame(t){tt=t;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;const grd=g.createRadialGradient(W/2,H*0.45,200,W/2,H/2,1200);grd.addColorStop(0,'#131f2c');grd.addColorStop(1,'#070c12');g.fillStyle=grd;g.fillRect(0,0,W,H);
 const l1=LK('why the epr'),l2=LK('one for alice'),l11=LK('few matrices');
 const dive=ev(l2,0,0.9);
 if(dive<1){g.save();const z=1+0.35*dive;g.translate(W/2,H/2);g.scale(z,z);g.translate(-W/2,-H/2);swarmDraw(SW1,0.2,1-dive,[W/2-760,30,W/2+760,215],ev(l1,0.05,0.7));g.restore()}
 if(tt>at(l11,0.85))swarmDraw(SW2,at(l11,0.85)+0.3,0.8,null,0);
 scIntro();
 if(t>S[l2]-1)scMain();
 scEnd();
 return cv}
const VK=SCRIPT.map(([k],i)=>[k,[S[i]+0.15,(S[i]+E[i])/2,E[i]+Math.min(0.3,SCRIPT[i][2])]]);
