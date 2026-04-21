---
title: "Phase 026 — Plan"
description: "12 sequential cli-copilot invocations, one per R03 finding."
importance_tier: "normal"
contextType: "implementation"
---

# Plan: Phase 026

## Strategy

One fresh cli-copilot invocation per finding. Each invocation:
1. Reads the specific iteration file (evidence)
2. Implements the documented fix
3. Runs focused test (if applicable)
4. Writes completion marker
5. Exits (process killed automatically on exit)

Driver runs invocations in sequence (max 1 concurrent). Next invocation spawns fresh process with no prior session memory. Total: 12 agents.

## Task Sequence

T01 → T02 → T03 → T04 → T05 → T06 (depends on T05) → T07 → T08 → T09 → T10 → T11 → T12

No true parallelism possible due to user directive (max 1 at a time).

## Per-task Dispatch Template

```bash
copilot -p "$(cat /tmp/task-TNN-prompt.txt)" \
  --model gpt-5.4 \
  --allow-all-tools \
  --no-ask-user \
  > /tmp/task-TNN-log.txt 2>&1
```

Each task prompt includes:
- The specific iteration file path (READ first)
- Exact file:line evidence from the finding
- Concrete fix instructions
- Verification requirement
- Final line: `TASK_TNN_DONE` on success

## Verification Pass (after all 12)

1. `npm --prefix ../../../../../skill/system-spec-kit/mcp_server run build` — TS build clean
2. Focused vitest suite — 8 files + any new tests from T06/T10/T11 all pass
3. Implementation-summary.md updated with per-finding evidence
4. Checklist.md marked [x]

## Commit

Single commit with all 12 fixes. Message lists each finding + closure status.

## Estimated Effort

- 12 × ~3-5 min per copilot invocation = 40-60 min
- Verification + commit = 5 min
- **Total: ~45-65 min wall clock**
