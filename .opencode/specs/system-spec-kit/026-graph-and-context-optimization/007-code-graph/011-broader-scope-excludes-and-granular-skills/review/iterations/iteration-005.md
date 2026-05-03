## Dimension: correctness

## Files Reviewed (path:line list)

- `.claude/skills/sk-code-review/references/fix-completeness-checklist.md:1-85`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-broader-scope-excludes-and-granular-skills/spec.md:58-123`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-broader-scope-excludes-and-granular-skills/implementation-summary.md:50-125`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14-235`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:139-172`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-91`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1449`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:59-69`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:253-276`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:603-626`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:26-38`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:252-259`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:327-339`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:162-175`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:261-290`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-302`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:288-461`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:467-490`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:330-549`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:78-166`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-585`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-500`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:687-750`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:235-313`
- `.gitignore:5-20`

## Findings by Severity

### P0

None.

### P1

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:164-167` — Opted-in skill/agent scopes are recorded in status but the real scan does not index the requested `.opencode` files.
   - Risk: `code_graph_scan({ incremental: false, includeSkills: ["sk-code-review"], includeAgents: true })` persists a v2 scope claiming `skills=list[sk-code-review]` and `agents=all`, but the resulting SQLite `code_files` rows contain zero `.opencode/skill/sk-code-review/**` paths and zero `.opencode/agent/**` paths in this repo. The isolated end-to-end run scanned/indexed 9 files, all outside `.opencode/skill` and `.opencode/agent`; classified counts were `selectedSkill: 0`, `agents: []`, `commands: []`, `specs: []`, `plugins: []`.
   - User impact: A maintainer can believe the graph was rebuilt for `sk-code-review` plus agents because `code_graph_status.activeScope` and stored metadata say so, while subsequent graph reads cannot answer from those opted-in files. This fails the Iter 5 focus condition that the DB contain only `sk-code-review` files plus all `.opencode/agent/**` files.
   - Finding class: `cross-consumer` + `matrix/evidence`.
   - Scope proof: `scan.ts:252-259` resolves and passes the include policy, `scan.ts:338` stores it, and `status.ts:271-285` reports it back. However `indexer-types.ts:164-167` only includes JS/TS/Python/shell globs, while the actual `.opencode/agent/**` files are Markdown/TXT and the selected `.opencode/skill/sk-code-review/**` files are Markdown/JSON. The tests prove policy matching for Markdown paths (`code-graph-indexer.vitest.ts:300`, `374`, `403-409`) but the only real `indexFiles()` opt-in fixture uses a synthetic `.ts` skill file (`code-graph-indexer.vitest.ts:471-486`), so the end-to-end repository shape is untested.
   - Recommended fix: Add an end-to-end scan fixture or repo-shaped test with Markdown/TXT agent files and Markdown/JSON skill files, then either extend the code graph candidate/language handling to persist document-like `.opencode` artifacts for opted-in internal folders or narrow the public contract/status labels so they do not claim all selected skill/agent files are included when only supported source extensions can enter `code_files`.

### P2

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:171-175` — Status is internally inconsistent after a per-call scoped scan.
   - Risk: The same isolated run returned `activeScope` and `storedScope` for `skills=list[sk-code-review]` and `agents=all`, with `scopeMismatch: false`, but `freshness: "stale"` because the readiness snapshot compares stored scope to `resolveIndexScopePolicy()` from the current default environment (`ensure-ready.ts:293-302`) before status parses and displays the stored scope.
   - User impact: Operators see a just-completed full scan reported as stale without an active-scope mismatch in the same status payload, making it unclear whether the stored scoped scan is trustworthy or whether another full scan is required.
   - Finding class: `cross-consumer`.
   - Scope proof: `status.ts:171` computes readiness from default process scope, `status.ts:173-175` then derives `activeScopePolicy` from the stored fingerprint and compares the stored fingerprint against itself, while `ensure-ready.ts:293-302` is the path that produced the stale scope-change reason.
   - Recommended fix: Make `code_graph_status` use one canonical scope basis for readiness, activeScope and scopeMismatch, or explicitly expose both `storedScope` and `currentProcessScope` so per-call scoped scans do not appear stale with `scopeMismatch: false`.

## Verdict

FAIL — v2 fingerprint persistence and expanded `activeScope` round-trip, but the end-to-end scan does not populate the requested `sk-code-review` and agent files in the DB, and status freshness is inconsistent after the per-call scoped scan.
