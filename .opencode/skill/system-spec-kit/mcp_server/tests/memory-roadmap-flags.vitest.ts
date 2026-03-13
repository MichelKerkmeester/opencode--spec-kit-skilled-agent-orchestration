import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CAPABILITY_ENV,
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
} from '../lib/config/capability-flags';

const FLAG_NAMES = [
  'SPECKIT_MEMORY_ROADMAP_PHASE',
  'SPECKIT_MEMORY_LINEAGE_STATE',
  'SPECKIT_MEMORY_GRAPH_UNIFIED',
  'SPECKIT_MEMORY_ADAPTIVE_RANKING',
  'SPECKIT_MEMORY_SCOPE_ENFORCEMENT',
  'SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS',
  'SPECKIT_MEMORY_SHARED_MEMORY',
  'SPECKIT_HYDRA_PHASE',
  'SPECKIT_HYDRA_LINEAGE_STATE',
  'SPECKIT_HYDRA_GRAPH_UNIFIED',
  'SPECKIT_HYDRA_ADAPTIVE_RANKING',
  'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
  'SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS',
  'SPECKIT_HYDRA_SHARED_MEMORY',
  'SPECKIT_GRAPH_UNIFIED',
  'SPECKIT_ROLLOUT_PERCENT',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof FLAG_NAMES[number], string | undefined>> = {};

function clearFlags(): void {
  for (const flag of FLAG_NAMES) {
    delete process.env[flag];
  }
}

describe('Memory roadmap flags', () => {
  beforeEach(() => {
    for (const flag of FLAG_NAMES) {
      ORIGINAL_ENV[flag] = process.env[flag];
    }
    clearFlags();
  });

  afterEach(() => {
    for (const flag of FLAG_NAMES) {
      if (ORIGINAL_ENV[flag] === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = ORIGINAL_ENV[flag];
      }
    }
  });

  it('defaults to the baseline phase with all roadmap capabilities disabled', () => {
    expect(getMemoryRoadmapPhase()).toBe('baseline');
    expect(getMemoryRoadmapCapabilityFlags()).toEqual({
      lineageState: false,
      graphUnified: false,
      adaptiveRanking: false,
      scopeEnforcement: false,
      governanceGuardrails: false,
      sharedMemory: false,
    });
  });

  it('uses literal memory-roadmap env vars instead of existing runtime flags', () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    expect(getMemoryRoadmapCapabilityFlags().graphUnified).toBe(false);

    process.env[CAPABILITY_ENV.graphUnified] = 'true';
    expect(getMemoryRoadmapCapabilityFlags().graphUnified).toBe(true);
  });

  it('respects rollout phase and rollout gating for explicit roadmap opt-ins', () => {
    process.env.SPECKIT_MEMORY_ROADMAP_PHASE = 'adaptive';
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    const enabled = getMemoryRoadmapDefaults('roadmap-session-1');
    expect(enabled.phase).toBe('adaptive');
    expect(enabled.capabilities.adaptiveRanking).toBe(true);

    process.env.SPECKIT_ROLLOUT_PERCENT = '0';
    const disabled = getMemoryRoadmapDefaults('roadmap-session-1');
    expect(disabled.capabilities.adaptiveRanking).toBe(false);
  });

  it('accepts legacy Hydra env vars for compatibility during the rename window', () => {
    process.env.SPECKIT_HYDRA_PHASE = 'graph';
    process.env.SPECKIT_HYDRA_GRAPH_UNIFIED = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';

    const defaults = getMemoryRoadmapDefaults('legacy-roadmap-session');
    expect(defaults.phase).toBe('graph');
    expect(defaults.capabilities.graphUnified).toBe(true);
  });

  it('falls back to baseline for unknown phase labels', () => {
    process.env.SPECKIT_MEMORY_ROADMAP_PHASE = 'future-phase';
    expect(getMemoryRoadmapPhase()).toBe('baseline');
  });
});
