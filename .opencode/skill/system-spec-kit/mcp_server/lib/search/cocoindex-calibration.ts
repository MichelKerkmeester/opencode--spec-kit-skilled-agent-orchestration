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
  env?: NodeJS.ProcessEnv;
}

interface CocoIndexCalibrationTelemetry {
  requestedLimit: number;
  effectiveLimit: number;
  duplicateDensity: number;
  duplicateCount: number;
  uniquePathCount: number;
  adaptiveOverfetchApplied: boolean;
  overfetchMultiplier: number;
  pathClassCounts: Record<string, number>;
}

function isAdaptiveCocoIndexOverfetchEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH === '1'
    || env.SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH === 'true';
}

function calibrateCocoIndexOverfetch(input: CocoIndexCalibrationInput): CocoIndexCalibrationTelemetry {
  const requestedLimit = Math.max(1, Math.floor(input.requestedLimit));
  const duplicateStats = computeDuplicateDensity(input.candidates);
  const adaptiveOverfetchApplied = isAdaptiveCocoIndexOverfetchEnabled(input.env)
    && duplicateStats.duplicateDensity >= 0.35;
  const overfetchMultiplier = adaptiveOverfetchApplied ? 4 : 1;
  return {
    requestedLimit,
    effectiveLimit: requestedLimit * overfetchMultiplier,
    duplicateDensity: duplicateStats.duplicateDensity,
    duplicateCount: duplicateStats.duplicateCount,
    uniquePathCount: duplicateStats.uniquePathCount,
    adaptiveOverfetchApplied,
    overfetchMultiplier,
    pathClassCounts: countPathClasses(input.candidates),
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
};
