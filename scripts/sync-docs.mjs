import { cpSync, mkdirSync, readdirSync, watch } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = join(root, "docs");
const contentDir = join(root, "content");

function copyMarkdownTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, name.name);
    const destPath = join(dest, name.name);
    if (name.isDirectory()) {
      copyMarkdownTree(srcPath, destPath);
      continue;
    }
    if (!name.name.endsWith(".md") || name.name === "README.md") continue;
    cpSync(srcPath, destPath, { force: true });
  }
}

function syncDocs() {
  copyMarkdownTree(docsDir, contentDir);
}

syncDocs();

if (process.argv.includes("--watch")) {
  watch(docsDir, { recursive: true }, () => syncDocs());
  spawn("npx", ["vitepress", "dev"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
}
