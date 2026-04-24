# Iteration 21 — correctness

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-020.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/spec.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
18. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
19. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
20. `.opencode/plugins/spec-kit-skill-advisor{,-bridge.mjs}`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

1. **R21-P1-001 — `advisor_recommend` does not implement the fail-open empty-set contract for absent advisor state.**
   - **Claim:** Child 027/004 requires `advisor_recommend` to return an empty fail-open recommendation set when daemon state is absent, but the MCP handler always calls `scoreAdvisorPrompt()` and can still emit recommendations from the filesystem projection even when freshness is `absent` or `unavailable`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:119-122`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:54-107`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:177-257`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:207-307`]
   - **evidenceRefs:** `[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:119-122",".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:54-107",".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:177-257",".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:207-307"]`
   - **Counterevidence sought:** I checked whether the fail-open guarantee was enforced somewhere below the handler. It is not. The only explicit short-circuit lives in the compat bridge and Python shim path, which refuse the native route when the probe reports unavailable state, but the MCP handler itself has no comparable guard. The handler test suite also covers `disabled` and `stale` only, not `absent`. [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:163-193`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:279-293`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:103-142`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:167-197`]
   - **Alternative explanation:** The implementation may have intentionally treated filesystem projection scoring as acceptable local fallback for the MCP tool while reserving strict fail-open behavior for the compat shim and plugin bridge.
   - **finalSeverity:** `P1`
   - **confidence:** `0.95`
   - **downgradeTrigger:** Downgrade if 027/004 AC-6 is explicitly narrowed so the empty fail-open requirement applies only to compat surfaces and not to direct MCP `advisor_recommend`.

2. **R21-P1-002 — `advisor_status` omits fields still required by 027/004 §4.1.**
   - **Claim:** The 027/004 spec still requires `advisor_status` to return freshness, generation, trust state, skill count, and last scan time, but the shipped schema/handler only expose freshness, generation, trust state, lastGenerationBump, laneWeights, daemonPid, and errors. Neither the implementation summary nor the checklist records the missing `skill count` or `last scan time` as deferred or superseded. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:84-90`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:58-76`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:41-94`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md:55-59`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:54-70`]
   - **evidenceRefs:** `[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:84-90",".opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:58-76",".opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:41-94",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md:55-59",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:54-70"]`
   - **Counterevidence sought:** I looked for a replacement field that could plausibly satisfy the contract. `lastGenerationBump` can approximate a scan timestamp, but there is no emitted skill-count field in either the schema or handler, and the packet docs present the narrower output as if the requirement were fully met. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:62-76`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:65-73`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md:55-59`]
   - **Alternative explanation:** The packet may have intentionally relaxed the status payload after implementation and failed to update the child spec/checklist to reflect the narrower contract.
   - **finalSeverity:** `P1`
   - **confidence:** `0.91`
   - **downgradeTrigger:** Downgrade if there is a later authoritative decision record or accepted spec revision that removes `skill count` and `last scan time` from the 027/004 required surface.

### P2

- None new this iteration.

## Traceability Checks

- **Deterministic promotion gates still hold in the shipped code/tests.** The seven-gate evaluator still enforces the full/holdout/latency/parity/regression thresholds described by 027/006, and the promotion tests cover pass/fail independence plus the two-cycle rule. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md:89-118`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:13-136`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:110-233`]
- **Compat migration behavior is preserved at the shim/bridge seam.** The Python shim still routes to native when available, falls back locally when forced, preserves `--stdin`, and honors the shared disable flag; the bridge still probes native availability before using the MCP handler. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:116-129`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:56-83`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:103-142`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-71`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:143-193`] [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:279-293`]
- **ADR-007 parity intent remains implemented.** The promotion gate bundle still requires zero exact-parity regressions on Python-correct prompts, matching the deterministic-gate constraint carried into 027/006. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:115-127`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:117-132`]

## Verdict

**CONDITIONAL.** No new P0 surfaced, but two new P1 correctness mismatches remain: the direct MCP `advisor_recommend` handler does not honor the 027/004 AC-6 fail-open contract for absent advisor state, and `advisor_status` does not emit the full §4.1 status fields still declared by the child spec.

## Next Dimension

**security** — re-check that the same MCP and compat surfaces enforce the prompt-safe/privacy contract at every status, cache, and bridge boundary.
