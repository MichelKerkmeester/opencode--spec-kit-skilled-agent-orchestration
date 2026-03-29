// ---------------------------------------------------------------
// MODULE: Memory Sufficiency
// ---------------------------------------------------------------

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
const COMMENT_RE = /<!--[\s\S]*?-->/g;
const CODE_FENCE_RE = /```[\s\S]*?```/g;
const WORD_RE = /\b[a-z][a-z0-9_-]{2,}\b/gi;
const FILE_REF_RE = /`?[^`\s]+\.(ts|tsx|js|jsx|py|sh|md|json|jsonc|yml|yaml|toml|css|html|sql)`?/i;
const DECISION_SIGNAL_RE = /\b(decided|decision|chosen|selected|because|rationale|tradeoff|next\b|follow-up|blocker|outcome|fixed|implemented|verified|tested|failed|error)\b/i;
const TOOL_SIGNAL_RE = /\b(tool|bash|grep|glob|read|write|edit|search|query|command|result)\b/i;
const SECTION_HEADING_RE = /^#{1,6}\s+(.+)$/;
const GENERIC_TITLE_PATTERNS = [
  /^memory$/i,
  /^session$/i,
  /^development session$/i,
  /^work session$/i,
  /^session summary$/i,
  /^session context$/i,
  /^implementation$/i,
  /^implementation and updates$/i,
  /^update$/i,
  /^updates$/i,
  /^context$/i,
  /^summary$/i,
  /^notes$/i,
  /^untitled$/i,
];
const GENERIC_SECTION_PATTERNS = [
  /^overview$/i,
  /^summary$/i,
  /^context$/i,
  /^notes?$/i,
  /^details$/i,
  /^implementation summary$/i,
  /^technical context$/i,
  /^progress$/i,
  /^metadata$/i,
];
const GENERIC_TEXT_PATTERNS = [
  /^development session$/i,
  /^implementation and updates$/i,
  /^session completed\.?$/i,
  /^more work later\.?$/i,
  /^updated stuff\.?$/i,
  /^done\.?$/i,
  /^n\/a$/i,
  /^none$/i,
  /^\[tbd\]$/i,
];
const PLACEHOLDER_FILE_PATTERNS = [
  /description pending/i,
  /\(description pending\)/i,
  /^modified during session$/i,
  /^tracked file history snapshot$/i,
];
const GENERIC_TOOL_TITLE_RE = /^(tool:\s*)?(read|write|edit|bash|grep|glob|search|open|list)\b[:\s-]*$/i;

export const MEMORY_SUFFICIENCY_REJECTION_CODE = 'INSUFFICIENT_CONTEXT_ABORT' as const;

export interface MemoryEvidenceFile {
  path?: string;
  description?: string;
  synthetic?: boolean;
  provenance?: string;
  specRelevant?: boolean;
}

export interface MemoryEvidenceObservation {
  title?: string;
  narrative?: string;
  facts?: string[];
  synthetic?: boolean;
  provenance?: string;
  specRelevant?: boolean;
}

export interface MemoryEvidenceContext {
  request?: string;
  learning?: string;
}

export interface MemoryEvidenceSnapshot {
  title?: string | null;
  content?: string;
  triggerPhrases?: string[];
  sourceClassification?: string;
  files?: MemoryEvidenceFile[];
  observations?: MemoryEvidenceObservation[];
  decisions?: string[];
  nextActions?: string[];
  blockers?: string[];
  outcomes?: string[];
  recentContext?: MemoryEvidenceContext[];
  anchors?: string[];
}

export interface MemorySufficiencyEvidenceCounts {
  primary: number;
  support: number;
  total: number;
  semanticChars: number;
  uniqueWords: number;
  anchors: number;
  triggerPhrases: number;
}

export interface MemorySufficiencyResult {
  pass: boolean;
  rejectionCode: typeof MEMORY_SUFFICIENCY_REJECTION_CODE;
  reasons: string[];
  evidenceCounts: MemorySufficiencyEvidenceCounts;
  score: number;
}

export const MANUAL_FALLBACK_SOURCE = 'manual-fallback' as const;

function stripFrontmatter(content: string): string {
  return content.replace(FRONTMATTER_RE, '');
}

function stripDecorativeContent(content: string): string {
  return stripFrontmatter(content)
    .replace(COMMENT_RE, '\n')
    .replace(CODE_FENCE_RE, '\n')
    .trim();
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function extractWords(text: string): string[] {
  return (text.match(WORD_RE) ?? []).map((word) => word.toLowerCase());
}

function countUniqueWords(text: string): number {
  return new Set(extractWords(text)).size;
}

function isSpecificTitle(title?: string | null): boolean {
  if (!title) {
    return false;
  }

  const normalized = normalizeWhitespace(title);
  if (normalized.length < 8) {
    return false;
  }

  return !GENERIC_TITLE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isGenericText(text?: string | null): boolean {
  if (!text) {
    return true;
  }

  const normalized = normalizeWhitespace(text);
  if (normalized.length === 0) {
    return true;
  }

  return GENERIC_TEXT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasSemanticSubstance(text?: string | null, minChars: number = 40, minWords: number = 8): boolean {
  if (!text) {
    return false;
  }

  const normalized = normalizeWhitespace(text);
  if (normalized.length < minChars) {
    return false;
  }

  return countUniqueWords(normalized) >= minWords && !isGenericText(normalized);
}

function hasConcreteSignals(text: string): boolean {
  return FILE_REF_RE.test(text) || DECISION_SIGNAL_RE.test(text) || TOOL_SIGNAL_RE.test(text);
}

function hasMeaningfulFileDescription(file: MemoryEvidenceFile): boolean {
  const description = normalizeWhitespace(file.description || '');
  if (description.length < 20) {
    return false;
  }

  if (PLACEHOLDER_FILE_PATTERNS.some((pattern) => pattern.test(description))) {
    return false;
  }

  if (file.synthetic && !file.specRelevant && file.provenance !== 'spec-folder') {
    return false;
  }

  return true;
}

function buildObservationText(observation: MemoryEvidenceObservation): string {
  return normalizeWhitespace([
    observation.title || '',
    observation.narrative || '',
    ...(observation.facts || []),
  ].join(' '));
}

function isMeaningfulObservation(observation: MemoryEvidenceObservation): boolean {
  const title = normalizeWhitespace(observation.title || '');
  const text = buildObservationText(observation);
  if (!hasSemanticSubstance(text, 60, 10)) {
    return false;
  }

  if (observation.synthetic && !observation.specRelevant && observation.provenance !== 'spec-folder') {
    return false;
  }

  if (title.length > 0 && !GENERIC_TOOL_TITLE_RE.test(title) && !GENERIC_SECTION_PATTERNS.some((pattern) => pattern.test(title))) {
    return true;
  }

  return hasConcreteSignals(text);
}

function isMeaningfulDecisionText(text?: string | null): boolean {
  return hasSemanticSubstance(text, 24, 5);
}

function extractAnchorsFromContent(content: string): string[] {
  const anchors = content.match(/<!--\s*(?:ANCHOR|anchor):\s*([a-zA-Z0-9][a-zA-Z0-9-/]*)\s*-->/g) ?? [];
  return anchors;
}

function extractSectionBodies(content: string): Array<{ heading: string; body: string }> {
  const lines = stripDecorativeContent(content).split(/\r?\n/);
  const sections: Array<{ heading: string; body: string }> = [];
  let currentHeading = '';
  let currentBody: string[] = [];

  const flush = (): void => {
    const body = normalizeWhitespace(currentBody.join(' '));
    if (body.length > 0) {
      sections.push({ heading: currentHeading, body });
    }
    currentBody = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const headingMatch = trimmed.match(SECTION_HEADING_RE);
    if (headingMatch) {
      flush();
      currentHeading = normalizeWhitespace(headingMatch[1]);
      continue;
    }

    currentBody.push(trimmed);
  }

  flush();
  return sections;
}

function isMeaningfulSection(section: { heading: string; body: string }): boolean {
  const heading = normalizeWhitespace(section.heading);
  if (!hasSemanticSubstance(section.body, 100, 16)) {
    return false;
  }

  if (heading.length > 0 && !GENERIC_SECTION_PATTERNS.some((pattern) => pattern.test(heading))) {
    return true;
  }

  return hasConcreteSignals(section.body);
}

function collectSupportContexts(snapshot: MemoryEvidenceSnapshot): string[] {
  const results: string[] = [];

  for (const context of snapshot.recentContext || []) {
    const text = normalizeWhitespace([context.request || '', context.learning || ''].join(' '));
    if (hasSemanticSubstance(text, 40, 8)) {
      results.push(text);
    }
  }

  const meaningfulTriggers = (snapshot.triggerPhrases || [])
    .map((phrase) => normalizeWhitespace(phrase))
    .filter((phrase) => phrase.length >= 4 && !isGenericText(phrase));
  if (meaningfulTriggers.length >= 2) {
    results.push(meaningfulTriggers.join(' '));
  }

  if ((snapshot.anchors || extractAnchorsFromContent(snapshot.content || '')).length > 0) {
    results.push('Anchored document structure present.');
  }

  return results;
}

function isManualFallbackSource(sourceClassification?: string | null): boolean {
  return normalizeWhitespace(sourceClassification || '').toLowerCase() === MANUAL_FALLBACK_SOURCE;
}

export function evaluateMemorySufficiency(snapshot: MemoryEvidenceSnapshot): MemorySufficiencyResult {
  const primaryEvidenceTexts: string[] = [];
  const supportEvidenceTexts: string[] = [];

  for (const file of snapshot.files || []) {
    if (hasMeaningfulFileDescription(file)) {
      primaryEvidenceTexts.push(normalizeWhitespace([file.path || '', file.description || ''].join(' ')));
    }
  }

  for (const observation of snapshot.observations || []) {
    if (isMeaningfulObservation(observation)) {
      primaryEvidenceTexts.push(buildObservationText(observation));
    } else if (observation.synthetic && observation.provenance === 'spec-folder') {
      const text = buildObservationText(observation);
      if (hasSemanticSubstance(text, 40, 8)) {
        supportEvidenceTexts.push(text);
      }
    }
  }

  for (const text of [
    ...(snapshot.decisions || []),
    ...(snapshot.nextActions || []),
    ...(snapshot.blockers || []),
    ...(snapshot.outcomes || []),
  ]) {
    if (isMeaningfulDecisionText(text)) {
      primaryEvidenceTexts.push(normalizeWhitespace(text));
    }
  }

  const contentSections = extractSectionBodies(snapshot.content || '');
  const meaningfulSections = contentSections.filter(isMeaningfulSection);
  if (meaningfulSections.length > 0) {
    supportEvidenceTexts.push(meaningfulSections[0].body);
  }

  supportEvidenceTexts.push(...collectSupportContexts(snapshot));

  const uniqueEvidenceTexts = Array.from(new Set(
    [...primaryEvidenceTexts, ...supportEvidenceTexts]
      .map((text) => normalizeWhitespace(text))
      .filter((text) => text.length > 0)
  ));
  const semanticText = uniqueEvidenceTexts.join(' ');
  const semanticChars = semanticText.length;
  const uniqueWords = countUniqueWords(semanticText);
  const anchors = (snapshot.anchors || extractAnchorsFromContent(snapshot.content || '')).length;
  const meaningfulTriggers = (snapshot.triggerPhrases || [])
    .map((phrase) => normalizeWhitespace(phrase))
    .filter((phrase) => phrase.length >= 4 && !isGenericText(phrase)).length;
  const counts: MemorySufficiencyEvidenceCounts = {
    primary: primaryEvidenceTexts.length,
    support: supportEvidenceTexts.length,
    total: primaryEvidenceTexts.length + supportEvidenceTexts.length,
    semanticChars,
    uniqueWords,
    anchors,
    triggerPhrases: meaningfulTriggers,
  };
  const manualFallbackEligible = isManualFallbackSource(snapshot.sourceClassification)
    && counts.primary === 0
    && counts.support >= 3
    && counts.anchors >= 1;

  const reasons: string[] = [];
  const specificTitle = isSpecificTitle(snapshot.title);
  if (!specificTitle) {
    reasons.push('Memory title is too generic to stand alone later.');
  }
  if (counts.primary < 1 && !manualFallbackEligible) {
    reasons.push('No primary evidence was captured for this memory.');
  }
  if (counts.primary < 1 && isManualFallbackSource(snapshot.sourceClassification) && !manualFallbackEligible) {
    reasons.push('Manual fallback requires at least three support evidence items and one anchor when primary evidence is absent.');
  }
  if (counts.total < 2) {
    reasons.push('Fewer than two spec-relevant evidence items were captured.');
  }
  if (counts.semanticChars < 250 && counts.uniqueWords < 40) {
    reasons.push(
      `Semantic substance is too low (${counts.semanticChars} chars, ${counts.uniqueWords} unique words).`
    );
  }

  const primaryEvidenceScore = manualFallbackEligible
    ? Math.min((counts.support / 3 + Math.min(counts.anchors, 1)) / 2, 1)
    : Math.min(counts.primary / 2, 1);
  const score =
    (specificTitle ? 0.25 : 0) +
    (primaryEvidenceScore * 0.35) +
    (Math.min(counts.total / 3, 1) * 0.15) +
    (Math.max(Math.min(counts.semanticChars / 400, 1), Math.min(counts.uniqueWords / 60, 1)) * 0.25);

  return {
    pass: reasons.length === 0,
    rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
    reasons,
    evidenceCounts: counts,
    score: Math.max(0, Math.min(1, Number(score.toFixed(2)))),
  };
}
