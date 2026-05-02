---
title: "Implementation Plan: README code template governance [template:level_2/plan.md]"
description: "Document completed README template edits, diagram styling correction, code-folder README batch evidence, explicit target manifest, final remediation evidence, and verification evidence without modifying implementation files."
trigger_phrases:
  - "readme code template plan"
  - "readme template verification"
  - "sk-doc template governance"
  - "diagram styling correction plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template"
    last_updated_at: "2026-05-02T12:40:00Z"
    last_updated_by: "general"
    recent_action: "Recorded the documentation-only delivery plan for Task #28 manifest and remediation evidence"
    next_safe_action: "Use implementation-summary.md for review"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/readme_template.md"
      - ".opencode/skill/sk-doc/assets/documentation/readme_code_template.md"
    session_dedup:
      fingerprint: "sha256:0510000000000000000000000000000000000000000000000000000000000002"
      session_id: "task-10-readme-code-template-diagram-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task #28 is documentation-only and records the exact README target manifest plus final remediation evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: README code template governance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates and spec-kit packet docs |
| **Framework** | `sk-doc` documentation assets plus `system-spec-kit` phase workflow |
| **Storage** | Filesystem packet docs |
| **Testing** | `validate_document.py`, `extract_structure.py`, HVR punctuation scan, HVR banned-word scan, batch validators, manifest review, remediation evidence review, `validate.sh --strict` |

### Overview
Task #28 updates the active phase packet to reflect the explicit README sweep target manifest and final remediation evidence in addition to the final README template revisions completed in Task #5, diagram styling correction completed in Task #9, and code-folder README batch evidence completed in Task #25. The approach is documentation-only: record changed files, final revision evidence, HVR punctuation cleanup, diagram styling correction, non-blocking validator limitation, P1 batch completion, P2 batches 01-22 completion, target manifest, shared README fix evidence, HVR blocker fix evidence, lowercase-v diagram blocker fix evidence, low-DQI improvement evidence, known exception notes, task status, and checklist completion, then validate the phase packet strictly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [File: spec.md]
- [x] Success criteria measurable [File: spec.md SC-001 through SC-005]
- [x] Dependencies identified [Dependency: Task #5 final revision and verification evidence]

### Definition of Done
- [x] All acceptance criteria met [File: checklist.md]
- [x] Tests passing or acceptable warnings documented [Evidence: Task #5 validation exit 0, structure exit 0, HVR punctuation scan no matches, HVR banned-word scan no matches. Task #9 `readme_code_template.md` primary validators exit 0 and flowchart validator limitation documented. Task #25 batch validation summaries and exceptions documented. Task #28 exact manifest and final remediation evidence documented]
- [x] Docs updated [Files: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation governance packet update.

### Key Components
- **README template assets**: `.opencode/skill/sk-doc/assets/documentation/readme_template.md` and `.opencode/skill/sk-doc/assets/documentation/readme_code_template.md` are the changed implementation files from Task #5.
- **General README template revision**: the general template was expanded for skill/project README alignment based on sampled skill READMEs.
- **Code README template revision**: the code template gained an `ARCHITECTURE.md`-style zone diagram, package topology, allowed dependency direction, directory tree, key file table, and control-flow example.
- **Diagram styling correction**: Task #9 corrected `readme_code_template.md` diagrams to sk-doc Unicode box drawing style, replacing ASCII `+---`, `--->`, lowercase `v`, and bracket-list `->` diagram patterns while leaving directory trees as intentional tree blocks.
- **Code-folder README batch evidence**: Task #25 records P1 batches complete, P2 batches 01-22 complete, batch validation summaries, and final-review exception notes.
- **README sweep target manifest**: Task #28 records exact README target paths in `implementation-summary.md` for final review recovery.
- **Final remediation evidence**: Task #28 records `.opencode/skill/system-spec-kit/shared/README.md` fixed, HVR blockers fixed, lowercase-v diagram blockers fixed, low-DQI files improved, and `templates/scratch/README.md` retained as the remaining template scratch exception.
- **Phase packet docs**: this folder records status, evidence, and completion for release cleanup.

### Data Flow
Task #5, Task #9, Task #25, and Task #28 verification results are captured in `implementation-summary.md`, mirrored in `tasks.md` and `checklist.md`, and validated by the phase-level `validate.sh --strict` command.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope Capture
- [x] Identify active phase folder [Path: `051-readme-code-template`]
- [x] Confirm documentation-only boundary [Scope: do not edit `sk-doc` template files]

### Phase 2: Packet Documentation
- [x] Record changed implementation files [Files: `readme_template.md`, `readme_code_template.md`]
- [x] Record Task #5 final revision and validation evidence [File: implementation-summary.md]
- [x] Record Task #9 diagram styling correction and flowchart validator limitation [File: implementation-summary.md]
- [x] Record P1 batches complete and P2 batches 01-22 complete [File: implementation-summary.md]
- [x] Record aligned skip and batch validation summaries [Files: checklist.md, implementation-summary.md]
- [x] Record known exceptions and validator alternative notes [Files: checklist.md, implementation-summary.md]
- [x] Record explicit README sweep target manifest [File: implementation-summary.md]
- [x] Record final remediation evidence [Files: checklist.md, implementation-summary.md]
- [x] Synchronize tasks and checklist [Files: tasks.md, checklist.md]

### Phase 3: Verification
- [x] Run strict phase validation [Command: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template --strict`]
- [x] Report blockers or warnings [Output: final task response]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Both README template files | `validate_document.py` |
| Structure extraction | Both README template files | `extract_structure.py` |
| HVR punctuation scan | Both README template files | punctuation scan |
| HVR banned-word scan | Both README template files | banned-word scan |
| Diagram styling correction | `readme_code_template.md` diagrams | Task #9 evidence |
| Flowchart validator limitation | Extracted diagram blocks | flowchart validator |
| Code-folder README P1 batches | P1 batch evidence | batch validation summaries |
| Code-folder README P2 batches 01-22 | P2 batch evidence | batch validation summaries |
| Known exceptions | Skips and validator notes | final review evidence |
| README sweep target manifest | Exact final review target paths | `implementation-summary.md` manifest table |
| Final blocker remediation | Shared README, HVR, lowercase-v diagrams, low-DQI files | final remediation evidence |
| Packet validation | Active phase packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Task #5 evidence | Internal | Green | Packet could not accurately record verification without it. |
| Task #9 evidence | Internal | Green | Packet could not accurately record final diagram styling correction without it. |
| Task #25 batch evidence | Internal | Green | Packet could not accurately record code-folder README completion state without it. |
| `system-spec-kit` validator | Internal | Green | Required to prove phase docs remain valid. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet validation exits 2 or docs misrepresent Task #5 or Task #9 evidence.
- **Procedure**: Correct only this phase packet and rerun strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Task #5 implementation evidence + Task #9 diagram evidence + Task #25 batch evidence ──► phase docs ──► strict phase validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scope Capture | User task instructions | Packet Documentation |
| Packet Documentation | Task #5 evidence, Task #9 evidence, and Task #25 batch evidence | Verification |
| Verification | Packet Documentation | Release cleanup completion record |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scope Capture | Low | Completed |
| Packet Documentation | Medium | Completed |
| Verification | Low | Completed |
| **Total** | | **Completed in Task #10** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No implementation files edited during Task #6
- [x] Task #5 evidence available
- [x] Task #9 diagram styling evidence available
- [x] Packet docs scoped to active phase folder

### Rollback Procedure
1. Restore accurate Task #5 and Task #9 evidence in this phase packet if validation finds drift.
2. Rerun `validate.sh --strict` for the active phase.
3. Report the corrected validation result.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
