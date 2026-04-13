---
title: "018 / 011 — Per-spec-folder graph metadata research"
description: "Ten-iteration design research for a dedicated packet-level graph metadata file."
trigger_phrases: ["018 011 research", "graph metadata research", "per spec folder graph metadata iterations"]
importance_tier: "critical"
contextType: "research"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/002-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed the 10-iteration design research and option synthesis"
    next_safe_action: "Use this research packet to implement graph metadata save and indexing follow-ons"
    key_files: ["research.md", "spec.md", "plan.md", "decision-record.md"]
---
# Research: 018 / 011 — Per-spec-folder graph metadata

<!-- ANCHOR:method -->
## Research Method

This packet was written from direct repo inspection of the current save/index/graph stack plus prior Phase 018 packet artifacts. Two tool caveats affected the pass:

- `memory_match_triggers` returned a cancellation instead of usable output, so memory context was rebuilt from the global memory registry and packet docs.
- CocoIndex MCP and CLI semantic search were both unavailable in this sandbox; the CLI failed on daemon log permissions, so concept discovery fell back to direct file inspection and exact search.

That means every conclusion below is tied to the live repo files that were read in this turn.
<!-- /ANCHOR:method -->

<!-- ANCHOR:sources -->
## Sources Inspected

- Graph ingestion and edge processing: [causal-links-processor.ts](../../../../../skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts), [reconsolidation.ts](../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts), [causal-edges.ts](../../../../../skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- Save path and metadata helpers: [generate-context.ts](../../../../../skill/system-spec-kit/scripts/memory/generate-context.ts), [workflow.ts](../../../../../skill/system-spec-kit/scripts/core/workflow.ts), [memory-metadata.ts](../../../../../skill/system-spec-kit/scripts/core/memory-metadata.ts)
- Discovery and ranking: [memory-index-discovery.ts](../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts), [stage1-candidate-gen.ts](../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts), [vector-index-schema.ts](../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
- Parent packet context: [../spec.md](../spec.md), [../plan.md](../plan.md), [../research/research.md](../research/research.md)
<!-- /ANCHOR:sources -->

## Iteration 1 — Current graph data sources audit

### What feeds the graph today

1. `memory_index` is still the main metadata substrate. Its schema stores `trigger_phrases`, `importance_weight`, `importance_tier`, `context_type`, `document_type`, `created_at`, `last_accessed`, `content_text`, and related ranking signals.
2. `causal_edges` stores directed relations between resolved IDs with relation, strength, evidence, `created_by`, `last_accessed`, and optional anchor columns.
3. `memory-parser.ts` extracts title, trigger phrases, context type, importance tier, document type, and `causalLinks` from saved content.
4. `causal-links-processor.ts` maps parsed `causalLinks` keys (`caused_by`, `supersedes`, `derived_from`, `blocks`, `related_to`) onto the graph relation enum and resolves references by ID, file path, or title before inserting edges.
5. `reconsolidation.ts` creates `supersedes` edges during merge/conflict flows and carries trigger phrases plus importance tier into new `memory_index` rows.
6. `stage1-candidate-gen.ts` and the trigger matcher still rank and filter using indexed row metadata such as `importance_tier`, `importance_weight`, `quality_score`, `context_type`, and `trigger_phrases`.

### What legacy memory files used to contribute

The old memory-file contract supplied a convenient, packet-scoped metadata bundle:

- frontmatter trigger phrases
- explicit importance tier and weight
- `causalLinks` references that mapped directly into `causal_edges`
- packet/session context metadata
- compact references to files, decisions, and related packets

That bundle arrived as one indexed row and one parseable document per save.

### What is lost post-018

- `autoPopulateCausalLinks()` in `memory-metadata.ts` still scans a `memory/` directory for predecessor context. If `memory/` is gone, the helper simply returns existing links and contributes nothing new.
- `generate-context`/workflow currently updates `description.json` only when a legacy context markdown file was actually written (`ctxFileWritten`). That gate is wrong for a canonical-doc future.
- `_memory.continuity` does not currently carry the full packet graph state. It covers packet pointer, recent action, next action, blockers, key files, completion percent, and session dedup, but not explicit packet relationships, entity refs, or durable packet status history.
- Within `006-continuity-refactor-gates/`, there are no `memory/` directories and no `description.json` files, which is a concrete example of the current gap.

### Iteration 1 conclusion

The graph stack itself is not gone. The missing piece is a durable packet-level metadata producer that can emit relationships and ranking signals without relying on legacy `memory/*.md` saves.

## Iteration 2 — What metadata does the graph need?

### Minimum viable metadata for graph usefulness

The graph needs seven groups of packet-level signals:

1. **Identity and hierarchy**
   - `packet_id`
   - `spec_folder`
   - `parent_id`
   - `children_ids[]`
2. **Cross-packet edges**
   - `depends_on[]`
   - `supersedes[]`
   - `related_to[]`
3. **Retrieval signals**
   - `trigger_phrases[]`
   - `key_topics[]`
   - `causal_summary`
4. **File ownership**
   - `key_files[]`
5. **Packet state**
   - `status`
   - `importance_tier`
6. **Timeline**
   - `created_at`
   - `last_save_at`
   - `last_accessed_at`
7. **Entity references**
   - `entities[]`

### Why each group matters

- cross-packet edges power `depends-on`, `supersedes`, and "what is related to this packet?" queries
- trigger phrases and key topics support folder discovery, packet search, and resume ranking
- key files help resume and search return the right packet when the user names an owned surface
- status and importance let packet rows rank differently from archived or completed work
- entity references bridge packet docs to code-aware queries

### Iteration 2 conclusion

The graph needs a packet-level summary row, not just a prose document and not just doc-local resume hints.

## Iteration 3 — File format + location

### Options scored

Scores use `1` (weak) to `5` (strong).

| Option | Discoverability | Maintainability | Indexing Speed | Query Usefulness | Backwards Compatibility | Total | Verdict |
|--------|-----------------|-----------------|----------------|------------------|-------------------------|-------|---------|
| A. `graph-metadata.json` in folder root | 5 | 5 | 5 | 5 | 4 | 24 | Best |
| B. `graph-metadata.yaml` in folder root | 4 | 4 | 3 | 5 | 4 | 20 | Acceptable, but unnecessary parser risk |
| C. Extend `_memory.continuity` in doc frontmatter | 2 | 2 | 2 | 3 | 3 | 12 | Too thin, too distributed |
| D. Extend `description.json` | 4 | 2 | 5 | 3 | 2 | 16 | Wrong concern boundary |

### Why Option A wins

- JSON is deterministic, schema-friendly, and easy to atomically rewrite.
- One root file matches the packet-level nature of the metadata.
- Discovery is simple and cheap: scan spec folders for one known filename.
- Existing search/index code already knows how to store JSON-derived signals in `memory_index`.

### Why the others lose

- **YAML** adds readability but no meaningful runtime benefit and more parser complexity.
- **`_memory.continuity`** is attached to specific docs, not folders; it is sparse today and should stay small.
- **`description.json`** is used for folder discovery, contextual headers, `memorySequence`, and `memoryNameHistory`. It is already missing from many valid folders and should not become a high-churn graph document.

### Iteration 3 conclusion

Recommend Option A, with a hybrid operational model: `graph-metadata.json` for packet graph state, `_memory.continuity` for resume hints, `description.json` for discovery/tracking.

## Iteration 4 — Schema design

### Recommended schema shape

```json
{
  "schema_version": 1,
  "packet_id": "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/002-spec-folder-graph-metadata",
  "spec_folder": "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/002-spec-folder-graph-metadata",
  "parent_id": "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit",
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

### Field table

| Field | Type | Auto or Manual | Graph benefit |
|-------|------|----------------|---------------|
| `schema_version` | number | auto | safe parsing and migration |
| `packet_id` | string | auto | stable node identity |
| `spec_folder` | string | auto | lookup, filtering, joins |
| `parent_id` | string or null | auto | hierarchy edges |
| `children_ids` | string[] | auto | hierarchy traversal |
| `manual.depends_on` | packet-ref[] | manual | dependency edges |
| `manual.supersedes` | packet-ref[] | manual | supersession edges |
| `manual.related_to` | packet-ref[] | manual | soft affinity edges |
| `derived.trigger_phrases` | string[] | auto | trigger matching and search |
| `derived.key_topics` | string[] | auto/AI-assisted | concept search and clustering |
| `derived.importance_tier` | string | auto with optional manual override later | ranking |
| `derived.status` | enum | auto with optional manual override later | active vs complete vs blocked ranking |
| `derived.key_files` | string[] | auto | resume and file-to-packet lookup |
| `derived.entities` | entity-ref[] | auto/AI-assisted | code and API lookup |
| `derived.causal_summary` | string | auto/AI-assisted | compact semantic packet description |
| `derived.created_at` | ISO string | auto | history |
| `derived.last_save_at` | ISO string | auto | freshness |
| `derived.last_accessed_at` | ISO string or null | runtime-updated | recency |
| `derived.source_docs` | string[] | auto | provenance and debugging |

### Type details

- `packet-ref` should include at least `packet_id`, `reason`, and `source`
- `entity-ref` should include at least `name`, `kind`, `path`, and `source`

### Iteration 4 conclusion

The schema should separate manual relationship edits from fully regenerated derived signals. That keeps automated refresh deterministic without trampling human judgment.

## Iteration 5 — Auto-generation during save

### What can be auto-computed

- `packet_id`, `spec_folder`, `parent_id`, `children_ids` from the path structure
- `status` from packet frontmatter and task/checklist completion
- `importance_tier` from packet frontmatter
- `trigger_phrases` from packet doc frontmatter
- `key_files` from `_memory.continuity.key_files`, save payload, and canonical doc references
- `created_at` and `last_save_at`
- `causal_summary` from the packet description plus recent action

### What needs AI inference or richer heuristics

- `key_topics` when packet descriptions are too narrow
- `entities[]` from doc references, filenames, code symbols, or API mentions
- summary cleanup when doc text is noisy

### What should remain manual

- `depends_on`
- `supersedes`
- high-confidence `related_to` links that imply intentional packet coupling

### Update strategy

Use **merge, not blind overwrite**:

1. Load existing `graph-metadata.json` if present
2. Preserve `manual.*`
3. Recompute all `derived.*`
4. Atomically rewrite the file

### Critical implementation note

Today the workflow updates `description.json` only when `ctxFileWritten` is true. Graph metadata must not repeat that mistake. The refresh step has to run on the canonical save path even when no legacy memory markdown file is emitted.

### Iteration 5 conclusion

The right lifecycle is "manual relationships preserved, derived fields fully refreshed, canonical save path authoritative."

## Iteration 6 — Graph indexing integration

### Discovery

Add a new discovery branch in `memory-index-discovery.ts`:

- scan valid spec folders for `graph-metadata.json`
- skip `scratch/`, `memory/`, `iterations/`, and `z_archive/` like the spec-doc scanner already does

### Storage in `memory_index`

Index one row per folder with:

- `document_type = 'graph_metadata'`
- `spec_folder` = containing packet path
- `file_path` = `.../graph-metadata.json`
- `title` = `"Graph metadata: <packet title or folder slug>"`
- `trigger_phrases` = `derived.trigger_phrases`
- `importance_tier` / `importance_weight` from derived status mapping
- `content_text` = normalized summary made from `causal_summary`, topics, relationships, key files, and entities

### How graph edges should be created

Do not introduce a new graph table. Instead:

1. resolve each packet's `graph_metadata` row in `memory_index`
2. resolve `manual.depends_on`, `manual.supersedes`, and `manual.related_to` target packet rows
3. insert or upsert `causal_edges` between those row IDs

Suggested mapping:

- `depends_on` -> `enabled` edge from dependency -> packet
- `supersedes` -> `supersedes` edge from packet -> older packet
- `related_to` -> `supports` edge, symmetric or mirrored by convention

### Search ranking impact

`stage1-candidate-gen.ts` should recognize `graph_metadata` rows as high-signal candidates for:

- packet dependency queries
- "what touched X?" queries
- packet discovery by concept
- resume/planning surfaces

That likely means:

- include `document_type` in batch fetches that currently omit it
- add a small ranking boost when `document_type='graph_metadata'` and query intent looks packet-oriented

### Iteration 6 conclusion

The index path can stay evolutionary: one new file type, one new discovery step, one new `document_type`, and reused graph tables.

## Iteration 7 — Retroactive population

### Current repo size

Measured in this repo:

- raw `spec.md` count under `.opencode/specs`: `578`
- raw `description.json` count: `406`
- index-like spec folders after excluding `scratch/`, `memory/`, `iterations/`, `z_archive/`, and `node_modules`: `358`
- index-like folders still missing `description.json`: `138`
- index-like spec folders under `026-graph-and-context-optimization`: `48`
- `description.json` files under `026-graph-and-context-optimization`: `25`

### Backfill plan

Build a script that:

1. walks valid spec folders
2. reads `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, and `description.json` when present
3. derives identity, hierarchy, status, trigger phrases, key files, and summary fields
4. emits empty manual relationship arrays by default
5. flags packets needing human review for:
   - missing packet title/description
   - ambiguous status
   - no implementation summary
   - likely cross-packet dependencies inferred only from prose

### Estimated implementation effort

- backfill script: about `250-350` LOC TypeScript
- parser/helpers/tests: about `150-250` LOC
- migration/reporting docs: about `100` LOC

### Review burden

Most folders should auto-populate identity, topics, files, and status. Manual review should focus on the relationship arrays because that is where semantics are riskiest.

### Iteration 7 conclusion

Backfill is practical, but it should be schema-first and warning-driven. The repo is too inconsistent to treat `description.json` coverage as a prerequisite.

## Iteration 8 — Impact on existing workflows

### `/memory:save`

- add a graph-metadata refresh step after canonical save completion
- derive packet metadata from packet docs and save payload
- index the file after writing it

### `/spec_kit:resume`

- can optionally read `graph-metadata.json` for packet-level dependencies, key files, and status
- should still treat `_memory.continuity` as the fast path for "what was I just doing?"

### `/memory:search`

- can rank `graph_metadata` rows highly for packet-oriented queries
- can use relationships to boost related packets without relying on prose-only links

### `validate.sh`

- should validate schema correctness once the file exists
- should likely enforce presence in warning-first mode until backfill is complete

### `/spec_kit:plan` and `/spec_kit:complete`

- `/spec_kit:plan` should scaffold an empty or minimally valid `graph-metadata.json`
- `/spec_kit:complete` can update terminal state such as `status=complete` and final `last_save_at`

### Iteration 8 conclusion

The new file touches plan/save/index/validate/resume, but in each case it is additive and packet-local rather than a full workflow rewrite.

## Iteration 9 — Comparison with `description.json`

### What `description.json` has today

From `folder-discovery.ts`, `description.json` carries:

- `specFolder`
- `description`
- `keywords`
- `lastUpdated`
- `specId`
- `folderSlug`
- `parentChain`
- `memorySequence`
- `memoryNameHistory`

That contract is about folder identity, lightweight discovery text, and save-history tracking.

### What graph metadata still needs beyond that

- packet relationship arrays
- status and importance as graph/ranking signals
- key files
- entity references
- packet causal summary
- graph-oriented timestamps such as `last_save_at` and `last_accessed_at`

### Why not extend `description.json`

1. It mixes stable identity metadata with high-churn graph state.
2. The file is already missing in many valid folders.
3. Existing consumers of `description.json` expect simple discovery/tracking semantics.
4. Save-history fields like `memorySequence` are operationally different from graph relationships and packet state.

### Iteration 9 conclusion

Separation of concerns is better:

- `description.json` = folder discovery and save-history tracking
- `_memory.continuity` = doc-local resume hints
- `graph-metadata.json` = packet-level graph and ranking state

## Iteration 10 — Recommendation + implementation plan

### Recommended option

**Option A with a small hybrid rule set**:

- create `graph-metadata.json` in each spec-folder root
- keep `_memory.continuity` unchanged as the thin doc-local continuity surface
- keep `description.json` unchanged as the folder identity/tracking surface

### Final schema

Use the schema from Iteration 4 with:

- canonical packet identity at the top level
- `manual` relationship buckets
- `derived` operational and ranking buckets

### Implementation phases

1. **Schema and parser**
   - JSON schema
   - parser helpers
   - unit tests
2. **Save-path integration**
   - canonical refresh hook in `generate-context.js` / workflow
   - atomic write and merge of manual + derived sections
3. **Index and graph integration**
   - discovery in `memory-index-discovery.ts`
   - `document_type='graph_metadata'`
   - packet-edge upsert into `causal_edges`
   - ranking boosts in `stage1-candidate-gen.ts`
4. **Backfill and validation**
   - script active spec inventory
   - warning-first validation rollout
5. **Workflow adoption**
   - resume/search improvements
   - packet-create scaffolding

### Migration strategy

- generate files for all active spec folders first
- keep missing-file validation at warning severity during backfill
- promote to error only after coverage is acceptable and the create/save path is live

### Risk assessment

- highest risk: attaching refresh to the wrong save hook and recreating a legacy-only blind spot
- second risk: overloading `description.json` or `_memory.continuity` instead of keeping the boundaries clean
- third risk: allowing derived refresh to overwrite manual relationship edits

### Final conclusion

The repo does not need a new graph database. It needs a packet-level metadata producer. `graph-metadata.json` is the smallest change that restores that producer while respecting the architectural direction of Phase 018.
