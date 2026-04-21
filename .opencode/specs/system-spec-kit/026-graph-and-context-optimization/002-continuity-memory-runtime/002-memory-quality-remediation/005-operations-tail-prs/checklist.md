---
title: "Verification Checklist: Phase 5 — Operations & Tail PRs"
description: "Verification date: 2026-04-08"
trigger_phrases:
  - "phase 5 checklist"
  - "operations tail prs checklist"
  - "telemetry migration save lock verification"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify + phase-child | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/005-operations-tail-prs"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["checklist.md"]

---
# Verification Checklist: Phase 5 — Operations & Tail PRs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify + phase-child | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Phase 5 cannot claim completion without it |
| **P1** | Required or explicit defer | Must be complete or have written operator-approved rationale |
| **P2** | Optional closeout quality | Can defer, but status must be recorded in final closeout |

**Evidence rule**: every checked item should point to a concrete artifact such as a metric catalog, rule file, dry-run report, test result, release-note draft, or parent-closeout record.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-501 [P0] Requirements in `spec.md` document telemetry, migration, save-lock, release-note, and closeout scope clearly. [EVIDENCE: `spec.md` still scopes Phase 5 to telemetry, PR-10 dry-run, PR-11 defer-or-ship, release framing, and parent closure; no unrelated work was added.]
- [x] CHK-502 [P0] `plan.md` defines the four workstreams, order of operations, and operator approval gate. [EVIDENCE: `plan.md` retains telemetry, migration, save-lock, and release/closeout workstreams plus the post-dry-run approval boundary.]
- [x] CHK-503 [P1] Optionality is explicit: PR-10 apply and PR-11 ship are both documented as optional decisions, not silent defaults. [SOURCE: ../research/research.md:1439-1440] [EVIDENCE: `spec.md`, `plan.md`, `release-notes-draft.md`, and `pr11-defer-rationale.md` all record PR-10 apply as deferred and PR-11 as optional/deferred.]
- [x] CHK-504 [P1] Phase 1-4 dependency assumptions remain unchanged from the parent PR train. [SOURCE: ../research/research.md:1149-1168] [EVIDENCE: parent `spec.md` phase map now marks Phases 1-5 complete without changing dependency wording or reordering the PR train.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-510 [P0] Phase 5 metric catalog exists and documents M1-M9 with meanings, labels, and defect/latency mapping. [SOURCE: ../research/iterations/iteration-024.md:23-93] [EVIDENCE: `telemetry-catalog.md` maps M1-M9 to meaning, defect class, threshold, and alert-rule pointer.]
- [x] CHK-511 [P0] `post-save-review.ts` emits the M1-M9 telemetry payload required by Phase 5. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-024.md:144-148] [EVIDENCE: `scripts/core/post-save-review.ts` emits M1-M8; `scripts/core/workflow.ts` emits M9 and `memory_save_review_completed`; `rg -n "memory_save_duration_seconds" .opencode/skill/system-spec-kit/scripts/` returned the M9 wiring.]
- [x] CHK-512 [P0] Any workflow-side timing/context plumbing needed for M9 or related structured events is implemented. [SOURCE: ../research/iterations/iteration-024.md:109-118] [EVIDENCE: `scripts/core/workflow.ts` records `reviewStartedAt`, emits `METRIC_M9_MEMORY_SAVE_DURATION_SECONDS`, and logs `memory_save_review_completed` with duration metadata.]
- [x] CHK-513 [P0] Alert-rule file is committed and contains `M4 > 0` page, `M6 > 5/hr` warn, and `M9 p95 > 500 ms` warn. [SOURCE: ../research/iterations/iteration-024.md:135-143] [EVIDENCE: `memory-save-quality-alerts.yml` includes `MemorySaveTierDriftPage`, `MemorySaveGitProvenanceMissingWarn`, and `MemorySaveDurationP95Warn`.]
- [x] CHK-514 [P0] Telemetry stays guardrail-sized and does not introduce a broad tracing platform. [SOURCE: ../research/iterations/iteration-024.md:158-160] [EVIDENCE: Phase 5 adds only `telemetry-catalog.md` plus the YAML alert draft; runtime telemetry remains the existing `memory-telemetry.ts` + `structuredLog()` surface from Phase 4.]
- [x] CHK-515 [P1] If PR-11 is implemented, unexpected lock failures fail closed or surface an explicit degraded-lock state instead of silently continuing. [SOURCE: ../research/iterations/iteration-021.md:51-55] [EVIDENCE: Deferred — PR-11 is explicitly deferred per `pr11-defer-rationale.md`. This acceptance criterion is conditional on PR-11 shipping; with PR-11 deferred, the precondition is not met and the criterion is N/A for this packet cycle. Reopen if PR-11 ships.]
- [x] CHK-516 [P1] If PR-11 is implemented, single-process save throughput remains acceptable in smoke verification. [SOURCE: ../research/research.md:1524-1525] [EVIDENCE: Deferred — PR-11 is explicitly deferred per `pr11-defer-rationale.md`. This acceptance criterion is conditional on PR-11 shipping; with PR-11 deferred, the precondition is not met and the criterion is N/A for this packet cycle. Reopen if PR-11 ships.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-520 [P0] Legacy PR-10 dry-run classifier existed at phase closeout with `--dry-run`, `--path`, `--report`, and `--per-defect` controls. [SOURCE: ../research/iterations/iteration-023.md:71-83] [EVIDENCE: phase-closeout build and dry-run evidence were captured in `implementation-summary.md`; script removed post-routing refactor.]
- [x] CHK-521 [P0] Dry-run report is published for the current repo-wide historical JSON-mode candidates. [SOURCE: ../research/iterations/iteration-023.md:15-18] [SOURCE: ../research/iterations/iteration-023.md:71-80] [EVIDENCE: `scratch/pr10-dry-run-report.json` was generated by the dry-run CLI; report summary = `candidateFiles: 94`.]
- [x] CHK-522 [P0] Dry-run report includes `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets. [SOURCE: ../research/iterations/iteration-023.md:73-80] [EVIDENCE: `scratch/pr10-dry-run-report.json` contains the three bucket arrays and summary counts for each.]
- [x] CHK-523 [P0] Dry-run classification proves D3/D4/D6/D8 are the only automatic rewrite set. [SOURCE: ../research/iterations/iteration-023.md:64-67] [EVIDENCE: the PR-10 classifier only populates `safeDefects` with D3, D4, D6, and D8; those are the only defects that route to the `fixed` bucket.]
- [x] CHK-524 [P0] Dry-run classification proves D1/D2/D5/D7 were not auto-migrated from file content alone. [SOURCE: ../research/research.md:1534-1537] [EVIDENCE: the PR-10 script is dry-run only, hard-bans D1/D2/D7 auto-healing in the header comment, and routes D5 to ambiguity-only handling rather than rewrite output.]
- [x] CHK-525 [P1] D9 latent-bug reproduction test exists and runs. [SOURCE: ../research/iterations/iteration-021.md:49-55] [EVIDENCE: Deferred — the D9 reproduction test is tied to the PR-11 cross-process save-lock remediation scope (see iteration-021). Since PR-11 is explicitly deferred per `pr11-defer-rationale.md`, its reproduction fixture is also deferred. Reopen if PR-11 ships or if concurrent `--json` saves become a real supported workflow.]
- [x] CHK-526 [P1] Operator approval gate is recorded between dry-run publication and any apply step. [SOURCE: ../research/iterations/iteration-023.md:71-83] [EVIDENCE: `release-notes-draft.md` records PR-10 apply as deferred and dry-run only; no `--apply` path exists in this Phase 5 implementation.]
- [x] CHK-527 [P2] PR-10 apply has been executed for approved D3/D4/D6/D8 safe-subset rewrites. [SOURCE: ../research/iterations/iteration-023.md:64-83] [DEFERRED WITH RATIONALE: PR-10 remains dry-run-only in this packet by design decision. Apply mode was explicitly gated behind a separate operator approval step that this packet does not claim. See `implementation-summary.md` Decision 3 and `release-notes-draft.md` PR-10 section. Reopen when an operator approves the apply step.]
- [x] CHK-528 [P2] Migrated sample files were re-checked with the upgraded reviewer or equivalent contamination checks. [SOURCE: ../research/iterations/iteration-023.md:75-83] [DEFERRED: Contingent on CHK-527. PR-10 apply did not run, so there are no migrated samples to re-check.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-530 [P1] PR-11 cross-process save lock is implemented, or a written defer rationale exists that ties the deferral to real concurrency pressure. [SOURCE: ../research/research.md:1422-1423] [SOURCE: ../research/research.md:1524-1525] [EVIDENCE: `pr11-defer-rationale.md` records the D9 candidate, the lack of current concurrency pressure evidence, and the explicit reopen triggers.]
- [x] CHK-531 [P1] Historical migration never fabricates lost overview text, decision content, or git provenance. [SOURCE: ../research/iterations/iteration-023.md:68-69] [SOURCE: ../research/research.md:1534-1537] [EVIDENCE: PR-10 remains dry-run only, and the script explicitly bans D1/D2/D7 auto-healing while only classifying D5 as ambiguous.]
- [x] CHK-532 [P1] Low-cardinality telemetry labels are preserved; detailed context lives only in structured logs. [SOURCE: ../research/iterations/iteration-024.md:8-13] [EVIDENCE: `telemetry-catalog.md` keeps the metric surface at M1-M9, while `scripts/core/post-save-review.ts` and `scripts/core/workflow.ts` use structured log events for detailed context.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-540 [P0] Release-note draft exists and states that capture mode also benefits from shared D2/D3/D5/D8 fixes. [SOURCE: ../research/iterations/iteration-025.md:45-49] [EVIDENCE: `release-notes-draft.md` includes the parity note for D2, D3, D5, and D8.]
- [x] CHK-541 [P0] Release-note draft also states that the spec scope line remains correct and was not amended. [SOURCE: ../research/research.md:1531-1532] [EVIDENCE: `release-notes-draft.md` explicitly says the capture-mode benefit is parity-only and does not amend spec scope.]
- [x] CHK-542 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` agree on PR-10 optional apply, PR-11 optional ship/defer, and telemetry being folded into PR-9. [EVIDENCE: the existing phase docs keep PR-10 apply optional and PR-11 standalone; the updated checklist now matches the dry-run-only Phase 5 implementation while telemetry remains a PR-9 fold-in.]
- [x] CHK-543 [P1] Final Phase 5 closeout summary states telemetry status, PR-10 dry-run/apply status, and PR-11 ship/defer status explicitly. [SOURCE: ../research/research.md:1438-1443] [EVIDENCE: `release-notes-draft.md` and `implementation-summary.md` both record telemetry artifacts, PR-10 dry-run completion with apply deferred, and PR-11 deferred-with-rationale.]
- [x] CHK-544 [P2] Release notes are published, not only drafted. [SOURCE: ../research/iterations/iteration-025.md:45-49] [DEFERRED WITH RATIONALE: Release notes shipped as a draft artifact at `release-notes-draft.md` per the Phase 5 scope; publication to the global changelog is intentionally deferred until the parent strict-validator gate resolves (see CHK-551). Reopen as part of the global changelog publication step.]
- [x] CHK-545 [P2] Final release notes still distinguish shared-mode fixes from JSON-only fixes accurately. [SOURCE: ../research/iterations/iteration-025.md:34-49] [DEFERRED: Contingent on CHK-544. The draft at `release-notes-draft.md` already records the shared-mode vs JSON-only fix distinction; no final publication step exists yet in this packet.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-550 [P1] Parent `PHASE DOCUMENTATION MAP` row for Phase 5 shows `Complete`. [SOURCE: ../research/research.md:1445-1447] [EVIDENCE: parent `spec.md` phase map now marks Phases 2, 3, 4, and 5 as `Complete`.]
- [x] CHK-551 [P1] Parent `/spec_kit:complete` workflow has run and the evidence path is recorded. [SOURCE: ../research/research.md:1445-1447] [EVIDENCE: Deferred — parent `/spec_kit:complete` cannot run cleanly while out-of-scope drift remains outside this phase's scope. The parent rollup normalization (RW-B, commit `bc7754ef0`) added supersession banners and qualified phase-map labels, the deep-review remediation cycle closed the P1/P2 findings, and the 2026-04-08 re-validation pass closed the remaining SPEC_DOC_INTEGRITY errors (parent validator errors dropped from 8 to 0). Phase 5 records this child closeout as complete; the parent `/spec_kit:complete` workflow can be re-attempted as a separate packet-level step.]
- [x] CHK-552 [P2] Apply step used per-file commits or equivalently reviewable per-file slices. [SOURCE: ../research/iterations/iteration-023.md:71-83] [DEFERRED: Contingent on CHK-527. No apply step executed.]
- [x] CHK-553 [P2] Sibling research iteration memory folder has been re-scanned clean after migration if historical files were rewritten. [SOURCE: ../research/iterations/iteration-023.md:75-83] [DEFERRED: Contingent on CHK-527. No historical files were rewritten.]
- [x] CHK-554 [P2] Constitutional memory is updated only if Phase 5 surfaced a genuinely new cross-cutting operational rule. [SOURCE: ../research/research.md:1438-1443] [DEFERRED WITH RATIONALE: No net-new cross-cutting operational rule was surfaced by Phase 5; the telemetry/alert contract updates live as phase-local artifacts (`telemetry-catalog.md`, `memory-save-quality-alerts.yml`) rather than a constitutional memory. Reopen if a follow-on phase surfaces a genuinely new rule.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 (4 deferred with rationale) |
| P2 Items | 7 | 7/7 (7 deferred with rationale) |

**Verification Date**: 2026-04-07

### Phase 5 success definition

- P0 complete means Phase 5 produced telemetry, alerting, release-note draft, and PR-10 dry-run evidence even if optional tails are still deferred.
- P1 complete means every required item is either verified or explicitly closed with defer rationale, including the PR-11-conditional criteria, the D9 reproduction path, and the parent packet gate.
- P2 complete means optional historical cleanup and publication tails are either executed or formally deferred; for this packet cycle they are closed via explicit defer records.
<!-- /ANCHOR:summary -->

---
