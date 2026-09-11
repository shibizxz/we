import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const assets = join(dist, "assets");
const server = join(dist, "server");

if (dirname(resolve(dist)) !== resolve(root) || resolve(dist) === resolve(root)) {
  throw new Error("Build output must remain inside the project directory.");
}
if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(assets, { recursive: true });
mkdirSync(server, { recursive: true });

for (const file of readdirSync(root)) {
  if (/\.(html|css|js|txt|xml)$/i.test(file)) cpSync(join(root, file), join(assets, file));
}
cpSync(join(root, "assets"), join(assets, "assets"), { recursive: true });

writeFileSync(join(server, "index.js"), `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`);
writeFileSync(join(server, "wrangler.json"), JSON.stringify({
  name: "webappzz-technologies-studio",
  main: "index.js",
  compatibility_date: "2026-08-28",
  assets: { directory: "../assets", binding: "ASSETS" }
}, null, 2));

console.log("Built static site into dist/");
