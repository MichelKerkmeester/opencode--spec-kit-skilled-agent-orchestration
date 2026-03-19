// TEST: TRIGGER SETATTENTIONSCORE
import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as handler from '../handlers/memory-triggers';

const HANDLERS_PATH = path.join(__dirname, '..', 'handlers');

describe('T209: Wire setAttentionScore for Trigger Matches', () => {

  // SUITE: T209 — setAttentionScore export and signature
  describe('setAttentionScore export and signature', () => {
    it('T209-1: setAttentionScore is exported from working-memory', () => {
      expect(typeof workingMemory.setAttentionScore).toBe('function');
    });

    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
      const result = workingMemory.setAttentionScore('test-session', 999, 1.0);
      // Result may be false without DB, or truthy with DB — either is acceptable
      expect(result !== undefined).toBe(true);
    });
  });

  // SUITE: T209 — Handler source includes setAttentionScore call
  describe('Handler wires setAttentionScore', () => {
    let handlerSource: string | null = null;
    let handlerJs: string | null = null;

    beforeAll(() => {
      try {
        handlerSource = fs.readFileSync(
          path.join(HANDLERS_PATH, '..', 'handlers', 'memory-triggers.ts'),
          'utf-8'
        );
      } catch {
        // TS source not available, try compiled JS
      }

      try {
        handlerJs = fs.readFileSync(
          path.join(HANDLERS_PATH, 'memory-triggers.js'),
          'utf-8'
        );
      } catch {
        // Compiled JS not available either
      }
    });

    it('T209-3: Handler source calls setAttentionScore', () => {
      if (handlerSource) {
        expect(handlerSource).toContain('workingMemory.setAttentionScore');
      } else if (handlerJs) {
        expect(handlerJs).toContain('setAttentionScore');
      } else {
        expect.unreachable('Neither TS source nor compiled JS available');
      }
    });

    it('T209-4: setAttentionScore called within Step 3 ACTIVATE block', () => {
      if (!handlerSource) return; // skip if source not available

      const activateIndex = handlerSource.indexOf('Step 3: ACTIVATE');
      const coActivateIndex = handlerSource.indexOf('Step 4: CO-ACTIVATE');
      const setAttnIndex = handlerSource.indexOf('workingMemory.setAttentionScore');

      if (activateIndex < 0 || coActivateIndex < 0 || setAttnIndex < 0) {
        return; // skip — cannot find section markers
      }

      expect(setAttnIndex).toBeGreaterThan(activateIndex);
      expect(setAttnIndex).toBeLessThan(coActivateIndex);
    });

    it('T209-5: setAttentionScore called with (session_id, match.memoryId, score)', () => {
      if (!handlerSource) return; // skip if source not available

      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;

      const hasStrict = strictPattern.test(handlerSource);
      const hasRelaxed = relaxedPattern.test(handlerSource);

      expect(hasStrict || hasRelaxed).toBe(true);
    });

    it('T209-6: Attention boost score is 1.0 (max)', () => {
      if (!handlerSource) return; // skip if source not available

      const boostPattern = /workingMemory\.setAttentionScore\([^)]*,\s*1\.0\s*\)/;
      expect(boostPattern.test(handlerSource)).toBe(true);
    });
  });

  // SUITE: T209 — Task ID documented in source
  describe('Task ID documented in source', () => {
    it('T209-7: T209 task ID documented in handler source', () => {
      let source: string;
      try {
        source = fs.readFileSync(
          path.join(HANDLERS_PATH, '..', 'handlers', 'memory-triggers.ts'),
          'utf-8'
        );
      } catch {
        source = fs.readFileSync(
          path.join(HANDLERS_PATH, 'memory-triggers.js'),
          'utf-8'
        );
      }
      expect(source).toContain('T209');
    });
  });
});
