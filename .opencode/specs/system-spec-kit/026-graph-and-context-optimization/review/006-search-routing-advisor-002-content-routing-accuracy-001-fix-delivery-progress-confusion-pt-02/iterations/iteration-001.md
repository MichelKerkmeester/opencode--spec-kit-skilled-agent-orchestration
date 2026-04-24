# Iteration 001 - Correctness

## Scope

Audited implementation code only:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

## Verification

- Git log checked for the three scoped files. Recent implementation history includes `f3dc189938 feat(026.015): save-flow planner-first trim` and later test additions in `561859235f`.
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/content-router.vitest.ts --reporter=default`: PASS, 30 tests.

## Findings

### F-001 - P1 Correctness - Generic sequencing plus verification cues can misroute ordinary progress as delivery

The delivery fix uses generic sequence words as delivery cues: `then`, `after`, and `before` are all accepted by `DELIVERY_SEQUENCE_CUES` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:404`. Verification words such as `check`, `checked`, and `confirm` are accepted by `DELIVERY_VERIFICATION_CUES` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:407`.

Those two broad cues are enough to set `strongDeliveryMechanics` through `deliveryMechanicMatchCount >= 2` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:974`. Once that happens, the normal progress floor is suppressed at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:986`, and delivery is lifted to `0.78` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:992`.

Behavior probe against the built router:

```text
"Updated the validator, then checked tests and confirmed the suite passes."
=> category narrative_delivery, confidence 0.78
```

Expected behavior for that sentence is `narrative_progress`: it describes what changed and that tests pass, without rollout, gating, release, or delivery sequencing mechanics.

## Delta

New finding: F-001.
