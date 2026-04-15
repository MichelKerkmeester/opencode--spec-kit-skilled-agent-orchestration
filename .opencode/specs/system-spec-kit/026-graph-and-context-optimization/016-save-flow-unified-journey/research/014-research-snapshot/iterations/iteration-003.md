<!-- SNAPSHOT: copied from 014-save-flow-backend-relevance-review/research/iterations/iteration-003.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 3
focus: "Canonical atomic prepare path"
dimension: "write-core"
timestamp: "2026-04-15T08:12:00Z"
tool_call_count: 9
---

# Iteration 003

## Findings

- `NEUTRAL` `buildCanonicalAtomicPreparedSave()` is load-bearing: it parses the pending payload, classifies route category, resolves target doc/anchor/merge mode, applies anchor merge, and always re-upserts thin continuity before any indexed save succeeds. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1260] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1410] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1450]
- `NEUTRAL` The canonical prepared-save validator is doing real correctness work because it rejects merges that fail frontmatter, merge-legality, sufficiency, cross-anchor contamination, or post-save fingerprint checks. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1517] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1530]

## Ruled-out directions explored this iteration

- "The routed save core can be replaced by simple append logic without losing safety" is ruled out by the explicit merge-plan and post-save fingerprint contract. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1535]

## newInfoRatio

- `0.24` — This was the first pass that isolated the genuine canonical write core from peripheral save-time features.
