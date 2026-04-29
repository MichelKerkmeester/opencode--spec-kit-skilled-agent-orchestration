---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: CocoIndex seed telemetry passthrough [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/spec]"
description: "Per-seed CocoIndex fork telemetry passthrough (rawScore, pathClass, rankingSignals) on code_graph_context anchors. Pure additive metadata for audit and explanation; zero scoring, ordering, or confidence change. Closes Q-OPP from research.md §6 and Novel Finding #5 from 010 stress test."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "015-cocoindex-seed-telemetry-passthrough"
  - "cocoindex seed telemetry passthrough"
  - "cocoindex fork telemetry leverage"
  - "code_graph_context rawScore pathClass rankingSignals"
  - "Q-OPP cocoindex seed fidelity"
  - "novel finding 5 cocoindex telemetry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough"
    last_updated_at: "2026-04-27T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented schema + handler patch + tests; all 12 new tests + 79 sibling schema tests green"
    next_safe_action: "Memory save + commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../../../../skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts"
      - "../../../../skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts"
      - "../../../../skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - "../../../../skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Should rawScore replace anchor.score? Answer: NO — passthrough only, audit metadata"
      - "Should we add a second path_class rerank in lib/search? Answer: NO — research.md §6.3 alt #3 REJECTED"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: CocoIndex seed telemetry passthrough

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 014-graph-status-readiness-snapshot; SUCCESSOR: 016-degraded-readiness-envelope-parity -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (opportunity) |
| **Status** | In Progress |
| **Created** | 2026-04-27 |
| **Sources** | research.md §6 (Q-OPP), 010 findings.md Novel Finding #5, 004-cocoindex-overfetch-dedup (fork extension) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CocoIndex fork (cocoindex_code v0.2.3+spec-kit-fork.0.2.0) emits 5 new telemetry fields per query result — `raw_score`, `path_class`, `rankingSignals`, `dedupedAliases`, `uniqueResultCount` — but `code_graph_context` drops all of them when a CocoIndex result is supplied as a seed. Anchors returned to the model lose provenance information that would help the model explain why the fork ranked one chunk over another. v1.0.2 stress test confirmed `dedupedAliases:26` lives on the fork side and never reaches the consumer.

### Purpose
Make the fork's per-seed telemetry survive code_graph_context expansion as additive audit/explanation metadata on returned anchors — without changing anchor scoring, confidence, resolution, or ordering. This is a seed-fidelity passthrough fix, not a duplicated rerank (research.md §6.2 reframing).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `ContextHandlerArgs.seeds` shape (`mcp_server/code_graph/handlers/context.ts:16-31`) with optional `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals`. Both wire (snake_case) and internal (camelCase) variants validate.
- Extend `CocoIndexSeed` and `ArtifactRef` types (`mcp_server/code_graph/lib/seed-resolver.ts:20-64`). Preserve telemetry in `resolveCocoIndexSeed`.
- Extend `codeGraphSeedSchema` (`mcp_server/schemas/tool-input-schemas.ts:464-482`) with optional snake_case + camelCase fields.
- Normalize wire names (`raw_score` → `rawScore`, `path_class` → `pathClass`) in the CocoIndex seed branch (`context.ts:166-180`).
- Emit `rawScore`, `pathClass`, `rankingSignals` on returned anchors (`context.ts:245-256`) ONLY when the seed carried them.
- New vitest covering schema acceptance (snake_case + camelCase), anchor emission, backward-compat (no telemetry → no extra fields), fixture-equality on score/confidence/resolution/ordering, and hybrid-search rank-order invariance.

### Out of Scope
- Response-level counters (`dedupedAliases`, `uniqueResultCount`) — research.md §6.3 alt #2 deferred.
- A second `path_class` rerank in `mcp_server/lib/search/*` — research.md §6.3 alt #3 REJECTED (fork already applies the signal at its boundary).
- Changes to `mcp_server/lib/search/hybrid-search.ts` rank logic.
- Changes to the cocoindex_code fork itself (frozen at `0.2.3+spec-kit-fork.0.2.0`).
- Changes to Stage 3 reranking.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modify | Extend `ContextHandlerArgs.seeds` shape; normalize wire names; emit telemetry on anchors |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts` | Modify | Extend `CocoIndexSeed` + `ArtifactRef` types; preserve fields in `resolveCocoIndexSeed` |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Extend `codeGraphSeedSchema` with optional snake + camel telemetry fields |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | Create | New vitest covering A-F success criteria |
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 — Telemetry Passthrough (additive metadata only)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `code_graph_context` MUST accept `raw_score`, `path_class`, `rankingSignals` (snake_case wire) on seeds without rejecting. | Schema validation passes; vitest A green. |
| REQ-002 | `code_graph_context` MUST accept `rawScore`, `pathClass`, `rankingSignals` (camelCase internal) on seeds without rejecting. | Schema validation passes; vitest B green. |
| REQ-003 | Returned anchors MUST preserve `rawScore`, `pathClass`, `rankingSignals` next to existing `score`, `snippet`, `range` when the seed had them. | vitest C green. |
| REQ-004 | Seeds without telemetry MUST NOT cause extra fields to be emitted on anchors (backward compat). | vitest D green. |

### P0 — Invariants (NON-NEGOTIABLE)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Anchor `score`, `confidence`, `resolution`, `ordering`, and `source` MUST be byte-equal pre-patch vs post-patch on a fixed fixture corpus. | vitest E green; the post-patch run with telemetry overlay yields anchors that, after stripping telemetry, equal the pre-patch baseline exactly. |
| REQ-006 | `mcp_server/lib/search/hybrid-search.ts` MUST NOT reference fork telemetry tokens (`path_class`, `pathClass`, `raw_score`, `rankingSignals`) as ranking inputs. No second rerank introduced. | vitest F green; static grep over hybrid-search.ts and search-utils.ts. |

### Acceptance Scenarios

**Given** a `code_graph_context` call with seeds carrying `raw_score`, `path_class`, and `rankingSignals` (snake_case wire format, as the cocoindex_code fork emits), **when** the handler resolves and emits anchors, **then** the response includes `rawScore`, `pathClass`, and `rankingSignals` on each affected anchor next to existing `score`, `snippet`, and `range` fields, with no change to `score`, `confidence`, `resolution`, or anchor ordering.

**Given** a `code_graph_context` call with seeds that DO NOT carry the new telemetry fields, **when** the handler resolves and emits anchors, **then** the response anchors are byte-equal to the pre-patch baseline — `rawScore`, `pathClass`, and `rankingSignals` are absent from the JSON envelope (not null, not undefined, not present), preserving full backward compatibility for callers that never supplied telemetry.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 REQs covered by automated vitest. (vitest file: `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`)
- **SC-002**: 12/12 vitest cases green; full sibling regression `code-graph-*` suite shows no NEW failures attributable to this packet (pre-existing 013 sweep failure is acceptable noise).
- **SC-003**: `tsc --noEmit` clean across `mcp_server/`.
- **SC-004**: `validate.sh --strict` PASS on this packet.
- **SC-005**: Anchor envelope is byte-equal on the fixture corpus before vs after this patch (telemetry-stripped).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Accidental second rerank in lib/search | High (would double-apply path_class signal) | Static grep test (vitest F); explicit scope-out in spec; reviewer checklist |
| Risk | Schema overload from accepting both snake + camel | Low (just two extra optional keys per variant) | getSchema is `passthrough` permissive when `SPECKIT_STRICT_SCHEMAS=false`; with strict mode the new fields are explicitly listed |
| Risk | Telemetry leaks into anchor.score path | High | Test E asserts anchor.score == seed.score (NOT seed.raw_score); test C asserts both fields coexist |
| Dependency | Fork (cocoindex_code 0.2.3+spec-kit-fork.0.2.0) emits the telemetry | Frozen | Already shipped via packet 004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the model surface `rankingSignals` in the textBrief / combinedSummary output? Deferred to a follow-on packet — current scope is anchor envelope only.
- Should we add a metric counter for "seeds-with-telemetry vs seeds-without"? Deferred — observability is a separate concern from the data contract.
<!-- /ANCHOR:questions -->
