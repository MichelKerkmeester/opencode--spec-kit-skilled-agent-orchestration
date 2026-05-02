# Iteration 001 - Correctness

## Scope

- Dimension: `correctness`
- Reviewed surfaces:
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`

## Findings

### P0

- None.

### P1

- None.

### P2

- P2-001: `session_resume` implements a `sessionId` override for cached-summary selection, but the public tool contract strips that field before callers can use it. The handler accepts `sessionId` and forwards it into cached-summary resolution [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:87] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409], while both schema layers only allow `specFolder` and `minimal` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:669] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:442]. In multi-session Claude recovery, operators cannot disambiguate which cached session to resume even though the implementation was written for that path.
- P2-002: `session_bootstrap` can surface a self-referential next step when structural context is missing because it reuses a generic contract string that says to "Call session_bootstrap first" even though the caller is already inside `session_bootstrap`. The bootstrap handler injects `structuralContext.recommendedAction` directly into `nextActions` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:112] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:330], but the contract builder ignores `sourceSurface` and hardcodes the missing-state recommendation [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:210] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257]. That makes the advertised recovery guidance non-actionable in the exact "missing graph" path where bootstrap should produce the clearest follow-up.

## Notes

- Root packet docs and handler registrations agree that `session_bootstrap()` is the canonical first recovery call and `session_resume()` remains the detailed follow-up surface [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:122] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:668].
- No P0/P1 correctness faults were confirmed in the bootstrap/resume happy-path contract during this pass.
