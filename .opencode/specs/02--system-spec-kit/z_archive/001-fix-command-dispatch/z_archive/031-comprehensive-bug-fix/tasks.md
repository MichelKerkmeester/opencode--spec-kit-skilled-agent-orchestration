---
title: "Task Breakdown by Agent [031-comprehensive-bug-fix/tasks]"
description: "tasks document for 031-comprehensive-bug-fix."
trigger_phrases:
  - "task"
  - "breakdown"
  - "agent"
  - "tasks"
  - "031"
  - "comprehensive"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown by Agent

## Agent 1: Buffer & Embedding Core
- [x] P0-001: Fix Buffer.from() byteOffset (vector-index.js:41-48)
- [ ] P0-002: Fix query buffer conversion (vector-index.js:748-750)
- [ ] P1-001: Add effective_importance to ranking (vector-index.js:843-849)
- [ ] P1-002: Fix division by zero in decay (vector-index.js:759-761)
- [ ] P1-003: Fix multi-concept params (vector-index.js:982-987)
- [ ] P2-001: Fix constitutional token estimation (vector-index.js:786-789)
- [ ] P2-002: Add embedding dimension validation

## Agent 2: MCP Schema & Validation
- [ ] P0-003: Fix memory_load schema (semantic-memory.js:253)
- [ ] P1-004: Add includeContiguity to hybrid search (semantic-memory.js:601-631)
- [ ] P1-005: Add importanceWeight validation (semantic-memory.js:956-974)
- [ ] P1-006: Add specFolder type validation to all handlers
- [ ] P1-007: Fix return structure consistency
- [ ] P2-003: Fix memory_search schema documentation
- [ ] P2-004: Add embedding dimension validation

## Agent 3: Database Integrity
- [ ] P0-004: Add PRAGMA foreign_keys = ON (vector-index.js:103)
- [ ] P1-008: Add timestamp-only index (vector-index.js:395)
- [ ] P1-009: Wrap undoLastChange in transaction (history.js:205-316)
- [ ] P1-010: Fix schema migration race (vector-index.js:131-208)
- [ ] P2-005: Fix column name mismatch (history.js:263-291)
- [ ] P2-006: Implement expires_at filtering
- [ ] P2-007: Fix statement cache leak (history.js:12-26)

## Agent 4: Checkpoint System
- [ ] P0-005: Add JSON.parse try-catch (checkpoints.js:160)
- [ ] P0-006: Fix transaction error handling (checkpoints.js:207-219)
- [ ] P0-007: Preserve embeddings on restore (checkpoints.js:235-267)
- [ ] P1-011: Fix global checkpoint clear (checkpoints.js:203-232)
- [ ] P1-012: Make limit enforcement atomic (checkpoints.js:88-100)
- [ ] P1-013: Add batching for IN clause (checkpoints.js:213-215)
- [ ] P2-008: Fix TTL cleanup stale list (checkpoints.js:102-110)
- [ ] P2-009: Fix duplicate insertion counting (checkpoints.js:261-266)

## Agent 5: Memory Parser
- [ ] P0-008: Add multi-line YAML trigger parsing (memory-parser.js:130-148)
- [ ] P0-009: Add YAML title extraction (memory-parser.js:114-118)
- [ ] P1-014: Add anchor ID validation (memory-parser.js:272-305)
- [ ] P1-015: Fix UNC path handling (memory-parser.js:81-106)
- [ ] P2-010: Add encoding detection (memory-parser.js:53)
- [ ] P2-011: Reduce min content length (memory-parser.js:321-327)
- [ ] P2-012: Expand context type map (memory-parser.js:26-35)

## Agent 6: Search & Ranking
- [ ] P1-016: Fix startup scan race condition (semantic-memory.js:1661)
- [ ] P1-017: Add sqlite-vec status to responses
- [ ] P2-013: Fix minSimilarity default docs
- [ ] P2-014: Document FTS5 column limitation
- [ ] P2-015: Fix isFtsAvailable error handling (vector-index.js:1189-1197)
- [ ] P2-016: Fix cleanupOrphans log level (vector-index.js:1143)

## Agent 7: Configuration
- [ ] P0-010: Fix halfLifeDays terminology (config.jsonc, scoring.js)
- [ ] P1-018: Add constitutional tier to search-weights.json
- [ ] P1-019: Connect unused config sections
- [ ] P1-020: Add config validation function
- [ ] P2-017: Consolidate duplicate rrfK
- [ ] P2-018: Fix decayExempt naming
- [ ] P2-019: Sync filters.jsonc docs
- [ ] P2-020: Fix accessTracking structure

## Agent 8: Error Handling
- [ ] P0-011: Fix silent promise swallowing (semantic-memory.js:82)
- [ ] P0-012: Fix embedding failure propagation (semantic-memory.js:989-992)
- [ ] P1-021: Create lib/errors.js with error codes
- [ ] P1-022: Add retry logic for transient failures
- [ ] P1-023: Fix warmup failure handling
- [ ] P2-021: Standardize logging levels
- [ ] P2-022: Add operation timeouts
- [ ] P2-023: Improve error messages

## Agent 9: generate-context.js
- [ ] P0-013: Fix duplicated spec folder validation (line 2431-2505)
- [ ] P1-024: Fix JSONC parser (line 110-127)
- [ ] P1-025: Add truncation warning (line 3188-3193)
- [ ] P1-026: Fix config edge cases
- [ ] P2-024: Extract magic numbers to CONFIG
- [ ] P2-025: Add null check in observations (line 3243-3274)
- [ ] P2-026: Fix date parsing validation (line 3118-3124)
- [ ] P2-027: Re-enable template validation (line 2103-2113)

## Agent 10: Documentation
- [ ] P1-027: Fix README file paths
- [ ] P1-028: Standardize command syntax
- [ ] P1-029: Document save methods distinction
- [ ] P1-030: Add includeContiguity to docs
- [ ] P2-028: Update version numbers
- [ ] P2-029: Remove unimplemented commands
- [ ] P2-030: Fix RRF section placement
- [ ] P2-031: Add anchor ID format docs
