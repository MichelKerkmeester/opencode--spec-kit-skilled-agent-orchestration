# Iteration 006: Feature Catalog 01-07 vs Code

## Findings

### TRC-006-001
- severity: medium
- title: Master catalog omits snippet linkage for `memory_quick_search`
- catalog-section: 2. RETRIEVAL
- snippet-file: `01--retrieval/10-fast-delegated-search-memory-quick-search.md`
- code-file:line: `feature_catalog/feature_catalog.md:119-134`; `mcp_server/tool-schemas.ts:191-206`; `mcp_server/tools/memory-tools.ts:47-60`
- evidence: The master feature entry for "Fast delegated search (memory_quick_search)" lists direct source files but does not include the standard `See [01--...].md` snippet reference used by other features. The snippet file does exist and is populated, and runtime implementation is confirmed in tool schema registration and dispatcher delegation.

### TRC-006-002
- severity: high
- title: `eval_run_ablation` implementation status in master is outdated vs code (k-sensitivity path)
- catalog-section: 8. EVALUATION (category `07--evaluation`)
- snippet-file: `07--evaluation/01-ablation-studies-evalrunablation.md`
- code-file:line: `feature_catalog/feature_catalog.md:951-955`; `feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:12,22,24`; `mcp_server/handlers/eval-reporting.ts:167,179-180`; `mcp_server/tool-schemas.ts:472-473`
- evidence: Master catalog describes ablation-only behavior and states the tool requires `SPECKIT_ABLATION=true` to activate. Snippet + code show a dual-mode implementation: `mode: 'k_sensitivity'` runs through a separate branch before the ablation-flag gate, while only the ablation branch is blocked by `SPECKIT_ABLATION`.

## Summary

Reviewed master catalog sections covering retrieval/mutation/discovery/maintenance/lifecycle/analysis plus category `07--evaluation`, and verified corresponding snippet files in `01--retrieval` through `07--evaluation`.

Total features verified: **42**.

Snippet files present: **42/42**.

Content/status alignment issues found: **2** (one missing snippet linkage pattern, one status/reality drift for evaluation mode gating).

Spot status checks that matched code reality: `memory_quick_search` is implemented and dispatched; shared-memory lifecycle tools are present in schemas; AST section retrieval remains deferred (no runtime `read_spec_section(...)` implementation found).

## JSONL

```jsonl
{"type":"iteration","run":6,"mode":"review","dimensions":["traceability"],"scope":{"catalog_sections":["1","2","3","4","5","6","7","8"],"categories":["01--retrieval","02--mutation","03--discovery","04--maintenance","05--lifecycle","06--analysis","07--evaluation"],"features_verified":42},"findings":[{"id":"TRC-006-001","severity":"medium"},{"id":"TRC-006-002","severity":"high"}]}
```
