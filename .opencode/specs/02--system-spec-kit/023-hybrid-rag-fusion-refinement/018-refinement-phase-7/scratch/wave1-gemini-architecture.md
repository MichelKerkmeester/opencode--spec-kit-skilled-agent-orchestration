---
title: "Wave 1 - Gemini Architecture Boundary Review"
source: "cli-gemini (gemini-3.1-pro-review)"
date: 2026-03-02
---

# Wave 1: Gemini Architecture Boundary Review

## 1. Package Boundaries and Dependency Violations

Package boundaries are **not clean**. The `scripts/` package (CLI tools) is heavily coupled with `mcp_server/` internals, violating the principle of encapsulation.

- **Violation:** `scripts/core/memory-indexer.ts` and `scripts/memory/reindex-embeddings.ts` import directly from `@spec-kit/mcp-server/lib/search/vector-index`.
- **Recommendation:** Move the core indexing and database logic (like `vector-index.ts`, `hybrid-search.ts`, and `checkpoints.ts`) from `mcp_server/lib/` to a new `shared/lib/storage/` module OR expose them via a public API in `mcp_server/`. If they must remain in the server, `scripts` should interact through a well-defined service layer rather than reaching into deep `lib/` paths.
- **Specific Move:** Consolidate `mcp_server/lib/search/vector-index.ts` and `mcp_server/lib/storage/*` into `shared/lib/storage/` if CLI-side indexing is a permanent requirement.

## 2. Evaluation Scripts (`scripts/evals/`)

The evaluation scripts are currently **misplaced** in `scripts/evals/`.

- **Violation:** `scripts/evals/run-performance-benchmarks.ts` and others perform deep imports into `mcp_server/lib/search/session-boost`, `lib/cache/cognitive/working-memory`, etc., to measure internal performance.
- **Recommendation:** Move all content from `scripts/evals/` to `mcp_server/tests/evals/` or `mcp_server/benchmarks/`. These are unit-level or integration-level benchmarks for server internals and should reside within the server's package.

## 3. Cross-Concern Violation: `alignment-validator.ts`

- **Violation:** `scripts/spec-folder/alignment-validator.ts` contains `validateTelemetrySchemaDocsDrift`, which validates the internal telemetry implementation of the server.
- **Recommendation:** Extract this function and move it to `mcp_server/lib/telemetry/telemetry-validator.ts` or as a dedicated test case in `mcp_server/tests/telemetry.test.ts`.

## 4. Core Logic Duplication

Conceptual overlap between `scripts/core/` and `mcp_server/core/`:

- **Duplication:** Both packages handle path resolution for spec folders and configuration loading. `scripts/core/config.ts` contains utility functions like `getSpecsDirectories()` and `findActiveSpecsDir()` that are functionally relevant to the server's indexing logic.
- **Recommendation:** Move path resolution and spec-folder discovery logic from `scripts/core/config.ts` to `shared/utils/path-utils.ts`.

## 5. Shared Extraction Opportunities

- **`quality-scorer.ts`:** Move `scripts/core/quality-scorer.ts` to `shared/scoring/quality-scorer.ts`. Ensures server can validate quality using the same logic CLI uses to create.
- **`topic-extractor.ts`:** Merge `scripts/core/topic-extractor.ts` with `shared/trigger-extractor.ts` into unified `shared/lib/extraction/term-extractor.ts`. Currently they use similar but slightly divergent weighted scoring.
- **Input Normalization Types:** Move interfaces `Observation`, `UserPrompt`, `FileEntry` from `scripts/utils/input-normalizer.ts` to `shared/types.ts`.
- **Utility Consolidation:** Move `scripts/utils/path-utils.ts`, `file-helpers.ts`, and `logger.ts` to `shared/utils/`.

## Summary of Recommended Moves

| Current Path | Recommended Path | Reason |
|:---|:---|:---|
| `scripts/evals/*` | `mcp_server/tests/evals/` | Encapsulate internal benchmarks |
| `scripts/core/quality-scorer.ts` | `shared/scoring/quality-scorer.ts` | Shared scoring logic |
| `scripts/core/topic-extractor.ts` | `shared/lib/extraction/term-extractor.ts` | Consolidate keyword extraction |
| `scripts/spec-folder/alignment-validator.ts` (telemetry) | `mcp_server/lib/telemetry/validator.ts` | Remove cross-concern violation |
| `scripts/utils/input-normalizer.ts` (Types) | `shared/types.ts` | Centralize core entity definitions |
| `mcp_server/lib/search/vector-index.ts` | `shared/lib/storage/vector-index.ts` | Clean dependency direction |
