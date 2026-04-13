---
title: Deep Research Strategy
topic: Graph metadata relationship validation and entity quality analysis
session_id: 937db887-8922-4028-b13d-4eeca0e16d8f
lineage_mode: completed-continue
generation: 4
status: complete
---

# Deep Research Strategy

## Topic
Graph metadata relationship validation and entity quality analysis across the live `.opencode/specs/` corpus.

Wave 2 (`completed-continue`) extends the first ten iterations from defect discovery into remediation design: identify the smallest safe parser/backfill changes for status derivation, key-file sanitization, entity de-duplication, legacy normalization, and trigger-phrase cap enforcement.

Wave 3 (`completed-continue`) is the convergence/handoff pass: freeze the exact `key_files` predicate, turn the safer status rule into pseudo-code, verify trigger-cap ownership, and produce a line-by-line implementation map for phases `001`-`004`.

Wave 4 (`completed-continue`) is the post-implementation validation pass: rescan the live corpus after phases `001`-`003` and doc-alignment phase `005` landed, compare the original eight research questions before versus after remediation, manually inspect the remaining `planned` set, sample `key_files` and `entities`, and score overall graph-metadata health.

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

## Post-Implementation Validation Questions
- [x] PVQ-1: After the updated parser plus backfill, how do the eight original question metrics compare to the first 344-folder scan?
- [x] PVQ-2: Are the 56 remaining `planned` folders genuinely planned, or do stale or missed derivations still remain?
- [x] PVQ-3: Do sampled `key_files` now point to real files, and what residual miss families still survive?
- [x] PVQ-4: Do post-dedup `entities` still contain meaningful noise, and what is the average entity density now?
- [x] PVQ-5: What heuristic health score best summarizes graph metadata quality after implementation, and what should the next improvement phase target?

## Research Boundaries
- Filesystem scan only.
- No historical saves or prior DB artifacts.
- Read-only against source graph metadata and implementation code.
- Write only under this packet's `research/` folder.

## Known Context
- `children_ids` are regenerated from direct numeric child directories under a spec folder.
- `status` is now derived from ranked frontmatter first, then from `implementation-summary.md` plus checklist completion (`complete` / `in_progress` / `planned`) when frontmatter is absent.
- `key_files` are composed from filtered backticked file references plus canonical doc paths and capped at 20.
- `entities` now de-duplicate by normalized name with canonical packet-doc path preference, then add extracted names up to 16 total entries.
- `trigger_phrases` are now capped at 12 inside `deriveGraphMetadata()`.
- As of 2026-04-13 the active corpus has drifted again from the earlier 360-file snapshot: there are now 364 active `graph-metadata.json` files excluding `z_archive`, and 540 across the full `.opencode/specs/` tree.
- `check-completion.sh` already defines a reusable completion contract for `checklist.md`, so checklist completion does not need to be redefined inside the graph parser.

## Productive Approaches
- Read schema/parser/backfill code before corpus-level judgments.
- Normalize scans to the same specs-root-relative path base that `spec_folder`, `children_ids`, and manual dependency strings actually use.
- Treat legacy text files as loadable compatibility inputs, not raw JSON failures, because the parser explicitly supports them.
- Cross-check suspicious derived fields against actual packet docs on disk.
- Re-run live corpus counts before promoting the earlier 344-file metrics into implementation guidance.
- Separate “minimal patch” answers from “safer patch” answers so the follow-on implementation phases can pick scope deliberately.
- Freeze exact predicates and pseudo-code before comparing one convergence rerun against earlier synthesis counts.
- When validating post-implementation quality, separate parser regressions from stale backfill lag by checking `derived.source_docs`, `derived.last_save_at`, and the current packet docs side by side.
- Use one consistent scan boundary (`exclude z_archive`) for before/after comparisons, then report full-tree coverage separately so archive growth does not pollute active-corpus deltas.

## Exhausted Approaches
- Raw JSON-only parsing as a validity gate. It overstates failures because 35 files still load through the legacy text fallback.
- `dirname/$child` child checks. That scanner shape produces false ghosts because `children_ids` already store specs-root-relative paths.
- Status inference from metadata tables. The parser reads frontmatter scalars only, so markdown tables saying `In Progress` or `Complete` do not affect derivation.
- Regex-only key-file cleanup without a structural bare-filename rule. The narrow junk-pattern pass removes only 106 of 2,195 current misses.
- Unconditional “keep first basename wins” entity de-duplication. Because canonical packet docs are appended late, that rule can preserve `specs/.../spec.md` and suppress plain `spec.md`.

## Active Risks
- Relationship coverage is still thin. Integrity is excellent on the four declared dependencies, but the graph remains too sparse for strong dependency analysis.
- `key_files` still carry 881 unresolved entries in the active corpus, dominated by cross-track path misses, stale `memory/metadata.json` references, and shell-command snippets that the current predicate still lets through.
- Entity duplicate noise is fixed, but precision pressure remains because 360 of 364 active folders still fill the 16-entity cap.
- Three completed doc-alignment packets now look stale because their metadata still reports `planned`, lists only `spec.md` in `source_docs`, and predates the completion docs that landed afterward.
- One hyphenated `in-progress` value still escapes the intended `in_progress` normalization path.

## Non-Goals
- No graph-metadata regeneration or source-code remediation.
- No historical memory-save analysis.
- No git operations or packet completion work outside the research deliverables.

## Stop Conditions
- Thirty-five iterations completed.
- All eight original questions, five remediation follow-ups, five convergence questions, and five post-implementation validation questions addressed with code-backed evidence and live corpus measurements.
- Final synthesis updated under `research/`.

## Next Focus
Wave 4 complete. The immediate maintenance follow-on is a targeted backfill refresh for the three stale doc-alignment packets plus one normalization fix for `in-progress`. The next substantive improvement phase should target residual `key_files` and `entities` hygiene: suppress shell-command snippets and obsolete memory paths, normalize cross-track references, and reduce entity-cap saturation without reintroducing duplicate names.

## Findings Snapshot
- Active corpus scanned: 364 `graph-metadata.json` files under `.opencode/specs/` excluding `z_archive`; 540 exist across the full tree including archive.
- Relationship integrity: 4 of 4 `depends_on` edges resolve; 0 cycles; 0 ghost children across 309 child links.
- Key-file quality: 4,699 total `key_files`, 3,818 resolved (81.25%), 881 missing (18.75%), and a 50-entry manual sample resolved 47 of 50 entries.
- Entity quality: 5,796 entity rows across 363 folders, average 15.97 per folder, 0 duplicate-name rows, 3 suspicious names total, but 360 folders still hit the 16-entity cap.
- Status quality: 218 folders report `complete`, 89 `in_progress`, 56 `planned`, and 1 `in-progress`; only 10 `planned` folders still have `implementation-summary.md`, and just 3 of those now look clearly stale-complete rather than truly incomplete.
- Trigger quality: 0 folders exceed the intended 12-trigger cap; maximum trigger count is now 12.
- Freshness: only 3 folders have `last_save_at` older than the newest current source doc mtime.
