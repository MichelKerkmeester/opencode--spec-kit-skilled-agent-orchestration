---
title: "...ph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework/checklist]"
description: "Exit-gate checklist for the week-0 blocker-removal lane. The Phase 018 completion pass re-verifies template hardening, backfill, backup/rollback proof, and later resume-budget evidence."
trigger_phrases:
  - "gate a checklist"
  - "pre-work verification"
  - "canonical continuity"
  - "phase 018"
  - "exit gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Validated Gate A checklist continuity during the Phase 018 deep review pass"
    next_safe_action: "Use the checklist as closure evidence for the prework gate"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework/checklist.md"]
closed_by_commit: TBD
feature: phase-018-gate-a-prework
gate: A
level: 2
parent: 006-continuity-refactor-gates
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Gate A — Pre-work

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker on Gate A close | Gate B cannot start until complete |
| **[P1]** | Required unless the operator approves a documented deferral | Gate A should not close with open P1s unless explicitly waived |
| **[P2]** | Helpful but optional | Can roll into a follow-on packet or gate |

Checklist priorities follow iteration 020 Gate A close criteria, iteration 022's fail-closed validator model, and iteration 028's "cannot slip" list for Gate A.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` states Gate A as blocker-removal only and keeps Gate B/C/D/E work out of scope. [EVIDENCE: `spec.md` scope still limits work to templates, validator policy, root-packet backfill, and DB safety proof]
- [x] CHK-002 [P0] `plan.md` follows the same Gate A order described in `../resource-map.md` §4 and iteration 028. [EVIDENCE: `plan.md` keeps the order as audit -> remediation/backfill -> safety verification]
- [x] CHK-003 [P1] The packet records the M4 prerequisite from iteration 016: root-packet backfill must close before archive-state migration. [EVIDENCE: `plan.md` and `implementation-summary.md` both record `../../z_archive/016-release-alignment/implementation-summary.md` as the resolved in-scope prerequisite]
- [x] CHK-004 [P1] The packet records the default exemption boundary for `changelog/*` and `sharded/*`. [EVIDENCE: `plan.md` and `implementation-summary.md` both call out the exemption, and `validate.sh` implements it]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Template repairs eliminate the known orphan `metadata` anchor defects in Level 3 and Level 3+ spec templates. [EVIDENCE: the Level 3 and Level 3+ spec templates landed the missing `metadata` anchor opener]
- [x] CHK-011 [P0] `../../../../../skill/system-spec-kit/templates/handover.md`, `../../../../../skill/system-spec-kit/templates/research.md`, and `../../../../../skill/system-spec-kit/templates/debug-delegation.md` have baseline anchors before merge-time writes are allowed. [EVIDENCE: all three templates now contain paired baseline anchor regions]
- [x] CHK-012 [P1] Validator behavior or validator policy documentation clearly keeps anchorless changelog/sharded templates outside merge-target legality by default. [EVIDENCE: `scripts/spec/validate.sh` skips `ANCHORS_VALID` for `templates/changelog` and `templates/sharded`]
- [x] CHK-013 [P1] Gate A changes stay bounded to template, validator, root-packet backfill, and recovery-proof surfaces only. [EVIDENCE: touched surfaces stayed inside templates, `validate.sh`, `../../z_archive/016-release-alignment/implementation-summary.md`, Gate A packet docs, and local DB backup/rehearsal paths]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate.sh --strict` passes on every repaired level-template example relevant to the Gate A anchor fixes. [EVIDENCE: `SPECKIT_RULES=ANCHORS_VALID` passes for `templates/level_1`, `templates/level_2`, `templates/level_3`, and `templates/level_3+`]
- [x] CHK-021 [P0] The audited root packets all have canonical `implementation-summary.md` present and reviewable in tree. [EVIDENCE: `../../z_archive/016-release-alignment/implementation-summary.md` remains present and is cited in Gate A closeout]
- [x] CHK-022 [P0] The SQLite backup file exists and can be restored onto a copy. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/database/memory-018-pre.db` exists at `195276800` bytes and passed `PRAGMA integrity_check`]
- [x] CHK-023 [P0] Rollback on a copy was rehearsed successfully and the steps are operator-readable. [EVIDENCE: copy-only rollback drill restored a deliberately mutated `/tmp` target and matched logical SHA3 hash `e986db400350ac106428a2289f6eafedb49a9c1b544d84eb46e4e73b`]
- [x] CHK-024 [P0] The canonical doc-first resume path clears the under-five-second budget needed by the final continuity runtime. [EVIDENCE: Gate D benchmark suite passed on 2026-04-12, including `tests/gate-d-benchmark-session-resume.vitest.ts`, `tests/gate-d-resume-perf.vitest.ts`, and `tests/resume-ladder.vitest.ts`]
- [x] CHK-025 [P1] Any unresolved migration-file ownership choice is explicitly documented rather than left implicit. [EVIDENCE: Gate A records Option A, inline migrations in `mcp_server/lib/search/vector-index-schema.ts`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Restore and rollback rehearsals target copies only, never the live DB. [EVIDENCE: restore and rollback drill used `/tmp/gate-a-018-rollback-drill.*` scratch files only]
- [x] CHK-031 [P0] The Gate A backup artifact is named clearly enough to prevent restoring the wrong snapshot. [EVIDENCE: the backup path is explicitly named `memory-018-pre.db`]
- [x] CHK-032 [P1] No schema migration or archive flip begins before the Gate A backup and restore drill has passed. [EVIDENCE: Gate A made no schema edits and still records warmup as an open blocker before Gate B]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` cite the same grounding sources and tell the same Gate A story. [EVIDENCE: all packet docs still ground Gate A to `../implementation-design.md`, `../resource-map.md`, and iterations 016/020/022/028]
- [x] CHK-041 [P1] `implementation-summary.md` stays honest about what landed and what is still blocked. [EVIDENCE: the summary records completed template, validator, backfill, backup, and rollback work, then calls out the warmup failure and local git sandbox block explicitly]
- [x] CHK-042 [P2] Follow-on work such as the 19 memory-relevant sub-README rewrites from `../resource-map.md` §8.5 is tracked as deferred rather than silently omitted. [EVIDENCE: `tasks.md` completion criteria leaves that work explicitly deferred]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Gate A packet authoring does not create or edit files outside the approved target folder during pre-work population. [EVIDENCE: packet-doc authoring stayed in `001-gate-a-prework/`, while implementation edits stayed on the approved Gate A execution surfaces]
- [x] CHK-051 [P1] Temporary notes and audit scratch stay outside canonical packet docs unless promoted intentionally. [EVIDENCE: audit scratch remained in parent packet research/scratch surfaces and only final findings were promoted here]
- [x] CHK-052 [P2] Follow-up context save guidance stays on the standard Spec Kit workflow and manual memory-file authoring is absent. [EVIDENCE: `find .opencode/specs -path '*/memory/*.md' -type f | wc -l` -> `0`; `scripts/tests/generate-context-cli-authority.vitest.ts` passed on 2026-04-12]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-12
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
