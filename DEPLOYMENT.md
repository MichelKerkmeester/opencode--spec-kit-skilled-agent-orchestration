# Deployment Notes

## Docker + MCP Server

### Anti-pattern: `-v /tmp:/tmp` shared mount

Running multiple MCP server containers with `-v /tmp:/tmp`, the same UID, and the same working directory shares the hook-state directory across containers. `getProjectHash()` in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` hashes `process.cwd()` and does not add a UID salt, so two containers that start from the same directory can write to the same state path.

> **Warning**
> This is **R53-P1w-001**: a deployment mistake that worsens isolation, not a framework bug. The segment-2 synthesis flagged it because one container can poison or overwrite another container's hook-state cache.

**Mitigations**

- Prefer per-container tmpfs mounts: `docker run --tmpfs /tmp:exec,mode=1777 ...`
- Or isolate UIDs: `docker run --user <unique-uid-per-container> ...`
- Or run each container from a different working directory

## Copilot runtime

Copilot hook runtime now has compact-cache parity with Claude and Gemini. It uses the shared provenance path in `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`.

Autonomous `cli-copilot` execution is capped at 3 concurrent dispatches. That cap comes from `feedback_copilot_concurrency_override` and matches the upstream per-account throttle behavior seen above 3 concurrent requests.

## MCP transport caller context

Wave B4a landed AsyncLocalStorage-based caller identity propagation in `.opencode/skill/system-spec-kit/mcp_server/lib/context/caller-context.ts`.

Handlers read caller identity through `getCallerContext()`, so transport metadata now flows without widening handler signatures.

## Session resume auth

T-SRS-BND-01 defaults to strict mode and rejects mismatched `args.sessionId` values.

For staged rollout or compatibility testing, set `MCP_SESSION_RESUME_AUTH_MODE=permissive`.
