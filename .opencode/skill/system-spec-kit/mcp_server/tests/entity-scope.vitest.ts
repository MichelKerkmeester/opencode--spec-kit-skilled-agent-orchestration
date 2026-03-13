// TEST: ENTITY SCOPE
// Converted from: entity-scope.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import * as mod from '../lib/parsing/entity-scope';

describe('Entity Scope (T514)', () => {
  // SUITE: Context Type Detection from Content
  describe('Context Type Detection from Content (T514-01)', () => {
    it('T514-01a: Detects research context from content', () => {
      const research = mod.detectContextType(
        'We explored several options and investigated the performance'
      );
      expect(research).toBe('research');
    });

    it('T514-01b: Detects implementation context from content', () => {
      const impl = mod.detectContextType(
        'We implemented the feature and built the handler'
      );
      expect(impl).toBe('implementation');
    });

    it('T514-01c: Detects decision context from content', () => {
      const decision = mod.detectContextType(
        'We decided to use React and chose TypeScript'
      );
      expect(decision).toBe('decision');
    });

    it('T514-01d: Detects discovery context from content', () => {
      const discovery = mod.detectContextType(
        'We found a critical issue and discovered the root cause'
      );
      expect(discovery).toBe('discovery');
    });
  });

  // SUITE: Context Type Detection from Tools
  describe('Context Type Detection from Tools (T514-02)', () => {
    it('T514-02a: AskUserQuestion triggers decision context', () => {
      const decisionTools = [
        { tool: 'Read' },
        { tool: 'AskUserQuestion' },
        { tool: 'Write' },
      ];
      const decision = mod.detectContextTypeFromTools(decisionTools);
      expect(decision).toBe('decision');
    });

    it('T514-02b: Read-heavy tools trigger research context', () => {
      const researchTools = [
        { tool: 'Read' },
        { tool: 'Grep' },
        { tool: 'Glob' },
        { tool: 'Read' },
        { tool: 'Grep' },
        { tool: 'Read' },
      ];
      const research = mod.detectContextTypeFromTools(researchTools);
      expect(research).toBe('research');
    });

    it('T514-02c: Empty tool list returns general', () => {
      const empty = mod.detectContextTypeFromTools([]);
      expect(empty).toBe('general');
    });

    it('T514-02d: Null tools returns general', () => {
      const nullResult = mod.detectContextTypeFromTools(null);
      expect(nullResult).toBe('general');
    });
  });

  // SUITE: Empty Scope Handling
  describe('Empty Scope Handling (T514-03)', () => {
    it('T514-03a: Non-matching content returns general', () => {
      const general = mod.detectContextType(
        'Just a simple note with no keywords'
      );
      expect(general).toBe('general');
    });

    it('T514-03b: Empty scope produces "1=1" clause', () => {
      const emptyScope = mod.buildScopeFilter({});
      expect(emptyScope).toBeTruthy();
      expect(emptyScope.clause).toBe('1=1');
      expect(emptyScope.params).toHaveLength(0);
    });
  });

  // SUITE: Build Scope Filter
  describe('Build Scope Filter (T514-04)', () => {
    it('T514-04a: specFolder filter builds correct clause', () => {
      const folderScope = mod.buildScopeFilter({ specFolder: 'specs/001-test' });
      expect(folderScope.clause).toContain('spec_folder = ?');
      expect(folderScope.params).toContain('specs/001-test');
    });

    it('T514-04b: sessionId filter includes global memories', () => {
      const sessionScope = mod.buildScopeFilter({ sessionId: 'session-abc' });
      expect(sessionScope.clause).toContain('session_id = ?');
      expect(sessionScope.clause).toContain('session_id IS NULL');
    });

    it('T514-04c: contextTypes filter builds IN clause', () => {
      const typeScope = mod.buildScopeFilter({
        contextTypes: ['research', 'decision'],
      });
      expect(typeScope.clause).toContain('context_type IN');
      expect(typeScope.params).toHaveLength(2);
    });

    it('T514-04d: Combined scope uses AND between conditions', () => {
      const combined = mod.buildScopeFilter({
        specFolder: 'specs/001-test',
        sessionId: 'session-abc',
        contextTypes: ['implementation'],
      });
      expect(combined.clause).toContain('AND');
      expect(combined.params.length).toBeGreaterThanOrEqual(3);
    });
  });

  // SUITE: Validation and Session ID
  describe('Validation and Session ID (T514-05)', () => {
    it('T514-05a: isValidContextType accepts valid type', () => {
      expect(mod.isValidContextType('research')).toBe(true);
    });

    it('T514-05b: isValidContextType rejects invalid type', () => {
      expect(mod.isValidContextType('invalid_type')).toBe(false);
    });

    it('T514-05c: generateSessionId returns session-prefixed string', () => {
      const sessionId = mod.generateSessionId();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.startsWith('session-')).toBe(true);
    });

    it('T514-05d: Session IDs are unique', () => {
      const sessionId1 = mod.generateSessionId();
      const sessionId2 = mod.generateSessionId();
      expect(sessionId1).not.toBe(sessionId2);
    });

    it('T514-05e: CONTEXT_TYPES has 5 entries', () => {
      expect(Array.isArray(mod.CONTEXT_TYPES)).toBe(true);
      expect(mod.CONTEXT_TYPES).toHaveLength(5);
    });
  });
});
