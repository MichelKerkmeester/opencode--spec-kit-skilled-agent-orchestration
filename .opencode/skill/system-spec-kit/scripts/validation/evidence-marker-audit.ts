#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Evidence Marker Audit (v2 — bracket-depth parser)
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. EVIDENCE MARKER AUDIT
// ───────────────────────────────────────────────────────────────
// Audits `[EVIDENCE: ...]` markers across spec folders and distinguishes:
//   - OK            : marker closed with `]`, depth returned to 0 (content may contain parens)
//   - MALFORMED     : marker closed with `)` at end-of-line (closer typo — needs rewrap)
//   - UNCLOSED      : marker crosses newline with no balanced `]` and no trailing `)` — rare
//   - FALSE-POSITIVE: reserved label for markers that are legal-but-look-suspicious
//                     (e.g. content contains unescaped parens). We report but never mutate.
//
// ## Grammar (state machine)
//   Base states: NORMAL → IN_BACKTICK_SPAN → IN_FENCED_CODE → IN_MARKER
//   Transitions (summary):
//     NORMAL + "```" at line start         → IN_FENCED_CODE   (until closing ``` at line start)
//     NORMAL + "`"                         → IN_BACKTICK_SPAN (until next unescaped `)
//     NORMAL + "[EVIDENCE:"                → IN_MARKER (depth=1, starts bracket-counting)
//     IN_MARKER + "["                      → depth++
//     IN_MARKER + "]"                      → depth--. When depth=0, marker closed OK.
//     IN_MARKER + "\n"                     → if last non-space char on line was `)`, mark MALFORMED.
//                                            Otherwise mark UNCLOSED. Exit marker state either way.
//     IN_BACKTICK_SPAN + "`"               → NORMAL (backticks never enter markers)
//     IN_FENCED_CODE + "```" at line start → NORMAL
//   Parens `(` and `)` are ignored inside markers — they are legal content chars.
//
// Markers spanning fenced code blocks or inside backtick spans are treated as code-example
// content and do NOT count as real markers. This is critical for spec documents that
// frequently show `[EVIDENCE:...]` as an example inside an inline code span or fenced block.
//
// ## CLI usage
//   node dist/validation/evidence-marker-audit.js                      → audit default tree (026)
//   node dist/validation/evidence-marker-audit.js --folder=PATH        → audit one folder
//   node dist/validation/evidence-marker-audit.js --rewrap             → apply rewrap to malformed
//   node dist/validation/evidence-marker-audit.js --json               → JSON output only
//
// Or via tsx (no build required):
//   npx tsx validation/evidence-marker-audit.ts [--folder=...] [--rewrap] [--json]
//
// Without --rewrap the tool is read-only and emits a report. With --rewrap it rewrites
// the single terminating `)` → `]` for every MALFORMED marker. UNCLOSED markers are
// never auto-rewritten (manual review required — they may indicate a paste-error or
// truncated line).

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
------------------------------------------------------------------*/

export type MarkerStatus = 'ok' | 'malformed' | 'unclosed';

export interface Marker {
  /** Absolute path of the file containing the marker. */
  file: string;
  /** 1-based line number where `[EVIDENCE:` begins. */
  line: number;
  /** 0-based column where `[` of `[EVIDENCE:` lives. */
  col: number;
  /** Full marker substring (from `[` through terminating char). */
  raw: string;
  /** True if the marker content contains at least one `(` or `)`. */
  contentHasParens: boolean;
  /** How the marker was terminated. */
  status: MarkerStatus;
  /**
   * Byte offset (within the file) of the terminating character. For MALFORMED
   * markers, the rewrap step rewrites the single byte at this offset from `)` to `]`.
   * Undefined when status is 'unclosed' without a trailing `)`.
   */
  closerOffset?: number;
}

export interface FolderAuditResult {
  folder: string;
  filesScanned: number;
  totalMarkers: number;
  ok: number;
  malformed: number;
  unclosed: number;
  rewrapped: number;
  markers: Marker[];
}

/* ───────────────────────────────────────────────────────────────
   3. PARSER (state machine)
------------------------------------------------------------------*/

/**
 * Walk the file content once, emitting every `[EVIDENCE:...]` marker with its status.
 *
 * The function maintains four mutually exclusive states:
 *   - NORMAL              (outside any special context)
 *   - IN_BACKTICK_SPAN    (between two `, single-line)
 *   - IN_FENCED_CODE      (between two ``` lines)
 *   - IN_MARKER           (between `[EVIDENCE:` and its closer)
 *
 * IN_MARKER tracks `[`/`]` depth and records the exact offset of the terminating
 * character. Parens `(` and `)` are ignored inside markers (legal content).
 */
export function parseMarkers(content: string, filePath: string): Marker[] {
  const markers: Marker[] = [];
  const EVIDENCE_OPEN = '[EVIDENCE:';

  let i = 0;
  let line = 1;
  let col = 0;
  let lineStart = 0;

  // Mutually exclusive states (only one can be true at a time).
  let inFencedCode = false;
  let inBacktickSpan = false;

  // Marker state (engages only when neither fenced nor backtick).
  let inMarker = false;
  let markerDepth = 0;
  let markerStartOffset = -1;
  let markerStartLine = -1;
  let markerStartCol = -1;
  let markerContentHasParens = false;

  const len = content.length;

  while (i < len) {
    const ch = content[i];

    // Fence detection. A fence is "```" at the start of a line (ignoring leading whitespace
    // is intentionally NOT supported — GFM fences must be at column 0 in our spec docs).
    if (!inBacktickSpan && !inMarker && i === lineStart &&
        content[i] === '`' && content[i + 1] === '`' && content[i + 2] === '`') {
      inFencedCode = !inFencedCode;
      // Skip the three backticks plus the rest of the line.
      while (i < len && content[i] !== '\n') i++;
      if (i < len) {
        // Advance past the newline.
        line++;
        i++;
        lineStart = i;
        col = 0;
      }
      continue;
    }

    // Inside a fenced block, swallow everything until the closer.
    if (inFencedCode) {
      if (ch === '\n') {
        line++;
        i++;
        lineStart = i;
        col = 0;
      } else {
        i++;
        col++;
      }
      continue;
    }

    // Inline backtick span. Single backticks only — multi-backtick spans (`` `code` ``) are
    // handled the same way: first `` ` `` opens, next `` ` `` closes. This matches CommonMark
    // closely enough for our spec docs (no backtick-in-backtick scenarios observed).
    if (!inMarker && ch === '`') {
      inBacktickSpan = !inBacktickSpan;
      i++;
      col++;
      continue;
    }

    if (inBacktickSpan) {
      // End of backtick span is handled above; here we just skip content, but we do
      // advance line counters on newline so inline backticks that (illegally) span
      // lines still track position correctly.
      if (ch === '\n') {
        // A backtick span that crosses a newline is actually closed at end-of-line per
        // CommonMark. Treat newline as implicit close.
        inBacktickSpan = false;
        line++;
        i++;
        lineStart = i;
        col = 0;
      } else {
        i++;
        col++;
      }
      continue;
    }

    // Not in code context. Look for marker entry.
    if (!inMarker) {
      // Detect `[EVIDENCE:` at this position.
      if (ch === '[' && content.startsWith(EVIDENCE_OPEN, i)) {
        inMarker = true;
        markerDepth = 1;
        markerStartOffset = i;
        markerStartLine = line;
        markerStartCol = col;
        markerContentHasParens = false;
        i += EVIDENCE_OPEN.length;
        col += EVIDENCE_OPEN.length;
        continue;
      }
      if (ch === '\n') {
        line++;
        i++;
        lineStart = i;
        col = 0;
      } else {
        i++;
        col++;
      }
      continue;
    }

    // inMarker === true. Track bracket depth; ignore parens (they're legal content).
    // Also observe parens only to set contentHasParens for reporting.
    if (ch === '[') {
      markerDepth++;
      i++;
      col++;
      continue;
    }
    if (ch === ']') {
      markerDepth--;
      i++;
      col++;
      if (markerDepth === 0) {
        // Marker closed OK.
        markers.push({
          file: filePath,
          line: markerStartLine,
          col: markerStartCol,
          raw: content.slice(markerStartOffset, i),
          contentHasParens: markerContentHasParens,
          status: 'ok',
          closerOffset: i - 1,
        });
        inMarker = false;
        markerDepth = 0;
      }
      continue;
    }
    if (ch === '(' || ch === ')') {
      markerContentHasParens = true;
      i++;
      col++;
      continue;
    }
    if (ch === '\n') {
      // Marker did not close on this line. Inspect the last non-space char of the line
      // to decide MALFORMED vs UNCLOSED.
      let endScan = i - 1;
      while (endScan >= markerStartOffset && (content[endScan] === ' ' || content[endScan] === '\t')) {
        endScan--;
      }
      const lastChar = endScan >= markerStartOffset ? content[endScan] : '';
      const raw = content.slice(markerStartOffset, i);
      if (lastChar === ')') {
        markers.push({
          file: filePath,
          line: markerStartLine,
          col: markerStartCol,
          raw,
          contentHasParens: markerContentHasParens,
          status: 'malformed',
          closerOffset: endScan,
        });
      } else {
        markers.push({
          file: filePath,
          line: markerStartLine,
          col: markerStartCol,
          raw,
          contentHasParens: markerContentHasParens,
          status: 'unclosed',
          // closerOffset intentionally undefined — no safe auto-fix.
        });
      }
      inMarker = false;
      markerDepth = 0;
      // Consume the newline.
      line++;
      i++;
      lineStart = i;
      col = 0;
      continue;
    }
    // Any other char inside marker: advance.
    i++;
    col++;
  }

  // EOF while still in a marker.
  if (inMarker) {
    let endScan = len - 1;
    while (endScan >= markerStartOffset && (content[endScan] === ' ' || content[endScan] === '\t' || content[endScan] === '\n')) {
      endScan--;
    }
    const lastChar = endScan >= markerStartOffset ? content[endScan] : '';
    const raw = content.slice(markerStartOffset);
    if (lastChar === ')') {
      markers.push({
        file: filePath,
        line: markerStartLine,
        col: markerStartCol,
        raw,
        contentHasParens: markerContentHasParens,
        status: 'malformed',
        closerOffset: endScan,
      });
    } else {
      markers.push({
        file: filePath,
        line: markerStartLine,
        col: markerStartCol,
        raw,
        contentHasParens: markerContentHasParens,
        status: 'unclosed',
      });
    }
  }

  return markers;
}

/* ───────────────────────────────────────────────────────────────
   4. FILE AUDIT
------------------------------------------------------------------*/

export async function auditFile(filePath: string): Promise<Marker[]> {
  const content = await fs.readFile(filePath, 'utf8');
  return parseMarkers(content, filePath);
}

/* ───────────────────────────────────────────────────────────────
   5. FOLDER AUDIT (recursive walk)
------------------------------------------------------------------*/

async function collectMarkdownFiles(folderPath: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

export async function auditFolder(folderPath: string, opts: { rewrap: boolean }): Promise<FolderAuditResult> {
  const files = await collectMarkdownFiles(folderPath);
  const allMarkers: Marker[] = [];
  for (const f of files) {
    allMarkers.push(...(await auditFile(f)));
  }

  let rewrapped = 0;
  if (opts.rewrap) {
    // Group malformed markers by file.
    const byFile = new Map<string, Marker[]>();
    for (const m of allMarkers) {
      if (m.status !== 'malformed' || m.closerOffset === undefined) continue;
      const arr = byFile.get(m.file) ?? [];
      arr.push(m);
      byFile.set(m.file, arr);
    }
    for (const [file, markers] of byFile) {
      let content = await fs.readFile(file, 'utf8');
      // Apply rewraps in descending offset order. closerOffset is a JS string index
      // (UTF-16 code units), which matches the positions we track in parseMarkers.
      // Using string splice (slice + slice) is UTF-8 safe because we re-encode on write.
      const sorted = [...markers].sort((a, b) => (b.closerOffset ?? 0) - (a.closerOffset ?? 0));
      for (const m of sorted) {
        if (m.closerOffset === undefined) continue;
        const current = content.charCodeAt(m.closerOffset);
        // Safety: only rewrite if the char is actually ')'. If the closerOffset points
        // somewhere else, bail without mutating (indicates a parser/state bug).
        if (current !== 0x29 /* ')' */) continue;
        content = content.slice(0, m.closerOffset) + ']' + content.slice(m.closerOffset + 1);
        rewrapped++;
      }
      await fs.writeFile(file, content, 'utf8');
    }
  }

  return {
    folder: folderPath,
    filesScanned: files.length,
    totalMarkers: allMarkers.length,
    ok: allMarkers.filter((m) => m.status === 'ok').length,
    malformed: allMarkers.filter((m) => m.status === 'malformed').length,
    unclosed: allMarkers.filter((m) => m.status === 'unclosed').length,
    rewrapped,
    markers: allMarkers,
  };
}

/* ───────────────────────────────────────────────────────────────
   6. CLI
------------------------------------------------------------------*/

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const folderArg = args.find((a) => a.startsWith('--folder='))?.split('=')[1];
  const rewrap = args.includes('--rewrap');
  const emitJson = args.includes('--json');

  // Default audit tree: every direct child of 026-graph-and-context-optimization.
  const DEFAULT_ROOT = path.resolve(
    process.cwd(),
    '.opencode/specs/system-spec-kit/026-graph-and-context-optimization',
  );

  let folders: string[];
  if (folderArg) {
    folders = [path.resolve(process.cwd(), folderArg)];
  } else if (await pathExists(DEFAULT_ROOT)) {
    // Scan only direct numbered children of 026. The 026 root itself recursively picks
    // up every child, so including it would double-count. To also scan 026-level loose
    // markdown (checklist.md, spec.md, etc.) without re-entering child dirs, see the
    // dedicated root-level pass below.
    const entries = await fs.readdir(DEFAULT_ROOT, { withFileTypes: true });
    folders = entries
      .filter((e) => e.isDirectory() && /^\d/.test(e.name))
      .map((e) => path.join(DEFAULT_ROOT, e.name));
  } else {
    console.error(`Default root not found: ${DEFAULT_ROOT}`);
    return 2;
  }

  const results: FolderAuditResult[] = [];
  for (const folder of folders) {
    results.push(await auditFolder(folder, { rewrap }));
  }

  // When using default scan (no --folder), also audit the 026 root itself BUT only its
  // direct loose markdown files (checklist.md, spec.md, etc.), not recursively into
  // numbered children (which are already covered by the per-child iteration above).
  if (!folderArg && (await pathExists(DEFAULT_ROOT))) {
    const rootEntries = await fs.readdir(DEFAULT_ROOT, { withFileTypes: true });
    const rootMds = rootEntries
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => path.join(DEFAULT_ROOT, e.name));
    const rootMarkers: Marker[] = [];
    for (const f of rootMds) rootMarkers.push(...(await auditFile(f)));
    let rootRewrapped = 0;
    if (rewrap) {
      const byFile = new Map<string, Marker[]>();
      for (const m of rootMarkers) {
        if (m.status !== 'malformed' || m.closerOffset === undefined) continue;
        const arr = byFile.get(m.file) ?? [];
        arr.push(m);
        byFile.set(m.file, arr);
      }
      for (const [file, markers] of byFile) {
        let content = await fs.readFile(file, 'utf8');
        const sorted = [...markers].sort((a, b) => (b.closerOffset ?? 0) - (a.closerOffset ?? 0));
        for (const m of sorted) {
          if (m.closerOffset === undefined) continue;
          if (content.charCodeAt(m.closerOffset) !== 0x29) continue;
          content = content.slice(0, m.closerOffset) + ']' + content.slice(m.closerOffset + 1);
          rootRewrapped++;
        }
        await fs.writeFile(file, content, 'utf8');
      }
    }
    results.push({
      folder: DEFAULT_ROOT + ' (root-loose-md)',
      filesScanned: rootMds.length,
      totalMarkers: rootMarkers.length,
      ok: rootMarkers.filter((m) => m.status === 'ok').length,
      malformed: rootMarkers.filter((m) => m.status === 'malformed').length,
      unclosed: rootMarkers.filter((m) => m.status === 'unclosed').length,
      rewrapped: rootRewrapped,
      markers: rootMarkers,
    });
  }

  const totals = results.reduce(
    (acc, r) => ({
      filesScanned: acc.filesScanned + r.filesScanned,
      totalMarkers: acc.totalMarkers + r.totalMarkers,
      ok: acc.ok + r.ok,
      malformed: acc.malformed + r.malformed,
      unclosed: acc.unclosed + r.unclosed,
      rewrapped: acc.rewrapped + r.rewrapped,
    }),
    { filesScanned: 0, totalMarkers: 0, ok: 0, malformed: 0, unclosed: 0, rewrapped: 0 },
  );

  if (emitJson) {
    const payload = {
      mode: rewrap ? 'rewrap' : 'report',
      totals,
      folders: results.map((r) => ({
        folder: r.folder,
        filesScanned: r.filesScanned,
        totalMarkers: r.totalMarkers,
        ok: r.ok,
        malformed: r.malformed,
        unclosed: r.unclosed,
        rewrapped: r.rewrapped,
      })),
    };
    process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
    return totals.unclosed > 0 && !rewrap ? 1 : 0;
  }

  // Human-readable markdown report.
  const lines: string[] = [];
  lines.push('# EVIDENCE marker audit report');
  lines.push('');
  lines.push(`Mode: **${rewrap ? 'REWRAP' : 'REPORT'}**`);
  lines.push('');
  lines.push('## Totals');
  lines.push('');
  lines.push(`- Folders scanned: ${results.length}`);
  lines.push(`- Files scanned: ${totals.filesScanned}`);
  lines.push(`- Total markers: ${totals.totalMarkers}`);
  lines.push(`- OK: ${totals.ok}`);
  lines.push(`- Malformed (closed with \`)\`): ${totals.malformed}`);
  lines.push(`- Unclosed (no trailing \`)\` before newline): ${totals.unclosed}`);
  if (rewrap) lines.push(`- Rewrapped: ${totals.rewrapped}`);
  lines.push('');
  lines.push('## Per-folder');
  lines.push('');
  lines.push('| Folder | Files | Total | OK | Malformed | Unclosed | Rewrapped |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const r of results) {
    const rel = path.relative(process.cwd(), r.folder);
    lines.push(
      `| \`${rel}\` | ${r.filesScanned} | ${r.totalMarkers} | ${r.ok} | ${r.malformed} | ${r.unclosed} | ${r.rewrapped} |`,
    );
  }

  // Detail section: list malformed + unclosed locations.
  const problems = results.flatMap((r) => r.markers).filter((m) => m.status !== 'ok');
  if (problems.length > 0) {
    lines.push('');
    lines.push('## Problem markers (detail)');
    lines.push('');
    for (const m of problems) {
      const rel = path.relative(process.cwd(), m.file);
      const rawPreview = m.raw.replace(/\n/g, '\\n').slice(0, 140);
      lines.push(`- \`${rel}:${m.line}\` [${m.status}] ${rawPreview}`);
    }
  }
  lines.push('');
  process.stdout.write(lines.join('\n'));

  // Exit code: 0 on clean, 1 if unresolved problems remain in report mode.
  if (!rewrap && (totals.malformed > 0 || totals.unclosed > 0)) return 1;
  return 0;
}

// Only run when invoked directly (not when imported by tests).
// CommonJS-safe guard — works whether this file is built to CJS or run via tsx.
const isDirectInvocation = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module;
  } catch {
    return false;
  }
})();

if (isDirectInvocation) {
  main().then((code) => process.exit(code)).catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
