// one-time consent: node auth.js  (needs client_secret.json in this dir; writes token.json)
const fs = require("fs"), http = require("http"), { execFile } = require("child_process");
const { OAuth2Client } = require("google-auth-library");
const cs = JSON.parse(fs.readFileSync(__dirname + "/client_secret.json", "utf8")); const c = cs.installed || cs.web;
const PORT = 8091, redirect = `http://localhost:${PORT}/`;
const o = new OAuth2Client(c.client_id, c.client_secret, redirect);
const url = o.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/youtube.force-ssl"] });
http.createServer(async (req, res) => {
  const u = new URL(req.url, redirect); const code = u.searchParams.get("code");
  if (!code) { res.end("no code: " + (u.searchParams.get("error") || "")); return; }
  try {
    const { tokens } = await o.getToken(code);
    fs.writeFileSync(__dirname + "/token.json", JSON.stringify(tokens), { mode: 0o600 });
    res.end("pima: token saved — you can close this tab."); console.log("TOKEN_SAVED"); setTimeout(() => process.exit(0), 500);
  } catch (e) { res.end("error: " + e.message); console.log("ERR", e.message); }
}).listen(PORT, () => { console.log("AUTH_URL", url); execFile("open", [url]); });
