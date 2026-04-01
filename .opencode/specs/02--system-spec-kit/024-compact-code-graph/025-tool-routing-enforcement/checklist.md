---
title: "Checklist: Tool Routing Enforcement [025/024]"
description: "Verification checklist for tool routing enforcement across all CLI runtimes."
trigger_phrases:
  - "tool routing checklist"
  - "enforcement verification"
importance_tier: "normal"
contextType: "verification"
---
# Checklist: Phase 025 — Tool Routing Enforcement

## P0 — Blockers

- [ ] `buildServerInstructions()` output contains "## Tool Routing" section
- [ ] Server instructions mention CocoIndex for semantic search
- [ ] Server instructions mention Code Graph for structural queries
- [ ] Server instructions mention Grep for exact text/regex
- [ ] Routing section is under 200 tokens
- [ ] `PrimePackage` interface includes `routingRules: string[]`
- [ ] PrimePackage populated with >= 3 routing rules when tools available
- [ ] All 4 CLIs receive routing rules via MCP server instructions

## P1 — Required

- [ ] Constitutional memory `gate-tool-routing.md` created and indexed
- [ ] Constitutional memory surfaces on code search queries
- [ ] Tool description for `code_graph_query` includes "Use INSTEAD of Grep" guidance
- [ ] Root `CLAUDE.md` has active decision tree (not passive "MUST use")
- [ ] `.claude/CLAUDE.md` has hook-aware routing reinforcement
- [ ] `.codex/CODEX.md` has non-hook routing enforcement
- [ ] `.gemini/GEMINI.md` has partial-hook routing enforcement
- [ ] Context-prime agent outputs include routing decision tree

## P2 — Nice to Have

- [ ] Tool response hints fire on detected code-search misjudgment
- [ ] Hints are non-blocking (suggestions only)
- [ ] Session snapshot includes `cocoIndexAvailable` boolean
- [ ] Session snapshot includes `routingRecommendation` string

## Testing

- [ ] Unit test: `buildServerInstructions()` contains routing section
- [ ] Unit test: PrimePackage includes `routingRules` with >= 3 entries
- [ ] Integration test: hint fires when semantic search pattern detected
- [ ] Grep verification: all runtime instruction files contain enforcement
- [ ] Manual: fresh Claude Code session uses CocoIndex for "find code about X"
