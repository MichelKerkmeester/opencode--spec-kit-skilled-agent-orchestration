---
title: "Resource Map: 027 memory_context Structural Channel Routing Research"
description: "Path ledger for 5-iter deep research on fusing code_graph_query as a routing channel inside memory_context."
trigger_phrases:
  - "027-memory-context-structural-channel-research resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research"
    last_updated_at: "2026-04-29T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored lean resource-map for today batch"
    next_safe_action: "Reference for blast-radius audit; refresh on next material change"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 23
- **By category**: Specs=5, Documents=5, Scripts-cited=8, Meta=5
- **Missing on disk**: 0
- **Scope**: Files created during packet `026/011/027-memory-context-structural-channel-research` (commit `cb19d4cb3`) plus cited evidence sources.
- **Generated**: 2026-04-29T10:10:00+02:00

---

## 1. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `research/research-report.md` | Created | OK | 9-section synthesis + Planning Packet for L2 implementation phase |
| `research/deep-research-strategy.md` | Created | OK | Iteration focus map |
| iteration files (5 sibling files in research/iterations/) | Created | OK | Per-iter externalized findings (5 files) |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/research-report.md` | Cited | OK | Phase J context (predecessor research) |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md` | Cited | OK | v1.0.3 corpus referenced for RQ1 false-positive analysis |

---

## 2. Cited Scripts (read-only research evidence)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Cited | OK | `memory_context` (line 48) + `memory_search` (line 55) + `code_graph_query` (line 573) descriptions |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Cited | OK | Advisor structural-intent nudge logic at lines 226-340 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Cited | OK | Routing handler reviewed for RQ1 + RQ3 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Cited | OK | Envelope build site (lines 1100-1200) |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` | Cited | OK | `code_graph_query` response shape |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts` | Cited | OK | Envelope contract for RQ3 routing-trace coverage |
| `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts` | Cited | OK | QueryPlan: intent + selectedChannels + skippedChannels + routingReasons |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Cited | OK | Existing intent classifier reference |

---

## 3. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `spec.md` | Created | OK | Level 2 research charter |
| `plan.md` | Created | OK | Plan |
| `tasks.md` | Created | OK | Task ledger |
| `implementation-summary.md` | Created | OK | Disposition |
| `.../027/description.json` | Created | OK | Continuity index |

---

## 4. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.../027/graph-metadata.json` | Created | OK | Graph rollout metadata |
| `.../027/research/deep-research-config.json` | Created | OK | Loop config (cli-codex gpt-5.5 xhigh normal, 5 iters) |
| `.../027/research/deep-research-state.jsonl` | Created | OK | State log: init + 5 iters + synthesis_complete |
| `.../027/research/deltas/iteration-001..005.jsonl` | Created | OK | Per-iter delta records (5 files) |
| Phase E gold battery measurements | Cited | OK | `.../000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements/` referenced for RQ1 baseline |
