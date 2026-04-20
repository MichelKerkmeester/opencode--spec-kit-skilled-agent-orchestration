export type SkillGraphTrustState = 'live' | 'stale' | 'absent' | 'unavailable';

export interface TrustStateSnapshot {
  readonly state: SkillGraphTrustState;
  readonly reason: string | null;
  readonly generation: number;
  readonly checkedAt: string;
  readonly lastLiveAt: string | null;
}

export interface TrustStateInput {
  readonly hasSources: boolean;
  readonly hasArtifact: boolean;
  readonly sourceChanged: boolean;
  readonly daemonAvailable: boolean;
  readonly generation: number;
  readonly reason?: string | null;
  readonly now?: Date;
  readonly lastLiveAt?: string | null;
}

export function createTrustState(input: TrustStateInput): TrustStateSnapshot {
  const checkedAt = (input.now ?? new Date()).toISOString();

  if (!input.daemonAvailable) {
    return {
      state: 'unavailable',
      reason: input.reason ?? 'DAEMON_UNAVAILABLE',
      generation: input.generation,
      checkedAt,
      lastLiveAt: input.lastLiveAt ?? null,
    };
  }

  if (!input.hasSources || !input.hasArtifact) {
    return {
      state: 'absent',
      reason: input.reason ?? (input.hasSources ? 'SKILL_GRAPH_ABSENT' : 'SKILL_SOURCES_ABSENT'),
      generation: input.generation,
      checkedAt,
      lastLiveAt: input.lastLiveAt ?? null,
    };
  }

  if (input.sourceChanged) {
    return {
      state: 'stale',
      reason: input.reason ?? 'SOURCE_NEWER_THAN_SKILL_GRAPH',
      generation: input.generation,
      checkedAt,
      lastLiveAt: input.lastLiveAt ?? null,
    };
  }

  return {
    state: 'live',
    reason: null,
    generation: input.generation,
    checkedAt,
    lastLiveAt: checkedAt,
  };
}

export function failOpenTrustState(reason: string, generation = 0): TrustStateSnapshot {
  return createTrustState({
    hasSources: false,
    hasArtifact: false,
    sourceChanged: false,
    daemonAvailable: false,
    generation,
    reason,
  });
}

export function isReaderUsable(state: SkillGraphTrustState): boolean {
  return state === 'live' || state === 'stale';
}
