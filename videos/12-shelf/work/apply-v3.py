p='/home/bitnami/airport-sessions/shelf-video/anim.html';s=open(p).read()
a=s.index("// ---------- the stage ----------");b=s.index("// the little world: a lamp")
s=s[:a]+open('/home/bitnami/airport-sessions/shelf-video/work/stage.js').read()+s[b:]
def rep(x,y):
    global s
    assert s.count(x)==1,x
    s=s.replace(x,y)
rep("const sx=P.x+385,py=","const sx=P.x+370,py=")
rep("for(const y of[RY(0)-34,RY(3)+34])","for(const y of[RY(0)-30,RY(Math.max(...ERALL.map(r=>r.i)))+30])")
rep("""  txt('shelf',P==PA?P.x+P.w-80:P.x+P.w-20,SHY+22,18,C.dim,'right','bold',aSh)}""","""  txt('shelf',P.x+P.w-24,SHY+22,18,C.dim,'right','bold',aSh)}""")
rep("""comet(CODE_TEAL(),[SIDE.A.tx(RA0[EDIT_ROW].ind)+mw(keyTxt(RA0[EDIT_ROW]),FS)+30,RY(EDIT_ROW)]""","""comet(CODE_TEAL(),[PA.x+VALX+RA0[EDIT_ROW].ind*IND+mw(keyTxt(RA0[EDIT_ROW]),FS)+30,RY(EDIT_ROW)]""")
rep("""comet([SIDE.B.tx(wr.ind)+mw(keyTxt(wr),FS)+30,RY(STEP_ROW[WIN])]""","""comet([PB.x+VALX+wr.ind*IND+mw(keyTxt(wr),FS)+30,RY(STEP_ROW[WIN])]""")
rep("""txt('+1',SIDE.A.chip+34,RY(EDIT_ROW)-10-26*pb""","""txt('+1',numCX(RA1[EDIT_ROW],PA.x+VERX+RA1[EDIT_ROW].ind*IND,FS,RA1[EDIT_ROW].ver)+18,RY(EDIT_ROW)-10-26*pb""")
a=s.index(" const yTop=RY(Math.min(");b=s.index(" // the compare walk:")
s=s[:a]+""" const yTop=RY(0)-24, yBot=RY(Math.max(...ERALL.map(r=>r.i)))+24, bk=ease((tt-T_BOX)/0.5);
 if(bk>0&&aE>0){g.save();g.globalAlpha*=bk*aE;rr(EX,yTop,ENVW,yBot-yTop,14);g.fillStyle='#1b2a3a';g.fill();g.strokeStyle=C.a;g.lineWidth=2.5;g.shadowColor=C.a;g.shadowBlur=16;g.stroke();g.restore();
  bigBr(EX+16,yTop+8,yBot-8,1,bk*aE);bigBr(EX+ENVW-14,yTop+8,yBot-8,-1,bk*aE);
  rich([['the change',C.a,'bold'],[' (a shelf too)',C.dim,'']],EX+ENVW/2,yTop-22,20,'center',bk*aE)}
 ERALL.forEach(r=>{const j=r.kind=='close'?-1:ER.findIndex(q=>pkey(q)==pkey(r)),k=j<0?bk:eo((tt-T_ROW(j))/0.6);if(k<=0||aE<=0)return;const y=RY(r.i),al=aE*Math.min(1,k*3),f=j<0?1:k;
  const vx=lerp(PA.x+VALX+r.ind*IND,EX+EVALX+r.ind*EIND,f), wx=lerp(PA.x+VERX+r.ind*IND,EX+EVERX+r.ind*EIND,f), sz=lerp(FS,EFS,f);
  row(r,vx,y,sz,al);if(r.kind=='close'&&r.path.length==0)mtxt(',',vx+mw('}',sz),y,sz,C.dim,al);
  verRow(r,wx,y,sz,al,r.ver,r.ver,0,r.kind=='close'?0:ringB(r.i)*(go>0.99?1:0))});
"""+s[b:]
rep("""  txt(win?'>':s.r=='='?'=':s.r=='lose'?'<':'=',SYMX,y,28,win?C.ok:C.gold,'center','bold',a);\n""","")
rep("txt(note,EXB+ENVW/2,yBot+40+j*36,22,","txt(note,EXB+ENVW/2,yBot+34+j*32,22,")
rep("const CODE_Y=880, CFS=26, CAX=PA.x, CBX=PB.x-40;","const CODE_Y=880, CFS=26, CAX=PA.x;")
rep("const codeW=segs=>mw(segs.map(s=>s[0]).join(''),CFS);","const codeW=segs=>mw(segs.map(s=>s[0]).join(''),CFS);\nlet CBX_=null;const CBX=()=>CBX_??=FACE[0]-14-codeW(CODE_B);   // right side, clear of the webcam corner")
rep("code(CODE_B,CBX,CODE_Y,","code(CODE_B,CBX(),CODE_Y,")
rep("txt('on the right, when the change arrives:',CBX,","txt('on the right, when the change arrives:',CBX(),")
open(p,'w').write(s)
print('applied')
