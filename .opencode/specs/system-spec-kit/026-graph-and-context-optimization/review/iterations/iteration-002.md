# Review Iteration 2: 001-research-graph-context-systems - Cross-Reference and 006 Links

## Focus
Cross-reference integrity between 001 research packet and 006-canonical-continuity-refactor child phases.

## Scope
- Review target: 001-research-graph-context-systems/graph-metadata.json, 026 root graph-metadata.json
- Dimension: cross-reference-integrity, graph-metadata-accuracy

## Findings

### P0-001: Root graph-metadata.json has 12 ghost children_ids pointing to archived/deleted folders
- Dimension: graph-metadata-accuracy
- Evidence: [SOURCE: graph-metadata.json:6-24 (root)]
- Impact: Any graph traversal, memory retrieval, or dependency analysis that walks children_ids will attempt to resolve 12 non-existent paths (005-provisional-measurement-contract, 006-structural-trust-axis-contract, 007-detector-provenance-and-regression-floor, 008-graph-first-routing-nudge, 009-auditable-savings-publication-contract, 010-fts-capability-cascade-floor, 011-graph-payload-validator-and-trust-preservation, 012-cached-sessionstart-consumer-gated, 013-warm-start-bundle-conditional-validation, 015-deprecate-context-prime-agent, 016-release-alignment, 017-memory-refactor-or-deprecation). All have been moved to z_archive/.
- Hunter: This is a critical structural integrity failure. The graph metadata is the canonical source of truth for packet relationships.
- Skeptic: Could these folders still be resolved via z_archive/? No -- the paths in children_ids use the root-level path, not z_archive/ path.
- Referee: Confirmed P0. Graph metadata must reflect actual disk layout. 12 of 18 listed children do not exist at the paths specified.
- Final severity: P0
- **FIXED**: Reduced children_ids to only the 6 actual directories on disk.

```json
{"type":"claim-adjudication","claim":"Root graph-metadata.json children_ids lists 12 folders that were moved to z_archive/ and no longer exist at the specified paths.","evidenceRefs":["graph-metadata.json:6-24","z_archive/ listing"],"counterevidenceSought":"Checked all 18 listed paths against disk. Only 6 exist. Verified z_archive contains the missing 12.","alternativeExplanation":"Children_ids might intentionally include archived items for historical reference. Rejected: graph-metadata is the live structural graph, not a history log.","finalSeverity":"P0","confidence":0.99,"downgradeTrigger":"If the graph-metadata spec explicitly defines children_ids as a historical record including archived items."}
```

### P1-003: Root graph-metadata.json status "planned" despite all phases being complete
- Dimension: status-accuracy
- Evidence: [SOURCE: graph-metadata.json:64 (root)]
- Impact: Root packet reported as "planned" misrepresents the program state.
- **FIXED**: Changed to "complete".

```json
{"type":"claim-adjudication","claim":"Root 026 graph-metadata status is planned but all child phases are complete.","evidenceRefs":["graph-metadata.json:64","implementation-summary.md:1-10"],"counterevidenceSought":"Checked if any child phase has incomplete tasks. All 5 root phases + 006 have implementation summaries.","alternativeExplanation":"Root could remain planned if the program itself has pending work items. Rejected: all execution phases are complete.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If a future phase is still being planned under this root."}
```

### P2-002: Root graph-metadata.json entities contain malformed proper_noun names with embedded newlines
- Dimension: graph-metadata-accuracy
- Evidence: [SOURCE: graph-metadata.json:130-139 (root)]
- Impact: Entities named "Problem Statement\n\nThe" and "Purpose\n\nProvide" are parser artifacts, not real entities.
- Final severity: P2
- **FIXED**: Removed both malformed entities.

## Ruled Out
- 001's children_ids in its own graph-metadata.json: Verified all 6 listed children (001-claude-optimization-settings through 006-research-memory-redundancy) exist on disk. No ghost references.

## Sources Reviewed
- graph-metadata.json (root)
- z_archive/ directory listing
- 001-research-graph-context-systems/graph-metadata.json
- Disk directory listing of 026 root

## Assessment
- Confirmed findings: 3 (1 P0, 1 P1, 1 P2)
- New findings ratio: 1.00
- noveltyJustification: First cross-reference iteration, all findings new. P0 override applies.
- Dimensions addressed: cross-reference-integrity, graph-metadata-accuracy, status-accuracy
