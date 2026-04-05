OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-0509-7182-9585-5954ceaab0c4
--------
user
You are a feature catalog verification agent. Read these specific feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md (files 01 through 08). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying those eight feature catalog snippets against the `mcp_server` codebase. I’ll start by loading the requested feature files, run the required skill routing check, and then compare each `Current Reality` and `Source Files` section to the actual implementation.
exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-feedback-capture-and-storage.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-skill-effectiveness-analysis.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-ab-testing-and-experimentation.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-evaluation-api-and-crud.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/04-threshold-monitoring-and-alerting.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-performance-dashboard-and-reporting.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Evaluation database and schema

## Current Reality

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows; `memory_match_triggers` emits query/final-result rows.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests

| File | Focus |
|------|-------|
 exited 1 in 51ms:
sed: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-skill-effectiveness-analysis.md: No such file or directory
 exited 1 in 51ms:
sed: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-ab-testing-and-experimentation.md: No such file or directory
 exited 1 in 51ms:
sed: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-feedback-capture-and-storage.md: No such file or directory
 exited 1 in 51ms:
sed: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-evaluation-api-and-crud.md: No such file or directory
 exited 1 in 51ms:
sed: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/04-threshold-monitoring-and-alerting.md: No such file or directory
 succeeded in 51ms:
# Agent consumption instrumentation

## Current Reality

Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), but the runtime logger is currently inert/deprecated (`isConsumptionLogEnabled()` hardcoded `false`). Calls remain fail-safe no-ops for compatibility while telemetry paths stay structurally available.

The earlier pattern-analysis outcome from this workstream still informed ground-truth design, but current production runtime does not actively write new consumption-log rows unless instrumentation is reactivated.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |

### Tests

| File | Focus |
|------|-------|
 exited 1 in 51ms:
sed: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-performance-dashboard-and-reporting.md: No such file or directory
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog snippets 01 through 08 in .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement against the system-spec-kit mcp_server code; confirm Current Reality accuracy, listed Source Files existence, and missing important source files" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 660ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, files~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !opencode, check~, code(name), opencode(name)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
codex
I’ve confirmed the catalog folder doesn’t currently contain files `02` through `07` at the paths you supplied, so I’m checking the directory contents next to distinguish “missing feature snippet” issues from code-reference issues. After that I’ll inspect the actual `mcp_server` implementation files behind the snippets that do exist.
exec
/bin/zsh -lc 'ls -1 "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
01-evaluation-database-and-schema.md
02-core-metric-computation.md
03-observer-effect-mitigation.md
04-full-context-ceiling-evaluation.md
05-quality-proxy-formula.md
06-synthetic-ground-truth-corpus.md
07-bm25-only-baseline.md
08-agent-consumption-instrumentation.md
09-scoring-observability.md
10-full-reporting-and-ablation-study-framework.md
11-shadow-scoring-and-channel-attribution.md
12-test-quality-improvements.md
13-evaluation-and-housekeeping-fixes.md
14-cross-ai-validation-fixes.md
 succeeded in 51ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

 succeeded in 51ms:
Total output lines: 505

/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
codex
I found a naming mismatch: the directory’s actual `02` through `07` files are different from the filenames in your prompt. I’m treating the numeric range `01` to `08` as authoritative, verifying those real files, and I’ll call out the filename mismatch explicitly where it matters.
exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Core metric computation

## Current Reality

Eleven metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).

Seven diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant, precision@K and F1@K expose precision/recall balance, and intent-weighted NDCG adjusts ranking quality by query type.

This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |

### Tests

 succeeded in 52ms:
# Full-context ceiling evaluation

## Current Reality

How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum, and the hybrid pipeline sits somewhere between.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-ceiling.ts` | Lib | Full context ceiling evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |
 succeeded in 52ms:
# Observer effect mitigation

## Current Reality

Measurement infrastructure should not degrade the system it measures. A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%. In practice, measured overhead stays within the 5ms p95 budget. If the eval database becomes unavailable (disk full, file lock, corruption), search continues normally with logging silently disabled. The system never blocks a user query to record an evaluation metric.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/shadow-scoring.ts` | Lib | Shadow scoring system |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
 succeeded in 50ms:
# Synthetic ground truth corpus

## Current Reality

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

40 queries are hand-written natural language, not derived from trigger phrases. That last detail matters: if your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |
| `mcp_server/lib/eval/ground-truth-generator.ts` | Lib | Synthetic ground truth generator |

### Tests
 succeeded in 52ms:
# Quality proxy formula

## Current Reality

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. Correlation testing against the manual ground truth corpus confirmed the proxy tracks real quality well enough for regression detection.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-quality-proxy.ts` | Lib | Quality proxy formula |

## Source Metadata

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Eval DB
// ---------------------------------------------------------------
// T004: Separate evaluation database with 5 tables for tracking
// retrieval quality metrics, ground truth, and eval results.
// ---------------------------------------------------------------

// Node stdlib
import * as path from 'path';
import * as fs from 'fs';

// External packages
import Database from 'better-sqlite3';

/* ---------------------------------------------------------------
   1. CONFIGURATION
--------------------------------------------------------------- */

// Follow same env-var precedence as main DB (vector-index-impl.ts)
// P1-05: SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy) > default
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Consumption Logger (T004 — Agent UX Instrumentation)
// ---------------------------------------------------------------
// Logs agent consumption events to a SQLite table for G-NEW-2
// requirement analysis: what agents query, what results they get,
// and (via hooks) which results they actually use.
//
// Table: consumption_log
// Feature flag: SPECKIT_CONSUMPTION_LOG (default true)
// ---------------------------------------------------------------

import Database from 'better-sqlite3';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Defines the ConsumptionEventType type.
 */
 succeeded in 50ms:
# BM25-only baseline

## Current Reality

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/bm25-baseline.ts` | Lib | BM25-only baseline evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |

### Tests

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Eval Logger
// ---------------------------------------------------------------
// AI-TRACE: T005: Non-blocking, fail-safe logging hooks for search, context,
// and trigger handlers. All writes go to the eval DB (speckit-eval.db).
//
// CRITICAL: Logging must NEVER break production search.
// Every public function is wrapped in try-catch and is a no-op
// when SPECKIT_EVAL_LOGGING is not set to "true".
// ---------------------------------------------------------------

import { initEvalDb } from './eval-db';

/* ---------------------------------------------------------------
   1. FEATURE FLAG
--------------------------------------------------------------- */

/**
 * Returns true only when SPECKIT_EVAL_LOGGING=true (case-insensitive).
 * Anything else (undefined, "false", "1", …) disables logging.
exec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Shadow Scoring
// ---------------------------------------------------------------
// AI-GUARD: 
// Runs a parallel scoring path alongside production results WITHOUT affecting
// production output. Logs both production and shadow scores for A/B comparison.
//
// Features:
// - Run alternative scoring algorithms in shadow mode
// - Compare shadow vs production results
// - Log comparison data to eval database
// - Channel attribution per result
// - Exclusive Contribution Rate metric
//
// CRITICAL: Shadow scoring must NEVER affect production search results.
// Every public function is wrapped in try-catch. The shadow write path
// (runShadowScoring, logShadowComparison) was permanently disabled in Sprint 7.
// ---------------------------------------------------------------

import { initEvalDb, getEvalDb } from './eval-db';
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Eval Metrics
// ---------------------------------------------------------------
// T006a-e: Pure computation functions for 11 evaluation metrics
// (6 core + 5 diagnostic). No DB access, no side effects.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/** A single retrieved result from a search query. */
export interface EvalResult {
  /** Unique memory identifier. */
  memoryId: number;
  /** Retrieval score assigned by the search system. */
  score: number;
  /** 1-based rank position in the result list. */
  rank: number;
}
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Ground Truth Data Loader
// ---------------------------------------------------------------

import groundTruthData from './data/ground-truth.json';

export type IntentType =
  | 'add_feature'
  | 'fix_bug'
  | 'refactor'
  | 'security_audit'
  | 'understand'
  | 'find_spec'
  | 'find_decision';

export type ComplexityTier = 'simple' | 'moderate' | 'complex';

export type QueryCategory =
  | 'factual'
  | 'temporal'
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Eval Ceiling (T006f)
// ---------------------------------------------------------------
// Full-Context Ceiling Evaluation — computes the theoretical
// maximum MRR@5 assuming access to ALL memory content and
// perfect ranking ability. Pure functions, no DB writes,
// no side effects (except optional async scorer).
// ---------------------------------------------------------------

import { GroundTruthEntry } from './eval-metrics';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/** A memory record used for ceiling evaluation. */
export interface CeilingMemory {
  /** Unique memory identifier. */
  id: number;
  /** Display title used by the scorer. */
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Eval Quality Proxy (T006g)
// ---------------------------------------------------------------
// Automated quality proxy metric that correlates with manual
// quality assessment. Pure function, no DB access, no side effects.
//
// Formula:
//   qualityProxy = avgRelevance * 0.40 + topResult * 0.25
//                + countSaturation * 0.20 + latencyPenalty * 0.15
//
// All components normalised to [0, 1]. Output range: [0, 1].
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
--------------------------------------------------------------- */

/** Default latency target in milliseconds. */
const DEFAULT_LATENCY_TARGET_MS = 500;

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Ground Truth Generator
// ---------------------------------------------------------------
// T007: Functions for generating, loading, and validating the
// synthetic ground truth dataset for retrieval evaluation.
//
// Exports:
//   generateGroundTruth()          — produce the full dataset
//   loadGroundTruth(evalDb)        — populate eval DB tables
//   validateGroundTruthDiversity() — check all diversity gates
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
  QUERY_DISTRIBUTION,
  type GroundTruthQuery,
  type GroundTruthRelevance,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: BM25-Only Baseline Runner (T008)
// ---------------------------------------------------------------
//
// Runs the ground truth query set through the BM25/FTS5-only
// search path (disabling vector, graph, and trigger channels)
// and computes baseline metrics. Records results in eval DB.
//
// The baseline measurement establishes the "floor" — what simple
// keyword search achieves without any semantic, graph, or trigger
// augmentation.
//
// Design notes:
//   - The search function is injected as a dependency so tests
//     can use mocks without a live DB.
//   - The contingency decision matrix turns the measured MRR@5
//     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
//   - recordBaselineMetrics() is a pure DB write — no network I/O.
// ---------------------------------------------------------------

exec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,520p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
 */
export async function computeCeilingWithScorer(
  options: CeilingEvalOptions,
): Promise<CeilingResult> {
  if (!options.scorer) {
    return computeCeilingFromGroundTruth(options);
  }

  const { queries, memories, groundTruth, scorer, k = 5 } = options;

  if (queries.length === 0 || groundTruth.length === 0) {
    return {
      ceilingMRR: 0,
      systemMRR: options.systemMRR,
      gap: options.systemMRR !== undefined ? 0 - options.systemMRR : 0,
      perQueryCeiling: [],
      interpretation: 'No data: queries or ground truth is empty.',
    };
  }

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Context
// ---------------------------------------------------------------

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions';
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier';

// Core handlers for routing
import { handleMemorySearch } from './memory-search';
import { handleMemoryMatchTriggers } from './memory-triggers';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope';
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Search
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
// AI-WHY: tierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isEnabled as isSessionBoostEnabled } from '../lib/search/session-boost';
import { isEnabled as isCausalBoostEnabled } from '../lib/search/causal-boost';
// Sprint 5 (R6): 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
// AI-TRACE:C136-09: Artifact-class routing (spec/plan/tasks/checklist/memory)
import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';
 succeeded in 51ms:
  if (results.length === 0 || groundTruth.length === 0) return 0;

  const relevantIds = new Set(
    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
  );
  if (relevantIds.size === 0) return 0;

  const topResults = topK(results, k);
  let hits = 0;
  let sumPrecision = 0;

  for (let i = 0; i < topResults.length; i++) {
    if (relevantIds.has(topResults[i].memoryId)) {
      hits++;
      sumPrecision += hits / (i + 1); // Precision@(i+1)
    }
  }

  return sumPrecision / relevantIds.size;
}
 succeeded in 50ms:
    const by_event_type: Record<string, number> = {};
    for (const row of byTypeRows) {
      by_event_type[row.event_type] = row.cnt;
    }

    // Averages
    const avgRow = db.prepare(`
      SELECT
        AVG(result_count) as avg_results,
        AVG(latency_ms) as avg_latency
      FROM consumption_log ${whereClause}
    `).get(...params) as { avg_results: number | null; avg_latency: number | null };

    // Zero-result queries
    const zeroResultConditions = [...conditions, 'result_count = 0'];
    const zeroWhereClause = `WHERE ${zeroResultConditions.join(' AND ')}`;
    const zeroRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log ${zeroWhereClause}`).get(...params) as { cnt: number };

    // Unique sessions (add session_id IS NOT NULL to existing conditions)
    const sessionConditions = [...conditions, 'session_id IS NOT NULL'];
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Triggers
// ---------------------------------------------------------------

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

// Core utilities
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';
import { createFilePathValidator } from '../utils/validators';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters';

// Lib modules
exec
/bin/zsh -lc 'rg -n "compute(AllMetrics|MRR|NDCG|Recall|HitRate|Precision|F1|MAP|InversionRate|ConstitutionalSurfacingRate|ImportanceWeightedRecall|ColdStartDetectionRate|IntentWeightedNDCG)" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "logConsumptionEvent|initConsumptionLog|isConsumptionLogEnabled|logChannelResult|logFinalResult|logSearchQuery" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
42:/** All computed metrics returned by computeAllMetrics(). */
107:export function computeMRR(
137:export function computeNDCG(
178:export function computeRecall(
204:export function computePrecision(
223:export function computeF1(
255:export function computeMAP(
289:export function computeHitRate(
322:export function computeInversionRate(
363:export function computeConstitutionalSurfacingRate(
392:export function computeImportanceWeightedRecall(
451:export function computeColdStartDetectionRate(
510:export function computeIntentWeightedNDCG(
541:  return computeNDCG(results, weightedGT, k);
558:export function computeAllMetrics(params: {
574:    mrr: computeMRR(results, groundTruth),
575:    ndcg: computeNDCG(results, groundTruth),
576:    recall: computeRecall(results, groundTruth),
577:    precision: computePrecision(results, groundTruth),
578:    f1: computeF1(results, groundTruth),
 succeeded in 50ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:31:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:34:import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:203:    const evalEntry = logSearchQuery({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:        logFinalResult({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:445:      initConsumptionLog(db);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:447:      logConsumptionEvent(db, {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:33:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:36:import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:433:    const evalEntry = logSearchQuery({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:690:      initConsumptionLog(db);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700:      logConsumptionEvent(db, {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:      logFinalResult({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:738:      logChannelResult({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:18:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:23:import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:682:    const evalEntry = logSearchQuery({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:984:      initConsumptionLog(db);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:996:      logConsumptionEvent(db, {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1023:      logFinalResult({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1033:        logChannelResult({
codex
I’ve confirmed the runtime wiring: the three retrieval handlers still call both eval logging and consumption logging hooks. The next pass is narrowing where the markdown overstates behavior, especially around metric counts, baseline numbers, and whether “active” instrumentation is actually writing anything.
exec
/bin/zsh -lc "sed -n '430,470p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '660,760p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '970,1055p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
      results: formattedResults,
      cognitive: cognitiveStats
    },
    hints,
    startTime: startTime,
    extraMeta: {
      latencyMs: latencyMs,
      triggerSignals: detectedSignals,
    }
  });

  // AI-TRACE: T004: Consumption instrumentation — log triggers event (fail-safe, never throws)
  try {
    const db = attentionDecay.getDb();
    if (db) {
      initConsumptionLog(db);
      const resultIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
      logConsumptionEvent(db, {
        event_type: 'triggers',
        query_text: prompt,
 succeeded in 50ms:
        source: explicit_intent ? 'explicit' : 'auto-detected'
      } : null,
      // PI-B3: Folder discovery observability
      folderDiscovery: discoveredFolder ? {
        discovered: true,
        specFolder: discoveredFolder,
        source: 'folder-discovery',
      } : null,
      // C136-12: Retrieval telemetry at L1 orchestration level
      ...(retrievalTelemetry.isExtendedTelemetryEnabled() ? (() => {
        const t = retrievalTelemetry.createTelemetry();
        retrievalTelemetry.recordMode(
          t,
          effectiveMode,
          pressureOverrideApplied,
          pressurePolicy.level,
          pressurePolicy.ratio ?? undefined,
        );
        if (effectiveMode !== requested_mode && pressureOverrideApplied) {
          retrievalTelemetry.recordFallback(t, `pressure override: ${requested_mode} -> ${effectiveMode}`);
 succeeded in 50ms:
        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
      }

      responseToReturn = {
        ...responseToReturn,
        content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
      } as MCPResponse;
    }
  }

  // AI-TRACE:T004: Consumption instrumentation — log search event (fail-safe, never throws)
  try {
    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
    if (db) {
      initConsumptionLog(db);
      let resultIds: number[] = [];
      let resultCount = 0;
      try {
        if (responseToReturn?.content?.[0]?.text) {
          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Test — Consumption Logger
// ---------------------------------------------------------------
// Tests for lib/telemetry/consumption-logger.ts
// Covers: table creation, event logging, stats aggregation,
//         pattern detection, fail-safe behavior, latency tracking.
//
// NOTE: isConsumptionLogEnabled is REMOVED (hardcoded false). Tests that
// exercise logging mechanics use forceLogConsumptionEvent() which bypasses
// the flag check by inserting directly into the DB using the same SQL.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import {
  initConsumptionLog,
  logConsumptionEvent,
  getConsumptionStats,
  getConsumptionPatterns,
  isConsumptionLogEnabled,
} from '../lib/telemetry/consumption-logger';
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Test — Eval Database
// ---------------------------------------------------------------
// Verifies that initEvalDb() creates the evaluation database with
// all 5 required tables, correct columns, and that it is a
// separate file from the main context-index.sqlite.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { initEvalDb, getEvalDb, getEvalDbPath, closeEvalDb, EVAL_DB_FILENAME } from '../lib/eval/eval-db';

/* -------------------------------------------------------------
   SETUP / TEARDOWN
---------------------------------------------------------------- */

let testDataDir: string;

beforeAll(() => {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Test — Eval Metrics
// ---------------------------------------------------------------
// 9 evaluation metrics: 4 core + 5 diagnostic.
// All functions are pure computation — no DB access.

import { describe, it, expect } from 'vitest';
import {
  computeMRR,
  computeNDCG,
  computeRecall,
  computeHitRate,
  computeInversionRate,
  computeConstitutionalSurfacingRate,
  computeImportanceWeightedRecall,
  computeColdStartDetectionRate,
  computeIntentWeightedNDCG,
  computeAllMetrics,
  computePrecision,
  computeF1,
exec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "110|manualQueryCount|hardNegativeCount|QUERY_DISTRIBUTION|pattern_derived|trigger_derived|manual|hard_negative|G-NEW-2|consumption" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"0\\.2083|110|ENABLE_BM25|FTS5|hybrid performance|relative|RATIONALIZE|PROCEED|PAUSE\" \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts\" \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts\" \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts\" \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Ground Truth
// ---------------------------------------------------------------
//
// Validates:
//   T007.1  — generateGroundTruth() returns ≥100 queries
//   T007.2  — All 7 intent types have ≥5 queries
//   T007.3  — All 3 complexity tiers have ≥10 queries
//   T007.4  — ≥30 manual queries (source='manual')
//   T007.5  — ≥3 hard negative queries
//   T007.6  — No duplicate query strings
//   T007.7  — All required fields present and valid enum values
//   T007.8  — validateGroundTruthDiversity() returns all gates passed
//   T007.9  — loadGroundTruth() populates eval DB tables
//   T007.10 — Distribution summary matches actual query counts
//   T007.11 — Seed queries (ids 1-21) are all present and unmodified
//   T007.12 — Hard negatives have no relevance entries

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
 succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:18:  QUERY_DISTRIBUTION,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:34:  distribution: typeof QUERY_DISTRIBUTION;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:96: * Returns all 110 queries plus graded relevance judgments mapped
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:115:    distribution: QUERY_DISTRIBUTION,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:204: *   5. ≥30 manually curated queries (source='manual')
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:205: *   6. ≥3 hard negative queries (category='hard_negative')
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:259:  const manualCount = queries.filter(q => q.source === 'manual').length;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:261:    dimension: 'Manual queries (source=manual)',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:263:    actual: manualCount,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    passed: manualCount >= GATES.MIN_MANUAL_QUERIES,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:269:  const hardNegativeCount = queries.filter(q => q.category === 'hard_negative').length;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:273:    actual: hardNegativeCount,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:274:    passed: hardNegativeCount >= GATES.MIN_HARD_NEGATIVES,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:324:  QUERY_DISTRIBUTION,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:9://   T007.4  — ≥30 manual queries (source='manual')
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:34:  QUERY_DISTRIBUTION,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:62:  'hard_negative',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:67:const VALID_SOURCES: QuerySource[] = ['manual', 'trigger_derived', 'pattern_derived', 'seed'];
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:217:   T007.4: ≥30 manual queries (NOT trigger-derived)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:221:  it('T007.4.1: at least 30 queries have source="manual"', () => {
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Test — BM25 Baseline
// ---------------------------------------------------------------
//
// Validates:
//   T008.1  — evaluateContingency: PAUSE for MRR >= 0.80
//   T008.2  — evaluateContingency: RATIONALIZE for 0.50 <= MRR < 0.80
//   T008.3  — evaluateContingency: PROCEED for MRR < 0.50
//   T008.4  — evaluateContingency: exact boundary 0.80 → PAUSE
//   T008.5  — evaluateContingency: exact boundary 0.50 → RATIONALIZE
//   T008.6  — recordBaselineMetrics: writes all 5 metric rows to eval DB
//   T008.7  — recordBaselineMetrics: contingency metadata stored as JSON
//   T008.8  — runBM25Baseline: runs with mocked search function
//   T008.9  — runBM25Baseline: respects queryLimit config option
//   T008.10 — runBM25Baseline: skipHardNegatives reduces query count
//   T008.11 — runBM25Baseline: returns well-structured BM25BaselineResult
//   T008.12 — runBM25Baseline: disables non-BM25 channels (only calls searchFn)

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:5:// Runs the ground truth query set through the BM25/FTS5-only
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:17://     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:43:  /** Maximum number of queries to run. Defaults to all 110. */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:77:  /** Gate action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED'. */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:78:  action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:81:  /** Comparison mode: 'absolute' (Sprint 0) or 'relative' (Sprint 1+). */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:82:  mode?: 'absolute' | 'relative';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:83:  /** Hybrid MRR@5 used as reference (relative mode only). */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:85:  /** BM25/hybrid ratio (relative mode only). */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:97:  /** Retrieval score (raw BM25 / FTS5 rank). */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:117: * using ONLY the BM25/FTS5 channel (vector, graph, trigger disabled).
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:118: * For production use, wire up the FTS5 path from hybrid-search with all
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:134: *   MRR@5 >= 0.80 → PAUSE
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:139: *   MRR@5 0.50–0.79 → RATIONALIZE
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:144: *   MRR@5 < 0.50 → PROCEED
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:157:      action: 'PAUSE',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:171:      action: 'RATIONALIZE',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:183:    action: 'PROCEED',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:194:   Spec: "BM25 >= 80% of hybrid MRR@5" → PAUSE.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:198: * Evaluate BM25 performance relative to hybrid MRR@5 (spec-compliant).
exec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "ENABLE_BM25|BM25" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Hybrid Search
// ---------------------------------------------------------------
// AI-WHY: Combines vector, FTS, and BM25 search with fallback

/* --- 1. IMPORTS --- */

// Local
import { getIndex } from './bm25-index';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import { hybridAdaptiveFuse } from '@spec-kit/shared/algorithms/adaptive-fusion';
import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cache/cognitive/co-activation';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier';
import { fts5Bm25Search } from './sqlite-fts';
import {
  isMMREnabled,
  isCrossEncoderEnabled,
  isLocalRerankerEnabled,
  isSearchFallbackEnabled,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Search Flags
// ---------------------------------------------------------------
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
 succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// AI-WHY: Combines vector, FTS, and BM25 search with fallback
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:87:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:242:/* --- 8. BM25 SEARCH --- */
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:245: * Search the BM25 index with optional spec folder filtering.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:248: * @returns Array of BM25-scored results tagged with source 'bm25'.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:    // AI-WHY: Fix #8 (017-refinement-phase-6) — BM25 document IDs are stringified
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:283:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:289: * Check whether the BM25 index is populated and available for search.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:290: * @returns True if the BM25 index exists and contains at least one document.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:323: * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:337:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:359: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:395: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:448:  // BM25 search
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:617:    // BM25 channel (internal error handling in bm25Search) — gated by Sprint 3 routing
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:621:        // AI-WHY: BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:622:        // has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1074:  // AI-WHY: Fallback to BM25 only
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:158:// REQ-031: Deferred indexing - entry searchable via BM25/FTS5 only
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:226:  logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path'); const dir=path.resolve('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement'); const files=fs.readdirSync(dir).filter(f=>/"'^0[1-8]-.*'"\\.md"'$/.test(f)).sort(); for(const file of files){ const text=fs.readFileSync(path.join(dir,file),'"'utf8'); const matches=[...text.matchAll(/"'`(mcp_server'"\\/["'^`]+)`/g)].map(m=>m[1]); console.log('"'FILE:'+file); for(const rel of matches){ const full=path.resolve('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit', rel); console.log(rel+' => '+(fs.existsSync(full)?'OK':'MISSING')); } }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "python3 -c 'import os,re; from pathlib import Path; base=Path(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\"); dir=base/\"feature_catalog/09--evaluation-and-measurement\"; files=sorted([p for p in dir.iterdir() if re.match(r\"0[1-8]-.*\\\\.md"'$", p.name)]); 
for f in files:
    print("FILE:"+f.name)
    text=f.read_text()
    for rel in re.findall(r"`(mcp_server/[''^`]+)`", text):
        print(f"{rel} => {'"'OK' if (base/rel).exists() else 'MISSING'}\")'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 602ms:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-KLqB9VnN' (errno=Operation not permitted)
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-2NElTKsH' (errno=Operation not permitted)
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const base=path.resolve(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\"); const dir=path.join(base,\"feature_catalog/09--evaluation-and-measurement\"); const files=fs.readdirSync(dir).filter(f=>/"'^0[1-8]-.*'"\\.md"'$/.test(f)).sort(); for (const file of files){ console.log("FILE:"+file); const text=fs.readFileSync(path.join(dir,file),"utf8"); const matches=[...text.matchAll(/`(mcp_server'"\\/["'^`]+)`/g)].map(m=>m[1]); for (const rel of matches){ console.log(rel+" => "+(fs.existsSync(path.join(base,rel))?"OK":"MISSING")); } }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
FILE:01-evaluation-database-and-schema.md
mcp_server/lib/eval/eval-db.ts => OK
mcp_server/tests/eval-db.vitest.ts => OK
FILE:02-core-metric-computation.md
mcp_server/lib/eval/eval-metrics.ts => OK
mcp_server/tests/eval-metrics.vitest.ts => OK
FILE:03-observer-effect-mitigation.md
mcp_server/lib/eval/eval-db.ts => OK
mcp_server/lib/eval/shadow-scoring.ts => OK
mcp_server/tests/eval-db.vitest.ts => OK
mcp_server/tests/scoring.vitest.ts => OK
mcp_server/tests/shadow-scoring.vitest.ts => OK
FILE:04-full-context-ceiling-evaluation.md
mcp_server/lib/eval/eval-ceiling.ts => OK
mcp_server/lib/eval/eval-metrics.ts => OK
mcp_server/tests/eval-metrics.vitest.ts => OK
FILE:05-quality-proxy-formula.md
mcp_server/lib/eval/eval-quality-proxy.ts => OK
FILE:06-synthetic-ground-truth-corpus.md
mcp_server/lib/eval/ground-truth-data.ts => OK
exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "p95|95|latency|overhead|10%|5ms|health check|healthcheck|alert|budget" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// TEST: Shadow Scoring + Channel Attribution
// R13-S2: Shadow scoring infrastructure, channel attribution,
// and Exclusive Contribution Rate metric.
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import {
  runShadowScoring,
  compareShadowResults,
  logShadowComparison,
  getShadowStats,
  _resetSchemaFlag,
  type ScoredResult,
  type ShadowConfig,
  type ShadowComparison,
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:61:    latency_ms REAL,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:74:    latency_ms REAL,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:50:        { memoryId: 2, score: 0.95, rank: 1 },
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:421:        { memoryId: 42, score: 0.95, rank: 1 },
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:428:      expect(attributed[0].score).toBe(0.95);
 succeeded in 50ms:
// ---------------------------------------------------------------
// TEST: SCORING
// ---------------------------------------------------------------

/**
 * scoring.vitest.ts — Decay & Recency Scoring Tests (T505)
 *
 * Tests the decay/recency/boost behavior of composite-scoring.ts.
 * Focuses on temporal decay curves, recency scoring, constitutional
 * exemptions, edge cases, and batch ordering — complementing the
 * broader API coverage in composite-scoring.vitest.ts.
 *
 * Original intent: 19 tests for legacy scoring.js (calculateDecayBoost,
 * adjustScoreWithDecay, batchAdjustScores, DECAY_CONFIG). Rewritten
 * to target the actual composite-scoring.ts exports.
 */
import { describe, it, expect } from 'vitest';

import {
  calculateRecencyScore,
exec
/bin/zsh -lc 'rg --files "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests" | rg "quality-proxy|eval-ceiling|ground-truth-feedback|channel-attribution|eval-logger|reporting-dashboard|ablation-framework|shadow-scoring|consumption-logger|bm25-baseline|eval-metrics|ground-truth"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "computeCeilingWithScorer|interpretCeilingVsBaseline|ceilingMRR|theoretical|upper bound|quadrant" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "computeQualityProxy|quality proxy|excellent|good|acceptable|poor" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:434:      // High everything: test upper bound
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:487:      expect(sum).toBeLessThan(3.0); // Sanity upper bound
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:477:    // Test upper bound - try to exceed 10
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:8:  interpretCeilingVsBaseline,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:51:  it('T006f-01: perfect ranking → ceilingMRR = 1.0', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:60:    expect(result.ceilingMRR).toBeCloseTo(1.0, 5);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:67:  it('T006f-02: no relevant results in ground truth → ceilingMRR = 0.0', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:75:    expect(result.ceilingMRR).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:80:  it('T006f-03: gap = ceilingMRR − systemMRR when systemMRR provided', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:90:    // Both queries have their best result at rank 1 → ceilingMRR = 1.0
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:91:    expect(result.ceilingMRR).toBeCloseTo(1.0, 5);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:96:  it('T006f-04: gap equals ceilingMRR when systemMRR is not provided', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:105:    expect(result.gap).toBeCloseTo(result.ceilingMRR, 5);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:151:    expect(result.ceilingMRR).toBeCloseTo(1.0, 5);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:155:  it('T006f-07: empty queries → ceilingMRR = 0 and empty perQueryCeiling', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:163:    expect(result.ceilingMRR).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:168:  it('T006f-08: empty groundTruth → ceilingMRR = 0', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:176:    expect(result.ceilingMRR).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:180:  it('T006f-09: ceilingMRR is always in [0, 1]', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:188:    expect(result.ceilingMRR).toBeGreaterThanOrEqual(0);
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:98:      // If CWD is not in ALLOWED_BASE_PATHS, this may throw — that's acceptable
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:65:        // Also acceptable: throwing is valid behavior
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:155:    const content = 'Hello World is good. Hello World is great. Hello World is best.';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:509:      // No results is acceptable too
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:150:      // If we get here without throwing, values should be numbers (NaN is acceptable for typed params)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:155:      // Throwing is also acceptable defensive behavior
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:232:    const acceptableActions = ['REINFORCE', 'UPDATE', 'CREATE_LINKED', 'SUPERSEDE', 'CREATE'];
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:233:    expect(acceptableActions).toContain(resultAt.action);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:328:    // Realistic distribution: top results are good, then a cliff, then irrelevant.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:347:  it('T26: larger tail removal — 10 results with 4 good, 6 irrelevant', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:50:        // DB or infra errors are acceptable (no DB in test env)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:78:      // DB/infra errors are acceptable in test env.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:92:      // DB/infra errors are acceptable in test env.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:25:      // result may be false without DB, or truthy with DB — either is acceptable
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:468:        // May fail due to missing FSRS columns - acceptable
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:112:      tolerance: 0.15, // max acceptable quality gap
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:137:      // Either clamped to floor or deleted — both are acceptable
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:141:      // If null, that's also acceptable (deleted below threshold)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:171:        // DB errors are acceptable (means validation passed)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:190:        // Either validation error or DB error is acceptable
exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Ceiling Quality
// ---------------------------------------------------------------
import { describe, it, expect } from 'vitest';

import {
  computeCeilingFromGroundTruth,
  interpretCeilingVsBaseline,
  type CeilingEvalOptions,
  type CeilingQuery,
  type CeilingMemory,
} from '../lib/eval/eval-ceiling';

import {
  computeQualityProxy,
  WEIGHTS,
  DEFAULT_LATENCY_TARGET_MS,
} from '../lib/eval/eval-quality-proxy';

import type { GroundTruthEntry } from '../lib/eval/eval-metrics';
exec
/bin/zsh -lc "node -e 'const data=require(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json\"); const qs=data.queries; const by=(k)=>qs.reduce((a,q)=>(a[q[k]]=(a[q[k]]||0)+1,a),{}); console.log(JSON.stringify({total:qs.length, bySource:by(\"source\"), byIntentType:by(\"intentType\"), byComplexityTier:by(\"complexityTier\"), byCategory:by(\"category\")}, null, 2));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
{
  "total": 110,
  "bySource": {
    "seed": 21,
    "pattern_derived": 35,
    "trigger_derived": 14,
    "manual": 40
  },
  "byIntentType": {
    "understand": 39,
    "find_decision": 12,
    "fix_bug": 12,
    "add_feature": 13,
    "find_spec": 19,
    "refactor": 7,
    "security_audit": 8
  },
  "byComplexityTier": {
    "simple": 37,
    "moderate": 53,
exec
/bin/zsh -lc 'rg -n "G-NEW-2|consumption|pattern_derived|agent consumption|query patterns|manual" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:27:export type QuerySource = 'manual' | 'trigger_derived' | 'pattern_derived' | 'seed';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:69:    pattern_derived: GROUND_TRUTH_QUERIES.filter(q => q.source === 'pattern_derived').length,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:71:    manual: GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual').length,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:77:  manualQueryCount: GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual').length,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:204: *   5. ≥30 manually curated queries (source='manual')
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:259:  const manualCount = queries.filter(q => q.source === 'manual').length;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:261:    dimension: 'Manual queries (source=manual)',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:263:    actual: manualCount,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    passed: manualCount >= GATES.MIN_MANUAL_QUERIES,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:219:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:229:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:239:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:249:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:259:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:269:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:279:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:289:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:299:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:309:      "source": "pattern_derived",
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:319:      "source": "pattern_derived",
exec
/bin/zsh -lc 'rg -n "computeQualityProxy|eval-quality-proxy|quality proxy" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:297:├── ceiling-quality.vitest.ts             # Ceiling quality proxy
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:50:| **QualityMetrics** | Composite 0–1 quality proxy derived from relevance, result count, and latency |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:146:| `qualityProxyScore` | `number` | Composite quality proxy score (0–1) |
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:32:/** Maximum latency value (ms) for quality proxy normalization.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:190:  t.quality.qualityProxyScore = computeQualityProxy(t);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:211: * Compute a 0-1 quality proxy score from the telemetry record.
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:219:function computeQualityProxy(t: RetrievalTelemetry): number {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:308:  computeQualityProxy,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:246:│   ├── eval-quality-proxy.ts   # Quality proxy scoring
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:15:  computeQualityProxy,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:18:} from '../lib/eval/eval-quality-proxy';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:259:describe('T006g: computeQualityProxy', () => {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:262:    const result = computeQualityProxy({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:277:    const result = computeQualityProxy({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:295:    const result = computeQualityProxy({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:314:    const result = computeQualityProxy({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:329:    const result = computeQualityProxy({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:344:    const result = computeQualityProxy({
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:367:    const result = computeQualityProxy(input);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ceiling-quality.vitest.ts:381:    const result = computeQualityProxy({
exec
/bin/zsh -lc "sed -n '180,250p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      if (typeof r.score === 'number' && Number.isFinite(r.score)) return r.score;
      if (typeof r.similarity === 'number' && Number.isFinite(r.similarity)) return r.similarity / 100;
      return 0;
    });
    // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
    t.quality.topResultScore = scores.reduce((a, b) => Math.max(a, b), -Infinity);
    t.quality.avgRelevanceScore = scores.reduce((sum, s) => sum + s, 0) / count;
  }

  t.quality.boostImpactDelta = Number.isFinite(boostDelta) ? boostDelta : 0;
  t.quality.qualityProxyScore = computeQualityProxy(t);
}

function recordTracePayload(t: RetrievalTelemetry, payload: unknown): boolean {
  if (!t.enabled) return false;

  const sanitized = sanitizeRetrievalTracePayload(payload);
  if (!sanitized) {
    delete t.tracePayload;
    return false;
exec
/bin/zsh -lc "sed -n '540,620p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

  return computeNDCG(results, weightedGT, k);
}

/* ---------------------------------------------------------------
   5. CONVENIENCE: COMPUTE ALL METRICS
--------------------------------------------------------------- */

/**
 * Compute all 11 metrics (6 core + 5 diagnostic) in one call.
 *
 * @param params.results             Retrieved results for the query.
 * @param params.groundTruth         Ground truth relevance judgments.
 * @param params.constitutionalIds   Memory IDs that are constitutional tier.
 * @param params.memoryTimestamps    Map from memoryId → creation Date.
 * @param params.intentType          Intent type for intent-weighted NDCG.
 * @returns Record mapping metric name to computed value in [0, 1].
 */
export function computeAllMetrics(params: {
  results: EvalResult[];
exec
/bin/zsh -lc "sed -n '1,220p' \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Test — Eval Logger
// ---------------------------------------------------------------
// Verifies that logSearchQuery, logChannelResult, and
// logFinalResult correctly insert records into the eval DB,
// are no-ops when SPECKIT_EVAL_LOGGING=false, and never throw.
//
// Verifies that enabling SPECKIT_EVAL_LOGGING does not add
// more than 10% overhead to the core logging operations
// (observer-effect mitigation benchmark).

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { initEvalDb, getEvalDb, closeEvalDb } from '../lib/eval/eval-db';
import {
  isEvalLoggingEnabled,
  generateEvalRunId,
  logSearchQuery,
exec
/bin/zsh -lc 'rg -n "10%|overhead|p95|latency" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
9:// more than 10% overhead to the core logging operations
196:        latencyMs: 42,
239:        latencyMs: 123,
361:   * Measure p95 latency for N iterations of a function.
362:   * Returns the p95 in milliseconds.
373:    const p95idx = Math.floor(times.length * 0.95);
374:    return times[p95idx];
377:  it('T004b-1: eval logging overhead (p95) is less than 10ms absolute', () => {
378:    // This is a loose guard: each individual log call should complete in < 10ms on p95.
379:    // A full end-to-end search takes 100-500ms, so 10ms headroom is well within 10%.
399:    // Assert absolute overhead < 10ms on p95
402:    // Also assert that the overhead ratio is reasonable
404:    const overhead = treatmentP95 - controlP95;
405:    expect(overhead).toBeLessThan(10);
412:    const p95 = measureP95(() => {
420:    // No-op path should be sub-millisecond on p95
421:    expect(p95).toBeLessThan(1);
424:  it('T004b-3: observer effect relative overhead does not exceed 10% of a representative search baseline', () => {
425:    // Simulate a representative "search baseline" time: 50ms (well within real search latency).
426:    // The logging overhead (treatment - control) must be < 10% of 50ms = 5ms.
exec
/bin/zsh -lc 'rg -n "recordBaselineMetrics|eval_metric_snapshots|GROUND_TRUTH_RELEVANCES|loadGroundTruth|queryLimit|skipHardNegatives|getIndex|ENABLE_BM25" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
18://   - recordBaselineMetrics() is a pure DB write — no network I/O.
33:  GROUND_TRUTH_RELEVANCES,
44:  queryLimit?: number;
48:  skipHardNegatives?: boolean;
396: * Record BM25 baseline metrics to the eval DB (eval_metric_snapshots table).
406:export function recordBaselineMetrics(
415:    INSERT INTO eval_metric_snapshots
477:    queryLimit,
479:    skipHardNegatives = false,
493:  if (skipHardNegatives) {
496:  if (queryLimit !== undefined && queryLimit > 0) {
497:    queries = queries.slice(0, queryLimit);
580:  return GROUND_TRUTH_RELEVANCES
codex
Verified the actual on-disk files `01` through `08` in that folder; numeric slots `02` through `07` are currently named differently than the filenames quoted in the prompt.

---
FEATURE: 01-evaluation-database-and-schema.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [eval-logger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The five-table separate eval DB is real, and the fail-safe gated logging behavior matches code. The source list is incomplete because the description explicitly discusses logger and handler wiring that are not listed.

---
FEATURE: 02-core-metric-computation.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: `eval-metrics.ts` currently computes 12 metrics in `computeAllMetrics`, not 11. The grouping in the snippet is stale and does not match the returned metric set.

---
FEATURE: 03-observer-effect-mitigation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [eval-logger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: Non-blocking/fail-safe behavior exists, and shadow scoring is disabled, but there is no runtime health check or alerting path comparing enabled vs disabled search p95 latency. The listed `scoring.vitest.ts` exists but is generic composite-scoring coverage, not the main observer-effect implementation.

---
FEATURE: 04-full-context-ceiling-evaluation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The ceiling computation and 2x2 interpretation matrix exist, but the current implementation defaults to ground-truth ordering unless a caller supplies a scorer. There is no built-in production LLM workflow that automatically ranks all titles/summaries.

---
FEATURE: 05-quality-proxy-formula.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [retrieval-telemetry.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts)
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The formula and weights are correct, but `eval-quality-proxy.ts` is only a pure function. Automatic logged-data regression detection and correlation-validation claims are not implemented here, and an important runtime quality-proxy implementation also exists in telemetry.

---
FEATURE: 06-synthetic-ground-truth-corpus.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [ground-truth.json](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The corpus shape matches code/data: 110 queries, 40 manual queries, 7 intents, 3 complexity tiers, and hard negatives. The actual corpus data file is omitted from the source list, and the “G-NEW-2 agent consumption analysis” provenance is not evidenced in code.

---
FEATURE: 07-bm25-only-baseline.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The baseline runner and contingency matrix exist, and `ENABLE_BM25` is default-on in the BM25 index. The hard-coded `MRR@5 = 0.2083`, the “below 50% of hybrid” claim, and the historical decision narrative are not present in source.

---
FEATURE: 08-agent-consumption-instrumentation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Handler wiring is still present and `isConsumptionLogEnabled()` is hardcoded `false`, so row logging is inert. But the handlers still call `initConsumptionLog`, so this is not a total runtime no-op, and the ground-truth-design provenance claim is not directly evidenced in code.


tokens used
144,521
Verified the actual on-disk files `01` through `08` in that folder; numeric slots `02` through `07` are currently named differently than the filenames quoted in the prompt.

---
FEATURE: 01-evaluation-database-and-schema.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [eval-logger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The five-table separate eval DB is real, and the fail-safe gated logging behavior matches code. The source list is incomplete because the description explicitly discusses logger and handler wiring that are not listed.

---
FEATURE: 02-core-metric-computation.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: `eval-metrics.ts` currently computes 12 metrics in `computeAllMetrics`, not 11. The grouping in the snippet is stale and does not match the returned metric set.

---
FEATURE: 03-observer-effect-mitigation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [eval-logger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: Non-blocking/fail-safe behavior exists, and shadow scoring is disabled, but there is no runtime health check or alerting path comparing enabled vs disabled search p95 latency. The listed `scoring.vitest.ts` exists but is generic composite-scoring coverage, not the main observer-effect implementation.

---
FEATURE: 04-full-context-ceiling-evaluation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The ceiling computation and 2x2 interpretation matrix exist, but the current implementation defaults to ground-truth ordering unless a caller supplies a scorer. There is no built-in production LLM workflow that automatically ranks all titles/summaries.

---
FEATURE: 05-quality-proxy-formula.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [retrieval-telemetry.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts)
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The formula and weights are correct, but `eval-quality-proxy.ts` is only a pure function. Automatic logged-data regression detection and correlation-validation claims are not implemented here, and an important runtime quality-proxy implementation also exists in telemetry.

---
FEATURE: 06-synthetic-ground-truth-corpus.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [ground-truth.json](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The corpus shape matches code/data: 110 queries, 40 manual queries, 7 intents, 3 complexity tiers, and hard negatives. The actual corpus data file is omitted from the source list, and the “G-NEW-2 agent consumption analysis” provenance is not evidenced in code.

---
FEATURE: 07-bm25-only-baseline.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The baseline runner and contingency matrix exist, and `ENABLE_BM25` is default-on in the BM25 index. The hard-coded `MRR@5 = 0.2083`, the “below 50% of hybrid” claim, and the historical decision narrative are not present in source.

---
FEATURE: 08-agent-consumption-instrumentation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Handler wiring is still present and `isConsumptionLogEnabled()` is hardcoded `false`, so row logging is inert. But the handlers still call `initConsumptionLog`, so this is not a total runtime no-op, and the ground-truth-design provenance claim is not directly evidenced in code.

