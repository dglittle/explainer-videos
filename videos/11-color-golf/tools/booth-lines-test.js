// node tools/booth-lines-test.js [booth.html] [w h] -> presses Space through every line; checks the current line is fully visible in #stage
const puppeteer=require('puppeteer-core'),path=require('path');
(async()=>{const f=process.argv[2]||'booth.html',w=+(process.argv[3]||1000),h=+(process.argv[4]||575);
 const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.setViewport({width:w,height:h});await pg.goto('file://'+path.resolve(__dirname,'..',f));await new Promise(r=>setTimeout(r,800));
 const n=await pg.evaluate(()=>document.querySelectorAll('.ln').length);let bad=0;
 for(let i=0;i<n;i++){if(i)await pg.keyboard.press('Space');await new Promise(r=>setTimeout(r,700));
  const r=await pg.evaluate(()=>{const s=document.getElementById('stage').getBoundingClientRect(),e=document.querySelector('.ln.cur'),t=e.querySelector('.tx')||e,c=t.getBoundingClientRect();
   return{top:Math.round(c.top-s.top),bot:Math.round(s.bottom-c.bottom),H:Math.round(s.height),h:Math.round(c.height)}});
  const ok=r.top>=0&&(r.bot>=0||r.h>r.H);if(!ok)bad++;console.log(i,ok?'ok ':'BAD',JSON.stringify(r))}
 console.log('bad lines:',bad,'errors:',errs);await b.close()})();
