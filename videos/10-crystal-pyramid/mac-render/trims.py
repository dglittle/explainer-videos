# trims.py TRIMS.json — prints shell exports for recut-trims.sh (bash 3.2 can't take a heredoc inside $( ))
import json, sys
t = json.load(open(sys.argv[1])); c = json.load(open('cuts-used.json')); f = lambda x: round(x / 30, 4)
lab0, fail0, rot0 = c['lab']['in'], c['fail']['in'], c['rot']['in']
cuts = {'lab': {'in': round(lab0 + f(t['a']['in']), 4), 'out': round(lab0 + f(t['a']['out']), 4)},
        'fail': {'in': round(fail0 + f(t['c']['in']), 4), 'out': round(fail0 + f(t['c']['out']), 4)},
        'rot': {'in': round(rot0 + f(t['e']['in']), 4), 'out': round(rot0 + f(t['e']['out']), 4)}}
json.dump(cuts, open('cuts-trimmed.json', 'w'))
P = 0.2                                     # cut a little long; trim=end_frame (NA..NE) makes each section frame-exact
print(f"export L0={cuts['lab']['in']} L1={cuts['lab']['out'] + P} F0={cuts['fail']['in']} F1={cuts['fail']['out'] + P} R0={cuts['rot']['in']} R1={cuts['rot']['out'] + P}")
print(f"export SP0={f(t['b']['in'])} SP1={f(t['b']['out']) + P} AR0={f(t['d']['in'])} AR1={f(t['d']['out']) + P}")
print('export ' + ' '.join(f"N{k.upper()}={t[k]['out'] - t[k]['in']}" for k in 'abcde'))
print(f"export CGI1={f(t['b']['out'] - t['b']['in'])} CGI2={f(t['d']['out'] - t['d']['in'])} DBREATH={max(0.08, round(0.77 - f(t['d']['in']), 4))}")
for k in 'abcde': print(f"echo '{k}: frames {t[k]['in']}-{t[k]['out']} of {t[k]['n']} = {f(t[k]['out'] - t[k]['in'])} s'")
