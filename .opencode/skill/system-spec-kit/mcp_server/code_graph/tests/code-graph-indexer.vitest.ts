// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Indexer Tests
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Structural Indexer
// ───────────────────────────────────────────────────────────────
import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  generateSymbolId,
  generateContentHash,
  detectLanguage,
  getDefaultConfig,
} from '../lib/indexer-types.js';
import {
  closeDb,
  ensureFreshFiles,
  getDb,
  initDb,
  isFileStale,
  upsertFile,
} from '../lib/code-graph-db.js';
import {
  capturesToNodes,
  finalizeIndexResults,
  parseFile,
  extractEdges,
  getRequestedParserBackend,
  rememberParseResultCaptures,
  type ModuleResolver,
  type RawCapture,
} from '../lib/structural-indexer.js';
import type { ParseResult } from '../lib/indexer-types.js';

function writeWorkspaceFile(rootDir: string, relativePath: string, content: string): string {
  const filePath = join(rootDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

function buildParseResult(
  filePath: string,
  content: string,
  captures: RawCapture[],
): ParseResult {
  const nodes = capturesToNodes(captures, filePath, 'typescript', content);
  const edges = extractEdges(nodes, content.split('\n'), captures);
  return rememberParseResultCaptures({
    filePath,
    language: 'typescript',
    nodes,
    edges,
    detectorProvenance: 'structured',
    contentHash: generateContentHash(content),
    parseHealth: 'clean',
    parseErrors: [],
    parseDurationMs: 1,
  }, captures);
}

function mapResolver(entries: Record<string, string>): ModuleResolver {
  return {
    resolve(_fromFile: string, specifier: string): string | undefined {
      return entries[specifier];
    },
  };
}

afterEach(() => {
  try {
    closeDb();
  } catch {
    // best-effort cleanup for singleton DB state between tests
  }
});

describe('indexer-types', () => {
  describe('generateSymbolId', () => {
    it('returns a 16-char hex string', () => {
      const id = generateSymbolId('/test.ts', 'myFunc', 'function');
      expect(id).toMatch(/^[a-f0-9]{16}$/);
    });

    it('is deterministic', () => {
      const a = generateSymbolId('/test.ts', 'myFunc', 'function');
      const b = generateSymbolId('/test.ts', 'myFunc', 'function');
      expect(a).toBe(b);
    });

    it('differs for different inputs', () => {
      const a = generateSymbolId('/test.ts', 'myFunc', 'function');
      const b = generateSymbolId('/test.ts', 'otherFunc', 'function');
      expect(a).not.toBe(b);
    });
  });

  describe('generateContentHash', () => {
    it('returns a 12-char hex string', () => {
      const hash = generateContentHash('some content');
      expect(hash).toMatch(/^[a-f0-9]{12}$/);
    });

    it('marks a same-mtime file stale when its content hash changes', () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-hash-stale-'));
      try {
        initDb(tempDir);
        const filePath = writeWorkspaceFile(tempDir, 'tracked.ts', 'export const value = 1;\n');
        const fixedTime = new Date('2026-01-01T00:00:00.000Z');
        utimesSync(filePath, fixedTime, fixedTime);

        upsertFile(
          filePath,
          'typescript',
          generateContentHash('export const value = 1;\n'),
          0,
          0,
          'clean',
          1,
        );

        writeFileSync(filePath, 'export const value = 2;\n');
        utimesSync(filePath, fixedTime, fixedTime);

        expect(Math.trunc(statSync(filePath).mtimeMs)).toBe(Math.trunc(fixedTime.getTime()));
        expect(isFileStale(filePath)).toBe(true);
        expect(ensureFreshFiles([filePath])).toEqual({
          stale: [filePath],
          fresh: [],
        });
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('treats missing stored hashes as stale so the next scan can backfill them', () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-hash-missing-'));
      try {
        initDb(tempDir);
        const filePath = writeWorkspaceFile(tempDir, 'tracked.ts', 'export const value = 1;\n');

        upsertFile(
          filePath,
          'typescript',
          generateContentHash('export const value = 1;\n'),
          0,
          0,
          'clean',
          1,
        );
        getDb().prepare('UPDATE code_files SET content_hash = ? WHERE file_path = ?').run('', filePath);

        expect(isFileStale(filePath)).toBe(true);
        expect(ensureFreshFiles([filePath])).toEqual({
          stale: [filePath],
          fresh: [],
        });
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('keeps unchanged content fresh when both mtime and hash still match', () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-hash-fresh-'));
      try {
        initDb(tempDir);
        const content = 'export const value = 1;\n';
        const filePath = writeWorkspaceFile(tempDir, 'tracked.ts', content);

        upsertFile(
          filePath,
          'typescript',
          generateContentHash(content),
          0,
          0,
          'clean',
          1,
        );

        expect(isFileStale(filePath)).toBe(false);
        expect(ensureFreshFiles([filePath])).toEqual({
          stale: [],
          fresh: [filePath],
        });
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('detectLanguage', () => {
    it('detects TypeScript', () => {
      expect(detectLanguage('file.ts')).toBe('typescript');
      expect(detectLanguage('file.tsx')).toBe('typescript');
    });

    it('detects JavaScript', () => {
      expect(detectLanguage('file.js')).toBe('javascript');
      expect(detectLanguage('file.mjs')).toBe('javascript');
    });

    it('detects Python', () => {
      expect(detectLanguage('file.py')).toBe('python');
    });

    it('detects Bash', () => {
      expect(detectLanguage('file.sh')).toBe('bash');
    });

    it('returns null for unknown', () => {
      expect(detectLanguage('file.rs')).toBeNull();
      expect(detectLanguage('file.go')).toBeNull();
    });
  });

  describe('getDefaultConfig', () => {
    it('returns valid config', () => {
      const config = getDefaultConfig('/root');
      expect(config.rootDir).toBe('/root');
      expect(config.includeGlobs.length).toBeGreaterThan(0);
      expect(config.excludeGlobs.length).toBeGreaterThan(0);
      expect(config.maxFileSizeBytes).toBe(102400);
    });
  });
});

describe('structural-indexer', () => {
  describe('parseFile - TypeScript', () => {
    it('extracts functions', async () => {
      const content = `export function myFunc(arg: string): void {}\nasync function other() {}`;
      const result = await parseFile('/test.ts', content, 'typescript');
      expect(result.parseHealth).toBe('clean');
      const funcNames = result.nodes.filter(n => n.kind === 'function').map(n => n.name);
      expect(funcNames).toContain('myFunc');
      expect(funcNames).toContain('other');
    });

    it('extracts classes', async () => {
      const content = `export class MyClass extends Base {}`;
      const result = await parseFile('/test.ts', content, 'typescript');
      const classes = result.nodes.filter(n => n.kind === 'class');
      expect(classes.length).toBe(1);
      expect(classes[0].name).toBe('MyClass');
    });

    it('extracts interfaces', async () => {
      const content = `export interface Config { name: string; }`;
      const result = await parseFile('/test.ts', content, 'typescript');
      const ifaces = result.nodes.filter(n => n.kind === 'interface');
      expect(ifaces.length).toBe(1);
      expect(ifaces[0].name).toBe('Config');
    });

    it('extracts imports', async () => {
      const content = `import { readFileSync } from 'node:fs';`;
      const result = await parseFile('/test.ts', content, 'typescript');
      const imports = result.nodes.filter(n => n.kind === 'import');
      expect(imports.length).toBe(1);
      expect(imports[0].name).toBe('readFileSync');
    });

    it('resolves type-only imports to the exported symbol and preserves the import kind metadata', () => {
      const typeFilePath = '/workspace/src/types.ts';
      const consumerFilePath = '/workspace/src/consumer.ts';
      const typeResult = buildParseResult(
        typeFilePath,
        'export interface Foo { value: number; }\n',
        [{
          name: 'Foo',
          kind: 'interface',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 38,
        }],
      );
      const consumerResult = buildParseResult(
        consumerFilePath,
        "import type { Foo } from './types';\nexport type Local = Foo;\n",
        [{
          name: 'Foo',
          kind: 'import',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 35,
          moduleSpecifier: './types',
          importKind: 'type',
        }],
      );

      const finalized = finalizeIndexResults(
        [typeResult, consumerResult],
        mapResolver({ './types': typeFilePath }),
      );
      const fooNode = finalized[0].nodes.find((node) => node.name === 'Foo' && node.kind === 'interface');
      const importEdge = finalized[1].edges.find((edge) => edge.edgeType === 'IMPORTS');

      expect(fooNode).toBeDefined();
      expect(importEdge).toMatchObject({
        targetId: fooNode?.symbolId,
        metadata: {
          moduleSpecifier: './types',
          importKind: 'type',
          resolvedFilePath: typeFilePath,
        },
      });
    });

    it('resolves path-alias imports through the configured module resolver', () => {
      const targetFilePath = '/workspace/src/dep.ts';
      const consumerFilePath = '/workspace/src/consumer.ts';
      const targetResult = buildParseResult(
        targetFilePath,
        'export function aliasedDep(): number { return 1; }\n',
        [{
          name: 'aliasedDep',
          kind: 'function',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 49,
        }],
      );
      const consumerResult = buildParseResult(
        consumerFilePath,
        "import { aliasedDep } from '@alias/dep';\nexport function useDep() { return aliasedDep(); }\n",
        [{
          name: 'aliasedDep',
          kind: 'import',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 40,
          moduleSpecifier: '@alias/dep',
          importKind: 'value',
        }],
      );

      const finalized = finalizeIndexResults(
        [targetResult, consumerResult],
        mapResolver({ '@alias/dep': targetFilePath }),
      );
      const depNode = finalized[0].nodes.find((node) => node.name === 'aliasedDep' && node.kind === 'function');

      expect(finalized[1].edges).toContainEqual(expect.objectContaining({
        edgeType: 'IMPORTS',
        targetId: depNode?.symbolId,
        metadata: expect.objectContaining({
          moduleSpecifier: '@alias/dep',
          resolvedFilePath: targetFilePath,
        }),
      }));
    });

    it('follows named re-export barrels back to the original exported symbol', () => {
      const sourceFilePath = '/workspace/src/foo.ts';
      const barrelFilePath = '/workspace/src/index.ts';
      const consumerFilePath = '/workspace/src/consumer.ts';
      const sourceResult = buildParseResult(
        sourceFilePath,
        'export interface Foo { value: number; }\n',
        [{
          name: 'Foo',
          kind: 'interface',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 38,
        }],
      );
      const barrelResult = buildParseResult(
        barrelFilePath,
        "export { Foo } from './foo';\n",
        [{
          name: 'Foo',
          kind: 'export',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 28,
          moduleSpecifier: './foo',
          exportKind: 'named',
        }],
      );
      const consumerResult = buildParseResult(
        consumerFilePath,
        "import { Foo } from './index';\nexport const value: Foo = { value: 1 };\n",
        [{
          name: 'Foo',
          kind: 'import',
          startLine: 1,
          endLine: 1,
          startColumn: 0,
          endColumn: 29,
          moduleSpecifier: './index',
          importKind: 'value',
        }],
      );

      const finalized = finalizeIndexResults(
        [sourceResult, barrelResult, consumerResult],
        mapResolver({
          './foo': sourceFilePath,
          './index': barrelFilePath,
        }),
      );
      const fooNode = finalized[0].nodes.find((node) => node.name === 'Foo' && node.kind === 'interface');
      const importEdge = finalized[2].edges.find((edge) => edge.edgeType === 'IMPORTS');

      expect(importEdge).toMatchObject({
        targetId: fooNode?.symbolId,
        metadata: {
          moduleSpecifier: './index',
          resolvedFilePath: barrelFilePath,
          resolvedSymbolFilePath: sourceFilePath,
        },
      });
    });

    it('handles empty files', async () => {
      const result = await parseFile('/empty.ts', '', 'typescript');
      expect(result.parseHealth).toBe('recovered');
      expect(result.nodes.length).toBe(0);
    });
  });

  describe('parseFile - Python', () => {
    it('extracts functions and classes', async () => {
      const content = `def hello():\n    pass\n\nclass MyClass:\n    def method(self):\n        pass`;
      const result = await parseFile('/test.py', content, 'python');
      expect(result.nodes.filter(n => n.kind === 'function').length).toBe(1);
      expect(result.nodes.filter(n => n.kind === 'class').length).toBe(1);
      expect(result.nodes.filter(n => n.kind === 'method').length).toBe(1);
    });
  });

  describe('parseFile - Bash', () => {
    it('extracts functions', async () => {
      const content = `#!/bin/bash\nmy_func() {\n  echo hello\n}\nfunction other_func() {\n  echo world\n}`;
      const result = await parseFile('/test.sh', content, 'bash');
      const funcs = result.nodes.filter(n => n.kind === 'function');
      expect(funcs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractEdges', () => {
    it('creates CONTAINS edges for class methods', async () => {
      const content = `class Foo {\n  bar() {}\n}`;
      // We need Python to get methods with parentName
      const pyContent = `class Foo:\n    def bar(self):\n        pass`;
      const result = await parseFile('/test.py', pyContent, 'python');
      expect(result.edges.some(e => e.edgeType === 'CONTAINS')).toBe(true);
    });

    it('serializes structured and heuristic detector provenance honestly on regex-backed edges', async () => {
      const previousParser = process.env.SPECKIT_PARSER;
      process.env.SPECKIT_PARSER = 'regex';

      try {
        const content = [
          "import { dep } from './dep';",
          'function dep() {}',
          'function useDep() {',
          '  dep();',
          '}',
        ].join('\n');

        const result = await parseFile('/test.ts', content, 'typescript');
        const importEdge = result.edges.find((edge) => edge.edgeType === 'IMPORTS');
        const callEdge = result.edges.find((edge) => edge.edgeType === 'CALLS');

        expect(importEdge?.metadata).toMatchObject({
          detectorProvenance: 'structured',
          evidenceClass: 'EXTRACTED',
          confidence: 1,
          reason: 'structured-structural-extraction',
          step: 'extract',
        });
        expect(callEdge?.metadata).toMatchObject({
          detectorProvenance: 'heuristic',
          evidenceClass: 'INFERRED',
          confidence: 0.8,
          reason: 'heuristic-name-match',
          step: 'resolve',
        });
      } finally {
        if (previousParser === undefined) {
          delete process.env.SPECKIT_PARSER;
        } else {
          process.env.SPECKIT_PARSER = previousParser;
        }
      }
    });

    it('round-trips graph-local reason and step metadata on extracted edges', async () => {
      const previousParser = process.env.SPECKIT_PARSER;
      process.env.SPECKIT_PARSER = 'regex';

      try {
        const content = [
          "import { dep } from './dep';",
          'function dep() {}',
        ].join('\n');
        const result = await parseFile('/test.ts', content, 'typescript');
        const importEdge = result.edges.find((edge) => edge.edgeType === 'IMPORTS');

        expect(importEdge?.metadata).toMatchObject({
          confidence: 1,
          detectorProvenance: 'structured',
          evidenceClass: 'EXTRACTED',
          reason: 'structured-structural-extraction',
          step: 'extract',
        });
      } finally {
        if (previousParser === undefined) {
          delete process.env.SPECKIT_PARSER;
        } else {
          process.env.SPECKIT_PARSER = previousParser;
        }
      }
    });
  });

  describe('graph-local parser selector', () => {
    it('uses SPECKIT_PARSER to expose the requested backend without inventing a new routing surface', () => {
      const previousParser = process.env.SPECKIT_PARSER;

      process.env.SPECKIT_PARSER = 'regex';
      expect(getRequestedParserBackend()).toBe('regex');

      process.env.SPECKIT_PARSER = 'treesitter';
      expect(getRequestedParserBackend()).toBe('treesitter');

      if (previousParser === undefined) {
        delete process.env.SPECKIT_PARSER;
      } else {
        process.env.SPECKIT_PARSER = previousParser;
      }
    });
  });
});
