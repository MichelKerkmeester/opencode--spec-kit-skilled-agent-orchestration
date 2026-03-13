## Agent 11 - Retrieval/query contract perfection

- Scope kept to runtime code/tests in `.opencode/skill/system-spec-kit/mcp_server/` plus this scratch note.
- Verified `copilot` is installed, confirmed `~/.copilot/config.json` includes `"reasoning_effort": "xhigh"`, and used `copilot -p ... --model gpt-5.3-codex --allow-all-tools 2>&1` for a non-mutating audit pass.
- Root cause: `memory_context` schema and tool metadata describe `sessionId` as caller-supplied, but `handleMemoryContext()` rejected any caller-supplied ID unless `workingMemory.sessionExists(sessionId)` was already true.
- Fix applied in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`: preserve resume detection for existing sessions, but stop treating new caller-supplied session IDs as unauthorized.
- Contract after fix:
  - omitted `sessionId` -> ephemeral UUID generated for the call
  - supplied existing `sessionId` -> caller-scoped resume, `resumed: true`
  - supplied new `sessionId` -> caller-scoped new session, `resumed: false`, `eventCounterStart: 0`
- Regression coverage added in `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts` with `T027ka`, asserting a new caller-supplied `sessionId` no longer errors and does not query the resume counter.
- No spec-folder docs were edited; only `scratch/agent-11-retrieval.md` was added under the existing spec folder as requested.
- Validation run:
  - `npx vitest run tests/handler-memory-context.vitest.ts`
  - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server`
