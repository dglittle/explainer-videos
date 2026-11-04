// ==== ENGINE START (the voice booth copies everything from here to ENGINE END, verbatim) ====
let g=typeof ctx!=="undefined"?ctx:null;   // the engine draws to g
// Needs a 1920×1080 2-D canvas `cv` with context `g`. drawFrame(t) draws anim time t. Pure 2-D canvas, no WebGL.
const W=1920, H=1080;
// optional on-screen extras. Set any to false to drop it.
const MIRROR=true;        // the small "real experiment" panel: an entangled-photon source and two polarizers
const NOTE_BELL=true;     // end card: "(the written-down-answers limit is a Bell inequality; real experiments side with the qubits)"
// ---------- the math (every number on screen is computed here) ----------
// two qubits: Alice (the first bit) and Bob (the second). States 00, 01, 10, 11. Row vectors: new = v·M (as in the series)
const NQ=2, R2=Math.SQRT1_2;
const zeros=n=>[...Array(n)].map(()=>Array(n).fill(0)), eye=n=>zeros(n).map((r,i)=>r.map((_,j)=>i==j?1:0));
const mmul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>s+x*B[k][j],0)));
const tr=A=>A[0].map((_,j)=>A.map(r=>r[j]));
const vm=(v,A)=>A[0].map((_,j)=>v.reduce((s,x,k)=>s+x*A[k][j],0));
const kron=(A,B)=>{const n=A.length,m=B.length,K=zeros(n*m);for(let a=0;a<n;a++)for(let b=0;b<n;b++)for(let c=0;c<m;c++)for(let d=0;d<m;d++)K[a*m+c][b*m+d]=A[a][b]*B[c][d];return K};
const norm=v=>Math.sqrt(v.reduce((s,x)=>s+x*x,0));
const HM=[[R2,R2],[R2,-R2]], CNM=[[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]], I2=eye(2);
// the buttons: turn the qubit by an angle (like a polarizer at that angle). R(θ) on (0, 1); as a row-vector matrix, use Rᵀ
const BUT=[0,22.5,45], BNAME=['top','middle','bottom'];
const RT=d=>{const t=d*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return[[c,-s],[s,c]]};
const TIE1=tr(kron(HM,I2)), TIE2=tr(CNM);                     // the two "tie them together" gates
const turn=(a,b)=>tr(kron(RT(BUT[a]),RT(BUT[b])));            // Alice presses a, Bob presses b
const V0=[1,0,0,0], V1=vm(V0,TIE1), V2=vm(V1,TIE2);           // 00 → (00+10)/√2 → (00+11)/√2
const press=(a,b)=>vm(V2,turn(a,b));
const psame=v=>v[0]*v[0]+v[3]*v[3], pdiff=v=>v[1]*v[1]+v[2]*v[2], pA1=v=>v[2]*v[2]+v[3]*v[3], pB1=v=>v[1]*v[1]+v[3]*v[3];
const SAME=BUT.map((_,a)=>BUT.map((_,b)=>psame(press(a,b))));
// written-down answers: whenever top ≠ bottom, the middle differs from one of them, so P(top≠bottom) ≤ P(top≠middle) + P(middle≠bottom)
const D01=1-SAME[0][1], D12=1-SAME[1][2], D02=1-SAME[0][2], BOUND=D01+D12;
// check that argument by brute force over every possible cheat sheet (top, middle, bottom answers, the same on both sides)
const SHEETS=[...Array(8).keys()].map(k=>[(k>>2)&1,(k>>1)&1,k&1]);
const sheetOK=SHEETS.every(([t,m,b])=>(t!=b?1:0)<=(t!=m?1:0)+(m!=b?1:0));
// ---------- screenplay: [key phrase, text, extra wordless seconds after the line] ----------
// DRAFT lines for Greg (in his voice, from his earlier EPR video and the double-slit one); rewrite freely
const SCRIPT=[
['why the epr',"In an earlier video, I tried to explain why the EPR paradox is weird, with a phone app that has three buttons. This time, let's build the same thing as a quantum computation.",1.0],
['one for alice',"We start with two qubits: one for Alice, and one for Bob. Both start at 0.",0.8],
['tie them together',"Then two gates tie them together. Now if they look, it's 50/50 whether they see 0 or 1, but they always see the same thing.",1.2],
['far apart',"Then Alice and Bob carry their qubits far apart, with no wires between them.",1.0],
['turns their qubit',"Each of them has three buttons. Pressing a button turns their qubit by some angle, and then they look.",1.2],
['same button',"If they press the same button, they always see the same thing.",3.0],
['neighboring buttons',"If they press neighboring buttons, they see the same thing about 85% of the time.",2.6],
['top and bottom buttons',"And with the top and bottom buttons, only 50% of the time.",2.2],
['written down',"Could the qubits have just written down their answers at the start? Then whenever top and bottom differ, the middle has to differ from one of them. So top and bottom could differ at most 15 plus 15, which is 30% of the time. But here, they differ 50% of the time.",3.0],
['each side alone',"And yet, each side alone just sees a random 50/50, no matter what the other one pressed. So nobody can send a message this way.",2.4],
['few matrices',"And all of that comes out of a vector of 4 numbers, times a few matrices.",5.0]];
const GAP=0.45, S=[], E=[]; let T=1.2;
SCRIPT.forEach(([k,txt,h])=>{const d=Math.max(1.6,txt.split(/\s+/).length/2.5+0.3);S.push(T);E.push(T+d);T+=d+GAP+h});
const LK=k=>{const i=SCRIPT.findIndex(s=>s[0]==k);if(i<0)throw Error('no line '+k);return i};
