# Iteration 028 — Keep The Gates, Shrink The Operator-Facing Ceremony

Date: 2026-04-10

## Research question
Does the full Gate 1 -> Gate 2 -> Gate 3 and constitutional/hook machinery expose too much workflow theory to the operator?

## Hypothesis
Yes. The underlying safeguards are justified, but too much of the explanation sits in the user-facing path instead of collapsing into a compact preflight summary.

## Method
I compared the local gate and constitutional memory surfaces with Xethryon's lighter runtime injection model.

## Evidence
- The gate constitutional docs explicitly define Gate 1, Gate 2, Gate 3, continuation validation, and multiple trigger rules. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-106]
- Tool routing is also documented as a separate constitutional decision tree. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-55]
- `system-spec-kit`'s primary skill expands into a broad router over spec folders, memory, validation, commands, and templates. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:32-59] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:130-229]
- Xethryon's operator surface is lighter because memory, git context, and autonomy instructions are injected into the session system rather than narrated as separate preflight concepts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1555-1585]
- Xethryon's autonomy toggle still exposes one user-visible control, but much less conceptual setup is carried into each task. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:149-159]

## Analysis
This is another case where Spec Kit's architecture is stronger than its UX. The gates solve real problems: scope control, spec binding, and safe routing. But the operator should not have to load all of that structure as prose every time. Xethryon shows the value of runtime compression, even though its hidden behavior goes too far for a governed system.

The design target is "explicit internally, compact externally." The system should present one short preflight summary that names the active constraint and next step, while the full constitutional detail remains available as reference material.

## UX / System Design Analysis

- **Current system-spec-kit surface:** multiple named gates and routing rules remain highly visible in the operator experience.
- **External repo's equivalent surface:** most rules are absorbed into runtime behavior, with a lighter explicit control surface.
- **Friction comparison:** `system-spec-kit` gives the user more safety context, but also more conceptual overhead before the work begins.
- **What system-spec-kit could DELETE to improve UX:** routine exposure to the full gate taxonomy during ordinary work.
- **What system-spec-kit should ADD for better UX:** one compact preflight summary that reports active constraint, bound spec folder, selected workflow, and next safe action.
- **Net recommendation:** SIMPLIFY

## Conclusion
confidence: high

finding: keep the gate system, but simplify the operator-facing experience by replacing most gate-theory exposure with a compact preflight summary and optional deep explanation.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit constitutional explanation is strongly surfaced.
- **External repo's approach:** more runtime compression and less user-visible process explanation.
- **Why the external approach might be better:** lower cognitive startup cost.
- **Why system-spec-kit's approach might still be correct:** it preserves governance clarity and makes constraints auditable.
- **Verdict:** SIMPLIFY
- **If SIMPLIFY — concrete proposal:** move most gate explanation to reference-only material and surface a short runtime preflight card instead.
- **Blast radius of the change:** medium
- **Migration path:** additive summary first, then gradually trim repeated prose from front-door workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a stable preflight summary schema shared across bootstrap, resume, and first-response flows
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the current explicit gate exposition meaningfully improves task success in ordinary work. The documentation is valuable, but it is overexposed relative to the amount of information most users need in the moment.

## Follow-up questions for next iteration
- If the gates become quieter, what end-to-end artifact would most reduce lifecycle friction without weakening the current packet model?
