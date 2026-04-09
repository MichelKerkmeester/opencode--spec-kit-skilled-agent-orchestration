// ───────────────────────────────────────────────────────────────
// MODULE: Warm-Start Variant Runner (026/013)
// ───────────────────────────────────────────────────────────────
// Packet-local benchmark orchestration for the conditional warm-start bundle.
// This stays intentionally narrow: it evaluates a frozen corpus of compact
// continuity wrappers against baseline, component-only, and combined variants.

export const WARM_START_BUNDLE_TOGGLE = 'SPECKIT_WARM_START_BUNDLE';

export type WarmStartVariant =
  | 'baseline'
  | 'R2_only'
  | 'R3_only'
  | 'R4_only'
  | 'R2+R3+R4_combined';

export const WARM_START_VARIANTS: readonly WarmStartVariant[] = [
  'baseline',
  'R2_only',
  'R3_only',
  'R4_only',
  'R2+R3+R4_combined',
] as const;

export interface CompactContinuityWrapper {
  title: string;
  triggers: string[];
  evidenceBullets: string[];
  continuationState: string;
  canonicalDocs: {
    decisionRecord: string;
    implementationSummary: string;
  };
}

export interface WarmStartProducerMetadata {
  freshness: 'fresh' | 'stale';
  scope: 'match' | 'mismatch';
  transcriptFingerprint: string;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
}

export interface WarmStartFollowUpTask {
  prompt: string;
  kind: 'structural' | 'implementation' | 'verification';
  graphReady: boolean;
  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
  liveBaselineAccuracy: number;
  minimumAcceptableAccuracy: number;
}

export interface WarmStartScenario {
  id: string;
  wrapper: CompactContinuityWrapper;
  producerMetadata: WarmStartProducerMetadata | null;
  followUp: WarmStartFollowUpTask;
}

export interface WarmStartCostProxy {
  toolCalls: number;
  steps: number;
  fieldsResolved: number;
  total: number;
}

export interface WarmStartScenarioResult {
  scenarioId: string;
  variant: WarmStartVariant;
  cachedContinuity: 'accepted' | 'rejected' | 'unused';
  finalState: Record<string, unknown>;
  passCount: number;
  requiredFieldCount: number;
  cost: WarmStartCostProxy;
}

export interface WarmStartVariantAggregate {
  variant: WarmStartVariant;
  totalCost: number;
  totalPassCount: number;
  totalRequiredFieldCount: number;
  scenarioResults: WarmStartScenarioResult[];
}

const WRAPPER_REQUIRED_FIELDS = [
  'title',
  'triggers',
  'evidenceBullets',
  'continuationState',
  'decisionRecordPointer',
  'implementationSummaryPointer',
  'followUpResolution',
] as const;

function countPresentFields(
  value: Record<string, unknown>,
  requiredFields: readonly string[],
): number {
  return requiredFields.filter((field) => {
    const candidate = value[field];
    if (Array.isArray(candidate)) {
      return candidate.length > 0;
    }
    return candidate !== undefined && candidate !== null;
  }).length;
}

function getVariantCapabilities(variant: WarmStartVariant): {
  producer: boolean;
  consumer: boolean;
  structuralNudge: boolean;
} {
  return {
    producer: variant === 'R2_only' || variant === 'R2+R3+R4_combined',
    consumer: variant === 'R3_only' || variant === 'R2+R3+R4_combined',
    structuralNudge: variant === 'R4_only' || variant === 'R2+R3+R4_combined',
  };
}

function acceptsCachedContinuity(
  scenario: WarmStartScenario,
  variant: WarmStartVariant,
): boolean {
  const caps = getVariantCapabilities(variant);
  return Boolean(
    caps.producer
      && caps.consumer
      && scenario.producerMetadata
      && scenario.producerMetadata.freshness === 'fresh'
      && scenario.producerMetadata.scope === 'match',
  );
}

function buildFollowUpResolution(
  scenario: WarmStartScenario,
  variant: WarmStartVariant,
): string {
  const caps = getVariantCapabilities(variant);
  if (scenario.followUp.kind === 'structural') {
    if (caps.structuralNudge && scenario.followUp.graphReady) {
      return 'code_graph_query';
    }
    return 'memory_context_then_grep';
  }

  return 'memory_context';
}

function buildFollowUpResolutionAccuracy(
  scenario: WarmStartScenario,
  resolution: string,
): number {
  if (resolution === scenario.followUp.liveBaselineResolution) {
    return scenario.followUp.liveBaselineAccuracy;
  }

  if (scenario.followUp.kind === 'structural') {
    if (resolution === 'code_graph_query') {
      return 1;
    }

    if (resolution === 'memory_context_then_grep') {
      return 0.5;
    }
  }

  return 0;
}

function countScenarioPasses(
  scenario: WarmStartScenario,
  finalState: Record<string, unknown>,
): number {
  const wrapperPasses = countPresentFields(finalState, WRAPPER_REQUIRED_FIELDS);
  const cachedReuseAccepted = finalState.cachedReuseAccepted === true ? 1 : 0;
  const followUpResolutionAccuracy = typeof finalState.followUpResolutionAccuracy === 'number'
    && finalState.followUpResolutionAccuracy >= scenario.followUp.minimumAcceptableAccuracy
    ? 1
    : 0;
  const liveReconstructionParity = finalState.liveReconstructionParity === true ? 1 : 0;

  return wrapperPasses + cachedReuseAccepted + followUpResolutionAccuracy + liveReconstructionParity;
}

export function runWarmStartScenario(
  scenario: WarmStartScenario,
  variant: WarmStartVariant,
): WarmStartScenarioResult {
  const caps = getVariantCapabilities(variant);
  const cachedAccepted = acceptsCachedContinuity(scenario, variant);
  const followUpResolution = buildFollowUpResolution(scenario, variant);
  const followUpResolutionAccuracy = buildFollowUpResolutionAccuracy(
    scenario,
    followUpResolution,
  );
  const liveReconstructionParity = followUpResolution === scenario.followUp.liveBaselineResolution;

  let toolCalls = 1; // session_bootstrap
  let steps = 1; // parse compact continuity wrapper
  let fieldsResolved = 0;

  if (caps.producer && !caps.consumer) {
    steps += 1;
    fieldsResolved += 3;
  }

  if (caps.consumer) {
    steps += 1; // evaluate cached-summary gate
  }

  if (cachedAccepted) {
    steps += 1;
    fieldsResolved += 2;
  } else {
    toolCalls += 1;
    steps += 2;
    fieldsResolved += 5;
  }

  if (scenario.followUp.kind === 'structural') {
    if (caps.structuralNudge && scenario.followUp.graphReady) {
      toolCalls += 1;
      steps += 1;
      fieldsResolved += 1;
    } else {
      toolCalls += 2;
      steps += 2;
      fieldsResolved += 4;
    }
  } else {
    toolCalls += 1;
    steps += 1;
    fieldsResolved += 2;
  }

  const finalState: Record<string, unknown> = {
    title: scenario.wrapper.title,
    triggers: scenario.wrapper.triggers,
    evidenceBullets: scenario.wrapper.evidenceBullets,
    continuationState: scenario.wrapper.continuationState,
    decisionRecordPointer: scenario.wrapper.canonicalDocs.decisionRecord,
    implementationSummaryPointer: scenario.wrapper.canonicalDocs.implementationSummary,
    followUpResolution,
    cachedContinuityStatus: cachedAccepted
      ? 'accepted'
      : caps.consumer
        ? 'live_fallback'
        : 'unused',
    cachedReuseAccepted: cachedAccepted,
    followUpResolutionAccuracy,
    liveReconstructionParity,
  };

  return {
    scenarioId: scenario.id,
    variant,
    cachedContinuity: cachedAccepted
      ? 'accepted'
      : caps.consumer
        ? 'rejected'
        : 'unused',
    finalState,
    passCount: countScenarioPasses(scenario, finalState),
    requiredFieldCount: WRAPPER_REQUIRED_FIELDS.length + 3,
    cost: {
      toolCalls,
      steps,
      fieldsResolved,
      total: toolCalls + steps + fieldsResolved,
    },
  };
}

export function runWarmStartVariantMatrix(
  corpus: readonly WarmStartScenario[],
): WarmStartVariantAggregate[] {
  return WARM_START_VARIANTS.map((variant) => {
    const scenarioResults = corpus.map((scenario) => runWarmStartScenario(scenario, variant));

    return {
      variant,
      totalCost: scenarioResults.reduce((sum, result) => sum + result.cost.total, 0),
      totalPassCount: scenarioResults.reduce((sum, result) => sum + result.passCount, 0),
      totalRequiredFieldCount: scenarioResults.reduce(
        (sum, result) => sum + result.requiredFieldCount,
        0,
      ),
      scenarioResults,
    };
  });
}

export function doesCombinedVariantDominate(
  matrix: readonly WarmStartVariantAggregate[],
): boolean {
  const combined = matrix.find((entry) => entry.variant === 'R2+R3+R4_combined');
  if (!combined) {
    return false;
  }

  return matrix
    .filter((entry) => entry.variant !== 'R2+R3+R4_combined')
    .every((entry) =>
      combined.totalCost < entry.totalCost
      && combined.totalPassCount >= entry.totalPassCount,
    );
}
