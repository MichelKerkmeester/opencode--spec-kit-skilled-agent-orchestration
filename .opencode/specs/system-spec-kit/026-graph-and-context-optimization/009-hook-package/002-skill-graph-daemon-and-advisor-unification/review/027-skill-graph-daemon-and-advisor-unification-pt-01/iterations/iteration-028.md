# Iteration 28 — maintainability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-024.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/spec.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md`
9. `.opencode/skill/system-spec-kit/mcp_server/package.json`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
18. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
19. `.opencode/plugins/spec-kit-skill-advisor.js`
20. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
21. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- None new this iteration.

### P2

- None new this iteration. The previously logged advisory about compat callers depending on private compiled paths instead of a single published advisor compat entrypoint still stands, but this pass did not find a widened boundary break, dead-code drift, or regression-suite erosion. [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:22-30`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:227-233`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-77`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:7-12`]

## Traceability Checks

- **Package boundaries remain coherent at the source level.** The parent Phase 027 spec still defines the self-contained `mcp_server/skill-advisor/` package boundary, and the 004 checklist still records the shipped `schemas/`, `handlers/`, `tools/`, and `tests/` layout under that package. The current source indices are still thin re-export lists for exactly the three MCP handlers and three tool descriptors, with no fresh duplicate registration seam. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/spec.md:133-140`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:90-95`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts:5-7`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts:5-7`]
- **Tests remain colocated around the public seams that matter.** Handler tests still exercise `advisor_status` and `advisor_recommend` from package-local test folders, while compat tests still cover the plugin bridge and Python shim paths from `skill-advisor/tests/compat/`. That preserves the maintainability contract that regression protection lives next to the exported boundary rather than in a distant integration-only suite. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts:7-8`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:16-20`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`]
- **The compat bridge still carries the same private-dist coupling, but it has not spread into the package-local handler surface.** The JavaScript plugin and bridge still import concrete built files, and the Python shim still hardcodes native handler file paths, yet the current handler implementations themselves continue to depend only on package-local libs and schemas. That keeps the debt advisory-sized and unchanged rather than signaling a new maintainability regression inside `mcp_server/skill-advisor/`. [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:23-30`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:227-233`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-77`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:8-17`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:8-16`]
- **No fresh import-path inconsistency or dead surface showed up in the shipped maintainability hotspots.** `advisor_status`, `advisor_recommend`, and `daemon-probe` still point at package-local internals, and 027/005’s checklist and implementation summary still record the compat suite and native-first routing as intentionally preserved behavior. I did not find an extra orphaned helper, duplicate fallback, or missing regression test behind the compat seam. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:8-17`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:8-16`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts:7-8`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:39-43`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md:113-139`]

## Verdict

**PASS**. No new P0/P1 maintainability issue surfaced in iteration 28. The package remains reviewable and regression-protected; the only substantiated maintainability debt is the already-known private-dist compat coupling, and this pass did not find evidence that it widened.

## Next Dimension

**correctness** — re-check the native/compat delegation path for behavior parity now that maintainability still points to boundary debt rather than source-level drift.
