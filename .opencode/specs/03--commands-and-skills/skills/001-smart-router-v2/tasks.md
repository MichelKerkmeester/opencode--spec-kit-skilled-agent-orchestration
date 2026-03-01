---
title: "Tasks: Smart Router V2 Rollout [001-smart-router-v2/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "smart"
  - "router"
  - "rollout"
  - "034"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Smart Router V2 Rollout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
## Phase 1: Setup

- [x] T001 Confirm Smart Router V2 scope and 10-target inventory (`spec.md`)
- [x] T002 Create Level 3 plan for phased rollout (`plan.md`)
- [x] T003 [P] Create verification checklist with P0/P1/P2 gates (`checklist.md`)
- [x] T004 Record architecture decisions and alternatives (`decision-record.md`)
- [x] T005 Create implementation-summary scaffold for pending execution (`implementation-summary.md`)
- [ ] T006 Capture baseline routing scenarios for pre/post comparison (`scratch/smart-router-v2-baseline.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Update `.opencode/skill/mcp-code-mode/SKILL.md` with Smart Routing pseudocode-first layout + weighted routing + banned phrase cleanup
- [x] T008 Update `.opencode/skill/mcp-figma/SKILL.md` with Smart Routing pseudocode-first layout + weighted routing + banned phrase cleanup
- [x] T009 Update `.opencode/skill/mcp-chrome-devtools/SKILL.md` with Smart Routing pseudocode-first layout + weighted priorities + banned phrase cleanup
- [x] T010 Update `.opencode/skill/sk-code--full-stack/SKILL.md` with stack-aware weighted routing + scoped guard + recursive discovery
- [x] T011 Update `.opencode/skill/sk-code--opencode/SKILL.md` with language-aware weighted routing + scoped guard + recursive discovery
- [x] T012 Update `.opencode/skill/workflows-code--web-dev/SKILL.md` with stack-aware weighted routing + scoped guard + recursive discovery
- [x] T013 [P] Update `.opencode/skill/sk-doc/SKILL.md` with recursive discovery + weighted intent mapping + ambiguity handling
- [x] T014 [P] Update `.opencode/skill/sk-git/SKILL.md` with weighted intent mapping + scoped guard + ambiguity handling
- [x] T015 Update `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/sk-git/SKILL.md` with Barter-aligned weighted routing + pseudocode-first Smart Routing
- [x] T016 Update `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-code/SKILL.md` with Barter-aligned weighted + stack routing + pseudocode-first Smart Routing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Validate weighted score consistency (0.1-1.0 bands), banned phrase removal, and heading ordering via Smart Router suite report (`scratch/smart-router-tests/reports/latest-report.json`)
- [ ] T018 Validate fallback behavior for low-confidence prompts in all updated skills
- [x] T019 [P] Validate recursive discovery handling for nested references/assets and fixture traversal (`scratch/smart-router-tests/fixtures/`)
- [ ] T020 [P] Validate stack/language marker handling for code workflow skills
- [x] T021 Run spec validation and close all P0 checklist gates (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/skills/001-smart-router-v2` -> PASSED)
- [x] T022 Finalize implementation summary with execution evidence
- [x] T023 Final cleanup verification complete: removed `### Routing Reference Tables` from SKILL.md corpus, kept Smart Routing pseudocode-first ordering, and confirmed zero heading occurrences across Public + Barter roots
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks T007-T016 marked `[x]`
- [ ] All verification tasks T017-T022 marked `[x]` (T018 and T020 remain open)
- [ ] No `[B]` blocked tasks remain
- [ ] Checklist P0 items complete with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
