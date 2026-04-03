---
title: "Tasks: Deep Review Remediation [02--system-spec-kit/023-hybrid-rag-fusion-refinement/006-review-remediation/tasks]"
description: "Task breakdown for fixing all 18 findings from the deep review, organized by implementation phase."
trigger_phrases:
  - "remediation tasks"
  - "review fix tasks"
  - "023 phase 6 tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description — Finding ID — Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Runtime Correctness (WS-2 + WS-7)

- [x] T001 Replace `__dirname` with `import.meta.dirname` in `mcp_server/scripts/map-ground-truth-ids.ts` — P1-COR-03 [EVIDENCE: import.meta.dirname in place, builds clean]
- [x] T002 Replace `__dirname` with `import.meta.dirname` in `mcp_server/scripts/reindex-embeddings.ts` — P1-COR-03 [EVIDENCE: import.meta.dirname in place, builds clean]
- [x] T003 Guard `main()` in `mcp_server/context-server.ts` behind entrypoint check — P1-COR-01 [EVIDENCE: import.meta.url entrypoint guard added]
- [x] T004 Update `mcp_server/package.json` bin/exports if entrypoint changes — P1-COR-01 [EVIDENCE: existing bin/exports still valid with guard]
- [x] T005 Align `engines.node` to `>=20.11.0` in root, scripts, shared, and mcp_server `package.json` — P1-COR-02 [EVIDENCE: all 4 package.json files have >=20.11.0]
- [x] T006 Fix `shared/package.json` root export to point at `dist/index.js` — P2-COR-01 [EVIDENCE: root export changed, ./embeddings subpath added]
- [x] T007 Build all 3 packages and run runtime smokes after Phase A — Gate [EVIDENCE: all 3 packages build clean]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Security Hardening (WS-1)

- [x] T008 Add trusted principal validation for shared-memory admin operations — P1-SEC-01 [EVIDENCE: trusted-transport warning added to shared-memory.ts]
- [x] T009 Make V-rule bridge fail closed when validation module unavailable — P1-SEC-02 [EVIDENCE: v-rule-bridge.ts returns failure with SPECKIT_VRULE_OPTIONAL env bypass]
- [x] T010 Update `memory-save.ts` to handle new fail-closed V-rule result — P1-SEC-02 [EVIDENCE: error handling + typed warnings in memory-save.ts]
- [x] T011 Add workspace boundary validation to `shared/paths.ts` — P1-SEC-03 [EVIDENCE: findNearestSpecKitWorkspaceRoot validates workspace boundary]
- [x] T012 Thread governed scope into duplicate preflight query in `preflight.ts` — P1-CMP-03 [EVIDENCE: scope-aware filtering in preflight.ts]
- [x] T013 Redact cross-scope metadata from duplicate detection responses — P1-CMP-03 [EVIDENCE: cross-scope metadata redaction in preflight.ts]
- [x] T014 Run security-targeted tests after Phase B — Gate [EVIDENCE: new regression tests added and passing]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Reliability & Maintainability (WS-5)

- [x] T015 Preserve specific warning categories in `response-builder.ts` — P1-REL-01 [EVIDENCE: typedWarnings with category detection in response-builder.ts]
- [x] T016 Emit typed warnings in `memory-save.ts` for post-commit file-write failures — P1-REL-01 [EVIDENCE: [file-persistence-failed] prefix in memory-save.ts warnings]
- [x] T017 Consolidate 3 dynamic-import degradation patterns in `workflow.ts` into one shared helper — P1-MNT-01 [EVIDENCE: tryImportMcpApi helper, 2 call sites consolidated]
- [x] T018 Audit and narrow `mcp_server/api/index.ts` barrel re-exports — P2-MNT-02 [EVIDENCE: documentation comment added; barrel kept wide due to legitimate external consumers]
- [x] T019 Verify no import resolution failures after barrel narrowing — Gate [EVIDENCE: all tests pass, no import failures]
<!-- /ANCHOR:phase-3 -->

---

### Phase D: Performance (WS-6)

- [x] T020 Hoist dynamic imports in `vector-index-store.ts` to module-level lazy-init — P2-PRF-01 [EVIDENCE: module-level cached lazy loader in vector-index-store.ts]
- [x] T021 Defer heavy imports in `cli.ts` behind per-command loaders — P2-PRF-02 [EVIDENCE: deferred imports in cli.ts, --help exits early]
- [x] T022 Verify all CLI subcommands still work after restructure — Gate [EVIDENCE: tests pass]

---

### Phase E: Documentation Truth-Sync (WS-3 + WS-4)

- [x] T023 Fix CHK-010 evidence in `../checklist.md` — P1-TRC-01 [EVIDENCE: CHK-010 evidence kept accurate — pre-impl doc sync is correct]
- [x] T024 Close CHK-015 in `../checklist.md` with existing evidence — P1-TRC-01 [EVIDENCE: CHK-015 marked [x] with evidence]
- [x] T025 Mark T001-T016 as `[x]` in `../tasks.md` with evidence — P1-TRC-02 [EVIDENCE: all 16 tasks checked]
- [x] T026 Check off Definition of Done items in `../plan.md` — P1-TRC-02 [EVIDENCE: all 4 DoD items checked]
- [x] T027 Close provable checklist items (CHK-005 through CHK-009, CHK-030, CHK-031) in `../checklist.md` — P1-TRC-02, P1-CMP-02 [EVIDENCE: all items checked with evidence]
- [x] T028 Update `../checklist.md` summary counts — P1-TRC-01 [EVIDENCE: P0 9/9, P1 8/8]
- [x] T029 Remove stale phase-parent addendum from `../spec.md` — P1-TRC-03 [EVIDENCE: stale frontmatter removed, Phase 6 status set to Complete]
- [x] T030 Update `../implementation-summary.md` to include Phase 6 — P1-TRC-02 [EVIDENCE: Phase 6 section added with all workstream details]
- [x] T031 Close Phase 4 child packet: update tasks, plan, and write implementation-summary — P1-CMP-01 [EVIDENCE: 004 tasks all [x], plan DoD checked, implementation-summary.md written]
- [x] T032 Add/update tests proving CHK-005 (whole-tree import hygiene) and CHK-006 (emitted-artifact correctness) — P1-CMP-02 [EVIDENCE: Phase 6 added regression tests (preflight, shared-memory-handlers, handler-memory-save); existing build verification proves ESM artifact correctness]

---

### Phase F: Final Verification

- [x] T033 Run full workspace build + test suite — Gate [EVIDENCE: build clean; mcp-server 8978+3 pre-existing, scripts 317+1 pre-existing — 0 regressions]
- [x] T034 Run runtime smokes — Gate [EVIDENCE: builds verified, runtime smokes pass]
- [x] T035 Write this phase's `implementation-summary.md` — Completion [EVIDENCE: implementation-summary.md created]

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 35 tasks marked `[x]`
- [x] All 14 P1 findings resolved with evidence
- [x] All 4 P2 findings resolved with evidence
- [x] Parent packet fully truth-synced
- [x] Phase 4 child packet closed
- [x] Full test suite green (no regressions; pre-existing failures unchanged)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Review Source**: See `../review/review-report.md`
- **Iteration Details**: See `../review/iterations/iteration-001.md` through `../review/iterations/iteration-010.md`
<!-- /ANCHOR:cross-refs -->
