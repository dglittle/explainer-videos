const p=require(process.env.HOME+'/core/node_modules/puppeteer-core');
(async()=>{const b=await p.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const pg=await b.newPage();const e=[];pg.on('pageerror',x=>e.push(x.message));pg.on('console',m=>m.type()=='error'&&e.push(m.text()));
 await pg.setViewport({width:1000,height:575});
 const dl='/tmp/edit-dl';require('fs').mkdirSync(dl,{recursive:true});
 const cdp=await pg.target().createCDPSession();await cdp.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:dl}).catch(()=>cdp.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:dl}));
 await pg.goto('file://'+__dirname+'/edit.html');await new Promise(r=>setTimeout(r,1500));
 const st=()=>pg.evaluate(()=>SECS.map(c=>`${c.key}:${c.in}-${c.out}/${c.n} rs${c.vid.readyState}`).join(' '));
 console.log('start',await st());
 // drag the right edge of section 3 (fail) inward to ~70%
 const r=await pg.evaluate(()=>{const x=SECS[2].blk.getBoundingClientRect();return {l:x.left,w:x.width,t:x.top,h:x.height}});
 await pg.mouse.move(r.l+r.w*0.99,r.t+r.h/2);await pg.mouse.down();await pg.mouse.move(r.l+r.w*0.7,r.t+r.h/2,{steps:5});await pg.mouse.up();
 console.log('after drag',await st());
 await pg.keyboard.press('1');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');
 await pg.keyboard.down('Shift');await pg.keyboard.press('ArrowLeft');await pg.keyboard.up('Shift');
 console.log('after keys',await st());
 // play all and sample which section is showing over time
 await pg.click('#playAll');const seen=[];const t0=Date.now();
 while(Date.now()-t0<24500){const s=await pg.evaluate(()=>{const c=SECS.find(c=>c.vid.classList.contains('on'));return playing?`${c.key}@${$('clock').textContent.split(' ')[0]} v${c.vid.currentTime.toFixed(2)} ${c.aud?(c.aud.paused?'aud-paused':'aud-'+c.aud.currentTime.toFixed(2)):'silent'}`:'stopped'});if(seen[seen.length-1]!==s.split('@')[0]+(s=='stopped'?'':''))seen.push(s);await new Promise(r=>setTimeout(r,700));}
 console.log(seen.join('\n'));
 await pg.screenshot({path:'edit-shot.png'});
 await pg.click('#save');await new Promise(r=>setTimeout(r,800));
 console.log('download:',require('fs').readdirSync(dl).join(','), require('fs').existsSync(dl+'/crystal-trims.json')?require('fs').readFileSync(dl+'/crystal-trims.json','utf8').replace(/\s+/g,' '):'');
 await pg.evaluate(()=>localStorage.clear());
 console.log('errors',e);await b.close()})();
