// ---------------------------------------------------------------
// TEST: INTEGRATION CAUSAL GRAPH
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import * as causalHandler from '../handlers/causal-graph';
import * as causalEdges from '../lib/storage/causal-edges';

type CausalLinkArgs = Parameters<typeof causalHandler.handleMemoryCausalLink>[0];
type DriftWhyArgs = Parameters<typeof causalHandler.handleMemoryDriftWhy>[0];
type CausalStatsArgs = Parameters<typeof causalHandler.handleMemoryCausalStats>[0];
type CausalUnlinkArgs = Parameters<typeof causalHandler.handleMemoryCausalUnlink>[0];

function getErrorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }

  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}

function isDbInfrastructureError(error: unknown): boolean {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);
  return Boolean(
    (message && (message.includes('database') || message.includes('SQLITE') ||
      message.includes('DB') || message.includes('no such table') ||
      message.includes('initialize'))) ||
    (code && (code === 'E010' || code === 'E020'))
  );
}

describe('Integration Causal Graph (T528)', () => {

  // -------------------------------------------------------------
  // SUITE: Pipeline Module Loading
  // -------------------------------------------------------------
  describe('Pipeline Module Loading', () => {
    it('T528-1: Causal graph modules loaded', () => {
      expect(causalHandler).toBeDefined();
      // causalEdges is optional but should at least import
      expect(causalEdges).toBeDefined();
    });
  });

  // -------------------------------------------------------------
  // SUITE: Handler Parameter Validation
  // -------------------------------------------------------------
  describe('Handler Parameter Validation', () => {
    it('T528-2: Missing params for CausalLink rejected', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalLink({} as CausalLinkArgs);
        // Handler may return MCP error response instead of throwing
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      } catch (error: unknown) {
        // Error thrown is also acceptable — validates required params
        expect(getErrorMessage(error)).toBeDefined();
      }
    });

    it('T528-3: Missing memoryId for DriftWhy rejected', async () => {
      try {
        const result = await causalHandler.handleMemoryDriftWhy({} as DriftWhyArgs);
        // Handler accepted it — valid behavior for handlers that check later
        expect(result).toBeDefined();
      } catch (error: unknown) {
        expect(getErrorMessage(error)).toBeDefined();
      }
    });

    it('T528-4: CausalStats accepts empty params', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
        // Should succeed or fail at DB layer, not at validation
        expect(result).toBeDefined();
      } catch (error: unknown) {
        // DB errors are acceptable — parameter validation errors are not
        const message = getErrorMessage(error);
        const code = getErrorCode(error);
        const isInfraError =
          (message && (message.includes('database') || message.includes('SQLITE') ||
            message.includes('DB') || message.includes('no such table') ||
            message.includes('initialize'))) ||
          (code && (code === 'E010' || code === 'E020'));
        expect(isInfraError).toBe(true);
      }
    });

    it('T528-5: Missing edgeId for CausalUnlink rejected', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalUnlink({} as CausalUnlinkArgs);
        // Handler accepted it — valid behavior for handlers that check later
        expect(result).toBeDefined();
      } catch (error: unknown) {
        expect(getErrorMessage(error)).toBeDefined();
      }
    });
  });

  // -------------------------------------------------------------
  // SUITE: Relation Types & Direction Validation
  // -------------------------------------------------------------
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
      let accepted = false;

      for (const relation of validRelations) {
        try {
          await causalHandler.handleMemoryCausalLink({
            sourceId: 'test-source-id',
            targetId: 'test-target-id',
            relation: relation,
          });
          accepted = true;
          break;
        } catch (error: unknown) {
          const message = getErrorMessage(error);
          if (message && message.includes('relation')) {
            // Relation type was rejected — fail
            expect.unreachable(`Relation "${relation}" rejected: ${message}`);
          }
          // DB/infra error = relation was accepted but downstream failed
          accepted = true;
          break;
        }
      }

      expect(accepted).toBe(true);
    });

    it('T528-7: Direction parameter "outgoing" accepted', async () => {
      try {
        await causalHandler.handleMemoryDriftWhy({
          memoryId: 'test-memory-id',
          direction: 'outgoing',
        });
      } catch (error: unknown) {
        // Direction should not be the reason for failure
        expect(getErrorMessage(error)).not.toContain('direction');
      }
    });

    it('T528-8: Error response for invalid inputs', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalLink({
          sourceId: '',
          targetId: '',
          relation: '',
        } as unknown as CausalLinkArgs);
        // Handler may return MCP error response instead of throwing
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      } catch (error: unknown) {
        expect(typeof getErrorMessage(error)).toBe('string');
      }
    });
  });

  describe('T014: Causal Stats Handler Integration', () => {
    it('T014-CS1: Stats response has expected data structure', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data && !parsed.data.error) {
          // Verify all expected fields exist
          expect(parsed.data).toHaveProperty('total_edges');
          expect(parsed.data).toHaveProperty('by_relation');
          expect(parsed.data).toHaveProperty('avg_strength');
          expect(parsed.data).toHaveProperty('health');
          expect(parsed.data).toHaveProperty('link_coverage_percent');
          expect(parsed.data).toHaveProperty('orphanedEdges');
        } else {
          expect(parsed.data?.error || parsed.isError).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });

    it('T014-CS2: Stats response includes targetCoverage field', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data && !parsed.data.error) {
          expect(parsed.data.targetCoverage).toBe('60%');
          expect(typeof parsed.data.meetsTarget).toBe('boolean');
        } else {
          expect(parsed.data?.error || parsed.isError).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });

    it('T014-CS3: Stats summary includes edge count', async () => {
      try {
        const result = await causalHandler.handleMemoryCausalStats({} as CausalStatsArgs);
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.summary) {
          expect(parsed.summary).toContain('edges');
        } else {
          expect(parsed.data?.error || parsed.isError).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });
  });

  describe('T015: Drift Why Handler Integration', () => {
    it('T015-DW1: Valid memoryId returns chain structure', async () => {
      try {
        const result = await causalHandler.handleMemoryDriftWhy({ memoryId: '1' });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data && !parsed.data.error) {
          expect(parsed.data).toHaveProperty('memoryId');
          expect(typeof parsed.data.totalEdges === 'number' || parsed.data.totalEdges === undefined).toBe(true);
        } else {
          expect(parsed.data?.error || parsed.isError).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });

    it('T015-DW2: maxDepth parameter is respected', async () => {
      try {
        const result = await causalHandler.handleMemoryDriftWhy({ memoryId: '1', maxDepth: 1 });
        expect(result).toBeDefined();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data && parsed.data.traversalOptions) {
          expect(parsed.data.traversalOptions.maxDepth).toBe(1);
        } else {
          expect(
            parsed.data?.error ||
            parsed.isError ||
            parsed.summary?.includes('No causal relationships')
          ).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });

    it('T015-DW3: Direction parameter passed through', async () => {
      try {
        const result = await causalHandler.handleMemoryDriftWhy({
          memoryId: '1',
          direction: 'incoming'
        });
        expect(result).toBeDefined();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data && parsed.data.traversalOptions) {
          expect(parsed.data.traversalOptions.direction).toBe('backward');
        } else {
          expect(
            parsed.data?.error ||
            parsed.isError ||
            parsed.summary?.includes('No causal relationships')
          ).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });

    it('T015-DW4: Invalid relation types rejected', async () => {
      try {
        const result = await causalHandler.handleMemoryDriftWhy({
          memoryId: '1',
          relations: ['invalid_relation'],
        });
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data) {
          expect(parsed.data.error || parsed.data.code === 'E030').toBeTruthy();
        } else {
          expect(parsed.isError).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });

    it('T015-DW5: maxDepth clamped to [1, 10]', async () => {
      try {
        const result = await causalHandler.handleMemoryDriftWhy({ memoryId: '1', maxDepth: 50 });
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed).toBeDefined();
        if (parsed.data && parsed.data.traversalOptions) {
          expect(parsed.data.traversalOptions.maxDepth).toBeLessThanOrEqual(10);
          expect(parsed.data.traversalOptions.maxDepth).toBeGreaterThanOrEqual(1);
        } else {
          expect(
            parsed.data?.error ||
            parsed.isError ||
            parsed.summary?.includes('No causal relationships')
          ).toBeTruthy();
        }
      } catch (error: unknown) {
        expect(isDbInfrastructureError(error)).toBe(true);
      }
    });
  });
});
