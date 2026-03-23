---
title: "Library Module Map"
description: "Internal ownership boundaries, feature-catalog crosswalk, and dependency directions for mcp_server/lib."
trigger_phrases:
  - "module map"
  - "lib dependency map"
  - "module ownership"
  - "dependency directions"
---

# Library Module Map

> Internal module ownership and dependency map for `mcp_server/lib/`.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. MODULE INVENTORY](#2--module-inventory)
- [3. FEATURE CATALOG MAPPING](#3--feature-catalog-mapping)
- [4. DEPENDENCY DIRECTIONS (T139)](#4--dependency-directions-t139)
- [5. CANONICAL LOCATIONS](#5--canonical-locations)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This document is the internal ownership and dependency map for the `mcp_server/lib/` surface. It exists to answer three practical questions:

1. Which top-level library module owns which responsibilities?
2. Which handlers, tools, or sibling library modules primarily consume each module?
3. Which import directions are intended to be legal as the codebase continues to modularize?

The inventory below is intentionally top-level and operational. It is based on the local `README.md` files where present, plus the most important source files and the currently observed import relationships across `mcp_server/lib/`, `mcp_server/handlers/`, and `mcp_server/tools/`.

Notes:

- `contracts/` and parts of `interfaces/` are compatibility or proxy surfaces after shared-package migration.
- Several modules are intentionally small today (`collab/`, `governance/`, `manage/`, `session/`, `response/`).
- Dependency enforcement is not automatic yet. Section 4 records the target direction model for future AST-based checking.

<!-- /ANCHOR:overview -->

---

## 2. MODULE INVENTORY
<!-- ANCHOR:module-inventory -->

### `architecture/`

- Purpose: Owns the 7-layer MCP architecture metadata and token-budget guidance used to group tools into orchestration, core, discovery, mutation, lifecycle, analysis, and maintenance layers. It is the canonical place for layer definitions and layer-to-tool lookup behavior.
- Key files:
  - `layer-definitions.ts` — canonical L1-L7 definitions, token budgets, tool-to-layer map, and recommendation helpers.
  - `README.md` — architectural intent, layer summaries, and usage guidance.
- Primary consumers:
  - `handlers/memory-context.ts`

### `cache/`

- Purpose: Owns short-lived caching for expensive operations, especially tool output reuse and embedding reuse. This module is an infrastructure concern, not a ranking or retrieval-policy layer.
- Key files:
  - `embedding-cache.ts` — persistent embedding cache used to avoid duplicate embedding generation.
  - `tool-cache.ts` — in-memory TTL/LRU cache for tool responses and repeated operations.
  - `README.md` — cache policy, TTL, eviction, and invalidation guidance.
- Primary consumers:
  - `handlers/chunking-orchestrator.ts`
  - `handlers/memory-search.ts`
  - `handlers/save/*`
  - `lib/providers/*`
  - `lib/search/*`

### `chunking/`

- Purpose: Owns large-file chunk production and quality-based chunk thinning before indexing. It defines how anchor-tagged and structurally segmented content becomes retrieval-sized units.
- Key files:
  - `anchor-chunker.ts` — anchor-first, heading-fallback chunk generation for large files.
  - `chunk-thinning.ts` — chunk quality scoring and threshold-based thinning before index write.
  - `README.md` — design constraints, thresholds, and chunking rationale.
- Primary consumers:
  - `handlers/chunking-orchestrator.ts`
  - `lib/validation/*`

### `cognitive/`

- Purpose: Owns the memory-science side of the system: decay, retrievability, working memory, co-activation, pressure monitoring, archival movement, and adaptive ranking inputs. It is the main "how memory behaves over time" module family.
- Key files:
  - `working-memory.ts` — working-memory writes, cleanup, and short-horizon memory behavior.
  - `fsrs-scheduler.ts` — FSRS-based spaced-repetition scheduling and retrievability math.
  - `attention-decay.ts` — time/usage decay utilities used to age memory salience.
  - `tier-classifier.ts` — classification logic that maps memories into behavioral tiers.
  - `archival-manager.ts` — lifecycle transitions between active and archived memory states.
- Primary consumers:
  - `lib/search/*`
  - `handlers/save/*`
  - `handlers/memory-triggers.ts`
  - `handlers/memory-context.ts`
  - `lib/extraction/*`
  - `lib/session/*`

### `collab/`

- Purpose: Owns shared-space collaboration primitives: shared-space definitions, membership, rollout flags, conflict tracking, and shared-memory metrics. This is the current home for multi-actor/shared-memory tenancy behavior.
- Key files:
  - `shared-spaces.ts` — shared-space schema/runtime, memberships, conflict summaries, and rollout controls.
- Primary consumers:
  - `handlers/shared-memory.ts`
  - `handlers/memory-save.ts`
  - `lib/governance/*`
  - `lib/search/*`

### `config/`

- Purpose: Owns canonical configuration for memory/document types and roadmap capability flags. It is the configuration surface for decay classes, document-type inference defaults, and phase/capability toggles.
- Key files:
  - `memory-types.ts` — canonical memory-type definitions and decay-oriented configuration.
  - `type-inference.ts` — inference logic for memory/document classification from path, content, and metadata.
  - `capability-flags.ts` — phase-aware rollout defaults and capability flag helpers.
  - `README.md` — module overview and the document-type/memory-type model.
- Primary consumers:
  - `lib/parsing/*`
  - `lib/telemetry/*`
  - `lib/eval/*`
  - `lib/cognitive/*`

### `contracts/`

- Purpose: Serves as a compatibility pointer for retrieval contracts that were moved into the shared package. Within `lib/`, this directory now documents ownership rather than owning runtime logic.
- Key files:
  - `README.md` — relocation note and local compatibility documentation for retrieval-trace contracts.
  - `../../shared/contracts/retrieval-trace.ts` — canonical shared contract implementation referenced by retrieval and telemetry code.
- Primary consumers:
  - No meaningful direct runtime ownership remains inside `lib/`; the real consumers target `@spec-kit/shared/contracts/*`.

### `errors/`

- Purpose: Owns normalized error classes, recovery hints, and error-to-message translation for memory operations. It is the standard place for operational failures that need actionable remediation.
- Key files:
  - `core.ts` — `MemoryError` and central error utilities.
  - `recovery-hints.ts` — tool-aware recovery guidance and error-code hint mapping.
  - `index.ts` — consolidated error exports.
  - `README.md` — error taxonomy and subsystem overview.
- Primary consumers:
  - `lib/errors.ts`
  - Handler-level mutation/search/reporting paths that surface recovery hints

### `eval/`

- Purpose: Owns evaluation, baselines, shadow measurements, quality proxies, and reporting artifacts for retrieval quality. It is the measurement and experimentation layer for search behavior.
- Key files:
  - `eval-metrics.ts` — canonical metric computation helpers.
  - `bm25-baseline.ts` — lexical-only baseline measurement.
  - `shadow-scoring.ts` — side-by-side scoring comparison support.
  - `ablation-framework.ts` — controlled channel-ablation experimentation.
  - `reporting-dashboard.ts` — aggregated reporting output for evaluation runs.
- Primary consumers:
  - `handlers/eval-reporting.ts`
  - `handlers/memory-search.ts`
  - `handlers/memory-context.ts`
  - `handlers/memory-triggers.ts`
  - `handlers/quality-loop.ts`

### `extraction/`

- Purpose: Owns post-tool extraction and save-time entity/secret handling. It turns tool outputs into candidate memory payloads while gating PII/secrets and extracting reusable entities.
- Key files:
  - `extraction-adapter.ts` — orchestration entry point for automated extraction-to-insert flow.
  - `redaction-gate.ts` — hard gate for secrets and PII before insert.
  - `entity-extractor.ts` — rule-based entity extraction over memory content.
  - `entity-denylist.ts` — denylist filtering for noisy or generic entity candidates.
  - `README.md` — pipeline overview and extraction scope.
- Primary consumers:
  - `handlers/save/*`

### `feedback/`

- Purpose: Owns implicit-feedback capture, shadow-feedback evaluation, ranking-comparison metrics, and batch-learning helpers used to measure learned-signal quality without mutating live rankings.
- Key files:
  - `feedback-ledger.ts` — shadow-only feedback event ledger and query helpers.
  - `shadow-scoring.ts` — holdout evaluation and promotion-gate logic for learned feedback.
  - `batch-learning.ts` — weekly aggregation and shadow-apply cycle for learned feedback.
  - `rank-metrics.ts` — Kendall tau, NDCG, MRR, and rank-delta helpers shared by feedback evaluation flows.
- Primary consumers:
  - `handlers/memory-search.ts`
  - `context-server.ts`
  - `lib/search/search-flags.ts`

### `governance/`

- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
- Key files:
  - `scope-governance.ts` — scope normalization, policy decisions, filter helpers, and governance audit writes.
  - `retention.ts` — scoped retention sweep logic over expired memories.
- Primary consumers:
  - `handlers/memory-save.ts`
  - `handlers/memory-search.ts`
  - `lib/collab/*`
  - `lib/search/*`

### `graph/`

- Purpose: Owns graph-derived retrieval signals and community detection over memory relationships. It is the canonical place for graph algorithms that operate over causal/community structure rather than primary retrieval channels.
- Key files:
  - `community-detection.ts` — BFS/Louvain-style community discovery and community boost logic.
  - `graph-signals.ts` — momentum and causal-depth signal calculation.
  - `README.md` — graph-feature overview and runtime flags.
- Primary consumers:
  - `lib/search/*`
  - `lib/storage/*`
  - `handlers/mutation-hooks.ts`

### `interfaces/`

- Purpose: Owns local runtime abstractions for vector-store behavior and documents the shared-package migration of interface types. It is the compatibility boundary between in-repo consumers and `@spec-kit/shared` contracts.
- Key files:
  - `vector-store.ts` — local abstract base class for JS/runtime vector-store implementations.
  - `README.md` — migration notes and contract overview.
- Primary consumers:
  - `lib/search/*`

### `learning/`

- Purpose: Owns correction history and stability adjustments that let the system learn from supersedes, merges, deprecations, and refinements. It is the primary home for correction-driven reliability updates.
- Key files:
  - `corrections.ts` — correction recording, undo support, chain traversal, and stability updates.
  - `index.ts` — explicit barrel export for the learning surface.
  - `README.md` — learning/corrections overview and examples.
- Primary consumers:
  - No direct in-repo imports were observed in `handlers/`, `tools/`, or sibling `lib/` modules during this pass; treat as a reusable but currently lightly wired subsystem.

### `manage/`

- Purpose: Reserved for future scheduled or batch-style memory-management algorithms that are not part of the live search path. The deprecated PageRank helper was removed after the dead-code audit confirmed it was never wired.
- Key files:
  - `README.md` — current management-cycle scope and algorithm notes.
- Primary consumers:
  - No live in-repo consumers remain; this folder is currently documentation-only.

### `ops/`

- Purpose: Owns background operational flows that keep the system current without blocking foreground requests. It covers ingestion jobs and real-time file watching.
- Key files:
  - `job-queue.ts` — SQLite-backed async ingest job lifecycle and state machine.
  - `file-watcher.ts` — chokidar-based debounced file watching and re-index triggers.
  - `README.md` — operational behavior and failure-handling notes.
- Primary consumers:
  - `handlers/memory-ingest.ts`

### `parsing/`

- Purpose: Owns structured parsing of memory/spec files, content normalization, and trigger matching. It is the canonical parser boundary between raw content and structured retrieval/indexing inputs.
- Key files:
  - `memory-parser.ts` — main parser for anchors, metadata, causal links, and document classification.
  - `trigger-matcher.ts` — proactive trigger-phrase matching logic.
  - `content-normalizer.ts` — normalization helpers for file content and search/index inputs.
  - `README.md` — parser responsibilities and supported behaviors.
- Primary consumers:
  - `handlers/save/*`
  - `handlers/memory-save.ts`
  - `lib/search/*`
  - `handlers/chunking-orchestrator.ts`
  - `handlers/memory-index.ts`

### `providers/`

- Purpose: Owns embedding provider abstraction and retry orchestration. It is the provider-facing infrastructure boundary between retrieval/indexing code and concrete embedding backends.
- Key files:
  - `embeddings.ts` — shared-package-backed embeddings surface used by index/search code.
  - `retry-manager.ts` — retry scheduling and backoff policy for provider failures.
  - `README.md` — provider overview and supported backends.
- Primary consumers:
  - `handlers/save/*`
  - `lib/search/*`
  - `lib/cognitive/*`
  - `lib/storage/*`
  - `handlers/memory-index.ts`

### `response/`

- Purpose: Owns the standard MCP response envelope used to make tool results predictable for agents and callers. It is the canonical place for `{summary, data, hints, meta}` shaping.
- Key files:
  - `envelope.ts` — response-envelope construction and token-aware metadata helpers.
  - `README.md` — envelope contract and usage guidance.
- Primary consumers:
  - `handlers/memory-context.ts`
  - `handlers/memory-search.ts`
  - `handlers/checkpoints.ts`
  - `handlers/eval-reporting.ts`
  - Most CRUD-style handler entry points

### `scoring/`

- Purpose: Owns ranking and calibration logic once candidate memories already exist. It combines importance tiers, composite scoring, folder relevance, confidence signals, and negative-feedback effects.
- Key files:
  - `composite-scoring.ts` — main composite ranking formula and score normalization.
  - `importance-tiers.ts` — canonical tier definitions and decay/scoring multipliers.
  - `folder-scoring.ts` — folder-level relevance and recency weighting.
  - `confidence-tracker.ts` — confidence-related normalization helpers.
  - `negative-feedback.ts` — post-feedback confidence penalties.
- Primary consumers:
  - `lib/search/*`
  - `lib/cognitive/*`
  - `handlers/checkpoints.ts`
  - `handlers/memory-crud-stats.ts`
  - `handlers/memory-crud-update.ts`

### `search/`

- Purpose: Owns the retrieval engine: candidate generation, vector/lexical channels, fusion, reranking, query intelligence, graph-aware retrieval, and schema/index helpers needed by the search path. This is the highest-churn and broadest domain module in `lib/`.
- Key files:
  - `hybrid-search.ts` — main hybrid retrieval entry point across search channels.
  - `pipeline/orchestrator.ts` — 4-stage retrieval pipeline coordinator.
  - `vector-index-store.ts` — vector-store abstraction bridge and core index operations.
  - `vector-index-schema.ts` — schema creation and schema-safety helpers for search storage.
  - `query-router.ts` — query-complexity routing and pipeline selection.
- Primary consumers:
  - `handlers/save/*`
  - `handlers/memory-search.ts`
  - `handlers/memory-context.ts`
  - `handlers/checkpoints.ts`
  - `handlers/chunking-orchestrator.ts`
  - `lib/storage/*`

### `session/`

- Purpose: Owns session deduplication, session-state persistence, and crash-recovery support. It is the boundary for request/session continuity rather than retrieval policy itself.
- Key files:
  - `session-manager.ts` — session-state lifecycle, dedup tracking, cleanup, and recovery helpers.
  - `README.md` — session guarantees and runtime behavior.
- Primary consumers:
  - `handlers/memory-search.ts`

### `spec/`

- Purpose: Owns shared spec-document helpers extracted from handlers so lib and handler modules can detect spec levels without re-implementing spec-folder traversal logic.
- Key files:
  - `spec-level.ts` — derives Level 1/2/3/3+ from nearby `spec.md` and sibling spec-doc files.
- Primary consumers:
  - `handlers/chunking-orchestrator.ts`
  - `handlers/save/*`
  - `lib/storage/lineage-state.ts`

### `storage/`

- Purpose: Owns persistence behavior outside the search algorithm itself: checkpoints, history, access tracking, lineage state, transactions, consolidation, reconsolidation, and index refresh flows. This is the long-lived state management layer for the memory system.
- Key files:
  - `checkpoints.ts` — checkpoint create/list/restore/delete operations.
  - `incremental-index.ts` — incremental indexing and deferred lexical-only indexing helpers.
  - `transaction-manager.ts` — mutation transaction wrappers and atomicity helpers.
  - `causal-edges.ts` — causal edge persistence and graph-maintenance hooks.
  - `reconsolidation.ts` — post-save similarity merge/complement/conflict handling.
- Primary consumers:
  - `handlers/save/*`
  - `handlers/memory-bulk-delete.ts`
  - `handlers/memory-crud-delete.ts`
  - `handlers/memory-crud-update.ts`
  - `handlers/pe-gating.ts`
  - `lib/search/*`

### `telemetry/`

- Purpose: Owns structured observability for retrieval and scoring behavior: trace sanitization, retrieval telemetry, scoring observability, and consumption logging. It is intended to observe domain modules rather than drive domain decisions.
- Key files:
  - `retrieval-telemetry.ts` — retrieval-run telemetry factory and quality-proxy metrics.
  - `scoring-observability.ts` — score-observation capture for ranking behavior.
  - `trace-schema.ts` — trace payload sanitization and schema validation.
  - `consumption-logger.ts` — persisted consumption instrumentation.
  - `README.md` — telemetry scope and flag overview.
- Primary consumers:
  - `handlers/memory-context.ts`
  - `handlers/memory-search.ts`
  - `handlers/memory-ingest.ts`
  - `handlers/memory-triggers.ts`
  - `lib/scoring/*`

### `utils/`

- Purpose: Owns low-level utility helpers reused across the server: path security wrappers, canonical path identity, output formatting, and structured logging. It is shared plumbing, not business logic.
- Key files:
  - `canonical-path.ts` — canonical path keying used for deduplication and identity.
  - `path-security.ts` — path validation and containment helpers re-exported from shared code.
  - `logger.ts` — structured logging helpers.
  - `format-helpers.ts` — formatting helpers for output and age strings.
  - `README.md` — utility surface overview.
- Primary consumers:
  - `lib/search/*`
  - `lib/parsing/*`
  - `lib/storage/*`
  - `handlers/memory-save.ts`
  - `handlers/memory-triggers.ts`

### `validation/`

- Purpose: Owns preflight validation and save-time quality gates that reject malformed, duplicate, or low-signal writes before expensive work happens. It is a defensive boundary ahead of mutation and indexing paths.
- Key files:
  - `preflight.ts` — dry-run and full preflight validation before save/index work.
  - `save-quality-gate.ts` — multi-layer structural/content/semantic quality gate.
  - `README.md` — validation subsystem overview and thresholds.
- Primary consumers:
  - `handlers/memory-save.ts`

<!-- /ANCHOR:module-inventory -->

---

## 3. FEATURE CATALOG MAPPING
<!-- ANCHOR:feature-catalog-mapping -->

Feature-catalog categories referenced here are the 19 top-level directories under `feature_catalog/`:

- `01--retrieval`
- `02--mutation`
- `03--discovery`
- `04--maintenance`
- `05--lifecycle`
- `06--analysis`
- `07--evaluation`
- `08--bug-fixes-and-data-integrity`
- `09--evaluation-and-measurement`
- `10--graph-signal-activation`
- `11--scoring-and-calibration`
- `12--query-intelligence`
- `13--memory-quality-and-indexing`
- `14--pipeline-architecture`
- `15--retrieval-enhancements`
- `16--tooling-and-scripts`
- `17--governance`
- `18--ux-hooks`
- `19--feature-flag-reference`

### 3.1 `lib/` Directory -> Feature Categories

| `lib/` directory | Feature-catalog categories |
|------------------|----------------------------|
| `architecture` | `14--pipeline-architecture` |
| `cache` | `01--retrieval`, `13--memory-quality-and-indexing`, `15--retrieval-enhancements` |
| `chunking` | `13--memory-quality-and-indexing`, `15--retrieval-enhancements` |
| `cognitive` | `05--lifecycle`, `11--scoring-and-calibration`, `15--retrieval-enhancements`, `19--feature-flag-reference` |
| `collab` | `17--governance` |
| `config` | `11--scoring-and-calibration`, `17--governance`, `19--feature-flag-reference` |
| `contracts` | `14--pipeline-architecture` |
| `errors` | `08--bug-fixes-and-data-integrity`, `18--ux-hooks` |
| `eval` | `07--evaluation`, `09--evaluation-and-measurement` |
| `extraction` | `02--mutation`, `13--memory-quality-and-indexing`, `17--governance` |
| `feedback` | `11--scoring-and-calibration`, `13--memory-quality-and-indexing`, `19--feature-flag-reference` |
| `governance` | `17--governance` |
| `graph` | `06--analysis`, `10--graph-signal-activation`, `15--retrieval-enhancements` |
| `interfaces` | `14--pipeline-architecture` |
| `learning` | `05--lifecycle`, `11--scoring-and-calibration` |
| `manage` | `04--maintenance`, `10--graph-signal-activation`, `11--scoring-and-calibration` |
| `ops` | `04--maintenance`, `13--memory-quality-and-indexing`, `16--tooling-and-scripts` |
| `parsing` | `01--retrieval`, `12--query-intelligence`, `13--memory-quality-and-indexing` |
| `providers` | `01--retrieval`, `13--memory-quality-and-indexing`, `15--retrieval-enhancements` |
| `response` | `14--pipeline-architecture`, `18--ux-hooks` |
| `scoring` | `10--graph-signal-activation`, `11--scoring-and-calibration`, `15--retrieval-enhancements` |
| `search` | `01--retrieval`, `03--discovery`, `06--analysis`, `10--graph-signal-activation`, `11--scoring-and-calibration`, `12--query-intelligence`, `14--pipeline-architecture`, `15--retrieval-enhancements`, `19--feature-flag-reference` |
| `session` | `05--lifecycle`, `15--retrieval-enhancements` |
| `spec` | `14--pipeline-architecture` |
| `storage` | `02--mutation`, `04--maintenance`, `05--lifecycle`, `08--bug-fixes-and-data-integrity`, `10--graph-signal-activation`, `13--memory-quality-and-indexing`, `17--governance` |
| `telemetry` | `09--evaluation-and-measurement`, `11--scoring-and-calibration`, `17--governance`, `18--ux-hooks` |
| `utils` | `08--bug-fixes-and-data-integrity`, `16--tooling-and-scripts`, `18--ux-hooks` |
| `validation` | `02--mutation`, `08--bug-fixes-and-data-integrity`, `13--memory-quality-and-indexing` |

### 3.2 Feature Categories -> Main `lib/` Directories

| Feature category | Main `lib/` directories |
|------------------|-------------------------|
| `01--retrieval` | `cache`, `parsing`, `providers`, `search` |
| `02--mutation` | `extraction`, `storage`, `validation` |
| `03--discovery` | `search` |
| `04--maintenance` | `manage`, `ops`, `storage` |
| `05--lifecycle` | `cognitive`, `learning`, `session`, `storage` |
| `06--analysis` | `graph`, `search` |
| `07--evaluation` | `eval` |
| `08--bug-fixes-and-data-integrity` | `errors`, `storage`, `utils`, `validation` |
| `09--evaluation-and-measurement` | `eval`, `telemetry` |
| `10--graph-signal-activation` | `graph`, `manage`, `scoring`, `search`, `storage` |
| `11--scoring-and-calibration` | `cognitive`, `config`, `feedback`, `learning`, `manage`, `scoring`, `search`, `telemetry` |
| `12--query-intelligence` | `parsing`, `search` |
| `13--memory-quality-and-indexing` | `cache`, `chunking`, `extraction`, `feedback`, `ops`, `parsing`, `providers`, `storage`, `validation` |
| `14--pipeline-architecture` | `architecture`, `contracts`, `interfaces`, `response`, `search`, `spec` |
| `15--retrieval-enhancements` | `cache`, `chunking`, `cognitive`, `graph`, `providers`, `scoring`, `search`, `session` |
| `16--tooling-and-scripts` | `ops`, `utils` |
| `17--governance` | `collab`, `config`, `extraction`, `governance`, `storage`, `telemetry` |
| `18--ux-hooks` | `errors`, `response`, `telemetry`, `utils` |
| `19--feature-flag-reference` | `cognitive`, `config`, `feedback`, `search` |

<!-- /ANCHOR:feature-catalog-mapping -->

---

## 4. DEPENDENCY DIRECTIONS (T139)
<!-- ANCHOR:dependency-directions -->

Status: **DEFERRED**

This section documents the intended dependency direction for `lib/` modules. It is documentation-only for now. No AST/import checker enforces this yet, but this is the target model future enforcement should validate.

### 4.1 Core Dependencies

Core modules:

- `config`
- `errors`
- `interfaces`
- `contracts`

Target rule:

- These are dependency roots.
- They may be imported by any other `lib/` module, handlers, or tools.
- They should not import sibling `lib/` modules.

Rationale:

- `config` should expose flags, types, and inference defaults, not consume behavioral modules.
- `errors` should remain a reusable failure vocabulary.
- `interfaces` and `contracts` are abstraction layers and should not know about higher-level behavior.

### 4.2 Foundation and Shared Helpers

Shared-helper modules:

- `utils`
- `response`
- `architecture`
- `spec`

Target rule:

- These may import core modules only.
- They may be consumed by any domain or infrastructure module.
- They should not import domain modules such as `search`, `cognitive`, `storage`, or `scoring`.

### 4.3 Leaf Modules

Leaf modules:

- `telemetry`
- `validation`

Target rule:

- Leaf modules import **core only**.
- Leaf modules observe or gate behavior; they do not own business-flow orchestration.
- Domain modules should call into them, but leaf modules should not call back into domain modules.

Examples of intended use:

- `telemetry` should accept trace/metric payloads from `search`, `scoring`, or handlers, but not import retrieval logic from them.
- `validation` should evaluate save/index inputs, but not pull in retrieval or chunking behavior directly.

### 4.4 Infrastructure Modules

Infrastructure/data modules:

- `cache`
- `providers`
- `session`
- `storage`
- `ops`

Target rule:

- These may import core + foundation modules.
- Narrowly scoped infra-to-infra imports are allowed when they reflect clear dependency direction:
  - `providers -> cache`
  - `ops -> storage`
  - `session -> storage`
- Infrastructure modules should not import handlers.
- `storage` should not depend on `search` ranking logic; `search` may depend on `storage`.

### 4.5 Domain Modules

Domain modules:

- `parsing`
- `chunking`
- `extraction`
- `cognitive`
- `graph`
- `scoring`
- `search`
- `learning`
- `manage`
- `eval`
- `feedback`
- `governance`
- `collab`

Target rule by module:

- `parsing`
  - May import: core, `utils`
  - Must not import: `search`, `storage`, `scoring`, handlers
- `chunking`
  - May import: core, `utils`, `parsing`
  - Must not import: `search`, `storage`, handlers
- `extraction`
  - May import: core, `parsing`, `validation`, `governance`
  - Must not import: `search`, `storage`, handlers
- `cognitive`
  - May import: core, `utils`, `config`, `session`
  - Must not import: `search`, `storage`, handlers
- `graph`
  - May import: core, `storage`
  - Must not import: `search` orchestration, handlers
- `scoring`
  - May import: core, `cognitive`, `graph`, `config`
  - Must not import: `search`, `storage`, `telemetry`, handlers
- `search`
  - May import: core, foundation, infrastructure, and domain helpers needed to assemble retrieval
  - This is the top domain aggregator and is allowed to consume `cache`, `providers`, `session`, `storage`, `parsing`, `cognitive`, `graph`, `scoring`, `governance`, and `collab`
  - Must not be imported by lower layers as a utility dependency
- `learning`
  - May import: core, `storage`, `scoring`
  - Must not import: `search`, handlers
- `manage`
  - May import: core, `storage`, `graph`, `scoring`
  - Must not import: `search`, handlers
- `eval`
  - May import: core, `search`, `scoring`, `telemetry`, `storage`
  - Must not be imported by production ranking paths
- `feedback`
  - May import: core, `search`, `scoring`, `storage`
  - Must not mutate live ranking paths or import handlers as control flow
- `governance`
  - May import: core, `storage`
  - Must not import: `search`, `collab`, handlers
- `collab`
  - May import: core, `governance`, `storage`
  - Must not import: `search` directly except through neutral shared contracts/helpers

### 4.6 Forbidden Global Directions

The following directions are forbidden in the target model:

- `lib/* -> handlers/*`
- core modules importing domain modules
- lower-level modules importing `search` as a convenience helper
- `storage -> search`
- `governance <-> collab` cycles
- `scoring -> telemetry`
- `validation -> search`
- `telemetry -> search`

### 4.7 Current-Reality Note

The current tree still contains a few legacy reverse dependencies that do not match the target direction above. Examples observed during this pass include:

- `config/capability-flags.ts -> cognitive/rollout-policy.ts`
- `session/session-manager.ts -> cognitive/working-memory.ts`
- `telemetry/retrieval-telemetry.ts -> search/session-transition.ts`
- `validation/* -> search/*` and `chunking/*`
- `storage/* -> search/*`
- `governance/* <-> collab/*`
- `storage/lineage-state.ts -> handlers/*`

Those should be treated as refactor targets, not new precedent.

<!-- /ANCHOR:dependency-directions -->

---

## 5. CANONICAL LOCATIONS
<!-- ANCHOR:canonical-locations -->

### Checkpoints

- Canonical location: `lib/storage/checkpoints.ts`
- Non-canonical location: handler-level checkpoint entry points in `handlers/`
- Rule: checkpoint persistence/state logic belongs to storage; handlers should stay thin entry surfaces.

### Cognitive Modules

- Canonical location: `lib/cognitive/`
- Non-canonical historical location: `lib/cache/cognitive/` (former symlink path)
- Rule: all cognitive-memory behavior, decay logic, working-memory helpers, and related imports should resolve to `lib/cognitive/`.

### Shared-Package Proxies

- `lib/contracts/` is documentation/proxy only; canonical retrieval contracts live in `shared/contracts/`.
- `lib/interfaces/` is partly proxy/compatibility surface; canonical shared TypeScript interfaces live in `@spec-kit/shared`.

<!-- /ANCHOR:canonical-locations -->
