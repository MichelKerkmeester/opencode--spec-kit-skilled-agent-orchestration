---
title: "Feature Specification: Deep Review [02--system-spec-kit/023-hybrid-rag-fusion-refinement/006-review-remediation/spec]"
description: "Fix all 18 findings (14 P1 + 4 P2) from the 10-iteration GPT-5.4 deep review across security, runtime correctness, traceability, completeness, reliability, maintainability, and performance."
trigger_phrases:
  - "review remediation"
  - "deep review fixes"
  - "023 phase 6"
  - "fix review findings"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 6** of the ESM Module Compliance specification.

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-test-and-scenario-remediation |
| **Successor** | 007-hybrid-search-null-db-fix |
| **Handoff Criteria** | All 14 P1 findings resolved, all 4 P2 findings resolved, parent packet truth-synced, `/spec_kit:deep-review` re-run passes with PASS verdict |

**Scope Boundary**: Fix all 18 findings from the 10-iteration deep review (`../review/review-report.md`). No new features, no refactoring beyond what findings require.

**Dependencies**:
- Deep review report: `../review/review-report.md`
- All 10 iteration artifacts: `../review/iterations/iteration-001.md` through `../review/iterations/iteration-010.md`
- Parent packet docs: `../spec.md`, `../plan.md`, `../tasks.md`, `../checklist.md`, `../implementation-summary.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Ready for implementation |
| **Created** | 2026-03-30 |
| **Branch** | `system-speckit/023-esm-module-compliance` |
| **Parent Spec** | 023-hybrid-rag-fusion-refinement |
| **Source** | `../review/review-report.md` — 10-iteration deep review, GPT-5.4 via codex exec |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 10-iteration deep review found 14 P1 (required) and 4 P2 (advisory) findings across 5 workstreams. The ESM migration itself is technically sound at the import-graph level, but trust-boundary gaps, runtime contract drift, stale documentation, incomplete verification evidence, and reliability rough spots prevent a clean PASS verdict.

### Purpose
Resolve all 18 findings so the spec-023 review verdict can be promoted from CONDITIONAL to PASS.

### Rationale
The CONDITIONAL verdict blocks release-readiness. Each P1 finding was confirmed through adversarial self-check (Hunter/Skeptic/Referee) with file:line evidence. P2 items are included to achieve a clean PASS without advisories.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- **WS-1 Security** (4 P1): Shared-memory auth binding, V-rule fail-closed, path discovery hardening, scope-aware duplicate preflight
- **WS-2 Runtime** (3 P1): Guard root export, align Node engine contracts, fix __dirname in ESM wrappers
- **WS-3 Traceability** (3 P1): Truth-sync parent packet docs, remove stale addendum, fix CHK-010
- **WS-4 Completeness** (2 P1): Close Phase 4 child packet, add verification evidence for CHK-005/CHK-006
- **WS-5 Reliability/Maintainability** (2 P1 + 1 P2): Fix warning flattening, consolidate import degradation contracts, narrow API barrel
- **WS-6 Performance** (2 P2): Optimize vector-index-store hot-path, defer CLI heavy imports
- **WS-7 Correctness** (1 P2): Fix shared/package.json root export

### Out of Scope
- New features or capabilities
- Refactoring beyond what findings require
- Converting `@spec-kit/scripts` to ESM
- Standards docs outside spec-023 (remains deferred)

### Files to Change

| File Path | Change Type | Finding(s) |
|-----------|-------------|------------|
| `mcp_server/handlers/shared-memory.ts` | Modify | P1-SEC-01: Add trusted principal validation |
| `mcp_server/handlers/v-rule-bridge.ts` | Modify | P1-SEC-02: Fail closed when module unavailable |
| `mcp_server/handlers/memory-save.ts` | Modify | P1-SEC-02 (caller), P1-REL-01: Fix warning flattening |
| `shared/paths.ts` | Modify | P1-SEC-03: Validate path boundaries |
| `mcp_server/lib/validation/preflight.ts` | Modify | P1-CMP-03: Thread governed scope into duplicate check |
| `mcp_server/context-server.ts` | Modify | P1-COR-01: Guard main() behind CLI entrypoint check |
| `shared/package.json` | Modify | P1-COR-02 (engines), P2-COR-01 (root export) |
| `mcp_server/package.json` | Modify | P1-COR-02: Align engines to >=20.11.0 |
| Root `package.json` | Modify | P1-COR-02: Align engines to >=20.11.0 |
| `scripts/package.json` | Modify | P1-COR-02: Align engines to >=20.11.0 |
| `mcp_server/scripts/map-ground-truth-ids.ts` | Modify | P1-COR-03: Replace __dirname with import.meta |
| `mcp_server/scripts/reindex-embeddings.ts` | Modify | P1-COR-03: Replace __dirname with import.meta |
| `../spec.md` | Modify | P1-TRC-01, P1-TRC-02, P1-TRC-03: Truth-sync, remove stale addendum |
| `../plan.md` | Modify | P1-TRC-02: Mark Definition of Done items |
| `../tasks.md` | Modify | P1-TRC-02: Mark completed tasks [x] |
| `../checklist.md` | Modify | P1-TRC-01: Fix CHK-010, close closeable items |
| `../implementation-summary.md` | Modify | P1-TRC-02: Align with checklist state |
| `../004-verification-and-standards/` | Modify | P1-CMP-01: Close child packet |
| `scripts/core/workflow.ts` | Modify | P1-MNT-01: Consolidate import degradation contracts |
| `mcp_server/api/index.ts` | Modify | P2-MNT-02: Narrow barrel re-exports |
| `mcp_server/lib/search/vector-index-store.ts` | Modify | P2-PRF-01: Hoist dynamic imports |
| `mcp_server/cli.ts` | Modify | P2-PRF-02: Defer heavy imports behind command dispatch |
| `mcp_server/handlers/save/response-builder.ts` | Modify | P1-REL-01: Preserve specific warning types |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 14 P1 findings resolved | Each P1 finding has a code change with file:line evidence of the fix |
| REQ-002 | All 4 P2 findings resolved | Each P2 finding has a code change with evidence |
| REQ-003 | Parent packet truth-synced | spec.md, plan.md, tasks.md, checklist.md all reflect shipped reality |
| REQ-004 | Phase 4 child packet closed | 004-verification-and-standards has completed summary and checked items |
| REQ-005 | Tests pass after all changes | `npm run test --workspace=@spec-kit/mcp-server` and `npm run test --workspace=@spec-kit/scripts` green |
| REQ-006 | Builds pass | All three package builds succeed |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | No regressions | 9480+ tests still pass, no new failures |
| REQ-008 | Review re-run promotable | A targeted re-review of fixed areas finds no new P0/P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: All 18 findings from `../review/review-report.md` resolved with code changes
- **SC-002**: Parent packet docs tell a single coherent completion story
- **SC-003**: Phase 4 child packet is closed
- **SC-004**: All tests pass (0 failures, 0 skipped)
- **SC-005**: Re-review verdict is PASS (with or without advisories)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

### Acceptance Scenarios

**Given** the phase scope and requirements are loaded, **when** implementation starts, **then** only in-scope files and behaviors are changed.

**Given** the phase deliverables are implemented, **when** verification runs, **then** required checks complete without introducing regressions.

**Given** this phase depends on predecessor outputs, **when** those dependencies are present, **then** this phase behavior composes correctly with adjacent phases.

**Given** this phase modifies documented behavior, **when** packet docs are reviewed, **then** spec/plan/tasks/checklist remain internally consistent.

**Given** this phase is rerun in a clean environment, **when** the same commands are executed, **then** outcomes are reproducible.

**Given** completion is claimed, **when** evidence is inspected, **then** each required acceptance outcome is explicitly supported.

## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Security fixes change shared-memory API behavior | Medium | Ensure backward compatibility; add deprecation warnings if breaking |
| Risk | Fail-closed V-rule blocks saves when scripts not built | Medium | Add clear error message guiding user to build scripts |
| Risk | Narrowing API barrel breaks downstream consumers | Medium | Audit all import sites before removing re-exports |
| Risk | CLI import deferral changes startup behavior | Low | Test all CLI subcommands after restructure |
| Dependency | Phase 4 child packet state | Green | Only needs doc updates, not code changes |
| Dependency | Root package.json engines field | Yellow | May affect CI/CD or contributor setups |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The remediation scope, source review packet, and verification targets are already defined in `../review/review-report.md`.
<!-- /ANCHOR:questions -->
