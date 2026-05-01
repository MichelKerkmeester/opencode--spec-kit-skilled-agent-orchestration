// ---------------------------------------------------------------
// MODULE: Check Source / Dist Alignment
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INVESTIGATION NOTE
// ───────────────────────────────────────────────────────────────
// Investigated on 2026-03-19:
// - mcp_server/dist/lib/utils/retry.js traced to deleted source
//   mcp_server/lib/utils/retry.ts, removed in commit 5e49e272 on
//   2026-03-07. No matching source remains, so the stale dist
//   artifact set was removed.
// - mcp_server/dist/lib/eval/hydra-baseline.js traced to deleted
//   source mcp_server/lib/eval/hydra-baseline.ts, removed in commit
//   8bb6eb62 on 2026-03-13. Its logic was renamed/refactored into
//   mcp_server/lib/eval/memory-state-baseline.ts, so the stale
//   pre-rename dist artifact set was removed.
//
// F-020-D5-02 / F-020-D5-03 (2026-04-30):
// - The previous DIST_TARGETS set covered only `dist/lib` and `scripts/dist`,
//   so orphans elsewhere (e.g. `dist/tests/search-quality/harness.js` after
//   its source moved to `stress_test/search-quality/harness.ts`) were never
//   flagged. The targets now include every runtime-critical dist subtree:
//   skill_advisor, handlers, formatters, scripts, tools, code_graph, hooks,
//   matrix_runners, schemas, stress_test, tests, core, configs, api, utils.
//   Each target maps dist `*.js` back to the matching source `.ts` directory.
// - The stale `dist/tests/search-quality/harness.js` was removed in this
//   packet (007); the broadened scan ensures the same drift surfaces a
//   violation rather than going silent.

import * as fs from 'fs';
import * as path from 'path';
import { dirnameFromImportMeta } from '../lib/esm-entry.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

interface AllowlistException {
  file: string;
  reason: string;
  owner: string;
  date: string;
}

interface OrphanedDistFile {
  distFile: string;
  expectedSource: string;
  allowlistEntry?: AllowlistException;
}

interface DistTarget {
  label: string;
  distRoot: string;
  sourceRoot: string;
}

const REQUIRED_ROOT_DIRS = ['mcp_server', 'scripts'] as const;
// F-020-D5-02: time-bounded allowlist for known stragglers surfaced by the
// broadened scan. Each entry MUST include a follow-on owner and remediation
// date. The harness orphan (F-020-D5-03) is being deleted in this packet;
// the remaining three search-quality dist artifacts cannot be deleted by
// this packet under its scope discipline (only D5-03 authorized harness.js
// removal) and are time-boxed for a follow-on cleanup packet.
const ALLOWLIST_EXCEPTIONS: AllowlistException[] = [
  {
    file: 'dist/tests/search-quality/corpus.js',
    reason: 'F-020-D5-02 broadened scan surfaced this as an orphan after source moved to stress_test/search-quality/. Sibling of harness.js (F-020-D5-03) which was deleted in packet 007. Pending removal in a dist-cleanup follow-on.',
    owner: 'remediation-orchestrator',
    date: '2026-04-30',
  },
  {
    file: 'dist/tests/search-quality/measurement-fixtures.js',
    reason: 'F-020-D5-02 broadened scan surfaced this as an orphan after source moved to stress_test/search-quality/. Sibling of harness.js (F-020-D5-03) which was deleted in packet 007. Pending removal in a dist-cleanup follow-on.',
    owner: 'remediation-orchestrator',
    date: '2026-04-30',
  },
  {
    file: 'dist/tests/search-quality/metrics.js',
    reason: 'F-020-D5-02 broadened scan surfaced this as an orphan after source moved to stress_test/search-quality/. Sibling of harness.js (F-020-D5-03) which was deleted in packet 007. Pending removal in a dist-cleanup follow-on.',
    owner: 'remediation-orchestrator',
    date: '2026-04-30',
  },
];

function resolvePackageRoot(startDir: string): string {
  let cursor = path.resolve(startDir);

  while (true) {
    const hasRequiredDirs = REQUIRED_ROOT_DIRS.every((dirName) => {
      return fs.existsSync(path.join(cursor, dirName));
    });

    if (hasRequiredDirs) {
      return cursor;
    }

    const parent = path.dirname(cursor);
    if (parent === cursor) {
      throw new Error(`Unable to resolve package root from: ${startDir}`);
    }
    cursor = parent;
  }
}

function toPosix(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function findJsFiles(dir: string): string[] {
  const results: string[] = [];

  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.js')) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results.sort((left, right) => left.localeCompare(right));
}

// F-020-D5-02: cover runtime-critical dist subtrees beyond `dist/lib`. Each
// entry maps `mcp_server/dist/<sub>/*.js` back to `mcp_server/<sub>/*.ts`.
// New entries should be added when a new runtime subtree appears under
// `mcp_server/dist/`. Empty/optional dist roots are skipped at scan time.
const DIST_TARGETS: DistTarget[] = [
  {
    label: 'mcp_server/lib',
    distRoot: path.join('mcp_server', 'dist', 'lib'),
    sourceRoot: path.join('mcp_server', 'lib'),
  },
  {
    label: 'mcp_server/skill_advisor',
    distRoot: path.join('mcp_server', 'dist', 'skill_advisor'),
    sourceRoot: path.join('mcp_server', 'skill_advisor'),
  },
  {
    label: 'mcp_server/handlers',
    distRoot: path.join('mcp_server', 'dist', 'handlers'),
    sourceRoot: path.join('mcp_server', 'handlers'),
  },
  {
    label: 'mcp_server/formatters',
    distRoot: path.join('mcp_server', 'dist', 'formatters'),
    sourceRoot: path.join('mcp_server', 'formatters'),
  },
  {
    label: 'mcp_server/tools',
    distRoot: path.join('mcp_server', 'dist', 'tools'),
    sourceRoot: path.join('mcp_server', 'tools'),
  },
  {
    label: 'mcp_server/code_graph',
    distRoot: path.join('mcp_server', 'dist', 'code_graph'),
    sourceRoot: path.join('mcp_server', 'code_graph'),
  },
  {
    label: 'mcp_server/hooks',
    distRoot: path.join('mcp_server', 'dist', 'hooks'),
    sourceRoot: path.join('mcp_server', 'hooks'),
  },
  {
    label: 'mcp_server/matrix_runners',
    distRoot: path.join('mcp_server', 'dist', 'matrix_runners'),
    sourceRoot: path.join('mcp_server', 'matrix_runners'),
  },
  {
    label: 'mcp_server/schemas',
    distRoot: path.join('mcp_server', 'dist', 'schemas'),
    sourceRoot: path.join('mcp_server', 'schemas'),
  },
  {
    label: 'mcp_server/stress_test',
    distRoot: path.join('mcp_server', 'dist', 'stress_test'),
    sourceRoot: path.join('mcp_server', 'stress_test'),
  },
  {
    label: 'mcp_server/tests',
    distRoot: path.join('mcp_server', 'dist', 'tests'),
    sourceRoot: path.join('mcp_server', 'tests'),
  },
  {
    label: 'mcp_server/core',
    distRoot: path.join('mcp_server', 'dist', 'core'),
    sourceRoot: path.join('mcp_server', 'core'),
  },
  {
    label: 'mcp_server/api',
    distRoot: path.join('mcp_server', 'dist', 'api'),
    sourceRoot: path.join('mcp_server', 'api'),
  },
  {
    label: 'mcp_server/utils',
    distRoot: path.join('mcp_server', 'dist', 'utils'),
    sourceRoot: path.join('mcp_server', 'utils'),
  },
  {
    label: 'mcp_server/configs',
    distRoot: path.join('mcp_server', 'dist', 'configs'),
    sourceRoot: path.join('mcp_server', 'configs'),
  },
  {
    label: 'mcp_server/scripts',
    distRoot: path.join('mcp_server', 'dist', 'scripts'),
    sourceRoot: path.join('mcp_server', 'scripts'),
  },
  {
    label: 'scripts',
    distRoot: path.join('scripts', 'dist'),
    sourceRoot: 'scripts',
  },
];

// F-020-D5-02: derive the package-relative path so the report shows the
// `mcp_server/dist/...` or `scripts/dist/...` prefix that authors recognize.
// Previously this used a hardcoded `target.label === 'mcp_server'` check
// which only worked for the single combined `dist/lib` target. With the
// broader DIST_TARGETS set, derive the package segment from the dist root.
function mapDistFileToSource(packageRoot: string, target: DistTarget, distFile: string): OrphanedDistFile {
  const absoluteDistRoot = path.join(packageRoot, target.distRoot);
  const packageSegment = target.distRoot.startsWith('scripts') ? 'scripts' : 'mcp_server';
  const relativeDistPath = toPosix(path.relative(path.join(packageRoot, packageSegment), distFile));
  const sourceRelativePath = path.relative(absoluteDistRoot, distFile).replace(/\.js$/, '.ts');
  const expectedSource = path.join(packageRoot, target.sourceRoot, sourceRelativePath);

  return {
    distFile: relativeDistPath,
    expectedSource: toPosix(path.relative(packageRoot, expectedSource)),
  };
}

function findAllowlistEntry(distFile: string): AllowlistException | undefined {
  return ALLOWLIST_EXCEPTIONS.find((entry) => entry.file === distFile);
}

function main(): void {
  const packageRoot = resolvePackageRoot(moduleDir);
  const allowlistedOrphans: OrphanedDistFile[] = [];
  const violations: OrphanedDistFile[] = [];
  let scannedCount = 0;

  for (const target of DIST_TARGETS) {
    const absoluteDistRoot = path.join(packageRoot, target.distRoot);
    // F-020-D5-02: skip optional/empty dist roots silently rather than failing
    // the build. Some targets (e.g. mcp_server/dist/api) may not exist in all
    // build configurations. Required-target enforcement was load-bearing only
    // when DIST_TARGETS contained the two combined roots; the broadened set
    // includes optional subtrees.
    if (!fs.existsSync(absoluteDistRoot)) {
      continue;
    }

    const distFiles = findJsFiles(absoluteDistRoot);
    scannedCount += distFiles.length;

    for (const distFile of distFiles) {
      const mapped = mapDistFileToSource(packageRoot, target, distFile);
      const absoluteExpectedSource = path.join(packageRoot, mapped.expectedSource);

      if (fs.existsSync(absoluteExpectedSource)) {
        continue;
      }

      const allowlistEntry = findAllowlistEntry(mapped.distFile);
      if (allowlistEntry) {
        allowlistedOrphans.push({ ...mapped, allowlistEntry });
        continue;
      }

      violations.push(mapped);
    }
  }

  const alignedCount = scannedCount - allowlistedOrphans.length - violations.length;

  if (allowlistedOrphans.length > 0) {
    console.warn(`Source/dist alignment warning: ${allowlistedOrphans.length} allowlisted orphan(s):\n`);
    for (const orphan of allowlistedOrphans) {
      const entry = orphan.allowlistEntry as AllowlistException;
      console.warn(`  ${orphan.distFile}`);
      console.warn(`    expected source: ${orphan.expectedSource}`);
      console.warn(`    allowlisted by ${entry.owner} on ${entry.date} — ${entry.reason}`);
    }
    console.warn('');
  }

  console.log('Source/dist alignment summary:');
  console.log(`  dist JS files scanned: ${scannedCount}`);
  console.log(`  aligned files: ${alignedCount}`);
  console.log(`  allowlisted orphans: ${allowlistedOrphans.length}`);
  console.log(`  violations: ${violations.length}`);

  if (violations.length > 0) {
    console.error(`\nSource/dist alignment check FAILED: ${violations.length} orphaned dist file(s):\n`);
    for (const orphan of violations) {
      console.error(`  ${orphan.distFile}`);
      console.error(`    expected source: ${orphan.expectedSource}`);
    }
    console.error('\nRemove stale dist outputs, restore missing source files, or add a time-bounded allowlist entry.');
    process.exit(1);
  }

  console.log('\nSource/dist alignment check passed: every scanned dist *.js file maps to a source .ts file.');
  process.exit(0);
}

main();
