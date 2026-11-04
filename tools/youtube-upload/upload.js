// YouTube resumable uploader. usage:
//   node upload.js --check
//   node upload.js --file F --title T [--desc D] [--privacy private|unlisted|public]
// auth: client_secret.json + token.json (from auth.js) in this dir
const fs = require("fs"), https = require("https");
const { OAuth2Client } = require("google-auth-library");
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith("--") ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true] : []).filter(Boolean));
const cs = JSON.parse(fs.readFileSync(__dirname + "/client_secret.json", "utf8")); const cc = cs.installed || cs.web;
const log = (...a) => console.log(new Date().toISOString(), ...a);
function req(url, opts, body) {
  return new Promise((res, rej) => {
    const r = https.request(url, opts, (resp) => { let d = ""; resp.on("data", c => d += c); resp.on("end", () => res({ status: resp.statusCode, headers: resp.headers, body: d })); });
    r.on("error", rej); if (body && body.pipe) body.pipe(r); else r.end(body);
  });
}
(async () => {
  const client = new OAuth2Client(cc.client_id, cc.client_secret);
  client.setCredentials(JSON.parse(fs.readFileSync(__dirname + "/token.json", "utf8")));
  const tok = async () => "Bearer " + (await client.getAccessToken()).token;
  const hdr = async (extra = {}) => ({ Authorization: await tok(), ...extra });
  if (args.check) {
    const r = await req("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", { method: "GET", headers: await hdr() });
    log("channels.list", r.status, r.body.slice(0, 600)); return;
  }
  const file = args.file, size = fs.statSync(file).size;
  const meta = JSON.stringify({ snippet: { title: args.title, description: args.desc || "", categoryId: "22" }, status: { privacyStatus: args.privacy || "private", selfDeclaredMadeForKids: false } });
  const init = await req("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", { method: "POST", headers: await hdr({ "Content-Type": "application/json", "X-Upload-Content-Type": "video/mp4", "X-Upload-Content-Length": size }) }, meta);
  if (init.status !== 200) { log("init failed", init.status, init.body); process.exit(1); }
  const loc = init.headers.location; log("session", loc.slice(0, 80) + "…", "size", size);
  let start = 0;
  for (let attempt = 1; attempt <= 8; attempt++) {
    if (attempt > 1) {
      const st = await req(loc, { method: "PUT", headers: await hdr({ "Content-Range": `bytes */${size}`, "Content-Length": 0 }) });
      if (st.status === 200 || st.status === 201) { log("done", st.body); return finish(st.body); }
      const m = /bytes=0-(\d+)/.exec(st.headers.range || ""); start = m ? +m[1] + 1 : 0; log("resume from", start, "status", st.status);
    }
    const stream = fs.createReadStream(file, { start });
    let sent = start, last = Date.now(); stream.on("data", c => { sent += c.length; if (Date.now() - last > 15000) { last = Date.now(); log(`${(sent / size * 100).toFixed(1)}% ${(sent / 1e6).toFixed(0)}MB`); } });
    try {
      const r = await req(loc, { method: "PUT", headers: await hdr({ "Content-Type": "video/mp4", "Content-Length": size - start, "Content-Range": `bytes ${start}-${size - 1}/${size}` }) }, stream);
      if (r.status === 200 || r.status === 201) { log("done", r.body); return finish(r.body); }
      log("chunk status", r.status, r.body.slice(0, 300));
    } catch (e) { log("error", e.message); }
    await new Promise(r => setTimeout(r, 5000 * attempt));
  }
  log("gave up"); process.exit(1);
  function finish(body) { const v = JSON.parse(body); log("VIDEO_ID", v.id, "https://youtu.be/" + v.id, "privacy", v.status && v.status.privacyStatus); }
})().catch(e => { log("fatal", e.message); process.exit(1); });
