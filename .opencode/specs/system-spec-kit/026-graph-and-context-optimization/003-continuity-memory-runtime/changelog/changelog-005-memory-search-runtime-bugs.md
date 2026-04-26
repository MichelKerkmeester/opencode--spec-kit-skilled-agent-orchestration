---
title: "Changelog: 005-memory-search-runtime-bugs"
description: "Findings packet cataloguing 17 /memory:search runtime defects, plus Cluster 1-3 P0 fixes (intent classifier, truncation wrapper, vocabulary enforcement) and post-remediation verification surfacing two new defect candidates."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
  - "005-memory-search-runtime-bugs changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs` (Level 1)
> Parent packet: `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime`

### Summary

Live `/memory:search` invocation against the indexed-continuity runtime exposed 17 defects across the retrieval, output rendering, and causal-graph subcommands. The packet captures findings with reproducible MCP probe evidence, organizes the 17 defects into 7 root-cause clusters, and lands the three P0 cluster fixes inline (intent classifier confidence floor, memory_context truncation guard, vocabulary enforcement). A post-remediation verification pass run during sibling 006 sweep dispatch revealed the P0 source patches were not yet active in the running MCP daemon, and surfaced two additional defect candidates (cocoindex mirror-folder duplicates, research-markdown outranking implementation source).

### Added

- 17 defect catalogue (REQ-001..017) with severity tags (4 P0, 7 P1, 6 P2)
- 7 root-cause clusters in plan.md grouping the 17 defects for staged remediation
- Five live MCP probes captured verbatim in spec.md §7 for regression detection
- POST-REMEDIATION VERIFICATION block with three new probes (A, B, C) showing parallel-agent fixes are not active in the running daemon
- Two new defect candidates: REQ-018 cross-mirror duplicate suppression, REQ-019 source-vs-markdown ranking imbalance

### Changed

- Intent classifier (`mcp_server/lib/search/intent-classifier.ts`) — added centroid-only confidence floor at 0.30 for the no-keyword-match fallback, preserving the legacy 0.08 floor for single-keyword classification so 80%-accuracy regression suite continues to pass
- memory_context wrapper (`mcp_server/handlers/memory-context.ts`) — added an under-budget early return (when actualTokens / budgetTokens < 0.50) and a preserved-survivors snapshot path through structural truncation so the empty-payload bug no longer fires
- Canonical command spec (`.opencode/command/memory/search.md` §4A Step 4b) — added a Forbidden Phrase Enforcement subsection with literal substitution table covering Auto-triggered memories, Triggered memories, Constitutional memories, and the standalone Memories header, plus a regression-safe verification grep
- Dual-classifier output now annotated with classificationKind: meta.intent is task-intent (authoritative for rendering), data.queryIntentRouting is backend-routing (authoritative for channel selection only)

### Fixed

- REQ-001 / REQ-004 / REQ-016: Semantic Search no longer routes to fix_bug intent at confidence 0.098. Inline classifyIntent probes confirm understand fallback fires when keyword + pattern evidence is empty
- REQ-002: memory_context.enforceTokenBudget no longer returns count:0,results:[] when token usage is well under budget. Returned-count metadata now derives from the actual emitted payload
- REQ-003: render output vocabulary aligned with spec, with grep-based verification command published in the spec

### Verification

- All targeted vitest suites green: token-budget-enforcement, memory-context, handler-causal-graph, intent-classifier, intent-routing, gate-d-regression-intent-routing (200 passing tests)
- Inline runtime probes via node against the freshly-built dist/ confirmed: classifyIntent("Semantic Search") returns understand (was fix_bug at 0.098); enforceTokenBudget under-budget returns truncated:false with full results preserved
- Strict spec validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` passed with 0 errors and 0 warnings
- Live post-remediation MCP probe captured 2026-04-26 18:49 shows the running daemon still serves pre-fix behavior. dist/ rebuild AND/OR MCP daemon restart needed to make the P0 fixes effective

### Files Changed

| File | Action | Purpose |
| ---- | ------ | ------- |
| `005-memory-search-runtime-bugs/spec.md` | Create | Bug catalog (REQ-001..017), live probe evidence in §7, plus new candidates REQ-018/019 |
| `005-memory-search-runtime-bugs/plan.md` | Create | 7 root-cause clusters with change surface and verification per cluster |
| `005-memory-search-runtime-bugs/tasks.md` | Create | Findings-packet tasks (T0.1-T0.7) plus deferred remediation tasks (T1-T7) |
| `005-memory-search-runtime-bugs/implementation-summary.md` | Create | Implementation summary with Cluster 1-3 outcome detail |
| `005-memory-search-runtime-bugs/description.json` | Create | Memory-indexer metadata |
| `005-memory-search-runtime-bugs/graph-metadata.json` | Create | Graph traversal metadata |
| `mcp_server/lib/search/intent-classifier.ts` | Modify | Centroid-only 0.30 confidence floor for no-evidence intents |
| `mcp_server/handlers/memory-context.ts` | Modify | Under-budget early return plus preserved-survivors snapshot in fallbackToStructuredBudget |
| `.opencode/command/memory/search.md` | Modify | Forbidden Phrase Enforcement subsection in §4A Step 4b |

### Follow-Ups

- Rebuild `mcp_server/dist/` and restart the MCP daemon so the Cluster 1-3 source patches take effect in the running runtime (verification pass shows pre-fix behavior still served as of 2026-04-26 18:49)
- Schedule a Cluster 4-7 remediation packet to consume the P1/P2 clusters from plan.md (causal-stats hygiene, state hygiene, folder discovery, channel health, quality fallback, edge growth)
- Add new defect candidates REQ-018 (cocoindex cross-mirror dedup) and REQ-019 (source-vs-markdown ranking) to a follow-up cocoindex packet
- Re-run the spec §7 probes A/B/C after the next dist rebuild to confirm Cluster 1-3 fixes are live
