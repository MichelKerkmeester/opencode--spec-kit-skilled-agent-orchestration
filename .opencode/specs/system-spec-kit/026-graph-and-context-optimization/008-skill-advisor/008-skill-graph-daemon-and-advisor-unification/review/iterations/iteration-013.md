# Iteration 13 — correctness

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-009.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-012.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
10. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ambiguity.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/rollback.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
18. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
19. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/daemon-status.ts`
20. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts`
21. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
22. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`
23. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
24. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`
25. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
26. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
27. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
28. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
29. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
30. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
31. `.opencode/plugins/spec-kit-skill-advisor.js`
32. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
33. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md`
34. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/checklist.md`
35. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None new this iteration. The previously logged correctness defects `R1-P1-001` and `R1-P1-002` still describe the only confirmed P1 correctness gaps in this packet.

### P2

- None new this iteration. The previously logged contract-narrowing advisory `R1-P2-001` remains unchanged.

## Traceability Checks

- Phase 027/003 still defines deterministic correctness in `§4.1.a`, and the shipped scorer/parity suites still cover the concrete gates the spec names: full-corpus top-1, holdout top-1, UNKNOWN ceiling, gold-`none` stability, explicit-skill preservation, ambiguity handling, derived attribution, and adversarial stuffing rejection [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md:95-104`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts:37-140`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`].
- The lifecycle migration path still matches 027/002’s additive-backfill / additive-strip contract: mixed-version reads keep v1 routable, backfill upgrades to schema v2 with `derived`, and rollback strips `derived` while resetting `schema_version` to `1` [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:82-91`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/schema-migration.ts:28-57`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/rollback.ts:22-42`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts:255-280`].
- The compat migration surfaces still preserve the required native/local split and disable/stdin behavior instead of introducing a new correctness regression in the shim or bridge path [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:116-147`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`].
- Re-reading the MCP/public validation surfaces confirms the earlier correctness findings are stable rather than widened: `advisor_validate` still synthesizes explicit-regression output locally, and the promotion bundle still evaluates the same seven coarse gates recorded in iteration 1 [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:180-245`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:24-136`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md:38-68`].
- The narrower MCP status contract previously logged as `R1-P2-001` is still present but not expanded: daemon internals have `lastScanAt`, yet the public `advisor_status` schema/handler still omit both `skillCount` and `lastScanAt` equivalents [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:84-99`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/daemon-status.ts:10-26`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts:105-135`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:62-76`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md:60-68`].

## Verdict

**PASS** (`hasAdvisories=true`). No new P0/P1 correctness findings surfaced in iteration 13; this pass only reconfirmed the previously logged iteration-1 gaps and found no new divergence against Phase 027 `§4.1`, `§4.1.a`, `§5`, or the migration-preservation contract.

## Next Dimension

**security** — re-check A7 sanitizer coverage, prompt-safe publication, and adversarial-stuffing rejection across the MCP handlers, shim, bridge, and derived-metadata write boundaries.
