# Deep Review Iteration 004 - Maintainability

## Focus

Dimension: maintainability

Reviewed root graph metadata, root description metadata, child description metadata, and 002 implementation summary.

## Findings

### P1 - DR-MNT-001 - Root graph metadata indexes only spec.md and omits completed child evidence

Evidence:
- `graph-metadata.json:6-9` lists `001-initial-research` and `002-skill-md-intent-router-efficacy` as children.
- `graph-metadata.json:31-49` exposes only `spec.md` as `key_files` and `source_docs`.
- `002-skill-md-intent-router-efficacy/graph-metadata.json:43-55` shows the child has richer canonical evidence, including research synthesis, validation, registry, state log, and implementation summary.

Impact:
Root-level graph retrieval can miss the completed evidence and return only the stale parent charter, making future agents more likely to re-run or misinterpret completed work.

### P1 - DR-MNT-002 - Migrated identity still mixes 021 and 004 numbering surfaces

Evidence:
- `spec.md:4-7` keeps trigger phrases under `021`.
- `spec.md:28-29` says the position in track is `021`.
- `description.json:11-13` says the current spec id is `004`.
- `002-skill-md-intent-router-efficacy/description.json:15-20` keeps `021-smart-router-context-efficacy` in `parentChain`.

Impact:
The migration aliases are useful, but leaving the old id in primary trigger and parent-chain surfaces makes search, graph traversal, and resume flows harder to reason about.

## Delta

New findings: 2 P1
Repeated findings: 0
Severity-weighted newFindingsRatio: 0.31

## Convergence Check

Continue. All four dimensions are now covered at least once, but new P1 churn remains high.
