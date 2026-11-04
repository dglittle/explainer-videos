# blender -b -P pyramid.py -- OUT.png [angle] [samples]
# The same 4-ball pyramid as cut-anim.html, path traced in Cycles (GPU/Metal): real glass, soft shadows, glass caustics (MNEE).
# Coordinates: the web page is y-up (x right, z toward the camera); Blender is z-up. Web (x, y, z) -> Blender (x, -z, y).
import bpy, math, sys, time
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else '/tmp/pyramid.png'
ANGLE = float(argv[1]) if len(argv) > 1 else 0.35
SAMPLES = int(argv[2]) if len(argv) > 2 else 256
RES = (1920, 1080)

def B(x, y, z): return Vector((x, -z, y))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# --- render settings
sc.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'METAL'
prefs.get_devices()
for d in prefs.devices: d.use = True
sc.cycles.device = 'GPU'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 24
sc.cycles.transmission_bounces = 24
sc.cycles.glossy_bounces = 12
sc.cycles.transparent_max_bounces = 16
sc.cycles.caustics_refractive = True
sc.cycles.caustics_reflective = True
sc.cycles.blur_glossy = 0.0
sc.render.resolution_x, sc.render.resolution_y = RES
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'
sc.view_settings.view_transform = 'AgX'
sc.view_settings.look = 'AgX - Medium High Contrast'

# --- the balls: r = 1, 3 on the floor in a triangle (centers 2r apart), 1 on top; turned by ANGLE about the vertical
R = 1.0
base = [(2*R/math.sqrt(3)*math.cos(k*2*math.pi/3), R, 2*R/math.sqrt(3)*math.sin(k*2*math.pi/3)) for k in range(3)]
balls = base + [(0.0, R + 2*R*math.sqrt(2/3), 0.0)]
ca, sa = math.cos(ANGLE), math.sin(ANGLE)
balls = [(ca*x + sa*z, y, -sa*x + ca*z) for (x, y, z) in balls]
for i in range(4):
    for j in range(i+1, 4):
        d = math.dist(balls[i], balls[j]); assert abs(d - 2*R) < 1e-9, ('touching', i, j, d)

glass = bpy.data.materials.new('crystal'); glass.use_nodes = True
nt = glass.node_tree; nt.nodes.clear()
g = nt.nodes.new('ShaderNodeBsdfGlass'); g.inputs['IOR'].default_value = 1.5
g.inputs['Roughness'].default_value = 0.0
g.inputs['Color'].default_value = (0.93, 0.97, 1.0, 1)          # a hint of blue, like the web version
o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(g.outputs[0], o.inputs['Surface'])

for i, c in enumerate(balls):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=192, ring_count=96, radius=R, location=B(*c))
    ob = bpy.context.object; ob.name = f'ball{i}'
    bpy.ops.object.shade_smooth()
    ob.data.materials.append(glass)
    ob.cycles.is_caustics_caster = True

# --- floor: dark, with a faint 1-unit grid (lines brighter), like the web floor
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, 0))
fl = bpy.context.object; fl.name = 'floor'; fl.cycles.is_caustics_receiver = True
fm = bpy.data.materials.new('floor'); fm.use_nodes = True
nt = fm.node_tree; nt.nodes.clear()
tc = nt.nodes.new('ShaderNodeTexCoord')
sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
def line(axis):
    fr = nt.nodes.new('ShaderNodeMath'); fr.operation = 'FRACT'; nt.links.new(sep.outputs[axis], fr.inputs[0])
    sub = nt.nodes.new('ShaderNodeMath'); sub.operation = 'SUBTRACT'; sub.inputs[1].default_value = 0.5; nt.links.new(fr.outputs[0], sub.inputs[0])
    ab = nt.nodes.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; nt.links.new(sub.outputs[0], ab.inputs[0])
    return ab
lx, ly = line('X'), line('Y')
mn = nt.nodes.new('ShaderNodeMath'); mn.operation = 'MINIMUM'; nt.links.new(lx.outputs[0], mn.inputs[0]); nt.links.new(ly.outputs[0], mn.inputs[1])
st = nt.nodes.new('ShaderNodeMath'); st.operation = 'LESS_THAN'; st.inputs[1].default_value = 0.012; nt.links.new(mn.outputs[0], st.inputs[0])
mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'
mix.inputs[6].default_value = (0.045, 0.05, 0.075, 1)    # floor
mix.inputs[7].default_value = (0.11, 0.15, 0.25, 1)      # grid lines
nt.links.new(st.outputs[0], mix.inputs[0])
bs = nt.nodes.new('ShaderNodeBsdfPrincipled'); bs.inputs['Roughness'].default_value = 0.55
nt.links.new(mix.outputs[2], bs.inputs['Base Color'])
o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(bs.outputs[0], o.inputs['Surface'])
fl.data.materials.append(fm)

# --- world: the same dark blue gradient (darker low, lighter up)
w = bpy.data.worlds.new('world'); sc.world = w; w.use_nodes = True
nt = w.node_tree; nt.nodes.clear()
tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Generated'], sep.inputs[0])
ramp = nt.nodes.new('ShaderNodeValToRGB'); nt.links.new(sep.outputs['Z'], ramp.inputs[0])
ramp.color_ramp.elements[0].position = 0.45; ramp.color_ramp.elements[0].color = (0.035, 0.04, 0.07, 1)
ramp.color_ramp.elements[1].position = 0.85; ramp.color_ramp.elements[1].color = (0.13, 0.16, 0.27, 1)
bg = nt.nodes.new('ShaderNodeBackground'); bg.inputs['Strength'].default_value = 1.0; nt.links.new(ramp.outputs[0], bg.inputs[0])
o = nt.nodes.new('ShaderNodeOutputWorld'); nt.links.new(bg.outputs[0], o.inputs['Surface'])

# --- lights: the key lamp from the web version's direction L = (-0.5, 1, 0.35), plus a soft blue window
def area(name, web_dir, dist, size, power, color):
    d = Vector(web_dir).normalized()
    loc = B(*(d * dist))
    bpy.ops.object.light_add(type='AREA', location=loc)
    lt = bpy.context.object; lt.name = name
    lt.data.shape = 'DISK'; lt.data.size = size; lt.data.energy = power; lt.data.color = color
    lt.rotation_euler = (-loc).to_track_quat('-Z', 'Y').to_euler()
    lt.data.cycles.is_caustics_light = True
    return lt
area('key', (-0.5, 1.0, 0.35), 14, 2.2, 5200, (1.0, 0.95, 0.86))
area('window', (0.8, 0.3, -0.6), 14, 6.0, 450, (0.6, 0.75, 1.0))

# --- camera: eye (0, 3.6, 9.6) looking at (0, 1.45, 0); vertical FOV from the shader's focal 1.9 (uv.y in -0.5..0.5)
eye, look = B(0, 3.6, 9.6), B(0, 1.45, 0)
bpy.ops.object.camera_add(location=eye)
cam = bpy.context.object; sc.camera = cam
cam.rotation_euler = (look - eye).to_track_quat('-Z', 'Y').to_euler()
cam.data.sensor_fit = 'VERTICAL'
cam.data.angle_y = 2 * math.atan(0.5 / 1.9)

sc.render.filepath = OUT
t0 = time.time()
bpy.ops.render.render(write_still=True)
print(f'RENDERED {OUT} angle={ANGLE} samples={SAMPLES} in {time.time()-t0:.1f}s')
