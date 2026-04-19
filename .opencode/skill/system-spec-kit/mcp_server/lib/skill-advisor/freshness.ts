// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Freshness
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import {
  existsSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import {
  ADVISOR_SOURCE_CACHE_TTL_MS,
  getOrCompute,
} from './source-cache.js';
import {
  readAdvisorGeneration,
  type AdvisorGenerationRecoveryPath,
} from './generation.js';
import type { AdvisorEnvelopeMetadata } from '../context/shared-payload.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type AdvisorFreshnessState = AdvisorEnvelopeMetadata['freshness'];
export type AdvisorFallbackMode = 'sqlite' | 'json' | 'none';

/** Per-skill stat fingerprint used to suppress deleted or renamed skills. */
export interface AdvisorSkillFingerprint {
  readonly skillMdMtime: number;
  readonly skillMdSize: number;
  readonly graphMetaMtime: number | null;
}

/** Machine-readable probe diagnostic for non-live advisor freshness states. */
export interface AdvisorFreshnessDiagnostics {
  readonly reason?: string;
  readonly missingSources?: string[];
  readonly recoveryPath?: AdvisorGenerationRecoveryPath;
}

/** Freshness snapshot consumed by downstream advisor brief producers. */
export interface AdvisorFreshnessResult {
  readonly state: AdvisorFreshnessState;
  readonly generation: number;
  readonly sourceSignature: string;
  readonly skillFingerprints: Map<string, AdvisorSkillFingerprint>;
  readonly fallbackMode: AdvisorFallbackMode;
  readonly probedAt: string;
  readonly diagnostics: AdvisorFreshnessDiagnostics | null;
}

interface FileProbe {
  readonly path: string;
  readonly mtimeMs: number;
  readonly size: number;
}

interface SourceSnapshot {
  readonly sourceSignature: string;
  readonly skillFingerprints: Map<string, AdvisorSkillFingerprint>;
  readonly maxSourceMtimeMs: number;
  readonly sqliteArtifact: FileProbe | null;
  readonly jsonArtifact: FileProbe | null;
  readonly missingSources: string[];
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SKILL_ROOT_RELATIVE_PATH = join('.opencode', 'skill');
const ADVISOR_SCRIPT_ROOT_RELATIVE_PATH = join(SKILL_ROOT_RELATIVE_PATH, 'skill-advisor', 'scripts');
const SQLITE_ARTIFACT_RELATIVE_PATH = join(
  SKILL_ROOT_RELATIVE_PATH,
  'system-spec-kit',
  'mcp_server',
  'database',
  'skill-graph.sqlite',
);
const JSON_ARTIFACT_RELATIVE_PATH = join(
  ADVISOR_SCRIPT_ROOT_RELATIVE_PATH,
  'skill-graph.json',
);
const REQUIRED_SCRIPT_RELATIVE_PATHS = [
  join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_advisor.py'),
  join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_advisor_runtime.py'),
  join(ADVISOR_SCRIPT_ROOT_RELATIVE_PATH, 'skill_graph_compiler.py'),
] as const;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function fileProbe(filePath: string): FileProbe | null {
  if (!existsSync(filePath)) {
    return null;
  }
  const stats = statSync(filePath);
  if (!stats.isFile()) {
    throw new Error(`Expected file but found non-file path: ${filePath}`);
  }
  return {
    path: filePath,
    mtimeMs: stats.mtimeMs,
    size: stats.size,
  };
}

function addSignaturePart(hash: ReturnType<typeof createHash>, label: string, probe: FileProbe | null): void {
  if (!probe) {
    hash.update(`${label}:missing\n`);
    return;
  }
  hash.update(`${label}:${probe.path}:${probe.mtimeMs}:${probe.size}\n`);
}

function listSkillSlugs(skillRoot: string): string[] {
  if (!existsSync(skillRoot)) {
    return [];
  }
  return readdirSync(skillRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function buildSourceSnapshot(workspaceRoot: string): SourceSnapshot {
  const root = resolve(workspaceRoot);
  const skillRoot = join(root, SKILL_ROOT_RELATIVE_PATH);
  const missingSources: string[] = [];
  const hash = createHash('sha256');
  const skillFingerprints = new Map<string, AdvisorSkillFingerprint>();
  let maxSourceMtimeMs = 0;

  const skillSlugs = listSkillSlugs(skillRoot);
  for (const skillSlug of skillSlugs) {
    const skillDirectory = join(skillRoot, skillSlug);
    const skillMd = fileProbe(join(skillDirectory, 'SKILL.md'));
    if (!skillMd) {
      continue;
    }
    const graphMetadata = fileProbe(join(skillDirectory, 'graph-metadata.json'));
    maxSourceMtimeMs = Math.max(maxSourceMtimeMs, skillMd.mtimeMs, graphMetadata?.mtimeMs ?? 0);
    skillFingerprints.set(skillSlug, {
      skillMdMtime: skillMd.mtimeMs,
      skillMdSize: skillMd.size,
      graphMetaMtime: graphMetadata?.mtimeMs ?? null,
    });
    addSignaturePart(hash, `skill:${skillSlug}:SKILL.md`, skillMd);
    addSignaturePart(hash, `skill:${skillSlug}:graph-metadata.json`, graphMetadata);
  }

  if (skillSlugs.length === 0 || skillFingerprints.size === 0) {
    missingSources.push(SKILL_ROOT_RELATIVE_PATH);
  }

  for (const relativePath of REQUIRED_SCRIPT_RELATIVE_PATHS) {
    const probe = fileProbe(join(root, relativePath));
    if (!probe) {
      missingSources.push(relativePath);
    } else {
      maxSourceMtimeMs = Math.max(maxSourceMtimeMs, probe.mtimeMs);
    }
    addSignaturePart(hash, relativePath, probe);
  }

  const sqliteArtifact = fileProbe(join(root, SQLITE_ARTIFACT_RELATIVE_PATH));
  const jsonArtifact = fileProbe(join(root, JSON_ARTIFACT_RELATIVE_PATH));
  addSignaturePart(hash, SQLITE_ARTIFACT_RELATIVE_PATH, sqliteArtifact);
  addSignaturePart(hash, JSON_ARTIFACT_RELATIVE_PATH, jsonArtifact);

  return {
    sourceSignature: hash.digest('hex'),
    skillFingerprints,
    maxSourceMtimeMs,
    sqliteArtifact,
    jsonArtifact,
    missingSources,
  };
}

function nonLiveDiagnostics(
  reason: string,
  missingSources: string[] = [],
  recoveryPath?: AdvisorGenerationRecoveryPath,
): AdvisorFreshnessDiagnostics {
  return {
    reason,
    ...(missingSources.length > 0 ? { missingSources } : {}),
    ...(recoveryPath ? { recoveryPath } : {}),
  };
}

function resultFromSnapshot(
  snapshot: SourceSnapshot,
  generation: number,
  state: AdvisorFreshnessState,
  fallbackMode: AdvisorFallbackMode,
  diagnostics: AdvisorFreshnessDiagnostics | null,
): AdvisorFreshnessResult {
  return {
    state,
    generation,
    sourceSignature: snapshot.sourceSignature,
    skillFingerprints: snapshot.skillFingerprints,
    fallbackMode,
    probedAt: new Date().toISOString(),
    diagnostics,
  };
}

function deriveFreshness(snapshot: SourceSnapshot, generation: number): AdvisorFreshnessResult {
  if (snapshot.missingSources.length > 0) {
    return resultFromSnapshot(
      snapshot,
      generation,
      'absent',
      snapshot.sqliteArtifact ? 'sqlite' : snapshot.jsonArtifact ? 'json' : 'none',
      nonLiveDiagnostics('ADVISOR_SOURCE_MISSING', snapshot.missingSources),
    );
  }

  if (!snapshot.sqliteArtifact) {
    if (snapshot.jsonArtifact) {
      return resultFromSnapshot(
        snapshot,
        generation,
        'stale',
        'json',
        nonLiveDiagnostics('JSON_FALLBACK_ONLY', [SQLITE_ARTIFACT_RELATIVE_PATH]),
      );
    }
    return resultFromSnapshot(
      snapshot,
      generation,
      'absent',
      'none',
      nonLiveDiagnostics('SKILL_GRAPH_SQLITE_MISSING', [SQLITE_ARTIFACT_RELATIVE_PATH]),
    );
  }

  if (snapshot.maxSourceMtimeMs > snapshot.sqliteArtifact.mtimeMs) {
    return resultFromSnapshot(
      snapshot,
      generation,
      'stale',
      'sqlite',
      nonLiveDiagnostics('SOURCE_NEWER_THAN_SKILL_GRAPH'),
    );
  }

  return resultFromSnapshot(snapshot, generation, 'live', 'sqlite', null);
}

function unavailableResult(
  workspaceRoot: string,
  reason: string,
  recoveryPath?: AdvisorGenerationRecoveryPath,
): AdvisorFreshnessResult {
  return {
    state: 'unavailable',
    generation: 0,
    sourceSignature: createHash('sha256')
      .update(resolve(workspaceRoot))
      .update(reason)
      .digest('hex'),
    skillFingerprints: new Map(),
    fallbackMode: 'none',
    probedAt: new Date().toISOString(),
    diagnostics: nonLiveDiagnostics(reason, [], recoveryPath),
  };
}

function degradeRecoveredGeneration(result: AdvisorFreshnessResult): AdvisorFreshnessResult {
  return {
    ...result,
    state: result.state === 'live' ? 'stale' : result.state,
    diagnostics: nonLiveDiagnostics('GENERATION_COUNTER_RECOVERED', [], 'regenerate'),
  };
}

// ───────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────

export function getAdvisorFreshness(workspaceRoot: string): AdvisorFreshnessResult {
  let snapshot: SourceSnapshot;
  try {
    snapshot = buildSourceSnapshot(workspaceRoot);
  } catch {
    return unavailableResult(workspaceRoot, 'ADVISOR_FRESHNESS_PROBE_FAILED');
  }

  const generation = readAdvisorGeneration(workspaceRoot);
  if (generation.status === 'unavailable') {
    return {
      ...resultFromSnapshot(
        snapshot,
        0,
        'unavailable',
        snapshot.sqliteArtifact ? 'sqlite' : snapshot.jsonArtifact ? 'json' : 'none',
        nonLiveDiagnostics(generation.reason ?? 'GENERATION_COUNTER_CORRUPT', [], generation.recoveryPath ?? undefined),
      ),
    };
  }

  if (generation.status === 'recovered') {
    return degradeRecoveredGeneration(deriveFreshness(snapshot, generation.generation));
  }

  const cacheKey = `${resolve(workspaceRoot)}:${snapshot.sourceSignature}:${generation.generation}`;
  return getOrCompute(
    cacheKey,
    ADVISOR_SOURCE_CACHE_TTL_MS,
    () => deriveFreshness(snapshot, generation.generation),
  );
}
