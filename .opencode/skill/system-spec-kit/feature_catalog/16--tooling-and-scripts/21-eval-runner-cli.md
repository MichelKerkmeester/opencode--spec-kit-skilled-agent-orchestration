---
title: "Eval Runner CLI"
description: "CLI entry point for running ablation studies against the production Spec Kit Memory database, formatting the report, and persisting evaluation artifacts."
---

# Eval Runner CLI

This document captures the implemented behavior, source references, and remediation metadata for the ablation-study CLI entry point.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

`scripts/evals/run-ablation.ts` is the operator-facing CLI for controlled channel ablation studies. It runs the production hybrid search stack with one or more retrieval channels disabled, compares the degraded runs against the full-pipeline baseline, prints a formatted markdown report, stores snapshot rows in the eval database, and writes the complete JSON payload to `/tmp/ablation-result.json`.

The script stays inside the public `../../mcp_server/api` boundary rather than importing internal runtime modules directly, which keeps it aligned with the eval-script import policy documented in `scripts/evals/README.md`. The companion `scripts/evals/map-ground-truth-ids.ts` utility is the operator-side provenance check for making sure the live parent-memory IDs in `ground-truth.json` still match the production DB before you compare runs.

## 2. CURRENT REALITY

The shipped CLI contract is:

1. Invocation requires `SPECKIT_ABLATION=true` and is designed to run via `npx tsx scripts/evals/run-ablation.ts [--channels vector,bm25,fts5] [--verbose]`. If the flag is not enabled, the script prints a usage error and exits with status `1`.
2. The script targets the production memory database at `mcp_server/database/context-index.sqlite`. It refuses to proceed if that database file does not exist or if `vectorIndex.initializeDb(PROD_DB_PATH)` returns `null`. After DB rebuilds or imports, operators should preview or refresh ground-truth mappings with `scripts/evals/map-ground-truth-ids.ts` before treating a new ablation run as comparable to older history.
3. `--channels` is optional. When omitted, the script ablates every channel listed in `ALL_CHANNELS`. Invalid channel names do not hard-fail the run; they trigger a warning and fall back to the full channel list.
4. Startup initializes both the production search runtime and the eval database. The CLI logs production memory count from `memory_index`, calls `initHybridSearch(db, vectorIndex.vectorSearch)`, and initializes `speckit-eval.db` in the same database directory.
5. The ablation adapter converts the framework's `disabledChannels` set into `hybridSearchEnhanced()` flags with `toHybridSearchFlags()`. Each search run generates a fresh query embedding, requests `limit: 20`, forces all channels on except the disabled ones, and disables trigger phrases by passing `triggerPhrases: []` when the trigger channel is turned off.
6. Successful runs call `runAblation(searchFn, { channels })`, persist results through `storeAblationResults(report)`, print the formatted markdown summary from `formatAblationReport(report)`, and append script-level metadata (`scriptElapsedMs`, `productionMemoryCount`, `scriptVersion`) before writing `/tmp/ablation-result.json`. Operators should inspect the run for token-budget-overflow truncation before trusting Recall@K deltas, because a run that returns fewer than `K` candidates is an investigation artifact rather than a clean benchmark.
7. Failures are explicit and process-ending. Missing enablement, missing production DB, null DB initialization, or a null ablation report all terminate with a non-zero exit code; unhandled errors fall through the `main().catch(...)` fatal path.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` | CLI | Runtime entry point for ablation studies, channel parsing, report printing, and JSON artifact writing |
| `.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts` | Companion CLI | Read-only preview utility that reconciles or audits ground-truth parent-memory IDs against the production DB |
| `.opencode/skill/system-spec-kit/scripts/evals/README.md` | Documentation | Declares eval-script inventory and the public-API import policy this CLI follows |
| `.opencode/skill/system-spec-kit/mcp_server/api/index.ts` | Public API | Re-export boundary that supplies eval, search, embedding, and vector-index surfaces to the CLI |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Eval Runner CLI
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit
