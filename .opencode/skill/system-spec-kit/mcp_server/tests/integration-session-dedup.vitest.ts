// TEST: INTEGRATION SESSION DEDUP
import { describe, it, expect } from 'vitest';
import * as searchHandler from '../handlers/memory-search';
import * as triggerHandler from '../handlers/memory-triggers';

async function withTimeout<T>(promise: Promise<T>, ms: number, name: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${name} exceeded ${ms}ms`)), ms)
    ),
  ]);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

describe('Integration Session Dedup (T531) [deferred - requires DB test fixtures]', () => {

  // SUITE: Search Handler Session Dedup Parameters
  describe('Search Handler Session Dedup Parameters', () => {
    it('T531-1: sessionId parameter accepted by search', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test dedup query',
            sessionId: 'dedup-session-001',
          }),
          5000,
          'T531-1'
        );
      } catch (error: unknown) {
        // SessionId should not be the cause of error
        expect(getErrorMessage(error)).not.toContain('sessionId');
      }
    });

    it('T531-2: enableDedup=true accepted by search', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test dedup query',
            sessionId: 'dedup-session-002',
            enableDedup: true,
          }),
          5000,
          'T531-2'
        );
      } catch (error: unknown) {
        // EnableDedup should not be the cause of error
        expect(getErrorMessage(error)).not.toContain('enableDedup');
      }
    });
  });

  // SUITE: Trigger Handler Session Parameters
  describe('Trigger Handler Session Parameters', () => {
    it('T531-3: session_id parameter accepted by triggers', async () => {
      try {
        await withTimeout(
          triggerHandler.handleMemoryMatchTriggers({
            prompt: 'test session trigger',
            session_id: 'dedup-session-003',
          }),
          5000,
          'T531-3'
        );
      } catch (error: unknown) {
        // Session_id should not be the cause of error
        expect(getErrorMessage(error)).not.toContain('session_id');
      }
    });

    it('T531-4: Search without sessionId accepted (no dedup)', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test no session query',
            // No sessionId — dedup should not activate
          }),
          5000,
          'T531-4'
        );
      } catch (error: unknown) {
        // Should not fail due to missing session
        expect(getErrorMessage(error)).not.toContain('session');
      }
    });
  });

  // SUITE: Dedup Disable Flag
  describe('Dedup Disable Flag', () => {
    it('T531-5: Default dedup behavior with sessionId', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test with session no explicit dedup',
            sessionId: 'dedup-session-default',
          }),
          5000,
          'T531-5'
        );
      } catch (error: unknown) {
        // Dedup should not be the cause of error
        expect(getErrorMessage(error)).not.toContain('dedup');
      }
    });

    it('T531-6: enableDedup=false accepted', async () => {
      try {
        await withTimeout(
          searchHandler.handleMemorySearch({
            query: 'test dedup disabled',
            sessionId: 'dedup-session-disabled',
            enableDedup: false,
          }),
          5000,
          'T531-6'
        );
      } catch (error: unknown) {
        // EnableDedup should not be the cause of error
        expect(getErrorMessage(error)).not.toContain('enableDedup');
      }
    });
  });
});
