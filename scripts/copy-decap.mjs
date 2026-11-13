// Copies the Decap CMS app from node_modules into public/admin/decap so /admin is served from our own
// domain (no third-party CDN, and the version is the one in package-lock.json).
// Runs before `npm run dev` and `npm run build`. The copy is not committed.
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const from = path.join(root, 'node_modules', 'decap-cms', 'dist');
const to = path.join(root, 'public', 'admin', 'decap');

if (!fs.existsSync(from)) throw new Error('decap-cms is not installed. Run `npm install` first.');
fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });

let count = 0;
for (const name of fs.readdirSync(from)) {
  if (name.endsWith('.map') || name.endsWith('.LICENSE.txt')) continue; // source maps are ~50 MB and only for debugging
  fs.copyFileSync(path.join(from, name), path.join(to, name));
  count++;
}
console.log(`decap-cms copied to public/admin/decap (${count} files)`);
