---
title: "Tasks [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/004-compaction-checkpointing/tasks]"
description: "1. Record the fail-open compaction preservation contract in spec.md."
trigger_phrases:
  - "tasks"
  - "004"
  - "compaction"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 004-compaction-checkpointing

1. Record the fail-open compaction preservation contract in `spec.md`.
2. Map the hook, save authority, and bootstrap follow-through files in `plan.md`.
3. Add implementation tasks for dedupe, advisory behavior, and recovery integration in `tasks.md`.
4. Verify the phase keeps compaction work subordinate to existing authorities with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/004-compaction-checkpointing --strict`.
