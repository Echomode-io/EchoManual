import { cpSync, mkdirSync, readdirSync, rmSync, existsSync, watch } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = join(root, "docs");
const contentDir = join(root, "content");

// Copy every Markdown file from `src` into `dest`, recording each destination
// we write into `kept` so the prune pass knows what belongs in the mirror.
function copyMarkdownTree(src, dest, kept) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyMarkdownTree(srcPath, destPath, kept);
      continue;
    }
    if (!entry.name.endsWith(".md") || entry.name === "README.md") continue;
    cpSync(srcPath, destPath, { force: true });
    kept.add(destPath);
  }
}

// Guard: only ever delete paths that live *inside* contentDir, never contentDir
// itself, docsDir, or root. A misconfiguration should throw, not wipe the repo.
function assertInsideContent(target) {
  const rel = relative(contentDir, target);
  if (rel === "" || rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`Refusing to delete outside content/: ${target}`);
  }
}

// Remove any generated `.md` that no longer maps to a docs/ source, plus any
// directory left empty as a result, so `content/` stays a true mirror of docs/.
function pruneStale(dest, kept) {
  if (!existsSync(dest)) return;
  for (const entry of readdirSync(dest, { withFileTypes: true })) {
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      pruneStale(destPath, kept);
      if (readdirSync(destPath).length === 0) {
        assertInsideContent(destPath);
        rmSync(destPath, { recursive: true, force: true });
      }
      continue;
    }
    if (entry.name.endsWith(".md") && !kept.has(destPath)) {
      assertInsideContent(destPath);
      rmSync(destPath, { force: true });
    }
  }
}

function syncDocs() {
  const kept = new Set();
  copyMarkdownTree(docsDir, contentDir, kept);
  pruneStale(contentDir, kept);
}

syncDocs();

if (process.argv.includes("--watch")) {
  // Editors emit several fs events per save; coalesce a burst into one sync
  // instead of re-copying the whole tree on every event.
  const DEBOUNCE_MS = 200;
  let pending;
  const watcher = watch(docsDir, { recursive: true }, () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      try {
        syncDocs();
      } catch (err) {
        // A file caught mid-write shouldn't kill the watcher; the next event resyncs.
        console.error("[sync-docs] sync failed:", err);
      }
    }, DEBOUNCE_MS);
  });
  const child = spawn("npx", ["vitepress", "dev"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });

  function cleanup(code) {
    clearTimeout(pending);
    watcher.close();
    child.kill();
    process.exit(code ?? 0);
  }

  child.on("exit", (code) => {
    clearTimeout(pending);
    watcher.close();
    process.exit(code ?? 0);
  });

  child.on("error", (err) => {
    watcher.close();
    throw err;
  });

  process.on("SIGINT", () => cleanup());
  process.on("SIGTERM", () => cleanup());
}
