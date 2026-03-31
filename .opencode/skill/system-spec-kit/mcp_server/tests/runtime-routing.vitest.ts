// ───────────────────────────────────────────────────────────────
// TEST: Query-Intent Routing
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';

/** Simple query-intent router for testing routing logic */
function routeQuery(query: string): 'cocoindex' | 'code_graph' | 'memory' {
  const structural = /what (calls|imports|extends|implements)|show.*outline|file structure|dependency/i;
  const session = /previous work|resume|last session|prior decision|what was I/i;
  if (structural.test(query)) return 'code_graph';
  if (session.test(query)) return 'memory';
  return 'cocoindex';
}

describe('query-intent routing', () => {
  describe('routes semantic queries to CocoIndex', () => {
    it('find code queries', () => { expect(routeQuery('find code that handles authentication')).toBe('cocoindex'); });
    it('how is X implemented', () => { expect(routeQuery('how is retry logic implemented')).toBe('cocoindex'); });
    it('similar to X', () => { expect(routeQuery('find functions similar to parseFile')).toBe('cocoindex'); });
  });

  describe('routes structural queries to code graph', () => {
    it('what calls', () => { expect(routeQuery('what calls parseFile')).toBe('code_graph'); });
    it('what imports', () => { expect(routeQuery('what imports this module')).toBe('code_graph'); });
    it('show outline', () => { expect(routeQuery('show file outline')).toBe('code_graph'); });
    it('file structure', () => { expect(routeQuery('show me the file structure')).toBe('code_graph'); });
    it('what extends', () => { expect(routeQuery('what extends BaseClass')).toBe('code_graph'); });
  });

  describe('routes session queries to memory', () => {
    it('previous work', () => { expect(routeQuery('what was I working on in the previous session')).toBe('memory'); });
    it('resume', () => { expect(routeQuery('resume my last session')).toBe('memory'); });
    it('prior decisions', () => { expect(routeQuery('what was the prior decision about auth')).toBe('memory'); });
  });
});

describe('agent routing validates CocoIndex-first behavior', () => {
  describe('semantic queries default to CocoIndex', () => {
    it('explain error handling patterns', () => { expect(routeQuery('explain error handling patterns')).toBe('cocoindex'); });
    it('find similar authentication code', () => { expect(routeQuery('find similar authentication code')).toBe('cocoindex'); });
    it('what does the budget allocator do', () => { expect(routeQuery('what does the budget allocator do')).toBe('cocoindex'); });
  });

  describe('structural queries go to code_graph, not CocoIndex', () => {
    it('what calls allocateBudget', () => { expect(routeQuery('what calls allocateBudget')).toBe('code_graph'); });
    it('show outline of session-prime.ts', () => { expect(routeQuery('show outline of session-prime.ts')).toBe('code_graph'); });
    it('what implements the RuntimeInfo interface', () => { expect(routeQuery('what implements the RuntimeInfo interface')).toBe('code_graph'); });
  });

  describe('session queries bypass both CocoIndex and code_graph', () => {
    it('resume my previous work', () => { expect(routeQuery('resume my previous work')).toBe('memory'); });
    it('what was I doing last session', () => { expect(routeQuery('what was I doing last session')).toBe('memory'); });
  });

  describe('ambiguous queries favor CocoIndex', () => {
    it('how does the hook system work', () => { expect(routeQuery('how does the hook system work')).toBe('cocoindex'); });
    it('tell me about the token budget', () => { expect(routeQuery('tell me about the token budget')).toBe('cocoindex'); });
    it('where is authentication handled', () => { expect(routeQuery('where is authentication handled')).toBe('cocoindex'); });
  });

  describe('routing is case-insensitive', () => {
    it('WHAT CALLS parseFile → code_graph', () => { expect(routeQuery('WHAT CALLS parseFile')).toBe('code_graph'); });
    it('Find Similar Code → cocoindex', () => { expect(routeQuery('Find Similar Code')).toBe('cocoindex'); });
    it('Resume My Session → memory', () => { expect(routeQuery('Resume My Session')).toBe('memory'); });
  });
});
