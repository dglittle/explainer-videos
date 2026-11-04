// YouTube metadata updater. usage:
//   node update.js --id VIDEOID [--title T] [--descfile F] [--privacy private|unlisted|public] [--dry]
// reads current snippet/status, merges, PUTs videos.update (part=snippet,status)
const fs = require("fs"), https = require("https");
const { OAuth2Client } = require("google-auth-library");
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith("--") ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true] : []).filter(Boolean));
const cs = JSON.parse(fs.readFileSync(__dirname + "/client_secret.json", "utf8")); const cc = cs.installed || cs.web;
const log = (...a) => console.log(new Date().toISOString(), ...a);
function req(url, opts, body) {
  return new Promise((res, rej) => {
    const r = https.request(url, opts, (resp) => { let d = ""; resp.on("data", c => d += c); resp.on("end", () => res({ status: resp.statusCode, headers: resp.headers, body: d })); });
    r.on("error", rej); r.end(body);
  });
}
(async () => {
  const client = new OAuth2Client(cc.client_id, cc.client_secret);
  client.setCredentials(JSON.parse(fs.readFileSync(__dirname + "/token.json", "utf8")));
  const hdr = async (extra = {}) => ({ Authorization: "Bearer " + (await client.getAccessToken()).token, ...extra });
  const id = args.id;
  const g = await req(`https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${id}`, { method: "GET", headers: await hdr() });
  if (g.status !== 200) { log("videos.list failed", g.status, g.body.slice(0, 500)); process.exit(1); }
  const items = JSON.parse(g.body).items;
  if (!items || !items.length) { log("no such video (or not yours)", id); process.exit(1); }
  const cur = items[0];
  log("BEFORE title:", JSON.stringify(cur.snippet.title), "privacy:", cur.status.privacyStatus, "descLen:", (cur.snippet.description || "").length);
  const snippet = { ...cur.snippet };
  if (args.title) snippet.title = args.title;
  if (args.descfile) snippet.description = fs.readFileSync(args.descfile, "utf8").replace(/\s+$/, "");
  delete snippet.thumbnails; delete snippet.publishedAt; delete snippet.channelTitle; delete snippet.localized;
  const status = { ...cur.status };
  if (args.privacy) status.privacyStatus = args.privacy;
  const payload = JSON.stringify({ id, snippet, status });
  if (args.dry) { log("DRY payload:", payload); return; }
  const p = await req("https://www.googleapis.com/youtube/v3/videos?part=snippet,status", { method: "PUT", headers: await hdr({ "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }) }, payload);
  if (p.status !== 200) { log("update failed", p.status, p.body.slice(0, 800)); process.exit(1); }
  const v = JSON.parse(p.body);
  log("AFTER  title:", JSON.stringify(v.snippet.title), "privacy:", v.status.privacyStatus);
  log("description:\n" + v.snippet.description);
  log("https://youtu.be/" + v.id);
})().catch(e => { log("fatal", e.message); process.exit(1); });
