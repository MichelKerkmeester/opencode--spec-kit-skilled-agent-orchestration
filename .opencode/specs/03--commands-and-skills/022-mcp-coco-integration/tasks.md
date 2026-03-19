---
title: "Tasks: CocoIndex Code MCP Integration"
description: "Phase-based task breakdown for CocoIndex installation, config registration, cross-CLI validation, Phase 2 hardening, and Phase 3 strict-readiness packaging."
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

- [x] T001 Install cocoindex-code v0.2.3 via `bash .opencode/skill/mcp-coco-index/scripts/install.sh` (`.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`) [10m]
- [x] T002 Verify the installed package version prints `0.2.3` via `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/python -c "import importlib.metadata as m; print(m.version('cocoindex-code'))"` and confirm the binary exists at `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` [2m]
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

- [x] T008 Add `cocoindex_code` entry to `.mcp.json` - repo-relative path, `disabled: true` (`.mcp.json`) [5m]
- [x] T009 Add `cocoindex_code` entry to `opencode.json` - `type: "local"`, command array, `_NOTE_*` env docs, relative `COCOINDEX_CODE_ROOT_PATH: "."` (`opencode.json`) [8m]
- [x] T010 Add `cocoindex_code` entry to `.agents/settings.json` - repo-relative path, `cwd`, `trust: true` (`.agents/settings.json`) [5m]
- [x] T011 [P] Add `cocoindex_code` entry to `.gemini/settings.json` - repo-relative path, `cwd`, `trust: true` (`.gemini/settings.json`) [5m]
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

<!-- ANCHOR:phase-4 -->
## Phase 4: Cross-CLI Auto-Usage Validation

### Test Execution

- [x] T028 Design 3 test prompts: implicit semantic, explicit CocoIndex mention, and skill-trigger guidance [5m]
- [x] T029 Run all 3 prompts on Claude Code (Claude Opus 4.6) and capture results [10m]
- [x] T030 Run all 3 prompts on Codex (gpt-5.3-codex) -- all failed due to OpenAI billing limit [10m]
- [x] T031 Run all 3 prompts on Gemini (gemini-3.1-pro-preview) and capture results [10m]
- [x] T032 Run all 3 prompts on Copilot (GPT-5.4) and capture results [15m]
- [x] T033 Document results in `scratch/cross-cli-auto-usage-test-results.md` [15m]

### Root Cause Analysis (Follow-Up)

- [x] T034 Reproduce Copilot MCP failure: 5 concurrent queries with `refresh_index=true` (+165 daemon errors) [5m]
- [x] T035 Confirm workaround: 5 concurrent queries with `refresh_index=false` (0 daemon errors) [5m]
- [x] T036 Verify Copilot's exact failing queries return results with `refresh_index=false` [5m]
- [x] T037 Retry Codex billing check -- still blocked, documented as deferred [5m]
- [x] T038 Update `scratch/cross-cli-auto-usage-test-results.md` with root cause analysis section [10m]

### Documentation Updates

- [x] T039 Add findings F1-F4 and recommendations R1-R6 to `implementation-summary.md` [15m]
- [x] T040 Add query optimization tips to `../../../skill/mcp-coco-index/SKILL.md` (short queries > keyword stuffing) [5m]
- [x] T041 Add `refresh_index=false` concurrent session guidance to `../../../skill/mcp-coco-index/SKILL.md` [5m]
- [x] T042 Update `spec.md` with cross-CLI test scope, deprioritized Phase 2, resolved questions [5m]
- [x] T043 Update `plan.md` with Phase 5-6 and testing strategy additions [5m]
- [x] T044 Update `tasks.md` with Phase 4 tasks (this file) [5m]
- [x] T045 Update `checklist.md` with cross-CLI validation items [5m]
- [x] T046 Save context to memory via `generate-context.js` (JSON payload mode) [5m]

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Hardening

### Runtime-Truth Documentation

- [x] T047 Update `../../../skill/mcp-coco-index/SKILL.md` to reflect the current runtime contract and new helper scripts [10m]
- [x] T048 Update `../../../skill/mcp-coco-index/README.md`, `../../../skill/mcp-coco-index/INSTALL_GUIDE.md`, and `../../../skill/mcp-coco-index/references/tool_reference.md` to match actual CLI/MCP behavior [15m]
- [x] T049 Update `../../../skill/mcp-coco-index/references/search_patterns.md` and add `../../../skill/mcp-coco-index/references/cross_cli_playbook.md` for repeated-query and cross-CLI guidance [10m]
- [x] T050 Replace environment-specific `../../../skill/mcp-coco-index/assets/config_templates.md` examples with repo-portable templates [10m]

### Agent-Facing Automation

- [x] T051 Add shared shell helpers in `scripts/common.sh` [10m]
- [x] T052 Add `scripts/doctor.sh` with text and JSON health output [15m]
- [x] T053 Add `scripts/ensure_ready.sh` with idempotent setup and indexing behavior [15m]
- [x] T054 Update `scripts/install.sh` and `scripts/update.sh` to use shared helpers and root overrides [10m]

### Advisor Utilization

- [x] T055 Update `.opencode/skill/scripts/skill_advisor.py` to prefer the repo-local `ccc` binary [10m]
- [x] T056 Add semantic exploration auto-routing without overriding exact-text prompts [10m]

### Verification

- [x] T057 Run `bash -n` on all touched CocoIndex shell scripts [5m]
- [x] T058 Run `doctor.sh` and `doctor.sh --json` in the repo root [5m]
- [x] T059 Run `ensure_ready.sh --json` in the repo root and a temp project [10m]
- [x] T060 Run advisor health and semantic/exact-match routing checks [5m]
- [x] T061 Verify touched docs no longer claim nonexistent CLI/MCP behavior [5m]

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Strict Readiness & Adoption Packaging

### Shared Readiness Engine

- [x] T062 Extend `scripts/common.sh` with centralized readiness state, status calculation, and issue codes `20` through `25` [15m]
- [x] T063 Extend `scripts/doctor.sh` with `--strict`, `--require-config`, `--require-daemon`, and repeatable `--expect-config` [15m]
- [x] T064 Extend `scripts/ensure_ready.sh` with strict post-bootstrap validation and expected-config support [15m]

### Downstream Adoption Guidance

- [x] T065 Add `../../../skill/mcp-coco-index/references/downstream_adoption_checklist.md` for sibling-repo payload/config/gitignore rollout [10m]
- [x] T066 Update `../../../skill/mcp-coco-index/SKILL.md`, `../../../skill/mcp-coco-index/README.md`, and `../../../skill/mcp-coco-index/references/cross_cli_playbook.md` to route operators to strict modes and the adoption checklist [10m]

### Verification And Spec Sync

- [x] T067 Run `bash -n` on `common.sh`, `doctor.sh`, and `ensure_ready.sh` after the strict-readiness changes [5m]
- [x] T068 Verify shared-repo strict readiness with `doctor.sh --json --strict --require-config --expect-config opencode.json` and `ensure_ready.sh --json --strict --require-config --expect-config opencode.json` [10m]
- [x] T069 Verify temp-project strict config validation fails with exit `24` after bootstrap using `ensure_ready.sh --json --strict --require-config --root <tmpdir>` [10m]
- [x] T070 Update the spec-folder docs to reflect the Phase 3 strict-readiness and adoption-packaging work [10m]

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001-T070)
- [x] No `[B]` blocked tasks remaining
- [x] All 6 config files pass syntax validation
- [x] Naming consistent (`cocoindex_code`) across all configs
- [x] Index built successfully and strict readiness reports non-zero file/chunk counts
- [x] Checklist.md fully verified with evidence
- [x] Cross-CLI auto-usage validated (3/4 CLIs confirmed, 1 billing-blocked)
- [x] Copilot MCP failure root cause identified and documented
- [x] `../../../skill/mcp-coco-index/SKILL.md` updated with query optimization and `refresh_index` guidance
- [x] Helper scripts and advisor hardening validated for Phase 2
- [x] Strict readiness issue codes, exit behavior, and downstream adoption packaging validated for Phase 3

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
- Phase 1-3 (config installation) complete 2026-03-18
- Phase 4 (cross-CLI validation + root cause + docs) complete 2026-03-18
- 70 total tasks (T001-T070)
-->
