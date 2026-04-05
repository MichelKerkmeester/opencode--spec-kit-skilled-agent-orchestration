# Changelog: 024/025-tool-routing-enforcement

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 025-tool-routing-enforcement — 2026-04-01

AI assistants across all CLI runtimes (Claude Code, Codex, Copilot, Gemini) consistently defaulted to Grep and Glob for code search even when CocoIndex (semantic search) and Code Graph (structural queries) were available and better suited. The root cause was a passive enforcement model: instruction files said "MUST use CocoIndex" but this competed with the AI's built-in preference for familiar tools, and the AI won every time. This phase added active enforcement at five layers -- MCP server instructions, session priming, tool response hints, instruction files, and agent definitions -- so that every CLI runtime receives routing rules at the point where tool selection decisions actually happen. 28 of 30 tasks completed; 2 deferred. This is the final phase (25 of 25) in the compact-code-graph specification.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/`

---

## Architecture (2)

Two structural decisions that shape how enforcement works across runtimes.

### Five-layer defense-in-depth enforcement

**Problem:** A single enforcement point was unreliable across runtimes with different hook capabilities. Claude Code has hooks that fire automatically, but Codex, Copilot, and Gemini do not. If the AI skipped reading CLAUDE.md (which happens after context compaction), the single enforcement point was lost entirely. There was no fallback.

**Fix:** Implemented five reinforcing layers that work together like a safety net: (1) MCP server instructions inject routing rules proactively at session start -- every runtime receives these, (2) session priming adds per-session routing directives to the PrimePackage (the startup context payload), (3) tool response hints fire reactively when the system detects the AI is about to use the wrong tool, (4) instruction files contain active decision trees instead of passive statements, and (5) agent definitions embed routing tables directly in their output. If any one layer is missed, the next catches it.

### Availability-aware routing

**Problem:** Hardcoded routing rules would cause confusion when a tool was unavailable. If the rules said "use CocoIndex for semantic search" but CocoIndex was down or not configured, the AI would waste time calling a broken tool and then not know what to do next.

**Fix:** Each enforcement layer checks whether CocoIndex and Code Graph are actually available before recommending them. If CocoIndex is down, the server instructions and PrimePackage omit the semantic search rule entirely. If the Code Graph is empty, structural query routing is excluded. The AI receives only actionable recommendations for tools that are actually running.

---

## New Features (5)

Five new enforcement mechanisms, each targeting a different point in the AI's decision-making process.

### Server instruction routing section

**Problem:** MCP server instructions (the initial guidance the server sends to the AI at session start) contained no information about which search tool to use for which type of query. The AI was left to its own default preferences, which always favored Grep.

**Fix:** Added a "Tool Routing" section to `buildServerInstructions()` in `context-server.ts` containing three conditional rules: CocoIndex for semantic/concept searches (only included when CocoIndex is available), Code Graph for structural queries like callers and dependencies (only when graph is fresh or stale), and Grep for exact text or regex (always included). Every runtime receives these rules automatically.

### PrimePackage routing directive

**Problem:** The PrimePackage (the structured context payload sent on the first tool call of a session) told the AI what tools existed but not when to use each one. The AI knew CocoIndex was available but still chose Grep because nothing in the priming payload said otherwise.

**Fix:** Extended the `PrimePackage` interface in `memory-surface.ts` with a `toolRouting` field inside `routingRules`. The directive uses command language ("semantic queries → CocoIndex") rather than descriptions ("CocoIndex is available for semantic search"), because directive phrasing is harder for the AI to reinterpret or ignore. The content adapts based on CocoIndex availability.

### Tool response hints for misjudgment

**Problem:** Even with proactive enforcement, the AI occasionally called the wrong tool. When `memory_search` or `memory_context` was called with a query like "find the authentication logic" or "implementation of retry," the system processed the request against memory artifacts when it should have been routed to CocoIndex for semantic code search. There was no feedback mechanism.

**Fix:** Added code-search pattern detection in the tool dispatch handler. When `memory_search` or `memory_context` is called with a query matching code-search patterns (phrases like "find code", "implementation of", "function that", "where is", "how does X work"), the JSON response envelope gains a `hints` array suggesting CocoIndex or Code Graph instead. Hints are non-blocking -- they append to the response without interrupting the current tool call, nudging the AI toward the right tool on the next query.

### Session snapshot routing state

**Problem:** Both server instructions and session priming needed to know which search tools were available, but each computed this independently using different logic. This risked inconsistent routing recommendations between the two layers.

**Fix:** Added a `routingRecommendation` string field to `SessionSnapshot` in `session-snapshot.ts`. This field builds a concise routing summary from CocoIndex availability and graph freshness, giving both server instructions and session priming a single source of truth for routing decisions.

### Tool description enrichment

**Problem:** Tool descriptions in the MCP schema (the metadata the AI reads to understand what each tool does) did not mention routing. The AI read that `memory_search` "searches indexed memories" but had no indication that CocoIndex existed for code-specific searches, or that `code_graph_query` was better than Grep for structural questions.

**Fix:** Updated four tool descriptions in `tool-schemas.ts`: `memory_context` and `memory_search` now include cross-references saying "For code search by concept/intent, prefer CocoIndex. For structural queries, prefer code_graph_query." `code_graph_query` gained "Use INSTEAD of Grep for structural queries" language. `code_graph_context` now recommends using CocoIndex first and passing results as seeds for structural expansion.

---

## Documentation (4)

Four updates to instruction files and agent definitions that serve as the final enforcement layer.

### Root CLAUDE.md active decision tree

**Problem:** The root CLAUDE.md contained a passive "MUST use CocoIndex" bullet under Mandatory Tools. Passive language competes with the AI's built-in tool preferences and loses. The Quick Reference table listed only "CocoIndex search" for code search, missing Code Graph and Grep entirely.

**Fix:** Replaced the passive bullet with a three-line "Code Search Decision Tree (MANDATORY)" that maps query types to tools: semantic/concept → CocoIndex, structural → code_graph_query, exact text → Grep. Updated the Quick Reference "Code search" row to include all three tools with clear routing. Every CLI runtime that reads CLAUDE.md now gets explicit tool-to-query-type mapping.

### Claude-specific routing reinforcement

**Problem:** `.claude/CLAUDE.md` contained hook-related recovery instructions but no routing enforcement. Since Claude Code has hooks that fire automatically, there was an assumption that routing would be handled by hooks alone. But hooks can fail, and the AI can forget hook-injected context after compaction.

**Fix:** Added a "Tool Routing Enforcement" section explaining how hooks inject routing rules automatically via server instructions, PrimePackage, and tool response hints. Includes a reinforcement copy of the decision tree for cases where hooks fail or context is compacted.

### Codex and Gemini instruction files

**Problem:** `.codex/CODEX.md` and `.gemini/GEMINI.md` had no content about tool routing. These runtimes lack hook support, so the instruction file is their only enforcement layer. Without routing guidance in these files, Codex and Gemini users had zero enforcement.

**Fix:** Created both files with identical tool routing enforcement tables mapping query types to tools with concrete examples. Includes an anti-patterns section warning against common misjudgments: don't use Grep for concept searches, don't use memory_search for code search, and check CocoIndex availability before relying on it.

### Context-prime agent routing tables

**Problem:** The `@context-prime` agent (which runs on session start to bootstrap context) produced a Prime Package output with no routing guidance. The AI received information about available tools but no indication of when to use each one.

**Fix:** Added a "Tool Routing" table to four context-prime agent files (`.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.agents/agents/`). Each table maps query types to tools with concrete examples. The `.gemini/agents/context-prime.md` update was deferred because the file does not exist yet (T-024).

---

## Deferred (2)

### Gemini agent file (T-024)

**Problem:** `.gemini/agents/context-prime.md` does not exist in the repository.

**Status:** The routing table will be added when the file is created in a future phase.

### Manual end-to-end test (T-030)

**Problem:** Automated tests verify that routing rules are present in server instructions and PrimePackage, but a manual test confirming that Claude Code actually routes a semantic search to CocoIndex in a fresh session has not been executed.

**Status:** Pending manual execution.

---

<details>
<summary>Files Changed (12 total)</summary>

### Source (4 files)

| File | Changes |
|------|---------|
| `mcp_server/context-server.ts` | Added "Tool Routing" section to `buildServerInstructions()` with availability-aware rules; added code-search pattern detection in tool dispatch with hint injection |
| `mcp_server/hooks/memory-surface.ts` | Extended PrimePackage with `routingRules.toolRouting` directive populated by CocoIndex availability |
| `mcp_server/tool-schemas.ts` | Updated 4 tool descriptions with routing cross-references |
| `mcp_server/lib/session/session-snapshot.ts` | Added `routingRecommendation` string field built from CocoIndex/Code Graph availability |

### Instruction Files (4 files)

| File | Changes |
|------|---------|
| `CLAUDE.md` (root) | Replaced passive CocoIndex bullet with active 3-line decision tree; updated Code Search workflow row |
| `.claude/CLAUDE.md` | Added "Tool Routing Enforcement" section with hook-injected routing explanation |
| `.codex/CODEX.md` | Created with tool routing enforcement table and anti-patterns |
| `.gemini/GEMINI.md` | Created with tool routing enforcement table and anti-patterns |

### Agent Files (4 files)

| File | Changes |
|------|---------|
| `.opencode/agent/context-prime.md` | Added Tool Routing table to Prime Package output |
| `.claude/agents/context-prime.md` | Added Tool Routing table to Prime Package output |
| `.codex/agents/context-prime.md` | Added Tool Routing table to Prime Package output |
| `.agents/agents/context-prime.md` | Added Tool Routing table to Prime Package output |

</details>

---

---

## Deep Review Fixes (2026-04-01)

### Code Fix
- **PrimePackage graph routing conditional** -- `buildPrimePackage()` now suppresses "structural queries → code_graph_query" when `codeGraphStatus === 'empty'`

### Doc Fixes
- Checklist items checked (28/30 verified)
- implementation-summary.md filled with actual implementation details
- Spec paths corrected (.gemini/GEMINI.md → GEMINI.md)
- routingRules contract aligned to structured object (graphRetrieval, communitySearch, toolRouting)

## Upgrade

No migration required. All changes are additive enforcement layers. Existing tool behavior is unchanged -- the enforcement only guides the AI's tool selection, it does not block or modify any tool calls.
