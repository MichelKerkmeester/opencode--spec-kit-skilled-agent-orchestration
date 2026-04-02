# Deep Review Report: ESM Module Compliance (spec-023)

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| Verdict | FINDINGS |
| hasAdvisories | true |
| Active P0 | 0 |
| Active P1 | 2 |
| Active P2 | 3 |
| Iterations (this pass) | 10 (021-030) |
| Cumulative Iterations | 30 |
| Stop Reason | requested_iteration_batch_complete |
| Reviewed Scope | 023 root + all phase folders + shared/mcp_server/scripts + commands/agents + feature catalog/playbook |
| Agent Model | gpt-5.3-codex high (multi-agent waves; platform max concurrency reached) |

Runtime/test/security regressions from the previous batch are fixed and rerun green. Remaining blockers are now warning-policy/documentation convergence items.

---

## 2. What Was Fixed

1. Task-enrichment regression fixed and revalidated (`54/54` passing).
2. Root/workspace `test:task-enrichment` command reliability fixed.
3. Legacy extractor/loader and naming-migration suites fixed and passing.
4. Shared-memory/V-rule/preflight fail-closed hardening landed with tests.
5. Command/agent parity and playbook/schema routing drift fixed.
6. Root packet frontmatter wording now consistently reflects completed runtime migration (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`).

Primary evidence (stable paths):
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:126`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1718`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:466`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:643`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:19`
- `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/spec.md:3`
- `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/plan.md:3`
- `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/tasks.md:3`
- `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/checklist.md:3`

---

## 3. Open Findings (021-030)

### P1
1. Strict recursive validator still fails on warnings (no hard errors).
- Current result: `Errors: 0, Warnings: 32, RESULT: FAILED (strict)`.

2. Warning backlog clusters remain in child phases (phase links, evidence-citation debt, custom anchors).
- Evidence:
  - `004-verification-and-standards/spec.md:52`
  - `009-reindex-validator-false-positives/checklist.md:43`
  - `012-memory-save-quality-pipeline/checklist.md:43`

### P2
1. Shared-memory trust model still uses env-gated interim binding.
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:201`

2. Legacy custom anchors still generate warning churn in early phases.
- Evidence:
  - `001-shared-esm-migration/tasks.md:59`
  - `002-mcp-server-esm-migration/tasks.md:60`
  - `003-scripts-interop-refactor/tasks.md:64`

3. Feature catalog still documents partial runtime wiring for one response-profile path.
- Evidence:
  - `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4284`

---

## 4. Validation Matrix (Latest)

### Passed
- `npm run build`
- `npm run typecheck`
- `TMPDIR="$PWD/.tmp" npm run --workspaces=false test:task-enrichment`
- `node scripts/tests/test-extractors-loaders.js`
- `node scripts/tests/test-naming-migration.js`

### Failed (strict policy only)
- `bash scripts/spec/validate.sh ../../specs/02--system-spec-kit/023-esm-module-compliance --recursive --strict`
- Result: `Errors: 0`, `Warnings: 32`, `RESULT: FAILED (strict)`

---

## 5. Iteration Index (021-030)

- `review/iterations/iteration-021.md`
- `review/iterations/iteration-022.md`
- `review/iterations/iteration-023.md`
- `review/iterations/iteration-024.md`
- `review/iterations/iteration-025.md`
- `review/iterations/iteration-026.md`
- `review/iterations/iteration-027.md`
- `review/iterations/iteration-028.md`
- `review/iterations/iteration-029.md`
- `review/iterations/iteration-030.md`

---

## 6. Required Remediation Order

1. Burn down strict-warning clusters and rerun strict validator until PASS.
2. Normalize child-phase status/checklist/evidence presentation (004-013) so closure state is unambiguous.
3. Keep shared-memory trust-binding hardening follow-up on the roadmap (transport-auth principal binding).

---

## 7. Status

Current status: **FINDINGS**  
Promotion gate: blocked by strict warning-policy debt (no active P0 runtime blockers).
