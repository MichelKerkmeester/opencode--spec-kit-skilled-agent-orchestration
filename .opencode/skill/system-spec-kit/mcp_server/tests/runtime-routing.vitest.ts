// ───────────────────────────────────────────────────────────────
// TEST: Query-Intent Routing
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';

describe('query-intent routing', () => {
  describe('maps semantic queries to semantic intent', () => {
    it('find code queries', () => { expect(classifyQueryIntent('find code that handles authentication').intent).toBe('semantic'); });
    it('find retry logic implementation', () => { expect(classifyQueryIntent('find code related to retry logic').intent).toBe('semantic'); });
    it('similar to X', () => { expect(classifyQueryIntent('find functions similar to parseFile').intent).toBe('semantic'); });
  });

  describe('maps structural queries to structural intent', () => {
    it('what calls', () => { expect(classifyQueryIntent('what calls parseFile').intent).toBe('structural'); });
    it('what imports', () => { expect(classifyQueryIntent('what imports this module').intent).toBe('structural'); });
    it('show outline', () => { expect(classifyQueryIntent('show outline of this file').intent).toBe('structural'); });
    it('file structure', () => { expect(classifyQueryIntent('show structure of this file').intent).toBe('structural'); });
    it('what extends', () => { expect(classifyQueryIntent('what extends BaseClass').intent).toBe('structural'); });
  });

  describe('maps session queries to hybrid intent', () => {
    it('previous work', () => { expect(classifyQueryIntent('what was I working on in the previous session').intent).toBe('hybrid'); });
    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
    it('prior decisions', () => { expect(classifyQueryIntent('what was the prior decision about auth').intent).toBe('hybrid'); });
  });
});

describe('agent routing validates classifier-backed intent mapping', () => {
  describe('semantic queries map to semantic intent', () => {
    it('explain error handling patterns', () => { expect(classifyQueryIntent('explain error handling patterns').intent).toBe('semantic'); });
    it('find similar authentication code', () => { expect(classifyQueryIntent('find similar authentication code').intent).toBe('semantic'); });
    it('what is the purpose of the budget allocator', () => { expect(classifyQueryIntent('what is the purpose of the budget allocator').intent).toBe('semantic'); });
  });

  describe('structural queries map to structural intent', () => {
    it('what calls allocateBudget', () => { expect(classifyQueryIntent('what calls allocateBudget').intent).toBe('structural'); });
    it('show outline of session-prime.ts', () => { expect(classifyQueryIntent('show outline of session-prime.ts').intent).toBe('structural'); });
    it('what implements the RuntimeInfo interface', () => { expect(classifyQueryIntent('what implements the RuntimeInfo interface').intent).toBe('structural'); });
  });

  describe('session queries map to hybrid intent', () => {
    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
    it('what was I doing last session', () => { expect(classifyQueryIntent('what was I doing last session').intent).toBe('hybrid'); });
  });

  describe('content-oriented queries still map to semantic intent', () => {
    it('explain the hook system purpose', () => { expect(classifyQueryIntent('explain the hook system purpose').intent).toBe('semantic'); });
    it('what is the purpose of the token budget', () => { expect(classifyQueryIntent('what is the purpose of the token budget').intent).toBe('semantic'); });
    it('where is authentication handled', () => { expect(classifyQueryIntent('where is authentication handled').intent).toBe('semantic'); });
  });

  describe('routing is case-insensitive', () => {
    it('WHAT CALLS parseFile → structural', () => { expect(classifyQueryIntent('WHAT CALLS parseFile').intent).toBe('structural'); });
    it('Find Similar Code → semantic', () => { expect(classifyQueryIntent('Find Similar Code').intent).toBe('semantic'); });
    it('Resume My Session → hybrid', () => { expect(classifyQueryIntent('Resume My Session').intent).toBe('hybrid'); });
  });
});
