p='/home/bitnami/airport-sessions/shelf-video/anim.html';s=open(p).read()
def rep(x,y):
    global s
    assert s.count(x)==1,x
    s=s.replace(x,y)
# copy A first (its shelf written long, running off the screen); copy B comes in after the lift
rep("""['just a pair',"A shelf is just a pair: some data, and then its version, which has a version number for every piece of the data.",2.6],
['two copies',"Here are two copies of the same little world, each with its own shelf.",1.0],""",
"""['just a pair',"Here's a little world, and its shelf. A shelf is just a pair: some data, and then its version, which has a version number for every piece of the data.",3.0],
['second copy',"And here's a second copy of the same world, with its own shelf.",1.0],""")
rep("L0=LK('two copies')","L0=LK('second copy')")
rep("const aIn=ease((tt-T_PLACE-0.4)/0.9), aSh=ease((tt-T_PLACE-0.6)/0.8), uPl=ease((tt-T_PLACE)/D_PLACE), placed=tt>=T_PLACE+D_PLACE?1:0,",
    "const aInA=ev(LP,0,0.8), aIn=ev(L0,0,0.8), aSh=ev(L0,0.15,0.8), placed=tt>=T_LIFT+D_LIFT?1:0,")
rep("world(PA,'copy A',cA,kA<0.5?A0[0].lamp.color:A1[0].lamp.color,aIn,","world(PA,'copy A',cA,kA<0.5?A0[0].lamp.color:A1[0].lamp.color,aInA,")
rep("g.globalAlpha*=P==PA?uPl:aSh;rr(P.x,SHY","g.globalAlpha*=P==PA?placed:aSh;rr(P.x,SHY")
rep("const LF=30, LH=40, LIND=36, LX=W/2-170, LY=540-19*LH/2, SXv=W/2-310, SXr=SXv+370, SY=540-4*LH;\n","")
rep("const T_SHOW=S[0]+0.2, T_LIFT=E[0]+0.15, D_LIFT=2.4, T_PLACE=S[1]+0.1, D_PLACE=1.3;","const T_SHOW=S[0]+0.3, T_LIFT=E[0]+0.2, D_LIFT=2.6;")
a=s.index("function shelfMorph(){");b=s.index("function scIntro(){")
s=s[:a]+"""// copy A's shelf, written long: the value exactly where it ends up, and the version under it, running off the screen;
// then the version part slides right and lifts up beside the value, and the [ and ] stretch tall
function shelfMorph(){const n=RA0.length,v0=ease((tt-T_SHOW)/0.8);if(v0<=0)return;
 // u1: 0–0.3 the version part slides right, 0.3–0.72 it lifts up into view, 0.72–1 the [ and ] stretch tall
 const u1=cl((tt-T_LIFT)/D_LIFT),ux=ease(u1/0.3),uy=ease((u1-0.3)/0.42),st=ease((u1-0.72)/0.28);
 // the panel runs off the bottom of the screen too, until the version part has come up
 const ph=lerp(H-SHY+80,SHH,uy);
 g.save();g.globalAlpha*=v0;rr(PA.x,SHY,PA.w,ph,18);g.fillStyle='#0c141c';g.fill();g.strokeStyle='#2a3a4a';g.lineWidth=2;g.stroke();g.restore();
 txt('value',PA.x+VALX,SHY+22,16,C.dim,'left','',v0);txt('version',PA.x+VERX,SHY+22,16,C.gold,'left','',v0*0.8*ease((u1-0.6)/0.3));
 const small=FS*1.24, full=RY(n-1)-RY(0)+40;
 // [ : a plain character at the top, then tall
 bigBr(PA.x+24,RY(0)-FS*0.62,RY(0)-FS*0.62+lerp(small,full,st),1,v0);
 // ] : a plain character under the version part (off screen), carried up with it, then tall
 const rbot=lerp(RY(2*n)+FS*0.62,RY(n-1)+20,uy);
 bigBr(lerp(PA.x+36,PA.x+PA.w-22,ux),rbot-lerp(small,full,st),rbot,-1,v0);
 RA0.forEach((r,i)=>{const x=PA.x+VALX+r.ind*IND;
  row(r,x,RY(i),FS,v0);if(r.kind=='close'&&r.path.length==0)mtxt(',',x+mw('}',FS),RY(i),FS,C.dim,v0);
  verRow(r,lerp(PA.x+VALX,PA.x+VERX,ux)+r.ind*IND,lerp(RY(n+i),RY(i),uy),FS,v0,r.ver,r.ver)})}
"""+s[b:]
rep("const SCENES=[['a shelf',0],['two copies',1],","const SCENES=[['a shelf',0],['second copy',1],")
open(p,'w').write(s)
print('applied')
