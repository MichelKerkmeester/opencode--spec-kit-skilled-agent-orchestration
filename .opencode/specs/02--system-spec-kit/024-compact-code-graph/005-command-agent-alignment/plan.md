# Plan: Phase 5 — Command & Agent Alignment

## Steps

1. **Audit memory commands:**
   - Read all files in `.opencode/command/memory/`
   - Identify compaction references, save triggers, context assumptions
   - Document which commands need changes
2. **Update `/spec_kit:resume` to pass `profile: "resume"`:**
   - Locate the `memory_context()` call in resume command
   - Add `profile: "resume"` parameter (fixes gap from research iter 012)
   - Verify the resume brief format is returned instead of raw search results
3. **Update `/memory:save` for Stop hook awareness:**
   - Add check for recent Stop hook auto-save (inspect temp state or `session_token_snapshots`)
   - If auto-save occurred within last 60 seconds: prompt user about merge/skip
   - Preserve existing save behavior as default when no hooks active
4. **Audit agent definitions for compaction recovery instructions:**
   - Search all 4 agent directories for compaction-related content:
     `.claude/agents/`, `.opencode/agent/`, `.codex/agents/`, `.gemini/agents/`
   - List every agent file that references: compaction, compact, recovery, resume, context loss
5. **Update agent definitions to reference hook-injected context:**
   - Add conditional block: "If hook-injected context is present in conversation, use it"
   - Keep existing manual recovery as fallback
   - Ensure `@handover`, `@context`, `@orchestrate` agents are updated
6. **Test commands with and without hooks active:**
   - Claude Code (hooks active): verify resume uses hook context, save detects auto-save
   - Codex CLI (no hooks): verify resume still works via tool fallback
   - Verify no regression in any command's core behavior

## Dependencies
- Phase 1 (hook scripts must exist to test hook awareness)
- Phase 3 (Stop hook must exist for `/memory:save` double-save detection)
- Phase 4 (runtime detection needed for conditional behavior)
