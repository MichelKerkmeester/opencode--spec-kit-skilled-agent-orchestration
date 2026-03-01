---
title: "To promote a memory to constitutional tier (always [047-constitutional-readme/27-12-25_11-55__constitutional-readme]"
importance_tier: "critical"
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
| Session Date | 2025-12-27 |
| Session ID | session-1766832908883-en89zozsd |
| Spec Folder | 003-memory-and-spec-kit/047-constitutional-readme |
| Channel | main |
| Importance Tier | critical |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2025-12-27 |
| Created At (Epoch) | 1766832908 |
| Last Accessed (Epoch) | 1766832908 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Uncertainty Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Context Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Timestamp | 2025-12-27 | Session start |

**Initial Gaps Identified:**

- Not assessed (migrated from older format)

**Dual-Threshold Status at Start:**
- Confidence: N/A
- Uncertainty: N/A
- Readiness: N/A
<!-- /ANCHOR:preflight-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
---

## Table of Contents

- [Continue Session](#continue-session)
- [Project State Snapshot](#project-state-snapshot)
- [Implementation Guide](#implementation-guide)
- [Overview](#overview)
- [Detailed Changes](#detailed-changes)
- [Decisions](#decisions)
- [Conversation](#conversation)
- [Recovery Hints](#recovery-hints)
- [Memory Metadata](#memory-metadata)

---

<!-- ANCHOR:continue-session-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | COMPLETED |
| Completion % | 100% |
| Last Activity | 2025-12-27 |
| Time in Session | N/A |
| Continuation Count | 0 |

### Context Summary

This session was migrated from an older format to v2.2. Review the OVERVIEW and DECISIONS sections for session content.

### Pending Work

- No pending tasks - session completed

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 003-memory-and-spec-kit/047-constitutional-readme
```
<!-- /ANCHOR:continue-session-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/skill/system-spec-kit/constitutional/README.md |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | Decision: Added First Message Protocol as HARD BLOCK because first-turn enforcement is critical - ur |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown

**Key Topics:** `constitutional` | `comprehensive` | `functionality` | `optimization` | `architecture` | `successfully` | `enforcement` | `maintaining` | `containment` | `explaining` | 

---

<!-- ANCHOR:task-guide-memory-and-spec-kit/047-constitutional-readme-003-memory-and-spec-kit/047-constitutional-readme -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Comprehensive constitutional memory system optimization session. Started with 5-agent parallel...** - Comprehensive constitutional memory system optimization session.

- **Technical Implementation Details** - rootCause: Constitutional token budget was 500 tokens but gate-enforcement.

**Key Files and Their Roles**:

- `.opencode/skill/system-spec-kit/constitutional/README.md` - Documentation

- `.opencode/.../constitutional/gate-enforcement.md` - Documentation

- `.opencode/.../lib/importance-tiers.js` - Core importance tiers

- `.opencode/.../lib/vector-index.js` - Entry point / exports

- `.opencode/skill/system-spec-kit/mcp_server/context-server.js` - Core context server

- `.opencode/skill/system-spec-kit/mcp_server/README.md` - Documentation

- `.opencode/skill/system-spec-kit/README.md` - Documentation

- `.opencode/.../templates/context_template.md` - Template file

**How to Extend**:

- Add new modules following the existing file structure patterns

- Use established template patterns for new outputs

- Maintain consistent error handling approach

**Common Patterns**:

- **Template Pattern**: Use templates with placeholder substitution

- **Data Normalization**: Clean and standardize data before use

- **Functional Transforms**: Use functional methods for data transformation

- **Module Pattern**: Organize code into importable modules

<!-- /ANCHOR:task-guide-memory-and-spec-kit/047-constitutional-readme-003-memory-and-spec-kit/047-constitutional-readme -->

---

<!-- ANCHOR:summary-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
<a id="overview"></a>

## 2. OVERVIEW

Comprehensive constitutional memory system optimization session. Started with 5-agent parallel analysis of the spec-kit and memory system architecture, then created a detailed README.md for the constitutional folder explaining how constitutional memories work, how to create them, and how to customize them. Updated the constitutional token budget from 500 to 2000 tokens across the entire codebase (8 files: importance-tiers.js, vector-index.js, context-server.js, config.jsonc, and multiple READMEs/templates). Optimized gate-enforcement.md using Option B: added 4 missing trigger phrases (build, generate, configure, analyze), added First Message Protocol section, added Violation Recovery section, and split the single ANCHOR into 5 granular sections for better retrieval. Fixed database issues by cleaning 886 orphaned vectors and successfully indexed the constitutional memory with all 55 trigger phrases.

**Key Outcomes**:
- Comprehensive constitutional memory system optimization session. Started with 5-agent parallel...
- Decision: Increased constitutional token budget from 500 to 2000 because gate-en
- Decision: Selected Option B (Moderate) optimization for gate-enforcement.
- Decision: Split single ANCHOR into 5 sections (gate-hard-blocks, gate-behavioral
- Decision: Added First Message Protocol as HARD BLOCK because first-turn enforcem
- Decision: Cleaned 886 orphaned vectors from database before re-indexing because
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/skill/system-spec-kit/constitutional/README.md` | Updated readme |
| `.opencode/.../constitutional/gate-enforcement.md` | Added 4 missing trigger phrases (build |
| `.opencode/.../lib/importance-tiers.js` | Importance-tiers |
| `.opencode/.../lib/vector-index.js` | Importance-tiers |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | Importance-tiers |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Updated readme |
| `.opencode/skill/system-spec-kit/README.md` | Updated readme |
| `.opencode/.../templates/context_template.md` | Modified during session |
| `.opencode/skill/system-spec-kit/config/config.jsonc` | Modified during session |
| `.opencode/.../scripts/cleanup-orphaned-vectors.js` | Modified during session |

<!-- /ANCHOR:summary-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->

---

<!-- ANCHOR:detailed-changes-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-comprehensive-constitutional-memory-system-a2562f14-session-1766832908883-en89zozsd -->
### FEATURE: Comprehensive constitutional memory system optimization session. Started with 5-agent parallel...

Comprehensive constitutional memory system optimization session. Started with 5-agent parallel analysis of the spec-kit and memory system architecture, then created a detailed README.md for the constitutional folder explaining how constitutional memories work, how to create them, and how to customize them. Updated the constitutional token budget from 500 to 2000 tokens across the entire codebase (8 files: importance-tiers.js, vector-index.js, context-server.js, config.jsonc, and multiple READMEs/templates). Optimized gate-enforcement.md using Option B: added 4 missing trigger phrases (build, generate, configure, analyze), added First Message Protocol section, added Violation Recovery section, and split the single ANCHOR into 5 granular sections for better retrieval. Fixed database issues by cleaning 886 orphaned vectors and successfully indexed the constitutional memory with all 55 trigger phrases.

**Details:** constitutional memory | token budget | 2000 tokens | gate enforcement | always surfaces | ANCHOR sections | trigger phrases | First Message Protocol | Violation Recovery | orphaned vectors | importance tier | constitutional tier | gate-enforcement.md | constitutional README
<!-- /ANCHOR:implementation-comprehensive-constitutional-memory-system-a2562f14-session-1766832908883-en89zozsd -->

<!-- ANCHOR:implementation-technical-implementation-details-02d153bf-session-1766832908883-en89zozsd -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: Constitutional token budget was 500 tokens but gate-enforcement.md was ~1600 tokens, causing truncation. Additionally, 886 orphaned vectors in database blocked new indexing.; solution: Updated token budget to 2000 across 8 files, cleaned orphaned vectors, re-indexed constitutional memory with proper tier and trigger phrases.; patterns: Used 5-agent parallel analysis for comprehensive research. Used 4-agent parallel implementation for codebase-wide updates. Created cleanup script for database maintenance.

<!-- /ANCHOR:implementation-technical-implementation-details-02d153bf-session-1766832908883-en89zozsd -->

<!-- /ANCHOR:detailed-changes-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->

---

<!-- ANCHOR:decisions-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
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
## 4. DECISIONS

<!-- ANCHOR:decision-increased-constitutional-token-budget-555f4cdc-session-1766832908883-en89zozsd -->
### Decision 1: Decision: Increased constitutional token budget from 500 to 2000 because gate

**Context**: enforcement.md was ~1600 tokens and exceeded the old budget, causing potential truncation

**Timestamp**: 2025-12-27T11:55:08Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Increased constitutional token budget from 500 to 2000 because gate

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: enforcement.md was ~1600 tokens and exceeded the old budget, causing potential truncation

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-increased-constitutional-token-budget-555f4cdc-session-1766832908883-en89zozsd -->

---

<!-- ANCHOR:decision-selected-option-moderate-optimization-a6fbc19c-session-1766832908883-en89zozsd -->
### Decision 2: Decision: Selected Option B (Moderate) optimization for gate

**Context**: enforcement.md because it adds missing functionality while maintaining self-containment, without aggressive trimming that would reduce clarity

**Timestamp**: 2025-12-27T11:55:08Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Selected Option B (Moderate) optimization for gate

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: enforcement.md because it adds missing functionality while maintaining self-containment, without aggressive trimming that would reduce clarity

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-selected-option-moderate-optimization-a6fbc19c-session-1766832908883-en89zozsd -->

---

<!-- ANCHOR:decision-split-single-anchor-into-f6f9e36d-session-1766832908883-en89zozsd -->
### Decision 3: Decision: Split single ANCHOR into 5 sections (gate

**Context**: hard-blocks, gate-behavioral, gate-soft-advisory, gate-edge-cases, gate-quick-reference) because granular anchors enable section-level retrieval with 93% token savings

**Timestamp**: 2025-12-27T11:55:08Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Split single ANCHOR into 5 sections (gate

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: hard-blocks, gate-behavioral, gate-soft-advisory, gate-edge-cases, gate-quick-reference) because granular anchors enable section-level retrieval with 93% token savings

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-split-single-anchor-into-f6f9e36d-session-1766832908883-en89zozsd -->

---

<!-- ANCHOR:decision-first-message-protocol-hard-fbacfd10-session-1766832908883-en89zozsd -->
### Decision 4: Decision: Added First Message Protocol as HARD BLOCK because first

**Context**: turn enforcement is critical - urgency bypasses process without explicit gate question

**Timestamp**: 2025-12-27T11:55:08Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Added First Message Protocol as HARD BLOCK because first

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: turn enforcement is critical - urgency bypasses process without explicit gate question

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-first-message-protocol-hard-fbacfd10-session-1766832908883-en89zozsd -->

---

<!-- ANCHOR:decision-cleaned-886-orphaned-vectors-3ad8136e-session-1766832908883-en89zozsd -->
### Decision 5: Decision: Cleaned 886 orphaned vectors from database before re

**Context**: indexing because UNIQUE constraint errors were blocking new constitutional memory indexing

**Timestamp**: 2025-12-27T11:55:08Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Cleaned 886 orphaned vectors from database before re

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: indexing because UNIQUE constraint errors were blocking new constitutional memory indexing

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-cleaned-886-orphaned-vectors-3ad8136e-session-1766832908883-en89zozsd -->

---

<!-- /ANCHOR:decisions-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->

<!-- ANCHOR:session-history-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
<a id="conversation"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number = DECISIONS section + 1
  See DECISIONS section comment for the full matrix.
  Range: 3-6 depending on optional sections present.
-->
## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Sequential with Decision Points** conversation pattern with **0** distinct phases.

##### Conversation Phases
- **Debugging** - 2 actions
- **Discussion** - 5 actions

---

### Message Timeline

> **User** | 2025-12-27 @ 11:55:08

Comprehensive constitutional memory system optimization session. Started with 5-agent parallel analysis of the spec-kit and memory system architecture, then created a detailed README.md for the constitutional folder explaining how constitutional memories work, how to create them, and how to customize them. Updated the constitutional token budget from 500 to 2000 tokens across the entire codebase (8 files: importance-tiers.js, vector-index.js, context-server.js, config.jsonc, and multiple READMEs/templates). Optimized gate-enforcement.md using Option B: added 4 missing trigger phrases (build, generate, configure, analyze), added First Message Protocol section, added Violation Recovery section, and split the single ANCHOR into 5 granular sections for better retrieval. Fixed database issues by cleaning 886 orphaned vectors and successfully indexed the constitutional memory with all 55 trigger phrases.

---

<!-- /ANCHOR:session-history-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->

---

<!-- ANCHOR:recovery-hints-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 003-memory-and-spec-kit/047-constitutional-readme` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "003-memory-and-spec-kit/047-constitutional-readme" })` |

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above
<!-- /ANCHOR:recovery-hints-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
---

<!-- ANCHOR:postflight-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
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
<!-- /ANCHOR:postflight-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->
---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1766832908883-en89zozsd"
spec_folder: "003-memory-and-spec-kit/047-constitutional-readme"
channel: "main"

# Classification
importance_tier: "critical"  # constitutional|critical|important|normal|temporary|deprecated
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
created_at: "2025-12-27"
created_at_epoch: 1766832908
last_accessed_epoch: 1766832908
expires_at_epoch: 0  # 0 for critical (never expires)

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
  - "constitutional"
  - "comprehensive"
  - "functionality"
  - "optimization"
  - "architecture"
  - "successfully"
  - "enforcement"
  - "maintaining"
  - "containment"
  - "explaining"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:

  []

key_files:
  - ".opencode/skill/system-spec-kit/constitutional/README.md"
  - ".opencode/.../constitutional/gate-enforcement.md"
  - ".opencode/.../lib/importance-tiers.js"
  - ".opencode/.../lib/vector-index.js"
  - ".opencode/skill/system-spec-kit/mcp_server/context-server.js"
  - ".opencode/skill/system-spec-kit/mcp_server/README.md"
  - ".opencode/skill/system-spec-kit/README.md"
  - ".opencode/.../templates/context_template.md"
  - ".opencode/skill/system-spec-kit/config/config.jsonc"
  - ".opencode/.../scripts/cleanup-orphaned-vectors.js"

# Relationships
related_sessions:

  []

parent_spec: "003-memory-and-spec-kit/047-constitutional-readme"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-1766832908883-en89zozsd-003-memory-and-spec-kit/047-constitutional-readme -->

---

*Generated by system-spec-kit skill v12.5.0*

