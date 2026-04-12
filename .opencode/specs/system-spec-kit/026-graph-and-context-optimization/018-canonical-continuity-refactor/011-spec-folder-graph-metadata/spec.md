---
title: "018 / 011 — Spec-folder graph metadata"
description: "Level 3 feature specification for a dedicated graph-metadata.json contract per spec-folder root."
trigger_phrases: ["018 011 graph metadata", "spec folder graph metadata", "graph-metadata.json contract"]
importance_tier: "critical"
contextType: "planning"
status: "planned"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rewrote the packet as a Level 3 implementation specification"
    next_safe_action: "Implement the five-phase plan against the verified save, index, graph, and workflow surfaces"
    key_files: ["research.md", "spec.md", "plan.md", "tasks.md", "decision-record.md"]
---
# Feature Specification: 018 / 011 — Spec-folder graph metadata
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## Executive Summary

Phase 018 moved continuity authority into canonical spec docs plus `_memory.continuity`, but the packet-level graph signals that legacy memory saves used to supply are still fragmented across runtime surfaces. The completed research in [research.md](./research.md) settled on one additive contract: a dedicated `graph-metadata.json` in each active spec-folder root, refreshed on canonical save, indexed as `document_type='graph_metadata'`, and consumed by the existing `memory_index` plus `causal_edges` pipeline instead of a new database.

This specification turns that research into an implementation-ready Level 3 packet. It locks the schema, defines the save/index/graph integrations, sets rollout and validation rules, and keeps the boundary lines explicit: `graph-metadata.json` is for packet-level graph state, `description.json` remains folder identity/tracking, and `_memory.continuity` remains the thin doc-local resume surface. Grounding: Iterations 3, 4, 5, 6, 8, 9, and 10 in [research.md](./research.md).

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Level | 3 |
| Packet Status | Planned |
| Priority | P0 |
| Parent Packet | `018-canonical-continuity-refactor` |
| Research Baseline | `research.md` with 10 completed iterations |
| Primary Runtime Surfaces | `scripts/memory/generate-context.ts`, `scripts/core/workflow.ts`, `mcp_server/handlers/memory-index-discovery.ts`, `mcp_server/handlers/causal-links-processor.ts`, `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `scripts/spec/validate.sh` |
| Core Recommendation | Add `graph-metadata.json` per spec-folder root, preserve manual relationship fields, regenerate derived fields on canonical save, and index as `graph_metadata` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

The current runtime still has the graph and search plumbing needed for packet reasoning, but the packet-level producer is missing:

- `scripts/core/workflow.ts` still updates `description.json` only when `ctxFileWritten` is true, which means canonical save completion is not the general packet metadata refresh hook today.
- `scripts/core/memory-metadata.ts` still derives auto causal links only from a legacy `memory/` directory, which no longer exists in the Phase 018 packet lineage.
- `mcp_server/handlers/memory-index-discovery.ts` discovers spec markdown documents and constitutional docs, but not a dedicated packet metadata file.
- `mcp_server/handlers/causal-links-processor.ts` resolves link-like references into `causal_edges`, but only from currently indexed row content.
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` already understands `document_type`, tiers, and query intent, but it has no packet-level `graph_metadata` row to privilege for dependency-oriented queries.

Grounding: Iterations 1, 5, 6, 8, and 9 in [research.md](./research.md).

### Purpose

Restore one durable, machine-readable packet-level metadata source that:

- survives the canonical-doc continuity refactor,
- preserves operator-authored cross-packet relationships,
- reuses the current indexing and causal-edge storage model, and
- gives `/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:resume`, `/memory:search`, and `validate.sh` a shared packet graph contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- A dedicated `graph-metadata.json` file in each active spec-folder root.
- A versioned JSON schema with explicit `manual` and `derived` sections.
- Canonical save-path refresh after successful save completion.
- Discovery, indexing, graph-edge upsert, packet-query ranking, and rollout validation support.
- Backfill and dry-run reporting for existing spec folders.
- Workflow adoption for packet creation, completion, resume, and packet-oriented search.

### Out of Scope

- Reintroducing legacy `memory/*.md` as a graph carrier.
- Replacing `description.json` as the per-folder discovery/tracking surface.
- Replacing `_memory.continuity` as the fast, doc-local resume anchor.
- Introducing a new graph database or a second packet metadata index.
- Rewriting the overall Phase 018 continuity architecture.

### Non-Goals

- Not replacing `description.json` as the per-folder identity, keyword, and memory-sequence surface.
- Not replacing `_memory.continuity` as the canonical doc-local recovery anchor.
- Not adding a new graph database, sidecar index, or packet storage layer.
- Not reviving legacy memory markdown as the preferred packet metadata carrier.
- Not requiring perfect `description.json` coverage before rollout begins.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

| ID | Priority | Requirement | Grounding |
|----|----------|-------------|-----------|
| REQ-001 | P0 | Every active spec-folder root must support a dedicated `graph-metadata.json` contract that is separate from `description.json` and canonical markdown docs. | Iterations 3, 9, 10 |
| REQ-002 | P0 | The file must implement schema version `1` with the Iteration 4 shape: top-level identity fields, `manual` relationship buckets, and `derived` ranking/runtime fields. | Iteration 4 |
| REQ-003 | P0 | Manual relationship fields must survive refreshes; automated refresh may replace only derived fields. | Iterations 4, 5, 10 |
| REQ-004 | P0 | Graph metadata refresh must run on the canonical save path after save completion even when no legacy context markdown file is written. | Iterations 5, 10 |
| REQ-005 | P0 | The refresh path must derive, at minimum, `trigger_phrases`, `key_files`, `status`, `importance_tier`, `parent_id`, `children_ids`, `causal_summary`, timestamps, and `source_docs` from canonical packet docs plus path structure. | Iterations 2, 4, 5, 8 |
| REQ-006 | P1 | Discovery and indexing must scan `graph-metadata.json` files and write one `memory_index` row per packet with `document_type='graph_metadata'`. | Iterations 6, 10 |
| REQ-007 | P1 | Manual packet relationships must upsert into `causal_edges` using the agreed mapping: `depends_on -> enabled`, `supersedes -> supersedes`, `related_to -> supports`. | Iteration 6 |
| REQ-008 | P1 | Search and resume surfaces must recognize `graph_metadata` rows as high-signal packet candidates for dependency, packet discovery, and resume-adjacent queries. | Iterations 6, 8 |
| REQ-009 | P1 | A backfill script must generate best-effort graph metadata for existing spec folders, support dry-run mode, and flag folders requiring manual relationship review. | Iteration 7 |
| REQ-010 | P1 | Workflow adoption must scaffold or consume graph metadata through the real packet surfaces behind `/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:resume`, and `/memory:search`. | Iteration 8 |
| REQ-011 | P1 | `validate.sh` must gain rollout-aware graph metadata validation, with warning-first presence enforcement and later promotion to error after backfill coverage is acceptable. | Iterations 8, 10 |
| REQ-012 | P2 | The implementation must work when `description.json` coverage is incomplete and must not make description coverage a prerequisite for graph metadata rollout. | Iterations 7, 9 |
| REQ-013 | P2 | The packet must not add or depend on a new database; `memory_index`, `causal_edges`, and existing search plumbing remain authoritative. | Iterations 6, 10 |

### Formal Schema

The schema below intentionally matches the Iteration 4 design exactly in structure and field ownership. The only formalization change is that `derived.status` is constrained to an enum for validator safety rather than remaining an unconstrained string example. That divergence is deliberate and required for `validate.sh` enforcement. Grounding: Iteration 4 plus the rollout needs in Iterations 8 and 10.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "spec-kit/graph-metadata.schema.json",
  "title": "Spec Folder Graph Metadata",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "packet_id",
    "spec_folder",
    "parent_id",
    "children_ids",
    "manual",
    "derived"
  ],
  "properties": {
    "schema_version": { "const": 1 },
    "packet_id": { "type": "string", "minLength": 1 },
    "spec_folder": { "type": "string", "minLength": 1 },
    "parent_id": {
      "oneOf": [
        { "type": "string", "minLength": 1 },
        { "type": "null" }
      ]
    },
    "children_ids": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 },
      "uniqueItems": true
    },
    "manual": {
      "type": "object",
      "additionalProperties": false,
      "required": ["depends_on", "supersedes", "related_to"],
      "properties": {
        "depends_on": {
          "type": "array",
          "items": { "$ref": "#/$defs/packetRef" },
          "default": []
        },
        "supersedes": {
          "type": "array",
          "items": { "$ref": "#/$defs/packetRef" },
          "default": []
        },
        "related_to": {
          "type": "array",
          "items": { "$ref": "#/$defs/packetRef" },
          "default": []
        }
      }
    },
    "derived": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "trigger_phrases",
        "key_topics",
        "importance_tier",
        "status",
        "key_files",
        "entities",
        "causal_summary",
        "created_at",
        "last_save_at",
        "last_accessed_at",
        "source_docs"
      ],
      "properties": {
        "trigger_phrases": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 },
          "uniqueItems": true
        },
        "key_topics": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 },
          "uniqueItems": true
        },
        "importance_tier": {
          "type": "string",
          "enum": [
            "constitutional",
            "critical",
            "important",
            "normal",
            "temporary",
            "deprecated"
          ]
        },
        "status": {
          "type": "string",
          "enum": [
            "planned",
            "in_progress",
            "blocked",
            "complete",
            "archived"
          ]
        },
        "key_files": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 },
          "uniqueItems": true
        },
        "entities": {
          "type": "array",
          "items": { "$ref": "#/$defs/entityRef" }
        },
        "causal_summary": { "type": "string", "minLength": 1 },
        "created_at": { "type": "string", "format": "date-time" },
        "last_save_at": { "type": "string", "format": "date-time" },
        "last_accessed_at": {
          "oneOf": [
            { "type": "string", "format": "date-time" },
            { "type": "null" }
          ]
        },
        "source_docs": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 },
          "uniqueItems": true
        }
      }
    }
  },
  "$defs": {
    "packetRef": {
      "type": "object",
      "additionalProperties": false,
      "required": ["packet_id", "reason", "source"],
      "properties": {
        "packet_id": { "type": "string", "minLength": 1 },
        "reason": { "type": "string", "minLength": 1 },
        "source": { "type": "string", "minLength": 1 }
      }
    },
    "entityRef": {
      "type": "object",
      "additionalProperties": false,
      "required": ["name", "kind", "path", "source"],
      "properties": {
        "name": { "type": "string", "minLength": 1 },
        "kind": { "type": "string", "minLength": 1 },
        "path": { "type": "string", "minLength": 1 },
        "source": { "type": "string", "minLength": 1 }
      }
    }
  }
}
```

### Integration Points

| Surface | Current State | Planned Change | Grounding |
|--------|---------------|----------------|-----------|
| `./../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts` | CLI entrypoint for structured canonical saves | Pass graph metadata refresh inputs into the canonical workflow and keep CLI target authority unchanged | Iterations 5, 8 |
| `./../../../../../skill/system-spec-kit/scripts/core/workflow.ts` | Updates `description.json` only when `ctxFileWritten` is true | Add graph metadata refresh after canonical save completion, independent of the legacy write gate, with atomic write plus merge | Iterations 5, 10 |
| `./../../../../../skill/system-spec-kit/scripts/core/memory-metadata.ts` | `autoPopulateCausalLinks()` still scans `memory/` | Add deterministic derivation helpers for packet graph metadata so packet-level relationships no longer depend on a legacy memory directory | Iterations 1, 5 |
| `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Discovers spec markdown docs only | Scan for `graph-metadata.json` in valid spec folders and surface it for indexing | Iteration 6 |
| `./../../../../../skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Resolves link-like references into `causal_edges` | Resolve `manual.depends_on`, `manual.supersedes`, and `manual.related_to` packet refs and upsert graph edges | Iteration 6 |
| `./../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Uses query intent, tiers, and `document_type` as ranking inputs | Add packet-oriented boosts for `graph_metadata` rows without changing the overall pipeline architecture | Iterations 6, 8 |
| `./../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Already supports `document_type` and document-type indexes | Reuse the existing `document_type` column/indexes and add only the minimum schema migration needed for graph metadata rollout | Iteration 6 |
| `./../../../../../skill/system-spec-kit/scripts/spec/validate.sh` | Validates packet docs, not graph metadata presence/schema | Add `GRAPH_METADATA_PRESENT` and schema checks, warning-first during rollout | Iterations 8, 10 |
| `./../../../../../skill/system-spec-kit/scripts/spec/create.sh` | Scaffolds packet docs and `description.json` | Scaffold an empty or minimally valid `graph-metadata.json` for new spec folders | Iteration 8 |
| `./../../../../../skill/system-spec-kit/mcp_server/handlers/session-resume.ts` and `./../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Resume/search rely on canonical docs and indexed rows | Optionally consume graph metadata for packet dependencies, key files, and packet-oriented ranking while keeping canonical docs first | Iteration 8 |

### Requirement Traceability

| Requirement | Tasks | Checklist |
|-------------|-------|-----------|
| REQ-001 | T001, T010, T013 | CHK-001, CHK-011, CHK-050 |
| REQ-002 | T001, T002, T003 | CHK-001, CHK-020 |
| REQ-003 | T002, T005, T006 | CHK-010, CHK-020 |
| REQ-004 | T004, T005, T006 | CHK-003, CHK-021, CHK-030 |
| REQ-005 | T004, T005, T010, T011 | CHK-003, CHK-010, CHK-021, CHK-030 |
| REQ-006 | T007, T009 | CHK-012, CHK-022, CHK-041 |
| REQ-007 | T008, T009 | CHK-012, CHK-022, CHK-031 |
| REQ-008 | T009, T014 | CHK-022, CHK-040 |
| REQ-009 | T010, T011, T012 | CHK-023, CHK-024, CHK-032 |
| REQ-010 | T013, T014, T015 | CHK-003, CHK-040, CHK-041, CHK-042, CHK-050 |
| REQ-011 | T012, T014, T015 | CHK-024, CHK-041, CHK-042 |
| REQ-012 | T010, T011 | CHK-023, CHK-032 |
| REQ-013 | T007, T008, T009 | CHK-011, CHK-012, CHK-022, CHK-031, CHK-050 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- SC-001: A canonical save in a packet with no legacy `memory/` directory still refreshes `graph-metadata.json`.
- SC-002: Manual packet relationships survive refresh; only derived fields are recomputed.
- SC-003: The indexer can discover and ingest graph metadata rows as `document_type='graph_metadata'`.
- SC-004: Packet dependency edges appear in `causal_edges` without a new graph database.
- SC-005: Packet-oriented search and resume flows can prefer graph metadata for dependency and ownership queries while preserving canonical-doc recovery order.
- SC-006: Backfill can generate best-effort files for existing spec folders, expose dry-run output, and flag ambiguous folders for manual review.
- SC-007: Validation begins in warning-first mode and can later tighten to error once rollout coverage is proven.

### Acceptance Scenarios

1. Given a canonical save that does not emit a legacy context markdown file, when the save completes, then `graph-metadata.json` still refreshes and persists derived packet state. Reqs: `REQ-003`, `REQ-004`, `REQ-005`.
2. Given a packet declares `manual.depends_on`, when indexing runs, then the dependency becomes an `enabled` edge in `causal_edges`. Reqs: `REQ-006`, `REQ-007`.
3. Given `/memory:search` receives a packet or dependency query, when stage 1 candidates are generated, then `graph_metadata` rows can receive the packet-oriented boost. Reqs: `REQ-008`, `REQ-013`.
4. Given a repo backfill run across active spec folders, when dry-run mode is enabled, then the script reports missing or ambiguous fields without mutating files. Reqs: `REQ-009`, `REQ-012`.
5. Given `/spec_kit:plan` scaffolds a new packet, when workflow adoption lands, then graph metadata is created alongside the canonical packet docs. Reqs: `REQ-001`, `REQ-010`.
6. Given `/spec_kit:complete` closes a packet, when the save path runs, then packet status and `last_save_at` remain synchronized with graph metadata. Reqs: `REQ-004`, `REQ-010`, `REQ-011`.
7. Given `description.json` is missing for a valid packet, when backfill or refresh runs, then graph metadata still derives from canonical docs plus folder structure. Reqs: `REQ-005`, `REQ-012`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | `workflow.ts` is the canonical save authority | Attach refresh to canonical save completion, not to legacy write branches |
| Dependency | `memory_index` already supports `document_type` | Reuse the existing column and indexes rather than adding storage |
| Dependency | `mcp_server/lib/graph/` already exists | Place schema/parser work in the verified graph library instead of inventing a new subsystem |
| Risk | Refresh attaches to the wrong save hook and repeats the `ctxFileWritten` blind spot | Test both legacy-write and no-legacy-write scenarios |
| Risk | Automated refresh overwrites operator-authored packet relationships | Preserve `manual.*`, regenerate only `derived.*`, and test merge semantics explicitly |
| Risk | `description.json` or `_memory.continuity` gets overloaded with graph state during implementation | Keep separation of concerns enforced in ADRs, tasks, and validation |
| Risk | Backfill infers misleading cross-packet relationships from prose | Backfill only derived fields automatically and emit manual review flags for relationship arrays |
| Risk | Search boosts make `graph_metadata` rows dominate non-packet queries | Restrict boosts to packet-oriented intents and integration tests |
<!-- /ANCHOR:risks -->

## 7. Non-Functional Requirements

### Maintainability

- NFR-M01: The metadata file must be deterministic JSON with one schema version and stable field names.
- NFR-M02: Manual relationship edits must survive automated refreshes.
- NFR-M03: The contract must remain understandable in git diffs without custom tooling.

### Reliability

- NFR-R01: Save-time refresh must be atomic with the canonical save path or fail open without corrupting packet docs.
- NFR-R02: Indexing must degrade safely when the file is missing or schema-invalid.
- NFR-R03: The rollout must not require full `description.json` coverage.

### Performance

- NFR-P01: Packet-level graph metadata indexing should remain O(number of spec folders), not O(number of anchors).
- NFR-P02: Search ranking and resume must not require full-doc rescans to answer packet-level dependency questions.

### Rollout Discipline

- NFR-D01: Warning-first validation must remain in place until backfill coverage is proven.
- NFR-D02: Resume recovery order stays `handover.md -> _memory.continuity -> canonical spec docs`, with graph metadata as an adjunct signal rather than a replacement.

## 8. Edge Cases

- A packet has no `implementation-summary.md` yet but still needs graph metadata.
- A packet is nested several levels deep and needs both `parent_id` and `children_ids`.
- A save updates doc content but does not produce a legacy context markdown file.
- A packet manually declares `depends_on` or `supersedes` edges that contradict inferred relationships.
- A packet references code entities when the code graph is stale or unavailable.
- Backfill runs on a folder with valid packet docs but no `description.json`.

## 9. Complexity Assessment

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Touches save workflow, indexing, search ranking, validation, backfill, and packet lifecycle surfaces |
| Risk | 21/25 | A wrong contract would either recreate legacy sprawl or leave packet graph state underspecified |
| Research | 18/20 | Required runtime audit, format comparison, migration counting, and schema design |
| Coordination | 12/15 | Must stay aligned with Phase 018 continuity boundaries and command/runtime parity |
| Rollout | 11/15 | Needs warning-first validation and measured backfill promotion |
| Total | 84/100 | Level 3 |

## 10. Risk Matrix

| Risk ID | Risk | Impact | Likelihood | Mitigation |
|---------|------|--------|------------|------------|
| R-001 | Refresh attaches to the wrong save hook and repeats the legacy-only blind spot | High | Medium | Hook graph metadata refresh to canonical save completion in `workflow.ts` |
| R-002 | Automated refresh overwrites operator-authored packet relationships | High | Medium | Preserve `manual.*` and test merge semantics explicitly |
| R-003 | `description.json` or `_memory.continuity` gets overloaded with graph state | High | Medium | Keep separation of concerns enforced in ADRs, tasks, and validation |
| R-004 | Backfill infers misleading cross-packet relationships from prose | Medium | Medium | Emit manual review flags instead of guessing relationships |
| R-005 | Search boosts over-promote packet metadata for non-packet queries | Medium | Medium | Limit boosts to packet-oriented intents and test them |
| R-006 | Validation creates broad failures before coverage is acceptable | Medium | Medium | Start warning-first and promote only after measured backfill progress |

## 11. User Stories

### US-001: Packet dependency discovery

As a maintainer, I want each spec folder to expose machine-readable dependency and supersession edges, so graph queries can answer packet-relationship questions without scraping prose.

**Acceptance Criteria**:
1. Given a packet with manual relationship entries, when the causal-links processor runs, then the agreed `enabled`, `supersedes`, and `supports` edges are written into `causal_edges`.
2. Given a packet-oriented dependency query, when stage 1 candidates are ranked, then the packet's `graph_metadata` row can surface ahead of generic narrative rows.

### US-002: Thin resume remains intact

As an operator, I want `_memory.continuity` to stay compact and fast, so packet resume does not regress into a heavyweight metadata dump.

**Acceptance Criteria**:
1. Given a canonical save that completes without a legacy context markdown write, when refresh runs, then `graph-metadata.json` still updates.
2. Given `/spec_kit:resume` loads packet context, when graph metadata is available, then it augments dependency and key-file hints without replacing the canonical recovery order.

### US-003: Incremental rollout is practical

As an implementation owner, I want backfill and warning-first validation, so the contract can land without waiting for perfect `description.json` coverage.

**Acceptance Criteria**:
1. Given a packet tree with partial `description.json` coverage, when backfill runs in dry-run mode, then best-effort graph metadata output and manual-review flags are still reported.

### US-004: Packet-oriented retrieval improves

As a user of `/memory:search` and `/spec_kit:resume`, I want packet-level metadata rows to surface key files, relationships, and status, so packet discovery is more precise.

**Acceptance Criteria**:
1. Given a packet search query, when indexing has produced `graph_metadata` rows, then packet key files and status can be surfaced from that row.
2. Given rollout validation is still in warning mode, when a packet lacks `graph-metadata.json`, then validation reports the gap without failing unrelated packet work.

<!-- ANCHOR:questions -->
## 12. Open Questions

No unresolved design questions remain in this packet. The implementation work should follow the settled recommendation in [research.md](./research.md), and any new blocker discovered during coding should be captured as a runtime finding or a follow-on phase rather than reopening the storage-model decision here.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- Research basis: [research.md](./research.md)
- Implementation plan: [plan.md](./plan.md)
- Task ledger: [tasks.md](./tasks.md)
- Verification checklist: [checklist.md](./checklist.md)
- Architectural decisions: [decision-record.md](./decision-record.md)
- Implementation summary shell: [implementation-summary.md](./implementation-summary.md)

### AI Execution Protocol

### Pre-Task Checklist

- Re-read [research.md](./research.md) before coding and keep iteration references explicit in code comments or docs where the contract could drift.
- Verify the runtime surfaces listed in the requirements section still exist before implementation begins.
- Preserve packet-local scope: no unrelated documentation or runtime churn outside the verified graph/save/search/validation surfaces.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-GRAPHMETA-001 | Treat `graph-metadata.json` as the only new packet-level graph file introduced by this packet | Prevents contract sprawl |
| AI-GRAPHMETA-002 | Prefer additive integration into existing `memory_index` and `causal_edges` paths over new storage | Keeps the implementation small and reversible |
| AI-GRAPHMETA-003 | Preserve `manual.*` exactly and derive `derived.*` deterministically on refresh | Protects human intent while keeping automation fresh |
| AI-GRAPHMETA-004 | Keep resume authoritative order as `handover.md -> _memory.continuity -> canonical spec docs`, with graph metadata as an adjunct signal | Avoids conflating packet graph state with recovery state |
| AI-GRAPHMETA-005 | Promote graph metadata validation from warning to error only after backfill evidence is available | Supports safe rollout |
