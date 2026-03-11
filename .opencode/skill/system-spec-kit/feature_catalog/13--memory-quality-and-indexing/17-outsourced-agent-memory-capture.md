# Outsourced agent memory capture

## Current Reality

CLI agents dispatched via cli-codex, cli-copilot, cli-gemini, and cli-claude-code run in sandboxed subprocesses with no access to the Spec Kit Memory MCP server. When the calling AI delegates work to an external CLI agent, session context — decisions made, files modified, problems solved — is lost because the agent has no memory save protocol. Current workarounds produce garbage placeholder memories or skip saving entirely.

The planned solution is a memory return protocol that embeds a structured memory epilogue in the agent's dispatch prompt. The agent includes its session summary in stdout using a defined format. The calling AI then extracts this structured section and feeds it to `generate-context.js` JSON mode (`/tmp/save-context-data.json`) as a bridge into the standard Spec Kit Memory pipeline. This preserves the existing quality gates, deduplication, and indexing infrastructure while enabling outsourced sessions to contribute real memories.

Status: Planned. Spec folder `014-outsourced-agent-memory` exists at Draft status.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| (none yet — feature is planned) | — | — |

### Tests

| File | Focus |
|------|-------|
| (none yet — feature is planned) | — |

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Outsourced agent memory capture
- Current reality source: spec 014-outsourced-agent-memory (Draft)
