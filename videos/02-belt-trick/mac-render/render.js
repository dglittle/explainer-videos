// spinor v2 "magic trick" renderer. Usage: node render.js <take.webm> <take.json> [--dry] [--out f.mp4] [--fps 30]
// Finds where each line really starts/ends (silencedetect), time-warps anim.html to the voice, and inserts
// silence after "twice." (room for the 2nd turn) and after "here we go!" (room for the 10 s trick).
// Env: CHROME (browser path), FF (ffmpeg path), PUPPETEER (puppeteer-core module path) — defaults are this server's.
const path=require('path'), {spawn,execFileSync}=require('child_process'), fs=require('fs');
const puppeteer=require(process.env.PUPPETEER||'puppeteer-core');
const FF=process.env.FF||process.env.HOME+'/bin/ffmpeg', CHROME=process.env.CHROME||'/usr/bin/chromium';
const args=process.argv.slice(2), opt=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const [AUD,META]=args, dry=args.includes('--dry'), out=opt('--out','spinor-v2.mp4'), FPS=+opt('--fps',30);
const meta=JSON.parse(fs.readFileSync(META)), dur=meta.duration;
let log; try{log=execFileSync(FF,['-hide_banner','-i',AUD,'-af','silencedetect=noise=-35dB:d=0.25','-f','null','-'],{stdio:['ignore','pipe','pipe']}).toString()}catch(e){log=(e.stderr||'')+''}
if(!/silence_end/.test(log)) log=execFileSync('bash',['-c',`"${FF}" -hide_banner -i "${AUD}" -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1`]).toString();
const S0=[...log.matchAll(/silence_start: (-?[\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map(m=>[+m[1],+m[2]]);
const S=[]; for(const x of S0){const l=S[S.length-1]; if(l&&x[0]-l[1]<0.2) l[1]=x[1]; else S.push([...x])}   // a <0.2 s blip (click, breath) doesn't count as speech
const onset=t=>{const s=S.find(([a,b])=>a<=t+0.6&&t<b); return s?s[1]:t};          // a press just before a pause = the line starts after it
const speechEnd=t=>{let e=t; for(const [a,b] of S){ if(b<=t+0.01) e=a; else if(a<t&&b>t) e=a } return e};
const cues=meta.cues.filter((c,i,a)=>!(i>0&&a[i-1].line===c.line));                // a 2nd press on the same line = end mark
if(cues.length!==11) throw Error('expected 11 lines, got '+cues.length);
const on=cues.map(c=>onset(c.t)), en=on.map((o,i)=>i<10?speechEnd(on[i+1]):Math.min(dur,speechEnd(dur+1)));
// inserted silences: [audio time, seconds]
const A0=Math.max(0,on[0]-0.9);
const G=[[en[4]+0.05, Math.max(0,on[4]+4.4-on[5])],            // "twice." → the 2nd turn (~2.6 s), the seam closing, the gold fading
         [en[9]+0.1,  Math.max(0,en[9]+0.4+10.3-on[10])]];      // "here we go!" → the 10 s trick, then "Tada!"
const o=a=>a-A0+G.reduce((s,[p,g])=>s+(a>=p?g:0),0);           // audio time → output time
// [output time, anim time]
let A=[[o(A0),0],[o(on[0]),0.5],[o(on[1]),3.5],[o(on[2])-0.3,9.8],[o(on[2]),10.3],[o(en[2]),13.8],
 [o(on[3])-0.5,14.0],[o(on[3]),14.8],[o(on[3])+0.2,15.0],[o(en[3])+0.2,19.6],                     // seam opens, 1st turn while he says it
 [o(on[4])-0.15,20.2],[o(on[4])+2.6,23.6],[o(on[4])+3.2,24.5],                                     // "twice": 2nd turn, seam closes
 [o(on[5])-0.3,25.3],[o(on[5]),25.6],[o(en[5]),27.9],[o(on[6]),28.2],[o(on[7]),33.0],[o(en[7]),38.6],
 [o(on[8]),38.8],[o(en[8]),46.3],[o(on[9]),46.6],[o(en[9]),49.6],[o(en[9])+0.4,50.0],[o(en[9])+10.4,60.0],
 [o(on[10]),60.3],[o(en[10])+2.5,63]];
for(let i=1;i<A.length;i++) if(A[i][0]<=A[i-1][0]+0.05) A[i][0]=A[i-1][0]+0.05;
for(let i=1;i<A.length;i++) if(A[i][1]<A[i-1][1]) throw Error('anim times out of order at '+i);
const warp=x=>{for(let i=1;i<A.length;i++)if(x<=A[i][0]){const[p,q]=[A[i-1],A[i]];return p[1]+(q[1]-p[1])*(x-p[0])/(q[0]-p[0])}return 63};
const DUR=A[A.length-1][0], N=Math.min(Math.round(DUR*FPS),+opt('--max',1e9));   // --max N: test renders
console.log('lines',on.map((x,i)=>`${x.toFixed(2)}-${en[i].toFixed(2)}`).join(' '),'\ngaps',G.map(([p,g])=>`${g.toFixed(2)}s at audio ${p.toFixed(2)}`).join(', '),
 '\nanchors (out→anim)',A.map(([a,b])=>`${a.toFixed(2)}→${b}`).join(' '),'\nvideo',DUR.toFixed(1),'s,',N,'frames');
if(dry) process.exit(0);
(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:true,protocolTimeout:600000,args:['--no-sandbox','--ignore-gpu-blocklist','--enable-gpu-rasterization']});
 const pg=await b.newPage(); pg.on('pageerror',e=>console.error('PAGE ERROR',e.message));
 await pg.goto('file://'+path.join(__dirname,'anim.html'),{waitUntil:'load',timeout:120000});
 console.log('GL renderer:',await pg.evaluate(()=>{const g=document.createElement('canvas').getContext('webgl'),x=g.getExtension('WEBGL_debug_renderer_info');return x?g.getParameter(x.UNMASKED_RENDERER_WEBGL):'?'}));
 const shot=async x=>{const u=await pg.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/jpeg',0.93)},warp(x));return Buffer.from(u.split(',')[1],'base64')};
 const af='aformat=sample_rates=48000:channel_layouts=mono';
 // audio: cut at the gap points, put silence in between
 const pts=[A0,...G.map(g=>g[0])], parts=[]; let fc='';
 pts.forEach((p,i)=>{const e=i<G.length?G[i][0]:null;
  fc+=`[1:a]${af},atrim=start=${p}${e!=null?':end='+e:''},asetpts=PTS-STARTPTS${i==0?',afade=t=in:d=0.2':''}[a${i}];`; parts.push(`[a${i}]`);
  if(i<G.length){fc+=`anullsrc=r=48000:cl=mono,atrim=duration=${G[i][1].toFixed(3)}[s${i}];`; parts.push(`[s${i}]`)}});
 fc+=`${parts.join('')}concat=n=${parts.length}:v=0:a=1,apad[a]`;
 const ff=spawn(FF,['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',''+FPS,'-c:v','mjpeg','-i','-','-i',AUD,'-filter_complex',fc,
  '-map','0:v','-map','[a]','-vf','scale=out_range=tv:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-colorspace','bt709','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let i=0;i<N;i++){const buf=await shot(i/FPS); if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(i%150==0)console.log('frame',i,'/',N,((Date.now()-t0)/1000).toFixed(0)+'s')}
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('done',out,((Date.now()-t0)/1000).toFixed(0)+'s');
})();
