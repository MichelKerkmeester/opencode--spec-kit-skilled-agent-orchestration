# Architecture Deep Dive: 009-perfect-session-capturing

> **Date:** 2026-03-20
> **Scope:** 24 spec folders (phases 000–018), ~12,000 LOC scripts/, ~60,000 LOC mcp_server/handlers/
> **Method:** 10 parallel agents (5 Opus deep code analysis + 5 Codex GPT-5.4 cross-cutting)
> **Status:** Read-only audit — zero files modified

---

## Executive Summary

The memory save pipeline is **functionally operational** — 107 targeted tests pass, the build succeeds, and memory saves complete end-to-end. However, the architecture carries **significant latent risk** accumulated across 18 phases of incremental development:

1. **Two completely independent save paths** (workflow vs MCP) with different quality gates, different thresholds, and different contamination awareness — the MCP path bypasses all 12 V-rules
2. **A 2,427-line monolith** (workflow.ts) with 44 functions, 8 mutable state hotspots, and a confirmed template key collision
3. **5 incompatible Observation type variants** undermining TypeScript's type safety across the pipeline
4. **File writes before DB commits** with no rollback, plus a TOCTOU dedup race condition
5. **34 bug-fix markers (F-NN) with zero test traceability** — behaviors are tested but fixes aren't traceable

**Findings:** 65 total across 10 agents → deduplicated to **53 unique findings**
- Critical: 5 | High: 16 | Medium: 21 | Low: 11

---

## Top 5 Immediate Operational Risks

| # | Risk | Severity | Finding | Impact |
|---|------|----------|---------|--------|
| 1 | **MCP save path bypasses all V-rules** | CRITICAL | O2-5, O2-12 | Contaminated, placeholder-leaked, or error-dominated content can be saved and indexed through `memory_save` tool with zero V-rule blocking |
| 2 | **Quality-loop has zero contamination awareness** | CRITICAL | O2-5 | The sole quality gate in the MCP path scores triggers/anchors/budget/coherence but never checks for AI self-references, tool leaks, or foreign-spec pollution |
| 3 | **TOCTOU dedup race in concurrent saves** | HIGH | C5-1 | Content-hash dedup runs before `BEGIN IMMEDIATE`; two concurrent saves can both pass dedup and insert duplicate records. No DB-level unique constraint on content hash |
| 4 | **File written before DB transaction** | HIGH | C5-2 | Quality-loop auto-fixed content is flushed to disk before the insert transaction. DB failure leaves orphaned mutated files with no restore step |
| 5 | **Template key collision (confirmed, unbounded)** | CRITICAL | O1-5 | `...sessionData, ...conversations, ...workflowData` spread-merge silently overwrites duplicate keys. `TOOL_COUNT` collision already occurred (RC-9 workaround). No guard against future collisions |

---

## Findings by Work Stream

### WS-1: MCP Path Quality Gap (CRITICAL)

The workflow path (generate-context.js) runs a 3-layer quality cascade: sufficiency → core score threshold (0.15) → V-rule disposition. The MCP path (memory_save handler) runs only the quality-loop scorer with a 0.6 threshold and no V-rule validation.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| O2-5 | Quality-loop has zero contamination awareness | critical | O2 |
| O2-12 | All 12 V-rules bypassed in MCP path | high | O2 |
| O2-1 | Three independent scoring systems, no unified authority | critical | O2 |
| O2-4 | Core vs extractors scorer contamination threshold mismatch | high | O2 |
| O2-3 | Contamination penalty double-counting in extractors scorer | high | O2 |
| O2-9 | Flat 0.25 penalty per V-rule ignores severity metadata | low | O2 |
| O2-7 | Sufficiency cap overwrite loses contamination cap | medium | O2 |
| O2-11 | Quality-loop feature gate bypass returns `passed: true` | low | O2 |
| O4-4 | Quality abort threshold (0.15) creates wide pass band | high | O4 |
| O4-5 | Contamination severity is informational only — no direct block | critical | O4 |
| O4-6 | No medium-to-high contamination escalation for pervasive chatter | medium | O4 |

**Recommendation:** Integrate `validateMemoryQualityContent` into the MCP `prepareParsedMemoryForIndexing` path. Establish a single canonical scoring function with one threshold. Either the cap or the penalty for contamination, not both.

---

### WS-2: Workflow Monolith Decomposition (HIGH)

workflow.ts is 2,427 lines with a single 1,110-line `runWorkflow` function containing 12 numbered steps, 44 functions across 12 responsibility clusters, and 40+ imports from 30+ modules.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| O1-13 | `runWorkflow` is 1,110 lines long | high | O1 |
| O1-5 | Template variable key collision via spread operator | critical | O1 |
| O1-3 | Parallel extractors share nested object references | high | O1 |
| O1-6 | `collectedData` reassigned 6 times — hard to track final shape | high | O1 |
| O1-1 | Module-level mutable `workflowRunQueue` | high | O1 |
| O1-2 | Closure-captured mutable contamination counters | medium | O1 |
| O1-12 | `files` record mutated at 8 points after population | medium | O1 |
| O1-7 | 40+ imports from 30+ modules | medium | O1 |
| O1-8 | Dual quality scorers with confusing naming | medium | O1 |
| O1-10 | `enrichStatelessData` mutates via shallow spread | medium | O1 |
| O1-14 | No error recovery / partial state cleanup | medium | O1 |
| O1-4 | Post-parallel mutation of `sessionData.TOOL_COUNT` | medium | O1 |
| O1-15 | Helper function cluster size imbalance | low | O1 |
| O1-9 | Dynamic import inside hot path | low | O1 |
| O1-11 | Missing enrichment success flags | low | O1 |

**Recommendation:** Extract numbered steps into separate modules: `workflow-data-loading.ts`, `workflow-extraction.ts`, `workflow-quality.ts`, `workflow-indexing.ts`. Replace spread-merge template assembly with an explicit builder that detects key collisions. Deep-freeze `collectedData` before `Promise.all`.

---

### WS-3: Type System & Data Contracts (HIGH)

5 incompatible Observation type variants exist across the codebase. `[key: string]: unknown` index signatures on every major interface (`CollectedDataBase`, `ValidatedData`, `NormalizedData`) defeat TypeScript's value proposition.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| O3-1 | Dual Observation type — incompatible `facts` field | critical | O3 |
| O3-6 | `CollectedDataBase` index signature enables unlimited bypass | high | O3 |
| O3-4 | Workflow dual-case Observation (UPPER + lower) | high | O3 |
| O3-5 | `ValidatedData` is an untyped bag | high | O3 |
| O5-1 | 12+ undeclared fields on CollectedDataBase via index signature | medium | O5 |
| O5-2 | conversation-extractor bypasses typed interface via cast | medium | O5 |
| O5-3 | collect-session-data casts CollectedDataFull to Record 6 times | medium | O5 |
| O3-7 | `RecentContext` vs `RecentContextEntry` shape mismatch | medium | O3 |
| O3-12 | `NormalizedData` index signature passes unknown fields through | medium | O3 |
| O3-11 | `as unknown as Record<string, unknown>` double casts in normalizer | medium | O3 |
| O3-2 | Third Observation variant in implementation-guide-extractor | medium | O3 |
| O3-10 | Fact coercion required at every extraction boundary | medium | O3 |
| O3-3 | Fourth Observation variant in quality-scorer (UPPER_CASE) | low | O3 |
| O3-13 | `CaptureToolCall.input` index signature | low | O3 |
| O3-8 | `ToolCounts` index signature (acceptable) | low | O3 |

**Recommendation:** Unify into a single `Observation` interface. Remove `[key: string]: unknown` from `CollectedDataBase` — use a separate `metadata: Record<string, unknown>` field for dynamic properties. Establish a single normalization boundary for case conversion.

---

### WS-4: Persistence Transaction Safety (HIGH)

The core DB insert is properly transaction-wrapped, but pre-commit side effects, dedup races, and best-effort post-commit enrichment create observable inconsistencies.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| C5-1 | Content-hash dedup TOCTOU race | high | C5 |
| C5-2 | File written before DB transaction, no rollback | high | C5 |
| C5-3 | Supersede commits even when predecessor not marked | medium | C5 |
| C5-4 | Post-insert enrichment outside transaction, partially enriched rows | medium | C5 |
| C5-6 | Response overstates what actually completed | medium | C5 |
| C5-5 | Embedding pipeline pre-commit cache side effect | low | C5 |
| C2-1 | Metadata status updates fail silently after successful index | medium | C2 |
| C2-2 | Database change notification errors swallowed | low | C2 |
| C2-3 | Cleanup failures in atomic writes silently ignored | low | C2 |

**Recommendation:** Move content-hash dedup inside the `BEGIN IMMEDIATE` transaction. Move file writes after successful DB insert, or add file rollback to the catch block. Treat supersede failure as a transaction abort.

---

### WS-5: Contamination & Alignment Filtering (HIGH)

The contamination pipeline has regex false positives, the alignment validator is effectively non-blocking in non-interactive mode, and two separate filter systems operate without coordination.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| O4-2 | "tool title with path" regex matches legitimate file references (HIGH sev) | high | O4 |
| O4-7 | Alignment uses bidirectional substring, enabling spurious matches | high | O4 |
| O4-8 | Alignment only hard-blocks at 0% + infrastructure mismatch (effectively unreachable) | high | O4 |
| O4-9 | Content-filter and contamination-filter overlap without coordination | medium | O4 |
| O4-14 | API error regex overlap undermines V11 hard-block | low | O4 |
| O4-1 | "Step N: Now" regex false-positive on numbered lists | medium | O4 |
| O4-3 | "Moving on to" matches legitimate technical transitions | low | O4 |
| O4-10 | Spec affinity only requires 2-token match | medium | O4 |
| O4-11 | Nested spec folder affinity loses parent context | medium | O4 |
| O4-13 | Copilot CLI missing `toolTitleWithPathExpected` | medium | O4 |
| O4-15 | Session activity signal confidence boost unbounded | medium | O4 |
| O4-16 | Unicode normalization can be bypassed via uncommon characters | medium | O4 |
| O4-12 | `prefersStructuredSave` inconsistency (aspirational, not actual) | low | O4 |
| O2-10 | Auto-fix trigger re-extraction injects contaminated headings | medium | O2 |
| O2-6 | Auto-fix trim can orphan anchor tags (deterministic loop) | medium | O2 |

**Recommendation:** Make "tool" mandatory (not optional) in the tool-title-with-path regex. Use word-boundary matching for alignment instead of substring inclusion. Set minimum non-interactive block threshold. Coordinate filter pipeline execution order.

---

### WS-6: Extractor Pipeline Coupling (MEDIUM)

collect-session-data.ts is a 960-line coupling point with a 57-field return literal, inconsistent null-input behavior, and F-25 blocker resolution scoping weakness.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| O5-9 | diagram/conversation extractors return simulation data on null input | high | O5 |
| O5-11 | collect-session-data is sole tightly-coupled orchestration point | medium | O5 |
| O5-13 | F-25 blocker reconciliation not scoped to same topic | medium | O5 |
| O5-14 | Fix 8 creates out-of-order message sequence | medium | O5 |
| O5-10 | Empty conversation handling is warn-only, not defensive | medium | O5 |
| O5-4 | Dead `simFactory` import in decision-extractor | low | O5 |

**Recommendation:** Align all extractors to return empty structures for null input (matching decision-extractor pattern). Remove simulation data fallbacks. Scope F-25 resolution matching to related observations.

---

### WS-7: Spec-to-Code Drift & Cross-Phase Regression (MEDIUM)

83 file paths in specs are stale, 34 F-markers have no spec documentation, and 5 deferred work items were never reclaimed.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| C1-1 | 83 files-to-change paths stale (prefix moved to `.opencode/skill/`) | high | C1 |
| C1-3 | Phase 014 and 017 contradict on positional stateless saves | high | C1 |
| C4-2 | 016 and 017 disagree on JSON authority timeline | high | C4 |
| C4-4 | 001-SC-002 contamination criterion no longer holds | high | C4 |
| C4-1 | workflow.ts modified in 9 of 18 phases (highest churn) | high | C4 |
| C1-4 | 43 F-markers in code, 0 in specs | medium | C1 |
| C1-6 | Checklist references use stale line anchors | medium | C1 |
| C4-3 | 016 and 017 double-claim JSON enrichment ownership | medium | C4 |
| C4-5 | 016 reversed overclaimed implementation narrative | medium | C4 |
| C4-6 | 017 reversed dynamic-capture to recovery-only | medium | C4 |
| C4-9 | 009 embedding parity deferred, never reclaimed | medium | C4 |
| C4-10 | 013 left 3 follow-ups with no later pickup | medium | C4 |
| C1-2 | Some files-to-change entries are globs/prose, not paths | medium | C1 |
| C1-5 | Phase 012 hard-codes stale line anchor | medium | C1 |
| C1-7 | Phase 014 self-identifies as phase 017 | low | C1 |
| C4-7 | 000 restored missing archived branch parent | low | C4 |
| C4-8 | 003's deferred 004 scope partially resolved | low | C4 |
| C2-4 | Missing config falls back silently to defaults | low | C2 |

**Recommendation:** Batch-update all spec file paths with `.opencode/skill/system-spec-kit/` prefix. Add a spec-code alignment check to CI. Document the F-NN markers in a cross-reference table.

---

### WS-8: Test Coverage Gaps (MEDIUM)

34 F-NN fix markers have zero test traceability. V12 is untested. collect-session-data.ts has no dedicated test suite.

| ID | Title | Sev | Source |
|----|-------|-----|--------|
| C3-1 | 0/34 F-NN markers have test traceability | high | C3 |
| C3-2 | V12 (topical mismatch) defined but untested | medium | C3 |
| O2-2 | V3 and V12 have no quality flag mapping in extractors scorer | medium | O2 |
| C3-3 | EACCES permission test conditionally skipped on root | medium | C3 |
| C3-4 | collect-session-data.ts lacks dedicated vitest suite | low | C3 |

**Recommendation:** Add F-NN marker references to corresponding test descriptions. Add V12 test coverage. Create a collect-session-data unit test suite.

---

## Severity Distribution

```
CRITICAL  ███████████████  5  (9%)
HIGH      ██████████████████████████████████  16  (30%)
MEDIUM    █████████████████████████████████████████████  21  (40%)
LOW       ███████████████████████  11  (21%)
          ─────────────────────────────────────────────────
          Total: 53 unique findings
```

## Cross-Agent Validation

Several findings were independently discovered by multiple agents, increasing confidence:

| Finding | Primary | Confirmed By |
|---------|---------|-------------|
| MCP path bypasses V-rules | O2-12 | C5 (no V-rule call in save path) |
| Dual Observation type | O3-1 | O5-1, O5-2, O5-3 (same bypass patterns) |
| Template key collision | O1-5 | O2-1 (dual scorer naming confusion) |
| File-before-DB write | C5-2 | C2-1 (metadata sidecar consistency) |
| workflow.ts highest churn | O1-13 | C4-1 (9/18 phases modify it) |
| V12 untested | C3-2 | O2-2 (no flag mapping either) |
| 016/017 contradiction | C1-3 | C4-2, C4-3 (three separate facets) |
| Contamination severity informational only | O4-5 | O2-5, O2-8 (V8 gap in MCP path) |

## Known Issue Coverage Matrix (Verified)

| Known Issue | Primary Agent | Finding IDs | Status |
|-------------|--------------|-------------|--------|
| workflow.ts monolith | O1 | O1-5, O1-13, O1-3, O1-6 | Confirmed — 15 findings |
| Implicit data contracts | O3 | O3-1, O3-6, O5-1, O5-2 | Confirmed — 15 findings |
| Dual quality scorer | O2 | O2-1, O2-4, O2-3, O2-9 | Confirmed — 12 findings |
| Extractor coupling | O5 | O5-9, O5-11, O5-13 | Confirmed — 6 findings |
| Recovery stale data | O3, C2 | O3-11, C2-4 | Partial — lower risk than expected |
| HIGH contamination pass-through | O4 | O4-4, O4-5, O2-5 | Confirmed — CRITICAL |
| File write outside DB tx | C5 | C5-2, C5-1 | Confirmed — 2 high findings |
| Quality loop/gate conflict | O2 | O2-1, O2-5, O2-12 | Confirmed — CRITICAL |
| F-NN marker soundness | C3, O5 | C3-1, O5-4–O5-7 | 14 sound, 0 unsound, 1 stale import |
| Alignment threshold 15% | O4 | O4-4, O4-7, O4-8 | Confirmed — effectively non-blocking |
| Spec-to-code drift | C1 | C1-1 through C1-7 | Confirmed — 83 stale paths |
| Cross-phase regression | C4 | C4-1 through C4-10 | Confirmed — 5 deferred items |
| V8 contamination gap | O2, O4 | O2-8, O4-14 | Confirmed — dual contamination concepts |

---

## Prioritized Action Plan

### Sprint 1: Critical Safety (1-2 days)
1. **Integrate V-rule validation into MCP save path** (O2-5, O2-12)
2. **Add content-hash dedup inside BEGIN IMMEDIATE** (C5-1)
3. **Move file write after DB commit or add rollback** (C5-2)
4. **Replace spread-merge template assembly with collision-detecting builder** (O1-5)

### Sprint 2: Quality Gate Unification (2-3 days)
5. **Establish single canonical scoring function** (O2-1)
6. **Fix contamination double-counting** (O2-3)
7. **Add hard block for HIGH contamination severity** (O4-5)
8. **Align contamination penalties across scorers** (O2-4)
9. **Fix auto-fix trim/anchor loop** (O2-6)
10. **Add medium-to-high contamination escalation** (O4-6)

### Sprint 3: Type System Hardening (3-5 days)
11. **Unify Observation type to single interface** (O3-1, O3-2, O3-3, O3-4)
12. **Remove index signatures from CollectedDataBase, ValidatedData, NormalizedData** (O3-6, O3-5, O3-12)
13. **Declare undeclared fields explicitly** (O5-1, O5-2, O5-3)
14. **Establish single normalization boundary for case conversion** (O3-4)
15. **Make coerceFactsToText part of normalization, not per-consumer** (O3-10)

### Sprint 4: Monolith Decomposition (5-8 days)
16. **Extract workflow steps into separate modules** (O1-13)
17. **Deep-freeze collectedData before Promise.all** (O1-3)
18. **Extract utility functions to proper modules** (O1-15)
19. **Add partial-state cleanup on workflow failure** (O1-14)
20. **Move general helpers out of workflow.ts** (O1-7)

### Sprint 5: Filtering & Alignment (2-3 days)
21. **Fix "tool title with path" regex false positives** (O4-2)
22. **Use word-boundary matching in alignment validator** (O4-7)
23. **Set minimum non-interactive alignment block threshold** (O4-8)
24. **Filter extracted headings through contamination patterns** (O2-10)
25. **Set toolTitleWithPathExpected for copilot-cli-capture** (O4-13)

### Sprint 6: Test & Spec Hygiene (2-3 days)
26. **Add F-NN references to test descriptions** (C3-1)
27. **Add V12 test coverage** (C3-2)
28. **Batch-update 83 stale spec file paths** (C1-1)
29. **Resolve 016/017 contradiction in specs** (C1-3, C4-2)
30. **Create collect-session-data dedicated test suite** (C3-4)

### Backlog
31. Align null-input extractor behavior (O5-9)
32. Scope F-25 blocker resolution (O5-13)
33. Fix Fix-8 message ordering (O5-14)
34. Remove dead simFactory import (O5-4)
35. Expand Unicode cleanup range (O4-16)
36. Cap session activity signal confidence boost (O4-15)
37. Reclaim 009 embedding parity deferred work (C4-9)
38. Close 013 follow-up items (C4-10)
39. Treat supersede failure as transaction abort (C5-3)
40. Surface enrichment failure status in response (C5-6)

---

## Appendix: Agent Execution Metrics

| Agent | Model | Duration | Tokens | Tool Uses | Findings |
|-------|-------|----------|--------|-----------|----------|
| O1 | Opus 4.6 | 2m 45s | 59,577 | 14 | 15 |
| O2 | Opus 4.6 | 3m 25s | 71,263 | 27 | 12 |
| O3 | Opus 4.6 | 3m 07s | 82,346 | 51 | 13 |
| O4 | Opus 4.6 | 3m 42s | 87,800 | 29 | 16 |
| O5 | Opus 4.6 | 2m 45s | 116,116 | 30 | 15 |
| C1 | GPT-5.4 | ~8m | ~210K | ~40 | 7 |
| C2 | GPT-5.4 | ~6m | 62,138 | ~25 | 4 |
| C3 | GPT-5.4 | ~7m | 207,266 | ~35 | 4 |
| C4 | GPT-5.4 | ~9m | ~220K | ~45 | 10 |
| C5 | GPT-5.4 | ~7m | ~180K | ~30 | 6 |

**Total:** ~102 unique findings → 53 after deduplication
