// ---------- the stage: the circuit on top; each gate's 4×4 directly under it; each result directly under its matrix (Falk's scheme) ----------
const LP=40, CS2=60, X_V0=110, GAPX=46, XMk=k=>X_V0+4*CS2+GAPX+k*(4*CS2+GAPX), MYB=430, VYB=MYB+4*CS2+24;
const XVk=k=>k==0?X_V0:XMk(k-1);                              // where vector k sits (k = 0 start, 1 after H, 2 after copy, 3 after the turns)
const GXk=k=>XMk(k)+2*CS2;                                     // the gate above matrix k
const WYA=170, WYB=290, WYA2=135, WYB2=325, XSPL0=GXk(1)+70, XSPL1=GXk(2)-70, XW0=200, XW1=GXk(2)+100;
const SW1=swarm('in',20261028,[FACE,[W/2-760,30,W/2+760,215]],0.7,0.93,30);
const ENDBOX=[W/2-760,240,W/2+600,760];
const SW2=swarm('out',6161,[FACE,ENDBOX],0.2,0.93,24);
const wy=(w,x)=>{const u=ease((x-XSPL0)/(XSPL1-XSPL0));return w==0?lerp(WYA,WYA2,u):lerp(WYB,WYB2,u)};
// the steps: k = which gate; each computes vector k from vector k-1 (for the turns: one step per pair of buttons pressed)
const STEPS=(()=>{const L=k=>LK(k),l4=L('right below it'),l5=L('copies alice'),l7=L('turn their qubit'),l9=L('same button'),l10=L('neighboring buttons'),l11=L('top and bottom buttons');
 const R=[{k:1,t0:at(l4,0.45),dt:0.5,M:TIE1,vin:V0,vout:V1},{k:2,t0:at(l5,0.55),dt:0.4,M:TIE2,vin:V1,vout:V2}];
 const P=(a,b,t,dt=0.18)=>R.push({k:3,t0:t,dt,a,b,M:turn(a,b),vin:V2,vout:press(a,b)});
 P(1,1,at(l7,0.7),0.35);P(0,0,E[l9]+0.3);P(2,2,E[l9]+1.6);P(0,1,at(l10,0.2));P(1,2,E[l10]+0.4);P(0,2,at(l11,0.2));
 return R})();
const stepDur=s=>4*s.dt+0.5;
// what's showing now: the last step per k, how far it got, and the current pair of buttons
function nowState(t){const last={};for(const s of STEPS)if(t>=s.t0-0.45)last[s.k]=s;const p=last[3]||null;return{last,pair:p?[p.a,p.b]:[1,1]}}
function cellDone(s,j,t){return s?ease((t-s.t0-j*s.dt-0.4)/0.15):0}
// drawing
function wires(a){const names=['Alice','Bob'];for(let w=0;w<2;w++){g.save();g.globalAlpha*=a*0.85;g.strokeStyle=WC[w];g.lineWidth=3;g.lineCap='round';g.beginPath();
  for(let x=XW0;x<=XW1;x+=6){const y=wy(w,x);x==XW0?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();g.restore();
  txt(names[w],LP,wy(w,XW0),28,WC[w],'left','bold',a);txt('|0⟩',XW0-12,wy(w,XW0),28,WC[w],'right','',a)}}
function hGate(x,a,lit){if(a<=0)return;const y=WYA,s=50;g.save();g.globalAlpha*=a;if(lit>0){g.shadowColor='#fff';g.shadowBlur=30*lit}rr(x-s/2,y-s/2,s,s,9);g.fillStyle=C.panel;g.fill();g.strokeStyle='#e8eef4';g.lineWidth=2.5;g.stroke();g.restore();txt('H',x,y+1,28,'#fff','center','bold',a)}
function copyG(x,a,lit){if(a<=0)return;const r=17;g.save();g.globalAlpha*=a;if(lit>0){g.shadowColor='#fff';g.shadowBlur=30*lit}g.strokeStyle='#e8eef4';g.lineWidth=2.5;g.beginPath();g.moveTo(x,WYA);g.lineTo(x,WYB+r);g.stroke();
 g.fillStyle='#e8eef4';g.beginPath();g.arc(x,WYA,7,0,7);g.fill();g.beginPath();g.arc(x,WYB,r,0,7);g.fillStyle=C.panel;g.fill();g.stroke();g.beginPath();g.moveTo(x-r,WYB);g.lineTo(x+r,WYB);g.moveTo(x,WYB-r);g.lineTo(x,WYB+r);g.stroke();g.restore()}
function dial(x,y,ang,a,col,r=22){if(a<=0)return;g.save();g.globalAlpha*=a;g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.arc(x,y,r,0,7);g.stroke();const t=-ang*Math.PI/180;
 g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x-Math.cos(t)*r*0.8,y-Math.sin(t)*r*0.8);g.lineTo(x+Math.cos(t)*r*0.8,y+Math.sin(t)*r*0.8);g.stroke();g.restore()}
function turnGate(w,x,ang,a,lit){if(a<=0)return;const y=wy(w,x),s=64;g.save();g.globalAlpha*=a;if(lit>0){g.shadowColor=WC[w];g.shadowBlur=34*lit}rr(x-s/2,y-s/2,s,s,12);g.fillStyle=C.panel;g.fill();g.strokeStyle=WC[w];g.lineWidth=3;g.stroke();g.restore();
 dial(x,y-8,ang,a,'#e8eef4',17);txt(`${ang}°`,x,y+19,13,C.dim,'center','',a)}
function phone(x,y,pressed,a,col){if(a<=0)return;g.save();g.globalAlpha*=a;rr(x-22,y-40,44,80,9);g.fillStyle='#0d1620';g.fill();g.strokeStyle=col;g.lineWidth=2;g.stroke();
 for(let k=0;k<3;k++){const by=y-22+k*22,on=k===pressed;g.beginPath();g.arc(x,by,8,0,7);g.fillStyle=on?col:'#2a3a4a';if(on){g.shadowColor=col;g.shadowBlur=16}g.fill();g.shadowBlur=0}g.restore()}
// a row vector in the bottom band
function vrow(v,k,a,lab,doneF,hl){if(a<=0)return;const x0=XVk(k);txt(lab,x0+2*CS2,VYB+CS2+44,20,C.dim,'center','',a);
 for(let j=0;j<4;j++){const d=doneF?doneF(j):1,h=hl?hl(j):0;cell(x0+j*CS2,VYB,CS2,C.gold,{a,lit:h*0.5,ring:h});if(d>0)num(x0+j*CS2,VYB,CS2,v[j],C.gold,a*d);
  sname(j,x0+j*CS2+CS2/2,VYB+CS2+18,18,a,'center','',2)}}
function scMain(){
 const L=k=>LK(k),l2=L('one for alice'),l3=L('tie them together'),l4=L('right below it'),l5=L('copies alice'),l6=L('far apart'),l7=L('turn their qubit'),l8=L('squared and added'),l12=L('few matrices');
 const out=1-ev(l12,0.85,0.8);if(out<=0)return;g.save();g.globalAlpha*=out;
 const st=nowState(tt),[pa,pb]=st.pair;
 const lit=k=>{const s=st.last[k];if(!s)return 0;const q=tt-s.t0;return Math.max(0,Math.min(1,(q+0.45)/0.3))*(1-ease((q-stepDur(s))/0.4))};
 // the circuit
 wires(ev(l2,0,0.6));
 const aH=ev(l3,0.1,0.5),aC=ev(l5,0.05,0.5),aT=ev(l7,0.2,0.5);
 hGate(GXk(0),aH,lit(1));copyG(GXk(1),aC,lit(2));
 txt('50/50',GXk(0),WYA+44,18,C.dim,'center','',ev(l3,0.4,0.5));txt('copy',GXk(1)+30,WYB+40,18,C.dim,'center','',ev(l5,0.3,0.5));
 txt('far apart',(XSPL0+XSPL1)/2,(WYA2+WYB2)/2,22,C.dim,'center','',ev(l6,0.2,0.5)*(1-ev(l7,0,0.5)*0.7));
 turnGate(0,GXk(2),BUT[pa],aT,lit(3));turnGate(1,GXk(2),BUT[pb],aT,lit(3));
 phone(GXk(2)+80,wy(0,GXk(2)),pa,aT,WC[0]);phone(GXk(2)+80,wy(1,GXk(2)),pb,aT,WC[1]);
 // gate → matrix: a faint guide always; bright while that step runs
 const gateY=[WYA+28,WYB+20,wy(1,GXk(2))+34], ma=[aH*ev(l3,0.5,0.5),aC*ev(l5,0.35,0.5),aT*ev(l7,0.45,0.5)];
 for(let k=0;k<3;k++){if(ma[k]<=0)continue;const x=GXk(k),l=lit(k+1);g.save();g.globalAlpha*=ma[k]*(0.18+0.6*l);g.setLineDash([6,7]);g.strokeStyle=C.a;g.lineWidth=2.5;g.beginPath();g.moveTo(x,gateY[k]);g.lineTo(x,MYB-34);g.stroke();g.restore()}
 // the matrices (row-vector form): H, copy, turns(a, b)
 const Ms=[TIE1,TIE2,turn(pa,pb)], labs=['H on Alice','copy',`turns: ${BNAME[pa]}, ${BNAME[pb]}`];
 for(let k=0;k<3;k++){const a=ma[k];if(a<=0)continue;const x=XMk(k),s=st.last[k+1],l=lit(k+1);txt(labs[k],x+2*CS2,MYB-20,20,C.a,'center','bold',a);
  for(let r=0;r<4;r++)for(let q=0;q<4;q++){const tr_=traceLit(s,r,q);cell(x+q*CS2,MYB+r*CS2,CS2,C.a,{a,lit:tr_*0.7});num(x+q*CS2,MYB+r*CS2,CS2,Ms[k][r][q],'#fff',a)}
  brackets(x,MYB,4*CS2,4*CS2,C.a,a*0.9)}
 // the vectors along the bottom: start, then each result right below its matrix
 vrow(V0,0,ev(l2,0.5,0.5),'start',null,j=>rowLit(st.last[1]));
 const vlab=['after H','after copy','after the turns'];
 for(let k=1;k<=3;k++){const s=st.last[k];if(!s)continue;const a=ease((tt-s.t0+0.45)/0.4);
  const hl=k==3?j=>(j==0||j==3)?ev(l8,0.3,0.5):0:k==2?j=>(j==0||j==3)?ev(l5,0.85,0.4)*(1-ev(l6,0.3,0.5)):0:null;
  vrow(s.vout,k,a,vlab[k-1],j=>cellDone(s,j,tt),j=>Math.max(hl?hl(j):0,k<3?rowLit(st.last[k+1]):0))}
 // the traces: for each result cell, left along the previous vector, up the matrix's column (as in the matrix video)
 for(let k=1;k<=3;k++){const s=st.last[k];if(!s)continue;for(let j=0;j<4;j++){const u=tt-s.t0-j*s.dt;if(u<0||u>0.6)continue;const f=1-cl((u-0.4)/0.2),pr=eo(u/0.35);
   const cx=XMk(k-1)+j*CS2+CS2/2,cy=VYB+CS2/2,lx=lerp(cx,XVk(k-1)+CS2*0.3,pr),ly=lerp(cy,MYB+CS2*0.3,pr);
   g.save();g.globalAlpha*=f;g.shadowColor='#fff';g.shadowBlur=14;g.strokeStyle='#ffffffd0';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(cx,cy);g.lineTo(lx,cy);g.moveTo(cx,cy);g.lineTo(cx,ly);g.stroke();g.restore();
   glowDot(lx,cy,7,'#fff',f);glowDot(cx,ly,7,'#fff',f)}}
 // "matrix above, result right below it"
 const fk=ev(l4,0.25,0.5)*(1-ev(l5,0,0.5));
 if(fk>0){const x=XMk(0)+4*CS2+8;txt('matrix above,',x+6,MYB+3.2*CS2,20,C.dim,'left','',fk);txt('result right below',x+6,MYB+3.2*CS2+26,20,C.dim,'left','',fk)}
 // where the correlation is: same = 00² + 11², different = 01² + 10²
 const s3=st.last[3],f8=ev(l8,0.35,0.5);
 if(s3&&f8>0){const v=s3.vout,cx=XMk(2)+2*CS2,y=VYB+CS2+82,d=Math.min(...[0,1,2,3].map(j=>cellDone(s3,j,tt)));
  const sq=x=>{const f=fmt(x);return(f.includes('/')||x<0?`(${f})`:f)+'²'};
  rich([['same (00, 11):  ',C.ok,'bold'],[`${sq(v[0])} + ${sq(v[3])} = `,C.txt,''],[`${(psame(v)*100).toFixed(close(psame(v),Math.round(psame(v)*2)/2,1e-6)?0:1)}%`,C.ok,'bold']],cx,y,24,'center',f8*d);
  rich([['different (01, 10):  ',C.bad,'bold'],[`${sq(v[1])} + ${sq(v[2])} = `,C.dim,''],[`${(pdiff(v)*100).toFixed(close(pdiff(v),Math.round(pdiff(v)*2)/2,1e-6)?0:1)}%`,C.bad,'bold']],cx,y+36,20,'center',f8*d*0.85)}
 if(MIRROR)mirror(st,pa,pb);
 g.restore()}
// trace highlights: matrix column j of step s lights while cell j is traced; the previous vector row lights too
function traceLit(s,r,q){if(!s)return 0;const u=tt-s.t0-q*s.dt;return u>=0&&u<0.6?cl(u/0.1)*(1-cl((u-0.4)/0.2)):0}
function rowLit(s){if(!s)return 0;let m=0;for(let j=0;j<4;j++)m=Math.max(m,traceLit(s,0,j));return m*0.8}
// the real experiment, on the right: an entangled-photon source, two polarizers at the pressed angles, and what they see
function mirror(st,pa,pb){const l2=LK('one for alice'),l7=LK('turn their qubit'),l12=LK('few matrices'),a=ev(l2,0.5,0.6)*(1-ev(l12,0.85,0.6));if(a<=0)return;
 const sx=1475,y=200,lx=1350,rx=1600,s3=st.last[3],aT=ev(l7,0.3,0.5);
 txt('the real experiment:',1330,120,20,C.dim,'left','',a);glowDot(sx,y,10,C.gold,a);txt('source',sx,y+30,16,C.dim,'center','',a);
 if(s3){const u=cl((tt-s3.t0+0.45)/0.6);if(u<1){glowDot(lerp(sx,lx,u),y,6,'#fff',a);glowDot(lerp(sx,rx,u),y,6,'#fff',a)}}
 dial(lx,y,BUT[pa],a*Math.max(0.35,aT),WC[0],24);dial(rx,y,BUT[pb],a*Math.max(0.35,aT),WC[1],24);
 txt('Alice',lx,y+44,18,WC[0],'center','',a);txt('Bob',rx,y+44,18,WC[1],'center','',a);
 if(s3){const d=ease((tt-s3.t0-4*s3.dt-0.3)/0.3);rich([['they see the same: ',C.dim,''],[`${(psame(s3.vout)*100).toFixed(close(psame(s3.vout),Math.round(psame(s3.vout)*2)/2,1e-6)?0:1)}%`,C.ok,'bold']],1330,290,22,'left',a*d*aT)}
 tableT(a*ev(LK('same button'),0.1,0.5))}
function tableT(a){if(a<=0)return;const x0=1410,y0=400,cw=70,ch=38;txt('same, for each pair of buttons:',1330,y0-42,18,C.dim,'left','',a);
 for(let k=0;k<3;k++){txt(['top','mid','bot'][k],x0+k*cw+cw/2,y0-12,16,WC[1],'center','bold',a);txt(['top','mid','bot'][k],x0-8,y0+k*ch+ch/2,16,WC[0],'right','bold',a)}
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){let k=0;for(const s of STEPS)if(s.k==3&&((s.a==i&&s.b==j)||(s.a==j&&s.b==i)))k=Math.max(k,ease((tt-s.t0-4*s.dt-0.3)/0.4));const p=SAME[i][j];
  g.save();g.globalAlpha*=a;rr(x0+j*cw+3,y0+i*ch+3,cw-6,ch-6,6);g.fillStyle=k>0?mix(C.panel,p>0.99?'#3ecf6e':p>0.6?'#ffd166':'#ff5d5d',0.35*k):C.panel;g.fill();g.restore();
  if(k>0)txt(`${(p*100).toFixed(p>0.995||close(p,0.5,1e-6)?0:1)}%`,x0+j*cw+cw/2,y0+i*ch+ch/2,16,C.txt,'center','bold',a*k)}}
function scIntro(){const l1=LK('talked about the epr'),l2=LK('one for alice'),a=1-ev(l2,0,0.6);
 txt('the EPR paradox',W/2,92,64,C.txt,'center','bold',ev(l1,0.05,0.7)*a);
 txt('as matrix math',W/2,164,46,C.gold,'center','bold',ev(l1,0.5,0.6)*a)}
function scEnd(){const l12=LK('few matrices'),k=ev(l12,0.9,0.7),cxm=(ENDBOX[0]+ENDBOX[2])/2;
 txt('the setup  ↔  the math',cxm,300,46,C.txt,'center','bold',k);
 const rows=[['two qubits','a vector of 4 numbers (00, 01, 10, 11)'],['each gate','a 4×4 matrix, right under it'],['running it, left to right','multiplying, left to right'],
  ['the buttons','one more matrix (turn by 0°, 22.5°, 45°)'],['the chance they agree','00² + 11² in the result'],[`what the real experiment sees`,`the same: ${(SAME[0][0]*100).toFixed(0)}% / ${(SAME[0][1]*100).toFixed(0)}% / ${(SAME[0][2]*100).toFixed(0)}%`]];
 rows.forEach(([a,b],i)=>{const kk=after(l12,0.3+i*0.3,0.6),y=370+i*52;txt(a,cxm-30,y,28,C.gold,'right','bold',kk);txt('↔',cxm,y,28,C.dim,'center','',kk);txt(b,cxm+30,y,28,C.txt,'left','',kk)})}
function drawFrame(t){tt=t;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;const grd=g.createRadialGradient(W/2,H*0.45,200,W/2,H/2,1200);grd.addColorStop(0,'#131f2c');grd.addColorStop(1,'#070c12');g.fillStyle=grd;g.fillRect(0,0,W,H);
 const l1=LK('talked about the epr'),l2=LK('one for alice'),l12=LK('few matrices');
 const dive=ev(l2,0,0.9);
 if(dive<1){g.save();const z=1+0.35*dive;g.translate(W/2,H/2);g.scale(z,z);g.translate(-W/2,-H/2);swarmDraw(SW1,0.2,1-dive,[W/2-760,30,W/2+760,215],ev(l1,0.05,0.7));g.restore()}
 if(tt>at(l12,0.85))swarmDraw(SW2,at(l12,0.85)+0.3,0.8,null,0);
 scIntro();
 if(t>S[l2]-1)scMain();
 scEnd();
 return cv}
const VK=SCRIPT.map(([k],i)=>[k,[S[i]+0.15,(S[i]+E[i])/2,E[i]+Math.min(0.3,SCRIPT[i][2])]]);
