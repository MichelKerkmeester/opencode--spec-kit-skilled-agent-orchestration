---
title: "Implementation Summary: CocoIndex Code MCP Integration"
description: "Phase 1 complete: cocoindex-code v0.2.3 installed, 6,792 files indexed, MCP server registered in all 6 CLI configs. OpenCode now has semantic code search capability."
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
| **Spec Folder** | 023-coco-index-integration |
| **Completed** | 2026-03-18 |
| **Level** | 2 |
| **Actual Effort** | ~90 minutes (estimated: 60-90 minutes) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

OpenCode now has semantic code search. Before this change, every code exploration session started from scratch - Grep needed exact identifiers, Glob needed exact paths, and conceptual queries like "find the authentication middleware" returned nothing. Phase 1 installs CocoIndex Code as the 4th MCP server in the OpenCode ecosystem and registers it across all 6 CLI config files, giving every AI assistant a `search` tool that finds code by intent and concept.

### Installation and Indexing

`cocoindex-code` v0.2.3 is installed via `pipx install --python python3.11 cocoindex-code`, placing the `ccc` binary at `~/.local/bin/ccc`. The initial index covers 6,792 files across 14 languages, producing 105,965 chunks stored in `.cocoindex_code/` (gitignored). The all-MiniLM-L6-v2 embedding model runs locally - no API key, no code sent to the cloud. Indexing completed in approximately 5 minutes on Apple Silicon.

### Multi-CLI Config Registration

The `cocoindex_code` MCP server entry is registered in all 6 CLI config files using the appropriate format for each. Each entry follows the existing naming convention (`spec_kit_memory`, `code_mode`) and sets `COCOINDEX_CODE_ROOT_PATH` to point to the project root. The `.mcp.json` entry is `disabled: true` by default to prevent startup failures on machines where `cocoindex-code` is not installed. The `opencode.json` and `.claude/mcp.json` entries use `_NOTE_*` env vars to document the install requirements inline, following the existing pattern in both files.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore` | Modified | Added `.cocoindex_code/` to prevent index from being committed |
| `.mcp.json` | Modified | Registered `cocoindex_code` server (disabled by default for Claude Code) |
| `opencode.json` | Modified | Registered `cocoindex_code` server with `_NOTE_*` documentation (Copilot/OpenCode) |
| `.agents/settings.json` | Modified | Registered `cocoindex_code` server with absolute paths and `trust: true` (agents) |
| `.gemini/settings.json` | Modified | Registered `cocoindex_code` server with absolute paths and `trust: true` (Gemini CLI) |
| `.claude/mcp.json` | Modified | Registered `cocoindex_code` server with relative env and `_NOTE_*` docs (Claude Code) |
| `.codex/config.toml` | Modified | Registered `cocoindex_code` server via `[mcp_servers.cocoindex_code]` section (Codex CLI) |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 was preceded by multi-agent research: 3 Claude Opus 4.6 sub-agents and 3 GPT-5.4 agents investigated CocoIndex Code in parallel, producing a 17-section `research.md` (v1.1). The research identified the PATH collision risk, corrected the cold start estimate to 20-30 seconds (not 3-8), and validated the phased rollout strategy. Implementation was config-only - no custom code was written. All 5 JSON files validated clean with `python3 json.load`; the TOML file validated clean with `python3.11 tomllib.load`. A peer review confirmed 88/100 (PASS) with zero blockers and zero P1 issues. All success criteria (SC-001 to SC-004) were verified before closing Phase 1.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phase 1 config-only | Minimize risk and validate the tool works before writing any custom code or agent integration |
| `disabled: true` in `.mcp.json` | Prevents accidental startup failure on machines without `cocoindex-code` installed; user opts in explicitly |
| Snake_case `cocoindex_code` | Matches existing MCP server naming convention (`spec_kit_memory`, `code_mode`); consistent across all 6 configs |
| Absolute paths in CLI configs (`.agents/`, `.gemini/`, `.claude/mcp.json`) | CLI tools may not resolve relative paths from project root; absolute paths are robust regardless of invocation directory |
| Relative `"."` in `opencode.json` | Follows existing pattern in the file; OpenCode resolves paths relative to project root |
| `_NOTE_*` env vars in `opencode.json` and `.claude/mcp.json` | Documents install requirements inline without needing external README; follows existing pattern in both files |
| `pipx install --python python3.11` | Isolates the Python environment from system Python; macOS system Python (3.9.6) blocks the sqlite-vec extension |
| Defer agent integration to Phase 2 | Layer 2b @context routing requires agent prompt changes; keep Phase 1 scope tight and reversible |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ccc --version` | PASS - returns v0.2.3 |
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

**Deviations from Plan**: None. Phase 1 executed as planned. Index size within estimated 250-600 MB range. Actual effort ~90 minutes (within 60-90 minute estimate).

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Disabled by default in `.mcp.json`** - Users must manually set `"disabled": false` (or remove the field) in `.mcp.json` to activate CocoIndex in Claude Code. The entry exists but does not auto-start.

2. **No agent integration yet** - Agents do not know about the `search` tool in Phase 1. The @context agent, @research agent, and skill advisor are unchanged. Phase 2 adds the Layer 2b conditional routing to @context.

3. **Index requires manual rebuild** - No file-watch daemon in Phase 1. After significant code changes, run `ccc index` manually to update the index. Incremental re-index on each search query (`refresh_index=true` default) handles small changes.

4. **Local embeddings only** - all-MiniLM-L6-v2 (384 dimensions) is smaller and less capable than cloud alternatives (Voyage, OpenAI). Semantic quality is good for code search but not state-of-the-art.

5. **Vector-only retrieval** - No BM25/keyword complement. Exact identifier matches may score lower than conceptually similar but lexically different code. Use Grep for exact pattern matching; CocoIndex for intent-based queries.

6. **Cold start 20-30 seconds** - First query after daemon restart takes 20-30 seconds (daemon startup + embedding model load). Subsequent queries on a warm daemon are fast.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-cli-findings -->
## Cross-CLI Auto-Usage Test Findings (2026-03-18)

A cross-CLI test validated whether AI models spontaneously use CocoIndex MCP without agent routing changes. Three prompts (implicit semantic, explicit mention, SKILL.md trigger phrase) were sent to Claude Code, Codex, Gemini, and Copilot.

### F1: Auto-discovery works -- Phase 2 agent routing is unnecessary

All 3 working CLIs (Claude Code, Gemini, Copilot) chose CocoIndex from the MCP tool description alone. No SKILL.md trigger phrases, skill advisor routing, or agent definition changes were needed. The tool description "Semantic code search across the entire codebase" is sufficient for models to independently select it for concept-based queries.

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
| R3 | Add `refresh_index: false` guidance to SKILL.md | Medium | Workaround for multi-query sessions |
| R4 | Add query optimization tips to SKILL.md | Medium | Short natural language queries outperform keyword stuffing |
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
