# Iteration 016 — Autonomy UX Simplicity Should Inform UX Copy, Not Hidden Runtime Behavior

Date: 2026-04-10

## Research question
Does Xethryon's apparent autonomy simplicity mean `system-spec-kit` should simplify by replacing explicit gate-driven workflow cues with more hidden runtime behavior?

## Hypothesis
No. Xethryon's autonomy feels simple because the operator mostly sees a toggle and codenames, but the real behavior is spread across prompt injection, env state, tool gating, and worker synchronization. Spec Kit should borrow the clarity of the surface, not the hidden runtime coupling.

## Method
I traced the autonomy UX from README and TUI keybinding through worker sync, prompt injection, agent switching, and autonomous skill invocation, then compared that to Spec Kit's constitutional gate surfaces.

## Evidence
- Xethryon's README presents autonomy as an `F4` toggle with automatic mode switching and follow-up skill invocation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:39-64]
- The config layer binds autonomy to `f4`, and the worker thread mutates `process.env.XETHRYON_AUTONOMY` when the toggle changes. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/config/config.ts:752-764] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/cli/cmd/tui/worker.ts:160-166]
- The autonomy prompt is large and prescriptive, embedding mode-switch rules, autonomous skill invocation rules, and a mandatory post-task checklist. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77]
- The switching and self-invocation behaviors are implemented as separate tools with their own gating and rejection behavior. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/switch_agent.ts:39-105] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:28-97]
- Spec Kit's gate system is explicit and inspectable: Gate 3, skill routing, and tool-routing decisions are written down in constitutional docs instead of being mostly hidden inside prompt/runtime composition. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-106] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-55]

## Analysis
Xethryon's autonomy is a UX compression trick. It collapses many workflow steps into a simple user story, but it does not actually delete the complexity; it hides it. For Spec Kit, hiding that complexity would cut directly against auditable gate behavior and operator trust. The better takeaway is presentational: operators need a short, visible explanation of what mode they are in, what the next safe action is, and which constraints are active. That can be done without moving workflow enforcement into a hidden autonomy prompt.

## Conclusion
confidence: high

finding: Spec Kit should keep explicit gate-driven behavior, but it should simplify the operator-facing explanation of that behavior into a compact mode-and-next-step summary instead of expecting users to infer everything from long constitutional docs.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit gate documents, explicit spec-folder binding, explicit skill routing, and explicit recovery surfaces.
- **External repo's approach:** a visible autonomy toggle backed by hidden prompt/tool/runtime coupling.
- **Why the external approach might be better:** the operator gets a cleaner mental model and less visible ceremony.
- **Why system-spec-kit's approach might still be correct:** explicit governance is one of Spec Kit's core guarantees; hiding it would make behavior harder to audit and debug.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a compact "active constraints / next best action" summary to the operator-facing docs and startup/resume surfaces without changing the underlying constitutional enforcement model.
- **Blast radius of the change:** medium
- **Migration path:** start with presentation only; keep all current gates and routing rules intact.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** decide a stable compact summary format that can be reused in docs and runtime surfaces
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for a truly simpler autonomy architecture beneath the UX. Instead, I found multiple distributed control points that only appear simple from the outside.

## Follow-up questions for next iteration
- Do Xethryon's hidden reflection and memory loops reveal a better deep-loop abstraction than Spec Kit's externalized JSONL and reducer model?
