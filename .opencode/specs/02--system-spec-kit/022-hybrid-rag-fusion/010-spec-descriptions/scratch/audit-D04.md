# Audit D-04: Feature Catalog Gap Reconciliation
## Summary
| Metric | Value |
|--------|-------|
| Original gaps identified | 55 |
| Gaps now addressed | 38 |
| Gaps remaining | 17 |
| New features since scan | 0 |

Explicit feature coverage was reconciled against the current catalog narrative, not just source-file tables. The current catalog contains 163 snippet files (plus the monolithic `feature_catalog.md`), so the working inventory is 163 rather than 164.

## Gap Status
| Feature | Originally Missing | Now Documented? |
|---------|-------------------|----------------|
| Standalone Admin CLI | Yes | Yes |
| Cross-Process DB Hot Rebinding | Yes | Yes |
| Startup Pending-File Recovery | Yes | No |
| Watcher Delete/Rename Cleanup | Yes | No |
| Prediction-Error Save Arbitration | Yes | Yes |
| PE Conflict Audit Journal | Yes | Yes |
| Per-Spec-Folder Save Mutex | Yes | Yes |
| Dry-Run Preflight for memory_save | Yes | No |
| Atomic Write-Then-Index API | Yes | No |
| Spec Document Discovery + Level Inference | Yes | Yes |
| Auto Spec-Document Causal Chains | Yes | Yes |
| Declarative Causal Link Ingestion | Yes | Yes |
| Deferred Lexical-Only Indexing | Yes | Yes |
| Provider-Based Neural Reranking | Yes | Yes |
| Quality-Aware 3-Tier Fallback | Yes | Yes |
| Causal Neighbor Boost + Injection | Yes | No |
| Artifact-Class Retrieval Routing | Yes | Yes |
| FSRS v4 Review Scheduling | Yes | Yes |
| Automatic Archival Subsystem | Yes | No |
| Session-Scoped Working Memory | Yes | Yes |
| Hybrid Spreading Activation | Yes | Yes |
| Temporal Contiguity Layer | Yes | No |
| 9-Type Memory Taxonomy + Inference | Yes | Yes |
| Document-Type-Aware Scoring | Yes | Yes |
| Diagnostic Retrieval Metrics Suite | Yes | Yes |
| BM25 Contingency Gate | Yes | Yes |
| Feedback-Driven Ground-Truth Expansion | Yes | Yes |
| Ground-Truth Diversity Gate | Yes | Yes |
| Ablation Significance Testing | Yes | Yes |
| Exclusive Contribution Rate | Yes | Yes |
| Extended Retrieval Telemetry | Yes | Yes |
| Durable Ingest Job Queue | Yes | Yes |
| Embedding Retry Orchestrator | Yes | No |
| Circuit-Broken Reranker Failover | Yes | Yes |
| Tool-Level TTL Cache | Yes | No |
| Correction Tracking with Undo | Yes | No |
| 7-Layer Tool Architecture Metadata | Yes | No |
| Incremental Reindex Planner | Yes | Yes |
| Per-Memory History Log | Yes | No |
| Access-Driven Popularity Scoring | Yes | No |
| Atomic Pending-File Recovery | Yes | No |
| Tool-Result Extraction to Working Memory | Yes | No |
| Hybrid intent classifier with per-intent ranking weights | Yes | Yes |
| Evidence-gap Z-score detection + graph coverage precheck | Yes | Yes |
| Session attention boost | Yes | Yes |
| Temporal-structural coherence scoring | Yes | No |
| Anchor region metadata enrichment | Yes | Yes |
| Validation-signal score adjustment | Yes | Yes |
| Divergent alias diagnostics mode | Yes | Yes |
| Mutation ledger audit trail | Yes | Yes |
| Health auto-repair actions | Yes | Yes |
| Alias divergence auto-reconcile | Yes | Yes |
| Embedding input normalization | Yes | Yes |
| Safety-tiered retention bulk delete | Yes | Yes |
| Startup runtime compatibility guards | Yes | No |

## Issues [ISS-D04-NNN]
### ISS-D04-001 - Catalog count mismatch
- The current feature catalog has 163 snippet files and 163 monolithic feature entries, not 164.

### ISS-D04-002 - Remaining original gap set
- The following 17 original gaps still lack explicit current-reality coverage in the catalog body:
  - Startup Pending-File Recovery
  - Watcher Delete/Rename Cleanup
  - Dry-Run Preflight for memory_save
  - Atomic Write-Then-Index API
  - Causal Neighbor Boost + Injection
  - Automatic Archival Subsystem
  - Temporal Contiguity Layer
  - Embedding Retry Orchestrator
  - Tool-Level TTL Cache
  - Correction Tracking with Undo
  - 7-Layer Tool Architecture Metadata
  - Per-Memory History Log
  - Access-Driven Popularity Scoring
  - Atomic Pending-File Recovery
  - Tool-Result Extraction to Working Memory
  - Temporal-structural coherence scoring
  - Startup runtime compatibility guards

### ISS-D04-003 - No clear net-new undocumented features
- Review of post-scan commits shows code and catalog changed after the 2026-03-07 scan, but the newly visible work is either already documented in the current catalog or is bug-fix/refinement work nested inside already documented features.
