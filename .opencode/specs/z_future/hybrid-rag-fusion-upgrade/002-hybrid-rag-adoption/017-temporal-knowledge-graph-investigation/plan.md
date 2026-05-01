---
title: "...-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/017-temporal-knowledge-graph-investigation/plan]"
description: "1. Define the minimal temporal-fact use cases that Public actually lacks today."
trigger_phrases:
  - "spec"
  - "kit"
  - "future"
  - "hybrid"
  - "rag"
  - "plan"
  - "017"
  - "temporal"
importance_tier: "important"
contextType: "planning"
---
# Plan: 017-temporal-knowledge-graph-investigation

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Investigation Order
1. Define the minimal temporal-fact use cases that Public actually lacks today.
2. Draft a schema and authority model that keeps facts separate from ordinary memory artifacts.
3. Define invalidation, correction, and query-surface rules.
4. Decide whether the idea deserves a dedicated NEW FEATURE packet.

## Experiments
- Model a metadata-only sidecar schema with required evidence links and invalidation states.
- Compare timeline-query needs against existing memory and graph surfaces to confirm that a sidecar adds unique value.
- Define governance review steps for fact insertion, correction, and retirement.

## Decision Criteria
- Advance only if the sidecar solves a genuinely missing temporal use case and can stay narrow, evidence-backed, and revocable.
- Reject if the idea expands into a second truth store or duplicates existing retrieval surfaces.

## Exit Condition
Decide whether to open a dedicated temporal-fact design packet, keep the idea deferred, or reject it for Public.
