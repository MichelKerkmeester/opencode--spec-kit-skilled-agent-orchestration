---
title: "Deep Dive - Gemini: Tool Count & Schema Audit"
source: "cli-gemini (gemini-3.1-pro-preview)"
date: 2026-03-02
---

# Deep Dive: Tool Count & Schema Audit

## MISMATCH: 25 tools in code, doc claims 23

### Full Tool Inventory (from tool-schemas.ts)

| Layer | Tools | Count |
|-------|-------|-------|
| L1: Orchestration | memory_context | 1 |
| L2: Core | memory_search, memory_match_triggers, memory_save | 3 |
| L3: Discovery | memory_list, memory_stats, memory_health | 3 |
| L4: Mutation | memory_delete, memory_update, memory_validate, memory_bulk_delete | 4 |
| L5: Lifecycle | checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete | 4 |
| L6: Analysis | task_preflight, task_postflight, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, eval_run_ablation, eval_reporting_dashboard | 8 |
| L7: Maintenance | memory_index_scan, memory_get_learning_history | 2 |
| **TOTAL** | | **25** |

### Discrepancy Analysis
- Doc claims 23 tools. Code has 25.
- 2 tools appear to have been added after the documentation was written
- Need to identify which 2 tools are undocumented

### Additional Finding
- SPECKIT_ADAPTIVE_FUSION: confirmed **missing** from feature flag documentation table
