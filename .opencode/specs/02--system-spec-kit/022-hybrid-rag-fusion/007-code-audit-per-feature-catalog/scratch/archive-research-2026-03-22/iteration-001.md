# Iteration 1: Undocumented Features -- Source Tree vs Feature Catalog Cross-Reference

## Focus
Q1: Are there features in the source code that exist but are NOT documented in any of the 19 feature catalog categories? This iteration maps the entire MCP server source tree (excluding dist/ and tests/) against the 19 catalog categories to identify undocumented modules, handlers, and subsystems.

## Findings

### 1. All 32 MCP Tools Are Cataloged (No Missing Tools)
The tool-schemas.ts file registers exactly 32 MCP tools across 7 layers (L1-L7). Cross-referencing against the catalog:
- L1 (memory_context) -> Catalog 01-retrieval
- L2 (memory_search, memory_quick_search, memory_match_triggers, memory_save) -> Catalog 01-retrieval + 02-mutation
- L3 (memory_list, memory_stats, memory_health) -> Catalog 03-discovery
- L4 (memory_delete, memory_update, memory_validate, memory_bulk_delete) -> Catalog 02-mutation
- L5 (checkpoint_create/list/restore/delete, shared_space_*, shared_memory_*) -> Catalog 05-lifecycle + 17-governance
- L6 (task_preflight/postflight, memory_drift_why, memory_causal_*, eval_*) -> Catalog 06-analysis + 07-evaluation
- L7 (memory_index_scan, memory_get_learning_history, memory_ingest_*) -> Catalog 04-maintenance + 05-lifecycle

**Assessment: MATCH. No MCP tool is missing from the catalog.**
[SOURCE: mcp_server/tool-schemas.ts:579-620]

### 2. UNDOCUMENTED: `api/` Directory -- Programmatic API Surface (6 files)
The `api/` directory contains 6 files that expose a programmatic (non-MCP) API:
- `api/eval.ts` -- Evaluation API
- `api/index.ts` -- API barrel export
- `api/indexing.ts` -- Indexing API
- `api/providers.ts` -- Provider configuration API
- `api/search.ts` -- Search API
- `api/storage.ts` -- Storage API

These are NOT MCP tools but a parallel programmatic API surface for direct JavaScript/TypeScript consumers. The feature catalog only documents MCP tools. This entire API layer is undocumented in the catalog.

**Assessment: GAP. The `api/` directory represents a complete parallel API surface not covered by any catalog category.**
[SOURCE: mcp_server/api/*.ts files]

### 3. UNDOCUMENTED: `formatters/` Directory -- Response Formatting Subsystem (3 files)
- `formatters/index.ts` -- Barrel export
- `formatters/search-results.ts` -- Search result formatting logic
- `formatters/token-metrics.ts` -- Token metrics formatting

While catalog category 18 (UX Hooks) covers response_hints and mutation_feedback, the `formatters/` module is a distinct subsystem responsible for shaping the actual data output format. Not explicitly cataloged.

**Assessment: PARTIAL GAP. Formatters may be implicitly covered under UX Hooks or Pipeline Architecture, but have no dedicated catalog entry and are not referenced as source files in those categories.**
[SOURCE: mcp_server/formatters/*.ts files]

### 4. UNDOCUMENTED: `core/` Directory -- Foundation Layer (3 files)
- `core/config.ts` -- Core configuration management
- `core/db-state.ts` -- Database state management (graph re-init, etc.)
- `core/index.ts` -- Core barrel export

The core infrastructure that everything depends on has no dedicated catalog entry. Config management is partially referenced in feature flag docs (category 19), and db-state might be tangentially covered by category 08 (bug fixes), but neither is explicitly cataloged.

**Assessment: PARTIAL GAP. Core infrastructure is implicitly assumed but not cataloged.**
[SOURCE: mcp_server/core/*.ts files]

### 5. UNDOCUMENTED: `configs/cognitive.ts` -- Cognitive Configuration
A dedicated configuration module for cognitive features (attention decay, co-activation, etc.). While cognitive features are spread across categories 10-12, the configuration module itself is not referenced.

**Assessment: MINOR GAP. Configuration is a cross-cutting concern not captured per-module.**
[SOURCE: mcp_server/configs/cognitive.ts]

### 6. UNDOCUMENTED: `utils/` Directory -- Shared Utilities (6 files)
- `utils/batch-processor.ts` -- Batch processing infrastructure
- `utils/db-helpers.ts` -- Database helper functions
- `utils/index.ts` -- Barrel export
- `utils/json-helpers.ts` -- JSON parsing/formatting helpers
- `utils/tool-input-schema.ts` -- Tool input schema validation
- `utils/validators.ts` -- Input validation logic

These cross-cutting utilities support multiple features but have no catalog entry. The batch-processor is particularly significant as it underpins async ingestion.

**Assessment: PARTIAL GAP. Cross-cutting utilities are not cataloged; batch-processor is the most significant omission.**
[SOURCE: mcp_server/utils/*.ts files]

### 7. UNDOCUMENTED: `lib/errors/` Directory -- Error System (3 files)
- `lib/errors/core.ts` -- Core error types and error hierarchy
- `lib/errors/index.ts` -- Error barrel export
- `lib/errors/recovery-hints.ts` -- Error recovery hint system

The error handling architecture including recovery hints is a distinct subsystem. While error handling is mentioned in passing in various categories, the dedicated error framework with typed errors and recovery hints has no catalog entry.

**Assessment: GAP. Error handling is a cross-cutting architectural feature without catalog coverage.**
[SOURCE: mcp_server/lib/errors/*.ts files]

### 8. UNDOCUMENTED: `lib/utils/` Directory -- Library Utilities (4 files)
- `lib/utils/canonical-path.ts` -- Path canonicalization
- `lib/utils/format-helpers.ts` -- Format helpers
- `lib/utils/logger.ts` -- Logging infrastructure
- `lib/utils/path-security.ts` -- Path security/traversal prevention

Path security is particularly notable -- it prevents path traversal attacks. This security-relevant module has no catalog entry.

**Assessment: GAP for path-security.ts (security feature). MINOR for others.**
[SOURCE: mcp_server/lib/utils/*.ts files]

### 9. UNDOCUMENTED: `context-server.ts` -- MCP Server Entry Point
The main MCP server entry point file that bootstraps the server, registers all tools, and manages the server lifecycle. Not cataloged as a feature, though it is the foundational glue file.

**Assessment: MINOR GAP. Infrastructure file, but its role in dynamic server instructions (feature 14-14) is the closest catalog reference.**
[SOURCE: mcp_server/context-server.ts]

### 10. UNDOCUMENTED: `cli.ts` -- Standalone CLI
A standalone CLI interface for the MCP server. Referenced in catalog 16-07 (standalone admin CLI), but the actual CLI module entry point is not listed as a source file there.

**Assessment: PARTIAL -- referenced in concept but source file not mapped.**
[SOURCE: mcp_server/cli.ts]

### 11. Source Module Count Summary
Total non-test, non-dist source files: ~195
Source files explicitly referenced in at least one catalog feature: estimated ~160-170
Source files with NO catalog reference: estimated ~25-35 (primarily api/, formatters/, core/, utils/, lib/errors/, lib/utils/)

## Sources Consulted
- mcp_server/tool-schemas.ts:579-620 (complete tool registry)
- mcp_server/ directory listing (full source tree, excluding dist/ and tests/)
- feature_catalog/ directory listing (all 19 category subdirectories)
- feature_catalog/FEATURE_CATALOG.md:1-120 (table of contents and structure)
- mcp_server/tools/index.ts (dispatcher architecture)

## Assessment
- New information ratio: 0.90
- Questions addressed: Q1 (undiscovered features)
- Questions answered: Q1 is substantially answered -- the tool surface is fully covered, but ~25-35 source files (primarily infrastructure/cross-cutting modules) lack catalog coverage

## Reflection
- What worked and why: Listing the complete source tree and cross-referencing against the catalog directory structure was highly effective. The tool-schemas.ts file provides a single canonical registry of all 32 MCP tools, making tool-level gap detection definitive.
- What did not work and why: N/A (first iteration, all approaches were fresh).
- What I would do differently: For Q2 (unaudited code paths), I should grep the catalog feature files for specific source file references rather than just checking directory-level coverage, to find files that exist in covered directories but are individually unreferenced.

## Recommended Next Focus
Q2: Systematically check which source files are NEVER referenced by name in any catalog feature file. This would reveal individual files within otherwise-covered directories that slipped through the audit.
