---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: CocoIndex seed telemetry passthrough [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/plan]"
description: "Schema + handler + types patch enabling per-seed CocoIndex fork telemetry to survive code_graph_context expansion as additive anchor metadata. Zero scoring/ordering change."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "cocoindex seed telemetry plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough"
    last_updated_at: "2026-04-27T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Memory save + commit"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: CocoIndex seed telemetry passthrough

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x (mcp_server/) |
| **Framework** | Node 22, vitest 4.x, zod schemas |
| **Storage** | In-memory (no DB schema change) |
| **Testing** | vitest (mocked DB + readiness) |

### Overview
Three-layer additive patch: (1) **schema** — accept snake_case + camelCase telemetry fields. (2) **types** — extend `CocoIndexSeed` and `ArtifactRef` with optional telemetry. (3) **handler** — normalize wire names in the CocoIndex seed branch, preserve fields through `resolveCocoIndexSeed`, emit them on anchors only when present. The patch is metadata-only: anchor `score`, `confidence`, `resolution`, and ordering remain byte-equal on a fixed fixture corpus.

### Pre-step
None — research.md §6 already concluded the analysis. The fork side (cocoindex_code v0.2.3+spec-kit-fork.0.2.0) was shipped by packet 004 and is frozen.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] research.md §6 published
- [x] Source-of-truth fork version frozen (0.2.3+spec-kit-fork.0.2.0)
- [x] No score/ordering/confidence change permitted (research.md §6.4)
- [x] No `mcp_server/lib/search/*` change permitted (research.md §6.3 alt #3 REJECTED)

### Definition of Done
- [x] All 6 REQs PASS
- [x] vitest 12/12 green
- [x] tsc --noEmit clean across mcp_server/
- [x] No NEW regressions in `code-graph-*` siblings (pre-existing 013 sweep failure exempted)
- [ ] `validate.sh --strict` PASS on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered additive passthrough: schema (validate) → handler (normalize) → types (carry) → resolver (preserve) → anchor envelope (emit).

### Key Components
- `mcp_server/schemas/tool-input-schemas.ts:464-482` — `codeGraphSeedSchema`. Adds optional `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals`.
- `mcp_server/code_graph/handlers/context.ts:16-31` — `ContextHandlerArgs.seeds` shape. Adds the same five optional fields.
- `mcp_server/code_graph/handlers/context.ts:166-180` — CocoIndex seed branch. Normalizes wire names (snake → camel) before delegating to seed-resolver.
- `mcp_server/code_graph/handlers/context.ts:245-256` — Anchor emission. Conditionally adds `rawScore`, `pathClass`, `rankingSignals` to the JSON envelope.
- `mcp_server/code_graph/lib/seed-resolver.ts:20-64` — `CocoIndexSeed` + `ArtifactRef` interfaces. Optional telemetry fields.
- `mcp_server/code_graph/lib/seed-resolver.ts:96-122` — `resolveCocoIndexSeed`. Spreads telemetry through to the resolved ArtifactRef when present.

### Data Flow
```
Wire (CocoIndex MCP fork, snake_case)
  -> codeGraphSeedSchema (zod accepts both shapes)
  -> ContextHandlerArgs.seeds (typed shape)
  -> CocoIndex seed branch (normalize raw_score → rawScore, path_class → pathClass)
  -> CocoIndexSeed (typed payload)
  -> resolveCocoIndexSeed (preserve telemetry on resolved ArtifactRef)
  -> ArtifactRef (carries telemetry alongside score/snippet/range)
  -> anchors.map() in handler (conditionally emit telemetry on the JSON envelope)
  -> Caller (sees rawScore/pathClass/rankingSignals when present, omitted otherwise)
```

### Invariants (must hold)
- `anchor.score === seed.score`. Telemetry NEVER replaces the bounded post-rerank score.
- `anchor.confidence` is set by `seed-resolver.ts` based on resolution chain — telemetry does not alter it.
- `anchor.resolution` follows the existing exact / near_exact / enclosing / file_anchor chain — telemetry does not alter it.
- Anchor ordering is determined by `resolveSeeds()` compareRefs — telemetry is not in the sort key.
- `mcp_server/lib/search/hybrid-search.ts` does not reference `path_class`, `pathClass`, `raw_score`, or `rankingSignals` as ranking inputs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema + types (additive)
- [x] Extend `codeGraphSeedSchema` with 5 optional fields (snake + camel pairs + rankingSignals)
- [x] Extend `ContextHandlerArgs.seeds` Array shape with same 5 optional fields
- [x] Extend `CocoIndexSeed` interface with `rawScore`, `pathClass`, `rankingSignals`
- [x] Extend `ArtifactRef` interface with same 3 optional fields

### Phase 2: Handler logic (additive)
- [x] Normalize wire names in CocoIndex seed branch — prefer camelCase if both present
- [x] Update `resolveCocoIndexSeed` to spread telemetry onto the resolved ArtifactRef
- [x] Conditionally emit telemetry on the anchor JSON envelope — omit if absent

### Phase 3: Tests + verification
- [x] Author `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` covering A-F
- [x] Run vitest (12/12 green)
- [x] Run sibling regression `tests/code-graph-*.vitest.ts` (no NEW failures)
- [x] tsc --noEmit clean
- [ ] `validate.sh --strict` PASS
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | snake_case + camelCase + mixed acceptance | vitest + zod |
| Handler | anchor emission paths (telemetry present vs absent) | vitest + mocked DB |
| Invariant | byte-equal anchor core fields pre vs post patch | vitest fixture comparison |
| Static | hybrid-search / search-utils not referencing fork tokens | vitest grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fork shipping telemetry | External (frozen via 004) | Green | None — already in production |
| Vitest harness | Internal | Green | Required for test acceptance |
| zod v3 | External | Green | All schemas already use it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Anchor consumers regress because they don't recognize the new optional fields, OR the byte-equality fixture test fails on a sibling change.
- **Procedure**: Revert the 4 modified files (`context.ts`, `seed-resolver.ts`, `tool-input-schemas.ts`, the new vitest). The change is purely additive — no migration, no data backfill, no consumer breaking change. Reverting restores the prior behavior exactly. Anchor envelope shape is contract-stable for callers that don't consume the new fields.
<!-- /ANCHOR:rollback -->
