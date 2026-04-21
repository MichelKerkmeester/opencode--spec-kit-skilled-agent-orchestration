---
title: "Tasks: Phase 5 — Operations & Tail PRs"
description: "Task format: T5xx [modifier] Phase 5 operations-tail deliverables, approval gates, and closeout work."
trigger_phrases:
  - "phase 5 tasks"
  - "operations tail prs tasks"
  - "telemetry migration save lock tasks"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + phase-child | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/005-operations-tail-prs"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Phase 5 — Operations & Tail PRs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + phase-child | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[G]` | Gate or approval stop |
| `[O]` | Optional deliverable |

**Task Format**: `T5xx [modifier] Description (primary file or artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Scope and sequencing controls

- [ ] T500 Keep write scope aligned to the Phase 5 operational surface: telemetry, alerting, PR-10 dry-run/apply, PR-11 ship/defer, release notes, and parent closeout only. [SOURCE: ../research/research.md:1418-1447]
- [ ] T501 Do not reopen the core PR-1 through PR-9 dependency order while executing Phase 5 tasks. [SOURCE: ../research/research.md:1438-1441]
- [ ] T502 Treat PR-10 apply and PR-11 ship as optional decisions, not implicit requirements. [SOURCE: ../research/research.md:1439-1440]

### Telemetry and release preparation

- [ ] T503 Draft the Phase 5 telemetry metric catalog for M1-M9 in phase `scratch/` and map each metric to its D1-D8 or latency purpose. [SOURCE: ../research/iterations/iteration-024.md:23-93]
- [ ] T504 Record the exact alert thresholds next to the metric catalog: `M4 > 0` page, `M6 > 5/hr` warn, `M9 p95 > 500 ms` warn. [SOURCE: ../research/iterations/iteration-024.md:135-143]
- [ ] T505 [P] Crosswalk M1-M9 against the existing PR-9 reviewer checks so every metric has an emitting reviewer or workflow seam. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-024.md:150-156]
- [ ] T505a [P] Define the structured log event names that pair with the metric set so reviewer output and operational logs share the same vocabulary. [SOURCE: ../research/iterations/iteration-024.md:109-116]
- [ ] T505b [P] Map reviewer severities to page-vs-warn behavior so D1/D2/D4/D7 remain the immediate-alert group. [SOURCE: ../research/iterations/iteration-024.md:13-14] [SOURCE: ../research/iterations/iteration-024.md:156-156]
- [ ] T506 [P] Draft release notes that explicitly say capture mode benefits from the shared D2/D3/D5/D8 fixes. [SOURCE: ../research/iterations/iteration-025.md:45-49]
- [ ] T507 State in the same release-note draft that the spec-scope line remains correct and was not amended by the parity audit. [SOURCE: ../research/research.md:1531-1532]
- [ ] T508 Add Phase 5 status fields in the release-note draft for `PR-10 dry-run`, `PR-10 apply`, and `PR-11 save lock` so final publication can reflect ship/defer decisions honestly. [SOURCE: ../research/research.md:1438-1443]
- [ ] T508a [P] Add a release-note sentence that distinguishes shared-mode fixes from JSON-only D1/D7 so users do not overgeneralize the packet's blast radius. [SOURCE: ../research/iterations/iteration-025.md:34-49]
- [ ] T508b Prepare the parent-closeout summary template that will later import the final release-note status fields. [SOURCE: ../research/research.md:1445-1447]

### Migration and D9 prep

- [ ] T509 Author the PR-10 migration CLI skeleton with `--dry-run`, `--apply`, and `--per-defect` switches. [SOURCE: ../research/iterations/iteration-023.md:50-55] [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] T510 Author the D9 latent bug reproduction test that exercises concurrent save-lock degradation scenarios. [SOURCE: ../research/iterations/iteration-021.md:49-55]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Telemetry fold-in

- [ ] T511 Implement the telemetry helper surface that emits M1-M9 without introducing a broad tracing abstraction. [SOURCE: ../research/iterations/iteration-024.md:144-148] [SOURCE: ../research/iterations/iteration-024.md:158-160]
- [ ] T512 Implement M1-M9 emission in `post-save-review.ts` for reviewer-derived counters and severity tallies. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-024.md:144-148]
- [ ] T513 Implement any Step 10.5 timing/context plumbing in `workflow.ts` so M9 and related structured events have the needed inputs. [SOURCE: ../research/iterations/iteration-024.md:109-118]
- [ ] T514 [P] Author the alert-rule file that corresponds to the Phase 5 metric names and thresholds. [SOURCE: ../research/iterations/iteration-024.md:135-143]

### PR-10 safe-subset migration

- [ ] T515 Implement D8 anchor repair in the migration CLI. [SOURCE: ../research/iterations/iteration-023.md:67-67]
- [ ] T516 Implement D4 tier synchronization in the migration CLI. [SOURCE: ../research/iterations/iteration-023.md:67-67]
- [ ] T517 Implement D6 dedupe handling in the migration CLI only as a mechanical rewrite. [SOURCE: ../research/research.md:1218-1221]
- [ ] T518 Implement D3 trigger-phrase sanitation in the migration CLI using the fixed canonical rules, not ad hoc cleanup. [SOURCE: ../research/iterations/iteration-023.md:67-67]
- [ ] T519 Implement unrecoverable classification for D1, D2, and D7 so the script never fabricates missing content or provenance. [SOURCE: ../research/iterations/iteration-023.md:68-69] [SOURCE: ../research/research.md:1534-1537]
- [ ] T520 Implement `skipped-ambiguous` classification for D5 and any ambiguous historical lineage candidates. [SOURCE: ../research/iterations/iteration-023.md:68-76]
- [ ] T521 Emit a machine-readable dry-run report with `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets. [SOURCE: ../research/iterations/iteration-023.md:73-80]
- [ ] T521a Emit per-defect summary totals so operators can distinguish D3/D4/D6/D8 rewrite opportunity counts from unrecoverable counts. [SOURCE: ../research/iterations/iteration-023.md:52-55] [SOURCE: ../research/iterations/iteration-023.md:73-80]
- [ ] T521b Add an operator-readable text summary beside the machine-readable report so dry-run review does not require ad hoc scripting. [SOURCE: ../research/iterations/iteration-023.md:73-80]
- [ ] T522 Run the dry-run migration against the 82 historical JSON-mode files. [SOURCE: ../research/iterations/iteration-023.md:15-18] [SOURCE: ../research/iterations/iteration-023.md:71-80]
- [ ] T523 Publish the dry-run report in a packet-local artifact that can be reviewed without rescanning the repo. [SOURCE: ../research/iterations/iteration-023.md:73-80]
- [ ] T524 Sample-check dry-run output to prove D3/D4/D6/D8 are the only auto-fix buckets and D1/D2/D5/D7 remain untouched. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- [ ] T524a Confirm the dry-run preserves file identity and reviewability assumptions before any apply work is considered. [SOURCE: ../research/iterations/iteration-023.md:57-62] [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] T524b Prepare the operator approval packet with representative before/after diff samples taken from dry-run output. [SOURCE: ../research/iterations/iteration-023.md:71-83]

### PR-11 ship/defer implementation path

- [ ] T525 Run the D9 reproduction test and capture whether the current workflow still continues after stale-lock read failure, timeout, or unexpected lock-directory errors. [SOURCE: ../research/iterations/iteration-021.md:51-55]
- [ ] T526 Decide whether PR-11 should ship or defer based on actual concurrency pressure in CI or automation workflows. [SOURCE: ../research/research.md:1422-1423] [SOURCE: ../research/research.md:1524-1525]
- [ ] T527 [O] If shipping, implement the cross-process save lock at the save entry point using `fcntl` or `flock` style semantics. [SOURCE: ../research/iterations/iteration-021.md:51-55]
- [ ] T528 [O] Ensure unexpected lock failures fail closed or surface an explicit degraded-lock state rather than silently continuing. [SOURCE: ../research/iterations/iteration-021.md:51-55]
- [ ] T529 [O] Verify the implementation does not meaningfully degrade single-process save throughput. [SOURCE: ../research/research.md:1524-1525]
- [ ] T530 If PR-11 is deferred, document the rationale in Phase 5 evidence and release materials instead of leaving the status implicit. [SOURCE: ../research/research.md:1438-1440]
- [ ] T530a If PR-11 is deferred, record the specific concurrency assumption that justified defer so future operators know when to reopen it. [SOURCE: ../research/research.md:1422-1423]
- [ ] T530b If PR-11 ships, add a short operator note describing expected degraded-lock behavior and rollback trigger points. [SOURCE: ../research/iterations/iteration-021.md:51-55]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Gates and optional apply

- [ ] T531 [G] Stop for operator approval after the PR-10 dry-run report is published. No apply work may start before this gate is satisfied. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] T532 [O] If approved, run `--apply` only for D3/D4/D6/D8 safe-subset rewrites. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- [ ] T533 [O] Apply PR-10 changes in per-file commits or equivalently reviewable per-file slices to preserve git history clarity. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] T534 [O] Re-run the upgraded reviewer or equivalent contamination checks on migrated sample files after apply. [SOURCE: ../research/iterations/iteration-023.md:75-83]
- [ ] T535 [O] Record whether PR-10 apply completed or was explicitly deferred after dry-run review. [SOURCE: ../research/research.md:1438-1440]
- [ ] T535a [O] Re-scan the touched historical subset after apply so any follow-on indexing or memory-health work has clean input. [SOURCE: ../research/iterations/iteration-023.md:75-83]
- [ ] T535b [O] Archive a concise migration outcome summary for parent closeout so the packet can close without reopening PR-10 evidence later. [SOURCE: ../research/research.md:1438-1443]

### Final release and closeout

- [ ] T536 Update the release-note draft with final telemetry, PR-10, and PR-11 statuses once implementation decisions are known. [SOURCE: ../research/research.md:1438-1443]
- [ ] T537 Confirm the release note still distinguishes shared-mode fixes from JSON-only fixes and keeps the scope note intact. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1531-1532]
- [ ] T538 Update the parent `PHASE DOCUMENTATION MAP` row for Phase 5 from `Pending` to `Complete`. [SOURCE: ../research/research.md:1445-1447]
- [ ] T539 Run the parent `/spec_kit:complete` workflow and attach the completion evidence to the packet summary. [SOURCE: ../research/research.md:1445-1447]
- [ ] T540 Publish or archive the final dry-run/apply/defer outcomes so the parent closeout summary states exactly what shipped. [SOURCE: ../research/research.md:1438-1447]
- [ ] T541 Keep telemetry and release-note drafting mandatory even if PR-10 apply and PR-11 are both deferred. [SOURCE: ../research/research.md:1425-1443]
- [ ] T542 Treat PR-10 dry-run as the mandatory migration deliverable; treat PR-10 apply as optional and operator-gated. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] T543 Treat PR-11 as optional and standalone; do not block packet closeout on it unless the operator explicitly promotes it. [SOURCE: ../research/research.md:1422-1423]
- [ ] T544 Close the parent packet only after T538 and T539 are complete and all P0 checklist items are satisfied. [SOURCE: ../research/research.md:1445-1447]
- [ ] T544a Confirm the parent closeout summary repeats the capture-mode parity note so the final packet message matches the release-note draft. [SOURCE: ../research/iterations/iteration-025.md:45-49]
- [ ] T544b Confirm the parent closeout summary states whether constitutional memory changed or stayed untouched. [SOURCE: ../research/research.md:1438-1443]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All mandatory telemetry tasks T503-T514 are complete.
- [ ] Release-note draft tasks T506-T508 are complete.
- [ ] Migration dry-run tasks T509-T524 are complete.
- [ ] Optional tasks are either complete or explicitly deferred with rationale.
- [ ] Parent closeout tasks T538-T540 are complete.
- [ ] No unresolved gate blocks remain.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
