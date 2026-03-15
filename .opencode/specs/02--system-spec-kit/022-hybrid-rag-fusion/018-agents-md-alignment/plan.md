---
title: "Plan: 018-agents-md-alignment"
description: "Implementation plan for aligning AGENTS.md Quick Reference tables with the 7-command memory suite."
trigger_phrases:
  - "018 plan"
  - "agents md plan"
importance_tier: "important"
contextType: "plan"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 018-agents-md-alignment

<!-- ANCHOR:summary -->
## Approach

Direct edit of 3 AGENTS.md files to close 5 identified gaps in Quick Reference workflow tables. All gaps are documentation-only changes to markdown tables — no code, no scripts, no tests.

<!-- /ANCHOR:summary -->
## Gap Analysis

| Gap | Description | Files Affected |
|-----|-------------|----------------|
| 1 | Constitutional memory row missing subcommands (`list`, `edit`, `remove`, `budget`) | All 3 |
| 2 | Database maintenance row missing `ingest` subcommand | All 3 |
| 3 | Missing Analysis/evaluation row for `/memory:analyze` | All 3 |
| 4 | Missing Shared memory row for `/memory:shared` | All 3 |
| 5 | FS-Enterprises Research/exploration row missing `memory_context()` | FS only |

## Execution Steps

1. **Read** all 3 AGENTS.md files to verify current state
2. **Edit** each file:
   - Update Constitutional memory row (Gap 1)
   - Update Database maintenance row + add 2 new rows after it (Gaps 2-4)
   - Fix Research/exploration row in FS-Enterprises only (Gap 5)
3. **Verify** via grep checks:
   - `/memory:analyze` → 3 matches
   - `/memory:shared` → 3 matches
   - `ingest operations` → 3 matches
   - `list.*edit.*remove.*budget` → 3 matches
   - `GIT POLICY: READ-ONLY` → 1 match (Barter preservation)
   - `memory_context.*unified` → 1 match (FS-Enterprises fix)

## Row Content

```markdown
| **Constitutional memory** | `/memory:learn [rule]` \| `list` \| `edit` \| `remove` \| `budget` → Qualify → Structure with triggers → Budget check → Write to `constitutional/` → Index |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Analysis/evaluation**   | `/memory:analyze` → preflight, postflight, causal graph, ablation, dashboard, history                                              |
| **Shared memory**         | `/memory:shared` → create, member, status (deny-by-default governance)                                                             |
```

## Risk Assessment

- **Low risk**: Documentation-only changes to markdown tables
- **Preservation check**: Barter git policy and FS-Enterprises stack tables must remain untouched
- **Consistency**: All 3 files must have identical memory command rows (except variant-specific rows)
