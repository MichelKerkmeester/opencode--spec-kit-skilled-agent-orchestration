---
title: "Tasks: Spec 016 — Handover Haiku + Codex Agent Conversion [016-handover-model-codex-compat/tasks]"
description: "tasks document for 016-handover-model-codex-compat."
trigger_phrases:
  - "tasks"
  - "spec"
  - "016"
  - "handover"
  - "haiku"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Spec 016 — Handover Haiku + Codex Agent Conversion

<!-- ANCHOR:phase-1 -->
## Phase 1: Handover Model Change

| ID | Task | File | Status |
|----|------|------|--------|
| T001 | Change model to `github-copilot/claude-haiku-4.5` | `.opencode/agent/handover.md` | [x] Complete |
| T002 | Change model to `haiku` | `.claude/agents/handover.md` | [x] Complete |

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Codex config.toml

| ID | Task | File | Status |
|----|------|------|--------|
| T003 | Add 4 profiles (fast/balanced/powerful/readonly) with gpt-5.3 family | `.codex/config.toml` | [x] Complete |
| T004 | Add codex-specialized-subagents MCP server | `.codex/config.toml` | [x] Complete |
| T003a | Set fast profile to gpt-5.3-codex-spark | `.codex/config.toml` | [x] Complete |
| T003b | Set reasoning effort: fast/balanced=high, powerful/readonly=extra_high | `.codex/config.toml` | [x] Complete |

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Codex Agent Frontmatter Conversion

| ID | Agent | Profile | Sandbox | Status |
|----|-------|---------|---------|--------|
| T005 | context | `fast` | read-only | [x] Complete |
| T006 | handover | `fast` | workspace-write | [x] Complete |
| T007 | speckit | `balanced` | workspace-write | [x] Complete |
| T008 | write | `balanced` | workspace-write | [x] Complete |
| T009 | debug | `powerful` | workspace-write | [x] Complete |
| T010 | research | `powerful` | workspace-write | [x] Complete |
| T011 | review | `readonly` | read-only | [x] Complete |
| T012 | orchestrate | `powerful` | workspace-write | [x] Complete |

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Spec Folder

| ID | Task | File | Status |
|----|------|------|--------|
| T013 | Create spec.md | `016-handover-model-codex-compat/spec.md` | [x] Complete |
| T014 | Create plan.md | `016-handover-model-codex-compat/plan.md` | [x] Complete |
| T015 | Create tasks.md | `016-handover-model-codex-compat/tasks.md` | [x] Complete |
| T016 | Create checklist.md | `016-handover-model-codex-compat/checklist.md` | [x] Complete |
| T017 | Create decision-record.md | `016-handover-model-codex-compat/decision-record.md` | [x] Complete |
| T018 | Create implementation-summary.md | `016-handover-model-codex-compat/implementation-summary.md` | [x] Complete |

<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

| ID | Check | Status |
|----|-------|--------|
| T019 | Handover uses haiku in .opencode/agent/ and .claude/agents/ | [x] Complete |
| T020 | All 8 .codex/agents/ files use profile: frontmatter | [x] Complete |
| T021 | config.toml has 4 profiles (all gpt-5.3) + sub-agents MCP | [x] Complete |
| T022 | Spec folder has all 6 Level 3 files | [x] Complete |

<!-- /ANCHOR:phase-5 -->
