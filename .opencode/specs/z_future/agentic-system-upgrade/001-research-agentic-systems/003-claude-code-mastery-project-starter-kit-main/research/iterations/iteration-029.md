# Iteration 029 - Add One Guided Work Command

## Research question
Does the end-to-end feature workflow in `system-spec-kit` need a single guided start command that creates or resumes the right packet state automatically, rather than asking the user to compose the lifecycle manually?

## Hypothesis
The external repo's guided workflow will show that the biggest practical UX win is not another doc improvement, but one front door that asks a consolidated interview and routes to the right internal stage.

## Method
Walked the local feature-workflow surfaces end to end and compared them to the external repo's guided document-driven workflow.

## Evidence
- The local flow currently spans multiple gates, lifecycle commands, template choices, validator semantics, and possible memory actions before the full loop settles. [SOURCE: CLAUDE.md:47-70] [SOURCE: CLAUDE.md:107-165] [SOURCE: .opencode/command/spec_kit/plan.md:31-120] [SOURCE: .opencode/command/spec_kit/implement.md:29-120] [SOURCE: .opencode/command/spec_kit/complete.md:32-120]
- The local command docs already document chaining between plan, implement, complete, resume, and handover, which confirms that the system conceptually behaves like one workflow even though it is surfaced as several commands. [SOURCE: .opencode/command/spec_kit/README.txt:121-178]
- The external repo's `/mdd` flow acts like a guided start command: it interviews the user, writes the working doc, plans the implementation path, and then keeps progress visible. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
- The external user guide also reduces friction by presenting one practical journey instead of a command taxonomy first. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/USER_GUIDE.md:38-108]

## Analysis
This is the concrete product move that falls out of the earlier command and gate findings. `system-spec-kit` already has most of the necessary internals. What it lacks is a guided "start work" surface that asks the questions once, creates or reuses the correct packet, routes to the right lifecycle path, and explains the next step in plain language. The external repo does not have the same governance depth, but it does prove that a guided front door sharply lowers workflow friction.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Ask the user to navigate a multi-step workflow through several separate commands and concepts.
- **External repo's approach:** Provide a guided entry command that interviews first and routes the rest of the workflow through one narrative path.
- **Why the external approach might be better:** It matches how users think about work: "help me start" or "help me continue," not "help me pick the right lifecycle subcommand."
- **Why system-spec-kit's approach might still be correct:** Advanced operators may still want direct access to the existing lower-level commands.
- **Verdict:** ADD
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Add `/spec_kit:start` or `/spec_kit:work` as the canonical guided front door, while keeping current lifecycle commands as expert surfaces.
- **Blast radius of the change:** medium
- **Migration path:** Build the front door as a wrapper over existing flows first, then decide whether some lower-level commands should become secondary.

## UX / System Design Analysis

- **Current system-spec-kit surface:** A feature workflow involves multiple visible steps, choices, and state transitions that the user may need to infer.
- **External repo's equivalent surface:** One guided command collects context and starts the work loop.
- **Friction comparison:** The local system creates more durable structure, but the operator pays for that by navigating more concepts and steps. The external repo reaches useful momentum faster.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for users to manually compose the lifecycle from separate commands for common feature work.
- **What system-spec-kit should ADD for better UX:** Add one guided work command with a consolidated interview, packet creation or reuse, and state-aware routing.
- **Net recommendation:** ADD

## Conclusion
confidence: high

finding: `system-spec-kit` should add a single guided work command that creates or resumes the right packet and routes internally through the lifecycle on the user's behalf.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/`, lifecycle routing, packet bootstrap flow
- **Change type:** new command surface
- **Blast radius:** medium
- **Prerequisites:** decide whether the command should own spec-folder creation and continuity prompts directly
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that existing plan and implement commands already function as a single guided start surface, but the docs still position them as separate choices the user must select up front. [SOURCE: .opencode/command/spec_kit/plan.md:7-29]

## Follow-up questions for next iteration
If a guided start command exists, what help and status surfaces should surround it so the system stays legible during longer runs?
