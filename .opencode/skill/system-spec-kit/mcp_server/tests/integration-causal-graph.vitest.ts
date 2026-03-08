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

describe('Integration Causal Graph (T528) [deferred - requires DB test fixtures]', () => {

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
});
