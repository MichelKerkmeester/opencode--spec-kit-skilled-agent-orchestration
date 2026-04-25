## Iteration 05

### Focus

This round audited the MCP tool surface directly. I compared schemas and handlers to see whether the package exposes a consistent operator contract for workspace selection, validator control, and parity checks, or whether runtime integrations have to rely on hidden process conventions.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-04.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`

### Findings

- The public tool surface is asymmetric: `advisor_status` requires `workspaceRoot`, but `advisor_recommend` and `advisor_validate` do not accept it and instead infer the repo from process state or upward directory walking, which makes external/runtime parity less explicit than the docs imply [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-92] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:24-33] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:44-58].
- `advisor_validate` exposes a required `confirmHeavyRun: true` input flag, but the implementation only parses it and then unconditionally runs the heavy validation bundle; the flag currently acts as an inert call-shape requirement rather than an actual control surface [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:89-92] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:282-299].
- `advisor_validate` is hard-wired to the packet-019 corpus path, so packet-local or runtime-specific parity checks cannot point the public tool at an alternate corpus without code changes [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:53-62].

### Evidence

> export const AdvisorStatusInputSchema = z.object({
>   workspaceRoot: z.string().min(1),
>   maxMetadataFiles: z.number().int().positive().max(10_000).optional(),
> }).strict(); [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:66-69]

> export const AdvisorValidateInputSchema = z.object({
>   confirmHeavyRun: z.literal(true),
>   skillSlug: z.string().min(1).nullable().optional(),
> }).strict(); [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:89-92]

> function computeRecommendationOutput(input: AdvisorRecommendInput): AdvisorRecommendOutput {
>   const workspaceRoot = findWorkspaceRoot();
>   const status = readAdvisorStatus({ workspaceRoot });
>   ...
>   const result = scoreAdvisorPrompt(input.prompt, {
>     workspaceRoot, [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:130-165]

### Negative Knowledge

- I did not find any hidden schema option that lets `advisor_recommend` or `advisor_validate` take an explicit `workspaceRoot`.
- The asymmetry is not confined to documentation; it exists in the shipped Zod schemas and handler code.

### New Questions

#### MCP Surface

- Should all three tools accept `workspaceRoot`, or should none of them?
- Should `advisor_validate` gain a corpus-path override or a separate runtime-parity mode?

#### Threshold Drift

- Does the validator use thresholds that match the documented promotion gates and prompt-time routing behavior?

#### Telemetry

- Which of these tool-surface gaps prevent runtime parity from being measured cleanly?

### Status

new-territory
