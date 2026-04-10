# Iteration 029 — Redesign The Gate / Hook / Constitutional Operator Surface

Date: 2026-04-10

## Research question
Does the external repo's lighter workflow framing imply that `system-spec-kit` exposes too much of its gate, hook, and constitutional machinery directly to operators?

## Hypothesis
Yes. The runtime automation is valuable, but the visible operator surface currently leaks too much framework governance and transport machinery.

## Method
I compared the external repo's simple workflow posture with the internal gate docs, hook docs, and master behavioral specification to evaluate how much system machinery the operator is implicitly asked to understand.

## Evidence
- [SOURCE: CLAUDE.md:34-40] The master behavior spec already mandates specific tools and routing choices before ordinary work begins.
- [SOURCE: CLAUDE.md:107-141] It then defines three gates, hard blocks, carry-over behavior, and a consolidated-question protocol in a large operator-facing section.
- [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-55] Tool routing is duplicated in constitutional memory as a decision tree.
- [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:53-104] Gate enforcement is also preserved in a separate constitutional file that cross-references AGENTS/CLAUDE behavior.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/README.md:27-43] The hook layer includes context surfacing helpers plus a separate Claude lifecycle hook system.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:16-31] The Claude hook docs frame hooks as transport reliability rather than separate business logic.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-170] `session-prime` already performs startup context injection, recovery-tool surfacing, and stale-graph warnings automatically.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-105] `session-stop` can also auto-save context from lightweight state when conditions are met.
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-27] Hook state persists real session metadata in temp storage so automation can bridge lifecycle events.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:19-49] The external repo presents the workflow directly, without foregrounding a comparable amount of governance machinery.

## Analysis
The internal system has already built meaningful automation: startup prime, stop-time autosave, tool routing, and constitutional guardrails. The UX problem is that too much of this remains part of the visible operator doctrine. The user ends up learning gates, hook stages, constitutional files, and routing trees instead of simply experiencing a well-behaved assistant. The external repo suggests a better principle: make workflow behavior obvious, but hide transport and governance plumbing unless the user is explicitly working on the framework itself. In other words, the system should feel simpler than it is.

## Conclusion
confidence: high
finding: `system-spec-kit` should redesign its operator surface so gates, hook plumbing, and constitutional routing remain enforceable but mostly invisible during normal work.

## Adoption recommendation for system-spec-kit
- **Target file or module:** operator-facing policy docs, startup/resume UX, and gate/hook surfacing strategy
- **Change type:** operator-surface redesign
- **Blast radius:** architectural
- **Prerequisites:** decide which governance concepts must stay visible for trust and which can move behind runtime behavior
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** users are taught explicit gates, routing trees, hook stages, and constitutional files as part of the normal operating model.
- **External repo's approach:** workflow behavior is visible, but transport and governance internals stay mostly behind the scenes.
- **Why the external approach might be better:** it lowers cognitive load and makes the system feel coherent instead of bureaucratic.
- **Why system-spec-kit's approach might still be correct:** auditability and deterministic behavior do improve when rules are written down and inspectable.
- **Verdict:** REDESIGN
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep the rules and hooks, but collapse the visible operator contract to a shorter "what will happen" guide while runtime automation quietly enforces the machinery.
- **Blast radius of the change:** CLAUDE/AGENTS wording, constitutional docs, hook messaging, and onboarding.
- **Migration path:** first trim public docs to outcome-focused guidance, then move more gate execution into auto-handled runtime flows where possible.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators are exposed to gate taxonomy, routing trees, hook lifecycle concepts, and large constitutional guidance files.
- **External repo's equivalent surface:** operators mainly see one workflow, a few knobs, and three role concepts.
- **Friction comparison:** the internal system is safer and richer, but it asks users to internalize far more framework machinery than the external repo does.
- **What system-spec-kit could DELETE to improve UX:** most operator-facing exposure of hook transport details and duplicated gate doctrine.
- **What system-spec-kit should ADD for better UX:** a shorter outcome-focused operating guide and stronger automatic handling of bootstrap, save, and routing behaviors.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
I looked for evidence that public gate/hook visibility is essential for ordinary operator trust. The hook code already performs much of the work automatically, which suggests the visible ceremony could shrink without losing behavior.

## Follow-up questions for next iteration
- What is the minimum visible contract needed for operator trust?
- Which gate and hook details are maintainer-only and should move out of the everyday surface?
- Can runtime automation safely absorb more of Gate 1 and resume/save behavior?
