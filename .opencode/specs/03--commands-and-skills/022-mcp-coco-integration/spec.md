---
title: "Feature Specification: CocoIndex Code MCP Integration"
description: "OpenCode had no semantic code search. This spec covers Phase 1 installation of CocoIndex Code and registration of its MCP server entry across all 6 CLI config files."
trigger_phrases:
  - "cocoindex"
  - "semantic code search"
  - "coco-index integration"
  - "code search mcp"
  - "cocoindex_code"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: CocoIndex Code MCP Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (Phase 1 + Cross-CLI Validation) |
| **Created** | 2026-03-18 |
| **Branch** | `main` (additive config changes, no separate branch) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

OpenCode had no semantic code search capability. All code exploration relied on Grep (exact/regex text patterns), Glob (file path patterns), and Read (full file retrieval). The @context agent had to re-discover code structure every session with no persistent index and no way to query code by intent or concept. Searching for "find authentication middleware" with Grep required knowing the exact identifiers; with no semantic layer, fuzzy or conceptual queries returned zero results.

### Purpose

Install CocoIndex Code (a Python MCP server providing vector-based semantic code search) and register it as the 4th MCP server in all 6 CLI config files, giving every AI assistant the ability to query the codebase by natural language intent without knowing exact function or variable names.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Install `cocoindex-code` v0.2.3 via `pipx install --python python3.11 cocoindex-code`
- Initialize and build the code index (`ccc init && ccc index`)
- Add `cocoindex_code` MCP server entry to all 6 CLI config files: `.gitignore`, `.mcp.json`, `opencode.json`, `.agents/settings.json`, `.gemini/settings.json`, `.claude/mcp.json`, `.codex/config.toml`
- Validate syntax of all modified config files (JSON + TOML)
- Add `.cocoindex_code/` to `.gitignore`

### Out of Scope

- @context agent Layer 2b semantic search integration - **deprioritized** (cross-CLI test proved auto-discovery works without agent routing)
- @research agent semantic query integration - planned Phase 3
- Spec Kit Memory enrichment synergy - planned Phase 4
- Auto-watch/daemon for incremental re-indexing - Phase 2+
- Upstream CocoIndex daemon concurrency bug fix - reported, awaiting upstream

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modified | Added `.cocoindex_code/` entry |
| `.mcp.json` | Modified | Added `cocoindex_code` server entry with `disabled: true` |
| `opencode.json` | Modified | Added `cocoindex_code` server entry with `_NOTE_*` docs, relative env |
| `.agents/settings.json` | Modified | Added `cocoindex_code` server entry with absolute paths, `cwd`, `trust: true` |
| `.gemini/settings.json` | Modified | Added `cocoindex_code` server entry with absolute paths, `cwd`, `trust: true` |
| `.claude/mcp.json` | Modified | Added `cocoindex_code` server entry with relative env, `_NOTE_*` docs |
| `.codex/config.toml` | Modified | Added `[mcp_servers.cocoindex_code]` section |
| `.opencode/skill/mcp-cocoindex-code/SKILL.md` | Modified | Added query optimization tips and `refresh_index=false` concurrent session guidance |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `cocoindex-code` installed and available on PATH | `~/.local/bin/ccc --version` returns v0.2.3 |
| REQ-002 | Code index builds successfully | `ccc index` completes, 6,792 files indexed into 105,965 chunks |
| REQ-003 | All 6 CLI configs contain valid `cocoindex_code` MCP server entry | Naming is consistent snake_case `cocoindex_code` across all configs |
| REQ-004 | `.cocoindex_code/` is gitignored | `grep .cocoindex_code .gitignore` returns a match |
| REQ-005 | All JSON and TOML config files parse cleanly | `python3 json.load` and `python3.11 tomllib.load` exit 0 for all files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `.mcp.json` entry is disabled by default | `"disabled": true` present to prevent accidental auto-start |
| REQ-007 | `COCOINDEX_CODE_ROOT_PATH` env var set appropriately per config format | Absolute path in CLI configs, relative `"."` in opencode.json |
| REQ-008 | No secrets or API keys in any config file | Manual review of all 6 config files confirms no credentials |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 CLI configs contain valid `cocoindex_code` MCP server entry with consistent naming
- **SC-002**: `.cocoindex_code/` is gitignored and index directory not tracked
- **SC-003**: Index builds successfully (6,792 files, 105,965 chunks across 14 languages)
- **SC-004**: JSON/TOML syntax validation passes for all modified config files

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `pipx` + Python 3.11 | Install fails without Python 3.11 | `pipx install --python python3.11` isolates venv; documented in `_NOTE_1` |
| Risk | PATH collision - existing `/opt/homebrew/bin/ccc` (unrelated Node package) | MCP server launches wrong binary | Use full absolute path `~/.local/bin/ccc` in configs |
| Risk | Index size 250-600 MB | Disk usage | Gitignored, stays local; acceptable for development tool |
| Risk | Cold start 20-30 seconds | First query after daemon restart is slow | Persistent daemon stays warm across queries; acceptable for Phase 1 |
| Risk | Alpha dependency `cocoindex==1.0.0a33` | API changes on upgrade | Pin version; test before upgrading |
| Risk | No hybrid search (vector-only) | Exact keyword matches may be missed | Use Grep for exact patterns; CocoIndex for conceptual queries |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Index build completes in under 15 minutes for ~7,000 files on Apple Silicon
- **NFR-P02**: Warm daemon search latency under 500ms per query
- **NFR-P03**: Incremental re-index for small changes under 5 seconds

### Security

- **NFR-S01**: No API keys required - all-MiniLM-L6-v2 embedding model runs locally
- **NFR-S02**: No secrets in any config file - `COCOINDEX_CODE_ROOT_PATH` is a path, not a credential
- **NFR-S03**: Index directory gitignored - full code chunks in SQLite not committed to repo
- **NFR-S04**: Daemon uses Unix domain socket only - no TCP/HTTP listener, no network exposure

### Reliability

- **NFR-R01**: Disabled by default in `.mcp.json` - prevents startup failures for users who have not installed `cocoindex-code`
- **NFR-R02**: All config changes are additive - existing MCP servers unaffected

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- **Empty index**: `ccc search` returns 0 results if `ccc index` not run first; fall back to Grep
- **Large codebase**: Index scales with source file bytes, not file count; 6,792 files produced ~105,965 chunks in Phase 1
- **Excluded files**: `.gitignore` patterns respected by CocoIndex; node_modules, dist, build excluded

### Error Scenarios

- **`ccc` not on PATH**: MCP server fails to start; fix with `pipx ensurepath` or use full path `/Users/michelkerkmeester/.local/bin/ccc`
- **Stale daemon socket**: `rm ~/.cocoindex_code/daemon.sock` clears stale state; daemon restarts cleanly
- **JSON parse error in config**: Any syntax error prevents CLI from loading its MCP servers; validated with `python3 json.load` before claiming complete
- **SQLite extension error**: System Python (3.9.6) blocks sqlite-vec extension; fix with Homebrew Python 3.11

### State Transitions

- **Index staleness**: `refresh_index=true` (default) re-scans changed files on each query; adds ~1s latency
- **Daemon not running**: First query triggers cold start (20-30s); subsequent queries are fast

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 7 config files modified, no new code written, no database migrations |
| Risk | 14/25 | PATH collision risk, alpha dependency, Python version requirement |
| Research | 16/20 | Multi-agent research (6 investigators), competitive analysis, phased roadmap |
| **Total** | **42/70** | **Level 2 - verification-focused** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should Phase 2 (@context agent Layer 2b) be a sub-spec of 023 or a new spec? **RESOLVED: Deprioritized -- cross-CLI test proved auto-discovery works without agent routing changes**
- Should `disabled: true` in `.mcp.json` be reversed once user has installed `cocoindex-code`? **RESOLVED: User-driven; document in research.md**
- Is the Copilot MCP failure a Copilot issue or a CocoIndex issue? **RESOLVED: CocoIndex daemon concurrency bug -- `refresh_index=true` under concurrent requests crashes `ComponentContext`**

**Related Documents**:
- Research: `research.md` (v1.1, 17 sections, 6-agent investigation)
- Implementation Plan: `plan.md`
- Task Breakdown: `tasks.md`
- Verification Checklist: `checklist.md`
- Cross-CLI Test Results: `scratch/cross-cli-auto-usage-test-results.md`

<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFRs, edge cases, complexity assessment)
- Implementation complete 2026-03-18
- All success criteria verified
-->
