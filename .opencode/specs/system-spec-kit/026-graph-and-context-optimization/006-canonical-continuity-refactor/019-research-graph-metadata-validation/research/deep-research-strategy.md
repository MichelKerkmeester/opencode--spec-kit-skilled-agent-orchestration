---
title: Deep Research Strategy
topic: Graph metadata relationship validation and entity quality analysis
session_id: 822fe8b4-5d8c-4396-8568-9152934f4337
lineage_mode: completed-continue
generation: 3
status: complete
---

# Deep Research Strategy

## Topic
Graph metadata relationship validation and entity quality analysis across the live `.opencode/specs/` corpus.

Wave 2 (`completed-continue`) extends the first ten iterations from defect discovery into remediation design: identify the smallest safe parser/backfill changes for status derivation, key-file sanitization, entity de-duplication, legacy normalization, and trigger-phrase cap enforcement.

Wave 3 (`completed-continue`) is the convergence/handoff pass: freeze the exact `key_files` predicate, turn the safer status rule into pseudo-code, verify trigger-cap ownership, and produce a line-by-line implementation map for phases `001`-`004`.

## Key Questions
- [x] RQ-1: Four declared `depends_on` edges exist in the current corpus and all four resolve to real spec folders. Broken-edge rate: 0.0%.
- [x] RQ-2: No dependency cycles were found in the live graph. The current dependency graph is sparse rather than cyclic.
- [x] RQ-3: `children_ids` match actual child directories when compared against the same specs-root-relative path base used by the metadata. Ghost-child rate: 0.0%.
- [x] RQ-4: `key_files` resolve only 59.87% of the time under a three-base heuristic (`repo root`, `spec-relative`, `skill-relative`). 40.13% are missing, with bare tokens and path-like misses dominating.
- [x] RQ-5: 2,020 basename-only duplicate entities appear across 270 folders. Duplicate/noise behavior is systemic, not isolated.
- [x] RQ-6: Status quality is poor. 259 of 344 folders are still `planned` even though `implementation-summary.md` exists beside the metadata.
- [x] RQ-7: The current limits are misaligned with real output. 291 folders hit the 16-entity cap, 159 folders hit the 20-key-file cap, and 216 folders exceed the intended 12-trigger-phrase ceiling.
- [x] RQ-8: 130 folders have stale `last_save_at` timestamps when compared with current canonical-doc mtimes. Legacy fallback files worsen this because their synthetic timestamps collapse to epoch defaults in compatibility mode.

## Follow-On Remediation Questions
- [x] FQ-1: What is the smallest `deriveStatus()` change that recognizes `implementation-summary.md` as a completion signal without masking checklist state?
- [x] FQ-2: Which `key_files` filter removes the most junk with the least risk, and what improvement does it produce on the live corpus?
- [x] FQ-3: Where exactly should basename-level de-duplication be inserted in `deriveEntities()`, and how much noise would it remove?
- [x] FQ-4: What is the safest way to normalize legacy graph-metadata files in batch, and is the current active corpus still affected?
- [x] FQ-5: Why do `trigger_phrases` exceed the packet contract, and what is the minimal enforcement patch?

## Convergence Questions
- [x] CQ-1: What is the exact regex/filter predicate phase `002-sanitize-key-files` should ship, and what does the explicit bash + jq rerun show on the live corpus?
- [x] CQ-2: Where exactly should basename de-duplication be inserted in `deriveEntities()`, and should canonical packet-doc paths replace non-canonical collisions?
- [x] CQ-3: What is the exact checklist-aware pseudo-code for the safer `deriveStatus()` patch?
- [x] CQ-4: Is the 12-item `trigger_phrases` cap enforced in the parser, schema, or backfill, and which layer should own it?
- [x] CQ-5: What is the concrete line-by-line change map for each child implementation phase plus the adjacent trigger-cap cleanup?

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
- As of 2026-04-13 the active corpus has drifted from the original 344-file snapshot: there are now 360 active `graph-metadata.json` files and all of them parse as JSON.
- `check-completion.sh` already defines a reusable completion contract for `checklist.md`, so checklist completion does not need to be redefined inside the graph parser.

## Productive Approaches
- Read schema/parser/backfill code before corpus-level judgments.
- Normalize scans to the same specs-root-relative path base that `spec_folder`, `children_ids`, and manual dependency strings actually use.
- Treat legacy text files as loadable compatibility inputs, not raw JSON failures, because the parser explicitly supports them.
- Cross-check suspicious derived fields against actual packet docs on disk.
- Re-run live corpus counts before promoting the earlier 344-file metrics into implementation guidance.
- Separate “minimal patch” answers from “safer patch” answers so the follow-on implementation phases can pick scope deliberately.
- Freeze exact predicates and pseudo-code before comparing one convergence rerun against earlier synthesis counts.

## Exhausted Approaches
- Raw JSON-only parsing as a validity gate. It overstates failures because 35 files still load through the legacy text fallback.
- `dirname/$child` child checks. That scanner shape produces false ghosts because `children_ids` already store specs-root-relative paths.
- Status inference from metadata tables. The parser reads frontmatter scalars only, so markdown tables saying `In Progress` or `Complete` do not affect derivation.
- Regex-only key-file cleanup without a structural bare-filename rule. The narrow junk-pattern pass removes only 106 of 2,195 current misses.
- Unconditional “keep first basename wins” entity de-duplication. Because canonical packet docs are appended late, that rule can preserve `specs/.../spec.md` and suppress plain `spec.md`.

## Active Risks
- Status quality is currently the largest semantic risk because `deriveStatus()` only looks at frontmatter scalars, not packet tables or implementation-summary presence.
- Key-file quality is noisy enough to pollute downstream entity extraction, especially where commands, MIME types, version tags, and cross-root references are backticked in docs.
- Legacy-format files remain runtime-loadable, but they preserve weaker structure, empty entity arrays, and synthetic timestamps.
- Relationship coverage is thin. Integrity is good on the four declared dependencies, but the graph is too sparse for strong dependency analysis.
- An implementation-summary-only completion rule would flip 282 currently planned folders, but 63 of those also have a checklist that does not yet pass Spec Kit completion rules.
- Phase `004-normalize-legacy-files` is stale against the live corpus: there are currently zero legacy text files in active `.opencode/specs/`.

## Non-Goals
- No graph-metadata regeneration or source-code remediation.
- No historical memory-save analysis.
- No git operations or packet completion work outside the research deliverables.

## Stop Conditions
- Twenty-five iterations completed.
- All eight original questions, five remediation follow-ups, and five convergence questions addressed with code-backed evidence and live corpus measurements.
- Final synthesis updated under `research/`.

## Next Focus
Wave 3 complete. The next safe follow-on is to implement phases `001-fix-status-derivation`, `002-sanitize-key-files`, and `003-deduplicate-entities` in that order, retire or rewrite `004-normalize-legacy-files` as a guarded no-op helper, and decide whether the trigger-cap fix should become its own tiny child phase or travel with the parser edits already in scope.

## Findings Snapshot
- Active corpus scanned: 360 `graph-metadata.json` files under `.opencode/specs/`.
- Legacy text files in active corpus: 0.
- Relationship integrity: 4 of 4 `depends_on` edges resolve; 0 cycles; 0 ghost children.
- Key-file quality: the explicit Wave 3 bash + jq rerun found 2,207 unresolved entries; the exact safe predicate removes 1,498 of them (67.9%) while preserving canonical packet docs.
- Entity quality: current stored metadata has 5,674 entity rows, including 794 redundant name collisions across 234 folders; the convergence pass showed the de-duplication helper must prefer canonical packet-doc paths on basename collision.
- Status quality: 340 folders report `planned`; 282 of those already have `implementation-summary.md`, 180 also have a `COMPLETE` checklist, 39 have no checklist, and 63 have a checklist that is still not complete.
- Trigger quality: 185 folders exceed the intended 12-trigger cap, with 949 excess trigger phrases above the ceiling.
