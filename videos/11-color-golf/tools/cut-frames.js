// renders cut-anim.html's drawCut(t) → frames: node tools/cut-frames.js OUTDIR [fps] | or: node tools/cut-frames.js --sheet OUT.png t1 t2 …
const puppeteer=require('puppeteer-core'),path=require('path'),fs=require('fs'),{execFileSync}=require('child_process')
const args=process.argv.slice(2)
;(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()=='error'&&errs.push(m.text()))
 await p.goto('file://'+path.resolve('cut-anim.html'))
 const grab=async t=>Buffer.from((await p.evaluate(t=>{drawCut(t);return cv.toDataURL('image/png')},t)).split(',')[1],'base64')
 if(args[0]=='--sheet'){const files=[];for(const [i,t] of args.slice(2).entries()){const f='/tmp/cf-'+i+'.png';fs.writeFileSync(f,await grab(+t));files.push(f)}
  execFileSync('python3',['-c',`
import sys
from PIL import Image,ImageDraw
fs=sys.argv[2:];n=6;w,h=320,360
S=Image.new('RGB',(n*w,((len(fs)+n-1)//n)*h),'white')
for i,f in enumerate(fs):
  im=Image.open(f).convert('RGB').resize((w-4,h-4));S.paste(im,((i%n)*w,(i//n)*h))
S.save(sys.argv[1])`,args[1],...files])}
 else{const dir=args[0],fps=+(args[1]||30),END=await p.evaluate(()=>END);fs.mkdirSync(dir,{recursive:true})
  const n=Math.round(END*fps);for(let i=0;i<n;i++)fs.writeFileSync(path.join(dir,String(i).padStart(5,'0')+'.png'),await grab(i/fps));console.log(n,'frames')}
 console.log('errors',errs);await b.close()})()
