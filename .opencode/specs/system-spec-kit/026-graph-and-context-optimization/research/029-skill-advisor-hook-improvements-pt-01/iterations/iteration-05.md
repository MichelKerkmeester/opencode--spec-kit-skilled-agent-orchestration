## Iteration 05

### Focus
Whether the MCP `advisor_status` surface actually reports live/tunable scoring state.

### Findings
- `advisor_status` returns `laneWeights: DEFAULT_SCORER_WEIGHTS` directly, with no read of promotion state, persisted weights, or adaptive overlays. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:11`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:127`.
- The shared weights config is hard-coded as exact literals and `parseScorerWeights()` only accepts that exact object shape, so the active scorer cannot currently reflect a changed live weight set. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:14`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:30`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:40`.
- Promotion code and schemas already model a broader live/candidate weight surface, including `learned_adaptive`, delta caps, and candidate-vs-live comparisons. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/promotion-cycle.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts:23`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts:21`.
- The feature catalog claims lane weights are “tunable only through the promotion pipeline” and surfaced through `advisor_status`, but the implementation still reports immutable defaults. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/04--scorer-fusion/06-weights-config.md:25`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/04--scorer-fusion/06-weights-config.md:31`.

### New Questions
- Is promotion state intentionally dormant today, or did `advisor_status` simply never get wired to it?
- Should `advisor_status` distinguish `configuredLaneWeights` from `effectiveLaneWeights` if live promotion can diverge from defaults?
- Does any current code path ever mutate live weights outside tests?
- Would exposing effective thresholds alongside effective weights make drift investigation materially easier?

### Status
converging
