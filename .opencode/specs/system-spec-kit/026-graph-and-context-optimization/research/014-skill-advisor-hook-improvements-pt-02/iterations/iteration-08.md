## Iteration 08

### Focus

This round revisited weights, promotion, and observability together. The question was whether the public status/weights surfaces and the promotion docs describe a genuinely live adaptive system, or whether they mostly expose static defaults and helper-layer intentions.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-05.md`
- `iteration-06.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`

### Findings

- `advisor_status` still publishes `laneWeights: DEFAULT_SCORER_WEIGHTS`, so the public status tool reports static defaults rather than any observable live or candidate weight state [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:120-129] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:143-151].
- The weights schema itself is literal-locked to the default numbers, which means the public type surface is currently shaped for immutable defaults, not dynamic/adaptive weight reporting [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:14-20] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:30-42].
- The promotion docs claim two-cycle counter state persists across daemon restarts through the telemetry surface, but the actual two-cycle helper is a pure history-array function and rollback telemetry is callback-shaped with no built-in durable state store [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:29-32] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts:15-49] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts:31-72].

### Evidence

> const output: AdvisorStatusOutput = {
>   freshness: trustState.state,
>   generation: generation.generation,
>   ...
>   skillCount: sourceScan.count,
>   laneWeights: DEFAULT_SCORER_WEIGHTS, [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:120-128]

> export const ScorerWeightsSchema = z.object({
>   explicit_author: z.literal(EXPLICIT_AUTHOR_WEIGHT),
>   lexical: z.literal(LEXICAL_WEIGHT),
>   graph_causal: z.literal(GRAPH_CAUSAL_WEIGHT),
>   derived_generated: z.literal(DERIVED_GENERATED_WEIGHT),
>   semantic_shadow: z.literal(SEMANTIC_SHADOW_WEIGHT),
> }).strict(); [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:30-36]

> `lib/promotion/two-cycle-requirement.ts` tracks consecutive passing cycles for each candidate.
> ...
> The counter state is persisted across daemon restarts through the promotion telemetry surface. [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/05--promotion-gates/04-two-cycle.md:29-32]

### Negative Knowledge

- I did not find a packet-scope implementation that materializes live weights into `advisor_status`; the current status path is static by construction.
- I also did not find a built-in durable persistence layer inside `two-cycle-requirement.ts`; any persistence would need to exist outside this helper.

### New Questions

#### Observability

- Should `advisor_status` report effective live weights, candidate weights, or both?
- Is the literal-locked weights schema intentional safety, or just an unfinished placeholder for future adaptive work?

#### Promotion

- Where should two-cycle persistence actually live if the docs want to keep the restart-durability claim?

#### Tool Surface

- Should docs narrow their claim first, or should implementation grow to match it?

### Status

converging
