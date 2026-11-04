// node tools/stills.js <page.html> <outprefix>  — screenshots at 0,180,360,540,720 deg
const puppeteer=require('puppeteer-core');
(async()=>{
 const [page,out]=process.argv.slice(2);
 const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage(); await pg.setViewport({width:960,height:540});
 pg.on('pageerror',e=>console.error('ERR',e.message));
 await pg.goto('file://'+require('path').resolve(page)); await new Promise(r=>setTimeout(r,1500));
 for(const a of [0,180,360,540,720]){
  await pg.evaluate(a=>{paused=true; angleDeg=a; render();},a);
  await new Promise(r=>setTimeout(r,300));
  await pg.screenshot({path:`${out}-${a}.png`});
 }
 await b.close();
})();
