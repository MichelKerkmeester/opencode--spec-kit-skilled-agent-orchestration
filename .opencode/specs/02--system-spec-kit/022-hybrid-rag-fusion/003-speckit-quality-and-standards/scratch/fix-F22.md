# F22 Fix Report

## Scope
- Inspected `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts`
- Inspected `.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts`

## Changes made
- Replaced the self-referential alias assertions in `memory-context.vitest.ts` with a real alias check against the exported `handle_memory_context` symbol.
- Converted the two explicit stub tests that only asserted `expect(true).toBe(true)` into `it.todo(...)` placeholders with concrete missing-fixture notes.
- Replaced the conditional no-op assertion in token-budget test `T208` with concrete truncation and count assertions.
- Strengthened module export coverage by asserting the expected `CONTEXT_MODES` keys and representative `INTENT_TO_MODE` mappings.
- No stub or tautological assertions matching the requested patterns were found in `eval-the-eval.vitest.ts`, so that file required no code changes.

## Verification
- Ran: `npx vitest run tests/memory-context.vitest.ts tests/eval-the-eval.vitest.ts`
