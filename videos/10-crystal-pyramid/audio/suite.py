# python3 suite.py OUTDIR LAB_S CGI1_S CGI2_S REAL_S [half] — one MIDI cue per scene (a, b, d, e; scene c is silent), in C:
#   a  Labyrinth      A minor add9, slow mysterious swell
#   b  first CGI      soft C/E "breath" (~1 s), then F major blooms — the bass E rises to F (the leading note)
#   d  second CGI     the same, but the breath is quicker and the F lands harder, right as the red arrow lands (0.77 s):
#                     faster attack, louder, a low octave and a timpani hit
#   e  final real     the resolution: C major, the "heavens open" (aahs + oohs + strings + pad, soprano G5 → C6)
# half (Greg: "half-assing it, self-conscious about how underwhelming this is"): thinner, softer, no big layers, and every
# cue sags slightly in pitch just before it ends (a little deflating sigh).
# Notes are held past each scene's end; render.sh trims every cue to its scene (a quick cut, like the picture) and fades e.
import sys, os
from choir import write_midi, setup, swell, note, cc

out = sys.argv[1]; LAB, CGI1, CGI2, REAL = map(float, sys.argv[2:6])
HALF = len(sys.argv) > 6 and sys.argv[6] == 'half'
DBREATH = float(sys.argv[7]) if len(sys.argv) > 7 else 0.77   # d: breath length = when the arrow lands (less if d is trimmed at its start)
V = (lambda x: round(x * 0.78)) if HALF else (lambda x: x)        # velocities / swell peaks, less committed
os.makedirs(out, exist_ok=True)
A2, E3, A3, C4, E4, B4, E5 = 45, 52, 57, 60, 64, 71, 76
C2, F2, C3, F3, G3, A4, C5, F4, F5, G4, G5, C6, E2, E6 = 36, 41, 48, 53, 55, 69, 72, 65, 77, 67, 79, 84, 40, 88
AAH, OOH, STR, PAD, TIMP = 52, 53, 48, 91, 47

def sag(chans, L, over=0.6, cents=-30, steps=16):
    """half mode: bend the pitch down a little over the last `over` seconds (a deflating sigh). Default bend range = ±2 semitones."""
    if not HALF: return []
    ev = []
    for ch in chans:
        for i in range(steps + 1):
            x = i / steps; v = 8192 + round(cents / 200 * 8192 * x * x)
            ev.append((L - over + over * x, bytes([0xE0 | ch, v & 0x7F, (v >> 7) & 0x7F])))
    return ev

def cue_a(L):
    ev = setup(0, AAH) + setup(1, OOH, vol=95, pan=44) + setup(2, STR, vol=80, pan=84) + setup(3, PAD, vol=70)
    for ch, vmax in ((0, 118), (1, 100), (2, 85), (3, 85)): ev += swell(ch, 0.0, 1.8, 0, V(vmax))
    for k in ((A2, A3, C4, E4, B4) if HALF else (A2, E3, A3, C4, E4, B4, E5)): ev += note(0, k, 0.0, L + 3, V(92))
    for k in (A3, C4, E4): ev += note(1, k, 0.0, L + 3, V(78))
    if not HALF:
        for k in (A2, E3, A3, E4): ev += note(2, k, 0.0, L + 3, 74)
        for k in (A3, E4, B4): ev += note(3, k, 0.0, L + 3, 68)
    return ev + sag((0, 1), L)

def cue_f(L, breath, hard):
    """the C/E breath, then F major. hard = the second, punchier version."""
    ev = setup(0, AAH) + setup(1, OOH, vol=95, pan=44) + setup(2, STR, vol=85 if hard else 78, pan=84) + setup(3, PAD, vol=70)
    b = breath
    for ch, vmax in ((0, 120), (1, 100), (2, 92), (3, 85)):
        vmax = V(vmax)
        ev += swell(ch, 0.0, b * 0.8, 0, vmax * 0.55)                                   # the breath swells in
        ev += swell(ch, b, b + (0.12 if hard else 0.6), vmax * (0.75 if hard else 0.55), vmax, steps=12 if hard else 30)
    # breath: C major over E (the bass E is the leading note into F)
    for k in (E3, G3, C4, E4, G4): ev += note(0, k, 0.0, b + 0.02, 84)
    for k in (E3, C4, G4): ev += note(1, k, 0.0, b + 0.02, 70)
    for k in (E2 if hard else E3, G3, C4): ev += note(2, k, 0.0, b + 0.02, 66)
    # bloom: F major
    v = V(118 if hard else 98)
    for k in ((F3, C4, A4, C5) if HALF else (F3, C4, F4, A4, C5, F5)): ev += note(0, k, b, L + 3, v)
    for k in (F3, A3, C4, F4): ev += note(1, k, b, L + 3, v - 18)
    if not HALF:
        for k in ((F2, F3, C4, A4) if hard else (F3, C4, A4)): ev += note(2, k, b, L + 3, v - 14)
        for k in (F3, C4, F4): ev += note(3, k, b, L + 3, 70)
    if hard:                                                     # timpani on the downbeat (half: a polite little "doof")
        ev += setup(4, TIMP, vol=80 if HALF else 118, rev=90) + [cc(0, 4, 11, 127)]
        ev += note(4, F2, b, b + 1.5, 75 if HALF else 120) + ([] if HALF else note(4, C3, b, b + 1.5, 96))
    return ev + sag((0, 1), L)

def cue_e(L):
    ev = setup(0, AAH) + setup(1, OOH, vol=98, pan=40) + setup(2, STR, vol=88, pan=90) + setup(3, PAD, vol=75)
    for ch, vmax in ((0, 124), (1, 106), (2, 98), (3, 90)): ev += swell(ch, 0.0, 0.5, 30, V(vmax))
    for k in ((C3, C4, E4, G4, C5) if HALF else (C3, G3, C4, E4, G4, C5, E5)): ev += note(0, k, 0.0, L + 3, V(104))
    for k in (C4, E4, G4, C5): ev += note(1, k, 0.0, L + 3, V(84))
    if not HALF:
        for k in (C2, C3, G3, E4, G4): ev += note(2, k, 0.0, L + 3, 82)
        for k in (C4, G4, C5): ev += note(3, k, 0.0, L + 3, 72)
    if HALF:                                     # the soprano: still early, but solo and softer
        ev += setup(5, AAH, vol=105, pan=64) + swell(5, 0.12, 0.45, 30, 100)
        ev += note(5, G5, 0.12, 0.5, 90) + note(5, C6, 0.5, L + 3, 96)
        return ev + sag((0, 1, 5), L, over=1.6)
    # the soprano: in almost at once and strong (Greg: "earlier and stronger, punchier up high") — a quick G5 lift into C6,
    # doubled by oohs, with high strings on C6 + E6 for bite
    ev += setup(5, AAH, vol=127, pan=64) + swell(5, 0.12, 0.45, 40, 127)
    ev += note(5, G5, 0.12, 0.5, 112) + note(5, C6, 0.5, L + 3, 122)
    ev += setup(6, OOH, vol=118, pan=54) + swell(6, 0.4, 0.8, 30, 120) + note(6, C6, 0.5, L + 3, 110)
    ev += setup(7, STR, vol=110, pan=74) + swell(7, 0.4, 0.9, 30, 118) + note(7, C6, 0.5, L + 3, 108) + note(7, E6, 0.5, L + 3, 100)
    return ev

for name, ev, L in (('a', cue_a(LAB), LAB), ('b', cue_f(CGI1, 1.0, False), CGI1),
                    ('d', cue_f(CGI2, DBREATH, True), CGI2), ('e', cue_e(REAL), REAL)):
    ev.append(cc(L + 3.5, 15, 7, 0))
    write_midi(os.path.join(out, name + '.mid'), ev)
    print('wrote', name, L)
