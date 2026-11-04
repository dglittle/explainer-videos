// node add-repo-link.js ID FOLDER [--dry] — append the explainer-videos repo link to a video's description (once).
// Saves the current description to desc-backup/ID-<time>.txt first, writes the new one to desc-repo/ID.txt, runs update.js.
const fs=require("fs"),https=require("https"),{execFileSync}=require("child_process");const{OAuth2Client}=require("google-auth-library");
const [id,folder]=process.argv.slice(2),dry=process.argv.includes("--dry");
const cs=JSON.parse(fs.readFileSync(__dirname+"/client_secret.json","utf8"));const cc=cs.installed||cs.web;
const get=(u,h)=>new Promise((res,rej)=>https.get(u,{headers:h},r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(JSON.parse(d)))}).on("error",rej));
(async()=>{const c=new OAuth2Client(cc.client_id,cc.client_secret);c.setCredentials(JSON.parse(fs.readFileSync(__dirname+"/token.json","utf8")));
 const t=(await c.getAccessToken()).token;
 const v=(await get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}`,{Authorization:"Bearer "+t})).items[0];
 const desc=v.snippet.description;
 fs.mkdirSync(__dirname+"/desc-backup",{recursive:true});fs.mkdirSync(__dirname+"/desc-repo",{recursive:true});
 fs.writeFileSync(`${__dirname}/desc-backup/${id}-${Date.now()}.txt`,desc);
 if(desc.includes("github.com/dglittle/explainer-videos")){console.log(id,"already linked");return}
 const line=`how it was made (the code, the full session log, all the tricks; MIT): https://github.com/dglittle/explainer-videos/tree/main/videos/${folder}`;
 const out=desc.replace(/\s+$/,"")+"\n\n"+line;
 if(out.length>5000){console.log(id,"too long",out.length);return}
 fs.writeFileSync(`${__dirname}/desc-repo/${id}.txt`,out);
 console.log(id,JSON.stringify(v.snippet.title),"desc",desc.length,"->",out.length,dry?"(dry)":"");
 if(!dry)console.log(execFileSync(process.execPath,[__dirname+"/update.js","--id",id,"--descfile",`${__dirname}/desc-repo/${id}.txt`]).toString().trim().split("\n").slice(-1)[0]);
})();
