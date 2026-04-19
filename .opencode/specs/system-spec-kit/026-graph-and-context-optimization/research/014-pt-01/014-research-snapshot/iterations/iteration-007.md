<!-- SNAPSHOT: copied from 014-save-flow-backend-relevance-review/research/iterations/iteration-007.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 7
focus: "Semantic indexing dependency"
dimension: "indexing"
timestamp: "2026-04-15T08:36:00Z"
tool_call_count: 6
---

# Iteration 007

## Findings

- `NEUTRAL` Immediate save-time indexing now depends on Step 11.5 reindexing touched canonical spec docs, not on any retired memory-artifact path. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1364] [SOURCE: .opencode/command/memory/save.md:123]
- `NEUTRAL` Index freshness is still valuable, but it is separable from canonical-doc mutation because the actual merge/promotion path completes before this targeted index scan runs. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1247] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1380]

## Ruled-out directions explored this iteration

- "Save-side indexing is what makes canonical writes succeed" is ruled out; canonical docs are already mutated before the reindex pass starts. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1247] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382]

## newInfoRatio

- `0.15` — This pass clarified that indexing is a freshness/service concern, not a write-core dependency.
