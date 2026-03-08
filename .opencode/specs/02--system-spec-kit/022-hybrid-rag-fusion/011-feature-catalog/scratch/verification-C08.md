OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-10de-76a2-8340-fa709bbadff9
--------
user
You are a feature catalog verification agent. Read these specific feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md (files 09 through 14). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying the feature catalog snippets against the actual `system-spec-kit` MCP server code. I’ll first do the required routing/context checks from the repo instructions, then I’ll read feature files `09` through `14`, inspect their listed source files, and compare each “Current Reality” section to the implementation.
tool codex.list_mcp_resources({})
codex.list_mcp_resources({}) success in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resources\":[]}"
    }
  ],
  "isError": false
}
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' . .opencode/skill/system-spec-kit" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
./AGENTS.md
./.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
./.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog snippets 09 through 14 under .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement against actual code in .opencode/skill/system-spec-kit/mcp_server, checking Current Reality accuracy, path validity, and missing important source files" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 732ms:
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
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !opencode, check~, code(name), opencode(name)"
  },
  {
    "skill": "sk-code--full-stack",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit` via advisor (`confidence 0.95`). I’m loading only the parts of that skill that matter for research/verification, along with the six target feature snippets, so we can compare their descriptions against the actual MCP server implementation without drifting scope.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-threshold-validation-and-teaching.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-continue-decision-flow.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-token-economics-scoring.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-append-notes-pipeline.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
# Scoring observability

## Current Reality

Interference score distributions are logged at query time via 5% sampling to a `scoring_observations` table. Each observation captures memory ID, query ID, interference penalty, score before and after and the delta.

The novelty boost (`calculateNoveltyBoost`) was removed from the hot scoring path during Sprint 8 remediation because it always returned 0 (the feature completed its evaluation). Telemetry now hardcodes `noveltyBoostApplied: false, noveltyBoostValue: 0` for backward-compatible log schemas.

The 5% sample rate keeps storage costs low while still catching calibration drift. A try-catch wrapper guarantees that telemetry failures never affect scoring results. If the observation write fails, the search result is unchanged and the failure is swallowed silently.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |

### Tests

 succeeded in 50ms:
# Cross-AI validation fixes

## Current Reality

Independent reviews by Gemini 3.1 Pro and Codex gpt-5.3-codex identified 14 issues missed by the original audit. Key fixes:

- **CR-P0-1:** Test suite false-pass patterns — 21 silent-return guards converted to `it.skipIf()`, fail-fast imports with throw on required handler/vectorIndex missing.
- **CR-P1-1:** Deletion exception propagation — causal edge cleanup errors in single-delete now propagate (previously swallowed).
- **CR-P1-2:** Re-sort after feedback mutations before top-K slice in Stage 2 fusion.
- **CR-P1-3:** Dedup queries gained `AND parent_id IS NULL` to exclude chunk rows.
- **CR-P1-4:** Session dedup `id != null` guards against undefined collapse.
- **CR-P1-5:** Cache lookup moved before embedding readiness gate in search handler.
- **CR-P1-6:** Partial-update DB mutations wrapped inside transaction.
- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
- **CR-P2-3:** Dashboard row limit configurable via `SPECKIT_DASHBOARD_LIMIT` (default 10000) with NaN guard.
- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.

All 14 items verified through 3-stage review: Codex implemented, Gemini reviewed, Claude final-reviewed.

## Source Files
 succeeded in 50ms:
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

 exited 1 in 51ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-threshold-validation-and-teaching.md: No such file or directory
 exited 1 in 51ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-token-economics-scoring.md: No such file or directory
 exited 1 in 51ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-continue-decision-flow.md: No such file or directory
 exited 1 in 50ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-append-notes-pipeline.md: No such file or directory
codex
I’ve confirmed the routed skill and one immediate issue: the directory contains `09` and `14`, but the exact `10`-`13` filenames the prompt gave do not exist at those paths. I’m checking the directory listing next so I can verify whether those files were renamed and keep the report precise instead of guessing.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server -maxdepth 4 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md
 succeeded in 51ms:
Total output lines: 2552

.opencode/skill/system-spec-kit/mcp_server/.github/hooks/superset-notify.json
.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skill/system-spec-kit/mcp_server/LICENSE
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/_pending
.opencode/skill/system-spec-kit/mcp_server/api/README.md
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/cli.ts
.opencode/skill/system-spec-kit/mcp_server/configs/README.md
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
codex
The directory does have the `09`-`14` range, but `10`-`13` were renamed. I’m using the actual numbered files present in that folder for verification, then I’ll call out any naming/path issues explicitly in the report instead of treating renamed files as missing implementation.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Full reporting and ablation study framework

## Current Reality

The ablation study framework disables one retrieval channel at a time (vector, BM25, FTS5, graph or trigger) and measures Recall@20 delta against a full-pipeline baseline. "What happens if we turn off the graph channel?" is now a question with a measured answer rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. Runs behind the `SPECKIT_ABLATION` flag.

The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/ablation-framework.ts` | Lib | Ablation study framework |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |
 succeeded in 52ms:
# Evaluation and housekeeping fixes

## Current Reality

Six fixes addressed evaluation framework reliability and protocol-boundary safety:

- **Ablation recallK (#33):** Ablation search limit uses `recallK` parameter instead of hardcoded 20.
- **evalRunId persistence (#34):** `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in the eval DB on first call, surviving server restarts.
- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
- **parseArgs guard (#36):** `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input at the protocol boundary.
- **128-bit dedup hash (#37):** Session dedup hash extended from `.slice(0, 16)` (64-bit) to `.slice(0, 32)` (128-bit) to reduce collision probability.
- **Exit handler cleanup (#38):** `_exitFlushHandler` reference stored; `cleanupExitHandlers()` now calls `process.removeListener()` for `beforeExit`, `SIGTERM`, and `SIGINT`.

---

## Source Files

### Implementation

| File | Layer | Role |
 succeeded in 52ms:
# Shadow scoring and channel attribution

## Current Reality

Full A/B comparison infrastructure ran alternative scoring algorithms in parallel, logging results without affecting live ranking. The system computed detailed comparison metrics including Kendall tau rank correlation, per-result score deltas, and production-only versus shadow-only result sets. Channel attribution tagged each result with its source channels and computed Exclusive Contribution Rate per channel: how often each channel was the sole source for a result in the top-k window.

Ground truth expansion via implicit user selection tracking and an LLM-judge stub interface were included for future corpus growth.

Shadow scoring completed its evaluation purpose and has been fully removed. The `isShadowScoringEnabled()` function and shadow-scoring branches in `hybrid-search.ts` were deleted during Sprint 8 remediation. The `runShadowScoring` and `logShadowComparison` function bodies now return immediately (`return null` and `return false` respectively). The `SPECKIT_SHADOW_SCORING` flag remains as a no-op for backward compatibility. This shadow-scoring cleanup is independent from R11 learned-feedback safeguards, where `isInShadowPeriod()` remains active. Channel attribution logic remains active within the 4-stage pipeline.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/channel-attribution.ts` | Lib | Channel attribution analysis |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
 succeeded in 52ms:
# Test quality improvements

## Current Reality

Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).

---

## Source Files

codex
I’ve got the six feature snippets now. Next I’m tracing each one into the implementation with targeted searches, because several descriptions already look cross-cutting and may depend on more files than the `## Source Files` section currently lists.
exec
/bin/zsh -lc 'rg -n "scoring_observations|calculateNoveltyBoost|noveltyBoostApplied|noveltyBoostValue|5%|sample rate|interference penalty|score before|score after" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"recallK|_evalRunCounter|MAX\\(eval_run_id\\)|task_postflight|phase IN \\('preflight', 'complete'\\)|parseArgs<|returns \\{\\} as T|slice\\(0, 32\\)|slice\\(0, 16\\)|_exitFlushHandler|cleanupExitHandlers|removeListener\\(|beforeExit|SIGTERM|SIGINT\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"5000ms|15000ms|db.close\\(\\)|tautological|behavioral differences|T007|z_archive|isMemoryFile\\(|memory-save-extended|entity-linker|integration-search-pipeline|7003|7027|removed dead-code features\" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/lib" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "eval_run_ablation|eval_reporting_dashboard|SPECKIT_ABLATION|sign test|Kendall|Exclusive Contribution Rate|negative timestamp|isHigherBetter|sprint label|eval_metric_snapshots|channel attribution|shadow scoring|SPECKIT_SHADOW_SCORING|runShadowScoring|logShadowComparison|isShadowScoringEnabled|isInShadowPeriod" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/schemas' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:654:process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:655:process.on('SIGINT', () => gracefulShutdown('SIGINT'));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:  return crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 32);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:70:    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:288:        `Call task_postflight with taskId: "${taskId}" after completing the task`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:303:/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:339:    WHERE spec_folder = ? AND task_id = ? AND phase IN ('preflight', 'complete')
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:416:      tool: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:632:      hints.push('Call task_postflight to complete learning measurement');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:669:const handle_task_postflight = handleTaskPostflight;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:675:  handle_task_postflight,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:383:        recallK: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:892:      recallK: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:25:  { tool: 'task_postflight', handler: 'handleTaskPostflight', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:51:  { camel: 'handleTaskPostflight', snake: 'handle_task_postflight' },
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:32:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:76:  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:77:    ? Math.max(1, Math.floor(args.recallK))
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:85:      // AI-WHY: Fix #33 (017-refinement-phase-6) — Use recallK, not hardcoded 20
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:86:      limit: recallK,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:67: * - At 90 days: penalty at ~12.5%
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:156: interference-scoring.ts  # TM-01 interference penalty for redundant memories (Sprint 2)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:166:| `composite-scoring.ts` | Main scoring engine with 5-factor REQ-017 model, N4 cold-start novelty boost, score normalization, interference penalty integration |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:170:| `interference-scoring.ts` | TM-01 interference penalty: counts similar memories in same spec_folder, applied as scoring penalty to demote redundant results |
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:6:  calculateNoveltyBoost,
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:33:// N4: calculateNoveltyBoost
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:36:describe('calculateNoveltyBoost — flag disabled (default)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:42:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:48:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:53:describe('calculateNoveltyBoost — feature removed (always returns 0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:64:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:70:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:76:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:82:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:87:    expect(calculateNoveltyBoost(undefined)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:88:    expect(calculateNoveltyBoost(null as unknown as string)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:92:    expect(calculateNoveltyBoost('not-a-date')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:93:    expect(calculateNoveltyBoost('')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:98:    expect(calculateNoveltyBoost(futurestamp)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:103:    expect(calculateNoveltyBoost(oldStamp)).toBe(0);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:346:  name: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:347:  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:363:      storeResults: { type: 'boolean', default: true, description: 'Persist ablation metrics to eval_metric_snapshots (default: true).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:371:  name: 'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:377:      sprintFilter: { type: 'array', items: { type: 'string' }, description: 'Optional sprint label filters.' },
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:344:  eval_run_ablation: evalRunAblationSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:345:  eval_reporting_dashboard: evalReportingDashboardSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:375:  eval_run_ablation: ['channels', 'groundTruthQueryIds', 'recallK', 'storeResults', 'includeFormattedReport'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:376:  eval_reporting_dashboard: ['sprintFilter', 'channelFilter', 'metricFilter', 'limit', 'format'],
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:358:    it('T031-HYB-S4-01: shadow scoring does NOT attach metadata (REMOVED flag)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:359:      const originalShadowFlag = process.env.SPECKIT_SHADOW_SCORING;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:360:      process.env.SPECKIT_SHADOW_SCORING = 'true';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:372:          delete process.env.SPECKIT_SHADOW_SCORING;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:374:          process.env.SPECKIT_SHADOW_SCORING = originalShadowFlag;
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:37:  'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:38:  'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:51:    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:52:    case 'eval_reporting_dashboard':   return handleEvalReportingDashboard(parseArgs<EvalReportingDashboardArgs>(validateToolArgs('eval_reporting_dashboard', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:161:    savedAblationEnv = process.env.SPECKIT_ABLATION;
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:167:      process.env.SPECKIT_ABLATION = savedAblationEnv;
 succeeded in 51ms:
Total output lines: 376

.opencode/skill/system-spec-kit/mcp_server/tests/README.md:241:├── memory-save-extended.vitest.ts         # Extended save operations
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:269:├── integration-search-pipeline.vitest.ts  # Search pipeline integration
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:370:| `integration-search-pipeline.vitest.ts` | Search pipeline integration |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:467:#  Tests       7003 passed
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:19:} from '../lib/search/entity-linker';
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:175:    db.close();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1488:/* --- 14. PRE-FLIGHT TOKEN BUDGET VALIDATION (T007) --- */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677:  // T007: Token budget validation
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1698:  // T007: Token budget types
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:121:        { path: 'specs/z_archive/old-project', expected: true },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:134:      const archiveMultiplier = mod.getArchiveMultiplier('specs/z_archive/old');
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:143:        createMemory({ specFolder: 'z_archive/old', spec_folder: 'z_archive/old' }),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:24:const TEST_DB_DIR = path.join(os.tmpdir(), 'speckit-test-memory-save-extended-' + process.pid);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:152:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:160:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:168:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:176:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:184:      db.close();
Plan update
Verification is in progress. I’ve resolved the actual 09-14 feature files and mapped the key implementation areas; now I’m reading the relevant source modules to judge description accuracy and detect missing source paths.
  ✓ Read feature catalog files 09-14 and resolve actual filenames in the range
  → Inspect listed implementation and test files plus adjacent registration/integration files in mcp_server
  • Assess accuracy, validate paths, identify missing source files, and prepare per-feature report
codex
A couple of the snippets are clearly anchored in more than one layer: library logic, MCP handler/tool registration, and sometimes the live search pipeline. I’m reading those concrete source sections now so I can separate “description is right” from “source file inventory is incomplete,” which are turning out to be different answers for some features.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '460,560p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Scoring Observability (T010)
// ---------------------------------------------------------------
// AI-WHY: Lightweight observability logging for N4 cold-start boost and
// TM-01 interference scoring values at query time.
// Sampled at 5% of queries to avoid performance overhead.
// All logging is best-effort (fail-safe, never throws).
// Feature flags:
//   SPECKIT_NOVELTY_BOOST     — N4 cold-start boost
//   SPECKIT_INTERFERENCE_SCORE — TM-01 interference penalty
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

// ---------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------

/** 5% sampling rate — logs ~1 in 20 scoring calls */
export const SAMPLING_RATE = 0.05;
 succeeded in 52ms:
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
 succeeded in 52ms:
export const NOVELTY_BOOST_SCORE_CAP = 0.95;

/**
 * N4: Calculate cold-start novelty boost with exponential decay.
 * @deprecated Eval complete (Sprint 7 audit). Marginal value confirmed.
 * SPECKIT_NOVELTY_BOOST env var is inert. Always returns 0.
 *
 * @param createdAt - ISO creation timestamp
 * @returns 0 (novelty boost permanently disabled)
 */
export function calculateNoveltyBoost(_createdAt: string | undefined): number {
  return 0;
}

/**
 * BUG-013 FIX: Use centralized tier values from importance-tiers.js.
 *
 * @param tier - Importance tier string
 * @returns Boost value for the tier
 */
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Reporting Dashboard (R13-S3)
// ---------------------------------------------------------------
// Sprint 7: Full reporting dashboard for eval infrastructure.
// Aggregates metrics per sprint/eval-run, per-channel views,
// trend analysis, and formatted report output.
//
// Uses: eval-db.ts singleton, eval_metric_snapshots table,
//       eval_channel_results table, eval_final_results table.
//
// Design:
//   - Read-only queries against eval DB (no writes).
//   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
//   - Pure aggregation logic; DB access isolated to query functions.
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

// Internal modules
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Eval Reporting
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { init as initHybridSearch, hybridSearchEnhanced } from '../lib/search/hybrid-search';
import { generateQueryEmbedding } from '../lib/providers/embeddings';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework';
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Channel Attribution
// ---------------------------------------------------------------
//
// Tags each search result with its source channel(s) for evaluation analysis.
// Computes Exclusive Contribution Rate: how often each channel is the SOLE
// source for a result in top-K.
//
// Channels: vector, fts, bm25, graph, trigger (extensible).
//
// Design notes:
//   - Pure functions — no DB access, no side effects.
//   - Channel names are lowercase strings matching existing conventions
//     (see rrf-fusion.ts SOURCE_TYPES and eval-logger.ts channel parameter).
// ---------------------------------------------------------------

/* --- 1. TYPES --- */

/** Known retrieval channels (extensible — any lowercase string accepted). */
export type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'trigger' | string;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Parser
// ---------------------------------------------------------------

// Node stdlib
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Internal modules
import { escapeRegex } from '../utils/path-security';
import { getCanonicalPathKey } from '../utils/canonical-path';
import { getDefaultTierForDocumentType, isValidTier, normalizeTier } from '../scoring/importance-tiers';
// T125: Import type inference for memory_type classification
import { inferMemoryType } from '../config/type-inference';

export { getCanonicalPathKey };

/* ---------------------------------------------------------------
   1. TYPES
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Ablation Framework (R13-S3)
// ---------------------------------------------------------------
//
// Controlled ablation studies for search channel contribution analysis.
// Selectively disables one search channel at a time, measures Recall@20
// delta against a full-pipeline baseline, and attributes per-channel
// contribution to retrieval quality.
//
// Features:
// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
// - Ablation runner with ground truth evaluation
// - Delta calculation (baseline vs ablated Recall@20)
// - Paired sign-test for statistical significance
// - Results storage in eval_metric_snapshots table
// - Human-readable ablation report formatting
//
// CRITICAL: Ablation studies are experimental and gated behind
// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
// and is a no-op when the flag is not set.
exec
/bin/zsh -lc "sed -n '640,710p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,420p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,420p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '340,760p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

/**
 * Check if causalLinks has any non-empty arrays
 */
export function hasCausalLinks(causalLinks: CausalLinks | null | undefined): boolean {
  if (!causalLinks) return false;
  return Object.values(causalLinks).some((arr: string[]) => Array.isArray(arr) && arr.length > 0);
}

/* ---------------------------------------------------------------
   4. VALIDATION FUNCTIONS
   --------------------------------------------------------------- */

/** Constitutional markdown basenames intentionally excluded from indexing */
const EXCLUDED_CONSTITUTIONAL_BASENAMES = new Set(['readme.md', 'readme.txt']);

function isMarkdownOrTextFile(filePath: string): boolean {
  return /\.(md|txt)$/i.test(filePath);
}

 succeeded in 51ms:
 *
 * @deprecated Shadow scoring was permanently disabled in Sprint 7. This
 * comparison function still works but has no production callers. Retained
 * for interface compatibility. Use channel-attribution.ts instead.
 *
 * @param query - The original search query.
 * @param production - Production scored results.
 * @param shadow - Shadow scored results.
 * @param algorithmName - Name of the shadow algorithm.
 * @param metadata - Optional metadata.
 * @returns ShadowComparison with deltas and summary statistics.
 */
export function compareShadowResults(
  query: string,
  production: ScoredResult[],
  shadow: ScoredResult[],
  algorithmName: string,
  metadata?: Record<string, unknown>,
): ShadowComparison {
  const prodMap = buildResultMap(production);
 succeeded in 52ms:
  return row?.cnt ?? 0;
}

/* ---------------------------------------------------------------
   3. AGGREGATION LOGIC
--------------------------------------------------------------- */

/**
 * Group snapshots by sprint label. Sprint label is derived from:
 * 1. metadata JSON "sprint" or "sprintLabel" field
 * 2. Fallback: "run-{eval_run_id}"
 */
function groupBySprint(
  snapshots: SnapshotRow[],
  sprintFilter?: string[],
): Map<string, SnapshotRow[]> {
  const groups = new Map<string, SnapshotRow[]>();

  for (const snap of snapshots) {
    const sprintFromMeta = extractSprintFromMetadata(snap.metadata);
 succeeded in 51ms:

/**
 * Run a controlled ablation study over the ground truth query set.
 *
 * For each channel in config.channels:
 * 1. Run all queries with all channels enabled (baseline) — cached across channels
 * 2. Run all queries with that one channel disabled (ablated)
 * 3. Compute per-query Recall@K delta
 * 4. Aggregate mean delta and sign-test p-value
 *
 * The searchFn is called once per query per condition. It receives
 * the query text and a set of disabled channel names. When the set
 * is empty, all channels should be active (baseline condition).
 *
 * @param searchFn - Search function that respects channel disable flags.
 * @param config - Ablation configuration.
 * @returns AblationReport with per-channel results, or null if ablation is disabled.
 */
export async function runAblation(
  searchFn: AblationSearchFn,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '420,620p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '620,700p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '180,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '300,380p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,330p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 52ms:

      const previous = prevSummary.latest;
      const current = currSummary.latest;
      const delta = Math.round((current - previous) * 10000) / 10000;
      const percentChange = previous !== 0
        ? Math.round(((current - previous) / Math.abs(previous)) * 10000) / 100
        : current > 0 ? 100 : (current < 0 ? -100 : 0);

      const higherBetter = isHigherBetter(metric);
      let direction: 'improved' | 'regressed' | 'unchanged';
      if (Math.abs(delta) < 0.0001) {
        direction = 'unchanged';
      } else if (higherBetter) {
        direction = delta > 0 ? 'improved' : 'regressed';
      } else {
        direction = delta < 0 ? 'improved' : 'regressed';
      }

      trends.push({
        metric,
 succeeded in 52ms:
/* ---------------------------------------------------------------
   5. HASH GENERATION
--------------------------------------------------------------- */

function generateMemoryHash(memory: MemoryInput): string {
  if (!memory) {
    throw new Error('Memory object is required for hash generation');
  }

  let hashInput: string;

  if (memory.content_hash) {
    hashInput = memory.content_hash;
  } else if (memory.id !== undefined) {
    // AI-WHY: Support both anchor_id (snake_case) and anchorId (camelCase) — callers may pass either form (P4-16).
    hashInput = `${memory.id}:${memory.anchor_id || memory.anchorId || ''}:${memory.file_path || ''}`;
  } else {
    hashInput = JSON.stringify({
      // AI-WHY: Prefer anchor_id (canonical), fall back to anchorId for legacy callers (P4-16)
      anchor: memory.anchor_id || memory.anchorId,
 succeeded in 52ms:
   4. TASK POSTFLIGHT HANDLER
--------------------------------------------------------------- */

/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
async function handleTaskPostflight(args: PostflightArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();
  const {
    specFolder: spec_folder,
    taskId,
    knowledgeScore: knowledge_score,
    uncertaintyScore: uncertainty_score,
    contextScore: context_score,
    gapsClosed = [],
    newGapsDiscovered = []
  } = args;

  if (!spec_folder) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'specFolder is required', { param: 'specFolder' });
  }
  if (!taskId) {
 succeeded in 52ms:
/**
 * Reset all accumulators.
 */
function reset(): void {
  // Flush remaining accumulators before reset
  if (db) {
    for (const [id] of accumulators) {
      flushAccessCounts(id);
    }
  }
  accumulators.clear();
}

/* -------------------------------------------------------------
   6. EXIT HANDLERS
----------------------------------------------------------------*/

// AI-WHY: Fix #38 (017-refinement-phase-6) — Store handler refs for process.removeListener()
let _exitFlushHandler: (() => void) | null = null;

 succeeded in 52ms:
  try {
    rows = database.prepare(`
      SELECT id
      FROM memory_index
      WHERE canonical_file_path = ? OR file_path = ?
      ORDER BY id ASC
    `).all(canonicalPath, filePath) as Array<{ id: number }>;
  } catch (_error: unknown) {
    rows = database.prepare(`
      SELECT id
      FROM memory_index
      WHERE file_path = ?
      ORDER BY id ASC
    `).all(filePath) as Array<{ id: number }>;
  }

  let deletedCount = 0;
  for (const row of rows) {
    if (typeof row.id === 'number') {
      if (vectorIndex.deleteMemory(row.id)) {
exec
/bin/zsh -lc 'rg -n "function parseArgs<|const parseArgs|parseArgs<T>" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"silent-return|skipIf\\(|required handler|vectorIndex missing|fail-fast imports|SPECKIT_DB_DIR|SPEC_KIT_DB_DIR|Number\\.isFinite|evidence gap|partial-update|transaction|cache lookup moved before embedding|parent_id IS NULL|id "'!= null|causal edge cleanup" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:21:export function parseArgs<T>(args: Record<string, unknown>): T {
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:33:    return parseArgs<T>(validateToolArgs(toolName, {}));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:35:  return parseArgs<T>(validateToolArgs(toolName, args));
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `parseArgs<T>()` is the single protocol-boundary cast point.
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:76:  // GROUP 1: parseArgs<T>() Function Tests
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:78:  describe('Group 1: parseArgs<T>()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:80:    function parseArgs<T>(args: Record<string, unknown>): T {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:85:    it('T1: parseArgs<T>() defined in source', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:92:        /function\s+parseArgs<T>\(args:\s*Record<string,\s*unknown>\):\s*T\s*\{[\s\S]*?return\s+args\s+as\s+unknown\s+as\s+T;/
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:98:      expect(toolTypesCode).toMatch(/parseArgs<T>\(args:\s*Record<string,\s*unknown>\)/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301:    // T18: Each tool dispatch uses parseArgs<T>
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      it(`T18: Tool '${caseName}' uses parseArgs<T>`, () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:311:        const parseArgsPattern = new RegExp(`['"]${caseName}['"][\\s\\S]*?parseArgs<`)
 succeeded in 50ms:
Total output lines: 376

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:91:import * as transactionManager from './lib/storage/transaction-manager';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:448:    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:527:    const metrics = transactionManager.getMetrics();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:144:  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:164:  // Perform deletion in a transaction
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:170:  const bulkDeleteTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:178:  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:181:  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:552:When Z-score analysis signals low-confidence retrieval (insufficient signal in the indexed corpus), the server prepends an evidence gap warning to the LLM payload. This tells the AI assistant that results may be incomplete rather than letting it treat sparse results as authoritative.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:67:      whereParts.push('parent_id IS NULL');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:76:  const boundedMaxRetries = Number.isFinite(maxRetries) && (maxRetries ?? 0) > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:188:      WHERE parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:208:    WHERE parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:50:  const indexWithMetadata = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:      AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:54:        AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:151:  if (typeof score === 'number' && Number.isFinite(score)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:156:  if (typeof similarity === 'number' && Number.isFinite(similarity)) {
codex
The shadow-scoring/reporting features are the ones with the trickiest split between “historical capability” and “current active code.” I’m double-checking the live pipeline references there so I don’t over-credit removed code or miss still-active channel attribution pieces.
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/tools/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "shadow|channel attribution|attributeChannels|getChannelAttribution|source channels|SPECKIT_SHADOW_SCORING|shadow scoring|shadow metadata|isInShadowPeriod|ground truth expansion|LLM-judge|implicit user selection|feedback" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/eval .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '330,430p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '140,200p' .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------
// Shared types for tool dispatch modules (T303).
// ---------------------------------------------------------------

// Re-export canonical MCPResponse from shared
export type { MCPResponse } from '@spec-kit/shared/types';

// Import for extension
import type { MCPResponse } from '@spec-kit/shared/types';
import { validateToolArgs } from '../schemas/tool-input-schemas';

/** Extended MCP response with auto-surfaced context (SK-004) */
export interface MCPResponseWithContext extends MCPResponse {
  autoSurfacedContext?: unknown;
}

/** Narrow pre-validated MCP tool args to a specific handler arg type.
 *  Centralises the single protocol-boundary cast so call sites stay clean. */
 succeeded in 51ms:
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
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import path from 'path';
import os from 'os';
import { COGNITIVE_CONFIG as LOADED_COGNITIVE_CONFIG } from '../configs/cognitive';
import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Input validation limits configuration */
export interface InputLimitsConfig {
  query: number;
  title: number;
  specFolder: number;
  contextType: number;
  name: number;
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:32:The eval module provides measurement infrastructure for search quality evaluation. It includes baseline measurement (BM25 MRR@5), ceiling evaluation, ground truth datasets, edge density analysis, quality proxy scoring, K-value sensitivity analysis, channel attribution, ground truth expansion via feedback, shadow scoring for A/B comparison, ablation studies for channel contribution analysis, a reporting dashboard for metric aggregation and trend analysis, and an evaluation database for tracking metrics over time.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:38:| Modules | 15 | eval-db, eval-logger, eval-metrics, eval-quality-proxy, eval-ceiling, bm25-baseline, edge-density, ground-truth-data, ground-truth-generator, k-value-analysis, channel-attribution, ground-truth-feedback, reporting-dashboard, shadow-scoring, ablation-framework |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:61: ground-truth-feedback.ts  # Ground truth expansion via implicit feedback + deterministic judge (Sprint 4)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:66: shadow-scoring.ts         # Shadow scoring A/B comparison infrastructure (Sprint 4; write path disabled Sprint 7)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:80:| `ground-truth-feedback.ts` | Collects implicit feedback from user selections; deterministic heuristic judge for relevance labeling |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:82:| `shadow-scoring.ts` | Runs parallel scoring paths without affecting production; logs comparison data for A/B evaluation |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:116:### Ground Truth Feedback (`ground-truth-feedback.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:118:Expands ground truth datasets via two mechanisms: (1) implicit feedback from user memory selections persisted to the eval DB, and (2) a deterministic heuristic judge that scores query-memory relevance using lexical overlap with 4-band classification. Designed for replacement with a model-backed judge without changing persistence or agreement APIs. Added in Sprint 4.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:124:### Shadow Scoring (`shadow-scoring.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:126:Runs a parallel scoring path alongside production results without affecting production output. Logs both production and shadow scores for A/B comparison with channel attribution per result. The shadow write path (`runShadowScoring`, `logShadowComparison`) was permanently disabled in Sprint 7; read-only analysis functions remain available. Added in Sprint 4.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:7:// Phase B: Collect implicit feedback from user memory selections.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:9://   is recorded as implicit relevance signal for ground truth expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:11:// Phase C: LLM-judge relevance labeling for ground truth expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:19://   - LLM-judge interface is deterministic (non-stub fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:20://   - Agreement rate target: >= 80% between LLM-judge and manual labels.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:57:/** A relevance label produced by the LLM-judge. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:64:   * Relevance grade assigned by the LLM-judge.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:71:  /** Confidence score from the LLM-judge (0-1). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:73:  /** Optional reasoning from the LLM-judge. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:87:/** Result of computing agreement between LLM-judge and manual labels. */
 succeeded in 51ms:
      LIMIT 1
    `);
    const exists = stmt.get(sessionId, hash);
    return !exists;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] shouldSendMemory check failed: ${message}`);
    return SESSION_CONFIG.dbUnavailableMode === 'allow';
  }
}

function shouldSendMemoriesBatch(sessionId: string, memories: MemoryInput[]): Map<number, boolean> {
  const result = new Map<number, boolean>();

  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
    memories.forEach((m) => {
      if (m.id != null) {
        result.set(m.id, true);
      }
    });
 succeeded in 51ms:
    return { gapDetected: true, zScore: 0, mean: 0, stdDev: 0 };
  }

  const finiteScores = rrfScores.filter((score) => Number.isFinite(score));
  if (finiteScores.length === 0) {
    return { gapDetected: true, zScore: 0, mean: 0, stdDev: 0 };
  }

  if (finiteScores.length === 1) {
    // Single score: can't compute a meaningful Z-score, fall back to absolute threshold.
    const score = finiteScores[0];
    return {
      gapDetected: score < MIN_ABSOLUTE_SCORE,
      zScore: 0,
      mean: score,
      stdDev: 0,
    };
  }

  const mean = finiteScores.reduce((acc, s) => acc + s, 0) / finiteScores.length;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Delete
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

exec
/bin/zsh -lc "sed -n '920,1005p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "attribution|channelSources|source channels|_s4attribution|getChannelAttribution|attributeChannels" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '130,220p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '100,140p' .opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,330p' .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
          // are promoted to their correct position in the ranking
          reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
        } catch (_err: unknown) {
          // AI-GUARD: Non-critical enrichment — co-activation failure does not affect core ranking
        }
      }

      // Sprint 1: Folder relevance / two-phase retrieval (SPECKIT_FOLDER_SCORING)
      if (db && isFolderScoringEnabled() && reranked.length > 0) {
        try {
          const numericIds = reranked
            .map(r => r.id)
            .filter((id): id is number => typeof id === 'number');

          if (numericIds.length > 0) {
            const folderMap = lookupFolders(db, numericIds);
            if (folderMap.size > 0) {
              const folderScores = computeFolderRelevanceScores(reranked, folderMap);
              const rawTopK = process.env.SPECKIT_FOLDER_TOP_K;
              const parsedTopK = rawTopK ? parseInt(rawTopK, 10) : NaN;
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:      const s4attributionMeta = (reranked as unknown as Record<string, unknown>)['_s4attribution'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:975:      if (s4attributionMeta !== undefined && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:976:        Object.defineProperty(reranked, '_s4attribution', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:          value: s4attributionMeta,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:986:      if ((s4shadowMeta !== undefined || s4attributionMeta !== undefined || degradationMeta !== undefined) && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:            attribution: s4attributionMeta ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:258: * State filtering, session dedup, constitutional injection, channel attribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:33: * Stage 4: Filter + Annotate — state filter, dedup, attribution (NO SCORE CHANGES)
 succeeded in 51ms:
// ═════════════════════════════════════════════════════════════
// TESTS
// ═════════════════════════════════════════════════════════════

describe('S8 Entity Linker', () => {
  let db: InstanceType<typeof Database>;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
    delete process.env.SPECKIT_ENTITY_LINKING_MAX_DENSITY;
  });

  // ─────────────────────────────────────────────────────────
  // 1. normalizeEntityName
  // ─────────────────────────────────────────────────────────
  describe('normalizeEntityName', () => {
 succeeded in 51ms:
    stmt.run(1, 'specs/001-test', '/specs/001-test/memory/session-2025-01-15.md', 'Session Context Jan 15', 'Test memory content 1', 'hash1', 1.0, 5.0);
    stmt.run(2, 'specs/001-test', '/specs/001-test/memory/decision-auth.md', 'Auth Decision Record', 'Test memory content 2', 'hash2', 2.0, 4.0);
    stmt.run(3, 'specs/002-feature', '/specs/002-feature/memory/implementation-notes.md', 'Implementation Notes', 'Test memory content 3', 'hash3', 1.5, 5.0);
    stmt.run(4, 'specs/002-feature', '/specs/002-feature/memory/debug-log.md', 'Debug Log', 'Test memory content 4', 'hash4', 0.8, 6.0);
    stmt.run(5, 'specs/003-refactor', '/specs/003-refactor/memory/2024-12-01-session.md', 'Refactor Plan', 'Test memory content 5', 'hash5', 1.2, 5.0);
  }

  /* -------------------------------------------------------------
     SUITE: resolveMemoryReference
  ---------------------------------------------------------------- */

  describe('resolveMemoryReference', () => {
    const resolveFn = typeof handler.resolveMemoryReference === 'function'
      ? handler.resolveMemoryReference
      : null;
    type ResolveReferenceInput = Parameters<NonNullable<typeof resolveFn>>[1];

    it.skipIf(!resolveFn)('resolves numeric ID', () => {
      const db = createTestDb();
      seedTestMemories(db);
 succeeded in 51ms:
      if (saved.MMR === undefined) delete process.env['SPECKIT_MMR']; else process.env['SPECKIT_MMR'] = saved.MMR;
      if (saved.TRM === undefined) delete process.env['SPECKIT_TRM']; else process.env['SPECKIT_TRM'] = saved.TRM;
      if (saved.MULTI_QUERY === undefined) delete process.env['SPECKIT_MULTI_QUERY']; else process.env['SPECKIT_MULTI_QUERY'] = saved.MULTI_QUERY;
    }
  });

  it('C138-T3: SPECKIT_MMR=false disables MMR; absent re-enables it', () => {
    // Verify the actual isMMREnabled() function responds correctly to the env var,
    // not just the raw env var value itself.
    const saved = process.env['SPECKIT_MMR'];
    try {
      delete process.env['SPECKIT_MMR'];
      expect(isMMREnabled()).toBe(true);  // absent → enabled (opt-out pattern)

      process.env['SPECKIT_MMR'] = 'false';
      expect(isMMREnabled()).toBe(false); // explicit false → disabled
    } finally {
      if (saved === undefined) delete process.env['SPECKIT_MMR']; else process.env['SPECKIT_MMR'] = saved;
    }
  });
exec
/bin/zsh -lc 'rg -n "15000|5000|testTimeout|timeout" .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "tautological|actual behavioral differences|isMMREnabled|isTRMEnabled|isMultiQueryEnabled|opt-out pattern" .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"reconsolidation|five-factor-scoring|working-memory|session-cleanup|channel tests|entity tests|extraction-adapter|intent-routing\" .opencode/skill/system-spec-kit/mcp_server/tests -g '*.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"7003 passed|7027|7003\" .opencode/skill/system-spec-kit/mcp_server/tests/README.md .opencode/skill/system-spec-kit/mcp_server -g '"'!node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
747:    }, 15000);
 succeeded in 50ms:
12:import { isMMREnabled, isTRMEnabled, isMultiQueryEnabled } from '../lib/search/search-flags';
276:      expect(isMMREnabled()).toBe(false);
277:      expect(isTRMEnabled()).toBe(true);
278:      expect(isMultiQueryEnabled()).toBe(true);
287:    // Verify the actual isMMREnabled() function responds correctly to the env var,
292:      expect(isMMREnabled()).toBe(true);  // absent → enabled (opt-out pattern)
295:      expect(isMMREnabled()).toBe(false); // explicit false → disabled
302:    // Verify the actual isTRMEnabled() function responds correctly to the env var.
306:      expect(isTRMEnabled()).toBe(true);  // absent → enabled (opt-out pattern)
309:      expect(isTRMEnabled()).toBe(false); // explicit false → disabled
315:  it('C138-T5: opt-out pattern — isMultiQueryEnabled() responds to all three states', () => {
316:    // Verify the actual isMultiQueryEnabled() function: absent/'true' → enabled, 'false' → disabled.
320:      expect(isMultiQueryEnabled()).toBe(true);   // absent → enabled
323:      expect(isMultiQueryEnabled()).toBe(true);   // explicit true → enabled
326:      expect(isMultiQueryEnabled()).toBe(false);  // explicit false → disabled
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:1:// intent-routing.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:8:describe('intent-routing (placeholder)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:179:// imports Database type and working-memory module which trigger better-sqlite3
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:24:// TODO: Extract quality gate, reconsolidation, chunked-indexing from memory-save (2,553 LOC source).
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:32:  'handlers/memory-save.js': 2200,  // actual: 1210 — Save logic with parsing, validation, indexing + quality gate + reconsolidation
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:7:import * as wm from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:8:import * as workingMemory from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:19:    it('T209-1: setAttentionScore is exported from working-memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:7:import * as workingMemory from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:15:} from '../lib/extraction/extraction-adapter';
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:50:      (101, '02--system-spec-kit/020-mcp-working-memory-hybrid-rag', '/tmp/spec.md', 'Spec', 'important', '[]', CURRENT_TIMESTAMP),
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:51:      (102, '02--system-spec-kit/020-mcp-working-memory-hybrid-rag', '/tmp/error.log', 'Errors', 'normal', '[]', CURRENT_TIMESTAMP)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:3:// Aligned with production working-memory.ts named exports
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:7:import * as workingMemory from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:10:import * as wm from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:7:import * as workingMemory from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:9:import * as wm from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:10:import { DECAY_FLOOR, DELETE_THRESHOLD } from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:11:import * as wm from '../lib/cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:33:    tmpDbPath = path.join(os.tmpdir(), `t302-session-cleanup-${Date.now()}.db`);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:467:#  Tests       7003 passed
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:467:#  Tests       7003 passed
exec
/bin/zsh -lc "sed -n '730,760p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '330,390p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '335,385p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Test Memory

This is test content.
`;

      try {
        const result = await atomicSaveFn!(
          { file_path: testFile, content },
          { force: true }
        );
        expect(typeof result.success).toBe('boolean');
        expect(typeof result.filePath).toBe('string');
      } catch (err: unknown) {
        expect(getErrorMessage(err)).toBeDefined();
      } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_cleanupError: unknown) {}
      }
    }, 15000);

    it.skipIf(!atomicSaveFn)('rejects for empty params', async () => {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Eval Reporting
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { init as initHybridSearch, hybridSearchEnhanced } from '../lib/search/hybrid-search';
import { generateQueryEmbedding } from '../lib/providers/embeddings';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework';
 succeeded in 52ms:
  checkpoint_list: checkpointListSchema as unknown as ToolInputSchema,
  checkpoint_restore: checkpointRestoreSchema as unknown as ToolInputSchema,
  checkpoint_delete: checkpointDeleteSchema as unknown as ToolInputSchema,
  task_preflight: taskPreflightSchema as unknown as ToolInputSchema,
  task_postflight: taskPostflightSchema as unknown as ToolInputSchema,
  memory_drift_why: memoryDriftWhySchema as unknown as ToolInputSchema,
  memory_causal_link: memoryCausalLinkSchema as unknown as ToolInputSchema,
  memory_causal_stats: memoryCausalStatsSchema as unknown as ToolInputSchema,
  memory_causal_unlink: memoryCausalUnlinkSchema as unknown as ToolInputSchema,
  eval_run_ablation: evalRunAblationSchema as unknown as ToolInputSchema,
  eval_reporting_dashboard: evalReportingDashboardSchema as unknown as ToolInputSchema,
  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
  memory_get_learning_history: memoryGetLearningHistorySchema as unknown as ToolInputSchema,
  memory_ingest_start: memoryIngestStartSchema as unknown as ToolInputSchema,
  memory_ingest_status: memoryIngestStatusSchema as unknown as ToolInputSchema,
  memory_ingest_cancel: memoryIngestCancelSchema as unknown as ToolInputSchema,
};

const ALLOWED_PARAMETERS: Record<string, string[]> = {
  memory_context: ['input', 'mode', 'intent', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors'],
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Ground Truth Feedback
// ---------------------------------------------------------------
//
// Ground Truth Expansion via Feedback + LLM-Judge
//
// Phase B: Collect implicit feedback from user memory selections.
//   When a user selects a memory from search results, that selection
//   is recorded as implicit relevance signal for ground truth expansion.
//
// Phase C: LLM-judge relevance labeling for ground truth expansion.
//   This module provides a deterministic judge implementation that
//   scores query-memory relevance using lexical overlap heuristics.
//   It can be replaced with a model-backed judge later without
//   changing the persistence or agreement APIs.
//
// Design notes:
//   - Selections are persisted to the eval DB for durability.
//   - LLM-judge interface is deterministic (non-stub fallback).
//   - Agreement rate target: >= 80% between LLM-judge and manual labels.
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Lifecycle Tools
// ---------------------------------------------------------------
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// postflight, learning_history (T303).
// ---------------------------------------------------------------

import {
  handleMemoryIndexScan,
  handleMemoryIngestStart,
  handleMemoryIngestStatus,
  handleMemoryIngestCancel,
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  handleEvalRunAblation,
  handleEvalReportingDashboard,
} from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';

 succeeded in 52ms:
  inputSchema: { type: 'object', additionalProperties: false, properties: { sourceId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Source memory ID (the cause/enabler/superseder)' }, targetId: { oneOf: [{ type: 'number' }, { type: 'string', minLength: 1 }], description: 'Target memory ID (the effect/superseded)' }, relation: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'], description: 'Relationship type' }, strength: { type: 'number', default: 1.0, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
};

const memoryCausalStats: ToolDefinition = {
  name: 'memory_causal_stats',
  description: '[L6:Analysis] Get statistics about the causal memory graph. Shows total edges, coverage percentage, and breakdown by relationship type. Target: 60% of memories linked (CHK-065). Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

const memoryCausalUnlink: ToolDefinition = {
  name: 'memory_causal_unlink',
  description: '[L6:Analysis] Remove a causal relationship by edge ID. Use memory_drift_why to find edge IDs. Token Budget: 1200.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { edgeId: { type: 'number', description: 'Edge ID to delete (required)' } }, required: ['edgeId'] },
};

const evalRunAblation: ToolDefinition = {
  name: 'eval_run_ablation',
  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
  inputSchema: {
    type: 'object',
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "_s4attribution|attribution" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "cache.*embedding|embedding.*cache|lookup.*cache|before embedding|bypassCache|query embedding|generateQueryEmbedding" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "21 silent-return|fail-fast imports|review-fixes|Fix #|017-refinement-phase-6|Sprint 8 remediation|cross-AI|Gemini|Codex" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/core' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Orchestrator
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
//
// I/O CONTRACT:
//   Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
//   Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
//   Key invariants:
//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
//     - Stage metadata for all four stages is included for observability
//   Side effects:
//     - Delegates to each stage; see individual stage modules for their side effects

import type {
  PipelineConfig,
  PipelineResult,
  Stage4ReadonlyRow,
} from './types';
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:258: * State filtering, session dedup, constitutional injection, channel attribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:33: * Stage 4: Filter + Annotate — state filter, dedup, attribution (NO SCORE CHANGES)
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:120:  bypassCache?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:601:    bypassCache: bypassCache = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:767:      // AI-TRACE:P1-CODE-003: Wait for embedding model only on cache miss
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:900:    { bypassCache }
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:28: * Create the embedding_cache table if it does not exist.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:35:    CREATE TABLE IF NOT EXISTS embedding_cache (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:50: * Look up a cached embedding by content hash and model ID.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:65:    'SELECT embedding, dimensions FROM embedding_cache WHERE content_hash = ? AND model_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:74:    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ?",
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:88: * Store an embedding in the cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:112:    'SELECT COUNT(*) AS cnt FROM embedding_cache',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:118:      `DELETE FROM embedding_cache WHERE rowid IN (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:119:         SELECT rowid FROM embedding_cache ORDER BY last_used_at ASC LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:125:    `INSERT OR REPLACE INTO embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:142:    `DELETE FROM embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:152: * Return aggregate statistics about the embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:164:    FROM embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:183: * Remove all entries from the embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:188:  db.exec('DELETE FROM embedding_cache');
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:37:// Codex fix: nanoid-style 12-char alphanumeric ID (URL-safe, no UUID dependency).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:305:  // AI-WHY: Fix #37 (017-refinement-phase-6) — Use 128-bit (32 hex chars) instead of
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:333:          // AI-WHY: Fix #30 (017-refinement-phase-6) — WM already applies its own decay.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:335:  // AI-WHY: Fix #35 (017-refinement-phase-6) — Allow re-correction by accepting
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:543:// 017-refinement-phase-6 Sprint 1. These were only used by the legacy V1 pipeline.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:576:// 017-refinement-phase-6 Sprint 1. These were only used by the legacy V1 pipeline
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:775:      // AI-WHY: V2 pipeline is the only path (legacy V1 removed in 017-refinement-phase-6)
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:304:  // Fix #1 (017-refinement-phase-6): Re-extract trigger phrases if missing/insufficient
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:318:  // Fix #2 (017-refinement-phase-6): Close unclosed ANCHOR tags
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:325:  // Fix #3 (017-refinement-phase-6): Trim content to budget
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:250:  // AI-WHY: Fix #25 (017-refinement-phase-6) — Clamp maxDepth to [1, 10] server-side
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:90:      // AI-WHY: Fix #19 (017-refinement-phase-6) — Embed title + content_text, not title alone.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:394:  // AI-WHY: Fix #28 (017-refinement-phase-6) — cleanupOrphanedEdges was exported but
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:85:      // AI-WHY: Fix #33 (017-refinement-phase-6) — Use recallK, not hardcoded 20
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:357:      // AI-WHY: Fix #23 (017-refinement-phase-6) — Use the actual error code from the
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:199:// was part of legacy V1 pipeline, removed in 017-refinement-phase-6 Sprint 1.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:    // AI-WHY: Fix #8 (017-refinement-phase-6) — BM25 document IDs are stringified
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:365:    // AI-WHY: Fix #20 (017-refinement-phase-6) — Clean all ancillary records
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:387:  // AI-WHY: Fix #21 (017-refinement-phase-6) — Clean BM25 index after successful delete.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:529:        // AI-WHY: Fix #29 (017-refinement-phase-6) — Clamp to [DECAY_FLOOR, 1.0].
exec
/bin/zsh -lc "sed -n '720,810p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,520p' .opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Review Fixes Vitest
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------
// TEST: Review Fixes Verification (Vitest)
// Validates critical fixes from the 8-agent cross-AI review:
//   H1 — fail-closed on unknown tool
//   C1 — path traversal rejection on ingest paths
//   H2 — bounded paths array (max 50)
//   H5 — additionalProperties: false on all schemas
//   M5 — ingest schema minItems/minLength constraints
// ---------------------------------------------------------------

import {
  validateToolArgs,
  ToolSchemaValidationError,
} from '../schemas/tool-input-schemas';
 succeeded in 53ms:
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // AI-TRACE:C136-08: Create retrieval trace at pipeline entry
  const trace = createTrace(
    normalizedQuery || (concepts ? concepts.join(', ') : ''),
    sessionId,
    detectedIntent || undefined
  );

  // AI-TRACE:T012-T015: Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    limit,
    mode,
 succeeded in 53ms:

codex
I’ve hit one potentially important discrepancy in the cross-AI remediation note: one of its claimed env-var fallback fixes may not actually be present in the current code. I’m checking that directly now so I can distinguish “document drift” from a simple missing path list.
exec
/bin/zsh -lc "sed -n '620,720p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '110,190p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_DB_DIR|SPEC_KIT_DB_DIR|MEMORY_DB_DIR" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

    if (newEmbedding) {
      updateParams.embedding = newEmbedding;
      embeddingRegenerated = true;
    } else if (!embeddingMarkedForReindex) {
      if (allowPartialUpdate) {
        console.warn('[memory-update] Embedding returned null, marking for re-index');
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
          { memoryId: id }
        );
      }
    }
  }

  // AI-WHY: T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Dedup
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

import type { ParsedMemory } from '../../lib/parsing/memory-parser';
import type { IndexResult } from './types';

export function checkExistingRow(
  database: Database.Database,
  parsed: ParsedMemory,
  canonicalFilePath: string,
  filePath: string,
  force: boolean,
  warnings: string[] | undefined,
): IndexResult | null {
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE spec_folder = ?
 succeeded in 52ms:
      results = weighted.map((result) =>
        typeof result.intentAdjustedScore === 'number'
          ? { ...result, score: result.intentAdjustedScore }
          : result
      );
      metadata.intentWeightsApplied = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
    }
  }

  // -- 5. Artifact routing weights --
  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
    try {
      const routed = applyArtifactRouting(results, config.artifactRouting);
      results = routed;
      metadata.artifactRoutingApplied = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:33:export const DATABASE_DIR: string = process.env.SPEC_KIT_DB_DIR
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:34:  ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:26:  delete process.env.SPEC_KIT_DB_DIR;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:105:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:126:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:168:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:211:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:259:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:305:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:341:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:432:      SPEC_KIT_DB_DIR: dbDir,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:20:// P1-05: SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy) > default
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:22:  process.env.SPEC_KIT_DB_DIR ||
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:23:  process.env.MEMORY_DB_DIR ||
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:24:  const dbDir = process.env.SPEC_KIT_DB_DIR
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:25:    ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:30:const originalDbDir = process.env.SPEC_KIT_DB_DIR;
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:35:    process.env.SPEC_KIT_DB_DIR = tmpDir;
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:45:      delete process.env.SPEC_KIT_DB_DIR;
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:47:      process.env.SPEC_KIT_DB_DIR = originalDbDir;
exec
/bin/zsh -lc "sed -n '250,380p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '250,340p' .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "_s4attribution|channel attribution|attribution" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 50ms:

 succeeded in 51ms:
  const filterResult = filterByMemoryState(
    results,
    config.minState,
    config.applyStateLimits,
  );

  let workingResults: Stage4ReadonlyRow[] = filterResult.filtered;
  const stateFiltered = filterResult.removedCount;

  // -- Step 3: Evidence gap detection (TRM) --
  let evidenceGapDetected = false;
  let evidenceGapWarning: string | undefined;

  if (isTRMEnabled()) {
    const scores = workingResults.map(extractScoringValue);
    const trm = detectEvidenceGap(scores);

    evidenceGapDetected = trm.gapDetected;

    if (trm.gapDetected) {
 succeeded in 51ms:
      );
      const uniqueCanonicalIds = Array.from(new Set(canonicalIds));
      expect(canonicalIds.length).toBe(uniqueCanonicalIds.length);
    });

    it('T031-LEX-05: combined_lexical_search() results sorted by score', () => {
      const results = hybridSearch.combinedLexicalSearch('authentication', { limit: 10 });
      let isSorted = true;
      for (let i = 1; i < results.length; i++) {
        if ((results[i].score || 0) > (results[i - 1].score || 0)) {
          isSorted = false;
          break;
        }
      }
      expect(isSorted).toBe(true);
    });
  });

  // 5.4 HYBRID SEARCH ENHANCED TESTS

exec
/bin/zsh -lc "rg -n \"_s4attribution|attributionMeta|traceMetadata: \\{|getChannelAttribution\\(|attributeChannels\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:      const s4attributionMeta = (reranked as unknown as Record<string, unknown>)['_s4attribution'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:975:      if (s4attributionMeta !== undefined && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:976:        Object.defineProperty(reranked, '_s4attribution', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:          value: s4attributionMeta,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:986:      if ((s4shadowMeta !== undefined || s4attributionMeta !== undefined || degradationMeta !== undefined) && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:989:          traceMetadata: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:            attribution: s4attributionMeta ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:322:      traceMetadata: {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:99:export function attributeChannels(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:208:export function getChannelAttribution(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:213:  const attributed = attributeChannels(results, channelSources);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:526:    const report = getChannelAttribution(results, channelSources, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:705:    const report = getChannelAttribution(results, sources, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:369:      const attributed = attributeChannels(results, sources);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:390:      const attributed = attributeChannels(results, sources);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:412:      const attributed = attributeChannels(results, sources);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:425:      const attributed = attributeChannels(results, sources);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:442:      const attributed = attributeChannels(results, sources);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:460:      const attributed = attributeChannels(results, sources);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:478:      const attributed = attributeChannels(results, sources);
exec
/bin/zsh -lc "sed -n '220,290p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
    causalBoostApplied: boolean;
    intentWeightsApplied: boolean;
    artifactRoutingApplied: boolean;
    feedbackSignalsApplied: boolean;
    qualityFiltered: number;
    durationMs: number;
  };
}

/**
 * Stage 3: Rerank + Aggregate
 * Cross-encoder reranking, MMR diversity enforcement, MPAB chunk-to-memory aggregation.
 * Score changes: YES
 */
export interface Stage3Input {
  scored: PipelineRow[];
  config: PipelineConfig;
}

/**
codex
I’m at the last verification pass now: checking the actual `## Source Files` path lists mechanically so the final report can separate existence checks from the deeper “missing important files” judgment. After that I’ll format the per-feature findings exactly in the structure you asked for.
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re; base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit'); files=[base/'feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md', base/'feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md', base/'feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md', base/'feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md', base/'feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md', base/'feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md'];
for f in files:
 text=f.read_text(); paths=re.findall(r'"'`(mcp_server/[''^`]+)`'"', text); invalid=[p for p in paths if not (base/p).exists()]; print(f.name); print('PATHS', paths if paths else []); print('INVALID', invalid if invalid else [])\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:3: unmatched "
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; base=Path(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\"); files=[base/\"feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md\", base/\"feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md\", base/\"feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md\", base/\"feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md\", base/\"feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md\", base/\"feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md\"];
for f in files:
 text=f.read_text(); paths=re.findall(r\""'`(mcp_server/[''^`]+)`", text); invalid=[p for p in paths if not (base/p).exists()]; print(f.name); print("PATHS", paths if paths else []); print("INVALID", invalid if invalid else [])'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 653ms:
09-scoring-observability.md
PATHS ['mcp_server/lib/telemetry/scoring-observability.ts', 'mcp_server/tests/scoring-observability.vitest.ts', 'mcp_server/tests/scoring.vitest.ts']
INVALID []
10-full-reporting-and-ablation-study-framework.md
PATHS ['mcp_server/lib/eval/ablation-framework.ts', 'mcp_server/lib/eval/eval-db.ts', 'mcp_server/lib/eval/eval-metrics.ts', 'mcp_server/lib/eval/ground-truth-data.ts', 'mcp_server/lib/eval/reporting-dashboard.ts', 'mcp_server/tests/ablation-framework.vitest.ts', 'mcp_server/tests/eval-db.vitest.ts', 'mcp_server/tests/eval-metrics.vitest.ts', 'mcp_server/tests/ground-truth.vitest.ts', 'mcp_server/tests/reporting-dashboard.vitest.ts']
INVALID []
11-shadow-scoring-and-channel-attribution.md
PATHS ['mcp_server/lib/eval/channel-attribution.ts', 'mcp_server/lib/eval/eval-db.ts', 'mcp_server/lib/eval/shadow-scoring.ts', 'mcp_server/tests/channel.vitest.ts', 'mcp_server/tests/eval-db.vitest.ts', 'mcp_server/tests/scoring.vitest.ts', 'mcp_server/tests/shadow-scoring.vitest.ts']
INVALID []
12-test-quality-improvements.md
PATHS []
INVALID []
13-evaluation-and-housekeeping-fixes.md
PATHS ['mcp_server/lib/eval/eval-db.ts', 'mcp_server/lib/eval/eval-logger.ts', 'mcp_server/lib/eval/reporting-dashboard.ts', 'mcp_server/tests/eval-db.vitest.ts', 'mcp_server/tests/eval-logger.vitest.ts', 'mcp_server/tests/reporting-dashboard.vitest.ts']
INVALID []
14-cross-ai-validation-fixes.md
PATHS []
INVALID []
exec
/bin/zsh -lc 'rg -n "T007" .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"it\\.skipIf\\(\" .opencode/skill/system-spec-kit/mcp_server/tests | wc -l" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 50ms:

 succeeded in 50ms:
// ---------------------------------------------------------------
// TEST: Ground Truth Feedback
// R13-S2: Phase B (implicit feedback) + Phase C (LLM-judge)
// for ground truth expansion.
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import {
  recordUserSelection,
  getSelectionHistory,
  generateLlmJudgeLabels,
  saveLlmJudgeLabels,
  computeJudgeAgreement,
  getGroundTruthCorpusSize,
  resetFeedbackSchemaFlag,
  type SelectionContext,
 succeeded in 53ms:
      54
Plan update
I finished the code-to-doc comparison and path validation for feature snippets 09-14. The remaining step is just formatting the per-feature verification results.
  ✓ Read feature catalog files 09-14 and resolve actual filenames in the range
  ✓ Inspect listed implementation and test files plus adjacent registration/integration files in mcp_server
  ✓ Assess accuracy, validate paths, identify missing source files, and prepare per-feature report
codex
---
FEATURE: 09-scoring-observability.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/scoring/composite-scoring.ts
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: The 5% sampling, `scoring_observations` table, fail-safe behavior, and removed novelty boost all match. The mismatch is that telemetry failures are not swallowed silently; `scoring-observability.ts` logs errors with `console.error`. The hot-path integration that actually emits observations lives in `composite-scoring.ts` and is not listed.
---
FEATURE: 10-full-reporting-and-ablation-study-framework.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/eval-reporting.ts, mcp_server/tools/lifecycle-tools.ts, mcp_server/tool-schemas.ts, mcp_server/schemas/tool-input-schemas.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The ablation framework, sign test, negative timestamp run IDs, dashboard aggregation, trend logic, sprint-label inference, and `isHigherBetter()` all match. The snippet also claims these are exposed as MCP tools, but the handler/dispatch/schema files that implement that exposure are missing from `## Source Files`.
---
FEATURE: 11-shadow-scoring-and-channel-attribution.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/eval/ground-truth-feedback.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/learned-feedback.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The disabled shadow write path is real: `runShadowScoring()` returns `null`, `logShadowComparison()` returns `false`, and `SPECKIT_SHADOW_SCORING` is effectively a no-op. But the snippet overstates two points: the ground-truth judge is a deterministic fallback implementation rather than just a stub, and I did not find active stage-4 channel-attribution execution in the live pipeline beyond comments/metadata plumbing.
---
FEATURE: 12-test-quality-improvements.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tests/memory-save-extended.vitest.ts, mcp_server/tests/entity-linker.vitest.ts, mcp_server/tests/integration-search-pipeline.vitest.ts, mcp_server/lib/parsing/memory-parser.ts, mcp_server/tests/README.md
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The current code does show the `15000` timeout, `db.close()` in `entity-linker.vitest.ts`, behavioral flag tests in `integration-search-pipeline.vitest.ts`, `/z_archive/` exclusion in `isMemoryFile()`, and `7003 passed` in `tests/README.md`. The weaker parts are historical claims like “18+ files updated,” “7027 to 7003,” and “24 deleted tests,” which are not fully verifiable from current source alone.
---
FEATURE: 13-evaluation-and-housekeeping-fixes.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/eval-reporting.ts, mcp_server/lib/eval/ablation-framework.ts, mcp_server/handlers/session-learning.ts, mcp_server/tools/types.ts, mcp_server/lib/session/session-manager.ts, mcp_server/lib/storage/access-tracker.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: All six fixes are present in code. The issue is the source inventory: most of the real implementation lives outside the three listed files, and `reporting-dashboard.ts` is not a primary implementation file for the six fixes described.
---
FEATURE: 14-cross-ai-validation-fixes.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-crud-delete.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/handlers/save/dedup.ts, mcp_server/lib/session/session-manager.ts, mcp_server/handlers/memory-search.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/lib/eval/reporting-dashboard.ts, mcp_server/lib/search/evidence-gap-detector.ts, mcp_server/core/config.ts, mcp_server/lib/eval/eval-db.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Many concrete fixes in the bullet list are reflected in code, but at least one is not: I found `SPEC_KIT_DB_DIR` and legacy `MEMORY_DB_DIR`, not the claimed `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` fallback chain. The “3-stage review by Codex/Gemini/Claude” provenance also is not code-verifiable, and the snippet lists no source files despite being implemented across many modules.
---
tokens used
168,789
---
FEATURE: 09-scoring-observability.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/scoring/composite-scoring.ts
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: The 5% sampling, `scoring_observations` table, fail-safe behavior, and removed novelty boost all match. The mismatch is that telemetry failures are not swallowed silently; `scoring-observability.ts` logs errors with `console.error`. The hot-path integration that actually emits observations lives in `composite-scoring.ts` and is not listed.
---
FEATURE: 10-full-reporting-and-ablation-study-framework.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/eval-reporting.ts, mcp_server/tools/lifecycle-tools.ts, mcp_server/tool-schemas.ts, mcp_server/schemas/tool-input-schemas.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The ablation framework, sign test, negative timestamp run IDs, dashboard aggregation, trend logic, sprint-label inference, and `isHigherBetter()` all match. The snippet also claims these are exposed as MCP tools, but the handler/dispatch/schema files that implement that exposure are missing from `## Source Files`.
---
FEATURE: 11-shadow-scoring-and-channel-attribution.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/eval/ground-truth-feedback.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/learned-feedback.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The disabled shadow write path is real: `runShadowScoring()` returns `null`, `logShadowComparison()` returns `false`, and `SPECKIT_SHADOW_SCORING` is effectively a no-op. But the snippet overstates two points: the ground-truth judge is a deterministic fallback implementation rather than just a stub, and I did not find active stage-4 channel-attribution execution in the live pipeline beyond comments/metadata plumbing.
---
FEATURE: 12-test-quality-improvements.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tests/memory-save-extended.vitest.ts, mcp_server/tests/entity-linker.vitest.ts, mcp_server/tests/integration-search-pipeline.vitest.ts, mcp_server/lib/parsing/memory-parser.ts, mcp_server/tests/README.md
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The current code does show the `15000` timeout, `db.close()` in `entity-linker.vitest.ts`, behavioral flag tests in `integration-search-pipeline.vitest.ts`, `/z_archive/` exclusion in `isMemoryFile()`, and `7003 passed` in `tests/README.md`. The weaker parts are historical claims like “18+ files updated,” “7027 to 7003,” and “24 deleted tests,” which are not fully verifiable from current source alone.
---
FEATURE: 13-evaluation-and-housekeeping-fixes.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/eval-reporting.ts, mcp_server/lib/eval/ablation-framework.ts, mcp_server/handlers/session-learning.ts, mcp_server/tools/types.ts, mcp_server/lib/session/session-manager.ts, mcp_server/lib/storage/access-tracker.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: All six fixes are present in code. The issue is the source inventory: most of the real implementation lives outside the three listed files, and `reporting-dashboard.ts` is not a primary implementation file for the six fixes described.
---
FEATURE: 14-cross-ai-validation-fixes.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-crud-delete.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/handlers/save/dedup.ts, mcp_server/lib/session/session-manager.ts, mcp_server/handlers/memory-search.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/lib/eval/reporting-dashboard.ts, mcp_server/lib/search/evidence-gap-detector.ts, mcp_server/core/config.ts, mcp_server/lib/eval/eval-db.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Many concrete fixes in the bullet list are reflected in code, but at least one is not: I found `SPEC_KIT_DB_DIR` and legacy `MEMORY_DB_DIR`, not the claimed `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` fallback chain. The “3-stage review by Codex/Gemini/Claude” provenance also is not code-verifiable, and the snippet lists no source files despite being implemented across many modules.
---
