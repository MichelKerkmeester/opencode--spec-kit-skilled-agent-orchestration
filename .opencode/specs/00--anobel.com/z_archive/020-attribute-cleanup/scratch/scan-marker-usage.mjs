import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const SRC_DIR = path.join(REPO_ROOT, 'src');

const ATTRIBUTE_CLEANUP_FILE = path.join(
  SRC_DIR,
  '2_javascript/global/attribute_cleanup.js'
);

const EXCLUDE_DIR = path.join(SRC_DIR, '2_javascript/z_minified');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizePath(p) {
  return p.split(path.sep).join('/');
}

async function readEmptyAttributes() {
  const content = await fs.readFile(ATTRIBUTE_CLEANUP_FILE, 'utf8');

  const arrayMatch =
    content.match(/\bemptyAttributes\s*:\s*\[([\s\S]*?)\]/m) ||
    content.match(/\bCONFIG\.emptyAttributes\s*=\s*\[([\s\S]*?)\]/m);

  if (!arrayMatch) {
    throw new Error(
      `Could not find CONFIG.emptyAttributes array in ${normalizePath(
        path.relative(REPO_ROOT, ATTRIBUTE_CLEANUP_FILE)
      )}`
    );
  }

  const attrs = [];
  const literalRe = /['"]([^'"]+)['"]/g;
  for (const m of arrayMatch[1].matchAll(literalRe)) {
    attrs.push(m[1]);
  }

  return Array.from(new Set(attrs));
}

async function* walkFiles(dirAbs) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dirAbs, entry.name);

    if (abs === EXCLUDE_DIR || abs.startsWith(`${EXCLUDE_DIR}${path.sep}`)) {
      continue;
    }

    if (entry.isDirectory()) {
      yield* walkFiles(abs);
      continue;
    }

    yield abs;
  }
}

function getExtKind(fileAbs) {
  const ext = path.extname(fileAbs).toLowerCase();
  if (ext === '.css') return 'css';
  if (ext === '.js') return 'js';
  if (ext === '.html' || ext === '.htm') return 'html';
  return null;
}

function formatUsage(usages) {
  const order = ['selector', 'js', 'html'];
  return order.filter((k) => usages.has(k)).join(',');
}

async function main() {
  const attributes = await readEmptyAttributes();

  if (attributes.length === 0) {
    console.log('No attributes found in CONFIG.emptyAttributes.');
    return;
  }

  const alt = attributes
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join('|');

  const selectorRe = new RegExp(`\\[(${alt})\\s*\\]`);
  const jsRe = new RegExp(
    `\\b(?:hasAttribute|toggleAttribute)\\s*\\(\\s*(['\"])\\s*(${alt})\\s*\\1\\s*\\)`
  );

  // Note: we avoid \b because it doesn't work reliably with '-' in attribute names.
  const nameCharClass = 'A-Za-z0-9_:\\-';
  const htmlRe = new RegExp(
    `<[^>]*?[^${nameCharClass}](${alt})(?![${nameCharClass}])(?!\\s*=)[^>]*?>`
  );

  const results = new Map();
  for (const attr of attributes) {
    results.set(attr, {
      usages: new Set(),
      example: null, // { fileRel, line }
    });
  }

  for await (const fileAbs of walkFiles(SRC_DIR)) {
    if (fileAbs === ATTRIBUTE_CLEANUP_FILE) continue;

    const kind = getExtKind(fileAbs);
    if (!kind) continue;

    const fileRel = normalizePath(path.relative(REPO_ROOT, fileAbs));
    const content = await fs.readFile(fileAbs, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNo = i + 1;

      if (kind === 'css' || kind === 'js') {
        const m = line.match(selectorRe);
        if (m) {
          const attr = m[1];
          const r = results.get(attr);
          if (r) {
            r.usages.add('selector');
            if (!r.example) r.example = { fileRel, line: lineNo };
          }
        }
      }

      if (kind === 'js') {
        const m = line.match(jsRe);
        if (m) {
          const attr = m[2];
          const r = results.get(attr);
          if (r) {
            r.usages.add('js');
            if (!r.example) r.example = { fileRel, line: lineNo };
          }
        }
      }

      if (kind === 'html') {
        const m = line.match(htmlRe);
        if (m) {
          const attr = m[1];
          const r = results.get(attr);
          if (r) {
            r.usages.add('html');
            if (!r.example) r.example = { fileRel, line: lineNo };
          }
        }
      }
    }
  }

  const rows = [];
  for (const attr of attributes) {
    const r = results.get(attr);
    if (!r || r.usages.size === 0 || !r.example) continue;
    rows.push({
      attr,
      usage: formatUsage(r.usages),
      example: `${r.example.fileRel}:${r.example.line}`,
    });
  }

  rows.sort((a, b) => a.attr.localeCompare(b.attr));

  console.log(`| Attribute | Marker usage | Example |`);
  console.log(`| --- | --- | --- |`);
  for (const row of rows) {
    console.log(`| ${row.attr} | ${row.usage} | ${row.example} |`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
