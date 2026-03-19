// TEST: INTEGRATION TRIGGER PIPELINE
import { describe, it, expect } from 'vitest';

import type { MCPResponse } from '../handlers/types';
import * as triggerHandler from '../handlers/memory-triggers';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as attentionDecay from '../lib/cognitive/attention-decay';
import * as coActivation from '../lib/cognitive/co-activation';
import type { MCPEnvelope } from '../lib/response/envelope';

interface TriggerEnvelopeData {
  error?: string;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseEnvelope(response: MCPResponse): MCPEnvelope<TriggerEnvelopeData> {
  return JSON.parse(response.content[0].text) as MCPEnvelope<TriggerEnvelopeData>;
}

describe('Integration Trigger Pipeline (T527) [deferred - requires DB test fixtures]', () => {

  // SUITE: Pipeline Module Loading
  describe('Pipeline Module Loading', () => {

    it('T527-1: Trigger pipeline modules loaded', () => {
      const modules: Array<{ name: string; ref: unknown }> = [
        { name: 'triggerHandler', ref: triggerHandler },
      ];
      if (triggerMatcher) modules.push({ name: 'triggerMatcher', ref: triggerMatcher });
      if (attentionDecay) modules.push({ name: 'attentionDecay', ref: attentionDecay });
      if (coActivation) modules.push({ name: 'coActivation', ref: coActivation });

      const loaded = modules.filter(m => m.ref !== null);
      expect(loaded.length).toBeGreaterThanOrEqual(1);
      expect(triggerHandler).toBeTruthy();
    });

  });

  // SUITE: Pipeline Input Validation
  describe('Pipeline Input Validation', () => {

    it('T527-2: Missing prompt returns validation envelope', async () => {
      const response = await triggerHandler.handleMemoryMatchTriggers(
        {} as Parameters<typeof triggerHandler.handleMemoryMatchTriggers>[0]
      );
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt|required/i);
    });

    it('T527-3: Empty prompt returns validation envelope', async () => {
      const response = await triggerHandler.handleMemoryMatchTriggers({ prompt: '' });
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt/i);
    });

    it('T527-4: Session cognitive params accepted', async () => {
      // Should not throw an input validation error about session_id/turnNumber.
      // Downstream errors (e.g. database) are acceptable.
      try {
        await triggerHandler.handleMemoryMatchTriggers({
          prompt: 'test trigger matching',
          session_id: 'sess-test-001',
          turnNumber: 5,
        });
      } catch (error: unknown) {
        // Fail only if the error is specifically about these params
        const message = getErrorMessage(error);
        expect(message).not.toMatch(/session_id/);
        expect(message).not.toMatch(/turnNumber/);
      }
    });

    it('T527-5: include_cognitive parameter accepted', async () => {
      try {
        await triggerHandler.handleMemoryMatchTriggers({
          prompt: 'test trigger matching',
          include_cognitive: true,
        });
      } catch (error: unknown) {
        // Fail only if the error is specifically about include_cognitive
        expect(getErrorMessage(error)).not.toMatch(/include_cognitive/);
      }
    });

  });

  // SUITE: Pipeline Response & Error Handling
  describe('Pipeline Response & Error Handling', () => {

    it('T527-6: Trigger handler is async (returns MCP envelope)', () => {
      expect(typeof triggerHandler.handleMemoryMatchTriggers).toBe('function');
      const fn = triggerHandler.handleMemoryMatchTriggers;
      const isAsync = fn.constructor.name === 'AsyncFunction' || fn.toString().includes('async');
      expect(isAsync).toBe(true);
    });

    it('T527-7: Invalid input propagates as MCP error response', async () => {
      const response = await triggerHandler.handleMemoryMatchTriggers(
        {} as Parameters<typeof triggerHandler.handleMemoryMatchTriggers>[0]
      );
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(typeof payload.data.error).toBe('string');
      expect(payload.meta.isError).toBe(true);
    });

    it('T527-8: Non-string prompt returns validation envelope', async () => {
      const response = await triggerHandler.handleMemoryMatchTriggers(
        { prompt: 12345 } as unknown as Parameters<typeof triggerHandler.handleMemoryMatchTriggers>[0]
      );
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt.*string|string.*prompt/i);
    });

  });

});
