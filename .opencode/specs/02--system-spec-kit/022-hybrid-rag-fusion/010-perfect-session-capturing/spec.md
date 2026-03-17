---
title: "Feature Specification: Perfect Session Capturing [template:level_3/spec.md]"
description: "Closure remediation for spec 010: align phase docs, retained proof, and validation to the final verified March 17, 2026 state."
trigger_phrases:
  - "perfect session capturing"
  - "spec 010"
  - "truth reconciliation"
  - "phase blocker"
  - "multi cli proof"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## 1. EXECUTIVE SUMMARY

This pass closes the parent spec pack and the remaining child-phase documentation against the March 17, 2026 verified baseline. The executable surface passes end to end: package typecheck, scripts check/build, contamination and parity-focused lanes, extractor and module suites, the focused phase-016 parity lane, the phase-010 and phase-011 proof lanes, the full MCP suite, strict recursive spec validation, and strict parent completion.

**Completion highlights**:
- Strict recursive validation now passes with `0` errors and `0` warnings after phased-template addenda were formalized in `template-structure.js`.
- A current same-day retained live-proof artifact exists for all five supported CLIs in `research/live-cli-proof-2026-03-17.json`.
- Parent and child checklists are strict-complete, including the required memory-save closeout artifacts.

**Key Decisions**: formalize phased-parent and child addenda in the validator instead of stripping sanctioned sections, reconcile child docs to shipped code and tests, treat `research/` as canonical evidence and `scratch/` as non-canonical operator tooling, and keep fixture-backed proof and live proof explicitly distinguished even now that both are satisfied.

**Critical Dependencies**: system-spec-kit validator and completion scripts, current script and MCP test lanes, phase-local specs, supporting docs validated by `sk-doc`, and the retained live CLI proof artifact.

---

<!-- ANCHOR:metadata -->
## 2. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-08 |
| **Branch** | `022-hybrid-rag-fusion/010-perfect-session-capturing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM & PURPOSE

### Problem Statement

The parent spec pack had drifted away from current reality in three ways. First, it still described the pre-fix state even after the phased-template comparator gap and the live-CLI-proof gap were both closed. Second, child phases `003`, `009`, `012`, and `014` still had strict-closeout blockers while phases `004`, `005`, `010`, `011`, and `016` had documentation drift against shipped behavior. Third, supporting docs and metadata still contained stale counts such as `127`, `44`, `43`, `25`, `294`, `7781`, and `7820`, which no longer matched the March 17, 2026 reruns.

### Purpose

Reconcile the parent and targeted child documentation to the shipped, tested, and fully validated state, and make every published count, status, and evidence claim trace back to current reruns and retained proof artifacts rather than narrative carry-over.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Reconcile the parent spec pack (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) to the approved re-analysis disposition.
- Backfill phase docs for `004-type-consolidation`, `005-confidence-calibration`, `010-integration-testing`, `011-session-source-validation`, and `016-multi-cli-parity` to the shipped state.
- Refresh supporting docs and metadata to the current verification counts: `384/389`, `307`, `47`, `29`, `45`, `70`, `66`, `20`, and `7783/11/28/7822`.
- Reassert the evidence policy that `research/` is canonical and `scratch/` is non-canonical unless intentionally retained as an operator tool.
- Verify retained scratch launchers with `bash -n`, `shellcheck`, and correct-path review.

### Out of Scope
- Fixing `template-structure.js` or changing template comparator behavior in this pass.
- Adding new live CLI capture plumbing beyond the retained proof produced in this closure pass.
- Public API, schema, or contract changes outside the small phase-004 internal type cleanup that is already in scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md` | Modify | Parent specification reconciled to the final validated state and retained live proof |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/plan.md` | Modify | Parent implementation plan rewritten around final closure evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/tasks.md` | Modify | Parent tasks aligned to targeted phase remediation and verification reruns |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checklist.md` | Modify | Parent verification checklist aligned to the final all-green validation and proof evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md` | Modify | ADR updated to record the final closure decisions and validator approach |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md` | Modify | Parent summary rewritten to record the final verified outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## 5. PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.
>
| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 001 | `001-quality-scorer-unification/` | Unify canonical quality scoring and threshold behavior | None | Complete |
| 002 | `002-contamination-detection/` | Strengthen contamination detection and audit trail coverage | 001 | Complete |
| 003 | `003-data-fidelity/` | Preserve normalized data fidelity and visible drop reporting | 002 | Complete |
| 004 | `004-type-consolidation/` | Consolidate canonical shared types across the pipeline | 003 | Complete |
| 005 | `005-confidence-calibration/` | Calibrate confidence signals and gating behavior | 004 | Complete |
| 006 | `006-description-enrichment/` | Improve description fidelity and enrichment quality | 005 | Complete |
| 007 | `007-phase-classification/` | Stabilize phase classification and routing semantics | 006 | Complete |
| 008 | `008-signal-extraction/` | Tighten signal extraction behavior and evidence quality | 007 | Complete |
| 009 | `009-embedding-optimization/` | Optimize embedding workload and retrieval prep | 008 | Complete |
| 010 | `010-integration-testing/` | Verify end-to-end integration behavior | 009 | Complete |
| 011 | `011-session-source-validation/` | Validate native session-source capture behavior | 010 | Complete |
| 012 | `012-template-compliance/` | Bring docs and templates back to validator truth | 011 | Complete |
| 013 | `013-auto-detection-fixes/` | Fix native-source auto-detection behavior | 012 | Complete |
| 014 | `014-spec-descriptions/` | Align phase descriptions and documentation narratives | 013 | Complete |
| 015 | `015-outsourced-agent-handback/` | Normalize handback expectations for delegated work | 014 | Complete |
| 016 | `016-multi-cli-parity/` | Record fixture-backed and live CLI parity evidence | 015 | Complete |

### Phase Transition Rules

- Each child phase remains independently responsible for its own `validate.sh` and `check-completion.sh` outcomes.
- Parent completion claims must never outrun child checklist truth.
- Parent status must match the aggregate child truth plus the latest parent validation and proof state.
- Recursive validation remains the integrated truth gate for the full phased spec pack.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 003 | 004 | Canonical types centralized and shared seams cleaned up | typecheck + extractor/spec-affinity regressions |
| 004 | 005 | Confidence calibration docs reflect the shipped scoring behavior | checklist + script lane evidence |
| 009 | 010 | Integration tests exist inside the live Vitest surface | `workflow-e2e.vitest.ts` + `test-integration.vitest.ts` |
| 010 | 011 | Session-source validation is proven in shipped runtime and tests | `claude-code-capture` + render/quality regressions |
| 015 | 016 | Parity proofs distinguish fixture-backed coverage from live proof freshness | focused 4-file parity lane |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 6. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent docs reflect the final strict-clean closure state | Root spec pack reports strict recursive validation `0/0`, strict completion `43/43`, and a current same-day retained five-CLI proof artifact |
| REQ-002 | Phase `004` docs reflect the real shipped work | Phase `004` shows the narrow type-consolidation closure instead of broad placeholder migration language |
| REQ-003 | Phases `005`, `010`, and `011` match shipped verification state | Child docs no longer remain pre-implementation or partially closed after current reruns |
| REQ-004 | Supporting docs and metadata reflect March 17, 2026 reruns | Feature catalog, playbook, and description metadata use current counts and dates |
| REQ-005 | Parent evidence distinguishes fixture-backed proof from retained live proof while recording both as satisfied | Green test lanes and retained five-CLI proof are both documented without conflation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `scratch/` authority rules are explicit | Parent docs say `research/` is canonical and retained scratch launchers are operator tools only |
| REQ-007 | Parent phase map matches child status truth | Parent map shows the same completed states now present in the child specs |
| REQ-008 | Retained scratch launchers pass operator hygiene | `bash -n`, `shellcheck`, and path review succeed for the supported launchers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

- **SC-001**: **Given** the parent spec pack is reviewed, **Then** it reports strict recursive validation as fully passed with `0` errors and `0` warnings.
- **SC-002**: **Given** phases `004`, `005`, `010`, `011`, and `016` are opened, **Then** their plans, tasks, checklists, and summaries match shipped code and rerun-backed evidence.
- **SC-003**: **Given** the supporting docs are validated, **Then** stale counts such as `127`, `43`, `25`, `294`, `7781`, and `7820` no longer appear where current evidence is `44`, `45`, `47`, `29`, `307`, `20`, `7783`, and `7822`.
- **SC-004**: **Given** the root summary cites the executable surface, **Then** the published counts match the March 17, 2026 reruns: `384/389`, `307`, `47`, `29`, `45`, `70`, `66`, `20`, and `7783/11/28/7822`.
- **SC-005**: **Given** a reviewer checks closure language, **Then** live CLI proof is described as retained and current for all five supported CLIs with the artifact path cited explicitly.
- **SC-006**: **Given** the parent strict validation result is rerun, **Then** the phased-parent addenda validate cleanly through the formalized comparator path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 8. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `template-structure.js` phased addendum support | High | Keep the tests that protect parent/child addendum handling green so future edits do not reintroduce drift |
| Dependency | Live CLI retained proof artifact | High | Keep `research/live-cli-proof-2026-03-17.json` current before publishing future parity claims |
| Risk | Child docs could overclaim completion if based on narrative only | High | Backfill only from currently passing test and validation commands |
| Risk | Scratch tooling could be mistaken for canonical evidence | Medium | Record that `scratch/` is non-canonical unless explicitly retained as an operator tool |
| Risk | Concurrent worktree changes could tempt broad cleanup | Medium | Preserve strict scope lock and avoid unrelated reverts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 9. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation reconciliation must preserve the currently passing executable surface without introducing new build or test regressions.

### Security
- **NFR-S01**: This pass must not widen public runtime contracts or weaken current save-path, path-safety, or quality-gate behavior.

### Reliability
- **NFR-R01**: Every published verification claim in the parent docs must map to a rerunnable command executed in this workspace.

---

## 10. EDGE CASES

### Data Boundaries
- Mixed proof sources: fixture-backed parity and live CLI proof must stay separate.
- Parent/child mismatch: a child can be complete while the parent remains incomplete until recursive validation and parent checklist gates are rerun.
- Scratch tooling: shell launchers may remain useful operationally without becoming canonical closure evidence.

### Error Scenarios
- Future phased-parent edits could regress comparator support if addendum coverage is not preserved in `template-structure.js`.
- Live CLI artifact freshness can go stale over time even when the current retained artifact is complete.
- Description metadata can drift from docs if timestamps are not refreshed after final edits.

---

## 11. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Technical complexity | 3/5 | Mostly documentation reconciliation with one narrow internal type cleanup already shipped |
| Verification complexity | 5/5 | Requires broad reruns across scripts, MCP, spec validation, docs validation, and shell tooling |
| Coordination complexity | 4/5 | Parent and child docs must stay synchronized while avoiding overclaiming |
| Operational risk | 4/5 | Closure language must stay honest despite green executable lanes |

---

## 12. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Root strict validation drifts away from the actual validator output again | H | M | Keep parent status tied to rerun evidence and the comparator tests |
| R-002 | Child docs overclaim completion beyond proof | H | M | Tie every status update to a rerun-backed evidence lane |
| R-003 | Parent completion is mistaken for proof freshness without retained artifacts | H | M | Keep the retained five-CLI artifact path cited in parent and phase-016 docs |
| R-004 | Scratch artifacts are treated as canonical evidence | M | M | Document canonical authority rules and verify retained launchers separately |

---

## 13. USER STORIES

### US-001: Verified Parent Closure (Priority: P0)

**As a** maintainer, **I want** the parent spec to report the final validator and proof reality, **so that** closure claims stay auditable.

**Acceptance Criteria**:
1. Given the parent docs, when reviewed, then the strict validation pass state and retained five-CLI proof are explicit.

### US-002: Shipped Phase Backfill (Priority: P0)

**As a** maintainer, **I want** shipped phase evidence reflected in child docs, **so that** no phase stays pre-implementation after code and tests are green.

**Acceptance Criteria**:
1. Given phases `004`, `005`, `010`, `011`, and `016`, when reviewed, then their docs match the shipped runtime and current reruns.

### US-003: Honest Scratch Authority (Priority: P1)

**As a** reviewer, **I want** `research/` and `scratch/` to have clearly separated authority, **so that** canonical evidence does not depend on operator-only helpers.

**Acceptance Criteria**:
1. Given retained launchers under `scratch/`, when reviewed, then they are clearly non-canonical and pass shell hygiene checks.

---

## 14. OPEN QUESTIONS

- None. Parent validation, strict completion, and retained five-CLI proof were all closed in this pass.
<!-- /ANCHOR:questions -->

---

## 15. RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research Synthesis**: See `research/research-pipeline-improvements.md`