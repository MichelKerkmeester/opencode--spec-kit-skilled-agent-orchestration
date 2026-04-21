# Iteration 16 — maintainability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-004.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-008.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/decision-record.md`
7. `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`
8. `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
16. `.opencode/plugins/spec-kit-skill-advisor.js`
17. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
18. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- None new this iteration.

### P2

#### R16-P2-001 — advisor regression ownership is still split between package-local and top-level test trees

- **Claim:** Phase 027's self-contained package boundary is only partially realized because advisor-core regression suites still live under `mcp_server/tests/` instead of the package-local `mcp_server/skill-advisor/tests/` tree promised by D2/ADR-002, so maintainers must inspect two parallel test homes to update one subsystem.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md:133-140`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/decision-record.md:41-55`; `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:17-21`; `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:1-16`; `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:1-24`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:1-8`
- **Counterevidence sought:** I looked for evidence that the top-level advisor suites were limited to `_support` fixtures or pure cross-package integration tests. Instead, the reviewed `mcp_server/tests/advisor-*.vitest.ts` files directly exercise `skill-advisor` library modules (`skill-advisor-brief`, `prompt-cache`, `render`, `freshness`, `subprocess`) with local mocks, which is the kind of ownership ADR-002 says should live under the package's own `tests/` subtree.
- **Alternative explanation:** The split may be intentional because some advisor regressions are treated as server-wide integration coverage, so authors may prefer to keep those suites beside the broader `mcp_server/tests/` matrix while leaving compat-only suites under `skill-advisor/tests/compat/`.
- **Final severity:** P2
- **Confidence:** 0.88
- **Downgrade trigger:** Downgrade if there is an explicit documented test taxonomy that reserves `mcp_server/tests/` for advisor server-surface regressions while `skill-advisor/tests/` owns only package-internal and compat coverage, or if the top-level advisor suites are migrated under `skill-advisor/tests/`.

## Traceability Checks

- **Package boundary check:** ADR-002 still requires a self-contained `mcp_server/skill-advisor/` package with package-local tests; the current tree keeps the core package intact but leaves advisor-specific regressions split across two homes. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md:133-140`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/decision-record.md:41-55`]
- **Import-path consistency:** Imports inside the package remain coherent (`skill-advisor/handlers`, `tools`, `lib`, and MCP registration all route through the new package paths), so the new advisory is about test ownership drift rather than source import drift. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts:5-7`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts:5-7`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:10-15`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:13-18`]
- **Regression suites preserved:** Yes. `vitest.config.ts` still includes both `mcp_server/tests/**/*` and `mcp_server/skill-advisor/tests/**/*`, so coverage was not dropped; the maintainability issue is that the ownership boundary is fragmented. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:17-21`]
- **Prior maintainability advisories remain open but unchanged:** the earlier compat `dist/` coupling (R4-P2-001) and dual freshness-ledger split (R8-P2-001) are still the same known seams; this iteration adds a separate test-colocation advisory rather than widening those older findings. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-004.md:27-35`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-008.md:28-35`]

## Verdict

**PASS** (`hasAdvisories=true`). No new P0/P1 maintainability defects surfaced in iteration 16, but one new P2 advisory remains around split advisor test ownership.

## Next Dimension

**correctness** — revisit the existing Phase 027 P1 packet drift and validation-surface issues now that maintainability has another concrete boundary advisory logged.
