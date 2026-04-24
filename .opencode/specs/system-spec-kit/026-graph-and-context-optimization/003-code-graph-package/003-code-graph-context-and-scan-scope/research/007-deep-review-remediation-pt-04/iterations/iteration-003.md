# Iteration 003 - Fix Verification, Edge-Case Stress, and Test Plan

## Focus

Validate the iteration-002 fixes before implementation:

- G1: Confirm `IndexFilesOptions.skipFreshFiles` is safe for every `indexFiles()` caller.
- G2: Stress-test `capturesToNodes()` symbol-id dedupe against legitimate duplicate scenarios.
- G3: Provide concrete Vitest snippets for the implementation packet.
- G4: Identify nearby stale-gate or mode-confusion bugs without expanding the production patch.

## Actions Taken

1. Re-read the deep-research skill surface and prior iteration context.
2. Enumerated every `indexFiles()` call with `rg -n "indexFiles\\(" .opencode/skill/system-spec-kit/mcp_server`.
3. Inspected `ensure-ready.ts`, `scan.ts`, `tree-sitter-parser.vitest.ts`, `structural-indexer.ts`, `tree-sitter-parser.ts`, `code-graph-db.ts`, `code-graph-scan.vitest.ts`, and `structural-contract.vitest.ts`.
4. Searched for `isFileStale`, `incremental`, parser capture fields, overload-like syntax, and generated test patterns.
5. Wrote implementation-ready test snippets for indexer options, scan-handler integration, and duplicate-symbol dedupe.

## Findings

### G1 Verification Per Caller

All current call sites were found:

```text
.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:162
.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:184
.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:183
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1227
.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:190
```

Caller decisions:

- `code-graph/handlers/scan.ts:183`: must pass `{ skipFreshFiles: effectiveIncremental }`. This is the only caller with a user-visible `incremental` argument. Its current cleanup branch removes every tracked file absent from `results` when `effectiveIncremental` is false, so stale-only `results` are destructive in full-scan mode.
- `code-graph/lib/ensure-ready.ts:190`: keep default `skipFreshFiles=true`. The readiness helper first computes graph state from tracked stale/deleted files, then runs bounded inline indexing with a 10-second timeout. Its job is "minimum necessary reindexing", not caller-requested full rebuild. Keeping the default preserves the intended selective behavior.
- `tests/tree-sitter-parser.vitest.ts:162` and `:184`: no explicit override required for existing tests. `setupIndexerMocks()` currently mocks `isFileStale` to `true`, so the signature change is backward-compatible. New tests should add explicit `skipFreshFiles=false` coverage.
- `structural-indexer.ts:1227`: definition site. Add the optional `IndexFilesOptions` parameter with `skipFreshFiles` defaulting to `true`.

Conclusion: proposed Fix 1 is safe. Only `scan.ts` needs an explicit override; all other current callers should keep the default.

### G2 Edge Cases Per Scenario

#### TypeScript Function Overloads

Tree-sitter mapping includes `function_declaration: 'function'`. `extractName()` returns only the identifier. `capturesToNodes()` generates the ID from `(filePath, getCaptureFqName(c), c.kind)`, so overload signatures like `function parse(x: string): A; function parse(x: number): B; function parse(x: unknown) {}` collapse to the same `symbolId`.

Dedup acceptability: acceptable for the minimal crash fix because the current graph identity cannot represent overload variants. Preserving first-seen signature is lossy, but less risky than line-suffixed IDs that become edit-position-sensitive. Follow-up Option C can add signature-aware or overload-aware naming if graph consumers need it.

#### Same-Name Methods On Different Types

Class methods use `parentName`, so `A.run()` and `B.run()` become `A.run` and `B.run`; these do not collide. Interface method signatures are weaker: `abstract_method_signature` maps to `method`, but generic `method_signature` was not found in the map. If captured as methods inside an interface, parent scoping should prevent cross-interface collisions; if not captured, dedupe is irrelevant.

Dedup acceptability: acceptable. The higher-value follow-up is parser completeness for interface method signatures, not line-suffixed duplicate IDs.

#### Python `@overload` Decorators

Python parser maps `function_definition` to `function`, stores decorators only as `decoratorNames`, and `getCaptureFqName()` ignores decorators. Repeated `@overload def parse(...)` definitions plus implementation collapse to the same function `symbolId`.

Dedup acceptability: acceptable for the crash fix. It will drop overload declarations after the first same-name function, but the current identity model cannot safely persist all overload forms. Follow-up parser work could fold overload signatures into metadata or keep the concrete implementation preferentially.

#### Anonymous Functions / Closures With Name Collisions

The regex backend captures top-level `const handler = (...) =>` only when `braceDepth === 0`; nested closure variables are usually ignored. The tree-sitter backend treats `lexical_declaration` / `variable_declarator` with function values as `function`, but does not add lexical parent scope for non-class closures. Two `const handler = () => {}` declarations in different blocks in one file can therefore collapse.

Dedup acceptability: acceptable as a defensive DB-crash guard, but this is the strongest argument for Option C later. The current graph already lacks lexical-scope identity, so Option B would encode line number without improving semantic resolution.

#### Test Files With `describe.each` / Generated Test Functions

Search found `it.each(...)` usage, but these are call expressions, not declarations. The parser captures imported `it`/`describe` names, top-level variables, classes, functions, etc.; generated cases are not individual graph nodes. Duplicates are not expected from `describe.each` itself unless repeated same-name helper declarations exist nearby.

Dedup acceptability: acceptable. No special generated-test handling is needed for this patch.

### G4 Latent Bugs

- `scan.ts` still has a second stale check after `indexFiles()`:

  ```typescript
  if (effectiveIncremental && !graphDb.isFileStale(result.filePath)) {
    filesSkipped++;
    continue;
  }
  ```

  This is redundant when `indexFiles()` already skipped fresh files, but it is not incorrect. It can guard races where a file becomes fresh between parse and persistence.

- Operator clarity remains incomplete unless `ScanResult` gains `fullScanRequested` and `effectiveIncremental`. `fullReindexTriggered=false` is correct for explicit `incremental:false`, but misleading without the new fields.

- `filesScanned` / `filesIndexed` naming remains overloaded. The current handler reports parsed/persisted result counts, not total post-exclude candidate count. This should be a P2 follow-up if operators need to see "discovered candidates" separately from "persisted files".

- `ensure-ready.ts` full-scan action still calls `indexFiles(config)` with stale-only default. That is acceptable for inline readiness because its full-scan action means "graph state requires full readiness attention", not "user requested full rebuild". If future behavior wants auto-full rebuild after git HEAD changes, it should pass an explicit option under a separate design, because doing so may violate the bounded auto-indexing intent.

## Test Plan

### G3 - `tests/structural-contract.vitest.ts` Additions

The requested file can host direct indexer option contract tests. These are implementation-ready snippets; imports assume the production patch exports `IndexFilesOptions` only as a TypeScript type and keeps `indexFiles()` as the runtime function.

```typescript
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const tempDirs: string[] = [];

function createIndexerTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'indexfiles-options-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

function writeIndexerFixture(root: string, relativePath: string, content = 'export function fixture() { return 1; }\n'): void {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.SPECKIT_PARSER;
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('indexFiles options', () => {
  it('returns ALL post-exclude files when skipFreshFiles=false', async () => {
    vi.resetModules();
    const isFileStale = vi.fn(() => false);
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({ isFileStale }));
    process.env.SPECKIT_PARSER = 'regex';

    const tempRoot = createIndexerTempRoot();
    writeIndexerFixture(tempRoot, 'active/a.ts', 'export function a() { return 1; }\n');
    writeIndexerFixture(tempRoot, 'active/b.ts', 'export function b() { return 2; }\n');
    writeIndexerFixture(tempRoot, 'z_archive/old.ts', 'export function old() { return 0; }\n');

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');

    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    }, { skipFreshFiles: false });

    const indexedPaths = results.map(result => relative(tempRoot, result.filePath).replace(/\\/g, '/')).sort();
    expect(indexedPaths).toEqual(['active/a.ts', 'active/b.ts']);
    expect(isFileStale).not.toHaveBeenCalled();
  });

  it('skips fresh files when skipFreshFiles=true', async () => {
    vi.resetModules();
    const isFileStale = vi.fn(() => false);
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({ isFileStale }));
    process.env.SPECKIT_PARSER = 'regex';

    const tempRoot = createIndexerTempRoot();
    writeIndexerFixture(tempRoot, 'active/a.ts');
    writeIndexerFixture(tempRoot, 'active/b.ts');

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');

    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    }, { skipFreshFiles: true });

    expect(results).toEqual([]);
    expect(isFileStale).toHaveBeenCalledTimes(2);
  });

  it('preserves stale-only behavior when option omitted', async () => {
    vi.resetModules();
    const isFileStale = vi.fn(() => false);
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({ isFileStale }));
    process.env.SPECKIT_PARSER = 'regex';

    const tempRoot = createIndexerTempRoot();
    writeIndexerFixture(tempRoot, 'active/a.ts');

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');

    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    });

    expect(results).toEqual([]);
    expect(isFileStale).toHaveBeenCalledTimes(1);
  });
});
```

### G3 - `code-graph/tests/code-graph-scan.vitest.ts` Handler Integration

These are better placed in `code-graph/tests/code-graph-scan.vitest.ts` than `structural-contract.vitest.ts`, because the existing scan test already mocks `indexFiles()` and parses handler payloads.

```typescript
it('incremental:false passes skipFreshFiles=false and exposes effective full scan mode', async () => {
  mocks.execSyncMock.mockReturnValue('same-head\n');
  mocks.getLastGitHeadMock.mockReturnValue('same-head');
  mocks.getTrackedFilesMock.mockReturnValue(['/workspace/current.ts']);
  mocks.indexFilesMock.mockResolvedValue([
    {
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-current',
      nodes: [{ symbolId: 'current::symbol' }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    },
    {
      filePath: '/workspace/other.ts',
      language: 'typescript',
      contentHash: 'hash-other',
      nodes: [{ symbolId: 'other::symbol' }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    },
  ]);

  const response = await handleCodeGraphScan({
    rootDir: process.cwd(),
    incremental: false,
  });
  const payload = JSON.parse(response.content[0].text) as {
    status: string;
    data: {
      filesIndexed: number;
      filesScanned: number;
      fullScanRequested: boolean;
      effectiveIncremental: boolean;
      fullReindexTriggered: boolean;
    };
  };

  expect(payload.status).toBe('ok');
  expect(mocks.indexFilesMock).toHaveBeenCalledWith(
    expect.objectContaining({ rootDir: process.cwd() }),
    { skipFreshFiles: false },
  );
  expect(payload.data.filesIndexed).toBe(2);
  expect(payload.data.filesScanned).toBe(2);
  expect(payload.data.fullScanRequested).toBe(true);
  expect(payload.data.effectiveIncremental).toBe(false);
  expect(payload.data.fullReindexTriggered).toBe(false);
  expect(mocks.isFileStaleMock).not.toHaveBeenCalled();
});

it('idempotent: second incremental:false scan reports the same full result count', async () => {
  mocks.execSyncMock.mockReturnValue('same-head\n');
  mocks.getLastGitHeadMock.mockReturnValue('same-head');
  const fullResults = [
    {
      filePath: '/workspace/a.ts',
      language: 'typescript',
      contentHash: 'hash-a',
      nodes: [{ symbolId: 'a::symbol' }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    },
    {
      filePath: '/workspace/b.ts',
      language: 'typescript',
      contentHash: 'hash-b',
      nodes: [{ symbolId: 'b::symbol' }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    },
  ];
  mocks.indexFilesMock.mockResolvedValue(fullResults);

  const first = await handleCodeGraphScan({ rootDir: process.cwd(), incremental: false });
  const second = await handleCodeGraphScan({ rootDir: process.cwd(), incremental: false });
  const firstPayload = JSON.parse(first.content[0].text) as { data: { filesScanned: number; filesIndexed: number } };
  const secondPayload = JSON.parse(second.content[0].text) as { data: { filesScanned: number; filesIndexed: number } };

  expect(firstPayload.data.filesScanned).toBe(2);
  expect(secondPayload.data.filesScanned).toBe(2);
  expect(firstPayload.data.filesIndexed).toBe(2);
  expect(secondPayload.data.filesIndexed).toBe(2);
  expect(mocks.indexFilesMock).toHaveBeenNthCalledWith(
    1,
    expect.any(Object),
    { skipFreshFiles: false },
  );
  expect(mocks.indexFilesMock).toHaveBeenNthCalledWith(
    2,
    expect.any(Object),
    { skipFreshFiles: false },
  );
});
```

For a real fixture workspace integration test, avoid hard-coding `>= 1000` unless the fixture is the repository itself and the test environment guarantees that many included files. Prefer an exact post-exclude temp fixture count for unit tests, then run a manual/CLI verification against the repo expecting approximately the known 1,425 post-exclude candidates.

### G3 - `tests/tree-sitter-parser.vitest.ts` Dedupe Tests

```typescript
describe('capturesToNodes dedup', () => {
  it('drops duplicate (filePath, fqName, kind) captures, preserving first', async () => {
    const { capturesToNodes } = await import('../code-graph/lib/structural-indexer.js');

    const nodes = capturesToNodes([
      {
        name: 'parse',
        kind: 'function',
        startLine: 1,
        endLine: 1,
        startColumn: 0,
        endColumn: 32,
        signature: 'function parse(value: string): string;',
      },
      {
        name: 'parse',
        kind: 'function',
        startLine: 2,
        endLine: 2,
        startColumn: 0,
        endColumn: 32,
        signature: 'function parse(value: number): string;',
      },
    ], '/workspace/overloads.ts', 'typescript', [
      'function parse(value: string): string;',
      'function parse(value: number): string;',
    ].join('\n'));

    const parseNodes = nodes.filter(node => node.kind === 'function' && node.fqName === 'parse');
    expect(parseNodes).toHaveLength(1);
    expect(parseNodes[0].startLine).toBe(1);
    expect(parseNodes[0].signature).toBe('function parse(value: string): string;');
    expect(new Set(nodes.map(node => node.symbolId)).size).toBe(nodes.length);
  });

  it('does not dedup the moduleNode (always 1)', async () => {
    const { capturesToNodes } = await import('../code-graph/lib/structural-indexer.js');

    const nodes = capturesToNodes([
      {
        name: 'sample',
        kind: 'module',
        startLine: 1,
        endLine: 1,
        startColumn: 0,
        endColumn: 0,
      },
    ], '/workspace/sample.ts', 'typescript', 'export const value = 1;\n');

    const moduleNodes = nodes.filter(node => node.kind === 'module');
    expect(moduleNodes).toHaveLength(1);
    expect(moduleNodes[0].fqName).toBe('sample');
    expect(new Set(nodes.map(node => node.symbolId)).size).toBe(nodes.length);
  });

  it('regression: indexing duplicate overload captures produces no duplicate symbolIds', async () => {
    const { capturesToNodes } = await import('../code-graph/lib/structural-indexer.js');

    const content = [
      'export function lookup(value: string): string;',
      'export function lookup(value: number): string;',
      'export function lookup(value: unknown): string {',
      '  return String(value);',
      '}',
    ].join('\n');
    const nodes = capturesToNodes([
      {
        name: 'lookup',
        kind: 'function',
        startLine: 1,
        endLine: 1,
        startColumn: 0,
        endColumn: 46,
        signature: 'export function lookup(value: string): string;',
      },
      {
        name: 'lookup',
        kind: 'function',
        startLine: 2,
        endLine: 2,
        startColumn: 0,
        endColumn: 46,
        signature: 'export function lookup(value: number): string;',
      },
      {
        name: 'lookup',
        kind: 'function',
        startLine: 3,
        endLine: 5,
        startColumn: 0,
        endColumn: 1,
        signature: 'export function lookup(value: unknown): string {',
      },
    ], '/workspace/structural-indexer-like.ts', 'typescript', content);

    expect(nodes.filter(node => node.kind === 'function' && node.fqName === 'lookup')).toHaveLength(1);
    expect(new Set(nodes.map(node => node.symbolId)).size).toBe(nodes.length);
  });
});
```

## Questions Answered

- G1: Fix 1 is safe for all callers. `scan.ts` needs `{ skipFreshFiles: effectiveIncremental }`; `ensure-ready.ts` and existing tests should keep the default.
- G2: Option A dedupe is acceptable for the minimal crash fix across overloads, Python decorators, closure-name collisions, and generated test patterns because the current identity model cannot represent colliding symbols anyway.
- G3: Concrete test snippets are provided for indexFiles options, scan-handler mode propagation, idempotency, and dedupe.
- G4: No additional P0 bug was found. P2 follow-ups remain around naming clarity and richer symbol identity.

## Questions Remaining

- Should a follow-up semantic parser packet prefer the implementation signature over overload declarations when deduping overloaded functions?
- Should `filesScanned` be supplemented with a separate discovered-candidate count so operators can distinguish post-exclude candidates from parsed/persisted files?
- Should interface method signatures (`method_signature`) be added to `JS_TS_KIND_MAP` as part of the later parser-completeness work?

## Next Focus

Iteration 4 should move from verification to implementation-readiness review: apply the minimal patches in a candidate branch, run targeted Vitest/typecheck commands, and perform one real `code_graph_scan({ incremental:false })` verification against the workspace to confirm the count returns to the post-exclude range and duplicate symbol IDs no longer abort persistence.
