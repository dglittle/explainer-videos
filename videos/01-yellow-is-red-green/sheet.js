// node sheet.js out.jpg t1 t2 ... : frames of anim.html → a contact sheet (and chk/f-<t>.jpg)
const puppeteer=require('puppeteer-core'),fs=require('fs'),{execFileSync}=require('child_process');
const [out,...ts]=process.argv.slice(2);
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const pg=await b.newPage(); pg.on('pageerror',e=>console.error('PAGE ERROR',e.message)); pg.on('console',m=>console.log('console:',m.text()));
 await pg.goto('file://'+__dirname+'/anim.html');
 const files=[];
 for(const t of ts){const r=await pg.evaluate(t=>{const s=performance.now();render(t);const ms=performance.now()-s;ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#000a';ctx.fillRect(0,0,190,80);ctx.fillStyle='#fff';ctx.font='56px monospace';ctx.textAlign='left';ctx.fillText(t,12,60);return {u:cv.toDataURL('image/jpeg',0.9),ms}},+t);
  const f=`chk/f-${t}.jpg`;fs.writeFileSync(f,Buffer.from(r.u.split(',')[1],'base64'));files.push(f);console.log(t,r.ms.toFixed(0)+'ms')}
 await b.close();
 const n=files.length,cols=4,rows=Math.ceil(n/cols);
 execFileSync(process.env.HOME+'/bin/ffmpeg',['-y','-loglevel','error',...files.flatMap(f=>['-i',f]),'-filter_complex',
  files.map((f,i)=>`[${i}]scale=480:270[v${i}]`).join(';')+';'+
  files.map((f,i)=>`[v${i}]`).join('')+`xstack=inputs=${n}:layout=`+files.map((f,i)=>`${(i%cols)*480}_${Math.floor(i/cols)*270}`).join('|')+(n<cols*rows?':fill=gray':''),'-frames:v','1',out]);
})();
