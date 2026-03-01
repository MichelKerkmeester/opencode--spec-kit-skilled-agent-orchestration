---
title: "Implementation Plan: sk-doc-visual Template Improvement [044-sk-doc-visual-template-improvement/plan]"
description: "Phase-driven Level 3 execution plan for README Ledger modernization with strict scope lock, validator alignment, and completion evidence."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation plan"
  - "spec_kit complete"
  - "README Ledger"
  - "validation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: sk-doc-visual Template Improvement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, HTML, CSS, JavaScript, Shell |
| **Framework** | OpenCode skill framework (`sk-doc-visual`) |
| **Storage** | File-based repository artifacts |
| **Testing** | Spec validation, placeholder scan, HTML validator script, manual responsive checks |

### Overview
This plan executes full modernization to the README Ledger profile across `sk-doc-visual` skill docs, references, templates, and validator policy. The workflow is structured for `/spec_kit:complete` auto mode with hard scope lock checks, explicit validation gates, and required memory save at the end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Level 3 root docs populated and cross-linked.
- [x] Scope lock frozen and shared across spec/plan/tasks/checklist.
- [x] Task IDs include rewrite, validation, and memory-save coverage.

### Definition of Done
- [x] Skill, references, templates, and validator updates completed within locked scope.
- [x] Validation commands pass and evidence is captured in checklist.
- [x] `implementation-summary.md` updated with final pass/fail outcomes.
- [x] Memory context saved via `generate-context.js` for this spec folder.
<!-- /ANCHOR:quality-gates -->

---

## 3. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target file set against scope lock before first implementation edit.
- Confirm `research.md` and context files remain read-only inputs.
- Confirm blockers are recorded before proceeding to next phase.

### Task Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute phases in order unless task is marked parallelizable |
| TASK-SCOPE | Reject out-of-scope file edits and record follow-up task |
| TASK-VERIFY | Do not mark phase complete until required checks pass |
| TASK-EVIDENCE | Every completed P0/P1 checklist item must include evidence |

### Status Reporting Format
- `Phase -> Task ID -> State -> Evidence`
- Example: `Phase 5 -> V510 -> PASS -> validate-html-output.sh all templates`

### Blocked Task Protocol
- Block condition: missing dependency, failed validation, scope conflict, or unresolved contradiction.
- Action: mark task blocked, document reason and remediation, resume only after blocker resolution.

---

<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE

### Pattern
Documentation Control Plane -> Rewrite Plane -> Validator Alignment Plane -> Verification Plane -> Memory Capture Plane.

### Key Components
- **Control Plane (this spec folder)**: governs scope, phases, and completion gates.
- **Rewrite Plane**: updates `SKILL.md`, references, and seven templates.
- **Validator Plane**: aligns rule checks to modernization policy without reducing safety.
- **Verification Plane**: runs command and manual checks.
- **Memory Plane**: persists session context for continuity.

### Data Flow
`context/README.html` + `context/context.md` + `research.md` -> spec docs -> `/spec_kit:complete` phase execution -> rewrite diffs -> validation output -> checklist evidence -> implementation summary -> memory save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Documentation Lock
- [x] T100-T105 finalize Level 3 root docs.
- [x] T106 freeze scope lock and file inventory.

### Phase 2: Implementation Preflight
- [x] T200 confirm target inventory exists.
- [x] T201 run auto workflow kickoff.
- [x] T202 capture rollback baseline for rewrite targets.
- [x] T203 re-check scope lock before editing implementation files.

### Phase 3: Skill and Reference Rewrite
- [x] T300 rewrite `SKILL.md` modernization policy.
- [x] T310-T317 rewrite reference set for ledger profile.

### Phase 4: Template Rewrite
- [x] T400-T407 rewrite all seven templates using shared shell requirements.
- [x] T408 verify per-template behavior requirements retained.

### Phase 5: Validator Alignment
- [x] T500 update `validate-html-output.sh` for token/typography/theme/script policy.
- [x] T501 adjust drift checks and `library_versions.json` only if dependency pins changed.

### Phase 6: Verification and Completion
- [x] V600-V607 run spec, placeholder, validator, and responsive checks.
- [x] V608 update checklist evidence and implementation summary.

### Phase 7: Memory and Closeout
- [x] M700 save context using `generate-context.js` with this spec folder path.
- [x] M701 verify no scope drift and mark completion readiness.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Level 3 doc structure and required files | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates` |
| Placeholder scan | Root docs have no unresolved placeholders | `.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates` |
| Template policy validation | Each rewritten HTML template passes validator | `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh <template-file>` |
| Dependency drift validation | Version pin consistency for external libs | `.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh` |
| Manual behavior verification | Desktop/mobile layout, TOC, reveal/viz behavior | Browser checks against context criteria |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context/README.html` | Internal | Green | Cannot establish canonical style/interaction contract |
| `context/context.md` | Internal | Green | Component-level rewrite mapping becomes ambiguous |
| `research.md` | Internal | Green | Implementation scope may be incomplete without synthesis |
| `sk-doc-visual` target files | Internal | Yellow | Missing/moved files require scope correction before edits |
| Spec/validator scripts | Internal | Green | Completion cannot be claimed safely without checks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: failed validation, scope drift, or unacceptable behavior regression.
- **Procedure**: revert only modified `sk-doc-visual` implementation files to baseline snapshot, keep spec root docs, rerun validation, and re-enter at prior phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Docs) -> Phase 2 (Preflight) -> Phase 3 (Skill+Refs) -> Phase 4 (Templates) -> Phase 5 (Validators) -> Phase 6 (Verify) -> Phase 7 (Memory)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Documentation Lock | None | Preflight |
| Implementation Preflight | Documentation Lock | Skill and Reference Rewrite |
| Skill and Reference Rewrite | Implementation Preflight | Template Rewrite |
| Template Rewrite | Skill and Reference Rewrite | Validator Alignment |
| Validator Alignment | Template Rewrite | Verification |
| Verification and Completion | Validator Alignment | Memory and Closeout |
| Memory and Closeout | Verification and Completion | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Documentation Lock | Medium | 1-2 hours |
| Implementation Preflight | Low | 0.5-1 hour |
| Skill and Reference Rewrite | Medium | 2-4 hours |
| Template Rewrite | High | 4-7 hours |
| Validator Alignment | Medium | 1-2 hours |
| Verification and Completion | Medium | 1-2 hours |
| Memory and Closeout | Low | 0.25-0.5 hour |
| **Total** | | **8.75-18.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline snapshot captured for all scope-listed implementation files.
- [x] Scope lock reconfirmed immediately before rewrite edits.
- [x] Validator scripts executable in current workspace.

### Rollback Procedure
1. Stop execution and record blocking validation failure.
2. Revert implementation files touched in current phase.
3. Re-run validation commands to confirm clean baseline.
4. Resume from the failed phase after remediation plan is documented.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable (file-only changes).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
+--------------------+    +--------------------+    +-----------------------+
| Phase 1: Docs      | -> | Phase 2: Preflight | -> | Phase 3: Skill+Refs   |
+--------------------+    +--------------------+    +-----------+-----------+
                                                                |
                                                                v
                                                    +-----------------------+
                                                    | Phase 4: Templates    |
                                                    +-----------+-----------+
                                                                |
                                                                v
                                                    +-----------------------+
                                                    | Phase 5: Validators   |
                                                    +-----------+-----------+
                                                                |
                                                                v
                                                    +-----------------------+
                                                    | Phase 6: Verification |
                                                    +-----------+-----------+
                                                                |
                                                                v
                                                    +-----------------------+
                                                    | Phase 7: Memory       |
                                                    +-----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Documentation lock | Context + research inputs | Frozen execution contract | Preflight |
| Skill/reference rewrite | Preflight | Updated guidance corpus | Templates |
| Template rewrite | Skill/reference rewrite | Modernized artifacts | Validator alignment |
| Validator alignment | Template rewrite | Compatible policy checks | Verification |
| Verification | Validator alignment | Evidence-backed completion state | Memory closeout |
| Memory closeout | Verification | Session continuity record | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Preflight + scope confirmation** - 0.5 to 1 hour - CRITICAL
2. **Skill/reference rewrite** - 2 to 4 hours - CRITICAL
3. **Template rewrite (7 files)** - 4 to 7 hours - CRITICAL
4. **Validator alignment + verification** - 2 to 4 hours - CRITICAL
5. **Memory save + completion checks** - 0.25 to 0.5 hour - CRITICAL

**Total Critical Path**: 8.75 to 16.5 hours

**Parallel Opportunities**:
- Reference file rewrites can parallelize after `SKILL.md` policy decisions are fixed.
- Template rewrites can parallelize per file once shared shell contract is finalized.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Documentation locked | All six root docs complete and validated | Phase 1 |
| M2 | Guidance modernized | `SKILL.md` and reference set updated in scope | Phase 3 |
| M3 | Templates modernized | Seven templates rewritten to shared ledger shell | Phase 4 |
| M4 | Validator aligned | Template validation policy updated and passing | Phase 5 |
| M5 | Completion-ready | Evidence captured, summary updated, memory saved | Phase 7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Full-System Ledger Modernization (Not Partial)

**Status**: Implemented

**Context**: The context and research inputs show system-wide mismatch. Partial migration would preserve inconsistency and force repeated rework.

**Decision**: Rewrite the full documented surface (skill + references + seven templates + validator policy) under one controlled Level 3 plan.

**Consequences**:
- Higher one-time effort but reduced long-term drift.
- Stronger consistency for `/spec_kit:complete` auto outputs.

**Alternatives Rejected**:
- Single-template-only modernization: rejected because it does not satisfy full template improvement objective.

---

<!--
LEVEL 3 PLAN
Target workflow: /spec_kit:complete auto mode
Completion blocked until validation and evidence gates pass
-->
