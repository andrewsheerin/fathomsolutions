import { existsSync, copyFileSync, mkdirSync } from "node:fs";

const dist = new URL("../dist/", import.meta.url);
mkdirSync(dist, { recursive: true });

const src = new URL("../CNAME", import.meta.url);
const dst = new URL("../dist/CNAME", import.meta.url);

if (existsSync(src)) {
  copyFileSync(src, dst);
  console.log("Copied CNAME -> dist/CNAME");
} else {
  console.log("No CNAME found; skipping");
}
