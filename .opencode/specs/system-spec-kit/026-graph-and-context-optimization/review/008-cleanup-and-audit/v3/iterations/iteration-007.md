# Iteration 007: Traceability audit of the `feature_catalog_code` overlay

## Focus / scope summary
This iteration closed the pending `feature_catalog_code` overlay by auditing the live feature-catalog/current-reality docs for the `memory_index_scan` command surface and one closely adjacent runtime README that defines the canonical continuity hierarchy. The scope was limited to the generated catalog entry, its source feature doc, the live discovery helper, and the runtime README needed to adjudicate whether the catalog still describes a retired `memory/` continuity contract.

## Findings

### P0
- None.

### P1
- **F008**: feature-catalog docs still advertise retired spec-folder `memory/` indexing — `.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22` — Both the source feature doc and the generated `feature_catalog.md` current-reality text still say `memory_index_scan` discovers spec-folder memory files under `.opencode/**/memory/` and `specs/**/memory/*.md`, but the live discovery helper excludes `memory` directories from scanning and now only discovers spec documents plus constitutional markdown. That leaves the feature-catalog “current reality” surface documenting the retired continuity contract, which is a new traceability defect beyond `F006` and `F007`. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:649] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:56] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:74] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/README.md:38]

```json
{"type":"claim-adjudication","findingId":"F008","claim":"The live feature-catalog current-reality docs still claim that memory_index_scan discovers retired spec-folder memory files even though the shipped discovery helper excludes memory/ directories and keeps generated continuity artifacts secondary.","evidenceRefs":[".opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22",".opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:649",".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27",".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:56",".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:74",".opencode/skill/system-spec-kit/mcp_server/lib/README.md:38"],"counterevidenceSought":"Re-read the live discovery helper and adjacent runtime README for any surviving spec-folder memory-file discovery path or public statement that generated memory artifacts remain a primary continuity source.","alternativeExplanation":"The catalog text may be stale carry-over from the pre-cleanup scanner behavior rather than an intentional compatibility promise, but it is still published as current reality for a live command surface.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade if the runtime reintroduces supported spec-folder memory-file discovery or if the feature-catalog current-reality text is revised to describe spec documents and constitutional files only."}
```

### P2
- None.

## Protocol result
- `feature_catalog_code`: **fail** (moved from pending -> fail in iteration 007). The audited feature-catalog surfaces still describe retired spec-folder `memory/` indexing, while the live runtime excludes `memory/` directories and documents packet-doc-first continuity instead. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:649] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:27] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/README.md:38]

## Files reviewed
- `.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md`
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/README.md`

## Ruled-out paths
- The audited feature-catalog overlay did not surface any live `/memory:manage shared` guidance; the active defect is the stale `memory_index_scan` discovery description, not a resurrected shared-memory command surface. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:18] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:27]
- The adjacent runtime README still keeps packet continuity anchored to `handover.md -> _memory.continuity -> spec docs`, so the regression is confined to the feature-catalog current-reality layer rather than a broader live-runtime contract shift. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/README.md:38]

## Next-focus recommendation
Use iteration 008 for remediation-ready synthesis on the now-expanded residual cluster `F005` / `F006` / `F007` / `F008`, with specific fix guidance for the source feature doc and regenerated `feature_catalog.md`.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: The pending `feature_catalog_code` overlay moved from pending to fail because the audited feature-catalog surfaces still describe retired spec-folder `memory/` indexing even though the live discovery helper excludes `memory/` directories.
