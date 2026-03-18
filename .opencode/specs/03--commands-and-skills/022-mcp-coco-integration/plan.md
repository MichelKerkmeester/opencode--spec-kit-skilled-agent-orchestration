---
title: "Implementation Plan: CocoIndex Code MCP Integration"
description: "Phase 1 plan: install cocoindex-code via pipx, build the code index, and register the MCP server entry in all 6 CLI config files with syntax validation."
trigger_phrases:
  - "cocoindex"
  - "coco-index plan"
  - "semantic code search plan"
  - "cocoindex_code mcp config"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: CocoIndex Code MCP Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (cocoindex-code package), JSON config, TOML config |
| **Framework** | FastMCP (Python MCP server), pipx (isolated Python install) |
| **Storage** | SQLite + sqlite-vec in `.cocoindex_code/` (gitignored) |
| **Testing** | Manual config syntax validation (`python3 json.load`, `python3.11 tomllib.load`) |

### Overview

This plan covers Phase 1 of the CocoIndex integration: install the `cocoindex-code` Python package via pipx with Python 3.11, initialize and build the code index, then add the `cocoindex_code` MCP server entry to all 6 CLI config files. All changes are additive config modifications - no custom code is written. The index is stored locally and gitignored.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (pipx, Python 3.11, cocoindex-code v0.2.3)
- [x] NFRs defined with targets

### Definition of Done

- [x] All acceptance criteria met
- [x] Config syntax validation passes for all 6 files
- [x] Docs updated (spec/plan/tasks/checklist)
- [x] Checklist items verified with evidence

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

MCP Server Registration - follows the existing pattern for `spec_kit_memory` and `code_mode` entries across the OpenCode multi-CLI ecosystem.

### Key Components

- **cocoindex-code binary (`ccc`)**: Python MCP server exposing a single `search` tool over stdio transport
- **Background daemon**: Manages the vector index, persists across queries via Unix domain socket
- **all-MiniLM-L6-v2**: Local embedding model (384 dimensions, ~80 MB), no API key needed
- **SQLite + sqlite-vec**: Index storage in `.cocoindex_code/target_sqlite.db`
- **CLI config files (x6)**: Each CLI has its own config format; entry registered consistently as `cocoindex_code`

### Data Flow

```
CLI Agent Query ("find authentication middleware")
       |
       v (stdio JSON-RPC)
  ccc mcp (FastMCP server)
       |
       v (msgpack over Unix socket)
  Daemon (sqlite-vec KNN search)
       |
       v
  Return: [{file_path, language, content, start_line, end_line, score}]
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Installation

- [x] Install cocoindex-code via `pipx install --python python3.11 cocoindex-code`
- [x] Verify binary available at `~/.local/bin/ccc`
- [x] Run `ccc init` in project root

### Phase 2: Index Build

- [x] Run `ccc index` to build initial code index
- [x] Verify index statistics: 6,792 files, 105,965 chunks, 14 languages
- [x] Confirm `.cocoindex_code/` directory created

### Phase 3: Config Registration

- [x] Add `.cocoindex_code/` to `.gitignore`
- [x] Add `cocoindex_code` entry to `.mcp.json` (disabled by default)
- [x] Add `cocoindex_code` entry to `opencode.json` (relative env, `_NOTE_*` docs)
- [x] Add `cocoindex_code` entry to `.agents/settings.json` (absolute path, `cwd`, `trust: true`)
- [x] Add `cocoindex_code` entry to `.gemini/settings.json` (absolute path, `cwd`, `trust: true`)
- [x] Add `cocoindex_code` entry to `.claude/mcp.json` (relative env, `_NOTE_*` docs)
- [x] Add `cocoindex_code` entry to `.codex/config.toml` (`[mcp_servers.cocoindex_code]` section)

### Phase 4: Verification

- [x] Validate all JSON files: `python3 -c "import json; json.load(open(f))"` for each
- [x] Validate TOML file: `python3.11 -c "import tomllib; tomllib.load(open(f, 'rb'))"`
- [x] Peer review score: 88/100 (PASS), 0 blockers, 0 P1s
- [x] Confirm consistent `cocoindex_code` naming across all 6 configs

### Phase 5: Cross-CLI Auto-Usage Validation (2026-03-18)

- [x] Run 3 test prompts (implicit semantic, explicit mention, SKILL.md trigger) across 4 CLIs
- [x] Claude Code: All 3 prompts used CocoIndex exclusively (1 call each, 10 results)
- [x] Gemini: All 3 prompts used CocoIndex (exclusive in P2/P3, hybrid in P1)
- [x] Copilot: All 3 prompts attempted CocoIndex; P1/P3 MCP returned 0 results or `success:false`
- [x] Codex: All 3 prompts failed (OpenAI billing limit, not a CocoIndex issue)
- [x] Document results in `scratch/cross-cli-auto-usage-test-results.md`

### Phase 6: Follow-Up -- Root Cause Analysis & Documentation (2026-03-18)

- [x] Reproduce Copilot failure root cause: 5 concurrent `refresh_index=true` queries generate +165 daemon errors
- [x] Confirm workaround: `refresh_index=false` generates 0 errors for same queries
- [x] Confirm Copilot's exact failing queries return results with `refresh_index=false`
- [x] Retry Codex (still billing-blocked, deferred)
- [x] Update `scratch/cross-cli-auto-usage-test-results.md` with root cause analysis
- [x] Update `implementation-summary.md` with findings F1-F4 and recommendations R1-R6
- [x] Update `SKILL.md` with query optimization tips and `refresh_index=false` guidance

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax validation | All 5 JSON configs + 1 TOML config | `python3 json.load`, `python3.11 tomllib.load` |
| Index verification | File count, chunk count, language coverage | `ccc index` output statistics |
| Peer review | Naming consistency, config format correctness | Manual review, 88/100 score |
| Manual | End-to-end: install, init, index, search | CLI (`ccc search "test query"`) |
| Cross-CLI | Auto-discovery across 4 CLIs (3 prompts each) | Claude Code, Codex, Gemini, Copilot |
| Reproduction | Daemon concurrency bug under concurrent queries | `mcp__cocoindex_code__search` with `refresh_index` true/false |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pipx | External tool | Green - already installed | Cannot install cocoindex-code in isolation |
| Python 3.11 | Runtime | Green - Homebrew python3.11 available | `pipx install --python python3.11` fails; sqlite-vec extension blocked on system Python |
| cocoindex-code v0.2.3 | PyPI package | Green - installed | MCP server unavailable |
| cocoindex==1.0.0a33 | Transitive dep | Green - alpha, pin version | Core Rust indexing engine unavailable |
| sqlite-vec | Transitive dep | Green | Vector search unavailable |
| all-MiniLM-L6-v2 | Model (auto-downloaded) | Green | Embedding generation unavailable |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: MCP server causes CLI startup failures, or config changes break existing MCP servers
- **Procedure**: All changes are additive. Remove `cocoindex_code` entries from all 6 configs, remove `.cocoindex_code/` from `.gitignore`, run `rm -rf .cocoindex_code/`, run `pipx uninstall cocoindex-code`

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Install) ──────┐
                         ├──> Phase 3 (Config) ──> Phase 4 (Verify)
Phase 2 (Index) ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Installation | None | Index build, Config |
| Index build | Installation | Config (needs `.cocoindex_code/` to exist) |
| Config registration | Installation | Verification |
| Verification | Config, Index | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Installation (pipx, init) | Low | 10-15 minutes |
| Index build | Low | 5-10 minutes (CPU-bound) |
| Config registration (6 files) | Medium | 30-45 minutes |
| Syntax validation + peer review | Low | 15-20 minutes |
| **Total** | | **60-90 minutes** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Backup created - all config files tracked in git; `git checkout` restores any file
- [x] Feature flag configured - `.mcp.json` has `disabled: true` to prevent accidental startup
- [x] No monitoring alerts needed - local dev tool, not a production service

### Rollback Procedure

1. Remove `cocoindex_code` block from `.mcp.json`, `opencode.json`, `.agents/settings.json`, `.gemini/settings.json`, `.claude/mcp.json`
2. Remove `[mcp_servers.cocoindex_code]` section from `.codex/config.toml`
3. Remove `.cocoindex_code/` line from `.gitignore`
4. Run `rm -rf .cocoindex_code/` to delete local index
5. Run `pipx uninstall cocoindex-code` to remove binary
6. Verify: re-open each CLI to confirm no startup errors

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A - index directory is gitignored and local only; `rm -rf .cocoindex_code/` removes all state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Phase 1-4 complete 2026-03-18 (config installation)
- Phase 5-6 complete 2026-03-18 (cross-CLI validation + root cause analysis)
-->
