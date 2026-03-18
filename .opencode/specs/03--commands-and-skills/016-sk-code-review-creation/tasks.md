---
title: "Tasks: sk-code--review Promotion [014-code-review-skill/tasks]"
description: "Execution checklist for promoting sk-code--review and wiring baseline+overlay review contract across skill, agents, commands, routing, and Level 2 documentation."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "sk-code--review"
  - "baseline overlay"
  - "041"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
# Tasks: sk-code--review Promotion

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## 1. OVERVIEW

Execution checklist for hard-renaming and promoting `sk-code--review` with full baseline+overlay contract wiring.
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
## Phase 1: Rename + skill package

- [x] T001 Hard-rename `.opencode/skill/legacy-single-hyphen-review/` -> `.opencode/skill/sk-code--review/`
- [x] T002 Remove generated artifact `legacy-single-hyphen-review.zip`
- [x] T003 Rebuild `.opencode/skill/sk-code--review/SKILL.md` with standards-parity smart routing and baseline+overlay precedence model
- [x] T004 Update `.opencode/skill/sk-code--review/README.md` and internal package references
- [x] T005 Update `.opencode/skill/sk-code--review/references/quick_reference.md` with baseline+overlay contract guidance

Verification commands:

```bash
ls -la .opencode/skill | rg "sk-code--review|legacy-single-hyphen-review"
rg -n "baseline\+overlay|overlay|precedence|RELATED RESOURCES" .opencode/skill/sk-code--review/SKILL.md
```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Agents + orchestrators

- [x] T006 Update review agent contracts in `.opencode/agent/review.md`, `.opencode/agent/chatgpt/review.md`, `.gemini/agents/review.md`, and `.claude/agents/review.md`
- [x] T007 Update orchestrator review mapping in `.opencode/agent/orchestrate.md`, `.opencode/agent/chatgpt/orchestrate.md`, `.gemini/agents/orchestrate.md`, and `.claude/agents/orchestrate.md`
- [x] T008 Update `.codex/agents/review.toml` to enforce baseline+overlay review contract while using canonical chatgpt review playbook
- [x] T009 Update `.codex/agents/orchestrate.toml` to require baseline+overlay contract whenever `@review` is dispatched

Verification commands:

```bash
rg -n "sk-code--review|baseline\+overlay|overlay" \
  .opencode/agent/review.md \
  .opencode/agent/chatgpt/review.md \
  .opencode/agent/orchestrate.md \
  .opencode/agent/chatgpt/orchestrate.md \
  .gemini/agents/review.md \
  .gemini/agents/orchestrate.md \
  .claude/agents/review.md \
  .claude/agents/orchestrate.md \
  .codex/agents/review.toml \
  .codex/agents/orchestrate.toml
```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Command sweep

- [x] T010 Update `spec_kit_complete_auto.yaml` review dispatch block
- [x] T011 Update `spec_kit_complete_confirm.yaml` review dispatch block
- [x] T012 Update `spec_kit_implement_auto.yaml` review dispatch block
- [x] T013 Update `spec_kit_implement_confirm.yaml` review dispatch block
- [x] T014 Update `spec_kit_debug_auto.yaml` review dispatch block
- [x] T015 Update `spec_kit_debug_confirm.yaml` review dispatch block
- [x] T016 Update `create_agent_auto.yaml` review dispatch block
- [x] T017 Update `create_agent_confirm.yaml` review dispatch block
- [x] T018 Update `create_folder_readme_auto.yaml` review dispatch block
- [x] T019 Update `create_folder_readme_confirm.yaml` review dispatch block
- [x] T020 Update `create_install_guide_auto.yaml` review dispatch block
- [x] T021 Update `create_install_guide_confirm.yaml` review dispatch block
- [x] T022 Update `create_skill_auto.yaml` review dispatch block
- [x] T023 Update `create_skill_confirm.yaml` review dispatch block
- [x] T024 Update `create_skill_asset_auto.yaml` review dispatch block
- [x] T025 Update `create_skill_asset_confirm.yaml` review dispatch block
- [x] T026 Update `create_skill_reference_auto.yaml` review dispatch block
- [x] T027 Update `create_skill_reference_confirm.yaml` review dispatch block

Verification commands:

```bash
rg -n "standards_contract|baseline: \"sk-code--review\"" \
  .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml \
  .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml \
  .opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml \
  .opencode/command/create/assets/create_agent_auto.yaml \
  .opencode/command/create/assets/create_agent_confirm.yaml \
  .opencode/command/create/assets/create_folder_readme_auto.yaml \
  .opencode/command/create/assets/create_folder_readme_confirm.yaml \
  .opencode/command/create/assets/create_install_guide_auto.yaml \
  .opencode/command/create/assets/create_install_guide_confirm.yaml \
  .opencode/command/create/assets/create_skill_auto.yaml \
  .opencode/command/create/assets/create_skill_confirm.yaml \
  .opencode/command/create/assets/create_skill_asset_auto.yaml \
  .opencode/command/create/assets/create_skill_asset_confirm.yaml \
  .opencode/command/create/assets/create_skill_reference_auto.yaml \
  .opencode/command/create/assets/create_skill_reference_confirm.yaml
```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Routing + catalogs

- [x] T028 Update `.opencode/skill/scripts/skill_advisor.py` review intent routing
- [x] T029 Update `.opencode/skill/README.md` for `sk-code--review` and skill counts
- [x] T030 Update `.opencode/README.md` for `sk-code--review` and skill counts

Verification commands:

```bash
python3 .opencode/skill/scripts/skill_advisor.py "review this PR for race conditions and auth bugs" --threshold 0.8
python3 .opencode/skill/scripts/skill_advisor.py "help me rebase and split commits" --threshold 0.8
python3 .opencode/skill/scripts/skill_advisor.py "visual review of architecture diff" --threshold 0.8
```
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Validation + spec closure

- [x] T031 Run `quick_validate.py` for `sk-code--review` (result recorded)
- [x] T032 Run `package_skill.py` for `sk-code--review` (result recorded)
- [x] T033 Run `validate.sh` for spec folder 041
- [x] T034 Update `spec.md`, `plan.md`, `tasks.md`, `checklist.md` to final state
- [x] T035 Create `implementation-summary.md`

Verification commands:

```bash
python3 .opencode/skill/sk-doc/scripts/quick_validate.py .opencode/skill/sk-code--review --json
python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-code--review
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/016-code-review-skill
```
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All scoped files updated according to approved plan.
- [x] Review baseline+overlay contract is consistent across skill/agents/commands.
- [x] Advisor routing behaves as expected for targeted prompts.
- [x] Spec docs synchronized with implementation evidence.
- [x] Validation command outcomes captured (including known validator mismatch on consecutive hyphens).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Closure**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
