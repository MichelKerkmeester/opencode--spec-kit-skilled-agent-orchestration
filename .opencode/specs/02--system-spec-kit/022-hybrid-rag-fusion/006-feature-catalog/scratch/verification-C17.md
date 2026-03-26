OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-7ae8-7bd3-9af2-c8f920c704c6
--------
user
You are a feature catalog verification agent. Read these feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md (files 13 through 21). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
I’m verifying feature catalog entries `13` through `21` against the actual `system-spec-kit` MCP server code. I’ll first do the required routing/context checks from the repo instructions, then I’ll read the feature snippets and the referenced source files and compare them carefully.
exec
/bin/zsh -lc 'find .. -name AGENTS.md -print' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog files 13 through 21 under .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture against actual code under .opencode/skill/system-spec-kit/mcp_server; check Current Reality accuracy, listed source path existence, and missing important source files" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 653ms:
../Barter/coder/AGENTS.md
../Public/.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
../Public/.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
../Public/.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
../Public/AGENTS.md
 succeeded in 664ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), architecture, document~"
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
SKILL ROUTING: `system-spec-kit` was recommended at high confidence, so I’m using that first because this is a spec/feature-catalog verification task inside that skill’s own codebase. The memory trigger tool named in the repo instructions isn’t exposed in this runtime, so I’m proceeding with direct code inspection and will keep the verification evidence grounded in the local files.
exec
/bin/zsh -lc 'ls -1 .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
01-4-stage-pipeline-refactor.md
02-mpab-chunk-to-memory-aggregation.md
03-chunk-ordering-preservation.md
04-template-anchor-optimization.md
05-validation-signals-as-retrieval-metadata.md
06-learned-relevance-feedback.md
07-search-pipeline-safety.md
08-performance-improvements.md
09-activation-window-persistence.md
10-legacy-v1-pipeline-removal.md
11-pipeline-and-mutation-hardening.md
12-dbpath-extraction-and-import-standardization.md
13-strict-zod-schema-validation.md
14-dynamic-server-instructions-at-mcp-initialization.md
15-warm-server-daemon-mode.md
16-backend-storage-adapter-abstraction.md
17-cross-process-db-hot-rebinding.md
18-atomic-write-then-index-api.md
19-embedding-retry-orchestrator.md
20-7-layer-tool-architecture-metadata.md
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

codex
I’ve got the skill guidance and the target feature set. Next I’m extracting each feature’s `Current Reality` and `Source Files` so I can map those claims directly onto the MCP server implementation.
exec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/{13-strict-zod-schema-validation.md,14-dynamic-server-instructions-at-mcp-initialization.md,15-warm-server-daemon-mode.md,16-backend-storage-adapter-abstraction.md,17-cross-process-db-hot-rebinding.md,18-atomic-write-then-index-api.md,19-embedding-retry-orchestrator.md,20-7-layer-tool-architecture-metadata.md,21-atomic-pending-file-recovery.md}; do printf '\\n=== %s ===\\n' \""'$(basename "$f")"; sed -n '"'/## Current Reality/,/## Source Files/p' \""'$f"; sed -n '"'/## Source Files/,/## /p' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

=== 13-strict-zod-schema-validation.md ===
## Current Reality

**IMPLEMENTED (Sprint 019).** All 28 MCP tool inputs (L1-L7) have Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). Adds `zod` dependency.

## Source Files
## Source Files

### Implementation

=== 14-dynamic-server-instructions-at-mcp-initialization.md ===
## Current Reality

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

## Source Files
## Source Files

### Implementation
exec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/{13-strict-zod-schema-validation.md,14-dynamic-server-instructions-at-mcp-initialization.md,15-warm-server-daemon-mode.md,16-backend-storage-adapter-abstraction.md,17-cross-process-db-hot-rebinding.md,18-atomic-write-then-index-api.md,19-embedding-retry-orchestrator.md,20-7-layer-tool-architecture-metadata.md,21-atomic-pending-file-recovery.md}; do printf '\\n=== %s ===\\n' \""'$(basename "$f")"; awk '"'BEGIN{flag=0} /"'^## Source Files/{flag=1;next} /''^## /&&flag{exit} flag{print}'"' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 869


=== 13-strict-zod-schema-validation.md ===

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |


=== 14-dynamic-server-instructions-at-mcp-initialization.md ===

codex
The feature snippets have very different quality already: a couple look tightly scoped, while others list almost the entire server as implementation surface. I’m now checking which listed paths actually exist and then I’ll compare the implementation claims line-by-line against the code.
exec
/bin/zsh -lc "paths='mcp_server/schemas/tool-input-schemas.ts
mcp_server/tests/tool-input-schema.vitest.ts
mcp_server/configs/cognitive.ts
mcp_server/context-server.ts
mcp_server/core/config.ts
mcp_server/core/db-state.ts
mcp_server/core/index.ts
mcp_server/formatters/index.ts
mcp_server/formatters/search-results.ts
mcp_server/formatters/token-metrics.ts
mcp_server/handlers/causal-graph.ts
mcp_server/handlers/causal-links-processor.ts
mcp_server/handlers/checkpoints.ts
mcp_server/handlers/chunking-orchestrator.ts
mcp_server/handlers/eval-reporting.ts
mcp_server/handlers/handler-utils.ts
mcp_server/handlers/index.ts
mcp_server/handlers/memory-bulk-delete.ts
mcp_server/handlers/memory-context.ts
mcp_server/handlers/memory-crud-delete.ts
mcp_server/handlers/memory-crud-health.ts
mcp_server/handlers/memory-crud-list.ts
mcp_server/handlers/memory-crud-stats.ts
mcp_server/handlers/memory-crud-types.ts
mcp_server/handlers/memory-crud-update.ts
mcp_server/handlers/memory-crud-utils.ts
mcp_server/handlers/memory-crud.ts
mcp_server/handlers/memory-index-alias.ts
mcp_server/handlers/memory-index-discovery.ts
mcp_server/handlers/memory-index.ts
mcp_server/handlers/memory-ingest.ts
mcp_server/handlers/memory-save.ts
mcp_server/handlers/memory-search.ts
mcp_server/handlers/memory-triggers.ts
mcp_server/handlers/mutation-hooks.ts
mcp_server/handlers/pe-gating.ts
mcp_server/handlers/quality-loop.ts
mcp_server/handlers/save/create-record.ts
mcp_server/handlers/save/db-helpers.ts
mcp_server/handlers/save/dedup.ts
mcp_server/handlers/save/embedding-pipeline.ts
mcp_server/handlers/save/index.ts
mcp_server/handlers/save/pe-orchestration.ts
mcp_server/handlers/save/post-insert.ts
mcp_server/handlers/save/reconsolidation-bridge.ts
mcp_server/handlers/save/response-builder.ts
mcp_server/handlers/save/types.ts
mcp_server/handlers/session-learning.ts
mcp_server/handlers/types.ts
mcp_server/hooks/index.ts
mcp_server/hooks/memory-surface.ts
mcp_server/hooks/mutation-feedback.ts
mcp_server/hooks/response-hints.ts
mcp_server/lib/architecture/layer-definitions.ts
mcp_server/lib/cache/embedding-cache.ts
mcp_server/lib/cache/tool-cache.ts
mcp_server/lib/chunking/anchor-chunker.ts
mcp_server/lib/chunking/chunk-thinning.ts
mcp_server/lib/cognitive/archival-manager.ts
mcp_server/lib/cognitive/attention-decay.ts
mcp_server/lib/cognitive/co-activation.ts
mcp_server/lib/cognitive/fsrs-scheduler.ts
mcp_server/lib/cognitive/prediction-error-gate.ts
mcp_server/lib/cognitive/pressure-monitor.ts
mcp_server/lib/cognitive/rollout-policy.ts
mcp_server/lib/cognitive/tier-classifier.ts
mcp_server/lib/cognitive/working-memory.ts
mcp_server/lib/config/memory-types.ts
mcp_server/lib/config/type-inference.ts
mcp_server/lib/errors.ts
mcp_server/lib/errors/core.ts
mcp_server/lib/errors/index.ts
mcp_server/lib/errors/recovery-hints.ts
mcp_server/lib/eval/ablation-framework.ts
mcp_server/lib/eval/eval-db.ts
mcp_server/lib/eval/eval-logger.ts
mcp_server/lib/eval/eval-metrics.ts
mcp_server/lib/eval/ground-truth-data.ts
mcp_server/lib/eval/ground-truth-feedback.ts
mcp_server/lib/eval/reporting-dashboard.ts
mcp_server/lib/extraction/entity-extractor.ts
mcp_server/lib/extraction/extraction-adapter.ts
mcp_server/lib/extraction/redaction-gate.ts
mcp_server/lib/graph/community-detection.ts
mcp_server/lib/graph/graph-signals.ts
mcp_server/lib/interfaces/vector-store.ts
mcp_server/lib/ops/file-watcher.ts
mcp_server/lib/ops/job-queue.ts
mcp_server/lib/parsing/content-normalizer.ts
mcp_server/lib/parsing/memory-parser.ts
mcp_server/lib/parsing/trigger-matcher.ts
mcp_server/lib/providers/embeddings.ts
mcp_server/lib/providers/retry-manager.ts
mcp_server/lib/response/envelope.ts
mcp_server/lib/scoring/composite-scoring.ts
mcp_server/lib/scoring/confidence-tracker.ts
mcp_server/lib/scoring/folder-scoring.ts
mcp_server/lib/scoring/importance-tiers.ts
mcp_server/lib/scoring/interference-scoring.ts
mcp_server/lib/scoring/mpab-aggregation.ts
mcp_server/lib/scoring/negative-feedback.ts
mcp_server/lib/search/anchor-metadata.ts
mcp_server/lib/search/artifact-routing.ts
mcp_server/lib/search/auto-promotion.ts
mcp_server/lib/search/bm25-index.ts
mcp_server/lib/search/causal-boost.ts
mcp_server/lib/search/channel-enforcement.ts
mcp_server/lib/search/channel-representation.ts
mcp_server/lib/search/confidence-truncation.ts
mcp_server/lib/search/cross-encoder.ts
mcp_server/lib/search/dynamic-token-budget.ts
mcp_server/lib/search/embedding-expansion.ts
mcp_server/lib/search/encoding-intent.ts
mcp_server/lib/search/entity-linker.ts
mcp_server/lib/search/evidence-gap-detector.ts
mcp_server/lib/search/feedback-denylist.ts
mcp_server/lib/search/folder-discovery.ts
mcp_server/lib/search/folder-relevance.ts
mcp_server/lib/search/graph-flags.ts
mcp_server/lib/search/graph-search-fn.ts
mcp_server/lib/search/hybrid-search.ts
mcp_server/lib/search/intent-classifier.ts
mcp_server/lib/search/learned-feedback.ts
mcp_server/lib/search/local-reranker.ts
mcp_server/lib/search/memory-summaries.ts
mcp_server/lib/search/pipeline/index.ts
mcp_server/lib/search/pipeline/orchestrator.ts
mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
mcp_server/lib/search/pipeline/stage2-fusion.ts
mcp_server/lib/search/pipeline/stage3-rerank.ts
mcp_server/lib/search/pipeline/stage4-filter.ts
mcp_server/lib/search/pipeline/types.ts
mcp_server/lib/search/query-classifier.ts
mcp_server/lib/search/query-expander.ts
mcp_server/lib/search/query-router.ts
mcp_server/lib/search/retrieval-directives.ts
mcp_server/lib/search/search-flags.ts
mcp_server/lib/search/search-types.ts
mcp_server/lib/search/session-boost.ts
mcp_server/lib/search/spec-folder-hierarchy.ts
mcp_server/lib/search/sqlite-fts.ts
mcp_server/lib/search/tfidf-summarizer.ts
mcp_server/lib/search/validation-metadata.ts
mcp_server/lib/search/vector-index-aliases.ts
mcp_server/lib/search/vector-index-mutations.ts
mcp_server/lib/search/vector-index-queries.ts
mcp_server/lib/search/vector-index-schema.ts
mcp_server/lib/search/vector-index-store.ts
mcp_server/lib/search/vector-index-types.ts
mcp_server/lib/search/vector-index.ts
mcp_server/lib/session/session-manager.ts
mcp_server/lib/storage/access-tracker.ts
mcp_server/lib/storage/causal-edges.ts
mcp_server/lib/storage/checkpoints.ts
mcp_server/lib/storage/consolidation.ts
mcp_server/lib/storage/incremental-index.ts
mcp_server/lib/storage/learned-triggers-schema.ts
mcp_server/lib/storage/mutation-ledger.ts
mcp_server/lib/storage/reconsolidation.ts
mcp_server/lib/storage/schema-downgrade.ts
mcp_server/lib/storage/transaction-manager.ts
mcp_server/lib/telemetry/consumption-logger.ts
mcp_server/lib/telemetry/retrieval-telemetry.ts
mcp_server/lib/telemetry/scoring-observability.ts
mcp_server/lib/telemetry/trace-schema.ts
mcp_server/lib/utils/canonical-path.ts
mcp_server/lib/utils/format-helpers.ts
mcp_server/lib/utils/logger.ts
mcp_server/lib/utils/path-security.ts
mcp_server/lib/validation/preflight.ts
mcp_server/lib/validation/save-quality-gate.ts
mcp_server/startup-checks.ts
mcp_server/tool-schemas.ts
mcp_server/tools/causal-tools.ts
mcp_server/tools/checkpoint-tools.ts
mcp_server/tools/context-tools.ts
mcp_server/tools/index.ts
mcp_server/tools/lifecycle-tools.ts
mcp_server/tools/memory-tools.ts
mcp_server/tools/types.ts
mcp_server/utils/batch-processor.ts
mcp_server/utils/db-helpers.ts
mcp_server/utils/index.ts
mcp_server/utils/json-helpers.ts
mcp_server/utils/tool-input-schema.ts
mcp_server/utils/validators.ts
shared/algorithms/adaptive-fusion.ts
shared/algorithms/mmr-reranker.ts
shared/algorithms/rrf-fusion.ts
shared/chunking.ts
shared/config.ts
shared/contracts/retrieval-trace.ts
shared/embeddings.ts
shared/embeddings/factory.ts
shared/embeddings/profile.ts
shared/embeddings/providers/hf-local.ts
shared/embeddings/providers/openai.ts
shared/embeddings/providers/voyage.ts
shared/normalization.ts
shared/parsing/quality-extractors.ts
shared/scoring/folder-scoring.ts
shared/types.ts
shared/utils/path-security.ts
shared/utils/retry.ts
shared/utils/token-estimate.ts
mcp_server/tests/ablation-framework.vitest.ts
mcp_server/tests/access-tracker-extended.vitest.ts
mcp_server/tests/access-tracker.vitest.ts
mcp_server/tests/adaptive-fusion.vitest.ts
mcp_server/tests/anchor-metadata.vitest.ts
mcp_server/tests/archival-manager.vitest.ts
mcp_server/tests/artifact-routing.vitest.ts
mcp_server/tests/attention-decay.vitest.ts
mcp_server/tests/batch-processor.vitest.ts
mcp_server/tests/bm25-index.vitest.ts
mcp_server/tests/causal-boost.vitest.ts
mcp_server/tests/causal-edges-unit.vitest.ts
mcp_server/tests/causal-edges.vitest.ts
mcp_server/tests/channel-enforcement.vitest.ts
mcp_server/tests/channel-representation.vitest.ts
mcp_server/tests/channel.vitest.ts
mcp_server/tests/checkpoint-working-memory.vitest.ts
mcp_server/tests/checkpoints-extended.vitest.ts
mcp_server/tests/checkpoints-storage.vitest.ts
mcp_server/tests/chunk-thinning.vitest.ts
mcp_server/tests/co-activation.vitest.ts
mcp_server/tests/cognitive-gaps.vitest.ts
mcp_server/tests/community-detection.vitest.ts
mcp_server/tests/composite-scoring.vitest.ts
mcp_server/tests/confidence-tracker.vitest.ts
mcp_server/tests/confidence-truncation.vitest.ts
mcp_server/tests/config-cognitive.vitest.ts
mcp_server/tests/consumption-logger.vitest.ts
mcp_server/tests/content-hash-dedup.vitest.ts
mcp_server/tests/content-normalizer.vitest.ts
mcp_server/tests/context-server.vitest.ts
mcp_server/tests/cross-encoder-extended.vitest.ts
mcp_server/tests/cross-encoder.vitest.ts
mcp_server/tests/db-state-graph-reinit.vitest.ts
mcp_server/tests/decay.vitest.ts
mcp_server/tests/dynamic-token-budget.vitest.ts
mcp_server/tests/embedding-cache.vitest.ts
mcp_server/tests/embedding-expansion.vitest.ts
mcp_server/tests/embeddings.vitest.ts
mcp_server/tests/encoding-intent.vitest.ts
mcp_server/tests/entity-extractor.vitest.ts
mcp_server/tests/entity-linker.vitest.ts
mcp_server/tests/envelope.vitest.ts
mcp_server/tests/errors-comprehensive.vitest.ts
mcp_server/tests/eval-db.vitest.ts
mcp_server/tests/eval-logger.vitest.ts
mcp_server/tests/eval-metrics.vitest.ts
mcp_server/tests/evidence-gap-detector.vitest.ts
mcp_server/tests/extraction-adapter.vitest.ts
mcp_server/tests/feature-eval-graph-signals.vitest.ts
mcp_server/tests/feedback-denylist.vitest.ts
mcp_server/tests/file-watcher.vitest.ts
mcp_server/tests/folder-discovery-integration.vitest.ts
mcp_server/tests/folder-discovery.vitest.ts
mcp_server/tests/folder-relevance.vitest.ts
mcp_server/tests/folder-scoring.vitest.ts
mcp_server/tests/fsrs-scheduler.vitest.ts
mcp_server/tests/full-spec-doc-indexing.vitest.ts
mcp_server/tests/graph-flags.vitest.ts
mcp_server/tests/graph-search-fn.vitest.ts
mcp_server/tests/graph-signals.vitest.ts
mcp_server/tests/ground-truth-feedback.vitest.ts
mcp_server/tests/ground-truth.vitest.ts
mcp_server/tests/handler-causal-graph.vitest.ts
mcp_server/tests/handler-checkpoints.vitest.ts
mcp_server/tests/handler-memory-context.vitest.ts
mcp_server/tests/handler-memory-crud.vitest.ts
mcp_server/tests/handler-memory-index-cooldown.vitest.ts
mcp_server/tests/handler-memory-index.vitest.ts
mcp_server/tests/handler-memory-ingest.vitest.ts
mcp_server/tests/handler-memory-save.vitest.ts
mcp_server/tests/handler-memory-search.vitest.ts
mcp_server/tests/handler-memory-triggers.vitest.ts
mcp_server/tests/handler-session-learning.vitest.ts
mcp_server/tests/hybrid-search-context-headers.vitest.ts
mcp_server/tests/hybrid-search-flags.vitest.ts
mcp_server/tests/hybrid-search.vitest.ts
mcp_server/tests/importance-tiers.vitest.ts
mcp_server/tests/incremental-index-v2.vitest.ts
mcp_server/tests/incremental-index.vitest.ts
mcp_server/tests/index-refresh.vitest.ts
mcp_server/tests/integration-causal-graph.vitest.ts
mcp_server/tests/integration-session-dedup.vitest.ts
mcp_server/tests/intent-classifier.vitest.ts
mcp_server/tests/interference.vitest.ts
mcp_server/tests/job-queue.vitest.ts
mcp_server/tests/layer-definitions.vitest.ts
mcp_server/tests/learned-feedback.vitest.ts
mcp_server/tests/local-reranker.vitest.ts
mcp_server/tests/mcp-response-envelope.vitest.ts
mcp_server/tests/memory-context-eval-channels.vitest.ts
mcp_server/tests/memory-context.vitest.ts
mcp_server/tests/memory-crud-extended.vitest.ts
mcp_server/tests/memory-parser-extended.vitest.ts
mcp_server/tests/memory-parser.vitest.ts
mcp_server/tests/memory-save-extended.vitest.ts
mcp_server/tests/memory-save-integration.vitest.ts
mcp_server/tests/memory-save-ux-regressions.vitest.ts
mcp_server/tests/memory-search-eval-channels.vitest.ts
mcp_server/tests/memory-search-integration.vitest.ts
mcp_server/tests/memory-search-quality-filter.vitest.ts
mcp_server/tests/memory-summaries.vitest.ts
mcp_server/tests/memory-types.vitest.ts
mcp_server/tests/mmr-reranker.vitest.ts
mcp_server/tests/mpab-aggregation.vitest.ts
mcp_server/tests/mutation-ledger.vitest.ts
mcp_server/tests/n3lite-consolidation.vitest.ts
mcp_server/tests/prediction-error-gate.vitest.ts
mcp_server/tests/preflight.vitest.ts
mcp_server/tests/pressure-monitor.vitest.ts
mcp_server/tests/quality-loop.vitest.ts
mcp_server/tests/query-classifier.vitest.ts
mcp_server/tests/query-expander.vitest.ts
mcp_server/tests/query-router-channel-interaction.vitest.ts
mcp_server/tests/query-router.vitest.ts
mcp_server/tests/reconsolidation.vitest.ts
mcp_server/tests/recovery-hints.vitest.ts
mcp_server/tests/redaction-gate.vitest.ts
mcp_server/tests/regression-010-index-large-files.vitest.ts
mcp_server/tests/reporting-dashboard.vitest.ts
mcp_server/tests/reranker.vitest.ts
mcp_server/tests/retrieval-directives.vitest.ts
mcp_server/tests/retrieval-telemetry.vitest.ts
mcp_server/tests/retrieval-trace.vitest.ts
mcp_server/tests/retry-manager.vitest.ts
mcp_server/tests/retry.vitest.ts
mcp_server/tests/rollout-policy.vitest.ts
mcp_server/tests/rrf-fusion.vitest.ts
mcp_server/tests/save-quality-gate.vitest.ts
mcp_server/tests/score-normalization.vitest.ts
mcp_server/tests/scoring-observability.vitest.ts
mcp_server/tests/scoring.vitest.ts
mcp_server/tests/search-flags.vitest.ts
mcp_server/tests/search-results-format.vitest.ts
mcp_server/tests/session-boost.vitest.ts
mcp_server/tests/session-manager-extended.vitest.ts
mcp_server/tests/session-manager.vitest.ts
mcp_server/tests/spec-folder-hierarchy.vitest.ts
mcp_server/tests/sqlite-fts.vitest.ts
mcp_server/tests/stage2-fusion.vitest.ts
mcp_server/tests/tier-classifier.vitest.ts
mcp_server/tests/token-budget.vitest.ts
mcp_server/tests/tool-cache.vitest.ts
mcp_server/tests/tool-input-schema.vitest.ts
mcp_server/tests/transaction-manager-extended.vitest.ts
mcp_server/tests/transaction-manager.vitest.ts
mcp_server/tests/trigger-config-extended.vitest.ts
mcp_server/tests/trigger-matcher.vitest.ts
mcp_server/tests/trigger-setAttentionScore.vitest.ts
mcp_server/tests/unit-composite-scoring-types.vitest.ts
mcp_server/tests/unit-folder-scoring-types.vitest.ts
mcp_server/tests/unit-normalization-roundtrip.vitest.ts
mcp_server/tests/unit-normalization.vitest.ts
mcp_server/tests/unit-path-security.vitest.ts
mcp_server/tests/unit-rrf-fusion.vitest.ts
mcp_server/tests/unit-tier-classifier-types.vitest.ts
mcp_server/tests/unit-transaction-metrics-types.vitest.ts
mcp_server/tests/validation-metadata.vitest.ts
mcp_server/tests/vector-index-impl.vitest.ts
mcp_server/tests/working-memory-event-decay.vitest.ts
mcp_server/tests/working-memory.vitest.ts
shared/parsing/quality-extractors.test.ts';
printf '%s
' \""'$paths" | while IFS= read -r p; do [ -z "$p" ] && continue; if [ -e ".opencode/skill/system-spec-kit/$p" ]; then :; else printf '"'MISSING %s\\n' \""'$p"; fi; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
MISSING mcp_server/tests/retry.vitest.ts
exec
/bin/zsh -lc "rg -n \"SPECKIT_STRICT_SCHEMAS|strict\\(|passthrough\\(|zod|schema\" .opencode/skill/system-spec-kit/mcp_server/schemas .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "setInstructions|SPECKIT_DYNAMIC_INIT|memory_stats|dynamic.*instruction|instruction payload|stale" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/core .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/formatters .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "daemon|http transport|StreamableHTTP|stdio|transport" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "IVectorStore|IGraphStore|IDocumentStore|vector-store|backend storage|adapter abstraction|interface" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:7:import { TOOL_DEFINITIONS, validateToolArgs } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:8:import { validateToolInputSchema } from '../utils/tool-input-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:15:  it('no tool schema uses top-level oneOf, allOf, or anyOf', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:17:      const schema = tool.inputSchema as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:18:      expect(schema).not.toHaveProperty('oneOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:19:      expect(schema).not.toHaveProperty('allOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:20:      expect(schema).not.toHaveProperty('anyOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:24:  it('all tool schemas have type: object at top level', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:26:      const schema = tool.inputSchema as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:27:      expect(schema.type).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:77:describe('memory_delete schema (oneOf removed, handler-validated)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:105:    }).toThrow(/required schema constraints/);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:128:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:132:  it('public schema accepts concepts-only search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:138:  it('public schema rejects requests without query or concepts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:141:    }).toThrow(/required schema constraints/);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:162:  it('public schema rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:168:  it('public schema enforces query minimum length', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:181:describe('checkpoint_delete schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:182:  it('requires confirmName at schema level', () => {
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:88:// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:140:  staleCount: number;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:191:      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:210:      staleCount: pending + failed + retry,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:221:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:230:  const staleWarning = stats.staleCount > 10
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:231:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:236:    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:238:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:239:    staleWarning.trim(),
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:256:const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:699:  // refresh their DB handles during reinitializeDatabase(), preventing stale refs.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:989:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:993:        serverWithInstructions.setInstructions?.(dynamicInstructions);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:156:      // P4-12, P4-19 FIX: Refresh stale DB handles in session-manager and incremental-index
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:35:/** Arguments for the memory_stats handler. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:176:// AI-TRACE T302: Track stale session cleanup interval (runs hourly)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:177:let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:213:  // AI-TRACE T302: Run stale session cleanup on startup and set up hourly interval
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:18:import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:544:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:545:let transport: StdioServerTransport | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:599:    // P1-09 FIX: Close MCP transport on shutdown
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:600:    runCleanupStep('transport', () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:601:      if (transport) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:602:        transport.close();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:988:  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1001:  transport = new StdioServerTransport();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1002:  await server.connect(transport);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1003:  console.error('[context-server] Context MCP server running on stdio');
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:72:                                  │ MCP stdio
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:219:# Process starts and waits for MCP stdio input
.opencode/skill/system-spec-kit/mcp_server/README.md:203:| `context-server.ts` | Server init, stdio transport, startup/shutdown lifecycle                                 |
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:128:      stdio: ['pipe', 'pipe', 'pipe'],
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:149:      stdio: ['pipe', 'pipe', 'pipe'],
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:50:describe('MCP stdio logging safety', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:329:      '@modelcontextprotocol/sdk/server/stdio.js',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:403:          async connect(_transport: unknown): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:409:      vi.doMock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
 succeeded in 51ms:
Total output lines: 496

.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:17:interface SessionConfig {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:24:interface InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:29:interface MemoryInput {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:38:interface MarkResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:45:interface MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:52:interface SessionStats {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:58:interface FilterResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:69:interface CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:74:interface StaleCleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:82:interface SessionState {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:96:interface SessionStateInput {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:105:interface RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:112:interface InterruptedSession {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:122:interface InterruptedSessionsResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:128:interface ResetResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:134:interface CheckpointResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:141:interface ContinueSessionInput {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:5:  - "interfaces"
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// TEST: Tool Input Schema Validation
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';

import { TOOL_DEFINITIONS, validateToolArgs } from '../tool-schemas';
import { validateToolInputSchema } from '../utils/tool-input-schema';

/* ---------------------------------------------------------------
   1. SCHEMA STRUCTURAL INTEGRITY
--------------------------------------------------------------- */

describe('Tool Schema Structural Integrity', () => {
  it('no tool schema uses top-level oneOf, allOf, or anyOf', () => {
    for (const tool of TOOL_DEFINITIONS) {
      const schema = tool.inputSchema as Record<string, unknown>;
      expect(schema).not.toHaveProperty('oneOf');
      expect(schema).not.toHaveProperty('allOf');
      expect(schema).not.toHaveProperty('anyOf');
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Tool Input Schemas
// ---------------------------------------------------------------
// Centralized strict Zod validation schemas for MCP tool inputs.
// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
// ---------------------------------------------------------------

import { z, ZodError, type ZodType } from 'zod';

type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;

export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
  const base = z.object(shape);
  return strict ? base.strict() : base.passthrough();
};

// Sprint 9 fix: safeNumericPreprocess.pipe(z.number()) silently coerces "", null, false → 0.
// Use a safe preprocessor that only accepts actual numbers or numeric strings.
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Tool Schemas
// ---------------------------------------------------------------
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
// ---------------------------------------------------------------

export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas';

// --- 1. TYPES ---

/** Defines an MCP tool schema entry. */
export interface ToolDefinition {
  name: string;
exec
/bin/zsh -lc "rg -n \"name: '\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | wc -l" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      28
exec
/bin/zsh -lc "sed -n '120,280p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '960,1010p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
    if (isFileWatcherEnabled()) {
      try {
        const watchPaths = getSpecsBasePaths(DEFAULT_BASE_PATH);
        if (watchPaths.length > 0) {
          fileWatcher = startFileWatcher({
            paths: watchPaths,
            reindexFn: async (filePath: string) => {
              await indexMemoryFile(filePath, { asyncEmbedding: true });
            },
            removeFn: async (filePath: string) => {
              await removeIndexedMemoriesForFile(filePath);
            },
          });
          console.error(`[context-server] File watcher started for ${watchPaths.length} path(s)`);
        } else {
          console.warn('[context-server] File watcher enabled, but no spec directories were found');
        }
      } catch (watchErr: unknown) {
        const message = watchErr instanceof Error ? watchErr.message : String(watchErr);
        console.warn('[context-server] File watcher startup failed:', message);
 succeeded in 53ms:
  valid: boolean;
  provider?: string;
  error?: string;
  errorCode?: string;
  warning?: string;
  actions?: string[];
}

interface AutoSurfaceResult { constitutional: unknown[]; triggered: unknown[]; }

interface ToolCallResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  [key: string]: unknown;
}

interface DynamicMemoryStats {
  totalMemories: number;
  specFolderCount: number;
  activeCount: number;
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Stats
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import * as fs from 'fs';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as folderScoring from '../lib/scoring/folder-scoring';
import type { FolderMemoryInput } from '../lib/scoring/folder-scoring';
import { getGraphMetrics } from '../lib/search/hybrid-search';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import type { MCPResponse } from './types';
import type { StatsArgs } from './memory-crud-types';
🌐 Searching the web...
🌐 Searched the web
codex
I’m into the code comparison pass now. A few likely mismatches are emerging around the “planned/deferred” entries, so I’m reading those implementation points directly instead of relying on the snippet wording.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '620,740p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Vector Store
// ---------------------------------------------------------------
// INTERFACE: IVectorStore (abstract base class)
// ---------------------------------------------------------------
// Concrete base class providing the IVectorStore contract for JS consumers.
// TypeScript consumers use the interface in @spec-kit/shared/types.ts;
// this file exists for plain-JS files (e.g., vector-index-impl.js)
// that need a real class to extend at runtime.
// ---------------------------------------------------------------
/**
 * Abstract base class for vector store implementations.
 * All methods throw by default — subclasses must override them.
 */
class IVectorStore {
  async search(_embedding: unknown, _topK: number, _options?: unknown): Promise<unknown[]> {
    throw new Error('Method search() must be implemented by subclass');
  }

  async upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number> {
 succeeded in 52ms:
 * @returns The database path.
 */
export function get_db_path(): string {
  return db_path;
}

/**
 * Gets the shared vector-index database connection.
 * @returns The database connection.
 */
export function get_db(): Database.Database {
  return initialize_db();
}

// Check if vector search is available (sqlite-vec loaded)
/**
 * Reports whether sqlite-vec vector search is available.
 * @returns True when vector search is available.
 */
export function is_vector_search_available(): boolean {
 succeeded in 52ms:
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
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Db State
// ---------------------------------------------------------------

import fs from 'fs/promises';
import { DB_UPDATED_FILE } from './config';
import type { DatabaseExtended } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Minimal vector index interface for database operations */
export interface VectorIndexLike {
  initializeDb(): void;
  getDb(): DatabaseLike | null;
  closeDb?(): void;
  vectorSearch?: unknown;
}

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,360p' .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '240,520p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 54ms:
/* ---------------------------------------------------------------
   6. EMBEDDING MODEL READINESS
   --------------------------------------------------------------- */

/** Return whether the embedding model has been marked as ready. */
export function isEmbeddingModelReady(): boolean {
  return embeddingModelReady;
}

/** Set the embedding model readiness flag. */
export function setEmbeddingModelReady(ready: boolean): void {
  embeddingModelReady = ready;
}

/** Poll until the embedding model is ready, returning false on timeout. */
export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 500;

  while (!embeddingModelReady) {
 succeeded in 54ms:
// ---------------------------------------------------------------
// MODULE: Retry Manager
// ---------------------------------------------------------------

// Node stdlib
import * as fsPromises from 'fs/promises';

// Internal modules
import * as vectorIndex from '../search/vector-index';
import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
import { normalizeContentForEmbedding } from '../parsing/content-normalizer';
import { generateDocumentEmbedding, getModelName } from './embeddings';

// Type imports
import type { MemoryDbRow } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

 succeeded in 50ms:
   7. RECOVERY
----------------------------------------------------------------*/

/**
 * Find pending files in a directory (crash recovery).
 */
function listFilesRecursive(dirPath: string): string[] {
  const files: string[] = [];
  const stack: string[] = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true, encoding: 'utf-8' });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Transaction Manager
// ---------------------------------------------------------------
// AI-GUARD: Atomic file + index operations with pending file recovery
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const PENDING_SUFFIX = '_pending';
const TEMP_SUFFIX = '.tmp';

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "executeAtomicSave|dbCommitted|pending|recoverAllPendingFiles|findPendingFiles|recoverPendingFile" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Save Handler
// ---------------------------------------------------------------
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { randomUUID } from 'node:crypto';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Internal modules
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { createFilePathValidator } from '../utils/validators';
import * as memoryParser from '../lib/parsing/memory-parser';
import * as transactionManager from '../lib/storage/transaction-manager';
import * as preflight from '../lib/validation/preflight';
import { requireDb } from '../utils';
import type { MCPResponse } from './types';
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:90:// T107: Transaction manager for pending file recovery on startup (REQ-033)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:199:    const pending = typeof byStatus.pending === 'number' ? byStatus.pending : 0;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:210:      staleCount: pending + failed + retry,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:414: * T107: Recover pending memory files on MCP startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:417: * Scans for files with _pending suffix (created when index failed after file write)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:420:async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:421:  console.error('[context-server] Checking for pending memory files...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:448:    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:466:      console.error('[context-server] No pending memory files found');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:494:    // T107: Recover any pending files from previous failed index operations
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:495:    await recoverPendingFiles(basePath);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:680:  // AI-WHY: Short delay allows pending stderr writes to flush before exit
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:902:    // T099: Background retry job for pending embeddings (REQ-031, CHK-179)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:907:        batchSize: 5,               // Process up to 5 pending items per run
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:127:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:194:    CREATE INDEX IF NOT EXISTS idx_embedding_pending
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:196:      WHERE embedding_status IN ('pending', 'partial', 'retry');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:200:      WHERE embedding_status IN ('pending', 'failed', 'retry');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:50:| **Atomic Transactions** | File write + index insert with pending file recovery |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:86:| `transaction-manager.ts` | Atomic file writes (temp+rename) with pending file crash recovery |
 succeeded in 50ms:
// ---------------------------------------------------------------
// TEST: TRANSACTION MANAGER
// ---------------------------------------------------------------

// Converted from: transaction-manager.test.ts (custom runner)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  getPendingPath,
  getOriginalPath,
  isPendingFile,
  atomicWriteFile,
  executeAtomicSave,
  findPendingFiles,
  recoverPendingFile,
  recoverAllPendingFiles,
  getMetrics,
  resetMetrics,
 succeeded in 51ms:
// Converted from: transaction-manager-extended.test.ts (custom runner)
// ---------------------------------------------------------------
// TEST: deleteFileIfExists (transaction-manager extended)
// Covers the single untested export from transaction-manager.ts
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {
  deleteFileIfExists,
  resetMetrics,
  getMetrics,
} from '../lib/storage/transaction-manager';

/* --- Helpers --- */

let TEST_DIR: string | null = null;

exec
/bin/zsh -lc "sed -n '360,460p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      const errorCode = (typeof firstError === 'object' && firstError?.code)
        ? firstError.code
        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
      throw new preflight.PreflightError(
        errorCode,
        `Pre-flight validation failed: ${errorMessages}`,
        {
          errors: preflightResult.errors,
          warnings: preflightResult.warnings,
          recoverable: true,
          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
        }
      );
    }

    if (preflightResult.warnings.length > 0) {
      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
      preflightResult.warnings.forEach((w: string | { message: string }) => {
        const msg = typeof w === 'string' ? w : w.message;
        console.warn(`[preflight]   - ${msg}`);
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------

import { buildMutationHookFeedback } from '../../hooks/mutation-feedback';
import type { ParsedMemory } from '../../lib/parsing/memory-parser';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SimilarMemory {
  id: number;
  similarity: number;
  content: string;
  stability: number;
  difficulty: number;
  file_path: string;
exec
/bin/zsh -lc "sed -n '240,520p' .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"retry_count|embedding_status = 'pending'|updateEmbeddingStatus|store without vectors|vec_memories|index-refresh|retry manager\" .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  const db = vectorIndex.getDb();
  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };

  const now = new Date().toISOString();

  try {
    const memory = vectorIndex.getMemory(id);
    if (!memory) return { success: false, error: 'Memory not found' };

    if ((memory.retry_count as number) >= MAX_RETRIES) {
      markAsFailed(id, 'Maximum retry attempts exceeded');
      return { success: false, error: 'Maximum retries exceeded', permanent: true };
    }

    // BUG-1 fix: Normalize content before embedding to match sync save path (memory-save.ts:1119).
    // Without this, async-saved memories get embeddings from raw markdown (YAML frontmatter, HTML
    // comments, code fences) while sync-saved memories get clean normalized embeddings.
    const normalizedContent = normalizeContentForEmbedding(content);
    const modelId = getModelName();
    const contentHash = computeContentHash(normalizedContent);
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Index Refresh
// ---------------------------------------------------------------
// Manages embedding index freshness on the memory_index table
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RETRY_THRESHOLD = 3;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

/**
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Embedding Pipeline
// ---------------------------------------------------------------

import path from 'path';
import type Database from 'better-sqlite3';

import * as embeddings from '../../lib/providers/embeddings';
import { lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../../lib/parsing/content-normalizer';
import type { ParsedMemory } from '../../lib/parsing/memory-parser';
import { toErrorMessage } from '../../utils';

export interface EmbeddingResult {
  embedding: Float32Array | null;
  status: 'success' | 'pending';
  failureReason: string | null;
}

export async function generateOrCacheEmbedding(
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:40:  retry_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:127:    SELECT id, spec_folder, file_path, embedding_status, retry_count
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:163: * If retry_count < 3: set embedding_status='retry', increment retry_count.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:164: * If retry_count >= 3: set embedding_status='failed'.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:172:    SELECT retry_count FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:173:  `).get(id) as { retry_count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:177:  const newRetryCount = row.retry_count + 1;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:183:        retry_count = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:213:    throw new Error('index-refresh: not initialized — call init(db) first');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:155:      AND retry_count < ?
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:157:      CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:158:      retry_count ASC,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:180:    const retryCount = (row.retry_count as number) ?? (row.retryCount as number) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:217:      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:249:    if ((memory.retry_count as number) >= MAX_RETRIES) {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:307:        db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:313:      db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(id), embeddingBuffer);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343:  const newRetryCount = (Number(memory.retry_count) || 0) + 1;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:351:          retry_count = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:385:        retry_count = 0,
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '120,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '880,930p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"startBackgroundJob|processRetryQueue\\(|getRetryStats\\(|resetForRetry\\(|retry-manager\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/providers" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Create Record
// ---------------------------------------------------------------

import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index';
import * as bm25Index from '../../lib/search/bm25-index';
import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../../lib/storage/incremental-index';
import type * as memoryParser from '../../lib/parsing/memory-parser';
import { toErrorMessage } from '../../utils';

import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating';
import { detectSpecLevelFromParsed } from '../handler-utils';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../../lib/search/search-flags';
import { applyPostInsertMetadata } from './db-helpers';
 succeeded in 53ms:

  const sqlite_vec = get_sqlite_vec_available();

  const index_memory_tx = database.transaction(() => {
    const embedding_status = sqlite_vec ? 'success' : 'pending';

    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
        content_text, quality_score, quality_flags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, canonicalFilePath, anchorId, title, triggers_json,
      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
      encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags)
    );

    const row_id = BigInt(result.lastInsertRowid);
 succeeded in 52ms:
      initExtractionAdapter(database, registerAfterToolCallback);
      console.error('[context-server] Extraction adapter initialized');
    } catch (extractionErr: unknown) {
      const message = extractionErr instanceof Error ? extractionErr.message : String(extractionErr);
      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
    }

    // T059: Archival Manager for automatic archival of ARCHIVED state memories
    try {
      archivalManager.init(database);
      // Start background archival job (scans every hour by default)
      archivalManager.startBackgroundJob();
      if (archivalManager.isBackgroundJobRunning()) {
        console.error(`[context-server] Archival manager initialized (background job started)`);
      } else {
        console.error(`[context-server] Archival manager initialized (background job: not started)`);
      }
    } catch (archivalErr: unknown) {
      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
      console.warn('[context-server] Archival manager failed:', message);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:83:import * as retryManager from './lib/providers/retry-manager';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:891:      archivalManager.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:905:      const retryJobResult = retryManager.startBackgroundJob({
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:135:    console.warn(`[retry-manager] Embedding provider circuit breaker OPEN after ${providerFailures} consecutive failures. Cooldown: ${PROVIDER_COOLDOWN_MS}ms`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:147:    console.warn('[retry-manager] Database not initialized. Server may still be starting up.');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:195:    console.warn('[retry-manager] Database not initialized. Server may still be starting up. Returning empty array.');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:208:function getRetryStats(): RetryStats {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:211:    console.warn('[retry-manager] Database not initialized. Server may still be starting up. Returning default stats.');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:339:    console.warn(`[retry-manager] Memory ${id} not found during retry count increment`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:363:    console.warn('[retry-manager] Database not initialized. Server may still be starting up. Cannot mark as failed.');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:377:function resetForRetry(id: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:399:async function processRetryQueue(limit = 3, contentLoader: ContentLoader | null = null): Promise<BatchResult> {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:454:function startBackgroundJob(options: Partial<BackgroundJobConfig> = {}): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:456:    console.error('[retry-manager] Background job already running');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:463:    console.error('[retry-manager] Background job is disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:467:  console.error(`[retry-manager] Starting background retry job (interval: ${config.intervalMs}ms, batch: ${config.batchSize})`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:471:    console.error('[retry-manager] Initial background job failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:477:      console.error('[retry-manager] Background job iteration failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:491:  console.error('[retry-manager] Background retry job stopped');
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:507:    const stats = getRetryStats();
exec
/bin/zsh -lc "sed -n '250,330p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
      if (result.embeddingFailureReason) {
        response.embeddingFailureReason = result.embeddingFailureReason;
      }
    } else if (result.embeddingStatus === 'partial') {
      // Chunked indexing result
      response.message = result.message || `${response.message} (chunked indexing)`;
    }
  }

  const summary = response.message as string;
  const hints: string[] = [];
  if (result.pe_action === 'REINFORCE') {
    hints.push('Existing memory was reinforced instead of creating duplicate');
  }
  if (result.pe_action === 'SUPERSEDE') {
    hints.push(`Previous memory #${result.superseded_id} marked as deprecated`);
  }
  if (result.warnings && result.warnings.length > 0) {
    hints.push('Review anchor warnings for better searchability');
  }
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'ls .opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "layer|token budget|LayerDefinition|getLayer|recommend.*layer|default.*layer|task type|tool subset" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Layer Definitions
// ---------------------------------------------------------------
// LIB: LAYER DEFINITIONS
// T060: 7-Layer MCP Architecture with Token Budgets
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LAYER TYPES
   --------------------------------------------------------------- */

/** Individual layer definition in the 7-layer architecture */
export interface LayerDefinition {
  id: string;
  name: string;
  description: string;
  tokenBudget: number;
  priority: number;
  useCase: string;
  tools: string[];
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:12:/** Individual layer definition in the 7-layer architecture */
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:13:export interface LayerDefinition {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:26:/** Task type for layer recommendations */
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:36:   - Token efficiency: Higher layers = fewer tokens, more targeted
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:43:export const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition> = {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:121:   Maps each tool to its layer for quick lookup.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:128:for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:129:  for (const tool of layer.tools) {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:130:    (TOOL_LAYER_MAP as Record<string, string>)[tool] = layerId;
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:142: * Get the layer prefix for a tool's description.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:143: * CHK-073: Tool descriptions include layer prefix.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:145:export function getLayerPrefix(toolName: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:146:  const layerId = TOOL_LAYER_MAP[toolName];
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:147:  if (!layerId) return '';
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:149:  const layer = LAYER_DEFINITIONS[layerId];
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:150:  return `[${layerId}:${layer.name}]`;
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:154: * Enhance a tool description with layer information.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:155: * CHK-073: Adds layer prefix to description.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:158:  const prefix = getLayerPrefix(toolName);
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:167:   CHK-072: Token budgets assigned per layer.
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts
exec
/bin/zsh -lc "sed -n '130,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts && sed -n '450,660p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
    return Array.isArray(nestedData?.results)
      ? nestedData.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

/* ---------------------------------------------------------------
   2. TOKEN BUDGET ENFORCEMENT (T205)
   
   Enforces per-layer/per-mode token budgets by estimating the
   token count of strategy results and truncating when exceeded.
   Uses character-based estimation: 1 token ≈ 4 chars.
--------------------------------------------------------------- */

/**
 * T205: Enforce token budget on strategy results.
 * 
exec
/bin/zsh -lc 'rg -n "getLayerPrefix|enhanceDescription|getTokenBudget|getRecommendedLayers|getLayerInfo|L1:Orchestration|L2:Core|L3:Discovery|L4:Mutation|L5:Lifecycle|L6:Analysis|L7:Maintenance" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:145:export function getLayerPrefix(toolName: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:157:export function enhanceDescription(toolName: string, description: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:158:  const prefix = getLayerPrefix(toolName);
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:173:export function getTokenBudget(toolName: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:183:export function getLayerInfo(toolName: string): LayerDefinition | null {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:201:export function getRecommendedLayers(taskType: TaskType): LayerId[] {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:30:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 2000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:37:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:172:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 1500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:179:  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:185:  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:191:  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:224:  description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Requires EITHER id (single delete) OR specFolder + confirm:true (bulk delete). Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:239:  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:245:  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:267:  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:274:  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:280:  description: '[L5:Lifecycle] List all available checkpoints. Token Budget: 600.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:286:  description: '[L5:Lifecycle] Restore memory state from a checkpoint. Token Budget: 600.',
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"DB_UPDATED_FILE|checkDatabaseUpdated\\(|reinitializeDatabase\\(|waitForEmbeddingModel|setEmbeddingModelReady|clearConstitutionalCache|dbState\\.init|incrementalIndex\\.init|sessionManager\\.init|hybridSearch\\.init|checkpoints\\.init|accessTracker\\.init\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts .opencode/skill/system-spec-kit/mcp_server/core/config.ts .opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: DB State Graph Reinit
// ---------------------------------------------------------------

import { describe, expect, it, vi } from 'vitest';
import { init, reinitializeDatabase } from '../core/db-state';
import type { DatabaseLike } from '../core/db-state';

describe('db-state graph search wiring', () => {
  it('reuses configured graphSearchFn during database reinitialization', async () => {
    const fakeDb = {} as unknown as DatabaseLike;
    const fakeGraphFn = vi.fn();

    const vectorIndex = {
      initializeDb: vi.fn(),
      getDb: vi.fn(() => fakeDb),
      closeDb: vi.fn(),
      vectorSearch: vi.fn(),
    };

 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:8:import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:37:export const DB_UPDATED_FILE: string = SHARED_DB_UPDATED_FILE;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:6:import { DB_UPDATED_FILE } from './config';
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:103:export async function checkDatabaseUpdated(): Promise<boolean> {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:105:    const updateTimeRaw = await fs.readFile(DB_UPDATED_FILE, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:114:      await reinitializeDatabase();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:124:export async function reinitializeDatabase(): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:153:      if (checkpoints) checkpoints.init(database);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:154:      if (accessTracker) accessTracker.init(database);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:155:      if (hybridSearch) hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFnRef);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:230:export function setEmbeddingModelReady(ready: boolean): void {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:235:export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean> {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:270:export function clearConstitutionalCache(): void {
.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:37:    await reinitializeDatabase();
.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:41:    expect(hybridSearch.init).toHaveBeenCalledWith(fakeDb, vectorIndex.vectorSearch, fakeGraphFn);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:24:  setEmbeddingModelReady, waitForEmbeddingModel,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:486:    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:699:  // refresh their DB handles during reinitializeDatabase(), preventing stale refs.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:757:        setEmbeddingModelReady(true);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:764:        setEmbeddingModelReady(false);
exec
/bin/zsh -lc "sed -n '400,470p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1500,1585p' .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,460p' .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
      'memory_drift_why': '[L6:Analysis]',
      'memory_causal_link': '[L6:Analysis]',
      'memory_causal_stats': '[L6:Analysis]',
      'memory_causal_unlink': '[L6:Analysis]',
      'eval_run_ablation': '[L6:Analysis]',
      'eval_reporting_dashboard': '[L6:Analysis]',
      'memory_index_scan': '[L7:Maintenance]',
      'memory_get_learning_history': '[L7:Maintenance]',
      'memory_ingest_start': '[L7:Maintenance]',
      'memory_ingest_status': '[L7:Maintenance]',
      'memory_ingest_cancel': '[L7:Maintenance]',
    }

    // T61: Tool descriptions include layer prefix
    for (const [tool, prefix] of Object.entries(LAYER_PREFIXES)) {
      it(`T61: ${tool} has prefix ${prefix}`, () => {
        const descRegex = new RegExp(`name:\\s*'${tool}'\\s*,\\s*description:\\s*'(\\[L\\d+:\\w+\\])`)
        const match = toolSchemasCode.match(descRegex)
        expect(match).not.toBeNull()
        expect(match![1]).toBe(prefix)
 succeeded in 50ms:
    return {
      content: [{ type: 'text', text: JSON.stringify(errorResponse, null, 2) }],
      isError: true
    };
  }
});

/* ---------------------------------------------------------------
   6. STARTUP SCAN & PENDING FILE RECOVERY
--------------------------------------------------------------- */

let startupScanInProgress = false;

/**
 * T107: Recover pending memory files on MCP startup.
 * CHK-188: Pending files processed by recovery job on next startup.
 *
 * Scans for files with _pending suffix (created when index failed after file write)
 * and attempts to index them.
 */
 succeeded in 52ms:
  it('T192: execute_atomic_save() wraps file + DB op in transaction', () => {
    setup('T192-atomic-wrapper');
    const filePath = path.join(TEST_DIR!, 'memory', 'atomic-test.md');
    const content = '# Atomic Test\n\nTransaction test content.';
    let dbOpCalled = false;

    const result = executeAtomicSave(
      filePath,
      content,
      () => { dbOpCalled = true; }
    );

    expect(result.success).toBe(true);
    expect(result.filePath).toBe(filePath);
    expect(dbOpCalled).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);

    const readContent = fs.readFileSync(filePath, 'utf-8');
    expect(readContent).toBe(content);
  });
exec
/bin/zsh -lc "rg -n \"validateToolArgs\\(|ToolSchemaValidationError|formatZodError\\(|console\\.error\\(\\"'`'"\\[schema-validation\\]\" .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:384:export class ToolSchemaValidationError extends Error {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:391:    this.name = 'ToolSchemaValidationError';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:export function formatZodError(toolName: string, error: ZodError): ToolSchemaValidationError {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:430:  return new ToolSchemaValidationError(
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:export function validateToolArgs(toolName: string, rawInput: Record<string, unknown>): ToolInput {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:449:    throw new ToolSchemaValidationError(toolName, `Unknown tool: "${toolName}". No schema registered.`, {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:461:      const formatted = formatZodError(toolName, error);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:      console.error(`[schema-validation] ${toolName}: ${formatted.message}`);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:17:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:33:    return parseArgs<T>(validateToolArgs(toolName, {}));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:35:  return parseArgs<T>(validateToolArgs(toolName, args));
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:32:    case 'memory_drift_why':     return handleMemoryDriftWhy(parseArgs<DriftWhyArgs>(validateToolArgs('memory_drift_why', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:33:    case 'memory_causal_link':   return handleMemoryCausalLink(parseArgs<CausalLinkArgs>(validateToolArgs('memory_causal_link', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:34:    case 'memory_causal_stats':  return handleMemoryCausalStats(parseArgs<CausalStatsArgs>(validateToolArgs('memory_causal_stats', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:35:    case 'memory_causal_unlink': return handleMemoryCausalUnlink(parseArgs<CausalUnlinkArgs>(validateToolArgs('memory_causal_unlink', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:47:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:48:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:49:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:50:    case 'memory_list':           return handleMemoryList(parseArgs<ListArgs>(validateToolArgs('memory_list', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:51:    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
exec
/bin/zsh -lc 'rg -n "IGraphStore|IDocumentStore|IVectorStore|SQLiteVectorStore|vector-index-store|lib/interfaces" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/index.ts:38:  IVectorStore,
.opencode/skill/system-spec-kit/shared/types.ts:12:// Import normalization types for local use (Memory used in IVectorStore.get)
.opencode/skill/system-spec-kit/shared/types.ts:243:export interface IVectorStore {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:6:import { IVectorStore } from '../lib/interfaces/vector-store';
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:7:// Note: SQLiteVectorStore import deferred to Phase 2 (DB-dependent tests)
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:17: * In-memory mock of IVectorStore for testing interface compliance.
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:19:class MockVectorStore extends IVectorStore {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:241:// Test Suite: IVectorStore Interface (T084)
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:246:  describe('IVectorStore Interface (T084)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:248:    it('IVectorStore base class throws on unimplemented methods', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:249:      const base = new IVectorStore();
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:487:  // Test Suite: SQLiteVectorStore (T086)
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:492:  describe('SQLiteVectorStore (T086) [deferred to Phase 2]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:494:    it('SQLiteVectorStore is exported from vector-index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:495:      // Requires: import { SQLiteVectorStore } from '../lib/search/vector-index';
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:499:    it('SQLiteVectorStore extends IVectorStore', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:503:    it('SQLiteVectorStore implements all IVectorStore methods', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:507:    it('SQLiteVectorStore has extended methods', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:117:        'SQLiteVectorStore',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:146:      expect(typeof mod.SQLiteVectorStore).toBe('function');
exec
/bin/zsh -lc "rg -n \"indexMemoryDeferred|processRetryQueue\\(|embeddingStatus === 'pending'|generateOrCacheEmbedding|index_memory_deferred|retry manager|Deferred indexing\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:69:      : vectorIndex.indexMemoryDeferred({
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:20:export async function generateOrCacheEmbedding(
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:177:      pid = vectorIndex.indexMemoryDeferred({
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:285:        childId = vectorIndex.indexMemoryDeferred({
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:76:- Deferred embedding paths preserve indexability via BM25/FTS and retry manager handoff.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:62:import { generateOrCacheEmbedding } from './save/embedding-pipeline';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:183:  const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:475:  if (indexResult.embeddingStatus === 'pending') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:158:// REQ-031: Deferred indexing - entry searchable via BM25/FTS5 only
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:164:export function index_memory_deferred(params: IndexMemoryDeferredParams): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:226:  logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:545:export { index_memory_deferred as indexMemoryDeferred };
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:142:  if (embeddingStatus === 'pending' && embeddingFailureReason) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:147:  if (asyncEmbedding && embeddingStatus === 'pending') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:248:    if (result.embeddingStatus === 'pending') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:270:  if (result.embeddingStatus === 'pending') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:273:      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:296:    retryManager.processRetryQueue(2).catch((err: unknown) => {
exec
/bin/zsh -lc "rg -n \"index-refresh|getIndexStats\\(|needsRefresh\\(|getUnindexedDocuments\\(|markIndexed\\(|markFailed\\(|ensureIndexFresh\\(\" .opencode/skill/system-spec-kit/mcp_server --glob '"'!**/README.md'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:67:export function getIndexStats(): IndexStats {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:104:export function needsRefresh(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:122:export function getUnindexedDocuments(): UnindexedDocument[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:145:export function markIndexed(id: number, modelName: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:168:export function markFailed(id: number, reason: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:196:export function ensureIndexFresh(): UnindexedDocument[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:199:  if (!needsRefresh()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:204:  return getUnindexedDocuments();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:213:    throw new Error('index-refresh: not initialized — call init(db) first');
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:11:import * as mod from '../lib/storage/index-refresh';
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:20:    dbPath = path.join(os.tmpdir(), `index-refresh-test-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:62:      const stats = mod.getIndexStats();
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:69:      const stats = mod.getIndexStats();
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:80:      const needs = mod.needsRefresh();
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:87:      const docs = mod.getUnindexedDocuments();
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:93:      const docs = mod.getUnindexedDocuments();
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:100:      const docs = mod.getUnindexedDocuments();
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:113:      const result = mod.markIndexed(2, 'test-model-v1');
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:126:      const resultRetry = mod.markFailed(5, 'Embedding API timeout');
.opencode/skill/system-spec-kit/mcp_server/tests/index-refresh.vitest.ts:146:      const needs = mod.needsRefresh();
exec
/bin/zsh -lc "sed -n '470,520p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 54ms:
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[context-server] Pending file recovery error: ${message}`);
    return { found: 0, processed: 0, recovered: 0, failed: 0, results: [] };
  }
}

async function startupScan(basePath: string): Promise<void> {
  if (startupScanInProgress) {
    console.error('[context-server] Startup scan already in progress, skipping');
    return;
  }

  startupScanInProgress = true;
  try {
    console.error('[context-server] Waiting for embedding model to be ready...');
    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);

    if (!modelReady) {
      console.error('[context-server] Startup scan skipped: embedding model not ready');
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  includeMemoryDetails: z.boolean().optional(),
});

const memoryCausalLinkSchema = getSchema({
  sourceId: z.union([positiveInt, z.string().min(1)]),
  targetId: z.union([positiveInt, z.string().min(1)]),
  relation: relationEnum,
  strength: boundedNumber(0, 1).optional(),
  evidence: z.string().optional(),
});

const memoryCausalStatsSchema = getSchema({});

const memoryCausalUnlinkSchema = getSchema({
  edgeId: positiveInt,
});

const evalRunAblationSchema = getSchema({
  channels: z.array(z.enum(['vector', 'bm25', 'fts5', 'graph', 'trigger'])).optional(),
  groundTruthQueryIds: z.array(positiveInt).optional(),
exec
/bin/zsh -lc "rg -n \"atomicSaveMemory\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:407:async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:97:    const result = await handler.atomicSaveMemory(
exec
/bin/zsh -lc "rg -n \"export \\{|atomicSaveMemory|save_memory|handleMemorySave\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
282:async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
407:async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
508:export {
513:  atomicSaveMemory,
559:const atomic_save_memory = atomicSaveMemory;
575:export {
578:  atomic_save_memory,
exec
/bin/zsh -lc "rg -n \"atomic_save_memory|atomicSaveMemory\" .opencode/skill/system-spec-kit/mcp_server --glob '"'!**/memory-save.ts'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:39:  atomicSaveMemory,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:43:  atomic_save_memory,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:19://   atomicSaveMemory, getAtomicityMetrics, indexMemoryFile
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:711:     SUITE: atomicSaveMemory
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:714:  describe('atomicSaveMemory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:715:    const atomicSaveFn = typeof handler.atomicSaveMemory === 'function'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:716:      ? handler.atomicSaveMemory
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:116:    it('T526-10: atomicSaveMemory signature', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:117:      expect(typeof saveHandler.atomicSaveMemory).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:  it('atomicSaveMemory returns post-mutation feedback for successful saves', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:97:    const result = await handler.atomicSaveMemory(
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:24:    it('T518-3: atomicSaveMemory exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:25:      expect(typeof handler.atomicSaveMemory).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:40:        'atomic_save_memory',
exec
/bin/zsh -lc 'rg -n "NOT truly atomic|partial success|atomicSaveMemory|dbCommitted" .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:24:    it('T518-3: atomicSaveMemory exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:25:      expect(typeof handler.atomicSaveMemory).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:116:    it('T526-10: atomicSaveMemory signature', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:117:      expect(typeof saveHandler.atomicSaveMemory).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:  it('atomicSaveMemory returns post-mutation feedback for successful saves', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:97:    const result = await handler.atomicSaveMemory(
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:19://   atomicSaveMemory, getAtomicityMetrics, indexMemoryFile
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:711:     SUITE: atomicSaveMemory
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:714:  describe('atomicSaveMemory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:715:    const atomicSaveFn = typeof handler.atomicSaveMemory === 'function'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:716:      ? handler.atomicSaveMemory
codex
I’ve finished most of the comparisons. The strongest mismatches are around entries claiming true atomic file+DB behavior and entries marked “planned” even though parts are already implemented.
exec
/bin/zsh -lc "rg -n \"setInstructions\\?|buildServerInstructions|getMemoryStats\\(|handleMemoryStats\\(|SPECKIT_DYNAMIC_INIT\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"DB_UPDATED_FILE|writeFile\\(DB_UPDATED_FILE|writeFileSync\\(DB_UPDATED_FILE|touch.*DB_UPDATED_FILE|lastDbCheck\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"not truly atomic|NOT truly atomic|P4-01/P4-17 NOTE|executeAtomicSave\\(|dbCommitted|recoverPendingFile\\(|findPendingFiles\\(|recoverAllPendingFiles\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"query-classifier|getRecommendedLayers\\(|getLayerInfo\\(|tokenBudget|LAYER_DEFINITIONS|tool descriptions include layer prefix\" .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
182:async function getMemoryStats(): Promise<DynamicMemoryStats> {
184:    const response = await handleMemoryStats({
220:async function buildServerInstructions(): Promise<string> {
221:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
225:  const stats = await getMemoryStats();
256:const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
989:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
991:      const dynamicInstructions = await buildServerInstructions();
993:        serverWithInstructions.setInstructions?.(dynamicInstructions);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:191:| NEW-112 | Cross-process DB hot rebinding | Confirm marker-file triggers DB reinitialization | `Validate cross-process DB hot rebinding via marker file.` | 1) start MCP server 2) create a test memory via MCP: `memory_save(filePath)` and note its title 3) from a separate terminal, run `node cli.js bulk-delete --tier scratch --folder specs/test-sandbox` (non-dry-run — this mutates the DB and writes the `DB_UPDATED_FILE` marker) 4) immediately call `memory_stats()` via MCP → verify server detects marker and reinitializes DB 5) verify no stale data from pre-rebind state 6) run `memory_health()` → verify healthy status post-rebind | Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind | memory_stats output post-rebind + memory_health output + marker file detection evidence | PASS if server detects marker file, reinitializes DB, returns current (non-stale) data, and health is healthy | Inspect DB_UPDATED_FILE marker path and detection logic; verify DB reinitialization clears caches; check for stale connection handles |
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:6:import { DB_UPDATED_FILE } from './config';
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:64:let lastDbCheck: number = 0;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:105:    const updateTimeRaw = await fs.readFile(DB_UPDATED_FILE, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:111:    if (updateTime > lastDbCheck) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:113:      lastDbCheck = updateTime;
.opencode/skill/system-spec-kit/shared/config.ts:41:export const DB_UPDATED_FILE: string = (() => {
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:8:import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:37:export const DB_UPDATED_FILE: string = SHARED_DB_UPDATED_FILE;
.opencode/skill/system-spec-kit/mcp_server/core/index.ts:16:  DB_UPDATED_FILE,
.opencode/skill/system-spec-kit/shared/index.ts:160:export { getDbDir, DB_UPDATED_FILE } from './config';
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:14:import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:21:    const dbDir = path.dirname(DB_UPDATED_FILE);
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:23:    fsSync.writeFileSync(DB_UPDATED_FILE, Date.now().toString());
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:5:Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On next `checkDatabaseUpdated()` call, if timestamp > lastDbCheck, triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Concurrency-safe via mutex with race-condition fix (P4-13). Also manages embedding model readiness (polling with timeout) and constitutional cache lifecycle.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:14:| `mcp_server/core/config.ts` | Core | Server configuration including DB_UPDATED_FILE |
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      const hasDbMarker = source.includes('DB_UPDATED_FILE') || source.includes('.db-updated');
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1810:Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On the next `checkDatabaseUpdated()` call, if the timestamp exceeds `lastDbCheck`, the system triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex).
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:34:    DB_UPDATED_FILE:          path.join(dbDir, '.db-updated'),
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:448:    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:35:  dbCommitted?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:169:function executeAtomicSave(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:187:    // cannot be rolled back. The dbCommitted flag tracks this state so the error path
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:190:    let dbCommitted = false;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:195:      dbCommitted = true;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:208:    // The `dbCommitted` flag on the returned error result enables callers to detect
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:210:    // Mitigation: `recoverAllPendingFiles()` can be called on startup to find
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:216:      // Leave pending file for startup recovery and report failure with dbCommitted flag.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:220:      return { success: false, filePath, error: `Rename failed after DB commit: ${msg}`, dbCommitted };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:268:function findPendingFiles(dirPath: string): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:291:function recoverPendingFile(pendingPath: string): RecoveryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:322:function recoverAllPendingFiles(dirPath: string): RecoveryResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:323:  const pendingFiles = findPendingFiles(dirPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:394: * **NOT truly atomic.** The file write uses atomic rename (write-to-temp +
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:404: * P4-01/P4-17 NOTE: True atomicity between file write and DB indexing is not
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:412:  const result = transactionManager.executeAtomicSave(
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:825:      expect(parsed.meta.tokenBudget).toBe(1000)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:829:    it('T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:863:      expect(finalText).toContain('"tokenBudget": 1000')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1021:    // T26: Source injects tokenBudget into response metadata
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:20:  // 4.1 LAYER_DEFINITIONS CONSTANT
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:22:  describe('LAYER_DEFINITIONS Constant', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:24:    const LD = mod.LAYER_DEFINITIONS;
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:35:      const requiredFields = ['id', 'name', 'description', 'tokenBudget', 'priority', 'useCase', 'tools'];
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:65:        const budget = layer.tokenBudget;
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:84:        expect(LD[layerId]?.tokenBudget).toBe(expected);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:94:    const LD = mod.LAYER_DEFINITIONS;
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:102:    it('T10: All tools from LAYER_DEFINITIONS are mapped', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:236:  // 4.6 getLayerInfo()
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:238:  describe('getLayerInfo()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:241:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:245:      expect(info.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:253:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:258:      expect(mod.getLayerInfo('nonexistent_tool')).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:262:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
codex
---
FEATURE: 13-strict-zod-schema-validation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts, mcp_server/tools/context-tools.ts, mcp_server/tools/memory-tools.ts, mcp_server/tools/checkpoint-tools.ts, mcp_server/tools/causal-tools.ts, mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The description matches the code: 28 tool schemas exist, strictness is gated by `SPECKIT_STRICT_SCHEMAS`, and rejected params are formatted and logged to stderr. The catalog omits the re-export and the dispatcher call sites that actually enforce runtime validation.
---
FEATURE: 14-dynamic-server-instructions-at-mcp-initialization.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `context-server.ts` builds startup instructions from `handleMemoryStats()`, includes totals/spec-folder counts/channel info/stale counts, and gates the behavior with `SPECKIT_DYNAMIC_INIT`. The source-file list is massively overbroad and includes one nonexistent test file.
---
FEATURE: 15-warm-server-daemon-mode.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The code still uses `StdioServerTransport` and starts on stdio; I found no HTTP/daemon transport implementation. The Source Files section is empty, so it omits the file that proves the current state.
---
FEATURE: 16-backend-storage-adapter-abstraction.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/vector-index-store.ts, mcp_server/lib/search/vector-index.ts, mcp_server/tests/interfaces.vitest.ts, mcp_server/tests/vector-index-impl.vitest.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: `IVectorStore` already exists, `SQLiteVectorStore` already extends it, and there are interface/implementation tests. Only `IGraphStore` and `IDocumentStore` appear absent, so the “planned/deferred” description does not match the actual codebase.
---
FEATURE: 17-cross-process-db-hot-rebinding.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `db-state.ts` matches the description: it watches `DB_UPDATED_FILE`, reinitializes via mutex, refreshes dependent modules, and also owns embedding-readiness and constitutional-cache state. `context-server.ts` is also important because it wires the module and uses the readiness flow.
---
FEATURE: 18-atomic-write-then-index-api.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/types.ts, mcp_server/handlers/save/create-record.ts, mcp_server/handlers/save/embedding-pipeline.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The code explicitly says `atomicSaveMemory` is not truly atomic. `executeAtomicSave()` writes the file with a no-op DB callback, then indexing happens afterward asynchronously; there is no coupled file+DB transaction, and the public handler `AtomicSaveResult` does not expose `dbCommitted`.
---
FEATURE: 19-embedding-retry-orchestrator.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/handlers/save/embedding-pipeline.ts, mcp_server/handlers/save/create-record.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The retry manager does run a background retry job, uses the embedding cache, tracks pending/retry/failed stats, increments `retry_count`, and writes recovered embeddings into `vec_memories`. But `index-refresh.ts` is not actually wired into the retry flow, and the catalog omits the real save/deferred-indexing paths that mark memories pending in the first place.
---
FEATURE: 20-7-layer-tool-architecture-metadata.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `layer-definitions.ts` does define 7 layers with budgets, priorities, use cases, tools, and task-type recommendations, and `memory-context.ts` uses that metadata for token-budget behavior and layer hints. I did not find `query-classifier` routing requests by layer, while `tool-schemas.ts` is also a key place where this metadata is surfaced in tool descriptions.
---
FEATURE: 21-atomic-pending-file-recovery.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Pending-file recovery exists, but `recoverPendingFile()` does not check the database at all; it just renames the pending file unless a newer original already exists. Startup recovery is invoked from `context-server.ts`, then the later startup scan re-indexes files.
tokens used
139,679
---
FEATURE: 13-strict-zod-schema-validation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts, mcp_server/tools/context-tools.ts, mcp_server/tools/memory-tools.ts, mcp_server/tools/checkpoint-tools.ts, mcp_server/tools/causal-tools.ts, mcp_server/tools/lifecycle-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The description matches the code: 28 tool schemas exist, strictness is gated by `SPECKIT_STRICT_SCHEMAS`, and rejected params are formatted and logged to stderr. The catalog omits the re-export and the dispatcher call sites that actually enforce runtime validation.
---
FEATURE: 14-dynamic-server-instructions-at-mcp-initialization.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `context-server.ts` builds startup instructions from `handleMemoryStats()`, includes totals/spec-folder counts/channel info/stale counts, and gates the behavior with `SPECKIT_DYNAMIC_INIT`. The source-file list is massively overbroad and includes one nonexistent test file.
---
FEATURE: 15-warm-server-daemon-mode.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The code still uses `StdioServerTransport` and starts on stdio; I found no HTTP/daemon transport implementation. The Source Files section is empty, so it omits the file that proves the current state.
---
FEATURE: 16-backend-storage-adapter-abstraction.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/vector-index-store.ts, mcp_server/lib/search/vector-index.ts, mcp_server/tests/interfaces.vitest.ts, mcp_server/tests/vector-index-impl.vitest.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: `IVectorStore` already exists, `SQLiteVectorStore` already extends it, and there are interface/implementation tests. Only `IGraphStore` and `IDocumentStore` appear absent, so the “planned/deferred” description does not match the actual codebase.
---
FEATURE: 17-cross-process-db-hot-rebinding.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `db-state.ts` matches the description: it watches `DB_UPDATED_FILE`, reinitializes via mutex, refreshes dependent modules, and also owns embedding-readiness and constitutional-cache state. `context-server.ts` is also important because it wires the module and uses the readiness flow.
---
FEATURE: 18-atomic-write-then-index-api.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/types.ts, mcp_server/handlers/save/create-record.ts, mcp_server/handlers/save/embedding-pipeline.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The code explicitly says `atomicSaveMemory` is not truly atomic. `executeAtomicSave()` writes the file with a no-op DB callback, then indexing happens afterward asynchronously; there is no coupled file+DB transaction, and the public handler `AtomicSaveResult` does not expose `dbCommitted`.
---
FEATURE: 19-embedding-retry-orchestrator.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/handlers/save/embedding-pipeline.ts, mcp_server/handlers/save/create-record.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The retry manager does run a background retry job, uses the embedding cache, tracks pending/retry/failed stats, increments `retry_count`, and writes recovered embeddings into `vec_memories`. But `index-refresh.ts` is not actually wired into the retry flow, and the catalog omits the real save/deferred-indexing paths that mark memories pending in the first place.
---
FEATURE: 20-7-layer-tool-architecture-metadata.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `layer-definitions.ts` does define 7 layers with budgets, priorities, use cases, tools, and task-type recommendations, and `memory-context.ts` uses that metadata for token-budget behavior and layer hints. I did not find `query-classifier` routing requests by layer, while `tool-schemas.ts` is also a key place where this metadata is surfaced in tool descriptions.
---
FEATURE: 21-atomic-pending-file-recovery.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Pending-file recovery exists, but `recoverPendingFile()` does not check the database at all; it just renames the pending file unless a newer original already exists. Startup recovery is invoked from `context-server.ts`, then the later startup scan re-indexes files.
