const p=require('puppeteer-core'),path=require('path');(async()=>{
 const b=await p.launch({protocolTimeout:900000,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const g=await b.newPage(); await g.setViewport({width:1400,height:1000}); const errs=[]; g.on('pageerror',e=>errs.push(e.message)); g.on('console',m=>m.type()==='error'&&errs.push(m.text()));
 await g.goto(process.argv[2].startsWith('http')?process.argv[2]:'file://'+path.resolve(process.argv[2]),{waitUntil:'load',timeout:120000});
 const info=await g.evaluate(()=>({lines:document.querySelectorAll('.ln').length, withFrames:document.querySelectorAll('.ln .vth').length, frames:document.querySelectorAll('canvas.vf').length}));
 // wait until the last thumbnail has been painted
 for(let i=0;i<120;i++){const done=await g.evaluate(()=>{const c=[...document.querySelectorAll('canvas.vf')].pop();const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let s=0;for(let k=0;k<d.length;k+=4)s+=d[k];return s>0});if(done)break;await new Promise(r=>setTimeout(r,2000))}
 console.log('ms per frame',await g.evaluate(()=>{const a=performance.now();VID.frame(30);return Math.round(performance.now()-a)}));await g.screenshot({path:'frames/booth.png'}); console.log(info,errs); await b.close()})();
