# blender -b -P anim.py -- OUTDIR SECS SAMPLES DRAW [only=12,105]     (DRAW 0 = no arrow: the spin scene)
# The arrows scene, path traced: the balls spin like cut-anim.html (0.35 + SPIN*t) while the red ribbon arrow draws itself in
# over DRAW seconds (smoothstep, head riding the tip), then holds. 30 fps; frames OUTDIR/f0001.png...; skips frames already there
# (so a stopped render resumes). Writes OUTDIR/progress.json after every frame.
import bpy, sys, os, math, time, json
argv = sys.argv[sys.argv.index('--') + 1:]
OUTDIR, SECS, SAMPLES_A, DRAW = argv[0], float(argv[1]), int(argv[2]), float(argv[3])
ONLY = [int(x) for x in argv[4].split('=')[1].split(',')] if len(argv) > 4 and argv[4].startswith('only=') else None
HERE = os.path.dirname(os.path.abspath(sys.argv[sys.argv.index('-P') + 1]))
LIB = True
exec(open(os.path.join(HERE, 'pyramid.py')).read(), globals())     # builds the scene (balls, floor, lights, camera); no render
sc.cycles.samples = SAMPLES_A

FPS = 30
SPIN = 1.71 * DIR                       # rad/s, same as cut-anim.html
N = round(SECS * FPS)
frames = ONLY or list(range(1, N + 1))
os.makedirs(OUTDIR, exist_ok=True)
smooth = lambda x: (lambda c: c*c*(3 - 2*c))(max(0.0, min(1.0, x)))

def progress(done, cur, times, state):
    left = [f for f in frames if not os.path.exists(f'{OUTDIR}/f{f:04d}.png')]
    avg = sum(times[-10:]) / len(times[-10:]) if times else None
    info = dict(state=state, total=len(frames), done=len(frames) - len(left), current=cur, samples=SAMPLES_A,
                last_secs=round(times[-1], 1) if times else None, avg_secs=round(avg, 1) if avg else None,
                eta_secs=round(avg * len(left)) if avg else None, updated=time.strftime('%Y-%m-%d %H:%M:%S'),
                latest=f'f{done:04d}.png' if done else None)
    tmp = f'{OUTDIR}/progress.json.tmp'
    json.dump(info, open(tmp, 'w')); os.replace(tmp, f'{OUTDIR}/progress.json')

times = []
progress(0, None, times, 'starting')
for f in frames:
    out = f'{OUTDIR}/f{f:04d}.png'
    if os.path.exists(out): continue
    t = (f - 1) / FPS
    set_balls(0.35 + SPIN * t)
    thE = TH0 + (TH1 - TH0) * smooth(t / DRAW) if DRAW > 0 else TH0     # DRAW <= 0: no arrow (the spin scene)
    if thE - TH0 < 0.02:
        if ARROW: ARROW.hide_render = True
    else:
        set_arrow(thE); ARROW.hide_render = False
    sc.cycles.seed = f
    sc.render.filepath = out
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    times.append(time.time() - t0)
    print(f'FRAME {f}/{N} t={t:.3f} {times[-1]:.1f}s', flush=True)
    progress(f, f, times, 'rendering')
progress(frames[-1], None, times, 'done')
print('ALL DONE', flush=True)
