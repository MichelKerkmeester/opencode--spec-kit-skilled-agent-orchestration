---
title: Deep Research Strategy
topic: Graph metadata relationship validation and entity quality analysis
session_id: cf705ba7-8ea3-429d-8ab5-db827b6bf050
lineage_mode: new
generation: 1
status: active
---

# Deep Research Strategy

## Topic
Graph metadata relationship validation and entity quality analysis across the live `.opencode/specs/` corpus.

## Key Questions
- [x] RQ-1: Four declared `depends_on` edges exist in the current corpus and all four resolve to real spec folders. Broken-edge rate: 0.0%.
- [x] RQ-2: No dependency cycles were found in the live graph. The current dependency graph is sparse rather than cyclic.
- [x] RQ-3: `children_ids` match actual child directories when compared against the same specs-root-relative path base used by the metadata. Ghost-child rate: 0.0%.
- [x] RQ-4: `key_files` resolve only 59.87% of the time under a three-base heuristic (`repo root`, `spec-relative`, `skill-relative`). 40.13% are missing, with bare tokens and path-like misses dominating.
- [x] RQ-5: 2,020 basename-only duplicate entities appear across 270 folders. Duplicate/noise behavior is systemic, not isolated.
- [x] RQ-6: Status quality is poor. 259 of 344 folders are still `planned` even though `implementation-summary.md` exists beside the metadata.
- [x] RQ-7: The current limits are misaligned with real output. 291 folders hit the 16-entity cap, 159 folders hit the 20-key-file cap, and 216 folders exceed the intended 12-trigger-phrase ceiling.
- [x] RQ-8: 130 folders have stale `last_save_at` timestamps when compared with current canonical-doc mtimes. Legacy fallback files worsen this because their synthetic timestamps collapse to epoch defaults in compatibility mode.

## Research Boundaries
- Filesystem scan only.
- No historical saves or prior DB artifacts.
- Read-only against source graph metadata and implementation code.
- Write only under this packet's `research/` folder.

## Known Context
- `children_ids` are regenerated from direct numeric child directories under a spec folder.
- `status` is derived from ranked frontmatter on canonical packet docs, with `planned` as the fallback.
- `key_files` are composed from backticked file references plus canonical doc paths and capped at 20.
- `entities` start with `key_files`, then add extracted names up to 16 total entries.

## Productive Approaches
- Read schema/parser/backfill code before corpus-level judgments.
- Normalize scans to the same specs-root-relative path base that `spec_folder`, `children_ids`, and manual dependency strings actually use.
- Treat legacy text files as loadable compatibility inputs, not raw JSON failures, because the parser explicitly supports them.
- Cross-check suspicious derived fields against actual packet docs on disk.

## Exhausted Approaches
- Raw JSON-only parsing as a validity gate. It overstates failures because 35 files still load through the legacy text fallback.
- `dirname/$child` child checks. That scanner shape produces false ghosts because `children_ids` already store specs-root-relative paths.
- Status inference from metadata tables. The parser reads frontmatter scalars only, so markdown tables saying `In Progress` or `Complete` do not affect derivation.

## Active Risks
- Status quality is currently the largest semantic risk because `deriveStatus()` only looks at frontmatter scalars, not packet tables or implementation-summary presence.
- Key-file quality is noisy enough to pollute downstream entity extraction, especially where commands, MIME types, version tags, and cross-root references are backticked in docs.
- Legacy-format files remain runtime-loadable, but they preserve weaker structure, empty entity arrays, and synthetic timestamps.
- Relationship coverage is thin. Integrity is good on the four declared dependencies, but the graph is too sparse for strong dependency analysis.

## Non-Goals
- No graph-metadata regeneration or source-code remediation.
- No historical memory-save analysis.
- No git operations or packet completion work outside the research deliverables.

## Stop Conditions
- Ten iterations completed.
- All eight research questions addressed with corpus evidence and clear caveats where necessary.
- Final synthesis and dashboard written under `research/`.

## Next Focus
Synthesis complete. The next safe follow-on is a remediation packet that targets status derivation, key-file sanitization, trigger/entity cap enforcement, and legacy-file normalization.

## Findings Snapshot
- Corpus scanned: 344 `graph-metadata.json` files under `.opencode/specs/`.
- Legacy compatibility files: 35 (10.17% of corpus).
- Relationship integrity: 4 of 4 `depends_on` edges resolve; 0 cycles; 0 ghost children.
- Key-file quality: 3,172 of 5,298 entries resolve under heuristic base matching; 2,126 do not.
- Entity quality: 2,020 basename-only duplicates across 270 folders; 291 folders hit the 16-entity cap.
- Status quality: 302 folders report `planned`; 259 of those already have `implementation-summary.md`.
- Timestamp freshness: 130 folders have stale `last_save_at` compared to canonical-doc mtimes.
