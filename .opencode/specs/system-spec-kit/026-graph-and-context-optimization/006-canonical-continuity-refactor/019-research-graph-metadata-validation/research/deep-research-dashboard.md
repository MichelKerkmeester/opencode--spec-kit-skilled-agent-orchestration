# Deep Research Dashboard

## Lifecycle
- Topic: Graph metadata relationship validation and entity quality analysis
- Session ID: `cf705ba7-8ea3-429d-8ab5-db827b6bf050`
- Lineage mode: `new`
- Generation: `1`
- Iterations completed: `10 / 10`
- Current status: `complete`

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | Corpus inventory, schema, parser, and backfill baseline | 1.0 | 4 | complete |
| 2 | Legacy-format coverage and distribution baseline | 0.9 | 4 | complete |
| 3 | Validate depends_on edge resolution | 0.8 | 3 | complete |
| 4 | Validate children_ids integrity and cycle absence | 0.8 | 3 | complete |
| 5 | Validate key_files existence across the corpus | 0.7 | 4 | complete |
| 6 | Entity duplication, noise patterns, and cap pressure | 0.7 | 4 | complete |
| 7 | Status derivation rules versus implementation reality | 0.6 | 4 | complete |
| 8 | Status normalization edge cases and backfill review flags | 0.5 | 3 | complete |
| 9 | Distribution analysis and timestamp freshness | 0.4 | 4 | complete |
| 10 | Cross-question synthesis and remediation priorities | 0.3 | 4 | complete |

## Question Status
- Answered: 8 / 8
- `RQ-1`: answered
- `RQ-2`: answered
- `RQ-3`: answered
- `RQ-4`: answered
- `RQ-5`: answered
- `RQ-6`: answered
- `RQ-7`: answered
- `RQ-8`: answered

## Trend
- Last 3 `newInfoRatio` values: `0.5 -> 0.4 -> 0.3`
- Direction: descending
- Interpretation: the loop moved from discovery into synthesis rather than stalling early.

## Dead Ends
- JSON-only validation as the primary corpus-quality lens.
- `dirname/$child` checks against `children_ids`.
- Markdown status tables as parser inputs.
- Repo-root-only key-file resolution as the sole existence metric.

## Current Findings Snapshot
- Files scanned: `344`
- Legacy-format but runtime-loadable files: `35`
- `depends_on` edges: `4`, broken: `0`
- Dependency cycles: `0`
- Child links checked: `290`, ghosts: `0`
- Key files checked: `5,298`, resolvable: `3,172`, missing: `2,126`
- Basename duplicate entities: `2,020` across `270` folders
- Stored `planned` statuses: `302`
- `planned` despite `implementation-summary.md`: `259`
- Trigger sets over 12: `216`
- Entity lists at cap 16: `291`
- Stale `last_save_at`: `130`

## Next Focus
Deep-research loop complete. Recommended follow-on: open a remediation packet for status derivation, key-file sanitization, entity de-duplication, trigger-cap enforcement, and legacy JSON normalization.

## Active Risks
- Sparse relationship data can look healthier than it is because integrity is high but coverage is low.
- Status quality is materially unreliable for progress-sensitive retrieval and resume flows.
- Key-file and entity noise can pollute search, ranking, and graph-context recall.
- Freshness metrics are partially distorted by legacy compatibility timestamps.
