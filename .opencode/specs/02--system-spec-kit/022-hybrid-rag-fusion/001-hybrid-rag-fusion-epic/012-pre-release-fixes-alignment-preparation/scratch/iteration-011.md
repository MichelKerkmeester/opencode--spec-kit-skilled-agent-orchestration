# Iteration 011: Snippets 11-21 Consistency

## Findings

Audit scope covered all snippet markdown files under numeric categories `11` through `21` in `.opencode/skill/system-spec-kit/feature_catalog` (**139 files total**).

1. **Category/master taxonomy is not 1:1 in this range**
   - The filesystem categories under review are `11--scoring-and-calibration` through `21--implement-and-remove-deprecated-features`.
   - The master catalog does **not** expose those as a clean `11`-through-`21` section mapping. Instead, the numbered master sections begin at `## 12. SCORING AND CALIBRATION` and run through `## 21. FEATURE FLAG REFERENCE`, while folders `20--remediation-revalidation` and `21--implement-and-remove-deprecated-features` are only covered in the top-level **Audit Phase Coverage Notes** table.
   - Evidence: `FEATURE_CATALOG.md:42-48,1801,2227,2427,2939,3366,3544,3887,3985,4302,4368`.
   - Result: per-folder review is still possible, but master traceability in this range is structurally offset and partially indirect.

2. **Frontmatter/category matching is only partially enforceable; `Group:` drift is widespread**
   - Frontmatter contains `title` and `description`, but no explicit category key, so strict frontmatter-to-parent-category equality is not directly testable.
   - Using `## 4. SOURCE METADATA` `Group:` as the category proxy, **38/139** files drift from their parent folder name.
   - Drift counts by folder:
     - `11--scoring-and-calibration`: **4**
     - `13--memory-quality-and-indexing`: **3**
     - `14--pipeline-architecture`: **11**
     - `15--retrieval-enhancements`: **3**
     - `16--tooling-and-scripts`: **4**
     - `18--ux-hooks`: **13**
   - Typical pattern: provenance/review labels are being used where category labels would be expected, for example:
     - `11--scoring-and-calibration/13-scoring-and-fusion-corrections.md` uses `Group: Opus review remediation (Phase 017)`.
     - `16--tooling-and-scripts/04-dead-code-removal.md` uses `Group: Comprehensive remediation (Sprint 8)`.
     - All 13 reviewed files in `18--ux-hooks` use `Group: UX hooks automation (Phase 014)` rather than the parent category label.

3. **Implementation status vs code reality is only directly verifiable on a small subset, but the explicit status files checked were aligned**
   - Most files in this range still do **not** use a consistent explicit `Implemented/Planned/Deprecated` status field, so status verification is largely inferred from `CURRENT REALITY` prose rather than a formal snippet status taxonomy.
   - Explicit status samples that were directly checked:
     - `13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md` says `Status: Implemented` and is backed by live scripts/tests including `scripts/loaders/data-loader.ts`, `scripts/utils/input-normalizer.ts`, and `scripts/tests/outsourced-agent-handback-docs.vitest.ts`.
     - `13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md` says `Status: Implemented and covered by targeted Vitest regressions` and is backed by live implementation/test files such as `scripts/core/workflow.ts` and `scripts/tests/session-enrichment.vitest.ts`.
     - `16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` says `Status: Implemented and strongly verified` and all cited core script/test files still exist.
     - `14--pipeline-architecture/15-warm-server-daemon-mode.md` says `PLANNED (Sprint 019): DEFERRED`; that matches live code reality because the server still initializes `StdioServerTransport` in `mcp_server/context-server.ts:15-17`, and no shipped HTTP daemon transport surfaced in the reviewed source tree.
   - Result: no direct contradiction was found in the explicit status snippets reviewed, but status coverage remains weak/informal at category scale.

4. **Source-file traceability is mostly good, but 6 current file-path references are stale/missing**
   - Checked **3,319** referenced file paths across backticked source-file entries and markdown links.
   - **6** references do not resolve on disk:
     - `11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`
       - `mcp_server/lib/search/rsf-fusion.ts`
       - `mcp_server/tests/rsf-fusion-edge-cases.vitest.ts`
       - `mcp_server/tests/rsf-fusion.vitest.ts`
     - `16--tooling-and-scripts/04-dead-code-removal.md`
       - `mcp_server/lib/search/rsf-fusion.ts`
     - `16--tooling-and-scripts/05-code-standards-alignment.md`
       - `mcp_server/lib/search/rsf-fusion.ts`
     - `17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`
       - `mcp_server/lib/governance/retention.ts`
   - Important nuance: several of these are intentionally described as **deleted** historical modules. They are still valid audit history, but they fail the strict “referenced code files exist” check as currently written and should be reframed or separated from live source inventories.
   - Supporting evidence:
     - The deleted RSF path is still cited in the snippet files above, but no `mcp_server/lib/search/rsf-fusion.ts` exists in the live tree.
     - The governance snippet explicitly marks `retention.ts` as deleted, and only `mcp_server/lib/governance/scope-governance.ts` exists under `mcp_server/lib/governance/`.

5. **Actual MCP tool names stayed aligned; no real tool-name mismatches were found**
   - Cross-checked snippet tool references against the live MCP tool registry in `mcp_server/tool-schemas.ts` (**33 tool definitions** from `memory_context` through `memory_ingest_cancel`).
   - **26** files in this range mention real MCP tool names, totaling **41** actual tool mentions.
   - No snippet in this scope was found to misname a real MCP tool.
   - A few backticked underscore identifiers look tool-like at first glance but are **not** tools:
     - `shared_memory_enabled` is a persisted config key, not a tool.
     - `memory_index`, `memory_entities`, `memory_count`, `memory_id`, `memory_history`, `memory_conflicts`, and `memory_summaries` are internal/storage identifiers, not tool names.
   - Result: tool-name consistency is a **pass** in this review window.

6. **Master catalog link coverage is incomplete for 4 files**
   - These snippet files are not linked directly from `FEATURE_CATALOG.md`:
     - `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md`
     - `19--feature-flag-reference/08-audit-phase-020-mapping-note.md`
     - `20--remediation-revalidation/01-category-stub.md`
     - `21--implement-and-remove-deprecated-features/01-category-stub.md`
   - Notes:
     - `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md` is referenced elsewhere (for example from `16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md`, `17--governance/01-feature-flag-governance.md`, and the manual testing playbook), so this looks like a real master-catalog omission rather than an unused file.
     - The `20` and `21` stub files are semantically represented by the top-level **Audit Phase Coverage Notes** table (`FEATURE_CATALOG.md:42-48`), but the stub files themselves are still orphaned at direct per-file master-link level.

7. **Most stale-claim risk in this slice is traceability-oriented, not tool/status-oriented**
   - The strongest stale patterns are:
     - live source tables mixing current implementation files with deleted historical files;
     - metadata `Group:` values drifting from parent category names;
     - master catalog coverage that points at category families but omits a few concrete snippet files.
   - I did **not** find a comparable class of hard contradictions in actual MCP tool naming or in the explicit status snippets that were directly testable.

## Summary

- Files reviewed: **139**.
- Parent/master taxonomy: **partial alignment**; the master catalog is offset in this range and handles folders `20` and `21` indirectly through audit-phase coverage notes.
- Header/frontmatter category compliance: **partially enforceable only**; frontmatter lacks a category field, and `Group:` metadata mismatches occur in **38** files.
- Implementation status compliance: **limited direct coverage**; explicit status language is sparse, but sampled explicit status files matched live code reality.
- Source-file traceability: **mostly pass** with **6 missing references** concentrated in deleted-history/retirement evidence.
- MCP tool-name correctness: **pass**; no actual MCP tool names were misdocumented in this slice.
- Master-link completeness: **4 snippet files** are not linked directly from `FEATURE_CATALOG.md`.

## JSONL (type:iteration, run:11, dimensions:[traceability])

{"type":"iteration","run":11,"dimensions":["traceability"],"result":"needs_update","scope":{"catalog_root":".opencode/skill/system-spec-kit/feature_catalog","categories":["11--scoring-and-calibration","12--query-intelligence","13--memory-quality-and-indexing","14--pipeline-architecture","15--retrieval-enhancements","16--tooling-and-scripts","17--governance","18--ux-hooks","19--feature-flag-reference","20--remediation-revalidation","21--implement-and-remove-deprecated-features"],"files_reviewed":139},"checks":{"master_taxonomy":{"status":"partial","details":"master section numbering is offset relative to folder numbering in this range; categories 20-21 are covered indirectly via Audit Phase Coverage Notes"},"frontmatter_category":{"status":"partial","details":"frontmatter lacks explicit category field; SOURCE METADATA Group used as proxy","group_category_mismatch_count":38,"mismatch_breakdown":{"11--scoring-and-calibration":4,"13--memory-quality-and-indexing":3,"14--pipeline-architecture":11,"15--retrieval-enhancements":3,"16--tooling-and-scripts":4,"18--ux-hooks":13}},"implementation_status":{"status":"partial","details":"explicit status taxonomy is sparse; directly checked explicit status files aligned with code reality"},"source_file_existence":{"status":"needs_attention","references_checked":3319,"missing_references":6,"files_with_missing_refs":4},"tool_name_consistency":{"status":"pass","tool_definitions_checked":33,"files_with_actual_tool_mentions":26,"actual_tool_mentions":41,"invalid_actual_tool_names":0},"master_link_coverage":{"status":"needs_attention","missing_direct_links":4}},"findings":[{"id":"master-section-offset-11-21","severity":"medium","category":"traceability-structure","evidence":{"master":".opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:42-48,1801,2227,2427,2939,3366,3544,3887,3985,4302,4368"}},{"id":"group-category-drift-38-files","severity":"medium","category":"metadata-alignment","count":38},{"id":"deleted-rsf-and-retention-paths-still-listed","severity":"high","category":"source-traceability","count":6,"files":[".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md",".opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md",".opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md",".opencode/skill/system-spec-kit/feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md"]},{"id":"master-missing-direct-links","severity":"medium","category":"catalog-coverage","count":4,"files":[".opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md",".opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md",".opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md",".opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md"]},{"id":"tool-names-pass","severity":"info","category":"tool-surface","invalid_actual_tool_names":0}]}
