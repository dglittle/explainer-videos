// end-to-end: fake mic → record → step lines → stop → upload; prints the take id
const p=require('puppeteer-core');(async()=>{
 const b=await p.launch({protocolTimeout:600000,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required']});
 const g=await b.newPage(); const errs=[]; g.on('pageerror',e=>errs.push(e.message));
 const U='https://bloop.monster/<shelf>/spinor-v2-voice.html';
 await g.evaluateOnNewDocument(()=>localStorage.setItem('sp2-frames','off')); await g.goto(U,{waitUntil:'load',timeout:120000});
 await g.evaluate(()=>{document.getElementById('count').checked=false});
 await g.click('#rec'); await new Promise(r=>setTimeout(r,1500));
 for(let i=0;i<11;i++){await new Promise(r=>setTimeout(r,500)); await g.keyboard.press('Space')}
 await new Promise(r=>setTimeout(r,800)); await g.click('#stop'); await new Promise(r=>setTimeout(r,2500));
 const ids=await g.evaluate(()=>[...document.querySelectorAll('#takes .up')].length);
 await g.evaluate(()=>{const i=document.querySelector('#takes input'); if(i)i.value='TEST by Claude, delete me'; document.querySelector('#takes .up').click()});
 await new Promise(r=>setTimeout(r,5000));
 console.log('takes',ids, await g.evaluate(()=>document.querySelector('#takes .st')?.textContent), '| server:', await g.evaluate(()=>document.getElementById('server').textContent.slice(0,200)), errs);
 await b.close()})();
