# Iteration 006 -- D1 Correctness: Stop Hook Control Flow Verification

**Agent:** GPT-5 Codex
**Dimension:** D1 Correctness
**Status:** complete
**Timestamp:** 2026-03-31T12:46:05+0200

## Findings

### P0

None in this slice.

### P1

1. Normal Claude Stop events still never reach any of `session-stop.ts`'s post-stop work. The registered Stop hook is the async Claude lifecycle command [SOURCE: .claude/settings.local.json:28-36], but `main()` returns immediately whenever `stop_hook_active === false` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:81-90]. The packet research defined `stop_hook_active === true` as the recursive-loop case that must exit early [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-014.md:459-486], so ordinary session shutdowns bypass transcript parsing, spec-folder detection, summary extraction, and every save-related branch.

2. The only reachable Stop-hook branch still cannot execute the required save flow, and its duplicate-save control is wired to the wrong state machine. In the reachable `stop_hook_active === true` branch, the hook never invokes `generate-context.js`; it only rewrites `pendingCompactPrime` with a resume reminder string [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:146-166], even though Phase 003 requires a lightweight context save when significant work is detected [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/spec.md:61-64] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/spec.md:136-144]. That same `pendingCompactPrime` field is the PreCompact cache consumed by SessionStart recovery [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-25] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:234-239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:39-53], so the duplicate-save guard is suppressing Stop behavior based on compaction cache presence rather than evidence of a completed Stop-time save.

### P2

None newly identified in this slice.

## Ruled Out

- `memory-surface.ts` does not show a fresh D1 runtime break in this pass. The Claude lifecycle Stop hook is a separate external-process path [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/README.md:29-40], while MCP-side auto-surface wiring goes through `context-server.ts`, which routes `memory_context(mode=resume)` to `autoSurfaceAtCompaction()` and other tool calls to the appropriate memory-surface helpers [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-347]. The associated runtime tests also exercise those branches directly [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:913-1041] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:586-629].

## Evidence

- Re-read the required review state files plus `iteration-002.md` before tracing code so this pass could distinguish verified prior findings from new issues.
- Traced `session-stop.ts` from stdin parse through the guard, transcript parse, spec detection, summary extraction, and duplicate-save logic.
- Cross-checked the hook field semantics against Phase 003 and the iteration-014 research notes.
- Ran a small runtime sanity check against the built hook:
  - `stop_hook_active=false` logged `Stop hook not active, skipping`
  - `stop_hook_active=true` logged the session summary path and normal completion, but still performed no save invocation
- Reviewed `memory-surface.ts` together with `context-server.ts`, `hooks/README.md`, and the runtime tests to confirm the MCP-side integration still behaves as designed.

## Next Adjustment

- Keep the Stop-hook P1 cluster active until the guard is inverted, Stop-time persistence is decoupled from `pendingCompactPrime`, and regression coverage proves normal Stop events reach the save path without corrupting compact recovery.
