---
title: Deep Research Strategy
topic: Graph metadata relationship validation and entity quality analysis
session_id: 260a89b1-fff2-4889-bac7-8adfa5ff79a8
lineage_mode: completed-continue
generation: 5
status: complete
---

# Deep Research Strategy

## Topic
Graph metadata relationship validation and entity quality analysis across the live `.opencode/specs/` corpus.

Wave 2 (`completed-continue`) extended the first ten iterations from defect discovery into remediation design for status derivation, key-file sanitization, entity de-duplication, legacy normalization, and trigger-phrase cap enforcement.

Wave 3 (`completed-continue`) was the convergence and handoff pass: freeze the exact `key_files` predicate, turn the safer status rule into pseudo-code, verify trigger-cap ownership, and produce a line-by-line implementation map for phases `001`-`004`.

Wave 4 (`completed-continue`) was the post-implementation validation pass: rescan the live corpus after phases `001`-`003` and doc-alignment phase `005` landed, compare the original eight research questions before versus after remediation, manually inspect the remaining `planned` set, sample `key_files` and `entities`, and score overall graph-metadata health.

Wave 5 (`completed-continue`) revalidated corpus health after fixes F11-F15, confirmed command-shaped `key_files` are gone, rechecked status and trigger normalization, measured entity precision under the scoped path matcher, and stopped early once three consecutive iterations stayed below the novelty threshold.

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

## Revalidation Questions
- [x] RVQ-1: After F11, are command-shaped `key_files` entries actually gone from the stored active corpus, and what miss families remain?
- [x] RVQ-2: After F13 and F15, did status normalization, trigger-cap compliance, and freshness all converge cleanly, or do residual pockets remain?
- [x] RVQ-3: After F14, is entity precision now clean enough to stop, and what heuristic health score best reflects the remaining implementation-only hygiene?

## Research Boundaries
- Filesystem scan only.
- No historical saves or prior DB artifacts beyond the packet's own research records.
- Read-only against source graph metadata and implementation code.
- Write only under this packet's `research/` folder.

## Known Context
- `children_ids` are regenerated from direct numeric child directories under a spec folder.
- `status` is derived from ranked frontmatter first, then from `implementation-summary.md` plus checklist completion (`complete` / `in_progress` / `planned`) when frontmatter is absent.
- `key_files` are composed from filtered backticked file references plus canonical doc paths and capped at 20.
- `entities` de-duplicate by normalized name with canonical packet-doc path preference before truncating to 16 entries.
- `trigger_phrases` are capped at 12 inside `deriveGraphMetadata()`.
- The normalization map now folds whitespace and hyphen variants into canonical snake-case status values, so the old `in-progress` outlier class is gone from stored metadata.
- As of 2026-04-13 the active corpus contains `365` `graph-metadata.json` files excluding `z_archive`; `541` exist across the full `.opencode/specs/` tree.

## Productive Approaches
- Read schema, parser, and backfill code before making corpus-level judgments.
- Normalize scans to the same specs-root-relative path base that `spec_folder`, `children_ids`, and manual dependency strings actually use.
- Re-run live counts before promoting earlier snapshot numbers into synthesis.
- Separate parser regressions from stale backfill, explicit frontmatter intent, and packet-contract edge cases.
- When checking scoped entity paths, distinguish true cross-spec canonical-doc leaks from benign `research/research.md` relative references.

## Exhausted Approaches
- Raw JSON-only parsing as a validity gate.
- `dirname/$child` child checks against specs-root-relative `children_ids`.
- Status inference from markdown tables rather than frontmatter and checklist rules.
- Repo-root-only key-file resolution as the sole existence metric.
- Another discovery-only wave after the post-fix revalidation confirmed that only implementation hygiene remains.

## Active Risks
- Relationship integrity is excellent, but relationship coverage is still thin, so graph-level dependency reasoning remains low-signal.
- `key_files` still carry `847` unresolved entries in the active corpus, dominated by `749` path-like misses, `84` cross-track repo-relative paths, and `9` obsolete `memory/metadata.json` references.
- Entity duplicate noise is fixed, but precision pressure remains severe: all `365` active packets hit the 16-entity cap, one `python` artifact remains, and `9` true cross-spec canonical-doc leaks still survive.
- Two packets with complete checklists but no `implementation-summary.md` remain `planned`, which is now a packet-contract/documentation issue rather than a parser bug.

## Non-Goals
- No graph-metadata regeneration or source-code remediation.
- No historical memory-save analysis.
- No git operations or packet completion work outside the research deliverables.

## Stop Conditions
- Thirty-eight iterations completed.
- All eight original questions, five remediation follow-ups, five convergence questions, five post-implementation validation questions, and three revalidation questions answered with code-backed evidence and live corpus measurements.
- Three consecutive revalidation passes (`36`-`38`) stayed below the `0.1` novelty threshold without revealing a new defect class.
- Final synthesis updated under `research/`.

## Next Focus
Wave 5 complete. Stop the research loop. The remaining work is now one residual-hygiene implementation phase focused on `key_files` path canonicalization, obsolete memory-path cleanup, and entity prioritization plus the `9` surviving cross-spec canonical-doc leaks. A smaller optional follow-on can address the two complete-checklist packets that still lack `implementation-summary.md`.

## Findings Snapshot
- Active corpus scanned: `365` `graph-metadata.json` files under `.opencode/specs/` excluding `z_archive`; `541` exist across the full tree.
- Relationship integrity: `4 / 4` `depends_on` edges resolve; `0` broken dependencies; `0` ghost children; no structural regression observed.
- Key-file quality: `4,748` total `key_files`, `3,901` resolved (`82.16%`), `847` missing, and stored command-shaped entries are now `0`.
- Entity quality: `5,840` entity rows, average `16.00` per folder, `0` duplicate-name rows, `1` suspicious name (`python`), `9` true cross-spec canonical-doc leaks, and `365 / 365` cap hits.
- Status quality: `226` folders report `complete`, `90` `in_progress`, `49` `planned`, and `0` outlier values; `4` planned packets still have `implementation-summary.md` on disk because their canonical docs still declare `planned`.
- Trigger quality: `0` folders exceed the intended 12-trigger cap; maximum trigger count is `12`.
- Freshness: `0` packets are stale by current `source_docs` mtime comparison.
- Heuristic health score: `91 / 100` (`100` structure, `99` status/freshness, `82` key-files, `79` entities).
