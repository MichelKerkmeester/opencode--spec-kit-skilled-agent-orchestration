# Iteration 44 - maintainability - server_core

## Dispatcher
- iteration: 44 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:31:22.854Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Published schema contract is not the runtime contract for later tool families.** `tool-schemas.ts` advertises strict JSON schemas for `skill_graph_*`, `code_graph_*`, and `ccc_*`, but the shared runtime Zod registry in `tool-input-schemas.ts` stops at `session_resume`. The later tool dispatchers therefore bypass `validateToolArgs` and use ad hoc checks or handler-side normalization instead. That means client-visible behavior diverges from the published MCP contract: invalid enums become handler errors, out-of-range numerics are clamped instead of rejected, and some tools accept raw values with no schema-layer validation at all. Evidence: `tool-input-schemas.ts:408-447`, `tool-schemas.ts:625-910`, `tools/skill-graph-tools.ts:51-67`, `tools/code-graph-tools.ts:56-80`, `handlers/skill-graph/query.ts:49-52`, `handlers/skill-graph/query.ts:83-88`, `handlers/skill-graph/query.ts:137-140`, `handlers/skill-graph/query.ts:169-179`.

```json
{
  "claim": "The server publishes strict input schemas for skill-graph/code-graph/CocoIndex tools, but those families do not go through the shared runtime schema validator, so the implementation does not actually enforce the advertised contract.",
  "evidenceRefs": [
    "tool-input-schemas.ts:408-447",
    "tool-schemas.ts:625-910",
    "tools/skill-graph-tools.ts:51-67",
    "tools/code-graph-tools.ts:56-80",
    "handlers/skill-graph/query.ts:49-52",
    "handlers/skill-graph/query.ts:83-88",
    "handlers/skill-graph/query.ts:137-140",
    "handlers/skill-graph/query.ts:169-179"
  ],
  "counterevidenceSought": "Looked for validateToolArgs usage in the later tool-family dispatchers and for validation coverage in tests; neither was present for the reviewed skill-graph/code-graph/CocoIndex surfaces.",
  "alternativeExplanation": "This may be an intentional backward-compatibility choice to keep these tool families permissive and normalize bad input downstream rather than fail fast at ingress.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 if there is an upstream pre-dispatch validator that enforces the published JSON schemas for these tool families before their handleTool switches run."
}
```

### P2 Findings
- **`session-prime` silently hides startup-brief regressions.** The dynamic import for `../../lib/code-graph/startup-brief.js` swallows every failure without logging (`hooks/claude/session-prime.ts:35-40`), so a missing optional module and a broken module evaluate to the same fallback path (`hooks/claude/session-prime.ts:117-131`). Because the reviewed test suite never imports `session-prime.ts` directly and only exercises helpers/state fixtures, that degradation path has no direct tripwire (`tests/hook-session-start.vitest.ts:27-137`).
- **The schema-validation suite never exercises the tool families implicated above.** `tests/tool-input-schema.vitest.ts` covers memory/checkpoint/session/causal schemas, but there are no `code_graph_*`, `skill_graph_*`, or `ccc_*` cases in the reviewed file. Combined with the split schema sources in `tool-schemas.ts` and `tool-input-schemas.ts`, this leaves the highest-drift surfaces without a parity guard (`tests/tool-input-schema.vitest.ts:33-501`, `tool-input-schemas.ts:408-447`, `tool-schemas.ts:625-910`).

## Traceability Checks
- `tool-schemas.ts` promises enum/range-validated contracts for `skill_graph_query` and related late-added tool families, but the reviewed runtime path implements a looser, handler-driven contract instead. The published MCP surface and the executed validation path are not the same thing.
- `session-prime.ts` does match the intended fail-safe recovery behavior on compact resumes: cached compact data is cleared only after stdout write succeeds (`hooks/claude/session-prime.ts:256-262`), which preserves recovery state if the process dies mid-output.

## Confirmed-Clean Surfaces
- `hooks/claude/session-prime.ts` compaction handling is careful about data loss: stale-cache fallback is explicit, and `clearCompactPrime()` only runs after output is written.
- `schemas/tool-input-schemas.ts` keeps the validated core memory/checkpoint/session tools on shared coercion helpers (`safeNumericPreprocess`, `positiveIntMax`, `boundedNumber`) instead of per-tool parsing branches.
- `handlers/skill-graph/query.ts` itself is readable and bounded once reached: required IDs/family are checked explicitly, and numeric fan-out parameters are clamped consistently before query execution.

## Next Focus
- Inspect `context-server.ts` dispatch plus the deep-loop graph tool path next; that will confirm whether the late-family contract split is isolated to the reviewed dispatchers or systemic across all post-`session_resume` tools.
