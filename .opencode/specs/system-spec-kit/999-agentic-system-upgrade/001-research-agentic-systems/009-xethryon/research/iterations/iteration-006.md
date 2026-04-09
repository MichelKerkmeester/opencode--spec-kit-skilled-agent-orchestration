# Iteration 006 — Live Git Context

Date: 2026-04-09

## Research question
Should `system-spec-kit` surface live git state during `session_bootstrap()` and `session_resume()` the way Xethryon injects git context into every turn?

## Hypothesis
Spec Kit probably already captures enough git metadata for saved memories, but it may not expose that information at resume time in a way that immediately changes user decisions.

## Method
I traced Xethryon's `git.ts` plus the prompt-loop injection point, then compared that with Spec Kit's existing git-oriented extractors and current bootstrap/resume response surfaces.

## Evidence
- Xethryon's git module collects branch, changed-file counts, merge/rebase state, ahead/behind counts, stash count, and cleanliness, then renders a `<git_context>` prompt block with behavioral guidance. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/git.ts:16-49] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/git.ts:68-193]
- The main prompt loop always gathers `gitCtx` alongside memory and skills and injects it into the system prompt if available. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1555-1585]
- Spec Kit already captures git metadata in its extraction pipeline: `session-extractor.ts` uses the current branch as a session channel, and `git-context-extractor.ts` mines repo state and git history for session enrichment. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:93-107] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-72] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/README.md:32-46]
- `session_bootstrap()` currently focuses on resume state, health, structural context, and next actions; it does not expose a live git-state section. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:45-62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126]
- `session_resume()` validates cached continuity and structural readiness, but its public result surface is still centered on memory/code-graph/CocoIndex rather than repo-state visibility. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:87-117]

## Analysis
This is not a greenfield gap. Spec Kit already knows about git state during capture and indexing, so Xethryon's novelty is the timing and presentation: it exposes live repo-state at the start of decision-making, not just after a memory artifact is saved. That matters most for risky continuation tasks where branch drift, dirty trees, or an in-progress rebase should shape the very next move. A narrow adoption would therefore be presentation-oriented: surface a read-only git snapshot during bootstrap/resume, but keep it subordinate to memory and structural context rather than injecting it into every retrieval call.

## Conclusion
confidence: medium

finding: `system-spec-kit` already captures git context, but it does not currently foreground live git state in the same way Xethryon does. A small bootstrap/resume git summary could improve continuation safety without importing Xethryon's always-on prompt-injection model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** decide whether the snapshot is sourced live from git at call time or reused from recent extractor output when git is unavailable
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for a current `session_bootstrap()` or `session_resume()` field that already exposes branch/dirty/ahead-behind state to callers. I did not find one, despite the extractor layer already knowing how to derive it.

## Follow-up questions for next iteration
- Could Xethryon's role-switch trigger matrix sharpen Spec Kit's orchestrator prompts without giving the model unsafe autonomy?
- Does autonomous skill invocation fit Spec Kit's gate model at all, or is it fundamentally incompatible?
- Can Xethryon's swarm coordination patterns be reduced into auditable packet-local artifacts rather than live file IPC?
