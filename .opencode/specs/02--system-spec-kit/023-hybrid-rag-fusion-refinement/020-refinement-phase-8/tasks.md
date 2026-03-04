---
title: "Tasks: Scripts vs mcp_server Architecture Refinement [template:level_3/tasks.md]"
description: "Atomic tasks for boundary clarity, dependency direction cleanup, and documentation consolidation."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "architecture tasks"
  - "boundary actions"
  - "scripts mcp_server tasks"
importance_tier: "critical"
contextType: "architecture"
---
# Tasks: Scripts vs mcp_server Architecture Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Task Notation
<!-- ANCHOR:notation -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Action (single path) - WHY - Acceptance`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Contract and Discoverability

- [ ] T001 Create `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` - WHY: no canonical ownership contract exists - Acceptance: runtime vs scripts matrix + allowed/forbidden dependency directions documented.
- [ ] T002 Create `.opencode/skill/system-spec-kit/mcp_server/api/README.md` - WHY: public API boundary is implicit in comments only - Acceptance: API surface and consumer policy documented.
- [ ] T003 Create `.opencode/skill/system-spec-kit/scripts/evals/README.md` - WHY: eval scripts mix API and internal imports - Acceptance: import policy with exception process documented.
- [ ] T004 Update `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` - WHY: compatibility wrapper intent is easy to misread - Acceptance: heading/scope explicitly says compatibility wrappers only.
- [ ] T005 Update `.opencode/skill/system-spec-kit/scripts/memory/README.md` - WHY: reindex runbook should have single canonical owner - Acceptance: canonical runbook section present.
- [ ] T006 Update `.opencode/skill/system-spec-kit/mcp_server/database/README.md` - WHY: duplicate runbook details drift - Acceptance: pointer to canonical runbook replaces duplicate procedural detail.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Structural Cleanup

- [ ] T007 Create `.opencode/skill/system-spec-kit/shared/utils/token-estimate.ts` - WHY: repeated chars/4 estimator logic across modules - Acceptance: shared helper exported and documented.
- [ ] T008 Update `.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts` - WHY: local token estimation duplicates shared concern - Acceptance: imports and uses shared token-estimate helper.
- [ ] T009 Update `.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts` - WHY: local token estimation duplicates shared concern - Acceptance: imports and uses shared token-estimate helper.
- [ ] T010 Create `.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts` - WHY: quality extraction logic duplicated between scripts and runtime parser - Acceptance: shared extractor API added.
- [ ] T011 Update `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` - WHY: scripts quality extraction drift risk - Acceptance: uses shared quality extractor implementation.
- [ ] T012 Update `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` - WHY: runtime parser quality extraction drift risk - Acceptance: uses shared quality extractor implementation.
- [ ] T013 Create `.opencode/skill/system-spec-kit/mcp_server/handlers/orchestration-common.ts` - WHY: current handler cycle increases coupling risk - Acceptance: extracted utility removes at least one edge in the documented cycle.
- [ ] T014 Update `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` - WHY: cycle participation - Acceptance: dependency graph confirms cycle no longer exists.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Enforcement

- [ ] T015 Create `.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json` - WHY: controlled migration exceptions need explicit ownership - Acceptance: each exception has owner and removal condition.
- [ ] T016 Create `.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts` - WHY: prevent new `@spec-kit/mcp-server/lib/*` coupling - Acceptance: script fails on violations outside allowlist.
- [ ] T017 Update `.opencode/skill/system-spec-kit/scripts/package.json` - WHY: guardrail must run automatically - Acceptance: check script integrated into standard lint/check pipeline.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 boundary documentation tasks completed.
- [ ] Handler cycle concern resolved and verified.
- [ ] Import-policy guardrail enabled by default.
- [ ] Checklist updated with evidence for completed items.
<!-- /ANCHOR:completion -->

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
