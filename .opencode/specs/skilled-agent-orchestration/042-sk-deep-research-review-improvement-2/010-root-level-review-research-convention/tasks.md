---
title: "Tasks: Root-Level Review/Research Folder Convention"
status: complete
---

# Tasks

<!-- SPECKIT_LEVEL: 2 -->

---

## Phase 1: Shared Path Resolver

- [x] T001 Create `review-research-paths.cjs` in `.opencode/skill/system-spec-kit/shared/`
- [x] T002 Implement `resolveArtifactRoot(specFolder, mode)` with parent-walk logic
- [x] T003 Add fallback for standalone specs (no parent spec.md above)
- [x] T004 Add boundary check: stop walking at `specs/` directory level
- [x] T005 Add unit tests for standalone, child, grandchild, and deep-nested paths

## Phase 2: Consumer Updates

### 2a. Reducers
- [x] T010 Update `sk-deep-review/scripts/reduce-state.cjs:1140` to use shared resolver
- [x] T011 Update `sk-deep-research/scripts/reduce-state.cjs:822` to use shared resolver

### 2b. Command YAMLs
- [x] T020 Update `spec_kit_deep-review_auto.yaml` state_paths + mkdir + reducer invocation
- [x] T021 Update `spec_kit_deep-review_confirm.yaml` same changes
- [x] T022 Update `spec_kit_deep-research_auto.yaml` state_paths + mkdir + reducer invocation
- [x] T023 Update `spec_kit_deep-research_confirm.yaml` same changes

### 2c. Agent Definitions (4 runtimes x 2 skills = 8 files)
- [x] T030 Update `.opencode/agent/deep-review.md` dispatch paths + output instructions
- [x] T031 Update `.opencode/agent/deep-research.md` dispatch paths + output instructions
- [x] T032 Update `.claude/agents/deep-review.md` (mirror)
- [x] T033 Update `.claude/agents/deep-research.md` (mirror)
- [x] T034 Update `.gemini/agents/deep-review.md` (mirror)
- [x] T035 Update `.gemini/agents/deep-research.md` (mirror)
- [x] T036 Update `.codex/agents/deep-review.toml` (mirror)
- [x] T037 Update `.codex/agents/deep-research.toml` (mirror)

## Phase 3: Documentation

- [x] T040 Update `sk-deep-review/SKILL.md` State Packet Location section
- [x] T041 Update `sk-deep-research/SKILL.md` State Packet Location section
- [x] T042 Update `sk-deep-review/README.md` folder structure
- [x] T043 Update `sk-deep-research/README.md` folder structure
- [x] T044 Update `sk-doc/assets/documentation/readme_template.md` with convention note

## Verification

- [x] T050 Verify resolver returns correct paths for all test cases
- [x] T051 Verify `grep -r '{spec_folder}/review/' .opencode/command/` returns 0
- [x] T052 Verify all 8 agent files are consistent
- [x] T053 Run `npx tsc --noEmit`
