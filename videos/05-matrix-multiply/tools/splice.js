// Splice a pickup take onto an earlier take.
// node tools/splice.js <take1 base> <take2 base> <out base> [--upto KEY]
//   keeps take1 up to the moment Greg moved past the line whose key phrase is KEY (default 'punch line'),
//   then appends all of take2. Bases are paths without extension (.webm + .json next to them).
// Output: <out>.webm (vp8+opus, or opus only if either take has no video) + <out>.json (cues merged, times shifted).
// Env FF = ffmpeg path.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const FF=process.env.FF||process.env.HOME+'/bin/ffmpeg';
const [b1,b2,ob]=process.argv.slice(2), a=process.argv, KEY=a.includes('--upto')?a[a.indexOf('--upto')+1]:'punch line';
const m1=JSON.parse(fs.readFileSync(b1+'.json')), m2=JSON.parse(fs.readFileSync(b2+'.json'));
const norm=s=>(s||'').toLowerCase().replace(/’/g,"'");
const txt=(m,c)=>norm(c.text||(m.script[c.line]||{}).text);
// the cue where take1 moves past the KEY line
const ki=m1.cues.findIndex(c=>txt(m1,c).includes(KEY));
if(ki<0)throw Error('take1 has no line with '+KEY);
const kl=m1.cues[ki].line, next=m1.cues.find((c,i)=>i>ki&&c.line!==kl);
const cut=next?next.t:m1.duration;
const hasV=f=>/Stream #\d+:\d+.*Video:/.test(execFileSync('bash',['-c',`"${FF}" -hide_banner -i "${f}" 2>&1 || true`]).toString());
const V=hasV(b1+'.webm')&&hasV(b2+'.webm');
const vf=`fps=30,scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:(ow-iw)/2:(oh-ih)/2,setsar=1`;
const af='aformat=sample_rates=48000:channel_layouts=mono';
const fc=V?`[0:v]trim=end=${cut},setpts=PTS-STARTPTS,${vf}[v0];[0:a]atrim=end=${cut},asetpts=PTS-STARTPTS,${af}[a0];[1:v]setpts=PTS-STARTPTS,${vf}[v1];[1:a]asetpts=PTS-STARTPTS,${af}[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]`
 :`[0:a]atrim=end=${cut},asetpts=PTS-STARTPTS,${af}[a0];[1:a]asetpts=PTS-STARTPTS,${af}[a1];[a0][a1]concat=n=2:v=0:a=1[a]`;
execFileSync(FF,['-y','-hide_banner','-loglevel','error','-i',b1+'.webm','-i',b2+'.webm','-filter_complex',fc,
 ...(V?['-map','[v]','-c:v','libvpx','-b:v','1500k','-deadline','good','-cpu-used','4']:[]),'-map','[a]','-c:a','libopus','-b:a','128k',ob+'.webm'],{stdio:'inherit'});
const cues=[...m1.cues.filter(c=>c.t<cut).map(c=>({...c,text:c.text||(m1.script[c.line]||{}).text})),
 ...m2.cues.map(c=>({...c,t:+(c.t+cut).toFixed(2),line:c.line,text:c.text||(m2.script[c.line]||{}).text}))];
const out={id:path.basename(ob),spliced:[m1.id,m2.id],cut,duration:cut+m2.duration,mime:V?'video/webm':'audio/webm',cues,script:m2.script};
fs.writeFileSync(ob+'.json',JSON.stringify(out));
console.log(`spliced ${m1.id} [0, ${cut.toFixed(2)}] + ${m2.id} (${m2.duration.toFixed(1)} s) → ${ob}.webm, ${out.duration.toFixed(1)} s, ${cues.length} cues, video: ${V}`);
