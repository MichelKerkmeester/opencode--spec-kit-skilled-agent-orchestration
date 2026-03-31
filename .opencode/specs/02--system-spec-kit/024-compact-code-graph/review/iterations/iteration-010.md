# Iteration 010: D4 Maintainability

## Focus

Cross-check the Claude hook registration and documentation surface: `.claude/settings.local.json`, `.claude/CLAUDE.md`, root `CLAUDE.md`, and the MCP hook helper exports in `hooks/index.ts`, `mutation-feedback.ts`, and `response-hints.ts`.

## Findings

No P0 or P1 issues found.

### [P2] Recovery guidance is split across two documentation surfaces, so hook-driven resume behavior no longer has one clear source of truth

- The Claude-specific recovery guide tells maintainers to recover manually through `memory_context(...)` after compaction and after `/clear`.[SOURCE: .claude/CLAUDE.md:9-18]
- The root guide still documents `/spec_kit:resume` as a first-class recovery workflow alongside a raw `memory_context(...)` call.[SOURCE: CLAUDE.md:48-51]
- The actual SessionStart hook behavior follows the Claude-specific path, not the root dual-surface wording: compact fallback, compact instructions, resume, and clear all point back to `memory_context(...)` rather than `/spec_kit:resume`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44-45][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58-60][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143-152][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:158-164]
- Impact: future recovery-flow changes now require synchronized edits across two overlapping docs, and reviewers have to infer which one is authoritative when hook behavior changes.
- Fix: pick one canonical manual-recovery surface for hook-aware docs and make the other document explicitly defer to it instead of restating a slightly different workflow.

### [P2] Token-count synchronization is owned in both `response-hints.ts` and the shared envelope layer

- `context-server.ts` imports `appendAutoSurfaceHints`, `syncEnvelopeTokenCount`, and `serializeEnvelopeWithTokenCount` from `./hooks/index.js`, then uses those hook-layer helpers to reserialize the final MCP envelope after auto-surface decoration and token-budget enforcement.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:47-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:373-433]
- `response-hints.ts` implements its own token-count convergence loop and serializer around `estimateTokenCount(...)`, with its own retry cap and envelope mutation logic.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:24-57]
- The shared response layer already owns the same concern through a separate `syncEnvelopeTokenCount()` implementation used by `createResponse()` / `createSuccessResponse()` when envelopes are first built.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:99-119][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:148-179]
- The hook-specific test suite locks in the duplicated path by asserting token counts against the hook-layer estimator rather than a single shared helper contract.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts:63-97]
- Impact: token-count semantics now have two maintainers, two convergence loops, and two test surfaces; a future envelope-shape or estimator change can drift silently between initial envelope creation and post-hook decoration.
- Fix: move post-decoration token syncing onto the existing shared envelope helper, or have `response-hints.ts` import that helper directly so token-count ownership lives in one module.

## Verified Healthy

- `.claude/settings.local.json` registers all three Claude lifecycle hooks (`PreCompact`, `SessionStart`, `Stop`) and points each one at an existing compiled entrypoint under `mcp_server/dist/hooks/claude/`.[SOURCE: .claude/settings.local.json:5-39][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js:1-13][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js:1-15][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:1-10]
- `hooks/index.ts` exports are consistent with the runtime import surface used by `context-server.ts`, the generated dist barrel, and the current hooks integration tests.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:47-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/dist/hooks/index.js:4-6][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1538-1567]
- I did not find new dead or unreachable code inside `hooks/index.ts`, `mutation-feedback.ts`, or `response-hints.ts` during this pass. The remaining dead-path concern in the hook layer is still the previously logged `workingSet` branch in `session-prime.ts`, not a new export-layer problem in the files reviewed here.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts:6-59][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-113]

## Summary

- P0: 0 findings
- P1: 0 findings
- P2: 2 findings
- Registration status: correct and complete for the reviewed Claude lifecycle hooks
- Net result: the hook integration surface is wired, but its recovery documentation and token-count ownership are still split across multiple maintenance surfaces
