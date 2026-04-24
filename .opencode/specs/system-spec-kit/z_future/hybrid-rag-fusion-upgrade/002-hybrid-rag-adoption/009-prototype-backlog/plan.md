---
title: "Plan: 009-protot [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/009-prototype-backlog/plan]"
description: "1. Separate prototype-only items from approved delivery work."
trigger_phrases:
  - "plan"
  - "009"
  - "protot"
  - "prototype"
importance_tier: "important"
contextType: "planning"
---
# Plan: 009-prototype-backlog

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/decision-record.md`

## Implementation Order
1. Separate prototype-only items from approved delivery work.
2. Record per-candidate guardrails, flags, and promotion criteria.
3. Keep each candidate attached to the authority it must not replace.

## Integration Points
- Weak-result fallback boundaries in `memory-search.ts`.
- Wake-up/read formatting boundaries in `session-bootstrap.ts`.
- Review/due follow-up boundaries in `fsrs-scheduler.ts` and future tool contracts.
- Promotion decisions in the parent decision record and rollout-gate packet.

## Rollback Plan
If a candidate cannot be expressed as flag-only or non-authoritative, remove it from the backlog rather than letting it blur into approved delivery scope.
