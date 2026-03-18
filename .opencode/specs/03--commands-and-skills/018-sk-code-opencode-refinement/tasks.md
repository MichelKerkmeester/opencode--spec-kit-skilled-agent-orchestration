---
title: "Tasks: sk-code--opencode refinement"
description: "Execution sequence for implementing, verifying, and closing the 043 refinement with a mandatory global quality sweep."
SPECKIT_TEMPLATE_SOURCE: "tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "tasks"
  - "sk-code--opencode refinement"
  - "global quality sweep"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: sk-code--opencode refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

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

<!-- ANCHOR:phase-0 -->
## Phase 0: Analysis Complete (Locked Inputs)

- [x] T000 Confirm active Level 3+ spec folder and scope lock (`.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/spec.md`)
- [x] T001 Read and extract implementation constraints from research (`.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/research.md`)
- [x] T002 Read and map scratch findings into execution signals (`.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/scratch*.md`)
- [x] T003 Create Level 3+ execution docs from templates (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `global-quality-sweep.md`)
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Decision Lock and Implementation Setup

- [x] T010 Lock policy tradeoffs in ADRs before code-standard edits (`decision-record.md`)
- [x] T011 Freeze in-scope file list from spec section 3 into working notes (`spec.md`)
- [x] T012 Define verification command bundle and file-level assertions (`plan.md`, `global-quality-sweep.md`)
- [x] T013 Define optional `sk-code--review` trigger criteria (`decision-record.md`, `tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Core Policy Implementation (`sk-code--opencode`)

- [x] T020 Update reduced inline-comment policy and AI semantics contract (`.opencode/skill/sk-code--opencode/SKILL.md`)
- [x] T021 Update shared parse-first comment policy and examples (`.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T022 Reinforce numbered ALL-CAPS section invariants (`.opencode/skill/sk-code--opencode/references/shared/code_organization.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T023 [P] Align JavaScript style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/javascript/style_guide.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T024 [P] Align TypeScript style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/typescript/style_guide.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T025 [P] Align Python style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/python/style_guide.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T026 [P] Align Shell style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/shell/style_guide.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T027 [P] Align Config style guide with JSONC boundaries and comment semantics (`.opencode/skill/sk-code--opencode/references/config/style_guide.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Checklist Hardening and Optional Review Alignment

- [x] T030 Add KISS/DRY and full SOLID checks to universal checklist (`.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T031 [P] Add JS checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T032 [P] Add TS checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T033 [P] Add Python checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T034 [P] Add Shell checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T035 [P] Add Config checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md`) - No net diff required; verified compliant via EVT-001/001b/001c.
- [x] T036 Evaluate optional review alignment trigger via mismatch evidence (`.opencode/skill/sk-code--review/SKILL.md`)
- [x] T037 [Conditional] Apply minimal review router/checklist alignment edits if triggered (`.opencode/skill/sk-code--review/SKILL.md`, `.opencode/skill/sk-code--review/references/quick_reference.md`, `.opencode/skill/sk-code--review/references/code_quality_checklist.md`, `.opencode/skill/sk-code--review/references/solid_checklist.md`) - Triggered and completed with minimal edits to scoped review files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification (All Changed Files)

- [x] T040 Run comment policy and AI semantics assertions (`plan.md` command set item 2)
- [x] T041 Run header invariant assertions across shared and language guides (`plan.md` command set item 3)
- [x] T042 Run checklist KISS/DRY/SOLID assertions (`plan.md` command set item 4)
- [x] T043 Run optional review alignment assertions when review files changed (`plan.md` command set item 5)
- [x] T044 Run spec validation script for this folder (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`) - Result: PASSED WITH WARNINGS (SECTION_COUNTS).
- [x] T045 Update checklist evidence slots with command output references (`checklist.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Mandatory Global Quality Sweep and Closure

- [x] T050 Execute Global Testing Round and record EVT-001 (`global-quality-sweep.md`)
- [x] T051 Execute Global Bug Detection Sweep and record EVT-002 (`global-quality-sweep.md`)
- [x] T052 Execute `sk-code--opencode` Compliance Audit and record EVT-003 (`global-quality-sweep.md`)
- [x] T053 Execute Conditional Standards Update Pathway decision and record EVT-004 (`global-quality-sweep.md`)
- [x] T054 Confirm closure gate thresholds `P0=0` and `P1=0` (`global-quality-sweep.md`)
- [x] T055 Sync spec docs and final task/checklist status (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:execution-reconciliation -->
## Execution Reconciliation Note

Final evidence confirms implementation edits in four files only:
- `.opencode/skill/sk-code--opencode/SKILL.md`
- `.opencode/skill/sk-code--review/SKILL.md`
- `.opencode/skill/sk-code--review/references/code_quality_checklist.md`
- `.opencode/skill/sk-code--review/references/solid_checklist.md`

Tasks tied to shared/language policy guides and checklist assets are closed as verification-only outcomes: no net diff required; verified compliant via EVT-001/001b/001c.
<!-- /ANCHOR:execution-reconciliation -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Mandatory global quality sweep phase completed for all changed files
- [x] Closure gate confirmed with unresolved defects `P0=0`, `P1=0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Global Sweep**: See `global-quality-sweep.md`
<!-- /ANCHOR:cross-refs -->
