// ───────────────────────────────────────────────────────────────
// COMPONENT: Is Phase Parent
// ───────────────────────────────────────────────────────────────
// Single-source-of-truth detection rule for phase-parent folders.
// Contract: a folder is a phase parent when:
//   1. It has ≥1 direct child matching ^[0-9]{3}-[a-z0-9-]+$
//   2. ≥1 such child has spec.md OR description.json

import * as fs from 'fs';
import * as path from 'path';

const PHASE_CHILD_REGEX = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;

// F-019-D4-03: thresholds for phase-parent health classification. Buckets are
// chosen to surface manifest sprawl early without breaking validation flow.
// `warning` = manifest readability degrading; `error` = manifest unmanageable
// in a single review pass. Buckets are advisory; callers decide whether to
// fail validation or merely report.
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

// F-019-D4-03: counts direct phase children regardless of whether each child
// has spec.md/description.json. Counting all NNN-named direct children
// reflects manifest size (what an author actually scrolls past), not the
// strict phase-parent qualifier. Returns 0 when the folder is not a phase
// parent or cannot be read.
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

// F-019-D4-03: lightweight health assessment for phase-parent folders. Returns
// a non-mutating advisory record consumable by validation rules and tooling.
// `ok` => under warning threshold; `warning` => 20-40 children (consider
// summarized manifest); `error` => >40 children (manifest unreadable, split
// recommended); `not_phase_parent` => folder is not a phase parent.
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
