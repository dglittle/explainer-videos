# python3 choir.py OUTDIR — writes the "heavenly choir" variants as MIDI files (OUTDIR/A.mid, B.mid, C.mid).
# General MIDI programs (0-based): 52 Choir Aahs, 53 Voice Oohs, 48 String Ensemble 1, 91 Pad 4 (choir), 88 Pad 1 (new age).
# Time is in seconds (tempo 60 bpm, 480 ticks per second). Swells use CC11 (expression) ramps; CC91 = reverb send.
import struct, sys, os

TPS = 480                                   # ticks per second at 60 bpm

def vlq(n):
    out = [n & 0x7F]; n >>= 7
    while n: out.append(0x80 | (n & 0x7F)); n >>= 7
    return bytes(reversed(out))

def write_midi(path, events):
    """events: list of (time_s, bytes). One track, format 0."""
    events = sorted(events, key=lambda e: (e[0], e[1][0] & 0xF0 == 0x90))   # note-offs before note-ons at the same time
    data, last = b'', 0
    data += vlq(0) + b'\xFF\x51\x03' + (1000000).to_bytes(3, 'big')          # tempo: 1 beat = 1 s
    for t, msg in events:
        tick = round(t * TPS); data += vlq(tick - last) + msg; last = tick
    data += vlq(0) + b'\xFF\x2F\x00'
    hdr = b'MThd' + struct.pack('>IHHH', 6, 0, 1, TPS)
    open(path, 'wb').write(hdr + b'MTrk' + struct.pack('>I', len(data)) + data)

def prog(ch, p): return (0, bytes([0xC0 | ch, p]))
def cc(t, ch, n, v): return (t, bytes([0xB0 | ch, n, max(0, min(127, int(v)))]))
def note(ch, k, t0, t1, vel=90): return [(t0, bytes([0x90 | ch, k, vel])), (t1, bytes([0x80 | ch, k, 0]))]
def swell(ch, t0, t1, v0, v1, steps=40):
    """expression ramp v0 -> v1 from t0 to t1 (smoothstep)"""
    ev = []
    for i in range(steps + 1):
        x = i / steps; s = x*x*(3 - 2*x)
        ev.append(cc(t0 + (t1 - t0) * x, ch, 11, v0 + (v1 - v0) * s))
    return ev
def setup(ch, p, vol=110, rev=127, pan=64):
    return [prog(ch, p), cc(0, ch, 7, vol), cc(0, ch, 91, rev), cc(0, ch, 93, 40), cc(0, ch, 10, pan), cc(0, ch, 11, 0)]

C3, E3, G3, C4, E4, G4, C5, E5, G5, C6 = 48, 52, 55, 60, 64, 67, 72, 76, 79, 84
F3, A3, F4, A4 = 53, 57, 65, 69
CMAJ = [C3, G3, C4, E4, G4, C5, E5]          # wide, bright C major

def variant_A():
    """a plain held 'aaah': choir aahs, swell in 1.2 s, hold, fade over 1.5 s (6.5 s)"""
    ev = setup(0, 52)
    ev += swell(0, 0.0, 1.2, 0, 120) + swell(0, 5.0, 6.5, 120, 0)
    for k in CMAJ: ev += note(0, k, 0.0, 6.6, 96)
    return ev

def variant_B():
    """'the heavens open': aahs + oohs + strings + a soft choir pad, and a soprano G5→C6 floating in on top (7.5 s)"""
    ev = setup(0, 52) + setup(1, 53, vol=95, pan=40) + setup(2, 48, vol=80, pan=90) + setup(3, 91, vol=70)
    for ch, vmax in ((0, 122), (1, 105), (2, 95), (3, 90)):
        ev += swell(ch, 0.0, 1.6, 0, vmax) + swell(ch, 5.8, 7.5, vmax, 0)
    for k in CMAJ: ev += note(0, k, 0.0, 7.6, 96)
    for k in (C4, E4, G4, C5): ev += note(1, k, 0.0, 7.6, 80)
    for k in (C3, G3, E4, G4): ev += note(2, k, 0.0, 7.6, 75)
    for k in (C4, G4, C5): ev += note(3, k, 0.0, 7.6, 70)
    ev += setup(4, 52, vol=105, rev=127, pan=64)     # the soprano: its own channel so it can swell in later
    ev += swell(4, 1.0, 2.4, 0, 115) + swell(4, 5.8, 7.5, 115, 0)
    ev += note(4, G5, 1.0, 3.0, 92) + note(4, C6, 3.0, 7.6, 96)
    return ev

def variant_C():
    """'a-AAAH': a soft F major (IV) breath, then the full C major (I) blooms (7 s)"""
    ev = setup(0, 52) + setup(1, 53, vol=95) + setup(2, 48, vol=80)
    for ch, vmax in ((0, 120), (1, 100), (2, 90)):
        ev += swell(ch, 0.0, 0.7, 0, vmax * 0.6) + swell(ch, 1.2, 2.2, vmax * 0.6, vmax) + swell(ch, 5.3, 7.0, vmax, 0)
    for k in (F3, C4, F4, A4, C5): ev += note(0, k, 0.0, 1.25, 90)
    for k in (F3, A3, C4, F4): ev += note(1, k, 0.0, 1.25, 75)
    for k in (F3, C4, A4): ev += note(2, k, 0.0, 1.25, 70)
    for k in CMAJ + [G5]: ev += note(0, k, 1.2, 7.1, 100)
    for k in (C4, E4, G4, C5): ev += note(1, k, 1.2, 7.1, 82)
    for k in (C3, G3, E4, G4): ev += note(2, k, 1.2, 7.1, 78)
    return ev

if __name__ == '__main__':
  out = sys.argv[1] if len(sys.argv) > 1 else '.'
  os.makedirs(out, exist_ok=True)
  for name, fn in (('A', variant_A), ('B', variant_B), ('C', variant_C)):
      ev = fn(); end = max(t for t, _ in ev)
      ev.append(cc(end + 2.5, 15, 7, 0))      # a silent event 2.5 s later, so the reverb tail gets rendered
      write_midi(os.path.join(out, name + '.mid'), ev)
      print('wrote', name)
