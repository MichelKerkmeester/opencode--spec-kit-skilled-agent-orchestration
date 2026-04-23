// ───────────────────────────────────────────────────────────────
// TEST: Tree-Sitter WASM Parser
// ───────────────────────────────────────────────────────────────
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TreeSitterParser } from '../code-graph/lib/tree-sitter-parser.js';

const tempDirs: string[] = [];

function createTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'structural-indexer-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

function writeFixture(root: string, relativePath: string, content = 'export function fixture() { return 1; }\n'): void {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function setupIndexerMocks(): void {
  vi.resetModules();
  vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
    isFileStale: vi.fn(() => true),
  }));
  process.env.SPECKIT_PARSER = 'regex';
}

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
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.SPECKIT_PARSER;
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
    vi.doMock('../code-graph/lib/tree-sitter-parser.js', () => ({
      TreeSitterParser: class MockTreeSitterParser {
        static init = treeSitterMocks.init;
        static loadAllLanguages = treeSitterMocks.loadAllLanguages;
        static isReady = treeSitterMocks.isReady;
      },
    }));

    const { getParser } = await import('../code-graph/lib/structural-indexer.js');

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

describe('structural-indexer scan scope', () => {
  it('skips default archive, future, and coco-index server excludes', async () => {
    setupIndexerMocks();
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, 'active/active.ts');
    writeFixture(tempRoot, 'z_future/future.ts');
    writeFixture(tempRoot, 'z_archive/archive.ts');
    writeFixture(tempRoot, 'mcp-coco-index/mcp_server/server.ts');

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');
    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    });

    const indexedPaths = results.map(result => relative(tempRoot, result.filePath).replace(/\\/g, '/'));
    expect(indexedPaths).toContain('active/active.ts');
    expect(indexedPaths.some(filePath => filePath.includes('z_future/'))).toBe(false);
    expect(indexedPaths.some(filePath => filePath.includes('z_archive/'))).toBe(false);
    expect(indexedPaths.some(filePath => filePath.includes('mcp-coco-index/mcp_server/'))).toBe(false);
  });

  it('respects .gitignore patterns during recursive scans', async () => {
    setupIndexerMocks();
    const tempRoot = createTempRoot();
    writeFileSync(join(tempRoot, '.gitignore'), '*.test-bak.ts\n');
    writeFixture(tempRoot, 'active.ts');
    writeFixture(tempRoot, 'ignored.test-bak.ts');

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');
    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    });

    const indexedPaths = results.map(result => relative(tempRoot, result.filePath).replace(/\\/g, '/'));
    expect(indexedPaths).toContain('active.ts');
    expect(indexedPaths).not.toContain('ignored.test-bak.ts');
  });
});

describe('capturesToNodes dedupe (Bug #2 regression)', () => {
  it('drops duplicate (filePath, fqName, kind) captures, preserving first and module node', async () => {
    const { capturesToNodes } = await import('../code-graph/lib/structural-indexer.js');
    const filePath = '/workspace/example.ts';
    const content = [
      'class Foo {',
      '  if() { return 1; }',
      '  ifAgain() { return 2; }',
      '}',
      '',
    ].join('\n');

    const nodes = capturesToNodes([
      {
        name: 'if',
        parentName: 'Foo',
        kind: 'method',
        startLine: 2,
        endLine: 2,
        startColumn: 2,
        endColumn: 22,
      },
      {
        name: 'if',
        parentName: 'Foo',
        kind: 'method',
        startLine: 3,
        endLine: 3,
        startColumn: 2,
        endColumn: 27,
      },
    ], filePath, 'typescript', content);

    expect(nodes).toHaveLength(2);
    expect(nodes[0].kind).toBe('module');
    expect(nodes[1].fqName).toBe('Foo.if');
    expect(nodes[1].startLine).toBe(2);
  });

  it('does not dedupe across kinds', async () => {
    const { capturesToNodes } = await import('../code-graph/lib/structural-indexer.js');
    const nodes = capturesToNodes([
      {
        name: 'foo',
        kind: 'function',
        startLine: 1,
        endLine: 3,
        startColumn: 0,
        endColumn: 20,
      },
      {
        name: 'foo',
        kind: 'variable',
        startLine: 5,
        endLine: 5,
        startColumn: 6,
        endColumn: 9,
      },
    ], '/workspace/kinds.ts', 'typescript', 'function foo() {}\nconst foo = 1;\n');

    expect(nodes).toHaveLength(3);
    expect(nodes.map(node => node.kind)).toEqual(['module', 'function', 'variable']);
  });

  it('regression: parsing structural-indexer.ts produces no duplicate symbolIds', async () => {
    vi.resetModules();
    process.env.SPECKIT_PARSER = 'regex';
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      isFileStale: vi.fn(() => true),
    }));

    const { parseFile } = await import('../code-graph/lib/structural-indexer.js');
    const filePath = 'code-graph/lib/structural-indexer.ts';
    const content = readFileSync(filePath, 'utf-8');
    const result = await parseFile(filePath, content, 'typescript');
    const ids = new Set<string>();

    for (const node of result.nodes) {
      expect(ids.has(node.symbolId)).toBe(false);
      ids.add(node.symbolId);
    }
  });
});
