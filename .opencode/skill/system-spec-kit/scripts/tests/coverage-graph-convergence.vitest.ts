import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const reducerModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-deep-research/scripts/reduce-state.cjs',
)) as {
  parseGraphEvents: (record: Record<string, unknown>) => { nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>> };
  getGraphState: (namespace: string, mcpAvailable: boolean, options?: { iterationRecords?: Array<Record<string, unknown>>; localGraphPath?: string }) => { source: string; nodes: Array<Record<string, unknown>>; edges: Array<Record<string, unknown>> };
  queryGraphConvergence: (namespace: string, options?: { iterationRecords?: Array<Record<string, unknown>>; mcpSignals?: Record<string, unknown> }) => { componentCount: number; isolatedNodes: number; totalNodes: number; totalEdges: number; answerCoverage: number; source: string };
};

describe('coverage-graph-convergence (reducer integration)', () => {
  describe('parseGraphEvents', () => {
    it('parses node events from an iteration record', () => {
      const record = {
        type: 'iteration',
        run: 1,
        graphEvents: [
          { kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'What causes latency?' },
          { kind: 'node', id: 'f-1', nodeType: 'finding_node', label: 'Connection pooling' },
        ],
      };

      const result = reducerModule.parseGraphEvents(record);
      expect(result.nodes.length).toBe(2);
      expect(result.nodes[0].id).toBe('q-1');
      expect(result.nodes[0].nodeType).toBe('question_node');
      expect(result.edges.length).toBe(0);
    });

    it('parses edge events from an iteration record', () => {
      const record = {
        type: 'iteration',
        run: 2,
        graphEvents: [
          { kind: 'edge', source: 'f-1', target: 'q-1', relation: 'ANSWERS', weight: 1.3 },
          { kind: 'edge', source: 'f-1', target: 's-1', relation: 'CITES' },
        ],
      };

      const result = reducerModule.parseGraphEvents(record);
      expect(result.edges.length).toBe(2);
      expect(result.edges[0].source).toBe('f-1');
      expect(result.edges[0].relation).toBe('ANSWERS');
      expect(result.edges[0].weight).toBe(1.3);
      expect(result.edges[1].weight).toBe(1.0); // default weight
    });

    it('returns empty arrays for record without graphEvents', () => {
      const record = { type: 'iteration', run: 1 };
      const result = reducerModule.parseGraphEvents(record);
      expect(result.nodes.length).toBe(0);
      expect(result.edges.length).toBe(0);
    });

    it('skips malformed events', () => {
      const record = {
        type: 'iteration',
        run: 1,
        graphEvents: [
          null,
          { kind: 'node' }, // missing id
          { kind: 'edge', source: 'a' }, // missing target
          { kind: 'node', id: 'valid', nodeType: 'finding_node', label: 'OK' },
        ],
      };

      const result = reducerModule.parseGraphEvents(record);
      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0].id).toBe('valid');
    });

    it('attaches iteration number to parsed events', () => {
      const record = {
        type: 'iteration',
        run: 5,
        graphEvents: [
          { kind: 'node', id: 'n-1', nodeType: 'question_node', label: 'Q' },
          { kind: 'edge', source: 'a', target: 'b', relation: 'CITES' },
        ],
      };

      const result = reducerModule.parseGraphEvents(record);
      expect(result.nodes[0].iteration).toBe(5);
      expect(result.edges[0].iteration).toBe(5);
    });
  });

  describe('getGraphState', () => {
    it('rebuilds from JSONL records (priority 1)', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [
            { kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' },
            { kind: 'node', id: 'f-1', nodeType: 'finding_node', label: 'F1' },
            { kind: 'edge', source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
          ],
        },
      ];

      const state = reducerModule.getGraphState('test-ns', false, { iterationRecords: records });
      expect(state.source).toBe('jsonl');
      expect(state.nodes.length).toBe(2);
      expect(state.edges.length).toBe(1);
    });

    it('deduplicates nodes across iterations', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [{ kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' }],
        },
        {
          type: 'iteration',
          run: 2,
          graphEvents: [{ kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1 updated' }],
        },
      ];

      const state = reducerModule.getGraphState('test-ns', false, { iterationRecords: records });
      expect(state.nodes.length).toBe(1);
    });

    it('deduplicates edges by source:target:relation', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [{ kind: 'edge', source: 'a', target: 'b', relation: 'CITES' }],
        },
        {
          type: 'iteration',
          run: 2,
          graphEvents: [{ kind: 'edge', source: 'a', target: 'b', relation: 'CITES' }],
        },
      ];

      const state = reducerModule.getGraphState('test-ns', false, { iterationRecords: records });
      expect(state.edges.length).toBe(1);
    });

    it('returns mcp-available source when MCP is available but no JSONL data', () => {
      const state = reducerModule.getGraphState('test-ns', true, { iterationRecords: [] });
      expect(state.source).toBe('mcp-available');
    });

    it('returns none source when no data and no MCP', () => {
      const state = reducerModule.getGraphState('test-ns', false, { iterationRecords: [] });
      expect(state.source).toBe('none');
    });

    it('skips non-iteration records', () => {
      const records = [
        { type: 'config', topic: 'Test' },
        { type: 'event', event: 'stuck_recovery' },
        {
          type: 'iteration',
          run: 1,
          graphEvents: [{ kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' }],
        },
      ];

      const state = reducerModule.getGraphState('test-ns', false, { iterationRecords: records });
      expect(state.nodes.length).toBe(1);
    });
  });

  describe('queryGraphConvergence', () => {
    it('computes convergence signals from JSONL data', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [
            { kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' },
            { kind: 'node', id: 'q-2', nodeType: 'question_node', label: 'Q2' },
            { kind: 'node', id: 'f-1', nodeType: 'finding_node', label: 'F1' },
            { kind: 'edge', source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
          ],
        },
      ];

      const result = reducerModule.queryGraphConvergence('test-ns', { iterationRecords: records });
      expect(result.totalNodes).toBe(3);
      expect(result.totalEdges).toBe(1);
      expect(result.answerCoverage).toBe(0.5); // 1 of 2 questions answered
      expect(result.source).toBe('jsonl');
    });

    it('returns zeros when no graph data exists', () => {
      const result = reducerModule.queryGraphConvergence('test-ns', { iterationRecords: [] });
      expect(result.totalNodes).toBe(0);
      expect(result.totalEdges).toBe(0);
      expect(result.answerCoverage).toBe(0);
      expect(result.source).toBe('none');
    });

    it('uses MCP signals when no local data and MCP signals provided', () => {
      const mcpSignals = {
        componentCount: 3,
        isolatedNodes: 1,
        totalNodes: 15,
        totalEdges: 20,
      };

      const result = reducerModule.queryGraphConvergence('test-ns', {
        iterationRecords: [],
        mcpSignals,
      });

      expect(result.totalNodes).toBe(15);
      expect(result.totalEdges).toBe(20);
      expect(result.componentCount).toBe(3);
      expect(result.source).toBe('mcp');
    });

    it('computes component count correctly', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [
            { kind: 'node', id: 'a', nodeType: 'finding_node', label: 'A' },
            { kind: 'node', id: 'b', nodeType: 'finding_node', label: 'B' },
            { kind: 'node', id: 'c', nodeType: 'finding_node', label: 'C' },
            { kind: 'node', id: 'd', nodeType: 'finding_node', label: 'D' },
            { kind: 'edge', source: 'a', target: 'b', relation: 'CITES' },
            { kind: 'edge', source: 'c', target: 'd', relation: 'CITES' },
          ],
        },
      ];

      const result = reducerModule.queryGraphConvergence('test-ns', { iterationRecords: records });
      expect(result.componentCount).toBe(2);
      expect(result.isolatedNodes).toBe(0);
    });

    it('detects isolated nodes', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [
            { kind: 'node', id: 'connected-a', nodeType: 'finding_node', label: 'A' },
            { kind: 'node', id: 'connected-b', nodeType: 'finding_node', label: 'B' },
            { kind: 'node', id: 'isolated', nodeType: 'question_node', label: 'Lonely Q' },
            { kind: 'edge', source: 'connected-a', target: 'connected-b', relation: 'CITES' },
          ],
        },
      ];

      const result = reducerModule.queryGraphConvergence('test-ns', { iterationRecords: records });
      expect(result.isolatedNodes).toBe(1);
    });

    it('computes full answer coverage', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [
            { kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' },
            { kind: 'node', id: 'q-2', nodeType: 'question_node', label: 'Q2' },
            { kind: 'node', id: 'f-1', nodeType: 'finding_node', label: 'F1' },
            { kind: 'node', id: 'f-2', nodeType: 'finding_node', label: 'F2' },
            { kind: 'edge', source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
            { kind: 'edge', source: 'f-2', target: 'q-2', relation: 'ANSWERS' },
          ],
        },
      ];

      const result = reducerModule.queryGraphConvergence('test-ns', { iterationRecords: records });
      expect(result.answerCoverage).toBe(1.0);
    });

    it('merges local and MCP signals when both available', () => {
      const records = [
        {
          type: 'iteration',
          run: 1,
          graphEvents: [
            { kind: 'node', id: 'q-1', nodeType: 'question_node', label: 'Q1' },
            { kind: 'node', id: 'f-1', nodeType: 'finding_node', label: 'F1' },
            { kind: 'edge', source: 'f-1', target: 'q-1', relation: 'ANSWERS' },
          ],
        },
      ];

      const mcpSignals = { componentCount: 5, totalNodes: 20, totalEdges: 30, isolatedNodes: 2 };

      const result = reducerModule.queryGraphConvergence('test-ns', {
        iterationRecords: records,
        mcpSignals,
      });

      // Local data takes precedence but source notes MCP was available
      expect(result.totalNodes).toBe(2);
      expect(result.source).toContain('jsonl');
      expect(result.source).toContain('mcp');
    });
  });
});
