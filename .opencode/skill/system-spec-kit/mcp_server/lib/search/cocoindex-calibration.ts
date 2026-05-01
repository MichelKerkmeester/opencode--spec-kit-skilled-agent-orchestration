// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Calibration
// ───────────────────────────────────────────────────────────────

interface CocoIndexCandidateLike {
  id?: string | number;
  file?: string;
  filePath?: string;
  path?: string;
  rawScore?: number;
  pathClass?: string;
}

interface CocoIndexCalibrationInput {
  requestedLimit: number;
  candidates: readonly CocoIndexCandidateLike[];
  tenantId?: string;
  userId?: string;
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}

interface CocoIndexCalibrationTelemetry {
  requestedLimit: number;
  effectiveLimit: number;
  duplicateDensity: number;
  duplicateCount: number;
  uniquePathCount: number;
  adaptiveOverfetchApplied: boolean;
  // F-011-C1-04: surfaced when the graduated 2x flag fires. Independent of
  // adaptiveOverfetchApplied — when both flags are set, adaptive (4x) wins
  // and graduatedOverfetchApplied is false. Optional in the type so existing
  // test literals and external constructors still typecheck; the calibrator
  // always populates it (true | false), so consumers reading the field from
  // calibrator output can rely on a boolean value.
  graduatedOverfetchApplied?: boolean;
  overfetchMultiplier: number;
  pathClassCounts: Record<string, number>;
  scope?: {
    tenantId?: string;
    userId?: string;
    agentId?: string;
  };
}

function isAdaptiveCocoIndexOverfetchEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH === '1'
    || env.SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH === 'true';
}

// F-011-C1-04: graduated overfetch flag. The existing 4x adaptive flag
// (`SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH`) stays as the explicit power-user
// opt-in. The graduated flag is a conservative bridge: 2x multiplier instead
// of 4x, only kicks in when duplicate density >= 0.35, defaults OFF. The
// adaptive flag wins when both are set (4x dominates 2x).
function isGraduatedCocoIndexOverfetchEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SPECKIT_COCOINDEX_GRADUATED_OVERFETCH === '1'
    || env.SPECKIT_COCOINDEX_GRADUATED_OVERFETCH === 'true';
}

function calibrateCocoIndexOverfetch(input: CocoIndexCalibrationInput): CocoIndexCalibrationTelemetry {
  const requestedLimit = Math.max(1, Math.floor(input.requestedLimit));
  const duplicateStats = computeDuplicateDensity(input.candidates);
  const adaptiveOverfetchApplied = isAdaptiveCocoIndexOverfetchEnabled(input.env)
    && duplicateStats.duplicateDensity >= 0.35;
  // F-011-C1-04: graduated overfetch only fires when adaptive is OFF. This
  // keeps the flag interaction simple (adaptive 4x dominates) and ensures CI
  // behavior is unchanged unless a user opts into one of the two flags.
  const graduatedOverfetchApplied = !adaptiveOverfetchApplied
    && isGraduatedCocoIndexOverfetchEnabled(input.env)
    && duplicateStats.duplicateDensity >= 0.35;
  const overfetchMultiplier = adaptiveOverfetchApplied
    ? 4
    : (graduatedOverfetchApplied ? 2 : 1);
  return {
    requestedLimit,
    effectiveLimit: requestedLimit * overfetchMultiplier,
    duplicateDensity: duplicateStats.duplicateDensity,
    duplicateCount: duplicateStats.duplicateCount,
    uniquePathCount: duplicateStats.uniquePathCount,
    adaptiveOverfetchApplied,
    // F-011-C1-04: surface the new flag through telemetry so envelope auditors
    // can distinguish a 2x graduated bump from the 4x adaptive bump. Field is
    // additive — existing consumers reading `adaptiveOverfetchApplied` and
    // `overfetchMultiplier` see the right values without any code change.
    graduatedOverfetchApplied,
    overfetchMultiplier,
    pathClassCounts: countPathClasses(input.candidates),
    ...(input.tenantId || input.userId || input.agentId ? {
      scope: {
        ...(input.tenantId ? { tenantId: input.tenantId } : {}),
        ...(input.userId ? { userId: input.userId } : {}),
        ...(input.agentId ? { agentId: input.agentId } : {}),
      },
    } : {}),
  };
}

function computeDuplicateDensity(candidates: readonly CocoIndexCandidateLike[]): {
  duplicateDensity: number;
  duplicateCount: number;
  uniquePathCount: number;
} {
  if (candidates.length === 0) {
    return {
      duplicateDensity: 0,
      duplicateCount: 0,
      uniquePathCount: 0,
    };
  }
  const paths = candidates.map(normalizeCandidatePath).filter((path) => path.length > 0);
  const uniquePathCount = new Set(paths).size;
  const duplicateCount = Math.max(0, paths.length - uniquePathCount);
  return {
    duplicateDensity: round(duplicateCount / candidates.length),
    duplicateCount,
    uniquePathCount,
  };
}

function countPathClasses(candidates: readonly CocoIndexCandidateLike[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const candidate of candidates) {
    const pathClass = candidate.pathClass ?? inferPathClass(normalizeCandidatePath(candidate));
    counts[pathClass] = (counts[pathClass] ?? 0) + 1;
  }
  return counts;
}

function normalizeCandidatePath(candidate: CocoIndexCandidateLike): string {
  return (candidate.filePath ?? candidate.file ?? candidate.path ?? '').replace(/\\/g, '/');
}

function inferPathClass(path: string): string {
  if (path.includes('/tests/') || path.endsWith('.test.ts') || path.endsWith('.vitest.ts')) return 'test';
  if (path.includes('/specs/')) return 'spec';
  if (path.includes('/scripts/')) return 'script';
  if (path.includes('/lib/')) return 'runtime';
  return path ? 'source' : 'unknown';
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export {
  type CocoIndexCalibrationInput,
  type CocoIndexCalibrationTelemetry,
  type CocoIndexCandidateLike,
  calibrateCocoIndexOverfetch,
  computeDuplicateDensity,
  isAdaptiveCocoIndexOverfetchEnabled,
  // F-011-C1-04: graduated-overfetch flag helper for callers/tests
  isGraduatedCocoIndexOverfetchEnabled,
};
