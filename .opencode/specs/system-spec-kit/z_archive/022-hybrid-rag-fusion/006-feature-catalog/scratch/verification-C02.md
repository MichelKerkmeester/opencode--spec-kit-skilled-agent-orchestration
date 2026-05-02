OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce97-ca1f-7a33-884c-7d6428a7a81d
--------
user
You are a feature catalog verification agent. Read each feature snippet file in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/ (10 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying the 10 mutation feature catalog snippets against the actual `system-spec-kit` MCP server code, and I’ll start by locating the feature files plus any scoped instructions that apply before I read each snippet and trace its source files.
exec
/bin/zsh -lc pwd in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
exec
/bin/zsh -lc 'find .. -name AGENTS.md -print' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "python3 .opencode/skill/scripts/skill_advisor.py \"You are a feature catalog verification agent. Read each feature snippet file in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/ (10 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing.\" --threshold 0.8" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 601ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, file"
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
 succeeded in 860ms:
../Barter/coder/AGENTS.md
../Public/.opencode/specs/system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
../Public/.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
../Public/.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
../Public/AGENTS.md
codex
I’ve confirmed the task routes most strongly to the `system-spec-kit` skill, so I’m loading just enough of that guidance and then I’ll enumerate the 10 mutation snippets before tracing each one into the MCP server code.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/feature_catalog/02--mutation -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/mcp_server -maxdepth 3 -type f | sort | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md
 succeeded in 51ms:
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
.opencode/skill/system-spec-kit/mcp_server/core/README.md
.opencode/skill/system-spec-kit/mcp_server/core/config.ts
codex
The catalog files are in place. Next I’m pulling the relevant sections from all 10 snippets and the live handler source tree so I can compare each “Current Reality” claim against the actual implementation instead of just checking filenames.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/hooks .opencode/skill/system-spec-kit/mcp_server/core .opencode/skill/system-spec-kit/mcp_server/api | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Memory metadata update (memory_update)

## Current Reality

You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a memory from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 50ms:
# Memory indexing (memory_save)

## Current Reality

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

 succeeded in 51ms:
# Single and folder delete (memory_delete)

## Current Reality

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/api/README.md
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/core/README.md
.opencode/skill/system-spec-kit/mcp_server/core/config.ts
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
.opencode/skill/system-spec-kit/mcp_server/core/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
codex
I’ve got the first three snippets, and there’s already a pattern: the catalog entries are listing a much broader source surface than the live tree exposes. I’m pulling the remaining seven now and then I’ll cross-check the concrete handler logic for each feature.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Tier-based bulk deletion (memory_bulk_delete)

## Current Reality

For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.

Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.

Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion.

The `olderThanDays` parameter is validated as a positive integer (>= 1) before query construction. Values that are zero, negative, non-integer, or NaN return a validation error rather than silently removing the age filter. The `tool-schemas.ts` definition enforces `minimum: 1` at the schema level.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 51ms:
# Namespace management CRUD tools

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Namespace CRUD (`list/create/switch/delete`) remains deferred pending demonstrated multi-tenant demand. Current scoping relies on logical `specFolder` filtering. Estimated effort: S-M (3-5 days).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/index.ts` | Formatter | Module barrel export |
| `mcp_server/formatters/search-results.ts` | Formatter | Search result formatting |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/causal-graph.ts` | Handler | Causal graph handler |
 succeeded in 51ms:
# Validation feedback (memory_validate)

## Current Reality

Every search result is either helpful or not. This tool lets you record that judgment and triggers several downstream systems based on the feedback.

Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts at 0.5. The asymmetry between positive (+0.1) and negative (-0.05) increments is intentional. It takes one good validation to raise confidence by 0.1 but two bad validations to cancel that out. This bias toward preservation reflects the assumption that a memory might be unhelpful for one query but still valuable for another.

Auto-promotion fires unconditionally on every positive validation. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window. Constitutional, critical, temporary and deprecated tiers are non-promotable. The response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, and the reason.

Negative feedback persistence fires unconditionally on every negative validation. A `recordNegativeFeedbackEvent()` call stores the event in the `negative_feedback_events` table. The search handler reads these events and applies a confidence multiplier that starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3. Time-based recovery with a 30-day half-life gradually restores the multiplier. Demotion scoring runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

When a `queryId` is provided alongside positive feedback, two additional systems activate. Learned feedback persistence records the user's selection and extracts query terms into a separate `learned_triggers` column (isolated from the FTS5 index to prevent contamination). These learned triggers boost future searches for the same terms. Ground truth selection logging records the event in the evaluation database for the ground truth corpus, returning a `groundTruthSelectionId` in the response.

The read-compute-write cycle runs within a single SQLite transaction to prevent concurrent validation events from racing and dropping updates.

---

## Source Files

 succeeded in 51ms:
# Transaction wrappers on mutation handlers

## Current Reality

`memory-crud-update.ts` gained a `database.transaction(() => {...})()` wrapper around its mutation steps (vectorIndex.updateMemory, BM25 re-index, mutation ledger). `memory-crud-delete.ts` gained the same for its single-delete path (memory delete, vector delete, causal edge delete, mutation ledger). Cache invalidation operations remain outside the transaction as in-memory-only operations. Both include null-database fallbacks.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
 succeeded in 51ms:
# Correction tracking with undo

## Current Reality

The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.

Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/learning/corrections.ts` | Lib | Correction tracking and stability adjustment |

### Tests

| File | Focus |
|------|-------|
 succeeded in 50ms:
# Prediction-error save arbitration

## Current Reality

5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating entry point |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |

### Tests

| File | Focus |
 succeeded in 51ms:
# Per-memory history log

## Current Reality

The `memory_history` table records a per-memory audit trail of state changes. Each row captures the memory ID, the type of event (created, updated, merged, archived, restored), a timestamp, and optional metadata about the change. This provides a complete lifecycle history for any individual memory, enabling operations like "show me everything that happened to memory #42."

The history log is populated by the save handler on creation, the update handler on modification, the session-learning handler on learning events, and the archival manager on tier transitions. The vector index schema module creates the `memory_history` table during database initialization. The cleanup-orphaned-vectors script uses the history table to find and remove orphaned entries when their parent memory no longer exists.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Schema creation for memory_history table |
| `mcp_server/handlers/session-learning.ts` | Handler | Session learning history events |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge history tracking |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Index mutations writing history |
| `scripts/memory/cleanup-orphaned-vectors.ts` | Script | Orphaned history cleanup |

codex
I’ve got all 10 snippets now. The next pass is focused on the live TypeScript: handler registrations, feature-specific symbols, and any schema/table names mentioned in the prose, so I can separate “accurate but over-documented” from “describes code that isn’t there.”
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"memory_save|memory_update|memory_delete|memory_bulk_delete|memory_validate|namespace|memory_history|memory_conflicts|negative_feedback_events|allowPartialUpdate|asyncEmbedding|olderThanDays|queryId|autoPromotion|recordNegativeFeedbackEvent|SPECKIT_NEGATIVE_FEEDBACK|SPECKIT_RELATIONS|force: true|force\\b\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
// ---------------------------------------------------------------
// MODULE: Memory CRUD Update Handler
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Bulk Delete
// ---------------------------------------------------------------
// Tier-based bulk deletion of memories with safety gates.
// Eliminates the need for direct DB scripts when cleaning up
// deprecated/temporary memories at scale.
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Session Learning
// ---------------------------------------------------------------

import * as vectorIndex from '../lib/search/vector-index';
import { checkDatabaseUpdated } from '../core';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { toErrorMessage } from '../utils';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse, DatabaseExtended as Database } from './types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface PreflightArgs {
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

 succeeded in 52ms:
Total output lines: 1096

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:238:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:338:    // T205: Enforce per-layer token budgets with actual truncation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:550:/** Maximum time (ms) to wait for async cleanup before force-exiting. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:948:          await indexMemoryFile(filePath, { asyncEmbedding: true });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:967:              await indexMemoryFile(filePath, { asyncEmbedding: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:64:  - `memory-save` preserves `document_type` and `spec_level` across create/update/reinforce flows. Integrates with embedding cache for deduplication of unchanged content.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:117:  force?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:130:async function indexSingleFile(filePath: string, force: boolean = false): Promise<IndexResult> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:131:  return indexMemoryFile(filePath, { force });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:142:    force = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:243:    if (incremental && !force) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:295:      enabled: incremental && !force,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:311:  if (incremental && !force) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:351:      return await indexSingleFile(filePath, force);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:529:    hints.push('All files already up-to-date. Use force: true to re-index');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:76:  force?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:123:  { force = false, applyPostInsertMetadata }: ChunkingOptions = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:159:    if (existing && !force) {
codex
I’ve confirmed the handlers are real and active. Now I’m drilling into the disputed details: `memory_validate` actually lives in `checkpoints.ts`, and I’m checking schema/tool registration plus the PE/history claims that mention tables and modules that may not exist in this tree.
exec
/bin/zsh -lc "sed -n '280,480p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '120,240p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Pe Orchestration
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
import type { ParsedMemory } from '../../lib/parsing/memory-parser';
import { getMemoryHashSnapshot, appendMutationLedgerSafe } from '../memory-crud-utils';
import {
  findSimilarMemories,
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,
} from '../pe-gating';
import type { PeDecision, SimilarMemory, IndexResult } from './types';

export interface PeOrchestrationResult {
  decision: PeDecision;
 succeeded in 52ms:
    throw new Error('name is required and must be a string');
  }
  if (!confirmName || typeof confirmName !== 'string') {
    throw new Error('confirmName is required and must be a string');
  }
  if (confirmName !== name) {
    throw new Error('confirmName must exactly match name to delete checkpoint');
  }

  const success: boolean = checkpoints.deleteCheckpoint(name);

  const summary = success
    ? `Checkpoint "${name}" deleted successfully`
    : `Checkpoint "${name}" not found`;

  return createMCPSuccessResponse({
    tool: 'checkpoint_delete',
    summary,
    data: {
      success,
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Prediction Error Gating Helpers
// ---------------------------------------------------------------

import * as vectorIndex from '../lib/search/vector-index';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../lib/storage/incremental-index';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../lib/search/search-flags';
import { requireDb, toErrorMessage } from '../utils';
import { detectSpecLevelFromParsed } from './handler-utils';

interface ParsedMemory {
  specFolder: string;
  filePath: string;
  title: string | null;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
 succeeded in 50ms:
  if (!hasQuery && !hasConcepts) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Either "query" (string) or "concepts" (array with 2-5 items) is required.',
      path: ['query'],
    });
  }
});

const memoryMatchTriggersSchema = getSchema({
  prompt: z.string().min(1),
  limit: positiveIntMax(100).optional(),
  session_id: z.string().optional(),
  turnNumber: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  include_cognitive: z.boolean().optional(),
});

const memorySaveSchema = getSchema({
  filePath: pathString(1),
  force: z.boolean().optional(),
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Vector Index Schema
// ---------------------------------------------------------------
// Split from vector-index-store.ts — contains ALL schema creation,
// migration, and companion-table logic.

import Database from 'better-sqlite3';
import * as fs from 'fs';
import { getCanonicalPathKey } from '../utils/canonical-path';
import { createLogger } from '../utils/logger';
import { initEmbeddingCache } from '../cache/embedding-cache';
import {
  get_error_message,
} from './vector-index-types';

const logger = createLogger('VectorIndex');

// Schema version for migration tracking
// v5: Added memory_type column for type-specific half-lives (REQ-002)
// v6: Added file_mtime_ms for incremental indexing fast-path (REQ-023, T064-T066)
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Tools
// ---------------------------------------------------------------
// Dispatch for L2-L4 memory tools: search, triggers, save,
// list, stats, health, delete, update, validate (T303).
// ---------------------------------------------------------------

import {
  handleMemorySearch,
  handleMemoryMatchTriggers,
  handleMemorySave,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryValidate,
  handleMemoryBulkDelete,
} from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';
codex
The schema/tooling side is giving clearer signals: some features are definitely implemented, but several descriptions are ahead of or sideways from the code. I’m checking the remaining pieces now, especially `memory_validate`’s internals, schema tables, and whether the “history” and “corrections” modules exist at all.
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,460p' .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '460,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"memory_history|CREATE TABLE IF NOT EXISTS memory_history|memory_corrections|negative_feedback_events|recordNegativeFeedbackEvent|confidenceTracker|executeAutoPromotion|recordSelection\\(|recordUserSelection\\(|SPECKIT_NEGATIVE_FEEDBACK|SPECKIT_RELATIONS|corrections\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
 succeeded in 51ms:
        content_text = ?,
        quality_score = ?,
        quality_flags = ?
    WHERE id = ?
  `).run(
    parsed.contentHash,
    parsed.contextType,
    parsed.importanceTier,
    importanceWeight,
    fileMtimeMs,
    parsed.documentType || 'memory',
    specLevel,
    parsed.content,
    parsed.qualityScore ?? 0,
    JSON.stringify(parsed.qualityFlags ?? []),
    memoryId
  );

  if ((updateResult as { changes: number }).changes === 0) {
    return {
 succeeded in 51ms:
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v15 warning (quality_score):', get_error_message(e));
        }
      }

      try {
        database.exec('ALTER TABLE memory_index ADD COLUMN quality_flags TEXT');
        logger.info('Migration v15: Added quality_flags column');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('duplicate column')) {
          console.warn('[VectorIndex] Migration v15 warning (quality_flags):', get_error_message(e));
        }
      }

      try {
        database.exec('CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score)');
        logger.info('Migration v15: Created quality score index');
      } catch (e: unknown) {
        console.warn('[VectorIndex] Migration v15 warning (idx_quality_score):', get_error_message(e));
      }
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:13:import * as confidenceTracker from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:14:import { executeAutoPromotion } from '../lib/search/auto-promotion';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:17:import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:342:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:354:    const promotionResult = executeAutoPromotion(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:366:    recordNegativeFeedbackEvent(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:379:    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:393:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:239:  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/README.md:731:| `SPECKIT_RELATIONS`          | `true`  | Enable causal memory graph                                                            |
.opencode/skill/system-spec-kit/mcp_server/README.md:790:| `SPECKIT_NEGATIVE_FEEDBACK`    | `true`  | `wasUseful=false` applies score demotion with 30-day recovery (A4) |
.opencode/skill/system-spec-kit/mcp_server/README.md:803:| `memory_history`     | Access and modification history                                    |
.opencode/skill/system-spec-kit/mcp_server/README.md:808:| `memory_corrections` | Learning from corrections                                          |
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:37:    // Create memory_history table
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:39:      CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts:7:// Re-export all corrections exports at top level
.opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts:8:export * from './corrections';
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:72:      FROM negative_feedback_events
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:218:export function executeAutoPromotion(db: Database, memoryId: number): AutoPromotionResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:265:    console.error(`[auto-promotion] executeAutoPromotion failed for memory ${memoryId}: ${msg}`);
codex
I’ve verified that the “corrections” module and `memory_history` storage do exist, but some snippets are still mixing accurate concepts with the wrong integration points. I’m grabbing the schema and mutation internals that determine whether those features are actually wired into the live handlers.
exec
/bin/zsh -lc "sed -n '1030,1155p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '320,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    const sqlite_vec = get_sqlite_vec_available();
    if (embedding && sqlite_vec) {
      const expected_dim = get_embedding_dim();
      if (embedding.length !== expected_dim) {
        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
        throw new Error(`Embedding must be ${expected_dim} dimensions, got ${embedding.length}`);
      }

      const embedding_buffer = to_embedding_buffer(embedding);
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(BigInt(id), embedding_buffer);
    }

    if (existingRow?.spec_folder) {
      refresh_interference_scores_for_folder(database, existingRow.spec_folder);
    }

    return id;
 succeeded in 52ms:
    database.exec('CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path)');
  } catch (_err: unknown) {
    // Index may already exist or canonical column may be unavailable in legacy DB.
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
    logger.info('Created idx_content_hash index');
  } catch (_err: unknown) {
    // Index may already exist
  }

  try {
    database.exec(`CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC)`);
    logger.info('Created idx_last_accessed index');
  } catch (_err: unknown) {
    // Index may already exist
  }

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: History
// ---------------------------------------------------------------
// Tracks change history for memory entries (ADD, UPDATE, DELETE)
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. INTERFACES
----------------------------------------------------------------*/

/**
 * Describes the HistoryEntry shape.
 */
export interface HistoryEntry {
  id: string;
  memory_id: number;
  prev_value: string | null;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Corrections
// ---------------------------------------------------------------
// LEARNING: CORRECTIONS TRACKING
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   TYPE DEFINITIONS
---------------------------------------------------------------- */

/**
 * Describes the CorrectionTypes shape.
 */
export interface CorrectionTypes {
  readonly SUPERSEDED: 'superseded';
  readonly DEPRECATED: 'deprecated';
  readonly REFINED: 'refined';
  readonly MERGED: 'merged';
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Confidence Tracker
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

export type { Database };

export interface ValidationResult {
  confidence: number;
  validationCount: number;
  positiveValidationCount: number;
  promotionEligible: boolean;
  wasPromoted: boolean;
}

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Auto Promotion
// ---------------------------------------------------------------
//
// Promotes memory importance tier based on positive validation count:
// - >=5 positive validations: normal -> important
// - >=10 positive validations: important -> critical
// - Below threshold: no change (no-op)
//
// Does NOT demote -- only promotes upward.
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

export type { Database };

codex
I’m switching from manual spot checks to a repo-wide path audit now so the final report can cleanly separate “description mismatch” from “file list is stale.” After that I’ll synthesize the missing source files for each feature based on the actual handler/import graph.
exec
/bin/zsh -lc "find . -maxdepth 3 -type d \\( -name shared -o -name scripts \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | sort | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
./.agents/scripts
./.opencode/skill/scripts
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/README.md
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fallback.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/api-key-validation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path');const base='/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit';const dir=path.join(base,'feature_catalog/02--mutation');for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){const text=fs.readFileSync(path.join(dir,file),'utf8');const unique=[...new Set([...text.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>p.includes('"'/')&&"'!/[{}]/.test(p)&&!/''^now$|''^true$|''^false$/.test(p)))];const invalid=unique.filter(p=>!fs.existsSync(path.join(base,p))&&!fs.existsSync(path.join('"'/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public',p)));console.log(file+'\\t'+(invalid.length?invalid.join(' | '):'NONE'));}\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const base=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\";const dir=path.join(base,\"feature_catalog/02--mutation\");for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){const text=fs.readFileSync(path.join(dir,file),\"utf8\");const unique=[...new Set([...text.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>p.includes("/")&&!/[{}]/.test(p)&&!/''^now$|''^true$|''^false$/.test(p)))];const invalid=unique.filter(p=>!fs.existsSync(path.join(base,p))&&!fs.existsSync(path.join("/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public",p)));console.log(file+"'"\\t\"+(invalid.length?invalid.join(\" | \"):\"NONE\"));}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
01-memory-indexing-memorysave.md	mcp_server/tests/retry.vitest.ts
02-memory-metadata-update-memoryupdate.md	mcp_server/tests/retry.vitest.ts
03-single-and-folder-delete-memorydelete.md	mcp_server/tests/retry.vitest.ts
04-tier-based-bulk-deletion-memorybulkdelete.md	mcp_server/tests/retry.vitest.ts
05-validation-feedback-memoryvalidate.md	mcp_server/tests/retry.vitest.ts
06-transaction-wrappers-on-mutation-handlers.md	mcp_server/tests/retry.vitest.ts
07-namespace-management-crud-tools.md	list/create/switch/delete | mcp_server/tests/retry.vitest.ts
08-prediction-error-save-arbitration.md	NONE
09-correction-tracking-with-undo.md	lib/learning/corrections.ts
10-per-memory-history-log.md	NONE
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const base=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\";const dir=path.join(base,\"feature_catalog/02--mutation\");for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){const text=fs.readFileSync(path.join(dir,file),\"utf8\");const s=text.indexOf(\"## Source Files\");const e=text.indexOf(\"## Source Metadata\");const section=text.slice(s,e>0?e:text.length);const unique=[...new Set([...section.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>p.includes("/")&&!/[{}]/.test(p)&&!p.includes("/")===false))];const invalid=unique.filter(p=>!fs.existsSync(path.join(base,p))&&!fs.existsSync(path.join("/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public",p)));console.log(file+"'"\\t\"+(invalid.length?invalid.join(\" | \"):\"NONE\"));}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
01-memory-indexing-memorysave.md	mcp_server/tests/retry.vitest.ts
02-memory-metadata-update-memoryupdate.md	mcp_server/tests/retry.vitest.ts
03-single-and-folder-delete-memorydelete.md	mcp_server/tests/retry.vitest.ts
04-tier-based-bulk-deletion-memorybulkdelete.md	mcp_server/tests/retry.vitest.ts
05-validation-feedback-memoryvalidate.md	mcp_server/tests/retry.vitest.ts
06-transaction-wrappers-on-mutation-handlers.md	mcp_server/tests/retry.vitest.ts
07-namespace-management-crud-tools.md	mcp_server/tests/retry.vitest.ts
08-prediction-error-save-arbitration.md	NONE
09-correction-tracking-with-undo.md	NONE
10-per-memory-history-log.md	NONE
exec
/bin/zsh -lc 'rg --files shared | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server -maxdepth 2 -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
rg: shared: IO error for operation on shared: No such file or directory (os error 2)
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server
.opencode/skill/system-spec-kit/mcp_server/.github
.opencode/skill/system-spec-kit/mcp_server/.github/hooks
.opencode/skill/system-spec-kit/mcp_server/api
.opencode/skill/system-spec-kit/mcp_server/configs
.opencode/skill/system-spec-kit/mcp_server/core
.opencode/skill/system-spec-kit/mcp_server/database
.opencode/skill/system-spec-kit/mcp_server/dist
.opencode/skill/system-spec-kit/mcp_server/dist/api
.opencode/skill/system-spec-kit/mcp_server/dist/configs
.opencode/skill/system-spec-kit/mcp_server/dist/core
.opencode/skill/system-spec-kit/mcp_server/dist/database
.opencode/skill/system-spec-kit/mcp_server/dist/formatters
.opencode/skill/system-spec-kit/mcp_server/dist/handlers
.opencode/skill/system-spec-kit/mcp_server/dist/hooks
.opencode/skill/system-spec-kit/mcp_server/dist/lib
.opencode/skill/system-spec-kit/mcp_server/dist/schemas
.opencode/skill/system-spec-kit/mcp_server/dist/scripts
.opencode/skill/system-spec-kit/mcp_server/dist/tests
.opencode/skill/system-spec-kit/mcp_server/dist/tools
exec
/bin/zsh -lc 'rg -n "shared/chunking.ts|shared/config.ts|shared/embeddings.ts" .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'ls -ld .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/shared/chunking.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
drwxr-xr-x@ 22 michelkerkmeester  staff   704 Mar  8 14:47 .opencode/skill/system-spec-kit/shared
-rw-r--r--@  1 michelkerkmeester  staff  3785 Mar  8 17:21 .opencode/skill/system-spec-kit/shared/chunking.ts
 succeeded in 52ms:
121:| `shared/chunking.ts` | Shared | Content chunking |
122:| `shared/config.ts` | Shared | Shared configuration |
123:| `shared/embeddings.ts` | Shared | Embedding utilities |
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/prediction-error-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Prediction Error Gate
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const THRESHOLD = {
  DUPLICATE: 0.95,
  HIGH_MATCH: 0.85,
  MEDIUM_MATCH: 0.70,
  LOW_MATCH: 0.50,
} as const;

const ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Chunking Orchestrator
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../lib/storage/incremental-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../lib/search/search-flags';
import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
import { needsChunking, chunkLargeFile } from '../lib/chunking/anchor-chunker';
import { thinChunks } from '../lib/chunking/chunk-thinning';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';
 succeeded in 52ms:
---
title: "Handlers"
description: "MCP tool handlers for context, search, CRUD, indexing, checkpoints, learning, and causal graph operations."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
  - "request handlers"
---


# Handlers

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. TELEMETRY NOTES](#4--telemetry-notes)
- [5. RELATED](#5--related)
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: N3-lite Consolidation Engine
// ---------------------------------------------------------------
// Lightweight graph maintenance: contradiction scan, Hebbian
// strengthening, staleness detection, edge bounds enforcement.
// Sprint 6a — behind SPECKIT_CONSOLIDATION flag.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isConsolidationEnabled } from '../search/search-flags';
import {
  updateEdge,
  getStaleEdges,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
  STALENESS_THRESHOLD_DAYS,
  DECAY_STRENGTH_AMOUNT,
  DECAY_PERIOD_DAYS,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Content Normalizer
// ---------------------------------------------------------------
// Sprint 7 / S1 — Smarter Memory Content Generation
// ---------------------------------------------------------------
//
// Purpose: Normalize raw markdown content before it is passed to
//   embedding generation or BM25 indexing.  Raw markdown contains
//   structural noise (YAML frontmatter, HTML comment anchors, pipe
//   table syntax, fence markers, checkbox notation) that degrades
//   the quality of semantic embeddings and keyword retrieval.
//
// Integration points (do NOT modify those files here — reference only):
//   - memory-parser.ts  ~line 159  : `content` is assigned from readFileWithEncoding()
//       → wrap with normalizeContentForEmbedding() before passing to generateDocumentEmbedding()
//   - memory-save.ts    ~line 1093 : before generateDocumentEmbedding(parsed.content)
//       → normalizeContentForEmbedding(parsed.content)
//   - bm25-index.ts     ~line 245  : where `content_text` is used for token building
//       → normalizeContentForBM25(content_text)
//
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Reconsolidation
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// TM-06: Reconsolidation-on-Save
//
// After embedding generation, check top-3 most similar memories
// in the spec folder:
// - similarity >= 0.88: MERGE (duplicate - merge content,
//   boost importance_weight)
// - similarity 0.75-0.88: CONFLICT (supersede prior memory via causal
//   'supersedes' edge)
// - similarity < 0.75: COMPLEMENT (store new memory unchanged)
//
// Behind SPECKIT_RECONSOLIDATION flag (default OFF)
// REQUIRES: checkpoint created before first enable
// ---------------------------------------------------------------

import { createHash } from 'crypto';
import type Database from 'better-sqlite3';
exec
/bin/zsh -lc 'rg -n "isConsolidationEnabled|isSaveQualityGateEnabled|isEncodingIntentEnabled|isReconsolidationEnabled|SPECKIT_RECONSOLIDATION|SPECKIT_CONSOLIDATION|SPECKIT_SAVE_QUALITY_GATE" .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:15:// Behind SPECKIT_RECONSOLIDATION flag (default OFF)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:119: * @returns true if SPECKIT_RECONSOLIDATION is not explicitly disabled (default: ON)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:121:export function isReconsolidationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:122:  return process.env.SPECKIT_RECONSOLIDATION?.toLowerCase() !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:442:  if (!isReconsolidationEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:71: * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:73:export function isSaveQualityGateEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:74:  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:79: * Default: TRUE (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:81:export function isReconsolidationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:82:  return isFeatureEnabled('SPECKIT_RECONSOLIDATION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:119: * Default: TRUE (graduated). Set SPECKIT_CONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:121:export function isConsolidationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:122:  return isFeatureEnabled('SPECKIT_CONSOLIDATION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:130:export function isEncodingIntentEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:13:// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:217: * Default: TRUE (graduated Sprint 4). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:219: * @returns true if SPECKIT_SAVE_QUALITY_GATE is not explicitly disabled
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:222:  return process.env.SPECKIT_SAVE_QUALITY_GATE?.toLowerCase() !== 'false';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:13:import { reconsolidate, isReconsolidationEnabled } from '../../lib/storage/reconsolidation';
 succeeded in 52ms:
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
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Negative Feedback
// ---------------------------------------------------------------
// AI-GUARD: 
// When wasUseful=false is recorded via memory_validate, reduce the
// memory's composite score via a confidence multiplier.
//
// Multiplier: starts at 1.0, decreases with each negative validation
// Floor: 0.3 (never suppress below 30% of original score)
// Decay: gradual recovery over time (30-day half-life)
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/** Base multiplier before any negative feedback is applied. */
export const CONFIDENCE_MULTIPLIER_BASE = 1.0;
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Reconsolidation Bridge
// ---------------------------------------------------------------

import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index';
import * as embeddings from '../../lib/providers/embeddings';
import * as bm25Index from '../../lib/search/bm25-index';
import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../../lib/storage/incremental-index';
import { reconsolidate, isReconsolidationEnabled } from '../../lib/storage/reconsolidation';
import type { ReconsolidationResult } from '../../lib/storage/reconsolidation';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
import {
  isEncodingIntentEnabled,
  isReconsolidationEnabled as isReconsolidationFlagEnabled,
} from '../../lib/search/search-flags';
import type * as memoryParser from '../../lib/parsing/memory-parser';
exec
/bin/zsh -lc "rg -n \"function update_memory|clear_search_cache|clear_constitutional_cache|update_memory\\(|export function update_memory|export function updateMemory\" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:39:  clear_constitutional_cache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:18:  clear_constitutional_cache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:23:  clear_search_cache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:107:    return update_memory({
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:236:export function update_memory(params: UpdateMemoryParams): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:277:      clear_constitutional_cache();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:381:    clear_search_cache();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:382:    clear_constitutional_cache();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:477:      clear_constitutional_cache();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:478:      clear_search_cache();
exec
/bin/zsh -lc "sed -n '236,325p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
export function update_memory(params: UpdateMemoryParams): number {
  const database = initialize_db();

  const {
    id,
    title,
    triggerPhrases,
    importanceWeight,
    importanceTier,
    embedding,
    canonicalFilePath,
    encodingIntent,
    documentType,
    specLevel,
    contentText,
    qualityScore,
    qualityFlags,
  } = params;

  const now = new Date().toISOString();
exec
/bin/zsh -lc "sed -n '325,395p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
        throw new Error(`Embedding must be ${expected_dim} dimensions, got ${embedding.length}`);
      }

      const embedding_buffer = to_embedding_buffer(embedding);
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(BigInt(id), embedding_buffer);
    }

    if (existingRow?.spec_folder) {
      refresh_interference_scores_for_folder(database, existingRow.spec_folder);
    }

    return id;
  });

  return update_memory_tx();
}

exec
/bin/zsh -lc 'rg -n "namespace|multi-tenant|tenant" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

exec
/bin/zsh -lc "rg -n \"recordCorrection|record_correction|undoCorrection|undo_correction|getCorrections|corrections\\.\" .opencode/skill/system-spec-kit/mcp_server --glob '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:239:  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:54:├── corrections.ts   # Memory correction tracking with stability adjustments
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:63:| `corrections.ts` | Correction types, stability adjustments, history tracking |
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:93:| `record_correction(params)` | Record a correction with stability updates |
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:94:| `undo_correction(id)` | Reverse a correction, restore stability |
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:121:corrections.init(db);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:124:const result = corrections.record_correction({
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:166:import { undo_correction } from './index';
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:169:const result = undo_correction(7);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:354: * Provides the record_correction helper.
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:356:export function record_correction(params: RecordCorrectionParams): CorrectionResult {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:424:    // AI-SAFETY: record_correction validates db before starting this transaction
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:454:      // AI-SAFETY: record_correction validates db before starting this transaction
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:480:        // AI-SAFETY: record_correction validates db before starting this transaction
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:481:        // AI-SAFETY: undo_correction throws when db is not initialized before creating this transaction
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:525:    console.error(`[corrections] record_correction failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:535: * Provides the undo_correction helper.
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:537:export function undo_correction(correction_id: number): UndoResult {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:591:        // AI-SAFETY: undo_correction throws when db is not initialized before creating this transaction
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:622:    console.error(`[corrections] undo_correction failed: ${get_error_message(error)}`);
exec
/bin/zsh -lc "rg -n \"recordHistory|memory_history|history\\.init|history\\.record|getHistory\\(\" .opencode/skill/system-spec-kit/mcp_server --glob '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:803:| `memory_history`     | Access and modification history                                    |
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:57:        database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1057:  // H5 FIX: Add idx_history_timestamp index for memory_history table
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1059:    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1073:    CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1121:    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1122:    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:355:    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:445:        database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:55:    CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:105: * Provides the recordHistory helper.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:107:export function recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:118:    INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:128:export function getHistory(memoryId: number, limit?: number): HistoryEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:132:    ? 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC LIMIT ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:133:    : 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:153:      FROM memory_history h
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:172:    FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:395:| v2      | Add `idx_history_timestamp` index on `memory_history`                        |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:173:| **Storage** | `memory_history` table with foreign key to `memory_index` |
exec
/bin/zsh -lc 'ls .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts .opencode/skill/system-spec-kit/mcp_server/scripts/memory/cleanup-orphaned-vectors.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:
ls: .opencode/skill/system-spec-kit/mcp_server/scripts/memory/cleanup-orphaned-vectors.ts: No such file or directory
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"normalizeContentForBM25|addDocument\\(|normalizeContentForEmbedding\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
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
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Chunk Thinning
// ---------------------------------------------------------------
// Scores chunks by anchor presence + content density, then
// applies a thinning threshold to drop low-quality chunks.
// Used BEFORE indexing to filter out low-value chunks.
// ---------------------------------------------------------------

import type { AnchorChunk } from './anchor-chunker';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Describes the ChunkScore shape.
 */
export interface ChunkScore {
  chunk: AnchorChunk;
  score: number;        // 0-1 composite score
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Db Helpers
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

import type { PostInsertMetadataFields } from './types';

/** Allowed column names for the dynamic UPDATE builder (injection guard). */
export const ALLOWED_POST_INSERT_COLUMNS = new Set<string>([
  'content_hash', 'context_type', 'importance_tier', 'memory_type',
  'type_inference_source', 'stability', 'difficulty', 'review_count',
  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
  'chunk_index', 'chunk_label',
]);

/**
 * Build and execute a dynamic `UPDATE memory_index SET ... WHERE id = ?`
 * from the supplied field map.  Reduces the five near-identical post-insert
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:6:import { normalizeContentForBM25 } from '../parsing/content-normalizer';
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:136:  addDocument(id: string, text: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:235:      this.addDocument(doc.id, doc.text);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:262:        if (row.content_text) textParts.push(normalizeContentForBM25(row.content_text));
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:267:          this.addDocument(String(row.id), text);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:157:              bm25Index.getIndex().addDocument(String(id), text);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:119:        bm25.addDocument(String(memory_id), parsed.content);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:222:      bm25.addDocument(String(parentId), chunkResult.parentSummary);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:256:          chunkEmbedding = await embeddings.generateDocumentEmbedding(normalizeContentForEmbedding(chunk.content));
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:319:          bm25.addDocument(String(childId), chunk.content);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:46:        const normalizedContent = normalizeContentForEmbedding(parsed.content);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:130:                  bm25.addDocument(String(memoryId), memory.content);
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

import * as memorySearch from './memory-search';
import * as memoryTriggers from './memory-triggers';
import * as memorySave from './memory-save';
import * as memoryCrud from './memory-crud';
import * as memoryIndex from './memory-index';
import * as memoryBulkDelete from './memory-bulk-delete';
import * as checkpoints from './checkpoints';
import * as sessionLearning from './session-learning';
import * as causalGraph from './causal-graph';
import * as evalReporting from './eval-reporting';
// T061: L1 Orchestration - unified entry point
import * as memoryContext from './memory-context';
import * as memoryIngest from './memory-ingest';

/* ---------------------------------------------------------------
   RE-EXPORTS: All handler functions
exec
/bin/zsh -lc 'rg -n "14|warn-only|0.4|50|0.92|signal density|Layer 1|Layer 2|Layer 3" .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
8:// - Layer 1: Structural validation (existing checks, formalized)
9:// - Layer 2: Content quality scoring (title, triggers, length,
10://            anchors, metadata, signal density)
11:// - Layer 3: Semantic dedup (cosine similarity against existing)
15:// MR12 mitigation: warn-only mode for first 2 weeks after
16:// activation. When in warn-only mode, log quality scores and
20:// table so the 14-day graduation countdown survives server
30:/** Result from Layer 1: Structural validation */
36:/** Individual dimension scores from Layer 2 */
45:/** Result from Layer 2: Content quality scoring */
54:/** Result from Layer 3: Semantic dedup */
100:const SIGNAL_DENSITY_THRESHOLD = 0.4;
103:const SEMANTIC_DEDUP_THRESHOLD = 0.92;
106:const MIN_CONTENT_LENGTH = 50;
108:/** Warn-only period duration in milliseconds (14 days) */
109:const WARN_ONLY_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;
111:/** Layer 2 dimension weights for weighted average signal density */
206: * Activation timestamp for warn-only mode tracking.
226: * Check if the quality gate is in warn-only mode (MR12 mitigation).
227: * For the first 14 days after activation, the gate logs scores but
codex
---
FEATURE: 01-memory-indexing-memorysave.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The save pipeline description matches the current code well: normalization, PE gating, quality gate, reconsolidation, chunking, async embedding, mutation hooks, and BM25 behavior are all present. The concrete issue is the nonexistent retry test path.
---
FEATURE: 02-memory-metadata-update-memoryupdate.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The update handler does validate fields, regenerate embeddings on title change, support `allowPartialUpdate`, and write mutation-ledger metadata as described. The listed retry test file does not exist.
---
FEATURE: 03-single-and-folder-delete-memorydelete.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Both delete modes are implemented and the folder-delete path does create an auto-checkpoint before transactional deletion. The only path problem I found is the missing retry test file.
---
FEATURE: 04-tier-based-bulk-deletion-memorybulkdelete.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The handler matches most of the described behavior, including safety rules for high-sensitivity tiers, checkpoint behavior, consolidated ledger entries, and cache invalidation hooks. The mismatch is that `olderThanDays` is enforced as `>= 1` in handler code, but the schema currently allows `0`, so the “schema-level minimum: 1” claim is inaccurate.
---
FEATURE: 05-validation-feedback-memoryvalidate.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts, mcp_server/lib/scoring/confidence-tracker.ts, mcp_server/lib/search/auto-promotion.ts, mcp_server/lib/scoring/negative-feedback.ts, mcp_server/lib/search/learned-feedback.ts, mcp_server/lib/eval/ground-truth-feedback.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The feature is real, but the source-file list misses the actual handler and several core supporting modules. The description is also too broad about transactional behavior: the confidence update is transactionally wrapped, but promotion, negative-feedback persistence, learned feedback, and ground-truth logging are separate downstream steps.
---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The transaction wrappers are present on the update and single-delete mutation flows, and both handlers do include null-database fallbacks. The description overstates one detail: cache invalidation is not purely outside the transaction, because vector-index mutation code also clears caches internally.
---
FEATURE: 07-namespace-management-crud-tools.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: REWRITE
NOTES: I found no namespace CRUD implementation in the live code, so the deferred/planned status is accurate. The problem is the source-files section: for an unimplemented feature it lists a very large unrelated implementation surface instead of clearly indicating that no code exists yet.
---
FEATURE: 08-prediction-error-save-arbitration.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts, mcp_server/lib/search/vector-index.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The 5-action PE engine, thresholds, contradiction regexes, and conflict logging are all present. The entry overstates one point: the arbitration path is skipped not only by `force: true`, but also when no embedding is available.
---
FEATURE: 09-correction-tracking-with-undo.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The corrections library exists, supports the four listed correction types, tracks stability deltas, and implements undo behind `SPECKIT_RELATIONS`. What I could not find is live non-test wiring from save/learning handlers into this module, so the entry overstates current integration.
---
FEATURE: 10-per-memory-history-log.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/storage/history.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: A `memory_history` table and helper module do exist, but I found no non-test code that records create/update/restore lifecycle events from save, update, session-learning, or archival flows. The entry describes a more complete, actively wired feature than the code currently implements, and it omits the dedicated history module.
---
tokens used
163,140
---
FEATURE: 01-memory-indexing-memorysave.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The save pipeline description matches the current code well: normalization, PE gating, quality gate, reconsolidation, chunking, async embedding, mutation hooks, and BM25 behavior are all present. The concrete issue is the nonexistent retry test path.
---
FEATURE: 02-memory-metadata-update-memoryupdate.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The update handler does validate fields, regenerate embeddings on title change, support `allowPartialUpdate`, and write mutation-ledger metadata as described. The listed retry test file does not exist.
---
FEATURE: 03-single-and-folder-delete-memorydelete.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Both delete modes are implemented and the folder-delete path does create an auto-checkpoint before transactional deletion. The only path problem I found is the missing retry test file.
---
FEATURE: 04-tier-based-bulk-deletion-memorybulkdelete.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The handler matches most of the described behavior, including safety rules for high-sensitivity tiers, checkpoint behavior, consolidated ledger entries, and cache invalidation hooks. The mismatch is that `olderThanDays` is enforced as `>= 1` in handler code, but the schema currently allows `0`, so the “schema-level minimum: 1” claim is inaccurate.
---
FEATURE: 05-validation-feedback-memoryvalidate.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts, mcp_server/lib/scoring/confidence-tracker.ts, mcp_server/lib/search/auto-promotion.ts, mcp_server/lib/scoring/negative-feedback.ts, mcp_server/lib/search/learned-feedback.ts, mcp_server/lib/eval/ground-truth-feedback.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The feature is real, but the source-file list misses the actual handler and several core supporting modules. The description is also too broad about transactional behavior: the confidence update is transactionally wrapped, but promotion, negative-feedback persistence, learned feedback, and ground-truth logging are separate downstream steps.
---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The transaction wrappers are present on the update and single-delete mutation flows, and both handlers do include null-database fallbacks. The description overstates one detail: cache invalidation is not purely outside the transaction, because vector-index mutation code also clears caches internally.
---
FEATURE: 07-namespace-management-crud-tools.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: REWRITE
NOTES: I found no namespace CRUD implementation in the live code, so the deferred/planned status is accurate. The problem is the source-files section: for an unimplemented feature it lists a very large unrelated implementation surface instead of clearly indicating that no code exists yet.
---
FEATURE: 08-prediction-error-save-arbitration.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-save.ts, mcp_server/lib/search/vector-index.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The 5-action PE engine, thresholds, contradiction regexes, and conflict logging are all present. The entry overstates one point: the arbitration path is skipped not only by `force: true`, but also when no embedding is available.
---
FEATURE: 09-correction-tracking-with-undo.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The corrections library exists, supports the four listed correction types, tracks stability deltas, and implements undo behind `SPECKIT_RELATIONS`. What I could not find is live non-test wiring from save/learning handlers into this module, so the entry overstates current integration.
---
FEATURE: 10-per-memory-history-log.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/storage/history.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: A `memory_history` table and helper module do exist, but I found no non-test code that records create/update/restore lifecycle events from save, update, session-learning, or archival flows. The entry describes a more complete, actively wired feature than the code currently implements, and it omits the dedicated history module.
---
