---
title: "Decision Record: Tool Routing Enforcement [025/024]"
description: "Architecture decisions for enforcing CocoIndex and Code Graph usage across all CLI runtimes."
trigger_phrases:
  - "tool routing decisions"
  - "enforcement architecture"
importance_tier: "normal"
contextType: "decision"
---
# Decision Record: Phase 025 — Tool Routing Enforcement

## DR-001: Enforcement at MCP Layer, Not Just Instruction Files

**Decision**: Add tool-routing enforcement to `buildServerInstructions()` and `PrimePackage` at the MCP server level, rather than relying solely on CLAUDE.md/runtime instruction files.

**Context**: AI assistants across all runtimes consistently default to Grep/Glob for code searches despite CLAUDE.md explicitly stating "MUST use CocoIndex." The root cause is that instruction files are passive — the AI reads them once and then makes tool selection decisions based on built-in preferences. MCP server instructions and tool response hints are injected at the point of decision, making them harder to ignore.

**Alternatives Considered**:
1. **Stronger CLAUDE.md language only** — Rejected: already tried ("MUST use"), doesn't work because instruction files compete with built-in AI tool preferences
2. **Dedicated `tool_routing_check` MCP tool** — Rejected: adds another tool the AI might skip; enforcement should be embedded, not optional
3. **Block Grep/Glob entirely** — Rejected: they're the correct tool for exact text search; the problem is routing, not the tools themselves
4. **Pre-tool validation hook** — Rejected: Claude Code hooks fire on tool calls but can't redirect to a different tool mid-call

**Consequences**: MCP server instructions grow by ~200 tokens per session. PrimePackage grows by ~100 tokens. These are acceptable costs for reliable routing.

---

## DR-002: Three-Layer Enforcement Model

**Decision**: Implement enforcement at three layers: (1) server instructions (proactive), (2) session priming (per-session), (3) tool response hints (reactive).

**Context**: No single enforcement point is reliable across all runtimes. Server instructions work for all CLIs but are only read at session start. Session priming works for hook-compatible CLIs and MCP auto-prime. Tool response hints work reactively when misjudgment is detected.

**Rationale**: Defense in depth — if one layer is missed or ignored, the next layer catches it.

---

## DR-003: Constitutional Memory for Persistent Routing

**Decision**: Create a constitutional-tier memory (`gate-tool-routing.md`) that is ALWAYS surfaced at the top of every `memory_search` result.

**Context**: Constitutional memories bypass similarity scoring — they appear on every search. This ensures that even if server instructions and priming are missed, the routing decision tree appears when the AI uses any memory tool.

**Trade-off**: Adds ~150 tokens to every memory search result. Acceptable given the frequency and cost of misjudgment.

---

## DR-004: Hints Not Blocks

**Decision**: Tool response hints suggest the correct tool but do not block the current tool call.

**Context**: Blocking would break the tool call flow and could cause confusion. Hints allow the AI to course-correct on the next action. This matches the existing `hints` array pattern used in other tool responses.

**Consequences**: The AI may still ignore hints in some cases. This is acceptable — the goal is to reduce misjudgment frequency, not eliminate it with 100% certainty.
