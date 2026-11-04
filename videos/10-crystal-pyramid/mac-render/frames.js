// node frames.js SCENE SECONDS OUT.mp4 — render cut-anim.html?scene=SCENE at 30 fps (GPU Chrome) → ffmpeg
const puppeteer=require(process.env.HOME+'/core/node_modules/puppeteer-core');const {spawn}=require('child_process');
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',FF='/opt/homebrew/bin/ffmpeg';
(async()=>{const [scene,secs,out]=process.argv.slice(2);const N=Math.round(+secs*30);
 const b=await puppeteer.launch({executablePath:CHROME,headless:true,protocolTimeout:600000,args:['--no-sandbox','--use-angle=metal','--ignore-gpu-blocklist']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 await pg.goto('file://'+__dirname+'/cut-anim.html?scene='+scene+'&t=0');
 console.log('renderer',await pg.evaluate(()=>{const x=gl.getExtension('WEBGL_debug_renderer_info');return x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):'?'}));
 const ff=spawn(FF,['-v','error','-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-crf','16','-preset','medium','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let i=0;i<N;i++){const u=await pg.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/jpeg',0.95)},i/30);
  if(!ff.stdin.write(Buffer.from(u.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r))}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));
 console.log(scene,N,'frames',((Date.now()-t0)/N).toFixed(0),'ms/frame','errors:',errs);await b.close()})();
