# Iteration 018 — D3: Type / schema duplication

## Focus
Audited Zod schemas, TypeScript-only unions, and runtime guards under `.opencode/skill/system-spec-kit/mcp_server/` for duplicated shapes and drift risk. The highest-signal pattern is repeated enum literal vocabularies beside nominally canonical types, plus duplicated MCP JSON-schema and Zod input contracts.

## Actions Taken
- Read `sk-deep-research/SKILL.md` to confirm LEAF iteration constraints and artifact expectations.
- Enumerated MCP server files with `rg --files .opencode/skill/system-spec-kit/mcp_server`.
- Searched for Zod schemas and inferred types with `rg -n "from ['\"]zod|z\\.object|z\\.enum|z\\.infer"`.
- Searched runtime guards and loose record parsing with `rg -n "is[A-Z]|Record<string, unknown>|parse\\(|safeParse\\("`.
- Read schema/type clusters in `skill_advisor/schemas/advisor-tool-schemas.ts`, `skill_advisor/schemas/daemon-status.ts`, `skill_advisor/schemas/generation-metadata.ts`, `skill_advisor/lib/freshness/trust-state.ts`, `skill_advisor/lib/scorer/types.ts`, `skill_advisor/schemas/skill-derived-v2.ts`, `skill_advisor/lib/skill-advisor-brief.ts`, and `skill_advisor/lib/metrics.ts`.
- Read MCP tool input/public schema clusters in `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `utils/tool-input-schema.ts`, and the `memory_search` handler.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-018-D3-01 | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts:38 | The caller-trust vocabulary is declared as `SkillGraphTrustState = 'live' \| 'stale' \| 'absent' \| 'unavailable'`, and the file comments say this module is the single source of truth. The same literal set is still redefined in `AdvisorFreshnessSchema` at `skill_advisor/schemas/advisor-tool-schemas.ts:8`, `DaemonStatusSchema.trustState` at `skill_advisor/schemas/daemon-status.ts:18`, `GenerationMetadataSchema.state` at `skill_advisor/schemas/generation-metadata.ts:12`, `ADVISOR_HOOK_FRESHNESS_VALUES` at `skill_advisor/lib/metrics.ts:22`, and the runtime guard `isFreshness()` at `skill_advisor/handlers/advisor-status.ts:31-32`. There is no current value mismatch, but the canonical type and runtime schemas can drift independently. | Export a canonical `SKILL_GRAPH_TRUST_STATE_VALUES` tuple from `trust-state.ts` or a nearby schema module, derive `SkillGraphTrustState` from it, and build all Zod enums plus guards from that tuple. |
| F-018-D3-02 | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:10 | `SkillLifecycleStatus` is declared as a TypeScript union, while the same four values are independently encoded in `SkillLifecycleStatusSchema` at `skill_advisor/schemas/skill-derived-v2.ts:18-23` and `AdvisorRecommendationSchema.status` at `skill_advisor/schemas/advisor-tool-schemas.ts:52`. This is a classic z.infer drift risk: the external runtime schema can accept or reject a lifecycle status that the scorer projection type does not model. | Move lifecycle values to one exported tuple/schema, infer the TS type from the schema or tuple, and reuse it in scorer projection types and advisor output schemas. |
| F-018-D3-03 | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:47 | Advisor runtime and outcome labels are split across TS unions, tuples, Zod schemas, and guards. `AdvisorRuntime` is declared in `skill-advisor-brief.ts:47`, `ADVISOR_RUNTIME_VALUES` repeats it in `skill_advisor/lib/metrics.ts:20`, and `AdvisorValidateInputSchema.outcomeEvents.runtime` repeats it again at `skill_advisor/schemas/advisor-tool-schemas.ts:138`. The same pattern exists for outcomes: `AdvisorOutcome` at `skill_advisor/lib/metrics.ts:39`, Zod at `skill_advisor/schemas/advisor-tool-schemas.ts:139`, and `validateAdvisorHookOutcomeRecord()` checks literal strings at `skill_advisor/lib/metrics.ts:399-407`. | Define `ADVISOR_RUNTIME_VALUES` and `ADVISOR_OUTCOME_VALUES` once, derive `AdvisorRuntime` and `AdvisorOutcome` from them, and feed those tuples into Zod schemas and guard helpers. |
| F-018-D3-04 | P2 | .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50 | MCP tool inputs have two manually maintained schemas: public JSON Schema in `tool-schemas.ts` and runtime Zod schemas in `schemas/tool-input-schemas.ts`. Example: `memory_context` JSON schema is in `tool-schemas.ts:50` while its Zod schema is in `schemas/tool-input-schemas.ts:161-177`; `memory_search` JSON schema declares `x-requiredAnyOf` at `tool-schemas.ts:60`, while the Zod `memorySearchSchema` at `schemas/tool-input-schemas.ts:179-213` does not enforce that and the handler repeats the requirement at `handlers/memory-search.ts:678-683`. `ALLOWED_PARAMETERS` is a third copy of the field list at `schemas/tool-input-schemas.ts:704-706`. | Make Zod the input source of truth and generate MCP JSON Schema plus allowed-parameter lists from it, or move to a shared declarative tool contract object that emits both runtime validation and public MCP schema. |

## Questions Answered
- The same trust-state/freshness shape is defined in at least six places despite an existing canonical module.
- Skill lifecycle status has both a runtime Zod schema and an independent scorer TypeScript union.
- Advisor runtime/outcome labels are duplicated across schemas, guards, and metrics contracts.
- MCP tool input shapes are duplicated between public JSON Schema, Zod validators, handler-level fallback validation, and allowed-parameter error lists.

## Questions Remaining
- Whether any tests intentionally depend on public JSON Schema being looser or stricter than runtime Zod validation.
- Whether `utils/tool-input-schema.ts` is still used by an older entry point or can be retired now that `validateToolArgs()` is the active path.
- Whether generated JSON Schema from Zod is acceptable for MCP descriptions, or whether descriptions/defaults need a richer metadata layer.

## Next Focus
Follow-on work should trace public MCP tool definitions against `TOOL_SCHEMAS` for exact field-by-field drift, because D3 found the duplication pattern but did not exhaustively diff every tool contract.
