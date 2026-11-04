// node tools/at.js OUT.png expr1 expr2 … : frames at anim times (each expr is JS evaluated in the page, e.g. "SWINGS[0].t+0.3"), tiled 2 wide
const puppeteer=require('puppeteer-core'),path=require('path'),fs=require('fs'),{execFileSync}=require('child_process')
const [out,...exprs]=process.argv.slice(2)
;(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+path.resolve('anim.html'))
 const files=[]
 for(const [i,x] of exprs.entries()){const d=await p.evaluate(x=>{const t=eval(x);drawFrame(t);return [t,cv.toDataURL('image/png')]},x);
  const f='/tmp/at-'+i+'.png';fs.writeFileSync(f,Buffer.from(d[1].split(',')[1],'base64'));files.push(f);console.log(x,'=',d[0].toFixed(2))}
 execFileSync('python3',['-c',`
import sys
from PIL import Image
fs=sys.argv[2:];n=2;w,h=960,540
S=Image.new('RGB',(n*w,((len(fs)+n-1)//n)*h),'white')
for i,f in enumerate(fs): S.paste(Image.open(f).convert('RGB').resize((w-4,h-4)),((i%n)*w,(i//n)*h))
S.save(sys.argv[1])`,out,...files]);console.log('errors',errs);await b.close()})()
