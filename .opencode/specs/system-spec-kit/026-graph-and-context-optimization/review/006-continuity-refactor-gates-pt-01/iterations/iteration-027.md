# Iteration 27: Graph-metadata consistency across active 026 packets

## Focus
Reviewed active `graph-metadata.json` files under the 026 train, with emphasis on whether derived `key_files`, entity paths, and packet-level references stay canonical. The target was the live phase-006 branch plus the current cleanup packet outputs, not archived packets.

## Findings

### P0
- None.

### P1
- **F028**: Phase 012 graph metadata still stores shell commands as file paths — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/graph-metadata.json:58-59` — The derived `key_files` list and entity table still include the full Vitest command and an `rg` command string instead of canonical file paths. That means downstream consumers receive executable command text as if it were stable packet metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/graph-metadata.json:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/graph-metadata.json:136-145]
- **F029**: Phase 006 root graph metadata still carries ghost packet-relative paths — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/graph-metadata.json:77-85` — The root metadata publishes unresolved `lib/...` and `findings/...` paths as `key_files` and derived entities even though those paths do not exist under the phase root. That leaves the canonical packet graph with non-resolving references in the very packet that is supposed to define the continuity contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/graph-metadata.json:77-85] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/graph-metadata.json:161-182]

### P2
- None.

```json
{"type":"claim-adjudication","findingId":"F028","claim":"Phase 012 still emits shell command strings into graph-metadata key_files and entity paths.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/graph-metadata.json:58-60",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/graph-metadata.json:136-145"],"counterevidenceSought":"Checked whether those command strings were intentionally preserved as provenance notes rather than path-bearing metadata.","alternativeExplanation":"The backfill may be lifting literal shell snippets from docs, but the output still lands in path-bearing fields consumed as packet metadata.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if command strings are intentionally supported and downstream consumers explicitly ignore them during path resolution."}
```

```json
{"type":"claim-adjudication","findingId":"F029","claim":"The phase 006 root graph-metadata file still publishes unresolved packet-relative paths as canonical key_files and entities.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/graph-metadata.json:77-85",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/graph-metadata.json:161-182"],"counterevidenceSought":"Checked whether the phase root actually ships a local lib/ or findings/ tree that would make those paths resolve.","alternativeExplanation":"Some paths may be shorthand references to repo-root files, but in their current packet-relative form they still behave as ghost refs.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if the graph metadata contract explicitly treats those packet-relative strings as informal hints rather than resolvable file paths."}
```

## Ruled Out
- The 026 root packet no longer has ghost `children_ids`; its active child list resolves cleanly to `001` through `006`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:6-12]

## Dead Ends
- Packet `011` already documented the lower-severity basename-only duplication issue, so this iteration did not re-open that advisory absent stronger contradictory evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/review/011-spec-folder-graph-metadata/review-report.md:14-41]

## Recommended Next Focus
Verify that the continuity contract is still consistent across Public instruction surfaces and the live resume ladder, then finish with a security sweep of Public MCP configs and env blocks.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: This full metadata sweep found two new active graph-output defects beyond the earlier packet-011 advisory.
