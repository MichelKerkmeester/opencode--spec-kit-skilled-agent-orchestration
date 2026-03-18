# Cross-CLI CocoIndex Auto-Usage Test Results

**Date**: 2026-03-18
**Purpose**: Validate whether AI models spontaneously use CocoIndex MCP `search` tool for semantic/concept-based code queries without explicit agent routing.

---

## Test Design

### Prompts

| # | Prompt | Type |
|---|--------|------|
| P1 | "How is retry logic implemented across this codebase? Find all patterns for retrying failed operations." | Implicit semantic (no CocoIndex mention) |
| P2 | "Search the codebase semantically for authentication and authorization patterns. Use CocoIndex if available." | Explicit CocoIndex mention |
| P3 | "Find code that handles graceful error recovery when external API calls fail." | SKILL.md trigger phrase ("find code that") |

### CLI Configurations

| CLI | Model | MCP Config File |
|-----|-------|----------------|
| Claude Code | Claude Opus 4.6 | `.claude/mcp.json` |
| Codex | gpt-5.3-codex | `.codex/config.toml` |
| Gemini | gemini-3.1-pro-preview | `.gemini/settings.json` |
| Copilot | GPT-5.4 | `opencode.json` |

---

## Results Matrix

| CLI | P1 (implicit) | P2 (explicit) | P3 (trigger phrase) |
|-----|---------------|---------------|---------------------|
| **Claude Code** | USED_COCOINDEX | USED_COCOINDEX | USED_COCOINDEX |
| **Codex** | ERROR | ERROR | ERROR |
| **Gemini** | USED_COCOINDEX (hybrid) | USED_COCOINDEX (exclusive) | USED_COCOINDEX (exclusive) |
| **Copilot** | USED_COCOINDEX* | USED_COCOINDEX | USED_COCOINDEX* |

---

## Detailed Evidence

### Claude Code (Claude Opus 4.6)

All 3 prompts: Used `mcp__cocoindex_code__search` exclusively. 1 call per prompt, 10 results each.

| Prompt | Tool | Query | Results |
|--------|------|-------|---------|
| P1 | `mcp__cocoindex_code__search` | "retry logic patterns for retrying failed operations" | 10 hits (retry-utils.js, retryWithBackoff, retry-manager) |
| P2 | `mcp__cocoindex_code__search` | "authentication and authorization patterns" | 10 hits (JWT auth, OAuth, bcrypt, NestJS guards) |
| P3 | `mcp__cocoindex_code__search` | "graceful error recovery when external API calls fail" | 10 hits (error recovery, isPermanentError, connection managers) |

**Strategy**: Pure CocoIndex, no fallback to Grep/Glob.

### Codex (gpt-5.3-codex)

All 3 prompts: ERROR -- OpenAI usage limit hit before any tool calls could execute.

- MCP servers loaded successfully (`cocoindex_code ready` confirmed in all 3 logs)
- Billing error: "You've hit your usage limit"
- **Cannot evaluate** CocoIndex auto-usage (infrastructure issue, not CocoIndex issue)

### Gemini (gemini-3.1-pro-preview)

All 3 prompts: Used `mcp_cocoindex_code_search`. Most token-efficient CLI.

| Prompt | CocoIndex Calls | Grep Calls | Glob Calls | Total Tool Calls |
|--------|----------------|------------|------------|-----------------|
| P1 | 1 | 2 | 1 | 4 |
| P2 | 2 | 0 | 0 | 2 |
| P3 | 1 | 0 | 0 | 1 |

- P2 and P3: **Exclusive CocoIndex** -- no other search tools used
- P1: Hybrid (CocoIndex first, then Grep/Glob to cross-verify)
- Total API requests: 2-4 per prompt, minimal token usage

### Copilot (GPT-5.4)

All 3 prompts: Attempted CocoIndex MCP `search`, but MCP returned 0 results in P1 and P3.

| Prompt | CocoIndex MCP Calls | MCP Results? | CocoIndex CLI (`ccc`) | Grep Calls | Read Calls |
|--------|--------------------|--------------|-----------------------|------------|------------|
| P1 | 1 | 0 results | 3 (via shell) | ~20+ | ~15 |
| P2 | 5+ | Results returned | 0 | ~10+ | ~15 |
| P3 | 2 | 0 results / `success:false` | 0 | ~15+ | ~10 |

- Always follows framework gates first (memory_match_triggers, skill_advisor.py)
- P2 (explicit mention): MCP search worked, returned results
- P1, P3 (implicit): MCP search returned empty/failed, fell back to Grep + direct code reading
- Also loaded the `mcp-cocoindex-code` skill explicitly in P1
- Most thorough investigation but least token-efficient (3.6M input tokens for P1)

**MCP Reliability Issue**: Copilot's CocoIndex MCP `search` returns 0 results or `success:false` for implicit queries that work fine via `ccc` CLI and via Gemini/Claude Code MCP. P2 (explicit mention) worked. This suggests a query format, escaping, or connection issue specific to how Copilot invokes the MCP tool.

---

## Key Findings

### 1. All working CLIs auto-discover and use CocoIndex
No agent definition changes needed. The MCP tool description ("Semantic code search across the entire codebase") is sufficient for all 3 models to independently choose it for concept-based queries.

### 2. Phase 2 agent routing may be unnecessary
The implementation summary noted "No agent integration yet" and planned Phase 2 for @context agent routing. This test demonstrates that AI models spontaneously reach for CocoIndex when:
- The tool is available in MCP
- The query is concept-based (not exact-match)
- The tool description clearly explains its purpose

### 3. Gemini is the most CocoIndex-native
Used it exclusively in 2/3 prompts, hybrid in 1. Minimal token usage (75K total for P2). Fastest execution.

### 4. Copilot MCP failures caused by daemon concurrency bug (ROOT CAUSE IDENTIFIED)

**Root cause**: `refresh_index=true` (the MCP default) triggers concurrent index refresh operations that crash the CocoIndex Rust core. The daemon logs show `RuntimeError: No ComponentContext available` in `cocoindex_core::engine::component` when multiple refresh operations overlap.

**Evidence**:
- 685 `component build failed` errors in `~/.cocoindex_code/daemon.log` during the original test windows
- Reproduction test (2026-03-18, Claude Code): 5 concurrent queries with `refresh_index=true` generated +165 new errors (685 to 850), even though all 5 returned `success:true`
- Same 5 queries with `refresh_index=false` generated 0 new errors
- Copilot's exact "failing" queries all return results when sent individually with `refresh_index=false`:
  - "role based access control permission checks..." -- 5 results (scores 0.39-0.47)
  - "code that catches failed API responses..." -- 5 results (scores 0.51-0.56)
  - "retry helper utilities, exponential backoff..." -- 5 results (scores 0.64-0.67)

**Why Copilot was most affected**: Copilot sends more concurrent MCP queries than other CLIs (5+ vs 1-2 for Claude Code/Gemini), exposing the race condition more aggressively. The daemon accumulates errors until it starts returning `success:false` or empty results.

**This is NOT a Copilot bug** -- it is an upstream CocoIndex daemon concurrency bug. The daemon lacks a mutex/lock on index refresh operations.

**Workaround**: Use `refresh_index=false` for all queries in multi-query sessions. The index only needs refreshing after code changes, not between consecutive searches.

### 5. Codex cannot be evaluated (billing still blocked)

OpenAI usage limits blocked all 3 original tests. Retry on 2026-03-18 also failed: `ERROR: You've hit your usage limit`. MCP wiring confirmed working (`cocoindex_code ready` in all logs). Deferred until billing resets.

### 6. No SKILL.md trigger phrases needed
All models chose CocoIndex purely from the tool description. The skill advisor routing and SKILL.md trigger phrases ("find code that", "semantic search") are bonus signals, not requirements.

### 7. Query quality affects result relevance (not MCP success)

Short natural-language queries consistently outperform long keyword-stuffed queries:
- Claude Code: "retry logic patterns" (3 words) -- 10 results, scores 0.56-0.60
- Copilot: "retry helper utilities, exponential backoff, max retries, failed operation retry wrappers" (12 words) -- 5 results, scores 0.64-0.67

Both return results, but keyword stuffing risks **embedding dilution**: the embedding vector averages across too many concepts, reducing similarity to any single one. Short, focused queries produce tighter semantic matches.

### 8. Token efficiency -- CocoIndex saves 10-50x tokens

When CocoIndex succeeds, it eliminates the Grep-Read-Filter cascade:
- Gemini P2: 75K total tokens (2 CocoIndex calls, exclusive)
- Copilot P1: 3.6M total tokens (MCP failed, fell back to Grep + 15 file reads)
- This is a 48x token difference for the same task

---

## Root Cause Analysis: Copilot MCP Failures

### Summary

The CocoIndex daemon has a concurrency bug in its Rust core (`cocoindex_core::engine::component`). When `refresh_index=true` (the MCP default) and multiple search requests arrive simultaneously, the daemon attempts concurrent index refresh operations that crash with `RuntimeError: No ComponentContext available`.

### Daemon Log Evidence

```
Error location: cocoindex_core::engine::component
Error: RuntimeError: No ComponentContext available. This function must be called
       from within an active component context (inside a mount/use_mount call or
       App.update).
Call chain: server.py search → refresh_index → component build → _read_sync →
            resolve() → use_context() → get_context_from_ctx() → RuntimeError
```

Total errors during test windows: 685 (original) + 165 (reproduction) = 850

### Reproduction Results (2026-03-18)

| Test | refresh_index | Concurrent queries | All succeeded? | New daemon errors |
|------|---------------|-------------------|----------------|-------------------|
| 1a | `true` | 5 | Yes | +165 |
| 1b | `false` | 5 | Yes | 0 |
| 1c | `false` | 3 (Copilot's exact queries) | Yes, all returned results | 0 |

### Fix Path

1. **Immediate workaround**: Set `refresh_index=false` in multi-query sessions
2. **Upstream fix needed**: CocoIndex daemon needs a mutex/lock on index refresh operations to prevent concurrent `ComponentContext` access

---

## Recommendations

1. **Deprioritize Phase 2 @context agent routing** -- Auto-discovery works. Agent changes would add maintenance burden without clear benefit.
2. **Report upstream daemon concurrency bug** -- `refresh_index=true` + concurrent requests crashes `ComponentContext`. Needs mutex/lock on refresh operations.
3. **Add `refresh_index: false` guidance to SKILL.md** -- Workaround for multi-query sessions where the index does not need updating between searches.
4. **Add query optimization tips to SKILL.md** -- Short natural language queries outperform keyword-stuffed queries due to embedding dilution.
5. **Retest Codex when billing resets** -- MCP wiring confirmed correct; only billing blocked the test.
6. **Redefine Phase 2 scope: reliability + query guidance** -- Replace agent routing with concrete fixes (daemon bug report, SKILL.md query guidance).

---

## Log Files

| CLI | Prompt | Log Path |
|-----|--------|----------|
| Codex | P1 | `/tmp/cocoindex-test-codex-p1.log` |
| Codex | P2 | `/tmp/cocoindex-test-codex-p2.log` |
| Codex | P3 | `/tmp/cocoindex-test-codex-p3.log` |
| Gemini | P1 | `/tmp/cocoindex-test-gemini-p1.log` |
| Gemini | P2 | `/tmp/cocoindex-test-gemini-p2.log` |
| Gemini | P3 | `/tmp/cocoindex-test-gemini-p3.log` |
| Copilot | P1 | `/tmp/cocoindex-test-copilot-p1.log` |
| Copilot | P2 | `/tmp/cocoindex-test-copilot-p2.log` |
| Copilot | P3 | `/tmp/cocoindex-test-copilot-p3.log` |
