---
title: "{{MEMORY_DASHBOARD_TITLE}}"
description: "{{MEMORY_DESCRIPTION}}"
# Canonical classification lives in frontmatter; MEMORY METADATA mirrors these values.
{{TRIGGER_PHRASES_YAML}}
importance_tier: "{{IMPORTANCE_TIER}}"
contextType: "{{CONTEXT_TYPE}}"
_sourceTranscriptPath: "{{SOURCE_TRANSCRIPT_PATH}}"
_sourceSessionId: "{{SOURCE_SESSION_ID}}"
_sourceSessionCreated: {{SOURCE_SESSION_CREATED}}
_sourceSessionUpdated: {{SOURCE_SESSION_UPDATED}}
captured_file_count: {{CAPTURED_FILE_COUNT}}
filesystem_file_count: {{FILESYSTEM_FILE_COUNT}}
git_changed_file_count: {{GIT_CHANGED_FILE_COUNT}}
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Template Configuration Comments (stripped during generation) -->

<!-- Context Type Detection:
  - "implementation": >30% Write/Edit tools, or decision recording present
  - "research": >50% Read/Grep/Glob tools, minimal Write/Edit
  - "planning": Spec/plan creation, architecture decisions, design work
  - "general": fallback when no clear pattern

  Detection Logic (pseudo-code):
  ```
  tool_counts = count_by_category(tools_used)
  read_tools = tool_counts['Read'] + tool_counts['Grep'] + tool_counts['Glob']
  write_tools = tool_counts['Write'] + tool_counts['Edit']
  web_tools = tool_counts['WebSearch'] + tool_counts['WebFetch']
  total = sum(tool_counts.values())

  if decision_count > 0 or user_choice_recorded:
    return 'planning'
  elif web_tools / total > 0.3:
    return 'research'
  elif read_tools / total > 0.5 and write_tools / total < 0.1:
    return 'research'
  elif write_tools / total > 0.3:
    return 'implementation'
  else:
    return 'general'
  ```
-->

<!-- Importance Tier Guidelines:
  - constitutional: Project-wide rules that ALWAYS surface at top of search results
    * Core constraints/rules that should NEVER be forgotten
    * Applies to ALL future conversations (not session-specific)
    * Never expires, never decays, ~2000 token budget total
    * Examples: Gate 3 spec folder rules, memory generation requirements

  - critical: Core architectural decisions, never expires
    * System-wide patterns that affect multiple components
    * Security decisions and authentication flows
    * Database schema changes
    * API contract definitions

  - important: Key implementation details, long-term retention (90+ days)
    * Feature implementation decisions
    * Integration patterns
    * Performance optimizations
    * Bug fix root causes

  - normal: Standard session notes (default, 30-day retention)
    * Regular implementation work
    * Documentation updates
    * Refactoring sessions

  - temporary: Debug notes, expires after 7 days
    * Debugging sessions
    * Exploratory research
    * Quick fixes and workarounds

  - deprecated: Outdated info, excluded from search
    * Superseded decisions
    * Removed features
    * Old approaches replaced by new ones

  Auto-Detection Hints:
  - Files modified in /architecture/ or /core/ -> suggest 'critical'
  - Multiple decisions recorded -> suggest 'important'
  - High tool count but low file changes -> suggest 'temporary'
  - User explicitly marks importance in conversation
-->

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

<!-- Channel/Branch Association:
  The channel field captures the git branch at session creation time.
  This enables filtering memories by feature work and tracking
  which decisions were made in which development context.

  Format: {branch_name} or "detached:{commit_hash}" if detached HEAD
-->

# {{MEMORY_TITLE}}

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | {{DATE}} |
| Session ID | {{SESSION_ID}} |
| Spec Folder | {{SPEC_FOLDER}} |
| Channel | {{CHANNEL}} |
{{#HEAD_REF}}| Git Ref | {{HEAD_REF}}{{#COMMIT_REF}} (`{{COMMIT_REF}}`){{/COMMIT_REF}} |
{{/HEAD_REF}}| Importance Tier | {{IMPORTANCE_TIER}} |
| Context Type | {{CONTEXT_TYPE}} |
| Total Messages | {{MESSAGE_COUNT}} |
| Tool Executions | {{TOOL_COUNT}} |
| Decisions Made | {{DECISION_COUNT}} |
| Follow-up Items Recorded | {{FOLLOWUP_COUNT}} |
| Created At | {{DATE}} |
| Created At (Epoch) | {{CREATED_AT_EPOCH}} |
| Last Accessed (Epoch) | {{LAST_ACCESSED_EPOCH}} |
| Access Count | {{ACCESS_COUNT}} |

---

{{#HAS_PREFLIGHT_BASELINE}}
<!-- ANCHOR:preflight -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | {{PREFLIGHT_KNOW_SCORE}}/100 | {{PREFLIGHT_KNOW_ASSESSMENT}} |
| Uncertainty Score | {{PREFLIGHT_UNCERTAINTY_SCORE}}/100 | {{PREFLIGHT_UNCERTAINTY_ASSESSMENT}} |
| Context Score | {{PREFLIGHT_CONTEXT_SCORE}}/100 | {{PREFLIGHT_CONTEXT_ASSESSMENT}} |
| Timestamp | {{PREFLIGHT_TIMESTAMP}} | Session start |

**Initial Gaps Identified:**
{{#PREFLIGHT_GAPS}}
- {{GAP_DESCRIPTION}}
{{/PREFLIGHT_GAPS}}
{{^PREFLIGHT_GAPS}}
- No significant gaps identified at session start
{{/PREFLIGHT_GAPS}}

**Dual-Threshold Status at Start:**
- Confidence: {{PREFLIGHT_CONFIDENCE}}%
- Uncertainty: {{PREFLIGHT_UNCERTAINTY_RAW}}
- Readiness: {{PREFLIGHT_READINESS}}
<!-- /ANCHOR:preflight -->
{{/HAS_PREFLIGHT_BASELINE}}

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [CANONICAL SOURCES](#canonical-docs)
- [OVERVIEW](#overview)
- [DISTINGUISHING EVIDENCE](#evidence)
- [RECOVERY HINTS](#recovery-hints)
{{#HAS_POSTFLIGHT_DELTA}}- [POSTFLIGHT LEARNING DELTA](#postflight)
{{/HAS_POSTFLIGHT_DELTA}}- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | {{SESSION_STATUS}} |
| Completion % | {{COMPLETION_PERCENT}}% |
| Last Activity | {{LAST_ACTIVITY_TIMESTAMP}} |
| Time in Session | {{SESSION_DURATION}} |
| Continuation Count | {{CONTINUATION_COUNT}} |

### Context Summary

{{CONTEXT_SUMMARY}}

{{#PENDING_TASKS}}
### Pending Work

- [ ] **{{TASK_ID}}**: {{TASK_DESCRIPTION}} (Priority: {{TASK_PRIORITY}})

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume {{SPEC_FOLDER}}
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt {{NEXT_CONTINUATION_COUNT}}
Spec: {{SPEC_FOLDER}}
Last: {{LAST_ACTION}}
Next: {{NEXT_ACTION}}
```

**Key Context to Review:**
{{#RESUME_CONTEXT}}
- {{CONTEXT_ITEM}}
{{/RESUME_CONTEXT}}
{{^RESUME_CONTEXT}}
- Review PROJECT STATE SNAPSHOT for current state
- Check DECISIONS for recent choices made
{{/RESUME_CONTEXT}}
{{/PENDING_TASKS}}
<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:canonical-docs -->

## CANONICAL SOURCES

**Authoritative documentation for this packet. The memory save is a compact retrieval wrapper; full narrative context lives here:**

{{#CANONICAL_SOURCE_ENTRIES}}
- **{{ROLE}}**: [{{FILE_NAME}}]({{FILE_PATH}}) — {{DESCRIPTION}}
{{/CANONICAL_SOURCE_ENTRIES}}
{{^CANONICAL_SOURCE_ENTRIES}}
- No canonical static documents detected in this spec folder yet
- This memory may contain expanded narrative as a fallback
{{/CANONICAL_SOURCE_ENTRIES}}
{{#CANONICAL_DOCS}}
{{#HAS_DECISION_RECORD}}- [`decision-record.md`]({{DECISION_RECORD_PATH}}) — Architectural decisions and rationale
{{/HAS_DECISION_RECORD}}
{{#HAS_IMPLEMENTATION_SUMMARY}}- [`implementation-summary.md`]({{IMPLEMENTATION_SUMMARY_PATH}}) — Build story, verification results, and outcomes
{{/HAS_IMPLEMENTATION_SUMMARY}}
{{#HAS_REVIEW_REPORT}}- [`review-report.md`]({{REVIEW_REPORT_PATH}}) — Review findings and quality assessment
{{/HAS_REVIEW_REPORT}}
{{#HAS_RESEARCH_REPORT}}- [`research.md`]({{RESEARCH_REPORT_PATH}}) — Research findings and methodology
{{/HAS_RESEARCH_REPORT}}
{{/CANONICAL_DOCS}}

<!-- /ANCHOR:canonical-docs -->

---

<!-- ANCHOR:overview -->

## OVERVIEW

{{SUMMARY}}

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

**Compact session-specific evidence that distinguishes this memory from the canonical static docs:**

{{#DISTINGUISHING_EVIDENCE}}
- {{EVIDENCE_ITEM}}
{{/DISTINGUISHING_EVIDENCE}}
{{^DISTINGUISHING_EVIDENCE}}
- {{LAST_ACTION}}
- Next: {{NEXT_ACTION}}
{{#BLOCKERS}}- Blocker: {{BLOCKERS}}{{/BLOCKERS}}
{{/DISTINGUISHING_EVIDENCE}}

<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume {{SPEC_FOLDER}}` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "{{SPEC_FOLDER}}" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "{{SPEC_FOLDER}}", limit: 10 })

# Verify memory file integrity
ls -la {{SPEC_FOLDER}}/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {{SPEC_FOLDER}} --force
```

### Recovery Priority

{{#RECOVERY_PRIORITY}}
1. **{{PRIORITY_ITEM}}**
{{/RECOVERY_PRIORITY}}
{{^RECOVERY_PRIORITY}}
1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above
{{/RECOVERY_PRIORITY}}

<!-- /ANCHOR:recovery-hints -->

---

{{#HAS_POSTFLIGHT_DELTA}}
<!-- ANCHOR:postflight -->

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
| Knowledge | {{PREFLIGHT_KNOW_SCORE}} | {{POSTFLIGHT_KNOW_SCORE}} | {{DELTA_KNOW_SCORE}} | {{DELTA_KNOW_TREND}} |
| Uncertainty | {{PREFLIGHT_UNCERTAINTY_SCORE}} | {{POSTFLIGHT_UNCERTAINTY_SCORE}} | {{DELTA_UNCERTAINTY_SCORE}} | {{DELTA_UNCERTAINTY_TREND}} |
| Context | {{PREFLIGHT_CONTEXT_SCORE}} | {{POSTFLIGHT_CONTEXT_SCORE}} | {{DELTA_CONTEXT_SCORE}} | {{DELTA_CONTEXT_TREND}} |

**Learning Index:** {{LEARNING_INDEX}}/100

> Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
> Higher is better. Target: ≥25 for productive sessions.

**Gaps Closed:**
{{#GAPS_CLOSED}}
- ✅ {{GAP_DESCRIPTION}}
{{/GAPS_CLOSED}}
{{^GAPS_CLOSED}}
- No gaps explicitly closed during session
{{/GAPS_CLOSED}}

**New Gaps Discovered:**
{{#NEW_GAPS}}
- ❓ {{GAP_DESCRIPTION}}
{{/NEW_GAPS}}
{{^NEW_GAPS}}
- No new gaps discovered
{{/NEW_GAPS}}

**Session Learning Summary:**
{{LEARNING_SUMMARY}}
<!-- /ANCHOR:postflight -->
{{/HAS_POSTFLIGHT_DELTA}}

---

<!-- ANCHOR:metadata -->

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "{{SESSION_ID}}"
spec_folder: "{{SPEC_FOLDER}}"
channel: "{{CHANNEL}}"

# Git Provenance (M-007d)
head_ref: "{{HEAD_REF}}"
commit_ref: "{{COMMIT_REF}}"
repository_state: "{{REPOSITORY_STATE}}"
is_detached_head: {{IS_DETACHED_HEAD}}

# Classification
importance_tier: "{{IMPORTANCE_TIER}}"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "{{CONTEXT_TYPE}}"        # mirrors frontmatter contextType

# Memory Classification (v2.2)
memory_classification:
  memory_type: "{{MEMORY_TYPE}}"         # episodic|procedural|semantic|constitutional
  half_life_days: {{HALF_LIFE_DAYS}}     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: {{BASE_DECAY_RATE}}           # 0.0-1.0, daily decay multiplier
    access_boost_factor: {{ACCESS_BOOST_FACTOR}}   # boost per access (default 0.1)
    recency_weight: {{RECENCY_WEIGHT}}             # weight for recent accesses (default 0.5)
    importance_multiplier: {{IMPORTANCE_MULTIPLIER}} # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: {{MEMORIES_SURFACED_COUNT}}   # count of memories shown this session
  dedup_savings_tokens: {{DEDUP_SAVINGS_TOKENS}}   # tokens saved via deduplication
  fingerprint_hash: "{{FINGERPRINT_HASH}}"         # content hash for dedup detection
  similar_memories:
{{#SIMILAR_MEMORIES}}    - id: "{{MEMORY_ID}}"
      similarity: {{SIMILARITY_SCORE}}
{{/SIMILAR_MEMORIES}}
{{^SIMILAR_MEMORIES}}    []
{{/SIMILAR_MEMORIES}}

# Causal Links (v2.2)
causal_links:
  caused_by:
{{#CAUSED_BY}}    - "{{.}}"
{{/CAUSED_BY}}
{{^CAUSED_BY}}    []
{{/CAUSED_BY}}
  supersedes:
{{#SUPERSEDES}}    - "{{.}}"
{{/SUPERSEDES}}
{{^SUPERSEDES}}    []
{{/SUPERSEDES}}
  derived_from:
{{#DERIVED_FROM}}    - "{{.}}"
{{/DERIVED_FROM}}
{{^DERIVED_FROM}}    []
{{/DERIVED_FROM}}
  blocks:
{{#BLOCKS}}    - "{{.}}"
{{/BLOCKS}}
{{^BLOCKS}}    []
{{/BLOCKS}}
  related_to:
{{#RELATED_TO}}    - "{{.}}"
{{/RELATED_TO}}
{{^RELATED_TO}}    []
{{/RELATED_TO}}

# Timestamps (for decay calculations)
created_at: "{{DATE}}"
created_at_epoch: {{CREATED_AT_EPOCH}}
last_accessed_epoch: {{LAST_ACCESSED_EPOCH}}
expires_at_epoch: {{EXPIRES_AT_EPOCH}}  # 0 for critical (never expires)

# Session Metrics
message_count: {{MESSAGE_COUNT}}
decision_count: {{DECISION_COUNT}}
tool_count: {{TOOL_COUNT}}
file_count: {{FILE_COUNT}}
captured_file_count: {{CAPTURED_FILE_COUNT}}
filesystem_file_count: {{FILESYSTEM_FILE_COUNT}}
git_changed_file_count: {{GIT_CHANGED_FILE_COUNT}}
followup_count: {{FOLLOWUP_COUNT}}

# Access Analytics
access_count: {{ACCESS_COUNT}}
last_search_query: "{{LAST_SEARCH_QUERY}}"
relevance_boost: {{RELEVANCE_BOOST}}  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
{{#TOPICS}}  - "{{.}}"
{{/TOPICS}}

# Trigger Phrases (mirrors the canonical frontmatter list for fast <50ms matching)
{{TRIGGER_PHRASES_YAML}}

key_files:
{{#KEY_FILES}}  - "{{FILE_PATH}}"
{{/KEY_FILES}}

# Relationships
related_sessions:
{{#RELATED_SESSIONS}}  - "{{.}}"
{{/RELATED_SESSIONS}}
{{^RELATED_SESSIONS}}  []
{{/RELATED_SESSIONS}}

parent_spec: "{{PARENT_SPEC}}"
child_sessions:
{{#CHILD_SESSIONS}}  - "{{.}}"
{{/CHILD_SESSIONS}}
{{^CHILD_SESSIONS}}  []
{{/CHILD_SESSIONS}}

# Embedding Info (populated by indexer)
embedding_model: "{{EMBEDDING_MODEL}}"
embedding_version: "{{EMBEDDING_VERSION}}"
chunk_count: {{CHUNK_COUNT}}
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v{{SKILL_VERSION}}*

<!--
  SESSION CONTEXT DOCUMENTATION v2.2

  IMPROVEMENTS IN v2.2:
  - CONTINUE_SESSION section for quick resume and handover
  - session_dedup metadata for deduplication tracking
  - memory_classification with memory_type, half_life_days, decay_factors
  - causal_links for relationship tracking (caused_by, supersedes, derived_from, blocks, related_to)
  - RECOVERY HINTS section with diagnostic commands and scenarios
  - Enhanced session state tracking (continuation_count, session_status, completion_percent)

  IMPROVEMENTS IN v2.1:
  - Session ID for unique identification across branches
  - Channel/branch association for context filtering
  - Importance tiers with decay calculations
  - Context type auto-detection
  - Epoch timestamps for programmatic access
  - Access tracking for relevance boosting
  - Machine-readable YAML metadata block
  - Simple anchor naming (semantic names only, no session/spec suffixes)

  MEMORY TYPES (v2.2):
  - episodic: Session-specific events and conversations (default, decays)
  - procedural: How-to knowledge and patterns (longer retention)
  - semantic: Facts and concepts (long-term, minimal decay)
  - constitutional: Core rules and constraints (never decays, always surfaces)

  DECAY CALCULATION:
  - constitutional: never expires, always surfaces first (~2000 token budget)
  - critical: never expires (expires_at_epoch = 0)
  - important: 90 days base, extended by access
  - normal: 30 days base, extended by access
  - temporary: 7 days, no extension
  - deprecated: excluded from search immediately

  DECAY FORMULA (v2.2):
  relevance_score = base_score * (importance_multiplier) *
                    (1 - base_decay_rate)^days_since_access *
                    (1 + access_count * access_boost_factor) *
                    (1 + recency_bonus)
  where recency_bonus = recency_weight if accessed in last 7 days

  CAUSAL LINK TYPES (v2.2):
  - caused_by: This memory was created due to these memories/events
  - supersedes: This memory replaces these older memories
  - derived_from: This memory builds upon these memories
  - blocks: This memory blocks progression of these items
  - related_to: General relationship without causal direction

  DEDUPLICATION (v2.2):
  - fingerprint_hash: SHA-256 of normalized content for collision detection
  - similar_memories: List of memories with similarity > 0.85
  - dedup_savings_tokens: Tokens saved by not re-surfacing duplicates

  INDEXING NOTES:
  - Anchors use simple semantic names (per-file uniqueness only)
  - YAML metadata block is primary source for indexer
  - Topics extracted from section headers and decision titles
  - Embeddings generated per-section, not whole document
  - Causal links enable graph-based memory traversal
  - Recovery hints provide self-healing guidance
-->
