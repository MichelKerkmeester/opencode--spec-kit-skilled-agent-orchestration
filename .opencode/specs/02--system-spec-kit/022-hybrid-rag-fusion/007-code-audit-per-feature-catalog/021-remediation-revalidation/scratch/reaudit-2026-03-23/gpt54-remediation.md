# Phase 021: Remediation & Revalidation Synthesis (Re-Audit 2026-03-23)

## Executive Summary
Using the original 2026-03-22 phase totals as the baseline, the audit moved from `179 MATCH / 41 PARTIAL / 0 MISMATCH` to `133 MATCH / 84 PARTIAL / 5 MISMATCH` across the phase tables. That is a net shift of `-46 MATCH`, `+43 PARTIAL`, `+5 MISMATCH`, plus `2` newly-audited features that entered as `PARTIAL`.

The re-audit changed verdicts on `53` previously-audited features: `44 MATCH->PARTIAL`, `5 -> MISMATCH`, and `4 PARTIAL->MATCH`. The biggest net regressions were Phase `002` (`-7 MATCH`), Phases `009` and `013` (`-5 MATCH` each), and Phase `016` (`-4 MATCH`, `+1 MISMATCH`). The only net-positive phase was `005`.

## Verdict Change Register

| Phase | Feature | Old | New | Direction | Reason |
|---|---|---:|---:|---|---|
| 001 | 4-stage pipeline architecture | MATCH | PARTIAL | Down | Missing `stage2b-enrichment.ts` and `ranking-contract.ts` |
| 001 | Tool-result extraction to working memory | MATCH | PARTIAL | Down | Undocumented `MENTION_BOOST_FACTOR`; missing `extraction-adapter.ts` |
| 002 | `memory_update` | MATCH | PARTIAL | Down | Missing `history.ts`; source map incomplete |
| 002 | `memory_delete` | MATCH | PARTIAL | Down | Missing `history.ts`; source map incomplete |
| 002 | `memory_bulk_delete` | MATCH | PARTIAL | Down | Missing `history.ts`; source map incomplete |
| 002 | Transaction wrappers | MATCH | PARTIAL | Down | Missing `history.ts`; source map incomplete |
| 002 | Namespace CRUD | MATCH | PARTIAL | Down | Wrong routing file; overstated `shared_memory_status` |
| 002 | PE save arbitration | MATCH | PARTIAL | Down | Activation also skips when embedding is `null` |
| 002 | Correction tracking w/ undo | MATCH | PARTIAL | Down | Undo behavior undocumented |
| 005 | Startup recovery | PARTIAL | MATCH | Up | Missing test file now exists |
| 006 | Causal edge creation | MATCH | PARTIAL | Down | Omitted `causal-graph.ts` handler and `memory-index.ts` caller |
| 006 | Causal edge deletion | MATCH | PARTIAL | Down | Omitted `causal-graph.ts` handler / dispatch files |
| 007 | Reporting dashboard | MATCH | PARTIAL | Down | Plain text, not markdown; first call can init/write DB |
| 008 | Canonical ID dedup | MATCH | PARTIAL | Down | 26-file source list for a 3-file fix |
| 008 | Session-mgr transactions | MATCH | PARTIAL | Down | 3 transaction sites, not 2 |
| 009 | Full-context ceiling eval | MATCH | PARTIAL | Down | Deprecated state not reflected |
| 009 | BM25-only baseline | MATCH | PARTIAL | Down | Historical numeric claim not code-anchored |
| 009 | Agent consumption instrumentation | MATCH | PARTIAL | Down | Handler wiring files omitted |
| 009 | Shadow scoring/channel attribution | PARTIAL | MISMATCH | Down | Deprecated module claimed active |
| 009 | Test quality improvements | MATCH | PARTIAL | Down | `"18+ files"` claim unsupported |
| 010 | Co-activation boost strength | MATCH | PARTIAL | Down | Fixed `0.25`, not `0.25-0.3x`; dark-run claim false |
| 010 | Graph calibration profiles | PARTIAL | MISMATCH | Down | Deprecated dead module claimed active |
| 010 | Typed traversal | MATCH | PARTIAL | Down | Sparse-first mode unreachable in production |
| 011 | Score normalization | MATCH | PARTIAL | Down | Divergent edge-case behavior |
| 011 | RRF K-value sensitivity | MATCH | PARTIAL | Down | K-grid expanded to 7 values |
| 011 | Stage 3 effectiveScore fallback | PARTIAL | MATCH | Up | Fix landed |
| 011 | Learned Stage 2 combiner | MATCH | PARTIAL | Down | Shadow combiner inert; model always `null` |
| 011 | Fusion policy shadow V2 | PARTIAL | MISMATCH | Down | Deprecated, unexported, unused |
| 012 | Dynamic token budget | MATCH | PARTIAL | Down | Actual overhead is ~26 tokens/result, not ~12 |
| 012 | HyDE | PARTIAL | MATCH | Up | Flag default contradiction resolved |
| 012 | Query decomposition | MATCH | PARTIAL | Down | Error path falls through to expansion |
| 012 | Graph concept routing | MATCH | PARTIAL | Down | Records traces only; does not activate graph channel |
| 013 | Smarter memory content generation | MATCH | PARTIAL | Down | Missing `bm25-index.ts` |
| 013 | Encoding-intent capture | MATCH | PARTIAL | Down | Missing `vector-index-mutations.ts` |
| 013 | Auto entity extraction | MATCH | PARTIAL | Down | Wrong source files listed |
| 013 | Agent handback protocol | MATCH | PARTIAL | Down | `QUALITY_GATE_ABORT` skip claim false |
| 013 | Post-save quality review | MATCH | PARTIAL | Down | Not always active |
| 013 | Assistive reconsolidation | MATCH | MISMATCH | Down | Shadow-archive, not merge |
| 014 | Atomic write-then-index API | MATCH | PARTIAL | Down | Stale `dbOperation` callback description |
| 014 | Embedding retry orchestrator | MATCH | PARTIAL | Down | Deprecated `index-refresh.ts` still referenced |
| 015 | Lightweight consolidation | MATCH | PARTIAL | Down | Weekly cadence, not every save |
| 016 | Filesystem watching | MATCH | PARTIAL | Down | Missing `context-server.ts` and `search-flags.ts` wiring |
| 016 | Feature catalog code references | MATCH | MISMATCH | Down | `"Every non-test TS file"` false; 66/257 missing comments |
| 016 | Module boundary map | MATCH | PARTIAL | Down | `MODULE_MAP` missing `feedback/` and `spec/` |
| 017 | Hierarchical scope governance | MATCH | PARTIAL | Down | Unreferenced implementation files |
| 017 | Shared-memory rollout | MATCH | PARTIAL | Down | Unreferenced test/integration files |
| 018 | Memory health autoRepair metadata | MATCH | PARTIAL | Down | Missing orphan cleanup repair actions |
| 018 | Duplicate-save no-op feedback | MATCH | PARTIAL | Down | Asymmetric duplicate vs unchanged feedback |
| 018 | Hooks README/export alignment | PARTIAL | MATCH | Up | Source list fixed |
| 018 | Mode-aware response profiles | MATCH | PARTIAL | Down | `profile` parameter is dead / unexposed |
| 020 | Search Pipeline Features | MATCH | PARTIAL | Down | 26 SPECKIT flag consumers unlisted |
| 020 | Session and Cache | MATCH | PARTIAL | Down | LRU eviction contradicts `"not tracked"` |
| 020 | MCP Configuration | MATCH | PARTIAL | Down | Unreferenced MCP flag consumers |

Newly-audited features not in the original baseline:
- `001/F11` Session recovery via `/memory:continue` -> `PARTIAL`
- `016/F18` Template compliance contract -> `PARTIAL`

## New Findings Not in Original Audit
- Five true mismatches were missed entirely on 2026-03-22: `009/F11`, `010/F15`, `011/F23`, `013/F21`, `016/F11`.
- The original remediation summary framed the work as “catalog hygiene, not code changes”; the re-audit found several materially false runtime descriptions, not just stale source lists.
- New behavioral misses included: weekly cadence vs every-save (`015/F04`), LRU eviction vs “not tracked” (`020/F02`), query decomposition fallback semantics (`012/F10`), graph routing that only traces and never activates (`012/F11`), and plain-text/lazy-init side effects in the reporting dashboard (`007/F02`).
- New structural drift findings included: 66 non-test TS files missing feature-catalog comments (`016/F11`), `MODULE_MAP` missing live directories (`016/F15`), 26 pipeline flag consumers omitted from the feature-flag reference (`020/F01`), and session recovery overstating use of `memory_stats` (`001/F11`).
- Some prior diagnoses were wrong even when the verdict stayed `PARTIAL`: `005/F07` does defer vector rebuild as the catalog said; the real remaining issue is the false tier-demotion claim.

## Resolved Issues (upgrades)
- `005/F06` Startup recovery: `PARTIAL -> MATCH`
- `011/F12` Stage 3 effectiveScore fallback: `PARTIAL -> MATCH`
- `012/F08` HyDE: `PARTIAL -> MATCH`
- `018/F12` Hooks README/export alignment: `PARTIAL -> MATCH`

## Regression Analysis
Per-phase net shifts, using final per-feature verdicts:
- `001`: `8/2/0 -> 5/6/0` (`-3 MATCH`, `+4 PARTIAL`) plus 1 new `PARTIAL`
- `002`: `8/2/0 -> 1/9/0` (`-7 MATCH`, `+7 PARTIAL`)
- `003`: `2/1/0 -> 2/1/0` (no net change)
- `004`: `1/1/0 -> 1/1/0` (no net change)
- `005`: `4/3/0 -> 5/2/0` (`+1 MATCH`, `-1 PARTIAL`)
- `006`: `5/2/0 -> 3/4/0` (`-2 MATCH`, `+2 PARTIAL`)
- `007`: `1/1/0 -> 0/2/0` (`-1 MATCH`, `+1 PARTIAL`)
- `008`: `9/2/0 -> 7/4/0` (`-2 MATCH`, `+2 PARTIAL`)
- `009`: `12/4/0 -> 7/8/1` (`-5 MATCH`, `+4 PARTIAL`, `+1 MISMATCH`)
- `010`: `12/4/0 -> 10/5/1` (`-2 MATCH`, `+1 PARTIAL`, `+1 MISMATCH`)
- `011`: `20/3/0 -> 17/5/1` (`-3 MATCH`, `+2 PARTIAL`, `+1 MISMATCH`)
- `012`: `8/3/0 -> 5/6/0` (`-3 MATCH`, `+3 PARTIAL`)
- `013`: `20/4/0 -> 15/8/1` (`-5 MATCH`, `+4 PARTIAL`, `+1 MISMATCH`)
- `014`: `19/3/0 -> 17/5/0` (`-2 MATCH`, `+2 PARTIAL`)
- `015`: `8/1/0 -> 7/2/0` (`-1 MATCH`, `+1 PARTIAL`)
- `016`: `16/1/0 -> 12/5/1` (`-4 MATCH`, `+4 PARTIAL`, `+1 MISMATCH`) plus 1 new `PARTIAL`
- `017`: `3/1/0 -> 2/2/0` (`-1 MATCH`, `+1 PARTIAL`)
- `018`: `17/2/0 -> 14/5/0` (`-3 MATCH`, `+3 PARTIAL`)
- `020`: `6/1/0 -> 3/4/0` (`-3 MATCH`, `+3 PARTIAL`)

Overall:
- Original phase table total: `179 MATCH / 41 PARTIAL / 0 MISMATCH`
- Re-audit final total: `133 MATCH / 84 PARTIAL / 5 MISMATCH`
- Net: `-46 MATCH / +43 PARTIAL / +5 MISMATCH`, plus `2` new `PARTIAL` features

Note: Phase `008`’s summary block is internally inconsistent; I used the final per-feature table (`7 MATCH / 4 PARTIAL / 0 MISMATCH`) for the rollup.

## Methodology Assessment
The 3-agent triangulation was materially better at recall than the original 2-agent research pass. It surfaced the five mismatches above, 44 additional `MATCH->PARTIAL` downgrades, and also corrected four places where the original audit had been too pessimistic.

Its strengths were complementary:
- `GPT-5.4` was strongest on behavioral/narrative discrepancies.
- `GPT-5.3-Codex` was strongest on systematic file/function/flag verification.
- `Opus` added real value as the adjudicator when disagreement was about rubric, not facts.

Its weakness was calibration. Agreement rates ranged from `28%` to `100%`, and many disputes were about whether shared infrastructure or transitive consumers should force `PARTIAL`. So the triad improves defect discovery, but it needs a tighter rubric to avoid false-positive noise and summary drift.

## Remediation Priority Matrix
`P0`
- Remove or relabel dead modules presented as live: `009/F11`, `010/F15`, `011/F23`. Fix: mark as deprecated/unused, delete “active/graduated/on each query” claims, and remove nonexistent flag references.
- Correct materially false runtime semantics: `013/F21`, `012/F05`, `012/F10`, `012/F11`, `020/F02`. Fix: rewrite catalog behavior to match shadow-archive, actual token overhead, expansion fallback, trace-only graph routing, and LRU eviction.
- Repair mutation/recovery write-path documentation: Phase `002` systemic issues and `001/F11`. Fix: add `history.ts` and actual recovery wiring, document undo behavior, and include embedding-null arbitration.

`P1`
- Fix high-value source-map drift and stale handlers: `001/F05,F09`, `006/F01,F03`, `008/F07,F09`, `009/F04,F08,F12`, `014/F18,F19`, `016/F06,F15`, `017/F03,F04`, `018/F02,F09,F15`, `020/F01,F03,F04,F05`.
- Resolve stale defaults, numeric claims, and function names: `010/F02,F13,F14,F16`, `011/F08,F13,F19,F22`, `015/F04`, `018/F17`.
- Fix the feature-catalog comment governance claim: `016/F11`. Either add the missing comments or lower the claim to measured coverage.

`P2`
- Trim remaining over-inclusive source lists where behavior is otherwise correct.
- Formalize the audit rubric for shared infrastructure vs feature-specific files.
- Add automated summary validation so phase rollups are derived from final verdict tables.

## Recommendations for Next Audit Cycle
- Keep the 3-agent model, but standardize the verifier checklist and the adjudication rubric.
- Separate “behavioral mismatch” from “source-list incompleteness” explicitly; the current `PARTIAL` bucket is doing too much work.
- Freeze the codebase at a commit SHA before audit start; the original audit was vulnerable to temporal drift.
- Auto-generate phase summaries from final verdict tables to avoid packaging inconsistencies.
- Prioritize re-audit depth in Phases `002`, `009-013`, `016`, and `020`; that is where the highest-severity misses concentrated.

Sources used: [original implementation summary](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/implementation-summary.md), [original remediation summary](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/implementation-summary.md), and the 19 re-audit `opus-review.md` files under [the phase audit directory](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog).