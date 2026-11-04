# Tiny poker: cards 1-4 (one each, no replacement), 4-chip stacks, SB posts 1, BB posts 2.
# SB: fold / call(limp to 2) / raise to 4 (all-in).  After limp, BB: check / raise to 4; then SB: fold / call.
# After SB raise, BB: fold / call.
# Deterministic strategy = one choice per card at each decision point -> 4^4 = 256 for each player.
import itertools, json, numpy as np
from scipy.optimize import linprog

SB_ACTS = ['F', 'R', 'LF', 'LC']          # fold, raise, limp-then-fold, limp-then-call
BB_ACTS = ['kF', 'kC', 'rF', 'rC']        # (vs limp: k=check / r=raise) + (vs raise: F=fold / C=call)
DEALS = [(a, b) for a in range(1, 5) for b in range(1, 5) if a != b]

def sd(a, b, amt): return amt if a > b else -amt

def pay(sa, ba, a, b):
    """SB's net chips given SB action sa with card a, BB action ba with card b."""
    if sa == 'F': return -1
    if sa == 'R': return 2 if ba[1] == 'F' else sd(a, b, 4)
    # limp
    if ba[0] == 'k': return sd(a, b, 2)
    return -2 if sa == 'LF' else sd(a, b, 4)

SBS = list(itertools.product(range(4), repeat=4))   # index i -> tuple of action idx for cards 1..4
BBS = list(itertools.product(range(4), repeat=4))
A = np.zeros((256, 256))
for i, s in enumerate(SBS):
    for j, t in enumerate(BBS):
        A[i, j] = sum(pay(SB_ACTS[s[a-1]], BB_ACTS[t[b-1]], a, b) for a, b in DEALS) / 12

def solve_row(M):
    m, n = M.shape  # vars: x (m), v ; maximize v
    c = np.zeros(m+1); c[-1] = -1
    A_ub = np.hstack([-M.T, np.ones((n, 1))])      # v - x.M[:,j] <= 0
    A_eq = np.hstack([np.ones((1, m)), [[0]]])
    r = linprog(c, A_ub=A_ub, b_ub=np.zeros(n), A_eq=A_eq, b_eq=[1],
                bounds=[(0, None)]*m+[(None, None)], method='highs')
    return r.x[:m], r.x[-1]

x, v = solve_row(A)
y, w = solve_row(-A.T)
print('game value for SB: %.6f  (= %s)' % (v, __import__('fractions').Fraction(v).limit_denominator(1000)))
print('BB check: %.6f' % -w)

def behav(p, strats, acts):
    out = {}
    for c in range(4):
        d = {a: 0.0 for a in acts}
        for pi, s in zip(p, strats): d[acts[s[c]]] += pi
        out[c+1] = {k: round(v, 4) for k, v in d.items() if v > 1e-7}
    return out

print('SB support:', [(''.join(SB_ACTS[k][0] if len(SB_ACTS[k])==1 else SB_ACTS[k] for k in [0]) , 0) for _ in []])
for pi, s in sorted(zip(x, SBS), reverse=True):
    if pi > 1e-7: print('  SB %.4f' % pi, [SB_ACTS[k] for k in s])
for pi, s in sorted(zip(y, BBS), reverse=True):
    if pi > 1e-7: print('  BB %.4f' % pi, [BB_ACTS[k] for k in s])
print('SB per card:', behav(x, SBS, SB_ACTS))
print('BB per card:', behav(y, BBS, BB_ACTS))
np.save('A.npy', A)
