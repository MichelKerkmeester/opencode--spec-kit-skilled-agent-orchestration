---
title: "Fix Handover vs Drop Routing Confusion - Execution Plan"
status: planned
parent_spec: 002-fix-handover-drop-confusion/spec.md
---
# Execution Plan
## Approach
This phase separates hard drop wrappers from soft operational commands so real handover state can survive mixed-signal notes. The research showed the current router over-weights `git diff`, `list memories`, and similar operational phrases even when the surrounding chunk is clearly about current state, blockers, and next-session work.

The safest implementation is heuristic surgery rather than a broad drop-rule rewrite: split the cue groups, extend the handover floor with state-first phrases, keep `extractHardNegativeFlags()` focused on true wrappers, and refresh only the handover examples that currently lead with commands.

## Steps
1. Split the `drop` cue bundle in `mcp_server/lib/routing/content-router.ts:369-378` into hard wrappers and soft operational commands, following `../research/research.md:36-53,135-141`.
2. Extend the handover floor in `mcp_server/lib/routing/content-router.ts:868-877` with state-first phrases such as `active files`, `current blockers`, `remaining effort`, and `next session`, per `../research/research.md:44-53`.
3. Keep `extractHardNegativeFlags()` focused on true wrappers in `mcp_server/lib/routing/content-router.ts:904-920`, so soft command mentions do not trigger the same behavior as transcripts or boilerplate.
4. Refresh the command-heavy handover prototypes in `mcp_server/lib/routing/routing-prototypes.json:83-129` and add regression tests in `mcp_server/tests/content-router.vitest.ts:110-141` for handover chunks that mention `git diff`, restart commands, or file-review lists.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`.
- Re-run the packet's handover/drop examples and confirm stop-state notes classify as `handover_state` when only soft operational commands coexist.

## Risks
- Relaxing true wrapper signals would let transcripts leak through, so the hard wrapper list must stay intact.
- Changing handover floors without splitting the cue table would keep the same soft-command collision alive.
- Prototype edits that remain command-first could continue to reinforce the wrong boundary even after the heuristics improve.
