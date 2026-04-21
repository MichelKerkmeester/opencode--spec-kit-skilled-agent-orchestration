# Iteration 003 - Robustness

## Scope

Reviewed override handling, decision consistency, and Tier 3 prompt construction.

## Verification

- Vitest: PASS, `tests/content-router.vitest.ts` 30/30.
- Git log checked.
- Grep checked `routeAs`, `chunk_text`, `normalizeChunkText`, `buildTier3Prompt`, and `refusal`.

## Findings

### IMPL-P2-001 - Explicit routeAs='drop' produces an internally inconsistent non-refusal decision

Severity: P2

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:511` builds an override target for every `routeAs` value.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:518` forces `refusal: false`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1076` maps `drop` to a refuse-to-route target.
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:509` covers a non-drop override but not `routeAs: "drop"`.

Probe result for `routeAs: "drop"`: category `drop`, merge mode `refuse-to-route`, `refusal=false`, `overrideable=true`.

### IMPL-P2-002 - Tier 3 prompt sends unbounded raw chunk text even though normalized routing text is clipped

Severity: P2

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:586` builds Tier 3 input.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:591` records raw chunk length.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1125` normalizes routing text.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1130` clips normalized text to 2048 characters.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1310` inserts full `input.chunk_text` into the Tier 3 prompt.

Expected result: Tier 3 prompt should use a bounded raw preview or the normalized clipped text.

## Churn

New findings: 2. Severity-weighted new finding ratio: 0.2.
