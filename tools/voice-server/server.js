// greg-voice: voice-over take uploads for the yellow video (Crystal, 2026-10-12).
// POST /upload?k=KEY&id=ID&ext=webm  (raw audio body, ≤ 200 MB) -> takes/ID.ext
// POST /meta?k=KEY&id=ID  (JSON: script, cues, duration, note)   -> takes/ID.json
// GET  /list?k=KEY -> [{id, ext, bytes, meta}]   GET /take?k=KEY&f=FILE -> the file
const https = require('https'), fs = require('fs'), path = require('path');
const KEY = fs.readFileSync(__dirname + '/key.txt', 'utf8').trim();
const PORT = +process.env.PORT || 61920, DIR = __dirname + '/takes';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' };
const send = (res, code, obj) => { res.writeHead(code, { ...cors, 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
const okId = s => /^[\w.-]{1,80}$/.test(s || '');
https.createServer({ cert: fs.readFileSync('/home/bitnami/fullchain.pem'), key: fs.readFileSync('/home/bitnami/privkey.pem') }, (req, res) => {
  const u = new URL(req.url, 'https://x'), q = k => u.searchParams.get(k);
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (u.pathname === '/health') return send(res, 200, { ok: true });
  if (q('k') !== KEY) return send(res, 403, { error: 'bad key' });
  if (req.method === 'GET' && u.pathname === '/list') {
    const out = [];
    for (const f of fs.readdirSync(DIR).sort()) {
      if (f.endsWith('.json') || f.endsWith('.part')) continue;
      const id = f.replace(/\.[^.]+$/, ''), m = path.join(DIR, id + '.json');
      out.push({ id, file: f, bytes: fs.statSync(path.join(DIR, f)).size, meta: fs.existsSync(m) ? JSON.parse(fs.readFileSync(m)) : null });
    }
    return send(res, 200, out);
  }
  if (req.method === 'GET' && u.pathname === '/take') {
    const f = q('f'); if (!okId(f) || !fs.existsSync(path.join(DIR, f))) return send(res, 404, { error: 'no' });
    res.writeHead(200, { ...cors, 'content-type': 'application/octet-stream' }); return fs.createReadStream(path.join(DIR, f)).pipe(res);
  }
  const id = q('id'); if (!okId(id)) return send(res, 400, { error: 'bad id' });
  if (req.method === 'POST' && u.pathname === '/upload') {
    const ext = /^(webm|ogg|mp4|m4a|wav)$/.test(q('ext')) ? q('ext') : 'webm';
    const tmp = path.join(DIR, id + '.' + ext + '.part'), w = fs.createWriteStream(tmp); let n = 0;
    req.on('data', d => { n += d.length; if (n > 2e8) { req.destroy(); w.destroy(); fs.rmSync(tmp, { force: true }); } });
    req.pipe(w); w.on('finish', () => { fs.renameSync(tmp, path.join(DIR, id + '.' + ext)); console.log(new Date().toISOString(), 'upload', id, n); send(res, 200, { ok: true, bytes: n, file: id + '.' + ext }); });
    return;
  }
  if (req.method === 'POST' && u.pathname === '/meta') {
    let b = ''; req.on('data', d => { b += d; if (b.length > 1e6) req.destroy(); });
    req.on('end', () => { try { JSON.parse(b); } catch { return send(res, 400, { error: 'bad json' }); } fs.writeFileSync(path.join(DIR, id + '.json'), b); send(res, 200, { ok: true }); });
    return;
  }
  send(res, 404, { error: 'not found' });
}).listen(PORT, () => console.log('greg-voice on', PORT));
