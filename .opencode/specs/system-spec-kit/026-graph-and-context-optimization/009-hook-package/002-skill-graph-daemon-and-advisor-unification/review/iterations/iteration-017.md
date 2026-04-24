# Iteration 17 — correctness

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-013.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/spec.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/decision-record.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
10. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
11. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/rollback.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
18. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
19. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
20. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
21. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
22. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
23. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
24. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
25. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- None new this iteration. The previously logged correctness defects `R1-P1-001` and `R1-P1-002` remain the only confirmed P1 correctness gaps in this packet.

### P2

- None new this iteration.

## Traceability Checks

- The deterministic acceptance gates in 027/003 are still represented by the shipped parity suite: full-corpus top-1, holdout top-1, UNKNOWN ceiling, gold-`none` false-fire ceiling, regression preservation, and lexical-ablation regression checks remain encoded exactly where the spec says they should be. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md:95-126`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`]
- The published `advisor_validate` contract still stops short of measuring the full 027/004 slice bundle, but this pass found no widening beyond the already logged `R1-P1-001`: the handler still computes local synthetic booleans for ambiguity / derived attribution / stuffing while the schema still exposes the same narrowed bundle. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:84-123`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:170-249`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:92-143`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md:38-56`]
- The promotion path still enforces only the seven coarse ADR-006 gates and therefore does not close the previously logged `R1-P1-002`, but it has not regressed further: thresholds, two-cycle expectation, and semantic-lock assumptions still match the existing implementation and tests. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md:87-118`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/decision-record.md:136-164`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:13-145`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:110-141`]
- The compat migration still preserves the required native/local split, disable flag behavior, stdin handling, and prompt-safe bridge behavior; no new correctness regression appeared in the shim or plugin bridge surfaces. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:116-147`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:266-343`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:163-294`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`]
- The migration helpers still satisfy ADR-005's additive-backfill / additive-strip contract: mixed-version reads stay routable, backfill only adds `derived` + `schema_version: 2`, and rollback removes `derived` while restoring schema version 1. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:82-113`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/decision-record.md:113-132`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts:28-57`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/rollback.ts:22-42`]

## Verdict

**PASS.** No new P0/P1 correctness findings surfaced in iteration 17; this pass reconfirmed the two previously logged iteration-1 correctness gaps without finding any new divergence against Phase 027 `§4.1`, `§4.1.a`, `§5`, ADR-005, or ADR-006.

## Next Dimension

**security** — re-check A7 sanitizer coverage and prompt-safe publication boundaries now that the correctness surfaces remain stable.
