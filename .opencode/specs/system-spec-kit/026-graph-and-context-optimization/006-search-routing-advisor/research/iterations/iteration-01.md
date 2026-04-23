## Iteration 01

### Focus
Continuity intent reachability: whether the continuity-specific retrieval tuning added earlier is reachable through the live intent surface or only through internal caller overrides.

### Findings
- The continuity profile was intentionally added as an internal fusion profile while leaving the public classifier and router surface unchanged, so the phase itself documents a split between internal tuning and external intent exposure. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/implementation-summary.md:39-41`
- The continuity-validation phase assumes continuity-specific behavior is meaningful enough to benchmark directly, including a keep-`K=60` recommendation tied to resume-ladder queries. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation/spec.md:41-45`, `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:420-436`
- The live intent classifier still exposes only seven intents, with no `continuity` member in `IntentType`, `INTENT_TYPES`, or the runtime score map. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:32-40`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:404-423`
- The same classifier file still carries a continuity-specific MMR lambda, which means continuity exists as a retrieval-side concept but not as a public classification outcome. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641-650`

### New Questions
- Which live callers actually set `adaptiveFusionIntent='continuity'` instead of relying on `classifyIntent()`?
- Does the hybrid path fully honor continuity-specific weights once that internal intent is supplied?
- Are any docs still describing continuity as if it were a normal classifier output?
- Do current tests prove continuity correctness only under synthetic fixture injection rather than end-to-end request flow?

### Status
new-territory
