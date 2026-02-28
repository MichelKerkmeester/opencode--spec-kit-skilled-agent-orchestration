// ───────────────────────────────────────────────────────────────
// TEST: WORKING MEMORY — vitest
// Aligned with production working-memory.ts named exports
// ───────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest';
import * as workingMemory from '../lib/cache/cognitive/working-memory';

const workingMemoryModule = workingMemory as unknown as Record<string, unknown>;
type WorkingMemoryDb = Parameters<typeof workingMemory.init>[0];

describe('Working Memory Module', () => {

  /* ─────────────────────────────────────────────────────────────
     WORKING_MEMORY_CONFIG
  ──────────────────────────────────────────────────────────────── */

  describe('WORKING_MEMORY_CONFIG', () => {
    it('WORKING_MEMORY_CONFIG is exported', () => {
      expect(workingMemory.WORKING_MEMORY_CONFIG).toBeTruthy();
    });

    it('enabled is boolean', () => {
      expect(typeof workingMemory.WORKING_MEMORY_CONFIG.enabled).toBe('boolean');
    });

    // maxCapacity (Miller's Law: 7)
    it('maxCapacity is valid', () => {
      expect(typeof workingMemory.WORKING_MEMORY_CONFIG.maxCapacity).toBe('number');
      expect(workingMemory.WORKING_MEMORY_CONFIG.maxCapacity).toBeGreaterThan(0);
    });

    it('sessionTimeoutMs is valid', () => {
      expect(typeof workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs).toBe('number');
      expect(workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs).toBeGreaterThan(0);
    });

  });

  /* ─────────────────────────────────────────────────────────────
     Utility Functions: isEnabled() and getConfig()
  ──────────────────────────────────────────────────────────────── */

  describe('Utility Functions', () => {
    it('isEnabled() returns boolean', () => {
      expect(typeof workingMemory.isEnabled()).toBe('boolean');
    });

    it('getConfig() returns object', () => {
      const config = workingMemory.getConfig();
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });

    it('getConfig() returns copy (not reference)', () => {
      const config1 = workingMemory.getConfig();
      const config2 = workingMemory.getConfig();
      expect(config1).not.toBe(config2);
    });

    it('getConfig() has all expected keys', () => {
      const config = workingMemory.getConfig();
      const configRecord = config as unknown as Record<string, unknown>;
      const expectedKeys = ['enabled', 'maxCapacity', 'sessionTimeoutMs'];
      for (const key of expectedKeys) {
        expect(configRecord[key]).toBeDefined();
      }
    });
  });

  /* ─────────────────────────────────────────────────────────────
     calculateTier()
     Production: >= 0.8 = 'focused', >= 0.5 = 'active', >= 0.2 = 'peripheral', else 'fading'
  ──────────────────────────────────────────────────────────────── */

  describe('calculateTier()', () => {
    it('Score 1.0 = focused', () => {
      expect(workingMemory.calculateTier(1.0)).toBe('focused');
    });

    it('Score 0.9 = focused', () => {
      expect(workingMemory.calculateTier(0.9)).toBe('focused');
    });

    it('Score 0.8 = focused (threshold)', () => {
      expect(workingMemory.calculateTier(0.8)).toBe('focused');
    });

    it('Score 0.79 = active', () => {
      expect(workingMemory.calculateTier(0.79)).toBe('active');
    });

    it('Score 0.5 = active (threshold)', () => {
      expect(workingMemory.calculateTier(0.5)).toBe('active');
    });

    it('Score 0.49 = peripheral', () => {
      expect(workingMemory.calculateTier(0.49)).toBe('peripheral');
    });

    it('Score 0.2 = peripheral (threshold)', () => {
      expect(workingMemory.calculateTier(0.2)).toBe('peripheral');
    });

    it('Score 0.19 = fading', () => {
      expect(workingMemory.calculateTier(0.19)).toBe('fading');
    });

    it('Score 0.0 = fading', () => {
      expect(workingMemory.calculateTier(0.0)).toBe('fading');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     init()
     Production init(database) just sets db = database and calls ensureSchema()
     It does NOT throw on null - it silently sets db to null and ensureSchema returns early
  ──────────────────────────────────────────────────────────────── */

  describe('init()', () => {
    it('init(null) does not throw', () => {
      // Production silently accepts null (db becomes null, ensureSchema skips)
      expect(() => {
        workingMemory.init(null as unknown as WorkingMemoryDb);
      }).not.toThrow();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Session Functions (no DB)
  ──────────────────────────────────────────────────────────────── */

  describe('Session Functions (no DB)', () => {
    it('getOrCreateSession(null) generates session ID', () => {
      const session = workingMemory.getOrCreateSession(null);
      expect(typeof session).toBe('string');
      expect(session.startsWith('wm-')).toBe(true);
    });

    it('getOrCreateSession("my-session") returns same ID', () => {
      expect(workingMemory.getOrCreateSession('my-session')).toBe('my-session');
    });

    it('clearSession returns 0 without DB', () => {
      expect(workingMemory.clearSession('test-session')).toBe(0);
    });

    it('getWorkingMemory returns [] without DB', () => {
      const wm = workingMemory.getWorkingMemory('test-session');
      expect(Array.isArray(wm)).toBe(true);
      expect(wm).toHaveLength(0);
    });

    it('getSessionMemories returns [] without DB', () => {
      const sm = workingMemory.getSessionMemories('test-session');
      expect(Array.isArray(sm)).toBe(true);
      expect(sm).toHaveLength(0);
    });

    it('setAttentionScore returns false without DB', () => {
      expect(workingMemory.setAttentionScore('test', 1, 0.5)).toBe(false);
    });

    it('getSessionStats returns null without DB', () => {
      expect(workingMemory.getSessionStats('test')).toBeNull();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    const expectedExports = [
      'WORKING_MEMORY_CONFIG',
      'SCHEMA_SQL',
      'INDEX_SQL',
      'init',
      'ensureSchema',
      'getOrCreateSession',
      'clearSession',
      'cleanupOldSessions',
      'getWorkingMemory',
      'getSessionMemories',
      'calculateTier',
      'setAttentionScore',
      'enforceMemoryLimit',
      'batchUpdateScores',
      'isEnabled',
      'getConfig',
      'getSessionStats',
    ];

    for (const name of expectedExports) {
      it(`Export: ${name}`, () => {
        expect(workingMemoryModule[name]).toBeDefined();
      });
    }
  });

  /* ─────────────────────────────────────────────────────────────
     calculateTier() Edge Cases
  ──────────────────────────────────────────────────────────────── */

  describe('calculateTier() Edge Cases', () => {
    it('focused/active boundary at 0.8', () => {
      expect(workingMemory.calculateTier(0.80)).toBe('focused');
      expect(workingMemory.calculateTier(0.7999)).toBe('active');
    });

    it('active/peripheral boundary at 0.5', () => {
      expect(workingMemory.calculateTier(0.50)).toBe('active');
      expect(workingMemory.calculateTier(0.4999)).toBe('peripheral');
    });

    it('peripheral/fading boundary at 0.2', () => {
      expect(workingMemory.calculateTier(0.20)).toBe('peripheral');
      expect(workingMemory.calculateTier(0.1999)).toBe('fading');
    });

    it('Tiny value = fading', () => {
      expect(workingMemory.calculateTier(0.0000001)).toBe('fading');
    });

    it('0.9999999 = focused', () => {
      expect(workingMemory.calculateTier(0.9999999)).toBe('focused');
    });
  });
});
