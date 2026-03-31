---
title: "Implemented the complete SpecKit [02--system-spec-kit/021-spec-kit-phase-system/20-02-26_18-04__spec-kit-phase-system]"
trigger_phrases:
  - "spec kit phase system"
  - "spec 139"
  - "phase decomposition workflow"
  - "spec kit:phase"
  - "recommend-level phasing"
importance_tier: "important"
contextType: "general"
quality_flags:
  - "legacy_migration"
quality_score: 0.6
---
# Spec Kit Phase System

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-02-20 |
| Session ID | session-1771607055284-tsm22p7d4 |
| Spec Folder | 02--system-spec-kit/021-spec-kit-phase-system |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 7 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-20 |
| Created At (Epoch) | 1771607055 |
| Last Accessed (Epoch) | 1771607055 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight -->

## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | /100 |  |
| Uncertainty Score | /100 |  |
| Context Score | /100 |  |
| Timestamp |  | Session start |

**Initial Gaps Identified:**

- No significant gaps identified at session start

**Dual-Threshold Status at Start:**
- Confidence: %
- Uncertainty: 
- Readiness: 
<!-- /ANCHOR:preflight -->

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
| Session Status | COMPLETED |
| Completion % | 85% |
| Last Activity | 2026-02-20T17:04:15.275Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Template CORE + ADDENDUM v2., Decision: Deferred 3 test fixture tasks (T005/T028/T033) as P1 — because they do, Technical Implementation Details

**Decisions:** 7 decisions recorded

**Summary:** Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that formalizes phase decomposition as a first-class SpecKit capability. Executed 28 of 34 tasks across 4 phase...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/021-spec-kit-phase-system
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/021-spec-kit-phase-system
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../spec/recommend-level.sh, .opencode/skill/system-spec-kit/scripts/spec/create.sh, .opencode/skill/system-spec-kit/scripts/spec/validate.sh

- Check: plan.md, tasks.md, checklist.md

- Last: Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../spec/recommend-level.sh |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | sh set -e safety issue and JSON-safe level quoting. |

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

**Key Topics:** `phase` | `decision` | `system` | `spec` | `because` | `existing` | `level` | `phase system` | `tasks` | `wave` | `behavioral overlay` | `gate option` | 
<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **The complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that...** - Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that formalizes phase decomposition as a first-class SpecKit capability.

- **Technical Implementation Details** - rootCause: SpecKit lacked first-class support for decomposing large specs (L3/L3+) into manageable phases with proper folder structure, validation, and command routing; solution: Added phase system as behavioral overlay: scoring in recommend-level.

**Key Files and Their Roles**:

- `.opencode/.../spec/recommend-level.sh` - Script

- `.opencode/skill/system-spec-kit/scripts/spec/create.sh` - Script

- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` - Script

- `.opencode/skill/system-spec-kit/SKILL.md` - Documentation

- `.opencode/command/spec_kit/plan.md` - Documentation

- `.opencode/command/spec_kit/implement.md` - Documentation

- `.opencode/command/spec_kit/complete.md` - Documentation

- `.opencode/command/spec_kit/resume.md` - Documentation

**How to Extend**:

- Apply validation patterns to new input handling

- Use established template patterns for new outputs

**Common Patterns**:

- **Validation**: Input validation before processing

- **Template Pattern**: Use templates with placeholder substitution

- **Functional Transforms**: Use functional methods for data transformation

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that formalizes phase decomposition as a first-class SpecKit capability. Executed 28 of 34 tasks across 4 phases using Multi-Agent (1+3) dispatch in 3 waves. Phase 1 added 5-signal scoring to recommend-level.sh (threshold 25/50 AND level>=3). Phase 2 added --phase flag to create.sh with parent/child folder creation, Phase Documentation Map injection, and back-references. Phase 3 added PHASE intent to SKILL.md smart router, created /spec_kit:phase command with auto+confirm YAML workflows, and updated 4 existing commands (plan/implement/complete/resume) with Gate 3 Option E. Phase 4 added --recursive validation to validate.sh with per-phase aggregation, check-phase-links.sh rule plugin, phase_definitions.md reference, phase-system.md node, and updated 5 reference docs plus CLAUDE.md. Fixed validate.sh set -e safety issue and JSON-safe level quoting. 3 test fixture tasks (T005/T028/T033) deferred as P1.

**Key Outcomes**:
- Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that...
- Decision: Phase system is a behavioral overlay on existing levels, not a new lev
- Decision: 5-signal scoring dimensions (architectural=15, files>15=10, LOC>800=10
- Decision: Multi-Agent 1+3 dispatch in 3 waves organized by dependency graph — be
- Decision: Gate 3 Option E for phase child folders — because existing A/B/C/D did
- Decision: Validation rule plugin architecture (check-*.
- Decision: Template CORE + ADDENDUM v2.
- Decision: Deferred 3 test fixture tasks (T005/T028/T033) as P1 — because they do
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../spec/recommend-level.sh` | (threshold 25/50 AND level>=3) |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | With parent/child folder creation |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Set -e safety issue |
| `.opencode/skill/system-spec-kit/SKILL.md` | Smart router, created /spec_kit:phase command with auto+c... |
| `.opencode/command/spec_kit/plan.md` | File modified (description pending) |
| `.opencode/command/spec_kit/implement.md` | File modified (description pending) |
| `.opencode/command/spec_kit/complete.md` | File modified (description pending) |
| `.opencode/command/spec_kit/resume.md` | File modified (description pending) |
| `.opencode/.../structure/sub_folder_versioning.md` | File modified (description pending) |
| `.opencode/.../structure/level_specifications.md` | File modified (description pending) |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:graph-context -->
## Skill Graph Context

Nodes: 416 | Edges: 630 | Skills: 9

**Skill breakdown:**
- mcp-code-mode: 19 nodes
- mcp-figma: 16 nodes
- system-spec-kit: 164 nodes
- mcp-chrome-devtools: 19 nodes
- sk-code--full-stack: 62 nodes
- sk-code--opencode: 35 nodes
- workflows-code--web-dev: 44 nodes
- sk-doc: 36 nodes
- sk-git: 21 nodes

**Node types:** :Asset(51), :Document(135), :Entrypoint(9), :Index(9), :Node(73), :Reference(130), :Skill(9)

<!-- /ANCHOR:graph-context -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-complete-speckit-phase-system-c49cb51b -->
### FEATURE: Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that...

Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that formalizes phase decomposition as a first-class SpecKit capability. Executed 28 of 34 tasks across 4 phases using Multi-Agent (1+3) dispatch in 3 waves. Phase 1 added 5-signal scoring to recommend-level.sh (threshold 25/50 AND level>=3). Phase 2 added --phase flag to create.sh with parent/child folder creation, Phase Documentation Map injection, and back-references. Phase 3 added PHASE intent to SKILL.md smart router, created /spec_kit:phase command with auto+confirm YAML workflows, and updated 4 existing commands (plan/implement/complete/resume) with Gate 3 Option E. Phase 4 added --recursive validation to validate.sh with per-phase aggregation, check-phase-links.sh rule plugin, phase_definitions.md reference, phase-system.md node, and updated 5 reference docs plus CLAUDE.md. Fixed validate.sh set -e safety issue and JSON-safe level quoting. 3 test fixture tasks (T005/T028/T033) deferred as P1.

**Details:** phase system | phase decomposition | spec-kit phases | recommend-level phasing | create.sh --phase | validate.sh --recursive | phase scoring | Gate 3 Option E | phase-parent-section template | check-phase-links | SKILL.md PHASE intent | spec_kit:phase command | phase documentation map | multi-agent dispatch waves
<!-- /ANCHOR:implementation-complete-speckit-phase-system-c49cb51b -->

<!-- ANCHOR:implementation-technical-implementation-details-bf9cd8e0 -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: SpecKit lacked first-class support for decomposing large specs (L3/L3+) into manageable phases with proper folder structure, validation, and command routing; solution: Added phase system as behavioral overlay: scoring in recommend-level.sh, --phase mode in create.sh, --recursive in validate.sh, PHASE intent in SKILL.md router, /spec_kit:phase command, Gate 3 Option E, and comprehensive reference documentation; patterns: Template CORE+ADDENDUM composition, validation rule plugin architecture (check-*.sh), SKILL.md data-driven dict extension (INTENT_SIGNALS/RESOURCE_MAP/COMMAND_BOOSTS), multi-agent wave dispatch based on dependency graph; bugs_fixed: validate.sh set -e abort on conditional echo (added || true guards), JSON-safe level quoting for 3+ (detect non-numeric with regex); remaining_work: T005 (5 test fixtures for recommend-level.sh), T028 (6 test fixtures for validate.sh), T033 (4 test fixtures for create.sh) — all P1 deferred

<!-- /ANCHOR:implementation-technical-implementation-details-bf9cd8e0 -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-phase-system-behavioral-overlay-89fe4b3f -->
### Decision 1: Decision: Phase system is a behavioral overlay on existing levels, not a new level tier

**Context**: because it composes with L1-L3+ rather than replacing them

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Phase system is a behavioral overlay on existing levels, not a new level tier

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: because it composes with L1-L3+ rather than replacing them

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-phase-system-behavioral-overlay-89fe4b3f -->

---

<!-- ANCHOR:decision-unnamed-fb1feea7 -->
### Decision 2: Decision: 5

**Context**: signal scoring dimensions (architectural=15, files>15=10, LOC>800=10, risk>=2=10, extreme=5) with threshold 25/50 — because it correctly identifies 136/138 as needing phases while avoiding false positives on simple specs

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: 5

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: signal scoring dimensions (architectural=15, files>15=10, LOC>800=10, risk>=2=10, extreme=5) with threshold 25/50 — because it correctly identifies 136/138 as needing phases while avoiding false positives on simple specs

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-unnamed-fb1feea7 -->

---

<!-- ANCHOR:decision-multi-09eb5fd1 -->
### Decision 3: Decision: Multi

**Context**: Agent 1+3 dispatch in 3 waves organized by dependency graph — because tasks had clear dependency chains (Wave 1: independent, Wave 2: depends on Wave 1, Wave 3: depends on Wave 2)

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Multi

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Agent 1+3 dispatch in 3 waves organized by dependency graph — because tasks had clear dependency chains (Wave 1: independent, Wave 2: depends on Wave 1, Wave 3: depends on Wave 2)

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-multi-09eb5fd1 -->

---

<!-- ANCHOR:decision-gate-option-phase-child-92dff772 -->
### Decision 4: Decision: Gate 3 Option E for phase child folders

**Context**: because existing A/B/C/D didn't cover targeting a specific phase within a parent spec

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Gate 3 Option E for phase child folders

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: because existing A/B/C/D didn't cover targeting a specific phase within a parent spec

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-gate-option-phase-child-92dff772 -->

---

<!-- ANCHOR:decision-validation-rule-plugin-architecture-690ff425 -->
### Decision 5: Decision: Validation rule plugin architecture (check

**Context**: *.sh sourced by validate.sh) — because it follows existing pattern and keeps validate.sh modular

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Validation rule plugin architecture (check

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: *.sh sourced by validate.sh) — because it follows existing pattern and keeps validate.sh modular

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-validation-rule-plugin-architecture-690ff425 -->

---

<!-- ANCHOR:decision-template-core-addendum-v22-2fc070a1 -->
### Decision 6: Decision: Template CORE + ADDENDUM v2.2 composition for phase templates

**Context**: because it extends without modifying existing template infrastructure

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Template CORE + ADDENDUM v2.2 composition for phase templates

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: because it extends without modifying existing template infrastructure

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-template-core-addendum-v22-2fc070a1 -->

---

<!-- ANCHOR:decision-deferred-test-fixture-tasks-1d85d3f2 -->
### Decision 7: Decision: Deferred 3 test fixture tasks (T005/T028/T033) as P1

**Context**: because they don't block functionality and manual testing confirmed correctness

**Timestamp**: 2026-02-20T18:04:15Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Deferred 3 test fixture tasks (T005/T028/T033) as P1

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: because they don't block functionality and manual testing confirmed correctness

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-deferred-test-fixture-tasks-1d85d3f2 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Sequential with Decision Points** conversation pattern with **0** distinct phases.

##### Conversation Phases
- **Planning** - 1 actions
- **Discussion** - 5 actions
- **Verification** - 1 actions
- **Debugging** - 2 actions

---

### Message Timeline

> **User** | 2026-02-20 @ 18:04:15

Implemented the complete SpecKit Phase System (Spec 139) — a Level 3+ behavioral overlay that formalizes phase decomposition as a first-class SpecKit capability. Executed 28 of 34 tasks across 4 phases using Multi-Agent (1+3) dispatch in 3 waves. Phase 1 added 5-signal scoring to recommend-level.sh (threshold 25/50 AND level>=3). Phase 2 added --phase flag to create.sh with parent/child folder creation, Phase Documentation Map injection, and back-references. Phase 3 added PHASE intent to SKILL.md smart router, created /spec_kit:phase command with auto+confirm YAML workflows, and updated 4 existing commands (plan/implement/complete/resume) with Gate 3 Option E. Phase 4 added --recursive validation to validate.sh with per-phase aggregation, check-phase-links.sh rule plugin, phase_definitions.md reference, phase-system.md node, and updated 5 reference docs plus CLAUDE.md. Fixed validate.sh set -e safety issue and JSON-safe level quoting. 3 test fixture tasks (T005/T028/T033) deferred as P1.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/021-spec-kit-phase-system` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/021-spec-kit-phase-system" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/021-spec-kit-phase-system", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/021-spec-kit-phase-system/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/021-spec-kit-phase-system --force
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
| Knowledge |  |  |  | → |
| Uncertainty |  |  |  | → |
| Context |  |  |  | → |

**Learning Index:** /100

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
<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA


> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1771607055284-tsm22p7d4"
spec_folder: "02--system-spec-kit/021-spec-kit-phase-system"
channel: "main"

# Classification
importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated
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
created_at: "2026-02-20"
created_at_epoch: 1771607055
last_accessed_epoch: 1771607055
expires_at_epoch: 1779383055  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 7
tool_count: 0
file_count: 10
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "phase"
  - "decision"
  - "system"
  - "spec"
  - "because"
  - "existing"
  - "level"
  - "phase system"
  - "tasks"
  - "wave"
  - "behavioral overlay"
  - "gate option"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "spec kit phase system"
  - "spec 139"
  - "phase decomposition workflow"
  - "spec kit:phase"
  - "recommend-level phasing"

parent_spec: "02--system-spec-kit/021-spec-kit-phase-system"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1

# Quality Signals
quality_score: 1.00
quality_flags:
  []
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*
