<!-- SNAPSHOT: copied from 015-save-flow-planner-first-trim/review/iterations/iteration-003.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 3
dimension: "Flag wire completeness"
focus: "Verify each new save-path env flag has a real read site and controls a live branch"
timestamp: "2026-04-15T08:45:05Z"
runtime: "cli-copilot --effort high"
status: "clean"
findings:
  P0: 0
  P1: 0
  P2: 0
---

# Iteration 003

## Findings

No P0, P1, or P2 findings. All four new flags are wired to live branch points rather than dead plumbing.

## Ruled-out directions explored

- **`SPECKIT_ROUTER_TIER3_ENABLED` is live.** The flag is read directly in `isTier3RoutingEnabled()`, then fed into `resolveNaturalDecision()`, where `!tier3Enabled` returns an immediate manual-review branch instead of attempting Tier 3. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366-1368] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:574-584]
- **`SPECKIT_QUALITY_AUTO_FIX` is live.** `isQualityAutoFixEnabled()` feeds `autoFixEnabled`, and the `!autoFixEnabled` branch exits before the retry loop, so the flag changes behavior rather than only metadata. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:154-160] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:590-634]
- **`SPECKIT_RECONSOLIDATION_ENABLED` is live.** `isSaveReconsolidationEnabled()` feeds `allowSaveTimeReconsolidation`, and that value gates both the main reconsolidation pass and assistive reconsolidation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:138-144] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:181-188] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:221-224]
- **`SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` is live.** `isPostInsertEnrichmentEnabled()` feeds `shouldRunPostInsertEnrichment()`, and the wrapper returns a no-op result when the branch is off; the explicit follow-up API temporarily sets the env var to `true` so the same branch is reused for backfill. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:146-152] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:56-58] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:111-128]

## Evidence summary

- Each flag has a real runtime read site or helper read site.
- Each helper result feeds a branch that changes execution, not just logging or response text.
- No dead flag, unused read, or read-without-branch surfaced in the save-path code.

## Novelty justification

This iteration added new signal by closing the dead-flag question with code evidence, which prevents later findings from misclassifying intentional opt-in behavior as missing wires.
