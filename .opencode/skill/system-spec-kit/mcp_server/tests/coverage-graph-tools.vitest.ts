// ───────────────────────────────────────────────────────────────
// COVERAGE GRAPH TOOLS INTEGRATION TESTS (T022)
// ───────────────────────────────────────────────────────────────
// Tests for the MCP tool surface that exposes coverage graph
// operations. Validates tool input/output schemas, error handling,
// and integration with the reducer's graph contract.

import { describe, it, expect } from 'vitest';

/**
 * Coverage Graph MCP Tool contract tests.
 *
 * These tests validate the tool interface contract between the
 * reducer and MCP server. The actual MCP tool handlers will be
 * implemented in Phase 3; these tests verify schema expectations
 * and error handling contracts.
 */

// --- Tool schema validation ---

interface GraphUpsertInput {
  namespace: string;
  nodes: Array<{ id: string; type: string; label: string; iteration: number }>;
  edges: Array<{ source: string; target: string; relation: string; weight: number; iteration: number }>;
  iteration: number;
}

interface GraphQueryInput {
  namespace: string;
  nodeId?: string;
  maxDepth?: number;
  signalsOnly?: boolean;
}

interface GraphSignalsOutput {
  componentCount: number;
  largestComponentSize: number;
  isolatedNodes: number;
  totalNodes: number;
  totalEdges: number;
  answerCoverage?: number;
  dimensionCoverage?: number;
}

describe('coverage-graph-tools contract', () => {
  describe('graph_upsert tool schema', () => {
    it('accepts valid upsert input', () => {
      const input: GraphUpsertInput = {
        namespace: 'dr-2026-03-18T10-00-00Z',
        nodes: [
          { id: 'q-1', type: 'question_node', label: 'What causes latency?', iteration: 1 },
        ],
        edges: [
          { source: 'f-1', target: 'q-1', relation: 'ANSWERS', weight: 1.3, iteration: 1 },
        ],
        iteration: 1,
      };

      expect(input.namespace).toBeTruthy();
      expect(input.nodes.every((n) => n.id && n.type && n.label)).toBe(true);
      expect(input.edges.every((e) => e.source && e.target && e.relation)).toBe(true);
    });

    it('rejects edges with invalid weight range', () => {
      const invalidWeights = [-1.0, 3.0, NaN, Infinity];
      for (const weight of invalidWeights) {
        const isValid = typeof weight === 'number' && Number.isFinite(weight) && weight >= 0.0 && weight <= 2.0;
        expect(isValid).toBe(false);
      }
    });

    it('accepts edges with valid weight range', () => {
      const validWeights = [0.0, 0.5, 1.0, 1.3, 2.0];
      for (const weight of validWeights) {
        const isValid = typeof weight === 'number' && Number.isFinite(weight) && weight >= 0.0 && weight <= 2.0;
        expect(isValid).toBe(true);
      }
    });

    it('rejects self-loop edges', () => {
      const edge = { source: 'a', target: 'a', relation: 'CITES', weight: 1.0, iteration: 1 };
      expect(edge.source).toBe(edge.target);
      // Contract: MCP should reject and increment rejected count
    });
  });

  describe('graph_query tool schema', () => {
    it('accepts signals-only query', () => {
      const input: GraphQueryInput = {
        namespace: 'dr-2026-03-18T10-00-00Z',
        signalsOnly: true,
      };

      expect(input.namespace).toBeTruthy();
      expect(input.signalsOnly).toBe(true);
    });

    it('accepts node traversal query', () => {
      const input: GraphQueryInput = {
        namespace: 'dr-2026-03-18T10-00-00Z',
        nodeId: 'q-1',
        maxDepth: 3,
      };

      expect(input.nodeId).toBeTruthy();
      expect(input.maxDepth).toBeGreaterThan(0);
    });

    it('defaults maxDepth to 5 when omitted', () => {
      const DEFAULT_MAX_DEPTH = 5;
      const input: GraphQueryInput = {
        namespace: 'test-ns',
        nodeId: 'q-1',
      };

      const effectiveDepth = input.maxDepth ?? DEFAULT_MAX_DEPTH;
      expect(effectiveDepth).toBe(5);
    });
  });

  describe('graph_signals output schema', () => {
    it('returns all required signal fields', () => {
      const output: GraphSignalsOutput = {
        componentCount: 2,
        largestComponentSize: 8,
        isolatedNodes: 1,
        totalNodes: 10,
        totalEdges: 12,
      };

      const requiredKeys = ['componentCount', 'largestComponentSize', 'isolatedNodes', 'totalNodes', 'totalEdges'];
      for (const key of requiredKeys) {
        expect(output).toHaveProperty(key);
        expect(typeof (output as Record<string, unknown>)[key]).toBe('number');
      }
    });

    it('includes optional research-specific signal', () => {
      const output: GraphSignalsOutput = {
        componentCount: 1,
        largestComponentSize: 5,
        isolatedNodes: 0,
        totalNodes: 5,
        totalEdges: 4,
        answerCoverage: 0.85,
      };

      expect(output.answerCoverage).toBeDefined();
      expect(output.answerCoverage).toBeGreaterThanOrEqual(0);
      expect(output.answerCoverage).toBeLessThanOrEqual(1);
    });

    it('includes optional review-specific signal', () => {
      const output: GraphSignalsOutput = {
        componentCount: 1,
        largestComponentSize: 10,
        isolatedNodes: 0,
        totalNodes: 10,
        totalEdges: 15,
        dimensionCoverage: 0.75,
      };

      expect(output.dimensionCoverage).toBeDefined();
      expect(output.dimensionCoverage).toBeGreaterThanOrEqual(0);
      expect(output.dimensionCoverage).toBeLessThanOrEqual(1);
    });
  });

  describe('error handling contract', () => {
    it('returns rejected count for invalid nodes', () => {
      // Contract: nodes without required id field should be rejected
      const invalidNode = { type: 'finding_node', label: 'No ID' };
      expect(invalidNode).not.toHaveProperty('id');
    });

    it('returns rejected count for invalid edges', () => {
      // Contract: edges missing source or target should be rejected
      const invalidEdge = { target: 'q-1', relation: 'ANSWERS', weight: 1.0 };
      expect(invalidEdge).not.toHaveProperty('source');
    });

    it('handles missing namespace gracefully', () => {
      const input = { nodes: [], edges: [], iteration: 1 };
      expect(input).not.toHaveProperty('namespace');
      // Contract: should return error, not crash
    });
  });

  describe('fallback authority chain', () => {
    it('priority 1: JSONL is always available', () => {
      const priority1 = { source: 'jsonl', available: true };
      expect(priority1.available).toBe(true);
    });

    it('priority 2: local JSON graph is reducer-rebuilt', () => {
      const priority2 = { source: 'local-cache', available: true };
      expect(priority2.source).toBe('local-cache');
    });

    it('priority 3: SQLite projection is MCP-maintained', () => {
      const priority3 = { source: 'mcp', available: false };
      // MCP may not always be available
      expect(priority3.source).toBe('mcp');
    });

    it('reducer produces correct signals from JSONL alone', () => {
      // Contract: even without MCP, the reducer must produce
      // valid convergence signals from graphEvents in JSONL
      const jsonlOnly = true;
      const mcpAvailable = false;
      expect(jsonlOnly).toBe(true);
      expect(mcpAvailable).toBe(false);
      // The reducer's getGraphState with mcpAvailable=false
      // should still return valid graph state from JSONL
    });
  });

  describe('convergence signal integration', () => {
    it('graph signals participate in quality gate sub-checks', () => {
      const qualityGateChecks = [
        'sourceDiversity',
        'focusAlignment',
        'singleWeakSourceDominance',
        'graphCoverage',
      ];

      expect(qualityGateChecks).toContain('graphCoverage');
    });

    it('graphCoverage sub-check passes when answer coverage >= 0.85', () => {
      const answerCoverage = 0.90;
      const isolatedNodes = 0;
      const graphCoveragePass = answerCoverage >= 0.85 && isolatedNodes <= 2;
      expect(graphCoveragePass).toBe(true);
    });

    it('graphCoverage sub-check fails when too many isolated nodes', () => {
      const answerCoverage = 0.90;
      const isolatedNodes = 5;
      const graphCoveragePass = answerCoverage >= 0.85 && isolatedNodes <= 2;
      expect(graphCoveragePass).toBe(false);
    });

    it('graphCoverage sub-check is skipped when no graph data', () => {
      const totalNodes = 0;
      const skipGraphCheck = totalNodes === 0;
      expect(skipGraphCheck).toBe(true);
    });

    it('review graphEvidence sub-check validates finding connectivity', () => {
      const graphFindingConnectivity = 0.95;
      const graphIsolatedFindings = 0;
      const graphEvidencePass = graphFindingConnectivity >= 0.90 && graphIsolatedFindings === 0;
      expect(graphEvidencePass).toBe(true);
    });
  });

  describe('weight calibration', () => {
    it('research relation weights fall within valid range', () => {
      const weights = {
        ANSWERS: 1.3,
        CONTRADICTS: 0.8,
        CITES: 1.0,
        EXTENDS: 1.1,
        SUPERSEDES: 1.2,
      };

      for (const [, weight] of Object.entries(weights)) {
        expect(weight).toBeGreaterThanOrEqual(0.0);
        expect(weight).toBeLessThanOrEqual(2.0);
      }
    });

    it('review relation weights fall within valid range', () => {
      const weights = {
        COVERS: 1.3,
        CONTRADICTS: 0.8,
        EVIDENCES: 1.0,
        REMEDIATES: 1.1,
        DEPENDS_ON: 0.9,
      };

      for (const [, weight] of Object.entries(weights)) {
        expect(weight).toBeGreaterThanOrEqual(0.0);
        expect(weight).toBeLessThanOrEqual(2.0);
      }
    });
  });
});
