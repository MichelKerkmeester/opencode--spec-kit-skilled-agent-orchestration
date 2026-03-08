// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------
// Scores the quality of generated memory files based on multiple criteria

interface FileWithDescription {
  DESCRIPTION?: string;
}

interface ObservationWithNarrative {
  TITLE?: string;
  NARRATIVE?: string;
}

interface QualityBreakdown {
  triggerPhrases: number;
  keyTopics: number;
  fileDescriptions: number;
  contentLength: number;
  noLeakedTags: number;
  observationDedup: number;
}

/** Represents quality score. */
export interface QualityScore {
  score: number;
  warnings: string[];
  breakdown: QualityBreakdown;
}

function hasMeaningfulDescription(description?: string): boolean {
  if (!description) {
    return false;
  }

  const normalized = description.trim().toLowerCase();
  if (normalized.length <= 5) {
    return false;
  }

  return !normalized.includes('description pending') && !normalized.includes('(description pending)');
}

/**
 * Score the quality of a generated memory file.
 * Runs after template rendering, before file writing.
 * Score 0-100, with breakdown per criterion.
 */
export function scoreMemoryQuality(
  content: string,
  triggerPhrases: string[],
  keyTopics: string[],
  files: FileWithDescription[],
  observations: ObservationWithNarrative[]
): QualityScore {
  const warnings: string[] = [];
  const breakdown: QualityBreakdown = {
    triggerPhrases: 0,
    keyTopics: 0,
    fileDescriptions: 0,
    contentLength: 0,
    noLeakedTags: 0,
    observationDedup: 0,
  };

  // 1. Trigger phrases (0-20 points)
  if (triggerPhrases.length >= 8) {
    breakdown.triggerPhrases = 20;
  } else if (triggerPhrases.length >= 4) {
    breakdown.triggerPhrases = 15;
  } else if (triggerPhrases.length > 0) {
    breakdown.triggerPhrases = 10;
  } else {
    warnings.push('No trigger phrases extracted — memory will not surface via trigger matching');
  }

  // 2. Key topics (0-15 points)
  if (keyTopics.length >= 5) {
    breakdown.keyTopics = 15;
  } else if (keyTopics.length >= 2) {
    breakdown.keyTopics = 10;
  } else if (keyTopics.length > 0) {
    breakdown.keyTopics = 5;
  } else {
    warnings.push('No key topics extracted — memory searchability reduced');
  }

  // 3. File descriptions populated (0-20 points)
  // This rewards memory files that remain self-explanatory in future sessions.
  const filesWithDesc = files.filter((file) => hasMeaningfulDescription(file.DESCRIPTION));
  if (files.length === 0) {
    breakdown.fileDescriptions = 20; // No files = not applicable, full score
  } else {
    const ratio = filesWithDesc.length / files.length;
    breakdown.fileDescriptions = Math.round(ratio * 20);
    if (ratio < 0.5) {
      warnings.push(`${files.length - filesWithDesc.length}/${files.length} files missing descriptions`);
    }
  }

  // 4. Content length (0-15 points)
  const contentLines = content.split('\n').length;
  if (contentLines >= 100) {
    breakdown.contentLength = 15;
  } else if (contentLines >= 50) {
    breakdown.contentLength = 10;
  } else if (contentLines >= 20) {
    breakdown.contentLength = 5;
  } else {
    warnings.push(`Very short content (${contentLines} lines) — may lack useful context`);
  }

  // 5. No leaked HTML tags (0-15 points)
  const leakedTags = content.match(/<(?:summary|details|div|span|p|br|hr)\b[^>]*>/gi) || [];
  // Exclude tags inside fenced code blocks to avoid false positives.
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  const codeContent = codeBlocks.join(' ');
  const tagsInCode = codeContent.match(/<(?:summary|details|div|span|p|br|hr)\b[^>]*>/gi) || [];
  const realLeakedTags = leakedTags.length - tagsInCode.length;
  if (realLeakedTags <= 0) {
    breakdown.noLeakedTags = 15;
  } else if (realLeakedTags <= 2) {
    breakdown.noLeakedTags = 10;
    warnings.push(`${realLeakedTags} HTML tag(s) leaked into content`);
  } else {
    breakdown.noLeakedTags = 5;
    warnings.push(`${realLeakedTags} HTML tags leaked into content — content may have raw HTML`);
  }

  // 6. Observation deduplication quality (0-15 points)
  // Repeated titles usually indicate low-information duplication.
  if (observations.length === 0) {
    breakdown.observationDedup = 15; // No observations = not applicable
  } else {
    const titles = observations.map(o => o.TITLE || '').filter(t => t.length > 0);
    const uniqueTitles = new Set(titles);
    const dedupRatio = titles.length > 0 ? uniqueTitles.size / titles.length : 1;
    breakdown.observationDedup = Math.round(dedupRatio * 15);
    if (dedupRatio < 0.6) {
      warnings.push(`High observation duplication: ${titles.length - uniqueTitles.size} duplicate titles`);
    }
  }

  const score = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  return { score, warnings, breakdown };
}
