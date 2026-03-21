// TEST: GRAPH CONCEPT ROUTING (D2 Phase A)
// REQ-D2-002: Noun-phrase extraction + alias-matched graph activation.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  extractNounPhrases,
  matchConceptAliases,
  routeGraphConcepts,
} from '../lib/search/entity-linker';

const FEATURE_FLAG = 'SPECKIT_GRAPH_CONCEPT_ROUTING';
const CONCEPT_ALIAS_TABLE = {
  graph_pruning: ['graph pruning', 'pruning'],
  score_normalization: ['score normalization', 'scoring normalization'],
  concept_routing: ['concept routing', 'routing'],
};

describe('D2 graph concept routing', () => {
  let originalFlag: string | undefined;

  beforeEach(() => {
    originalFlag = process.env[FEATURE_FLAG];
    process.env[FEATURE_FLAG] = 'true';
  });

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env[FEATURE_FLAG];
    } else {
      process.env[FEATURE_FLAG] = originalFlag;
    }
  });

  it('extracts noun phrases from the query', () => {
    const nounPhrases = extractNounPhrases(
      'Explain graph pruning and score normalization decisions',
    );

    expect(nounPhrases).toContain('graph pruning');
    expect(nounPhrases).toContain('score normalization');
  });

  it('matches aliases against the concept table', () => {
    const concepts = matchConceptAliases(
      ['graph pruning', 'unknown topic'],
      CONCEPT_ALIAS_TABLE,
    );

    expect(concepts).toEqual(['graph_pruning']);
  });

  it('activates the graph channel when concepts are found', () => {
    const routing = routeGraphConcepts(
      'Explain graph pruning decisions',
      CONCEPT_ALIAS_TABLE,
    );

    expect(routing.graphEnabled).toBe(true);
    expect(routing.graphNodes).toEqual(['graph_pruning']);
  });

  it('does not activate the graph channel when no concepts match', () => {
    const routing = routeGraphConcepts(
      'Explain release automation failures',
      CONCEPT_ALIAS_TABLE,
    );

    expect(routing.graphEnabled).toBe(false);
    expect(routing.graphNodes).toEqual([]);
  });

  it('activates all matched graph nodes for multi-concept queries', () => {
    const routing = routeGraphConcepts(
      'Compare graph pruning and score normalization',
      CONCEPT_ALIAS_TABLE,
    );

    expect(routing.graphEnabled).toBe(true);
    expect(routing.graphNodes).toEqual([
      'graph_pruning',
      'score_normalization',
    ]);
  });

  it('skips routing when SPECKIT_GRAPH_CONCEPT_ROUTING is false', () => {
    process.env[FEATURE_FLAG] = 'false';

    const routing = routeGraphConcepts(
      'Explain graph pruning decisions',
      CONCEPT_ALIAS_TABLE,
    );

    expect(routing.graphEnabled).toBe(false);
    expect(routing.graphNodes).toEqual([]);
    expect(routing.nounPhrases).toEqual([]);
  });
});
