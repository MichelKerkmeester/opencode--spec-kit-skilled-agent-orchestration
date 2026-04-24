# Iteration 11 — traceability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-007.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-010.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/decision-record.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md`
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- **R11-P1-001 — 027/004's canonical verification docs still certify prompt-safe recommend output that the public handler does not actually provide.**
  - **Claim:** Traceability is broken for `027/004`. The child spec and checklist mark the privacy contract as satisfied, and the implementation summary states that `advisor_recommend` never returns raw prompt text, but the shipped public handler copies `lane.evidence` verbatim into `laneBreakdown` whenever `includeAttribution` is enabled. That means the packet's own `[x]` verification surfaces no longer describe the observable MCP response contract.  
  - **evidenceRefs:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:101-104`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:122`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/checklist.md:76-78`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/implementation-summary.md:105-109`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:85-89`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:117-126`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:92-111`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:113-127`]
  - **counterevidenceSought:** I looked for either a redaction step between `lane.evidence` and the serialized MCP response or a test that exercises `includeAttribution: true` with prompt-sensitive content and proves the output stays opaque. I found neither: the handler forwards the evidence array unchanged, and the privacy test covers the default ambiguous path without attribution enabled.
  - **alternativeExplanation:** The docs may have been written assuming `includeAttribution` is an internal debug-only surface where matched terms are allowed, but the same public MCP tool schema and handler expose that mode without a packet-local privacy exception.
  - **finalSeverity:** P1
  - **confidence:** 0.97
  - **downgradeTrigger:** Downgrade if `includeAttribution` is removed from the public surface or its `laneBreakdown.evidence` values are redacted to non-reconstructable identifiers and the packet docs are updated to match.

### P2

- None.

## Traceability Checks

- **Spec ↔ code alignment:** `027/004/spec.md`, `checklist.md`, and `implementation-summary.md` all still assert prompt-safe recommend output, but the public handler serializes attribution evidence verbatim when enabled, so the packet does not currently trace cleanly to implementation.
- **Checklist [x] evidence:** The checklist already lacked file:line precision in earlier passes, and this iteration found a stronger issue: one checked privacy item is materially contradicted by the reviewed handler behavior.
- **ADR-007 parity decision:** Still not promoted into `decision-record.md`; the parent implementation summary mentions the parity reinterpretation, but the ADR ledger still stops at ADR-006.
- **Cross-refs intact:** Partially. The 027/004 child packet remains structurally coherent, but its privacy verification cross-reference now points reviewers to a shipped state that the code no longer satisfies.

## Verdict

**CONDITIONAL.** No new P0 surfaced, but one new P1 traceability failure remains: the 027/004 packet's own verification surfaces mis-certify the public `advisor_recommend` privacy contract.

## Next Dimension

**maintainability** — inspect whether the post-migration advisor package boundaries, renamed modules, and retained regression suites remain coherent after the packet/document drift surfaced in traceability.
