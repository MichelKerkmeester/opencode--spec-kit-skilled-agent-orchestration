# Iteration 29 — correctness

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-028.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
8. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
18. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
19. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
20. `.opencode/plugins/spec-kit-skill-advisor.js`
21. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
22. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- **R29-P1-001 — `advisor_recommend` does not implement the documented absent-daemon fail-open path.**
  - **Claim:** The MCP handler still scores prompts when freshness is `absent`, so it can return live recommendations instead of the empty fail-open set required by 004 AC-6.
  - **Evidence refs:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:118-120`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:54-79`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:167-176`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts:45-55`]
  - **Counterevidence sought:** I looked for an `absent`/`unavailable` guard in `computeRecommendationOutput`, an adapter-layer override that forced empty recommendations before serialization, and a dedicated absent-state handler test. I did not find any; the only explicit fail-open branch is the shared disabled flag.
  - **Alternative explanation:** The implementation may be intentionally treating `absent` as "daemon missing but source graph still scoreable" so local source-backed recommendations remain available during bootstrap. That would explain the current code path, but it contradicts the current AC-6 contract and the compat probe, which already treats `absent` as unavailable.
  - **Final severity:** P1
  - **Confidence:** 0.95
  - **Downgrade trigger:** Downgrade if the canonical 004 spec is amended to allow source-backed recommendations during `absent` freshness, or if a transport-layer wrapper that I did not inspect already normalizes `absent` to an empty recommendation set before users consume it.

- **R29-P1-002 — `advisor_status` omits two fields the shipped 004 contract still requires.**
  - **Claim:** The status schema/handler return freshness, generation, trust state, generation bump, lane weights, and optional PID/errors, but they do not expose the `skill count` and `last scan time` still required by REQ-004-P0-005.
  - **Evidence refs:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:84-89`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md:55-59`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:58-76`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:65-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts:31-41`]
  - **Counterevidence sought:** I looked for those fields in the public schema, handler output, and handler tests, and for any adjacent adapter that might add them before the MCP response is emitted. I did not find any such projection; the implementation summary instead documents a narrower output surface.
  - **Alternative explanation:** The broader spec may have been intentionally narrowed after implementation to avoid extra graph/DB reads, with `lastGenerationBump` serving as a proxy for scan timing. If that was the real design decision, the spec/checklist were not updated to match.
  - **Final severity:** P1
  - **Confidence:** 0.93
  - **Downgrade trigger:** Downgrade if the canonical 004 spec is updated to replace `skill count` and `last scan time` with the current `generation bump`/`lane weights` surface, or if another exported wrapper adds those fields outside the handler/schema boundary reviewed here.

### P2

- None new this iteration.

## Traceability Checks

- **Deterministic promotion gates remain wired as specified.** The seven-gate bundle still enforces the documented thresholds for full corpus, holdout, safety, latency, exact parity, and regression-suite checks, and the promotion test suite still verifies each gate independently plus the two-cycle rule. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:13-22`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts:81-137`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:110-166`]
- **Compat migration still preserves the intended native-first behavior.** The 005 spec/checklist still require daemon probing, shared disable handling, and `--force-local` / `--force-native` escape hatches, and the current shim/bridge tests still exercise those behaviors directly. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:75-86`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md:47-62`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-61`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-70`]
- **The two new mismatches are contract-level, not ecosystem-wide regressions.** I did not find evidence that 027/006 deterministic gates were loosened, or that 027/005 removed native-first compat routing. The newly surfaced correctness gaps are specifically the absent-state fail-open semantics and the narrower-than-specified `advisor_status` payload.

## Verdict

**CONDITIONAL**. No new P0 surfaced, but two new P1 correctness mismatches remain: `advisor_recommend` does not honor the documented absent-daemon fail-open contract, and `advisor_status` still omits required `skill count` / `last scan time` fields from the published 004 surface.

## Next Dimension

**security** — re-check whether the compat/native bridge surfaces remain prompt-safe at every write/response boundary now that the correctness gaps are isolated to absent-state handling and status payload shape.
