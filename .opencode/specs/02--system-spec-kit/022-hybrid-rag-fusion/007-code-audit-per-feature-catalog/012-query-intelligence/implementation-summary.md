---
title: "Implementation Summary: Code Audit — Query Intelligence"
description: "11 features audited: 8 MATCH, 3 PARTIAL, 0 MISMATCH"
trigger_phrases:
  - "implementation summary"
  - "query intelligence"
  - "code audit"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: Code Audit — Query Intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-code-audit-per-feature-catalog/012-query-intelligence |
| **Completed** | 2026-03-22 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 11 query intelligence features were audited — complexity routing, score fusion, channel enforcement, confidence truncation, token budgets, query expansion, LLM reformulation, HyDE, surrogates, decomposition, and graph concept routing. Eight are perfectly documented. Three have flag default contradictions or missing source files.

### Audit Results

11 features audited: 8 MATCH, 3 PARTIAL, 0 MISMATCH.

### Per-Feature Findings

1. Complexity router, RSF shadow, channel-min-rep, confidence truncation, token budget, query expansion, decomposition, graph concept routing: all MATCH
2. LLM reformulation (F07): `llm-reformulation.ts` header (line 17) says "default: FALSE" but `isLlmReformulationEnabled()` (search-flags.ts:323) via `isFeatureEnabled()` (rollout-policy.ts:42) defaults ON for undefined env vars at rollout=100%
3. HyDE (F08): `hyde.ts` header (line 23) says "default: FALSE" but `isHyDEEnabled()` (search-flags.ts:332) uses same `isFeatureEnabled()` pattern — defaults ON. Same contradiction as F07
4. Query surrogates (F09): `matchSurrogates()` defined in `query-surrogates.ts` (line 460), not `surrogate-storage.ts`. TODO at lines 405-408 confirms not wired into search pipeline. Only called from tests
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit was executed by dispatching 2 Opus research agents (parallel) to read feature catalog entries and verify against source code, followed by 2 Sonnet documentation agents (parallel) to update spec folder documents with findings. All agents operated as LEAF nodes at depth 1 under single-hop orchestration.

Each feature was verified by:
1. Reading the feature catalog entry
2. Locating referenced source files in the MCP server codebase
3. Comparing catalog behavioral descriptions against actual implementation
4. Documenting findings as MATCH, PARTIAL, or MISMATCH
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flag header/runtime contradictions as a systemic pattern | `isFeatureEnabled()` in rollout-policy.ts:42 treats undefined env vars as enabled at rollout=100%. Module headers in llm-reformulation.ts:17, hyde.ts:23, and query-surrogates.ts:6 all say "default: FALSE/OFF" but runtime behavior is ON |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All features audited | PASS — 11/11 features verified |
| Source files verified | PASS — all referenced files confirmed to exist on disk |
| Findings documented | PASS — per-feature findings in spec.md AUDIT FINDINGS section |
| Tasks completed | PASS — all tasks marked [x] in tasks.md |
| Checklist verified | PASS — all P0/P1 items verified in checklist.md |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **matchSurrogates() in query-surrogates.ts (line 460) is not wired into the search pipeline at query time** — TODO comment at lines 405-408 confirms this. Only called from test file `query-surrogates.vitest.ts`, never from `stage1-candidate-gen.ts` or `hybrid-search.ts`
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation for code audit phase.
Written in active voice per HVR rules.
-->
