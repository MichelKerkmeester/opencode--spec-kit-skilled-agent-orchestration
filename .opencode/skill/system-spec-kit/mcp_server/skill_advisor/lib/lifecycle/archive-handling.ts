// ───────────────────────────────────────────────────────────────
// MODULE: Archive And Future Handling
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type IndexLifecycleStatus = 'active' | 'archived' | 'future';

export interface IndexRoutePolicy {
  readonly lifecycleStatus: IndexLifecycleStatus;
  readonly structurallyIndexed: boolean;
  readonly defaultRoutable: boolean;
  readonly includeInCorpusStats: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function lifecycleStatusForPath(filePath: string): IndexLifecycleStatus {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/z_archive/')) return 'archived';
  if (normalized.includes('/z_future/')) return 'future';
  return 'active';
}

export function routePolicyForPath(filePath: string): IndexRoutePolicy {
  const lifecycleStatus = lifecycleStatusForPath(filePath);
  const isActive = lifecycleStatus === 'active';
  return {
    lifecycleStatus,
    structurallyIndexed: true,
    defaultRoutable: isActive,
    includeInCorpusStats: isActive,
  };
}

export function filterDefaultRoutable<T extends { sourcePath: string }>(entries: readonly T[]): T[] {
  return entries.filter((entry) => routePolicyForPath(entry.sourcePath).defaultRoutable);
}

export function filterCorpusStatEligible<T extends { sourcePath: string }>(entries: readonly T[]): T[] {
  return entries.filter((entry) => routePolicyForPath(entry.sourcePath).includeInCorpusStats);
}

