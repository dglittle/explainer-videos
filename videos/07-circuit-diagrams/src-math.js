// ==== ENGINE START (the voice booth copies everything from here to ENGINE END, verbatim) ====
let g=typeof ctx!=="undefined"?ctx:null;   // the engine draws to g
// Needs a 1920×1080 2-D canvas `cv` with context `g`. drawFrame(t) draws anim time t. Pure 2-D canvas, no WebGL.
const W=1920, H=1080;
// optional on-screen extras. Set any to false to drop it.
const NOTE_TENSOR=true;   // "(math name: the tensor product, H ⊗ I ⊗ I)"
const NOTE_LOOK=true;     // after the run: "looking, we'd see 000 or 111, each with probability ½"
const NOTE_NEXT=false;    // end card: "next: the double-slit experiment?"
// ---------- the math (every number on screen is computed here) ----------
// all the gates here are real, so plain numbers will do
const NQ=3, N=1<<NQ;                                           // 3 wires (qubits) → 2³ = 8 states
const BITS=k=>k.toString(2).padStart(NQ,'0');                  // state k ↔ one bit per wire; the top wire is the first bit
const bit=(i,w)=>(i>>(NQ-1-w))&1;
const zeros=n=>[...Array(n)].map(()=>Array(n).fill(0));
const eye=n=>zeros(n).map((r,i)=>r.map((_,j)=>i==j?1:0));
const mmul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>s+x*B[k][j],0)));
const tr=A=>A[0].map((_,j)=>A.map(r=>r[j]));
const vm=(v,A)=>A[0].map((_,j)=>v.reduce((s,x,k)=>s+x*A[k][j],0));     // row vector × matrix
const kron=(A,B)=>{const n=A.length,m=B.length,K=zeros(n*m);for(let a=0;a<n;a++)for(let b=0;b<n;b++)for(let c=0;c<m;c++)for(let d=0;d<m;d++)K[a*m+c][b*m+d]=A[a][b]*B[c][d];return K};
const norm=v=>Math.sqrt(v.reduce((s,x)=>s+x*x,0));
const onehot=k=>[...Array(N)].map((_,i)=>i==k?1:0);
const R2=Math.SQRT1_2;
// the little matrices. Rows/columns of a gate's matrix = the bits on ITS wires (first listed wire = first bit)
const HM=[[R2,R2],[R2,-R2]];                                   // Hadamard
const CNM=[[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]];           // controlled-NOT: 10 ↔ 11 (control first)
// the circuit: H on the top wire, then CNOT top→middle, then CNOT middle→bottom
const GATES=[{name:'H',wires:[0],m:HM},{name:'CNOT',wires:[0,1],m:CNM},{name:'CNOT',wires:[1,2],m:CNM}];
// the mechanical rule: copy the little matrix in once for every setting of the wires the gate doesn't touch.
// M[i][j] = little[sub(i)][sub(j)] when states i and j agree on every other wire, else 0
const sub=(i,ws)=>ws.reduce((s,w)=>s*2+bit(i,w),0);
const others=ws=>[...Array(NQ).keys()].filter(w=>!ws.includes(w));
const agreeOff=(i,j,ws)=>others(ws).every(w=>bit(i,w)==bit(j,w));
function expand(G){const M=zeros(N);for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(agreeOff(i,j,G.wires))M[i][j]=G.m[sub(i,G.wires)][sub(j,G.wires)];return M}
// (with row vectors, new = v·Mᵀ for the usual column-vector matrix M; these gates are all symmetric, so Mᵀ = M: checked below)
const MS=GATES.map(G=>tr(expand(G)));
const UT=MS.reduce((A,B)=>mmul(A,B));                          // the whole diagram: M₁·M₂·M₃ (left to right!)
const V0=onehot(0), V1=vm(V0,MS[0]), V2=vm(V1,MS[1]), V3=vm(V2,MS[2]), VU=vm(V0,UT);
const PROB=V3.map(x=>x*x);
// the copies of H on the top wire: one per setting of the other two wires
const STAMPS=[0,1,2,3].map(o=>{const ws=GATES[0].wires,ow=others(ws);const st=(r)=>{let i=0;for(let w=0;w<NQ;w++){const b=ws.includes(w)?(r>>(ws.length-1-ws.indexOf(w)))&1:(o>>(ow.length-1-ow.indexOf(w)))&1;i=i*2+b}return i};
 return{o,obits:o.toString(2).padStart(ow.length,'0'),cells:[[0,0],[0,1],[1,0],[1,1]].map(([r,c])=>({r,c,i:st(r),j:st(c)}))}});
const LOG2_300=300*Math.log10(2), BIGM=Math.pow(10,LOG2_300-Math.floor(LOG2_300)), BIGE=Math.floor(LOG2_300);
// ---------- screenplay: [key phrase, text, extra wordless seconds after the line] ----------
// DRAFT lines (written for Greg to rewrite in his own words). OPTIONAL: if skipped, the render plays its note silently
const SCRIPT=[
['usually draw',"In the last video, I said any quantum computation boils down to a vector times a matrix. But that's not how people usually draw quantum computations.",1.2],
['horizontal line',"Instead, they draw a horizontal line for each qubit, and gates where the qubits interact.",1.0],
['exists physically',"This diagram is meant to be closer to how the quantum computer exists physically, with time going from left to right.",1.0],
['back of your mind',"But you just have to know, in the back of your mind, that it can be converted in a mechanical way into a vector times a matrix. So let's do that.",0.8],
['three wires',"Three wires means three qubits, so 2 to the 3, or 8 possible states, just like the 3 tape cells last time.",1.8],
['its own little',"Each gate has its own little matrix: 2 by 2 for a gate on one wire, and 4 by 4 for a gate on two wires.",2.0],
['copy it in',"To turn a little matrix into a big 8 by 8 one, we copy it in, once for each setting of the wires the gate doesn't touch.",2.2],
['leaves the other',"That's because a gate only mixes states that differ on its own wires, and leaves the other wires alone.",2.6],
['one after another',"Then we just multiply the vector by each gate's big matrix, one after another.",6.2],
['same order',"And since we write the vector as a row, the matrices even come in the same order as the gates in the diagram.",2.8],
['all together',"Or we can multiply the big matrices all together first, and the whole diagram becomes one big matrix.",3.2],
['compact way',"So the diagram is really just a compact way of writing down a giant matrix: a few lines, instead of 2 to the n rows and columns.",4.5]];
const GAP=0.45, S=[], E=[]; let T=1.2;
SCRIPT.forEach(([k,txt,h])=>{const d=Math.max(1.6,txt.split(/\s+/).length/2.5+0.3);S.push(T);E.push(T+d);T+=d+GAP+h});
const LK=k=>{const i=SCRIPT.findIndex(s=>s[0]==k);if(i<0)throw Error('no line '+k);return i};
