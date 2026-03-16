// ---------------------------------------------------------------
// MODULE: Fact Coercion
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. FACT COERCION
// ───────────────────────────────────────────────────────────────
// Normalizes runtime fact values into displayable strings without
// silently dropping object-shaped content at extractor boundaries.

import { structuredLog } from './logger';

export type FactDropReason =
  | 'nullish'
  | 'unserializable-object';

export interface CoercedFact {
  text: string;
  dropReason?: FactDropReason;
  sourceType: 'string' | 'text-object' | 'object' | 'primitive' | 'nullish';
}

export interface FactDropLogContext {
  component: string;
  fieldPath: string;
  specFolder?: string;
  sessionId?: string;
}

function coerceFactToText(value: unknown): CoercedFact {
  if (typeof value === 'string') {
    return {
      text: value,
      sourceType: 'string',
    };
  }

  if (value === null || value === undefined) {
    return {
      text: '',
      dropReason: 'nullish',
      sourceType: 'nullish',
    };
  }

  if (typeof value === 'object') {
    const candidate = value as { text?: unknown };
    if (typeof candidate.text === 'string' && candidate.text.length > 0) {
      return {
        text: candidate.text,
        sourceType: 'text-object',
      };
    }

    try {
      return {
        text: `[object] ${JSON.stringify(value)}`,
        sourceType: 'object',
      };
    } catch {
      return {
        text: '[object] [unserializable]',
        dropReason: 'unserializable-object',
        sourceType: 'object',
      };
    }
  }

  return {
    text: String(value),
    sourceType: 'primitive',
  };
}

function coerceFactsToText(facts: unknown[] | null | undefined, logContext?: FactDropLogContext): string[] {
  if (!Array.isArray(facts) || facts.length === 0) {
    return [];
  }

  const coerced = facts.map((fact) => coerceFactToText(fact));
  const dropped = coerced.filter((fact) => fact.dropReason);

  if (dropped.length > 0) {
    const ctx = logContext || { component: 'unknown', fieldPath: 'unknown' };
    const dropReasonCounts = dropped.reduce<Record<string, number>>((counts, fact) => {
      const reason = fact.dropReason || 'unknown';
      counts[reason] = (counts[reason] || 0) + 1;
      return counts;
    }, {});

    structuredLog('warn', 'fact_coercion_drop', {
      component: ctx.component,
      fieldPath: ctx.fieldPath,
      specFolder: ctx.specFolder,
      sessionId: ctx.sessionId,
      droppedCount: dropped.length,
      dropReasonCounts,
    });
  }

  return coerced
    .map((fact) => fact.text)
    .filter((text) => text.length > 0);
}

export {
  coerceFactToText,
  coerceFactsToText,
};
