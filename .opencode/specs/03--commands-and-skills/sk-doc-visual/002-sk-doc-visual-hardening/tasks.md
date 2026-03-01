---
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
title: "Tasks: sk-doc-visual Hardening [041-sk-doc-visual-hardening/tasks]"
description: "Task-level execution checklist aligned to the hardening spec and plan, preserving current completion/evidence state."
trigger_phrases:
  - "tasks"
  - "visual"
  - "explainer"
  - "hardening"
  - "041"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-doc-visual Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## 1. OVERVIEW

Task-level execution checklist aligned to the hardening spec and plan, preserving current completion/evidence state.
---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline capture

- [x] T001 Capture baseline validator output for `architecture.html` (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`, `.opencode/skill/sk-doc-visual/assets/templates/architecture.html`)
- [x] T002 Capture baseline validator output for `data-table.html` (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`, `.opencode/skill/sk-doc-visual/assets/templates/data-table.html`)
- [x] T003 Capture baseline validator output for `mermaid-flowchart.html` (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`, `.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html`)
- [ ] T004 Save baseline evidence file under `.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/scratch/`

Verification commands:

```bash
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh .opencode/skill/sk-doc-visual/assets/templates/architecture.html
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh .opencode/skill/sk-doc-visual/assets/templates/data-table.html
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh .opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html
```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Validator fixes

- [x] T005 Fix `VE_TOKEN_COUNT` counting logic (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T006 Update typography guardrails to allow `Roboto Mono` while still blocking Inter/Roboto/Arial primary (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T007 Implement multiline-safe `background-image` detection (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)

Verification commands:

```bash
rg -n -- "VE_TOKEN_COUNT|Typography Guardrails|Background Atmosphere" .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh
```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Template token migration

- [x] T008 Canonicalize tokens in `architecture.html` to `--ve-*` (`.opencode/skill/sk-doc-visual/assets/templates/architecture.html`)
- [x] T009 Canonicalize tokens in `data-table.html` to `--ve-*` (`.opencode/skill/sk-doc-visual/assets/templates/data-table.html`)
- [x] T010 Canonicalize tokens in `mermaid-flowchart.html` to `--ve-*` (`.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html`)

Verification commands:

```bash
rg -n -- "--ve-" .opencode/skill/sk-doc-visual/assets/templates/architecture.html .opencode/skill/sk-doc-visual/assets/templates/data-table.html .opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html
```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Docs correction

- [x] T011 Fix sequence syntax typo `->>/-->` in docs (`.opencode/skill/sk-doc-visual/references/library_guide.md`)

Verification commands:

```bash
rg -n --fixed-strings -- "->>/-->" .opencode/skill/sk-doc-visual/references/library_guide.md
rg -n --fixed-strings -- "->>/-->>" .opencode/skill/sk-doc-visual/references/library_guide.md
```
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Validation+summary

- [x] T012 Run validator and confirm exit code `0` for `architecture.html` (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T013 Run validator and confirm exit code `0` for `data-table.html` (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T014 Run validator and confirm exit code `0` for `mermaid-flowchart.html` (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T015 Verify typography guardrail behavior for `Roboto Mono` allow + Inter/Roboto/Arial primary block (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T016 Update checklist evidence and verification summary (`.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/checklist.md`)
- [x] T017 Finalize completion narrative (`.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/implementation-summary.md`)

Verification commands:

```bash
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh .opencode/skill/sk-doc-visual/assets/templates/architecture.html
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh .opencode/skill/sk-doc-visual/assets/templates/data-table.html
bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh .opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html
```
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 requirements REQ-001..REQ-003 verified with evidence
- [x] P1 requirements REQ-004..REQ-006 verified or explicitly deferred with approval
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
