# Iteration 009 — Operator Observability

## Research question
Does the starter kit's AI monitor reveal a user-facing observability gap in `system-spec-kit`?

## Hypothesis
The local repo will have strong internal telemetry but little operator-facing visibility compared with the starter kit's monitor command.

## Method
Read the external AI monitor command and RuleCatch hook, then compared them to the local telemetry and pressure-monitoring documentation.

## Evidence
- The external `/what-is-my-ai-doing` command tells the user to run a separate terminal monitor that shows tool calls, token usage, cost, and accessed files with zero token overhead. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/what-is-my-ai-doing.md:8-41]
- The external README treats that monitor as a first-class feature, and the RuleCatch stop hook surfaces violation summaries that point users back to `pnpm ai:monitor`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:99-104] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-rulecatch.sh:20-29]
- The local system-spec-kit runtime does have internal monitoring concepts such as context-pressure monitoring, attention decay, and real-time filesystem watching. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:297-305] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:420-424] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:491-497]
- The local top-level command surface is organized around create, improve, memory, and spec-kit groups; there is no equivalent operator-facing monitoring group or command called out there. [SOURCE: .opencode/command/README.txt:40-49]

## Analysis
The local repo already measures useful things, but it mostly exposes them as internals or documentation, not as an operator tool. The starter kit is much more explicit about "watch what the AI is doing right now." That is a different value proposition from retrieval quality or memory telemetry. For `system-spec-kit`, the opportunity is not to clone RuleCatch, but to expose existing session metrics, hook outcomes, or retrieval decisions through a user-facing command or troubleshooting surface.

## Conclusion
confidence: medium

finding: The starter kit's monitor reveals a real observability gap in `system-spec-kit`: operator-friendly visibility exists conceptually, but not as a first-class command or workflow surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/memory/manage.md`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** decide whether the first surface should be a read-only status command, a session-log viewer, or a telemetry summary workflow
- **Priority:** nice-to-have

## Counter-evidence sought
I searched the local command and Claude surfaces for a direct equivalent to `/what-is-my-ai-doing`. I found internal monitoring documentation, but not a comparable operator-facing command.

## Follow-up questions for next iteration
Are the external specialist agents actually better than the local agent roster?
Should MCP-install guidance become part of local command or rulebook docs?
What phase overlap should observability work carry into later planning?
