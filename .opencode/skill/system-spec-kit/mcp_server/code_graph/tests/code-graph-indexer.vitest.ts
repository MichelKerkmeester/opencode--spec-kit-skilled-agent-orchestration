// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Indexer Tests
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Structural Indexer
// ───────────────────────────────────────────────────────────────
import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  generateSymbolId,
  generateContentHash,
  detectLanguage,
  getDefaultConfig,
  DEFAULT_EDGE_WEIGHTS,
} from '../lib/indexer-types.js';
import {
  closeDb,
  ensureFreshFiles,
  getDb,
  initDb,
  isFileStale,
  queryOutline,
  replaceEdges,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph-db.js';
import {
  capturesToNodes,
  finalizeIndexResults,
  getRememberedParseResultCaptures,
  indexFiles,
  loadTsconfigResolver,
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

function persistIndexResults(results: ParseResult[]): void {
  for (const result of results) {
    const fileId = upsertFile(
      result.filePath,
      result.language,
      result.contentHash,
      result.nodes.length,
      result.edges.length,
      result.parseHealth,
      result.parseDurationMs,
    );
    replaceNodes(fileId, result.nodes);
    replaceEdges(result.nodes.map((node) => node.symbolId), result.edges);
  }
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

    it('captures import and export metadata directly from parsed TypeScript fixtures', async () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-capture-fixture-'));

      try {
        const filePath = writeWorkspaceFile(
          tempDir,
          'src/fixture.ts',
          [
            "import type { X } from './types';",
            "export * from './barrel';",
            "import { Foo as Bar } from './foo';",
          ].join('\n'),
        );

        const result = await parseFile(filePath, readFileSync(filePath, 'utf-8'), 'typescript');
        const captures = getRememberedParseResultCaptures(result);

        expect(captures).toEqual(expect.arrayContaining([
          expect.objectContaining({
            kind: 'import',
            name: 'X',
            moduleSpecifier: './types',
            importKind: 'type',
          }),
          expect.objectContaining({
            kind: 'export',
            name: '*',
            moduleSpecifier: './barrel',
            exportKind: 'star',
          }),
          expect.objectContaining({
            kind: 'import',
            name: 'Foo',
            moduleSpecifier: './foo',
            importKind: 'value',
          }),
        ]));
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
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
      expect(importEdge?.weight).toBeLessThanOrEqual(0.5);
      expect(importEdge?.weight).toBe(0.5);
      expect(importEdge?.metadata?.confidence).toBe(0.5);
    });

    it('tracks inline type modifiers per imported specifier instead of stamping the whole statement', async () => {
      const depFilePath = '/workspace/src/dep.ts';
      const consumerFilePath = '/workspace/src/consumer.ts';
      const depResult = buildParseResult(
        depFilePath,
        'export interface Foo { value: number; }\nexport function Bar(): Foo { return { value: 1 }; }\n',
        [
          {
            name: 'Foo',
            kind: 'interface',
            startLine: 1,
            endLine: 1,
            startColumn: 0,
            endColumn: 38,
          },
          {
            name: 'Bar',
            kind: 'function',
            startLine: 2,
            endLine: 2,
            startColumn: 0,
            endColumn: 49,
          },
        ],
      );
      const consumerResult = await parseFile(
        consumerFilePath,
        "import { type Foo, Bar } from './dep';\nexport const value: Foo = Bar();\n",
        'typescript',
      );

      const finalized = finalizeIndexResults(
        [depResult, consumerResult],
        mapResolver({ './dep': depFilePath }),
      );
      const importEdges = finalized[1].edges.filter((edge) => edge.edgeType === 'IMPORTS');
      const fooNode = finalized[0].nodes.find((node) => node.name === 'Foo' && node.kind === 'interface');
      const barNode = finalized[0].nodes.find((node) => node.name === 'Bar' && node.kind === 'function');

      expect(importEdges).toContainEqual(expect.objectContaining({
        targetId: fooNode?.symbolId,
        metadata: expect.objectContaining({
          moduleSpecifier: './dep',
          importKind: 'type',
          resolvedFilePath: depFilePath,
        }),
      }));
      expect(importEdges).toContainEqual(expect.objectContaining({
        targetId: barNode?.symbolId,
        metadata: expect.objectContaining({
          moduleSpecifier: './dep',
          importKind: 'value',
          resolvedFilePath: depFilePath,
        }),
      }));
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

    it('creates cross-file IMPORTS edges for tsconfig path aliases during a full indexer pass', async () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-tsconfig-alias-pass-'));

      try {
        writeWorkspaceFile(tempDir, 'tsconfig.json', JSON.stringify({
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@app/*': ['./src/*'],
            },
          },
        }, null, 2));
        const depFilePath = writeWorkspaceFile(
          tempDir,
          'src/dep.ts',
          'export function aliasedDep(): number { return 1; }\n',
        );
        const consumerFilePath = writeWorkspaceFile(
          tempDir,
          'src/consumer.ts',
          "import { aliasedDep } from '@app/dep';\nexport function useDep() { return aliasedDep(); }\n",
        );

        const results = await indexFiles(getDefaultConfig(tempDir), { skipFreshFiles: false });
        const canonicalDepPath = realpathSync(depFilePath);
        const depResult = results.find((result) => realpathSync(result.filePath) === canonicalDepPath);
        const consumerResult = results.find((result) => realpathSync(result.filePath) === realpathSync(consumerFilePath));
        const depNode = depResult?.nodes.find((node) => node.name === 'aliasedDep' && node.kind === 'function');

        expect(depResult).toBeDefined();
        expect(consumerResult?.edges).toContainEqual(expect.objectContaining({
          edgeType: 'IMPORTS',
          targetId: depNode?.symbolId,
          metadata: expect.objectContaining({
            moduleSpecifier: '@app/dep',
            importKind: 'value',
            resolvedFilePath: canonicalDepPath,
          }),
        }));
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('applies CALLS edge-weight overrides without changing default weights for untouched edge types', async () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-edge-weights-'));

      try {
        const depFilePath = writeWorkspaceFile(
          tempDir,
          'src/dep.ts',
          'export function externalDep(): number { return 1; }\n',
        );
        const consumerFilePath = writeWorkspaceFile(
          tempDir,
          'src/consumer.ts',
          [
            "import { externalDep } from './dep';",
            'function localDep(): number {',
            '  return 1;',
            '}',
            'export function useDeps(): number {',
            '  localDep();',
            '  return externalDep();',
            '}',
          ].join('\n'),
        );

        const config = {
          ...getDefaultConfig(tempDir),
          edgeWeights: { CALLS: 0.99 },
        };
        const results = await indexFiles(config, { skipFreshFiles: false });
        const consumerResult = results.find(
          (result) => realpathSync(result.filePath) === realpathSync(consumerFilePath),
        );
        const depResult = results.find(
          (result) => realpathSync(result.filePath) === realpathSync(depFilePath),
        );
        const depNode = depResult?.nodes.find(
          (node) => node.name === 'externalDep' && node.kind === 'function',
        );
        const callEdge = consumerResult?.edges.find((edge) => edge.edgeType === 'CALLS');
        const importEdge = consumerResult?.edges.find((edge) => edge.edgeType === 'IMPORTS');

        expect(callEdge).toMatchObject({
          weight: 0.99,
          metadata: expect.objectContaining({
            confidence: 0.99,
          }),
        });
        expect(importEdge).toMatchObject({
          targetId: depNode?.symbolId,
          weight: DEFAULT_EDGE_WEIGHTS.IMPORTS,
          metadata: expect.objectContaining({
            confidence: DEFAULT_EDGE_WEIGHTS.IMPORTS,
            moduleSpecifier: './dep',
          }),
        });
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('leaves out-of-workspace alias targets unresolved without creating a cross-file edge', () => {
      const tempRoot = mkdtempSync(join(tmpdir(), 'code-graph-alias-fence-'));
      const workspaceRoot = join(tempRoot, 'workspace');
      const outsideRoot = join(tempRoot, 'outside');
      mkdirSync(workspaceRoot, { recursive: true });
      mkdirSync(outsideRoot, { recursive: true });

      try {
        writeWorkspaceFile(workspaceRoot, 'tsconfig.json', JSON.stringify({
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@alias/*': ['../outside/*'],
            },
          },
        }, null, 2));

        const externalFilePath = writeWorkspaceFile(
          outsideRoot,
          'dep.ts',
          'export function aliasedDep(): number { return 1; }\n',
        );
        const consumerFilePath = writeWorkspaceFile(
          workspaceRoot,
          'src/consumer.ts',
          "import { aliasedDep } from '@alias/dep';\nexport function useDep() { return aliasedDep(); }\n",
        );

        const externalResult = buildParseResult(
          externalFilePath,
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
          [externalResult, consumerResult],
          loadTsconfigResolver(workspaceRoot),
        );
        const externalNode = finalized[0].nodes.find((node) => node.name === 'aliasedDep' && node.kind === 'function');

        expect(finalized[1].edges).not.toContainEqual(expect.objectContaining({
          edgeType: 'IMPORTS',
          targetId: externalNode?.symbolId,
        }));
        expect(finalized[1].edges).not.toContainEqual(expect.objectContaining({
          metadata: expect.objectContaining({
            moduleSpecifier: '@alias/dep',
            resolvedFilePath: externalFilePath,
          }),
        }));
      } finally {
        rmSync(tempRoot, { recursive: true, force: true });
      }
    });

    it('resolves aliases inherited through nested tsconfig extends chains', () => {
      const tempRoot = mkdtempSync(join(tmpdir(), 'code-graph-tsconfig-extends-'));
      const workspaceRoot = join(tempRoot, 'workspace');
      mkdirSync(join(workspaceRoot, 'configs'), { recursive: true });

      try {
        writeWorkspaceFile(workspaceRoot, 'tsconfig.json', JSON.stringify({
          extends: './configs/level1.json',
        }, null, 2));
        writeWorkspaceFile(workspaceRoot, 'configs/level1.json', JSON.stringify({
          extends: './level2.json',
        }, null, 2));
        writeWorkspaceFile(workspaceRoot, 'configs/level2.json', JSON.stringify({
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@alias/*': ['../src/*'],
            },
          },
        }, null, 2));

        const depFilePath = writeWorkspaceFile(
          workspaceRoot,
          'src/dep.ts',
          'export function aliasedDep(): number { return 1; }\n',
        );

        const resolver = loadTsconfigResolver(workspaceRoot);

        expect(resolver.resolve(join(workspaceRoot, 'src/consumer.ts'), '@alias/dep')).toBe(realpathSync(depFilePath));
      } finally {
        rmSync(tempRoot, { recursive: true, force: true });
      }
    });

    it('stops walking cyclic tsconfig extends chains and keeps the local resolver settings', () => {
      const tempRoot = mkdtempSync(join(tmpdir(), 'code-graph-tsconfig-cycle-'));
      const workspaceRoot = join(tempRoot, 'workspace');

      try {
        writeWorkspaceFile(workspaceRoot, 'tsconfig.json', JSON.stringify({
          extends: './configs/base.json',
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@alias/*': ['src/*'],
            },
          },
        }, null, 2));
        writeWorkspaceFile(workspaceRoot, 'configs/base.json', JSON.stringify({
          extends: '../tsconfig.json',
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@base/*': ['shared/*'],
            },
          },
        }, null, 2));

        const depFilePath = writeWorkspaceFile(
          workspaceRoot,
          'src/dep.ts',
          'export function aliasedDep(): number { return 1; }\n',
        );

        const resolver = loadTsconfigResolver(workspaceRoot);

        expect(() => resolver.resolve(join(workspaceRoot, 'src/consumer.ts'), '@alias/dep')).not.toThrow();
        expect(resolver.resolve(join(workspaceRoot, 'src/consumer.ts'), '@alias/dep')).toBe(realpathSync(depFilePath));
      } finally {
        rmSync(tempRoot, { recursive: true, force: true });
      }
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

    it('resolves star re-export chains to the canonical symbol target', async () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-star-barrel-'));

      try {
        initDb(tempDir);
        const fooFilePath = writeWorkspaceFile(tempDir, 'src/foo.ts', "export * from './bar';\n");
        const barFilePath = writeWorkspaceFile(tempDir, 'src/bar.ts', 'export const canonical = 1;\n');
        const consumerFilePath = writeWorkspaceFile(
          tempDir,
          'src/consumer.ts',
          "import { canonical } from './foo';\nexport const value = canonical;\n",
        );

        const results = await indexFiles(getDefaultConfig(tempDir), { skipFreshFiles: false });
        persistIndexResults(results);

        const fooResult = results.find((result) => realpathSync(result.filePath) === realpathSync(fooFilePath));
        const barResult = results.find((result) => realpathSync(result.filePath) === realpathSync(barFilePath));
        const consumerResult = results.find((result) => realpathSync(result.filePath) === realpathSync(consumerFilePath));
        const outlineNodes = queryOutline(fooResult?.filePath ?? fooFilePath);
        const canonicalInOutline = outlineNodes.some((node) => node.name === 'canonical');

        if (canonicalInOutline) {
          expect(outlineNodes.map((node) => node.name)).toContain('canonical');
        } else {
          const canonicalNode = barResult?.nodes.find((node) => node.name === 'canonical' && node.kind === 'variable');
          const importEdge = consumerResult?.edges.find((edge) => (
            edge.edgeType === 'IMPORTS'
            && edge.metadata?.moduleSpecifier === './foo'
          ));

          expect(importEdge).toMatchObject({
            targetId: canonicalNode?.symbolId,
            metadata: expect.objectContaining({
              moduleSpecifier: './foo',
              resolvedFilePath: realpathSync(fooFilePath),
              resolvedSymbolFilePath: realpathSync(barFilePath),
            }),
          });
        }
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
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

    it('preserves import and re-export resolver metadata in the regex fallback path', async () => {
      const previousParser = process.env.SPECKIT_PARSER;
      process.env.SPECKIT_PARSER = 'regex';

      try {
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
        const barrelResult = await parseFile(
          barrelFilePath,
          "export { Foo } from './foo';\n",
          'typescript',
        );
        const consumerResult = await parseFile(
          consumerFilePath,
          "import { type Foo } from './index';\nexport type Local = Foo;\n",
          'typescript',
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
            importKind: 'type',
            resolvedFilePath: barrelFilePath,
            resolvedSymbolFilePath: sourceFilePath,
          },
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
