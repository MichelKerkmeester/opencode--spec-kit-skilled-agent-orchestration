// ───────────────────────────────────────────────────────────────
// MODULE: Memory Roadmap Flags
// ───────────────────────────────────────────────────────────────
// Feature catalog: Feature flag governance
// Phase-gated capability switches for the memory roadmap.
// Defaults reflect the shipped rollout unless explicitly opted out, except for
// roadmap phases that remain intentionally dormant in production.
import { isFeatureEnabled } from '../cognitive/rollout-policy.js';

// R6: Derive phase type from the canonical array to keep them in sync.
const SUPPORTED_PHASES_ARRAY = ['baseline', 'lineage', 'graph', 'adaptive', 'scope-governance', 'shared-rollout'] as const;

/** Canonical rollout phases used by memory roadmap tracking. */
type MemoryRoadmapPhase = typeof SUPPORTED_PHASES_ARRAY[number];

/** Capability flags tracked for phased rollout. */
interface MemoryRoadmapCapabilityFlags {
  lineageState: boolean;
  graphUnified: boolean;
  adaptiveRanking: boolean;
  scopeEnforcement: boolean;
  governanceGuardrails: boolean;
  sharedMemory: boolean;
}

/** Rollout defaults snapshot for telemetry and migration checkpoints. */
interface MemoryRoadmapDefaults {
  phase: MemoryRoadmapPhase;
  capabilities: MemoryRoadmapCapabilityFlags;
  scopeDimensionsTracked: number;
}

const PHASE_ENV = 'SPECKIT_MEMORY_ROADMAP_PHASE';
const LEGACY_PHASE_ENV = 'SPECKIT_HYDRA_PHASE';

/**
 * SPECKIT_PARSER — Structural parser backend selector.
 *
 * Controls which parsing backend the structural indexer uses for code-graph
 * symbol extraction. Evaluated at first parse call; cannot be changed mid-session.
 *
 * | Value        | Description                                                 |
 * |--------------|-------------------------------------------------------------|
 * | `treesitter` | (default) AST-accurate parsing via web-tree-sitter WASM    |
 * | `regex`      | Lightweight regex-based fallback — no WASM dependencies     |
 *
 * Runtime: `lib/code-graph/structural-indexer.ts::getParser()`
 * Example: `SPECKIT_PARSER=regex node context-server.js`
 */
const SPECKIT_PARSER_ENV = 'SPECKIT_PARSER' as const;

// Keep roadmap controls distinct from existing runtime feature flags so
// Telemetry/checkpoints describe roadmap rollout state rather than unrelated
// Default-on retrieval behavior.
const CAPABILITY_ENV = {
  lineageState: 'SPECKIT_MEMORY_LINEAGE_STATE',
  graphUnified: 'SPECKIT_MEMORY_GRAPH_UNIFIED',
  adaptiveRanking: 'SPECKIT_MEMORY_ADAPTIVE_RANKING',
  scopeEnforcement: 'SPECKIT_MEMORY_SCOPE_ENFORCEMENT',
  governanceGuardrails: 'SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS',
  sharedMemory: 'SPECKIT_MEMORY_SHARED_MEMORY',
} as const;

const LEGACY_CAPABILITY_ENV = {
  lineageState: 'SPECKIT_HYDRA_LINEAGE_STATE',
  graphUnified: 'SPECKIT_HYDRA_GRAPH_UNIFIED',
  adaptiveRanking: 'SPECKIT_HYDRA_ADAPTIVE_RANKING',
  scopeEnforcement: 'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
  governanceGuardrails: 'SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS',
  sharedMemory: 'SPECKIT_HYDRA_SHARED_MEMORY',
} as const;

const SUPPORTED_PHASES: ReadonlySet<MemoryRoadmapPhase> = new Set(SUPPORTED_PHASES_ARRAY);

function hasExplicitDisableFlag(flagNames: string | readonly string[]): boolean {
  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
  for (const flagName of candidates) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'false' || rawValue === '0') {
      return true;
    }
  }
  return false;
}

function normalizeIdentity(flagName: string, identity?: string): string {
  if (typeof identity === 'string' && identity.trim().length > 0) {
    return identity.trim();
  }
  return `memory-roadmap:${flagName}`;
}

/** Returns the roadmap capability state, with optional default-off dormant flags. */
function isMemoryRoadmapCapabilityEnabled(
  flagNames: string | readonly string[],
  identity?: string,
  defaultValue = true,
): boolean {
  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
  if (hasExplicitDisableFlag(flagNames)) {
    return false;
  }

  for (const flagName of candidates) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'true' || rawValue === '1') {
      return true;
    }
  }

  if (!defaultValue) {
    return false;
  }

  const canonicalFlag = candidates[0];
  return isFeatureEnabled(canonicalFlag, normalizeIdentity(canonicalFlag, identity));
}

/** Resolves the active memory roadmap phase from env, defaulting to shared-rollout. */
function getMemoryRoadmapPhase(): MemoryRoadmapPhase {
  // B4: Check canonical env first, then legacy, before falling back to default.
  const canonicalPhase = process.env[PHASE_ENV]?.trim().toLowerCase();
  if (canonicalPhase && SUPPORTED_PHASES.has(canonicalPhase as MemoryRoadmapPhase)) {
    return canonicalPhase as MemoryRoadmapPhase;
  }
  const legacyPhase = process.env[LEGACY_PHASE_ENV]?.trim().toLowerCase();
  if (legacyPhase && SUPPORTED_PHASES.has(legacyPhase as MemoryRoadmapPhase)) {
    return legacyPhase as MemoryRoadmapPhase;
  }
  return 'shared-rollout';
}

/** Returns the full capability snapshot for memory roadmap controls. */
function getMemoryRoadmapCapabilityFlags(identity?: string): MemoryRoadmapCapabilityFlags {
  return {
    lineageState: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.lineageState, LEGACY_CAPABILITY_ENV.lineageState],
      identity,
    ),
    graphUnified: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.graphUnified, LEGACY_CAPABILITY_ENV.graphUnified],
      identity,
    ),
    adaptiveRanking: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.adaptiveRanking, LEGACY_CAPABILITY_ENV.adaptiveRanking],
      identity,
      false,
    ),
    scopeEnforcement: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.scopeEnforcement, LEGACY_CAPABILITY_ENV.scopeEnforcement],
      identity,
    ),
    governanceGuardrails: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.governanceGuardrails, LEGACY_CAPABILITY_ENV.governanceGuardrails],
      identity,
    ),
    // M4 FIX: Default sharedMemory to false to match runtime gate behavior and docs.
    // The runtime in shared-spaces.ts keeps shared memory opt-in until env/config enablement.
    sharedMemory: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.sharedMemory, LEGACY_CAPABILITY_ENV.sharedMemory],
      identity,
      false,
    ),
  };
}

/** Returns defaults consumed by telemetry/checkpoint paths for phase tracking. */
function getMemoryRoadmapDefaults(identity?: string): MemoryRoadmapDefaults {
  return {
    phase: getMemoryRoadmapPhase(),
    capabilities: getMemoryRoadmapCapabilityFlags(identity),
    scopeDimensionsTracked: 5, // tenant/user/agent/session/sharedSpace
  };
}

export {
  /** @internal — test-only, not part of public API */
  CAPABILITY_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
  /** @internal — exposed for test utilities only */
  isMemoryRoadmapCapabilityEnabled,
  /** F044: Documented parser backend env var name */
  SPECKIT_PARSER_ENV,
};

export type {
  MemoryRoadmapCapabilityFlags,
  MemoryRoadmapDefaults,
  MemoryRoadmapPhase,
};
