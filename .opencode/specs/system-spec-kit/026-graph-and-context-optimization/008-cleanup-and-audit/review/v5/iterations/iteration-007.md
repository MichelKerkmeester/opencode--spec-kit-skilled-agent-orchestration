# Iteration 007: Feature-catalog and discovery-surface traceability sweep

## Focus
Traceability re-verification of the `memory_index_scan` feature catalog, handler-facing runtime contract, and manual testing playbook coverage.

## Findings
### P2 - Suggestion
- **F012**: the master catalog still describes older incremental scan mechanics. The consolidated feature catalog says incremental updates are keyed only off changed mtime and a simple cooldown, but the dedicated feature entry and handler now describe content-hash-sensitive bucketing plus an atomic scan lease. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:651] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:24] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:186]
- **F013**: operator-facing verification surfaces do not fully reflect the three-source scan contract. The dedicated and consolidated catalog entries both describe three active scan sources, including graph metadata, but the handler's returned hints enumerate only spec docs and constitutional files, and EX-014 only asks operators to prove spec-doc warn-only indexing. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:649] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:327] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:502]

## Closure Checks
- F008 remains closed in its core form: the reviewed catalog and handler surfaces still agree that spec documents are indexed in warn-only mode by default and that retired `specs/**/memory/*.md` is no longer an active discovery surface. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:20] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:647] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:401]
- F004 remains closed in this slice: the canonical continuity contract is still packet-doc anchored, with `handover.md` leading and `_memory.continuity` kept as supporting state rather than a standalone continuity artifact. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:365] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3429]

## Ruled Out
- No reviewed file reintroduced retired `specs/**/memory/*.md` as an active scan source. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:22]
- No reviewed file dropped spec-document warn-only indexing. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:647] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:405]
- No reviewed playbook text reverted to standalone continuity-artifact framing. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3429]

## Dead Ends
- `memory-index.ts` delegates underlying file discovery to helper modules outside this scoped slice, so this pass could confirm only the handler-visible/runtime-summary contract.
- The consolidated playbook references the detailed EX-014 feature file, but that linked file remained out of scope in this pass.

## Recommended Next Focus
Shift to security and maintainability passes so the loop can confirm no runtime or test regressions were introduced while traceability findings stabilize.
