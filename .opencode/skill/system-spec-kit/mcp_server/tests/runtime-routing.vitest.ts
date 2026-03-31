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
