const puppeteer=require('puppeteer-core'),path=require('path');(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage();await p.goto('file://'+path.resolve(__dirname,'../anim.html'));
console.log((await p.evaluate(()=>RUNS.map(r=>[r.a,r.b,r.t0.toFixed(2),r.t1.toFixed(2)]))).map(x=>x.join(',')).join(' | '));await b.close()})();
