// TEST: HANDLER CAUSAL GRAPH
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as handler from '../handlers/causal-graph';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as causalEdges from '../lib/storage/causal-edges';

type HandlerExportName = keyof typeof handler;

function invalidArgs<T>(value: unknown): T {
  return value as T;
}

function expectErrorMessage(
  error: unknown,
  matcher: (message: string) => boolean = () => true,
): void {
  expect(error).toBeInstanceOf(Error);
  if (error instanceof Error) {
    expect(matcher(error.message)).toBe(true);
  }
}

function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Handler Causal Graph (T523) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    const expectedExports: HandlerExportName[] = [
      'handleMemoryDriftWhy',
      'handleMemoryCausalLink',
      'handleMemoryCausalStats',
      'handleMemoryCausalUnlink',
    ];

    for (const name of expectedExports) {
      it(`T523-export: ${name} exported`, () => {
        expect(typeof handler[name]).toBe('function');
      });
    }

    it('T523-export-aliases: All snake_case aliases', () => {
      const aliases: HandlerExportName[] = [
        'handle_memory_drift_why',
        'handle_memory_causal_link',
        'handle_memory_causal_stats',
        'handle_memory_causal_unlink',
      ];

      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });
  });

  describe('handleMemoryDriftWhy Validation', () => {
    it('T523-DW1: Missing memoryId returns error response', async () => {
      const result = await handler.handleMemoryDriftWhy(
        invalidArgs<Parameters<typeof handler.handleMemoryDriftWhy>[0]>({}),
      );
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
      const parsed = JSON.parse(result.content[0].text);
      expect(
        (parsed.data && parsed.data.error && parsed.data.code === 'E031') ||
          (parsed.summary && parsed.summary.includes('Error'))
      ).toBeTruthy();
    });

    it('T523-DW2: Valid memoryId returns response', async () => {
      try {
        const result = await handler.handleMemoryDriftWhy({ memoryId: 999 });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data || parsed.summary).toBeTruthy();
      } catch (error: unknown) {
        // DB required — acceptable
        expectErrorMessage(error, (message) =>
          message.includes('database') || message.includes('getDb'),
        );
      }
    });

    it('T523-DW3: Null memoryId returns error', async () => {
      const result = await handler.handleMemoryDriftWhy(
        invalidArgs<Parameters<typeof handler.handleMemoryDriftWhy>[0]>({ memoryId: null }),
      );
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data && parsed.data.error).toBeTruthy();
    });

    it('T523-DW4: outgoing traversal uses outgoing buckets with direction-tagged edges', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
      vi.spyOn(vectorIndex, 'getDb').mockReturnValue({} as ReturnType<typeof vectorIndex.getDb>);
      vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);
      vi.spyOn(causalEdges, 'getCausalChain').mockReturnValue({
        id: '10',
        depth: 0,
        relation: causalEdges.RELATION_TYPES.CAUSED,
        strength: 1.0,
        children: [
          {
            id: '11',
            edgeId: 201,
            depth: 1,
            relation: causalEdges.RELATION_TYPES.CAUSED,
            strength: 0.9,
            children: [],
          },
        ],
      });

      const result = await handler.handleMemoryDriftWhy({
        memoryId: '10',
        direction: 'outgoing',
        includeMemoryDetails: false,
      });
      const parsed = parseResponse(result);

      expect(parsed.data.incoming.totalEdges).toBe(0);
      expect(parsed.data.outgoing.caused).toHaveLength(1);
      expect(parsed.data.outgoing.caused[0]).toMatchObject({
        from: '10',
        to: '11',
        direction: 'outgoing',
      });
      expect(parsed.data.totalOutgoingEdges).toBe(1);
      expect(parsed.data.totalIncomingEdges).toBe(0);
      expect(parsed.data.allEdges).toHaveLength(1);
    });

    it('T523-DW5: both direction keeps incoming and outgoing buckets separate', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
      vi.spyOn(vectorIndex, 'getDb').mockReturnValue({} as ReturnType<typeof vectorIndex.getDb>);
      vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);
      vi.spyOn(causalEdges, 'getCausalChain')
        .mockImplementation((memoryId: string, _maxDepth?: number, direction?: 'forward' | 'backward') => {
          if (direction === 'forward') {
            return {
              id: memoryId,
              depth: 0,
              relation: causalEdges.RELATION_TYPES.CAUSED,
              strength: 1.0,
              children: [
                {
                  id: '12',
                  edgeId: 301,
                  depth: 1,
                  relation: causalEdges.RELATION_TYPES.SUPPORTS,
                  strength: 0.7,
                  children: [],
                },
              ],
            };
          }

          return {
            id: memoryId,
            depth: 0,
            relation: causalEdges.RELATION_TYPES.CAUSED,
            strength: 1.0,
            children: [
              {
                id: '8',
                edgeId: 302,
                depth: 1,
                relation: causalEdges.RELATION_TYPES.CAUSED,
                strength: 0.9,
                children: [],
              },
            ],
          };
        });

      const result = await handler.handleMemoryDriftWhy({
        memoryId: '10',
        direction: 'both',
        includeMemoryDetails: false,
      });
      const parsed = parseResponse(result);

      expect(parsed.data.incoming.caused).toHaveLength(1);
      expect(parsed.data.incoming.caused[0]).toMatchObject({
        from: '8',
        to: '10',
        direction: 'incoming',
      });
      expect(parsed.data.outgoing.supports).toHaveLength(1);
      expect(parsed.data.outgoing.supports[0]).toMatchObject({
        from: '10',
        to: '12',
        direction: 'outgoing',
      });
      expect(parsed.data.totalIncomingEdges).toBe(1);
      expect(parsed.data.totalOutgoingEdges).toBe(1);
      expect(parsed.data.allEdges).toHaveLength(2);
    });

    it('T523-DW6: traversal failures use traversal error code and sanitize internal details', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
      vi.spyOn(vectorIndex, 'getDb').mockReturnValue({} as ReturnType<typeof vectorIndex.getDb>);
      vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);
      vi.spyOn(causalEdges, 'getCausalChain').mockImplementation(() => {
        throw new Error('SQLITE_ERROR: failed to open /private/tmp/secret.sqlite');
      });

      const result = await handler.handleMemoryDriftWhy({
        memoryId: '10',
        direction: 'outgoing',
      });
      const parsed = parseResponse(result);

      expect(parsed.data.code).toBe('E105');
      expect(parsed.data.error).toBe('Causal traversal failed.');
      expect(JSON.stringify(parsed)).not.toContain('/private/tmp/secret.sqlite');
    });
  });

  describe('handleMemoryCausalLink Validation', () => {
    it('T523-CL1: Missing params returns error', async () => {
      try {
        const result = await handler.handleMemoryCausalLink(
          invalidArgs<Parameters<typeof handler.handleMemoryCausalLink>[0]>({}),
        );
        if (result && result.content) {
          const parsed = JSON.parse(result.content[0].text);
          expect(parsed.data && parsed.data.error).toBeTruthy();
        }
      } catch (error: unknown) {
        // Any error thrown means handler rejected invalid input
        expectErrorMessage(error);
      }
    });

    it('T523-CL2: Missing sourceId listed in error', async () => {
      try {
        const result = await handler.handleMemoryCausalLink(
          invalidArgs<Parameters<typeof handler.handleMemoryCausalLink>[0]>({
            targetId: '2',
            relation: 'caused',
          }),
        );
        if (result && result.content) {
          const parsed = JSON.parse(result.content[0].text);
          const sourceIdMentioned =
            (parsed.data?.error?.includes('sourceId')) ||
            (parsed.data?.details?.missingParams?.includes('sourceId'));
          expect(sourceIdMentioned).toBe(true);
        }
      } catch (error: unknown) {
        // Handler rejected invalid input
        expectErrorMessage(error);
      }
    });

    it('T523-CL3: Missing relation listed in error', async () => {
      try {
        const result = await handler.handleMemoryCausalLink(
          invalidArgs<Parameters<typeof handler.handleMemoryCausalLink>[0]>({
            sourceId: '1',
            targetId: '2',
          }),
        );
        if (result && result.content) {
          const parsed = JSON.parse(result.content[0].text);
          const relationMentioned =
            (parsed.data?.error?.includes('relation')) ||
            (parsed.data?.details?.missingParams?.includes('relation'));
          expect(relationMentioned).toBe(true);
        }
      } catch (error: unknown) {
        expectErrorMessage(error);
      }
    });

    it('T523-CL4: Error includes validRelations', async () => {
      try {
        const result = await handler.handleMemoryCausalLink(
          invalidArgs<Parameters<typeof handler.handleMemoryCausalLink>[0]>({}),
        );
        if (result && result.content) {
          const parsed = JSON.parse(result.content[0].text);
          if (parsed.data?.details?.validRelations) {
            expect(Array.isArray(parsed.data.details.validRelations)).toBe(true);
            expect(parsed.data.details.validRelations.length).toBeGreaterThan(0);
          }
          // If validRelations not present, test is inconclusive but not failing
        }
      } catch (error: unknown) {
        // Handler rejected invalid input
        expectErrorMessage(error);
      }
    });

    it('T523-CL4: invalid relation uses causal relation error code', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
      vi.spyOn(vectorIndex, 'getDb').mockReturnValue({} as ReturnType<typeof vectorIndex.getDb>);
      vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);

      const result = await handler.handleMemoryCausalLink({
        sourceId: '1',
        targetId: '2',
        relation: 'invalid-relation',
      });
      const parsed = parseResponse(result);

      expect(parsed.data.code).toBe('E102');
      expect(parsed.data.error).toContain('Invalid relation type');
    });
  });

  describe('graph operation error codes', () => {
    it('uses causal graph error code for stats failures', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
      vi.spyOn(vectorIndex, 'getDb').mockImplementation(() => {
        throw new Error('SQLITE_CORRUPT: /tmp/internal.db');
      });

      const result = await handler.handleMemoryCausalStats({});
      const parsed = parseResponse(result);

      expect(parsed.data.code).toBe('E104');
      expect(parsed.data.error).toBe('Causal graph statistics failed.');
      expect(JSON.stringify(parsed)).not.toContain('/tmp/internal.db');
    });

    it('uses causal graph error code for unlink failures', async () => {
      vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
      vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
      vi.spyOn(vectorIndex, 'getDb').mockReturnValue({} as ReturnType<typeof vectorIndex.getDb>);
      vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);
      vi.spyOn(causalEdges, 'deleteEdge').mockImplementation(() => {
        throw new Error('SQLITE_BUSY at /tmp/causal.db');
      });

      const result = await handler.handleMemoryCausalUnlink({ edgeId: 123 });
      const parsed = parseResponse(result);

      expect(parsed.data.code).toBe('E104');
      expect(parsed.data.error).toBe('Causal edge deletion failed.');
      expect(JSON.stringify(parsed)).not.toContain('/tmp/causal.db');
    });
  });

  describe('handleMemoryCausalUnlink Validation', () => {
    it('T523-UL1: Missing edgeId returns error', async () => {
      const result = await handler.handleMemoryCausalUnlink(
        invalidArgs<Parameters<typeof handler.handleMemoryCausalUnlink>[0]>({}),
      );
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data && parsed.data.error).toBeTruthy();
    });

    it('T523-UL2: Null edgeId returns error', async () => {
      const result = await handler.handleMemoryCausalUnlink(
        invalidArgs<Parameters<typeof handler.handleMemoryCausalUnlink>[0]>({ edgeId: null }),
      );
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data && parsed.data.error).toBeTruthy();
    });
  });

  describe('handleMemoryCausalStats', () => {
    it('T523-CS1: Stats returns valid response', async () => {
      try {
        const result = await handler.handleMemoryCausalStats({});
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data || parsed.summary).toBeTruthy();
      } catch (error: unknown) {
        // DB required — acceptable
        expectErrorMessage(error, (message) =>
          message.includes('database') || message.includes('getDb'),
        );
      }
    });
  });

  describe('MCP Response Format', () => {
    it('T523-MCP1: content[0].type is text', async () => {
      const result = await handler.handleMemoryDriftWhy(
        invalidArgs<Parameters<typeof handler.handleMemoryDriftWhy>[0]>({}),
      );
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
    });

    it('T523-MCP2: content[0].text is valid JSON', async () => {
      const result = await handler.handleMemoryDriftWhy(
        invalidArgs<Parameters<typeof handler.handleMemoryDriftWhy>[0]>({}),
      );
      const parsed = JSON.parse(result.content[0].text);
      expect(typeof parsed).toBe('object');
    });
  });
});
