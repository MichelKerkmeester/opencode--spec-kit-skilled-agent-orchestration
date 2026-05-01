---
title: "P [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/011-tool-profile-split-investigation/plan]"
description: "1. Baseline today's startup, bootstrap, and workflow guidance for tool discoverability."
trigger_phrases:
  - "plan"
  - "011"
  - "tool"
importance_tier: "important"
contextType: "planning"
---
# Plan: 011-tool-profile-split-investigation

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`

## Investigation Order
1. Baseline today's startup, bootstrap, and workflow guidance for tool discoverability.
2. Define one or two presentation-only grouping candidates.
3. Measure token cost, discoverability, and wrong-tool selection rates.
4. Decide whether any grouping improves the surface without hiding authority.

## Experiments
- Compare current startup instructions versus grouped action-card text for token count and operator comprehension.
- Run task-mapping checks for recovery, save, and diagnostics flows under each candidate grouping.
- Record any cases where grouping obscures a necessary tool or invents a false boundary.

## Decision Criteria
- Advance only if grouping reduces clutter while preserving explicit access to current authoritative tools.
- Reject if the profile split mainly duplicates `007-workflow-guidance-map` or introduces ambiguity about what remains available.

## Exit Condition
Decide whether to keep tool bundling as an action-card formatter, explore a smaller profile prototype, or reject the pattern for Public.
