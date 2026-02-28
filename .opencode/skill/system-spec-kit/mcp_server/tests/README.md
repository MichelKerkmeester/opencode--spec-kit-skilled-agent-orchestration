---
title: "MCP Server Test Suite"
description: "Vitest-based test suite for cognitive memory and MCP handlers."
trigger_phrases:
  - "test suite"
  - "vitest"
  - "mcp tests"
importance_tier: "normal"
---

# MCP Server Test Suite

> Vitest-based test suite for cognitive memory and MCP handlers.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RUNNING VERIFICATION](#7--running-verification)
- [8. RELATED RESOURCES](#8--related-resources)

---

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What are the MCP Server Tests?

The test suite validates all critical functionality of the Spec Kit Memory MCP server. Tests cover cognitive memory features (attention decay, working memory, co-activation and confidence tracking), tier classification, summary generation, search pipelines, MCP tool handlers and integration scenarios. All tests use **Vitest** as the test framework with `.vitest.ts` file extensions.

**TypeScript Migration:** The full JS-to-TS migration is complete (Spec 092). All test files are TypeScript (`.vitest.ts`). There are zero `.test.js`, `.test.ts` or standalone `.js` test files remaining.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Test Files | 226 | All `.vitest.ts` format |
| Total Tests | 7,003 | Across all test files |
| Test Framework | Vitest | TypeScript-native, no compilation step needed |
| Coverage Target | 80/70/50 | Unit 80%, Integration 70%, E2E 50% |

### Key Features

| Feature | Description |
|---------|-------------|
| **Vitest Framework** | Modern TypeScript-native test runner with built-in assertions |
| **Full Coverage** | 226 test files covering cognitive, search, handlers, integration and eval |
| **Category Organization** | Tests grouped by functional domain (cognitive, search, handlers, integration, unit) |
| **Type Safety** | Full TypeScript with type checking at test level |
| **Spec 126/127 Reality Checks** | Coverage for 3-source indexing, 7 intents, schema v13 document fields, document-type scoring and `includeSpecDocs` |
| **Feature Eval Tests** | Graph Signals, Scoring Calibration, Query Intelligence feature evals, cross-feature integration, BM25 baseline, embedding cache |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| Vitest | Configured in project | Latest |
| better-sqlite3 | 9+ | Latest |

---

<!-- /ANCHOR:overview -->

## 2. QUICK START
<!-- ANCHOR:quick-start -->

```bash
# 1. Navigate to the mcp_server directory
cd .opencode/skill/system-spec-kit/mcp_server

# 2. Run all tests
npx vitest run

# 3. Run a specific test file
npx vitest run tests/attention-decay.vitest.ts

# 4. Run tests in watch mode
npx vitest
```

### Verify Installation

```bash
# Check that vitest is available
npx vitest --version

# Run a quick sanity check
npx vitest run tests/memory-types.vitest.ts
```

### First Use

```bash
# Run a single feature test
npx vitest run tests/working-memory.vitest.ts

# Output (example):
#  PASS  tests/working-memory.vitest.ts
#   Working Memory
#     > initializes correctly
#     > adds memory to working memory
#     > ...
#  Tests: 51 passed
```

---

<!-- /ANCHOR:quick-start -->

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
tests/
├── # Core Cognitive Tests
├── attention-decay.vitest.ts              # Multi-factor attention decay
├── co-activation.vitest.ts                # Related memory activation
├── cognitive-gaps.vitest.ts               # Cognitive coverage gaps
├── confidence-tracker.vitest.ts           # Confidence tracking
├── tier-classifier.vitest.ts              # 5-state classification
├── working-memory.vitest.ts               # Session working memory
├── temporal-contiguity.vitest.ts          # Temporal contiguity scoring
├── fsrs-scheduler.vitest.ts               # FSRS algorithm unit tests
├── prediction-error-gate.vitest.ts        # PE thresholds and contradiction
├── corrections.vitest.ts                  # Learning from corrections
├── importance-tiers.vitest.ts             # Importance tier logic
│
├── # Search & Scoring Tests
├── composite-scoring.vitest.ts            # 5-factor scoring with retrievability
├── five-factor-scoring.vitest.ts          # Five-factor scoring validation
├── rrf-fusion.vitest.ts                   # RRF fusion with k=60
├── bm25-index.vitest.ts                   # BM25 lexical indexing
├── bm25-security.vitest.ts                # BM25 security hardening
├── intent-classifier.vitest.ts            # 7 intent types
├── cross-encoder.vitest.ts                # Cross-encoder reranking
├── cross-encoder-extended.vitest.ts        # Extended cross-encoder tests
├── hybrid-search.vitest.ts                # Hybrid search
├── reranker.vitest.ts                     # Reranking logic
├── scoring.vitest.ts                      # General scoring tests
├── scoring-gaps.vitest.ts                 # Scoring coverage gaps
├── folder-scoring.vitest.ts               # Folder scoring logic
├── search-extended.vitest.ts              # Extended search tests
├── search-results-format.vitest.ts        # Search result formatting
├── vector-index-impl.vitest.ts            # Vector index implementation
├── embeddings.vitest.ts                   # Embedding pipeline
├── causal-boost.vitest.ts                 # Causal graph score boosting
├── session-boost.vitest.ts                # Session-recency score boosting
├── adaptive-fusion.vitest.ts              # 15 tests for adaptive fusion
├── adaptive-fallback.vitest.ts            # Adaptive fallback behavior
├── mmr-reranker.vitest.ts                 # MMR reranking
├── pagerank.vitest.ts                     # PageRank scoring
├── query-expander.vitest.ts               # Query expansion
├── sqlite-fts.vitest.ts                   # SQLite FTS5 search
├── structure-aware-chunker.vitest.ts      # Structure-aware document chunking
├── memory-search-quality-filter.vitest.ts # Memory search quality filtering
├── retrieval-trace.vitest.ts              # 17 tests for typed retrieval-trace contracts
├── retrieval-telemetry.vitest.ts          # 22 tests for retrieval telemetry
│
├── # Session & Recovery Tests
├── session-manager.vitest.ts              # Session deduplication
├── session-manager-extended.vitest.ts     # Extended session manager tests
├── continue-session.vitest.ts             # Session continuation
├── crash-recovery.vitest.ts               # Crash recovery
├── recovery-hints.vitest.ts               # Error code recovery hints
├── session-lifecycle.vitest.ts            # Session open/close lifecycle
├── working-memory-event-decay.vitest.ts   # Working memory event-driven decay
│
├── # Graph & Relations Tests
├── causal-edges.vitest.ts                 # Causal graph edges
├── causal-edges-unit.vitest.ts            # Causal edges unit tests
│
├── # MCP Handler Tests
├── handler-memory-context.vitest.ts       # Memory context handler
├── handler-memory-crud.vitest.ts          # Memory CRUD handler
├── handler-memory-index-cooldown.vitest.ts # Index scan cooldown hardening
├── handler-memory-save.vitest.ts          # Memory save handler
├── handler-memory-search.vitest.ts        # Memory search handler
├── handler-memory-triggers.vitest.ts      # Memory triggers handler
├── handler-memory-index.vitest.ts         # Memory index handler
├── handler-session-learning.vitest.ts     # Session learning handler
├── handler-causal-graph.vitest.ts         # Causal graph handler
├── handler-checkpoints.vitest.ts          # Checkpoints handler
├── handler-helpers.vitest.ts              # Handler utilities
├── intent-routing.vitest.ts              # Intent routing handler tests
│
├── # Infrastructure Tests
├── schema-migration.vitest.ts             # Schema migrations
├── modularization.vitest.ts               # Module structure
├── preflight.vitest.ts                    # Preflight validation
├── retry.vitest.ts                        # Retry logic
├── retry-manager.vitest.ts                # Retry manager
├── incremental-index.vitest.ts            # Incremental indexing
├── incremental-index-v2.vitest.ts         # Incremental indexing v2
├── index-refresh.vitest.ts                # Index refresh
├── interfaces.vitest.ts                   # Protocol interfaces
├── layer-definitions.vitest.ts            # 7-layer architecture
├── memory-types.vitest.ts                 # Memory types
├── tool-cache.vitest.ts                   # Tool caching
├── transaction-manager.vitest.ts          # Transaction management
├── transaction-manager-extended.vitest.ts # Extended transaction tests
├── api-key-validation.vitest.ts           # API key validation
├── api-validation.vitest.ts               # API validation
├── envelope.vitest.ts                     # Envelope handling
├── lazy-loading.vitest.ts                 # Lazy loading
├── channel.vitest.ts                      # Channel communication
├── context-server.vitest.ts               # Context server
├── errors-comprehensive.vitest.ts         # Error handling coverage
├── entity-scope.vitest.ts                 # Entity scope
├── history.vitest.ts                      # History module
├── extraction-adapter.vitest.ts           # Extraction adapter pipeline
├── redaction-gate.vitest.ts               # Redaction/safety gate
├── pressure-monitor.vitest.ts             # Cognitive pressure monitoring
├── rollout-policy.vitest.ts               # Feature rollout policy
├── config-cognitive.vitest.ts             # Cognitive configuration
├── anchor-id-simplification.vitest.ts     # Anchor ID simplification rules
├── anchor-prefix-matching.vitest.ts       # Anchor prefix matching logic
├── db-state-graph-reinit.vitest.ts        # DB state graph reinitialization
├── evidence-gap-detector.vitest.ts        # Evidence gap detection
├── graph-flags.vitest.ts                  # Graph feature flags
├── graph-regression-flag-off.vitest.ts    # Graph regression when flags off
├── graph-search-fn.vitest.ts              # Graph search functions
├── hybrid-search-flags.vitest.ts          # Hybrid search feature flags
├── search-flags.vitest.ts                 # Search feature flags
├── regression-010-index-large-files.vitest.ts # Large file indexing regression
├── tool-input-schema.vitest.ts            # Tool input schema validation
│
├── # Memory Operations Tests
├── memory-context.vitest.ts               # Unified context entry
├── memory-parser.vitest.ts                # Memory file parsing
├── memory-parser-extended.vitest.ts       # Extended memory parsing
├── memory-crud-extended.vitest.ts         # Extended CRUD operations
├── memory-save-extended.vitest.ts         # Extended save operations
├── memory-save-integration.vitest.ts      # PE gate + save handler
├── memory-search-integration.vitest.ts    # Testing effect integration
├── archival-manager.vitest.ts             # Archival system
├── access-tracker.vitest.ts               # Access tracking
├── access-tracker-extended.vitest.ts      # Extended access tracking
├── checkpoints-extended.vitest.ts         # Extended checkpoints
├── checkpoints-storage.vitest.ts          # Checkpoint storage
├── artifact-routing.vitest.ts             # 35 tests for artifact-class routing
├── mutation-ledger.vitest.ts              # 16 tests for append-only mutation ledger
│
├── # Trigger Tests
├── trigger-matcher.vitest.ts              # Trigger phrase matching
├── trigger-extractor.vitest.ts            # Trigger extraction
├── trigger-config-extended.vitest.ts      # Extended trigger config
│
├── # MCP Protocol Tests
├── mcp-error-format.vitest.ts             # MCP error formatting
├── mcp-input-validation.vitest.ts         # MCP input validation
├── mcp-response-envelope.vitest.ts        # MCP response envelopes
├── mcp-tool-dispatch.vitest.ts            # MCP tool dispatch
│
├── # Integration Tests
├── integration-causal-graph.vitest.ts     # Causal graph integration
├── integration-checkpoint-lifecycle.vitest.ts # Checkpoint lifecycle
├── integration-error-recovery.vitest.ts   # Error recovery integration
├── integration-learning-history.vitest.ts # Learning history integration
├── integration-save-pipeline.vitest.ts    # Save pipeline integration
├── integration-search-pipeline.vitest.ts  # Search pipeline integration
├── integration-session-dedup.vitest.ts    # Session dedup integration
├── integration-trigger-pipeline.vitest.ts # Trigger pipeline integration
├── phase2-integration.vitest.ts           # Phase 2 end-to-end integration
├── integration-138-pipeline.vitest.ts    # Spec 138 pipeline integration
├── pipeline-integration.vitest.ts        # General pipeline integration
│
├── # Targeted Bug Fix / Spec Tests
├── safety.vitest.ts                       # Safety constraint tests
├── tiered-injection-turnNumber.vitest.ts  # Tiered injection
├── causal-fixes.vitest.ts                 # Causal fixes
├── token-budget-enforcement.vitest.ts     # Token budget enforcement
├── search-archival.vitest.ts             # Search archival
├── protect-learning.vitest.ts             # Protect learning records
├── trigger-setAttentionScore.vitest.ts    # Trigger attention score
├── search-limits-scoring.vitest.ts        # Search limits/scoring
├── checkpoint-limit.vitest.ts             # Checkpoint limits
├── checkpoint-working-memory.vitest.ts    # Checkpoint working memory
├── decay-delete-race.vitest.ts            # Decay delete race condition
├── session-cleanup.vitest.ts              # Session cleanup
├── learning-stats-filters.vitest.ts       # Learning stats filters
├── full-spec-doc-indexing.vitest.ts      # Spec-doc indexing, schema v13, scoring, intent expansion
├── content-hash-dedup.vitest.ts          # Content hash deduplication
│
├── # Sprint 0 Eval Tests (Measurement Foundation)
├── eval-db.vitest.ts                     # Eval database infrastructure
├── eval-logger.vitest.ts                 # Eval logging pipeline
├── eval-metrics.vitest.ts                # Eval metrics computation
├── ceiling-quality.vitest.ts             # Ceiling quality proxy
├── ground-truth.vitest.ts                # Ground truth dataset
├── bm25-baseline.vitest.ts               # BM25 baseline measurement
├── degree-computation.vitest.ts          # Degree computation
├── rrf-degree-channel.vitest.ts          # RRF degree channel
├── consumption-logger.vitest.ts          # Consumption logging
├── scoring-observability.vitest.ts       # Scoring observability
├── edge-density.vitest.ts                # Edge density measurement
├── signal-vocab.vitest.ts                # Signal vocabulary
├── eval-the-eval.vitest.ts               # Meta-evaluation
├── token-budget.vitest.ts                # Token budget enforcement
├── quality-loop.vitest.ts                # Quality feedback loop
├── embedding-cache.vitest.ts             # Embedding cache
├── cold-start.vitest.ts                  # Cold start handling
├── intent-weighting.vitest.ts            # G2 intent classification
├── score-normalization.vitest.ts         # Score normalization
├── interference.vitest.ts                # Channel interference
├── decay.vitest.ts                       # Decay mechanisms
├── folder-relevance.vitest.ts            # Folder relevance scoring
├── graph-scoring-integration.vitest.ts   # Cross-sprint integration
├── query-classifier.vitest.ts            # Query classification
├── rsf-fusion.vitest.ts                  # RSF fusion
├── channel-representation.vitest.ts      # Channel representation
├── folder-discovery.vitest.ts            # Folder discovery
├── query-router.vitest.ts                # Query routing
├── rsf-multi.vitest.ts                   # RSF multi-channel
├── channel-enforcement.vitest.ts         # Channel enforcement
├── confidence-truncation.vitest.ts       # Confidence truncation
├── dynamic-token-budget.vitest.ts        # Dynamic token budget
├── shadow-comparison.vitest.ts           # Shadow comparison
├── rsf-vs-rrf-kendall.vitest.ts          # RSF vs RRF Kendall tau
├── query-router-channel-interaction.vitest.ts # Query router channel interaction
│
├── # Feature Eval Tests
├── feature-eval-graph-signals.vitest.ts  # Graph Signals feature evaluation
├── feature-eval-scoring-calibration.vitest.ts # Scoring Calibration feature evaluation
├── feature-eval-query-intelligence.vitest.ts  # Query Intelligence feature evaluation
├── cross-feature-integration-eval.vitest.ts   # Cross-feature integration evaluation
│
├── # Unit Tests (Focused Type/Logic Validation)
├── unit-composite-scoring-types.vitest.ts # Composite scoring types
├── unit-folder-scoring-types.vitest.ts    # Folder scoring types
├── unit-fsrs-formula.vitest.ts            # FSRS formula
├── unit-normalization.vitest.ts           # Normalization
├── unit-normalization-roundtrip.vitest.ts # Normalization roundtrip
├── unit-path-security.vitest.ts           # Path security
├── unit-rrf-fusion.vitest.ts              # RRF fusion unit
├── unit-tier-classifier-types.vitest.ts   # Tier classifier types
├── unit-transaction-metrics-types.vitest.ts # Transaction metrics types
├── batch-processor.vitest.ts              # Batch processor
│
├── # Test Support
├── fixtures/                              # Test fixtures and sample data
│
├── # Documentation
├── README.md                              # This file
└── VERIFICATION_REPORT.md                 # Phase 3 verification report
```

### Key Files

| File | Purpose |
|------|---------|
| `attention-decay.vitest.ts` | Multi-factor attention decay with FSRS integration |
| `composite-scoring.vitest.ts` | Weighted 5-factor scoring system |
| `prediction-error-gate.vitest.ts` | PE thresholds and contradiction detection |
| `fsrs-scheduler.vitest.ts` | FSRS algorithm calculations |
| `schema-migration.vitest.ts` | Schema migrations |
| `handler-memory-search.vitest.ts` | Memory search handler tests |
| `handler-memory-save.vitest.ts` | Memory save handler tests |
| `handler-memory-index-cooldown.vitest.ts` | memory_index_scan cooldown and rate-limit safety |
| `handler-session-learning.vitest.ts` | Session learning handler tests |
| `integration-save-pipeline.vitest.ts` | Save pipeline integration |
| `integration-search-pipeline.vitest.ts` | Search pipeline integration |
| `memory-save-integration.vitest.ts` | PE gate + save handler integration |
| `memory-search-integration.vitest.ts` | Testing effect integration |
| `full-spec-doc-indexing.vitest.ts` | 3-source indexing expectations, v13 fields, document-type scoring, find_spec/find_decision |

---

<!-- /ANCHOR:structure -->

## 4. FEATURES
<!-- ANCHOR:features -->

### Test Framework

**Vitest**: Modern TypeScript-native test runner

| Feature | Description |
|---------|-------------|
| `describe()` | Group related tests into suites |
| `it()` / `test()` | Define individual test cases |
| `expect()` | Built-in assertion library with rich matchers |
| `beforeEach()` / `afterEach()` | Setup and teardown hooks |
| `vi.fn()` / `vi.mock()` | Mocking and spying utilities |

```typescript
// Example test structure
import { describe, it, expect, beforeEach } from 'vitest';
import { calculate_decay } from '../lib/cognitive/attention-decay';

describe('Attention Decay', () => {
  it('calculates decay for normal tier', () => {
    const result = calculate_decay({ tier: 'normal', daysSinceAccess: 7 });
    expect(result.score).toBeGreaterThan(0.5);
    expect(result.score).toBeLessThan(0.9);
  });

  it('preserves constitutional tier memories', () => {
    const result = calculate_decay({ tier: 'constitutional', daysSinceAccess: 365 });
    expect(result.score).toBe(1.0);
  });
});
```

### Test Organization

**Category-Based Grouping**: Tests organized by functional domain

| Category | Coverage |
|----------|----------|
| Cognitive | Attention decay, working memory, co-activation, tier classification |
| Search & Scoring | Composite scoring, BM25, RRF fusion, cross-encoder, hybrid search |
| Handlers | MCP tool handlers (CRUD, search, save, triggers, context) |
| Integration | End-to-end pipelines (save, search, session, causal graph) |
| Infrastructure | Schema migration, retry, incremental indexing, transactions |
| Unit | Focused type/logic validation for specific modules |
| Eval | Measurement foundation, Graph Signals / Scoring Calibration / Query Intelligence feature evals, cross-feature integration |

### Running Tests

**Run all tests:**
```bash
npx vitest run
```

**Run specific file:**
```bash
npx vitest run tests/attention-decay.vitest.ts
```

**Run tests matching a pattern:**
```bash
npx vitest run --reporter=verbose tests/handler-*.vitest.ts
```

**Watch mode (re-runs on file change):**
```bash
npx vitest
```

---

<!-- /ANCHOR:features -->

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Run All Tests

```bash
npx vitest run

# Output (example):
#  PASS  tests/attention-decay.vitest.ts (137 tests)
#  PASS  tests/composite-scoring.vitest.ts (101 tests)
#  PASS  tests/working-memory.vitest.ts (51 tests)
#  ...
#  Test Files  226 passed
#  Tests       7003 passed
```

### Example 2: Run Specific Feature Test

```bash
# Test attention decay module
npx vitest run tests/attention-decay.vitest.ts

# Output:
#  PASS  tests/attention-decay.vitest.ts
#   Attention Decay
#     > calculates decay for normal tier
#     > preserves constitutional tier
#     > applies fast decay for temporary tier
```

### Example 3: Run Tests with Verbose Output

```bash
npx vitest run --reporter=verbose tests/composite-scoring.vitest.ts

# Shows each individual test case with pass/fail status
```

### Example 4: Run Tests by Category

```bash
# All handler tests
npx vitest run tests/handler-*.vitest.ts

# All integration tests
npx vitest run tests/integration-*.vitest.ts

# All unit tests
npx vitest run tests/unit-*.vitest.ts
```

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Full suite | `npx vitest run` | Before commits, full validation |
| Single file | `npx vitest run tests/[name].vitest.ts` | Focused development |
| Watch mode | `npx vitest` | Active development, auto re-run |
| Pattern match | `npx vitest run tests/handler-*.vitest.ts` | Test a category |
| Verbose | `npx vitest run --reporter=verbose` | Debug failures |

---

<!-- /ANCHOR:usage-examples -->

## 6. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Module not found errors

**Symptom**: `Error: Cannot find module '../lib/cognitive/attention-decay'`

**Cause**: TypeScript path resolution issue or missing build

**Solution**:
```bash
# Ensure the project is built
cd .opencode/skill/system-spec-kit/mcp_server
npm run build

# Vitest uses ts-node/esbuild for TypeScript. Check vitest.config.ts
```

#### Database connection errors

**Symptom**: `Error: unable to open database file`

**Cause**: Database file missing or incorrect path

**Solution**:
```bash
# Check database exists
ls -la .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Create database if missing (auto-created on first MCP server run)
```

#### Embedding API errors in tests

**Symptom**: Tests fail with embedding-related errors

**Solution**:
```bash
# Set API key for embedding tests
export VOYAGE_API_KEY="your-key-here"
npx vitest run
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing database | Run MCP server once to initialize |
| Embedding API errors | Set `VOYAGE_API_KEY` environment variable |
| Import errors | Run `npm run build`, check vitest config |
| Timeout errors | Increase timeout in vitest config or individual test |

### Diagnostic Commands

```bash
# Verify vitest is available
npx vitest --version

# List test files
ls tests/*.vitest.ts | wc -l
# Expected: 226

# Run tests with detailed output
npx vitest run --reporter=verbose 2>&1 | head -50
```

---

<!-- /ANCHOR:troubleshooting -->

## 7. RUNNING VERIFICATION
<!-- ANCHOR:verification -->

### Full Verification Run

```bash
# Navigate to mcp_server directory
cd .opencode/skill/system-spec-kit/mcp_server

# Run the complete test suite
npx vitest run

# Run with coverage
npx vitest run --coverage
```

### Category-Specific Runs

```bash
# Cognitive tests
npx vitest run tests/attention-decay.vitest.ts tests/co-activation.vitest.ts tests/working-memory.vitest.ts tests/tier-classifier.vitest.ts

# Handler tests
npx vitest run tests/handler-*.vitest.ts

# Integration tests
npx vitest run tests/integration-*.vitest.ts

# Search & scoring tests
npx vitest run tests/composite-scoring.vitest.ts tests/five-factor-scoring.vitest.ts tests/bm25-index.vitest.ts tests/rrf-fusion.vitest.ts
```

### Verification Notes

This directory does not include a standalone `VERIFICATION_REPORT.md`.
Use `npx vitest run` output and CI logs for current verification details.

---

<!-- /ANCHOR:verification -->

## 8. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Overview of the MCP server architecture |
| [Library README](../lib/README.md) | Documentation for modules being tested |
| [Handlers README](../handlers/README.md) | MCP handler implementation details |
| [Utils README](../utils/README.md) | Utility functions used in tests |

### Test Coverage

| Module | Test File | Coverage Area |
|--------|-----------|---------------|
| FSRS Scheduler | `fsrs-scheduler.vitest.ts` | Retrievability, stability, difficulty |
| Prediction Error Gate | `prediction-error-gate.vitest.ts` | Thresholds, contradiction, action logic |
| Composite Scoring | `composite-scoring.vitest.ts` | Weight config, scoring calculations |
| Schema Migration | `schema-migration.vitest.ts` | Column existence, defaults, migrations |
| Memory Save | `memory-save-integration.vitest.ts` | PE gate + save handler integration |
| Memory Search | `memory-search-integration.vitest.ts` | Testing effect, hybrid search |
| Session Learning | `handler-session-learning.vitest.ts` | Preflight, postflight, learning history |
| Memory Handlers | `handler-memory-crud.vitest.ts` | Search, triggers, CRUD, save, index |
| Attention Decay | `attention-decay.vitest.ts` | Decay rates, FSRS integration, tier behavior |
| Co-Activation | `co-activation.vitest.ts` | Related memory boosting, spreading activation |
| Working Memory | `working-memory.vitest.ts` | Capacity limits, eviction, session management |
| Tier Classifier | `tier-classifier.vitest.ts` | Six-tier classification, keyword detection |
| Archival Manager | `archival-manager.vitest.ts` | Archival system lifecycle |
| Spec Document Indexing | `full-spec-doc-indexing.vitest.ts` | Schema v13 fields (`document_type`, `spec_level`), 8 spec doc types, scoring multipliers, 7 intents |
| Index Scan Hardening | `handler-memory-index-cooldown.vitest.ts` | Scan cooldown/rate-limit behavior for `memory_index_scan` |
| Graph Signals Eval | `feature-eval-graph-signals.vitest.ts` | Graph Signals feature evaluation metrics |
| Scoring Calibration Eval | `feature-eval-scoring-calibration.vitest.ts` | Scoring Calibration feature evaluation metrics |
| Query Intelligence Eval | `feature-eval-query-intelligence.vitest.ts` | Query Intelligence feature evaluation metrics |
| Cross-Feature Integration | `cross-feature-integration-eval.vitest.ts` | Cross-feature integration evaluation |
| Embedding Cache | `embedding-cache.vitest.ts` | Embedding cache deduplication and hit rates |
| BM25 Baseline | `bm25-baseline.vitest.ts` | BM25 lexical baseline measurement |

### External Resources

| Resource | Description |
|----------|-------------|
| [Vitest Documentation](https://vitest.dev/) | Vitest test framework reference |
| [better-sqlite3 Testing](https://github.com/WiseLibs/better-sqlite3/wiki/Testing) | Database testing patterns |
| [MCP Testing Guide](https://modelcontextprotocol.io/testing) | MCP protocol testing best practices |

---

<!-- /ANCHOR:related -->

*Documentation version: 2.2 | Last updated: 2026-02-28*
