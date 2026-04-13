---
title: "Implementation Plan: 018 / 011 — graph-metadata.json rollout"
description: "Five-phase implementation plan for introducing graph-metadata.json as the packet-level graph contract across canonical save, indexing, validation, and workflow surfaces."
trigger_phrases: ["018 011 plan", "graph metadata implementation plan", "graph metadata rollout plan", "canonical continuity graph rollout"]
importance_tier: "critical"
contextType: "planning"
status: "planned"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/002-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rewrote the packet plan around the five implementation phases from Iteration 10"
    next_safe_action: "Start Phase 1 schema and parser work"
    key_files: ["plan.md", "tasks.md", "spec.md", "research.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 018 / 011 — graph-metadata.json rollout

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, shell, markdown command surfaces |
| **Framework** | Spec Kit scripts + MCP server + command/YAML workflow layer |
| **Storage** | Existing `memory_index`, `memory_fts`, `vec_memories`, and `causal_edges` tables |
| **Testing** | Vitest, packet validation via `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, targeted command/workflow checks |

### Overview

This plan implements the settled recommendation from Iteration 10: introduce one `graph-metadata.json` file per spec-folder root, keep manual packet relationships separate from regenerated derived metadata, refresh the file from canonical save, and index it as `document_type='graph_metadata'`. The rollout stays evolutionary: it reuses existing save, discovery, retrieval, and causal-edge plumbing, then adds a bounded backfill plus warning-first validation so the repo can adopt the new contract without a disruptive flag day.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready

- [x] Problem statement, schema contract, and integration points are documented in `spec.md`.
- [x] The five implementation phases are grounded in Iteration 10 and mapped to real repo surfaces.
- [x] Verified paths exist for every runtime surface referenced in the task ledger.

### Definition of Done

- [ ] `graph-metadata.json` can be created, refreshed, validated, indexed, backfilled, and queried through normal packet workflows.
- [ ] Schema, save-path, indexing, and command-surface tests cover the primary success path and the no-legacy-markdown path.
- [ ] `validate.sh --strict` passes for the implementation packet and the rollout surfaces touched by the change.
- [ ] Requirement, task, and checklist traceability stays synchronized across `spec.md`, `tasks.md`, and `checklist.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Additive packet-metadata producer layered on top of the existing canonical save and retrieval stack.

### Key Components

- **Schema and parser layer**: Defines the v1 `graph-metadata.json` contract and merge rules inside `.opencode/skill/system-spec-kit/mcp_server/lib/graph/`.
- **Canonical save integration**: Refreshes the file from `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` and `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`.
- **Index and graph integration**: Extends `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`.
- **Adoption and enforcement layer**: Updates command workflows, backfill tooling, and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.

### Data Flow

Canonical packet save collects structured session data, resolves the target spec folder, derives packet-level metadata from canonical docs, merges preserved `manual.*` relationships, writes `graph-metadata.json` atomically, indexes one `graph_metadata` row into `memory_index`, and projects packet relationships into `causal_edges`. Retrieval and resume then treat those rows as packet-aware signals, while validation and backfill enforce shape and coverage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. Implementation Phases

### Phase 1: Schema + Parser (~1 week)

**Objective**: create the typed contract and merge logic that every later phase depends on.

**Primary surfaces**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts`

**Deliverables**:
- Schema definition file for `graph-metadata.json`
- Parser/validator that can read, validate, and merge manual plus derived sections
- Unit tests for valid schema, invalid schema, merge behavior, and schema version handling

**Exit criteria**:
- Iteration 4 structure is encoded without drift
- Invalid files fail deterministically with actionable messages
- Merge logic proves that `manual.*` survives refresh while `derived.*` is rebuilt

**Research basis**: Iterations 4 and 10

### Phase 2: Save-Path Integration (~1 week)

**Objective**: make canonical save the authoritative producer for graph metadata.

**Primary surfaces**:
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts`

**Deliverables**:
- Post-save refresh hook that runs even without legacy context markdown
- Derived-field extraction for `trigger_phrases`, `key_files`, `status`, `importance_tier`, `parent_id`, `children_ids`, and `causal_summary`
- Atomic write path that preserves existing `manual.*` arrays
- Save-path tests for packet refresh and merge behavior

**Exit criteria**:
- Canonical save always emits or refreshes `graph-metadata.json`
- The no-legacy-markdown case is explicitly tested
- Save-path logic does not regress existing canonical continuity behavior

**Research basis**: Iterations 1, 5, 8, and 10

### Phase 3: Index + Graph Integration (~1 week)

**Objective**: make the new artifact discoverable, indexable, and useful to retrieval and graph traversal.

**Primary surfaces**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts`

**Deliverables**:
- Discovery branch for `graph-metadata.json`
- Indexed `graph_metadata` rows with normalized packet summary content
- Cross-packet edge projection into existing `causal_edges`
- Packet-aware retrieval boost for `graph_metadata` rows
- Integration tests covering discovery, indexing, edge creation, and packet ranking

**Exit criteria**:
- Packet rows appear in `memory_index` with the correct document type
- `depends_on`, `supersedes`, and `related_to` relationships become graph edges
- Packet-oriented search can retrieve graph metadata without displacing canonical spec docs

**Research basis**: Iterations 6 and 10

### Phase 4: Backfill (~3 days)

**Objective**: generate initial coverage for active spec folders and surface folders that still need human review.

**Primary surfaces**:
- `.opencode/skill/system-spec-kit/scripts/`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/`

**Deliverables**:
- `backfill-graph-metadata.ts` under the existing scripts tree
- Dry-run mode and report output
- Best-effort derivation from `spec.md`, `description.json`, `implementation-summary.md`, and other canonical packet docs
- Review flags for ambiguous packet status, missing summaries, and prose-only cross-packet hints

**Exit criteria**:
- Backfill can run on a bounded packet subset and on the active spec inventory
- Dry-run output clearly identifies what would be written and what needs review
- Coverage can be measured before presence validation is promoted

**Research basis**: Iteration 7

### Phase 5: Workflow Adoption (~1 week)

**Objective**: make the new artifact part of the normal packet lifecycle and validation story.

**Primary surfaces**:
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`
- `.opencode/command/spec_kit/resume.md`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- `.opencode/command/memory/search.md`
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

**Deliverables**:
- Packet creation scaffolds empty graph metadata
- Packet completion updates `status` and `last_save_at`
- Resume and memory search can read packet dependencies and key files
- Validation gains `GRAPH_METADATA_PRESENT` rollout logic

**Exit criteria**:
- New packets get the file automatically once rollout is active
- Completion and resume flows can consume the file without special-case operator work
- Presence validation starts as warning-only and can be promoted later without reworking the contract

**Research basis**: Iterations 8 and 10
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test | Method |
|------|--------|
| Schema validation | Parser and schema tests validate required fields, enums, merge rules, and version handling in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts` plus neighboring graph tests. |
| Save integration | Canonical save tests prove `graph-metadata.json` refresh runs even when no legacy markdown file is emitted and preserves `manual.*`. |
| Index discovery | Discovery tests verify only valid spec folders contribute `graph_metadata` rows and excluded directories stay excluded. |
| Graph edges | Causal integration tests prove packet references become `causal_edges` between packet rows. |
| Retrieval ranking | Search tests prove packet-oriented queries can elevate `graph_metadata` rows without harming canonical spec-doc retrieval. |
| Workflow adoption | Command/workflow tests verify plan, complete, resume, and memory-search surfaces remain aligned with the new contract. |
| Validation rollout | `validate.sh` tests prove schema failures are hard errors while presence checks are warning-first until coverage is acceptable. |
| Backfill | Dry-run and bounded packet runs prove the script generates valid files and surfaces manual-review cases. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` + `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Pending | These are the canonical-save surfaces that must own refresh timing. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Pending | Discovery currently covers markdown spec docs and constitutional docs, not packet graph JSON. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Green | Existing schema already tracks `document_type` and packet metadata fields; confirm companion indexes as needed. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Green | Existing edge-upsert path can be reused if packet references resolve to memory rows. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Pending | Ranking needs packet-aware boosts that do not overwhelm canonical spec docs. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Green | Keep this surface focused on `description.json` identity and save-history tracking. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Pending | Validation rollout must distinguish schema failures from coverage rollout. |
| `.opencode/command/spec_kit/*.md` and assets | Pending | Command surfaces need lifecycle awareness once the core runtime exists. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: Save-path integration corrupts packet refresh behavior, discovery causes broad false positives, or retrieval quality regresses materially once `graph_metadata` rows exist.
- **Procedure**:
1. Disable or remove the graph-metadata refresh hook from canonical save.
2. Stop discovery/indexing for `graph-metadata.json` and leave existing files inert.
3. Keep packet docs and research intact so the design record survives.
4. Do not move graph state into `_memory.continuity` or `description.json` as a shortcut.
5. Re-open the design question with fresh runtime evidence if the bounded rollout still cannot be made safe.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
Phase 1 (Schema + Parser)
  -> Phase 2 (Save-Path Integration)
  -> Phase 3 (Index + Graph Integration)
  -> Phase 4 (Backfill)
  -> Phase 5 (Workflow Adoption)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Research packet and verified runtime paths | All implementation work |
| Phase 2 | Phase 1 parser and merge rules | Indexing, backfill, lifecycle adoption |
| Phase 3 | Phase 2 refresh output | Packet retrieval, causal edges, search quality |
| Phase 4 | Phase 3 discovery and parser behavior | Presence enforcement and coverage metrics |
| Phase 5 | Phase 3 runtime support and Phase 4 coverage reports | Operator-facing lifecycle consistency |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Schema + Parser | Medium | ~1 week |
| Phase 2: Save-Path Integration | High | ~1 week |
| Phase 3: Index + Graph Integration | High | ~1 week |
| Phase 4: Backfill | Medium | ~3 days |
| Phase 5: Workflow Adoption | Medium | ~1 week |
| **Total** | | **~4.5 engineering weeks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: Dependency Graph

```text
Phase 1 schema/parser
  -> enables save refresh
  -> enables discovery/indexing
  -> enables backfill validation

Phase 2 save refresh
  -> produces real packet metadata
  -> feeds Phase 3 indexing
  -> feeds Phase 4 backfill parity

Phase 3 indexing/graph
  -> unlocks Phase 5 resume/search adoption
  -> produces rollout quality signals for validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Schema + parser | Research packet | Typed contract and merge behavior | Save-path coding |
| Canonical save refresh | Schema + parser | Fresh `graph-metadata.json` files | Indexing, backfill |
| Discovery + graph projection | Save refresh | Packet rows plus causal edges | Resume/search adoption |
| Backfill + validation rollout | Discovery + parser | Coverage metrics plus review flags | Error-level enforcement |
| Workflow adoption | Indexed packet rows | Operator-visible packet graph behavior | Final rollout closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

1. **Schema contract and merge semantics** - ~1 week - CRITICAL
2. **Canonical save refresh and no-legacy-markdown proof** - ~1 week - CRITICAL
3. **Discovery, packet row indexing, and edge projection** - ~1 week - CRITICAL
4. **Backfill coverage report plus warning-first validation** - ~3 days - CRITICAL
5. **Lifecycle command adoption and packet ranking rollout** - ~1 week - CRITICAL

**Total Critical Path**: ~4.5 engineering weeks

**Parallel Opportunities**:
- Discovery/indexing test scaffolds can be prepared while save refresh lands, but cannot be finalized until fresh packet files exist.
- Command-surface edits can start during late Phase 3 once the runtime contract is stable.
- Backfill dry-run reporting can be developed in parallel with validation messaging after the parser is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: Milestones

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema contract ready | Iteration 4 shape is implemented and tested without drift | End of Phase 1 |
| M2 | Canonical save authoritative | Packet graph metadata refreshes on every canonical save | End of Phase 2 |
| M3 | Graph integration live | Packet rows and packet edges are indexed and queryable | End of Phase 3 |
| M4 | Coverage visible | Backfill dry-run and validation rollout produce trustworthy coverage signals | End of Phase 4 |
| M5 | Workflow adoption complete | Plan, complete, resume, search, and validation surfaces all honor graph metadata | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

### Architecture Decision Summary

#### ADR-001: Dedicated `graph-metadata.json`

**Status**: Accepted

**Context**: Packet-level graph signals disappeared with legacy memory-file removal, but the graph and retrieval stack still needs them.

**Decision**: Use one root-level JSON file per spec folder instead of extending `description.json` or `_memory.continuity`.

#### ADR-002: Manual vs derived split

**Status**: Accepted

**Context**: Human packet relationships and automatically regenerated packet facts have different ownership and refresh rules.

**Decision**: Keep intentional cross-packet links in `manual.*` and recompute `derived.*` on every canonical save.

#### ADR-003: Merge-based save refresh

**Status**: Accepted

**Context**: Blind overwrite would destroy manual packet relationships; patch-style diffs would leave stale derived state behind.

**Decision**: Load existing file, preserve `manual.*`, fully regenerate `derived.*`, and rewrite atomically from canonical save.

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the implementation packet owns save-path, indexer, validator, and command-surface edits together.
- Re-run packet coverage counts before promoting validation presence checks to error.
- Preserve manual relationship edits as first-class data.

### Status Reporting Format

- Report progress by implementation slice: schema, save-path refresh, discovery/indexing, backfill, then workflow adoption.
- Include exact command strings and file paths whenever validation or migration evidence is claimed.
- Call out whether a result is design-only, warning-only, or release-blocking.

### Blocked Task Protocol

- If canonical-save integration cannot refresh `graph-metadata.json` atomically, stop the implementation slice and capture the blocker in packet docs before proceeding.
- If indexing or validation changes produce broad packet failures, revert to warning-first rollout and document the gating condition.
- If packet-ID resolution proves ambiguous during backfill, preserve generated derived fields but mark relationship rows for human review instead of guessing.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-PLAN-01811 | Treat `graph-metadata.json` as the only new root-level packet file in this contract | Keeps the design small and testable |
| AI-MERGE-01811 | Refresh derived fields by overwrite and preserve manual fields by merge | Avoids stale automation while protecting operator edits |
| AI-INDEX-01811 | Reuse `memory_index` and `causal_edges` before proposing new graph tables | Minimal change principle |
| AI-ROLLOUT-01811 | Roll out presence validation in warning-first mode until backfill coverage is proven | Prevents mass false failures |
| AI-BOUNDARY-01811 | Keep `description.json` and `_memory.continuity` in their current roles | Protects separation of concerns established by research |

---
