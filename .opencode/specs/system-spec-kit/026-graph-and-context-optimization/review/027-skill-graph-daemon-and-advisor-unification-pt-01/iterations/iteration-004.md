# Iteration 4 — maintainability

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None.

### P2

#### R4-P2-001 — compat entrypoints are pinned to private `dist/` internals

- **Claim:** The maintainability target for clean package boundaries is weakened because both compat entrypoints (`spec-kit-skill-advisor.js` and `skill_advisor.py`) depend on private compiled file paths inside `mcp_server/dist/...` instead of a supported export surface, and the Python shim carries a second embedded Node bridge for the same probe/delegate contract.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md:27-30`; `.opencode/skill/system-spec-kit/mcp_server/package.json:7-12`; `.opencode/plugins/spec-kit-skill-advisor.js:23-30`; `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-152`; `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:227-233`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-77`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py:192-203`.
- **Counterevidence sought:** I looked for a package export or shared adapter module that compat callers could target instead of deep `dist/` paths. The exported surface remains limited to `.`, `./server`, and `./api`, while the compat tests only confirm the current paths work, not that the boundary is intentionally public or centralized.
- **Alternative explanation:** This may be an intentional repository-private contract, with stable build layout accepted as the integration point during the transition period.
- **Final severity:** P2
- **Confidence:** 0.91
- **Downgrade trigger:** Downgrade if the private `dist/skill-advisor/**` layout is explicitly documented as a supported compat interface or replaced by a generated manifest/shared loader that all compat callers consume.

## Traceability Checks

- Maintainability scope matched the review packet contract for clean package boundaries, import conventions, colocated tests, and regression preservation [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md:27-30`].
- Compat regression tests remain colocated under `mcp_server/skill-advisor/tests/compat/`, covering both plugin and shim entrypoints [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:1-20`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:1-20`].
- The compat packet still claims regression coverage and preserved migration behavior; this advisory is about boundary brittleness, not missing tests [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:39-42`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:71-74`].
- No dead-code markers (`TODO`, `FIXME`, `XXX`, `HACK`) were found in the reviewed `skill-advisor/` tree during this maintainability pass.

## Verdict

**PASS** (`hasAdvisories=true`). No new P0/P1 maintainability defects surfaced this iteration; one P2 advisory remains around private build-layout coupling across the compat adapters.

## Next Dimension

**correctness follow-up** — re-check the already-open validation and promotion-path P1s now that all four canonical dimensions have coverage.
