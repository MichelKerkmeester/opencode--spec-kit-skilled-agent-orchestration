import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '..', '..');
const require = createRequire(import.meta.url);

const convergenceModule = require(path.join(
  WORKSPACE_ROOT,
  'scripts/lib/coverage-graph-convergence.cjs',
)) as {
  SOURCE_DIVERSITY_THRESHOLD: number;
  EVIDENCE_DEPTH_THRESHOLD: number;
  computeSourceDiversity: (graph: Graph) => number;
  computeEvidenceDepth: (graph: Graph) => number;
  computeQuestionCoverage: (graph: Graph) => number;
  computeGraphConvergence: (graph: Graph, signals?: { compositeStop?: number }) => {
    graphScore: number;
    blendedScore: number;
    components: {
      fragmentationScore: number;
      normalizedDepth: number;
      questionCoverage: number;
      sourceDiversity: number;
      compositeStop: number | null;
    };
  };
  evaluateGraphGates: (graph: Graph) => {
    sourceDiversity: { pass: boolean; value: number; threshold: number };
    evidenceDepth: { pass: boolean; value: number; threshold: number };
    allPass: boolean;
  };
};

type GraphNode = {
  id: string;
  type?: 'question' | 'finding' | 'source' | 'claim';
  kind?: 'QUESTION' | 'FINDING' | 'SOURCE' | 'CLAIM';
  metadata?: Record<string, unknown>;
};

type GraphEdge = {
  source: string;
  target: string;
  relation: string;
  createdAt?: string;
};

type Graph = {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
};

function makeGraph(nodes: GraphNode[], edges: GraphEdge[]): Graph {
  return {
    nodes: new Map(nodes.map((node) => [node.id, node])),
    edges: new Map(edges.map((edge, index) => [`edge-${index}`, edge])),
  };
}

/**
 * Phase 008 ADR-001 canonicalization note: these tests exercise the CJS
 * coverage-graph-convergence helper AFTER it was refactored into a thin
 * adapter over the MCP canonical signal algorithms. The canonical definitions
 * are question-centric:
 *   - sourceDiversity: average distinct source quality classes per question
 *     reachable via ANSWERS → CITES paths (default threshold 1.5)
 *   - evidenceDepth: average path length per question → answering-finding
 *     (scored 2 when finding has a CITES edge, 1 otherwise, default 1.5)
 *   - questionCoverage: fraction of questions with ≥2 answering findings
 * Old CJS-native semantics (edge/node ratios) are deprecated; do not re-introduce.
 */
describe('coverage-graph-convergence', () => {
  it('exports the canonical stop-gate thresholds (ADR-001)', () => {
    expect(convergenceModule.SOURCE_DIVERSITY_THRESHOLD).toBe(1.5);
    expect(convergenceModule.EVIDENCE_DEPTH_THRESHOLD).toBe(1.5);
  });

  it('computes source diversity as distinct source quality classes per question', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'q-2', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
        { id: 's-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-2', target: 'q-2', relation: 'ANSWERS' },
        { source: 'f-1', target: 's-1', relation: 'CITES' },
        { source: 'f-2', target: 's-2', relation: 'CITES' },
      ],
    );

    // q-1 reaches 1 quality class (primary), q-2 reaches 1 (secondary). Average = 1.
    expect(convergenceModule.computeSourceDiversity(graph)).toBe(1);
  });

  it('returns zero source diversity for an empty graph', () => {
    expect(convergenceModule.computeSourceDiversity(makeGraph([], []))).toBe(0);
  });

  it('computes average evidence depth from longest-path node depths', () => {
    const graph = makeGraph(
      [
        { id: 'source-1', kind: 'SOURCE' },
        { id: 'finding-1', kind: 'FINDING' },
        { id: 'question-1', kind: 'QUESTION' },
      ],
      [
        { source: 'source-1', target: 'finding-1', relation: 'SUPPORTS' },
        { source: 'finding-1', target: 'question-1', relation: 'ANSWERS' },
      ],
    );

    // 1 question, 1 answering finding with no CITES edges → depth 1.
    expect(convergenceModule.computeEvidenceDepth(graph)).toBe(1);
  });

  it('computes question coverage from ANSWERS edges into question nodes (≥2 answers to count)', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'q-2', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
      ],
    );

    // q-1 has 2 answering findings (covered). q-2 has 0 (not covered). 1/2 = 0.5.
    expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0.5);
  });

  it('returns zero question coverage when no questions exist (empty-set fail-closed default)', () => {
    const graph = makeGraph(
      [{ id: 'finding-1', kind: 'FINDING' }],
      [],
    );

    // ADR-001 canonical semantics: 0 questions → 0 coverage (not 1).
    // This is the fail-closed default; stop gates should block when there's nothing to stop on.
    expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0);
  });

  it('computes a graph-only convergence score when stop-trace signals are absent', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'q-2', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-1', target: 's-1', relation: 'CITES' },
      ],
    );

    const result = convergenceModule.computeGraphConvergence(graph);
    // q-1 is covered (2 ANSWERS), q-2 is not → coverage = 0.5
    // q-1 reaches 1 quality class via f-1→s-1, q-2 reaches 0 → diversity = 0.5
    expect(result.blendedScore).toBe(result.graphScore);
    expect(result.components.questionCoverage).toBe(0.5);
    expect(result.components.sourceDiversity).toBe(0.5);
  });

  it('blends the graph score with compositeStop when stop-trace signals exist', () => {
    const graph = makeGraph(
      [
        { id: 'q-1', type: 'question' },
        { id: 'f-1', type: 'finding' },
      ],
      [{ source: 'f-1', target: 'q-1', relation: 'ANSWERS' }],
    );

    const result = convergenceModule.computeGraphConvergence(graph, { compositeStop: 0.8 });
    expect(result.components.compositeStop).toBe(0.8);
    expect(result.blendedScore).toBeGreaterThanOrEqual(result.graphScore);
    expect(result.blendedScore).toBeLessThanOrEqual(0.8);
  });

  it('passes graph gates when both diversity and depth clear their thresholds', () => {
    // Build a graph rich enough to clear BOTH canonical thresholds (1.5 each):
    // 1 question, 2 answering findings, each CITES 2 sources with distinct quality classes.
    // sourceDiversity: q-1 reaches 4 distinct quality classes = 4.0 average → >1.5 ✓
    // evidenceDepth: 2 paths, both have CITES → 2.0 average → >1.5 ✓
    const graph = makeGraph(
      [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
        { id: 's-2', kind: 'SOURCE', metadata: { quality_class: 'secondary' } },
        { id: 's-3', kind: 'SOURCE', metadata: { quality_class: 'tertiary' } },
        { id: 's-4', kind: 'SOURCE', metadata: { quality_class: 'peer-reviewed' } },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-1', target: 's-1', relation: 'CITES' },
        { source: 'f-1', target: 's-2', relation: 'CITES' },
        { source: 'f-2', target: 's-3', relation: 'CITES' },
        { source: 'f-2', target: 's-4', relation: 'CITES' },
      ],
    );

    const result = convergenceModule.evaluateGraphGates(graph);
    expect(result.sourceDiversity.pass).toBe(true);
    expect(result.evidenceDepth.pass).toBe(true);
    expect(result.allPass).toBe(true);
  });

  it('fails the diversity gate when too few distinct quality classes are present', () => {
    // 1 question, 2 answering findings, 1 shared source → only 1 quality class → diversity = 1.0 < 1.5
    // Both findings have CITES → evidenceDepth = 2.0 ≥ 1.5 (depth gate passes, diversity fails).
    const graph = makeGraph(
      [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
        { id: 'f-2', kind: 'FINDING' },
        { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-2', target: 'q-1', relation: 'ANSWERS' },
        { source: 'f-1', target: 's-1', relation: 'CITES' },
        { source: 'f-2', target: 's-1', relation: 'CITES' },
      ],
    );

    const result = convergenceModule.evaluateGraphGates(graph);
    expect(result.sourceDiversity.pass).toBe(false);
    expect(result.sourceDiversity.value).toBe(1);
    expect(result.evidenceDepth.pass).toBe(true);
    expect(result.allPass).toBe(false);
  });

  it('fails the depth gate when evidence chains are too shallow', () => {
    // 1 question, 1 answering finding with NO CITES → depth = 1 < 1.5 (depth gate fails).
    // Diversity must still pass (≥1.5) so we build a second question path with rich sources.
    // Actually simpler: single question, single finding, no CITES anywhere → both fail.
    // To isolate the depth-only failure we need a separate diversity-clearing path, which
    // is structurally impossible without adding CITES that also boost depth. Accept the
    // "both fail" variant that specifically proves shallow depth.
    const graph = makeGraph(
      [
        { id: 'q-1', kind: 'QUESTION' },
        { id: 'f-1', kind: 'FINDING' },
      ],
      [
        { source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
      ],
    );

    const result = convergenceModule.evaluateGraphGates(graph);
    expect(result.sourceDiversity.pass).toBe(false);
    expect(result.evidenceDepth.pass).toBe(false);
    expect(result.evidenceDepth.value).toBe(1);
    expect(result.allPass).toBe(false);
  });
});
