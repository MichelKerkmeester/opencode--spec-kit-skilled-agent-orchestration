// ---------------------------------------------------------------
// MODULE: Memory Telemetry
// ---------------------------------------------------------------

import { structuredLog } from '../utils/logger.js';

export const METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM = 'memory_save_overview_length_histogram';
export const METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL = 'memory_save_decision_fallback_used_total';
export const METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL = 'memory_save_trigger_phrase_rejected_total';
export const METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL = 'memory_save_frontmatter_tier_drift_total';
export const METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL = 'memory_save_continuation_signal_hit_total';
export const METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL = 'memory_save_git_provenance_missing_total';
export const METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL = 'memory_save_template_anchor_violations_total';
export const METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL = 'memory_save_review_violation_total';
export const METRIC_M9_MEMORY_SAVE_DURATION_SECONDS = 'memory_save_duration_seconds';

function normalizeLabels(labels: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(labels)
      .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
      .map(([key, value]) => [key, value.trim()]),
  );
}

export function emitMemoryMetric(name: string, value: number, labels: Record<string, string>): void {
  structuredLog('info', 'memory_metric', {
    metric_name: name,
    metric_value: value,
    labels: normalizeLabels(labels),
  });
}
