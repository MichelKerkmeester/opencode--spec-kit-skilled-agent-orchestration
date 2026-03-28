// TEST: Artifact-Class Routing Table (C136-09)
import { describe, expect, it } from 'vitest';
import {
  classifyArtifact,
  getStrategy,
  getStrategyForQuery,
  applyRoutingWeights,
  ROUTING_TABLE,
} from '../lib/search/artifact-routing';
import type { ArtifactClass, RetrievalStrategy, WeightedResult } from '../lib/search/artifact-routing';

/* ───────────────────────────────────────────────────────────────
   1. classifyArtifact — file path classification
----------------------------------------------------------------*/

describe('C136-09 classifyArtifact', () => {
  it('classifies spec.md files', () => {
    expect(classifyArtifact('/specs/007-auth/spec.md')).toBe('spec');
    expect(classifyArtifact('spec.md')).toBe('spec');
    expect(classifyArtifact('/deep/nested/path/spec.md')).toBe('spec');
  });

  it('classifies plan.md files', () => {
    expect(classifyArtifact('/specs/007-auth/plan.md')).toBe('plan');
    expect(classifyArtifact('plan.md')).toBe('plan');
  });

  it('classifies tasks.md files', () => {
    expect(classifyArtifact('/specs/007-auth/tasks.md')).toBe('tasks');
    expect(classifyArtifact('tasks.md')).toBe('tasks');
  });

  it('classifies checklist.md files', () => {
    expect(classifyArtifact('/specs/007-auth/checklist.md')).toBe('checklist');
    expect(classifyArtifact('checklist.md')).toBe('checklist');
  });

  it('classifies decision-record.md files', () => {
    expect(classifyArtifact('/specs/007-auth/decision-record.md')).toBe('decision-record');
  });

  it('classifies implementation-summary.md files', () => {
    expect(classifyArtifact('/specs/007-auth/implementation-summary.md')).toBe('implementation-summary');
  });

  it('classifies memory files in memory/ subdirectory', () => {
    expect(classifyArtifact('/specs/007-auth/memory/18-02-26_08-44__session.md')).toBe('memory');
    expect(classifyArtifact('/specs/007/memory/context.md')).toBe('memory');
  });

  it('classifies research.md files', () => {
    expect(classifyArtifact('/specs/007-auth/research/research.md')).toBe('research');
    expect(classifyArtifact('/specs/007-auth/research.md')).toBe('research');
  });

  it('returns unknown for unrecognized paths', () => {
    expect(classifyArtifact('/src/index.ts')).toBe('unknown');
    expect(classifyArtifact('/README.md')).toBe('unknown');
    expect(classifyArtifact('/package.json')).toBe('unknown');
  });

  it('returns unknown for empty/invalid inputs', () => {
    expect(classifyArtifact('')).toBe('unknown');
    expect(classifyArtifact('   ')).toBe('unknown');
    expect(classifyArtifact(null as unknown as string)).toBe('unknown');
    expect(classifyArtifact(undefined as unknown as string)).toBe('unknown');
    expect(classifyArtifact(42 as unknown as string)).toBe('unknown');
  });

  it('specific patterns take precedence (decision-record before plan)', () => {
    // Decision-record.md should NOT match plan.md pattern
    expect(classifyArtifact('decision-record.md')).toBe('decision-record');
    // Implementation-summary.md should NOT match unknown
    expect(classifyArtifact('implementation-summary.md')).toBe('implementation-summary');
  });
});

/* ───────────────────────────────────────────────────────────────
   2. getStrategy — strategy lookup
----------------------------------------------------------------*/

describe('C136-09 getStrategy', () => {
  it('returns correct strategy for each known artifact class', () => {
    const classes: ArtifactClass[] = [
      'spec', 'plan', 'tasks', 'checklist',
      'decision-record', 'implementation-summary', 'memory', 'research',
    ];

    for (const cls of classes) {
      const strategy = getStrategy(cls);
      expect(strategy.artifactClass).toBe(cls);
      expect(strategy.semanticWeight).toBeGreaterThanOrEqual(0);
      expect(strategy.semanticWeight).toBeLessThanOrEqual(1);
      expect(strategy.keywordWeight).toBeGreaterThanOrEqual(0);
      expect(strategy.keywordWeight).toBeLessThanOrEqual(1);
      expect(strategy.recencyBias).toBeGreaterThanOrEqual(0);
      expect(strategy.recencyBias).toBeLessThanOrEqual(1);
      expect(strategy.maxResults).toBeGreaterThan(0);
      expect(strategy.boostFactor).toBeGreaterThanOrEqual(0);
      expect(strategy.boostFactor).toBeLessThanOrEqual(2);
    }
  });

  it('returns unknown strategy for unknown class', () => {
    const strategy = getStrategy('unknown');
    expect(strategy.artifactClass).toBe('unknown');
    expect(strategy.semanticWeight).toBe(0.5);
    expect(strategy.keywordWeight).toBe(0.5);
  });

  it('verifies spec strategy values match specification', () => {
    const s = getStrategy('spec');
    expect(s.semanticWeight).toBe(0.7);
    expect(s.keywordWeight).toBe(0.3);
    expect(s.recencyBias).toBe(0.2);
    expect(s.maxResults).toBe(5);
    expect(s.boostFactor).toBe(1.0);
  });

  it('verifies memory strategy has highest semantic weight and recency bias', () => {
    const m = getStrategy('memory');
    expect(m.semanticWeight).toBe(0.8);
    expect(m.recencyBias).toBe(0.6);
    expect(m.boostFactor).toBe(1.1);
  });

  it('verifies checklist strategy favors keyword search', () => {
    const c = getStrategy('checklist');
    expect(c.keywordWeight).toBeGreaterThan(c.semanticWeight);
    expect(c.keywordWeight).toBe(0.7);
  });
});

/* ───────────────────────────────────────────────────────────────
   3. getStrategyForQuery — query-based detection
----------------------------------------------------------------*/

describe('C136-09 getStrategyForQuery', () => {
  it('detects checklist-related queries', () => {
    const result = getStrategyForQuery('show me the checklist items');
    expect(result.detectedClass).toBe('checklist');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('detects task-related queries', () => {
    const result = getStrategyForQuery('what are the remaining tasks');
    expect(result.detectedClass).toBe('tasks');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('detects decision-record queries', () => {
    const result = getStrategyForQuery('why did we choose this approach? show the decision rationale');
    expect(result.detectedClass).toBe('decision-record');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('detects memory/context queries', () => {
    const result = getStrategyForQuery('what did we work on in the previous session');
    expect(result.detectedClass).toBe('memory');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('detects spec queries', () => {
    const result = getStrategyForQuery('show me the specification and requirements');
    expect(result.detectedClass).toBe('spec');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('detects plan queries', () => {
    const result = getStrategyForQuery('what is the current plan and approach');
    expect(result.detectedClass).toBe('plan');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('returns unknown for ambiguous queries', () => {
    const result = getStrategyForQuery('hello world');
    expect(result.detectedClass).toBe('unknown');
    expect(result.confidence).toBe(0);
  });

  it('handles empty/invalid query input', () => {
    expect(getStrategyForQuery('').detectedClass).toBe('unknown');
    expect(getStrategyForQuery(null as unknown as string).detectedClass).toBe('unknown');
    expect(getStrategyForQuery(undefined as unknown as string).detectedClass).toBe('unknown');
  });

  it('uses specFolder as fallback when query gives no signal', () => {
    const result = getStrategyForQuery('hello world', '/specs/007/plan.md');
    expect(result.detectedClass).toBe('plan');
    expect(result.confidence).toBe(0.3); // Low confidence from folder hint
  });

  it('returns strategy matching detected class', () => {
    const result = getStrategyForQuery('find the checklist verification items');
    expect(result.strategy).toEqual(ROUTING_TABLE[result.detectedClass]);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. applyRoutingWeights — score modification
----------------------------------------------------------------*/

describe('C136-09 applyRoutingWeights', () => {
  const sampleResults: WeightedResult[] = [
    { id: 1, score: 0.8 },
    { id: 2, score: 0.6 },
    { id: 3, score: 0.4 },
  ];

  it('applies boost factor to scores', () => {
    const strategy = getStrategy('memory'); // boostFactor = 1.1
    const weighted = applyRoutingWeights(sampleResults, strategy);

    expect(weighted[0].score).toBeCloseTo(0.8 * 1.1, 5);
    expect(weighted[1].score).toBeCloseTo(0.6 * 1.1, 5);
    expect(weighted[2].score).toBeCloseTo(0.4 * 1.1, 5);
  });

  it('sets artifactBoostApplied on each result', () => {
    const strategy = getStrategy('tasks'); // boostFactor = 0.9
    const weighted = applyRoutingWeights(sampleResults, strategy);

    for (const r of weighted) {
      expect(r.artifactBoostApplied).toBe(0.9);
    }
  });

  it('handles results with similarity instead of score', () => {
    const results: WeightedResult[] = [
      { id: 1, similarity: 85 }, // 85/100 = 0.85
    ];
    const strategy = getStrategy('spec'); // boostFactor = 1.0
    const weighted = applyRoutingWeights(results, strategy);

    expect(weighted[0].score).toBeCloseTo(0.85, 5);
  });

  it('handles empty results array', () => {
    const strategy = getStrategy('spec');
    const weighted = applyRoutingWeights([], strategy);
    expect(weighted).toEqual([]);
  });

  it('handles null/undefined results gracefully', () => {
    const strategy = getStrategy('spec');
    expect(applyRoutingWeights(null as unknown as WeightedResult[], strategy)).toBe(null);
    expect(applyRoutingWeights(undefined as unknown as WeightedResult[], strategy)).toBe(undefined);
  });

  it('produces deterministic output — same inputs yield same outputs', () => {
    const strategy = getStrategy('plan');
    const run1 = applyRoutingWeights([...sampleResults], strategy);
    const run2 = applyRoutingWeights([...sampleResults], strategy);

    expect(run1).toEqual(run2);
  });

  it('clamps boost factor to 0-2 range', () => {
    // Construct a malformed strategy with out-of-range boost
    const badStrategy: RetrievalStrategy = {
      artifactClass: 'unknown',
      semanticWeight: 0.5,
      keywordWeight: 0.5,
      recencyBias: 0.3,
      maxResults: 10,
      boostFactor: 5.0, // way above 2
    };
    const weighted = applyRoutingWeights(
      [{ id: 1, score: 0.5 }],
      badStrategy,
    );
    // Should be clamped to 2.0
    expect(weighted[0].score).toBeCloseTo(0.5 * 2.0, 5);
    expect(weighted[0].artifactBoostApplied).toBe(2.0);
  });
});

/* ───────────────────────────────────────────────────────────────
   5. ROUTING_TABLE completeness
----------------------------------------------------------------*/

describe('C136-09 ROUTING_TABLE completeness', () => {
  it('has entries for all 9 artifact classes', () => {
    const expectedClasses: ArtifactClass[] = [
      'spec', 'plan', 'tasks', 'checklist',
      'decision-record', 'implementation-summary',
      'memory', 'research', 'unknown',
    ];
    for (const cls of expectedClasses) {
      expect(ROUTING_TABLE[cls]).toBeDefined();
      expect(ROUTING_TABLE[cls].artifactClass).toBe(cls);
    }
  });

  it('all strategies have weights summing close to 1 (semantic + keyword)', () => {
    for (const [cls, strategy] of Object.entries(ROUTING_TABLE)) {
      const sum = strategy.semanticWeight + strategy.keywordWeight;
      expect(sum).toBeCloseTo(1.0, 5);
    }
  });
});
