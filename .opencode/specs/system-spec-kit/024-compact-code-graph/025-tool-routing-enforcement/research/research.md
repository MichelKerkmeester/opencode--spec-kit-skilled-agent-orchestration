# Deep Research: Tool Routing Enforcement

## 1. Executive Summary

AI assistants across all CLI runtimes (Claude Code, Codex CLI, Copilot CLI, Gemini CLI) consistently default to Grep/Glob for code search tasks even when CocoIndex (semantic) and Code Graph (structural) are available. The root cause is a **passive instruction model**: CLAUDE.md says "MUST use CocoIndex" but this competes with built-in AI preferences for fast, familiar tools. There is no active enforcement at the MCP layer where tool selection decisions are made.

**Solution**: A 3-layer enforcement model injecting routing rules at (1) MCP server instructions (proactive, universal), (2) session priming/PrimePackage (per-session), and (3) tool response hints (reactive). Estimated 327-497 LOC across 15 files.

---

## 2. Root Cause Analysis

### The Decision Path (Iteration 1)

The AI's tool selection follows this layered priority:
1. **Runtime instruction files** (CLAUDE.md, CODEX.md, GEMINI.md) — strongest explicit policy, but passive
2. **MCP server instructions** (`buildServerInstructions()` via `setInstructions()`) — pre-tool-call, but currently contains only memory stats and session recovery
3. **MCP tool descriptions** (`ListToolsRequestSchema`) — per-tool capability summaries, no routing guidance
4. **PrimePackage** — post-first-tool hints only; cannot prevent initial misjudgment
5. **AI built-in preferences** — defaults to Grep/Glob (fast, familiar, always available)

**Key insight**: The only pre-tool-call MCP surface that reaches ALL CLIs is `buildServerInstructions()`, and it currently contains zero routing rules.

### The Hook vs Non-Hook Gap (Iteration 2)

| Runtime | Hook Support | Priming Path | Routing Guidance |
|---------|-------------|--------------|------------------|
| Claude Code | Full hooks | SessionStart hook + MCP auto-prime | Hook payload + instruction files (passive) |
| Codex CLI | No hooks | MCP auto-prime only | CODEX.md routing table (passive) |
| Copilot CLI | No hooks | MCP auto-prime only | None (relies on CLAUDE.md) |
| Gemini CLI | Partial hooks | Hook + MCP auto-prime | GEMINI.md code-search protocol (passive) |

**Key insight**: Hook-compatible CLIs differ only in timing (hooks fire earlier), not in routing content quality. The MCP priming payload is identical across all runtimes and lacks routing directives.

---

## 3. Enforcement Architecture

### Layer 1: MCP Server Instructions (Universal, Proactive)

`buildServerInstructions()` in `context-server.ts:605-646` is the primary injection point. It runs once at startup and reaches ALL CLIs via `server.setInstructions()`.

**Current output**: Memory counts, search channels, key tools, session recovery digest.
**Missing**: Tool routing decision tree.

**Proposed addition** (~15 lines, <200 tokens):
```
## Tool Routing
- Semantic/concept search (how does X work, find code about Y) → CocoIndex (mcp__cocoindex_code__search)
- Structural queries (callers, imports, dependencies, outline) → code_graph_query / code_graph_context
- Exact text/regex/known path → Grep / Glob
- CocoIndex: [available/unavailable] | Code Graph: [fresh/stale/empty]
- If graph stale/empty: prefer CocoIndex until code_graph_scan restores health
```

### Layer 2: Session Priming (Per-Session)

Extend `PrimePackage` interface with `routingRules: string[]`:
- Populated based on CocoIndex availability + Code Graph freshness
- Rendered in `injectSessionPrimeHints()` for 2nd+ tool decisions
- `SessionSnapshot` already has `cocoIndexAvailable`; only `routingRecommendation` needs adding

### Layer 3: Tool Response Hints (Reactive)

Inject soft routing hints into `envelope.hints` when:
- `memory_search` called with semantic code query patterns → hint: "Consider CocoIndex for code search"
- `memory_context` called with structural query patterns → hint: "Consider code_graph_query"
- Hints are non-blocking suggestions, not errors

### Layer 4: Constitutional Memory (Always-On)

New `gate-tool-routing.md` constitutional memory:
- Surfaces at top of EVERY `memory_search` result
- Decision tree: semantic → CocoIndex, structural → Code Graph, exact → Grep
- Separated from `gate-enforcement.md` by concern (gates vs routing)
- ~150 tokens, imperative language

### Layer 5: Runtime Instruction Updates

Replace passive "MUST use" with active IF/THEN decision trees in:
- `CLAUDE.md` (root), `.claude/CLAUDE.md`, `CODEX.md`, `GEMINI.md`
- All 4 `context-prime.md` agent copies

---

## 4. Query Classification (Iteration 3)

Reliable patterns for routing:

| Category | Indicators | Route To |
|----------|-----------|----------|
| **Semantic** | "find code about", "how does X work", "implementations of", "related to" | CocoIndex |
| **Structural** | "what calls", "callers of", "imports from", "dependencies", "outline" | Code Graph |
| **Exact text** | Quoted strings, regex patterns, specific function names, file paths | Grep/Glob |

The codebase already has a query-intent classifier at `lib/code-graph/query-intent-classifier.ts` that handles structural vs semantic. Missing: exact-text/path layer that should run first as an escape hatch.

---

## 5. Implementation Blueprint (Iteration 10)

### File List with LOC Estimates

| Order | File | Est. LOC | Change |
|-------|------|-------:|--------|
| 1 | `mcp_server/lib/session/session-snapshot.ts` | 8-15 | Add `routingRecommendation` (cocoIndexAvailable already exists) |
| 2 | `mcp_server/hooks/memory-surface.ts` | 28-40 | Extend PrimePackage with `routingRules: string[]` |
| 3 | `mcp_server/context-server.ts` | 85-110 | Tool Routing in buildServerInstructions() + reactive hints in envelope |
| 4 | `mcp_server/tool-schemas.ts` | 18-30 | Routing guidance in code_graph_* descriptions |
| 5 | `constitutional/gate-tool-routing.md` | 25-35 | New constitutional memory |
| 6 | `CLAUDE.md` (root) | 10-16 | Active decision tree |
| 7 | `.claude/CLAUDE.md` | 6-10 | Hook-aware routing reinforcement |
| 8 | `CODEX.md` | 8-12 | Active decision tree |
| 9 | `GEMINI.md` | 8-12 | Active decision tree |
| 10-13 | `context-prime.md` (x4) | 8-12 each | Routing block in output format |
| 14 | `tests/context-server.vitest.ts` | 30-45 | Server instructions + hint assertions |
| 15 | `tests/memory-surface-routing.vitest.ts` (new) | 65-90 | PrimePackage + routing classifier tests |
| **Total** | | **327-463** | |

**With hook-startup consistency add-ons** (recommended):
- `hooks/claude/session-prime.ts` (+12-18 LOC)
- `hooks/gemini/session-prime.ts` (+10-16 LOC)
- **Total with add-ons: 349-497 LOC**

### Dependency Ordering

1. Session snapshot extension (smallest shared state change)
2. PrimePackage extension (upstream data model)
3. context-server.ts updates (consumes snapshot + PrimePackage)
4. tool-schemas.ts (align catalog with implementation)
5. Constitutional memory (reflect final routing language)
6. Runtime docs + agent copies (consume canonical decision tree)
7. Hook startup scripts (close first-turn inconsistency)
8. Tests + grep verification (validate all layers)

---

## 6. Key Corrections from Research

1. **`cocoIndexAvailable` already exists** in both `SessionSnapshot` and `PrimePackage` — only `routingRecommendation` and `routingRules` need adding
2. **Spec file paths partially wrong**: real files are `CODEX.md` and `GEMINI.md` at repo root, not `.codex/CODEX.md` and `.gemini/GEMINI.md`
3. **4 context-prime copies** (not 5): `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.agents/agents/` — no `.gemini/agents/` exists
4. **Reactive hints should use existing `envelope.hints` pipeline**, not a new response wrapper

---

## 7. Risk Assessment

| Layer | Risk | Mitigation |
|-------|------|------------|
| Server instructions | Low — additive, startup-only | Keep <200 tokens, availability-aware |
| PrimePackage | Low-Med — shape duplicated in 2 files | Add routingRules in both places in same commit |