// ---------------------------------------------------------------
// MODULE: Hydra Capability Flags
// ---------------------------------------------------------------
// Phase-gated capability switches for the Hydra-inspired roadmap.
// Defaults are conservative (all disabled) unless explicitly opted in.
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/** Canonical rollout phases used by Hydra roadmap tracking. */
type HydraPhase =
  | 'baseline'
  | 'lineage'
  | 'graph'
  | 'adaptive'
  | 'scope-governance'
  | 'shared-rollout';

/** Capability flags tracked for phased rollout. */
interface HydraCapabilityFlags {
  lineageState: boolean;
  graphUnified: boolean;
  adaptiveRanking: boolean;
  scopeEnforcement: boolean;
  governanceGuardrails: boolean;
  sharedMemory: boolean;
}

/** Rollout defaults snapshot for telemetry and migration checkpoints. */
interface HydraRolloutDefaults {
  phase: HydraPhase;
  capabilities: HydraCapabilityFlags;
  scopeDimensionsTracked: number;
}

const PHASE_ENV = 'SPECKIT_HYDRA_PHASE';

// Keep Hydra roadmap controls distinct from existing runtime feature flags so
// telemetry/checkpoints describe roadmap rollout state rather than unrelated
// default-on retrieval behavior.
const CAPABILITY_ENV = {
  lineageState: 'SPECKIT_HYDRA_LINEAGE_STATE',
  graphUnified: 'SPECKIT_HYDRA_GRAPH_UNIFIED',
  adaptiveRanking: 'SPECKIT_HYDRA_ADAPTIVE_RANKING',
  scopeEnforcement: 'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
  governanceGuardrails: 'SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS',
  sharedMemory: 'SPECKIT_HYDRA_SHARED_MEMORY',
} as const;

const SUPPORTED_PHASES: ReadonlySet<HydraPhase> = new Set<HydraPhase>([
  'baseline',
  'lineage',
  'graph',
  'adaptive',
  'scope-governance',
  'shared-rollout',
]);

function parseOptInFlag(flagName: string): boolean {
  const rawValue = process.env[flagName]?.trim().toLowerCase();
  return rawValue === 'true' || rawValue === '1';
}

function normalizeIdentity(flagName: string, identity?: string): string {
  if (typeof identity === 'string' && identity.trim().length > 0) {
    return identity.trim();
  }
  return `hydra-capability:${flagName}`;
}

/** Returns true only when the capability is explicitly opted in and in rollout. */
function isHydraCapabilityEnabled(flagName: string, identity?: string): boolean {
  if (!parseOptInFlag(flagName)) {
    return false;
  }

  return isFeatureEnabled(flagName, normalizeIdentity(flagName, identity));
}

/** Resolves the active Hydra roadmap phase from env, defaulting to baseline. */
function getHydraPhase(): HydraPhase {
  const phase = process.env[PHASE_ENV]?.trim().toLowerCase() as HydraPhase | undefined;
  if (phase && SUPPORTED_PHASES.has(phase)) {
    return phase;
  }
  return 'baseline';
}

/** Returns the full capability snapshot for Hydra roadmap controls. */
function getHydraCapabilityFlags(identity?: string): HydraCapabilityFlags {
  return {
    lineageState: isHydraCapabilityEnabled(CAPABILITY_ENV.lineageState, identity),
    graphUnified: isHydraCapabilityEnabled(CAPABILITY_ENV.graphUnified, identity),
    adaptiveRanking: isHydraCapabilityEnabled(CAPABILITY_ENV.adaptiveRanking, identity),
    scopeEnforcement: isHydraCapabilityEnabled(CAPABILITY_ENV.scopeEnforcement, identity),
    governanceGuardrails: isHydraCapabilityEnabled(CAPABILITY_ENV.governanceGuardrails, identity),
    sharedMemory: isHydraCapabilityEnabled(CAPABILITY_ENV.sharedMemory, identity),
  };
}

/** Returns defaults consumed by telemetry/checkpoint paths for phase tracking. */
function getHydraRolloutDefaults(identity?: string): HydraRolloutDefaults {
  return {
    phase: getHydraPhase(),
    capabilities: getHydraCapabilityFlags(identity),
    scopeDimensionsTracked: 4, // tenant/user/agent/session
  };
}

export {
  CAPABILITY_ENV,
  getHydraCapabilityFlags,
  getHydraPhase,
  getHydraRolloutDefaults,
  isHydraCapabilityEnabled,
};

export type {
  HydraCapabilityFlags,
  HydraPhase,
  HydraRolloutDefaults,
};
