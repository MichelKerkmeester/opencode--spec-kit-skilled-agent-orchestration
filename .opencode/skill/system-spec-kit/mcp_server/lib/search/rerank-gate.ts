// ───────────────────────────────────────────────────────────────
// MODULE: Conditional Rerank Gate
// ───────────────────────────────────────────────────────────────

import type { QueryPlan } from '../query/query-plan.js';

interface ChannelAgreementSignals {
  channelCount?: number;
  topScoreMargin?: number;
  weakEvidence?: boolean;
  disagreementReasons?: readonly string[];
  candidateCount?: number;
}

interface RerankGateInput {
  queryPlan: QueryPlan;
  scope?: {
    tenantId?: string;
    userId?: string;
    agentId?: string;
  };
  signals?: ChannelAgreementSignals;
}

interface RerankGateDecision {
  shouldRerank: boolean;
  reason: string;
  triggers: string[];
}

// F-011-C1-02: candidate-count floors. The default floor blocks rerank when
// fewer than DEFAULT_FLOOR candidates are present (rerank cost is not justified
// for tiny lists). The AMBIGUITY_FLOOR is a relaxed floor that applies ONLY
// when at least one weak-margin or disagreement trigger fires — these are the
// exact cases where ambiguity-resolution payoff is highest, so it is worth
// reranking even at 2 or 3 candidates. Stage 3 (`stage3-rerank.ts`) keeps its
// own MIN_RESULTS_FOR_RERANK = 4 hard guard via the F-16 regression test, so
// this gate can relax safely without changing the deeper Stage 3 contract.
const DEFAULT_RERANK_FLOOR = 4;
const AMBIGUITY_RERANK_FLOOR = 2;

// F-011-C1-02: ambiguity triggers — fire when the user's signal is weak/
// disagreed across channels. When any of these is present in `triggers`, the
// gate uses AMBIGUITY_RERANK_FLOOR instead of DEFAULT_RERANK_FLOOR.
const AMBIGUITY_TRIGGERS = new Set<string>([
  'multi-channel-weak-margin',
  'weak-evidence',
]);

function hasAmbiguityTrigger(triggers: readonly string[]): boolean {
  for (const trigger of triggers) {
    if (AMBIGUITY_TRIGGERS.has(trigger)) return true;
    // Disagreement triggers carry a `disagreement:` prefix; any disagreement
    // reason counts as an ambiguity signal.
    if (trigger.startsWith('disagreement:')) return true;
  }
  return false;
}

function decideConditionalRerank(input: RerankGateInput): RerankGateDecision {
  const signals = input.signals ?? {};
  const triggers = collectTriggers(input.queryPlan, signals);
  if (triggers.length === 0) {
    return {
      shouldRerank: false,
      reason: 'no_eligible_ambiguity_or_disagreement',
      triggers,
    };
  }

  // F-011-C1-02: pick the floor based on whether any ambiguity trigger fires.
  // Generic complex-query / high-authority cases without weak-margin or
  // disagreement still respect the original 4-candidate floor; weak-margin or
  // disagreement cases relax to the 2-candidate floor.
  const candidateCount = signals.candidateCount ?? 0;
  const floor = hasAmbiguityTrigger(triggers)
    ? AMBIGUITY_RERANK_FLOOR
    : DEFAULT_RERANK_FLOOR;
  if (candidateCount > 0 && candidateCount < floor) {
    return {
      shouldRerank: false,
      reason: 'candidate_count_below_rerank_floor',
      triggers,
    };
  }

  return {
    shouldRerank: true,
    reason: `eligible:${triggers.join('+')}`,
    triggers,
  };
}

function collectTriggers(
  queryPlan: QueryPlan,
  signals: ChannelAgreementSignals,
): string[] {
  const triggers: string[] = [];
  if (queryPlan.complexity === 'complex') {
    triggers.push('complex-query');
  }
  if (queryPlan.authorityNeed === 'high') {
    triggers.push('high-authority');
  }
  if ((signals.channelCount ?? queryPlan.selectedChannels.length) > 1 && (signals.topScoreMargin ?? 1) <= 0.08) {
    triggers.push('multi-channel-weak-margin');
  }
  if (signals.weakEvidence) {
    triggers.push('weak-evidence');
  }
  for (const reason of signals.disagreementReasons ?? []) {
    if (reason.length > 0) {
      triggers.push(`disagreement:${reason}`);
    }
  }
  return uniqueStrings(triggers);
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)];
}

export {
  type ChannelAgreementSignals,
  type RerankGateDecision,
  type RerankGateInput,
  decideConditionalRerank,
};
