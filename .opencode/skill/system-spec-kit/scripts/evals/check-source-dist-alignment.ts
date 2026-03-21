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

import * as fs from 'fs';
import * as path from 'path';

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
const ALLOWLIST_EXCEPTIONS: AllowlistException[] = [];

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

const DIST_TARGETS: DistTarget[] = [
  {
    label: 'mcp_server',
    distRoot: path.join('mcp_server', 'dist', 'lib'),
    sourceRoot: path.join('mcp_server', 'lib'),
  },
  {
    label: 'scripts',
    distRoot: path.join('scripts', 'dist'),
    sourceRoot: 'scripts',
  },
];

function mapDistFileToSource(packageRoot: string, target: DistTarget, distFile: string): OrphanedDistFile {
  const absoluteDistRoot = path.join(packageRoot, target.distRoot);
  const packageSegment = target.label === 'mcp_server' ? 'mcp_server' : 'scripts';
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
  const packageRoot = resolvePackageRoot(__dirname);
  const allowlistedOrphans: OrphanedDistFile[] = [];
  const violations: OrphanedDistFile[] = [];
  let scannedCount = 0;

  for (const target of DIST_TARGETS) {
    const absoluteDistRoot = path.join(packageRoot, target.distRoot);
    if (!fs.existsSync(absoluteDistRoot)) {
      console.error(`Source/dist alignment check FAILED: dist root not found: ${toPosix(path.relative(packageRoot, absoluteDistRoot))}`);
      process.exit(2);
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
