---
title: "Feature Specification: bug-fixes-and-data-integrity [template:level_2/spec.md]"
description: "Stabilize causal-link error classification, tighten regression coverage, and align docs/verification evidence for phases 001-018."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "bug fixes"
  - "data integrity"
  - "causal link"
  - "verification alignment"
  - "phase 001-018"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: bug-fixes-and-data-integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-10 |
| **Updated** | 2026-03-13 |
| **Branch** | `008-bug-fixes-and-data-integrity` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../007-evaluation/spec.md |
| **Successor** | ../009-evaluation-and-measurement/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase `001` to `018` review identified a real reliability bug and documentation drift: `memory_causal_link` lock/busy database failures were being masked as validation-style failures, multiple docs overstated coverage freshness, and scripts-package local testing had broken paths/dependencies. This reduced trust in both runtime error handling and audit evidence.

### Purpose
Align code, tests, and packet documentation with actual behavior by:
1. Correcting lock/busy failure classification on the causal-link path.
2. Adding deterministic regressions for the fixed failure mode.
3. Replacing weak/pass-through test branches and stale claims.
4. Recording truthful verification evidence, including full package-level script checks and complete scripts test-suite results.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Causal-link DB lock/busy handling and handler-level envelope behavior (`E022` path).
- Regression additions in causal-edge and integration causal-graph suites.
- Incremental-index symlink test gating and stale-token cleanup.
- Documentation corrections for counts/coverage/playbook notes.
- Scripts package local testability fixes (dependency + path corrections).
- Packet documentation rewrite for truthful, current evidence.

### Out of Scope
- New feature development outside reported review findings.
- Broad test refactors unrelated to the identified defects.
- Any new changes beyond the reviewed and remediated findings for phases `001` to `018`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Re-throw SQLite lock/busy failures instead of returning `null` for those transient infra errors. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts` | Modify | Add regression test asserting lock/busy rethrow behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts` | Modify | Add deterministic `E022` integration regression when causal insert throws busy/locked error. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts` | Modify | Replace pass-through symlink fallback branches with capability-based `it.skip` gating. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts` | Modify | Remove stale legacy `hash_checks` token from comment text. |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Correct stale test file count and verification date. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` | Modify | Replace overclaim language and update count command/expected value. |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md` | Modify | Remove stale "pending agent" wording and reflect current coverage. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Replace undocumented-gap statement with explicit coverage notes matrix for 29 entries. |
| `.opencode/skill/system-spec-kit/scripts/package.json` | Modify | Add local `vitest` dependency and restore package-local test command reliability. |
| `.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts` | Modify | Fix incorrect relative import for `ascii-boxes`. |
| `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` | Modify | Correct expected direct CLI path resolution depth. |
| `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts` | Modify | Fix `/var` vs `/private/var` target validation on macOS. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/005-lifecycle/.DS_Store` | Delete | Remove stray artifact from packet tree. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/tasks.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/spec.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/plan.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/tasks.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/checklist.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/implementation-summary.md` | Modify | Bring packet docs in sync with actual implementation and verification state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lock/busy causal-link failures must not be masked as validation failures. | Busy/locked errors in `insertEdge()` are thrown and surface as infra failure envelope (`E022`) at handler layer. |
| REQ-002 | Regressions must cover storage-level and handler-level lock/busy behavior. | New tests in `causal-edges.vitest.ts` and `integration-causal-graph.vitest.ts` pass and prove the failure mode mapping. |
| REQ-003 | Known weak-pass test branches must be replaced with explicit gating behavior. | Incremental-index symlink-dependent tests use capability gate (`skip`) instead of pass-through assertions. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Documentation claims must match current repository reality. | Root README, test README, watcher feature doc, and playbook coverage section are updated with current wording/counts. |
| REQ-005 | Scripts package local testing path must be repairable and verifiable. | `scripts/package.json` includes `vitest`; supporting path and file-writer fixes are in place; individual suites pass. |
| REQ-006 | Packet verification status must remain truthful and complete. | Checklist includes recorded evidence for `npm run typecheck`, `npm run check` (`mcp_server`, `scripts`), targeted MCP suites, and full scripts package `npm test` completion. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Causal-link lock/busy failures now propagate as infra path (`E022`) rather than false validation failures.
- **SC-002**: Deterministic regressions for causal edges and integration handler flow pass.
- **SC-003**: Documentation drift across review artifacts is corrected with concrete, current statements.
- **SC-004**: Spec packet reflects complete verification state with all required checks recorded as passing.

### Acceptance Scenarios

1. **Given** SQLite write contention on edge insert, **When** `memory_causal_link` executes, **Then** handler returns infra-class error envelope rather than `E031` validation-style failure.
2. **Given** environments without directory-symlink support, **When** incremental-index tests run, **Then** symlink-dependent tests are skipped explicitly instead of silently passing.
3. **Given** review consumers inspect docs/playbooks, **When** they compare claims to repository state, **Then** stale counts and "pending agent" claims are absent.
4. **Given** verification artifacts, **When** checklist is reviewed, **Then** completed items contain command-level evidence for package checks and full scripts suite completion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Verification output durability (logs and command evidence) | Missing evidence may reduce future audit confidence | Preserve explicit command/result evidence in checklist and implementation summary. |
| Risk | Lock/busy classification regex may miss uncommon SQLite message variants | Rare masking path could remain | Maintain targeted tests and expand pattern only with real failing evidence. |
| Dependency | Manual playbook/catalog docs can drift again | Future audits may become stale | Keep matrix-style coverage notes and count snapshots updated at packet closeout. |
| Risk | Cross-platform path normalization differences | File-writer guard may regress on non-macOS environments | Retain path-resolution regression test and avoid raw source path comparisons. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. RESOLVED QUESTIONS

- **Error-classification direction**: Lock/busy DB failures are treated as infrastructure failures and surfaced through `E022`, not validation-style edge-create failure semantics.
- **Verification truthfulness rule**: Full `scripts` package verification is now recorded as complete with command-level evidence and results.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Error-classification fix must not introduce additional DB writes or broaden query surfaces.
- **NFR-P02**: Test hygiene changes should not increase baseline suite runtime except for expected skip gating behavior.

### Security
- **NFR-S01**: No auth/authz behavior changes in MCP handlers.
- **NFR-S02**: No secrets/credentials introduced in modified docs/tests/scripts.

### Reliability
- **NFR-R01**: Critical causal-link failure mode must be deterministic under simulated lock/busy conditions.
- **NFR-R02**: Packet documentation must represent only observed verification evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/non-actionable edge insert inputs can still return validation-style null path where expected.
- Very large test suites still rely on explicit runner output for completion claims.

### Error Scenarios
- `SQLITE_BUSY` and `SQLITE_LOCKED` errors thrown during edge writes.
- macOS path aliasing (`/var` vs `/private/var`) in file writer target checks.

### State Transitions
- Environment without symlink capability transitions from hidden pass branch to explicit `skip`.
- Packet state has transitioned from "in verification" to "complete" with full scripts run evidence captured.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple runtime, tests, scripts, and documentation surfaces touched. |
| Risk | 20/25 | Error classification and evidence-trust issues impact audit confidence. |
| Research | 14/20 | Required cross-checking review findings against current repository state. |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
