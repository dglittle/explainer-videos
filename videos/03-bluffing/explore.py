import numpy as np, itertools
from scipy.optimize import linprog
exec(open('solve.py').read().split('x, v = solve_row')[0])
def ranges(M, strats, acts, label):
    m,n=M.shape; v=solve_row(M)[1]
    for c in range(4):
        for k,a in enumerate(acts):
            mask=np.array([1.0 if s[c]==k else 0 for s in strats])
            res=[]
            for sgn in (1,-1):
                cc=np.append(sgn*mask,0)
                A_ub=np.hstack([-M.T,np.ones((n,1))]); 
                r=linprog(cc,A_ub=A_ub,b_ub=np.zeros(n),A_eq=np.vstack([np.append(np.ones(m),0)]),b_eq=[1],
                  bounds=[(0,None)]*m+[(v-1e-9,None)],method='highs'); res.append(sgn*r.fun)
            if res[1]>1e-7: print(label,'card',c+1,a,'%.4f..%.4f'%(res[0],res[1]))
ranges(A,SBS,SB_ACTS,'SB'); ranges(-A.T,BBS,BB_ACTS,'BB')
