// ---------------------------------------------------------------
// MODULE: Topic Extractor
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TOPIC EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts key topics from session data using weighted scoring and bigram analysis

import { SemanticSignalExtractor } from '../lib/semantic-signal-extractor';

/** Represents decision for topics. */
export interface DecisionForTopics {
  TITLE?: string;
  RATIONALE?: string;
}

const SIMULATION_MARKER = 'SIMULATION';

// NOTE: Similar to extractors/session-extractor.ts:extractKeyTopics but differs in:
// - Uses compound phrase extraction (bigrams) for more meaningful topics
// - Accepts `string` only (session-extractor accepts `string | undefined`)
// - Includes spec folder name tokens as high-priority topics
// - Processes TITLE/RATIONALE from decisions with higher weight
/** Extract key topics. */
export function extractKeyTopics(
  summary: string,
  decisions: DecisionForTopics[] = [],
  _specFolderName?: string
): string[] {
  const weightedSegments: string[] = [];

  // T09: Do NOT push spec folder name into weightedSegments — folder path fragments
  // contaminate topics with generic infrastructure words. Topics should come from
  // actual session content (summary, decisions).

  for (const decision of decisions) {
    const title = decision.TITLE || '';
    const rationale = decision.RATIONALE || '';

    if (title && !title.includes(SIMULATION_MARKER)) {
      weightedSegments.push(title, title);
    }

    if (rationale && !rationale.includes(SIMULATION_MARKER)) {
      weightedSegments.push(rationale);
    }
  }

  if (summary && summary.length >= 20 && !summary.includes(SIMULATION_MARKER)) {
    weightedSegments.push(summary);
  }

  return SemanticSignalExtractor.extractTopicTerms(weightedSegments.join('\n\n'), {
    stopwordProfile: 'aggressive',
    ngramDepth: 2,
  });
}
