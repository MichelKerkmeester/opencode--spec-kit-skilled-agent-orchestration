---
title: "018 / 011 — Graph metadata implementation plan"
description: "Execution plan for introducing a per-spec-folder graph metadata file without overloading description.json or _memory.continuity."
trigger_phrases: ["018 011 plan", "graph metadata implementation plan", "per packet graph metadata plan"]
importance_tier: "critical"
contextType: "research"
status: "complete"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Converted the 10-iteration research into a concrete implementation and migration plan"
    next_safe_action: "Execute the plan in a follow-on implementation phase"
    key_files: ["plan.md", "tasks.md", "research.md"]
---
# Implementation Plan: 018 / 011 — Per-spec-folder graph metadata
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

This phase is a design-and-planning packet. It does not implement the graph metadata contract, but it locks the recommended shape:

1. Add `graph-metadata.json` to each spec-folder root
2. Refresh it during canonical save completion
3. Index it into `memory_index` as `document_type='graph_metadata'`
4. Reuse `causal_edges` by resolving packet-level graph metadata rows to existing IDs

### Technical Context

- Save path: `scripts/memory/generate-context.ts` plus `scripts/core/workflow.ts`
- Folder metadata today: `description.json` via `lib/search/folder-discovery.ts`
- Search index today: `memory_index`, `memory_fts`, `vec_memories`
- Graph today: `causal_edges`, `causal-links-processor.ts`, `reconsolidation.ts`
- Ranking today: `stage1-candidate-gen.ts`, trigger matcher, importance/tier filtering
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Packet Authoring Gates

- [x] The recommendation is grounded in runtime files, Phase 018 research, and current repo counts.
- [x] The option comparison covers all four requested storage choices.
- [x] The plan keeps `_memory.continuity` and `description.json` within their current responsibilities.

### Future Execution Definition of Done

- [ ] `graph-metadata.json` is created on packet creation and refreshed on canonical saves.
- [ ] The indexer can discover and validate the file as `document_type='graph_metadata'`.
- [ ] Packet-level relationships populate `causal_edges` through the new metadata path.
- [ ] Search and resume surfaces can use packet-level metadata without relying on legacy memory files.
- [ ] Backfill tooling covers the active spec inventory with explicit review flags for ambiguous fields.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. Architecture

### Recommended Storage Model

Use a dedicated root file:

```text
<spec-folder>/
  graph-metadata.json
```

The file is separate from:

- `description.json` for folder identity and save-history tracking
- `_memory.continuity` for doc-local resume hints
- canonical doc bodies for human-readable narrative and decisions

### Why This Shape Wins

- deterministic JSON is easy to validate, merge, and index
- one file per folder matches packet-level graph semantics
- existing graph/search paths can consume one indexed row per packet
- it avoids scattering packet edges across multiple doc frontmatters

### Effective Data Flow

```text
generate-context.js / canonical save
  -> derive packet signals from packet docs + save payload
  -> merge manual relationship section
  -> write graph-metadata.json atomically
  -> index file into memory_index as graph_metadata
  -> causal-links processor/upsert reads graph relationships
  -> stage1 ranking and resume use packet-level signals
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. Implementation Phases

### Phase 1: Schema and parser contract

- [x] Define the JSON schema, manual-vs-derived split, and effective field list in `research.md`.
- [ ] Add schema validation and parser helpers for `graph-metadata.json`.
- [ ] Choose the packet ID normalization contract (`spec_folder` path as canonical ID plus optional short pointer).

### Phase 2: Save-path integration

- [ ] Add a graph-metadata refresh step after canonical save completion in `generate-context.js` / workflow.
- [ ] Decouple folder metadata refresh from the `ctxFileWritten` legacy-only branch.
- [ ] Refresh derived fields fully while preserving manual relationship fields.

### Phase 3: Indexing and graph integration

- [ ] Extend `memory-index-discovery.ts` to discover graph metadata files.
- [ ] Index one `memory_index` row per folder with `document_type='graph_metadata'`.
- [ ] Teach causal-link processing to resolve packet references against graph metadata rows and upsert `causal_edges`.
- [ ] Add ranking boosts for packet/dependency queries in `stage1-candidate-gen.ts`.

### Phase 4: Backfill and validation

- [ ] Build a backfill script for the active spec inventory.
- [ ] Add validator coverage for file presence plus schema correctness.
- [ ] Roll out presence checks as warning-first, then promote to error once backfill coverage is acceptable.

### Phase 5: Resume and workflow adoption

- [ ] Use graph metadata for faster packet recovery and dependency-aware ranking.
- [ ] Surface packet relationships in future resume and planning flows without bloating `_memory.continuity`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test | Method |
|------|--------|
| Schema validation | JSON-schema and parser unit tests |
| Save integration | Canonical save writes graph metadata even when no legacy context markdown is emitted |
| Index discovery | Scanner finds `graph-metadata.json` only in valid spec folders |
| Graph edges | Cross-packet relationships become `causal_edges` between graph-metadata rows |
| Ranking | Packet/dependency queries return graph metadata rows with the intended boost |
| Migration | Backfill script produces valid files and explicit review flags |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `generate-context.js` and workflow hot path | Pending | Needs canonical-path refresh hook, not legacy-only hook |
| `memory-index-discovery.ts` | Pending | Currently only discovers markdown spec docs and constitutional docs |
| `memory_index` / `memory_fts` schema | Green | Can already store a dedicated `document_type` and trigger/tier fields |
| `causal_edges` | Green | Existing table can store packet-row edges by resolved `memory_index` IDs |
| `description.json` | Partial | Useful as an input, but too incomplete and too narrow to serve as the final graph contract |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

If the implementation phase discovers that a root-level JSON file cannot be refreshed safely during canonical saves, keep the schema research but stop before rollout. Do not fall back to stuffing graph state into `_memory.continuity` or `description.json` just to keep the project moving. Re-open the design question with fresh runtime evidence.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: Phase Dependencies

```text
schema contract
  -> save-path refresh
  -> discovery/indexing
  -> causal-edge integration
  -> backfill/validation
  -> resume/ranking adoption
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema contract | Research packet complete | Save-path coding |
| Save-path refresh | Schema contract | Indexing and backfill |
| Discovery/indexing | Save-path refresh | Ranking and graph traversal improvements |
| Backfill/validation | Discovery/indexing | Enforcement at create/save time |
| Resume/ranking adoption | Graph rows indexed | Operator-facing benefits |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: Effort Estimation

| Slice | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema + parser + tests | Medium | 1-2 days |
| Save-path integration | High | 1-2 days |
| Discovery + indexing + ranking | High | 2-3 days |
| Backfill tooling + validation | Medium | 1-2 days |
| Rollout + polish | Medium | 1 day |
| Total | | About 1.5 to 2 engineering weeks |
<!-- /ANCHOR:effort -->

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the implementation packet owns save-path, indexer, and validator files together.
- Re-run the repo counts before rollout if more spec folders land first.
- Preserve manual relationship edits as first-class data.

### Status Reporting Format

- Report progress by implementation slice: schema, save-path refresh, discovery/indexing, backfill/validation, then resume/ranking adoption.
- Include exact command strings and file paths whenever validation or migration evidence is claimed.
- Call out whether results are design-only, warning-only, or release-blocking.

### Blocked Task Protocol

- If canonical-save integration cannot refresh `graph-metadata.json` atomically, stop the implementation slice and capture the blocker in packet docs before proceeding.
- If indexing or validation changes produce broad packet failures, revert to warning-first rollout and document the gating condition.
- If packet-ID resolution proves ambiguous during backfill, preserve generated derived fields but mark relationship rows for human review instead of guessing.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-PLAN-01811 | Treat `graph-metadata.json` as the only new root-level packet file in this contract | Keeps the design small and testable |
| AI-MERGE-01811 | Refresh derived fields by overwrite, preserve manual fields by merge | Avoids stale automation while protecting operator edits |
| AI-INDEX-01811 | Reuse `memory_index` and `causal_edges` before proposing new graph tables | Minimal change principle |
| AI-ROLLOUT-01811 | Roll out validation in warning-first mode until backfill coverage is proven | Prevents mass false failures |
