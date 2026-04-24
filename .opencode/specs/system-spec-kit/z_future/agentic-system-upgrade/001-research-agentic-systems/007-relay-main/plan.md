---
title: "Implementation [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/007-relay-main/plan]"
description: "Level 3 packet plan for the completed Agent Relay research phase, covering prior-work review, Phase 2 investigation, merged synthesis, packet repair, and strict validation."
trigger_phrases:
  - "007-relay-main plan"
  - "relay main research plan"
  - "agent relay phase execution plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: 007-relay-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, JSONL state, shell validation |
| **Framework** | `system-spec-kit` Level 3 packet workflow |
| **Storage** | Phase-local docs under `007-relay-main/`, `research/iterations/`, `research/*.md`, `research/deep-research-state.jsonl` |
| **Testing** | JSONL parse checks and `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "<phase>" --strict` |

### Overview

This packet first re-anchors on the existing Phase 1 research artifacts, then investigates deeper Agent Relay areas that reveal refactor, pivot, simplification, and UX signals for `system-spec-kit`. The implementation work for this turn is research-artifact production plus packet repair: add iterations 011-020, append Phase 2 state rows, rewrite the merged synthesis and dashboard, restore the missing Level 3 packet docs, fix packet-local prompt links, and pass strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Prior Phase 1 artifacts reviewed
- [x] Governing `AGENTS.md` files reviewed
- [x] Skill routing completed
- [x] Packet-local `external/` snapshot mapped
- [x] User constraints honored: no sub-agents, phase-folder-only writes

### Definition of Done
- [x] Iterations `011` through `020` written
- [x] `research/deep-research-state.jsonl` appended with 10 Phase 2 rows
- [x] `research/research.md` merged across both phases
- [x] `research/deep-research-dashboard.md` updated to 20 iterations
- [x] Missing Level 3 phase docs restored
- [x] Packet-local prompt references repaired
- [x] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only external-repo research with packet-local state, write-once iteration artifacts, append-only JSONL lineage, and one canonical merged synthesis.

### Key Components
- **Prior-work baseline**: `research/research.md`, `research/deep-research-dashboard.md`, and `research/iterations/iteration-001.md` through `research/iterations/iteration-010.md`
- **External evidence set**: Relay docs, workflow engine, continuity/replay, integration tests, provider registry, and CLI bootstrap
- **Public comparison set**: `orchestrate`, deep-loop commands and skills, memory pipeline, validation pipeline, gate doctrine, level specs, and provider references
- **Packet contract docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`

### Data Flow
Prior artifacts -> external/Public evidence gathering -> iteration files `011-020` -> Phase 2 JSONL append -> merged report -> dashboard refresh -> packet doc repair -> strict validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Re-anchor on Existing Work
- [x] Read `phase-research-prompt.md`
- [x] Read the Phase 1 synthesis and dashboard
- [x] Read iteration files `001-010`
- [x] Identify where Phase 2 must add net-new signal

### Phase 2: Gather Deeper Evidence
- [x] Read deeper external workflow, continuity, testing, docs, and registry files
- [x] Re-read relevant Public comparison surfaces
- [x] Extract exact file:line evidence for refactor/pivot questions

### Phase 3: Produce Phase 2 Artifacts
- [x] Write `research/iterations/iteration-011.md` through `research/iterations/iteration-020.md`
- [x] Append 10 Phase 2 rows to `research/deep-research-state.jsonl`
- [x] Rewrite `research/research.md` with combined findings
- [x] Rewrite `research/deep-research-dashboard.md` with all 20 iterations

### Phase 4: Repair and Validate the Packet
- [x] Restore missing Level 3 docs in the phase root
- [x] Fix packet-local markdown references in `phase-research-prompt.md`
- [x] Parse the JSONL and verify combined totals
- [x] Run strict validation and fix any phase-local failures
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact presence | Iteration files and packet docs exist where expected | `rg --files`, `find` |
| State integrity | JSONL append is parseable, sequential, and Phase 2 rows are tagged | `python3` JSON parse |
| Packet validation | Level, links, required files, and packet integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "<phase>" --strict` |
| Manual review | Totals, verdicts, and non-goals are consistent across report and dashboard | `sed`, diff inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `phase-research-prompt.md` | Internal | Green | Phase framing drifts |
| Packet-local Relay snapshot under `external/` | Internal | Green | No research substrate |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Green | Packet cannot be closed cleanly |
| Existing Phase 1 artifacts | Internal | Green | Phase 2 cannot build cumulatively |
| Local shell/JSON parsing tools | Internal | Green | Verification becomes weaker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Invalid citations, broken JSONL, or strict validation failure after edits.
- **Procedure**: Remove or repair only the affected phase-local artifacts, regenerate the merged synthesis from verified iteration files, and rerun validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 baseline review -> deep evidence reads -> Phase 2 artifact writing -> packet repair -> validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline review | None | Evidence gathering |
| Evidence gathering | Baseline review | Iteration writing |
| Phase 2 artifact writing | Evidence gathering | Packet repair |
| Packet repair | Phase 2 artifact writing | Validation |
| Validation | Packet repair | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline review | Medium | 20-40 minutes |
| Evidence gathering | High | 60-120 minutes |
| Phase 2 writing | High | 90-150 minutes |
| Packet repair + validation | Medium | 20-45 minutes |
| **Total** | | **~3-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-closeout Checklist
- [x] All writes are phase-local
- [x] Iterations 001-010 remain untouched
- [x] External repo remains read-only
- [x] Report and dashboard totals match parsed JSONL

### Rollback Procedure
1. Remove the specific broken artifact.
2. Regenerate it from verified iteration/source evidence.
3. Re-run JSONL parsing and strict validation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This packet modifies markdown and JSONL research artifacts only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Prior report
  -> external/Public evidence set
    -> iterations 011-020
      -> combined JSONL/report/dashboard
        -> packet docs repaired
          -> strict validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Re-read Phase 1 artifacts
2. Gather exact external/Public evidence for Phase 2 questions
3. Write the ten new iterations
4. Merge the report and dashboard
5. Repair packet docs and prompt references
6. Pass strict validation

**Total Critical Path**: prior-work review -> evidence -> writing -> repair -> validation

**Parallel Opportunities**:
- External evidence gathering and Public comparison reads can be batched before writing.
- JSONL parsing and file-presence checks can run alongside artifact review.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 2 evidence set ready | Exact file:line slices collected for refactor questions | Before writing iteration 011 |
| M2 | Phase 2 iterations complete | `research/iterations/iteration-011.md` through `research/iterations/iteration-020.md` exist | Writing phase |
| M3 | Combined synthesis complete | Report and dashboard reflect all 20 iterations | Synthesis phase |
| M4 | Packet structurally complete | Missing Level 3 docs restored and prompt links repaired | Repair phase |
| M5 | Validation clean | Strict validator exits 0 | Closeout |
<!-- /ANCHOR:milestones -->

---

### AI Execution Protocol

#### Pre-Task Checklist

- Confirm the active spec folder is `007-relay-main` and all writes stay inside it.
- Re-read the latest packet artifacts before extending them so Phase 2 builds on Phase 1 instead of repeating it.
- Verify the bundled Relay checkout under `external/` remains read-only.
- Capture exact file:line evidence before drafting findings or verdicts.
- Reconcile report, dashboard, and JSONL totals before claiming completion.

#### Execution Rules

| Rule | Requirement | Why |
|------|-------------|-----|
| Scope | Only edit files under `007-relay-main/` | Prevent cross-packet churn |
| Evidence | Every nontrivial claim cites exact external or Public paths | Keep research auditable |
| Phase discipline | Do not modify iterations `001-010` | Preserve Phase 1 history |
| Validation | Treat strict validation as the final completion gate | Avoid structurally broken packets |
| Honesty | Record rejected ideas and KEEP verdicts explicitly | Prevent selective reporting |

#### Status Reporting Format

- Report progress as `phase`, `iteration range`, `artifact status`, and `open validator issues`.
- When a blocker appears, name the exact file and rule instead of summarizing vaguely.
- Final closeout must include the Phase 2 completion contract with verdict totals and combined counts.

#### Blocked Task Protocol

1. Stop on the first packet-local validation or integrity failure.
2. Identify the failing file, validator rule, and exact evidence.
3. Repair only the phase-local artifact responsible for the failure.
4. Re-run the narrowest meaningful verification first, then rerun strict validation before closing.
