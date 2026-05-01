import * as fs from 'fs';
import * as path from 'path';

const PHASE_CHILD_REGEX = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;

// F-019-D4-03: thresholds for phase-parent manifest health. Mirrors the
// authoritative copy in mcp_server/lib/spec/is-phase-parent.ts so shell rules
// and TypeScript runtime callers see identical buckets.
export const PHASE_PARENT_WARNING_THRESHOLD = 20;
export const PHASE_PARENT_ERROR_THRESHOLD = 40;

export type PhaseParentHealthStatus = 'ok' | 'warning' | 'error' | 'not_phase_parent';

export interface PhaseParentHealth {
  childCount: number;
  status: PhaseParentHealthStatus;
  recommendation: string;
}

export function isPhaseParent(specFolderAbsPath: string): boolean {
  let entries: string[];

  try {
    entries = fs.readdirSync(specFolderAbsPath);
  } catch {
    return false;
  }

  const phaseChildren = entries.filter((name) => PHASE_CHILD_REGEX.test(name));

  if (phaseChildren.length === 0) return false;

  for (const child of phaseChildren) {
    const childPath = path.join(specFolderAbsPath, child);
    try {
      if (!fs.statSync(childPath).isDirectory()) continue;
    } catch {
      continue;
    }
    if (
      fs.existsSync(path.join(childPath, 'spec.md')) ||
      fs.existsSync(path.join(childPath, 'description.json'))
    ) {
      return true;
    }
  }

  return false;
}

// F-019-D4-03: counts ALL direct NNN-named children regardless of whether
// each has spec.md/description.json — this reflects manifest size (visual
// scroll length), not the strict phase-parent qualifier.
function countPhaseChildren(specFolderAbsPath: string): number {
  try {
    const entries = fs.readdirSync(specFolderAbsPath);
    return entries.filter((name) => {
      if (!PHASE_CHILD_REGEX.test(name)) return false;
      try {
        return fs.statSync(path.join(specFolderAbsPath, name)).isDirectory();
      } catch {
        return false;
      }
    }).length;
  } catch {
    return 0;
  }
}

// F-019-D4-03: lightweight advisory health record — same logic as
// mcp_server/lib/spec/is-phase-parent.ts so shell and TS runtime agree.
export function assessPhaseParentHealth(specFolderAbsPath: string): PhaseParentHealth {
  if (!isPhaseParent(specFolderAbsPath)) {
    return {
      childCount: 0,
      status: 'not_phase_parent',
      recommendation: 'Folder is not a phase parent; health check skipped.',
    };
  }

  const childCount = countPhaseChildren(specFolderAbsPath);

  if (childCount >= PHASE_PARENT_ERROR_THRESHOLD) {
    return {
      childCount,
      status: 'error',
      recommendation: `${childCount} children exceeds error threshold (${PHASE_PARENT_ERROR_THRESHOLD}). Split into nested phase parents or move historical phases under z_archive/ to keep the manifest readable.`,
    };
  }

  if (childCount >= PHASE_PARENT_WARNING_THRESHOLD) {
    return {
      childCount,
      status: 'warning',
      recommendation: `${childCount} children meets warning threshold (>=${PHASE_PARENT_WARNING_THRESHOLD}). Consider a summarized manifest in spec.md or grouping completed phases under z_archive/.`,
    };
  }

  return {
    childCount,
    status: 'ok',
    recommendation: `${childCount} children is within healthy manifest size (<${PHASE_PARENT_WARNING_THRESHOLD}).`,
  };
}

// F-019-D4-03: CLI entrypoint so shell rules can shell-out without a separate
// JS wrapper. Usage: `node scripts/dist/spec/is-phase-parent.js health <folder>`
// emits one line: `<status>\t<childCount>\t<recommendation>` (tab-separated).
// Invoking with `check <folder>` keeps the original boolean exit-code contract
// (exit 0 = is phase parent, exit 1 = not).
function runCli(): void {
  const [, , command, folderArg] = process.argv;
  if (!command || !folderArg) {
    return;
  }
  const absFolder = path.resolve(folderArg);
  if (command === 'check') {
    process.exit(isPhaseParent(absFolder) ? 0 : 1);
  }
  if (command === 'health') {
    const health = assessPhaseParentHealth(absFolder);
    process.stdout.write(
      `${health.status}\t${health.childCount}\t${health.recommendation}\n`,
    );
    process.exit(0);
  }
}

// Run CLI only when executed directly, never on import.
const invokedDirectly =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  /is-phase-parent\.(?:js|ts)$/.test(process.argv[1]);
if (invokedDirectly) {
  runCli();
}
