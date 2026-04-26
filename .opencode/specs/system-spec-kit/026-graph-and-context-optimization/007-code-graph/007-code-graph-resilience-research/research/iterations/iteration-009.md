# Iteration 9 - Resolver Upgrades for Cross-File Edges

## Summary

Q12A-Q12D are answered. The current scanner does not translate an import/export string specifier to a concrete file path at all; it captures local import/export names, turns those captures into nodes, and resolves `IMPORTS` / `EXPORTS` by same-file `nodesByName` lookup only. That explains the alias, type-only, and barrel gaps from iteration 6. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:399-465`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-920`]

The patch should split extraction from cross-file resolution: parser captures should preserve `moduleSpecifier`, `isTypeOnly`, and re-export form, then `finalizeIndexResults()` should build a global file/symbol index and add cross-file edges after all parsed files are available. This keeps the existing per-file parser contract stable while adding the missing resolver behavior at the only point that sees multiple files. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1328-1381`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1399-1507`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:233-247`]

## Failure Mode A: Path Aliases

Current behavior: `tsconfig.json` contains `baseUrl` and a `paths` mapping for `@spec-kit/shared/*`, and source files use that alias, for example `context-server.ts` imports from `@spec-kit/shared/embeddings/factory`. The indexer does not read `tsconfig.json`; `IndexerConfig` has root/include/exclude/size/languages only, and the parser drops the module specifier after capturing imported names. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:70-74`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:350-358`]

Patch surface:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`: extend `IndexerConfig` with optional `tsconfigPath`, `baseUrl`, and normalized `pathAliases`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:113-126`: extend `RawCapture` with `moduleSpecifier?: string`, `importKind?: 'value' | 'type'`, and `exportKind?: 'named' | 'star' | 'declaration'`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`: record the import source string on every emitted import capture.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502`: regex fallback already captures the source in group 3 but discards it; preserve it.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1403-1507`: load tsconfig once per scan and pass a module resolver into finalize.

Pseudocode:

```ts
type PathAlias = { prefix: string; suffixWildcard: boolean; targets: string[] };

function loadTsconfigResolver(rootDir: string): ModuleResolver {
  const tsconfigPath = findNearestTsconfig(rootDir);
  const parsed = readJsonWithExtends(tsconfigPath);
  const baseUrl = resolve(dirname(tsconfigPath), parsed.compilerOptions?.baseUrl ?? '.');
  const aliases = normalizePaths(parsed.compilerOptions?.paths ?? {});
  return { resolve: (fromFile, specifier) => resolveModule(fromFile, specifier, baseUrl, aliases) };
}

function resolveModule(fromFile, specifier, baseUrl, aliases) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return resolveWithExtensions(dirname(fromFile), specifier);
  }
  for (const alias of aliases) {
    const rest = matchAlias(alias, specifier);
    if (rest !== null) {
      for (const target of alias.targets) {
        const candidate = target.replace('*', rest);
        const found = resolveWithExtensions(baseUrl, candidate);
        if (found) return found;
      }
    }
  }
  return undefined; // external package or unresolved
}
```

Test plan:

- Add `code-graph-indexer.vitest.ts` fixtures that scan two temp files plus a temp `tsconfig.json` with `paths: { "@alias/*": ["src/*"] }`.
- Assert `import { target } from '@alias/target'` creates a cross-file `IMPORTS` edge to the target symbol.
- Assert an unresolved alias leaves no false local same-file edge and records `metadata.resolution = 'unresolved-alias'`.
- Assert existing relative import behavior still works when no tsconfig is present.

## Failure Mode B: Type-Only Imports

Current behavior: tree-sitter import captures do not tag `import type`; all imports become `kind: 'import'` captures with only a name/range/signature. Regex fallback does not match `import type { X } from './x'` because the pattern expects `{...}` or a default identifier immediately after `import`. Type references are separately modeled as same-file `TYPE_OF` edges, but that is not enough to link the imported type symbol to its defining file. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:483-488`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1048-1069`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:6-8`]

New edge type proposal:

- Add `TYPE_ONLY` to `EdgeType` as a dependency edge for explicit `import type` and `export type ... from` declarations. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-16`]
- Weight: `0.85`, matching `TYPE_OF`, because it is directly extracted syntax but compile-time only. Runtime dependency queries should keep defaulting to `IMPORTS`; blast-radius can opt into `TYPE_ONLY` when TypeScript API/contract impact matters.
- Metadata: `{ dependencyKind: 'type-only', confidence: 0.85, detectorProvenance, evidenceClass: 'EXTRACTED', moduleSpecifier, resolvedFilePath }`.
- Query/schema follow-up: `code_graph_query.edgeType` is a free string, but supported-edge validation/error text and relationship helpers need `TYPE_ONLY` added wherever `EdgeType` is enumerated. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570-588`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:232`]

Patch surface:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-16`: extend `EdgeType`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:86-110`: allow metadata reasons/steps for `TYPE_ONLY` if a special reason is wanted.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`: detect the `type` keyword/import clause shape and set `importKind: 'type'`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502`: update regex to `import\s+(type\s+)?...from`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1328-1381`: emit cross-file `TYPE_ONLY` edges in finalization.

Pseudocode:

```ts
function emitImportCaptures(node, language, lines, captures) {
  const moduleSpecifier = extractStringLiteralSource(node);
  const isTypeOnly = hasImportTypeKeyword(node) || /^\s*import\s+type\b/.test(signature);

  for (const importedName of importedNames(node)) {
    captures.push({
      name: importedName.localName,
      importedName: importedName.exportedName,
      kind: 'import',
      moduleSpecifier,
      importKind: isTypeOnly ? 'type' : 'value',
      signature,
      range,
    });
  }
}

function addImportEdges(results, resolver) {
  const symbolsByFileAndExportName = buildExportIndex(results);
  for (const result of results) {
    for (const cap of result.captures.filter(c => c.kind === 'import')) {
      const targetFile = resolver.resolve(result.filePath, cap.moduleSpecifier);
      const target = symbolsByFileAndExportName.get(targetFile)?.get(cap.importedName ?? cap.name);
      if (!target) continue;
      result.edges.push({
        sourceId: importNodeFor(cap).symbolId,
        targetId: target.symbolId,
        edgeType: cap.importKind === 'type' ? 'TYPE_ONLY' : 'IMPORTS',
        weight: cap.importKind === 'type' ? 0.85 : 1.0,
        metadata: buildEdgeMetadata(cap.importKind === 'type' ? 0.85 : 1.0, provenance, 'EXTRACTED'),
      });
    }
  }
}
```

Test plan:

- Parse `import type { EdgeType } from '../lib/indexer-types.js'` and assert a capture/node exists with `importKind: 'type'`.
- Scan two files and assert the edge is `TYPE_ONLY`, not `IMPORTS`.
- Assert `import { value } from './value.js'` remains `IMPORTS`.
- Assert `TYPE_ONLY` appears in query supported-edge tests and can be filtered by `edgeType`.

## Failure Mode C: Re-Export Barrels

Current behavior: `export * from './foo'` is not captured as a source-module relationship. Tree-sitter `emitExportCaptures()` handles named export clauses and declaration exports, but star exports have no `export_specifier` and no declaration, so they fall through without a capture. Regex fallback only handles `export { ... }` and also discards the `from './scan.js'` source for named re-exports. The repo has a code-graph barrel with 12 `export *` lines. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:399-465`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:504-517`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index.ts:4-15`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11`]

Patch surface:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:399-465`: emit a synthetic export capture for `export * from './foo'` with `exportKind: 'star'`, `moduleSpecifier`, and a stable name such as `*`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:504-517`: update regex fallback for both `export * from` and `export { x } from`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1328-1381`: chase re-export chains after all files have nodes and export captures.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:86-92`: no schema change is needed; `edge_type` is text and edge metadata can carry `reexportDepth` and `barrelFilePath`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:86-92`; SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:358-375`]

Chain-resolution algorithm:

```ts
function resolveExportedSymbol(filePath, exportedName, visited = new Set()) {
  const key = `${filePath}#${exportedName}`;
  if (visited.has(key)) return { status: 'cycle' };
  visited.add(key);

  const direct = declaredExportsByFile.get(filePath)?.get(exportedName);
  if (direct) return { status: 'resolved', symbol: direct };

  const namedReexport = namedReexportsByFile.get(filePath)?.get(exportedName);
  if (namedReexport) {
    const nextFile = resolver.resolve(filePath, namedReexport.moduleSpecifier);
    return resolveExportedSymbol(nextFile, namedReexport.importedName, visited);
  }

  for (const star of starReexportsByFile.get(filePath) ?? []) {
    const nextFile = resolver.resolve(filePath, star.moduleSpecifier);
    const result = resolveExportedSymbol(nextFile, exportedName, visited);
    if (result.status === 'resolved') return result;
  }

  return { status: 'unresolved' };
}
```

Edge emission policy:

- Add `EXPORTS` from original symbol to the barrel export node when the chain resolves.
- Add metadata `{ reexportKind: 'star' | 'named', reexportDepth, resolvedFromFile }`.
- Cap depth at 10 and mark cycle/unresolved in metadata rather than guessing.

Test plan:

- `foo.ts` exports `Foo`; `index.ts` has `export * from './foo.js'`; `consumer.ts` imports `{ Foo } from './index.js'`.
- Assert consumer import resolves to the original `Foo` node, not just the barrel file.
- Add `a.ts -> b.ts -> c.ts` barrel chain and assert depth metadata.
- Add a barrel cycle and assert no infinite loop plus an unresolved/cycle metadata marker.

## Quantitative Impact

Counts were taken with `rg` against `.opencode/skill/system-spec-kit/mcp_server` source files, excluding `**/dist/**` and `**/node_modules/**`, except `tsconfig_paths_declarations`, which was counted across repo `tsconfig*.json` files.

| Pattern / failure mode | Grep pattern | Count | Interpretation |
|---|---|---:|---|
| Cross-module static relative imports | `^\s*import(?:\s+type)?\s+.*\s+from\s+['"]\.{1,2}/` | 1777 | Largest missing-edge footprint overall; fixing the shared module resolver is prerequisite for all three plans. |
| Dynamic/import-expression sites | `\bimport\s*\(` | 639 | Large footprint, but includes TS `typeof import(...)` expressions as well as runtime dynamic imports. |
| Runtime-looking dynamic imports | `\b(?:await\s+|return\s+|=\s*)import\s*\(` | 402 | Still high, but outside this iteration's three requested patch plans. |
| Type-only imports | `^\s*import\s+type\b` | 442 | Largest of the three requested failure modes. |
| Default imports | `^\s*import\s+[A-Za-z_$][A-Za-z0-9_$]*\s+from\s+['"][^'"]+['"]` | 373 | Alias/default identity risk remains material. |
| Path-alias imports | `from\s+['"]@spec-kit/shared/` | 129 | High impact because every alias import is currently unresolvable by path. |
| Named re-exports with source | `^\s*export\s+\{[^}]+\}\s+from\b` | 51 | Needs the same source-module capture as barrels. |
| Star re-export barrels | `^\s*export\s+\*\s+from\b` | 14 | Lower raw count but high fan-out in index files. |
| `paths` declarations | `"paths"\s*:` in `tsconfig*.json` | 2 | Alias config exists in both mcp_server and scripts tsconfigs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`; SOURCE: `.opencode/skill/system-spec-kit/scripts/tsconfig.json:9-14`] |

Q12D answer: the largest missing-edge footprint in the target codebase is cross-module static relative imports at 1777 matches. Among the three patch plans requested here, type-only imports are largest at 442, followed by path-alias imports at 129, then star barrels at 14.

## Patch Order Recommendation

1. Land the shared capture-shape and module-resolver foundation first: `moduleSpecifier`, `importKind`, `exportKind`, tsconfig path loading, extension probing, and a global symbol/export index in finalization. This unlocks all three fixes and directly attacks the 1777 static relative import footprint.
2. Land type-only imports next. The count is highest among the requested modes, the parser change is small, and `TYPE_ONLY` gives query callers a clean way to include or exclude compile-time dependencies.
3. Land path aliases immediately after the resolver foundation. Alias usage is lower than type-only imports, but the failure is binary: without `paths`, every `@spec-kit/shared/*` import is unresolved.
4. Land re-export barrels last. The algorithm is more complex because it needs chain traversal, cycle handling, and ambiguity rules, while the raw count is lower.

## Files Reviewed

- `research/iterations/iteration-006.md:60-73`
- `research/prompts/iteration-009.md:1-54`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1-126`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-517`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-1071`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1328-1381`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1399-1548`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:1-20`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:399-465`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:483-534`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:607-673`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:1-120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:80-115`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:281-378`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:127-230`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:210-240`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:111-117`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:154-212`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570-588`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:1-31`
- `.opencode/skill/system-spec-kit/scripts/tsconfig.json:1-38`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:68-78`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index.ts:1-15`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:1-11`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1-16`

## Convergence Signals

- newFindingsRatio: 0.58
- research_questions_answered: ["Q12A", "Q12B", "Q12C", "Q12D"]
- dimensionsCovered: ["path-alias-resolution", "type-only-imports", "re-export-barrels", "cross-file-finalization", "edge-type-extension", "grep-impact-counts"]
- novelty justification: This iteration converts the iteration 6 resolver catalog into concrete patch surfaces, pseudocode, edge-type design, chain-resolution behavior, and real grep counts from the target codebase.
- remaining gaps: Iteration 10 should decide how cross-file incremental scans preserve edges when only one side of a relationship is re-parsed, because `replaceNodes()` currently deletes edges touching old file nodes before replacement. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:324-345`]
