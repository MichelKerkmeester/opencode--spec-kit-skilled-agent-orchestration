---
title: "Implementation Summary: CocoIndex Code MCP Integration"
description: "Phase 1 installed CocoIndex across the repo; Phase 2 hardened the skill; Phase 3 added strict readiness semantics and downstream adoption packaging."
trigger_phrases:
  - "cocoindex implementation"
  - "cocoindex summary"
  - "coco-index integration summary"
  - "semantic code search delivered"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-mcp-coco-integration |
| **Completed** | 2026-03-18 (Phase 1 + Phase 2 + Phase 3) |
| **Level** | 2 |
| **Actual Effort** | ~225 minutes across all three phases |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

OpenCode now has semantic code search plus a hardened skill wrapper around it. Before this change, every code exploration session started from scratch - Grep needed exact identifiers, Glob needed exact paths, and conceptual queries like "find the authentication middleware" returned nothing. Phase 1 installed CocoIndex Code as the 4th MCP server in the OpenCode ecosystem and registered it across all 6 CLI config files, giving every AI assistant a `search` tool that finds code by intent and concept. Phase 2 then hardened the surrounding skill so agents could verify readiness, recover stale setups, and rely on docs that match the installed runtime. Phase 3 finished the operational layer by adding strict readiness semantics, standardized failure codes, and a downstream adoption checklist for sibling repos.

### Installation and Indexing

`cocoindex-code` v0.2.3 is installed via `bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh`, placing the `ccc` binary at `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc`. The initial index covers 6,792 files across 14 languages, producing 105,965 chunks stored in `.cocoindex_code/` (gitignored). The all-MiniLM-L6-v2 embedding model runs locally - no API key, no code sent to the cloud. Indexing completed in approximately 5 minutes on Apple Silicon.

### Multi-CLI Config Registration

The `cocoindex_code` MCP server entry is registered in all 6 CLI config files using the appropriate format for each. Each entry follows the existing naming convention (`spec_kit_memory`, `code_mode`) and sets `COCOINDEX_CODE_ROOT_PATH` to the repo root via `"."`. The checked-in command paths are repo-relative so the integration remains portable across clone locations. The `.mcp.json` entry is `disabled: true` by default to prevent startup failures on machines where `cocoindex-code` is not installed. The `opencode.json` and `.claude/mcp.json` entries use `_NOTE_*` env vars to document the install requirements inline, following the existing pattern in both files.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Modified | Added `.cocoindex_code/` to prevent index from being committed |
| `.mcp.json` | Modified | Registered `cocoindex_code` server (disabled by default for Claude Code) |
| `opencode.json` | Modified | Registered `cocoindex_code` server with `_NOTE_*` documentation (Copilot/OpenCode) |
| `.agents/settings.json` | Modified | Registered `cocoindex_code` server with repo-relative paths and `trust: true` (agents) |
| `.gemini/settings.json` | Modified | Registered `cocoindex_code` server with repo-relative paths and `trust: true` (Gemini CLI) |
| `.claude/mcp.json` | Modified | Registered `cocoindex_code` server with relative env and `_NOTE_*` docs (Claude Code) |
| `.codex/config.toml` | Modified | Registered `cocoindex_code` server via `[mcp_servers.cocoindex_code]` section (Codex CLI) |
| `.opencode/skill/mcp-cocoindex-code/scripts/common.sh` | Added | Shared shell helpers for readiness tooling |
| `.opencode/skill/mcp-cocoindex-code/scripts/doctor.sh` | Added | Read-only health check with strict readiness modes and expected-config validation |
| `.opencode/skill/mcp-cocoindex-code/scripts/ensure_ready.sh` | Added | Idempotent bootstrap helper with strict post-bootstrap validation |
| `.opencode/skill/scripts/skill_advisor.py` | Modified | Prefers repo-local `ccc` and boosts semantic discovery prompts |
| `.opencode/skill/mcp-cocoindex-code/references/cross_cli_playbook.md` | Added | Canonical operating guide for repeated-query and cross-CLI usage |
| `.opencode/skill/mcp-cocoindex-code/references/downstream_adoption_checklist.md` | Added | Minimum sibling-repo rollout checklist for payload, config wiring, and gitignore hygiene |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 was preceded by multi-agent research: 3 Claude Opus 4.6 sub-agents and 3 GPT-5.4 agents investigated CocoIndex Code in parallel, producing a 17-section `research.md` (v1.1). The research identified the PATH collision risk, corrected the cold start estimate to 20-30 seconds (not 3-8), and validated the phased rollout strategy. Phase 2 reused that evidence and the cross-CLI findings to focus on practical hardening instead of new routing rules. Phase 3 then converted the helper scripts from advisory wrappers into stricter readiness boundaries: `doctor.sh` stays read-only, `ensure_ready.sh` remains the bootstrap boundary, and both now share centralized readiness logic from `common.sh`.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phase 1 config-only | Minimize risk and validate the tool works before writing any custom code or agent integration |
| `disabled: true` in `.mcp.json` | Prevents accidental startup failure on machines without `cocoindex-code` installed; user opts in explicitly |
| Snake_case `cocoindex_code` | Matches existing MCP server naming convention (`spec_kit_memory`, `code_mode`); consistent across all 6 configs |
| Repo-relative command and root paths in all 6 configs | Keeps the integration portable across clone locations while still avoiding `PATH` collisions with unrelated `ccc` binaries |
| `_NOTE_*` env vars in `opencode.json` and `.claude/mcp.json` | Documents install requirements inline without needing external README; follows existing pattern in both files |
| `bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh` | Creates a repo-local Python 3.11 environment, avoids PATH collisions, and keeps the MCP binary colocated with the skill |
| Replace planned Phase 2 routing work with hardening | Cross-CLI validation showed discovery already works; docs, readiness helpers, and advisor utilization address the real gaps |
| Prefer repo-local `ccc` before PATH in advisor | Avoids collisions with unrelated `ccc` binaries and keeps searches bound to the checked-in integration |
| `doctor.sh` and `ensure_ready.sh` as first-line recovery | Gives agents deterministic health/setup entrypoints without baking setup logic into every caller |
| Keep `doctor.sh` read-only and `ensure_ready.sh` mutating | Preserves a clean operational boundary for agents and makes failures easier to diagnose |
| Use stable exit codes `20` through `25` | Lets agents distinguish missing binary, payload, index, required config, and required daemon conditions without string parsing |
| Ship downstream adoption as docs + strict checks, not auto-config-writing | Sibling repos need deliberate payload/config rollout; silent config mutation would hide missing integration layers |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/python -c "import importlib.metadata as m; print(m.version('cocoindex-code'))"` | PASS - prints `0.2.3` |
| `ccc index` statistics | PASS - 6,792 files, 105,965 chunks, 14 languages |
| `ccc search "MCP server initialization"` | PASS - returns TypeScript results with file paths and line numbers |
| `.mcp.json` syntax (python3 json.load) | PASS |
| `opencode.json` syntax (python3 json.load) | PASS |
| `.agents/settings.json` syntax (python3 json.load) | PASS |
| `.gemini/settings.json` syntax (python3 json.load) | PASS |
| `.claude/mcp.json` syntax (python3 json.load) | PASS |
| `.codex/config.toml` syntax (python3.11 tomllib.load) | PASS |
| `cocoindex_code` naming consistency across 6 configs | PASS |
| `.cocoindex_code/` gitignored | PASS |
| Peer review score | PASS - 88/100, 0 blockers, 0 P1 issues |
| `bash -n` on touched CocoIndex shell scripts | PASS |
| `bash .opencode/skill/mcp-cocoindex-code/scripts/doctor.sh --json --strict --require-config --expect-config opencode.json` | PASS - reports `status: "ready"`, `expectedConfigs: ["opencode.json"]`, `indexFiles: 5859`, `indexChunks: 78525` after recovery |
| `bash .opencode/skill/mcp-cocoindex-code/scripts/ensure_ready.sh --json --strict --require-config --expect-config opencode.json` | PASS - reindexed the shared repo (`actionsPerformed: ["index"]`) and returned `status: "ready"` |
| `bash .opencode/skill/mcp-cocoindex-code/scripts/ensure_ready.sh --json --strict --require-config --root <tmpdir>` | PASS - performs `init` and `index`, then exits `24` with `blockingIssues: [24]` when config wiring is still missing |
| `python3 .opencode/skill/scripts/skill_advisor.py --health` | PASS - reports repo-local `.venv/bin/ccc` |
| `python3 .opencode/skill/scripts/skill_advisor.py "find code that handles auth" --threshold 0.8` | PASS - routes to `mcp-cocoindex-code` at 0.95 confidence |
| `python3 .opencode/skill/scripts/skill_advisor.py "find exact string TODO comments" --threshold 0.8 --show-rejections` | PASS - exact-text prompt does not pass threshold for CocoIndex |

**NFR Verification**:

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Index build under 15 minutes | ~5 minutes on Apple Silicon | PASS |
| NFR-P02 | Warm search latency under 500ms | Confirmed fast on warm daemon | PASS |
| NFR-S01 | No API keys required | all-MiniLM-L6-v2 runs locally | PASS |
| NFR-S02 | No secrets in configs | Manual review of all 6 files | PASS |
| NFR-S03 | Index directory gitignored | `.cocoindex_code/` in `.gitignore` | PASS |
| NFR-S04 | No network exposure | Unix domain socket only | PASS |
| NFR-R01 | Disabled by default | `disabled: true` in `.mcp.json` | PASS |
| NFR-R02 | Additive config changes only | Existing MCP servers unaffected | PASS |
| NFR-R03 | Machine-readable helper output | `doctor.sh --json` and `ensure_ready.sh --json` stay clean | PASS |
| NFR-R04 | Safer follow-up query guidance | Docs and helper recommendations prefer `refresh_index=false` for unchanged follow-up queries | PASS |
| NFR-R05 | Stable strict failure codes | `20` through `25` now map to binary, payload, helper payload, index, config, and daemon-required failures | PASS |

**Deviations from Plan**: The planned Phase 2 agent-routing work was intentionally replaced with docs, helper-script, and advisor hardening after cross-CLI validation showed direct tool discovery was already effective.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Disabled by default in `.mcp.json`** - Users must manually set `"disabled": false` (or remove the field) in `.mcp.json` to activate CocoIndex in Claude Code. The entry exists but does not auto-start.

2. **No new runtime agent routing rules** - Phase 2 intentionally avoided adding new `@context` or `@orchestrate` CocoIndex routing rules. Discovery is handled through MCP descriptions plus skill-advisor heuristics.

3. **Index still needs explicit refresh workflows** - There is no verified watch-based continuous reindexing in this skill. After significant code changes, run `ccc index` manually or use `ensure_ready.sh --refresh-index`.

4. **Local embeddings only** - all-MiniLM-L6-v2 (384 dimensions) is smaller and less capable than cloud alternatives (Voyage, OpenAI). Semantic quality is good for code search but not state-of-the-art.

5. **Vector-only retrieval** - No BM25/keyword complement. Exact identifier matches may score lower than conceptually similar but lexically different code. Use Grep for exact pattern matching; CocoIndex for intent-based queries.

6. **Cold start 20-30 seconds** - First query after daemon restart takes 20-30 seconds (daemon startup + embedding model load). Subsequent queries on a warm daemon are fast.

7. **Repeated-query guidance must still be followed** - MCP `refresh_index=true` remains the default for the first query. Follow-up queries should prefer `refresh_index=false` when the codebase has not changed.

8. **Strict config checks do not write config for you** - `--strict --require-config` is intentionally validation-only. If a sibling repo is missing `cocoindex_code` wiring, fix the configs using `../../../skill/mcp-cocoindex-code/references/downstream_adoption_checklist.md` and `../../../skill/mcp-cocoindex-code/assets/config_templates.md`.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-cli-findings -->
## Cross-CLI Auto-Usage Test Findings (2026-03-18)

A cross-CLI test validated whether AI models spontaneously use CocoIndex MCP without agent routing changes. Three prompts (implicit semantic, explicit mention, and skill-trigger guidance) were sent to Claude Code, Codex, Gemini, and Copilot.

### F1: Auto-discovery works -- Phase 2 agent routing is unnecessary

All 3 working CLIs (Claude Code, Gemini, Copilot) chose CocoIndex from the MCP tool description alone. No skill-trigger phrases, skill advisor routing, or agent definition changes were needed. The tool description "Semantic code search across the entire codebase" is sufficient for models to independently select it for concept-based queries.

**Implication**: Phase 2's planned @context agent routing adds maintenance without clear benefit. Deprioritize.

### F2: Copilot MCP failures caused by daemon concurrency bug (not a Copilot issue)

Root cause: `cocoindex_core::engine::component` crashes when `refresh_index=true` (MCP default) and multiple requests overlap. The daemon lacks a mutex/lock on index refresh operations.

- 850 `ComponentContext` errors in daemon.log (685 original + 165 reproduction)
- Copilot sends more concurrent MCP queries than other CLIs (5+ vs 1-2), exposing the race condition
- Workaround: `refresh_index=false` eliminates all errors
- Fix: Upstream CocoIndex daemon bug report needed

### F3: Query quality matters more than tool routing

Short natural-language queries outperform long keyword-stuffed queries due to embedding dilution:

| Query style | Example | Results | Scores |
|-------------|---------|---------|--------|
| Short, focused (3 words) | "retry logic patterns" | 10 | 0.56-0.60 |
| Keyword-stuffed (12 words) | "retry helper utilities, exponential backoff, max retries, failed operation retry wrappers" | 5 | 0.64-0.67 |

Both return results, but shorter queries produce tighter semantic matches across a broader range. Keyword stuffing averages the embedding vector across too many concepts.

### F4: Token efficiency -- CocoIndex saves 10-50x tokens

| CLI | Prompt | Token usage | Strategy |
|-----|--------|-------------|----------|
| Gemini P2 | Auth patterns | 75K | 2 CocoIndex calls (exclusive) |
| Copilot P1 | Retry logic | 3.6M | MCP failed, Grep fallback, 15+ file reads |

When CocoIndex works, it eliminates the Grep-Read-Filter cascade entirely.

### Recommendations

| # | Recommendation | Priority | Rationale |
|---|----------------|----------|-----------|
| R1 | Deprioritize Phase 2 @context agent routing | High | Auto-discovery works; routing adds maintenance without benefit |
| R2 | Report upstream daemon concurrency bug | High | `refresh_index=true` + concurrent requests crashes `ComponentContext` |
| R3 | Add `refresh_index: false` guidance to `../../../skill/mcp-cocoindex-code/SKILL.md` | Medium | Workaround for multi-query sessions |
| R4 | Add query optimization tips to `../../../skill/mcp-cocoindex-code/SKILL.md` | Medium | Short natural language queries outperform keyword stuffing |
| R5 | Retest Codex when billing resolved | Low | MCP wiring confirmed correct |
| R6 | Redefine Phase 2 scope: reliability + query guidance | High | Replace agent routing with concrete fixes |

<!-- /ANCHOR:cross-cli-findings -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Phase 1 complete 2026-03-18
- Config-only, no custom code
- All NFRs verified, 0 deviations
- Cross-CLI test findings added 2026-03-18
-->
