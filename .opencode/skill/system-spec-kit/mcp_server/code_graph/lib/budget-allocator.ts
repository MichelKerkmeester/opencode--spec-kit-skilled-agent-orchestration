// ───────────────────────────────────────────────────────────────
// MODULE: Budget Allocator
// ───────────────────────────────────────────────────────────────
// Distributes a total token budget across multiple context sources
// using floor allocations + overflow redistribution.

/** Per-source budget configuration */
export interface SourceBudget {
  name: string;
  floor: number;
  actualSize: number; // 0 if source is empty
}

/** Allocation result for a single source */
export interface SourceAllocation {
  name: string;
  floor: number;
  requested: number;
  granted: number;
  dropped: number;
}

/** Combined allocation result */
export interface AllocationResult {
  totalBudget: number;
  totalUsed: number;
  overflow: number;
  allocations: SourceAllocation[];
}

/** Default floor layout for the 4000-token compact brief budget */
export const DEFAULT_FLOORS = {
  constitutional: 700,
  codeGraph: 1200,
  cocoIndex: 900,
  triggered: 400,
  overflow: 800,
} as const;

/** Priority order for overflow redistribution (highest first) */
const PRIORITY_ORDER = ['constitutional', 'codeGraph', 'cocoIndex', 'sessionState', 'triggered'] as const;

/**
 * Allocate token budget across sources.
 *
 * Algorithm:
 * 1. Assign floor to each source (capped at actual size)
 * 2. Calculate overflow from empty/under-floor sources
 * 3. Redistribute overflow by priority order
 * 4. Enforce total budget cap with deterministic trim
 */
export function allocateBudget(
  sources: SourceBudget[],
  totalBudget: number = 4000,
): AllocationResult {
  const allocations: SourceAllocation[] = [];
  const floorTotal = sources.reduce((sum, source) => sum + source.floor, 0);
  let overflowPool = Math.max(totalBudget - floorTotal, 0);

  // Step 1: Assign floors, collect overflow from empty sources
  for (const source of sources) {
    const floor = source.floor;
    const granted = Math.min(floor, source.actualSize);
    const unused = floor - granted;
    overflowPool += unused;

    allocations.push({
      name: source.name,
      floor,
      requested: source.actualSize,
      granted,
      dropped: Math.max(0, source.actualSize - granted),
    });
  }

  // Step 2: Redistribute overflow by priority
  if (overflowPool > 0) {
    for (const priorityName of PRIORITY_ORDER) {
      const alloc = allocations.find(a => a.name === priorityName);
      if (!alloc) continue;

      const headroom = alloc.requested - alloc.granted;
      if (headroom <= 0) continue;

      const bonus = Math.min(headroom, overflowPool);
      alloc.granted += bonus;
      alloc.dropped -= bonus;
      overflowPool -= bonus;

      if (overflowPool <= 0) break;
    }
  }

  // Step 3: Enforce total budget cap (trim in reverse priority order)
  let totalUsed = allocations.reduce((sum, a) => sum + a.granted, 0);
  if (totalUsed > totalBudget) {
    const reversed = [...PRIORITY_ORDER].reverse();
    for (const name of reversed) {
      if (totalUsed <= totalBudget) break;
      const alloc = allocations.find(a => a.name === name);
      if (!alloc) continue;

      const excess = totalUsed - totalBudget;
      const trim = Math.min(excess, alloc.granted);
      alloc.granted -= trim;
      alloc.dropped += trim;
      totalUsed -= trim;
    }
  }

  return {
    totalBudget,
    totalUsed: allocations.reduce((sum, a) => sum + a.granted, 0),
    overflow: overflowPool,
    allocations,
  };
}

/** Create source budgets with default floors */
export function createDefaultSources(
  constitutionalSize: number,
  codeGraphSize: number,
  cocoIndexSize: number,
  triggeredSize: number,
  sessionStateSize: number = 0,
): SourceBudget[] {
  return [
    { name: 'constitutional', floor: DEFAULT_FLOORS.constitutional, actualSize: constitutionalSize },
    { name: 'codeGraph', floor: DEFAULT_FLOORS.codeGraph, actualSize: codeGraphSize },
    { name: 'cocoIndex', floor: DEFAULT_FLOORS.cocoIndex, actualSize: cocoIndexSize },
    { name: 'sessionState', floor: 0, actualSize: sessionStateSize },
    { name: 'triggered', floor: DEFAULT_FLOORS.triggered, actualSize: triggeredSize },
  ];
}
