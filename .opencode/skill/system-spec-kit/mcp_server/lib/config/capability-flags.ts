// ───────────────────────────────────────────────────────────────
// 1. MEMORY ROADMAP FLAGS
// ───────────────────────────────────────────────────────────────
// Phase-gated capability switches for the memory roadmap.
// Defaults are conservative (all disabled) unless explicitly opted in.
import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/** Canonical rollout phases used by memory roadmap tracking. */
type MemoryRoadmapPhase =
  | 'baseline'
  | 'lineage'
  | 'graph'
  | 'adaptive'
  | 'scope-governance'
  | 'shared-rollout';

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

const SUPPORTED_PHASES: ReadonlySet<MemoryRoadmapPhase> = new Set<MemoryRoadmapPhase>([
  'baseline',
  'lineage',
  'graph',
  'adaptive',
  'scope-governance',
  'shared-rollout',
]);

function parseOptInFlag(flagNames: string | readonly string[]): boolean {
  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
  for (const flagName of candidates) {
    const rawValue = process.env[flagName]?.trim().toLowerCase();
    if (rawValue === 'true' || rawValue === '1') {
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

/** Returns true only when the capability is explicitly opted in and in rollout. */
function isMemoryRoadmapCapabilityEnabled(flagNames: string | readonly string[], identity?: string): boolean {
  if (!parseOptInFlag(flagNames)) {
    return false;
  }

  const canonicalFlag = Array.isArray(flagNames) ? flagNames[0] : flagNames;
  return isFeatureEnabled(canonicalFlag, normalizeIdentity(canonicalFlag, identity));
}

/** Resolves the active memory roadmap phase from env, defaulting to baseline. */
function getMemoryRoadmapPhase(): MemoryRoadmapPhase {
  const phase = (process.env[PHASE_ENV] ?? process.env[LEGACY_PHASE_ENV])?.trim().toLowerCase() as MemoryRoadmapPhase | undefined;
  if (phase && SUPPORTED_PHASES.has(phase)) {
    return phase;
  }
  return 'baseline';
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
    ),
    scopeEnforcement: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.scopeEnforcement, LEGACY_CAPABILITY_ENV.scopeEnforcement],
      identity,
    ),
    governanceGuardrails: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.governanceGuardrails, LEGACY_CAPABILITY_ENV.governanceGuardrails],
      identity,
    ),
    sharedMemory: isMemoryRoadmapCapabilityEnabled(
      [CAPABILITY_ENV.sharedMemory, LEGACY_CAPABILITY_ENV.sharedMemory],
      identity,
    ),
  };
}

/** Returns defaults consumed by telemetry/checkpoint paths for phase tracking. */
function getMemoryRoadmapDefaults(identity?: string): MemoryRoadmapDefaults {
  return {
    phase: getMemoryRoadmapPhase(),
    capabilities: getMemoryRoadmapCapabilityFlags(identity),
    scopeDimensionsTracked: 4, // tenant/user/agent/session
  };
}

export {
  CAPABILITY_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
  isMemoryRoadmapCapabilityEnabled,
};

export type {
  MemoryRoadmapCapabilityFlags,
  MemoryRoadmapDefaults,
  MemoryRoadmapPhase,
};
