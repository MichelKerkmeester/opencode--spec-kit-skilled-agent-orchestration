# Iteration 24 — maintainability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-020.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-023.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md`
9. `.opencode/skill/system-spec-kit/mcp_server/package.json`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts`
16. `.opencode/plugins/spec-kit-skill-advisor.js`
17. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
18. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
19. `.claude/skills/sk-deep-review/references/quick_reference.md`
20. `.claude/skills/sk-deep-review/feature_catalog/03--review-dimensions/04-maintainability.md`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- None new this iteration.

### P2

- None new this iteration. The previously logged advisory from iteration 20 still stands: the compat seam remains coupled to private compiled paths rather than one published advisor entrypoint, but this pass did not find a widened boundary break or any loss of regression coverage. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-77`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:22-30`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:227-233`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:7-12`]

## Traceability Checks

- **Package-local organization still matches the intended consolidation.** The parent spec still defines a self-contained `mcp_server/skill-advisor/` package with package-local `lib/`, `tools/`, `handlers/`, and `tests/`, and the 004 checklist still records that the shipped advisor files stayed under those boundaries. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md:130-140`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:89-95`]
- **Tests remain colocated around the compat and handler seams.** The handler suite still imports the package-local handler surface directly, and the compat suite still exercises the bridge, shim, and daemon probe from `skill-advisor/tests/compat/`, so the maintainability contract around local regression coverage is intact. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts:1-83`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts:32-61`]
- **The only boundary debt I re-confirmed is the already-known private-dist coupling.** The plugin and bridge still import individual built files, and the Python shim still embeds specific handler paths, while the package exports only general MCP entrypoints rather than a stable advisor compat surface. That is unchanged from iteration 20 and remains advisory rather than a new regression. [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:22-30`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:227-233`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-77`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:7-12`]
- **No fresh dead-code or import-consistency erosion surfaced in the public package-local indices.** The source indices remain minimal re-export lists for handlers and tools, which matches the shipped three-tool surface without new stragglers or duplicate registration seams. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/index.ts:1-7`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/index.ts:1-7`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/implementation-summary.md:113-123`]

## Verdict

**PASS** (`hasAdvisories=true`). No new P0/P1 maintainability issue surfaced in iteration 24. The package remains self-contained and regression-protected; the only maintainability concern I could substantiate is the previously logged private-dist-path advisory, and this pass did not widen it.

## Next Dimension

**correctness** — run a stabilization pass on the compat/native boundary to confirm the remaining private-path advisory is still purely structural and does not weaken any shipped acceptance path.
