const puppeteer=require('puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const pg=await b.newPage(); await pg.setViewport({width:1440,height:1000});
 pg.on('pageerror',e=>console.error('PAGE ERROR',e.message)); pg.on('console',m=>console.log('console:',m.text()));
 await pg.goto('file://'+__dirname+'/'+process.argv[2]); await new Promise(r=>setTimeout(r,6000));
 if(process.argv[4]) await pg.evaluate(s=>eval(s),process.argv[4]);
 await new Promise(r=>setTimeout(r,1500));
 await pg.screenshot({path:process.argv[3]}); await b.close()})();
