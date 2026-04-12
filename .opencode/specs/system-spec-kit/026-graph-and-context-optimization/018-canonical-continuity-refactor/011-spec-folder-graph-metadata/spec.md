---
title: "018 / 011 — Per-spec-folder graph metadata"
description: "Research packet for restoring packet-level graph inputs after Phase 018 removed legacy memory-file primacy."
trigger_phrases: ["018 011 graph metadata", "per spec folder graph metadata", "graph metadata file research"]
importance_tier: "critical"
contextType: "research"
status: "complete"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the 10-iteration design research for a per-spec-folder graph metadata contract"
    next_safe_action: "Use this packet to implement schema, save-pipeline, and indexing follow-ons"
    key_files: ["spec.md", "plan.md", "research.md", "decision-record.md"]
---
# Feature Specification: 018 / 011 — Per-spec-folder graph metadata
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## Executive Summary

Phase 018 moved canonical continuity into git-tracked spec docs plus `_memory.continuity`, but that left the causal graph without a strong per-packet metadata source. The current graph still understands memory rows, trigger phrases, importance tiers, and causal links, yet the folder-level signals that legacy memory files carried are now fragmented or absent.

This packet recommends a dedicated `graph-metadata.json` file in each spec-folder root. The file stays separate from `description.json` and `_memory.continuity`, is refreshed by `generate-context.js` during save-time canonical updates, and is indexed into `memory_index` as a `graph_metadata` document so existing search and causal-edge machinery can keep working with minimal structural change.

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Level | 3 |
| Priority | P0 |
| Status | Complete |
| Created | 2026-04-12 |
| Updated | 2026-04-12 |
| Parent Packet | `018-canonical-continuity-refactor` |
| Research Output | `research.md` with 10 focused design iterations |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

The current causal graph and search ranking still rely on signals that originally came from standalone memory saves:

- `memory_index` stores `trigger_phrases`, `importance_weight`, `importance_tier`, `context_type`, `document_type`, `created_at`, and `last_accessed`
- `causal_links-processor.ts` turns parsed `causalLinks` blocks into `causal_edges`
- `reconsolidation.ts` creates `supersedes` edges and carries trigger and tier data into new rows
- `stage1-candidate-gen.ts` and the trigger matcher rank/search against the indexed memory row metadata

Phase 018 removed legacy memory-file primacy, and the repo now shows the resulting coverage gap:

- `018-canonical-continuity-refactor/` currently has no `memory/` directories
- the same packet has no `description.json`
- across `.opencode/specs`, `358` index-like spec folders exist after excluding `scratch/`, `memory/`, `iterations/`, and `z_archive/`
- `138` of those index-like folders are still missing `description.json`
- only `127` markdown files in `.opencode/specs` currently advertise `_memory.continuity`

That means `_memory.continuity` is too thin and too uneven to restore folder-level graph state by itself, while `description.json` is intentionally scoped to folder identity and save-history tracking.

### Purpose

Define a durable, machine-readable, per-spec-folder metadata contract that restores graph-friendly packet signals without reintroducing legacy memory-file narrative sprawl.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Audit the graph and save-time metadata sources that still exist after Phase 018
- Define the minimum viable schema for a per-folder graph metadata file
- Compare `graph-metadata.json`, `graph-metadata.yaml`, `_memory.continuity`, and `description.json`
- Specify how `generate-context.js`, indexing, search ranking, and causal-edge extraction should integrate with the new file
- Estimate the migration/backfill strategy for existing spec folders

### Out of Scope

- Implementing the runtime changes described in this packet
- Reintroducing legacy `memory/*.md` files as the canonical metadata carrier
- Replacing `_memory.continuity` as the doc-local resume surface
- Overloading `description.json` with high-churn graph state

### Target Files For Future Implementation

| Surface | Expected Future Change |
|---------|------------------------|
| `scripts/memory/generate-context.ts` + workflow hot path | Write or refresh `graph-metadata.json` on canonical saves |
| `handlers/memory-index-discovery.ts` | Discover graph metadata files |
| `lib/parsing/` and `handlers/causal-links-processor.ts` | Parse graph metadata relationships into `causal_edges` |
| `stage1-candidate-gen.ts` and ranking helpers | Use `graph_metadata` rows for packet/dependency queries |
| `validate.sh` + schema validators | Enforce file presence and JSON-schema correctness |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The repo must regain one packet-level metadata source for graph queries | The design introduces one root-level file per spec folder instead of spreading graph state across arbitrary docs |
| REQ-002 | The new file must be machine-owned and index-friendly | The recommended format is deterministic JSON with a stable schema and save-time merge behavior |
| REQ-003 | `_memory.continuity` must remain thin | Resume hints stay on canonical docs; packet graph state moves to the new file |
| REQ-004 | `description.json` must remain discovery/tracking-only | Folder identity, keywords, and memory-sequence history are not overloaded with graph relationships and entity state |
| REQ-005 | Existing graph/search machinery should be reused where practical | The recommendation indexes graph metadata into `memory_index` and reuses `causal_edges` instead of introducing a brand-new graph store |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The schema must support cross-packet relationships, status, files, entities, and timestamps | `research.md` defines field types, provenance, and graph-query benefits for each field |
| REQ-007 | Save-time updates must distinguish auto-derived vs manual state | The plan preserves manual relationship edits while fully refreshing derived fields |
| REQ-008 | Migration cost must be bounded and measurable | The packet includes counts, backfill strategy, effort estimate, and validation plan |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- SC-001: The packet clearly explains why packet-level graph metadata is needed after Phase 018.
- SC-002: The packet recommends one concrete file contract and rejects the weaker alternatives with evidence.
- SC-003: The packet defines a schema that covers relationships, retrieval signals, file ownership, entities, status, and timestamps.
- SC-004: The packet provides a realistic implementation and migration plan for existing folders.
- SC-005: The packet keeps `description.json` and `_memory.continuity` focused on their current responsibilities.

### Acceptance Scenarios

1. **Given** a canonical save lands in a packet with no legacy memory files, **when** graph metadata refresh runs, **then** the packet still emits search and causal-edge signals through `graph-metadata.json`.
2. **Given** a maintainer asks "what packet supersedes this one?", **when** the indexer reads the new file, **then** the answer comes from explicit packet-level edges rather than fragile prose parsing.
3. **Given** `/spec_kit:resume` needs a quick state summary, **when** it reads packet docs, **then** `_memory.continuity` stays compact while the heavier relationship data lives elsewhere.
4. **Given** an older folder lacks `description.json`, **when** the migration runs, **then** graph metadata can still be generated from packet docs and path structure without blocking on description coverage.
5. **Given** a maintainer adds a manual `depends_on` edge, **when** `/memory:save` refreshes derived metadata, **then** the manual relationship remains intact.
6. **Given** the indexer encounters a schema-invalid metadata file, **when** validation runs, **then** the packet receives an actionable warning or error without corrupting `memory_index`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | `memory_index` remains the hub for ranking and retrieval metadata | Index each `graph-metadata.json` as `document_type='graph_metadata'` rather than inventing a second search substrate |
| Dependency | `generate-context.js` currently updates folder metadata only when a legacy context file is written | Add graph-metadata refresh to the canonical save path, not only the legacy `ctxFileWritten` branch |
| Risk | Manual relationship edits get overwritten by automated save refresh | Split the schema into manual and derived sections or equivalent merge-safe buckets |
| Risk | Extending `description.json` couples hot graph updates to a stability-focused discovery file | Keep the contracts separate |
| Risk | Entity extraction becomes noisy or expensive | Start with deterministic extraction from doc links/headings and add code-graph enrichment only when available |
<!-- /ANCHOR:risks -->

## 7. Non-Functional Requirements

### Maintainability

- NFR-M01: The metadata file must be deterministic JSON with one schema version and stable field names.
- NFR-M02: Manual relationship edits must survive automated refreshes.
- NFR-M03: The file should be comprehensible in git diffs without requiring custom tooling.

### Reliability

- NFR-R01: Save-time refresh must be atomic with the canonical save path or fail open without corrupting packet docs.
- NFR-R02: Indexing must degrade safely when the file is missing or schema-invalid.
- NFR-R03: The design must work even when `description.json` coverage is incomplete.

### Performance

- NFR-P01: Packet-level graph metadata indexing should remain O(number of spec folders), not O(number of anchors).
- NFR-P02: Search ranking and resume must not require full-doc rescans to answer packet-level dependency questions.

### Documentation Quality

- NFR-D01: The schema must distinguish auto-generated and manual fields explicitly.
- NFR-D02: The recommendation must stay consistent with Phase 018's "canonical docs + thin continuity" architecture.

## 8. Edge Cases

- A packet has no `implementation-summary.md` yet but still needs graph metadata.
- A packet is nested several levels deep and needs both `parent_id` and `children_ids`.
- A save updates doc content but does not produce a legacy context markdown file.
- A packet manually declares `depends_on` or `supersedes` edges that contradict inferred relationships.
- A packet references code entities when the code graph is stale or unavailable.

## 9. Complexity Assessment

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Touches save workflow, indexing, ranking, validation, and packet metadata contracts |
| Risk | 21/25 | A wrong contract would either recreate legacy sprawl or leave graph state underspecified |
| Research | 18/20 | Required runtime audit, format comparison, migration counting, and schema design |
| Multi-Agent | 4/15 | This packet is research-heavy but implementation can stay packet-local |
| Coordination | 11/15 | Must stay aligned with Phase 018 continuity architecture and current search stack |
| Total | 74/100 | Level 3 |

## 10. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Graph metadata duplicates or fights `_memory.continuity` | High | Medium | Keep packet graph state in a separate file and limit `_memory.continuity` to resume hints |
| R-002 | `description.json` becomes a high-churn graph bucket | High | Medium | Preserve separation of concerns and avoid extending it beyond discovery/tracking |
| R-003 | Save-time refresh only runs on legacy code paths | High | Medium | Attach graph refresh to canonical doc save completion, not `ctxFileWritten` |
| R-004 | Migration script generates poor relationships | Medium | Medium | Backfill derived fields automatically and require manual review for cross-packet edges |
| R-005 | Indexer treats graph metadata like ordinary packet prose | Medium | Medium | Use `document_type='graph_metadata'` and ranking boosts for packet/dependency queries |

## 11. User Stories

### US-001: Packet dependency discovery

As a maintainer, I want each spec folder to expose machine-readable dependency and supersession edges, so graph queries can answer packet-relationship questions without scraping prose.

### US-002: Resume remains thin

As an operator, I want `_memory.continuity` to stay compact and fast, so packet resume does not regress into a heavyweight metadata dump.

### US-003: Backfill is realistic

As an implementation owner, I want the migration plan to work across the existing spec inventory, so we can adopt the contract incrementally without waiting for perfect `description.json` coverage.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `status` remain fully derived, or should the final contract allow a manual override for blocked packets whose docs lag behind reality?
- Should `entities[]` launch with doc-derived extraction only, or should the first implementation phase wire in compact code-graph enrichment immediately?
- What repo coverage threshold should promote graph-metadata presence validation from warning to hard error?
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- Parent packet specification: [../spec.md](../spec.md)
- Parent packet plan: [../plan.md](../plan.md)
- Parent packet research: [../research/research.md](../research/research.md)
- This packet plan: [./plan.md](./plan.md)
- This packet research: [./research.md](./research.md)
- This packet decision record: [./decision-record.md](./decision-record.md)

### AI Execution Protocol

### Pre-Task Checklist

- Re-read the current graph/runtime sources before changing the packet contract.
- Preserve the distinction between packet discovery metadata and packet graph metadata.
- Keep the recommendation compatible with the existing `memory_index` plus `causal_edges` design.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-GRAPH-01811 | Prefer the smallest structural change that restores packet-level graph inputs | Keeps implementation cost bounded |
| AI-SAVE-01811 | Tie metadata refresh to canonical save completion, not to legacy memory-file writes | Avoids repeating the Phase 018 regression |
| AI-SCHEMA-01811 | Keep manual and derived data merge-safe | Prevents operator edits from being silently lost |
| AI-TRUTH-01811 | Do not present `_memory.continuity` or `description.json` as sufficient when the audit shows real coverage gaps | Keeps the packet honest |
