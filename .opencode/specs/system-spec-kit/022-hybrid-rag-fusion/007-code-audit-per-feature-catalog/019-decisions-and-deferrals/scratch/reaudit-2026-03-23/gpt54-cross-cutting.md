# Phase 019: Cross-Cutting Analysis (Re-Audit 2026-03-23)

## Executive Summary
I read all 19 `opus-review.md` files plus the prior cross-cutting summary at [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/implementation-summary.md). The re-audit is dominated by documentation-fidelity problems, not widespread runtime defects. The biggest systemic issue is source-list hygiene; the highest-risk issue is deprecated or dead code still described as live. Explicitly labeled recommendations total 10 `P0` and 48 `P1`.

## Systemic Patterns (with counts and examples)
Counts below are by phase, not by feature.

- Source-list hygiene is the main failure mode in 16 of 19 phases. Examples: Phase 002 over-inclusive mutation lists, Phase 007 ablation’s `78` impl + `73` test files, Phase 014 features with `153` and `344` listed files, and Phase 020’s flag categories missing secondary consumers.
- Behavioral drift and stale prose show up in at least 13 phases. Examples: Phase 005 says checkpoint snapshots cover `3` tables but code snapshots `21`; Phase 012 says `~12` tokens/result but code is `~26`; Phase 020 says entries are “not tracked” but code does LRU eviction.
- Deprecated/dead code presented as active appears in 7 phases, with 4 `P0` mismatches. Examples: [Phase 009](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/009-evaluation-and-measurement/scratch/reaudit-2026-03-23/opus-review.md), [Phase 010](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/scratch/reaudit-2026-03-23/opus-review.md), [Phase 011](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011-scoring-and-calibration/scratch/reaudit-2026-03-23/opus-review.md), and [Phase 013](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/scratch/reaudit-2026-03-23/opus-review.md).
- Dependency-attribution standards are inconsistent across at least 9 phases. Several reviews argue that shared schemas, dispatchers, callers, and `context-server.ts` should not be listed per feature unless they materially define runtime behavior; others downgrade features when those files are omitted.
- Stale defaults, flag claims, and header drift recur in at least 6 phases. Examples: Phase 012 and Phase 018 still have `default OFF` headers while runtime defaults are `ON`; Phase 017 still lists `ADAPTIVE_FUSION` as an active knob after graduation.

## P0 Findings (MISMATCHes requiring immediate action)
There are 4 actual `P0` mismatches, plus 6 additional `P0` recommendations on non-mismatch features.

- Phase 009 Feature 11: channel attribution is deprecated, never wired, and superseded by `ablation-framework.ts`, but catalog says it remains active.
- Phase 010 Feature 15: graph calibration profiles are deprecated, never wired into Stage 2, but catalog says “enabled by default” and graduated.
- Phase 011 Feature 23: fusion policy shadow V2 is deprecated, not exported, not consumed, and the flag does not exist, but catalog says it runs on each query.
- Phase 013 Feature 21: assistive reconsolidation does shadow-archive, not merge; catalog describes a fundamentally different behavior.
- Phase 002 systemic: add `history.ts` to Features 01-06 source lists.
- Phase 002 Features 01/02/05: trim massively over-inclusive source lists.
- Phase 012 Feature 05: fix dynamic token budget claim from `~12` to `~26` tokens/result.
- Phase 012 Feature 09: add missing source files and fix `SurrogateMatchResult` return type description.
- Phase 012 Feature 10: fix decomposition fallback claim to “falls through to expansion path.”
- Phase 012 Feature 11: clarify that Stage 1 records trace metadata only and does not activate the graph channel.

## P1 Remediation Backlog (all P1 recommendations consolidated)
Strict inventory note: this section includes explicit `P1` recommendations; Phase 001 uses `Priority 1` rather than `P1`, and Phases 006/014 include some unlabeled fixes that are not counted here as strict `P1`s.

- Phase 003 F03: document `embeddingRetry`.
- Phase 004 F01: add `history.ts`, `lifecycle-tools.ts`, `tools/index.ts`, `tools/types.ts`; remove extraneous files.
- Phase 005 F01/F07: update checkpoint scope to `21` tables; remove tier-demotion claim and clarify FSRS authority.
- Phase 007 F01/F02: prune ablation source list; document `k_sensitivity`; fix dashboard “markdown-formatted” claim.
- Phase 008 F07/F08/F09: reduce canonical-ID dedup source list; fix residual spread-site claim or document it; change “two instances” to “three call sites” and note explicit SQL path.
- Phase 009 F02/F08: update metric count from `11` to `12`; add handler wiring files.
- Phase 010 F11/F13/F14/F16: add temporal-contiguity deprecation notice; fix contradictory default statements; document sparse-mode limitation or pass `graphDensity`.
- Phase 011 F08/F13/F22: update K-grid; fix `Math.max` claim; rename `perIntentKSweep()` to `runJudgedKSweep()`.
- Phase 012 F07/F09: fix stale `default OFF -> ON` module headers.
- Phase 013 F10/F12/F13/F14/F17/F19: replace wrong source lists; add `entity-linker.ts` and remove deprecated `entity-scope.ts`; fix `QUALITY_GATE_ABORT`; correct “always active.”
- Phase 014 F18/F19/F07/F14/F12: update atomic write/index flow; replace deprecated `index-refresh.ts` with `retry-manager.ts`; trim over-inclusive lists; fix section placement/annotation.
- Phase 015 F04/F09: correct weekly cadence wording; prune contextual tree injection source list.
- Phase 016 F11/F15/F06/F18: fix “every file” code-reference claim; update `MODULE_MAP.md`; add runtime wiring files; fix template-contract count and Gemini omission.
- Phase 017 F02: remove `ADAPTIVE_FUSION` from the active-knob list.
- Phase 018 F02/F09/F15/F17: add orphan-cleanup repair actions; fix duplicate-save feedback asymmetry; wire or remove dead `profile`; fix stale default header.
- Phase 020 F02/F05/F03/F04: describe LRU eviction; replace test-file citations with production sources; add secondary consumer files for MCP config and memory/storage flags.

## Deferred/Deprecated Feature Inventory
- Confirmed deprecated-as-live: Phase 009 F11 channel attribution; Phase 010 F15 graph calibration profiles; Phase 011 F23 fusion policy shadow V2.
- Deprecated but still cataloged without adequate notice: Phase 010 F11 temporal contiguity; Phase 009 F04 full-context ceiling eval; Phase 014 F19 references deprecated `index-refresh.ts`; Phase 013 F13 still cites deprecated `entity-scope.ts`.
- Dead code or dead declarations presented as functional: Phase 013 F21 “merge” behavior; Phase 018 F15 `profile` on `memory_context`; Phase 005 notes dead `rebuildVectorOnUnarchive()` though the catalog was correct there.
- Stale documentation patterns: `default OFF/ON` header drift in Phases 012 and 018; graduated-flag drift in Phase 017; “always active” drift in Phase 013; test-file citations persisting in Phase 020.

## Source-List Hygiene Assessment
- Over-inclusive lists: at least 9 phases. Worst examples are Phase 002 (`103/62/132` files), Phase 007 ablation, Phase 014 F07/F14, and Phase 015 F09.
- Missing files: at least 11 phases. Common misses are handlers, dispatch layers, direct callers, and secondary consumers. Examples: Phase 001 F02, Phase 006 F01/F03, Phase 009 F08, Phase 020 F03/F04.
- Wrong or misleading files: at least 6 phases. Examples: Phase 001 F08 misattributes `stage4-filter.ts`; Phase 002 F07 points to the wrong routing file; Phase 006 cites `causal-links-processor.ts` instead of `causal-graph.ts`; Phase 020 F05 cites test files instead of production code.
- Systemic rubric issue: reviewers repeatedly disagreed on whether shared infrastructure like `tool-schemas.ts`, `tool-input-schemas.ts`, `memory-tools.ts`, `context-server.ts`, and common types should be listed per feature.

## Dependency Map (features that reference each other)
- Shared MCP tool chain: schema -> input schema -> dispatch -> handler -> server registration is a recurring dependency, but it is only partially documented and often treated inconsistently.
- Retrieval core: Phase 001 ties `memory_quick_search` to the shared `memory-search` handler and ties working-memory extraction to `extraction-adapter.ts` and `context-server.ts`; those dependencies are incompletely documented.
- Query intelligence -> graph activation: Phase 012 F11 is the clearest cross-phase mismatch. It claims graph activation, but the code only records Stage 1 trace metadata and never activates the Phase 010 graph channel behavior.
- Mutation/lifecycle/history: Phase 002 shows Features 01-06 all depend on `history.ts`; Phase 004 and Phase 005 also depend on lifecycle dispatch tooling. This dependency is under-documented.
- Causal graph tooling: Phase 006 shows `memory_causal_link` and `memory_causal_unlink` depend on `causal-graph.ts`, `causal-tools.ts`, and concrete caller paths like `memory-index.ts`, `memory-crud-delete.ts`, and `memory-bulk-delete.ts`.
- Evaluation supersession: Phase 009 shows channel attribution is superseded by `ablation-framework.ts`; Phase 011 shows another shadow-eval path is deprecated and unwired. Those supersession chains are not cataloged clearly.
- Flag-reference consumers: Phase 020 shows flag categories depend on downstream consumers such as `quality-loop.ts`, `memory-parser.ts`, `eval-db.ts`, and `context-server.ts`, but these consumer dependencies are only partially documented.

## Comparison with Prior Cross-Cutting Analysis
- The prior Phase 019 summary was directionally right about deprecated/dead modules. The re-audit confirms temporal contiguity, graph calibration, and channel attribution problems, and adds a new high-severity dead-as-live case in fusion policy shadow V2.
- The prior summary’s blind-spot thesis is also confirmed, but the re-audit sharpens it: the biggest practical problem is not just “never-mentioned files,” it is a three-way pattern of missing files, over-inclusive files, and wrong-file attribution.
- The prior documented deferrals mostly still hold: AST-level retrieval remains correctly deferred, warm server/daemon still audits clean, and anchor-tags-as-graph-nodes still looks legitimate. Namespace CRUD is the one prior deferral area that now also shows documentation-shape problems.
- The re-audit shifts emphasis from architectural decisions to catalog governance. The most urgent work is no longer discovering unknown architecture; it is correcting stale claims, deprecated-as-live entries, and source-list standards.

## Recommendations
- Triage the 4 `P0` mismatches first, then the 6 other `P0` corrections. Those are the only places where the catalog materially misstates live behavior.
- Define a single catalog source-list rule: include canonical implementation files, direct runtime handlers, and material feature-specific callers; exclude generic shared infrastructure unless the entry explicitly claims it.
- Add a catalog-wide note for shared infrastructure and a catalog-wide deprecation registry. That would resolve much of the recurring reviewer disagreement.
- Run one follow-up sweep purely for stale defaults, graduated flags, and dead declarations. Those issues are smaller individually, but they recur too often to keep handling ad hoc.