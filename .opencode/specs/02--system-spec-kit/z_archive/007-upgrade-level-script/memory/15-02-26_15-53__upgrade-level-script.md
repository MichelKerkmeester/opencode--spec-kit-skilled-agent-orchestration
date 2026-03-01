---
title: "To promote a memory to constitutional tier (always [124-upgrade-level-script/15-02-26_15-53__upgrade-level-script]"
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
| Session Date | 2026-02-15 |
| Session ID | session-1771167189384-tl4xel7nn |
| Spec Folder | 02--system-spec-kit/z_archive/007-upgrade-level-script |
| Channel | main |
| Importance Tier | critical |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-15 |
| Created At (Epoch) | 1771167189 |
| Last Accessed (Epoch) | 1771167189 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight -->
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
<!-- /ANCHOR:preflight -->

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

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | BLOCKED |
| Completion % | 5% |
| Last Activity | 2026-02-15T14:53:09.379Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Script supports L1→L2→L3→L3+ upgrades with --dry-run, --json, --verbos, Decision: 46 uncovered documentation files (63% coverage gap) deferred as future, Technical Implementation Details

**Decisions:** 5 decisions recorded

**Summary:** Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc fixes). Spec 124's upgrade-level.sh script (1,510 lines, 23 functions) was fully implemented, reviewed (9...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/z_archive/007-upgrade-level-script
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/z_archive/007-upgrade-level-script
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../spec/upgrade-level.sh, .opencode/skill/system-spec-kit/scripts/spec/README.md, .opencode/skill/system-spec-kit/scripts/core/index.ts

- Check: plan.md, tasks.md, checklist.md

- Last: Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-

<!-- /ANCHOR:continue-session -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../spec/upgrade-level.sh |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | rootCause: No automated way to upgrade spec folder documentation levels (L1→L2→L3→L3+) — manual proc |

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

**Key Topics:** `spec` | `decision` | `level` | `upgrade` | `script` | `spec upgrade` | `both specs` | `recommend committing` | `committing spec` | `due cross` | `system spec kit/124 upgrade level script` | `uncovered` | 

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc...** - Completed all remaining work on Spec 124 (upgrade-level.

- **Technical Implementation Details** - rootCause: No automated way to upgrade spec folder documentation levels (L1→L2→L3→L3+) — manual process was error-prone and inconsistent; solution: Created upgrade-level.

**Key Files and Their Roles**:

- `.opencode/.../spec/upgrade-level.sh` - Script

- `.opencode/skill/system-spec-kit/scripts/spec/README.md` - Documentation

- `.opencode/skill/system-spec-kit/scripts/core/index.ts` - Entry point / exports

- `.opencode/.../core/subfolder-utils.ts` - Utility functions

- `.opencode/.../memory/generate-context.ts` - React context provider

- `.opencode/.../spec-folder/folder-detector.ts` - File modified (description pending)

- `.opencode/.../tests/test-subfolder-resolution.js` - File modified (description pending)

- `.opencode/.../124-upgrade-level-script/spec.md` - Documentation

**How to Extend**:

- Add new modules following the existing file structure patterns

- Create corresponding test files for new implementations

- Maintain consistent error handling approach

- Use established template patterns for new outputs

**Common Patterns**:

- **Helper Functions**: Encapsulate reusable logic in dedicated utility functions

- **Template Pattern**: Use templates with placeholder substitution

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc fixes). Spec 124's upgrade-level.sh script (1,510 lines, 23 functions) was fully implemented, reviewed (90/100), tested (4/4 pass), and documented in a prior session. This session focused on a comprehensive 10-agent audit of Spec 122 that uncovered critical issues (inverted LOC claim, wrong documentation level, missing L3 files), followed by a 7-agent fix dispatch that corrected all spec docs (spec.md, plan.md, tasks.md, checklist.md), created missing L3 files (implementation-summary.md, decision-record.md with 4 ADRs), fixed karabiner.json, and saved memory. Both specs remain uncommitted and ready for git commit. Recommend committing Spec 122 first due to cross-spec overlap on scripts/spec/README.md.

**Key Outcomes**:
- Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc...
- Decision: Keep both specs uncommitted per user instruction — ready for git commi
- Decision: Recommend committing Spec 122 before Spec 124 due to cross-spec overla
- Decision: Spec 124 upgrade-level.
- Decision: Script supports L1→L2→L3→L3+ upgrades with --dry-run, --json, --verbos
- Decision: 46 uncovered documentation files (63% coverage gap) deferred as future
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../spec/upgrade-level.sh` | Updated upgrade level |
| `.opencode/skill/system-spec-kit/scripts/spec/README.md` | Git commit |
| `.opencode/skill/system-spec-kit/scripts/core/index.ts` | File modified (description pending) |
| `.opencode/.../core/subfolder-utils.ts` | File modified (description pending) |
| `.opencode/.../memory/generate-context.ts` | File modified (description pending) |
| `.opencode/.../spec-folder/folder-detector.ts` | File modified (description pending) |
| `.opencode/.../tests/test-subfolder-resolution.js` | File modified (description pending) |
| `.opencode/.../124-upgrade-level-script/spec.md` | 4 ADRs), fixed karabiner |
| `.opencode/.../124-upgrade-level-script/plan.md` | 4 ADRs), fixed karabiner |
| `.opencode/.../124-upgrade-level-script/tasks.md` | 4 ADRs), fixed karabiner |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-completed-all-remaining-work-dd9e36dc -->
### FEATURE: Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc...

Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc fixes). Spec 124's upgrade-level.sh script (1,510 lines, 23 functions) was fully implemented, reviewed (90/100), tested (4/4 pass), and documented in a prior session. This session focused on a comprehensive 10-agent audit of Spec 122 that uncovered critical issues (inverted LOC claim, wrong documentation level, missing L3 files), followed by a 7-agent fix dispatch that corrected all spec docs (spec.md, plan.md, tasks.md, checklist.md), created missing L3 files (implementation-summary.md, decision-record.md with 4 ADRs), fixed karabiner.json, and saved memory. Both specs remain uncommitted and ready for git commit. Recommend committing Spec 122 first due to cross-spec overlap on scripts/spec/README.md.

**Details:** upgrade-level.sh | upgrade level script | spec folder level upgrade | L1 to L2 upgrade | L2 to L3 upgrade | documentation level migration | spec 124 | --to level syntax | template composition | addendum templates | dry-run upgrade | cross-spec overlap README
<!-- /ANCHOR:implementation-completed-all-remaining-work-dd9e36dc -->

<!-- ANCHOR:implementation-technical-implementation-details-347293fd -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: No automated way to upgrade spec folder documentation levels (L1→L2→L3→L3+) — manual process was error-prone and inconsistent; solution: Created upgrade-level.sh (1,510 lines, 23 functions) that reads current level, determines missing files from template system, creates them with proper SPECKIT_LEVEL markers, and handles edge cases like existing files and L3+ addendum sections; patterns: Template composition using core templates + level-specific addendum prefixes/suffixes. Script uses bash with heredoc templates, supports --dry-run for safe preview, --json for machine-readable output, and --keep-backups for safety. 4/4 test scenarios passing (L1→L2, L1→L3, L2→L3, same-level no-op).

<!-- /ANCHOR:implementation-technical-implementation-details-347293fd -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
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

<!-- ANCHOR:decision-keep-both-specs-uncommitted-ad0d6809 -->
### Decision 1: Decision: Keep both specs uncommitted per user instruction

**Context**: ready for git commit when user chooses

**Timestamp**: 2026-02-15T15:53:09Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Keep both specs uncommitted per user instruction

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: ready for git commit when user chooses

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-keep-both-specs-uncommitted-ad0d6809 -->

---

<!-- ANCHOR:decision-recommend-committing-spec-122-006aed0e -->
### Decision 2: Decision: Recommend committing Spec 122 before Spec 124 due to cross

**Context**: spec overlap on scripts/spec/README.md

**Timestamp**: 2026-02-15T15:53:09Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Recommend committing Spec 122 before Spec 124 due to cross

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: spec overlap on scripts/spec/README.md

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-recommend-committing-spec-122-006aed0e -->

---

<!-- ANCHOR:decision-spec-124-upgrade-7be0cb4b -->
### Decision 3: Decision: Spec 124 upgrade

**Context**: level.sh uses --to <level> syntax (not positional args) for clarity

**Timestamp**: 2026-02-15T15:53:09Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Spec 124 upgrade

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: level.sh uses --to <level> syntax (not positional args) for clarity

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-spec-124-upgrade-7be0cb4b -->

---

<!-- ANCHOR:decision-script-supports-l1l2l3l3-upgrades-42061643 -->
### Decision 4: Decision: Script supports L1→L2→L3→L3+ upgrades with

**Context**: -dry-run, --json, --verbose, --keep-backups flags

**Timestamp**: 2026-02-15T15:53:09Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Script supports L1→L2→L3→L3+ upgrades with

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: -dry-run, --json, --verbose, --keep-backups flags

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-script-supports-l1l2l3l3-upgrades-42061643 -->

---

<!-- ANCHOR:decision-uncovered-documentation-files-coverage-40aa9b20 -->
### Decision 5: Decision: 46 uncovered documentation files (63% coverage gap) deferred as future work in separate spec

**Context**: Decision: 46 uncovered documentation files (63% coverage gap) deferred as future work in separate spec

**Timestamp**: 2026-02-15T15:53:09Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: 46 uncovered documentation files (63% coverage gap) deferred as future work in separate spec

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: 46 uncovered documentation files (63% coverage gap) deferred as future work in separate spec

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-uncovered-documentation-files-coverage-40aa9b20 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
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
- **Planning** - 1 actions
- **Discussion** - 5 actions
- **Debugging** - 1 actions

---

### Message Timeline

> **User** | 2026-02-15 @ 15:53:09

Completed all remaining work on Spec 124 (upgrade-level.sh) and Spec 122 (prose-tightening doc fixes). Spec 124's upgrade-level.sh script (1,510 lines, 23 functions) was fully implemented, reviewed (90/100), tested (4/4 pass), and documented in a prior session. This session focused on a comprehensive 10-agent audit of Spec 122 that uncovered critical issues (inverted LOC claim, wrong documentation level, missing L3 files), followed by a 7-agent fix dispatch that corrected all spec docs (spec.md, plan.md, tasks.md, checklist.md), created missing L3 files (implementation-summary.md, decision-record.md with 4 ADRs), fixed karabiner.json, and saved memory. Both specs remain uncommitted and ready for git commit. Recommend committing Spec 122 first due to cross-spec overlap on scripts/spec/README.md.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/z_archive/007-upgrade-level-script` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/z_archive/007-upgrade-level-script" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/z_archive/007-upgrade-level-script", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/z_archive/007-upgrade-level-script/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/z_archive/007-upgrade-level-script --force
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
<!-- /ANCHOR:recovery-hints -->

---

<!-- ANCHOR:postflight -->
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
<!-- /ANCHOR:postflight -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1771167189384-tl4xel7nn"
spec_folder: "02--system-spec-kit/z_archive/007-upgrade-level-script"
channel: "main"

# Classification
importance_tier: "critical"  # constitutional|critical|important|normal|temporary|deprecated
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
created_at: "2026-02-15"
created_at_epoch: 1771167189
last_accessed_epoch: 1771167189
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
  - "spec"
  - "decision"
  - "level"
  - "upgrade"
  - "script"
  - "spec upgrade"
  - "both specs"
  - "recommend committing"
  - "committing spec"
  - "due cross"
  - "system spec kit/124 upgrade level script"
  - "uncovered"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/124 upgrade level script"
  - "created missing"
  - "prose tightening"
  - "implementation summary"
  - "decision record"
  - "dry run"
  - "keep backups"
  - "subfolder utils"
  - "generate context"
  - "spec folder"
  - "folder detector"
  - "test subfolder resolution"
  - "decision uncovered documentation files"
  - "uncovered documentation files coverage"
  - "documentation files coverage gap"
  - "files coverage gap deferred"
  - "coverage gap deferred future"
  - "gap deferred future work"
  - "deferred future work separate"
  - "future work separate spec"
  - "ready git commit user"
  - "git commit user chooses"
  - "level.sh uses --to syntax"
  - "uses --to syntax positional"
  - "--to syntax positional args"
  - "syntax positional args clarity"
  - "system"
  - "spec"
  - "kit/124"
  - "upgrade"
  - "level"
  - "script"

key_files:
  - ".opencode/.../spec/upgrade-level.sh"
  - ".opencode/skill/system-spec-kit/scripts/spec/README.md"
  - ".opencode/skill/system-spec-kit/scripts/core/index.ts"
  - ".opencode/.../core/subfolder-utils.ts"
  - ".opencode/.../memory/generate-context.ts"
  - ".opencode/.../spec-folder/folder-detector.ts"
  - ".opencode/.../tests/test-subfolder-resolution.js"
  - ".opencode/.../124-upgrade-level-script/spec.md"
  - ".opencode/.../124-upgrade-level-script/plan.md"
  - ".opencode/.../124-upgrade-level-script/tasks.md"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/z_archive/007-upgrade-level-script"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

