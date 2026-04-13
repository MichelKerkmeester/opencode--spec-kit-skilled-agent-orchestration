---
title: "Implementation Plan: CocoIndex Code MCP Integration [03--commands-and-skills/022-mcp-coco-integration/plan]"
description: "Phased plan for CocoIndex integration: Phase 1 installation/config registration, Phase 2 hardening, and Phase 3 strict-readiness plus downstream adoption packaging."
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
| **Framework** | FastMCP (Python MCP server), workspace-local Python 3.11 venv |
| **Storage** | SQLite + sqlite-vec in `.cocoindex_code/` (gitignored) |
| **Testing** | Manual config syntax validation (`python3 json.load`, `python3.11 tomllib.load`) |

### Overview

This plan covers three delivered phases of the CocoIndex integration: Phase 1 installed the `cocoindex-code` Python package via the skill install script into `.opencode/skill/mcp-coco-index/mcp_server/.venv`, initialized and built the code index, and registered the `cocoindex_code` MCP server entry across all 6 CLI config files. Phase 2 hardened the surrounding skill with runtime-truth docs, agent-facing helper scripts, a cross-CLI playbook, and advisor logic that prefers the repo-local binary and semantic exploration prompts. Phase 3 then tightened readiness semantics and published a concrete downstream adoption checklist so sibling repos can verify CocoIndex before relying on advisor heuristics.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (SC-001 through SC-009)
- [x] Dependencies identified (install script, Python 3.11, cocoindex-code v0.2.3)
- [x] NFRs defined with targets

### Definition of Done

- [x] All acceptance criteria met
- [x] Config syntax validation passes for all 6 files
- [x] Docs updated (spec/plan/tasks/checklist plus touched CocoIndex skill docs)
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

- [x] Install cocoindex-code via `bash .opencode/skill/mcp-coco-index/scripts/install.sh`
- [x] Verify binary available at `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`
- [x] Run `ccc init` in project root

### Phase 2: Index Build

- [x] Run `ccc index` to build initial code index
- [x] Verify index statistics: 6,792 files, 105,965 chunks, 14 languages
- [x] Confirm `.cocoindex_code/` directory created

### Phase 3: Config Registration

- [x] Add `.cocoindex_code/` to `.gitignore`
- [x] Add `cocoindex_code` entry to `.mcp.json` (disabled by default)
- [x] Add `cocoindex_code` entry to `opencode.json` (relative env, `_NOTE_*` docs)
- [x] Add `cocoindex_code` entry to `.agents/settings.json` (repo-relative path, `cwd`, `trust: true`)
- [x] Add `cocoindex_code` entry to `.gemini/settings.json` (repo-relative path, `cwd`, `trust: true`)
- [x] Add `cocoindex_code` entry to `.claude/mcp.json` (relative env, `_NOTE_*` docs)
- [x] Add `cocoindex_code` entry to `.codex/config.toml` (`[mcp_servers.cocoindex_code]` section)

### Phase 4: Verification

- [x] Validate all JSON files: `python3 -c "import json; json.load(open(f))"` for each
- [x] Validate TOML file: `python3.11 -c "import tomllib; tomllib.load(open(f, 'rb'))"`
- [x] Peer review score: 88/100 (PASS), 0 blockers, 0 P1s
- [x] Confirm consistent `cocoindex_code` naming across all 6 configs

### Phase 5: Cross-CLI Auto-Usage Validation (2026-03-18)

- [x] Run 3 test prompts (implicit semantic, explicit mention, skill-trigger guidance) across 4 CLIs
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
- [x] Update `../../../skill/mcp-coco-index/SKILL.md` with query optimization tips and `refresh_index=false` guidance

### Phase 7: Phase 2 Hardening (2026-03-18)

- [x] Align `../../../skill/mcp-coco-index/SKILL.md`, `../../../skill/mcp-coco-index/README.md`, `../../../skill/mcp-coco-index/INSTALL_GUIDE.md`, `../../../skill/mcp-coco-index/references/tool_reference.md`, `../../../skill/mcp-coco-index/references/search_patterns.md`, and `../../../skill/mcp-coco-index/assets/config_templates.md` with the installed CLI/MCP contract
- [x] Add `../../../skill/mcp-coco-index/references/cross_cli_playbook.md` for safe repeated-query, troubleshooting, and cross-CLI usage guidance
- [x] Add `scripts/common.sh`, `scripts/doctor.sh`, and `scripts/ensure_ready.sh` per `sk-code-opencode`
- [x] Update `scripts/install.sh` and `scripts/update.sh` to reuse shared helpers and support `--root`
- [x] Update `.opencode/skill/skill-advisor/scripts/skill_advisor.py` to prefer the repo-local `ccc` binary and auto-route semantic exploration prompts
- [x] Validate helper scripts, JSON output cleanliness, and advisor routing behavior

### Phase 8: Phase 3 Strict Readiness & Adoption Packaging (2026-03-18)

- [x] Extend `scripts/common.sh` with centralized readiness state, blocking issue codes `20` through `25`, and shared next-step computation
- [x] Extend `scripts/doctor.sh` with `--strict`, `--require-config`, `--require-daemon`, and repeatable `--expect-config`
- [x] Extend `scripts/ensure_ready.sh` with strict post-bootstrap validation and expected-config support
- [x] Add `../../../skill/mcp-coco-index/references/downstream_adoption_checklist.md` documenting the minimum sibling-repo adoption bundle
- [x] Update `../../../skill/mcp-coco-index/SKILL.md`, `../../../skill/mcp-coco-index/README.md`, and `../../../skill/mcp-coco-index/references/cross_cli_playbook.md` to route operators to strict modes and the new adoption checklist
- [x] Verify shared-repo strict readiness passes and temp-project strict config validation fails with exit `24`

### Phase 7: Cross-CLI Adoption Boosting

**Goal**: Increase CocoIndex usage frequency across all 5 CLI environments.

**Approach**: Four-layer strategy:
1. **Routing Layer** (`skill_advisor.py`): Direct `INTENT_BOOSTERS` for semantic keywords
2. **Instruction Layer** (`AGENTS.md`, `GEMINI.md`): Code Search Protocol section
3. **Agent Layer** (`@context`): CocoIndex as first-class exploration tool
4. **Playbook Layer** (`../../../skill/mcp-coco-index/references/cross_cli_playbook.md`, `../../../skill/mcp-coco-index/SKILL.md`): Per-provider activation recipes

**Key Insight**: `@context` had zero CocoIndex references despite being the exclusive codebase exploration entry point.

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
| Script smoke | Helper syntax, strict readiness, and JSON stability | `bash -n`, `doctor.sh --json --strict`, `ensure_ready.sh --json --strict` |
| Advisor behavior | Repo-local binary preference and semantic routing | `skill_advisor.py --health`, semantic vs exact-match prompt checks |
| Negative-path validation | Required config missing after bootstrap | `ensure_ready.sh --json --strict --require-config --root <tmpdir>` returning exit `24` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Install script | Project tool | Green - checked into repo | Cannot create the skill-local CocoIndex venv |
| Python 3.11 | Runtime | Green - Homebrew python3.11 available | Installer fails; sqlite-vec extension blocked on system Python |
| cocoindex-code v0.2.3 | PyPI package | Green - installed | MCP server unavailable |
| cocoindex==1.0.0a33 | Transitive dep | Green - alpha, pin version | Core Rust indexing engine unavailable |
| sqlite-vec | Transitive dep | Green | Vector search unavailable |
| all-MiniLM-L6-v2 | Model (auto-downloaded) | Green | Embedding generation unavailable |
| `sk-code-opencode` | Project skill | Green - available in repo | Shell/Python helper quality expectations would be undefined |
| Downstream rollout checklist | Project doc | Green - added at `../../../skill/mcp-coco-index/references/downstream_adoption_checklist.md` | Sibling repos would lack a canonical adoption recipe |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: MCP server causes CLI startup failures, or config changes break existing MCP servers
- **Procedure**: All changes are additive. Remove `cocoindex_code` entries from all 6 configs, remove `.cocoindex_code/` from `.gitignore`, run `rm -rf .cocoindex_code/`, run `rm -rf .opencode/skill/mcp-coco-index/mcp_server/.venv`

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
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
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Installation (install script, init) | Low | 10-15 minutes |
| Index build | Low | 5-10 minutes (CPU-bound) |
| Config registration (6 files) | Medium | 30-45 minutes |
| Syntax validation + peer review | Low | 15-20 minutes |
| Phase 2 hardening (docs, scripts, advisor) | Medium | 60-90 minutes |
| Phase 3 strict readiness and adoption packaging | Medium | 45-60 minutes |
| **Total** | | **165-240 minutes across all three phases** |

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
5. Run `rm -rf .opencode/skill/mcp-coco-index/mcp_server/.venv` to remove the local binary
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
