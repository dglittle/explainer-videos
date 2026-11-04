// Tiny Poker renderer. Usage: node render.js <take.webm> <take.json> [--dry] [--out f.mp4] [--fps 30] [--max N]
// 1. silencedetect finds where each spoken line really starts/ends.
// 2. Each take line is matched to an anim line by its key phrase (in order), and pinned: speech start → S[i], speech end → E[i].
// 3. Where the anim needs more time between two lines than Greg paused (the wordless holds in SCRIPT), silence is inserted.
// Env: CHROME, FF, PUPPETEER as in spinor-v2. Pure 2-D canvas, so rendering on this box (no GPU) is fine.
const path=require('path'),{spawn,execFileSync}=require('child_process'),fs=require('fs');
const puppeteer=require(process.env.PUPPETEER||'puppeteer-core');
const FF=process.env.FF||process.env.HOME+'/bin/ffmpeg', CHROME=process.env.CHROME||'/usr/bin/chromium';
const args=process.argv.slice(2), opt=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const [AUD,META]=args, dry=args.includes('--dry'), out=opt('--out','tiny-poker.mp4'), FPS=+opt('--fps',30);
const meta=JSON.parse(fs.readFileSync(META)), dur=meta.duration;
// the engine's timeline
const anim=fs.readFileSync(path.join(__dirname,'anim.html'),'utf8');
const {SCRIPT,S,E,T}=new Function(anim.slice(anim.indexOf('// ==== ENGINE START'),anim.indexOf('// ==== ENGINE END'))+';return {SCRIPT,S,E,T}')();
// speech intervals
let log=execFileSync('bash',['-c',`"${FF}" -hide_banner -i "${AUD}" -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1`]).toString();
const S0=[...log.matchAll(/silence_start: (-?[\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map(m=>[+m[1],+m[2]]);
const tail=log.match(/silence_start: ([\d.]+)(?![\s\S]*silence_end)/); if(tail)S0.push([+tail[1],dur+1]);   // trailing silence
const SIL=[];for(const x of S0){const l=SIL[SIL.length-1];if(l&&x[0]-l[1]<0.2)l[1]=x[1];else SIL.push([...x])}
const onset=t=>{const s=SIL.find(([a,b])=>a<=t+0.6&&t<b);return s?s[1]:t};
const speechEnd=t=>{let e=t;for(const[a,b]of SIL){if(b<=t+0.01)e=a;else if(a<t&&b>t)e=a}return e};
// cues → anim lines (key phrases, in order)
const cues=meta.cues.filter((c,i,a)=>!(i>0&&a[i-1].line===c.line));
const norm=s=>(s||'').toLowerCase().replace(/’/g,"'");
let k=0;const L=cues.map(c=>{const txt=norm(c.text||(meta.script[c.line]||{}).text);
 for(let j=k;j<SCRIPT.length;j++)if(txt.includes(SCRIPT[j][0])){k=j+1;return j}
 throw Error('no anim line for take line '+c.line+': '+txt)});
const on=cues.map(c=>onset(c.t)), en=on.map((o,i)=>i<on.length-1?speechEnd(on[i+1]):Math.min(dur,speechEnd(dur+1)));
// inserted silences [audio time, seconds]: lead-in, and wherever the anim gap is longer than the spoken gap
// Greg's pace vs the guessed pace: the wordless holds shrink (or grow) by the same factor
const PACE=Math.min(1.2,Math.max(0.6,L.reduce((s,l,i)=>s+en[i]-on[i],0)/L.reduce((s,l)=>s+E[l]-S[l],0)));
const A0=Math.max(0,on[0]-0.6), G=[[A0,Math.max(0,S[L[0]]-(on[0]-A0))]];
for(let i=0;i<L.length-1;i++){const need=(S[L[i+1]]-E[L[i]]-0.35)*PACE, have=on[i+1]-en[i]; if(need>have+0.05)G.push([en[i]+0.05,need-have])}
const o=a=>a-A0+G.reduce((s,[p,g])=>s+(a>=p?g:0),0);
// anchors [output time, anim time]
const A=[[0,0]];
L.forEach((l,i)=>{A.push([o(on[i]),S[l]],[o(en[i]),E[l]])});
const endHold=(T-E[L[L.length-1]])*PACE;A.push([o(en[en.length-1])+endHold,T]);
for(let i=1;i<A.length;i++)if(A[i][0]<=A[i-1][0]+0.02)A[i][0]=A[i-1][0]+0.02;
for(let i=1;i<A.length;i++)if(A[i][1]<A[i-1][1])throw Error('anim times out of order at '+i);
const warp=x=>{for(let i=1;i<A.length;i++)if(x<=A[i][0]){const[p,q]=[A[i-1],A[i]];return p[1]+(q[1]-p[1])*(x-p[0])/(q[0]-p[0])}return T};
const DUR=A[A.length-1][0], N=Math.min(Math.round(DUR*FPS),+opt('--max',1e9));
console.log('matched',L.length,'of',SCRIPT.length,'anim lines', L.length<SCRIPT.length?'(missing: '+SCRIPT.map((s,j)=>L.includes(j)?null:s[0]).filter(Boolean).join(', ')+')':'');
L.forEach((l,i)=>console.log(`  ${String(l).padStart(2)} ${SCRIPT[l][0].padEnd(24)} audio ${on[i].toFixed(2)}-${en[i].toFixed(2)} (${(en[i]-on[i]).toFixed(1)}s, anim ${(E[l]-S[l]).toFixed(1)}s) → out ${o(on[i]).toFixed(2)}`));
console.log('pace',PACE.toFixed(2),'(speech/anim); holds scaled by it');
console.log('silences',G.filter(g=>g[1]>0).map(([p,g])=>`${g.toFixed(2)}s@${p.toFixed(2)}`).join(' '),'\nvideo',DUR.toFixed(1),'s,',N,'frames');
if(dry)process.exit(0);
(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:true,protocolTimeout:600000,args:['--no-sandbox']});
 const pg=await b.newPage();pg.on('pageerror',e=>console.error('PAGE ERROR',e.message));
 await pg.goto('file://'+path.join(__dirname,'anim.html'),{waitUntil:'load',timeout:120000});
 const shot=async x=>{const u=await pg.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/jpeg',0.92)},warp(x));return Buffer.from(u.split(',')[1],'base64')};
 const af='aformat=sample_rates=48000:channel_layouts=mono';
 // audio: cut at the silence points, put silence in between (the lead-in silence goes first)
 const Gs=G.filter(g=>g[1]>0.001), parts=[];let fc='';
 const cuts=[A0,...Gs.map(g=>g[0]).filter(p=>p>A0)], pre=Gs.find(g=>g[0]<=A0);
 if(pre){fc+=`anullsrc=r=48000:cl=mono,atrim=duration=${pre[1].toFixed(3)}[p0];`;parts.push('[p0]')}
 const mids=Gs.filter(g=>g[0]>A0);
 cuts.forEach((p,i)=>{const e=i<mids.length?mids[i][0]:null;
  fc+=`[1:a]${af},atrim=start=${p}${e!=null?':end='+e:''},asetpts=PTS-STARTPTS${i==0?',afade=t=in:d=0.15':''}[a${i}];`;parts.push(`[a${i}]`);
  if(i<mids.length){fc+=`anullsrc=r=48000:cl=mono,atrim=duration=${mids[i][1].toFixed(3)}[s${i}];`;parts.push(`[s${i}]`)}});
 fc+=`${parts.join('')}concat=n=${parts.length}:v=0:a=1,apad[a]`;
 const ff=spawn(FF,['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',''+FPS,'-c:v','mjpeg','-i','-','-i',AUD,'-filter_complex',fc,
  '-map','0:v','-map','[a]','-vf','scale=out_range=tv:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-colorspace','bt709','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let i=0;i<N;i++){const buf=await shot(i/FPS);if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(i%300==0)console.log('frame',i,'/',N,((Date.now()-t0)/1000).toFixed(0)+'s')}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out,((Date.now()-t0)/1000).toFixed(0)+'s');
})();
