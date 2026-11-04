// Makes a fake take (a quiet tone per line, pauses between) + booth-style meta, to test render.js without Greg's voice.
// node tools/fake-take.js -> chk/fake.wav, chk/fake.json
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const anim=fs.readFileSync(path.join(__dirname,'../anim.html'),'utf8');
const {SCRIPT,S,E}=new Function(anim.slice(anim.indexOf('// ==== ENGINE START'),anim.indexOf('// ==== ENGINE END'))+';return {SCRIPT,S,E}')();
let t=1.2;const cues=[],segs=[];
SCRIPT.forEach(([k,txt],i)=>{const d=(E[i]-S[i])*(0.8+0.4*((i*37)%10)/10);cues.push({t:+(t-0.3).toFixed(2),line:i,text:txt});segs.push([t,d]);t+=d+0.5+((i*13)%7)/10});
const dur=t+1;
const expr=segs.map(([a,d])=>`between(t,${a.toFixed(3)},${(a+d).toFixed(3)})`).join('+');
const FF=process.env.HOME+'/bin/ffmpeg', out=path.join(__dirname,'../chk');
execFileSync(FF,['-y','-loglevel','error','-f','lavfi','-i',`aevalsrc='0.2*sin(2*PI*220*t)*(${expr})':s=48000:d=${dur.toFixed(2)}`,out+'/fake.wav']);
fs.writeFileSync(out+'/fake.json',JSON.stringify({id:'fake',duration:dur,cues,script:SCRIPT.map(s=>({text:s[1]}))}));
console.log('fake take',dur.toFixed(1),'s');
