---
iteration: 1
dimension: "Load-bearing preservation"
focus: "Diff load-bearing files against f3dc18993~1 and classify every hunk as NONE, MECHANICAL, or LOGIC"
timestamp: "2026-04-15T08:36:30Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 1
  P1: 0
  P2: 0
---

# Iteration 001

## Findings

### P0
1. **F001 — Load-bearing router file carries new control-flow, not just trim plumbing.** `content-router.ts` now accepts a new `tier3Enabled` dependency, injects an early-return `if (!tier3Enabled)` branch, and routes low-confidence cases through a new `buildManualReviewDecision()` helper instead of always proceeding into the previous Tier 3 attempt path. That is behavioral change inside a packet-defined load-bearing file, while the other three load-bearing files remained bit-for-bit clean in the same baseline diff. Per the iteration-1 rule, this is a P0 preservation violation even if the later packet intent may justify it. [EVIDENCE: git diff f3dc18993~1..HEAD -- .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:248-255] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:467-505] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:536-634] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366-1368]

**Remediation suggestion:** Either move the Tier 3 default-disable behavior out of the load-bearing preservation set or explicitly document and re-justify `content-router.ts` as an allowed exception, then prove the new control flow preserves full-auto parity in iteration 2 and category parity in iteration 6.

## Ruled-out directions explored

- `atomic-index-memory.ts` showed **NONE** in the baseline diff, so the canonical atomic writer was not changed in packet 015. [EVIDENCE: git diff f3dc18993~1..HEAD -- .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts]
- `create-record.ts` showed **NONE** in the baseline diff, so routed record identity stayed untouched. [EVIDENCE: git diff f3dc18993~1..HEAD -- .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts]
- `thin-continuity-record.ts` showed **NONE** in the baseline diff, so thin continuity validation and upsert logic stayed untouched. [EVIDENCE: git diff f3dc18993~1..HEAD -- .opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts]
- The `content-router.ts` hunks were not downgraded to mechanical because they add new branching and a new refusal helper rather than comments, formatting, or inert import movement. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:574-584] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:625-634]

## Evidence summary

- **Clean:** `atomic-index-memory.ts`, `create-record.ts`, and `thin-continuity-record.ts` are unchanged versus `f3dc18993~1`.
- **Changed:** `content-router.ts` has LOGIC hunks that gate Tier 3 behind `tier3Enabled`, synthesize manual-review refusals earlier, and add `isTier3RoutingEnabled()` env-driven behavior.
- **Adversarial self-check:** Re-read the current router lines to confirm the diff was not only dependency threading. The new early return at lines 574-584 and extracted manual-review builder at lines 625-634 are live behavior changes.

## Novelty justification

This iteration added new signal because it established the precise preservation boundary: three load-bearing files are bit-level clean, but `content-router.ts` is not.
