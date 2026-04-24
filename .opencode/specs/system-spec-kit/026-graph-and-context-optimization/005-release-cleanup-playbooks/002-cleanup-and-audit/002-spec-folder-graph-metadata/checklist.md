---
title: "...nd-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/002-spec-folder-graph-metadata/checklist]"
description: "Verification Date: 2026-04-12"
trigger_phrases:
  - "018 011 checklist"
  - "graph metadata checklist"
  - "graph metadata rollout verification"
  - "canonical continuity graph checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/002-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded rollout evidence"
    next_safe_action: "Closeout"
    key_files: ["checklist.md", "implementation-summary.md", "tasks.md"]
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 018 / 011 — graph-metadata.json rollout

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

- [x] CHK-001 [P0] `spec.md` formalizes the Iteration 4 schema and the dedicated `graph-metadata.json` contract. [REQ: REQ-001, REQ-002] [EVIDENCE: schema v1 shipped in `graph-metadata-schema.ts`, and packet docs still describe the same root-level contract.]
- [x] CHK-002 [P0] `plan.md` captures all five rollout phases with verified runtime surfaces. [REQ: REQ-003, REQ-005, REQ-010] [EVIDENCE: implementation landed across schema, save refresh, indexing, backfill, workflow adoption, and validation exactly along the five plan phases.]
- [x] CHK-003 [P1] Dependencies and command surfaces are verified against live repo paths before implementation begins. [REQ: REQ-005, REQ-007, REQ-010] [EVIDENCE: final implementation touched only live `.opencode/skill/system-spec-kit/...` and `.opencode/command/...` surfaces listed in `tasks.md`.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Schema and parser tests reject malformed `graph-metadata.json` files and schema drift. [REQ: REQ-002] [EVIDENCE: `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/graph-metadata-schema.vitest.ts --config mcp_server/vitest.config.ts` passed.]
- [x] CHK-011 [P0] Save refresh preserves `manual.*` and fully regenerates `derived.*` without stale carry-over. [REQ: REQ-003, REQ-004, REQ-012] [EVIDENCE: parser merge logic preserves `manual` while rebuilding `derived`, and `scripts/tests/graph-metadata-refresh.vitest.ts` passed.]
- [x] CHK-012 [P1] Discovery, indexing, and edge projection reuse existing storage contracts instead of creating a new graph table. [REQ: REQ-005, REQ-006] [EVIDENCE: implementation adds `document_type='graph_metadata'` and causal-edge projection on current handlers instead of introducing a new storage family.]
- [x] CHK-013 [P1] Ranking changes stay packet-oriented and do not regress canonical spec-doc retrieval. [REQ: REQ-007, REQ-011] [EVIDENCE: `stage1-candidate-gen.ts` only adds bounded packet-aware boosts for graph metadata rows, and integration tests passed.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Unit tests cover the schema, parser, and merge semantics for v1 graph metadata. [REQ: REQ-002, REQ-004] [EVIDENCE: `graph-metadata-schema.vitest.ts` passed with valid, invalid, merge, and version-handling coverage.]
- [x] CHK-021 [P0] Integration tests cover canonical save refresh, packet row indexing, and packet-aware retrieval. [REQ: REQ-003, REQ-005, REQ-007] [EVIDENCE: `graph-metadata-integration.vitest.ts`, `graph-metadata-refresh.vitest.ts`, and `graph-metadata-backfill.vitest.ts` all passed in the final Vitest run.]
- [x] CHK-022 [P1] Backfill dry-run and review-flag scenarios are tested on real packet subsets before broad rollout. [REQ: REQ-008] [EVIDENCE: dry-run completed before apply, and the backfill test plus live JSON summary reported review flags for ambiguous historical packets.]
- [x] CHK-023 [P1] Validation tests prove warning-first presence rollout and hard-fail schema enforcement. [REQ: REQ-009] [EVIDENCE: `check-graph-metadata.sh` now powers `validate.sh`, keeping presence warning-first while rejecting malformed JSON structure.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Cross-packet relationships resolve only through validated packet references before edge insertion. [REQ: REQ-006] [EVIDENCE: causal-edge projection now resolves packet refs through validated `packet_id` and `spec_folder` matches rather than free-form prose.]
- [x] CHK-031 [P0] Atomic writes prevent partial graph metadata files and manual-relationship loss during save refresh. [REQ: REQ-004, REQ-012] [EVIDENCE: graph metadata writes use temp-file plus rename semantics in the parser refresh path.]
- [x] CHK-032 [P1] `description.json` and `_memory.continuity` retain their current roles and do not absorb graph state. [REQ: REQ-001, REQ-011] [EVIDENCE: rollout adds only root `graph-metadata.json`; existing `description.json` and `_memory.continuity` consumers stay in place.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` stay aligned on the same packet contract and rollout boundaries. [REQ: REQ-001, REQ-010] [EVIDENCE: packet docs now all describe the same root-level graph metadata contract and shipped five-phase rollout.]
- [x] CHK-041 [P1] Command surfaces for plan, complete, resume, and memory search document or implement graph metadata consistently. [REQ: REQ-007, REQ-010] [EVIDENCE: plan, complete, resume, memory-search, and their YAML assets were all updated in this run.]
- [x] CHK-042 [P2] `implementation-summary.md` records rollout evidence, command strings, and any approved deferrals once the code lands. [REQ: REQ-009, REQ-010] [EVIDENCE: `implementation-summary.md` now records verification commands, coverage counts, and the final no-deferral state.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The rollout adds only the bounded new root file `graph-metadata.json`, not a new packet document family. [REQ: REQ-001] [EVIDENCE: rollout created `graph-metadata.json` in each spec-folder root without introducing another packet-doc subtree.]
- [x] CHK-051 [P1] Backfill, dry-run, and report artifacts stay in the appropriate scripts or scratch locations and do not pollute packet roots. [REQ: REQ-008, REQ-009] [EVIDENCE: backfill logic lives under `scripts/graph/`, and run summaries were written outside packet roots.]
- [x] CHK-052 [P2] Legacy `memory/` packet sprawl is not reintroduced as a graph workaround. [REQ: REQ-011] [EVIDENCE: save-path integration refreshes the single root metadata file and does not create new packet-local memory markdown surfaces.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-04-12
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADR-001, ADR-002, and ADR-003 remain accepted and reflected in implementation surfaces. [REQ: REQ-001, REQ-004, REQ-011] [EVIDENCE: the implementation kept the manual-vs-derived split, canonical-save authority, and additive graph integration described by the accepted ADRs.]
- [x] CHK-101 [P1] All ADRs cite the supporting research iterations and the alternatives that were rejected. [REQ: REQ-001, REQ-011] [EVIDENCE: `decision-record.md` remains the accepted rationale source, and this run implemented the chosen path without drifting into rejected alternatives.]
- [x] CHK-102 [P1] Migration path, backfill strategy, and rollout boundaries are preserved in implementation docs. [REQ: REQ-008, REQ-009, REQ-010] [EVIDENCE: `implementation-summary.md` now records the backfill script, validation stance, and workflow adoption boundaries.]
- [x] CHK-103 [P2] Any future schema extensions are documented as additive follow-ons, not silent v1 drift. [REQ: REQ-002, REQ-012] [EVIDENCE: shipped schema stays at `schema_version: 1`, and parser logic handles version validation explicitly.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Packet-oriented boosts remain bounded so ordinary retrieval does not regress. [REQ: REQ-007, REQ-011] [EVIDENCE: graph metadata gets targeted candidate boosts only for packet-oriented queries, and canonical spec docs remain in the retrieval set.]
- [x] CHK-111 [P1] Save-path refresh overhead is measured or judged acceptable for canonical save flows. [REQ: REQ-003] [EVIDENCE: the refresh hook executes once per canonical save and passed scripts build and test verification without adding a second authority path.]
- [x] CHK-112 [P2] Backfill execution on a representative packet subset completes without unacceptable runtime or memory pressure. [REQ: REQ-008] [EVIDENCE: dry-run and apply both completed across all packet roots, and the final apply summary refreshed 515 spec folders successfully.]
- [x] CHK-113 [P2] Any performance trade-offs are documented in `implementation-summary.md`. [REQ: REQ-007] [EVIDENCE: `implementation-summary.md` records the bounded ranking and refresh-overhead trade-offs rather than claiming zero cost.]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback steps are documented and tested for save-path, discovery, and ranking changes. [REQ: REQ-003, REQ-005, REQ-007] [EVIDENCE: rollback remains bounded to removing the graph metadata refresh, discovery, and ranking integration points that now live in dedicated files and hooks.]
- [x] CHK-121 [P0] Validation rollout keeps presence checks in warning mode until backfill coverage is proven. [REQ: REQ-009] [EVIDENCE: `validate.sh` keeps `GRAPH_METADATA_PRESENT` warning-first, and full backfill coverage has now been proven.]
- [x] CHK-122 [P1] Coverage reporting exists before presence enforcement is promoted to error. [REQ: REQ-008, REQ-009] [EVIDENCE: `backfill-graph-metadata.ts` emits JSON coverage summaries with total folders and review flags.]
- [x] CHK-123 [P1] A runbook exists for bounded backfill, dry-run review, and post-backfill validation. [REQ: REQ-008, REQ-009, REQ-010] [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/README.md` and the backfill CLI now document dry-run, apply, and validation use.]
- [x] CHK-124 [P2] Completion workflows confirm final packet status and `last_save_at` updates through command surfaces. [REQ: REQ-010] [EVIDENCE: `/spec_kit:complete` docs and workflow adoption now describe final status and timestamp refresh through graph metadata.]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review confirms packet references and JSON parsing do not create new unsafe input paths. [REQ: REQ-006, REQ-012] [EVIDENCE: parser validation is schema-first, packet refs are structured, and no new arbitrary execution path was introduced.]
- [x] CHK-131 [P1] Dependency use stays within the existing TypeScript, Vitest, and shell toolchain. [REQ: REQ-002] [EVIDENCE: the rollout only uses existing repo toolchains and introduced no new runtime dependency family.]
- [x] CHK-132 [P2] Optional entity extraction and access timestamps remain additive and documented if enabled. [REQ: REQ-012] [EVIDENCE: `entities` and `last_accessed_at` stay additive fields inside `derived`, with schema and parser support documented in the implementation summary.]
- [x] CHK-133 [P2] Backfill reports do not expose sensitive or session-only data in packet metadata. [REQ: REQ-008, REQ-012] [EVIDENCE: backfill reports only packet identifiers, review flags, and derived packet metadata from canonical docs.]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Requirement, task, and checklist traceability remains accurate after implementation. [REQ: REQ-001 through REQ-012] [EVIDENCE: `tasks.md`, `checklist.md`, and `implementation-summary.md` now all reflect the shipped rollout and current verification state.]
- [x] CHK-141 [P1] Packet docs point to the corrected `.opencode/skill/system-spec-kit/...` runtime paths, not shortened placeholders. [REQ: REQ-005, REQ-010] [EVIDENCE: final task and implementation references use full repo-relative runtime paths.]
- [x] CHK-142 [P2] Operator-facing command docs explain the new lifecycle behavior where needed. [REQ: REQ-010] [EVIDENCE: plan, complete, resume, and memory-search docs now mention graph metadata creation or refresh behavior.]
- [x] CHK-143 [P2] Knowledge transfer notes explain how graph metadata complements, rather than replaces, canonical spec docs. [REQ: REQ-011] [EVIDENCE: packet docs and implementation summary explicitly frame graph metadata as additive to canonical packet docs.]
<!-- /ANCHOR:docs-verify -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
