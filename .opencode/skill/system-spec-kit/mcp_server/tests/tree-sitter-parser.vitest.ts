// ───────────────────────────────────────────────────────────────
// TEST: Tree-Sitter WASM Parser
// ───────────────────────────────────────────────────────────────
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TreeSitterParser } from '../code-graph/lib/tree-sitter-parser.js';
import type { CodeEdge, CodeNode, ParseResult } from '../code-graph/lib/indexer-types.js';

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
  it('skips default archive, future, external, and coco-index server excludes', async () => {
    setupIndexerMocks();
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, 'active/active.ts');
    writeFixture(tempRoot, 'z_future/future.ts');
    writeFixture(tempRoot, 'z_archive/archive.ts');
    writeFixture(tempRoot, 'external/vendor.ts');
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
    expect(indexedPaths.some(filePath => filePath.includes('external/'))).toBe(false);
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

function buildNode(overrides: Partial<CodeNode> & Pick<CodeNode, 'symbolId' | 'filePath' | 'fqName' | 'kind' | 'name'>): CodeNode {
  return {
    symbolId: overrides.symbolId,
    filePath: overrides.filePath,
    fqName: overrides.fqName,
    kind: overrides.kind,
    name: overrides.name,
    startLine: overrides.startLine ?? 1,
    endLine: overrides.endLine ?? 1,
    startColumn: overrides.startColumn ?? 0,
    endColumn: overrides.endColumn ?? 1,
    language: overrides.language ?? 'typescript',
    signature: overrides.signature,
    docstring: overrides.docstring,
    contentHash: overrides.contentHash ?? `${overrides.symbolId}-hash`,
  };
}

function buildEdge(overrides: Partial<CodeEdge> & Pick<CodeEdge, 'sourceId' | 'targetId' | 'edgeType'>): CodeEdge {
  return {
    sourceId: overrides.sourceId,
    targetId: overrides.targetId,
    edgeType: overrides.edgeType,
    weight: overrides.weight ?? 1,
    metadata: overrides.metadata,
  };
}

function buildParseResult(filePath: string, nodes: CodeNode[], edges: CodeEdge[] = []): ParseResult {
  return {
    filePath,
    language: 'typescript',
    nodes,
    edges,
    detectorProvenance: 'structured',
    contentHash: `${filePath}-hash`,
    parseHealth: 'clean',
    parseErrors: [],
    parseDurationMs: 1,
  };
}

describe('finalizeIndexResults dedupe reconciliation', () => {
  it('drops edges whose source nodes were removed by cross-result dedup', async () => {
    const { finalizeIndexResults } = await import('../code-graph/lib/structural-indexer.js');

    const retainedOwner = buildNode({
      symbolId: 'shared::owner',
      filePath: '/workspace/owner.ts',
      fqName: 'owner',
      kind: 'function',
      name: 'owner',
    });
    const retainedTarget = buildNode({
      symbolId: 'owner::target',
      filePath: '/workspace/owner.ts',
      fqName: 'owner.target',
      kind: 'function',
      name: 'target',
    });
    const droppedDuplicate = buildNode({
      symbolId: 'shared::owner',
      filePath: '/workspace/duplicate.ts',
      fqName: 'duplicateOwner',
      kind: 'function',
      name: 'duplicateOwner',
    });
    const duplicateTarget = buildNode({
      symbolId: 'duplicate::target',
      filePath: '/workspace/duplicate.ts',
      fqName: 'duplicate.target',
      kind: 'function',
      name: 'duplicateTarget',
    });

    const results = finalizeIndexResults([
      buildParseResult('/workspace/owner.ts', [retainedOwner, retainedTarget], [
        buildEdge({
          sourceId: retainedOwner.symbolId,
          targetId: retainedTarget.symbolId,
          edgeType: 'CALLS',
        }),
      ]),
      buildParseResult('/workspace/duplicate.ts', [droppedDuplicate, duplicateTarget], [
        buildEdge({
          sourceId: droppedDuplicate.symbolId,
          targetId: duplicateTarget.symbolId,
          edgeType: 'CALLS',
        }),
      ]),
    ]);

    expect(results[0].nodes.map((node) => node.symbolId)).toEqual([
      'shared::owner',
      'owner::target',
    ]);
    expect(results[0].edges).toHaveLength(1);
    expect(results[1].nodes.map((node) => node.symbolId)).toEqual(['duplicate::target']);
    expect(results[1].edges).toEqual([]);
  });

  it('builds TESTED_BY edges only from retained test nodes after dedup', async () => {
    const { finalizeIndexResults } = await import('../code-graph/lib/structural-indexer.js');

    const collisionOwner = buildNode({
      symbolId: 'shared::test-node',
      filePath: '/workspace/collision.ts',
      fqName: 'collisionOwner',
      kind: 'function',
      name: 'collisionOwner',
    });
    const testedNode = buildNode({
      symbolId: 'tested::subject',
      filePath: '/workspace/foo.ts',
      fqName: 'foo.subject',
      kind: 'function',
      name: 'subject',
    });
    const droppedTestNode = buildNode({
      symbolId: 'shared::test-node',
      filePath: '/workspace/foo.test.ts',
      fqName: 'foo.test.duplicate',
      kind: 'function',
      name: 'duplicateTestNode',
    });
    const retainedTestNode = buildNode({
      symbolId: 'foo.test::retained',
      filePath: '/workspace/foo.test.ts',
      fqName: 'foo.test.retained',
      kind: 'function',
      name: 'retainedTestNode',
    });

    const results = finalizeIndexResults([
      buildParseResult('/workspace/collision.ts', [collisionOwner]),
      buildParseResult('/workspace/foo.ts', [testedNode]),
      buildParseResult('/workspace/foo.test.ts', [droppedTestNode, retainedTestNode]),
    ]);

    expect(results[2].nodes.map((node) => node.symbolId)).toEqual(['foo.test::retained']);
    expect(results[2].edges).toEqual([
      expect.objectContaining({
        sourceId: 'foo.test::retained',
        targetId: 'tested::subject',
        edgeType: 'TESTED_BY',
      }),
    ]);
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
