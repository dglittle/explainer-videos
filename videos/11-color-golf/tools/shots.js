// node tools/shots.js [anim.html] → chk/f-<line>-<mid|end>.png + chk/sheet.png, prints CHK failures and page errors
const puppeteer=require('puppeteer-core'),path=require('path'),{execFileSync}=require('child_process')
const file='file://'+path.resolve(process.argv[2]||'anim.html')
;(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()))
 await p.setViewport({width:1100,height:900});await p.goto(file)
 const info=await p.evaluate(()=>({S,E,T,keys:SCRIPT.map(s=>s[0]),BAD,note:document.getElementById('note').innerText}))
 console.log(info.note);const outs=[]
 for(let i=0;i<info.keys.length;i++)for(const [m,t] of [['mid',(info.S[i]+info.E[i])/2],['end',i<info.keys.length-1?info.S[i+1]-0.05:info.T]]){
  const d=await p.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/png')},t)
  const f=`chk/f-${String(i).padStart(2,'0')}-${m}.png`;require('fs').writeFileSync(f,Buffer.from(d.split(',')[1],'base64'));outs.push(f)}
 execFileSync('python3',['-c',`
import sys
from PIL import Image,ImageDraw
fs=sys.argv[1:];c=4;w,h=480,270
S=Image.new('RGB',(c*w,((len(fs)+c-1)//c)*h),'white')
for i,f in enumerate(fs):
  im=Image.open(f).convert('RGB').resize((w,h));ImageDraw.Draw(im).text((6,4),f.split('/')[-1],fill='yellow');S.paste(im,((i%c)*w,(i//c)*h))
S.save('chk/sheet.png')`,...outs])
 console.log('errors:',errs);await b.close()})()
