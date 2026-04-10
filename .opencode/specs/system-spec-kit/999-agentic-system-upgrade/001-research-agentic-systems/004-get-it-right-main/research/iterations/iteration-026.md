# Iteration 026 — Reduce The Visible Agent Roster Even If Specialist Internals Remain

Date: 2026-04-10

## Research question
Does the external repo's three-role model imply that `system-spec-kit`'s 12-agent surface is too granular for operators, even if many of those specialists still make sense internally?

## Hypothesis
Yes. The internal roster likely needs to stay richer than the external repo's, but the current public role taxonomy is broader than most operators need to hold in working memory.

## Method
I compared the internal agent inventory, orchestrator routing table, and handover specialization against the external repo's much smaller visible role set to identify where role granularity is helping versus fragmenting the UX.

## Evidence
- [SOURCE: .opencode/README.md:97-117] The framework documents a 12-agent model with explicit user-facing descriptions for orchestration, context, research, review, write, handover, ultra-think, and more.
- [SOURCE: .opencode/agent/orchestrate.md:95-107] The orchestrator's routing table also exposes many separate specialist roles as first-class dispatch choices.
- [SOURCE: .opencode/agent/orchestrate.md:169-183] The file inventory reinforces a broad named roster that operators and maintainers must understand.
- [SOURCE: .opencode/agent/handover.md:22-32] `@handover` is a dedicated continuation specialist with its own template and lifecycle contract.
- [SOURCE: .opencode/agent/handover.md:40-58] Its actual work is focused and useful, but narrow.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-159] The external repo exposes only three visible roles: implementer, reviewer, and refactorer.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:149-159] The external design keeps role distinctions tied to cognitively distinct jobs, not every support concern.

## Analysis
Phase 2 already showed that collapsing everything into three roles would be wrong for `system-spec-kit`; research, docs, and debug specialists are real value. But Phase 3 surfaces a different problem: too many of those distinctions are operator-visible. The result is a roster that reads more like an internal microservice map than a human-friendly collaboration model. `@handover` is the clearest example. It makes sense as a specialized implementation detail, yet the user usually thinks in terms of "end session" or "continue later," not "invoke the handover role." The external repo's lesson is not "use only three agents." It is "make visible roles correspond to distinct user intents."

## Conclusion
confidence: medium
finding: keep specialist internals, but reduce the visible agent taxonomy to a smaller set of user-intent roles and demote narrow utilities like handover into command-owned behaviors where possible.

## Adoption recommendation for system-spec-kit
- **Target file or module:** agent roster docs, routing docs, and command-level role exposure
- **Change type:** capability merge
- **Blast radius:** medium
- **Prerequisites:** distinguish operator-facing capabilities from internal implementation specialists
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** many narrow named roles are visible in README, orchestration docs, and workflow guidance.
- **External repo's approach:** role count stays low and maps closely to distinct jobs in the loop.
- **Why the external approach might be better:** a smaller public taxonomy is easier to remember and makes orchestration feel more intentional.
- **Why system-spec-kit's approach might still be correct:** specialist prompts do encode different rules, permissions, and output contracts that are useful internally.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep the internal specialist files, but group public roles into a smaller set such as build, review, research, docs, and recovery, with utilities like handover hidden behind commands.
- **Blast radius of the change:** agent docs, onboarding, command help, and orchestration wording.
- **Migration path:** first relabel public docs around grouped capabilities while keeping the underlying agents unchanged; only later revisit file-level consolidation if warranted.

## UX / System Design Analysis

- **Current system-spec-kit surface:** operators encounter a 12-agent roster with several narrow or infrastructure-oriented distinctions.
- **External repo's equivalent surface:** three clearly different loop roles.
- **Friction comparison:** the internal roster supports more cases, but it increases naming overhead and makes the system harder to learn quickly.
- **What system-spec-kit could DELETE to improve UX:** public emphasis on narrow utility roles such as `@handover` as peer concepts to core execution roles.
- **What system-spec-kit should ADD for better UX:** grouped capability labels and command-led behaviors that hide specialist internals unless explicitly needed.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that a wide visible roster is necessary for correctness. Most role differences appear to matter more to the orchestrator and maintainers than to the operator reading the docs.

## Follow-up questions for next iteration
- Which current role names are user-intent aligned versus implementation-detail aligned?
- Should handover and write stay separate public agents or become command behaviors?
- How much public simplification is possible without weakening specialist prompts internally?
