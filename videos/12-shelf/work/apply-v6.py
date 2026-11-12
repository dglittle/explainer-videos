p='/home/bitnami/airport-sessions/shelf-video/anim.html';s=open(p).read()
def rep(x,y):
    global s
    assert s.count(x)==1,x
    s=s.replace(x,y)
# helpers: a bracket character (same mono font as the rows), stretched by its middle
a=s.index("function bigBr(");b=s.index("\n",a)+1
s=s[:b]+"""// a bracket character in the rows' mono font, stretched to span ytop..ybot: its two ends stay as drawn, only the stem in the
// middle is stretched (at its natural height it's exactly the typed character)
const BRC=C.txt, GBM={};
function gbMetrics(ch,sz){const k=ch+sz;if(GBM[k])return GBM[k];g.save();g.font=`${sz}px ${MONO}`;g.textBaseline='middle';const m=g.measureText(ch);g.restore();return GBM[k]={asc:m.actualBoundingBoxAscent,desc:m.actualBoundingBoxDescent}}
function glyphBr(ch,x,ytop,ybot,sz,col,a){if(a<=0)return;const{asc,desc}=gbMetrics(ch,sz),h0=asc+desc,h=Math.max(h0,ybot-ytop),c=h0*0.42;
 const part=(y0,y1,fn)=>{g.save();g.beginPath();g.rect(x-sz,y0,sz*3,y1-y0);g.clip();g.globalAlpha*=a;g.font=`${sz}px ${MONO}`;g.fillStyle=col;g.textBaseline='middle';g.textAlign='left';fn();g.restore()};
 part(ytop-4,ytop+c,()=>g.fillText(ch,x,ytop+asc));
 part(ybot-c,ybot+4,()=>g.fillText(ch,x,ybot-desc));
 if(h>2*c+0.5){const k=(h-2*c)/(h0-2*c);part(ytop+c-0.5,ybot-c+0.5,()=>{g.translate(0,ytop+c);g.scale(1,k);g.fillText(ch,x,asc-c)})}}
// the tall [ and ] of a shelf whose rows run r0..r1, value column at vx (the [ sits right before it), right edge at rx
function shelfBr(vx,rx,r0,r1,sz,a){const m=gbMetrics('[',sz);glyphBr('[',vx-mw('[',sz),RY(r0)-m.asc,RY(r1)+m.desc,sz,BRC,a);glyphBr(']',rx,RY(r0)-m.asc,RY(r1)+m.desc,sz,BRC,a)}
"""+s[b:]
rep("bigBr(ox+24,y0,y1,1,a);bigBr(ox+P.w-22,y0,y1,-1,a);","shelfBr(ox+VALX,ox+P.w-28,0,R0.length-1,FS,a);")
rep("bigBr(EX+16,yTop+8,yBot-8,1,bk*aE);bigBr(EX+ENVW-14,yTop+8,yBot-8,-1,bk*aE);","shelfBr(EX+EVALX,EX+ENVW-24,0,Math.max(...ERALL.map(r=>r.i)),EFS,bk*aE);")
# the opening
a=s.index(" // u1: 0–0.3 the version part slides right");b=s.index(" RA0.forEach((r,i)=>{const x=PA.x+VALX+r.ind*IND;")
s=s[:a]+""" // u1: 0–0.28 the version part slides right; 0.28–0.66 it lifts up into view; 0.66–0.8 its ] moves to the right edge;
 // 0.8–1 the [ and ] stretch tall; the labels come in together at the end
 const u1=cl((tt-T_LIFT)/D_LIFT),ux=ease(u1/0.28),uy=ease((u1-0.28)/0.38),sl=ease((u1-0.66)/0.14),st=ease((u1-0.8)/0.2),la=v0*ease((u1-0.8)/0.2);
 // the panel runs off the bottom of the screen too, until the version part has come up
 const ph=lerp(H-SHY+80,SHH,uy);
 g.save();g.globalAlpha*=v0;rr(PA.x,SHY,PA.w,ph,18);g.fillStyle='#0c141c';g.fill();g.strokeStyle='#2a3a4a';g.lineWidth=2;g.stroke();g.restore();
 txt('value',PA.x+VALX,SHY+22,16,C.dim,'left','',la);txt('version',PA.x+VERX,SHY+22,16,C.gold,'left','',la*0.8);
 const m=gbMetrics('[',FS), top=RY(0)-m.asc, bot=RY(n-1)+m.desc;
 // [ : typed right before the value's {, then stretched down
 glyphBr('[',PA.x+VALX-mw('[',FS),top,lerp(RY(0)+m.desc,bot,st),FS,BRC,v0);
 // ] : typed right after the version's last }] (off screen); it comes up with it, moves to the right edge, then stretches up
 const ly=lerp(RY(2*n-1),RY(n-1),uy), rx=lerp(lerp(PA.x+VALX,PA.x+VERX,ux)+mw('}]',FS),PA.x+PA.w-28,sl);
 glyphBr(']',rx,lerp(ly-m.asc,top,st),ly+m.desc,FS,BRC,v0);
"""+s[b:]
rep("const T_SHOW=S[0]+0.3, T_LIFT=E[0]+0.2, D_LIFT=2.6;","const T_SHOW=S[0]+0.3, T_LIFT=E[0]+0.2, D_LIFT=2.8;")
open(p,'w').write(s)
print('applied')
