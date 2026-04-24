## Iteration 02

### Focus

Feature-catalog and adjacent reference pages that explain code-graph storage, readiness, and CocoIndex bridging, with emphasis on stale test-path references and contract descriptions that lag behind packet `013`.

### Search Strategy

- Exact cross-reference scans:
  - `rg -n 'mcp_server/tests/code-graph-indexer\.vitest\.ts|mcp_server/tests/code-graph-seed-resolver\.vitest\.ts|mcp_server/tests/code-graph-siblings-readiness\.vitest\.ts' .opencode/skill/system-spec-kit/feature_catalog .opencode/skill/system-spec-kit/manual_testing_playbook -g '!**/dist/**'`
  - `rg --files .opencode/skill/system-spec-kit/mcp_server | rg 'code-graph-indexer\.vitest\.ts$|code-graph-seed-resolver\.vitest\.ts$|code-graph-siblings-readiness\.vitest\.ts$'`
  - `rg -n 'code_graph_status|code_graph_context|readiness|trustState|lastPersistedAt|requiredAction|graphAnswersOmitted' .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph -g '!**/dist/**'`
- Read numbered snippets from:
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence High/Med/Low | Why It Was Missed | Needs Update Y/N/Maybe |
|------|-------------------|----------|--------------------------|-------------------|------------------------|
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md` | This feature page still reduces `code_graph_status` to generic “health” and points at the old `mcp_server/tests/code-graph-indexer.vitest.ts` path even though the real suite now lives under `mcp_server/code-graph/tests/`. It should reflect the 013-era status/context contract and the real verification location. | Feature catalog | High | The packet touched runtime code and packet docs, but not the catalog page that productizes those tool contracts. | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md` | This bridge page still cites the old seed-resolver test path and describes `code_graph_context` only as “budget-aware truncation,” not the 013-era seed-fidelity plus blocked/partial-output behavior. | Feature catalog | High | Packet 013 updated the bridge implementation and context tests, but not the catalog entry that names the bridge contract. | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | The readiness-contract page still presents the public surface as `canonicalReadiness`, `trustState`, and `lastPersistedAt` only, plus it points at the old sibling-readiness test path. Packet 013 added user-visible blocked payloads (`requiredAction`, `graphAnswersOmitted`) on top of that shared readiness layer. | Feature catalog | High | The packet did not change `readiness-contract.ts` itself, so this adjacent contract doc was easy to overlook even though callers now see richer readiness outcomes. | Y |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` | The auto-trigger page still frames empty/stale handling only as automatic full-scan/selective-reindex actions. After 013, query/context callers can instead receive an explicit blocked read contract when a full scan is required but suppressed. | Feature catalog | Medium | The packet fixed query/context behavior rather than `ensure-ready.ts`, so the auto-trigger explainer was outside the immediate edit set. | Maybe |

### Already-Covered

The packet already covered `code-graph/lib/ensure-ready.ts`, `handlers/status.ts`, `handlers/context.ts`, `seed-resolver.ts`, `code-graph-context.ts`, and the focused handler tests. This iteration only flags the catalog/reference pages that continue to describe those files inaccurately or point to stale verification paths.

### Status

Feature-catalog drift is real and concrete. Two pages have definitely stale test-path references, and two pages lag the post-013 readiness/context semantics.
