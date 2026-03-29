# Plan: Phase 4 — Cross-Runtime Fallback

## Steps

1. **Update CLAUDE.md compaction recovery:**
   - Add explicit `memory_context({ mode: "resume", profile: "resume" })` call
   - Must be first action after compaction, before any other reasoning
   - Include `profile: "resume"` (fixes gap found in iter 012)
2. **Create `.claude/CLAUDE.md`:**
   - Claude-specific private compaction recovery instructions
   - Reference to hook-based injection when hooks are active
   - Closes Gap B from iteration 012
3. **Update CODEX.md:**
   - Add equivalent compaction recovery instructions
   - Same two primitives: `memory_match_triggers` + `memory_context(resume)`
4. **Implement runtime detection:**
   - Two outputs: `runtime` + `hookPolicy`
   - Use capability-based model (iter 015) for future extensibility
5. **Test cross-runtime (7-scenario matrix from iter 015):**
   - Claude Code: hooks fire AND tool fallback works
   - Codex CLI: tool-based recovery works without hooks
   - Copilot/Gemini: tool-based recovery works, hooks suppressed by policy
6. **Optional: MCP compaction detection:**
   - Track tool call timestamps in working memory
   - If gap > threshold → auto-inject compaction context
   - Feature flag `SPECKIT_AUTO_COMPACT_DETECT` (default off for v1)

## Dependencies
- Phase 1 (validates hook pattern works, informs CLAUDE.md wording)
- Can run in parallel with Phases 2-3

## Test Files (iteration 015)
- `tests/runtime-routing.vitest.ts`
- `tests/cross-runtime-fallback.vitest.ts`
