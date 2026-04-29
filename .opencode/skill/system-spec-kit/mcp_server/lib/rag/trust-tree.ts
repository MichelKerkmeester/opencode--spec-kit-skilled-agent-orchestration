// ───────────────────────────────────────────────────────────────
// MODULE: RAG Trust Tree
// ───────────────────────────────────────────────────────────────
// Composes existing trust/provenance signals into an answer-level object.

type TrustSignalState = 'live' | 'stale' | 'absent' | 'unavailable' | 'unknown';
type TrustTreeDecision = 'trusted' | 'mixed' | 'degraded' | 'unavailable';
type CausalRelation = 'supports' | 'supersedes' | 'contradicts';

interface TrustSignal {
  source: 'memory.responsePolicy' | 'code_graph.readiness' | 'advisor.trustState' | 'cocoindex' | 'causal';
  state: TrustSignalState;
  summary: string;
  citations: string[];
  raw?: unknown;
}

interface CausalTrustEdge {
  relation: CausalRelation;
  sourceId: string;
  targetId: string;
  strength?: number;
}

interface BuildTrustTreeInput {
  responsePolicy?: {
    state?: TrustSignalState | string;
    decision?: string;
    citations?: readonly string[];
  };
  codeGraph?: {
    trustState?: TrustSignalState | string;
    canonicalReadiness?: string;
    citations?: readonly string[];
  };
  advisor?: {
    trustState?: TrustSignalState | string;
    citations?: readonly string[];
  };
  cocoIndex?: {
    available?: boolean;
    pathClass?: string;
    rawScore?: number;
    citations?: readonly string[];
  };
  causal?: {
    edges?: readonly CausalTrustEdge[];
    citations?: readonly string[];
  };
}

interface TrustTree {
  decision: TrustTreeDecision;
  hasContradiction: boolean;
  signals: TrustSignal[];
  causal: {
    supports: CausalTrustEdge[];
    supersedes: CausalTrustEdge[];
    contradicts: CausalTrustEdge[];
  };
  citations: string[];
  reasons: string[];
}

function buildTrustTree(input: BuildTrustTreeInput): TrustTree {
  const causalEdges = [...(input.causal?.edges ?? [])];
  const signals = [
    responsePolicySignal(input.responsePolicy),
    codeGraphSignal(input.codeGraph),
    advisorSignal(input.advisor),
    cocoIndexSignal(input.cocoIndex),
    causalSignal(causalEdges, input.causal?.citations),
  ];
  const hasContradiction = causalEdges.some((edge) => edge.relation === 'contradicts');
  const liveSignals = signals.filter((signal) => signal.state === 'live').length;
  const degradedSignals = signals.filter((signal) => (
    signal.state === 'stale' || signal.state === 'unavailable'
  )).length;
  const absentSignals = signals.filter((signal) => signal.state === 'absent' || signal.state === 'unknown').length;
  const decision = decideTrust({
    hasContradiction,
    liveSignals,
    degradedSignals,
    absentSignals,
  });

  return {
    decision,
    hasContradiction,
    signals,
    causal: groupCausalEdges(causalEdges),
    citations: uniqueStrings(signals.flatMap((signal) => signal.citations)),
    reasons: buildReasons({ decision, hasContradiction, liveSignals, degradedSignals, absentSignals }),
  };
}

function responsePolicySignal(input: BuildTrustTreeInput['responsePolicy']): TrustSignal {
  if (!input) {
    return signal('memory.responsePolicy', 'absent', 'No memory response policy signal supplied');
  }
  const state = normalizeTrustState(input.state ?? 'live');
  return signal(
    'memory.responsePolicy',
    state,
    input.decision ? `Response policy decision: ${input.decision}` : 'Memory response policy present',
    input.citations,
    input,
  );
}

function codeGraphSignal(input: BuildTrustTreeInput['codeGraph']): TrustSignal {
  if (!input) {
    return signal('code_graph.readiness', 'absent', 'No code graph readiness signal supplied');
  }
  const state = normalizeTrustState(input.trustState ?? readinessToTrustState(input.canonicalReadiness));
  return signal(
    'code_graph.readiness',
    state,
    input.canonicalReadiness ? `Code graph readiness: ${input.canonicalReadiness}` : 'Code graph readiness present',
    input.citations,
    input,
  );
}

function advisorSignal(input: BuildTrustTreeInput['advisor']): TrustSignal {
  if (!input) {
    return signal('advisor.trustState', 'absent', 'No advisor trust-state signal supplied');
  }
  return signal(
    'advisor.trustState',
    normalizeTrustState(input.trustState),
    'Advisor trust-state present',
    input.citations,
    input,
  );
}

function cocoIndexSignal(input: BuildTrustTreeInput['cocoIndex']): TrustSignal {
  if (!input) {
    return signal('cocoindex', 'absent', 'No CocoIndex signal supplied');
  }
  const state = input.available === false ? 'unavailable' : 'live';
  const score = typeof input.rawScore === 'number' ? ` rawScore=${round(input.rawScore)}` : '';
  const pathClass = input.pathClass ? ` pathClass=${input.pathClass}` : '';
  return signal('cocoindex', state, `CocoIndex signal present.${pathClass}${score}`, input.citations, input);
}

function causalSignal(edges: readonly CausalTrustEdge[], citations: readonly string[] = []): TrustSignal {
  if (edges.length === 0) {
    return signal('causal', 'absent', 'No causal relation signal supplied');
  }
  const contradicts = edges.filter((edge) => edge.relation === 'contradicts').length;
  return signal(
    'causal',
    contradicts > 0 ? 'stale' : 'live',
    `Causal relations present: supports=${edges.filter((edge) => edge.relation === 'supports').length}; supersedes=${edges.filter((edge) => edge.relation === 'supersedes').length}; contradicts=${contradicts}`,
    citations,
    edges,
  );
}

function signal(
  source: TrustSignal['source'],
  state: TrustSignalState,
  summary: string,
  citations: readonly string[] = [],
  raw?: unknown,
): TrustSignal {
  return {
    source,
    state,
    summary,
    citations: uniqueStrings([...citations]),
    ...(raw === undefined ? {} : { raw }),
  };
}

function normalizeTrustState(value: string | undefined): TrustSignalState {
  switch (value) {
    case 'live':
    case 'stale':
    case 'absent':
    case 'unavailable':
      return value;
    default:
      return 'unknown';
  }
}

function readinessToTrustState(value: string | undefined): TrustSignalState {
  switch (value) {
    case 'ready':
      return 'live';
    case 'stale':
      return 'stale';
    case 'missing':
      return 'absent';
    case 'unavailable':
      return 'unavailable';
    default:
      return 'unknown';
  }
}

function decideTrust(args: {
  hasContradiction: boolean;
  liveSignals: number;
  degradedSignals: number;
  absentSignals: number;
}): TrustTreeDecision {
  if (args.liveSignals === 0 && args.degradedSignals > 0) return 'unavailable';
  if (args.liveSignals === 0) return 'unavailable';
  if (args.hasContradiction) return 'mixed';
  if (args.degradedSignals > 0 || args.absentSignals >= 3) return 'degraded';
  return 'trusted';
}

function groupCausalEdges(edges: readonly CausalTrustEdge[]): TrustTree['causal'] {
  return {
    supports: edges.filter((edge) => edge.relation === 'supports'),
    supersedes: edges.filter((edge) => edge.relation === 'supersedes'),
    contradicts: edges.filter((edge) => edge.relation === 'contradicts'),
  };
}

function buildReasons(args: {
  decision: TrustTreeDecision;
  hasContradiction: boolean;
  liveSignals: number;
  degradedSignals: number;
  absentSignals: number;
}): string[] {
  const reasons = [
    `decision:${args.decision}`,
    `live-signals:${args.liveSignals}`,
    `degraded-signals:${args.degradedSignals}`,
    `absent-or-unknown-signals:${args.absentSignals}`,
  ];
  if (args.hasContradiction) {
    reasons.push('causal-contradiction-present');
  }
  return reasons;
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export {
  type BuildTrustTreeInput,
  type CausalTrustEdge,
  type TrustSignal,
  type TrustSignalState,
  type TrustTree,
  type TrustTreeDecision,
  buildTrustTree,
};
