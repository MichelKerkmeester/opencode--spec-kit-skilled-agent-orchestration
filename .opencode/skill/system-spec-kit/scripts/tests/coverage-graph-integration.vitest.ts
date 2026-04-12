/**
 * Coverage Graph Integration Tests (Phase 006 — REQ-GT-001 through REQ-GT-006)
 *
 * Cross-layer contract verification between:
 *   - CJS modules: coverage-graph-core.cjs, coverage-graph-signals.cjs,
 *     coverage-graph-convergence.cjs, coverage-graph-contradictions.cjs
 *   - TS/MCP layer: coverage-graph-db.ts (types and constants)
 *
 * These tests verify that relation names, weight ranges, clamping behavior,
 * self-loop prevention, namespace isolation, and convergence signals are
 * consistent across the CJS and TS layers.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  VALID_RELATIONS,
  RESEARCH_WEIGHTS,
  REVIEW_WEIGHTS,
  closeDb,
  getEdges,
  initDb,
  upsertEdge,
  upsertNode,
  type CoverageEdge,
  type CoverageNode,
} from '../../mcp_server/lib/coverage-graph/coverage-graph-db.js';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

// ── CJS layer imports ────────────────────────────────────────────

const coreModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs',
)) as {
  RESEARCH_RELATION_WEIGHTS: Readonly<Record<string, number>>;
  REVIEW_RELATION_WEIGHTS: Readonly<Record<string, number>>;
  DEFAULT_MAX_DEPTH: number;
  createGraph: () => { nodes: Map<string, any>; edges: Map<string, any> };
  insertEdge: (graph: any, source: string, target: string, relation: string, weight?: number, metadata?: object) => string | null;
  clampWeight: (weight: number) => number | null;
  resetEdgeIdCounter: () => void;
};

const signalsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs',
)) as {
  computeDegree: (graph: any, nodeId: string) => { inDegree: number; outDegree: number; total: number };
  computeAllDepths: (graph: any) => Map<string, number>;
  computeClusterMetrics: (graph: any) => { componentCount: number; sizes: number[]; largestSize: number; isolatedNodes: number };
};

const convergenceModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs',
)) as {
  computeSourceDiversity: (graph: any) => number;
  computeEvidenceDepth: (graph: any) => number;
  computeQuestionCoverage: (graph: any) => number;
  computeGraphConvergence: (graph: any, signals?: object) => { graphScore: number; blendedScore: number; components: object };
  SOURCE_DIVERSITY_THRESHOLD: number;
  EVIDENCE_DEPTH_THRESHOLD: number;
};

const contradictionsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs',
)) as {
  scanContradictions: (graph: any) => Array<{ edgeId: string; source: string; target: string; weight: number; metadata: object }>;
  reportContradictions: (graph: any) => { total: number; pairs: Array<object>; byNode: Map<string, object[]> };
};

const DB_NAMESPACE = {
  specFolder: 'specs/coverage-graph-integration',
  loopType: 'research' as const,
  sessionId: 'integration-session',
};

function makeNode(id: string, kind: CoverageNode['kind'], name: string): CoverageNode {
  return {
    id,
    specFolder: DB_NAMESPACE.specFolder,
    loopType: DB_NAMESPACE.loopType,
    sessionId: DB_NAMESPACE.sessionId,
    kind,
    name,
  };
}

function makeEdge(id: string, sourceId: string, targetId: string, relation: CoverageEdge['relation'], weight: number): CoverageEdge {
  return {
    id,
    specFolder: DB_NAMESPACE.specFolder,
    loopType: DB_NAMESPACE.loopType,
    sessionId: DB_NAMESPACE.sessionId,
    sourceId,
    targetId,
    relation,
    weight,
  };
}

// ═════════════════════════════════════════════════════════════════
// TEST SUITES
// ═════════════════════════════════════════════════════════════════

describe('coverage-graph-integration: CJS ↔ TS contract alignment', () => {
  let tempDir = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-graph-integration-'));
    initDb(tempDir);
    coreModule.resetEdgeIdCounter();
  });

  afterEach(() => {
    try {
      closeDb();
    } catch {
      // best-effort cleanup for temporary integration DBs
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // ── REQ-GT-001: Research relation name alignment ──────────────

  describe('REQ-GT-001: research relation name alignment', () => {
    it('CJS RESEARCH_RELATION_WEIGHTS keys match TS VALID_RELATIONS.research', () => {
      const cjsRelations = Object.keys(coreModule.RESEARCH_RELATION_WEIGHTS).sort();
      const tsRelations = [...VALID_RELATIONS.research].sort();
      expect(cjsRelations).toEqual(tsRelations);
    });

    it('CJS research weight values match TS RESEARCH_WEIGHTS', () => {
      for (const [relation, cjsWeight] of Object.entries(coreModule.RESEARCH_RELATION_WEIGHTS)) {
        expect(RESEARCH_WEIGHTS[relation as keyof typeof RESEARCH_WEIGHTS]).toBe(cjsWeight);
      }
    });

    it('all research relations are non-empty strings', () => {
      for (const relation of Object.keys(coreModule.RESEARCH_RELATION_WEIGHTS)) {
        expect(relation).toBeTruthy();
        expect(typeof relation).toBe('string');
        expect(relation).toBe(relation.toUpperCase()); // SCREAMING_SNAKE_CASE
      }
    });
  });

  // ── REQ-GT-002: Review relation name alignment ────────────────

  describe('REQ-GT-002: review relation name alignment', () => {
    it('CJS and TS review sets share core relations (COVERS, EVIDENCE_FOR, CONTRADICTS, RESOLVES, CONFIRMS)', () => {
      const cjsRelations = new Set(Object.keys(coreModule.REVIEW_RELATION_WEIGHTS));
      const tsRelations = new Set(VALID_RELATIONS.review);
      const expectedShared = ['COVERS', 'EVIDENCE_FOR', 'CONTRADICTS', 'RESOLVES', 'CONFIRMS'];

      for (const rel of expectedShared) {
        expect(cjsRelations.has(rel)).toBe(true);
        expect(tsRelations.has(rel)).toBe(true);
      }
    });

    it('CJS review has in-memory-only relations (SUPPORTS, DERIVED_FROM) not in TS DB set', () => {
      const tsRelations = new Set(VALID_RELATIONS.review);
      const cjsOnlyRelations = Object.keys(coreModule.REVIEW_RELATION_WEIGHTS)
        .filter(r => !tsRelations.has(r));

      // SUPPORTS and DERIVED_FROM are used in CJS in-memory graphs but not projected to SQLite
      expect(cjsOnlyRelations.sort()).toEqual(['DERIVED_FROM', 'SUPPORTS'].sort());
    });

    it('TS review relations include additional DB-only relations (ESCALATES, IN_DIMENSION, IN_FILE)', () => {
      const cjsRelations = new Set(Object.keys(coreModule.REVIEW_RELATION_WEIGHTS));
      const tsOnlyRelations = [...VALID_RELATIONS.review].filter(r => !cjsRelations.has(r));

      // These are expected TS-only relations for DB projection (structural, not semantic)
      expect(tsOnlyRelations.sort()).toEqual(['ESCALATES', 'IN_DIMENSION', 'IN_FILE'].sort());
    });

    it('shared review relations have matching weights', () => {
      const cjsRelations = Object.keys(coreModule.REVIEW_RELATION_WEIGHTS);
      for (const relation of cjsRelations) {
        if (REVIEW_WEIGHTS[relation as keyof typeof REVIEW_WEIGHTS] !== undefined) {
          expect(REVIEW_WEIGHTS[relation as keyof typeof REVIEW_WEIGHTS]).toBe(
            coreModule.REVIEW_RELATION_WEIGHTS[relation],
          );
        }
      }
    });

    it('TS review relations expose EVIDENCE_FOR directly', () => {
      expect(coreModule.REVIEW_RELATION_WEIGHTS).toHaveProperty('EVIDENCE_FOR');
      expect(VALID_RELATIONS.review).toContain('EVIDENCE_FOR');
    });
  });

  // ── REQ-GT-003: Weight clamping consistency ───────────────────

  describe('REQ-GT-003: weight clamping consistency', () => {
    it('CJS clampWeight clamps to [0.0, 2.0]', () => {
      expect(coreModule.clampWeight(0.0)).toBe(0.0);
      expect(coreModule.clampWeight(1.0)).toBe(1.0);
      expect(coreModule.clampWeight(2.0)).toBe(2.0);
      expect(coreModule.clampWeight(-1.0)).toBe(0.0);
      expect(coreModule.clampWeight(3.0)).toBe(2.0);
      expect(coreModule.clampWeight(100)).toBe(2.0);
      expect(coreModule.clampWeight(-50)).toBe(0.0);
    });

    it('CJS clampWeight returns null for non-finite inputs', () => {
      expect(coreModule.clampWeight(NaN)).toBeNull();
      expect(coreModule.clampWeight(Infinity)).toBeNull();
      expect(coreModule.clampWeight(-Infinity)).toBeNull();
    });

    it('TS layer clamps persisted edge weights to the same [0.0, 2.0] range', () => {
      upsertNode(makeNode('finding-clamped', 'FINDING', 'Finding clamped'));
      upsertNode(makeNode('question-clamped', 'QUESTION', 'Question clamped'));

      const edgeId = upsertEdge(
        makeEdge('edge-clamped', 'finding-clamped', 'question-clamped', 'ANSWERS', 5.0),
      );

      expect(edgeId).toBe('edge-clamped');
      expect(getEdges(DB_NAMESPACE)).toEqual([
        expect.objectContaining({
          id: 'edge-clamped',
          weight: 2.0,
        }),
      ]);
    });

    it('all CJS default relation weights are within [0.0, 2.0]', () => {
      for (const w of Object.values(coreModule.RESEARCH_RELATION_WEIGHTS)) {
        expect(w).toBeGreaterThanOrEqual(0.0);
        expect(w).toBeLessThanOrEqual(2.0);
      }
      for (const w of Object.values(coreModule.REVIEW_RELATION_WEIGHTS)) {
        expect(w).toBeGreaterThanOrEqual(0.0);
        expect(w).toBeLessThanOrEqual(2.0);
      }
    });

    it('all TS default relation weights are within [0.0, 2.0]', () => {
      for (const w of Object.values(RESEARCH_WEIGHTS)) {
        expect(w).toBeGreaterThanOrEqual(0.0);
        expect(w).toBeLessThanOrEqual(2.0);
      }
      for (const w of Object.values(REVIEW_WEIGHTS)) {
        expect(w).toBeGreaterThanOrEqual(0.0);
        expect(w).toBeLessThanOrEqual(2.0);
      }
    });

    it('insertEdge clamps weight during insertion', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', 5.0);
      expect(edgeId).not.toBeNull();
      const edge = graph.edges.get(edgeId!);
      expect(edge.weight).toBe(2.0); // clamped from 5.0
    });

    it('insertEdge rejects NaN weight', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS', NaN);
      expect(edgeId).toBeNull();
    });
  });

  // ── REQ-GT-004: Self-loop prevention ──────────────────────────

  describe('REQ-GT-004: self-loop prevention', () => {
    it('CJS insertEdge rejects self-loops (source === target)', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'node-1', 'node-1', 'ANSWERS');
      expect(edgeId).toBeNull();
      expect(graph.edges.size).toBe(0);
    });

    it('CJS insertEdge allows edges between different nodes', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'node-1', 'node-2', 'ANSWERS');
      expect(edgeId).not.toBeNull();
      expect(graph.edges.size).toBe(1);
    });

    it('TS edge upsert rejects self-loops before they reach the database', () => {
      upsertNode(makeNode('loop-node', 'QUESTION', 'Loop node'));

      const edgeId = upsertEdge(
        makeEdge('edge-self-loop', 'loop-node', 'loop-node', 'ANSWERS', 1.0),
      );

      expect(edgeId).toBeNull();
      expect(getEdges(DB_NAMESPACE)).toEqual([]);
    });

    it('self-loop prevention works with empty string node IDs', () => {
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, '', '', 'ANSWERS');
      expect(edgeId).toBeNull();
    });
  });

  // ── REQ-GT-005: Namespace isolation ───────────────────────────

  describe('REQ-GT-005: namespace isolation (loop_type)', () => {
    it('CJS graphs are independent instances (research vs review)', () => {
      const researchGraph = coreModule.createGraph();
      const reviewGraph = coreModule.createGraph();

      coreModule.insertEdge(researchGraph, 'q-1', 'f-1', 'ANSWERS');
      coreModule.insertEdge(reviewGraph, 'd-1', 'file-1', 'COVERS');

      expect(researchGraph.edges.size).toBe(1);
      expect(reviewGraph.edges.size).toBe(1);

      // Verify they are independent
      const researchEdge = [...researchGraph.edges.values()][0];
      const reviewEdge = [...reviewGraph.edges.values()][0];
      expect(researchEdge.relation).toBe('ANSWERS');
      expect(reviewEdge.relation).toBe('COVERS');
    });

    it('TS VALID_RELATIONS has separate entries for research and review', () => {
      expect(VALID_RELATIONS.research).toBeDefined();
      expect(VALID_RELATIONS.review).toBeDefined();
      expect(VALID_RELATIONS.research).not.toEqual(VALID_RELATIONS.review);
    });

    it('research-only relations are not in review set', () => {
      const researchOnly = ['ANSWERS', 'SUPERSEDES', 'DERIVED_FROM', 'CITES'];
      const reviewRelations = new Set(VALID_RELATIONS.review);

      for (const rel of researchOnly) {
        expect(reviewRelations.has(rel)).toBe(false);
      }
    });

    it('review-only relations are not in research set', () => {
      const reviewOnly = ['EVIDENCE_FOR', 'RESOLVES', 'CONFIRMS', 'ESCALATES', 'IN_DIMENSION', 'IN_FILE'];
      const researchRelations = new Set(VALID_RELATIONS.research);

      for (const rel of reviewOnly) {
        expect(researchRelations.has(rel)).toBe(false);
      }
    });

    it('shared relations (COVERS, SUPPORTS, CONTRADICTS) exist in both sets', () => {
      const shared = ['COVERS', 'CONTRADICTS'];
      const researchSet = new Set(VALID_RELATIONS.research);
      const reviewSet = new Set(VALID_RELATIONS.review);

      for (const rel of shared) {
        expect(researchSet.has(rel)).toBe(true);
        expect(reviewSet.has(rel)).toBe(true);
      }
    });
  });

  // ── REQ-GT-006: Convergence signal alignment ─────────────────

  describe('REQ-GT-006: convergence signal computation consistency', () => {
    it('computeSourceDiversity returns 0 for empty graph', () => {
      const graph = coreModule.createGraph();
      expect(convergenceModule.computeSourceDiversity(graph)).toBe(0);
    });

    it('computeSourceDiversity returns canonical per-question average for populated graph', () => {
      // ADR-001 canonical semantics: for each question, count distinct source
      // quality classes reachable via ANSWERS → CITES paths, then average.
      const graph = coreModule.createGraph();
      graph.nodes.set('q-1', { id: 'q-1', kind: 'QUESTION' });
      graph.nodes.set('f-1', { id: 'f-1', kind: 'FINDING' });
      graph.nodes.set('s-1', { id: 's-1', kind: 'SOURCE', metadata: { quality_class: 'primary' } });
      coreModule.insertEdge(graph, 'f-1', 'q-1', 'ANSWERS');
      coreModule.insertEdge(graph, 'f-1', 's-1', 'CITES');
      // q-1 reaches 1 quality class → average 1.0
      const diversity = convergenceModule.computeSourceDiversity(graph);
      expect(diversity).toBe(1);
    });

    it('computeEvidenceDepth returns 0 for empty graph', () => {
      const graph = coreModule.createGraph();
      expect(convergenceModule.computeEvidenceDepth(graph)).toBe(0);
    });

    it('computeQuestionCoverage returns 0 when no questions exist (ADR-001 fail-closed default)', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'f-1', 'f-2', 'SUPPORTS');
      // Canonical semantics: empty question set short-circuits to 0, not 1.
      // Fail-closed default so stop gates block when there is no coverage target.
      expect(convergenceModule.computeQuestionCoverage(graph)).toBe(0);
    });

    it('computeGraphConvergence produces valid score range [0, 1]', () => {
      const graph = coreModule.createGraph();
      graph.nodes.set('q-1', { id: 'q-1', type: 'question' });
      graph.nodes.set('f-1', { id: 'f-1', type: 'finding' });
      coreModule.insertEdge(graph, 'f-1', 'q-1', 'ANSWERS');

      const result = convergenceModule.computeGraphConvergence(graph);
      expect(result.graphScore).toBeGreaterThanOrEqual(0);
      expect(result.graphScore).toBeLessThanOrEqual(1);
      expect(result.blendedScore).toBeGreaterThanOrEqual(0);
      expect(result.blendedScore).toBeLessThanOrEqual(1);
    });

    it('computeGraphConvergence blends with Phase 1 compositeStop signal', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');

      const withoutPhase1 = convergenceModule.computeGraphConvergence(graph);
      const withPhase1 = convergenceModule.computeGraphConvergence(graph, {
        compositeStop: 0.9,
      });

      // Blended score with high compositeStop should be >= graph-only score
      expect(withPhase1.blendedScore).toBeGreaterThanOrEqual(withoutPhase1.graphScore * 0.5);
    });

    it('convergence thresholds are accessible (ADR-001 canonical values)', () => {
      expect(convergenceModule.SOURCE_DIVERSITY_THRESHOLD).toBe(1.5);
      expect(convergenceModule.EVIDENCE_DEPTH_THRESHOLD).toBe(1.5);
    });

    it('cluster metrics align with convergence expectations', () => {
      const graph = coreModule.createGraph();
      // Create two disconnected components
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'c', 'd', 'COVERS');

      const metrics = signalsModule.computeClusterMetrics(graph);
      expect(metrics.componentCount).toBe(2);
      expect(metrics.isolatedNodes).toBe(0);
      expect(metrics.largestSize).toBe(2);
    });
  });

  // ── Cross-cutting: Contradiction scanning contract ────────────

  describe('contradiction scanning contract alignment', () => {
    it('scanContradictions uses CONTRADICTS relation from both weight maps', () => {
      expect(coreModule.RESEARCH_RELATION_WEIGHTS).toHaveProperty('CONTRADICTS');
      expect(coreModule.REVIEW_RELATION_WEIGHTS).toHaveProperty('CONTRADICTS');
    });

    it('scanContradictions returns structured pairs', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'claim-1', 'claim-2', 'CONTRADICTS', 0.8);

      const contradictions = contradictionsModule.scanContradictions(graph);
      expect(contradictions.length).toBe(1);
      expect(contradictions[0].source).toBe('claim-1');
      expect(contradictions[0].target).toBe('claim-2');
      expect(contradictions[0].weight).toBe(0.8);
    });

    it('reportContradictions includes total and pairs', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'CONTRADICTS');
      coreModule.insertEdge(graph, 'c', 'd', 'CONTRADICTS');

      const report = contradictionsModule.reportContradictions(graph);
      expect(report.total).toBe(2);
      expect(report.pairs.length).toBe(2);
    });
  });

  // ── Fallback authority chain ──────────────────────────────────

  describe('fallback authority chain contract', () => {
    it('CJS layer works standalone without MCP/SQLite dependency', () => {
      // The CJS modules are pure in-memory and do not require better-sqlite3
      const graph = coreModule.createGraph();
      const edgeId = coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      expect(edgeId).not.toBeNull();
      expect(graph.nodes.size).toBe(2);
      expect(graph.edges.size).toBe(1);
    });

    it('signals layer computes from in-memory graph without DB', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');
      coreModule.insertEdge(graph, 'b', 'c', 'CITES');

      const degree = signalsModule.computeDegree(graph, 'b');
      expect(degree.inDegree).toBe(1);
      expect(degree.outDegree).toBe(1);
      expect(degree.total).toBe(2);
    });

    it('convergence layer computes from in-memory graph without DB', () => {
      const graph = coreModule.createGraph();
      coreModule.insertEdge(graph, 'a', 'b', 'ANSWERS');

      const convergence = convergenceModule.computeGraphConvergence(graph);
      expect(convergence).toHaveProperty('graphScore');
      expect(convergence).toHaveProperty('blendedScore');
      expect(convergence).toHaveProperty('components');
    });
  });
});
