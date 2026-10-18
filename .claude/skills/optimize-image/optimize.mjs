// Usage: node .claude/skills/optimize-image/optimize.mjs <url> <name> [maxWidth=1600]
// Downloads an image, resizes it to fit maxWidth (never upscales), writes public/images/<name>.webp.
// shortcut: sharp comes in transitively via next; add it to package.json if next ever drops it.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [url, name, maxWidth = "1600"] = process.argv.slice(2);
if (!url || !name) throw new Error("usage: optimize.mjs <url> <name> [maxWidth]");
if (!/^https?:\/\//.test(url)) throw new Error(`not an http(s) URL: ${url}`);
if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`name must be kebab-case [a-z0-9-]: ${name}`);
const width = Number(maxWidth);
if (!Number.isInteger(width) || width < 1) throw new Error(`bad maxWidth: ${maxWidth}`);

const res = await fetch(url);
if (!res.ok) throw new Error(`download failed: ${res.status} ${res.statusText}`);
const type = res.headers.get("content-type") ?? "";
if (!type.startsWith("image/")) throw new Error(`not an image (content-type: ${type})`);

const outDir = path.join(process.cwd(), "public", "images");
await mkdir(outDir, { recursive: true });
const out = path.join(outDir, `${name}.webp`);
const info = await sharp(Buffer.from(await res.arrayBuffer()))
  .rotate() // honor EXIF orientation before metadata is stripped
  .resize({ width, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(out);

console.log(`/images/${name}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
