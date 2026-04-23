## Iteration 10

### Focus
Integrated failure chain: how the retrieval, ranking, and adapter boundaries interact when a request moves from intent selection to measurable compliance.

### Findings
- The continuity profile only becomes active when callers thread the internal `adaptiveFusionIntent` surface; it is not something the public classifier can emit on its own. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/implementation-summary.md:39-41`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:47-48`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:131-163`
- Even when an intent is supplied, the live hybrid path bypasses the `adaptiveFuse()` logic that would apply document-type adjustments and per-intent recency boosting. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1253`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:193-249`
- The advisor-side conflict safeguard can leave conflicting skills marked as passing because threshold evaluation is frozen before uncertainty is increased. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2829-2837`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:972-975`
- Downstream observability is intentionally observe-only and partly static, so it cannot automatically prove or reject the upstream correctness failures above without stronger live adapter wiring. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:94-99`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:48-60`

### New Questions
- Which fix sequence produces the fastest correctness gain: advisor threshold repair first, or hybrid-fusion behavior alignment first?
- Should continuity-specific end-to-end tests be added at the search entrypoint instead of only helper-layer fixtures?
- Can telemetry be labeled strongly enough to distinguish prediction failures from adapter-wiring gaps?
- Which packet should own the doc/runtime contract repair for the OpenCode plugin surface?

### Status
converging
