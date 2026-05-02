---
title: "Audit Findings: 052 Stress Test Expansion and Alignment"
description: "Inventory, alignment findings, and coverage matrix for stress_test expansion."
template_source: "SPECKIT_TEMPLATE_SOURCE: level_2 | v2.2"
trigger_phrases:
  - "039-stress-test-expansion-and-alignment"
  - "stress test alignment"
  - "stress test coverage"
  - "sk-code-opencode stress test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/039-stress-test-expansion-and-alignment"
    last_updated_at: "2026-04-30T09:20:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Stress alignment verified"
    next_safe_action: "Orchestrator commit"
    blockers: []
    key_files:
      - "audit-findings.md"
      - "coverage-matrix.md"
      - "remediation-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "039-stress-test-expansion-and-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Audit Findings: 052 Stress Test Expansion and Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: audit-findings | v2.2 -->

## Section 1: Existing Stress Test Inventory

Final inventory after coverage additions: 32 TypeScript files, 28 vitest files, 69 tests.

| File | Subsystem | Test count | Behaviors covered |
|---|---|---:|---|
| `code-graph/budget-allocator-stress.vitest.ts` | code-graph | 2 | redistributes unused source floors to higher-priority context sources; trims low-priority overflow before protected context floors exceed the cap |
| `code-graph/code-graph-degraded-sweep.vitest.ts` | code-graph | 5 | routes empty-graph reads to code_graph_scan via fallbackDecision; routes broad-stale graphs to code_graph_scan via fallbackDecision; routes readiness exceptions to rg via fallbackDecision; emits no fallbackDecision when the graph is fresh |
| `code-graph/walker-dos-caps.vitest.ts` | code-graph | 2 | skips oversized .gitignore files with a warning instead of reading them whole; stops descending spec discovery past the configured max depth and keeps shallower packets indexable |
| `matrix/shadow-comparison.vitest.ts` | matrix | 21 | T1: corpus contains at least 50 queries; T2: corpus has exactly 20 simple queries; T3: corpus has exactly 20 moderate queries; T4: corpus has exactly 20 complex queries |
| `memory/gate-d-benchmark-memory-search.vitest.ts` | memory | 1 | keeps canonical memory-search across 7 intents under the Gate D latency budget |
| `memory/gate-d-benchmark-trigger-fast-path.vitest.ts` | memory | 1 | keeps the canonical trigger fast path under the Gate D latency budget |
| `memory/gate-d-trigger-perf-benchmark.vitest.ts` | memory | 1 | reports p50/p95/p99 for the canonical trigger-only fast path |
| `search-quality/baseline.vitest.ts` | search-quality | 1 | runs deterministic corpus and captures required quality dimensions |
| `search-quality/corpus.ts` | search-quality | 0 | Utility support module used by stress tests |
| `search-quality/harness-telemetry-export.vitest.ts` | search-quality | 3 | preserves runner telemetry on channel captures and case results; writes envelope, audit, and shadow rows to sibling JSONL files; does not create JSONL files when telemetry export is omitted |
| `search-quality/harness.ts` | search-quality | 0 | Utility support module used by stress tests |
| `search-quality/measurement-fixtures.ts` | search-quality | 0 | Utility support module used by stress tests |
| `search-quality/measurement-output.vitest.ts` | search-quality | 1 | runs the extended measurement corpus and optionally writes JSON output |
| `search-quality/metrics.ts` | search-quality | 0 | Utility support module used by stress tests |
| `search-quality/query-surrogates-stress.vitest.ts` | search-quality | 2 | generates aliases, headings, summary, and recall-oriented questions for rich content; matches indirect recall queries and returns null when the feature flag is disabled |
| `search-quality/w10-degraded-readiness-integration.vitest.ts` | search-quality | 1 | captures actual empty code_graph_query degraded readiness in SearchDecisionEnvelope |
| `search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` | search-quality | 1 | emits recommended multiplier into the envelope without applying adaptive overfetch |
| `search-quality/w13-decision-audit.vitest.ts` | search-quality | 2 | writes one JSONL audit row per envelope; computes SLA metrics from decision envelopes |
| `search-quality/w3-trust-tree.vitest.ts` | search-quality | 2 | composes response policy, graph, advisor, CocoIndex, and causal contradiction signals; improves W3 citation-quality in the variant fixture |
| `search-quality/w4-conditional-rerank.vitest.ts` | search-quality | 4 | reranks ambiguous multi-channel queries when triggers are present; skips rerank when no ambiguity or disagreement triggers fire; passes real QueryPlan into Stage 3 rerank gate telemetry; improves ambiguous-query precision in the variant fixture |
| `search-quality/w5-shadow-learned-weights.vitest.ts` | search-quality | 3 | keeps live weights fixed and exposes a separate shadow vector; accepts advisor_recommend output with _shadow diagnostics; improves advisor diagnostic citation-quality in the variant fixture |
| `search-quality/w6-cocoindex-calibration.vitest.ts` | search-quality | 2 | reports duplicate density and applies 4x overfetch only when flagged; improves duplicate-heavy precision in the variant fixture |
| `search-quality/w7-degraded-empty.vitest.ts` | search-quality | 1 | preserves harness metrics for empty fallback envelopes |
| `search-quality/w7-degraded-full-scan.vitest.ts` | search-quality | 1 | preserves harness metrics for full-scan-required fallback envelopes |
| `search-quality/w7-degraded-stale.vitest.ts` | search-quality | 1 | preserves harness metrics for stale fallback envelopes |
| `search-quality/w7-degraded-unavailable.vitest.ts` | search-quality | 1 | preserves harness metrics for unavailable rg fallback envelopes |
| `search-quality/w8-search-decision-envelope.vitest.ts` | search-quality | 3 | builds an empty versioned envelope with request identity and QueryPlan; composes trust tree, rerank decision, shadow deltas, calibration, and degraded readiness; supports partial attach composition without mutating the original envelope |
| `session/gate-d-benchmark-session-resume.vitest.ts` | session | 1 | keeps the 3-level happy-path resume ladder under the Gate D latency budget |
| `session/gate-d-resume-perf.vitest.ts` | session | 1 | measures session-resume happy path using the canonical 3-level ladder |
| `session/session-manager-stress.vitest.ts` | session | 2 | keeps interleaved inserts within maxCapacity tolerance; cleanupOldSessions removes expired sessions and preserves CURRENT_TIMESTAMP entries |
| `skill-advisor/scorer-fusion-stress.vitest.ts` | skill-advisor | 2 | keeps explicit workflow evidence ahead of weaker lexical candidates; marks tied high-confidence candidates as ambiguous instead of hiding the tie |
| `skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` | skill-advisor | 1 | serializes concurrent corruption rebuilds for the same database path |

### Subsystem Totals

| Subsystem | Test count |
|---|---:|
| code-graph | 9 |
| matrix | 21 |
| memory | 3 |
| search-quality | 29 |
| session | 4 |
| skill-advisor | 3 |

## Section 2: sk-code-opencode Alignment Findings

| File:line | Severity | Finding | Proposed fix | Status |
|---|---|---|---|---|
| stress_test/**/*.vitest.ts:1 | P1 | Missing subsystem behavior headers in many vitest files. | Add MODULE headers. | Fixed |
| memory/gate-d-benchmark-memory-search.vitest.ts:184 | P1 | JSON payload used Record<string, any>. | Add narrowed envelope parser. | Fixed |
| memory/gate-d-benchmark-trigger-fast-path.vitest.ts:186 | P1 | JSON payload used Record<string, any>. | Add narrowed envelope parser. | Fixed |
| session/gate-d-benchmark-session-resume.vitest.ts:143 | P1 | JSON payload used Record<string, any>. | Add narrowed resume parser. | Fixed |
| memory/gate-d-trigger-perf-benchmark.vitest.ts:148 | P1 | better-sqlite3 used require(). | Replace with ESM import. | Fixed |
| memory/session benchmark files | P1 | Bare benchmark console.log output. | Gate with DEBUG_STRESS_TEST. | Fixed |
| Remaining fixture casts | P2 | Bounded SQL row, tuple, and as const fixture assertions. | Defer with rationale. | Deferred |

## Section 3: Coverage Matrix

Mapped 166 catalog entries across the requested focus categories plus code_graph and skill_advisor catalogs.

| Status | Count |
|---|---:|
| Covered | 34 |
| Out-of-scope | 33 |
| Partial | 99 |

| Catalog | Feature | Status | Test file (if any) | Action |
|---|---|---|---|---|
| system-spec-kit | `06--analysis/01-causal-edge-creation-memorycausallink.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `06--analysis/02-causal-graph-statistics-memorycausalstats.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `06--analysis/03-causal-edge-deletion-memorycausalunlink.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `06--analysis/04-causal-chain-tracing-memorydriftwhy.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `06--analysis/05-epistemic-baseline-capture-taskpreflight.md` | Out-of-scope | mcp_server/tests/* | Analysis tools are handler/evaluation surfaces outside stress_test. |
| system-spec-kit | `06--analysis/06-post-task-learning-measurement-taskpostflight.md` | Out-of-scope | mcp_server/tests/* | Analysis tools are handler/evaluation surfaces outside stress_test. |
| system-spec-kit | `06--analysis/07-learning-history-memorygetlearninghistory.md` | Out-of-scope | mcp_server/tests/* | Analysis tools are handler/evaluation surfaces outside stress_test. |
| system-spec-kit | `06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `11--scoring-and-calibration/01-score-normalization.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/03-interference-scoring.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/04-classification-based-decay.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/05-folder-level-relevance-scoring.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/06-embedding-cache.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/07-double-intent-weighting-investigation.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/09-negative-feedback-confidence-signal.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/10-auto-promotion-on-validation.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/11-scoring-and-ranking-corrections.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/13-scoring-and-fusion-corrections.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/15-tool-level-ttl-cache.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/16-access-driven-popularity-scoring.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/19-learned-stage2-weight-combiner.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/21-calibrated-overlap-bonus.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/22-rrf-k-experimental.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/23-usage-weighted-ranking.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Covered | search-quality/w4; w5; w6; w11 | Search-quality stress cells cover ranking, rerank, calibration, and shadow paths. |
| system-spec-kit | `12--query-intelligence/01-query-complexity-router.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/03-channel-min-representation.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/04-confidence-based-result-truncation.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/05-dynamic-token-budget-allocation.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/06-query-expansion.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/07-llm-query-reformulation.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/08-hyde-hypothetical-document-embeddings.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/09-index-time-query-surrogates.md` | Covered | search-quality/query-surrogates-stress.vitest.ts | Added generation, matching, and disabled-flag edge coverage. |
| system-spec-kit | `12--query-intelligence/10-query-decomposition.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `12--query-intelligence/11-graph-concept-routing.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `13--memory-quality-and-indexing/04-spec-folder-description-discovery.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/05-pre-storage-quality-gate.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/06-reconsolidation-on-save.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/07-smarter-memory-content-generation.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/10-auto-entity-extraction.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/13-entity-normalization-consolidation.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/19-post-save-quality-review.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/21-assistive-reconsolidation.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/23-hybrid-decay-policy.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/26-spec-doc-structure-validator.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `13--memory-quality-and-indexing/28-memory-causal-trust-display.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `14--stress-testing/01-stress-test-cycle.md` | Covered | stress_test/**/* | This packet inventories, aligns, and expands stress_test. |
| system-spec-kit | `15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/04-lightweight-consolidation.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/05-memory-summary-search-channel.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/06-cross-document-entity-linking.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/08-provenance-rich-response-envelopes.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/09-contextual-tree-injection.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/10-session-boost-graduated.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/11-causal-boost-graduated.md` | Partial | memory/gate-d-*.vitest.ts; session/gate-d-*.vitest.ts | Retrieval and resume invariants are stress-covered; mutation loops stay external. |
| system-spec-kit | `15--retrieval-enhancements/12-graph-expanded-fallback.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/13-always-on-graph-context-injection.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/14-community-search-fallback.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `15--retrieval-enhancements/15-dual-level-retrieval.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/01-category-overview.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/02-precompact-hook.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/03-session-start-priming.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/04-stop-token-tracking.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/06-runtime-detection.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/07-structural-code-indexer.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/08-code-graph-storage-query.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/10-budget-allocator.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/11-working-set-tracker.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/12-compact-merger.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/13-tree-sitter-wasm-parser.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/14-query-intent-classifier.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/16-mcp-auto-priming.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/17-session-health-tool.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/18-session-resume-tool.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/19-query-intent-routing.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `22--context-preservation-and-code-graph/20-passive-context-enrichment.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/21-gemini-cli-hooks.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/22-context-preservation-metrics.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/23-tool-routing-enforcement.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/25-resource-map-template.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/26-skill-graph-scan.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/27-skill-graph-query.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| system-spec-kit | `22--context-preservation-and-code-graph/28-skill-graph-status.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/29-skill-graph-validate.md` | Partial | search-quality/baseline; w7; w10; code-graph/budget-allocator | Retrieval readiness and budget behavior are stress-covered; broad handlers remain external. |
| system-spec-kit | `22--context-preservation-and-code-graph/30-coverage-graph-query.md` | Partial | matrix/shadow-comparison.vitest.ts; search-quality/w8-search-decision-envelope.vitest.ts | Routing and query-plan telemetry are stress-covered; LLM-only expansion modes deferred. |
| code_graph | `01--read-path-freshness/01-ensure-code-graph-ready.md` | Covered | code-graph/code-graph-degraded-sweep.vitest.ts | Covered by degraded readiness stress sweep. |
| code_graph | `01--read-path-freshness/02-query-self-heal.md` | Covered | code-graph/code-graph-degraded-sweep.vitest.ts | Covered by degraded readiness stress sweep. |
| code_graph | `02--manual-scan-verify-status/01-code-graph-scan.md` | Out-of-scope | mcp_server/code_graph/tests/* | Handler/API behavior is covered outside stress_test. |
| code_graph | `02--manual-scan-verify-status/02-code-graph-verify.md` | Out-of-scope | mcp_server/code_graph/tests/* | Handler/API behavior is covered outside stress_test. |
| code_graph | `02--manual-scan-verify-status/03-code-graph-status.md` | Out-of-scope | mcp_server/code_graph/tests/* | Handler/API behavior is covered outside stress_test. |
| code_graph | `03--detect-changes/01-detect-changes-preflight.md` | Out-of-scope | mcp_server/code_graph/tests/* | Handler/API behavior is covered outside stress_test. |
| code_graph | `04--context-retrieval/01-code-graph-context.md` | Partial | code-graph/budget-allocator-stress.vitest.ts | Budget stress added; handler retrieval stays external. |
| code_graph | `04--context-retrieval/02-context-handler.md` | Partial | code-graph/budget-allocator-stress.vitest.ts | Budget stress added; handler retrieval stays external. |
| code_graph | `05--coverage-graph/01-deep-loop-graph-query.md` | Out-of-scope | mcp_server/tests/archive/coverage-graph-db.vitest.ts | Deep-loop coverage DB behavior is outside stress_test. |
| code_graph | `05--coverage-graph/02-deep-loop-graph-status.md` | Out-of-scope | mcp_server/tests/archive/coverage-graph-db.vitest.ts | Deep-loop coverage DB behavior is outside stress_test. |
| code_graph | `05--coverage-graph/03-deep-loop-graph-upsert.md` | Out-of-scope | mcp_server/tests/archive/coverage-graph-db.vitest.ts | Deep-loop coverage DB behavior is outside stress_test. |
| code_graph | `05--coverage-graph/04-deep-loop-graph-convergence.md` | Out-of-scope | mcp_server/tests/archive/coverage-graph-db.vitest.ts | Deep-loop coverage DB behavior is outside stress_test. |
| code_graph | `06--mcp-tool-surface/01-tool-registrations.md` | Out-of-scope | mcp_server/code_graph/tests/* | Handler/API behavior is covered outside stress_test. |
| code_graph | `07--ccc-integration/01-ccc-reindex.md` | Out-of-scope | CLI/manual surface | CLI adapter behavior is not stress_test runtime behavior. |
| code_graph | `07--ccc-integration/02-ccc-feedback.md` | Out-of-scope | CLI/manual surface | CLI adapter behavior is not stress_test runtime behavior. |
| code_graph | `07--ccc-integration/03-ccc-status.md` | Out-of-scope | CLI/manual surface | CLI adapter behavior is not stress_test runtime behavior. |
| code_graph | `08--doctor-code-graph/01-doctor-apply-mode.md` | Out-of-scope | CLI/manual surface | CLI adapter behavior is not stress_test runtime behavior. |
| skill_advisor | `01--daemon-and-freshness/01-watcher.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `01--daemon-and-freshness/02-lease.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `01--daemon-and-freshness/03-lifecycle.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `01--daemon-and-freshness/04-generation.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `01--daemon-and-freshness/05-trust-state.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `01--daemon-and-freshness/06-rebuild-from-source.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `01--daemon-and-freshness/07-cache-invalidation.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `02--auto-indexing/01-derived-extraction.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `02--auto-indexing/02-sanitizer.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `02--auto-indexing/03-provenance-and-trust-lanes.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `02--auto-indexing/04-sync.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `02--auto-indexing/05-anti-stuffing.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `02--auto-indexing/06-df-idf-corpus.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `03--lifecycle-routing/01-age-haircut.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `03--lifecycle-routing/02-supersession.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `03--lifecycle-routing/03-archive-handling.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `03--lifecycle-routing/04-schema-migration.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `03--lifecycle-routing/05-rollback.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `04--scorer-fusion/01-five-lane-fusion.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `04--scorer-fusion/02-projection.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `04--scorer-fusion/03-ambiguity.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `04--scorer-fusion/04-attribution.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `04--scorer-fusion/05-ablation.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `04--scorer-fusion/06-weights-config.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `06--mcp-surface/01-advisor-recommend.md` | Covered | skill-advisor/scorer-fusion-stress.vitest.ts; search-quality/w5-shadow-learned-weights.vitest.ts | Scoring, ambiguity, recommendation, and shadow weights are stress-covered. |
| skill_advisor | `06--mcp-surface/02-advisor-status.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `06--mcp-surface/03-advisor-validate.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `06--mcp-surface/04-compat-entrypoint.md` | Out-of-scope | mcp_server/skill_advisor/tests/* | Advisor indexing and validation are covered by unit/compat suites. |
| skill_advisor | `06--mcp-surface/05-advisor-rebuild.md` | Partial | skill-advisor/skill-graph-rebuild-concurrency.vitest.ts | Concurrent rebuild is stress-covered; lifecycle remains compat coverage. |
| skill_advisor | `07--hooks-and-plugin/01-claude-hook.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `07--hooks-and-plugin/02-copilot-hook.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `07--hooks-and-plugin/03-gemini-hook.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `07--hooks-and-plugin/04-codex-hook.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `07--hooks-and-plugin/05-opencode-plugin-bridge.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `08--python-compat/01-cli-shim.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `08--python-compat/02-regression-suite.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
| skill_advisor | `08--python-compat/03-bench-runner.md` | Out-of-scope | mcp_server/skill_advisor/tests/compat/* | Runtime adapters and Python shim belong to compatibility tests. |
