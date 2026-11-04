// node tools/glshots.js PAGE t1 t2 ...  -> chk/gl-NN.png (WebGL page exposing drawFrame(t) + cv)
const puppeteer=require('puppeteer-core'),path=require('path'),fs=require('fs');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,
  args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 const [page,...ts]=process.argv.slice(2);
 await pg.goto('file://'+path.resolve(page)+'?still=0'+(process.env.Q||''));
 for(let i=0;i<ts.length;i++){const t0=Date.now();const u=await pg.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/png')},+ts[i]);
  fs.writeFileSync(`chk/gl-${String(i).padStart(2,'0')}.png`,Buffer.from(u.split(',')[1],'base64'));console.log('t',ts[i],Date.now()-t0,'ms')}
 console.log('CHK',await pg.evaluate(()=>JSON.stringify(CHK)),'errors:',errs);await b.close()})();
