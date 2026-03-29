---
title: "Workspace scanning and indexing (memory_index_scan)"
description: "Covers the filesystem scanner that keeps the memory database synchronized with spec folder files via incremental indexing."
---

# Workspace scanning and indexing (memory_index_scan)

## 1. OVERVIEW

Covers the filesystem scanner that keeps the memory database synchronized with spec folder files via incremental indexing.

This tool scans your project folders for new or changed files and adds them to the searchable knowledge base. It is like a librarian walking through the stacks every day to catalog new arrivals and update records for books that have been revised. Files that have not changed are skipped to save time. If a file fails to process, the system remembers and retries it next time.

---

## 2. CURRENT REALITY

This is the tool that keeps the memory database synchronized with the filesystem. Without it, new or modified memory files would be invisible to search.

Spec documents are still indexed by default. When a scan touches `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, or `handover.md`, it routes that save through `memory_save` in warn-only quality mode so validation problems remain visible without dropping the document out of retrieval.

The scanner discovers files from three sources: spec folder memory files under both `.opencode/**/memory/` and `specs/**/memory/` (including `.md` and `.txt` memory files), constitutional files under `.opencode/skill/*/constitutional/` (currently `.md`, excluding `README.md`/`README.txt`), and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` alias problem).

In incremental mode (the default), the scanner categorizes every discovered file into one of four buckets: to-index (new files), to-update (changed mtime or content hash), to-skip (unchanged mtime and matching content hash) and to-delete (files that disappeared from disk). The content-hash secondary check catches timestamp-preserving rewrites that would otherwise look unchanged from mtime alone. Batch processing with configurable `BATCH_SIZE` handles large workspaces, but oversized requests are clamped to the hard runtime maximum with a warning instead of exploding fan-out. Scan throttling now uses an atomic lease instead of a check-then-set cooldown gate: `acquireIndexScanLease()` reads `last_index_scan` and `scan_started_at` in one transaction, expires stale leases left behind by crashed scans, reserves a fresh run by writing `scan_started_at`, rejects overlapping fresh scans with `reason: 'lease_active'`, and still enforces `INDEX_SCAN_COOLDOWN` after completed runs with `reason: 'cooldown'`. The handler returns an E429 response with the computed wait time whenever either guard rejects the request.

Completion is a separate step. `completeIndexScanLease()` runs after the scan response is assembled, converts the active `scan_started_at` lease into `last_index_scan`, and clears the active lease row. That keeps the cooldown clock tied to completed scans instead of request start time while still protecting the database from concurrent scans and stale crash leftovers.

Each file that passes through to indexing is handed off to `memory_save` for the save pipeline, so content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture still apply automatically. The `memory_save` sub-modules are documented in that feature's own catalog entry rather than duplicated here. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.

After indexing, the tool does more than store data. It creates causal chain edges between spec documents within the same folder (spec leads to plan, plan leads to tasks, tasks lead to checklist, and so on). It detects alias conflicts. It runs divergence reconciliation hooks. It clears the trigger matcher cache if any changes occurred.

A safety invariant protects against silent failures: post-indexing mtime updates happen only for successfully indexed files. If embedding generation fails for a specific file, that file retains its old mtime so the next scan automatically retries it. You do not have to track which files failed. The system tracks it for you.

The result breakdown is detailed: indexed count, updated count, unchanged count, failed count, skipped-by-mtime count, constitutional stats, dedup stats and incremental stats. Debug mode (`SPECKIT_DEBUG_INDEX_SCAN=true`) exposes additional file count diagnostics.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/memory-index.ts` | Index scan handler: file discovery, incremental bucketing, batch orchestration, causal chain creation, divergence hooks |
| `mcp_server/core/db-state.ts` | Atomic lease persistence for `scan_started_at` and `last_index_scan`, including stale-lease expiry and completion handoff |
| `mcp_server/handlers/memory-index-discovery.ts` | Spec document and constitutional file discovery from filesystem |
| `mcp_server/handlers/memory-index-alias.ts` | Alias conflict detection and summarization during scan |
| `mcp_server/handlers/causal-links-processor.ts` | Causal link creation called by scan for spec document chains |
| `mcp_server/handlers/memory-save.ts` | Save handler entry point invoked per file for content normalization, quality gating, and embedding |
| `mcp_server/lib/storage/incremental-index.ts` | Incremental indexing: mtime comparison, bucket classification, post-index mtime updates |
| `mcp_server/lib/storage/history.ts` | Memory history persistence, imported by the index scan handler |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Trigger phrase matching and cache invalidation after scan changes |
| `mcp_server/lib/utils/canonical-path.ts` | Canonical path resolution for deduplication across `specs/` and `.opencode/specs/` |
| `mcp_server/core/config.ts` | Server configuration including `INDEX_SCAN_COOLDOWN` |
| `mcp_server/utils/batch-processor.ts` | Configurable `BATCH_SIZE` batch processing for large workspaces |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `memory_index_scan` arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_index_scan` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for `memory_index_scan` |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers including E429 rate-limit responses |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-index.vitest.ts` | Index handler validation |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Handler lease rejection and post-scan completion validation |
| `mcp_server/tests/db-state.vitest.ts` | Atomic lease acquisition, stale-lease expiry, and completion handoff validation |
| `mcp_server/tests/incremental-index-v2.vitest.ts` | Incremental index behavioral tests |
| `mcp_server/tests/incremental-index.vitest.ts` | Focused incremental-index coverage (fast-path assertions) |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Full spec document indexing |
| `mcp_server/tests/batch-processor.vitest.ts` | Batch processor tests |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | Large file indexing regression |

---

## 4. SOURCE METADATA

- Group: Maintenance
- Source feature title: Workspace scanning and indexing (memory_index_scan)
- Current reality source: FEATURE_CATALOG.md
