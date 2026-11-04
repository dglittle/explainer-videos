// Builds the Tiny Poker voice-over booth from studio2.orig.html (the yellow/spinor booth).
// The script and the start/middle/end frames per line come from anim.html's engine (SCRIPT, VK), so they can't drift.
// node build-booth.js > booth.html
const fs=require('fs');
const anim=fs.readFileSync(__dirname+'/anim.html','utf8'), st=fs.readFileSync(__dirname+'/studio2.orig.html','utf8');
const a0=anim.indexOf('// ==== ENGINE START'), a1=anim.indexOf('// ==== ENGINE END');
if(a0<0||a1<0) throw Error('engine markers not found');
const core=anim.slice(a0,a1);
const {SCRIPT}=new Function(core+';return {SCRIPT}')();
// stage directions (shown above the line they precede)
const DIR={'is bluffing':'title: Tiny Poker, four cards fan in','one through four':'the table: two players, the four cards, a deal: 3 vs 1',
 'one more chip':'the game tree grows as you describe it','whole game':'the payoffs appear at the ends of the branches · the edit leaves a beat after this line',
 'plan for':'the small blind’s plan, one choice per card','four to the fourth':'the choices flicker through random strategies',
 'twelve ways':'one strategy for each, the 12 deals fill in one by one (~3 s after you finish; the edit makes room)',
 'payoff matrix':'the 256 × 256 heat map fills in','have to pick':'weights x appear next to the rows','times the matrix':'weights y on top of the columns',
 'pessimistic':'the big blind picks the column that’s worst for us','linear program':'the linear program, written out',
 'just three':'the weights slide from random to the solution: three spikes','human strategy':'the plan per card, 4 → 3 → 2 as you say them',
 'worst card':'the 1: fold ⅔ / raise ⅓ · BLUFF stamp','bluffs too':'the big blind’s plan, its own BLUFF stamp',
 'why one third':'you are the big blind with a 3','with every four':'nine equally likely worlds: three 4s raise, one of three 1s bluffs',
 'if you fold':'fold = −2 · call = ¼·(+4) + ¾·(−4) = −2','never bluffs':'bar chart: the small blind’s winnings, 5/36 vs 4/36',
 "isn't allowed":'…vs 12/36 if the big blind can’t bluff','bluffing isn':'the four cards, the 1 glows · hold a beat at the end, then Stop'};
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
rep('<title>yellow is red-green · voice-over booth v2</title>','<title>Tiny Poker · voice-over booth</title>');
rep('<h1>yellow is <b>red-green</b> · voice-over booth <span class=small>v2 · Pikachu ending</span></h1>',
 '<h1><b>Tiny Poker</b> · bluffing is math · voice-over booth <span class=small>Oct-21 script · <a href="poker-anim.html" style="color:#888">the animation</a></span></h1>');
rep('h1 b{background:linear-gradient(90deg,#f00,#808000,#0f0);-webkit-background-clip:text;color:transparent}','h1 b{color:#ffd166}');
rep("Reset to Greg's Oct-12 v2 script","Reset to the Oct-21 script");
rep('(what Crystal can get)','(what the renderer can get)');
rep('note for Crystal (optional)','note (optional)');
rep("'yv2-script'","'poker1-script'",true);
rep("'yellow-voice-2'","'poker-voice-1'");
rep('`yellow2-${','`poker1-${');
const d0=out.indexOf('const DEFAULT=`'), d1=out.indexOf('`;',d0);
out=out.slice(0,d0)+'const DEFAULT=`'+DEFAULT.replace(/`/g,"'")+out.slice(d1);
rep("$('server').innerHTML=j.length?","j=j.filter(x=>x.id.startsWith('poker1-'));$('server').innerHTML=j.length?");
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
 "$('vbig').onclick=()=>$('vbig').style.display='none';\n$('frames').checked=localStorage.getItem('poker1-frames')!=='off';document.body.classList.toggle('nof',!$('frames').checked);\n$('frames').onchange=e=>{localStorage.setItem('poker1-frames',e.target.checked?'on':'off');document.body.classList.toggle('nof',!e.target.checked);go(cur,false)};");
rep("addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;",
 "addEventListener('keydown',e=>{if(e.target.tagName=='TEXTAREA'||e.target.tagName=='INPUT')return;\n if($('vbig').style.display=='flex'&&e.key=='Escape'){$('vbig').style.display='none';return}");
process.stdout.write(out);
