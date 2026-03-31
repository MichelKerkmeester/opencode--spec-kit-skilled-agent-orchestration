---
title: "Tasks: sk-deep-research Review Folder Contract [03--commands-and-skills/034-sk-deep-research-review-folders/tasks]"
description: "Task Format: T### [P?] Description (file path or file family)"
trigger_phrases:
  - "review folder tasks"
  - "deep-review task breakdown"
importance_tier: "important"
contextType: "general"
---
# Tasks: sk-deep-research Review Folder Contract

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

**Task Format**: `T### [P?] Description (file path or file family)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build a current-to-target review path matrix from the live review YAML, agent, asset, and doc surfaces (`.opencode/command/spec_kit/`, `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`, `.opencode/skill/sk-deep-research/`)
- [x] T002 Define the canonical `review/` packet layout, including the final report path (`spec.md`, `plan.md`, `decision-record.md`)
- [x] T003 Define the legacy migration whitelist and qualifying review-mode markers (`plan.md`, future implementation notes)
- [x] T004 Confirm out-of-scope boundaries: no research-mode path move and no basename rename (`spec.md`, `decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update review auto workflow paths, messages, and migration hooks (`.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`)
- [x] T006 Update review confirm workflow paths, messages, and migration hooks (`.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`)
- [x] T007 [P] Update the canonical OpenCode deep-review contract (`.opencode/agent/deep-review.md`)
- [x] T008 [P] Update Claude, Codex, and Gemini deep-review runtime variants (`.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.gemini/agents/deep-review.md`)
- [x] T009 [P] Update review-mode assets and templates (`.opencode/skill/sk-deep-research/assets/review_mode_contract.yaml`, `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`, `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Update the command entrypoint and skill-level review guidance (`.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-research/README.md`)
- [x] T011 [P] Update review-reference docs and troubleshooting guidance (`.opencode/skill/sk-deep-research/references/quick_reference.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/references/convergence.md`)
- [x] T012 [P] Update manual testing playbook scenarios affected by the new packet location (`.opencode/skill/sk-deep-research/manual_testing_playbook/07--review-mode/`, shared pause or resume scenarios in `05--pause-resume-and-fault-tolerance/`)
- [x] T013 Add and run path sweeps for stale review-mode `scratch/` references (planned validation commands)
- [x] T015 Apply follow-up deep-research command compatibility fixes for alias-root handling and wrapper metadata (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, `.opencode/command/spec_kit/deep-research.md`, `.agents/commands/spec_kit/deep-research.toml`)
- [x] T016 Sync shared recovery wording so research and review backup behavior are distinguished clearly (`.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/README.md`)
- [x] T017 Run strict packet validation and record any compatibility notes discovered during verification (`specs/03--commands-and-skills/034-sk-deep-research-review-folders`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Review-mode runtime and doc surfaces agree on `review/`
- [ ] Legacy scratch-state handling is implemented and verified
- [x] Validation evidence is captured for the final packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
