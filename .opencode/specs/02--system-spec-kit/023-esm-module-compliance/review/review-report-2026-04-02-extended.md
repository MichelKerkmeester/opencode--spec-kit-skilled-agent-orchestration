# Deep Review Report: ESM Module Compliance (spec-023)

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| Verdict | FAIL |
| hasAdvisories | true |
| Active P0 | 5 |
| Active P1 | 29 |
| Active P2 | 17 |
| Iterations (this pass) | 10 (011-020) |
| Cumulative Iterations | 20 |
| Stop Reason | requested_iteration_batch_complete |
| Reviewed Scope | 023 root + all phase folders + shared/mcp_server/scripts + skill docs + feature catalog/playbook + commands/agents/readmes |
| Agent Model | gpt-5.3-codex xhigh (multi-agent) + local verification |

The requested 10 additional deep-review iterations were completed and recorded as `iteration-011.md` through `iteration-020.md`. The packet is **not release-ready**. Multiple P0/P1 issues remain, including contradictory completion claims, failing verification suites, broken documentation/runtime contracts, and command-surface drift across runtime adapters.

---

## 2. Blocking Findings (P0)

1. Phase 006 checklist reports P0 completion while embedded evidence states unresolved failures.
- Evidence:
  - `006-review-remediation/checklist.md:23`
  - `006-review-remediation/checklist.md:67`
  - `006-review-remediation/checklist.md:120`

2. Phase 011/002 is marked complete with unperformed verification and placeholder summary content.
- Evidence:
  - `011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds/tasks.md:82`
  - `011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds/tasks.md:83`
  - `011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds/checklist.md:33`
  - `011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds/implementation-summary.md:43`

3. Phase 013 fail-closed requirement is contradictory across tasks/checklist/implementation-summary.
- Evidence:
  - `013-fts5-fix-and-search-dashboard/tasks.md:56`
  - `013-fts5-fix-and-search-dashboard/checklist.md:61`
  - `013-fts5-fix-and-search-dashboard/implementation-summary.md:25`

4. Placeholder-enforcement contract is not effective; completed phase docs still contain template placeholders.
- Evidence:
  - `.opencode/skill/system-spec-kit/SKILL.md:783`
  - `.opencode/skill/system-spec-kit/references/validation/validation_rules.md:153`
  - `001-shared-esm-migration/implementation-summary.md:43`
  - `002-mcp-server-esm-migration/implementation-summary.md:43`
  - `003-scripts-interop-refactor/implementation-summary.md:43`

5. Verification tests disprove “everything works”: task-enrichment guardrail regressions present.
- Evidence:
  - `scripts/tests/task-enrichment.vitest.ts:735`
  - `scripts/tests/task-enrichment.vitest.ts:1222`

---

## 3. Major Findings (P1 Clusters)

1. Packet truth-sync and closure drift.
- Root and phase docs disagree on completion state and evidence quality.
- Key evidence:
  - `spec.md:3`
  - `plan.md:44`
  - `tasks.md:94`
  - `checklist.md:97`
  - `implementation-summary.md:26`

2. Verification evidence mismatch and unresolved-check gating.
- Several phases mark completion while P0/P1 checks remain unchecked or contradictory.
- Key evidence:
  - `008-spec-memory-compliance-audit/checklist.md:44`
  - `008-spec-memory-compliance-audit/checklist.md:101`
  - `009-reindex-validator-false-positives/tasks.md:83`
  - `010-search-retrieval-quality-fixes/checklist.md:19`

3. Runtime architecture contract risks.
- DB update marker path mismatch across packages.
- Scripts/ESM interop boundary drift from 023 architecture contract.
- Startup-path tests partially invalid due stale mocks.
- Key evidence:
  - `.opencode/skill/system-spec-kit/shared/config.ts:24`
  - `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:82`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1374`

4. Scripts/tooling contract defects.
- JSON output surfaces mixed with human logs.
- JSON mode emits payloads to stderr in at least one completion path.
- Key evidence:
  - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:550`
  - `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:379`

5. Command/agent/runtime parity drift.
- Shared-memory status flags differ between canonical command docs and runtime wrapper docs.
- Orchestrator bootstrap behavior inconsistent across runtime adapters.
- Key evidence:
  - `.opencode/command/memory/manage.md:98`
  - `.agents/commands/memory/manage.toml:2`
  - `.opencode/agent/orchestrate.md:18`
  - `.codex/agents/orchestrate.toml:10`

6. Feature catalog and manual testing playbook drift.
- Broken cross-links, stale counts, and outdated `code_graph_query` schema usage.
- Key evidence:
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2509`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:42`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:643`

7. Workspace command reliability issue.
- `npm run typecheck` and `npm run test:*` at workspace root fail without explicit workspace scoping override.
- Verified workaround: `npm run --workspaces=false typecheck`.

---

## 4. Validation Matrix (This Pass)

### Failed
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/023-esm-module-compliance --recursive --strict`
- `npm run typecheck` (workspace dispatch failure)
- `npm run --workspaces=false test`
- `npm run test --workspace=@spec-kit/mcp-server`
- `npm run test --workspace=@spec-kit/scripts`
- `TMPDIR="$PWD/.tmp" npm run --workspaces=false test:task-enrichment`
- `node scripts/tests/test-extractors-loaders.js`
- `node scripts/tests/test-naming-migration.js`

### Passed
- `npm run build`
- `npm run --workspaces=false typecheck`
- `node scripts/dist/memory/generate-context.js --help`
- `node scripts/tests/test-embeddings-factory.js`
- `node scripts/tests/test-scripts-modules.js`
- `npx vitest run tests/handler-memory-search.vitest.ts tests/mcp-response-envelope.vitest.ts`

---

## 5. Iteration Index (011-020)

- `review/iterations/iteration-011.md` (root + phases 001-003)
- `review/iterations/iteration-012.md` (phases 004-006)
- `review/iterations/iteration-013.md` (phases 007-010)
- `review/iterations/iteration-014.md` (phases 011-013)
- `review/iterations/iteration-015.md` (scripts/tooling contracts)
- `review/iterations/iteration-016.md` (skill/reference/template alignment)
- `review/iterations/iteration-017.md` (commands/agents/readmes parity)
- `review/iterations/iteration-018.md` (feature catalog + playbook)
- `review/iterations/iteration-019.md` (shared + mcp_server runtime architecture)
- `review/iterations/iteration-020.md` (independent verification matrix)

---

## 6. Required Remediation Order

1. Resolve all P0 contradictions and failing guardrail tests before any further completion claims.
2. Truth-sync 023 packet docs (root + phases) so checklist/task/spec/implementation-summary states are coherent.
3. Fix runtime architecture P1s (DB marker path contract, startup-path test mocks, explicit interop boundary contracts).
4. Repair scripts/tooling JSON contract surfaces (`stdout` vs `stderr`) and workspace command reliability.
5. Reconcile command/agent parity drift and update catalog/playbook schema/link accuracy.
6. Re-run deep-review D3/D7 closure pass after remediation and regenerate report from clean evidence.

---

## 7. Status

Current status: **FAIL**  
Promotion gate: blocked until all P0 resolved and key P1 clusters remediated with reproducible command evidence.
