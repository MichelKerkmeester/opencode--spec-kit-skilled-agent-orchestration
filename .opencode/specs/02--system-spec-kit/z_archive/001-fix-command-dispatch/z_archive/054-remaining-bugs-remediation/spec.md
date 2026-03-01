---
title: "Spec: Remaining Bugs Remediation [054-remaining-bugs-remediation/spec]"
description: "Following comprehensive analysis of spec folders 052-codebase-fixes and 053-script-analysis-testing, along with a deep bug hunt of the Spec Kit Memory system, 13 bugs were ident..."
trigger_phrases:
  - "spec"
  - "remaining"
  - "bugs"
  - "remediation"
  - "054"
importance_tier: "important"
contextType: "decision"
---
# Spec: Remaining Bugs Remediation

| Field | Value |
|-------|-------|
| **Spec ID** | 054-remaining-bugs-remediation |
| **Status** | Draft |
| **Level** | 3 (≥500 LOC expected) |
| **Created** | 2026-01-01 |
| **Parent** | 003-memory-and-spec-kit |

---

## 1. Problem Statement

Following comprehensive analysis of spec folders 052-codebase-fixes and 053-script-analysis-testing, along with a deep bug hunt of the Spec Kit Memory system, **13 bugs** were identified that require remediation:

- **2 Critical (P0)**: Race conditions and transaction safety
- **5 Major (P1)**: Startup timing, caching, and validation issues  
- **6 Minor (P2)**: Edge cases and code quality improvements

### 1.1 Impact Assessment

| Severity | Count | Risk |
|----------|-------|------|
| Critical | 2 | Data loss, system inconsistency |
| Major | 5 | Degraded functionality, stale data |
| Minor | 6 | Edge cases, maintainability |

---

## 2. Bug Inventory

### 2.1 Critical Bugs (P0)

#### BUG-001: Race Condition - Dual Database Connection
- **Location**: `scripts/generate-context.js:2856-2868`
- **Description**: When generate-context.js indexes a memory file, it writes directly to SQLite while the MCP server maintains its own connection. Changes may not be visible to the running MCP server due to SQLite connection caching.
- **Impact**: Memory files indexed via script won't appear in MCP searches until server restart
- **Root Cause**: Separate database connections without coordination mechanism

#### BUG-002: Missing Transaction Rollback for Vector Index Failures
- **Location**: `mcp_server/lib/vector-index.js:993-1024`
- **Description**: In indexMemory(), if vector insertion fails after metadata is inserted, the metadata remains creating an orphaned record
- **Impact**: Database inconsistency - metadata exists without corresponding vector
- **Root Cause**: Transaction doesn't properly handle partial failures

### 2.2 Major Bugs (P1)

#### BUG-003: Embedding Dimension Mismatch at Startup
- **Location**: `mcp_server/lib/vector-index.js:60-83`
- **Description**: getEmbeddingDim() falls back to legacy 768 dimensions before provider warmup. Schema may be created with wrong dimensions.
- **Impact**: Vector dimension mismatch errors with Voyage (1024) or OpenAI (1536)
- **Root Cause**: Schema creation before provider confirmation

#### BUG-004: Constitutional Cache Stale After External Edits
- **Location**: `mcp_server/lib/vector-index.js:231-232`
- **Description**: constitutionalCache uses 5-minute TTL but isn't cleared on external database edits
- **Impact**: Stale constitutional memories for up to 5 minutes
- **Root Cause**: No file/database modification detection

#### BUG-005: Rate Limiting Not Persistent
- **Location**: `mcp_server/context-server.js:70-71`
- **Description**: lastIndexScanTime is in-memory only, resets on server restart
- **Impact**: Potential resource exhaustion if server crash-loops with scan requests
- **Root Cause**: No persistence layer for rate limit state

#### BUG-006: Prepared Statement Cache Not Cleared
- **Location**: `mcp_server/lib/vector-index.js:277-280`
- **Description**: preparedStatements cache not cleared in all database reset scenarios
- **Impact**: Stale prepared statements after database reset
- **Root Cause**: Missing clearPreparedStatements() calls in reset paths

#### BUG-007: Empty Query Edge Case
- **Location**: `mcp_server/context-server.js:654`
- **Description**: Query validation uses trim() but whitespace-only queries after prefix addition may slip through
- **Impact**: Potential edge case errors
- **Root Cause**: Validation timing issue

### 2.3 Minor Bugs (P2)

#### BUG-008: UTF-8 BOM Detection Missing
- **Location**: `mcp_server/lib/memory-parser.js:56-66`
- **Description**: Only UTF-16 LE/BE BOMs detected, not UTF-8 BOM (EF BB BF)
- **Impact**: UTF-8 BOM files may have invisible characters

#### BUG-009: Search Cache Key Collision Risk
- **Location**: `mcp_server/lib/vector-index.js:2651`
- **Description**: Cache key format could collide if query contains colons
- **Impact**: Very low probability cache collisions

#### BUG-010: Trigger Phrase Limit Hardcoded
- **Location**: `mcp_server/lib/vector-index.js:2387`
- **Description**: Max 10 triggers per memory is hardcoded
- **Impact**: Cannot be configured per deployment

#### BUG-011: Non-Interactive Mode Silent Fallback
- **Location**: `scripts/generate-context.js:3574-3579`
- **Description**: Non-TTY environments return defaults with only a warning
- **Impact**: CI/CD may save to wrong folders silently

#### BUG-012: Magic Numbers in Scoring
- **Location**: `mcp_server/lib/vector-index.js` (applySmartRanking)
- **Description**: Hardcoded weights (0.5, 0.3, 0.2) should be CONFIG constants
- **Impact**: Maintainability, tuning difficulty

#### BUG-013: Orphaned Vector Cleanup Only at Startup
- **Location**: `mcp_server/lib/vector-index.js:3120-3168`
- **Description**: verifyIntegrity() checks but doesn't auto-clean orphaned vectors
- **Impact**: Database bloat over time

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Bug |
|----|-------------|----------|-----|
| FR-001 | Database changes must be visible across all connections within 1 second | P0 | BUG-001 |
| FR-002 | Failed vector insertions must not leave orphaned metadata | P0 | BUG-002 |
| FR-003 | Schema creation must wait for provider dimension confirmation | P1 | BUG-003 |
| FR-004 | Constitutional cache must invalidate on database modification | P1 | BUG-004 |
| FR-005 | Rate limiting state must persist across restarts | P1 | BUG-005 |
| FR-006 | Prepared statements must be cleared on all reset paths | P1 | BUG-006 |
| FR-007 | Empty/whitespace queries must be rejected before processing | P1 | BUG-007 |
| FR-008 | UTF-8 BOM must be detected and handled | P2 | BUG-008 |
| FR-009 | Cache keys must use collision-resistant format | P2 | BUG-009 |
| FR-010 | Trigger phrase limit must be configurable | P2 | BUG-010 |
| FR-011 | Non-interactive mode must fail explicitly for folder selection | P2 | BUG-011 |
| FR-012 | Scoring weights must be defined as CONFIG constants | P2 | BUG-012 |
| FR-013 | Orphaned vectors must be auto-cleaned on integrity check | P2 | BUG-013 |

### 3.2 Non-Functional Requirements

| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-001 | No performance regression | <5% latency increase |
| NFR-002 | Backward compatibility | Existing checkpoints must restore |
| NFR-003 | Test coverage | All fixes must have unit tests |

---

## 4. Success Criteria

- [ ] All 2 P0 bugs fixed and verified
- [ ] All 5 P1 bugs fixed and verified
- [ ] All 6 P2 bugs fixed and verified
- [ ] No regression in existing tests
- [ ] MCP server health check passes
- [ ] Memory search returns correct results
- [ ] Checkpoint create/restore works with all embedding providers

---

## 5. Out of Scope

- God module refactoring (generate-context.js splitting) - separate spec
- Cross-boundary import cleanup - separate spec
- New feature development

---

## 6. References

- [052-codebase-fixes](../052-codebase-fixes/) - Prior bug fix work
- [053-script-analysis-testing](../053-script-analysis-testing/) - Workflow testing spec
- [048-system-analysis](../048-system-analysis/) - System analysis findings
