# Review Iteration 047
## Dimension: D3 Traceability
## Focus: All phases 017-023 vs specs — verify implementation matches spec claims

## Findings

### [P1] F057 - Phase 020 spec claims passive context enrichment pipeline but no implementation exists
- File: .opencode/specs/02--system-spec-kit/024-compact-code-graph/020-query-routing-integration/spec.md (Part 3)
- Evidence: The Phase 020 spec describes a "Passive Context Enrichment" pipeline (`runPassiveEnrichment()`) that would enrich all tool responses with code graph symbols, session continuity warnings, and high-confidence memories. No function named `runPassiveEnrichment` exists anywhere in the codebase. The only enrichment implemented is the query-intent routing in memory_context (Part 1) and the session_resume composite tool (Part 2). Part 3 of the spec is unimplemented.
- Fix: Either implement the passive enrichment pipeline or update the spec to mark Part 3 as DEFERRED.

### [P2] F058 - Phase 023 spec promises SQLite persistence for metrics but implementation is in-memory only
- File: .opencode/specs/02--system-spec-kit/024-compact-code-graph/023-context-preservation-metrics/spec.md (Phase A)
- Evidence: The Phase 023 spec says "Store as lightweight in-memory counters + periodic SQLite persistence." The implementation in context-metrics.ts uses only module-level variables with no SQLite persistence. Metrics are lost on server restart. The spec also describes Phase C (Dashboard) and Phase D (Drift Detection) which are not implemented.
- Fix: Update spec to indicate Phases B-D are DEFERRED. Note that in-memory-only is the current implementation scope.

### [P2] F059 - Phase 021 spec claims @context-prime agent creation but agent may not be wired into orchestrator
- File: .opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md (Part 2)
- Evidence: The spec says the @context-prime agent should be "invoked on first turn or after /clear by the orchestrator." Need to verify if orchestrate.md actually delegates to @context-prime. The agent file may exist but lack orchestrator integration.
- Fix: Verify orchestrator references and update spec status accordingly.

## Verified Correct (Traceability)
- Phase 017: All 7 P1 items (F030-F035, F041) from spec are implemented in tree-sitter-parser.ts and query-intent-classifier.ts
- Phase 017: All 8 P2 items (F036-F044) from spec are addressed or deferred as documented
- Phase 018: Part 1 (MCP First-Call Auto-Prime) is implemented via primeSessionIfNeeded() in memory-surface.ts
- Phase 018: Part 2 (Session Health Monitor) is implemented in handlers/session-health.ts
- Phase 019: ensure-ready.ts implements all three detection conditions (empty, HEAD change, mtime drift)
- Phase 019: Auto-trigger is wired into context.ts and query.ts handlers
- Phase 019: status.ts reports true freshness (fresh/stale/empty)
- Phase 020: Part 1 (Query-Intent Routing) is implemented in memory-context.ts with classifyQueryIntent
- Phase 020: Part 2 (session_resume composite) is implemented in session-resume.ts
- Phase 022: All 4 Gemini hook files exist (session-prime, compact-cache, compact-inject, session-stop)
- Phase 022: shared.ts provides Gemini-specific stdin/stdout handling
- Phase 023: Phase A (Session Metrics Collector) is implemented in context-metrics.ts with event types and quality scoring

## Iteration Summary
- New findings: 3 (1 P1, 2 P2)
- Items verified correct: 12
- Reviewer: Claude Opus 4.6 (1M context)
