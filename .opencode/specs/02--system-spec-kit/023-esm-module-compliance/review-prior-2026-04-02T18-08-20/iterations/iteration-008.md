# Iteration 008: D1 Correctness

## Findings

No P0 issues found.

### [P1] The shipped `mcp_server/scripts` compatibility wrappers still use `__dirname` inside an ESM package, so both bridge entrypoints crash before they can delegate
- **File**: `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:10`; `.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:9`; `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:7-20`; `.opencode/skill/system-spec-kit/mcp_server/package.json:5-18`; `.opencode/skill/system-spec-kit/mcp_server/dist/scripts/map-ground-truth-ids.js:6-9`; `.opencode/skill/system-spec-kit/mcp_server/dist/scripts/reindex-embeddings.js:6-9`
- **Issue**: `@spec-kit/mcp-server` now ships as a NodeNext ESM package (`"type": "module"`), and its build includes `mcp_server/scripts/**/*.ts`. Both wrapper sources resolve their delegate target with bare `__dirname`, so the emitted `.js` artifacts preserve that CommonJS-only global inside ESM output. The result is that the shipped bridge entrypoints for `map-ground-truth-ids` and `reindex-embeddings` throw immediately instead of forwarding to the real scripts implementation.
- **Evidence**: The source wrappers use `path.resolve(__dirname, ...)`, `mcp_server/tsconfig.json` includes `**/*.ts`, and the emitted `dist/scripts/*.js` files still contain the same `__dirname` expression under the ESM package boundary declared in `mcp_server/package.json`. Direct runtime verification also fails exactly at that line:
  - `node .opencode/skill/system-spec-kit/mcp_server/dist/scripts/map-ground-truth-ids.js --help` -> `ReferenceError: __dirname is not defined in ES module scope`
  - `node .opencode/skill/system-spec-kit/mcp_server/dist/scripts/reindex-embeddings.js --help` -> `ReferenceError: __dirname is not defined in ES module scope`
- **Fix**: Convert these wrappers to ESM-safe path resolution (`fileURLToPath(import.meta.url)`), or publish them as explicit CommonJS shims (`.cjs`) and keep them out of the ESM build surface.

```json
{
  "type": "claim-adjudication",
  "claim": "The shipped mcp_server compatibility wrappers for map-ground-truth-ids and reindex-embeddings are not ESM-correct and currently fail at runtime.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:10",
    ".opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:9",
    ".opencode/skill/system-spec-kit/mcp_server/tsconfig.json:7-20",
    ".opencode/skill/system-spec-kit/mcp_server/package.json:5-18",
    ".opencode/skill/system-spec-kit/mcp_server/dist/scripts/map-ground-truth-ids.js:6-9",
    ".opencode/skill/system-spec-kit/mcp_server/dist/scripts/reindex-embeddings.js:6-9"
  ],
  "counterevidenceSought": "Checked whether the wrappers were excluded from the ESM build or rewritten during emit, and inspected the emitted dist files plus direct node execution; neither safeguard exists.",
  "alternativeExplanation": "These wrappers may have been intended as temporary CommonJS compatibility shims, but they are currently emitted as plain .js files inside an ESM package and therefore execute under ESM semantics.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if the publish/runtime path rewrites these wrappers to .cjs or otherwise excludes them from the shipped ESM entrypoints before users can invoke them."
}
```

## Correctness Status

- `mcp_server/handlers/`: Spot-checked `memory-context.ts` and `memory-search.ts`; the reviewed relative imports use explicit `.js` extensions, and the package-subpath imports from `@spec-kit/shared/...` are compatible with the shared package export map.
- `mcp_server/lib/search/`: Spot-checked `pipeline/orchestrator.ts` and `hybrid-search.ts`; the local import graph is `.js`-suffixed and I did not find a new cross-package boundary defect there.
- `shared/embeddings/`: `factory.ts` uses `.js`-suffixed relative imports throughout and does not reintroduce CommonJS-only globals.
- `mcp_server/tools/`: `memory-tools.ts` imports handlers/schemas/types via explicit `.js` suffixes; no new ESM-correctness defect found in the reviewed tool registration path.
- `require()` sweep: No non-test TypeScript source hits under `mcp_server/` or `shared/`. The only matches were README examples.
- `__dirname` / `__filename` sweep: The actionable runtime hits were the two `mcp_server/scripts/*.ts` wrappers above. `mcp_server/cli.ts` only references `__dirname` in a comment, and the other grep hits were docs/test-config surfaces rather than the reviewed runtime path.

## Notes

- This is a new D1 correctness finding, not a duplicate of iteration 001's package-root side effects or Node-engine drift. It is a narrower emitted-artifact/runtime-entrypoint failure inside the ESM migration surface.
- I did not find a second import-graph regression in the requested handler/search/embedding/tool files after checking for missing relative `.js` suffixes and for residual `require()` usage.

## Summary

- P0: 0 findings
- P1: 1 finding
- P2: 0 findings
- newFindingsRatio: 1.0
