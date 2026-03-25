# Iteration 010: Snippets 01-10 Consistency

## Findings

Audit scope covered all snippet markdown files under numeric categories `01` through `10` in `.opencode/skill/system-spec-kit/feature_catalog` (83 files total).

1. **Frontmatter/header vs parent category:**
   - Every snippet has frontmatter (`title`, `description`), but category is not encoded in frontmatter, so strict frontmatter-to-folder equality is not directly enforceable.
   - Using `## 4. SOURCE METADATA` `Group:` as the category proxy, **17/83** files have group labels that do not match their parent category family.
   - Files with category/group drift:
     - `01--retrieval/06-bm25-trigger-phrase-re-index-gate.md`
     - `01--retrieval/07-ast-level-section-retrieval-tool.md`
     - `01--retrieval/08-quality-aware-3-tier-search-fallback.md`
     - `02--mutation/06-transaction-wrappers-on-mutation-handlers.md`
     - `02--mutation/07-namespace-management-crud-tools.md`
     - `02--mutation/08-prediction-error-save-arbitration.md`
     - `05--lifecycle/05-async-ingestion-job-lifecycle.md`
     - `08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md`
     - `08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md`
     - `08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md`
     - `08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md`
     - `08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md`
     - `09--evaluation-and-measurement/12-test-quality-improvements.md`
     - `09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md`
     - `09--evaluation-and-measurement/14-cross-ai-validation-fixes.md`
     - `10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md`
     - `10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md`

2. **Implementation status vs code reality:**
   - Only **1/83** snippet declares an explicit implementation status (`PLANNED/DEFERRED`):
     - `10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md`.
   - **82/83** snippets do not explicitly declare `Implemented/Planned/Deprecated`, so this check is largely unverifiable at file level.
   - Potential stale claim in the planned snippet:
     - Snippet says: "No code exists for graph-node promotion" (`10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md:22`).
     - Code now creates deterministic heading-anchor pseudo nodes and edges (`mcp_server/lib/search/graph-lifecycle.ts:493-505`).
     - This may be scope-different (heading anchors vs ANCHOR-tag promotion), but wording is currently ambiguous and should be tightened.

3. **Referenced code files existence:**
   - Verified all code paths referenced in `## 3. SOURCE FILES` tables.
   - **668/668 references exist**; **0 missing files**.

4. **Tool names vs actual MCP tool names:**
   - Canonical MCP tool names were checked against snippet heading/tool call references.
   - **0 invalid MCP tool-name references** found in snippet tool headings (for `memory_*`, `checkpoint_*`, `task_*`, `eval_*`, `shared_*`).

5. **Stale/contradictory claims:**
   - One likely stale/ambiguous claim identified (anchor-node statement above).
   - No additional hard contradictions found in tool naming or source-file traceability checks.

## Summary

- Files reviewed: **83** (all snippets under categories `01`-`10`).
- Frontmatter category compliance: **inconclusive by schema** (no category field in frontmatter); **17** group/category metadata mismatches.
- Status compliance: **weak coverage** (only **1** explicit status declaration; **82** missing explicit status taxonomy).
- Source-file traceability: **pass** (**668/668** refs resolved).
- MCP tool-name correctness: **pass** (no invalid tool-name references in tool-heading contexts).
- Contradictions: **1** planned-status wording needs clarification/update.

## JSONL (type:iteration, run:10, mode:review, dimensions:[traceability])

{"type":"iteration","run":10,"mode":"review","dimensions":["traceability"],"scope":{"catalog_root":".opencode/skill/system-spec-kit/feature_catalog","categories":["01--retrieval","02--mutation","03--discovery","04--maintenance","05--lifecycle","06--analysis","07--evaluation","08--bug-fixes-and-data-integrity","09--evaluation-and-measurement","10--graph-signal-activation"],"files_reviewed":83},"result":"needs_update","checks":{"frontmatter_category":{"status":"partial","details":"frontmatter lacks explicit category key; Group metadata used as proxy","group_category_mismatch_count":17},"implementation_status":{"status":"partial","explicit_status_files":1,"missing_explicit_status_files":82},"source_file_existence":{"status":"pass","references_checked":668,"missing_references":0},"tool_name_consistency":{"status":"pass","invalid_tool_name_refs":0},"stale_or_contradictory":{"status":"needs_attention","findings":1}},"findings":[{"id":"group-category-drift-17-files","severity":"medium","category":"metadata-alignment","count":17},{"id":"missing-explicit-status-taxonomy","severity":"medium","category":"status-governance","count":82},{"id":"anchor-node-planned-claim-ambiguous","severity":"medium","category":"stale-claim","evidence":{"snippet":".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md:22","code":".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:493-505"}}]}
