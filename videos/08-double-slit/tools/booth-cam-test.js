// node tools/booth-cam-test.js -> records ~5 s in booth.html with a fake camera+mic, saves chk/camtake.webm, prints the mime
const puppeteer=require('puppeteer-core'),path=require('path'),fs=require('fs');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.setViewport({width:1500,height:950});
 await pg.goto('file://'+path.resolve(__dirname,'../booth.html'));await new Promise(r=>setTimeout(r,2500));
 await pg.click('#cam');await new Promise(r=>setTimeout(r,1500));
 await pg.screenshot({path:path.resolve(__dirname,'../chk/booth-cam.png')});
 await pg.evaluate(()=>{document.getElementById('count').checked=false});await pg.evaluate(()=>startRec());
 for(let i=0;i<3;i++){await new Promise(r=>setTimeout(r,1500));await pg.keyboard.press('Space')}
 await pg.evaluate(()=>stopRec());await new Promise(r=>setTimeout(r,1500));
 const r=await pg.evaluate(()=>new Promise(res=>{store('readonly').getAll().onsuccess=async e=>{const t=e.target.result.pop();const buf=new Uint8Array(await t.blob.arrayBuffer());
  res({type:t.blob.type,cues:t.cues,dur:t.dur,video:!!document.querySelector('.take video'),b64:btoa(Array.from(buf,c=>String.fromCharCode(c)).join(''))})}}));
 fs.writeFileSync(path.resolve(__dirname,'../chk/camtake.webm'),Buffer.from(r.b64,'base64'));
 console.log('type',r.type,'dur',r.dur.toFixed(1),'cues',r.cues.length,'video element',r.video,'errors',errs);await b.close()})();
