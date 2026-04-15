---
iteration: 10
dimension: "Cross-packet residual sweep + convergence synthesis"
focus: "Verify residual cleanup, release-note accuracy, builds, lockfile fix, standing regression script, and synthesize the final verdict"
timestamp: "2026-04-15T09:24:10Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 0
  P1: 1
  P2: 0
---

# Iteration 010

## Findings

### P1
1. **F009 — The v3.4.1.0 changelog overstates Phase 015 reality by claiming both a real `hybrid` mode and unchanged load-bearing router coverage.** The release notes describe `hybrid` as “planner plus selected follow-up actions” and mark the eight-category router plus four load-bearing subsystems as unchanged, but runtime still treats `hybrid` as a future stub and the deep-review diff found real logic changes in `content-router.ts`. That makes the Phase 015 release narrative insufficiently honest about what actually shipped. [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.1.0.md:145] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.1.0.md:272-273] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:123-135] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2469-2470] [EVIDENCE: git diff f3dc18993~1..HEAD -- .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts]

**Remediation suggestion:** Amend the changelog to describe `hybrid` as reserved/future and to state that the router contract stayed intact while the default Tier 3/manual-review control flow changed, instead of claiming the load-bearing router surface was unchanged.

## Ruled-out directions explored

- **Deprecated wrapper/agent references are gone from active surfaces.** The residual grep sweep for `/spec_kit:(handover|debug)`, `@handover`, and `@speckit` across active docs/source/tests returned 0 matches outside the excluded paths.
- **Security dependency fix landed.** The resolved `axios` version in `.opencode/skill/mcp-code-mode/mcp_server/package-lock.json` is `1.15.0`.
- **Required build targets are clean.** `npm run build` succeeds in `.opencode/skill/system-spec-kit/scripts` and `.opencode/skill/system-spec-kit/mcp_server`.
- **Standing regression script is still green.** `node .opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js` reported `27 / 0 / 0`.
- **Most changelog Phase 015 claims are directionally correct.** The planner-first default, deferred follow-up APIs, and axios fix all match the current repository state.

## Evidence summary

- Residual deprecated-surface sweep: clean.
- Changelog phase coverage: present for 013, 012 M9, and 015.
- Lockfile/version check: clean.
- Build/test-bug-fixes checks: clean.
- Remaining residual issue: changelog accuracy for hybrid support and “unchanged” router/load-bearing wording.

## Novelty justification

This iteration added new signal by proving the residual sweep is operationally clean while isolating one remaining release-note honesty gap that was not visible from code-only review dimensions.
