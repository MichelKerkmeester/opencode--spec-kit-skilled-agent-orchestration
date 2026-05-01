---
title: "Implementation Plan: 002-hybrid-rag-ad [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/plan]"
description: "1. 001-architecture-boundary-freeze"
trigger_phrases:
  - "implementation"
  - "plan"
  - "002"
  - "hybrid"
  - "rag"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: 002-hybrid-rag-adoption

## 1. Affected Files
- Authority boundary and tool contracts: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`.
- Save authority and wrappers: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`.
- Compaction transport and startup guidance: `.opencode/plugins/spec-kit-compact-code-graph.js`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`.
- Review and diagnostics surfaces: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`.
- Documentation and rollout surfaces: workflow docs under `.opencode/skill/system-spec-kit/references/`, packet-local docs under this folder, and the existing strict validator at `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.

## 2. Implementation Order
1. `001-architecture-boundary-freeze`
2. `007-workflow-guidance-map`
3. `002-memory-review-tool`
4. `003-save-ergonomics`
5. `004-compaction-checkpointing`
6. `005-bootstrap-guidance`
7. `006-doctor-debug-overlay`
8. `008-rollout-evidence-gates`
9. `009-prototype-backlog`

## 3. Investigation Track
- `010` through `018` begin only after `001-architecture-boundary-freeze` is accepted, because each investigation inherits the same authority and non-goal rules.
- The investigation track does not block adopt-now implementation in `001` through `009`; it runs in parallel to answer later-stage prototype, measurement, and NEW FEATURE questions.
- `013-fsrs-memory-decay-study` should consume the `memory_review` contract from `002` as an input, but it can start with baseline measurement design before `002` is implemented.
- `016-connected-doc-hints-investigation`, `017-temporal-knowledge-graph-investigation`, and `018-wake-up-context-layering-study` should treat `009-prototype-backlog` as the current backlog boundary, not as implementation approval.

## 4. Parallelization
- `007-workflow-guidance-map` can begin immediately after `001` because it documents the frozen boundary rather than changing runtime behavior.
- `002`, `003`, `005`, and `006` can run in parallel once `001` is accepted, provided they preserve the frozen authorities.
- `004` should follow `003` because compaction checkpointing depends on JSON-primary save wrappers being settled.
- `008` should consolidate measurable gates after the implementation-facing surfaces from `002` through `007` are defined.
- `009` should remain last so prototype candidates inherit the final authority and rollout constraints.
- `010`, `011`, `012`, `014`, `015`, `016`, `017`, and `018` can run in parallel after `001` because they are investigation packets with no runtime edits in this creation pass.
- `013` can run in parallel with those investigations, but its final recommendation should reference the `memory_review` contract once `002` finishes.

## 5. Integration Points
- `memory_review` should integrate with existing validation and FSRS behavior, not replace `memory_validate` or the search pipeline.
- Save wrappers must route through `generate-context.js --json/--stdin` and respect explicit CLI target precedence.
- Compaction preservation must enter through `experimental.session.compacting` and remain advisory/fail-open.
- Bootstrap hints must extend `session_bootstrap`, `memory_context`, and startup instructions emitted by `context-server.ts`.
- Doctor/debug output must summarize `memory_health`, `memory_save` dry-run/preflight, and routing state without becoming a second repair authority.
- Investigation packets should point at current runtime surfaces that would be touched if the evidence supports adoption, but they must not imply those edits are already approved.

## 6. Rollback Plan
- If any sub-phase proposes a new authority lane, stop and revert that plan to the `001-architecture-boundary-freeze` constraints.
- If a helper surface cannot compile into existing handlers cleanly, demote it into `009-prototype-backlog`.
- If compaction or bootstrap guidance becomes blocking, remove the helper layer and preserve the current transport and bootstrap authorities unchanged.
- If rollout gates cannot be measured against real handlers or tests, keep the packet as design-only and do not publish a public-surface change.
- If an investigation phase cannot name measurable decision criteria, reduce it to a backlog note and do not escalate it into implementation work.
