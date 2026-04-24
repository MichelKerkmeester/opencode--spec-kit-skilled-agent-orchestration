---
title: "Plan: 008-r [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/008-rollout-evidence-gates/plan]"
description: "1. Define gate categories and the surfaces they apply to."
trigger_phrases:
  - "plan"
  - "008"
  - "rollout"
importance_tier: "important"
contextType: "planning"
---
# Plan: 008-rollout-evidence-gates

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

## Implementation Order
1. Define gate categories and the surfaces they apply to.
2. Attach each gate to a verification command, fixture, or CI lane.
3. Record rollback triggers and ownership for failed gates.

## Integration Points
- Search behavior and weak-result handling in `memory-search.ts`.
- Startup bootstrap hints and readiness flow in `session-bootstrap.ts`.
- Save authority and validation behavior in `generate-context.js`.
- Compaction continuity path in `spec-kit-compact-code-graph.js`.
- Packet and doc validity through `validate.sh`.

## Rollback Plan
If a candidate surface cannot be tied to measurable gates and a repeatable command, keep it behind planning-only status and do not promote it into a public rollout.
