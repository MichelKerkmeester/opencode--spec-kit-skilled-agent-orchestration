---
title: "Coverage Matrix: 052 Stress Test Expansion and Alignment"
description: "Full feature catalog to stress_test coverage mapping."
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

# Coverage Matrix: 052 Stress Test Expansion and Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: coverage-matrix | v2.2 -->

## Scope

Maps the requested stress-test-relevant system-spec-kit categories plus the full code_graph and skill_advisor catalogs. Handler-only, CLI-only, compatibility, and documentation-only features are marked out-of-scope where stress_test is not the right layer.

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
