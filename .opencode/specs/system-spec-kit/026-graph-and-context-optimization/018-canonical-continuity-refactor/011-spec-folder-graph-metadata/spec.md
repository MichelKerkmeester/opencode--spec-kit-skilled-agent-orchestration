---
title: "Feature Specification: 018 / 011 — graph-metadata.json packet contract"
description: "Define a dedicated per-spec-folder graph-metadata.json contract so packet relationships, ranking signals, and key files can be refreshed on canonical save and indexed without reviving legacy memory markdown."
trigger_phrases:
  - "018 011 spec"
  - "graph metadata json"
  - "spec folder graph metadata"
  - "canonical continuity graph contract"
  - "graph metadata packet contract"
importance_tier: "critical"
contextType: "planning"
status: "planned"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rebuilt the missing spec.md and aligned the packet to a Level 3 implementation contract"
    next_safe_action: "Start Phase 1 schema work"
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md", "research.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 018 / 011 — graph-metadata.json packet contract

---

## EXECUTIVE SUMMARY

Phase 018 removed legacy packet `memory/` saves as the main continuity surface, but the graph and retrieval stack still depends on packet-level metadata for relationships, ranking, and key-file recovery. This packet formalizes the replacement contract from [research.md](./research.md): one `graph-metadata.json` per spec-folder root, split into merge-safe `manual` fields and fully regenerated `derived` fields, refreshed on canonical save, and indexed as `document_type='graph_metadata'`.

**Key Decisions**: use a dedicated root JSON file instead of extending `description.json` or `_memory.continuity` (Iterations 3, 9, 10); preserve `manual.*` relationships while rewriting `derived.*` on save (Iterations 4, 5, 10).

**Critical Dependencies**: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-04-12 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Iteration 1 of [research.md](./research.md) confirmed that the graph stack still exists, but the packet-scoped metadata producer that used to arrive through legacy `memory/*.md` saves no longer does. The current runtime still ranks and links through `memory_index`, `causal_edges`, `causal-links-processor.ts`, `reconsolidation.ts`, and `stage1-candidate-gen.ts`, yet there is no durable per-folder contract for packet relationships, trigger phrases, key files, entities, or packet state once canonical continuity lives in spec docs instead of memory markdown.

The result is a structural gap: packets can be readable to humans through canonical docs, but they are weaker inputs for packet-aware retrieval, supersession tracking, dependency queries, and resume ranking. This specification restores that missing packet-level input without undoing the architectural direction of Phase 018.

### Purpose

Define the exact `graph-metadata.json` contract, lifecycle, and integration points needed to restore packet-level graph and retrieval signals while keeping canonical spec docs, `_memory.continuity`, and `description.json` in their current roles.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a dedicated `graph-metadata.json` contract for each spec-folder root, with `manual` and `derived` sections exactly as recommended in Iteration 4.
- Refresh `graph-metadata.json` during canonical save completion even when no legacy context markdown file is written, per Iteration 5.
- Index one `graph_metadata` row per packet and project cross-packet edges into existing `causal_edges`, per Iteration 6.
- Backfill active spec folders with warning-first rollout and human-review flags for ambiguous relationships, per Iteration 7.
- Extend packet-facing workflows so `/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:resume`, `/memory:search`, and `validate.sh` can create, consume, or enforce the new file, per Iterations 8 and 10.

### Out of Scope

- Replacing `description.json`. It remains the folder identity and save-history tracking surface from `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`.
- Replacing `_memory.continuity`. It remains the thin doc-local resume surface attached to canonical spec docs.
- Introducing a new database, new graph table, or a parallel packet registry outside `memory_index` plus `causal_edges`.
- Reintroducing legacy `memory/*.md` packet saves as the primary graph source.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/` | Extend | Add schema, parser, and merge helpers for `graph-metadata.json`. |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Trigger graph-metadata refresh from the canonical save entry point. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Run refresh and atomic write after canonical save completion. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Modify | Discover and validate `graph-metadata.json` files. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Modify | Translate packet relationship arrays into `causal_edges` using indexed packet rows. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Boost `graph_metadata` rows for packet-oriented retrieval and resume queries. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Confirm schema/index support for `document_type='graph_metadata'` and companion metadata. |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modify | Scaffold `graph-metadata.json` during packet creation. |
| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Modify | Respect planned-vs-complete graph metadata expectations during closeout. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Enforce schema validity and phased presence rules. |
| `.opencode/command/spec_kit/plan.md` + `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` + `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Create empty graph metadata on new packet scaffolds. |
| `.opencode/command/spec_kit/complete.md` + `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` + `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Finalize `status` and `last_save_at` during completion. |
| `.opencode/command/spec_kit/resume.md` + `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` | Modify | Surface packet dependencies and key files from graph metadata. |
| `.opencode/command/memory/search.md` + `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Use packet graph rows for packet-oriented retrieval. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Research Basis |
|----|-------------|---------------------|----------------|
| REQ-001 | The system MUST define one `graph-metadata.json` file per spec-folder root as the packet-level graph contract. | The schema includes top-level identity plus `manual` and `derived` sections, and packet docs explicitly prohibit moving this state into `description.json` or `_memory.continuity`. | Iterations 3, 4, 9, 10 |
| REQ-002 | The v1 schema MUST match Iteration 4 without structural drift. | The formal schema includes `schema_version`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `manual.depends_on`, `manual.supersedes`, `manual.related_to`, and the full `derived.*` set from Iteration 4. Any deviation is documented in the packet before code lands. | Iteration 4 |
| REQ-003 | Canonical save MUST refresh `graph-metadata.json` even when no legacy context markdown file is emitted. | The refresh hook runs from `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` and `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` after canonical save completion, independent of `ctxFileWritten`. | Iterations 1, 5, 8, 10 |
| REQ-004 | Save refresh MUST preserve manual packet relationships while fully regenerating derived packet signals. | Existing `manual.depends_on`, `manual.supersedes`, and `manual.related_to` survive every refresh; `derived.*` is rewritten from canonical sources on each save. | Iterations 4, 5, 10 |
| REQ-005 | Index discovery MUST add `graph-metadata.json` as a first-class spec-folder artifact. | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` discovers the file only in valid spec folders and indexes it with `document_type='graph_metadata'`. | Iterations 6, 10 |
| REQ-006 | Cross-packet relationships MUST project into existing `causal_edges`, not a new storage layer. | `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` resolves packet references from `manual.*` and upserts edges between packet rows in `memory_index`. | Iterations 6, 10 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Research Basis |
|----|-------------|---------------------|----------------|
| REQ-007 | Retrieval and resume flows SHOULD treat `graph_metadata` rows as high-signal packet artifacts. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, and `/spec_kit:resume` surfaces use graph metadata for packet-oriented queries, dependencies, and key-file hints. | Iterations 6, 8, 10 |
| REQ-008 | The rollout SHOULD include a backfill script for active spec folders with dry-run and review flags. | A backfill command scans valid folders, derives best-effort metadata from canonical docs plus `description.json` when present, and emits explicit review warnings instead of guessing ambiguous relationships. | Iteration 7 |
| REQ-009 | Validation SHOULD enforce schema correctness immediately and presence gradually. | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` validates file shape on day one, reports missing files as warnings during backfill, then promotes presence to error after rollout coverage is proven. | Iterations 8, 10 |
| REQ-010 | Workflow commands SHOULD create and maintain graph metadata through normal packet lifecycle commands. | `/spec_kit:plan` scaffolds an empty file, `/spec_kit:complete` finalizes terminal status and save timestamp, `/memory:search` can rank packet graph rows, and `/spec_kit:resume` can read dependencies and key files. | Iterations 8, 10 |

### P2 - Optional (complete if cheap, otherwise document)

| ID | Requirement | Acceptance Criteria | Research Basis |
|----|-------------|---------------------|----------------|
| REQ-011 | The implementation MAY add packet-oriented ranking heuristics beyond a simple document-type boost if they stay packet-local and testable. | Any extra ranking logic stays bounded to packet or dependency intents and does not degrade canonical spec-doc retrieval for ordinary content searches. | Iterations 6, 10 |
| REQ-012 | The implementation MAY add richer entity extraction and `last_accessed_at` updates after the core contract is stable. | Entity extraction and access timestamps remain additive and do not block the core schema, save-path, discovery, or backfill rollout. | Iterations 4, 5, 10 |

### Schema Contract

This specification intentionally preserves the Iteration 4 shape. There is no structural divergence from the research recommendation. The only added clarification is that `packet-ref` and `entity-ref` must be validated as typed objects instead of loose JSON blobs.

```json
{
  "schema_version": 1,
  "packet_id": "system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/011-spec-folder-graph-metadata",
  "spec_folder": "system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/011-spec-folder-graph-metadata",
  "parent_id": "system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor",
  "children_ids": [],
  "manual": {
    "depends_on": [],
    "supersedes": [],
    "related_to": []
  },
  "derived": {
    "trigger_phrases": ["018 011 graph metadata", "per spec folder graph metadata"],
    "key_topics": ["graph metadata", "causal graph", "generate-context", "memory_index"],
    "importance_tier": "critical",
    "status": "complete",
    "key_files": ["research.md", "spec.md", "plan.md", "decision-record.md"],
    "entities": [
      { "name": "generate-context.js", "kind": "script", "path": "scripts/memory/generate-context.ts", "source": "derived" }
    ],
    "causal_summary": "Defines a dedicated per-folder metadata file to restore graph signals lost with legacy memory-file removal.",
    "created_at": "2026-04-12T00:00:00Z",
    "last_save_at": "2026-04-12T00:00:00Z",
    "last_accessed_at": null,
    "source_docs": ["spec.md", "plan.md", "tasks.md", "research.md", "decision-record.md"]
  }
}
```

| Field | Type | Source | Rules |
|-------|------|--------|-------|
| `schema_version` | number | derived | Starts at `1`; required for parser compatibility and migration gating. |
| `packet_id` | string | derived | Canonical packet identity derived from spec-folder path. |
| `spec_folder` | string | derived | Canonical spec-folder path used for lookup and joins. |
| `parent_id` | string or null | derived | Path-derived parent pointer. |
| `children_ids` | string[] | derived | Folder-structure children for phased packets. |
| `manual.depends_on` | `packet-ref`[] | manual | Never overwritten by automated refresh. |
| `manual.supersedes` | `packet-ref`[] | manual | Never overwritten by automated refresh. |
| `manual.related_to` | `packet-ref`[] | manual | Never overwritten by automated refresh. |
| `derived.trigger_phrases` | string[] | derived | Derived from packet doc frontmatter plus packet title terms. |
| `derived.key_topics` | string[] | derived | Best-effort topic extraction from canonical docs and summaries. |
| `derived.importance_tier` | string | derived | Derived from packet frontmatter with optional future override path. |
| `derived.status` | enum | derived | Derived from packet frontmatter and completion workflow state. |
| `derived.key_files` | string[] | derived | Derived from canonical docs, especially `implementation-summary.md` and continuity hints. |
| `derived.entities` | `entity-ref`[] | derived | Best-effort symbol, file, command, or script references. |
| `derived.causal_summary` | string | derived | Compact packet summary for ranking and retrieval. |
| `derived.created_at` | ISO-8601 string | derived | First-write timestamp. |
| `derived.last_save_at` | ISO-8601 string | derived | Updated on every canonical save. |
| `derived.last_accessed_at` | ISO-8601 string or null | runtime | Updated by read-path telemetry only after rollout decides to support it. |
| `derived.source_docs` | string[] | derived | Canonical provenance inputs used to rebuild the file. |

| Type | Required Fields | Notes |
|------|-----------------|-------|
| `packet-ref` | `packet_id`, `reason`, `source` | May add optional `spec_folder` or `title` later, but v1 requires an identity anchor and provenance. |
| `entity-ref` | `name`, `kind`, `path`, `source` | `path` may point to a file, command doc, or script surface. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A packet saved through canonical continuity always has one fresh `graph-metadata.json` file, even when no legacy context markdown file is emitted.
- **SC-002**: `graph-metadata.json` indexes as `document_type='graph_metadata'` and can be retrieved by packet-oriented searches.
- **SC-003**: Manual packet relationships survive repeated save refreshes without being overwritten by derived regeneration.
- **SC-004**: Packet dependency, supersession, and related-to links project into `causal_edges` without introducing a new graph database or table.
- **SC-005**: Backfill can populate active packets with dry-run reporting and explicit review flags for ambiguous relationships.
- **SC-006**: Validation can enforce schema correctness immediately and presence after rollout coverage is proven.

### Acceptance Scenarios

1. **Given** a packet is saved through canonical continuity and no legacy context markdown file is emitted, **when** save completes, **then** `graph-metadata.json` is still refreshed.
2. **Given** a packet already contains manual `depends_on`, `supersedes`, or `related_to` entries, **when** save refresh runs, **then** those entries remain unchanged.
3. **Given** discovery scans valid spec folders, **when** `graph-metadata.json` exists, **then** one `graph_metadata` row is indexed for the packet.
4. **Given** packet relationship arrays reference other packets, **when** graph processing runs, **then** the system projects those links into `causal_edges`.
5. **Given** the backfill script runs in dry-run mode, **when** ambiguous packet status or relationships are detected, **then** the report flags them for review instead of guessing.
6. **Given** rollout is still in progress, **when** `validate.sh` sees a packet missing `graph-metadata.json`, **then** it warns instead of failing hard until the coverage threshold is met.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation | Research Basis |
|------|------|--------|------------|----------------|
| Dependency | `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` + `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Wrong hook choice recreates the legacy-only blind spot. | Refresh graph metadata from the canonical save path after save completion, not behind `ctxFileWritten`. | Iterations 1, 5, 10 |
| Dependency | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Without discovery, no graph metadata reaches search or causal processing. | Treat the file as a first-class spec artifact with exclusion rules aligned to existing spec-doc scanning. | Iteration 6 |
| Risk | Manual relationship edits get overwritten by automation | High | Preserve `manual.*` on every merge and overwrite only `derived.*`. | Iterations 4, 5, 10 |
| Risk | Packet boundaries collapse back into `description.json` or `_memory.continuity` | High | Enforce separation of concerns in docs, parser APIs, and validation messaging. | Iterations 3, 9, 10 |
| Risk | Backfill produces false confidence on ambiguous packet links | Medium | Emit review flags and unresolved-reference reports instead of guessing. | Iteration 7 |
| Risk | Ranking boost for `graph_metadata` hurts ordinary content retrieval | Medium | Limit boosts to packet-oriented, dependency, and resume-like intents and cover with retrieval tests. | Iterations 6, 10 |
| Risk | Presence validation causes broad false failures before coverage exists | Medium | Roll out schema validation first, presence warnings second, and presence errors only after backfill and create/save hooks are live. | Iterations 8, 10 |

### Integration Points

| Surface | Required Change | Why It Matters | Research Basis |
|---------|-----------------|----------------|----------------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Trigger graph-metadata refresh from the canonical save CLI entry point. | Canonical save must remain the authoritative producer for packet metadata. | Iterations 5, 8, 10 |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Run read-merge-write flow after canonical save completion and before indexing returns. | The wrong hook recreates the current blind spot where graph metadata only updates when legacy memory markdown exists. | Iterations 1, 5, 10 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Discover valid `graph-metadata.json` files and skip excluded directories. | Discovery is the gateway to indexing, retrieval, and backfill verification. | Iteration 6 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Resolve `manual.depends_on`, `manual.supersedes`, and `manual.related_to` into `causal_edges`. | Reuses the graph table that already powers causal traversal and supersession. | Iteration 6 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Apply packet-oriented boosts for `document_type='graph_metadata'`. | Packet discovery and dependency queries should treat the new artifact as first-class. | Iterations 6, 10 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Confirm schema and indexes accept `graph_metadata` rows cleanly. | Prevents rollout drift between discovery, indexing, and ranking assumptions. | Iteration 6 |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Add schema validation now and phased presence enforcement later. | Rollout must be warning-first until backfill coverage is acceptable. | Iterations 8, 10 |
| `.opencode/command/spec_kit/plan.md` and plan assets | Scaffold empty graph metadata during packet creation. | New packets need the file from day one once rollout begins. | Iterations 8, 10 |
| `.opencode/command/spec_kit/complete.md` and complete assets | Update final packet status and `last_save_at`. | Keeps terminal packet state in sync with completion workflows. | Iteration 8 |
| `.opencode/command/spec_kit/resume.md` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Read graph metadata for dependencies, key files, and packet ranking. | This is the user-facing payoff for the new artifact. | Iterations 8, 10 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Graph-metadata refresh should add bounded overhead to canonical save and avoid unnecessary full-folder rescans.
- **NFR-P02**: Packet-oriented ranking boosts should remain intent-gated so ordinary retrieval does not pay a broad relevance penalty.

### Security

- **NFR-S01**: The new file must contain no secrets or session-only data that does not belong in packet metadata.
- **NFR-S02**: Atomic write semantics must prevent partially written JSON files from corrupting save-path or indexing workflows.

### Reliability

- **NFR-R01**: The parser must reject malformed files deterministically and surface useful diagnostics through validation and backfill reports.
- **NFR-R02**: Derived refresh must be idempotent: repeated saves with unchanged canonical docs should converge on the same derived content.

### Maintainability

- **NFR-M01**: The schema must stay explicit enough for validator, backfill, and index code to share one typed contract.
- **NFR-M02**: Packet identity and relationship resolution rules must stay path-based and testable, not heuristic-only.

Research basis: Iterations 4, 5, 6, 7, 10.

---

## 8. EDGE CASES

### Data Boundaries

- Packets with no `implementation-summary.md` yet should still produce valid graph metadata from `spec.md`, `plan.md`, `tasks.md`, and `research.md`.
- Phased parent packets with child folders should compute `children_ids` from folder structure without forcing child packet content reads into the root schema validator.
- Packets missing `description.json` must still backfill and validate successfully.

### Error Scenarios

- If `graph-metadata.json` exists but fails schema validation, save-path refresh should fail loudly in strict execution contexts and emit actionable diagnostics during dry-run or backfill workflows.
- If manual packet references cannot resolve to packet rows yet, the system should record unresolved references for review rather than inserting incorrect edges.
- If canonical save is interrupted mid-refresh, atomic write behavior must prevent partial JSON from being indexed.

### State Transitions

- `/spec_kit:plan` creates a minimally valid file with empty manual arrays and initial derived state.
- `/spec_kit:complete` finalizes packet `status` and `last_save_at` without mutating manual relationships.
- Read-path telemetry may populate `last_accessed_at` later, but that is not required for initial rollout.

Research basis: Iterations 5, 7, 8, 10.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | Save-path, discovery, indexing, graph edges, command workflows, and validation all move together. |
| Risk | 22/25 | Wrong boundary choice or wrong hook placement would undermine canonical continuity and retrieval quality. |
| Research | 18/20 | Ten iterations already converged; the implementation challenge is disciplined execution rather than unresolved design. |
| Multi-Agent / Coordination | 10/15 | The rollout crosses scripts, MCP handlers, commands, validators, and backfill tooling, but stays within one subsystem family. |
| Coordination | 13/15 | Requires phased rollout to avoid mass false positives and packet drift. |
| **Total** | **86/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Canonical save hooks the wrong branch and graph metadata never refreshes for doc-only saves. | High | Medium | Bind refresh to canonical completion in `workflow.ts` and test the no-legacy-markdown case explicitly. |
| R-002 | `description.json` or `_memory.continuity` absorbs graph state as a shortcut. | High | Low | Keep clear scope boundaries in docs, parser APIs, and validation errors. |
| R-003 | Manual packet links are clobbered during refresh. | High | Medium | Preserve `manual.*` by merge and overwrite only `derived.*`. |
| R-004 | Backfill guesses packet relationships from prose. | Medium | Medium | Emit review flags and unresolved-reference reports, not guessed edges. |
| R-005 | Packet ranking becomes noisy once `graph_metadata` rows exist. | Medium | Medium | Intent-gate boosts and cover with search regression tests. |

---

## 11. USER STORIES

### US-001: Save-path maintainer (Priority: P0)

**As a** Spec Kit maintainer, **I want** canonical save to refresh packet graph metadata automatically, **so that** packet graph state stays aligned with canonical docs without legacy memory markdown.

**Acceptance Criteria**:
1. Given a canonical save with no legacy context markdown, when save completes, then `graph-metadata.json` still refreshes.
2. Given an existing file with manual relationships, when save refresh runs, then `manual.*` remains intact.

---

### US-002: Retrieval and resume operator (Priority: P1)

**As a** packet operator, **I want** packet-aware search and resume to see dependency and key-file signals, **so that** I can resume or inspect related packets faster.

**Acceptance Criteria**:
1. Given a packet-oriented query, when search runs, then `graph_metadata` rows can rank as high-signal packet artifacts.
2. Given a packet with dependencies, when `/spec_kit:resume` runs, then the packet can surface those dependency hints without bloating `_memory.continuity`.

---

### US-003: Rollout and validation owner (Priority: P1)

**As a** rollout owner, **I want** backfill and validation to expose coverage and ambiguity clearly, **so that** I can adopt the new contract without breaking the repo.

**Acceptance Criteria**:
1. Given a backfill dry run, when ambiguous relationships or status are detected, then the report flags them for review instead of guessing.
2. Given rollout is incomplete, when `validate.sh` runs, then missing graph metadata is warning-only until the agreed coverage threshold is reached.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No design blockers remain. The remaining questions are rollout details:
- Should `last_accessed_at` land in the first rollout or wait until the read path stabilizes around `graph_metadata` rows?
- Should packet-oriented ranking boost only `packet`, `dependency`, and `resume` intents, or should it also inform broader planning queries once coverage is high?
- What coverage threshold should promote `GRAPH_METADATA_PRESENT` from warning to error in `validate.sh`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: See `research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
