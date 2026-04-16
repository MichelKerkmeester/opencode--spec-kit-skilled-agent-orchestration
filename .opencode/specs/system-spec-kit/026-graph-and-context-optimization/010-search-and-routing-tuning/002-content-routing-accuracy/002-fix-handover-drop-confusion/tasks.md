---
title: "Fix Handover vs Drop Routing Confusion - Tasks"
status: complete
---
# Tasks
- [x] T-01: Split the `drop` cue table in `mcp_server/lib/routing/content-router.ts:369-378` into hard wrappers and soft operational commands using the seam defined in `../research/research.md:40-53`.
- [x] T-02: Extend the `handover_state` floor in `mcp_server/lib/routing/content-router.ts:868-877` with the state-first phrases named in `../research/research.md:45-53`.
- [x] T-03: Keep `extractHardNegativeFlags()` in `mcp_server/lib/routing/content-router.ts:904-920` limited to wrapper and boilerplate signals rather than ordinary commands.
- [x] T-04: Refresh the state-vs-command balance in `mcp_server/lib/routing/routing-prototypes.json:83-129` for the handover examples cited in `../research/research.md:42-48`.
- [x] T-05: Add regression tests in `mcp_server/tests/content-router.vitest.ts:110-141` for handover chunks that include `git diff`, `force re-index`, or restart instructions.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`
