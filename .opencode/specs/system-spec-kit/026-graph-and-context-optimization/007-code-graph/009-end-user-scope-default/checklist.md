---
title: "Verification Checklist: End-User Scope Default Implementation"
description: "Level 3 verification checklist for packet 009 implementation gates, including scope helper tests, migration/readiness checks, docs, and regression validation."
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
trigger_phrases:
  - "009 checklist"
  - "end user scope verification"
  - "code graph indexing checklist"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T15:24:56Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "FIX-009-v3 complete"
    next_safe_action: "Verify with DR-009-v4 then commit + push"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: End-User Scope Default Implementation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements remain documented in `spec.md`; verify with `rg -n "F1:|F2:|NF2:" spec.md`.
- [x] CHK-002 [P0] Technical approach remains defined in `plan.md`; verify Phase 1-3 sections and critical path are present.
- [x] CHK-003 [P1] Dependencies and sibling references are available; verify `plan.md` dependency table and `resource-map.md` modified-file list.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes focused TypeScript/Vitest checks; verify focused test command exits 0.
- [x] CHK-011 [P0] No runtime warnings are introduced in focused test output; verify stderr has no new stack traces.
- [x] CHK-012 [P1] Error handling reuses existing full-scan blocked shape; verify `requiredAction:"code_graph_scan"` remains present.
- [x] CHK-013 [P1] Code follows existing scan/config/readiness patterns; verify no broad rework outside `resource-map.md` scope.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All packet acceptance criteria are met; verify CHK-G1, CHK-G2, and CHK-G3 sections.
- [x] CHK-021 [P0] Manual migration path is tested or fixture-simulated; verify stale fingerprint produces full-scan-required state.
- [x] CHK-022 [P1] Edge cases are tested: default false, env true, per-call true, stale stored scope; verify test names cover each case.
- [x] CHK-023 [P1] Error scenarios are validated: unknown schema field rejected and scope mismatch does not run inline full scan.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes are covered by remediation sections: same-class scope policy, cross-consumer status/readiness, path sanitization, matrix evidence, and env isolation.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed; evidence: CHK-G1-02 through CHK-G1-06 and CHK-G-V2-05 cover the scan, indexer, config, schema, and shared literals.
- [x] CHK-FIX-003 [P0] Consumer inventory completed; evidence: CHK-G2-01 through CHK-G2-06 cover readiness, context/query blocked response shape, status, and startup.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table coverage; evidence: CHK-G-V2-03 and CHK-G-V3-01 cover precedence plus delimiter cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row counts are listed before completion; evidence: CHK-G-V2-03 records the six-case precedence matrix.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variants executed where process env is read; evidence: CHK-G1-08, CHK-G-NEW-01, and CHK-G-V2-04 cover env true/false and restore behavior.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit file/line references in remediation gates rather than only moving branch-relative ranges.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added; verify `rg "SPECKIT_CODE_GRAPH_INDEX_SKILLS=.*[A-Za-z0-9]{20}"` returns no matches.
- [x] CHK-031 [P0] Tool input validation remains strict; verify unknown property rejection still passes in `tool-input-schema.vitest.ts`.
- [x] CHK-032 [P1] Path filtering stays deny-by-default for skill internals; verify `.opencode/skill/**` is excluded unless opt-in is true.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, resource-map, and decision-record stay synchronized; verify cross-references and phase names match.
- [x] CHK-041 [P1] Code comments are limited to non-obvious scope/readiness logic; verify no narration comments are added.
- [x] CHK-042 [P2] README and env reference are updated; verify `rg "SPECKIT_CODE_GRAPH_INDEX_SKILLS|includeSkills|full scan"`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stay outside packet docs or under `scratch/`; verify `find "$PACKET" -maxdepth 2 -type f`.
- [x] CHK-051 [P1] No archive copy of deleted graph rows or docs is created; verify no new `z_archive` path under this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 33 | 33/33 |
| P1 Items | 27 | 27/27 |
| P2 Items | 11 | 11/11 |

**Verification Date**: 2026-05-02 - implementation complete, gates passed
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`; verify ADR-001 status is Accepted.
- [x] CHK-101 [P1] All ADRs have status; verify `rg -n "Status" decision-record.md`.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale; verify env-only, schema-only, config-only, additive excludes, and old default appear.
- [x] CHK-103 [P2] Migration path documented; verify scope fingerprint and explicit full scan are described.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Default scan file count is measured after implementation; verify `implementation-summary.md` records files before/after.
- [x] CHK-111 [P1] Node/edge count delta is measured after implementation; verify DB count evidence is recorded.
- [x] CHK-112 [P2] Optional local full-scan duration captured; verify command and timing are recorded if run.
- [x] CHK-113 [P2] Performance baseline cites actual local data, not only research estimates.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and feasible; verify `plan.md` rollback section.
- [x] CHK-121 [P0] Maintainer opt-in is configured/documented; verify env reference and README entries.
- [x] CHK-122 [P1] Status/readiness monitoring exposes scope mismatch; verify `code_graph_status` output or tests.
- [x] CHK-123 [P1] Operator runbook path exists in README; verify full-scan migration instructions.
- [x] CHK-124 [P2] Optional rollback dry-run noted if a commit is later made; verify no commit is made in this task.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Workflow-invariance Vitest remains green; verify Gate B command exits 0.
- [x] CHK-131 [P1] Dependency licenses unaffected; verify no package dependencies are added.
- [x] CHK-132 [P2] Public spec workflow wording unchanged; verify no Gate 3/spec-level prompts are edited.
- [x] CHK-133 [P2] Data handling uses delete semantics for graph rows; verify no archive table or archive file is added.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents validate clean with strict validator; verify Gate A output has `Errors: 0`.
- [x] CHK-141 [P1] Tool schema documentation is complete; verify `includeSkills` schema description is present.
- [x] CHK-142 [P2] User-facing documentation updated without unrelated workflow vocabulary changes.
- [x] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md` after implementation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Maintainer | Technical Lead | [ ] Approved | |
| Maintainer | Product Owner | [ ] Approved | |
| Maintainer | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

## Phase Gates

### Gate 1 (Phase 1): scope helpers + tests

- [x] CHK-G1-01 [P0] Live import paths checked before helper placement; evidence: `index-scope-policy.ts` was created to avoid coupling `index-scope.ts` to `indexer-types.ts`.
- [x] CHK-G1-02 [P0] `index-scope.ts` rejects `.opencode/skill/**` by default and accepts explicit opt-in; evidence: `shouldIndexForCodeGraph()` takes `scopePolicy`, tested in `code-graph-indexer.vitest.ts`.
- [x] CHK-G1-03 [P0] `indexer-types.ts` default excludes include `.opencode/skill/**` and omit it only with opt-in; evidence: `getDefaultConfig()` tests cover default, env, per-call, and `mcp-coco-index` carve-out.
- [x] CHK-G1-04 [P0] `scan.ts` reads `SPECKIT_CODE_GRAPH_INDEX_SKILLS` and `includeSkills`; evidence: `resolveIndexScopePolicy()` is called from `scan.ts` and `code-graph-scan.vitest.ts` verifies per-call opt-in.
- [x] CHK-G1-05 [P0] `structural-indexer.ts` applies the same policy during candidate walking; evidence: fixture test skips `.opencode/skill/**` before parse by default and includes it with opt-in.
- [x] CHK-G1-06 [P0] Strict tool schema accepts `includeSkills` and rejects unknown fields; evidence: `tool-input-schema.vitest.ts` accepts boolean `includeSkills` and rejects non-boolean/unknown fields.
- [x] CHK-G1-07 [P1] Focused Phase 1 Vitest command passes; evidence: 2 files and 125 tests passed.
- [x] CHK-G1-08 [P1] Tests restore process env after env opt-in cases; evidence: `afterEach()` deletes `SPECKIT_CODE_GRAPH_INDEX_SKILLS` and repeated focused run passed.

### Gate 2 (Phase 2): migration + readiness

- [x] CHK-G2-01 [P0] Active scope fingerprint is stored in `code_graph_metadata` after scans; evidence: `code-graph-scope-readiness.vitest.ts` round-trips `scope_fingerprint` and `scope_label`.
- [x] CHK-G2-02 [P0] Readiness detects stored-vs-active scope mismatch; evidence: `getGraphReadinessSnapshot()` returns `action:"full_scan"` on mismatched scope.
- [x] CHK-G2-03 [P0] Scope mismatch cannot be fixed by inline selective indexing; evidence: `ensureCodeGraphReady(... allowInlineFullScan:false)` returns full scan skipped for read path.
- [x] CHK-G2-04 [P0] Context/query blocked response shape is reused; evidence: `rg "requiredAction.*code_graph_scan" code_graph/handlers/` finds `context.ts` and `query.ts`.
- [x] CHK-G2-05 [P1] Status reports active scope, stored scope, and old skill-path count when available; evidence: `status.ts` emits `activeScope`, `storedScope`, `scopeMismatch`, and `excludedTrackedFiles`.
- [x] CHK-G2-06 [P2] Startup brief adds a concise mismatch hint only when needed; evidence: `startup-brief.ts` checks for `code graph scope changed` before adding the full-scan hint.

### Gate 3 (Phase 3): docs + verification

- [x] CHK-G3-01 [P1] Code graph README documents default `.opencode/skill/**` exclusion; evidence: `code_graph/README.md` section 8 lists default exclusions.
- [x] CHK-G3-02 [P1] ENV reference documents `SPECKIT_CODE_GRAPH_INDEX_SKILLS=false` default; evidence: `ENV_REFERENCE.md` Graph table includes the default-off row.
- [x] CHK-G3-03 [P0] README documents full-scan migration for existing databases; evidence: `code_graph/README.md` shows `{ "incremental": false }` migration.
- [x] CHK-G3-04 [P0] Startup/status copy avoids changing Gate 3 or spec-level workflow text; evidence: workflow-invariance Vitest passed with 1 file and 2 tests.
- [x] CHK-G3-05 [P0] Focused Vitest suites pass; evidence: remediation focused suites passed 162 tests and full code graph suite passed 224 tests.
- [x] CHK-G3-06 [P0] Workflow-invariance Vitest passes; evidence: `workflow-invariance.vitest.ts` passed 2 tests.
- [x] CHK-G3-07 [P0] Strict validation passes for packet 009 and sibling 008; evidence: both `validate.sh --strict` runs returned Errors: 0, Warnings: 0.
- [x] CHK-G3-08 [P2] Full-fleet sample regression and performance baseline are recorded; evidence: sentinel packet validates clean and `implementation-summary.md` records 1,619/34,850/16,530 to 48/646/1,231.

### Remediation

- [x] CHK-G-NEW-01 [P1] Per-call `includeSkills:false` overrides env opt-in; evidence: `code-graph-indexer.vitest.ts` and `code-graph-scan.vitest.ts` both cover env true plus explicit false.
- [x] CHK-G-NEW-02 [P1] Symlinked skill roots stay excluded by default; evidence: indexer symlink fixture and scan handler canonical-root test passed in focused Vitest.
- [x] CHK-G-NEW-03 [P2] Scan scope errors and returned warnings avoid absolute workspace paths; evidence: `code-graph-scan.vitest.ts` covers invalid root, out-of-workspace root, and warning sanitization.
- [x] CHK-G-NEW-04 [P2] Resource map matches the Gate E implementation diff; evidence: Gate E `diff` returned no output.
- [x] CHK-G-NEW-05 [P2] Precedence and symlink semantics are documented; evidence: `code_graph/README.md`, `ENV_REFERENCE.md`, `plan.md`, and ADR-002 were updated.

### Remediation v2

- [x] CHK-G-V2-01 [P0] `data.errors` paths are workspace-relative; evidence: `scan.ts:196`, `scan.ts:296`, `scan.ts:301`, `scan.ts:340`, and `code-graph-scan.vitest.ts:486`.
- [x] CHK-G-V2-02 [P1] `code_graph_status` reflects per-call scope override from stored scan metadata; evidence: `status.ts:173`, `status.ts:174`, `code-graph-db.ts:248`, `code-graph-db.ts:262`, and `code-graph-scan.vitest.ts:321`.
- [x] CHK-G-V2-03 [P1] Six-case precedence test matrix is complete; evidence: `code-graph-indexer.vitest.ts:277`.
- [x] CHK-G-V2-04 [P1] Env-var test isolation captures and restores caller env; evidence: `code-graph-scan.vitest.ts:100`, `code-graph-indexer.vitest.ts:103`, and `code-graph-scope-readiness.vitest.ts:59`.
- [x] CHK-G-V2-05 [P2] Scope literals are centralized through `CODE_GRAPH_SKILL_EXCLUDE_GLOBS` and `CODE_GRAPH_INDEX_SKILLS_ENV`; evidence: `index-scope-policy.ts:5`, `index-scope-policy.ts:10`, `index-scope.ts:5`, and `code-graph-db.ts:600`.
- [x] CHK-G-V2-06 [P2] README topology documents `index-scope-policy.ts`; evidence: `code_graph/lib/README.md:99`, `code_graph/lib/README.md:176`, `code_graph/README.md:140`, and `code_graph/README.md:167`.
- [x] CHK-G-V2-07 [P2] ADR-001 includes the sixth precedence sub-decision; evidence: `decision-record.md:79`.

### Remediation v3

- [x] CHK-G-V3-01 [P0] `relativizeScanError()` handles colon/NUL/quote/bracket delimiters; evidence: `scan.ts:192`, `scan.ts:194`, `scan.ts:203`, `scan.ts:207`, and `code-graph-scan.vitest.ts:99`.

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
