## Iteration 07

### Focus

This pass followed the telemetry surfaces instead of the scoring logic. I traced what a hook records, how health summaries are computed, and whether any of that data survives long enough to support recommendation-quality tuning beyond offline corpora.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-05.md`
- `iteration-06.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`

### Findings

- The prompt-safe hook diagnostic schema records runtime, status, freshness, duration, cache hit, error, skill label, and generation, but it does not include any field for whether the surfaced recommendation was accepted, corrected, ignored, or contradicted later [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-52].
- The shipped health collector is purely in-memory, while the hook adapters emit serialized diagnostics to stderr, so the packet-local code shows ephemeral telemetry primitives rather than a durable recommendation-quality feedback loop [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:263-309] [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:88-101] [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:156-169].
- `advisor_validate` still measures only offline corpus, holdout, parity, safety, and latency slices, which means the public evaluation surface has no live runtime-outcome dimension to close the loop on recommendation quality [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:321-369].

### Evidence

> export interface AdvisorHookDiagnosticRecord {
>   readonly timestamp: string;
>   readonly runtime: AdvisorRuntime;
>   readonly status: AdvisorHookStatus;
>   readonly freshness: AdvisorHookFreshness;
>   readonly durationMs: number;
>   readonly cacheHit: boolean; [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:41-47]

> export class AdvisorHookMetricsCollector {
>   private readonly records: AdvisorHookDiagnosticRecord[] = [];
>
>   record(record: AdvisorHookDiagnosticRecord): void {
>     ...
>     this.records.push(record);
>   } [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:282-293]

> const line = serializeAdvisorHookDiagnosticRecord(createAdvisorHookDiagnosticRecord({
>   runtime: 'claude',
>   ...record,
> }));
> writeDiagnostic(line); [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:92-98]

### Negative Knowledge

- I did not find packet-scope evidence of a durable hook-diagnostic store or a public MCP surface that exposes the in-memory health collector.
- The existing telemetry is not prompt-unsafe; the gap is persistence and outcome semantics, not privacy discipline.

### New Questions

#### Telemetry

- Where should prompt-safe outcome events live: hook adapters, orchestrator/skill invocation, or a dedicated advisor sink?
- Should the in-memory health collector become a real status surface or be removed from public expectations?

#### Recommendation Quality

- Which minimal outcome signal would actually let the team calibrate false positives and abstains from live use?

#### Runtime Parity

- Can bespoke runtime paths like Codex/OpenCode even emit comparable diagnostics today?

### Status

new-territory
