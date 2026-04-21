# Iteration 001 - Correctness

## Scope

Audited the packet code files:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

## Verification

- Vitest: PASS, `tests/content-router.vitest.ts` 30/30.
- Git log checked: implementation lines trace to `d8ea31810c feat(026): implement 10 sub-phases + 30-iteration deep review`.
- Grep/Glob checked for `repository state`, `git diff`, `list memories`, `force re-index`, `current state`, and `next session`.

## Findings

### IMPL-P1-001 - Handover notes that include repository state can still be refused

Severity: P1

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409` includes `repository state` in `HARD_DROP_WRAPPER_CUES`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001` raises strong handover language to `handover_state`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1010` still raises hard drop wrappers to `0.92`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:274` keeps repository-state telemetry in the drop prototype.

Adversarial probe:

`Current state: implementation fixes are compiled. Repository state is dirty with content-router.ts and tests/content-router.vitest.ts modified. Next session should resume by reviewing the diff and running verification.`

Observed result: category `handover_state`, target `scratch/pending-route-...json`, `refusal=true`, Tier 2 confidence about `0.66`.

Expected result: category `handover_state`, target `handover.md`, `refusal=false`.

## Churn

New findings: 1. Severity-weighted new finding ratio: 1.0.
