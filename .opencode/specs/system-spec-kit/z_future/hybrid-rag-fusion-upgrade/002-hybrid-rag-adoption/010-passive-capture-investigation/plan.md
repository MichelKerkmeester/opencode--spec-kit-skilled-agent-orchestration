---
title: "Plan [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/010-passive-capture-investigation/plan]"
description: "1. Baseline the current explicit save path from session summary to indexed memory."
trigger_phrases:
  - "plan"
  - "010"
  - "passive"
importance_tier: "important"
contextType: "planning"
---
# Plan: 010-passive-capture-investigation

## Affected Files
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Investigation Order
1. Baseline the current explicit save path from session summary to indexed memory.
2. Define two candidate wrappers: explicit close-session JSON emission and shadow passive suggestion.
3. Measure duplicate pressure, provenance completeness, and reviewability for both candidates.
4. Decide whether either candidate can stay helper-only and authority-safe.

## Experiments
- Run a shadow capture study that converts sample session text into the JSON schema expected by `generate-context.js`, without committing writes.
- Compare explicit close-session versus shadow suggestion on duplicate rate, missing provenance fields, and operator edits required before save.
- Measure whether compaction-time invocation adds meaningful continuity benefit beyond `004-compaction-checkpointing`.

## Decision Criteria
- Advance only if the wrapper preserves current save authority, adds no hidden writes, and produces lower-friction but still reviewable inputs.
- Reject or demote if provenance, retention, or dedupe guarantees become weaker than today's explicit save flow.

## Exit Condition
Decide one of: explicit helper over `generate-context.js`, shadow-only prototype behind a flag, or reject passive capture for current Public workflows.
