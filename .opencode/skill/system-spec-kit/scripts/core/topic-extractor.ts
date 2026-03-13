// --- 1. TOPIC EXTRACTOR ---
// Extracts key topics from session data using weighted scoring and bigram analysis

import {
  createValidShortTerms,
  shouldIncludeTopicWord,
  tokenizeTopicWords,
} from '../lib/topic-keywords';

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
  specFolderName?: string
): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'file', 'files',
    'code', 'update', 'response', 'request', 'message', 'using', 'used', 'use',
    'set', 'get', 'new', 'add', 'added', 'make', 'made', 'based', 'work',
    'working', 'works', 'need', 'needs', 'needed', 'like', 'also', 'well',
    'session', 'context', 'data', 'tool', 'tools', 'run', 'running', 'started',
    'changes', 'changed', 'change', 'check', 'checked', 'checking'
  ]);
  const validShortTerms = createValidShortTerms();

  // Scored topics: phrase -> weight
  const topicScores = new Map<string, number>();
  const addWord = (word: string, weight: number): void => {
    if (shouldIncludeTopicWord(word, stopwords, validShortTerms)) {
      topicScores.set(word, (topicScores.get(word) || 0) + weight);
    }
  };

  const addBigrams = (text: string, weight: number): void => {
    const words = tokenizeTopicWords(text);
    const filtered = words.filter((w) => shouldIncludeTopicWord(w, stopwords, validShortTerms));
    for (let i = 0; i < filtered.length - 1; i++) {
      const bigram = `${filtered[i]} ${filtered[i + 1]}`;
      if (bigram.length >= 7) { // meaningful compound phrase
        topicScores.set(bigram, (topicScores.get(bigram) || 0) + weight * 1.5);
      }
    }
  };

  // Spec folder name gets highest weight (defines the topic)
  if (specFolderName) {
    const folderBase = specFolderName.replace(/^\d{1,3}-/, '');
    const folderWords = folderBase.split(/[-_]/).filter(w => w.length >= 2);
    folderWords.forEach(w => addWord(w.toLowerCase(), 3.0));
    // Also add the full folder concept as a compound topic
    if (folderWords.length >= 2) {
      const compound = folderWords.join(' ').toLowerCase();
      topicScores.set(compound, (topicScores.get(compound) || 0) + 4.0);
    }
  }

  // Decision titles get high weight
  decisions.forEach((d) => {
    const title = d.TITLE || '';
    const rationale = d.RATIONALE || '';
    if (title && !title.includes(SIMULATION_MARKER)) {
      tokenizeTopicWords(title).forEach((w) => addWord(w, 2.0));
      addBigrams(title, 2.0);
    }
    if (rationale && !rationale.includes(SIMULATION_MARKER)) {
      tokenizeTopicWords(rationale).forEach((w) => addWord(w, 1.0));
    }
  });

  // Summary gets standard weight
  if (summary && summary.length >= 20 && !summary.includes(SIMULATION_MARKER)) {
    tokenizeTopicWords(summary).forEach((w) => addWord(w, 1.0));
    addBigrams(summary, 1.0);
  }

  return [...topicScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([phrase]) => phrase);
}
