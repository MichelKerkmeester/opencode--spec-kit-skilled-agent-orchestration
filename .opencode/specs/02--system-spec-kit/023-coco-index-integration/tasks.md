---
title: "Tasks: CocoIndex Code MCP Integration"
description: "Phase 1 task breakdown: install, index build, config registration across 6 CLI files, and syntax validation."
trigger_phrases:
  - "cocoindex tasks"
  - "coco-index tasks"
  - "cocoindex_code tasks"
  - "semantic search tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: CocoIndex Code MCP Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Install cocoindex-code v0.2.3 via `pipx install --python python3.11 cocoindex-code` (`~/.local/bin/ccc`) [10m]
- [x] T002 Verify `ccc --version` returns v0.2.3 and binary is at `~/.local/bin/ccc` [2m]
- [x] T003 Run `ccc init` in project root to initialize `.cocoindex_code/` directory [3m]
- [x] T004 Add `.cocoindex_code/` entry to `.gitignore` [2m]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Index Build

- [x] T005 Run `ccc index` to build initial code index [8m]
- [x] T006 Verify index statistics: 6,792 files indexed, 105,965 chunks, 14 languages [2m]
- [x] T007 Run `ccc search "MCP server initialization"` to confirm search returns results [2m]

### CLI Config Registration

- [x] T008 Add `cocoindex_code` entry to `.mcp.json` - absolute path, `disabled: true` (`.mcp.json`) [5m]
- [x] T009 Add `cocoindex_code` entry to `opencode.json` - `type: "local"`, command array, `_NOTE_*` env docs, relative `COCOINDEX_CODE_ROOT_PATH: "."` (`opencode.json`) [8m]
- [x] T010 Add `cocoindex_code` entry to `.agents/settings.json` - absolute path, `cwd`, `trust: true` (`.agents/settings.json`) [5m]
- [x] T011 [P] Add `cocoindex_code` entry to `.gemini/settings.json` - absolute path, `cwd`, `trust: true` (`.gemini/settings.json`) [5m]
- [x] T012 [P] Add `cocoindex_code` entry to `.claude/mcp.json` - relative env, `_NOTE_*` docs (`.claude/mcp.json`) [5m]
- [x] T013 Add `[mcp_servers.cocoindex_code]` section to `.codex/config.toml` (`.codex/config.toml`) [5m]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Syntax Validation

- [x] T014 Validate `.mcp.json` parses cleanly (`python3 -c "import json; json.load(open('.mcp.json'))"`) [2m]
- [x] T015 [P] Validate `opencode.json` parses cleanly (python3 json.load) [2m]
- [x] T016 [P] Validate `.agents/settings.json` parses cleanly (python3 json.load) [2m]
- [x] T017 [P] Validate `.gemini/settings.json` parses cleanly (python3 json.load) [2m]
- [x] T018 [P] Validate `.claude/mcp.json` parses cleanly (python3 json.load) [2m]
- [x] T019 Validate `.codex/config.toml` parses cleanly (`python3.11 -c "import tomllib; tomllib.load(open('.codex/config.toml', 'rb'))"`) [2m]

### Consistency and Security Check

- [x] T020 Confirm `cocoindex_code` (snake_case) naming is consistent across all 6 configs [3m]
- [x] T021 Confirm `.cocoindex_code/` appears in `.gitignore` [1m]
- [x] T022 Confirm no secrets or API keys in any config file [2m]

### Documentation

- [x] T023 Write `spec.md` with requirements, scope, NFRs, edge cases [15m]
- [x] T024 Write `plan.md` with technical approach, phases, rollback [10m]
- [x] T025 Write `tasks.md` with full task breakdown [10m]
- [x] T026 Write `checklist.md` with evidence for all P0/P1 items [10m]
- [x] T027 Write `implementation-summary.md` with what was built and key decisions [10m]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 6 config files pass syntax validation
- [x] Naming consistent (`cocoindex_code`) across all configs
- [x] Index built successfully (6,792 files, 105,965 chunks)
- [x] Checklist.md fully verified with evidence

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `research.md` (v1.1, 6-agent investigation)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
- Implementation complete 2026-03-18
-->
