# Iteration 019 — Keep Global Memory, Reject `.workflow`-Only Replacement

Date: 2026-04-10

## Research question
Does the external repo's simpler `.workflow` state plus handoff model prove that `system-spec-kit` should replace its broader semantic memory architecture with packet-local runtime files only?

## Hypothesis
No. The external design is simpler because it serves a narrower problem. `system-spec-kit` spans a larger packet and decision ecosystem, so a complete memory-system replacement would throw away real value even if loop-state boundaries should still be cleaned up.

## Method
I compared the external runtime-state and handoff surfaces with the local memory architecture and tooling depth. I focused on whether the external repo actually solves the same cross-session retrieval problem that `system-spec-kit` is designed around.

## Evidence
- `[SOURCE: external/automated-loop/state_tracker.py:65-77]` The external loop persists runtime state needed for one automation session and resumable transport continuity.
- `[SOURCE: external/handoffs/README.md:1-18]` Its handoff system captures session context for continuation as markdown files.
- `[SOURCE: external/handoffs/README.md:24-53]` The handoff format is concise and human-oriented rather than a semantic retrieval platform.
- `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-35]` The local memory system is explicitly built for cross-session semantic retrieval, importance tiers, decay, checkpoints, and constitutional surfacing.
- `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]` The local system also supports shared spaces, causal links, learning history, evaluation, code graph context, and search maintenance tools.

## Analysis
The external repo does not demonstrate that broad semantic memory is unnecessary. It demonstrates that loop runtime state should stay small. Those are not the same claim. The external toolkit mostly optimizes for a single operator driving one automation system. `system-spec-kit` is managing a broader universe of specs, packets, decisions, and recoverable context across many workflows. That larger problem still justifies a memory platform.

So the correct Phase 2 conclusion is a boundary fix, not a replacement. Keep the global memory system. Reject the idea that packet-local `.workflow` files and handoffs can replace semantic retrieval across the whole workspace. The external repo is a good argument for runtime-state simplicity, not an argument against long-term memory as a product capability.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject any proposal to replace its global memory architecture with `.workflow` files and human handoffs alone. The right move is to separate loop runtime state from archival memory, not delete archival memory.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/memory/memory_system.md`, deep-loop workflow docs
- **Change type:** rejected
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Workspace-wide semantic memory provides retrieval, ranking, governance, causal analysis, and shared-space features beyond any one packet.
- **External repo's approach:** Runtime state and handoffs are intentionally narrower and primarily support one automation system's continuity.
- **Why the external approach might be better:** It is easier to reason about operationally and avoids turning loop state into a platform.
- **Why system-spec-kit's approach might still be correct:** The local system serves a broader cross-packet retrieval problem that the external toolkit does not attempt to solve.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A. Keep the memory platform, but continue separating it from active loop runtime state.
- **Blast radius of the change:** architectural
- **Migration path:** N/A

## Counter-evidence sought
I looked for evidence that the external repo offers semantic retrieval, causal memory, or workspace-wide decision continuity equivalent to the local memory platform. I did not find an equivalent subsystem.

## Follow-up questions for next iteration
- Which parts of the current memory platform are essential for deep-loop workflows, and which are only packet-closeout concerns?
- Could the local memory platform surface packet runtime summaries without becoming coupled to them?
- Is there any smaller slice of the external handoff model still worth importing?
