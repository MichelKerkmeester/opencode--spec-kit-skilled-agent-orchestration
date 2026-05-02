---
title: "Verification Checklist: README code template governance [template:level_2/checklist.md]"
description: "Verification evidence for README code template phase documentation, diagram styling correction, code-folder README batch evidence, explicit target manifest, final remediation evidence, and final P1 cleanup evidence."
trigger_phrases:
  - "readme code template checklist"
  - "validate document evidence"
  - "extract structure dqi"
  - "hvr punctuation"
  - "flowchart validator limitation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template"
    last_updated_at: "2026-05-02T13:05:00Z"
    last_updated_by: "general"
    recent_action: "Recorded Task #31 final P1 cleanup verification evidence"
    next_safe_action: "Use implementation-summary.md for detailed evidence"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/readme_template.md"
      - ".opencode/skill/sk-doc/assets/documentation/readme_code_template.md"
    session_dedup:
      fingerprint: "sha256:0510000000000000000000000000000000000000000000000000000000000004"
      session_id: "task-10-readme-code-template-diagram-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task #25 code-folder README batch evidence satisfies README batch verification documentation requirements."
      - "Task #28 manifest and remediation evidence satisfy final review recovery requirements."
      - "Task #31 final P1 cleanup records code_graph and stress_test README validation passed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: README code template governance

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence: REQ-001 through REQ-004]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence: documentation-only packet update plan]
- [x] CHK-003 [P1] Dependencies identified and available [Evidence: Task #5, Task #9, Task #25, and Task #28 evidence supplied]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [Evidence: `validate_document.py` exit 0 for both README template files. Task #9 reconfirmed exit 0 for `readme_code_template.md` after diagram styling correction]
- [x] CHK-011 [P0] No console errors or warnings [Evidence: not applicable to Markdown template docs. HVR punctuation and banned-word scans found no matches]
- [x] CHK-012 [P1] Error handling implemented [Evidence: not applicable to documentation templates]
- [x] CHK-013 [P1] Code follows project patterns [Evidence: `extract_structure.py` exit 0 for both files with DQI 99 excellent. Task #9 reconfirmed `readme_code_template.md` DQI 99 excellent]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [Evidence: Task #5 supplied final revision results passed. Task #9 corrected `readme_code_template.md` diagrams to sk-doc Unicode box drawing style]
- [x] CHK-021 [P0] Manual testing complete [Evidence: HVR punctuation and banned-word scans found no matches]
- [x] CHK-022 [P1] Edge cases tested [Evidence: scaffold heading `non_sequential_numbering` warnings documented as acceptable code-fence warnings. Directory trees intentionally remain tree blocks]
- [x] CHK-023 [P1] Error scenarios validated [Evidence: no HVR punctuation or banned-word matches, both primary validators exited 0, and flowchart validator exit 1 is documented as a non-blocking validator limitation]
- [x] CHK-024 [P1] Code-folder README P1 batches complete [Evidence: Task #25 reports P1 batches completed]
- [x] CHK-025 [P1] Code-folder README P2 batches complete [Evidence: Task #25 reports P2 batches 01-22 completed]
- [x] CHK-026 [P1] Shared README remediation documented [Evidence: `.opencode/skill/system-spec-kit/shared/README.md` recorded as fixed]
- [x] CHK-027 [P1] Batch exceptions documented [Evidence: `templates/scratch/README.md` validator skip by template-path rule, DQI 64 from `extract_structure`, and reported validator alternatives recorded for final review]
- [x] CHK-028 [P1] Explicit README sweep target manifest documented [Evidence: exact path table in `implementation-summary.md`]
- [x] CHK-029 [P1] Final blocker remediation documented [Evidence: shared README fixed, HVR blockers fixed, lowercase-v diagram blockers fixed, low-DQI files improved, and template scratch exception retained]
- [x] CHK-030 [P1] Final P1 cleanup documented [Evidence: `mcp_server/code_graph/README.md` semicolon prose fixed and validation passed. `mcp_server/stress_test/README.md` banned term removed from prose, remains only in command text `npm run stress:harness`, and validation passed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-031 [P0] No hardcoded secrets [Evidence: documentation-only README template changes. HVR scans found no matches]
- [x] CHK-032 [P0] Input validation implemented [Evidence: not applicable to Markdown templates]
- [x] CHK-033 [P1] Auth/authz working correctly [Evidence: not applicable to Markdown templates]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [Evidence: phase docs updated for completed Task #5 work, Task #6 cleanup, Task #9 diagram styling correction, Task #25 batch evidence, and Task #28 final manifest/remediation evidence]
- [x] CHK-041 [P1] Code comments adequate [Evidence: not applicable to Markdown templates]
- [x] CHK-042 [P2] README updated (if applicable) [Evidence: README template assets were updated in Task #5]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [Evidence: scratch/ contains `.gitkeep` only]
- [x] CHK-051 [P1] scratch/ cleaned before completion [Evidence: no task scratch artifacts present]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-02

**Task #5 Evidence**:
- `.opencode/skill/sk-doc/assets/documentation/readme_template.md`: general template expanded for skill/project README alignment based on sampled skill READMEs. `validate_document.py` exit 0 with non-blocking `non_sequential_numbering` warnings from scaffold headings in code fences. `extract_structure.py` exit 0 with DQI 99 excellent.
- `.opencode/skill/sk-doc/assets/documentation/readme_code_template.md`: code template improved with an `ARCHITECTURE.md`-style zone diagram, package topology, allowed dependency direction, directory tree, key file table, and control-flow example. `validate_document.py` exit 0 with non-blocking `non_sequential_numbering` warnings from scaffold headings in code fences. `extract_structure.py` exit 0 with DQI 99 excellent.
- HVR punctuation scan found no matches.
- HVR banned-word scan found no matches.

**Task #9 Diagram Styling Evidence**:
- `.opencode/skill/sk-doc/assets/documentation/readme_code_template.md`: diagrams now use sk-doc Unicode box drawing style.
- Replaced ASCII `+---`, `--->`, lowercase `v`, and bracket-list `->` diagram patterns.
- Directory trees intentionally remain tree blocks.
- `validate_document.py` exit 0 for `readme_code_template.md`.
- `extract_structure.py` exit 0 for `readme_code_template.md` with DQI 99 excellent.
- Flowchart validator on extracted blocks exited 1 because centered connector indentation was counted as nesting depth. Box widths, arrows, and labels passed, so this is recorded as a non-blocking validator limitation.

**Task #25 Code-Folder README Batch Evidence**:
- P1 batches completed.
- P2 batches 01-22 completed.
- `.opencode/skill/system-spec-kit/shared/README.md` is fixed in final remediation.
- Batch validation summaries are recorded as complete for the supplied P1 and P2 batch evidence.
- `templates/scratch/README.md` is a known exception: validator skipped by template-path rule and `extract_structure` reported DQI 64.
- Some agents reported validator alternatives such as `verify_alignment_drift.py` or markdownlint where applicable; final review will verify globally.

**Task #28 Final Manifest and Remediation Evidence**:
- Exact README sweep target manifest is recorded in `implementation-summary.md` under `README Sweep Target Manifest`.
- Shared README blocker is fixed.
- HVR blockers are fixed.
- Diagram lowercase-v blockers are fixed.
- Low-DQI files were improved, with `templates/scratch/README.md` retained as the remaining template scratch exception.

**Task #31 Final P1 Cleanup Evidence**:
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md`: semicolon prose fixed and validation passed.
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md`: banned term removed from prose, remains only in command text `npm run stress:harness`, and validation passed.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
