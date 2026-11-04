// node tools/shots.js [end|mid|t1 t2 ...]  -> chk/NN.png (a frame per line, or at the given anim times)
const puppeteer=require('puppeteer-core'),path=require('path'),fs=require('fs');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 await pg.goto('file://'+path.resolve(__dirname,'../anim.html'));
 const a=process.argv.slice(2);
 let ts=await pg.evaluate(w=>w=='mid'?SCRIPT.map((_,i)=>(S[i]+E[i])/2):SCRIPT.map((_,i)=>E[i]+SCRIPT[i][2]),a[0]||'end');
 if(a.length&&!isNaN(+a[0]))ts=a.map(Number);
 console.log('T=',await pg.evaluate(()=>T));
 fs.mkdirSync(path.resolve(__dirname,'../chk'),{recursive:true});
 for(let i=0;i<ts.length;i++){const u=await pg.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/png')},ts[i]);
  fs.writeFileSync(path.resolve(__dirname,`../chk/${isNaN(+a[0])?(a[0]||"end"):"t"}${String(i).padStart(2,"0")}.png`),Buffer.from(u.split(',')[1],'base64'))}
 console.log('errors:',errs);await b.close()})();
