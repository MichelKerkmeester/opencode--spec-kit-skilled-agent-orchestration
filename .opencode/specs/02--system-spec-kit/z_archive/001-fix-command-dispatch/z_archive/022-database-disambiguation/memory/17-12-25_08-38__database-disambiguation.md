---
title: "Key Topics: troubleshooting | disambiguation | [022-database-disambiguation/17-12-25_08-38__database-disambiguation]"
importance_tier: "normal"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2025-12-17 |
| Session ID | session-1765957107443-e6fa46d1n |
| Spec Folder | 005-memory/012-database-disambiguation |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 3 |
| Follow-up Items Recorded | 0 |
| Created At | 2025-12-17 |
| Created At (Epoch) | 1765957107 |
| Last Accessed (Epoch) | 1765957107 |
| Access Count | 1 |

**Key Topics:** `troubleshooting` | `disambiguation` | `distinguishing` | `documentation` | `conversations` | `conversation` | `requirement` | `discovered` | `subsection` | `comparison` | 

---

<!-- ANCHOR:preflight-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Uncertainty Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Context Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Timestamp | 2025-12-17 | Session start |

**Initial Gaps Identified:**

- Not assessed (migrated from older format)

**Dual-Threshold Status at Start:**
- Confidence: N/A
- Uncertainty: N/A
- Readiness: N/A
<!-- /ANCHOR:preflight-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

---

<!-- ANCHOR:continue-session-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | COMPLETED |
| Completion % | 100% |
| Last Activity | 2025-12-17 |
| Time in Session | N/A |
| Continuation Count | 0 |

### Context Summary

This session was migrated from an older format to v2.2. Review the OVERVIEW and DECISIONS sections for session content.

### Pending Work

- No pending tasks - session completed

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 005-memory/012-database-disambiguation
```
<!-- /ANCHOR:continue-session-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

---

<!-- ANCHOR:task-guide-memory/012-database-disambiguation-005-memory/012-database-disambiguation -->
## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **User requested to clean and re-index the semantic memory database. During execution, discovered a...** - User requested to clean and re-index the semantic memory database.

- **Technical Implementation Details** - rootCause: Similar naming of semantic_search and semantic_memory MCPs caused confusion about which database to delete; semanticSearchDB: .

**Key Files and Their Roles**:

- `AGENTS.md` - Documentation

**How to Extend**:

- Reference existing implementations as patterns for new features

**Common Patterns**:

- **Data Normalization**: Clean and standardize data before use

- **Caching**: Cache expensive computations or fetches

<!-- /ANCHOR:task-guide-memory/012-database-disambiguation-005-memory/012-database-disambiguation -->

---

<!-- ANCHOR:summary-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
## 2. OVERVIEW

User requested to clean and re-index the semantic memory database. During execution, discovered a critical documentation gap: AI agent confused two separate 'semantic' MCP systems (semantic_search for code indexing at .codebase/vectors.db vs semantic_memory for conversation context at .opencode/skills/workflows-memory/database/memory-index.sqlite). Root cause analysis revealed the similar naming and lack of clear disambiguation in AGENTS.md. Fixed by adding a new subsection to AGENTS.md Section 5 with a comparison table, database locations, and troubleshooting guidance. Database cleanup completed but OpenCode restart required to clear MCP server's in-memory cache before re-indexing can succeed.

**Key Outcomes**:
- User requested to clean and re-index the semantic memory database. During execution, discovered a...
- Decision 1: Added disambiguation section to AGENTS.
- Decision 2: Documented the restart requirement - MCP servers cache database stat
- Decision 3: Used Sequential Thinking MCP for systematic root cause analysis - 10
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `AGENTS.md` | Section 5 with a comparison table |

<!-- /ANCHOR:summary-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

---

<!-- ANCHOR:detailed-changes-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
## 3. DETAILED CHANGES

<!-- ANCHOR:discovery-user-requested-clean-reindex-91410c6f-session-1765957107443-e6fa46d1n -->
### FEATURE: User requested to clean and re-index the semantic memory database. During execution, discovered a...

User requested to clean and re-index the semantic memory database. During execution, discovered a critical documentation gap: AI agent confused two separate 'semantic' MCP systems (semantic_search for code indexing at .codebase/vectors.db vs semantic_memory for conversation context at .opencode/skills/workflows-memory/database/memory-index.sqlite). Root cause analysis revealed the similar naming and lack of clear disambiguation in AGENTS.md. Fixed by adding a new subsection to AGENTS.md Section 5 with a comparison table, database locations, and troubleshooting guidance. Database cleanup completed but OpenCode restart required to clear MCP server's in-memory cache before re-indexing can succeed.

**Details:** semantic search vs semantic memory | database disambiguation | vectors.db location | memory-index.sqlite location | two semantic systems | MCP database confusion | clean memory database | re-index memories | restart OpenCode MCP
<!-- /ANCHOR:discovery-user-requested-clean-reindex-91410c6f-session-1765957107443-e6fa46d1n -->

<!-- ANCHOR:implementation-technical-implementation-details-6484029f-session-1765957107443-e6fa46d1n -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: Similar naming of semantic_search and semantic_memory MCPs caused confusion about which database to delete; semanticSearchDB: .codebase/vectors.db (code indexing); semanticMemoryDB: .opencode/skills/workflows-memory/database/memory-index.sqlite (conversation context); fixLocation: AGENTS.md Section 5 lines 650-665; pendingAction: User must restart OpenCode to clear MCP in-memory cache, then re-index 38 memory files

<!-- /ANCHOR:implementation-technical-implementation-details-6484029f-session-1765957107443-e6fa46d1n -->

<!-- /ANCHOR:detailed-changes-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

---

<!-- ANCHOR:decisions-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
## 4. DECISIONS

<!-- ANCHOR:decision-disambiguation-section-agentsmd-section-2595fa8c-session-1765957107443-e6fa46d1n -->
### Decision 1: Added disambiguation section to AGENTS.md Section 5

**Context**: Created clear table distinguishing semantic_search (.codebase/vectors.db for code) from semantic_memory (.opencode/skills/workflows-memory/database/memory-index.sqlite for conversations)

**Timestamp**: 2025-12-17T08:38:27Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Added disambiguation section to AGENTS.md Section 5

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Created clear table distinguishing semantic_search (.codebase/vectors.db for code) from semantic_memory (.opencode/skills/workflows-memory/database/memory-index.sqlite for conversations)

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-disambiguation-section-agentsmd-section-2595fa8c-session-1765957107443-e6fa46d1n -->

---

<!-- ANCHOR:decision-documented-restart-requirement-e24bb2e4-session-1765957107443-e6fa46d1n -->
### Decision 2: Documented the restart requirement

**Context**: MCP servers cache database state in memory, so file deletion alone doesn't reset the index

**Timestamp**: 2025-12-17T08:38:27Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Documented the restart requirement

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: MCP servers cache database state in memory, so file deletion alone doesn't reset the index

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-documented-restart-requirement-e24bb2e4-session-1765957107443-e6fa46d1n -->

---

<!-- ANCHOR:decision-sequential-thinking-mcp-systematic-66535722-session-1765957107443-e6fa46d1n -->
### Decision 3: Used Sequential Thinking MCP for systematic root cause analysis

**Context**: 10-step process identified the naming confusion and documentation gap

**Timestamp**: 2025-12-17T08:38:27Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Used Sequential Thinking MCP for systematic root cause analysis

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: 10-step process identified the naming confusion and documentation gap

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-sequential-thinking-mcp-systematic-66535722-session-1765957107443-e6fa46d1n -->

---

<!-- /ANCHOR:decisions-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

<!-- ANCHOR:session-history-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **0** distinct phases.

##### Conversation Phases
- **Debugging** - 2 actions
- **Discussion** - 3 actions

---

### Message Timeline

> **User** | 2025-12-17 @ 08:38:27

User requested to clean and re-index the semantic memory database. During execution, discovered a critical documentation gap: AI agent confused two separate 'semantic' MCP systems (semantic_search for code indexing at .codebase/vectors.db vs semantic_memory for conversation context at .opencode/skills/workflows-memory/database/memory-index.sqlite). Root cause analysis revealed the similar naming and lack of clear disambiguation in AGENTS.md. Fixed by adding a new subsection to AGENTS.md Section 5 with a comparison table, database locations, and troubleshooting guidance. Database cleanup completed but OpenCode restart required to clear MCP server's in-memory cache before re-indexing can succeed.

---

<!-- /ANCHOR:session-history-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

---

<!-- ANCHOR:recovery-hints-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 005-memory/012-database-disambiguation` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "005-memory/012-database-disambiguation" })` |

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above
<!-- /ANCHOR:recovery-hints-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
---

<!-- ANCHOR:postflight-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
<a id="postflight-learning-delta"></a>

## POSTFLIGHT LEARNING DELTA

**Epistemic state comparison showing knowledge gained during session.**

| Metric | Before | After | Delta | Trend |
|--------|--------|-------|-------|-------|
| Knowledge | N/A | N/A | N/A | - |
| Uncertainty | N/A | N/A | N/A | - |
| Context | N/A | N/A | N/A | - |

**Learning Index:** N/A (not assessed - migrated from older format)

**Gaps Closed:**
- Not assessed (migrated from older format)

**New Gaps Discovered:**
- Not assessed (migrated from older format)

**Session Learning Summary:**
This session was migrated from an older format. Learning metrics were not captured in the original format.
<!-- /ANCHOR:postflight-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->
---

## MEMORY METADATA

<!-- ANCHOR:metadata-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1765957107443-e6fa46d1n"
spec_folder: "005-memory/012-database-disambiguation"
channel: "main"

# Classification
importance_tier: "normal"  # critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "episodic"         # episodic|procedural|semantic|constitutional
  half_life_days: 30              # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.03         # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1      # boost per access (default 0.1)
    recency_weight: 0.5           # weight for recent accesses (default 0.5)
    importance_multiplier: 1.0    # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0
  dedup_savings_tokens: 0
  fingerprint_hash: ""
  similar_memories: []

# Causal Links (v2.2)
causal_links:
  caused_by: []
  supersedes: []
  derived_from: []
  blocks: []
  related_to: []

# Timestamps (for decay calculations)
created_at: "2025-12-17"
created_at_epoch: 1765957107
last_accessed_epoch: 1765957107
expires_at_epoch: 1773733107  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 3
tool_count: 0
file_count: 1
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "troubleshooting"
  - "disambiguation"
  - "distinguishing"
  - "documentation"
  - "conversations"
  - "conversation"
  - "requirement"
  - "discovered"
  - "subsection"
  - "comparison"

key_files:
  - "AGENTS.md"

# Relationships
related_sessions:

  []

parent_spec: "005-memory/012-database-disambiguation"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-1765957107443-e6fa46d1n-005-memory/012-database-disambiguation -->

---

*Generated by workflows-memory skill v11.2.0*

