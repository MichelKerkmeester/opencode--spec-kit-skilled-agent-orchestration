# Iteration 9 — correctness

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None.

### P2

- None.

No new correctness defect surfaced in this follow-up pass. The earlier correctness findings remain the same two packet-level gaps already recorded in iteration 1: `advisor_validate` still reports some deterministic gates via local synthetic booleans instead of measured parity/compat results, and the promotion bundle still evaluates only the seven coarse gates already documented earlier rather than expanding to new enforcement in this slice.

## Traceability Checks

- Phase 027/003 still defines the correctness source of truth as the deterministic gates in spec `§4.1.a`, including full-corpus top-1, holdout top-1, UNKNOWN ceiling, gold-`none` stability, explicit-skill no-regression, ambiguity stability, derived attribution, adversarial blocking, and regression-suite safety [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md:95-104`].
- The shipped parity suite still enforces the concrete corpus thresholds directly, including preserved Python-correct prompts, zero regressions, `>=140/200` TS-correct, `<=10` UNKNOWN, `<=10` gold-`none` false fires, and `>=28/40` holdout correctness [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`].
- The compat slice under 027/005 still exercises the native-routing shim and plugin bridge paths for force-native, force-local, shared disable flag, and stdin preservation, so this pass did not uncover a new migration regression in those entry points [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:116-146`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-70`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`].
- Rechecking the public validation surface confirms the previously logged limitation remains unchanged rather than widened: `advisor_validate` still calculates `explicitRegressions` as an empty local array and synthesizes regression-suite status from local booleans instead of invoking the parity/compat harnesses [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:180-245`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:6-41`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md:38-56`].
- Rechecking the promotion gate path also confirms the previously logged gap is stable rather than new: the evaluator still accepts only seven bundled inputs, and its tests still assert a seven-gate result shape [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:24-136`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:110-140`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md:48-56`].
- The native/compat adapters continue to preserve the expected routing split for this packet: `advisor_recommend` returns threshold-filtered native recommendations, the Python shim translates them back to the legacy array shape, and the plugin bridge still falls back to the legacy producer when native is unavailable or forced local [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:54-127`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py:294-343`; `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:195-307`].

## Verdict

**PASS.** No new P0/P1 correctness findings were added in iteration 9. This pass reconfirmed the existing correctness risks from iteration 1 but did not find a new divergence against Phase 027 `§4.1`, `§4.1.a`, `§5` acceptance, or the compat migration contract.

## Next Dimension

**security** — re-check sanitizer/privacy boundaries around `advisor_validate`, `advisor_recommend`, the Python shim, and the plugin bridge for prompt-safe publication and adversarial-stuffing handling.
