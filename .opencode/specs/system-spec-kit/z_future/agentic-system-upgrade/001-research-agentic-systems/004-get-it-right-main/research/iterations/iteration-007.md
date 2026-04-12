# Iteration 007 — Portable Architecture, Not Reliant Coupling

Date: 2026-04-09

## Research question
How much of Get It Right is truly Reliant-specific, and which parts are portable enough for `system-spec-kit` to adopt without inheriting platform lock-in?

## Hypothesis
The thread primitives are platform-specific, but the control pattern is portable because `system-spec-kit` already implements similar loop orchestration elsewhere.

## Method
I separated the external runtime-specific constructs from its higher-level mechanisms, then matched those against the internal deep-research loop implementation.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:136-150] The external runtime uses `builtin://agent`, forked threads, and injected messages, which are clearly platform-level constructs.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:7-15] The thread architecture depends on an explicit parent/fork/save_message model supplied by Reliant.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/thread-architecture.md:156-159] The essential mechanism is not the API surface itself but the choice to keep the parent thread clean while passing data by targeted references.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-343] `system-spec-kit` already has a reducer-owned loop that syncs registry, dashboard, and strategy after each iteration, proving that multi-step loop orchestration is already portable inside this repo.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:385-445] The internal synthesis phase compiles iteration files into a canonical report, which mirrors the same "workflow owns the control plane, leaf agent owns one attempt" split.
- [SOURCE: .opencode/agent/deep-research.md:24-32] The internal deep-research agent is intentionally single-iteration and relies on the outer workflow for lifecycle, which is the same architectural separation Get It Right uses.

## Analysis
The non-portable pieces are the exact thread API, node-edge syntax, and Reliant-specific agent references. The portable pieces are the ones that matter: explicit attempt lifecycle, compressed state handoff, pre-review checks, and workflow-owned branching. `system-spec-kit` does not need to emulate Reliant threads literally. It only needs to express the same controller logic in its own YAML assets and agent contracts, which the deep-research subsystem already proves is feasible.

## Conclusion
confidence: high
finding: `system-spec-kit` should import the control pattern, not the platform surface. Reliant is implementation detail; the reusable value is the separation between leaf-attempt execution and workflow-owned retry decisions.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/implement.md`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** document the retry controller as an internal workflow pattern rather than a direct translation of external YAML semantics
- **Priority:** must-have

## Counter-evidence sought
I looked for evidence that the external design only works because of Reliant-specific features unavailable in this repo. The internal deep-research loop already reproduces the same outer-loop pattern with different mechanics.

## Follow-up questions for next iteration
- Where should a portable retry controller be documented so operators understand it as a repo pattern rather than a copied product workflow?
- Which internal reducer or state conventions can be reused directly?
- Should portability constraints be written into constitutional or command docs?
