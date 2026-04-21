---
title: "Implementation Plan: Phase 5 — Operations & Tail PRs"
description: "Phase 5 executes the packet closeout plan for telemetry, alerting, optional historical migration, optional D9 lock hardening, release communication, and final parent closure."
trigger_phrases:
  - "phase 5 plan"
  - "tail prs implementation plan"
  - "telemetry migration save lock rollout"
  - "pr-10 pr-11 plan"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + phase-child | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/005-operations-tail-prs"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Phase 5 — Operations & Tail PRs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + phase-child | v2.2 -->

Phase 5 is a closeout implementation plan, not a second research pass. The main packet already has a strict nine-PR dependency chain, and this phase only adds the operational tail items Gen-3 endorsed: telemetry and alerts folded into PR-9, an optional PR-10 safe-subset migration after PR-9, an optional PR-11 cross-process save lock, release-note parity framing, and parent packet closure. [SOURCE: ../research/research.md:1418-1447] [SOURCE: ../research/research.md:1520-1537]

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + markdown spec docs |
| **Framework** | Spec Kit scripts and packet-local documentation workflow |
| **Storage** | Markdown memory/spec artifacts plus alert-rule/config artifacts |
| **Testing** | Script validator, targeted fixture replays, dry-run report review, D9 reproduction test |

### Executive Summary

The sequencing matters more than raw code volume. Phase 5 starts with telemetry and release-note drafting because those activities are no-regret and do not depend on deciding whether to ship PR-10 or PR-11. Historical migration comes next because its dry-run report informs the only operator approval gate in the phase. PR-11, if pursued, lands last because Gen-3 explicitly categorized it as standalone, low-priority hardening for concurrent-save workflows rather than a precondition for the packet's original value. [SOURCE: ../research/iterations/iteration-024.md:144-148] [SOURCE: ../research/iterations/iteration-023.md:71-83] [SOURCE: ../research/research.md:1422-1423]

### Overview

The plan organizes work into four workstreams: telemetry, migration, save-lock hardening, and release/closeout. Each workstream is independently auditable, but only telemetry and release/closeout are mandatory to declare Phase 5 operationally complete. [SOURCE: ../research/research.md:1438-1447]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 1-4 outputs are merged and the PR-1 through PR-9 owner map remains the source of truth. [SOURCE: ../research/research.md:1149-1168]
- [ ] Gen-3 tail recommendations are treated as additive and do not reopen core-train ordering. [SOURCE: ../research/research.md:1438-1441]
- [ ] The operator agrees that PR-10 apply and PR-11 ship are optional decisions, not hidden requirements. [SOURCE: ../research/research.md:1439-1440]

### Definition of Done

- [ ] M1-M9 telemetry is documented and emitted from the PR-9 reviewer surface. [SOURCE: ../research/research.md:1425-1441]
- [ ] Alert rules exist for M4, M6, and M9. [SOURCE: ../research/research.md:1530-1530]
- [ ] PR-10 dry-run report is published and any apply decision is explicit. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] PR-11 status is explicit and backed by a D9 reproduction path. [SOURCE: ../research/iterations/iteration-021.md:49-55]
- [ ] Release-note parity draft exists and the parent packet has been closed through `/spec_kit:complete`. [SOURCE: ../research/research.md:1445-1447]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Operational tail closeout over an already-frozen PR train.

### Technical Approach

| Workstream | Goal | Why this workstream exists |
|------------|------|----------------------------|
| Telemetry | Emit M1-M9 and ship alert rules via PR-9's reviewer surface | Iter 24 froze the metric catalog and explicitly folded it into PR-9. [SOURCE: ../research/research.md:1223-1236] [SOURCE: ../research/research.md:1425-1425] |
| Migration | Produce a dry-run-first PR-10 safe-subset migration and optionally apply it | Iter 23 chose Option C only in a narrowed, safe-subset form. [SOURCE: ../research/iterations/iteration-023.md:64-83] |
| Save lock | Reproduce D9 and decide whether PR-11 should ship or defer | Iter 21 surfaced D9 as the only new latent defect candidate. [SOURCE: ../research/iterations/iteration-021.md:49-55] |
| Release and closeout | Publish parity framing and finish the parent packet cleanly | Iter 25 changed release framing, and Phase 5 has no successor. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1445-1447] |

### Key Components

- **Telemetry helper**: thin M1-M9 emission surface layered on top of structured logging. [SOURCE: ../research/iterations/iteration-024.md:144-148]
- **Reviewer integration**: `post-save-review.ts` remains the main PR-9 guardrail surface. [SOURCE: ../research/iterations/iteration-024.md:109-118]
- **Workflow seam**: Step 10.5 timing/context wiring and any optional PR-11 lock hardening attach at the save boundary. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-021.md:51-55]
- **Migration CLI**: safe-subset script with dry-run/apply/report semantics. [SOURCE: ../research/iterations/iteration-023.md:50-55] [SOURCE: ../research/iterations/iteration-023.md:71-83]
- **Release-note artifact**: packet-local draft that later informs publish-time messaging. [SOURCE: ../research/iterations/iteration-025.md:45-49]

### Data Flow

1. Telemetry catalog and alert rules are drafted before code changes.
2. PR-9 reviewer emission is wired through `post-save-review.ts` and the Step 10.5 workflow seam.
3. PR-10 dry-run scans the 82 historical JSON-mode files and emits `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets.
4. Operator approval decides whether PR-10 apply runs.
5. D9 reproduction evidence decides whether PR-11 ships or defers.
6. Release-note draft and parent closeout reflect the final operational state. [SOURCE: ../research/iterations/iteration-023.md:71-83] [SOURCE: ../research/research.md:1438-1447]

### File:Line Change List

| File or artifact | Planned change | Why this file | Source |
|------------------|----------------|---------------|--------|
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Add M1-M9 emission plumbing, review violation counts, and structured outputs consumable by alerting/tests | Iter 24 names the reviewer surface as the operational guardrail and best fit for PR-9 telemetry | [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-024.md:144-148] |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Add Step 10.5 timing capture and any save-boundary metadata needed for M9; if PR-11 ships, harden lock behavior at the save entry path | Iter 24 identifies the Step 10.5 seam; iter 21 identifies the D9 lock seam | [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-021.md:51-55] |
| `.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts` | Create helper for metric names, low-cardinality label enforcement, and structured-log emission | Iter 24 recommends a thin helper rather than a tracing platform | [SOURCE: ../research/iterations/iteration-024.md:144-148] [SOURCE: ../research/iterations/iteration-024.md:158-160] |
| `Legacy PR-10 dry-run classifier (script removed post-routing refactor)` | Historical note: this phase originally scoped a one-shot dry-run/report classifier with `--dry-run` and `--per-defect`; apply mode stayed deferred (see `pr11-defer-rationale.md`) | Iter 23's Option C required a dry-run evidence surface without overstating shipped historical rewrites | [SOURCE: ../research/iterations/iteration-023.md:50-55] [SOURCE: ../research/iterations/iteration-023.md:71-83] |
| Historical memory files selected by PR-10 | Rewrite safe-subset fields only, in per-file commits, if and only if the operator approves after dry-run | Iter 23 explicitly narrows the allowed write surface | [SOURCE: ../research/iterations/iteration-023.md:64-83] |
| `memory-save-quality-alerts.yml` | Add alert rules for M4, M6, and M9 plus any kept warning rules from iter 24 | The phase needs a committed alert artifact, not only metric names in prose | [SOURCE: ../research/iterations/iteration-024.md:135-143] |
| Phase-local telemetry catalog artifact | Document metric names, meanings, thresholds, and defect mapping | Operators need a human-readable crosswalk for the new signals | [SOURCE: ../research/iterations/iteration-024.md:23-147] |
| Phase-local release-note draft artifact | Draft capture-mode parity note and optional-tail-PR status | Iter 25 changes release framing but not scope | [SOURCE: ../research/iterations/iteration-025.md:45-49] |
| `../spec.md` | Update Phase 5 row to `Complete` during closeout | Phase 5 is terminal and must close the parent packet explicitly | [SOURCE: ../research/research.md:1445-1447] |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Telemetry and release artifacts first

- [ ] Draft the telemetry metric catalog M1-M9 in phase `scratch/`. [SOURCE: ../research/iterations/iteration-024.md:23-93]
- [ ] Author the alert-rule file from the frozen thresholds. [SOURCE: ../research/iterations/iteration-024.md:135-143]
- [ ] Draft release notes with the capture-mode parity note and explicit optional-tail-PR status. [SOURCE: ../research/iterations/iteration-025.md:45-49]
- [ ] Fold telemetry emission into PR-9's `post-save-review.ts` and workflow callsite. [SOURCE: ../research/iterations/iteration-024.md:144-148]

**Why first**: these are no-regret changes that clarify operations immediately and do not depend on the operator's decision about historical migration or save-lock hardening. [SOURCE: ../research/iterations/iteration-024.md:144-148] [SOURCE: ../research/iterations/iteration-025.md:45-49]

### Phase 2: PR-10 dry-run second

- [ ] Implement the migration CLI in dry-run mode.
- [ ] Run dry-run against the 82 historical files.
- [ ] Publish the report with `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets.
- [ ] Stop for operator approval. [SOURCE: ../research/iterations/iteration-023.md:71-83]

**Why second**: Gen-3 requires dry-run first and treats apply as a separate decision. [SOURCE: ../research/iterations/iteration-023.md:71-83]

### Phase 3: PR-10 apply deferred after dry-run

- [ ] Record that any historical apply follow-on is deferred after dry-run review; this phase ships dry-run evidence only.
- [ ] Keep future rewrite steps in operator-facing follow-up notes rather than a shipped CLI flag.
- [ ] Preserve the reviewability requirements for any future apply follow-on if the operator later reopens it. [SOURCE: ../research/iterations/iteration-023.md:75-83]

**Why third**: apply is intentionally deferred from this implementation, so the plan records the future gate without claiming a shipped mode that does not exist. [SOURCE: ../research/iterations/iteration-023.md:71-83]

### Phase 4: PR-11 optional and last

- [ ] Author the D9 reproduction test.
- [ ] Decide ship or defer.
- [ ] If shipping, harden the save lock with a localized cross-process primitive.
- [ ] If deferring, record the rationale in Phase 5 evidence and proceed to closeout. [SOURCE: ../research/research.md:1422-1423]

**Why last**: PR-11 is standalone and low priority. [SOURCE: ../research/research.md:1422-1423] [SOURCE: ../research/research.md:1524-1525]

### Phase 5: Parent closure

- [ ] Update the parent phase map row for Phase 5.
- [ ] Run the parent `/spec_kit:complete` workflow.
- [ ] Publish release-note status and any PR-10/PR-11 defer notes in the completion summary. [SOURCE: ../research/research.md:1445-1447]

**Why final**: the phase has no successor. Closeout is part of the implementation plan, not a postscript. [SOURCE: ../research/research.md:1445-1447]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit / fixture replay | Confirm M1-M9 emission and alert-rule coverage | Reviewer fixtures, targeted tests, validator |
| Dry-run verification | Confirm PR-10 buckets and safe-subset classification | PR-10 CLI in `--dry-run` mode |
| Concurrency reproduction | Confirm D9 reproduction and optional PR-11 behavior | D9 reproduction test |
| Documentation review | Confirm release-note parity framing and parent closeout truth | Phase docs + `/spec_kit:complete` evidence |

### Verification Plan

- Confirm M1-M9 emit from the PR-9 reviewer path with representative clean and defect-shaped fixtures. [SOURCE: ../research/iterations/iteration-024.md:23-147]
- Verify that alert rules compile and cover the required thresholds. [SOURCE: ../research/iterations/iteration-024.md:135-143]
- Confirm structured-log events stay on stderr and do not contaminate CLI/data stdout surfaces. [SOURCE: ../research/iterations/iteration-024.md:15-22] [SOURCE: ../research/iterations/iteration-024.md:153-159]
- Run PR-10 in `--dry-run` mode across the 82 historical candidates. [SOURCE: ../research/iterations/iteration-023.md:71-80]
- Sample-check report entries to prove D3/D4/D6/D8 are handled mechanically and D1/D2/D5/D7 remain unrecoverable or skipped. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- If apply is approved, verify migrated samples with the upgraded reviewer/contamination checks and confirm per-file commit traceability. [SOURCE: ../research/iterations/iteration-023.md:75-83]
- Build a D9 reproduction test that exercises concurrent-save collision scenarios. [SOURCE: ../research/iterations/iteration-021.md:49-55]
- Review release notes against the parity matrix so the shared-mode claims match iter 25 exactly. [SOURCE: ../research/iterations/iteration-025.md:21-49]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1-4 merged | Internal | Green | Phase 5 cannot honestly execute tail work before the core train exists. [SOURCE: ../research/research.md:1154-1162] |
| Structured logger on stderr | Internal | Green | Telemetry helper would need a different transport if this changed. [SOURCE: ../research/iterations/iteration-024.md:15-22] |
| Operator approval after PR-10 dry-run | Process | Yellow | Apply must defer if approval is not granted. [SOURCE: ../research/iterations/iteration-023.md:71-83] |
| Concurrency pressure evidence | Process | Yellow | PR-11 should probably defer if no real multi-process workflow exists. [SOURCE: ../research/research.md:1422-1423] |
| Parent `/spec_kit:complete` workflow | Process | Green | Packet cannot close cleanly without it. [SOURCE: ../research/research.md:1445-1447] |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Telemetry scope expands into a tracing project | Delays packet closeout and widens blast radius | Keep the implementation to iter 24's guardrail-sized counters, histograms, and structured log events only. [SOURCE: ../research/iterations/iteration-024.md:150-160] |
| PR-10 fabricates lost content | Historical files become less trustworthy rather than more trustworthy | Hard-ban D1/D2/D7 auto-healing and keep D5 under ambiguity-safe skip logic. [SOURCE: ../research/iterations/iteration-023.md:64-83] [SOURCE: ../research/research.md:1534-1537] |
| PR-11 slows normal saves | Single-user workflows regress even though D9 is low-frequency | Keep PR-11 localized, test concurrent scenarios directly, and reject designs that penalize the common single-process path. [SOURCE: ../research/iterations/iteration-021.md:51-55] [SOURCE: ../research/research.md:1524-1525] |
| Release notes overstate capture-mode scope | Users infer a larger packet change than what shipped | Keep the parity note explicit: shared fixes benefit capture mode, but spec scope stays unchanged. [SOURCE: ../research/iterations/iteration-025.md:45-49] [SOURCE: ../research/research.md:1531-1532] |
| Parent closeout hides optional defers | Packet appears complete without operational truth | Record whether PR-10 apply and PR-11 shipped, deferred, or remain operator-gated. [SOURCE: ../research/research.md:1438-1447] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: PR-10 apply rewrites the wrong fields, PR-11 harms save behavior, or telemetry/alert artifacts misrepresent packet health.
- **Procedure**:
  1. Stop further apply or closeout work.
  2. Revert the affected code/config or migrated files using the per-file commit trail.
  3. Re-run representative reviewer or reproduction checks.
  4. Update Phase 5 status so the defer/revert is explicit in the closeout summary.

### Rollout

| Stage | Deliverable | Exit condition |
|-------|-------------|----------------|
| Stage 1 | Telemetry catalog + alert rule draft + release-note draft | The packet has a no-regret operational baseline documented |
| Stage 2 | Telemetry code folded into PR-9 | M1-M9 and alert rules exist in code/config form and verification passes |
| Stage 3 | PR-10 dry-run report | Operator can approve, defer, or reject apply based on evidence |
| Stage 4 | PR-10 apply (optional) | Historical safe-subset migration is either complete or explicitly deferred |
| Stage 5 | PR-11 ship/defer decision | D9 status is explicit and auditable |
| Stage 6 | Parent closeout | Phase 5 row is `Complete` and `/spec_kit:complete` has run |

### Rollout notes

- If the team wants the smallest possible Phase 5, ship Stages 1, 2, 3, and 6, then defer PR-10 apply and PR-11 with rationale. That still satisfies the operational closeout contract because the dry-run report is the mandatory PR-10 deliverable, not the apply step itself. [SOURCE: ../research/iterations/iteration-023.md:71-83] [SOURCE: ../research/research.md:1438-1440]
- If concurrency pressure is absent, PR-11 should default to defer-with-rationale rather than speculative hardening. [SOURCE: ../research/research.md:1422-1423]
- Release notes should publish together with parent closeout so the packet's final public framing matches the final operational state. [SOURCE: ../research/iterations/iteration-025.md:45-49]
- If PR-10 apply happens, keep the historical rewrite summary attached to the same closeout packet so reviewers can audit dry-run versus apply outcomes without reopening old shell history. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- If both optional tails defer, the packet still closes as long as telemetry, release framing, dry-run evidence, and explicit defer rationale are present in the final summary. [SOURCE: ../research/research.md:1438-1443]
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Telemetry + Release Drafts ──► PR-10 Dry-run ──► Operator Gate ──► Optional PR-10 Apply
                                 │
                                 └──────────────► PR-11 Ship/Defer ──► Parent Closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Telemetry + Release Drafts | Phases 1-4 merged | PR-10 dry-run, closeout truth |
| PR-10 Dry-run | Telemetry baseline complete | Operator approval gate |
| Operator Gate | Dry-run report published | Optional PR-10 apply |
| PR-11 Ship/Defer | D9 reproduction evidence | Parent closeout truth |
| Parent Closeout | Telemetry done, PR-10 status explicit, PR-11 status explicit | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Telemetry + release drafts | Medium | 1-2 focused implementation sessions |
| PR-10 dry-run tooling | Medium | 1-2 focused implementation sessions |
| Optional PR-10 apply | Medium | Depends on approval and review feedback |
| Optional PR-11 hardening | Medium | 1 focused implementation session plus concurrency testing |
| Parent closeout | Low | 1 focused closeout session |
| **Total** | **Medium** | **Phase-complete once mandatory items land and optional items are explicit** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Dry-run evidence exists before any historical apply step.
- [ ] Alert thresholds are documented before telemetry is announced.
- [ ] PR-11 ship/defer rationale is written before parent closeout.

### Rollback Procedure

1. Revert the affected code/config or migrated file commit(s).
2. Re-run the relevant reviewer, dry-run, or reproduction verification.
3. Update the packet summary and release-note status to reflect the rollback.
4. Keep parent closeout blocked until the packet truth is current again.

### Data Reversal

- **Has data migrations?** Yes, but only for optional PR-10 apply.
- **Reversal procedure**: use the per-file commit trail created during apply, then re-run sample reviewer checks. [SOURCE: ../research/iterations/iteration-023.md:71-83]
<!-- /ANCHOR:enhanced-rollback -->

---
