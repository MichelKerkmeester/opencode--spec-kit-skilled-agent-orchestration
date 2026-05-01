# Iteration 025 — Merge `@context-prime` And `@context` Into One Capability With Two Modes

Date: 2026-04-10

## Research question
Are `@context-prime` and `@context` materially distinct operator-facing agents, or are they two modes of one broader context capability that is currently over-exposed as separate roles?

## Hypothesis
They are two modes of the same capability and should likely be merged at the operator surface, even if separate internal implementations remain.

## Method
I compared the two agent contracts, their orchestration roles, and the external repo's simpler role partitioning to see whether the split helps operators or mainly helps internal implementation clarity.

## Evidence
- [SOURCE: .opencode/agent/orchestrate.md:18-21] The orchestrator bootstraps the session by delegating to `@context-prime` on first turn or after `/clear`.
- [SOURCE: .opencode/agent/orchestrate.md:95-107] The routing table then separately reserves `@context` for all exploration tasks.
- [SOURCE: .opencode/agent/context-prime.md:34-39] `@context-prime` is a lightweight bootstrap agent that calls `session_bootstrap()` and optionally `session_health()` with a strict under-15-second bias.
- [SOURCE: .opencode/agent/context-prime.md:61-66] Its toolset is explicitly just a small session-recovery slice of the broader context stack.
- [SOURCE: .opencode/agent/context.md:45-54] `@context` is also a read-only retrieval specialist, just in a heavier thorough mode.
- [SOURCE: .opencode/agent/context.md:108-123] `@context` hardcodes thorough mode with a broader tool sequence and larger output budget.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-159] The external repo does not split bootstrap versus exploration into separate visible specialist roles; it keeps a much smaller public role vocabulary.

## Analysis
The distinction is real at the implementation level: one mode is a fast bootstrap, the other is a deeper retrieval pass. But as an operator concept, the split feels overly internal. Both agents are read-only context loaders; they differ mainly in depth, time budget, and trigger conditions. Exposing them as separate named roles teaches users the framework's plumbing instead of a cleaner concept like "context" with `bootstrap` and `deep` modes. The external repo's smaller role vocabulary reinforces that visible role granularity should match user intent, not every internal optimization.

## Conclusion
confidence: high
finding: merge `@context-prime` and `@context` into one public context capability with explicit bootstrap and deep modes, even if separate internal modules remain.

## Adoption recommendation for system-spec-kit
- **Target file or module:** agent routing, agent docs, and context bootstrap UX
- **Change type:** capability merge
- **Blast radius:** medium
- **Prerequisites:** define one shared public contract for lightweight bootstrap versus deep retrieval
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** session bootstrap and deeper exploration are exposed as separate named agents.
- **External repo's approach:** public role vocabulary stays compact while context boundaries are handled inside the workflow.
- **Why the external approach might be better:** it hides framework internals and makes role selection more intuitive.
- **Why system-spec-kit's approach might still be correct:** separate contracts do keep fast-start guarantees from being diluted by deep-search behavior.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** present a single `@context` role with `bootstrap` and `deep` modes; keep `context-prime` only as an internal implementation detail if needed.
- **Blast radius of the change:** agent docs, orchestrator routing tables, onboarding, and command docs that mention both roles.
- **Migration path:** alias `@context-prime` to `@context --mode bootstrap` first, then simplify docs and routing language.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators learn two context agents, one for bootstrap and one for exploration.
- **External repo's equivalent surface:** context handling stays mostly implicit inside the workflow and agent prompts.
- **Friction comparison:** the internal split is more explicit, but it teaches the user internal runtime distinctions they usually do not need.
- **What system-spec-kit could DELETE to improve UX:** the separate public role name `@context-prime`.
- **What system-spec-kit should ADD for better UX:** one context capability with explicit mode labels such as `bootstrap`, `quick`, and `deep`.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for signs that the split prevents mistakes users routinely make. The docs mainly distinguish time budget and scope, which are good mode differences but weak reasons for two public role brands.

## Follow-up questions for next iteration
- Should bootstrap be a command/runtime behavior rather than an agent identity?
- Would a shared context contract make orchestrator prompts shorter and clearer?
- Which current docs and wrappers explicitly depend on the `context-prime` name?
