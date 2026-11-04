// Builds the spinor v2 "magic trick" voice-over booth: the v0.1 booth (studio2.orig.html) with the new script,
// its own storage, and per-line start/middle/end frames drawn by the SAME engine code as anim.html.
// node build-booth.js > booth.html
const fs=require('fs');
const anim=fs.readFileSync(__dirname+'/anim.html','utf8'), st=fs.readFileSync(__dirname+'/studio2.orig.html','utf8');
const a0=anim.indexOf('// ==== ENGINE START'), a1=anim.indexOf('// ==== ENGINE END');
if(a0<0||a1<0) throw Error('engine markers not found');
const core=anim.slice(a0,a1);
const DEFAULT=`(flat rubber chessboard, knight in the middle)
This is a kind of magic trick.
The setup is that we have this rubber chessboard with a knight on it, and we want to do the following thing.
(the camera moves in · the knight's circle lights up gold)
We want to take this circle with the knight on it in the middle,
(a seam opens around the circle, cutting it free · it turns once, clockwise, on its own)
and we're going to rotate it in place all the way around,
(it goes around a second time · the seam closes)
twice.
(the gold fades · the ring around the circle lights up blue)
And this middle portion
will bend like rubber during the rotation, but in the end, it will be relaxed and flat again,
(the blue fades at the end of the line)
with no cheating. Nothing doing math stuff that couldn't happen in real life.
(the plain board, waiting · take your time)
So… do you believe me? Pause the video and try to think of whether you think this would be magical if it could happen.
(after the line, the trick plays for ~10 s · just pause a beat, the edit will make room)
OK… here we go!
(the board is flat again)
Tada!`;
const engine=`
// ---- video frames: the drawing code below is copied verbatim from anim.html (the page the video renders from) ----
const VID=(()=>{const cv=Object.assign(document.createElement('canvas'),{width:1920,height:1080}), ctx=cv.getContext('2d');
${core}
return {frame:drawFrame};})();
// each spoken line ↔ [key phrase, [anim times of its 3 frames], [their labels]]
const VKEYS=[['magic trick',[0.5,2.0,3.4]],['rubber chessboard',[3.6,6.5,9.8]],['this circle',[10.2,11.6,13.8],['start','gold','end']],
 ['all the way around',[14.3,17.3,19.8],['seam opens','half a turn','one turn']],['twice',[20.2,21.9,24.6],['start','1½ turns','seam closed']],
 ['middle portion',[25.2,26.6,27.9],['start','blue','end']],['bend like rubber',[28.2,30.5,32.8]],['no cheating',[33.2,36.0,38.6]],
 ['believe me',[38.8,42.5,46.3]],['here we go',[46.6,48.0,49.9]],['tada',[55.0,60.0,62.5],['360°: the ball','720°: flat','end']]];
function vspan(text){const s=text.toLowerCase().replace(/’/g,"'"); const k=VKEYS.find(k=>s.includes(k[0])); if(!k)return null;
 return k[1].map((t,i)=>[t,(k[2]||['start','middle','end'])[i]])}
let vjob=0;
function paintFrames(){const job=++vjob, q=[...document.querySelectorAll('canvas.vf')];
 const step=()=>{if(job!==vjob||!q.length)return; const c=q.shift(), g=c.getContext('2d'); g.imageSmoothingQuality='high';
  g.drawImage(VID.frame(+c.dataset.t),0,0,c.width,c.height); setTimeout(step,0)}; step()}
function zoomFrame(t,lab){const o=$('vbig'); o.style.display='flex'; const c=o.querySelector('canvas'), g=c.getContext('2d');
 g.imageSmoothingQuality='high'; g.drawImage(VID.frame(t),0,0,c.width,c.height); o.querySelector('span').textContent=lab+' · anim t = '+t.toFixed(1)+' s'}
`;
let out=st;
const rep=(a,b,all)=>{if(!out.includes(a))throw Error('missing: '+a.slice(0,60)); out=all?out.split(a).join(b):out.replace(a,b)};
rep('<title>yellow is red-green · voice-over booth v2</title>','<title>the magic trick · spinor v2 · voice-over booth</title>');
rep('<h1>yellow is <b>red-green</b> · voice-over booth <span class=small>v2 · Pikachu ending</span></h1>',
 '<h1>the <b>magic trick</b> · spinor v2 · voice-over booth <span class=small>Oct-19 script · <a href="spinor-v2-anim.html" style="color:#888">the animation</a></span></h1>');
rep("Reset to Greg's Oct-12 v2 script","Reset to the Oct-19 script");
rep("'yv2-script'","'sp2-script'",true);
rep("'yellow-voice-2'","'spinor2-voice'");
rep('`yellow2-${','`spinor2-${');
rep('t.id.slice(7)','t.id.slice(8)');
const d0=out.indexOf('const DEFAULT=`'), d1=out.indexOf('`;',d0);
out=out.slice(0,d0)+'const DEFAULT=`'+DEFAULT+out.slice(d1);
// only list this video's takes from the server
rep("$('server').innerHTML=j.length?","j=j.filter(x=>x.id.startsWith('spinor2-'));$('server').innerHTML=j.length?");
rep("const j=await","let j=await");
// frames per line (same as the v0.1 booth)
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
 "$('vbig').onclick=()=>$('vbig').style.display='none';\n$('frames').checked=localStorage.getItem('sp2-frames')!=='off';document.body.classList.toggle('nof',!$('frames').checked);\n$('frames').onchange=e=>{localStorage.setItem('sp2-frames',e.target.checked?'on':'off');document.body.classList.toggle('nof',!e.target.checked);go(cur,false)};");
rep("addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;",
 "addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;\n if($('vbig').style.display=='flex'&&e.key=='Escape'){$('vbig').style.display='none';return}");
rep('</main>\n<script>','</main>\n<script src="spinor-knight-mesh.js"></script>\n<script>');
process.stdout.write(out);
