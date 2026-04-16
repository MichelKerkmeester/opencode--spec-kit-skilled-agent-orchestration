---
title: "Tasks: Root-Level Review/Research Folder Convention"
status: planned
---

# Tasks

<!-- SPECKIT_LEVEL: 2 -->

---

## Phase 1: Shared Path Resolver

- [ ] T001 Create `review-research-paths.cjs` in `.opencode/skill/system-spec-kit/shared/`
- [ ] T002 Implement `resolveArtifactRoot(specFolder, mode)` with parent-walk logic
- [ ] T003 Add fallback for standalone specs (no parent spec.md above)
- [ ] T004 Add boundary check: stop walking at `specs/` directory level
- [ ] T005 Add unit tests for standalone, child, grandchild, and deep-nested paths

## Phase 2: Consumer Updates

### 2a. Reducers
- [ ] T010 Update `sk-deep-review/scripts/reduce-state.cjs:1140` to use shared resolver
- [ ] T011 Update `sk-deep-research/scripts/reduce-state.cjs:822` to use shared resolver

### 2b. Command YAMLs
- [ ] T020 Update `spec_kit_deep-review_auto.yaml` state_paths + mkdir + reducer invocation
- [ ] T021 Update `spec_kit_deep-review_confirm.yaml` same changes
- [ ] T022 Update `spec_kit_deep-research_auto.yaml` state_paths + mkdir + reducer invocation
- [ ] T023 Update `spec_kit_deep-research_confirm.yaml` same changes

### 2c. Agent Definitions (4 runtimes x 2 skills = 8 files)
- [ ] T030 Update `.opencode/agent/deep-review.md` dispatch paths + output instructions
- [ ] T031 Update `.opencode/agent/deep-research.md` dispatch paths + output instructions
- [ ] T032 Update `.claude/agents/deep-review.md` (mirror)
- [ ] T033 Update `.claude/agents/deep-research.md` (mirror)
- [ ] T034 Update `.gemini/agents/deep-review.md` (mirror)
- [ ] T035 Update `.gemini/agents/deep-research.md` (mirror)
- [ ] T036 Update `.codex/agents/deep-review.toml` (mirror)
- [ ] T037 Update `.codex/agents/deep-research.toml` (mirror)

## Phase 3: Documentation

- [ ] T040 Update `sk-deep-review/SKILL.md` State Packet Location section
- [ ] T041 Update `sk-deep-research/SKILL.md` State Packet Location section
- [ ] T042 Update `sk-deep-review/README.md` folder structure
- [ ] T043 Update `sk-deep-research/README.md` folder structure
- [ ] T044 Update `sk-doc/assets/documentation/readme_template.md` with convention note

## Verification

- [ ] T050 Verify resolver returns correct paths for all test cases
- [ ] T051 Verify `grep -r '{spec_folder}/review/' .opencode/command/` returns 0
- [ ] T052 Verify all 8 agent files are consistent
- [ ] T053 Run `npx tsc --noEmit`
