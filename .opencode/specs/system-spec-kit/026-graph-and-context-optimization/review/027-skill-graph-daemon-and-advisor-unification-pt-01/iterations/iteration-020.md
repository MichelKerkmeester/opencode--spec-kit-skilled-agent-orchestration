# Iteration 20 — maintainability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-019.md`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/checklist.md`
5. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
6. `.opencode/plugins/spec-kit-skill-advisor.js`
7. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
8. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/package.json`
13. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md`
14. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- None new this iteration.

### P2

1. **Compat adapter boundary still depends on private dist layout instead of one exported advisor entrypoint.**
   - **Claim:** Phase 027/005 documents the plugin bridge and Python shim as thin adapters over the consolidated `mcp_server/skill-advisor/` package, but both compat callers still hardcode internal compiled file paths under `dist/skill-advisor/...` and legacy `dist/lib/skill-advisor/...`. That leaves the package boundary only partially consolidated: any future dist layout cleanup or export refactor requires synchronized edits across the Python shim, the bridge, and the plugin cache signature list instead of changing one stable public entrypoint.
   - **Evidence refs:** `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-77`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:227-233`, `.opencode/plugins/spec-kit-skill-advisor.js:23-30`, `.opencode/skill/system-spec-kit/mcp_server/package.json:7-12`
   - **Counterevidence sought:** I checked whether the consolidated package publishes an exported advisor subpath or shared adapter entrypoint that compat callers could target instead. `@spec-kit/mcp-server` exports only `.`, `./server`, `./api`, and `./api/*`, while the package-local indices remain internal source re-exports rather than published compat surfaces. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:7-16`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts:1-7`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts:1-7`]
   - **Alternative explanation:** This may be an intentional short-term choice to preserve legacy fallback behavior while the compat shim still needs old brief-rendering modules.
   - **Why this stays P2:** The regression suites do cover the seam, so the present risk is refactor brittleness and duplicated path maintenance, not a demonstrated release-blocking defect. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md:126-139`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:48-84`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`]

## Traceability Checks

- **Package-local organization is otherwise coherent.** The review target actually exists as a self-contained `skill-advisor/` package with `handlers/`, `tools/`, `lib/`, `schemas/`, `bench/`, and `tests/`, which matches the child D2/D8 intent better than the older scattered `lib/skill-advisor` layout. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:133-140`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md:113-123`]
- **Tests remain colocated and regression-oriented.** The compat seam has package-local shim and plugin-bridge tests, while parity enforcement still lives under `skill-advisor/tests/parity/`; that preserves the claimed 13-file advisor suite plus 52/52 Python regression coverage. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md:131-139`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:61-84`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`]
- **The remaining drift is boundary hygiene, not functional coverage.** The 005 packet's "plugin stays as adapter" narrative is implemented, but today that adapter still reaches into non-exported build artifacts instead of a published compat contract. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:79-81`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:23-30`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:7-12`]

## Verdict

**PASS** (`hasAdvisories=true`). No new P0/P1 maintainability defect surfaced, but there is one P2 advisory: the compat seam is still coupled to private dist paths rather than a stable exported advisor adapter entrypoint.

## Next Dimension

**correctness** — re-check whether this private-path coupling is only structural debt or whether any acceptance scenario depends on an API boundary that is stronger than what shipped.
