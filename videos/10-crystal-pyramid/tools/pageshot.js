// node tools/pageshot.js PAGE OUT.png [query] — screenshot the whole page (still frame), 1400 px wide
const puppeteer=require('puppeteer-core'),path=require('path');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,
  args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 await pg.setViewport({width:1400,height:600});
 await pg.goto('file://'+path.resolve(process.argv[2])+'?'+(process.argv[4]||'still=2'));
 await pg.screenshot({path:process.argv[3],fullPage:true});
 console.log('CHK',await pg.evaluate(()=>JSON.stringify(CHK)),'errors:',errs);await b.close()})();
