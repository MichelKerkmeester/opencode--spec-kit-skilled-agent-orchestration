# Iteration 002 - Security

## Scope

- Dimension: `security`
- Reviewed surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts`

## Findings

### P0

- None.

### P1

- None.

### P2

- None.

## Notes

- The cached-summary path still fails closed when scope cannot be proven or the transcript identity cannot be confirmed, which keeps the bootstrap/resume flow on the defensive side of the trust boundary [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:107] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:125] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:276] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:314].
- The bootstrap payload continues to carry explicit structural trust metadata instead of collapsing trust into a scalar shortcut, and the focused tests keep that contract pinned [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:375] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:404] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:69].
