import numpy as np
from fractions import Fraction as Fr
exec(open('solve.py').read().split('x, v = solve_row')[0])
F=lambda v: str(Fr(v).limit_denominator(2000))
v=solve_row(A)[1]; print('value',F(v))
nb=[i for i,s in enumerate(SBS) if s[0]!=1 and s[1]!=1]
x,vn=solve_row(A[nb]); print('SB never bluffs (no raise w/ 1,2):',F(vn), len(nb),'strategies')
for p,i in sorted(zip(x,nb),reverse=True):
  if p>1e-7: print('  ',round(p,4),[SB_ACTS[k] for k in SBS[i]])
nbb=[j for j,t in enumerate(BBS) if BB_ACTS[t[0]][0]!='r' and BB_ACTS[t[1]][0]!='r']
x,vb=solve_row(A[:,nbb]); print('BB never bluffs:',F(vb))
x,vbb=solve_row(A[nb][:,nbb]); print('neither bluffs:',F(vbb))
print('best pure SB maximin:',F(A.min(1).max()), [SB_ACTS[k] for k in SBS[A.min(1).argmax()]])
print('best pure BB minimax:',F(A.max(0).min()), [BB_ACTS[k] for k in BBS[A.max(0).argmin()]])
# dominance elimination
R=list(range(256)); C=list(range(256)); ch=True; rnd=0
while ch:
  ch=False; rnd+=1
  M=A[np.ix_(R,C)]
  keepR=[R[i] for i in range(len(R)) if not any((M[k]>=M[i]).all() and (M[k]>M[i]).any() for k in range(len(R)))]
  M=A[np.ix_(keepR,C)]
  keepC=[C[j] for j in range(len(C)) if not any((M[:,k]<=M[:,j]).all() and (M[:,k]<M[:,j]).any() for k in range(len(C)))]
  if len(keepR)<len(R) or len(keepC)<len(C): ch=True
  print('round',rnd,len(keepR),'x',len(keepC)); R,C=keepR,keepC
print('remaining SB',[[SB_ACTS[k] for k in SBS[i]] for i in R])
print('remaining BB',[[BB_ACTS[k] for k in BBS[j]] for j in C])
print(np.round(A[np.ix_(R,C)]*36).astype(int))
print('A range', A.min()*12, A.max()*12, 'entries in 12ths; distinct', len(set(np.round(A.flatten()*12))))
