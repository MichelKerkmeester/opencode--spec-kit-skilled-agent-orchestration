## Iteration 05
### Focus
Audit how much the search-routing and advisor story changed after the archived run, especially around measurement quality and routing-surface complexity.

### Findings
- The active search-routing parent now includes seven implementation children, including smart-router remediation, code/doc alignment, and a deferred telemetry run. That is materially more implementation surface than the archived root packet had available. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/implementation-summary.md:61-71`
- Phase 024 finally shipped a 200-prompt static harness, a live-session wrapper, and a telemetry analyzer, but the packet is explicit that static results are predictive only: the run processed 200/200 prompts and achieved 112/200 advisor top-1 matches, while live-session evidence still depends on wrapper capture. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:48-60`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:117-123`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:130-132`
- I infer the repo now has at least two routing planes that prior iterations never had to reconcile explicitly: the front-door subsystem order documented as `Code Graph -> CocoIndex -> Memory`, and the inner search-pipeline complexity router where simple and moderate tiers do not include the `graph` channel. That is not necessarily a contradiction, but it is definitely more architecture than the archived research evaluated. Evidence: `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64-72`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:154-157`
- Track 1 remains blocked because `.codex` writes were denied, so even the telemetry packet closes with an explicit configuration gap for Codex runtime registration. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:62-65`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:122-123`

### New Questions
- Which operator docs should distinguish front-door routing from inner memory-search channel selection?
- What live-session sample size is needed before the 112/200 predictive result can be turned into a stronger efficacy claim?
- Does the blocked Codex config step hide any systematic under-measurement for one runtime versus the others?

### Status
new-territory
