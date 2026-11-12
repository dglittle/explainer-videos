p='/home/bitnami/airport-sessions/shelf-video/anim.html';s=open(p).read()
def rep(x,y):
    global s
    assert s.count(x)==1,x
    s=s.replace(x,y)
# a new first line, and a shorter "two copies"
rep("""['two copies',"Here are two copies of the same little world. Under each one is its shelf: the world's data, with a version number on every piece.",1.0],""",
"""['just a pair',"A shelf is just a pair: some data, and then its version, which has a version number for every piece of the data.",2.6],
['two copies',"Here are two copies of the same little world, each with its own shelf.",1.0],""")
rep("const L0=LK('two copies'),","const LP=LK('just a pair'),L0=LK('two copies'),")
# the morph
rep("function scIntro(){","""// ---------- the opening: a shelf written out long (value, then version under it); the version lifts up beside it ----------
const LF=26, LH=36, LIND=31, LX=W/2-150, LY=540-19*LH/2, SXv=W/2-275, SXr=SXv+330, SY=540-4*LH;
const T_SHOW=S[0]+0.2, T_LIFT=E[0]+0.15, D_LIFT=1.9, T_PLACE=S[1]+0.1, D_PLACE=1.3;
function shelfMorph(){const n=RA0.length,v0=ease((tt-T_SHOW)/0.8);if(v0<=0)return;
 const u1=cl((tt-T_LIFT)/D_LIFT),e1=ease(u1),ux=ease(u1/0.5),uy=ease((u1-0.38)/0.62),u2=ease((tt-T_PLACE)/D_PLACE),sz=lerp(LF,FS,u2),ind=lerp(LIND,IND,u2);
 const pos=(L,S_,P,kx,ky)=>[lerp(lerp(L[0],S_[0],kx),P[0],u2),lerp(lerp(L[1],S_[1],ky),P[1],u2)];
 // the outer [ and ]: little characters at first, tall brackets once the two parts sit side by side
 const lb=pos([LX,LY],[SXv-30,SY],[PA.x+24,RY(0)],e1,e1), half=lerp(lerp(LF*0.62,(n-1)*LH/2+LH*0.65,e1),(RY(n-1)-RY(0))/2+20,u2);
 const top=lerp(lerp(LY-LF*0.62,SY-LH*0.65,e1),RY(0)-20,u2), bot=lerp(lerp(LY+LF*0.62,SY+(n-1)*LH+LH*0.65,e1),RY(n-1)+20,u2);
 bigBr(lb[0],top,bot,1,v0,'#9aaabb');
 const ry=LY+(2*n+1)*LH, rx=lerp(lerp(LX+12,SXr+252,e1),PA.x+PA.w-22,u2);
 bigBr(rx,lerp(lerp(ry-LF*0.62,SY-LH*0.65,e1),RY(0)-20,u2),lerp(lerp(ry+LF*0.62,SY+(n-1)*LH+LH*0.65,e1),RY(n-1)+20,u2),-1,v0,'#9aaabb');
 // the labels
 const lab=(t,col,L,S_,P,kx,ky)=>{const z=lerp(20,16,u2);g.save();g.font=`${z}px ${FONT}`;const w=g.measureText(t).width;g.restore();
  const q=pos([L[0]-w,L[1]],S_,P,kx,ky);txt(t,q[0],q[1],z,col,'left','',v0)};
 lab('value',C.dim,[LX-26,LY+LH],[SXv,SY-LH*1.25],[PA.x+VALX,SHY+22],e1,e1);
 lab('version',C.gold,[LX-26,LY+(1+n)*LH],[SXr,SY-LH*1.25],[PA.x+VERX,SHY+22],ux,uy);
 RA0.forEach((r,i)=>{
  const a=pos([LX+(1+r.ind)*LIND,LY+(1+i)*LH],[SXv+r.ind*LIND,SY+i*LH],[PA.x+VALX+r.ind*IND,RY(i)],e1,e1);
  row(r,a[0],a[1],sz,v0);if(r.kind=='close'&&r.path.length==0)mtxt(',',a[0]+mw('}',sz),a[1],sz,C.dim,v0);
  const b=pos([LX+(1+r.ind)*LIND,LY+(1+n+i)*LH],[SXr+r.ind*LIND,SY+i*LH],[PA.x+VERX+r.ind*IND,RY(i)],ux,uy);
  verRow(r,b[0],b[1],sz,v0,r.ver,r.ver)})}
function scIntro(){""")
rep("function scIntro(){const a=ev(L0,0,0.7)*(1-ev(L1,0.3,0.6));","function scIntro(){const a=ev(LP,0,0.7)*(1-ev(L0,0,0.6));")
# the main scene waits for the shelf to land in copy A's panel
rep("const aIn=ev(L0,0,0.8), aSh=ev(L0,0.35,0.7), out8=","const aIn=ease((tt-T_PLACE-0.4)/0.9), aSh=ease((tt-T_PLACE-0.6)/0.8), uPl=ease((tt-T_PLACE)/D_PLACE), placed=tt>=T_PLACE+D_PLACE?1:0, out8=")
rep("for(const P of[PA,PB]){g.save();g.globalAlpha*=aSh;rr(P.x,SHY","for(const P of[PA,PB]){g.save();g.globalAlpha*=P==PA?uPl:aSh;rr(P.x,SHY")
rep("shelf('A',RA0,RA1,T_AVAL,T_AVER,aSh,","if(!placed)shelfMorph();\n shelf('A',RA0,RA1,T_AVAL,T_AVER,placed,")
rep("const SCENES=[['two copies',0],['sync',1],['the edit',2],['version bump',3],['the change',4],['across',5],['compare',6],['2 beats 1',7],['in sync',8]];",
    "const SCENES=[['a shelf',0],['two copies',1],['sync',2],['the edit',3],['version bump',4],['the change',5],['across',6],['compare',7],['2 beats 1',8],['in sync',9]];")
open(p,'w').write(s)
print('applied')
