// node tools/booth-shot.js [line]  -> chk/booth.png (page screenshot with line N current)
const puppeteer=require('puppeteer-core'),path=require('path');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.setViewport({width:1500,height:950});
 await pg.goto('file://'+path.resolve(__dirname,'../booth.html'));
 await new Promise(r=>setTimeout(r,4000));
 const n=+(process.argv[2]||0);if(n)await pg.evaluate(n=>go(n,false),n);await new Promise(r=>setTimeout(r,800));
 console.log('lines:',await pg.evaluate(()=>LINES.length),'thumbs:',await pg.evaluate(()=>document.querySelectorAll('canvas.vf').length));
 await pg.screenshot({path:path.resolve(__dirname,'../chk/booth.png')});console.log('errors:',errs);await b.close()})();
