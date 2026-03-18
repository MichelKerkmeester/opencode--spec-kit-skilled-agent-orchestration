---
title: "Tasks: Codex CLI Agent Definitions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "codex agent tasks"
  - "agent conversion tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Codex CLI Agent Definitions

<!-- SPECKIT_LEVEL: 2 -->
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
## Phase 1: Read Sources

- [x] T001 Read all 9 source `.opencode/agent/chatgpt/*.md` files
- [x] T002 Read existing `.codex/config.toml`
- [x] T003 Verify `.codex/agents/` directory exists (empty)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Convert and Create

- [x] T004 Define conversion mapping (agent name → sandbox_mode, reasoning_effort)
- [x] T005 Define text substitution rules:
  - `openai/gpt-5.3-codex` → `the configured model`
  - `.opencode/agent/*.md` → `.codex/agents/*.toml`
  - Individual agent path references
  - `ChatGPT profile` → `Codex CLI`
  - `ChatGPT` runtime references → `Codex CLI`
- [x] T006 [P] Create Python conversion script
- [x] T007 Run script to generate all 9 TOML files:
  - [x] `.codex/agents/context.toml` (read-only, high)
  - [x] `.codex/agents/debug.toml` (workspace-write, xhigh)
  - [x] `.codex/agents/handover.toml` (workspace-write, medium)
  - [x] `.codex/agents/orchestrate.toml` (read-only, high)
  - [x] `.codex/agents/research.toml` (workspace-write, high)
  - [x] `.codex/agents/review.toml` (read-only, xhigh)
  - [x] `.codex/agents/speckit.toml` (workspace-write, medium)
  - [x] `.codex/agents/ultra-think.toml` (read-only, xhigh)
  - [x] `.codex/agents/write.toml` (workspace-write, medium)
- [x] T008 Add `[agents.ultra-think]` section to `.codex/config.toml`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Parse all 9 TOML files with `tomli` (Python TOML parser)
- [x] T010 Verify all config_file references in config.toml resolve to existing files
- [x] T011 Spot-check key content sections preserved per agent
- [x] T012 Verify no stale `openai/gpt-5.3-codex` or `ChatGPT profile` references remain
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] TOML parse verification passed for all 9 files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
