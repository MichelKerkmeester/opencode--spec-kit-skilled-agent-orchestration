// TEST: INTEGRATION CAUSAL GRAPH
import { afterEach, describe, it, expect, vi } from 'vitest';
import * as causalHandler from '../handlers/causal-graph';
import * as causalEdges from '../lib/storage/causal-edges';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';

type CausalLinkArgs = Parameters<typeof causalHandler.handleMemoryCausalLink>[0];
type DriftWhyArgs = Parameters<typeof causalHandler.handleMemoryDriftWhy>[0];
type CausalStatsArgs = Parameters<typeof causalHandler.handleMemoryCausalStats>[0];
type CausalUnlinkArgs = Parameters<typeof causalHandler.handleMemoryCausalUnlink>[0];

type MCPTextResponse = {
  content: Array<{ text: string }>;
  isError?: boolean;
};

type MCPEnvelope = {
  summary: string;
  data: Record<string, unknown>;
  meta: Record<string, unknown>;
};

function parseEnvelope(response: unknown): { envelope: MCPEnvelope; isError: boolean } {
  const cast = response as MCPTextResponse;
  expect(cast.content?.[0]?.text).toBeTypeOf('string');
  const envelope = JSON.parse(cast.content[0].text) as MCPEnvelope;
  return { envelope, isError: Boolean(cast.isError) };
}

function expectErrorCode(response: unknown, expectedCodes: string[]): MCPEnvelope {
  const { envelope, isError } = parseEnvelope(response);
  expect(isError).toBe(true);
  const code = envelope.data?.code;
  expect(typeof code).toBe('string');
  expect(expectedCodes).toContain(code as string);
  return envelope;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Integration Causal Graph (T528)', () => {
  describe('Pipeline Module Loading', () => {
    it('T528-1: Causal graph modules loaded', () => {
      expect(causalHandler).toBeDefined();
      expect(causalEdges).toBeDefined();
    });
  });

  describe('Handler Parameter Validation', () => {
    it('T528-2: Missing params for CausalLink rejected', async () => {
      const response = await causalHandler.handleMemoryCausalLink({} as CausalLinkArgs);
      const envelope = expectErrorCode(response, ['E031']);
      const missing = envelope.data?.details as { missingParams?: string[] } | undefined;
      expect(missing?.missingParams).toEqual(
        expect.arrayContaining(['sourceId', 'targetId', 'relation'])
      );
    });

    it('T528-3: Missing memoryId for DriftWhy rejected', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({} as DriftWhyArgs);
      const envelope = expectErrorCode(response, ['E031']);
      const details = envelope.data?.details as { param?: string } | undefined;
      expect(details?.param).toBe('memoryId');
    });

    it('T528-4: CausalStats accepts empty params (no validation error)', async () => {
      const response = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        const code = envelope.data?.code;
        // Runtime/database errors are acceptable; validation errors are not.
        expect(['E020', 'E021', 'E042']).toContain(code as string);
        return;
      }

      expect(envelope.data).toHaveProperty('total_edges');
      expect(envelope.data).toHaveProperty('targetCoverage');
      expect(envelope.data).toHaveProperty('meetsTarget');
    });

    it('T528-5: Missing edgeId for CausalUnlink rejected', async () => {
      const response = await causalHandler.handleMemoryCausalUnlink({} as CausalUnlinkArgs);
      const envelope = expectErrorCode(response, ['E031']);
      const details = envelope.data?.details as { param?: string } | undefined;
      expect(details?.param).toBe('edgeId');
    });
  });

  describe('Relation Types & Direction Validation', () => {
    it('T528-6: Valid relation types accepted by pipeline', async () => {
      const validRelations = [
        'caused',
        'enabled',
        'supersedes',
        'contradicts',
        'derived_from',
        'supports',
      ] satisfies CausalLinkArgs['relation'][];

      for (const relation of validRelations) {
        const response = await causalHandler.handleMemoryCausalLink({
          sourceId: 'test-source-id',
          targetId: 'test-target-id',
          relation,
        });
        const { envelope, isError } = parseEnvelope(response);
        if (isError) {
          // Infrastructure/storage errors are acceptable in integration mode;
          // Relation-validation errors are not.
          expect(['E020', 'E022', 'E042']).toContain(envelope.data?.code as string);
          continue;
        }
        expect(envelope.data?.success).toBe(true);
        expect(envelope.summary).toContain(`[${relation}]`);
      }
    });

    it('T528-6b: storage failures return E022 instead of validation errors', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(true);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(
        () => ({} as ReturnType<typeof vectorIndex.initializeDb>)
      );
      vi.spyOn(vectorIndex, 'getDb').mockReturnValue(
        {} as NonNullable<ReturnType<typeof vectorIndex.getDb>>
      );
      vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);
      vi.spyOn(causalEdges, 'insertEdge').mockImplementation(() => {
        throw new Error('SQLITE_BUSY: database is locked');
      });

      const response = await causalHandler.handleMemoryCausalLink({
        sourceId: 'test-source-id',
        targetId: 'test-target-id',
        relation: 'caused',
      });

      const envelope = expectErrorCode(response, ['E022']);
      expect(envelope.data?.error).toBe('SQLITE_BUSY: database is locked');
    });

    it('T528-7: Direction parameter "outgoing" accepted', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({
        memoryId: 'test-memory-id',
        direction: 'outgoing',
      });
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      const traversalOptions = envelope.data?.traversalOptions as
        | { direction?: string }
        | undefined;
      if (traversalOptions) {
        expect(traversalOptions.direction).toBe('forward');
      } else {
        expect(envelope.summary).toContain('No causal relationships');
      }
    });

    it('T528-8: Error response for invalid inputs', async () => {
      const response = await causalHandler.handleMemoryCausalLink({
        sourceId: '',
        targetId: '',
        relation: '',
      } as unknown as CausalLinkArgs);
      const envelope = expectErrorCode(response, ['E031']);
      const details = envelope.data?.details as { missingParams?: string[] } | undefined;
      expect(details?.missingParams).toContain('relation');
    });
  });

  describe('T014: Causal Stats Handler Integration', () => {
    it('T014-CS1: Stats response has expected data structure', async () => {
      const response = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      expect(envelope.data).toHaveProperty('total_edges');
      expect(envelope.data).toHaveProperty('by_relation');
      expect(envelope.data).toHaveProperty('avg_strength');
      expect(envelope.data).toHaveProperty('health');
      expect(envelope.data).toHaveProperty('link_coverage_percent');
      expect(envelope.data).toHaveProperty('orphanedEdges');
    });

    it('T014-CS2: Stats response includes targetCoverage field', async () => {
      const response = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      expect(envelope.data.targetCoverage).toBe('60%');
      expect(typeof envelope.data.meetsTarget).toBe('boolean');
    });

    it('T014-CS3: Stats summary includes edge count and coverage', async () => {
      const response = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      expect(envelope.summary).toContain('edges');
      expect(envelope.summary).toContain('coverage');
    });
  });

  describe('T015: Drift Why Handler Integration', () => {
    it('T015-DW1: Valid memoryId returns chain structure or empty response', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({ memoryId: '1' });
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      const hasChain = typeof envelope.data?.memoryId !== 'undefined';
      const isEmpty = envelope.summary.includes('No causal relationships');
      expect(hasChain || isEmpty).toBe(true);
    });

    it('T015-DW2: maxDepth parameter is respected', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({ memoryId: '1', maxDepth: 1 });
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      const traversalOptions = envelope.data?.traversalOptions as
        | { maxDepth?: number }
        | undefined;
      if (traversalOptions) {
        expect(traversalOptions.maxDepth).toBe(1);
      } else {
        expect(envelope.summary).toContain('No causal relationships');
      }
    });

    it('T015-DW3: Direction parameter passed through', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({
        memoryId: '1',
        direction: 'incoming',
      });
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      const traversalOptions = envelope.data?.traversalOptions as
        | { direction?: string }
        | undefined;
      if (traversalOptions) {
        expect(traversalOptions.direction).toBe('backward');
      } else {
        expect(envelope.summary).toContain('No causal relationships');
      }
    });

    it('T015-DW4: Invalid relation types rejected', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({
        memoryId: '1',
        relations: ['invalid_relation'],
      });
      const envelope = expectErrorCode(response, ['E020', 'E030', 'E042']);
      // If DB is available, invalid relation validation should trigger E030.
      if (envelope.data?.code === 'E030') {
        expect(String(envelope.data?.error)).toContain('Invalid relation types');
      }
    });

    it('T015-DW5: maxDepth clamped to [1, 10]', async () => {
      const response = await causalHandler.handleMemoryDriftWhy({ memoryId: '1', maxDepth: 50 });
      const { envelope, isError } = parseEnvelope(response);
      if (isError) {
        expect(['E020', 'E021', 'E042']).toContain(envelope.data?.code as string);
        return;
      }

      const traversalOptions = envelope.data?.traversalOptions as
        | { maxDepth?: number }
        | undefined;
      if (traversalOptions) {
        expect(traversalOptions.maxDepth).toBeLessThanOrEqual(10);
        expect(traversalOptions.maxDepth).toBeGreaterThanOrEqual(1);
      } else {
        expect(envelope.summary).toContain('No causal relationships');
      }
    });
  });
});
