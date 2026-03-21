# C7 Import Policy Enforcement Audit

Scope: `.opencode/skill/system-spec-kit/`

Execution notes:
- `cd .opencode/skill/system-spec-kit/scripts && npm run check` did not complete in this sandbox because `tsx` failed to open its IPC pipe during `npm run lint` with `EPERM` before the boundary scripts ran.
- The shipped compiled checks were still runnable:
  - `node dist/evals/check-no-mcp-lib-imports.js` -> PASS
  - `node dist/evals/check-no-mcp-lib-imports-ast.js` -> PASS
  - `node dist/evals/check-allowlist-expiry.js` -> PASS
- All four allowlist entries are still active in source and none are expired as of `2026-03-21`.

### C7-001: Package alias traversal bypasses forbidden-import detection
Severity: HIGH
Category: architecture
Location: `.opencode/skill/system-spec-kit/scripts/evals/import-policy-rules.ts:20`

Description: The shared detection rule only normalizes relative specifiers. Package-form imports are checked as raw strings, so a caller can write `@spec-kit/mcp-server/api/../lib/...` and bypass both the regex checker and the AST checker even though TypeScript resolves that specifier into `mcp_server/lib/*`, which the architecture explicitly forbids.

Evidence:
```ts
function normalizeRelativeImportPath(importPath: string): string {
  if (!importPath.startsWith('.')) {
    return importPath;
  }
```

```ts
return PROHIBITED_PACKAGE_IMPORTS.some((baseImport) => (
  normalizedImportPath === baseImport || normalizedImportPath.startsWith(`${baseImport}/`)
)) || RELATIVE_INTERNAL_RUNTIME_IMPORT_RE.test(normalizedImportPath);
```

```text
pkg api/../lib => false
rel api/../lib => true
```

```text
@spec-kit/mcp-server/api/../lib/search/folder-discovery
=> /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
```

Impact: A forbidden scripts-to-runtime-internals import can be written in package form, compile successfully, and pass the current enforcement stack without allowlist review. This is a true policy bypass, not just documentation drift.

Recommended Fix: Canonicalize package-form specifiers before matching, not just relative ones. At minimum, reject any `@spec-kit/mcp-server/*` specifier whose normalized segments resolve under `lib`, `core`, or `handlers`, and add a regression test for `@spec-kit/mcp-server/api/../lib/...`.

### C7-002: The standard boundary gate does not execute AST import-policy enforcement
Severity: MEDIUM
Category: verification
Location: `.opencode/skill/system-spec-kit/scripts/package.json:14`

Description: The codebase ships an AST checker for direct and transitive internal imports, but the default `npm run check` path only runs the regex-level checker. That means the standard gate used by contributors can miss cases the AST checker was added to catch, especially deeper re-export chains and AST-only syntax variants.

Evidence:
```json
"check:ast": "npx tsx evals/check-no-mcp-lib-imports-ast.ts && npx tsx evals/check-handler-cycles-ast.ts",
"check": "npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh && npx tsx evals/check-architecture-boundaries.ts && npx tsx evals/check-allowlist-expiry.ts && npx tsx evals/check-source-dist-alignment.ts"
```

```md
| `scripts/evals/check-no-mcp-lib-imports-ast.ts` | AST-level import policy checker |
| AST import-policy checker | `scripts/evals/check-no-mcp-lib-imports-ast.ts` | AST-level detection for direct and transitive internal imports |
```

Impact: The stronger checker exists but is opt-in, so normal `npm run check` runs do not fully enforce the documented import-boundary contract. A future violation that only the AST checker sees could merge if engineers rely on the default gate.

Recommended Fix: Fold `npm run check:ast` into `npm run check`, or otherwise make the AST checker part of the mandatory boundary gate and document a single authoritative command path.

### C7-003: Raw filesystem reads create an unchecked path to runtime internals
Severity: MEDIUM
Category: architecture
Location: `.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:80`

Description: `map-ground-truth-ids.ts` does not import a forbidden runtime module, but it still reaches into `mcp_server/lib/` by resolving and reading a private source file directly. That dependency is outside the allowlist model and outside both import-policy checkers, even though the architecture boundary says scripts should consume runtime functionality through `api/` or `shared/`, never internal runtime directories.

Evidence:
```ts
const gtPath = path.resolve(__dirname, '../../mcp_server/lib/eval/ground-truth-data.ts');
const src = fs.readFileSync(gtPath, 'utf-8');
```

```md
The `mcp_server/api/` surface acts as the stable boundary. Scripts that need runtime functionality must import through `api/` or `shared/`, never from internal runtime directories.
```

Impact: The boundary can be bypassed through file-path coupling instead of module imports. This makes private runtime files de facto public to scripts while escaping allowlist governance and automated enforcement.

Recommended Fix: Move the ground-truth dataset to `shared/` or expose it through a public API/data surface, then add a boundary check that flags script-side filesystem access into `mcp_server/{lib,core,handlers}`.

### C7-004: Exception governance documentation is stale relative to the allowlist
Severity: LOW
Category: governance
Location: `.opencode/skill/system-spec-kit/ARCHITECTURE.md:199`

Description: The allowlist is the real source of truth and currently contains four active exceptions, but the architecture document only lists three of them and `scripts/evals/README.md` only mentions one. That makes manual review of exception scope incomplete even though the JSON allowlist itself is well-formed and unexpired.

Evidence:
```md
| `scripts/evals/run-performance-benchmarks.ts` | `@spec-kit/mcp-server/lib/*` (multiple) | Benchmark needs direct access to internal metrics |
| `scripts/spec-folder/generate-description.ts` | `@spec-kit/mcp-server/lib/search/folder-discovery` | CLI tool needs folder-discovery internals for description generation |
| `scripts/core/workflow.ts` | `@spec-kit/mcp-server/lib/search/folder-discovery` | Workflow memory-save updates per-folder description.json via dynamic import |
```

```json
{
  "file": "scripts/memory/rebuild-auto-entities.ts",
  "import": "../../mcp_server/lib/extraction/entity-extractor",
  "owner": "spec-kit-maintainers",
  "reason": "CLI script needs direct access to entity extraction internals for rebuild operations",
  "expiresAt": "2026-06-15"
}
```

```md
### Current Exceptions

- `run-performance-benchmarks.ts` — allowlisted internal runtime imports for benchmark-specific metrics
```

Impact: Reviewers using the docs instead of the JSON allowlist can miss active exceptions, weakening renewal reviews and making removals less reliable.

Recommended Fix: Treat `import-policy-allowlist.json` as the generated source of truth for exception listings, or update both markdown docs whenever the allowlist changes.
