---
title: "To promote a memory [088-speckit-known-limitations-remediation/05-02-26_15-58__speckit-known-limitations-remediation]"
importance_tier: "normal"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Constitutional Tier Promotion:
  To promote a memory to constitutional tier (always surfaced):
  
  1. Via MCP tool after indexing:
     memory_update({ id: <memory_id>, importanceTier: 'constitutional' })
  
  2. Criteria for constitutional:
     - Applies to ALL future conversations (not project-specific)
     - Core constraints/rules that should NEVER be forgotten
     - ~2000 token budget total for constitutional tier
     
  3. Add trigger phrases for proactive surfacing:
     memory_update({ 
       id: <memory_id>, 
       importanceTier: 'constitutional',
       triggerPhrases: ['fix', 'implement', 'create', 'modify', ...]
     })
     
  4. Examples of constitutional content:
     - "Always ask Gate 3 spec folder question before file modifications"
     - "Never modify production data directly"
     - "Memory files MUST use generate-context.js script"
-->

---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-02-05 |
| Session ID | session-1770303531287-d4i3bbsf5 |
| Spec Folder | 003-memory-and-spec-kit/088-speckit-known-limitations-remediation |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-05 |
| Created At (Epoch) | 1770303531 |
| Last Accessed (Epoch) | 1770303531 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | [TBD]/100 | [Not assessed] |
| Uncertainty Score | [TBD]/100 | [Not assessed] |
| Context Score | [TBD]/100 | [Not assessed] |
| Timestamp | [TBD] | Session start |

**Initial Gaps Identified:**

- No significant gaps identified at session start

**Dual-Threshold Status at Start:**
- Confidence: [TBD]%
- Uncertainty: [TBD]
- Readiness: [TBD]
<!-- /ANCHOR:preflight-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

## Table of Contents

- [Continue Session](#continue-session)
- [Project State Snapshot](#project-state-snapshot)
- [Overview](#overview)
- [Detailed Changes](#detailed-changes)
- [Decisions](#decisions)
- [Conversation](#conversation)
- [Recovery Hints](#recovery-hints)
- [Memory Metadata](#memory-metadata)

---

<!-- ANCHOR:continue-session-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | BLOCKED |
| Completion % | 5% |
| Last Activity | 2026-02-05T14:58:51.278Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Column renames: similarity_score→similarity, notes→reason — chosen to match the, Gate numbering: Current scheme is Gate 1=Understanding (SOFT), Gate 2=Skill Rout, User rejected KL-3/4/5 (MCP tool details in AGENTS.

**Decisions:** 5 decisions recorded

**Summary:** Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CHECK constraints in-place. Data loss acceptable for audit-only table. ensure_conflicts_table() kept as @deprecated no-op ...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 003-memory-and-spec-kit/088-speckit-known-limitations-remediation
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 003-memory-and-spec-kit/088-speckit-known-limitations-remediation
Last: User rejected KL-3/4/5 (MCP tool details in AGENTS.
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../search/vector-index.js — Migration v12, create_schema unified DDL, SCHEMA_VERSION=12, .opencode/.../cognitive/prediction-error-gate.js — ensure_conflicts_table no-op, log_conflict default fix, .opencode/.../handlers/memory-save.js — INSERT column renames, error swallowing removed

- Last: Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CH

<!-- /ANCHOR:continue-session-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../search/vector-index.js — Migration v12, create_schema unified DDL, SCHEMA_VERSION=12 |
| Last Action | User rejected KL-3/4/5 (MCP tool details in AGENTS. |
| Next Action | Continue implementation |
| Blockers | Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CHECK constraints in-p |

**Key Topics:** `understanding` | `constraints` | `acceptable` | `deprecated` | `similarity` | `prediction` | `convention` | `unnumbered` | `behavioral` | `migration` | 

---

<!-- ANCHOR:summary-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="overview"></a>

## 1. OVERVIEW

Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CHECK constraints in-place. Data loss acceptable for audit-only table. ensure_conflicts_table() kept as @deprecated no-op rather than removed, to avoid breaking imports from cognitive/index.js. Column renames: similarity_score→similarity, notes→reason — chosen to match the prediction-error-gate.js naming convention as canonical.

**Key Outcomes**:
- Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CH
- ensure_conflicts_table() kept as @deprecated no-op rather than removed, to avoid
- Column renames: similarity_score→similarity, notes→reason — chosen to match the
- Gate numbering: Current scheme is Gate 1=Understanding (SOFT), Gate 2=Skill Rout
- User rejected KL-3/4/5 (MCP tool details in AGENTS.

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../search/vector-index.js — Migration v12, create_schema unified DDL, SCHEMA_VERSION=12` | File modified (description pending) |
| `.opencode/.../cognitive/prediction-error-gate.js — ensure_conflicts_table no-op, log_conflict default fix` | File modified (description pending) |
| `.opencode/.../handlers/memory-save.js — INSERT column renames, error swallowing removed` | File modified (description pending) |
| `.opencode/agent/orchestrate.md — Gate 4→Gate 3` | File modified (description pending) |
| `AGENTS.md (project root) — Gate 4 Option B→Gate 3 Option B` | File modified (description pending) |
| `.opencode/.../scripts/scripts-registry.json — Gate 6→Completion Verification Rule` | File modified (description pending) |
| `.opencode/.../scripts/README.md — Gate 6→Completion Verification Rule` | File modified (description pending) |
| `.opencode/.../spec/check-completion.sh — Gate 6→Completion Verification Rule` | File modified (description pending) |
| `.opencode/install_guides/SET-UP - AGENTS.md — Full gate section rewrite to 3-gate scheme` | File modified (description pending) |
| `.opencode/agent/speckit.md — 3 scripts added to Capability Scan, Gate 4→Validation 4` | File modified (description pending) |

<!-- /ANCHOR:summary-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

<!-- ANCHOR:detailed-changes-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="detailed-changes"></a>

## 2. DETAILED CHANGES

<!-- /ANCHOR:detailed-changes-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

<!-- ANCHOR:decisions-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="decisions"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number depends on which optional sections are present:
  - Base: 2 (after Overview)
  - +1 if HAS_IMPLEMENTATION_GUIDE (adds section 1)
  - +1 if HAS_OBSERVATIONS (adds Detailed Changes)
  - +1 if HAS_WORKFLOW_DIAGRAM (adds Workflow Visualization)
  
  Result matrix:
  | IMPL_GUIDE | OBSERVATIONS | WORKFLOW | This Section # |
  |------------|--------------|----------|----------------|
  | No         | No           | No       | 2              |
  | No         | No           | Yes      | 3              |
  | No         | Yes          | No       | 3              |
  | No         | Yes          | Yes      | 4              |
  | Yes        | No           | No       | 3              |
  | Yes        | No           | Yes      | 4              |
  | Yes        | Yes          | No       | 4              |
  | Yes        | Yes          | Yes      | 5              |
-->
## 3. DECISIONS

<!-- ANCHOR:decision-migration-v12-uses-dropcreate-db92a226-session-1770303531287-d4i3bbsf5 -->
### Decision 1: Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CHECK constraints in

**Context**: place. Data loss acceptable for audit-only table.

**Timestamp**: 2026-02-05T15:58:51Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Migration v12 uses DROP+CREATE (not ALTER TABLE) because SQLite cannot modify CHECK constraints in

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: place. Data loss acceptable for audit-only table.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-migration-v12-uses-dropcreate-db92a226-session-1770303531287-d4i3bbsf5 -->

---

<!-- ANCHOR:decision-ensureconflictstable-kept-deprecated-93d01a20-session-1770303531287-d4i3bbsf5 -->
### Decision 2: ensure_conflicts_table() kept as @deprecated no

**Context**: op rather than removed, to avoid breaking imports from cognitive/index.js.

**Timestamp**: 2026-02-05T15:58:51Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ensure_conflicts_table() kept as @deprecated no

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: op rather than removed, to avoid breaking imports from cognitive/index.js.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-ensureconflictstable-kept-deprecated-93d01a20-session-1770303531287-d4i3bbsf5 -->

---

<!-- ANCHOR:decision-column-renames-similarityscoresimilarity-notesreason-87b5581d-session-1770303531287-d4i3bbsf5 -->
### Decision 3: Column renames: similarity_score→similarity, notes→reason

**Context**: chosen to match the prediction-error-gate.js naming convention as canonical.

**Timestamp**: 2026-02-05T15:58:51Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Column renames: similarity_score→similarity, notes→reason

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: chosen to match the prediction-error-gate.js naming convention as canonical.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-column-renames-similarityscoresimilarity-notesreason-87b5581d-session-1770303531287-d4i3bbsf5 -->

---

<!-- ANCHOR:decision-gate-numbering-current-scheme-efda9a15-session-1770303531287-d4i3bbsf5 -->
### Decision 4: Gate numbering: Current scheme is Gate 1=Understanding (SOFT), Gate 2=Skill Routing (REQUIRED), Gate 3=Spec Folder (HARD). Gates 4

**Context**: 6 replaced by unnumbered behavioral rules.

**Timestamp**: 2026-02-05T15:58:51Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Gate numbering: Current scheme is Gate 1=Understanding (SOFT), Gate 2=Skill Routing (REQUIRED), Gate 3=Spec Folder (HARD). Gates 4

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: 6 replaced by unnumbered behavioral rules.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-gate-numbering-current-scheme-efda9a15-session-1770303531287-d4i3bbsf5 -->

---

<!-- ANCHOR:decision-user-rejected-7edc93b8-session-1770303531287-d4i3bbsf5 -->
### Decision 5: User rejected KL

**Context**: 3/4/5 (MCP tool details in AGENTS.md) — AGENTS.md is behavioral framework only; SKILL.md is where MCP details belong. This is by design.

**Timestamp**: 2026-02-05T15:58:51Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   User rejected KL

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: 3/4/5 (MCP tool details in AGENTS.md) — AGENTS.md is behavioral framework only; SKILL.md is where MCP details belong. This is by design.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-user-rejected-7edc93b8-session-1770303531287-d4i3bbsf5 -->

---

<!-- /ANCHOR:decisions-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

<!-- ANCHOR:session-history-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="conversation"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number = DECISIONS section + 1
  See DECISIONS section comment for the full matrix.
  Range: 3-6 depending on optional sections present.
-->
## 4. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **0** distinct phases.

##### Conversation Phases
- **Verification** - 1 actions
- **Discussion** - 3 actions
- **Debugging** - 1 actions

---

### Message Timeline

> **User** | 2026-02-05 @ 15:58:51

Manual context save

---

<!-- /ANCHOR:session-history-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

<!-- ANCHOR:recovery-hints-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 003-memory-and-spec-kit/088-speckit-known-limitations-remediation` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "003-memory-and-spec-kit/088-speckit-known-limitations-remediation" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.js --status

# List memories for this spec folder
memory_search({ specFolder: "003-memory-and-spec-kit/088-speckit-known-limitations-remediation", limit: 10 })

# Verify memory file integrity
ls -la 003-memory-and-spec-kit/088-speckit-known-limitations-remediation/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js 003-memory-and-spec-kit/088-speckit-known-limitations-remediation --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

### Session Integrity Checks

| Check | Status | Details |
|-------|--------|---------|
| Memory File Exists |  |  |
| Index Entry Valid |  | Last indexed:  |
| Checksums Match |  |  |
| No Dedup Conflicts |  |  |
<!-- /ANCHOR:recovery-hints-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

<!-- ANCHOR:postflight-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->
<a id="postflight-learning-delta"></a>

## POSTFLIGHT LEARNING DELTA

**Epistemic state comparison showing knowledge gained during session.**

<!-- Delta Calculation Formulas:
  DELTA_KNOW_SCORE = POSTFLIGHT_KNOW_SCORE - PREFLIGHT_KNOW_SCORE (positive = improvement)
  DELTA_UNCERTAINTY_SCORE = PREFLIGHT_UNCERTAINTY_SCORE - POSTFLIGHT_UNCERTAINTY_SCORE (positive = reduction, which is good)
  DELTA_CONTEXT_SCORE = POSTFLIGHT_CONTEXT_SCORE - PREFLIGHT_CONTEXT_SCORE (positive = improvement)
  DELTA_*_TREND = "↑" if delta > 0, "↓" if delta < 0, "→" if delta == 0
-->

| Metric | Before | After | Delta | Trend |
|--------|--------|-------|-------|-------|
| Knowledge | [TBD] | [TBD] | [TBD] | → |
| Uncertainty | [TBD] | [TBD] | [TBD] | → |
| Context | [TBD] | [TBD] | [TBD] | → |

**Learning Index:** [TBD]/100

> Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
> Higher is better. Target: ≥25 for productive sessions.

**Gaps Closed:**

- No gaps explicitly closed during session

**New Gaps Discovered:**

- No new gaps discovered

**Session Learning Summary:**
Learning metrics will be calculated when both preflight and postflight data are provided.
<!-- /ANCHOR:postflight-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1770303531287-d4i3bbsf5"
spec_folder: "003-memory-and-spec-kit/088-speckit-known-limitations-remediation"
channel: "main"

# Classification
importance_tier: "normal"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: ""         # episodic|procedural|semantic|constitutional
  half_life_days:      # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate:            # 0.0-1.0, daily decay multiplier
    access_boost_factor:    # boost per access (default 0.1)
    recency_weight:              # weight for recent accesses (default 0.5)
    importance_multiplier:  # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced:    # count of memories shown this session
  dedup_savings_tokens:    # tokens saved via deduplication
  fingerprint_hash: ""         # content hash for dedup detection
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
created_at: "2026-02-05"
created_at_epoch: 1770303531
last_accessed_epoch: 1770303531
expires_at_epoch: 1778079531  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 5
tool_count: 0
file_count: 10
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "understanding"
  - "constraints"
  - "acceptable"
  - "deprecated"
  - "similarity"
  - "prediction"
  - "convention"
  - "unnumbered"
  - "behavioral"
  - "migration"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:

  []

key_files:
  - ".opencode/.../search/vector-index.js — Migration v12, create_schema unified DDL, SCHEMA_VERSION=12"
  - ".opencode/.../cognitive/prediction-error-gate.js — ensure_conflicts_table no-op, log_conflict default fix"
  - ".opencode/.../handlers/memory-save.js — INSERT column renames, error swallowing removed"
  - ".opencode/agent/orchestrate.md — Gate 4→Gate 3"
  - "AGENTS.md (project root) — Gate 4 Option B→Gate 3 Option B"
  - ".opencode/.../scripts/scripts-registry.json — Gate 6→Completion Verification Rule"
  - ".opencode/.../scripts/README.md — Gate 6→Completion Verification Rule"
  - ".opencode/.../spec/check-completion.sh — Gate 6→Completion Verification Rule"
  - ".opencode/install_guides/SET-UP - AGENTS.md — Full gate section rewrite to 3-gate scheme"
  - ".opencode/agent/speckit.md — 3 scripts added to Capability Scan, Gate 4→Validation 4"

# Relationships
related_sessions:

  []

parent_spec: "003-memory-and-spec-kit/088-speckit-known-limitations-remediation"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-1770303531287-d4i3bbsf5-003-memory-and-spec-kit/088-speckit-known-limitations-remediation -->

---

*Generated by system-spec-kit skill v1.7.2*

