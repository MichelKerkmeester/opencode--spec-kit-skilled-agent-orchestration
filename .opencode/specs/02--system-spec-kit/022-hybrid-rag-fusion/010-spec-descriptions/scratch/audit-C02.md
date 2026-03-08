# Audit C-02: Feature Snippet Accuracy Sampling

## Summary
| Metric | Result |
|--------|--------|
| Snippets sampled | 20 |
| Source files verified | 7/20 |
| Description matches | 7/20 |
| Tool name correct | 7/7 applicable |
| Parameter matches | 2/2 applicable |

## Per-Snippet Findings
### Category: 01--retrieval — Snippet: 01-unified-context-retrieval-memorycontext.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: MATCH
- Notes: 240/241 referenced source file paths resolved. Primary tool `memory_context` is correct. Snippet parameter mentions align with schema keys: tokenUsage, specFolder, sessionId. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 02--mutation — Snippet: 01-memory-indexing-memorysave.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: MATCH
- Notes: 178/179 referenced source file paths resolved. Primary tool `memory_save` is correct. Snippet parameter mentions align with schema keys: asyncEmbedding. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 03--discovery — Snippet: 01-memory-browser-memorylist.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: N/A
- Notes: 237/238 referenced source file paths resolved. Primary tool `memory_list` is correct. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 04--maintenance — Snippet: 01-workspace-scanning-and-indexing-memoryindexscan.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: N/A
- Notes: 180/181 referenced source file paths resolved. Primary tool `memory_index_scan` is correct. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 05--lifecycle — Snippet: 01-checkpoint-creation-checkpointcreate.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: N/A
- Notes: 105/106 referenced source file paths resolved. Primary tool `checkpoint_create` is correct. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 06--analysis — Snippet: 01-causal-edge-creation-memorycausallink.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: N/A
- Notes: 93/94 referenced source file paths resolved. Primary tool `memory_causal_link` is correct. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 07--evaluation — Snippet: 01-ablation-studies-evalrunablation.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: CORRECT
- Parameters: N/A
- Notes: 148/149 referenced source file paths resolved. Primary tool `eval_run_ablation` is correct. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 08--bug-fixes-and-data-integrity — Snippet: 01-graph-channel-id-fix.md
- Source file: mcp_server/lib/cognitive/rollout-policy.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 13/13 referenced source file paths resolved. Description terms map to implementation files/content: graph, channel.

### Category: 09--evaluation-and-measurement — Snippet: 01-evaluation-database-and-schema.md
- Source file: mcp_server/lib/eval/eval-db.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 2/2 referenced source file paths resolved. Description terms map to implementation files/content: evaluation, database, schema.

### Category: 10--graph-signal-activation — Snippet: 01-typed-weighted-degree-channel.md
- Source file: mcp_server/lib/cognitive/rollout-policy.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 16/16 referenced source file paths resolved. Description terms map to implementation files/content: typed, weighted, degree, channel.

### Category: 11--scoring-and-calibration — Snippet: 01-score-normalization.md
- Source file: mcp_server/lib/scoring/composite-scoring.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 25/25 referenced source file paths resolved. Description terms map to implementation files/content: score, normalization.

### Category: 12--query-intelligence — Snippet: 01-query-complexity-router.md
- Source file: mcp_server/lib/search/query-classifier.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 5/5 referenced source file paths resolved. Description terms map to implementation files/content: query, complexity, router.

### Category: 13--memory-quality-and-indexing — Snippet: 01-verify-fix-verify-memory-quality-loop.md
- Source file: mcp_server/handlers/quality-loop.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 4/4 referenced source file paths resolved. Description terms map to implementation files/content: verify, verify, quality, loop.

### Category: 14--pipeline-architecture — Snippet: 01-4-stage-pipeline-refactor.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: N/A
- Parameters: N/A
- Notes: 174/175 referenced source file paths resolved. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 15--retrieval-enhancements — Snippet: 01-dual-scope-memory-auto-surface.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: N/A
- Parameters: N/A
- Notes: 58/59 referenced source file paths resolved. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 16--tooling-and-scripts — Snippet: 01-tree-thinning-for-spec-folder-consolidation.md
- Source file: mcp_server/lib/chunking/anchor-chunker.ts — EXISTS
- Description match: YES
- Tool name: N/A
- Parameters: N/A
- Notes: 3/3 referenced source file paths resolved. Description terms map to implementation files/content: thinning, spec.

### Category: 17--governance — Snippet: 01-feature-flag-governance.md
- Source file: none listed — MISSING
- Description match: PARTIAL
- Tool name: N/A
- Parameters: N/A
- Notes: No dedicated implementation file paths were listed in the snippet. Snippet documents process/decision context without dedicated implementation files.

### Category: 18--ux-hooks — Snippet: 01-shared-post-mutation-hook-wiring.md
- Source file: mcp_server/configs/cognitive.ts — MISSING
- Description match: PARTIAL
- Tool name: N/A
- Parameters: N/A
- Notes: 68/69 referenced source file paths resolved. Missing referenced source files: mcp_server/tests/retry.vitest.ts

### Category: 19--decisions-and-deferrals — Snippet: 01-int8-quantization-evaluation.md
- Source file: none listed — MISSING
- Description match: PARTIAL
- Tool name: N/A
- Parameters: N/A
- Notes: No dedicated implementation file paths were listed in the snippet. Snippet documents process/decision context without dedicated implementation files.

### Category: 20--feature-flag-reference — Snippet: 01-1-search-pipeline-features-speckit.md
- Source file: none listed — MISSING
- Description match: PARTIAL
- Tool name: N/A
- Parameters: N/A
- Notes: No dedicated implementation file paths were listed in the snippet. Snippet documents process/decision context without dedicated implementation files.

## Issues
- **ISS-C02-001**: 01--retrieval / 01-unified-context-retrieval-memorycontext.md lacks dedicated resolvable source-file references.
- **ISS-C02-002**: 02--mutation / 01-memory-indexing-memorysave.md lacks dedicated resolvable source-file references.
- **ISS-C02-003**: 03--discovery / 01-memory-browser-memorylist.md lacks dedicated resolvable source-file references.
- **ISS-C02-004**: 04--maintenance / 01-workspace-scanning-and-indexing-memoryindexscan.md lacks dedicated resolvable source-file references.
- **ISS-C02-005**: 05--lifecycle / 01-checkpoint-creation-checkpointcreate.md lacks dedicated resolvable source-file references.
- **ISS-C02-006**: 06--analysis / 01-causal-edge-creation-memorycausallink.md lacks dedicated resolvable source-file references.
- **ISS-C02-007**: 07--evaluation / 01-ablation-studies-evalrunablation.md lacks dedicated resolvable source-file references.
- **ISS-C02-008**: 14--pipeline-architecture / 01-4-stage-pipeline-refactor.md lacks dedicated resolvable source-file references.
- **ISS-C02-009**: 15--retrieval-enhancements / 01-dual-scope-memory-auto-surface.md lacks dedicated resolvable source-file references.
- **ISS-C02-010**: 17--governance / 01-feature-flag-governance.md lacks dedicated resolvable source-file references.

## Recommendations
- Add concrete source-file references for governance and decision-record snippets so they can pass the same verification bar as code-backed entries.
- Where snippets describe MCP tools, keep parameter names in backticks and aligned with the registered schema to make future audits mechanically verifiable.
- Normalize feature-flag reference paths consistently (for example, always root them from `mcp_server/`) to reduce ambiguity in source lookup.
