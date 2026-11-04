// node tools/decimate.js <knight-data.js> <cells> <out.js>  — vertex-clustering decimation → indexed mesh (Uint16 idx)
const fs=require('fs'), [inp,cellsS,out]=process.argv.slice(2), CELLS=+cellsS;
const src=fs.readFileSync(inp,'utf8'), g=k=>src.match(new RegExp(k+':\\s*"([^"]+)"'))[1];
const f32=s=>{const b=Buffer.from(s,'base64');return new Float32Array(b.buffer,b.byteOffset,b.length/4)};
const P=f32(g('pos')), N=f32(g('norm')), nv=P.length/3;
let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
for(let i=0;i<nv;i++)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],P[i*3+k]);mx[k]=Math.max(mx[k],P[i*3+k])}
const cs=Math.max(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/CELLS;
// cluster by cell AND coarse normal direction (keeps creases / thin parts from smearing)
const key=new Map(), acc=[]; const vid=new Int32Array(nv);
for(let i=0;i<nv;i++){
 const c=[0,1,2].map(k=>Math.floor((P[i*3+k]-mn[k])/cs));
 const n=[N[i*3],N[i*3+1],N[i*3+2]], d=n.map(x=>Math.round(x*1.2));   // ~27 direction buckets
 const K=c.join(',')+'|'+d.join(',');
 let id=key.get(K); if(id===undefined){id=acc.length;key.set(K,id);acc.push([0,0,0,0,0,0,0])}
 const a=acc[id]; a[0]+=P[i*3];a[1]+=P[i*3+1];a[2]+=P[i*3+2];a[3]+=n[0];a[4]+=n[1];a[5]+=n[2];a[6]++; vid[i]=id;
}
const tris=[], seen=new Set();
for(let t=0;t<nv/3;t++){const a=vid[t*3],b=vid[t*3+1],c=vid[t*3+2]; if(a===b||b===c||a===c)continue;
 const s=[a,b,c].sort((x,y)=>x-y).join(','); if(seen.has(s))continue; seen.add(s); tris.push(a,b,c)}
// compact
const remap=new Int32Array(acc.length).fill(-1); const pos=[],nor=[]; const idx=[];
for(const v of tris){ if(remap[v]<0){remap[v]=pos.length/3; const a=acc[v]; pos.push(a[0]/a[6],a[1]/a[6],a[2]/a[6]);
 const l=Math.hypot(a[3],a[4],a[5])||1; nor.push(a[3]/l,a[4]/l,a[5]/l)} idx.push(remap[v]) }
const nvo=pos.length/3; if(nvo>65535) throw Error('too many verts '+nvo);
const b64=a=>Buffer.from(a.buffer).toString('base64');
fs.writeFileSync(out,`// knight mesh, decimated from knight-data.js (${nv/3} tris) by tools/decimate.js cells=${CELLS}: ${idx.length/3} tris, ${nvo} verts\nvar knightMesh={pos:"${b64(new Float32Array(pos))}",norm:"${b64(new Float32Array(nor))}",idx:"${b64(new Uint16Array(idx))}"};\n`);
console.log('tris',nv/3,'->',idx.length/3,'verts',nvo,'bytes',fs.statSync(out).size,'bbox',mn.map(x=>x.toFixed(3)),mx.map(x=>x.toFixed(3)));
