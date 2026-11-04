// node build-alts.js > alts.html — ways to show "where the correlation is" under the final vector, side by side.
// Uses the engine from anim.html (same numbers, same drawing helpers); each option drawn for the 3 button cases.
const fs=require('fs');
const anim=fs.readFileSync(__dirname+'/anim.html','utf8');
const core=anim.slice(anim.indexOf('// ==== ENGINE START'),anim.indexOf('// ==== ENGINE END'));
const page=`<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>EPR as matrix math · options for the final vector</title>
<style>body{font:16px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;background:#0b121a;color:#dde6ee;max-width:1500px;margin:24px auto;padding:0 20px}
h1{margin:0 0 4px}.sub{color:#8a99a8;margin-bottom:22px}h2{margin:28px 0 4px;font-size:20px}.d{color:#9fb0c0;margin:0 0 10px;max-width:1100px}
.row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}canvas{width:100%;border-radius:8px;background:#101b26;box-shadow:0 2px 10px #0006}
.cap{font-size:13px;color:#8a99a8;text-align:center;margin-top:2px}</style></head><body>
<h1>Options for the math under the final vector</h1>
<div class="sub">EPR as matrix math · Oct-29 · each option is drawn for the three button cases (same, neighbors, top vs bottom). Every number is computed by the same engine as the video. In the video, each would animate in (e.g. squares dropping into place). Pick one, mix two, or tell me what to change.</div>
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
const OPTS=[
['A · a "squared" row, then the sums (what the video has now)','Each number squared, as a percent, in a row right under the vector; the two sums underneath.',(v)=>{vec(v,X0,VY);
 const y=VY+110;txt('squared:',X0-12,y+20,18,C.dim,'right','',1);for(let j=0;j<4;j++){const p=v[j]*v[j];rr(X0+j*64+4,y+3,56,34,8);g.fillStyle=mix(C.panel,colJ(j),0.12+0.5*Math.sqrt(p));g.fill();txt(pc(p),X0+j*64+32,y+20,16,'#fff','center','bold',1)}
 rich([['same (00 + 11):  ',C.ok,'bold'],[pc(v[0]**2)+' + '+pc(v[3]**2)+' = ',C.txt,''],[pc(psame(v)),C.ok,'bold']],CW/2,y+80,22,'center',1);
 rich([['different (01 + 10):  ',C.bad,'bold'],[pc(v[1]**2)+' + '+pc(v[2]**2)+' = ',C.dim,''],[pc(pdiff(v)),C.bad,'bold']],CW/2,y+114,18,'center',0.85)}],
['B · bars hanging under each cell','Each cell grows a bar whose height is its square (its chance). Green bars are "same", red are "different"; the totals sit at the bottom, in their color.',(v)=>{vec(v,X0,VY);
 const y=VY+108,Hm=150;for(let j=0;j<4;j++){const p=v[j]*v[j],h=Math.max(2,Hm*p/0.5);rr(X0+j*64+14,y,36,h,6);g.fillStyle=colJ(j);g.globalAlpha=0.85;g.fill();g.globalAlpha=1;txt(pc(p),X0+j*64+32,y+h+14,15,C.txt,'center','bold',1)}
 txt('same: '+pc(psame(v)),X0-30,y+40,22,C.ok,'right','bold',1);txt('different: '+pc(pdiff(v)),X0+256+30,y+40,22,C.bad,'left','bold',1)}],
['C · one 100% bar, regrouped','The four squares drop into one bar that adds up to 100%: 00 and 11 slide together on the left (same), 01 and 10 on the right (different). Thin lines show where each piece came from.',(v)=>{vec(v,X0,VY);
 const bx=110,bw=CW-220,by=VY+150,bh=46,order=[0,3,1,2];let x=bx;const segs=[];
 for(const j of order){const w=bw*v[j]*v[j];segs.push([j,x,w]);x+=w}
 for(const[j,x1,w]of segs){if(w<0.5)continue;g.beginPath();g.moveTo(X0+j*64+32,VY+100);g.lineTo(x1+w/2,by);g.strokeStyle=colJ(j)+'90';g.lineWidth=1.5;g.stroke();
  rr(x1+1,by,Math.max(1,w-2),bh,6);g.fillStyle=mix(C.panel,colJ(j),0.55);g.fill();if(w>46){sname(j,x1+w/2,by+15,15,1,'center','bold',2);txt(pc(v[j]**2),x1+w/2,by+33,14,'#fff','center','',1)}}
 const ws=bw*psame(v);g.strokeStyle=C.ok;g.lineWidth=2;g.beginPath();g.moveTo(bx,by+bh+12);g.lineTo(bx+ws,by+bh+12);g.stroke();txt('same '+pc(psame(v)),bx+ws/2,by+bh+34,20,C.ok,'center','bold',ws>20?1:0);
 if(pdiff(v)>1e-6){g.strokeStyle=C.bad;g.beginPath();g.moveTo(bx+ws,by+bh+12);g.lineTo(bx+bw,by+bh+12);g.stroke();txt('different '+pc(pdiff(v)),bx+ws+(bw-ws)/2,by+bh+34,20,C.bad,'center','bold',1)}}],
['D · squares written in place, joined by arcs','Under each cell: its square. Then an arc joins 00 to 11 (same) and a smaller one joins 01 to 10 (different), each carrying its total.',(v)=>{vec(v,X0,VY);
 const y=VY+104;for(let j=0;j<4;j++){const f=fmt(v[j]),sq=(f.includes('/')||v[j]<0?'('+f+')':f)+'²';txt(sq,X0+j*64+32,y+8,15,C.dim,'center','',1);txt(pc(v[j]**2),X0+j*64+32,y+30,17,colJ(j),'center','bold',Math.abs(v[j])>1e-9?1:0.4)}
 const arc=(j1,j2,dep,col,lab)=>{const x1=X0+j1*64+32,x2=X0+j2*64+32,yy=y+46;g.beginPath();g.moveTo(x1,yy);g.bezierCurveTo(x1,yy+dep,x2,yy+dep,x2,yy);g.strokeStyle=col;g.lineWidth=2.5;g.stroke();txt(lab,(x1+x2)/2,yy+dep*0.75+16,20,col,'center','bold',1)};
 arc(0,3,150,C.ok,'same '+pc(psame(v)));arc(1,2,60,C.bad,'different '+pc(pdiff(v)))}],
['E · just the headline','No squares on screen: the rings show which cells count, and one big number says the answer; the arithmetic is a small footnote.',(v)=>{vec(v,X0,VY);
 txt(pc(psame(v)),CW/2,VY+190,64,C.ok,'center','bold',1);txt('they see the same',CW/2,VY+240,22,C.dim,'center','',1);
 const sq=x=>{const f=fmt(x);return(f.includes('/')||x<0?'('+f+')':f)+'²'};txt(sq(v[0])+' + '+sq(v[3]),CW/2,VY+280,17,C.dim,'center','',1)}],
['F · two piles','The squares stack into two piles, "same" and "different", each block labelled with its state. The pile heights are the answer.',(v)=>{vec(v,X0,VY);
 const base=VY+330,Hm=190,pile=(js,x,col,lab)=>{let y=base;for(const j of js){const h=Hm*v[j]*v[j];if(h<1)continue;rr(x,y-h+1,110,h-2,6);g.fillStyle=mix(C.panel,col,0.55);g.fill();if(h>26){sname(j,x+55,y-h/2-7,14,1,'center','bold',2);txt(pc(v[j]**2),x+55,y-h/2+9,13,'#fff','center','',1)}y-=h}
  txt(lab,x+55,base+18,18,col,'center','bold',1)};
 pile([0,3],CW/2-150,C.ok,'same '+pc(psame(v)));pile([1,2],CW/2+40,C.bad,'different '+pc(pdiff(v)));g.strokeStyle='#ffffff30';g.beginPath();g.moveTo(CW/2-190,base+1);g.lineTo(CW/2+190,base+1);g.stroke()}]];
const root=document.getElementById('opts');
OPTS.forEach(([title,desc,draw])=>{const h=document.createElement('h2');h.textContent=title;root.appendChild(h);const d=document.createElement('div');d.className='d';d.textContent=desc;root.appendChild(d);
 const row=document.createElement('div');row.className='row';root.appendChild(row);
 PAIRS.forEach(([a,b],k)=>{const wrap=document.createElement('div');const c=document.createElement('canvas');c.width=CW;c.height=CH;wrap.appendChild(c);
  const cap=document.createElement('div');cap.className='cap';cap.textContent=NAMES[k]+' · turns: '+BNAME[a]+', '+BNAME[b];wrap.appendChild(cap);row.appendChild(wrap);
  g=c.getContext('2d');g.fillStyle='#101b26';g.fillRect(0,0,CW,CH);draw(press(a,b))})});
</script></body></html>`;
process.stdout.write(page);
