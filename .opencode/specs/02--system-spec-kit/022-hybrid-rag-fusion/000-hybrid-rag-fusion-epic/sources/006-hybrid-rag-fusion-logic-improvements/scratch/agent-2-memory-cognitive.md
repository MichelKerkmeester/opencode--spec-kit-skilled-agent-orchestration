# Memory/Cognitive/Session Pipeline Analysis

## Context
- Read-only audit of memory CRUD handlers, cognitive tiering/session tooling, and extractor scripts. `memory_match_triggers` was unavailable in this shell, so I relied on direct file review for context.

## Capability Map
1. **Memory CRUD surface** – `memory_delete` handles single/bulk deletions with checkpoints, causal-edge cleanup, and mutation-ledger writes (`memory-crud-delete.ts:26`). `memory_update` validates metadata, regenerates embeddings on title change, and flags pending re-indexes (`memory-crud-update.ts:28`). `memory_list`, `memory_stats`, and `memory_health` expose pagination, folder ranking, status counters, and alias diagnostics to downstream tooling (`memory-crud-list.ts:21`, `memory-crud-stats.ts:24`, `memory-crud-health.ts:148`).
2. **Cognitive scaffolding** – FSRS constants and review flow live in `fsrs-scheduler` (`fsrs-scheduler.ts:30`), tier-classifier applies the 5-state model on retrievability (`tier-classifier.ts:24`), working-memory records session attention with capacity controls (`working-memory.ts:1`), and archival-manager uses FSRS decisions plus background scans to tag low-attention memories (`archival-manager.ts:1`).
3. **Session dedup & persistence** – `session-manager` hashes memories, enforces per-session limits, cleans expired/stale rows, and records session_state for crash recovery (`session-manager.ts:247`, `session-manager.ts:284`, `session-manager.ts:363`, `session-manager.ts:679`).
4. **Session learning telemetry** – `handleTaskPreflight` captures baselines, `handleTaskPostflight` computes deltas/learning index, and history queries summarize completed sessions (`session-learning.ts:153`).
5. **Extraction pipeline** – `collect-session-data` orchestrates files, observations, decisions, pre/postflight stats, continuation data, and summaries (`collect-session-data.ts:187`, `collect-session-data.ts:525`, `collect-session-data.ts:580`). `file-extractor`, `conversation-extractor`, `decision-extractor`, and `diagram-extractor` supply structured facts, tool call metadata, decision trees, and ASCII summaries for templates (`file-extractor.ts:87`, `conversation-extractor.ts:46`, `decision-extractor.ts:110`).

## Defects / Fragilities
1. **Delete ledger not atomic** – single-memory deletion deletes vectors before appending to the ledger, so a ledger failure (caught but not rolled back) leaves no audit trail even though the memory is gone (`memory-crud-delete.ts:26`).
2. **Metadata updates only re-embed on title change** – `memory_update` regenerates embeddings only when `title` differs; adjustments to `triggerPhrases`/`importanceWeight` still leave stale embeddings/search relevance until a manual reindex (`memory-crud-update.ts:28`).
3. **Decision anchors fall back to “000-unknown”** when the spec folder is indeterminate, meaning manual decisions across contexts share the same anchor seed and hinder cross-spec search (`decision-extractor.ts:123`).
4. **File extractor truncates large sessions** – the extraction cut-off at `CONFIG.MAX_FILES_IN_MEMORY` silently drops later file references when `filesMap` has more entries (`file-extractor.ts:149`).
5. **Session dedup scans entire history every time** – `shouldSendMemoriesBatch` loads every hash for the session before filtering, so long sessions (near the `SESSION_CONFIG.maxEntriesPerSession` cap) incur repeated O(n) scans each call, impacting throughput for heavy workloads (`session-manager.ts:355`).

## Automation / Integration Opportunities
1. **Pipe session-learning outcomes into `collect-session-data`** so `recentContext.learning` mirrors the latest LI/knowledge gaps, making continue-session summaries more explicit (`session-learning.ts:153`, `collect-session-data.ts:625`).
2. **Trigger re-indexing when `memory_update` flags pending embeddings** by enqueuing `memory_index_scan` or retry-worker jobs automatically, closing the loop noted at `memory-crud-update.ts:75-166`.
3. **Include quality scorer signals in memory stats** so `qualityScore`/flags feed `memory_stats` hints or visual marks, leveraging `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:1` and `memory-crud-stats.ts:24`.
4. **Use co-activation spreads as part of search filtering** before `session-manager.filterSearchResults` to boost related memories and record dedup stats (`co-activation.ts:26`, `session-manager.ts:643`).
5. **Feed session learning gaps into decision extraction** to mark follow-ups or highlight uncertain options, linking `session-learning.ts:153` data with `decision-extractor.ts:110` workflows.

## Key References
- `memory-crud-delete.ts:26` – single/bulk delete flow with checkpoints/ledger.
- `memory-crud-update.ts:28` – metadata validation, embedding regeneration, pending re-index marks.
- `fsrs-scheduler.ts:30` / `tier-classifier.ts:24` – canonical FSRS constants and 5-state tier logic.
- `working-memory.ts:1` / `archival-manager.ts:1` – session attention schema and archival scanning.
- `session-manager.ts:247` / `session-manager.ts:355` – dedup, hashing, cleanup, and session-state persistence.
- `session-learning.ts:153` – learning pre/postflight capture and summarization.
- `collect-session-data.ts:187` & `collect-session-data.ts:525` – extraction orchestration plus continuation data.
- `file-extractor.ts:87`, `conversation-extractor.ts:46`, `decision-extractor.ts:110` – downstream extractor responsibilities.
