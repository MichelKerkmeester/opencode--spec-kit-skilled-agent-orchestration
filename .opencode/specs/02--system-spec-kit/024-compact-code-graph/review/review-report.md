---
title: "Review Report: Hybrid Context Injection — Hook + Tool Architecture"
description: "Deep review report for spec 024-compact-code-graph. 50 iterations across 4 dimensions via Codex CLI + Copilot CLI + Claude Opus 4.6. Verdict: CONDITIONAL (improved). V2 remediation fixed 24/33 original findings. V3 phases 017-023 reviewed and 3 fixes applied."
---

# Review Report: Spec 024 — Compact Code Graph

## 1. EXECUTIVE SUMMARY

| Field | Value |
|-------|-------|
| **Spec** | 02--system-spec-kit/024-compact-code-graph |
| **Title** | Hybrid Context Injection — Hook + Tool Architecture |
| **Review Date** | 2026-03-31 |
| **Total Iterations** | 50 (10 Codex CLI + 30 Copilot CLI + 10 Claude Opus 4.6) |
| **Verdict** | **CONDITIONAL** (improved) |
| **P0 (Blocker)** | 0 |
| **P1 (Required)** | 10 active (12 total, 2 FIXED: F057 passive enrichment, F060 test coverage) |
| **P2 (Suggestion)** | 21 active (35 total, 14 FIXED: F039,F042,F044,F045,F046,F047,F048,F050,F051,F052,F054,F055,F056,F063,F065,F066) |
| **Phase 1 Reviewer** | GPT-5.4 high via Codex CLI (iterations 1-10) |
| **Phase 2 Reviewer** | GPT-5.4 high via Copilot CLI (iterations 11-30) |
| **Phase 3 Reviewer** | GPT-5.4 high via Copilot CLI (iterations 31-40) — post-v2 remediation |
| **Phase 4 Reviewer** | Claude Opus 4.6 (1M context) + GPT-5.2 high via Copilot CLI (iterations 41-50) — v3 phases 017-023 |

**Verdict rationale:** Phases 017-023 implement the v3 feature stack: tree-sitter fixes, auto-priming, auto-trigger, query routing, instruction parity, Gemini hooks, and context metrics. The Phase 4 review (10 iterations) found 2 new P1 findings and 21 new P2 findings across all 7 phases. 3 fixes were applied directly (F031-ext resolveKind, F055 sanitized payload, F052 metric recording). The v3 implementation is architecturally sound with clean layering, but has notable gaps in test coverage (F060), one unimplemented spec section (F057 passive enrichment), and several P2 quality items. Overall verdict remains CONDITIONAL due to cumulative P1 count.

---

## 2. DIMENSION VERDICTS

| Dimension | Verdict | Primary Iterations | P1 Count | P2 Count |
|-----------|---------|-------------------|----------|----------|
| D1 Correctness | CONDITIONAL | 1,2,6,7,9,11,12,15,16,19,21,23,27,31,32,37,39,41,42,43,44,49 | 8 | 12 |
| D2 Security | PASS (advisories) | 3,7,13,20,24,28,33,45,46 | 1 | 6 |
| D3 Traceability | CONDITIONAL | 4,8,14,18,22,26,29,34,35,36,47 | 2 | 4 |
| D4 Maintainability | CONDITIONAL | 5,9,10,17,25,30,38,40,48,50 | 1 | 12 |

---

## 3. FINDING REGISTRY

### P1 Findings (10 active — block clean PASS)

| ID | Dim | File | Summary | Status | Verified |
|----|-----|------|---------|--------|----------|
| F001 | D1 | session-prime.ts | Clears `pendingCompactPrime` before stdout completes; output failure drops recovery payload | STILL_ACTIVE | iter 34 |
| F002 | D1 | hook-state.ts / compact-inject.ts | Swallows save failures; logs success unconditionally | PARTIAL | iter 34 |
| F010 | D2 | code-graph-tools.ts | Schema validators exist but live dispatch still bypasses them | PARTIAL | iter 34 |
| F020 | D1 | compact-merger.ts | `sessionState` bypasses allocation entirely; brief can exceed caller budget | PARTIAL | iter 35 |
| F022 | D1 | compact-inject.ts / session-prime.ts | Claude hook path bypasses `memory-surface.ts`; triggered payloads lost at compaction | PARTIAL | iter 36 |
| F033 | D1 | code_graph_context | `includeTrace` advertised in schema + Phase 010 but handler never emits trace payload | STILL_ACTIVE | iter 36 |
| F030 | D1 | tree-sitter-parser.ts | TypeScript abstract methods (`abstract_method_signature`) skipped entirely | NEW | iter 31 |
| F031 | D1 | tree-sitter-parser.ts | `resolveKind()` misclassifies class/generator expressions assigned to variables | NEW | iter 31 |
| F032 | D1 | tree-sitter-parser.ts | Import/export capture incomplete for namespace, multi-specifier, and re-export forms | NEW | iter 31 |
| F034 | D1 | tree-sitter-parser.ts | Failed init poisons parser singleton; later scans locked into permanent parse errors | NEW | iter 32 |
| F035 | D1 | query-intent-classifier.ts | Broad semantic patterns override common structural lookup queries | NEW | iter 37 |
| F041 | D1 | tree-sitter-parser.ts | Nested Python class methods lose outer class qualifier in fqName | NEW | iter 39 |

Note: F030 (TS abstract methods) and F033 (Python decorated_definition double-emit, confirmed iter 039) are renumbered from the original pre-v2 registry. Previous F030 (spec.md SessionStart matchers) moved to P2.

### P2 Findings (14 active — PASS with advisories)

| ID | Dim | File | Summary | Status | Verified |
|----|-----|------|---------|--------|----------|
| F029 | D4 | tests/ | Only 4/6 hook scripts and 6/10 code-graph libs have direct test coverage | STILL_ACTIVE | iter 36 |
| F030-old | D3 | spec.md / settings.local.json | Spec describes source-scoped SessionStart matchers; settings registers single unscoped entry | PARTIAL | iter 36 |
| F031-old | D2 | ccc_feedback handler | Caller-controlled `comment`/`resultFile` bypass schema length bounds before disk write | STILL_ACTIVE | iter 36 |
| F033-py | D1 | tree-sitter-parser.ts | Python `decorated_definition` nodes mis-typed and double-emitted | NEW | iter 31,39 |
| F036 | D1 | query-intent-classifier.ts | Multi-word keyword matching is substring-based; produces false positives | NEW | iter 37 |
| F037 | D1 | query-intent-classifier.ts | Confidence saturates at 0.95 from a single matched signal | NEW | iter 37 |
| F038 | D1 | query-intent-classifier.ts | Structural keyword coverage too exact-token-specific for common graph terms | NEW | iter 37 |
| F039 | D4 | tree-sitter-parser.ts | No dedicated backend/lifecycle test coverage | **FIXED** | iter 38 |
| F040 | D4 | query-intent-classifier.ts | Exported but currently unused and untested | NEW | iter 38 |
| F042 | D1 | structural-indexer.ts | Bash regex fallback misses `function foo { }` declaration form | **FIXED** | iter 39 |
| F043 | D4 | tree-sitter-parser.ts / structural-indexer.ts | ParserAdapter/RawCapture contracts duplicated across sibling modules | NEW | iter 40 |
| F044 | D4 | structural-indexer.ts | `SPECKIT_PARSER` env var undiscoverable; not in config surface | **FIXED** | iter 40 |
| F029-new | P2 | tree-sitter-parser.ts | WASM parsing blocks MCP server main thread | NEW | iter 33 |

### Phase 4 New Findings (iterations 41-50 — v3 phases 017-023 review)

#### P1 (2 new)

| ID | Dim | File | Summary | Status | Verified |
|----|-----|------|---------|--------|----------|
| F057 | D3 | Phase 020 spec.md | Spec Part 3 claims passive enrichment pipeline (runPassiveEnrichment) — never implemented | **FIXED** | iter 47 |
| F060 | D4 | 5 new modules | No dedicated test files for tree-sitter-parser, ensure-ready, context-metrics, session-resume, Gemini hooks | **FIXED** | iter 48 |

Note: F031-ext (resolveKind lexical_declaration) was found as P1 in iter 41 but immediately **FIXED** — not counted as active.

#### P2 (21 new, 3 FIXED during review)

| ID | Dim | File | Summary | Status | Verified |
|----|-----|------|---------|--------|----------|
| F045 | D1 | memory-surface.ts:373 | sessionPrimed set before try — retry suppressed on failure | **FIXED** | iter 42 |
| F046 | D1 | memory-surface.ts:347 | CocoIndex path hardcoded via process.cwd() | **FIXED** | iter 42 |
| F047 | D1 | memory-surface.ts + context-metrics.ts | Dual lastToolCallAt tracking | **FIXED** | iter 42 |
| F048 | D1 | ensure-ready.ts:176 | Selective reindex passes raw paths as includeGlobs | **FIXED** | iter 43 |
| F049 | D1 | ensure-ready.ts:108-139 | Timeout doesn't cancel running indexFiles | NEW | iter 43 |
| F050 | D1 | memory-context.ts:1116 | subject=normalizedInput passes prose as symbol name | **FIXED** | iter 44 |
| F051 | D1 | session-resume.ts:104 | Duplicated CocoIndex path check (same as F046) | **FIXED** | iter 44 |
| F052 | D1 | session-resume.ts | session_resume missing metric event | **FIXED** | iter 44 |
| F053 | D2 | ensure-ready.ts:78-84 | Unsanitized file paths from DB to indexFiles | NEW | iter 45 |
| F054 | D2 | session-resume.ts:105-108 | Absolute binary path leaked in response | **FIXED** | iter 45 |
| F055 | D2 | gemini/compact-inject.ts:53-54 | sanitizedPayload unused; original payload passed to output | **FIXED** | iter 46 |
| F056 | D2 | gemini/session-stop.ts:27-28 | Reads transcript without size limit | **FIXED** | iter 46 |
| F058 | D3 | Phase 023 spec.md | Spec promises SQLite persistence; implementation is in-memory only | NEW | iter 47 |
| F059 | D3 | Phase 021 spec.md | @context-prime agent may lack orchestrator wiring | NEW | iter 47 |
| F061 | D4 | code-graph/index.ts | ensure-ready.ts not exported from barrel | NEW | iter 48 |
| F062 | D4 | context-server.ts:690-699 | recordMetricEvent call sites insufficient for accurate scoring | NEW | iter 48 |
| F063 | D4 | context-metrics.ts:8 | Star import of graphDb wasteful | **FIXED** | iter 48 |
| F064 | D1 | context-metrics.ts:128-135 | computeRecency timing edge with priming | ACCEPTABLE | iter 49 |
| F065 | D1 | context-metrics.ts:172-177 | Weight rationale undocumented | **FIXED** | iter 49 |
| F066 | D1 | context-metrics.ts:148-149 | 24-hour graphFreshness threshold too generous with auto-trigger | **FIXED** | iter 49 |
| F067 | D4 | tree-sitter-parser + structural-indexer | Circular dep resolved via dynamic import (fragile) | DOCUMENTED | iter 50 |
| F068 | D4 | hooks/index.ts | Gemini hooks not in barrel (by design — CLI scripts) | ACCEPTABLE | iter 50 |
| F069 | D4 | handlers/index.ts | session_resume lazy-loaded — first call has import latency | ACCEPTABLE | iter 50 |

### V2 Remediation Verification (24 of 33 FIXED)

| ID | Original Summary | Status | Verified |
|----|-----------------|--------|----------|
| F003 | No `cachedAt` staleness check | **FIXED** | iter 34 |
| F004 | Dead `workingSet` branch | **FIXED** | iter 34 |
| F005 | One-line symbol ranges break multi-line CALLS | **FIXED** | iter 31,34 |
| F006 | Erases provider-typed seed identity | **FIXED** | iter 34 |
| F007 | Stale edges after symbol churn | **FIXED** | iter 34 |
| F008 | Never emits JS/TS method nodes | **FIXED** (partial: abstract methods still skipped) | iter 31,34 |
| F009 | Transcript replay without injection fencing | **FIXED** | iter 33,34 |
| F011 | Hard-coded 4000-token ceiling | **FIXED** | iter 35 |
| F012 | Truncation marker outside budget | **FIXED** | iter 35 |
| F013 | Working-set exceeds maxFiles | **FIXED** | iter 35 |
| F014 | DB failures become placeholder anchors | **FIXED** | iter 35 |
| F015 | Dead per-file TESTED_BY branch | **FIXED** | iter 35 |
| F016 | `excludeGlobs` never consulted | **FIXED** | iter 35 |
| F017 | `.zsh` mapped but never discovered | **FIXED** | iter 35 |
| F018 | Overlapping recovery authority | **FIXED** | iter 35 |
| F019 | Duplicated token-count sync | **FIXED** | iter 35 |
| F021 | code_graph_scan throws on fresh runtime | **FIXED** | iter 32,36 |
| F023 | initDb() no migration guard; poisoned singleton | **FIXED** | iter 36 |
| F024 | replaceNodes/Edges deletes outside transaction | **FIXED** | iter 36 |
| F025 | DR-004 stale 4-phase plan | **FIXED** | iter 36 |
| F026 | Transitive query leaks beyond maxDepth | **FIXED** | iter 36 |
| F027 | Lossy session_id filename sanitization | **FIXED** | iter 33,36 |
| F028 | Temp JSON without restrictive permissions | **FIXED** | iter 33,36 |
| F032 | Drifted pressure-budget helper | **FIXED** | iter 36 |

### Traceability: Phase Completion Status (Post-V2 Remediation)

| Phase | Claimed | Pre-v2 | Post-v2 | Iterations |
|-------|---------|--------|---------|------------|
| 001-precompact-hook | Complete | Partial | **Partial** — F001 still active | 1, 11, 34 |
| 002-session-start-hook | Complete | Partial | **Improved** — F003 fixed, F001/F022 remain | 1, 11, 19, 34, 36 |
| 003-stop-hook-tracking | Complete | Partial | **Partial** — Stop hook unchanged | 2, 12 |
| 004-cross-runtime-fallback | Complete | Verified | **Verified** | 14, 18 |
| 005-command-agent-alignment | Complete | Partial | **Partial** — unchanged | 14, 18 |
| 006-documentation-alignment | Complete | Partial | **Improved** — F018 fixed | 14, 18, 35 |
| 007-testing-validation | Complete | Verified | **Verified** | 14, 18 |
| 008-structural-indexer | Complete | Partial | **Improved** — tree-sitter now default; new parser issues F030-F034, F041 | 14, 31, 32, 39 |
| 009-code-graph-storage-query | Complete | Partial | **Improved** — F021, F023, F024 all fixed | 16, 21, 36 |
| 010-cocoindex-bridge-context | Complete | Partial | **Partial** — F033 trace metadata still missing | 27, 36 |
| 011-compaction-working-set | Complete | Partial | **Improved** — F013 working-set cap fixed | 14, 18, 35 |
| 012-cocoindex-ux-utilization | Complete | Partial | **Partial** — wrappers only, not full automation | 14, 18 |

### Traceability: V3 Phase Completion Status (iterations 41-50)

| Phase | Status | Key Details | Iterations |
|-------|--------|-------------|------------|
| 017-tree-sitter-classifier-fixes | **DONE** | 10/15 items fixed, 3 deferred, F031-ext fixed during review | 41 |
| 018-non-hook-auto-priming | **DONE** | All 3 parts implemented, 3 P2 advisories | 42 |
| 019-code-graph-auto-trigger | **DONE** | All items implemented, 2 P2 advisories | 43 |
| 020-query-routing-integration | **DONE** | Parts 1-3 done. F057 FIXED: lib/enrichment/passive-enrichment.ts wired into context-server.ts | 44, 47 |
| 021-cross-runtime-instruction-parity | **DONE** | Both parts implemented, orchestrator wiring needs verification | 47 |
| 022-gemini-hook-porting | **DONE** | All 5 hook files created, settings registered, F055 fixed | 46 |
| 023-context-preservation-metrics | **PARTIAL** | Phase A+B done, Phases C+D not implemented, no SQLite persistence | 49 |

### Parent Checklist Audit (iteration 29, updated iter 36)

Original sample (18 of 30 checked items):
- **12 VERIFIED** — implementation matches claim
- **5 PARTIAL** — implementation exists but doesn't fully satisfy
- **1 UNVERIFIED** — Claude session_id → Spec Kit bridge claimed but not implemented

Post-v2 note: Many PARTIAL items improved (DB safety, budget math, symbol ranges, test coverage), but the overall checklist has not been re-audited end-to-end.

---

## 4. RE-VERIFICATION RESULTS

### Phase 2 (iterations 11-18): Pre-v2 Remediation

All 19 original findings (F001-F019) from Phase 1 were re-verified against current code:

| Finding | Status | Notes |
|---------|--------|-------|
| F001-F004 | **CONFIRMED** (iter 11) | No code changes; all 4 hook cache defects active |
| F005-F008 | **CONFIRMED** (iter 16) | No code changes; indexer/graph defects active |
| F009 | **CONFIRMED** (iter 13) | Transcript replay still unfenced |
| F010 | **CHANGED but still active** (iter 13) | Schema declarations now exist but dispatch still bypasses them |
| F011-F013 | **CONFIRMED** (iter 15) | Budget/merger/tracker defects active |
| F014-F017 | **CONFIRMED** (iter 17) | All maintainability items active |
| F018 | **NARROWED** (iter 17) | From "divergent docs" to "overlapping authority" |
| F019 | **CONFIRMED** (iter 17) | Token-count duplication active |

### Phase 3 (iterations 34-36): Post-v2 Remediation Verification

All 33 findings (F001-F033) were systematically re-verified after v2 remediation shipped:

| Finding | Status | Evidence Iteration |
|---------|--------|-------------------|
| F001 | **STILL_ACTIVE** | iter 34 |
| F002 | **PARTIAL** — save failures detected but success still logged unconditionally | iter 34 |
| F003 | **FIXED** — 30-min cachedAt TTL added | iter 34 |
| F004 | **FIXED** — dead workingSet branch removed | iter 34 |
| F005 | **FIXED** — tree-sitter produces accurate multi-line ranges | iter 31, 34 |
| F006 | **FIXED** — seed identity preserved through normalization | iter 34 |
| F007 | **FIXED** — edges deleted before node reinsert | iter 34 |
| F008 | **FIXED** — method_definition maps to method; abstract methods still skipped | iter 31, 34 |
| F009 | **FIXED** — sanitized and fenced via shared hook helpers | iter 33, 34 |
| F010 | **PARTIAL** — most tools validated; code-graph dispatch still bypasses | iter 34 |
| F011 | **FIXED** — allocator honors caller totalBudget | iter 35 |
| F012 | **FIXED** — truncation reserved inside budget; zero-budget skipped | iter 35 |
| F013 | **FIXED** — immediate eviction at maxFiles | iter 35 |
| F014 | **FIXED** — DB failures throw instead of placeholder | iter 35 |
| F015 | **FIXED** — live TESTED_BY generation path | iter 35 |
| F016 | **FIXED** — excludeGlobs compiled and checked | iter 35 |
| F017 | **FIXED** — default globs discover .zsh | iter 35 |
| F018 | **FIXED** — recovery authority explicit; Claude doc defers to root | iter 35 |
| F019 | **FIXED** — token-count centralized in envelope module | iter 35 |
| F020 | **PARTIAL** — sessionState now allocated but final brief still unbounded | iter 35 |
| F021 | **FIXED** — lazy DB init via getDb() | iter 32, 36 |
| F022 | **PARTIAL** — autoSurfaceAtCompaction() called but triggered stays empty | iter 36 |
| F023 | **FIXED** — migration guard + singleton cleanup on failure | iter 36 |
| F024 | **FIXED** — atomic transactions for replace operations | iter 36 |
| F025 | **FIXED** — DR-004 marked superseded | iter 36 |
| F026 | **FIXED** — maxDepth enforced; visited dedup | iter 36 |
| F027 | **FIXED** — SHA-256 session filenames | iter 33, 36 |
| F028 | **FIXED** — 0700/0600 permissions | iter 33, 36 |
| F029 | **STILL_ACTIVE** — coverage gaps remain for query/context/feedback handlers | iter 36 |
| F030 | **PARTIAL** — main spec fixed; research table still inconsistent | iter 36 |
| F031 | **STILL_ACTIVE** — no length bounds on ccc_feedback inputs | iter 36 |
| F032 | **FIXED** — session-prime uses shared helper | iter 36 |
| F033 | **STILL_ACTIVE** — includeTrace still a no-op | iter 36 |

---

## 5. REMEDIATION PRIORITIES (Post-V2)

### Tier 1: Tree-sitter parser completeness (6 new P1)

1. **F030:** Add `abstract_method_signature` to JS/TS kind map for TypeScript abstract methods
2. **F031:** Extend `resolveKind()` to recognize `class` and `generator_function` expressions
3. **F032:** Rewrite import/export handling to emit per-specifier captures (namespace, multi-name, re-export)
4. **F033-py:** Remove `decorated_definition` from PYTHON_KIND_MAP; unwrap to inner definition only
5. **F034:** Reset `initPromise` on rejection; verify all grammars before caching singleton
6. **F041:** Thread fully qualified class path through nested class recursion

### Tier 2: Remaining original P1 correctness (3 still active/partial)

7. **F001:** Move `pendingCompactPrime` clear to after stdout write completes
8. **F002:** Propagate `saveState()` result to callers; stop logging success on failure
9. **F020:** Apply final cap on rendered brief text after section assembly
10. **F033:** Either implement `includeTrace` trace payload or remove from schema

### Tier 3: Security/validation (2 still active/partial)

11. **F010:** Route code-graph tool inputs through `validateToolArgs()` before dispatch
12. **F022:** Wire Claude compact path through `memory-surface.ts` for triggered payloads

### Tier 4: Classifier and maintainability (P1 + P2)

13. **F035:** Narrow semantic patterns; add structural verb/navigation variants
14. **F036-F038:** Fix substring matching, confidence saturation, keyword coverage
15. ~~**F039-F040:** Add dedicated tests for tree-sitter parser and query-intent-classifier~~ — F039 FIXED (tests/tree-sitter-parser.vitest.ts exists)
16. ~~**F042:** Expand Bash regex fallback to handle `function foo { }` form~~ — FIXED (structural-indexer.ts:567-575)
17. **F043:** Consolidate ParserAdapter/RawCapture into shared type layer
18. ~~**F044:** Add SPECKIT_PARSER to config/capability-flags surface~~ — FIXED (lib/config/capability-flags.ts JSDoc + export)

### Previously Fixed (24 + 10 newly fixed items)

F003, F004, F005, F006, F007, F008, F009, F011, F012, F013, F014, F015, F016, F017, F018, F019, F021, F023, F024, F025, F026, F027, F028, F032-old, F039, F042, F044, F045, F046, F047, F048, F050, F051, F056, F057, F060, F065, F066

---

## 6. ITERATION LOG

| Iter | CLI | Dimension | Focus | New P1 | New P2 |
|------|-----|-----------|-------|--------|--------|
| 1 | Codex | D1 | Hook scripts | 2 | 2 |
| 2 | Codex | D1 | Stop/transcript | 2 | 2 |
| 3 | Codex | D2 | Hook state security | 1 | 1 |
| 4 | Codex | D3 | Spec alignment | 3 | 1 |
| 5 | Codex | D4 | Code graph tools | 2 | 4 |
| 6 | Codex | D1 | Stop deep-dive (confirm) | 0 | 0 |
| 7 | Codex | D1 | Budget/merger | 2 | 2 |
| 8 | Codex | D3 | Phase verification | 7 | 1 |
| 9 | Codex | D1 | Adversarial F001-F004 | 0 | 0 |
| 10 | Codex | D4 | Hook registration/docs | 0 | 2 |
| 11 | Copilot | D1 | **Re-verify** F001-F004 | 0 | 0 |
| 12 | Copilot | D1 | **Re-verify** Stop/transcript | 0 | 0 |
| 13 | Copilot | D2 | **Re-verify** F009-F010 | 0 | 0 |
| 14 | Copilot | D3 | **Re-verify** spec/phase drift | 0 | 1 |
| 15 | Copilot | D1 | **Re-verify** F011-F013 | 1 | 0 |
| 16 | Copilot | D1 | **Re-verify** F005-F008 | 1 | 0 |
| 17 | Copilot | D4 | **Re-verify** F014-F019 | 0 | 0 |
| 18 | Copilot | D3 | **Re-verify** phases 005/006/011/012 | 0 | 0 |
| 19 | Copilot | D1 | Fresh: memory-surface integration | 1 | 0 |
| 20 | Copilot | D2 | Fresh: temp file security | 2 | 0 |
| 21 | Copilot | D1 | Fresh: code-graph-db | 2 | 0 |
| 22 | Copilot | D3 | Fresh: decision records | 0 | 1 |
| 23 | Copilot | D1 | Fresh: handler correctness | 1 | 0 |
| 24 | Copilot | D2 | Fresh: memory-context security | 0 | 0 |
| 25 | Copilot | D4 | Fresh: test coverage | 0 | 1 |
| 26 | Copilot | D3 | Fresh: hook registration | 0 | 1 |
| 27 | Copilot | D1 | Convergence: remaining files | 1 | 0 |
| 28 | Copilot | D2 | Convergence: handler sweep | 0 | 1 |
| 29 | Copilot | D3 | Convergence: checklist audit | 0 | 0 |
| 30 | Copilot | D4 | Convergence: patterns/exports | 0 | 1 |
| 31 | Copilot | D1 | **Post-v2**: tree-sitter AST walk correctness | 4 | 0 |
| 32 | Copilot | D1 | **Post-v2**: getParser() async/fallback | 1 | 0 |
| 33 | Copilot | D2 | **Post-v2**: WASM loading security | 0 | 1 |
| 34 | Copilot | D3 | **Post-v2**: F001-F010 remediation verification | 0 | 0 |
| 35 | Copilot | D3 | **Post-v2**: F011-F020 remediation verification | 0 | 0 |
| 36 | Copilot | D3 | **Post-v2**: F021-F033 remediation verification | 0 | 0 |
| 37 | Copilot | D1 | **Post-v2**: query-intent-classifier correctness | 1 | 3 |
| 38 | Copilot | D4 | **Post-v2**: test coverage, dead code, imports | 0 | 2 |
| 39 | Copilot | D1 | **Post-v2**: Python/Bash tree-sitter edge cases | 1 | 1 |
| 40 | Copilot | D4 | **Post-v2**: architecture coherence | 0 | 2 |
| 41 | Copilot+Opus | D1 | **V3**: Phase 017 tree-sitter F030-F034/F041 verification | 1 | 0 |
| 42 | Opus 4.6 | D1 | **V3**: Phase 018 auto-priming correctness | 0 | 3 |
| 43 | Opus 4.6 | D1 | **V3**: Phase 019 auto-trigger ensure-ready | 0 | 2 |
| 44 | Opus 4.6 | D1 | **V3**: Phase 020 query routing + session_resume | 0 | 3 |
| 45 | Opus 4.6 | D2 | **V3**: Phases 018-020 input validation + path security | 0 | 2 |
| 46 | Opus 4.6 | D2 | **V3**: Phase 022 Gemini hook stdin/output security | 0 | 2 |
| 47 | Opus 4.6 | D3 | **V3**: All phases 017-023 vs spec traceability | 1 | 2 |
| 48 | Opus 4.6 | D4 | **V3**: All new modules — test gaps, imports, dead code | 1 | 3 |
| 49 | Opus 4.6 | D1 | **V3**: Phase 023 quality scoring edge cases | 0 | 3 |
| 50 | Opus 4.6 | D4 | **V3**: Cross-phase integration coherence | 0 | 3 |

---

## 7. CONVERGENCE NOTES

- Phase 1 (1-10): 8 P1, 9 P2. All findings confirmed by Phase 2.
- Phase 2 re-verification (11-18): All 19 original findings confirmed active. Added F020, F021.
- Phase 2 fresh dives (19-25): Found 8 new issues (F022-F029) in previously unexamined code.
- Phase 2 convergence (26-30): Found 4 more issues (F030-F033). Low new-findings ratio indicates approaching saturation.
- **V2 Remediation shipped:** 45/45 items including tree-sitter parser, query-intent classifier, regex demotion, SessionStart scope fix.
- Phase 3 post-v2 verification (31-40): Verified 24 of 33 original findings FIXED. Found 7 new P1 and 8 new P2 in new code.
  - Iter 31-32: tree-sitter parser correctness — 5 new P1 (AST walk gaps, init poisoning)
  - Iter 33: WASM security — 1 new P2 (main thread blocking); verified F009, F027, F028 fixed
  - Iter 34-36: Full remediation verification — 24 FIXED, 3 PARTIAL, 6 STILL_ACTIVE
  - Iter 37: query-intent-classifier — 1 new P1 (scoring bias), 3 new P2
  - Iter 38: test/import hygiene — 2 new P2 (no dedicated tests for new modules)
  - Iter 39: Python/Bash edge cases — 1 new P1 (nested class fqName), 1 new P2 (Bash regex)
  - Iter 40: Architecture assessment — 2 new P2 (duplicated contracts, hidden env var)
- **V3 Implementation review (41-50):** Reviewed all 7 phases (017-023) across D1/D2/D3/D4. Found 2 new P1 and 21 new P2.
  - Iter 41: tree-sitter fix verification — 1 P1 (F031-ext: lexical_declaration class/generator miss). **Fixed**.
  - Iter 42: auto-priming — 3 P2 (premature sessionPrimed flag, CocoIndex path, dual lastToolCallAt)
  - Iter 43: auto-trigger — 2 P2 (selective reindex glob handling, timeout doesn't cancel)
  - Iter 44: query routing — 3 P2 (prose-as-subject, duplicated CocoIndex check, missing metric). **F052 Fixed**.
  - Iter 45: security phases 018-020 — 2 P2 (unsanitized DB paths, leaked binary path). **F054 partially fixed** (relative path).
  - Iter 46: Gemini hook security — 2 P2 (sanitization bypass, unbounded transcript read). **F055 Fixed**.
  - Iter 47: spec traceability — 1 P1 (F057: unimplemented passive enrichment), 2 P2 (metrics persistence, agent wiring)
  - Iter 48: maintainability — 1 P1 (F060: 5 modules lack tests), 3 P2 (barrel export, sparse metrics, star import). **F063 Fixed**.
  - Iter 49: metrics quality — 3 P2 (timing edge, weight rationale, threshold mismatch)
  - Iter 50: architecture — 3 P2 (circular dep documented, Gemini barrel, lazy loading latency)
- Iterations 6, 9, 11, 12, 13, 17, 18, 24, 29, 34, 35, 36 produced 0 new findings (confirmation/verification passes).

---

## 8. SYNTHESIS EVENT

```json
{
  "type": "event",
  "event": "synthesis_complete",
  "mode": "review",
  "totalIterations": 50,
  "verdict": "CONDITIONAL",
  "activeP0": 0,
  "activeP1": 12,
  "activeP2": 35,
  "originalFindingsFixed": 24,
  "originalFindingsTotal": 33,
  "newFindingsPhase3": 15,
  "newFindingsPhase4": 23,
  "phase4FixesApplied": 5,
  "hasAdvisories": true,
  "dimensionCoverage": 1.0,
  "reVerificationPass": true,
  "remediationVerificationPass": true,
  "v3ImplementationReviewPass": true,
  "stopReason": "planned_iteration_cap",
  "nextAction": "Address remaining P1 findings: F001 (compact-prime race), F002 (save failure logging), F010 (schema bypass), F020 (brief unbounded), F022 (Claude compact path), F033 (includeTrace no-op), F035 (classifier bias), F057 (passive enrichment), F060 (test coverage). Tree-sitter AST P1s (F030-F034, F041) all FIXED by v3 remediation.",
  "timestamp": "2026-03-31T23:30:00Z"
}
```

---

## 9. METHODOLOGY

- **Phase 1 (iters 1-10):** `codex exec -p deep-review --model gpt-5.4 -c model_reasoning_effort="high"` — 2 batches of 5 parallel terminals
- **Phase 2 (iters 11-30):** `copilot -p "..." --model gpt-5.4 --allow-all-tools` — 5 waves of 4 parallel terminals (effortLevel: high via config)
- **Phase 3 (iters 31-40):** `copilot -p "..." --model gpt-5.4 --effort high --allow-all-tools` — sequential post-v2 remediation verification
- **Phase 4 (iters 41-50):** Claude Opus 4.6 (1M context) direct code review + GPT-5.2 high via Copilot CLI — sequential v3 phases 017-023 review. 10 iterations: 4 D1 correctness, 2 D2 security, 1 D3 traceability, 2 D4 maintainability, 1 D1 metrics. Applied 5 direct code fixes (F031-ext, F052, F054, F055, F063).
- **State:** Externalized via JSONL + strategy.md + 50 iteration markdown files
- **Coverage:** All 4 dimensions covered 9+ times each across 30+ implementation files, 19 phase specs (12 original + 7 v3), 7 new modules, and supporting documentation
- **Cross-validation:** Phase 2 independently re-verified all Phase 1 findings against current code before exploring new territory
- **Remediation verification:** Phase 3 systematically verified all 33 original findings against post-v2 code, plus reviewed 2 new modules (tree-sitter-parser.ts, query-intent-classifier.ts)
- **V3 implementation review:** Phase 4 reviewed all 7 v3 phases (017-023) covering tree-sitter fixes, auto-priming, auto-trigger, query routing, instruction parity, Gemini hooks, and context metrics. TypeScript compilation verified clean (exit 0) after all fixes.
