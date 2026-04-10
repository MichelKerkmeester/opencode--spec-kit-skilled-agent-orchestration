---
title: "Tasks: MCP Doctor Diagnostic Command"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "mcp doctor tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: MCP Doctor Diagnostic Command

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
## Phase 1: Setup

- [x] T001 [P0] Create `.opencode/scripts/mcp-doctor-lib.sh` — color helpers, log_pass/warn/fail, JSON output builders, project root detection
- [x] T002 [P0] Create `.opencode/scripts/mcp-doctor.sh` — arg parsing (--help, --json, --fix, --server), main dispatch loop, summary + exit code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Implement `diagnose_spec_kit_memory()` — check dist/context-server.js, better-sqlite3 loads, node version marker, database dir
- [x] T004 [P0] Implement `diagnose_cocoindex_code()` — check .venv/bin/ccc exists, --help works, .cocoindex_code/ dir, ccc status
- [x] T005 [P0] Implement `diagnose_code_mode()` — check dist/index.js exists, .utcp_config.json valid JSON
- [x] T006 [P0] Implement `diagnose_sequential_thinking()` — check node >= 18, npx package reachable
- [x] T007 [P0] Implement `detect_and_check_configs()` — scan 5 config files, verify MCP entries per server
- [x] T008 [P1] Implement `--fix` mode — auto-repair for each server (npm install, rebuild, pip install)
- [x] T009 [P1] Implement `--json` output mode — structured JSON report
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P0] Test script runs on current system, verify output accuracy
- [x] T011 [P1] Test `--json` output is valid JSON via `python3 -m json.tool`
- [ ] T012 [P1] Test `--fix` mode repairs work (deferred — requires simulated failure)
- [x] T013 [P1] Test `--server spec_kit_memory` single-server mode
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T001-T007, T010) marked `[x]`
- [x] All P1 tasks complete or deferred with approval (T012 deferred — needs simulated failure)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` — REQ-001 through REQ-010
- **Plan**: See `plan.md` — Architecture and phases
- **Checklist**: See `checklist.md` — CHK-001 through CHK-051
<!-- /ANCHOR:cross-refs -->
