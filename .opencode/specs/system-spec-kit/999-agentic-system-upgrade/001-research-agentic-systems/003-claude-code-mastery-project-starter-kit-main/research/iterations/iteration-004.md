# Iteration 004 — Artifact Shape

## Research question
How do the starter kit's `.mdd` artifacts compare to `system-spec-kit` research, handover, and auto-save artifacts, and what should be adopted or rejected?

## Hypothesis
The external artifacts will be simpler to scan, while the local artifacts will be better for continuity and auditability.

## Method
Compared a real external `.mdd` doc with the local deep-research agent contract, handover contract, and Claude stop-hook auto-save behavior.

## Evidence
- The external `.mdd` doc uses short frontmatter plus compact sections for purpose, architecture, methods, test-query rules, and known issues. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-13] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:15-30] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:82-105]
- The local deep-research agent is explicitly packet-based: it writes `research/iterations/iteration-NNN.md`, appends JSONL state, and progressively updates `research/research.md`. [SOURCE: .opencode/agent/deep-research.md:24-32] [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-research.md:159-171]
- The local handover agent requires reading `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `memory/*.md`, and `implementation-summary.md` before writing a continuation document from a template. [SOURCE: .opencode/agent/handover.md:28-31] [SOURCE: .opencode/agent/handover.md:42-58]
- The local Claude Stop hook can auto-save a session summary into the memory pipeline by running `generate-context.js` for the last active spec folder. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-83] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:97-105]

## Analysis
The external `.mdd` artifact is a deliberately small working brief. The local system distributes that responsibility across multiple artifact types: research iterations capture evidence, handover captures continuation, and memory auto-save preserves session state. That is stronger but heavier. The improvement opportunity is to introduce a lighter intermediate artifact for scanability, not to replace the local multi-artifact system with `.mdd/`.

## Conclusion
confidence: high

finding: `system-spec-kit` already has the durable artifact stack the starter kit only gestures toward, but its packet ergonomics are heavier. A lightweight working-brief template would improve readability without sacrificing the current continuity guarantees.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/templates/`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** define which workflows may emit a lightweight working brief without weakening mandatory spec documentation
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the external repo had richer continuity artifacts beyond `.mdd` docs and notes. The sources reviewed did not show a comparable handover, autosave, or memory retrieval layer.

## Follow-up questions for next iteration
Should lightweight working briefs be tied to deep research, handover, or both?
Which local hook or command surfaces could reference them safely?
Where does hook-time enforcement fit relative to these artifacts?
