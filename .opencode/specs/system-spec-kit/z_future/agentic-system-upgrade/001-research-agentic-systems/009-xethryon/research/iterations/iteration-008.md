# Iteration 008 — Autonomous Skill Invocation Versus Governance

Date: 2026-04-09

## Research question
Is Xethryon's autonomous `invoke_skill` pattern compatible with `system-spec-kit`'s gate-driven workflow model?

## Hypothesis
The general pattern is probably incompatible because Spec Kit's commands and documentation system require explicit user binding and auditable setup before file-modifying execution.

## Method
I examined Xethryon's autonomy prompt and `invoke_skill.ts`, then compared them with Spec Kit's deep-research command setup contract and Gate 3-oriented documentation model.

## Evidence
- Xethryon's autonomy prompt says post-task follow-up skills are "not optional" and instructs the agent to invoke `/verify`, `/remember`, `/pr`, or `/debug` on its own after certain kinds of work. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:50-76]
- `invoke_skill.ts` loads the selected skill prompt into tool output and explicitly tells the model to execute it immediately without narrating the load step. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:28-41] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/invoke_skill.ts:70-90]
- Spec Kit's deep-research command requires setup inputs to be resolved before the YAML workflow loads, and it explicitly blocks progression until the user answers the consolidated setup prompt. [SOURCE: .opencode/command/spec_kit/deep-research.md:7-22] [SOURCE: .opencode/command/spec_kit/deep-research.md:39-47] [SOURCE: .opencode/command/spec_kit/deep-research.md:71-107]
- Spec Kit's README states that every file-modifying conversation gets a spec folder and that Gate 3 asks for that folder before modification begins. [SOURCE: .opencode/skill/system-spec-kit/README.md:227-245]
- The constitutional routing pack keeps tool choice explicit and centered on semantic, structural, or memory intent rather than letting the model self-escalate into unrelated follow-up workflows. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:33-40]

## Analysis
Xethryon's `invoke_skill` pattern is optimized for a single-application runtime that wants the model to keep taking initiative after code changes. Spec Kit is a governance layer used across different runtimes and models; it relies on explicit packet binding, setup resolution, and auditable command surfaces. If Spec Kit adopted autonomous skill execution wholesale, the result would be nondeterministic command chaining that could bypass exactly the decision points the framework is designed to preserve. The only safe transferable idea is a passive checklist or reminder, not automatic skill dispatch.

## Conclusion
confidence: high

finding: autonomous skill invocation is fundamentally misaligned with `system-spec-kit`'s gate-driven workflow model. The right move is to reject automatic skill execution and, at most, borrow the checklist language as a non-executing reminder inside command assets.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`
- **Change type:** rejected
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for any local command or constitutional rule that encouraged the model to auto-run follow-up workflows without user-confirmed setup. I found the opposite: explicit setup and wait points.

## Follow-up questions for next iteration
- Which parts of Xethryon's swarm coordination are compatible with Spec Kit if we keep everything packet-local and auditable?
- Could a reducer-owned task board capture most of the value of swarm IPC without running a mailbox runtime?
- What research workflow change would best institutionalize docs-vs-code verification so Xethryon-style marketing drift is caught automatically?
