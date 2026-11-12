// node tools/check.js -> loads anim.html headless, prints the math checks, page errors, and key-phrase rules
const puppeteer=require('puppeteer-core'),path=require('path');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
 await pg.goto('file://'+path.resolve(__dirname,'../anim.html'));
 const r=await pg.evaluate(()=>{const keys=SCRIPT.map(s=>s[0]);
  const kp=keys.map((k,i)=>[k,k==k.toLowerCase(),keys.filter(x=>x==k).length==1,SCRIPT.every((s,j)=>j==i||!s[1].toLowerCase().replace(/’/g,"'").includes(k)),SCRIPT[i][1].toLowerCase().includes(k)]).filter(x=>!(x[1]&&x[2]&&x[3]&&x[4]));
  let t0=performance.now();for(let t=0;t<T;t+=0.5)drawFrame(t);const ms=(performance.now()-t0)/(T/0.5);
  return{CHK,BAD,T,lines:SCRIPT.length,keyProblems:kp,msPerFrame:ms.toFixed(1)}});
 console.log(JSON.stringify(r,null,1));console.log('errors:',errs);await b.close()})();
