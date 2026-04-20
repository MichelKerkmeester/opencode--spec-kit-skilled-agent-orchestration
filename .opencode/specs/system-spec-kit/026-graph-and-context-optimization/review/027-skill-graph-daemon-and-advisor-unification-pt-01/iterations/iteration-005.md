# Iteration 5 — correctness

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None.

### P2

- None.

No new correctness findings surfaced in this follow-up pass. The previously logged correctness defects from iteration 1 (`R1-P1-001`, `R1-P1-002`) remain the only open correctness issues touched by this slice.

## Traceability Checks

- Spec §4.1.a still requires the deterministic gates for full-corpus top-1, holdout top-1, UNKNOWN ceiling, gold-`none` stability, ambiguity handling, derived attribution, adversarial blocking, and regression preservation [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md:95-104`].
- The parity suite still enforces the core deterministic thresholds directly: preserved Python-correct decisions, zero regressions, `>=140/200` full-corpus correctness, `<=10` UNKNOWN results, `<=10` gold-`none` false fires, and `>=28/40` holdout correctness [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`].
- Compat migration behavior remains covered for native routing, local fallback, stdin preservation, disabled-flag handling, and plugin native/python route selection [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:116-147`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-70`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-61`].
- The native recommendation surface still publishes lifecycle/redirect metadata consumed by the compat adapters, and the handler tests keep that contract exercised [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:77-115`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:91-214`].
- Follow-up recheck confirms the earlier correctness gaps are unchanged but not widened: `advisor_validate` still synthesizes part of its deterministic output locally, and the promotion bundle still evaluates only the seven coarse gates already recorded in iteration 1 [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:170-249`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:72-136`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:110-140`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md:38-56`].

## Verdict

**PASS.** No new P0/P1 correctness findings surfaced in this follow-up pass. Previously logged correctness findings remain open, but this iteration adds no new defects.

## Next Dimension

**security** — re-check write/publication boundaries around `advisor_validate`, `advisor_recommend`, and the compat bridge/shim surfaces for sanitizer and prompt-safety coverage.
