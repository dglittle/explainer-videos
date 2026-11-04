// Builds the quantum-computation voice-over booth from studio2.orig.html (the yellow/spinor booth).
// The script and the start/middle/end frames per line come from anim.html's engine (SCRIPT, VK), so they can't drift.
// node build-booth.js > booth.html
const fs=require('fs');
const anim=fs.readFileSync(__dirname+'/anim.html','utf8'), st=fs.readFileSync(__dirname+'/studio2.orig.html','utf8');
const a0=anim.indexOf('// ==== ENGINE START'), a1=anim.indexOf('// ==== ENGINE END');
if(a0<0||a1<0) throw Error('engine markers not found');
const core=anim.slice(a0,a1);
const {SCRIPT}=new Function(core+';return {SCRIPT}')();
// stage directions (shown above the line they precede)
const DIR={'my understanding':'lots of little vector × matrix machines fill the screen (1s hopping, arrows turning) · title: quantum computation',
 'long tape':'the swarm zooms away · a long tape of 0s and 1s, a head moving and writing','tape is finite':'all but 3 cells fly off; the tape 011 goes top-left (a beat for the small note)',
 'rather funny way':'“a step of computation, the funny way”','could possibly be in':'the 8 states 000…111 list along the bottom, left to right · 3 cells → 2³ = 8 (a beat for the note)',
 'except a single':'the vector, a row: 0s, and a 1 at 011, linked to the tape','giant square matrix':'the 8×8 matrix appears up and to the right; the 1 goes up, right along its row to the matrix’s 1, and down into the result row: 100 · it slides left, once more: 101 (a long beat)',
 'relax the':'the 1 spreads into ½, −½, ½, −½ · the sum of squares = 1','complex too':'two of them turn into ½i, −½i (arrows rotate) · |z|² = z·z̄ (a long beat)',
 'also require':'the matrix turns into arrows (U); the vector goes up, along the rows, and down into the result; length in = length out = 1.000 (a long beat)',
 'called unitary':'OPTIONAL line, my suggestion: say it in your words or skip it (then its note plays silently): unitary ⇒ reversible, erasing breaks length 1, Bennett 1973',
 'when we look':'OPTIONAL line, my suggestion: probability bars |aᵢ|², we see 111, the vector snaps back to a single 1',
 'sort of the turing':'the machine keeps running · “the Turing machine of quantum computation” · small note on gates',
 'boils down':'the swarm comes back · vector ← vector·U · the related-reading credit · hold a beat, then Stop'};
const DEFAULT=SCRIPT.map(([k,t])=>(DIR[k]?`(${DIR[k]})\n`:'')+t).join('\n');
const engine=`
// ---- video frames: the drawing code below is copied verbatim from anim.html (the page the video renders from) ----
const VID=(()=>{const cv=Object.assign(document.createElement('canvas'),{width:1920,height:1080}), ctx=cv.getContext('2d');
${core}
return {frame:drawFrame,VK};})();
function vspan(text){const s=text.toLowerCase().replace(/’/g,"'"); const k=VID.VK.find(k=>s.includes(k[0])); if(!k)return null;
 return k[1].map((t,i)=>[t,['start','middle','end'][i]])}
let vjob=0;
function paintFrames(){const job=++vjob, q=[...document.querySelectorAll('canvas.vf')];
 const step=()=>{if(job!==vjob||!q.length)return; const c=q.shift(), g=c.getContext('2d'); g.imageSmoothingQuality='high';
  g.drawImage(VID.frame(+c.dataset.t),0,0,c.width,c.height); setTimeout(step,0)}; step()}
function zoomFrame(t,lab){const o=$('vbig'); o.style.display='flex'; const c=o.querySelector('canvas'), g=c.getContext('2d');
 g.imageSmoothingQuality='high'; g.drawImage(VID.frame(t),0,0,c.width,c.height); o.querySelector('span').textContent=lab+' · anim t = '+t.toFixed(1)+' s'}
`;
let out=st;
const rep=(a,b,all)=>{if(!out.includes(a))throw Error('missing: '+a.slice(0,60)); out=all?out.split(a).join(b):out.replace(a,b)};
rep('<title>yellow is red-green · voice-over booth v2</title>','<title>quantum computation · voice-over booth</title>');
rep('<h1>yellow is <b>red-green</b> · voice-over booth <span class=small>v2 · Pikachu ending</span></h1>',
 '<h1><b>Quantum computation, the vector × matrix way</b> · voice-over booth <span class=small>Oct-24 script · <a href="qc-anim.html" style="color:#888">the animation</a></span></h1>');
rep('h1 b{background:linear-gradient(90deg,#f00,#808000,#0f0);-webkit-background-clip:text;color:transparent}','h1 b{color:#ffd166}');
rep("Reset to Greg's Oct-12 v2 script","Reset to the quantum script");
rep('(what Crystal can get)','(what the renderer can get)');
rep('note for Crystal (optional)','note (optional)');
rep("'yv2-script'","'qc1-script'",true);
rep("'yellow-voice-2'","'qc-voice-1'");
rep('`yellow2-${','`qc1-${');
const d0=out.indexOf('const DEFAULT=`'), d1=out.indexOf('`;',d0);
out=out.slice(0,d0)+'const DEFAULT=`'+DEFAULT.replace(/`/g,"'")+out.slice(d1);
rep("$('server').innerHTML=j.length?","j=j.filter(x=>x.id.startsWith('qc1-'));$('server').innerHTML=j.length?");
rep("const j=await","let j=await");
rep('</style>',`.ln{display:flex;align-items:center;gap:18px}.ln .tx{flex:1}
.vth{display:flex;gap:6px;flex:none;opacity:.35;transition:opacity .25s}
.vth figure{margin:0;position:relative}.vth canvas{display:block;width:120px;aspect-ratio:16/9;border-radius:4px;border:1px solid #333;transition:width .25s;cursor:zoom-in}
.vth figcaption{position:absolute;left:4px;bottom:2px;font-size:10px;color:#aaa;text-shadow:0 0 3px #000;font-style:normal}
.ln.cur .vth{opacity:1}.ln.cur .vth canvas{width:220px}
body.nof .vth{display:none}
#vbig{position:fixed;inset:0;background:#000d;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:9;cursor:zoom-out}
#vbig canvas{width:min(92vw,160vh);aspect-ratio:16/9;border:1px solid #444}#vbig span{margin-top:8px;color:#aaa;font-size:13px}
</style>`);
rep('<label class="small"><input type="checkbox" id="count" checked> 3-2-1</label>',
 '<label class="small"><input type="checkbox" id="count" checked> 3-2-1</label>\n <label class="small" title="start / middle / end of what the video shows during each line"><input type="checkbox" id="frames" checked> frames</label>');
rep('<div id="hint">','<div id="vbig"><canvas width="1920" height="1080"></canvas><span></span></div>\n <div id="hint">');
rep("$('lines').innerHTML=LINES.map((l,i)=>`<div class=\"ln\" data-i=\"${i}\">${l.dir?`<span class=\"dir\">${esc(l.dir)}</span>`:''}${esc(l.text)}</div>`).join('');",
 "$('lines').innerHTML=LINES.map((l,i)=>{const v=vspan(l.text);return `<div class=\"ln\" data-i=\"${i}\"><div class=\"tx\">${l.dir?`<span class=\"dir\">${esc(l.dir)}</span>`:''}${esc(l.text)}</div>${v?`<div class=\"vth\">${v.map(([t,n])=>`<figure><canvas class=\"vf\" width=\"384\" height=\"216\" data-t=\"${t}\" data-n=\"${n}\"></canvas><figcaption>${n}</figcaption></figure>`).join('')}</div>`:''}</div>`}).join('');\n [...document.querySelectorAll('canvas.vf')].forEach(c=>c.onclick=e=>{e.stopPropagation();zoomFrame(+c.dataset.t,c.dataset.n)});paintFrames();");
rep("const $=id=>document.getElementById(id);", "const $=id=>document.getElementById(id);\n"+engine+
 "$('vbig').onclick=()=>$('vbig').style.display='none';\n$('frames').checked=localStorage.getItem('qc1-frames')!=='off';document.body.classList.toggle('nof',!$('frames').checked);\n$('frames').onchange=e=>{localStorage.setItem('qc1-frames',e.target.checked?'on':'off');document.body.classList.toggle('nof',!e.target.checked);go(cur,false)};");
rep("addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;",
 "addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;\n if($('vbig').style.display=='flex'&&e.key=='Escape'){$('vbig').style.display='none';return}");
// ---- optional webcam: records a small video with the voice; render.js shows it as a round overlay while Greg speaks ----
rep('<input type="checkbox" id="frames" checked> frames</label>',
 '<input type="checkbox" id="frames" checked> frames</label>\n <label class="small" title="also record a small webcam video (shown in a corner circle while you talk)"><input type="checkbox" id="cam"> camera</label>');
rep('</style>',`#camv{position:fixed;right:18px;top:100px;width:170px;height:170px;border-radius:50%;object-fit:cover;transform:scaleX(-1);border:3px solid #ffd166;display:none;z-index:5;background:#000}
body.camon #camv{display:block}.take video{width:160px;vertical-align:middle;border-radius:6px}
</style>`);
rep('<div id="vbig">','<video id="camv" muted playsinline autoplay title="what the camera sees (mirrored here; the video is not)"></video>\n <div id="vbig">');
rep("stream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:$('mic').value?{exact:$('mic').value}:undefined,echoCancellation:c,noiseSuppression:c,autoGainControl:c,channelCount:1}});",
 "stream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:$('mic').value?{exact:$('mic').value}:undefined,echoCancellation:c,noiseSuppression:c,autoGainControl:c,channelCount:1},\n  video:$('cam').checked?{width:{ideal:640},height:{ideal:480},frameRate:{ideal:30},facingMode:'user'}:false});\n $('camv').srcObject=$('cam').checked?stream:null;");
rep("const mt=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(m=>MediaRecorder.isTypeSupported(m));\n rec=new MediaRecorder(stream,{mimeType:mt,audioBitsPerSecond:160000});",
 "const vid=stream.getVideoTracks().length>0;\n const mt=(vid?['video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/mp4','video/webm']:['audio/webm;codecs=opus','audio/mp4','audio/webm']).find(m=>MediaRecorder.isTypeSupported(m));\n rec=new MediaRecorder(stream,{mimeType:mt,audioBitsPerSecond:160000,...(vid?{videoBitsPerSecond:1200000}:{})});");
rep("const ext=t.blob.type.includes('mp4')?'m4a':'webm';","const ext=t.blob.type.includes('mp4')?(t.blob.type.startsWith('video')?'mp4':'m4a'):'webm';");
rep('<audio controls src="${url}"></audio>',"${t.blob.type.startsWith('video')?`<video controls playsinline src=\"${url}\"></video>`:`<audio controls src=\"${url}\"></audio>`}");
rep("const au=div.querySelector('audio');","const au=div.querySelector('audio,video');");
rep("$('vbig').onclick=()=>$('vbig').style.display='none';",
 "$('vbig').onclick=()=>$('vbig').style.display='none';\n$('cam').checked=localStorage.getItem('qc1-cam')==='on';document.body.classList.toggle('camon',$('cam').checked);\n$('cam').onchange=async e=>{localStorage.setItem('qc1-cam',e.target.checked?'on':'off');document.body.classList.toggle('camon',e.target.checked);\n if(rec&&rec.state==='recording')return;\n if(e.target.checked||stream){try{await openMic()}catch(err){alert('Camera blocked: '+err.message);e.target.checked=false;document.body.classList.remove('camon')}}};\nif($('cam').checked)setTimeout(()=>openMic().catch(()=>{}),0);");
// record from the highlighted line (so a pickup take can start at the new ending)
rep("go(0,false);\n if($('count').checked)","const from=cur;go(from,false);\n if($('count').checked)");
rep("cues=[{t:0,line:0}];","cues=[{t:0,line:from}];");
rep('<div id="hint">','<div id="hint" title="Record starts at the highlighted line: click a line first to start there">');
// Greg (Oct-24): after Space, a long line could land with its top hidden under the header. Cause: offsetTop was read while
// the font sizes were still animating (the previous line hadn't shrunk yet). Fix: font sizes switch instantly; a tall line is
// moved up so it fits (never above the top); and the wheel/trackpad can nudge the lines by hand (the next line snaps back).
rep('transition:color .25s,font-size .25s}','transition:color .25s}');
rep('.ln{display:flex;align-items:center;gap:18px}.ln .tx{flex:1}','.ln{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}.ln .tx{flex:1 1 420px}');
rep('border:1px solid #333;transition:width .25s;cursor:zoom-in}','border:1px solid #333;cursor:zoom-in;width:min(120px,8vw)}');
rep('.ln.cur .vth canvas{width:220px}','.ln.cur .vth canvas{width:min(220px,14vw)}');
rep("const H=$('stage').clientHeight;$('lines').style.transform=`translateY(${H*0.38-e.offsetTop}px)`;",
 "const H=$('stage').clientHeight;nudge=0;const tx=e.querySelector('.tx')||e;baseY=Math.min(H*0.38-e.offsetTop,Math.max(6,H-tx.offsetHeight-6)-tx.offsetTop);$('lines').style.transform=`translateY(${baseY}px)`;");
rep("function go(i,log=true){","let baseY=0,nudge=0;\naddEventListener('load',()=>$('stage').addEventListener('wheel',ev=>{ev.preventDefault();nudge-=ev.deltaY;\n const L=$('lines'),H=$('stage').clientHeight;nudge=Math.max(-(L.offsetHeight+baseY-H*0.5),Math.min(H*0.5-baseY,nudge));L.style.transform=`translateY(${baseY+nudge}px)`},{passive:false}));\nfunction go(i,log=true){");
process.stdout.write(out);
