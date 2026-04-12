# Iteration 029 — The Missing UX Artifact Is A Single Active Workflow Card

Date: 2026-04-10

## Research question
What single artifact would reduce the most end-to-end workflow friction in `system-spec-kit` without weakening spec folders, gates, or validation?

## Hypothesis
A generated "active workflow card" would have the highest leverage: one compact, current-state summary that bridges spec folder, workflow phase, validation state, and next action.

## Method
I walked the common `system-spec-kit` lifecycle across planning, implementation, completion, memory, and recovery surfaces, then compared that to Xethryon's compact status-driven interaction model.

## Evidence
- `system-spec-kit` spans multiple lifecycle docs and setup prompts across planning, implementation, completion, and recovery. [SOURCE: .opencode/command/spec_kit/plan.md:37-52] [SOURCE: .opencode/command/spec_kit/implement.md:35-120] [SOURCE: .opencode/command/spec_kit/complete.md:38-144] [SOURCE: .opencode/command/spec_kit/resume.md:177-215]
- The current README already frames bootstrap/resume and validation as important surfaces, but not as one persistent operator summary. [SOURCE: .opencode/skill/system-spec-kit/README.md:137-149] [SOURCE: .opencode/skill/system-spec-kit/README.md:170-198]
- Xethryon's UX compression comes partly from visible, compact status and mode cues rather than from fewer underlying subsystems. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:47-68] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:181-205]

## Analysis
The highest-friction moment in Spec Kit is not file creation or validation by itself. It is the gap between those surfaces: the user has to reconstruct current state from several documents and tool outputs. Xethryon's status cues demonstrate the value of continuous orientation. Spec Kit needs that same benefit, but in a way that fits its packet model.

The right artifact is not another long document. It is a short generated card that can be shown in bootstrap/resume and optionally written to `scratch/` for long-running work: spec folder, current phase, open blockers, validation status, and recommended next step.

## UX / System Design Analysis

- **Current system-spec-kit surface:** state is spread across commands, docs, validator output, and memory surfaces.
- **External repo's equivalent surface:** a tighter continuous interaction surface with stronger status visibility.
- **Friction comparison:** `system-spec-kit` preserves much more provenance, but it makes users synthesize too much state manually between steps.
- **What system-spec-kit could DELETE to improve UX:** repeated manual state reconstruction across plan, implement, complete, and resume steps.
- **What system-spec-kit should ADD for better UX:** a generated workflow card that summarizes current state and next action in one place.
- **Net recommendation:** ADD

## Conclusion
confidence: medium

finding: add a single active workflow card that travels across bootstrap, resume, and long-running packet work. This is the cleanest end-to-end UX improvement available without structural churn.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** rich state exists, but it is distributed.
- **External repo's approach:** lighter status surfaces keep the operator continuously oriented.
- **Why the external approach might be better:** better continuity and less manual reconstruction.
- **Why system-spec-kit's approach might still be correct:** distributed detail is still necessary for governance, validation, and auditability.
- **Verdict:** ADD
- **If ADD — concrete proposal:** emit a compact `workflowCard` object in bootstrap/resume and optionally mirror it into packet-local scratch output for long-running tasks.
- **Blast radius of the change:** medium
- **Migration path:** additive only; no existing artifact needs to be removed.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a stable minimal schema for status, blockers, validation, and next action
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for another single change with more leverage than a workflow card. Most alternatives either duplicated existing docs or required broader command/agent restructuring.

## Follow-up questions for next iteration
- If the workflow card exists, does the current YAML workflow-asset surface still feel like the right abstraction boundary?
