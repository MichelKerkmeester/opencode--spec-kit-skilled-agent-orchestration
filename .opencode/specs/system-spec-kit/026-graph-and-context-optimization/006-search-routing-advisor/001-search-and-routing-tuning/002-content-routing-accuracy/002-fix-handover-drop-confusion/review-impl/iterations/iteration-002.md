# Iteration 002 - Security

## Scope

Focused on Tier 3 routing boundaries in `content-router.ts`, then followed the accepted target into the production save handler to confirm exploitability.

## Verification

- Vitest: PASS, `tests/content-router.vitest.ts` 30/30.
- Git log checked.
- Grep checked `target_doc`, `decision.target`, `resolveCanonicalTargetDocPath`, and `refuse-to-route`.

## Findings

### IMPL-P0-001 - Tier 3 can route to an arbitrary target_doc path

Severity: P0

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837` starts Tier 3 response validation.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859` accepts any string `raw.target_doc` when confidence is at least the floor.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687` copies `tier3Result.decision.target_doc` into the final routing target.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153` resolves routed document paths.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427` uses the routed target path before reading/writing.

Adversarial probe:

An injected Tier 3 classifier response with `category: "handover_state"`, `confidence: 0.83`, and `target_doc: "../../package.json"` produced:

`target.docPath = "../../package.json"`, `refusal=false`, `tierUsed=3`.

Expected result: the router should replace the target with the canonical handover target or refuse the route.

## Churn

New findings: 1. Severity-weighted new finding ratio: 0.625.
