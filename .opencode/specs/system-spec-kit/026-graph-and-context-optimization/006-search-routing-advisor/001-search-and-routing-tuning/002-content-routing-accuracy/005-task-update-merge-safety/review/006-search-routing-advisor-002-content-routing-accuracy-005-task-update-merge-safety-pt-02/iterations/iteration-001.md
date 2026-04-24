# Iteration 001 - Correctness

## Scope Read

Packet implementation-summary.md and graph-metadata.json identify the task-update merge guard surface. Code audited this pass:

- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

Git history checked: `29624f3a71 feat(026): implement all 5 remaining gap phases`, plus later handler/test repair commits visible in `git log --stat`.

Vitest: PASS, `2 passed` files, `77 passed | 3 skipped`.

## Finding

### P1-IMPL-002 - Task update matching treats dependency mentions as target-task matches

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:542` calls document-wide `resolveChecklistTaskMatches`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:573` builds a regex for the target id.
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:576` accepts any checklist line containing that regex.
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:464` to `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:466` repeats the same line filter inside the target anchor.

Expected: a `T002` task update matches the checklist item's own task identifier field.

Actual: any structured checklist line mentioning `T002` is counted. A line like `- [ ] T003 Depends on T002 before release` becomes a second `T002` match and can reject a legitimate `T002` update as ambiguous, or target the wrong line if it is the only mention.

## Delta

New findings: 1. Registry updated with `P1-IMPL-002`.
