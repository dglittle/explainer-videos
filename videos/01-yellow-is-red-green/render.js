// "seen reddish-green?" v0.2 renderer. Usage: node render.js <take-id> [--yellow 2.25] [--dry] [--out f.mp4]
// Reads ~/greg-voice/takes/<id>.{json,webm}, finds where each line really starts/ends (silencedetect),
// time-warps anim.html to the voice, and adds silence after line 10 so the straight red→green path can uncover.
const puppeteer=require('puppeteer-core'), {spawn,execFileSync}=require('child_process'), fs=require('fs');
const FF=process.env.HOME+'/bin/ffmpeg', FPS=30, args=process.argv.slice(2);
const opt=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const id=args[0], dry=args.includes('--dry'), out=opt('--out',`${id}.mp4`);
const TD=process.env.HOME+'/greg-voice/takes/', meta=JSON.parse(fs.readFileSync(TD+id+'.json')), AUD=TD+id+'.webm';
let log; try{log=execFileSync('bash',['-c',`${FF} -hide_banner -i ${AUD} -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1`]).toString()}catch(e){log=e.stdout+''}
const S0=[...log.matchAll(/silence_start: (-?[\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map(m=>[+m[1],+m[2]]);
const S=[]; for(const x of S0){const l=S[S.length-1]; if(l&&x[0]-l[1]<0.05) l[1]=x[1]; else S.push([...x])}   // merge pauses split by a tiny blip
const dur=meta.duration;
const onset=t=>{const s=S.find(([a,b])=>a<=t+0.6&&t<b); return s?s[1]:t};       // a press just before a pause = the line starts after it
const speechEnd=t=>{let e=t; for(const [a,b] of S){ if(b<=t+0.01) e=a; else if(a<t&&b>t) e=a } return e};  // last speech before t
const cues=meta.cues.filter((c,i,a)=>!(i>0&&a[i-1].line===c.line));             // a 2nd press on the same line = end mark
if(cues.length!==11) throw Error('expected 11 lines, got '+cues.length);
const on=cues.map(c=>onset(c.t)), en=on.map((o,i)=>i<10?speechEnd(on[i+1]):Math.min(dur,speechEnd(dur+1)));
const yellow=+opt('--yellow',en[0]-0.4);
// [audio time, anim time]
let A=[[Math.max(0,on[0]-0.9),0],[yellow,2.65],[on[1],4.3],
 [en[1]+0.2,7.0],[Math.min(on[2]+0.9,en[2]),9.2],[en[2]+0.15,10.6],[Math.min(en[2]+0.85,on[3]-0.1),11.3],
 [on[3],12.0],[on[4],16.2],[on[5],20.7],[on[6],25.1],[on[7],29.7],[on[8],34.2],[on[9],38.6],
 [en[9]+0.1,43.6],[on[10],48.4],[en[10],53.5],[en[10]+2.5,56]];
const A0=A[0][0], P=en[9]+0.2, GAP=Math.max(0,4.8-(on[10]-(en[9]+0.1)));
const o=a=>a-A0+(a>=P?GAP:0);                                                   // audio time → output time
A=A.map(([a,t])=>[o(a),t]);
for(let i=1;i<A.length;i++) if(A[i][0]<=A[i-1][0]+0.05) A[i][0]=A[i-1][0]+0.05;
const warp=x=>{for(let i=1;i<A.length;i++)if(x<=A[i][0]){const[p,q]=[A[i-1],A[i]];return p[1]+(q[1]-p[1])*(x-p[0])/(q[0]-p[0])}return 56};
const DUR=A[A.length-1][0], N=Math.round(DUR*FPS);
console.log('lines',on.map((x,i)=>`${x.toFixed(2)}-${en[i].toFixed(2)}`).join(' '),'\nyellow',yellow,'gap',GAP.toFixed(2),'at audio',P.toFixed(2),
 '\nanchors (out→anim)',A.map(([a,b])=>`${a.toFixed(2)}→${b}`).join(' '),'\nvideo',DUR.toFixed(1),'s');
if(dry) process.exit(0);
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const pg=await b.newPage(); pg.on('pageerror',e=>console.error('PAGE ERROR',e.message));
 await pg.goto('file://'+__dirname+'/anim.html');
 const shot=async x=>{const u=await pg.evaluate(t=>{drawFrame(t);return cv.toDataURL('image/jpeg',0.93)},warp(x));return Buffer.from(u.split(',')[1],'base64')};
 const af='aformat=sample_rates=48000:channel_layouts=mono';
 const ff=spawn(FF,['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',''+FPS,'-c:v','mjpeg','-i','-','-i',AUD,'-filter_complex',
  `[1:a]${af},atrim=start=${A0}:end=${P},asetpts=PTS-STARTPTS,afade=t=in:d=0.2[a1];[1:a]${af},atrim=start=${P},asetpts=PTS-STARTPTS[a2];`+
  `anullsrc=r=48000:cl=mono,atrim=duration=${GAP.toFixed(3)}[s];[a1][s][a2]concat=n=3:v=0:a=1,apad[a]`,
  '-map','0:v','-map','[a]','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
 for(let i=0;i<N;i++){const buf=await shot(i/FPS); if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r)); if(i%300==0)console.log('frame',i,'/',N)}
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('done',out);
})();
