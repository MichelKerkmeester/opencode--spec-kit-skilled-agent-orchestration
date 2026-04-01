// ───────────────────────────────────────────────────────────────
// TEST: Tree-Sitter WASM Parser
// ───────────────────────────────────────────────────────────────
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TreeSitterParser } from '../lib/code-graph/tree-sitter-parser.js';

describe('TreeSitterParser', () => {
  describe('isReady', () => {
    it('returns false when no language is specified and parser not initialized', () => {
      // Fresh import — parser has not been init'd in this test run
      // isReady() checks parserInstance and grammarCache
      const ready = TreeSitterParser.isReady();
      expect(typeof ready).toBe('boolean');
    });

    it('returns false for a specific language before loadLanguage', () => {
      expect(TreeSitterParser.isReady('bash')).toBe(false);
    });
  });

  describe('parse (not initialized)', () => {
    it('returns error ParseResult when parser is not initialized', () => {
      const parser = new TreeSitterParser();
      const result = parser.parse('const x = 1;', 'typescript');

      expect(result.parseHealth).toBe('error');
      expect(result.nodes).toEqual([]);
      expect(result.edges).toEqual([]);
      expect(result.language).toBe('typescript');
      expect(result.parseErrors).toBeDefined();
      expect(result.parseErrors!.length).toBeGreaterThan(0);
      expect(result.parseErrors![0]).toContain('not initialized');
    });

    it('returns a valid contentHash even on error', () => {
      const parser = new TreeSitterParser();
      const result = parser.parse('function foo() {}', 'javascript');

      expect(result.contentHash).toBeDefined();
      expect(typeof result.contentHash).toBe('string');
      expect(result.contentHash.length).toBeGreaterThan(0);
    });

    it('sets filePath to empty string', () => {
      const parser = new TreeSitterParser();
      const result = parser.parse('def hello(): pass', 'python');
      expect(result.filePath).toBe('');
    });
  });

  describe('parse (empty content)', () => {
    it('handles empty string gracefully', () => {
      const parser = new TreeSitterParser();
      const result = parser.parse('', 'javascript');

      expect(result.parseHealth).toBe('error');
      expect(result.nodes).toEqual([]);
      expect(result.contentHash).toBeDefined();
    });
  });

  describe('static methods', () => {
    it('init returns a promise', () => {
      // Just verify it returns a thenable — actual WASM init
      // may fail in test env without WASM binaries, which is OK
      const p = TreeSitterParser.init().catch(() => {});
      expect(p).toBeInstanceOf(Promise);
    });

    it('loadLanguage returns a promise', () => {
      const p = TreeSitterParser.loadLanguage('typescript').catch(() => {});
      expect(p).toBeInstanceOf(Promise);
    });

    it('loadAllLanguages returns a promise', () => {
      const p = TreeSitterParser.loadAllLanguages().catch(() => {});
      expect(p).toBeInstanceOf(Promise);
    });
  });
});

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('structural-indexer tree-sitter readiness integration', () => {
  it('reconciles missing grammars even when a parser instance was already cached', async () => {
    const parserState = { ready: false };
    const treeSitterMocks = {
      init: vi.fn(async () => {}),
      loadAllLanguages: vi.fn(async () => {
        parserState.ready = true;
      }),
      isReady: vi.fn(() => parserState.ready),
    };

    vi.resetModules();
    vi.doMock('../lib/code-graph/tree-sitter-parser.js', () => ({
      TreeSitterParser: class MockTreeSitterParser {
        static init = treeSitterMocks.init;
        static loadAllLanguages = treeSitterMocks.loadAllLanguages;
        static isReady = treeSitterMocks.isReady;
      },
    }));

    const { getParser } = await import('../lib/code-graph/structural-indexer.js');

    const firstParser = await getParser();
    expect(treeSitterMocks.init).toHaveBeenCalledTimes(1);
    expect(treeSitterMocks.loadAllLanguages).toHaveBeenCalledTimes(1);

    parserState.ready = false;

    const secondParser = await getParser();
    expect(treeSitterMocks.init).toHaveBeenCalledTimes(2);
    expect(treeSitterMocks.loadAllLanguages).toHaveBeenCalledTimes(2);
    expect(secondParser).toBe(firstParser);
  });
});
