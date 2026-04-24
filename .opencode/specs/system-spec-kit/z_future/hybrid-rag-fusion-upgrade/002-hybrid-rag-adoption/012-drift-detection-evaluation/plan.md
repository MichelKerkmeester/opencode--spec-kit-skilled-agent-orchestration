---
title: "Plan [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/012-drift-detection-evaluation/plan]"
description: "1. Baseline the already-approved advisory trio and their current issue-envelope needs."
trigger_phrases:
  - "plan"
  - "012"
  - "drift"
importance_tier: "important"
contextType: "planning"
---
# Plan: 012-drift-detection-evaluation

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts`
- `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`

## Investigation Order
1. Baseline the already-approved advisory trio and their current issue-envelope needs.
2. Map each remaining Mex checker family to actual Public artifact types.
3. Define fixture packs, false-positive guards, and promotion criteria for any candidate expansion.
4. Decide which checker families are worth future packets.

## Experiments
- Build a checker applicability matrix across spec packet docs, saved memory docs, workflow references, and repo-root markdown.
- Define false-positive fixtures for placeholders, template snippets, generated docs, and intentionally stale scratch areas.
- Measure whether advisory checker output can stay readable in `memory_health` without a score-first summary.

## Decision Criteria
- Advance only if a checker family adds clear integrity value without leaking into retrieval or producing noisy false positives.
- Reject or defer if the checker lacks a clean issue schema, fixture story, or advisory-only contract.

## Exit Condition
Decide which additional checker families should advance to follow-on design, remain deferred, or be rejected for Public surfaces.
