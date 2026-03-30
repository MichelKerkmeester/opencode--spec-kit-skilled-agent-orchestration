# Plan: Phase 2 — SessionStart Hook

## Steps

1. **Extend `session-prime.ts` with source routing:**
   - `source=compact` → read Phase 1 cache, inject
   - `source=startup` → constitutional + spec folder overview
   - Optionally query CocoIndex for code context related to current spec folder
   - `source=resume` → `memory_context({ mode: "resume", profile: "resume" })`
   - `source=clear` → constitutional only
2. **Fix `profile: "resume"` gap (iter 012):**
   - Ensure all resume paths pass `profile: "resume"` for brief format
   - Consider updating `/spec_kit:resume` command to also pass profile
3. **Token budget enforcement:**
   - startup/resume: 2000 tokens max
   - compact: 4000 tokens max (COMPACTION_TOKEN_BUDGET)
4. **Register SessionStart hook:**
   - Single hook with no matcher (handles all sources internally)
   - Merge-safe with existing settings.local.json
5. **Test by source:**
   - `startup` → verify priming output
   - `resume` → verify resume context with prior work
   - `compact` → verify cache read + injection
   - `clear` → verify minimal output

## Dependencies
- Phase 1 (shared `session-prime.ts`, `hook-state.ts`, `shared.ts`)
