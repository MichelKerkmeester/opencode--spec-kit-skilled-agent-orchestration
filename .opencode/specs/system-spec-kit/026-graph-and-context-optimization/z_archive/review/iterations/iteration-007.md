---
title: "Deep Review Iteration 007 — D2 Security"
iteration: 007
dimension: D2 Security
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T05:40:32Z
status: thought
---

# Iteration 007 — D2 Security

## Focus
This iteration stayed on D2 Security and followed the strategy's post-compaction trust-label question. I reviewed whether compact recovery can re-expose stronger-than-cached provenance back to the operator, then checked whether packet 012's tests and packet docs actually cover the already-open startup cross-session and cross-scope rejection seam.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (282 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` (219 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` (137 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` (432 lines)
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` (138 lines)
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts` (163 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/spec.md` (289 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/checklist.md` (152 lines)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/implementation-summary.md` (94 lines)

## Findings

### P0 — Blockers
None this iteration

### P1 — Required
None this iteration

### P2 — Suggestions
None this iteration

## Cross-References
`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` rewrites compaction provenance to `producer=hook_cache`, `sourceSurface=compact-cache`, and `trustState=cached` before `session-prime.ts` wraps it, so the compact path does not duplicate the fail-open trust promotion already tracked in packet 011/bootstrap. The remaining startup scope issue is still the iteration 006 finding, not a new compact-path defect.

## Next Focus Recommendation
Move to D3 Traceability and start with packet 012's claimed evidence: verify checklist items CHK-011, CHK-021, CHK-030, and CHK-031 against the real runtime and test lines, then continue into packet 011 and packet 013 closeout claims that already look vulnerable to overstatement.

## Metrics
- newFindingsRatio: 0.0 (new findings this iter / total findings cumulative)
- filesReviewed: 9
- status: thought
