// ───────────────────────────────────────────────────────────────
// MODULE: Skill Corpus DF-IDF
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
// F-016-D1-08: Keep `filterCorpusStatEligible` as the default predicate so
// existing callers see no behavioral change, but expose a `predicate`
// parameter on `computeCorpusStats` so callers can pass a different filter
// (or the eligible documents directly) without the corpus math module
// reaching into the lifecycle subsystem.
import { filterCorpusStatEligible } from '../lifecycle/archive-handling.js';

export type CorpusEligibilityPredicate = <T extends { sourcePath: string }>(
  entries: readonly T[],
) => readonly T[];

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface CorpusDocument {
  readonly skillId: string;
  readonly sourcePath: string;
  readonly terms: readonly string[];
}

export interface CorpusTermStat {
  readonly term: string;
  readonly documentFrequency: number;
  readonly idf: number;
}

export interface CorpusStats {
  readonly documentCount: number;
  readonly vocabularyHash: string;
  readonly generatedAt: string;
  readonly terms: CorpusTermStat[];
}

export interface DebouncedCorpusUpdater {
  readonly schedule: (documents: readonly CorpusDocument[]) => void;
  readonly flush: () => CorpusStats | null;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function normalizeTerms(terms: readonly string[]): string[] {
  return [...new Set(terms.map((term) => term.toLowerCase().trim()).filter(Boolean))].sort();
}

export function computeCorpusStats(
  documents: readonly CorpusDocument[],
  now = new Date(),
  // F-016-D1-08: predicate is opt-in; default keeps the existing
  // lifecycle-aware behavior so callers that do not pass a predicate get
  // the same result as before. Callers that already filter their documents
  // upstream can pass `(entries) => entries` to skip the inner pass.
  predicate: CorpusEligibilityPredicate = filterCorpusStatEligible,
): CorpusStats {
  const activeDocuments = predicate(documents);
  const documentFrequency = new Map<string, number>();
  for (const document of activeDocuments) {
    for (const term of normalizeTerms(document.terms)) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const documentCount = activeDocuments.length;
  const terms = [...documentFrequency.entries()]
    .map(([term, df]) => ({
      term,
      documentFrequency: df,
      idf: Number((Math.log((1 + documentCount) / (1 + df)) + 1).toFixed(6)),
    }))
    .sort((left, right) => left.term.localeCompare(right.term));
  const vocabularyHash = `sha256:${createHash('sha256').update(JSON.stringify(terms)).digest('hex')}`;
  return {
    documentCount,
    vocabularyHash,
    generatedAt: now.toISOString(),
    terms,
  };
}

export function createDebouncedCorpusUpdater(
  callback: (stats: CorpusStats) => void,
  debounceMs = 250,
  now = () => new Date(),
): DebouncedCorpusUpdater {
  let timer: NodeJS.Timeout | null = null;
  let pendingDocuments: readonly CorpusDocument[] | null = null;
  let lastStats: CorpusStats | null = null;

  function flush(): CorpusStats | null {
    if (!pendingDocuments) return lastStats;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastStats = computeCorpusStats(pendingDocuments, now());
    pendingDocuments = null;
    callback(lastStats);
    return lastStats;
  }

  return {
    schedule(documents) {
      pendingDocuments = documents;
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, debounceMs);
      timer.unref?.();
    },
    flush,
  };
}

