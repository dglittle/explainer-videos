// ==== ENGINE START (the voice booth copies everything from here to ENGINE END, verbatim) ====
let g=typeof ctx!=="undefined"?ctx:null;   // the engine draws to g
// Needs a 1920×1080 2-D canvas `cv` with context `g`. drawFrame(t) draws anim time t. Pure 2-D canvas, no WebGL.
const W=1920, H=1080;
// optional on-screen extras. Set any to false to drop it.
const NOTE_TRAVEL=true;   // "travelling: the numbers don't change"
const NOTE_FRINGE=true;   // the fringe plot: make one path a bit longer (a phase φ), and P(top) goes up and down
const NOTE_MZ=true;       // end card: "(this setup is a Mach–Zehnder interferometer, the double slit's cousin)"
// ---------- the math (every number on screen is computed here) ----------
// the particle is "on" the wire that holds the 1: top = state 10, bottom = state 01 (00 and 11 never happen: one particle)
const NQ=3, R2=Math.SQRT1_2, CC=Math.sqrt(3)/2, SS=0.5;       // the mixing gate: √¾ and ½ (½² = 25%)
const zeros=n=>[...Array(n)].map(()=>Array(n).fill(0)), eye=n=>zeros(n).map((r,i)=>r.map((_,j)=>i==j?1:0));
const mmul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>s+x*B[k][j],0)));
const tr=A=>A[0].map((_,j)=>A.map(r=>r[j]));
const vm=(v,A)=>A[0].map((_,j)=>v.reduce((s,x,k)=>s+x*A[k][j],0));     // row vector × matrix (as in the last two videos)
const norm=v=>Math.sqrt(v.reduce((s,x)=>s+x*x,0));
const onehot=(n,k)=>[...Array(n)].map((_,i)=>i==k?1:0);
const HM=[[R2,R2],[R2,-R2]], CNM=[[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]];   // (for the swarm's little circuits)
// the two gates' little matrices on (top, bottom); rows = from, columns = to (row vectors: new = v·M)
const SL=[[R2,R2],[R2,-R2]];                                   // the slit: top → half top, half bottom
const MX2=[[CC,-SS],[SS,CC]];                                   // the mixing gate: keeps √¾, moves ½ (25%)
const TOP=2, BOT=1;                                            // indices of 10 and 01
function on2(m){const M=eye(4),ix=[TOP,BOT];for(let a=0;a<2;a++)for(let b=0;b<2;b++)M[ix[a]][ix[b]]=m[a][b];return M}   // 00 and 11 untouched
const S4=on2(SL), B4=on2(MX2);
const up=M=>{const R=zeros(8);for(let i=0;i<8;i++)for(let j=0;j<8;j++)if((i&1)==(j&1))R[i][j]=M[i>>1][j>>1];return R};   // add the spy wire, untouched
const CP8=zeros(8);for(let i=0;i<8;i++)CP8[i][i^((i>>2)&1)]=1;                          // copy: spy ^= top
// run 1 (no spy): 10 → slit → travel → mix
const A0=onehot(4,TOP), A1=vm(A0,S4), A2=vm(A1,B4);
// run 2 (with the spy): 100 → slit → copy → travel → mix
const W0=onehot(8,4), W1=vm(W0,up(S4)), W2=vm(W1,CP8), W3=vm(W2,up(B4));
const ptop=v=>v.reduce((s,x,i)=>s+((i>>(Math.log2(v.length)-1))&1?x*x:0),0), pbot=v=>v.reduce((s,x,i)=>s+((i>>(Math.log2(v.length)-2))&1?x*x:0),0);
const pspy=v=>v.length==8?v.reduce((s,x,i)=>s+(i&1?x*x:0),0):0;
const COIN=0.5*(CC*CC)+0.5*(SS*SS);                            // if it were a coin flip: 50%·75% + 50%·25%
const FRINGE=ph=>{const re=R2*CC+R2*SS*Math.cos(ph),im=R2*SS*Math.sin(ph);return re*re+im*im};   // P(top) if the bottom path is longer by phase φ
// ---------- screenplay: [key phrase, text, extra wordless seconds after the line] ----------
// Greg's words (light cleanup). OPTIONAL lines are my suggestions: if skipped, the render plays their note silently
const SCRIPT=[
['very confusing',"I find understanding quantum mechanics in the real world very confusing. They talk about position being the conjugate of momentum, and I just don't get it.",1.0],
['just matrix multiplication',"But quantum computation is just matrix multiplication. So I thought: could I understand something like the double-slit experiment in terms of quantum computation? And here's my attempt.",1.0],
['split into two',"We'd like to start with one qubit, and have it split into two. But in quantum mechanics, we can't create or destroy qubits.",0.8],
['top qubit is a 1',"So let's have 2 qubits, but we start knowing the top qubit is a 1, and the bottom one is a 0.",1.0],
['randomizes which',"And then our first gate randomizes which qubit is a 1, like the double slit. Right now, if we measure, the result is a 50/50 chance of top or bottom being a 1.",1.6],
['distance travelled',"Now let's simulate some distance travelled by the particle after going through the slit, so that it can have time to interfere with itself.",1.0],
['25% chance',"And we'll represent the interference with this gate, that just has a 25% chance of flipping where the particle is.",1.8],
['lo and behold',"But now if we do that, lo and behold, something strange happens: the probabilities of top and bottom are mysteriously no longer equal.",2.4],
['coin flip',"If this were just a coin flip, it would still be 50/50. But the two paths add up their amplitudes, not their probabilities, so on one side they add, and on the other side they cancel.",3.0],
['interference pattern',"That's kind of like the interference pattern behind the double slit.",3.6],
['try to examine',"Next, let's try to examine which way the particle went.",0.8],
['spy on',"We'll add a copy gate after the slit, to spy on whether the particle went that way, copying it down to a third qubit. So in the end, the third qubit will tell us which way the particle went.",1.0],
['tells us the truth',"Well, if we do that, the third qubit tells us the truth about which way it went, but it no longer shows interference. Top and bottom are both 50% again.",2.4],
['end in different',"Because now the two paths end in different states of the third qubit, so they can't add up or cancel anymore.",5.0]];
const GAP=0.45, S=[], E=[]; let T=1.2;
SCRIPT.forEach(([k,txt,h])=>{const d=Math.max(1.6,txt.split(/\s+/).length/2.5+0.3);S.push(T);E.push(T+d);T+=d+GAP+h});
const LK=k=>{const i=SCRIPT.findIndex(s=>s[0]==k);if(i<0)throw Error('no line '+k);return i};
