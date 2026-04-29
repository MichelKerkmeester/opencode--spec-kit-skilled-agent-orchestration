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
  signals?: ChannelAgreementSignals;
  env?: NodeJS.ProcessEnv;
}

interface RerankGateDecision {
  shouldRerank: boolean;
  reason: string;
  triggers: string[];
}

function isConditionalRerankEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SPECKIT_CONDITIONAL_RERANK === '1' || env.SPECKIT_CONDITIONAL_RERANK === 'true';
}

function decideConditionalRerank(input: RerankGateInput): RerankGateDecision {
  if (!isConditionalRerankEnabled(input.env)) {
    return {
      shouldRerank: false,
      reason: 'flag_disabled',
      triggers: [],
    };
  }

  const signals = input.signals ?? {};
  const triggers = collectTriggers(input.queryPlan, signals);
  if (triggers.length === 0) {
    return {
      shouldRerank: false,
      reason: 'no_eligible_ambiguity_or_disagreement',
      triggers,
    };
  }

  if ((signals.candidateCount ?? 0) > 0 && (signals.candidateCount ?? 0) < 4) {
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
  isConditionalRerankEnabled,
};
