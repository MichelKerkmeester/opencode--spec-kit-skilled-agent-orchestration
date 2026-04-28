// ───────────────────────────────────────────────────────────────
// MODULE: Query Plan
// ───────────────────────────────────────────────────────────────
// Telemetry-only contract for explaining how query intelligence surfaces read a
// query. Builders in this module must not make routing decisions.

type QueryPlanIntent =
  | 'add_feature'
  | 'fix_bug'
  | 'refactor'
  | 'security_audit'
  | 'understand'
  | 'find_spec'
  | 'find_decision'
  | 'unknown';

type QueryPlanComplexity = 'simple' | 'moderate' | 'complex' | 'unknown';

type QueryPlanAuthorityNeed = 'low' | 'medium' | 'high' | 'unknown';

type QueryPlanFallbackMode =
  | 'none'
  | 'safe_complexity'
  | 'full_pipeline'
  | 'classifier_default'
  | 'telemetry_only';

interface QueryPlanSkippedChannel {
  channel: string;
  reason: string;
}

interface QueryPlanFallbackPolicy {
  mode: QueryPlanFallbackMode;
  reason: string;
}

interface QueryPlan {
  intent: QueryPlanIntent;
  complexity: QueryPlanComplexity;
  artifactClass: string;
  authorityNeed: QueryPlanAuthorityNeed;
  selectedChannels: string[];
  skippedChannels: QueryPlanSkippedChannel[];
  routingReasons: string[];
  fallbackPolicy: QueryPlanFallbackPolicy;
}

interface BuildComplexityQueryPlanInput {
  complexity: QueryPlanComplexity;
  confidence: string;
  termCount?: number;
  hasTriggerMatch?: boolean;
}

interface BuildIntentQueryPlanInput {
  intent: string;
  confidence: number;
  keywords?: string[];
  query?: string;
}

interface BuildRoutingQueryPlanInput {
  query?: string;
  complexity: QueryPlanComplexity;
  artifactClass: string;
  selectedChannels: readonly string[];
  allChannels: readonly string[];
  intent?: string;
  authorityNeed?: QueryPlanAuthorityNeed;
  routingReasons?: readonly string[];
  fallbackPolicy?: QueryPlanFallbackPolicy;
}

const DEFAULT_FALLBACK_POLICY: QueryPlanFallbackPolicy = {
  mode: 'none',
  reason: 'No fallback applied',
};

const HIGH_AUTHORITY_ARTIFACTS = new Set([
  'spec',
  'plan',
  'tasks',
  'checklist',
  'decision-record',
  'implementation-summary',
  'research',
]);

function createEmptyQueryPlan(overrides: Partial<QueryPlan> = {}): QueryPlan {
  const {
    selectedChannels,
    skippedChannels,
    routingReasons,
    fallbackPolicy,
    ...scalarOverrides
  } = overrides;

  return {
    intent: 'unknown',
    complexity: 'unknown',
    artifactClass: 'unknown',
    authorityNeed: 'unknown',
    ...scalarOverrides,
    selectedChannels: [...(selectedChannels ?? [])],
    skippedChannels: [...(skippedChannels ?? [])],
    routingReasons: [...(routingReasons ?? [])],
    fallbackPolicy: fallbackPolicy ?? DEFAULT_FALLBACK_POLICY,
  };
}

function normalizeIntent(intent: string | undefined): QueryPlanIntent {
  switch (intent) {
    case 'add_feature':
    case 'fix_bug':
    case 'refactor':
    case 'security_audit':
    case 'understand':
    case 'find_spec':
    case 'find_decision':
      return intent;
    default:
      return 'unknown';
  }
}

function inferAuthorityNeed(input: {
  intent?: string;
  artifactClass?: string;
  query?: string;
}): QueryPlanAuthorityNeed {
  const intent = normalizeIntent(input.intent);
  if (intent === 'security_audit' || intent === 'find_spec' || intent === 'find_decision') {
    return 'high';
  }

  const artifactClass = input.artifactClass ?? 'unknown';
  if (HIGH_AUTHORITY_ARTIFACTS.has(artifactClass)) {
    return 'high';
  }

  const query = input.query?.toLowerCase() ?? '';
  if (/\b(audit|security|decision|rationale|requirement|scope|checklist|citation|source)\b/.test(query)) {
    return 'high';
  }
  if (/\b(explain|understand|overview|how|why)\b/.test(query)) {
    return 'medium';
  }

  return 'low';
}

function mergeQueryPlans(...plans: Array<QueryPlan | undefined>): QueryPlan {
  const merged = createEmptyQueryPlan();

  for (const plan of plans) {
    if (!plan) continue;

    if (merged.intent === 'unknown' && plan.intent !== 'unknown') {
      merged.intent = plan.intent;
    }
    if (merged.complexity === 'unknown' && plan.complexity !== 'unknown') {
      merged.complexity = plan.complexity;
    }
    if (merged.artifactClass === 'unknown' && plan.artifactClass !== 'unknown') {
      merged.artifactClass = plan.artifactClass;
    }
    if (merged.authorityNeed === 'unknown' && plan.authorityNeed !== 'unknown') {
      merged.authorityNeed = plan.authorityNeed;
    }
    if (merged.fallbackPolicy.mode === 'none' && plan.fallbackPolicy.mode !== 'none') {
      merged.fallbackPolicy = plan.fallbackPolicy;
    }

    merged.selectedChannels = uniqueStrings([
      ...merged.selectedChannels,
      ...plan.selectedChannels,
    ]);
    merged.skippedChannels = mergeSkippedChannels(merged.skippedChannels, plan.skippedChannels);
    merged.routingReasons = uniqueStrings([
      ...merged.routingReasons,
      ...plan.routingReasons,
    ]);
  }

  return merged;
}

function buildComplexityQueryPlan(input: BuildComplexityQueryPlanInput): QueryPlan {
  const fallbackPolicy: QueryPlanFallbackPolicy = input.confidence === 'fallback'
    ? {
      mode: 'safe_complexity',
      reason: 'Complexity classifier fell back to safe complex tier',
    }
    : DEFAULT_FALLBACK_POLICY;

  const reasons = [
    `complexity:${input.complexity}`,
    `confidence:${input.confidence}`,
  ];
  if (typeof input.termCount === 'number') {
    reasons.push(`terms:${input.termCount}`);
  }
  if (input.hasTriggerMatch) {
    reasons.push('trigger-match');
  }

  return createEmptyQueryPlan({
    complexity: input.complexity,
    routingReasons: reasons,
    fallbackPolicy,
  });
}

function buildIntentQueryPlan(input: BuildIntentQueryPlanInput): QueryPlan {
  const intent = normalizeIntent(input.intent);
  const keywordReasons = (input.keywords ?? []).slice(0, 5).map((keyword) => `keyword:${keyword}`);
  return createEmptyQueryPlan({
    intent,
    authorityNeed: inferAuthorityNeed({ intent, query: input.query }),
    routingReasons: [
      `intent:${intent}`,
      `intent-confidence:${roundMetric(input.confidence)}`,
      ...keywordReasons,
    ],
  });
}

function buildRoutingQueryPlan(input: BuildRoutingQueryPlanInput): QueryPlan {
  const selected = uniqueStrings([...input.selectedChannels]);
  const allChannels = uniqueStrings([...input.allChannels]);
  const skippedChannels = allChannels
    .filter((channel) => !selected.includes(channel))
    .map((channel) => ({
      channel,
      reason: `Skipped by ${input.complexity} complexity route`,
    }));
  const intent = normalizeIntent(input.intent);
  const authorityNeed = input.authorityNeed ?? inferAuthorityNeed({
    intent,
    artifactClass: input.artifactClass,
    query: input.query,
  });

  return createEmptyQueryPlan({
    intent,
    complexity: input.complexity,
    artifactClass: input.artifactClass,
    authorityNeed,
    selectedChannels: selected,
    skippedChannels,
    routingReasons: uniqueStrings([
      `artifact:${input.artifactClass}`,
      `channels:${selected.join('+') || 'none'}`,
      ...(input.routingReasons ?? []),
    ]),
    fallbackPolicy: input.fallbackPolicy ?? DEFAULT_FALLBACK_POLICY,
  });
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function mergeSkippedChannels(
  left: QueryPlanSkippedChannel[],
  right: QueryPlanSkippedChannel[],
): QueryPlanSkippedChannel[] {
  const seen = new Set<string>();
  const merged: QueryPlanSkippedChannel[] = [];
  for (const item of [...left, ...right]) {
    const key = `${item.channel}:${item.reason}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}

function roundMetric(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export {
  type QueryPlan,
  type QueryPlanAuthorityNeed,
  type QueryPlanComplexity,
  type QueryPlanFallbackMode,
  type QueryPlanFallbackPolicy,
  type QueryPlanIntent,
  type QueryPlanSkippedChannel,
  createEmptyQueryPlan,
  buildComplexityQueryPlan,
  buildIntentQueryPlan,
  buildRoutingQueryPlan,
  inferAuthorityNeed,
  mergeQueryPlans,
};
