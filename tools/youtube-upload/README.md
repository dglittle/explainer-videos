# youtube-upload (Greg Little channel)

- Upload: `node upload.js --file F.mp4 --title "..." --desc "$(cat desc.txt)" --privacy public` (logs to upload.log; prints VIDEO_ID)
- Change metadata/privacy: `node update.js --id VIDEOID [--title T] [--descfile F] [--privacy private|unlisted|public]`
- Check the token: `node upload.js --check`
- Use node from ~/.nvm/versions/node/v22.13.1/bin.

## Token expiry
The OAuth app is in testing mode, so token.json stops working after about 7 days (uploads fail with `fatal invalid_grant`).
Fix: back up token.json (token-expired-YYYY-MM-DD.json), run `node auth.js` (opens a Google consent tab in the browser;
Greg signs in and allows it; it prints TOKEN_SAVED), then re-run the upload.
Renewed: Sep 13, Oct 12, Oct 21, Oct 29 2026 (next expiry ~Nov 5).
