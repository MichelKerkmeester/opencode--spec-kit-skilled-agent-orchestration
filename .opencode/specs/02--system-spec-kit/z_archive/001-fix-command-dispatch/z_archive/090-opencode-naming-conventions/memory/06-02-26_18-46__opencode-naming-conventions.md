---
title: "To promote a memory to constitutional [090-opencode-naming-conventions/06-02-26_18-46__opencode-naming-conventions]"
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
| Session Date | 2026-02-06 |
| Session ID | session-1770400017446-6y3pw9nnj |
| Spec Folder | 003-memory-and-spec-kit/090-opencode-naming-conventions |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-06 |
| Created At (Epoch) | 1770400017 |
| Last Accessed (Epoch) | 1770400017 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
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
<!-- /ANCHOR:preflight-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

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

<!-- ANCHOR:continue-session-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 25% |
| Last Activity | 2026-02-06T17:46:57.438Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Fix broken exports blocks (memory-parser., Decision: Do NOT rename UPPER_SNAKE_CASE constants, PascalCase classes, kebab-ca, Technical Implementation Details

**Decisions:** 5 decisions recorded

**Summary:** Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case to camelCase naming conventions, aligning with JS ecosystem standards (MDN, Airbnb, Node.js). Update...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 003-memory-and-spec-kit/090-opencode-naming-conventions
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 003-memory-and-spec-kit/090-opencode-naming-conventions
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/skill/sk-code--opencode/SKILL.md, .opencode/.../javascript/style_guide.md, .opencode/.../javascript/quality_standards.md

- Check: plan.md, tasks.md, checklist.md

- Last: Completed full migration of all JavaScript code in .opencode/skill/system-spec-k

<!-- /ANCHOR:continue-session-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/skill/sk-code--opencode/SKILL.md |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |
| decision-record.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist
- [`decision-record.md`](./decision-record.md) - Architecture decisions

**Key Topics:** `implementation` | `documentation` | `distinguishes` | `declarations` | `verification` | `successfully` | `conventions` | `identifiers` | `referential` | `replacement` | 

---

<!-- ANCHOR:task-guide-memory-and-spec-kit/090-opencode-naming-conventions-003-memory-and-spec-kit/090-opencode-naming-conventions -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case...** - Completed full migration of all JavaScript code in .

- **Technical Implementation Details** - rootCause: The sk-code--opencode skill enforced snake_case for JavaScript functions/params/exports, which is non-standard — JS ecosystem uses camelCase (MDN, Airbnb, Node.

**Key Files and Their Roles**:

- `.opencode/skill/sk-code--opencode/SKILL.md` - Documentation

- `.opencode/.../javascript/style_guide.md` - Documentation

- `.opencode/.../javascript/quality_standards.md` - Documentation

- `.opencode/.../javascript/quick_reference.md` - Documentation

- `.opencode/.../shared/universal_patterns.md` - Documentation

- `.opencode/.../shared/code_organization.md` - Documentation

- `.opencode/.../checklists/javascript_checklist.md` - Documentation

- `.opencode/skill/sk-code--opencode/CHANGELOG.md` - Documentation

**How to Extend**:

- Add new modules following the existing file structure patterns

- Use established template patterns for new outputs

- Follow the established API pattern for new endpoints

**Common Patterns**:

- **Template Pattern**: Use templates with placeholder substitution

- **Module Pattern**: Organize code into importable modules

<!-- /ANCHOR:task-guide-memory-and-spec-kit/090-opencode-naming-conventions-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<!-- ANCHOR:summary-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
<a id="overview"></a>

## 2. OVERVIEW

Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case to camelCase naming conventions, aligning with JS ecosystem standards (MDN, Airbnb, Node.js). Updated 9 skill documentation files in sk-code--opencode/ to reflect the new standard. Migrated ~2,980 unique identifiers across 163+ JS files using a segment-based parser that distinguishes CODE from STRING/COMMENT/TEMPLATE segments. Fixed multiple post-migration issues including stray backticks from template literal parser, self-referential const declarations, and broken module.exports blocks that still referenced old snake_case names. Added backward-compatible snake_case aliases in MCP handler exports and shared library files. Final verification: 206/206 syntax pass, 148/148 runtime pass, MCP server loads successfully. Created Level 3+ spec folder with full documentation.

**Key Outcomes**:
- Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case...
- Decision: Use camelCase for JS functions/params/exports because it aligns with M
- Decision: Keep backward-compatible snake_case aliases in module.
- Decision: Use segment-based parsing (CODE vs STRING vs COMMENT vs TEMPLATE) for
- Decision: Fix broken exports blocks (memory-parser.
- Decision: Do NOT rename UPPER_SNAKE_CASE constants, PascalCase classes, kebab-ca
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/skill/sk-code--opencode/SKILL.md` | File modified (description pending) |
| `.opencode/.../javascript/style_guide.md` | File modified (description pending) |
| `.opencode/.../javascript/quality_standards.md` | File modified (description pending) |
| `.opencode/.../javascript/quick_reference.md` | File modified (description pending) |
| `.opencode/.../shared/universal_patterns.md` | File modified (description pending) |
| `.opencode/.../shared/code_organization.md` | File modified (description pending) |
| `.opencode/.../checklists/javascript_checklist.md` | File modified (description pending) |
| `.opencode/skill/sk-code--opencode/CHANGELOG.md` | File modified (description pending) |
| `.opencode/skill/system-spec-kit/shared/trigger-extractor.js` | File modified (description pending) |
| `.opencode/.../parsing/memory-parser.js` | File modified (description pending) |

<!-- /ANCHOR:summary-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<!-- ANCHOR:detailed-changes-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-completed-full-migration-all-27276cfd-session-1770400017446-6y3pw9nnj -->
### FEATURE: Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case...

Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case to camelCase naming conventions, aligning with JS ecosystem standards (MDN, Airbnb, Node.js). Updated 9 skill documentation files in sk-code--opencode/ to reflect the new standard. Migrated ~2,980 unique identifiers across 163+ JS files using a segment-based parser that distinguishes CODE from STRING/COMMENT/TEMPLATE segments. Fixed multiple post-migration issues including stray backticks from template literal parser, self-referential const declarations, and broken module.exports blocks that still referenced old snake_case names. Added backward-compatible snake_case aliases in MCP handler exports and shared library files. Final verification: 206/206 syntax pass, 148/148 runtime pass, MCP server loads successfully. Created Level 3+ spec folder with full documentation.

**Details:** naming convention migration | snake_case to camelCase | JavaScript naming standards | module.exports camelCase | backward-compatible aliases | segment-based parser | MCP handler exports | sk-code--opencode skill | spec 090 | opencode naming conventions
<!-- /ANCHOR:implementation-completed-full-migration-all-27276cfd-session-1770400017446-6y3pw9nnj -->

<!-- ANCHOR:implementation-technical-implementation-details-8c73a253-session-1770400017446-6y3pw9nnj -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: The sk-code--opencode skill enforced snake_case for JavaScript functions/params/exports, which is non-standard — JS ecosystem uses camelCase (MDN, Airbnb, Node.js standards); solution: Updated 9 skill documentation files to specify camelCase for JS, then migrated ~206 JS files using a segment-based parser that avoids renaming inside strings/comments/templates. Added backward-compatible snake_case aliases in module.exports for external consumers. Fixed post-migration issues: stray backticks from template literal parser, self-referential const declarations, broken exports blocks referencing old names.; patterns: Segment-based JS parsing (CODE/STRING/COMMENT/TEMPLATE classification), backward-compatible export aliasing (camelCase primary + snake_case alias), SKIP_NAMES set for SQL columns and external API keys, directory-by-directory migration with cross-reference sweep

<!-- /ANCHOR:implementation-technical-implementation-details-8c73a253-session-1770400017446-6y3pw9nnj -->

<!-- /ANCHOR:detailed-changes-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<!-- ANCHOR:decisions-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
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

<!-- ANCHOR:decision-camelcase-functionsparamsexports-because-aligns-0f9b4b7d-session-1770400017446-6y3pw9nnj -->
### Decision 1: Decision: Use camelCase for JS functions/params/exports because it aligns with MDN, Airbnb, and Node.js ecosystem standards

**Context**: snake_case was non-standard for JavaScript

**Timestamp**: 2026-02-06T18:46:57Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Use camelCase for JS functions/params/exports because it aligns with MDN, Airbnb, and Node.js ecosystem standards

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: snake_case was non-standard for JavaScript

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-camelcase-functionsparamsexports-because-aligns-0f9b4b7d-session-1770400017446-6y3pw9nnj -->

---

<!-- ANCHOR:decision-keep-backward-85dbf987-session-1770400017446-6y3pw9nnj -->
### Decision 2: Decision: Keep backward

**Context**: compatible snake_case aliases in module.exports because MCP handlers may be consumed by external callers that expect the old names

**Timestamp**: 2026-02-06T18:46:57Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Keep backward

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: compatible snake_case aliases in module.exports because MCP handlers may be consumed by external callers that expect the old names

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-keep-backward-85dbf987-session-1770400017446-6y3pw9nnj -->

---

<!-- ANCHOR:decision-segment-17fba61f-session-1770400017446-6y3pw9nnj -->
### Decision 3: Decision: Use segment

**Context**: based parsing (CODE vs STRING vs COMMENT vs TEMPLATE) for migration because naive regex replacement would break string literals, SQL column names, and comments

**Timestamp**: 2026-02-06T18:46:57Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Use segment

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: based parsing (CODE vs STRING vs COMMENT vs TEMPLATE) for migration because naive regex replacement would break string literals, SQL column names, and comments

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-segment-17fba61f-session-1770400017446-6y3pw9nnj -->

---

<!-- ANCHOR:decision-broken-exports-blocks-memory-57646c17-session-1770400017446-6y3pw9nnj -->
### Decision 4: Decision: Fix broken exports blocks (memory

**Context**: parser.js, summary-generator.js, trigger-extractor.js, implementation-guide-extractor.js) that still referenced old snake_case function names in module.exports values — this was the most critical post-migration fix

**Timestamp**: 2026-02-06T18:46:57Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Fix broken exports blocks (memory

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: parser.js, summary-generator.js, trigger-extractor.js, implementation-guide-extractor.js) that still referenced old snake_case function names in module.exports values — this was the most critical post-migration fix

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-broken-exports-blocks-memory-57646c17-session-1770400017446-6y3pw9nnj -->

---

<!-- ANCHOR:decision-not-rename-uppersnakecase-constants-be0cd7e2-session-1770400017446-6y3pw9nnj -->
### Decision 5: Decision: Do NOT rename UPPER_SNAKE_CASE constants, PascalCase classes, kebab

**Context**: case filenames, Python/Shell files, or SQL column names because each follows its own ecosystem convention

**Timestamp**: 2026-02-06T18:46:57Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Do NOT rename UPPER_SNAKE_CASE constants, PascalCase classes, kebab

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: case filenames, Python/Shell files, or SQL column names because each follows its own ecosystem convention

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-not-rename-uppersnakecase-constants-be0cd7e2-session-1770400017446-6y3pw9nnj -->

---

<!-- /ANCHOR:decisions-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

<!-- ANCHOR:session-history-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
<a id="conversation"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number = DECISIONS section + 1
  See DECISIONS section comment for the full matrix.
  Range: 3-6 depending on optional sections present.
-->
## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **0** distinct phases.

##### Conversation Phases
- **Debugging** - 3 actions
- **Discussion** - 4 actions

---

### Message Timeline

> **User** | 2026-02-06 @ 18:46:57

Completed full migration of all JavaScript code in .opencode/skill/system-spec-kit/ from snake_case to camelCase naming conventions, aligning with JS ecosystem standards (MDN, Airbnb, Node.js). Updated 9 skill documentation files in sk-code--opencode/ to reflect the new standard. Migrated ~2,980 unique identifiers across 163+ JS files using a segment-based parser that distinguishes CODE from STRING/COMMENT/TEMPLATE segments. Fixed multiple post-migration issues including stray backticks from template literal parser, self-referential const declarations, and broken module.exports blocks that still referenced old snake_case names. Added backward-compatible snake_case aliases in MCP handler exports and shared library files. Final verification: 206/206 syntax pass, 148/148 runtime pass, MCP server loads successfully. Created Level 3+ spec folder with full documentation.

---

<!-- /ANCHOR:session-history-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<!-- ANCHOR:recovery-hints-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 003-memory-and-spec-kit/090-opencode-naming-conventions` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "003-memory-and-spec-kit/090-opencode-naming-conventions" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.js --status

# List memories for this spec folder
memory_search({ specFolder: "003-memory-and-spec-kit/090-opencode-naming-conventions", limit: 10 })

# Verify memory file integrity
ls -la 003-memory-and-spec-kit/090-opencode-naming-conventions/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js 003-memory-and-spec-kit/090-opencode-naming-conventions --force
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
<!-- /ANCHOR:recovery-hints-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<!-- ANCHOR:postflight-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->
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
<!-- /ANCHOR:postflight-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1770400017446-6y3pw9nnj"
spec_folder: "003-memory-and-spec-kit/090-opencode-naming-conventions"
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
created_at: "2026-02-06"
created_at_epoch: 1770400017
last_accessed_epoch: 1770400017
expires_at_epoch: 1778176017  # 0 for critical (never expires)

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
  - "implementation"
  - "documentation"
  - "distinguishes"
  - "declarations"
  - "verification"
  - "successfully"
  - "conventions"
  - "identifiers"
  - "referential"
  - "replacement"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:

  []

key_files:
  - ".opencode/skill/sk-code--opencode/SKILL.md"
  - ".opencode/.../javascript/style_guide.md"
  - ".opencode/.../javascript/quality_standards.md"
  - ".opencode/.../javascript/quick_reference.md"
  - ".opencode/.../shared/universal_patterns.md"
  - ".opencode/.../shared/code_organization.md"
  - ".opencode/.../checklists/javascript_checklist.md"
  - ".opencode/skill/sk-code--opencode/CHANGELOG.md"
  - ".opencode/skill/system-spec-kit/shared/trigger-extractor.js"
  - ".opencode/.../parsing/memory-parser.js"

# Relationships
related_sessions:

  []

parent_spec: "003-memory-and-spec-kit/090-opencode-naming-conventions"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-1770400017446-6y3pw9nnj-003-memory-and-spec-kit/090-opencode-naming-conventions -->

---

*Generated by system-spec-kit skill v1.7.2*

