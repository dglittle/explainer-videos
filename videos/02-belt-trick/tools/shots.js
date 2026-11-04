// node tools/shots.js <page.html> <out.png> t1 t2 ...  — drawFrame(t) at each time → tiled contact sheet (3 per row)
const puppeteer=require('puppeteer-core'), {execFileSync}=require('child_process'), path=require('path'), fs=require('fs');
(async()=>{
 const [page,out,...ts]=process.argv.slice(2);
 const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage(); pg.on('pageerror',e=>console.error('PAGE ERROR',e.message)); pg.on('console',m=>m.type()==='error'&&console.error('CONSOLE',m.text()));
 await pg.goto('file://'+path.resolve(page),{waitUntil:'load'});
 const files=[];
 for(const [i,t] of ts.entries()){
  const u=await pg.evaluate(t=>{drawFrame(+t);return cv.toDataURL('image/jpeg',0.9)},t);
  const f=`/tmp/shot-${i}.jpg`; fs.writeFileSync(f,Buffer.from(u.split(',')[1],'base64')); files.push(f);
 }
 await b.close();
 const n=files.length, cols=Math.min(3,n), rows=Math.ceil(n/cols);
 const inputs=files.flatMap(f=>['-i',f]); while(files.length<rows*cols){inputs.push('-f','lavfi','-i','color=black:s=1920x1080:d=1');files.push(0)}
 const lay=files.map((_,i)=>`${(i%cols)}_${Math.floor(i/cols)}`.replace(/(\d+)_(\d+)/,(m,x,y)=>`${x==0?'0':Array(+x).fill('w0').join('+')}_${y==0?'0':Array(+y).fill('h0').join('+')}`)).join('|');
 execFileSync(process.env.HOME+'/bin/ffmpeg',['-v','error','-y',...inputs,'-filter_complex',`${files.map((_,i)=>`[${i}:v]scale=640:360,setsar=1[v${i}]`).join(';')};${files.map((_,i)=>`[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${lay}`,'-frames:v','1',out]);
 console.log('wrote',out);
})();
