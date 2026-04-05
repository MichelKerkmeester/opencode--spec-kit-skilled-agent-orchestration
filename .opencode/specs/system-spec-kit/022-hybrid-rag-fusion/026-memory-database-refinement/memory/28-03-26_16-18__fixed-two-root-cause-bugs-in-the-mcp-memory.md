---
title: "...kit/022-hybrid-rag-fusion/026-memory-database-refinement/28-03-26_16-18__fixed-two-root-cause-bugs-in-the-mcp-memory]"
trigger_phrases:
  - "active_memory_projection unique constraint"
  - "cannot start a transaction within a transaction"
  - "scan failures force re-index"
  - "projection eviction stale rows"
  - "nested transaction savepoint fix"
  - "memory-save begin immediate bug"
  - "t088 t088b fixes"
  - "active memory id"
  - "root cause"
  - "better sqlite3"
  - "content hash"
  - "replace manual"
  - "manual sql"
  - "sql transaction"
  - "transaction management"
  - "management better-sqlite3"
  - "better-sqlite3 transaction"
  - "transaction api"
  - "api enable"
  - "enable proper"
  - "proper savepoint"
  - "savepoint nesting"
  - "memory server"
  - "memory database"
  - "the callback system"
  - "evict stale"
  - "stale projection"
  - "projection rows"
  - "rows delete"
  - "delete active"
  - "logical key!=?"
  - "key!=? insert"
  - "memory database refinement"
  - "scan pipeline transaction bug"
importance_tier: "critical"
contextType: "implementation"
_sourceSessionCreated: 0
_sourceSessionId: ""
_sourceSessionUpdated: 0
_sourceTranscriptPath: ""
captured_file_count: 3
filesystem_file_count: 3
git_changed_file_count: 0
quality_flags: []
quality_score: 1.00
spec_folder_health: {"pass":true,"score":0.85,"errors":0,"warnings":3}
---
# Fixed Two Root Cause Bugs In The Mcp Memory

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-28 |
| Session ID | session-1774711135291-b8f4568f472c |
| Spec Folder | system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement |
| Channel | main |
| Importance Tier | critical |
| Context Type | implementation |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 3 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-28 |
| Created At (Epoch) | 1774711135 |
| Last Accessed (Epoch) | 1774711135 |
| Access Count | 1 |

---

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
- [IMPLEMENTATION GUIDE](#implementation-guide)
- [OVERVIEW](#overview)
- [DETAILED CHANGES](#detailed-changes)
- [DECISIONS](#decisions)
- [CONVERSATION](#conversation)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 20% |
| Last Activity | 2026-03-28T15:18:55.281Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** IMPLEMENTATION

**Recent:** Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting, Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback, Next Steps

**Decisions:** 3 decisions recorded

### Pending Work

- [ ] **T001**: Restart MCP server and re-run force scan to verify 0 failures (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement
Last: Next Steps
Next: Restart MCP server and re-run force scan to verify 0 failures
```

**Key Context to Review:**

- Files modified: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts, .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts, .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts

- Check: plan.md, tasks.md, checklist.md

- Last: Next Steps

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | IMPLEMENTATION |
| Active File | .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts |
| Last Action | Next Steps |
| Next Action | Restart MCP server and re-run force scan to verify 0 failures |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist

**Key Topics:** `better-sqlite3 transaction` | `management better-sqlite3` | `transaction management` | `savepoint nesting` | `proper savepoint` | `sql transaction` | `transaction api` | `replace manual` | `enable proper` | `manual sql` | `api enable` | `moved content-hash` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Two root-cause bugs in the MCP memory server that caused scan failures during force re-index:...** - Fixed two root-cause bugs in the MCP memory server that caused scan failures during force re-index: (1) UNIQUE constraint violation on active_memory_projection.

**Key Files and Their Roles**:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` - Modified vector index mutations

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` - Modified lineage state

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` - Modified memory save

**How to Extend**:

- Add new modules following the existing file structure patterns

- Follow the established API pattern for new endpoints

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Fixed two root-cause bugs in the MCP memory server that caused scan failures during force re-index:...; Evict stale projection rows (DELETE WHERE active_memory_id=?; Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting

**Key Outcomes**:
- Fixed two root-cause bugs in the MCP memory server that caused scan failures during force re-index:...
- Evict stale projection rows (DELETE WHERE active_memory_id=?
- Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting
- Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback
- Next Steps

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/(merged-small-files)` | Tree-thinning merged 1 small files (vector-index-mutations.ts).  Merged from .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts : Database.transaction() |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/(merged-small-files)` | Tree-thinning merged 1 small files (lineage-state.ts).  Merged from .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts : Database.transaction() |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/(merged-small-files)` | Tree-thinning merged 1 small files (memory-save.ts).  Merged from .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts : So inner transaction() calls nest via SAVEPOINTs |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-two-rootcause-bugs-mcp-d0337d3a -->
### FEATURE: Fixed two root-cause bugs in the MCP memory server that caused scan failures during force re-index:...

Fixed two root-cause bugs in the MCP memory server that caused scan failures during force re-index: (1) UNIQUE constraint violation on active_memory_projection.active_memory_id — added stale projection row eviction before upsert in both vector-index-mutations.ts and lineage-state.ts; (2) 'cannot start a transaction within a transaction' — replaced manual BEGIN IMMEDIATE/COMMIT/ROLLBACK with database.transaction().immediate() in memory-save.ts so inner transaction() calls nest via SAVEPOINTs....

**Details:** active_memory_projection UNIQUE constraint | cannot start a transaction within a transaction | scan failures force re-index | projection eviction stale rows | nested transaction savepoint fix | memory-save BEGIN IMMEDIATE bug | T088 T088b fixes
<!-- /ANCHOR:implementation-two-rootcause-bugs-mcp-d0337d3a -->

<!-- ANCHOR:guide-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Restart MCP server and re-run force scan to verify 0 failures Phase 8: Reconcile 50 cross-agent integration test failures Phase 9: Triage 41 P2 findings

**Details:** Next: Restart MCP server and re-run force scan to verify 0 failures | Follow-up: Phase 8: Reconcile 50 cross-agent integration test failures | Follow-up: Phase 9: Triage 41 P2 findings
<!-- /ANCHOR:guide-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-evict-stale-projection-rows-5e83137d -->
### Decision 1: Evict stale projection rows (DELETE WHERE active_memory_id=? AND logical_key!=?) before INSERT to handle logical key drift during re-index

**Context**: Evict stale projection rows (DELETE WHERE active_memory_id=? AND logical_key!=?) before INSERT to handle logical key drift during re-index

**Timestamp**: 2026-03-28T15:18:55.328Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Evict stale projection rows (DELETE WHERE active_memory_id=? AND logical_key!=?) before INSERT to handle logical key drift during re-index

#### Chosen Approach

**Selected**: Evict stale projection rows (DELETE WHERE active_memory_id=? AND logical_key!=?) before INSERT to handle logical key drift during re-index

**Rationale**: AND logical_key!=?) before INSERT to handle logical key drift during re-index

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-evict-stale-projection-rows-5e83137d -->

---

<!-- ANCHOR:decision-replace-manual-sql-transaction-d330bb8c -->
### Decision 2: Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting

**Context**: Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting

**Timestamp**: 2026-03-28T15:18:55.328Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting

#### Chosen Approach

**Selected**: Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting

**Rationale**: Replace manual SQL transaction management with better-sqlite3 transaction() API to enable proper SAVEPOINT nesting

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-replace-manual-sql-transaction-d330bb8c -->

---

<!-- ANCHOR:decision-moved-contenthash-dedup-check-ad9ccd36 -->
### Decision 3: Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback

**Context**: Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback

**Timestamp**: 2026-03-28T15:18:55.328Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback

#### Chosen Approach

**Selected**: Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback

**Rationale**: Moved content-hash dedup check outside the write transaction since reads are safe outside and it avoids early return inside the callback

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-moved-contenthash-dedup-check-ad9ccd36 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Debugging** - 1 actions
- **Discussion** - 2 actions
- **Implementation** - 1 actions
- **Verification** - 1 actions

---

### Message Timeline

> **User** | 2026-03-28 @ 16:18:55

Fixed two root-cause bugs in the MCP memory server that caused scan failures during force re-index: (1) UNIQUE constraint violation on active_memory_projection.active_memory_id — added stale projection row eviction before upsert in both vector-index-mutations.ts and lineage-state.ts; (2) 'cannot start a transaction within a transaction' — replaced manual BEGIN IMMEDIATE/COMMIT/ROLLBACK with database.transaction().immediate() in memory-save.ts so inner transaction() calls nest via SAVEPOINTs. Also cleaned up 22 test memories from specs/999-atomic-save-fi folder. Build compiles clean (only pre-existing context-server.ts errors remain). MCP server restart needed for runtime verification.

---

<!-- /ANCHOR:session-history -->

---

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement", limit: 10 })

# Verify memory file integrity
ls -la system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

<!-- /ANCHOR:recovery-hints -->

---

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1774711135291-b8f4568f472c"
spec_folder: "system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement"
channel: "main"

# Git Provenance (M-007d)
head_ref: ""
commit_ref: ""
repository_state: "unavailable"
is_detached_head: No

# Classification
importance_tier: "critical"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "implementation"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "procedural"         # episodic|procedural|semantic|constitutional
  half_life_days: 180     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9962           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1.6 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "f133100f9711dc1b22d9db22d94795ca4a1500ac"         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:

    []

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-03-28"
created_at_epoch: 1774711135
last_accessed_epoch: 1774711135
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 3
tool_count: 0
file_count: 3
captured_file_count: 3
filesystem_file_count: 3
git_changed_file_count: 0
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "better-sqlite3 transaction"
  - "management better-sqlite3"
  - "transaction management"
  - "savepoint nesting"
  - "proper savepoint"
  - "sql transaction"
  - "transaction api"
  - "replace manual"
  - "enable proper"
  - "manual sql"
  - "api enable"
  - "moved content-hash"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "active_memory_projection UNIQUE constraint"
  - "cannot start a transaction within a transaction"
  - "scan failures force re-index"
  - "projection eviction stale rows"
  - "nested transaction savepoint fix"
  - "memory-save BEGIN IMMEDIATE bug"
  - "T088 T088b fixes"
  - "active memory id"
  - "root cause"
  - "better sqlite3"
  - "content hash"
  - "replace manual"
  - "manual sql"
  - "sql transaction"
  - "transaction management"
  - "management better-sqlite3"
  - "better-sqlite3 transaction"
  - "transaction api"
  - "api enable"
  - "enable proper"
  - "proper savepoint"
  - "savepoint nesting"
  - "memory server"
  - "memory database"
  - "the callback system"
  - "evict stale"
  - "stale projection"
  - "projection rows"
  - "rows delete"
  - "delete active"
  - "logical key!=?"
  - "key!=? insert"
  - "memory database refinement"
  - "scan pipeline transaction bug"

key_files:
  - ".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts"
  - ".opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts"
  - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts"

# Relationships
related_sessions:

  []

parent_spec: "system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "voyage-4"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

