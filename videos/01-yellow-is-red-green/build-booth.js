// Builds the "seen reddish-green?" voice-over booth: the v0.1 booth (studio2.orig.html) with the new script,
// its own storage, and per-line start/middle/end frames drawn by the SAME engine code as anim.html.
// node build-booth.js > booth.html
const fs=require('fs');
const anim=fs.readFileSync(__dirname+'/anim.html','utf8'), st=fs.readFileSync(__dirname+'/studio2.orig.html','utf8');
const a0=anim.indexOf('// ==== ENGINE START'), a1=anim.indexOf('// ==== ENGINE END');
if(a0<0||a1<0) throw Error('engine markers not found');
const core=anim.slice(a0,a1);
const DEFAULT=`(a red and a green circle slide together · they touch on "yellow", and the overlap turns yellow)
Red and green make yellow.
(the red and green parts slide apart · the yellow overlap stays put, and each circle is left with a bite missing)
But it doesn't look like red or green,
(zoom into the yellow, down to the video's real pixels · after the line, a quick zoom back out)
even though it is red and green.
(the three shapes morph into the corners of a fogged diamond: yellow top, red left, green right, black bottom)
So here's what I think is going on.
(the fog lifts along the edge from red up to yellow)
We're currently going from red to yellow by increasing green,
(…and along the edge from yellow down to green)
and then going from yellow to green by decreasing red.
(lines of equal brightness appear, brighter going up)
But brightness increases with more light of any color,
(red and green sit on the 1× line · yellow is up at 2×)
so yellow is actually twice as bright as red or green.
And I know it seems like brightness shouldn't matter for what a color looks like,
(after this line, pause while the straight path from red to green uncovers · a short breath is fine, the edit will make room)
but watch what happens if we go directly from red to green with equal brightness.
(a ring around the center, which reads rgb(128, 128, 0) · after the line, wait a beat, then Stop)
And there in the center is a color that, to me, actually looks like reddish-green.`;
const engine=`
// ---- video frames: the drawing code below is copied verbatim from anim.html (the page the video renders from) ----
const VID=(()=>{const cv=Object.assign(document.createElement('canvas'),{width:1920,height:1080}), ctx=cv.getContext('2d');
${core}
return {frame:drawFrame};})();
// each spoken line ↔ [key phrase, [anim times of its 3 frames], [their labels]]
const VKEYS=[['make yellow',[0.9,2.65,3.9],['start','touch','end']],["doesn't look like",[4.3,5.5,6.9]],['even though',[7.3,9.6,11.4],['start','zoomed in','zoomed out']],
 ['going on',[12.0,13.6,15.9]],['increasing green',[16.3,18.3,20.3]],['decreasing red',[20.8,22.7,24.8]],['brightness increases',[25.4,27.5,29.4]],
 ['twice as bright',[29.8,31.5,33.8]],["shouldn't matter",[34.3,36.5,38.3]],['equal brightness',[38.8,43.5,47.9],['start','end of line','after the pause']],
 ['reddish-green',[48.4,50.5,55.5]]];
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
rep('<title>yellow is red-green · voice-over booth v2</title>','<title>seen reddish-green? · voice-over booth</title>');
rep('<h1>yellow is <b>red-green</b> · voice-over booth <span class=small>v2 · Pikachu ending</span></h1>',
 '<h1>seen <b>reddish-green</b>? · voice-over booth <span class=small>v0.2 script · Oct-19 · <a href="seen-reddish-green.html" style="color:#888">the animation</a></span></h1>');
rep("Reset to Greg's Oct-12 v2 script","Reset to the Oct-19 script");
rep("'yv2-script'","'rg2-script'",true);
rep("'yellow-voice-2'","'reddish-voice'");
rep('`yellow2-${','`reddish-${');
rep('t.id.slice(7)','t.id.slice(8)');
const d0=out.indexOf('const DEFAULT=`'), d1=out.indexOf('`;',d0);
out=out.slice(0,d0)+'const DEFAULT=`'+DEFAULT+out.slice(d1);
// only list this video's takes from the server
rep("$('server').innerHTML=j.length?","j=j.filter(x=>x.id.startsWith('reddish-'));$('server').innerHTML=j.length?");
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
 "$('vbig').onclick=()=>$('vbig').style.display='none';\n$('frames').checked=localStorage.getItem('rg2-frames')!=='off';document.body.classList.toggle('nof',!$('frames').checked);\n$('frames').onchange=e=>{localStorage.setItem('rg2-frames',e.target.checked?'on':'off');document.body.classList.toggle('nof',!e.target.checked);go(cur,false)};");
rep("addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;",
 "addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;\n if($('vbig').style.display=='flex'&&e.key=='Escape'){$('vbig').style.display='none';return}");
process.stdout.write(out);
