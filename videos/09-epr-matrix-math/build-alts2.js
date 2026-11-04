// node build-alts2.js > alts2.html — ways to show "where the correlation is" under the final vector, side by side.
// Uses the engine from anim.html (same numbers, same drawing helpers); each option drawn for the 3 button cases.
const fs=require('fs');
const anim=fs.readFileSync(__dirname+'/anim.html','utf8');
const core=anim.slice(anim.indexOf('// ==== ENGINE START'),anim.indexOf('// ==== ENGINE END'));
const page=`<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>EPR as matrix math · options 2: "same" only</title>
<style>body{font:16px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;background:#0b121a;color:#dde6ee;max-width:1500px;margin:24px auto;padding:0 20px}
h1{margin:0 0 4px}.sub{color:#8a99a8;margin-bottom:22px}h2{margin:28px 0 4px;font-size:20px}.d{color:#9fb0c0;margin:0 0 10px;max-width:1100px}
.row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}canvas{width:100%;border-radius:8px;background:#101b26;box-shadow:0 2px 10px #0006}
.cap{font-size:13px;color:#8a99a8;text-align:center;margin-top:2px}</style></head><body>
<h1>Options, round 2: C and D, with just "same"</h1>
<div class="sub">EPR as matrix math · Oct-29 · round 2: only "same" is shown (different = 100% − same). Only 00 and 11 get rings. Each option is drawn for the three button cases. Every number is computed by the same engine as the video. In the video, each would animate in (e.g. squares dropping into place). Pick one, mix two, or tell me what to change.</div>
<div id="opts"></div>
<script>
const cv=document.createElement('canvas'), ctx=cv.getContext('2d');
${core}
const CW=760, CH=380, PAIRS=[[1,1],[0,1],[0,2]], NAMES=['same button','neighbors (top, middle)','top vs bottom'];
const pc=p=>(p*100).toFixed(close(p*100,Math.round(p*100),1e-6)?0:1)+'%';
const SAMEJ=j=>j==0||j==3, colJ=j=>SAMEJ(j)?C.ok:C.bad;
// the final vector, as in the video: cells ringed green (00, 11) / red (01, 10) when not 0
function vec(v,x0,y,s=64){for(let j=0;j<4;j++){const nz=Math.abs(v[j])>1e-9;cell(x0+j*s,y,s,nz?colJ(j):C.gold,{a:1,lit:nz?0.5:0,ring:nz?1:0});num(x0+j*s,y,s,v[j],C.gold,1);sname(j,x0+j*s+s/2,y+s+18,18,1,'center','',2)}}
const X0=(CW-256)/2, VY=26;
// same-only: ring just 00 and 11
function vec2(v,x0,y,s=64){for(let j=0;j<4;j++){const on=SAMEJ(j)&&Math.abs(v[j])>1e-9;cell(x0+j*s,y,s,on?C.ok:C.gold,{a:1,lit:on?0.5:0,ring:on?1:0});num(x0+j*s,y,s,v[j],C.gold,1);sname(j,x0+j*s+s/2,y+s+18,18,1,'center','',2)}}
const sqs=x=>{const f=fmt(x);return(f.includes('/')||x<0?'('+f+')':f)+'²'};
const cxj=j=>X0+j*64+32;
function track(bx,by,bw,bh){rr(bx,by,bw,bh,8);g.fillStyle='#ffffff0d';g.fill();g.strokeStyle='#ffffff26';g.lineWidth=1.5;g.stroke();txt('0%',bx,by+bh+16,13,C.dim,'center','',1);txt('100%',bx+bw,by+bh+16,13,C.dim,'center','',1)}
const OPTS=[
['C1 · a 100% track, with just the "same" part filled','The two squares (00 and 11) drop into one bar that is 100% long; they fill it part way, and the filled length is the answer.',(v)=>{vec2(v,X0,VY);
 const bx=120,bw=CW-240,by=VY+160,bh=50;track(bx,by,bw,bh);let x=bx;
 for(const j of[0,3]){const w=bw*v[j]*v[j];g.beginPath();g.moveTo(cxj(j),VY+100);g.lineTo(x+w/2,by);g.strokeStyle=C.ok+'90';g.lineWidth=1.5;g.stroke();
  rr(x+1,by,Math.max(1,w-2),bh,8);g.fillStyle=mix(C.panel,C.ok,0.6);g.fill();if(w>50){sname(j,x+w/2,by+17,15,1,'center','bold',2);txt(pc(v[j]**2),x+w/2,by+35,14,'#fff','center','',1)}x+=w}
 txt('same: '+pc(psame(v)),bx+bw*psame(v)/2,by+bh+44,24,C.ok,'center','bold',1)}],
['C2 · the bar, with the sum written at its end','Same bar, but the total sits right where the green stops, like a fuel gauge.',(v)=>{vec2(v,X0,VY);
 const bx=120,bw=CW-240,by=VY+160,bh=50;track(bx,by,bw,bh);let x=bx;
 for(const j of[0,3]){const w=bw*v[j]*v[j];g.beginPath();g.moveTo(cxj(j),VY+100);g.lineTo(x+w/2,by);g.strokeStyle=C.ok+'90';g.lineWidth=1.5;g.stroke();
  rr(x+1,by,Math.max(1,w-2),bh,8);g.fillStyle=mix(C.panel,C.ok,0.6);g.fill();if(w>50){sname(j,x+w/2,by+17,15,1,'center','bold',2);txt(pc(v[j]**2),x+w/2,by+35,14,'#fff','center','',1)}x+=w}
 g.strokeStyle=C.ok;g.lineWidth=3;g.beginPath();g.moveTo(x,by-12);g.lineTo(x,by+bh+12);g.stroke();txt(pc(psame(v)),x,by-30,26,C.ok,'center','bold',1);txt('same',x,by+bh+32,18,C.ok,'center','',1)}],
['C3 · stacked into a tube','The two squares stack up into a tall 100% tube, like liquid; the level is the answer.',(v)=>{vec2(v,X0,VY);
 const tx=CW/2-40,tw=80,tb=CH-22,th=180;rr(tx,tb-th,tw,th,10);g.fillStyle='#ffffff0d';g.fill();g.strokeStyle='#ffffff30';g.lineWidth=1.5;g.stroke();let y=tb;
 for(const j of[0,3]){const h=th*v[j]*v[j];g.beginPath();g.moveTo(cxj(j),VY+100);g.lineTo(tx+tw/2,tb-th);g.strokeStyle=C.ok+'70';g.lineWidth=1.5;g.stroke();
  rr(tx+2,y-h+1,tw-4,h-2,8);g.fillStyle=mix(C.panel,C.ok,0.6);g.fill();if(h>30){sname(j,tx+tw/2,y-h/2-8,14,1,'center','bold',2);txt(pc(v[j]**2),tx+tw/2,y-h/2+9,13,'#fff','center','',1)}y-=h}
 txt('100%',tx-10,tb-th+8,13,C.dim,'right','',1);txt('0%',tx-10,tb-4,13,C.dim,'right','',1);txt('same: '+pc(psame(v)),tx+tw+24,y,24,C.ok,'left','bold',1)}],
['D1 · squares under 00 and 11 only, joined by one arc','Only the two cells that count get their square written under them; one green arc joins them and carries the total.',(v)=>{vec2(v,X0,VY);
 const y=VY+104;for(const j of[0,3]){txt(sqs(v[j]),cxj(j),y+8,15,C.dim,'center','',1);txt(pc(v[j]**2),cxj(j),y+30,18,C.ok,'center','bold',1)}
 const yy=y+46;g.beginPath();g.moveTo(cxj(0),yy);g.bezierCurveTo(cxj(0),yy+130,cxj(3),yy+130,cxj(3),yy);g.strokeStyle=C.ok;g.lineWidth=3;g.stroke();
 txt('same: '+pc(psame(v)),CW/2,yy+120,26,C.ok,'center','bold',1)}],
['D2 · the arc carries the whole sum','Same arc, with the addition written out under it: square + square = total.',(v)=>{vec2(v,X0,VY);
 const y=VY+104;for(const j of[0,3])txt(sqs(v[j]),cxj(j),y+10,16,C.dim,'center','',1);
 const yy=y+28;g.beginPath();g.moveTo(cxj(0),yy);g.bezierCurveTo(cxj(0),yy+110,cxj(3),yy+110,cxj(3),yy);g.strokeStyle=C.ok;g.lineWidth=3;g.stroke();
 rich([[pc(v[0]**2)+' + '+pc(v[3]**2)+' = ',C.txt,''],[pc(psame(v)),C.ok,'bold']],CW/2,yy+110,24,'center',1);txt('same',CW/2,yy+142,18,C.ok,'center','',1)}],
['CD · the arc pours into the bar','The arc joins 00 and 11, then drops into the 100% track and fills it to the answer: D on the way in, C at the end.',(v)=>{vec2(v,X0,VY);
 const y=VY+100;for(const j of[0,3])txt(pc(v[j]**2),cxj(j),y+14,17,C.ok,'center','bold',1);
 const yy=y+30,mid=CW/2;g.beginPath();g.moveTo(cxj(0),yy);g.bezierCurveTo(cxj(0),yy+70,cxj(3),yy+70,cxj(3),yy);g.strokeStyle=C.ok;g.lineWidth=3;g.stroke();
 g.beginPath();g.moveTo(mid,yy+52);g.lineTo(mid,yy+92);g.stroke();
 const bx=150,bw=CW-300,by=yy+96,bh=36;track(bx,by,bw,bh);rr(bx+1,by,Math.max(2,bw*psame(v)-2),bh,8);g.fillStyle=mix(C.panel,C.ok,0.6);g.fill();
 txt('same: '+pc(psame(v)),bx+bw*psame(v)/2,by+bh/2,20,'#fff','center','bold',1)}]];
const root=document.getElementById('opts');
OPTS.forEach(([title,desc,draw])=>{const h=document.createElement('h2');h.textContent=title;root.appendChild(h);const d=document.createElement('div');d.className='d';d.textContent=desc;root.appendChild(d);
 const row=document.createElement('div');row.className='row';root.appendChild(row);
 PAIRS.forEach(([a,b],k)=>{const wrap=document.createElement('div');const c=document.createElement('canvas');c.width=CW;c.height=CH;wrap.appendChild(c);
  const cap=document.createElement('div');cap.className='cap';cap.textContent=NAMES[k]+' · turns: '+BNAME[a]+', '+BNAME[b];wrap.appendChild(cap);row.appendChild(wrap);
  g=c.getContext('2d');g.fillStyle='#101b26';g.fillRect(0,0,CW,CH);draw(press(a,b))})});
</script></body></html>`;
process.stdout.write(page);
