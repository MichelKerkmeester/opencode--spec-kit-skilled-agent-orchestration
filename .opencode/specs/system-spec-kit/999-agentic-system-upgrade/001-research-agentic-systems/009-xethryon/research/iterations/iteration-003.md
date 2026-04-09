# Iteration 003 — Post-Turn Continuity Hooks

Date: 2026-04-09

## Research question
Does Xethryon's post-turn memory hook expose a continuity pattern that `system-spec-kit` should adopt for non-hook runtimes?

## Hypothesis
The strongest transferable idea is probably not automatic memory extraction itself, but the cheap "session synopsis" layer that keeps the next turn and next session oriented without waiting for a formal save.

## Method
I traced the full post-turn hook path in Xethryon's `session/prompt.ts` and `memoryHook.ts`, then compared it with Spec Kit's bootstrap/resume surfaces and cached continuity summary logic.

## Evidence
- Xethryon initializes its memory services when the session prompt layer starts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:107-109]
- After the main loop completes, Xethryon forks a background post-turn hook that passes the full session message list, agent, model, and user context into `runMemoryPostTurnHook()`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1641-1660]
- That hook runs three subsystems in order: session-memory summarization, durable memory extraction, and AutoDream gating. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:1-12] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-168]
- The session-memory branch creates or updates a dedicated notes file with an LLM-produced running summary once extraction thresholds are met. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:175-277]
- Spec Kit already has a cached continuity mechanism, but it is tied to hook-produced summaries and explicitly evaluated for freshness and fidelity during `session_resume()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:41-64] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:174-226]
- `session_bootstrap()` then merges `session_resume()` and `session_health()`, emits hints, and recommends next actions, but it does not generate a new continuity synopsis itself. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4-5] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163-205]

## Analysis
Xethryon's post-turn memory hook is valuable because it keeps orientation fresh continuously, not because it writes markdown files per se. Spec Kit already has strong recovery machinery, including accepted/rejected cached summaries, but those summaries depend on runtime-specific producers and are not obviously available across all runtimes. The gap is not "Spec Kit has no continuity," but "Spec Kit continuity is strongest where hook infrastructure exists." A portable, lightweight session synopsis producer would fit naturally beside `session_resume()` and `session_bootstrap()` without weakening the existing authoritative save flow.

## Conclusion
confidence: medium

finding: Xethryon's most portable continuity idea is the rolling session synopsis, not the full automatic memory-writing stack. `system-spec-kit` should consider a runtime-agnostic continuity summary cache that can be refreshed between explicit `/memory:save` events and surfaced during bootstrap/resume on non-hook runtimes.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** define how non-authoritative continuity summaries are labeled so they never outrank saved packet memory
- **Priority:** should-have

## Counter-evidence sought
I looked for a universal, runtime-agnostic continuity summary producer already shipping in Spec Kit. I found cached-summary validation and bootstrap consumption, but not a generic producer analogous to Xethryon's post-turn session-memory updater.

## Follow-up questions for next iteration
- Can Xethryon's AutoDream timing model improve Spec Kit's existing reconsolidation triggers?
- Is there a governance-safe way to surface git state alongside a continuity synopsis during resume?
- Should the deep-research workflow itself gain a lightweight pre-publication self-check similar to Xethryon's reflection gate?
