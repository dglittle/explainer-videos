// list the channel's newest uploads: node latest.js [N]
const fs=require("fs"),https=require("https");const{OAuth2Client}=require("google-auth-library");
const cs=JSON.parse(fs.readFileSync(__dirname+"/client_secret.json","utf8"));const cc=cs.installed||cs.web;
const get=(u,h)=>new Promise((res,rej)=>{https.get(u,{headers:h},r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(JSON.parse(d)))}).on("error",rej)});
(async()=>{const c=new OAuth2Client(cc.client_id,cc.client_secret);c.setCredentials(JSON.parse(fs.readFileSync(__dirname+"/token.json","utf8")));
const h={Authorization:"Bearer "+(await c.getAccessToken()).token};
const ch=await get("https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet,statistics&mine=true",h);
const it=ch.items[0];console.log("channel:",it.snippet.title,it.id,"videos:",it.statistics.videoCount,"subs:",it.statistics.subscriberCount);
const pl=it.contentDetails.relatedPlaylists.uploads;
const p=await get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=${+process.argv[2]||5}&playlistId=${pl}`,h);
(p.items||[]).forEach((x,i)=>console.log(i+1,x.snippet.publishedAt,x.status&&x.status.privacyStatus,x.snippet.resourceId.videoId,JSON.stringify(x.snippet.title).slice(0,70)));
if(p.error)console.log("ERR",JSON.stringify(p.error).slice(0,300));})().catch(e=>console.log("fatal",e.message));
