// ==== ENGINE START (the voice booth copies everything from here to ENGINE END, verbatim) ====
let g=typeof ctx!=="undefined"?ctx:null;   // the engine draws to g
// Needs a 1920×1080 2-D canvas `cv` with context `g`. drawFrame(t) draws anim time t. Pure 2-D canvas, no WebGL.
const W=1920, H=1080;
// optional on-screen extras. Set any to false to drop it.
const CREDIT=true;        // end card: related reading (Aaronson; Deutsch; Bernstein–Vazirani; Bennett)
const NOTE_HEAD=true;     // "the head's position and the machine's own state can go on the tape too"
const NOTE_GATES=true;    // "in practice the giant matrix is a product of small gates"
// ---------- the math (every number on screen is computed here) ----------
// complex numbers are [re, im]
const cx=(re,im=0)=>[re,im], cmul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]], cadd=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const conj=z=>[z[0],-z[1]], abs2=z=>z[0]*z[0]+z[1]*z[1], cabs=z=>Math.sqrt(abs2(z)), carg=z=>Math.atan2(z[1],z[0]);
const NB=3, N=1<<NB;                                         // 3 tape cells → 2³ = 8 states
const BITS=k=>k.toString(2).padStart(NB,'0');               // state k ↔ tape contents
const zeros=()=>[...Array(N)].map(()=>[...Array(N)].map(()=>cx(0)));
const eye=()=>zeros().map((r,i)=>r.map((_,j)=>cx(i==j?1:0)));
const mmul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>cadd(s,cmul(x,B[k][j])),cx(0))));
const mv=(A,v)=>A.map(r=>r.reduce((s,x,k)=>cadd(s,cmul(x,v[k])),cx(0)));
const dag=A=>A[0].map((_,j)=>A.map(r=>conj(r[j])));
const norm=v=>Math.sqrt(v.reduce((s,z)=>s+abs2(z),0));
const onehot=k=>[...Array(N)].map((_,i)=>cx(i==k?1:0));
// a one-cell gate G (2×2) on cell b (0 = leftmost), and a two-cell controlled-NOT
const gate1=(G,b)=>{const M=zeros(),sh=NB-1-b;for(let j=0;j<N;j++){const x=(j>>sh)&1;for(let o=0;o<2;o++)M[(j&~(1<<sh))|(o<<sh)][j]=cadd(M[(j&~(1<<sh))|(o<<sh)][j],G[o][x])}return M};
const cnot=(a,b)=>{const M=zeros();for(let j=0;j<N;j++)M[(j>>(NB-1-a))&1?j^(1<<(NB-1-b)):j][j]=cx(1);return M};
const RY=(c,s)=>[[cx(c),cx(-s)],[cx(s),cx(c)]], PH=t=>[[cx(1),cx(0)],[cx(0),cx(Math.cos(t),Math.sin(t))]], HAD=[[cx(Math.SQRT1_2),cx(Math.SQRT1_2)],[cx(Math.SQRT1_2),cx(-Math.SQRT1_2)]];
// the classical step: "add 1" (a binary counter), state k → k+1 mod 8. Matrix: column k has its single 1 in row k+1.
const STEP=k=>(k+1)%N;
const P=zeros(); for(let k=0;k<N;k++)P[STEP(k)][k]=cx(1);
// the quantum step: a product of 4 small gates (each touches 1 or 2 cells)
const GATES=[cnot(0,2),gate1(PH(Math.PI/3),1),gate1(RY(0.8,0.6),0),gate1(RY(Math.cos(0.5),Math.sin(0.5)),2)];
const U=GATES.reduce((A,B)=>mmul(A,B));
// the story's vectors
const K0=0b011;                                               // the tape starts as 011
const V0=onehot(K0), V1=mv(P,V0), V2=mv(P,V1);                // 011 → 100 → 101
const VR=mv(gate1(HAD,1),mv(gate1(HAD,2),V2));                // real amplitudes: ±½ on 100,101,110,111
const VC=mv(gate1(PH(Math.PI/2),1),VR);                       // complex: ½, −½, ½i, −½i
const Q1=mv(U,VC), Q2=mv(U,Q1);
// looking: you see state i with probability |aᵢ|². A fixed draw (u = 0.8) picks what we "see".
const PROB=Q2.map(abs2), DRAW=0.8;
const SEEN=(()=>{let s=0;for(let i=0;i<N;i++){s+=PROB[i];if(DRAW<s)return i}return N-1})();
const VS=onehot(SEEN), Q3=mv(U,VS), Q4=mv(U,Q3);
// the information-erasing step (two states → one): fine for 0/1 vectors, but it breaks length 1
const ERASE=[[1,1],[0,0]], EV=[Math.SQRT1_2,Math.SQRT1_2], EOUT=ERASE.map(r=>r[0]*EV[0]+r[1]*EV[1]), ELEN=Math.hypot(...EOUT);
const LOG2_300=300*Math.log10(2), BIGM=Math.pow(10,LOG2_300-Math.floor(LOG2_300)), BIGE=Math.floor(LOG2_300);
// ---------- screenplay: [key phrase, text, extra wordless seconds after the line] ----------
// lines marked OPTIONAL are suggestions: if Greg doesn't read them, the render plays their on-screen note silently
const SCRIPT=[
['my understanding',"I'd like to give my understanding of quantum computation, for someone who knows about regular computation.",1.6],
['long tape',"So, with regular computation, we can do it all with a Turing machine, which has a long tape of 0's and 1's.",1.0],
['tape is finite',"To simplify things, let's assume the tape is finite.",2.6],
['rather funny way',"Then we could do a step of computation in a rather funny way.",0.6],
['could possibly be in',"We could list all the states the tape could possibly be in, which is a lot: 2 to the power of however many cells.",2.6],
['except a single',"And we can imagine a vector that long, with 0's everywhere, except a single 1 at the position representing the current state of the Turing machine tape.",1.0],
['giant square matrix',"And then to apply the next state update, we multiply this vector by a giant square matrix, such that the resulting vector has a single 1 at the position representing the new state of the tape after the update.",3.4],
['relax the',"Now to make this quantum computation, all we need to do is, instead of having 0's everywhere with a single 1, we relax the requirement to say that the length of the vector must be 1, which is the same as saying that the sum of the squares of all the elements must be 1.",2.2],
['complex too',"Of course, actually the numbers can be complex too, and rather than squaring them, we want to get the magnitude by taking the complex conjugate.",3.6],
['also require',"And we also require the matrix to be such that the result will also have a magnitude of 1.",3.4],
['called unitary',"Matrices like that are called unitary, and they can always be undone. So the classical step has to be reversible, just shuffling the states around. Luckily, any computation can be made reversible, with some extra scratch tape.",3.0],
['when we look',"And at the end, when we look, we see each state with a probability equal to its magnitude squared. That's why the length has to be 1.",2.4],
['sort of the turing',"And this vector times matrix setup is sort of the Turing machine of quantum computation.",3.2],
['boils down',"Any quantum computation boils down to this.",5]];
const GAP=0.45, S=[], E=[]; let T=1.2;
SCRIPT.forEach(([k,txt,h])=>{const d=Math.max(1.6,txt.replace('(OPTIONAL) ','').split(/\s+/).length/2.5+0.3);S.push(T);E.push(T+d);T+=d+GAP+h});
const LK=k=>{const i=SCRIPT.findIndex(s=>s[0]==k);if(i<0)throw Error('no line '+k);return i};
