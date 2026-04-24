---
title: "...arch-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion/plan]"
description: 'title: "Fix Handover vs Drop Routing Confusion - Execution Plan"'
trigger_phrases:
  - "arch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "plan"
  - "002"
  - "fix"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
parent_spec: 002-fix-handover-drop-confusion/spec.md
status: complete
---
# Execution Plan
## Approach
This phase separates hard drop wrappers from soft operational commands so real handover state can survive mixed-signal notes. The research showed the current router over-weights `git diff`, `list memories`, and similar operational phrases even when the surrounding chunk is clearly about current state, blockers, and next-session work.

The safest implementation is heuristic surgery rather than a broad drop-rule rewrite: split the cue groups, extend the handover floor with state-first phrases, keep `extractHardNegativeFlags()` focused on true wrappers, and refresh only the handover examples that currently lead with commands.

## Steps
1. Split the `drop` cue bundle in `mcp_server/lib/routing/content-router.ts:409-411` into hard wrappers and soft operational commands, following `../../../../research/010-search-and-routing-tuning-pt-02/research.md:36-53,135-141`.
2. Extend the handover floor in `mcp_server/lib/routing/content-router.ts:1001-1014` with state-first phrases such as `active files`, `current blockers`, `remaining effort`, and `next session`, per `../../../../research/010-search-and-routing-tuning-pt-02/research.md:44-53`.
3. Keep `extractHardNegativeFlags()` focused on true wrappers in `mcp_server/lib/routing/content-router.ts:1039-1049`, so soft command mentions do not trigger the same behavior as transcripts or boilerplate.
4. Refresh the command-heavy handover prototypes in `mcp_server/lib/routing/routing-prototypes.json:83-129` and add regression tests in `mcp_server/tests/content-router.vitest.ts:110-141` for handover chunks that mention `git diff`, restart commands, or file-review lists.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`.
- Re-run the packet's handover/drop examples and confirm stop-state notes classify as `handover_state` when only soft operational commands coexist.

## Risks
- Relaxing true wrapper signals would let transcripts leak through, so the hard wrapper list must stay intact.
- Changing handover floors without splitting the cue table would keep the same soft-command collision alive.
- Prototype edits that remain command-first could continue to reinforce the wrong boundary even after the heuristics improve.
