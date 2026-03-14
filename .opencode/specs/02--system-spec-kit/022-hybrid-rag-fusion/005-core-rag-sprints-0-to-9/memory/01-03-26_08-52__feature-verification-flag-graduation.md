---
title: "Feature Verification Flag Graduation [005-core-rag-sprints-0-to-8/01-03-26_08-52__feature-verification-flag-graduation]"
description: "Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement."
trigger_phrases:
  - "hybrid RAG fusion verification"
  - "feature flag graduation"
  - "graduated-ON semantics"
  - "SPECKIT_ environment variables"
  - "classification decay alignment"
importance_tier: "critical"
contextType: "general"
quality_score: 1.00
quality_flags: []

---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->

---

# hybrid rag fusion session 01-03-26

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-01 |
| Session ID | session-1772351564620-b9s50jp72 |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/005-core-rag-sprints-0-to-8 |
| Channel | main |
| Importance Tier | critical |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 6 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-01 |
| Created At (Epoch) | 1772351564 |
| Last Accessed (Epoch) | 1772351564 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | N/A | Auto-generated session |
| Uncertainty Score | N/A | Auto-generated session |
| Context Score | N/A | Auto-generated session |
| Timestamp | N/A | Session start |

**Initial Gaps Identified:**

- No significant gaps identified at session start

**Dual-Threshold Status at Start:**
- Confidence: N/A
- Uncertainty: N/A
- Readiness: N/A
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
| Session Status | IN_PROGRESS |
| Completion % | 25% |
| Last Activity | 2026-03-01T07:52:44.613Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Added scratch tier (0., Decision: Updated denylist count from 65 to 64 in summary (actual count: 29 comm, Technical Implementation Details

**Decisions:** 6 decisions recorded

**Summary:** Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3 P0 functional inconsistencies: TM-03 classification decay flag aligned to graduated-ON semantics (comp...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../scoring/composite-scoring.ts, .opencode/.../search/learned-feedback.ts, .opencode/.../search/rrf-fusion.ts

- Check: plan.md, tasks.md, checklist.md

- Last: Technical Implementation Details

<!-- /ANCHOR:continue-session -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../scoring/composite-scoring.ts |
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

**Key Topics:** `decision` | `count` | `graduated` | `summary` | `ts` | `already` | `scratch` | `decision aligned` | `fusion` | `aligned` | `because` | `updated` | 

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3...** - Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement.

- **Technical Implementation Details** - rootCause: Deep verification audit of 61 features found 10 concerns: 3 functional inconsistencies (flag semantics mismatches, dead code, potential double boost), 2 documentation gaps (incomplete flag docs, normalization asymmetry), and 5 code quality issues (stale comments, wrong counts, missing markers); solution: Systematic fix across 14 files: aligned flag semantics to graduated-ON convention, removed dead constants, documented all 50+ flags, corrected inaccurate comments/counts, and updated test assertions for new normalization defaults; patterns: Graduated-ON convention: process.

**Key Files and Their Roles**:

- `.opencode/.../scoring/composite-scoring.ts` - File modified (description pending)

- `.opencode/.../search/learned-feedback.ts` - File modified (description pending)

- `.opencode/.../search/rrf-fusion.ts` - File modified (description pending)

- `.opencode/.../search/channel-representation.ts` - File modified (description pending)

- `.opencode/.../search/bm25-index.ts` - Entry point / exports

- `.opencode/.../extraction/extraction-adapter.ts` - File modified (description pending)

- `.opencode/.../config/environment_variables.md` - Documentation

- `.opencode/.../022-hybrid-rag-fusion/summary_of_new_features.md` - Documentation

**How to Extend**:

- Add new modules following the existing file structure patterns

- Create corresponding test files for new implementations

**Common Patterns**:

- **Graceful Fallback**: Provide sensible defaults when primary method fails

- **Data Normalization**: Clean and standardize data before use

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3 P0 functional inconsistencies: TM-03 classification decay flag aligned to graduated-ON semantics (composite-scoring.ts), R11 dead SHADOW_PERIOD_MS constant removed from learned-feedback.ts, and co-activation boost chain audited (confirmed NO double boost — decayPerHop and boostFactor are distinct parameters). Fixed P1 score normalization asymmetry by aligning rrf-fusion.ts to graduated-ON. Documented all 50+ SPECKIT_ feature flags in environment_variables.md Section 8 with categories, defaults, sprint origins. Applied 4 P2 code quality fixes: stale comment in channel-representation.ts, BM25 field weight clarifying comment, denylist count corrected to 64 in summary, E2 comment marker added to extraction-adapter.ts. Added missing scratch tier to CLASSIFICATION_TIER_STABILITY_MULTIPLIER. Updated 6 test files to account for graduated-ON normalization producing [0,1] scores. All 7003 tests pass.

**Key Outcomes**:
- Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3...
- Decision: Aligned SPECKIT_CLASSIFICATION_DECAY to graduated-ON (!
- Decision: Removed SHADOW_PERIOD_MS dead constant rather than implementing shadow
- Decision: No change for co-activation boost chain because audit confirmed decayP
- Decision: Aligned RRF score normalization to graduated-ON to match composite-sco
- Decision: Added scratch tier (0.
- Decision: Updated denylist count from 65 to 64 in summary (actual count: 29 comm
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../scoring/(merged-small-files)` | PI-B1 merged 1 small files (composite-scoring.ts). composite-scoring.ts: Updated composite scoring |
| `.opencode/.../search/(merged-small-files)` | PI-B1 merged 4 small files (learned-feedback.ts, rrf-fusion.ts, channel-representation.ts, bm25-index.ts). learned-feedback.ts: Updated learned feedback | rrf-fusion.ts: Categories |
| `.opencode/.../extraction/(merged-small-files)` | PI-B1 merged 1 small files (extraction-adapter.ts). extraction-adapter.ts: Graduated-ON normalization producing [0 |
| `.opencode/.../config/(merged-small-files)` | PI-B1 merged 1 small files (environment_variables.md). environment_variables.md: Section 8 with categories |
| `.opencode/.../022-hybrid-rag-fusion/(merged-small-files)` | PI-B1 merged 1 small files (summary_of_new_features.md). summary_of_new_features.md: File modified (description pending) |
| `.opencode/.../tests/(merged-small-files)` | PI-B1 merged 2 small files (learned-feedback.vitest.ts, score-normalization.vitest.ts). learned-feedback.vitest.ts: File modified (description pending) | score-normalization.vitest.ts: File modified (description pending) |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-executed-full-feature-verification-b4e2fdcb -->
### FEATURE: Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3...

Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3 P0 functional inconsistencies: TM-03 classification decay flag aligned to graduated-ON semantics (composite-scoring.ts), R11 dead SHADOW_PERIOD_MS constant removed from learned-feedback.ts, and co-activation boost chain audited (confirmed NO double boost — decayPerHop and boostFactor are distinct parameters). Fixed P1 score normalization asymmetry by aligning rrf-fusion.ts to graduated-ON. Documented all 50+ SPECKIT_ feature flags in environment_variables.md Section 8 with categories, defaults, sprint origins. Applied 4 P2 code quality fixes: stale comment in channel-representation.ts, BM25 field weight clarifying comment, denylist count corrected to 64 in summary, E2 comment marker added to extraction-adapter.ts. Added missing scratch tier to CLASSIFICATION_TIER_STABILITY_MULTIPLIER. Updated 6 test files to account for graduated-ON normalization producing [0,1] scores. All 7003 tests pass.

**Details:** hybrid RAG fusion verification | feature flag graduation | graduated-ON semantics | SPECKIT_ environment variables | classification decay alignment | score normalization default | co-activation boost chain audit | shadow period removal | environment variables documentation | feature flag remediation | TM-03 flag mismatch | denylist count correction
<!-- /ANCHOR:implementation-executed-full-feature-verification-b4e2fdcb -->

<!-- ANCHOR:implementation-technical-implementation-details-61d05fbe -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: Deep verification audit of 61 features found 10 concerns: 3 functional inconsistencies (flag semantics mismatches, dead code, potential double boost), 2 documentation gaps (incomplete flag docs, normalization asymmetry), and 5 code quality issues (stale comments, wrong counts, missing markers); solution: Systematic fix across 14 files: aligned flag semantics to graduated-ON convention, removed dead constants, documented all 50+ flags, corrected inaccurate comments/counts, and updated test assertions for new normalization defaults; patterns: Graduated-ON convention: process.env.SPECKIT_X !== 'false' (active by default, explicitly disable with =false). Opt-in convention: === 'true' (inactive by default). isFeatureEnabled() wrapper in rollout-policy.ts handles graduated flags with deterministic bucketing.

<!-- /ANCHOR:implementation-technical-implementation-details-61d05fbe -->

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

<!-- ANCHOR:decision-aligned-speckitclassificationdecay-graduated-0142ba9f -->
### Decision 1: Decision: Aligned SPECKIT_CLASSIFICATION_DECAY to graduated

**Context**: ON (!== 'false') because fsrs-scheduler.ts already used this convention and the flag was described as graduated in the feature summary

**Timestamp**: 2026-03-01T08:52:44Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Aligned SPECKIT_CLASSIFICATION_DECAY to graduated

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: ON (!== 'false') because fsrs-scheduler.ts already used this convention and the flag was described as graduated in the feature summary

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-aligned-speckitclassificationdecay-graduated-0142ba9f -->

---

<!-- ANCHOR:decision-shadowperiodms-dead-constant-rather-93e89c80 -->
### Decision 2: Decision: Removed SHADOW_PERIOD_MS dead constant rather than implementing shadow period logic because the Sprint 8 summary already documented its removal and the safeguard count (9) was already correct

**Context**: Decision: Removed SHADOW_PERIOD_MS dead constant rather than implementing shadow period logic because the Sprint 8 summary already documented its removal and the safeguard count (9) was already correct

**Timestamp**: 2026-03-01T08:52:44Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Removed SHADOW_PERIOD_MS dead constant rather than implementing shadow period logic because the Sprint 8 summary already documented its removal and the safeguard count (9) was already correct

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Removed SHADOW_PERIOD_MS dead constant rather than implementing shadow period logic because the Sprint 8 summary already documented its removal and the safeguard count (9) was already correct

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-shadowperiodms-dead-constant-rather-93e89c80 -->

---

<!-- ANCHOR:decision-unnamed-ecfd2c46 -->
### Decision 3: Decision: No change for co

**Context**: activation boost chain because audit confirmed decayPerHop (0.5) and boostFactor (0.25) are distinct parameters applied at different stages — no double boost exists

**Timestamp**: 2026-03-01T08:52:44Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: No change for co

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: activation boost chain because audit confirmed decayPerHop (0.5) and boostFactor (0.25) are distinct parameters applied at different stages — no double boost exists

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-unnamed-ecfd2c46 -->

---

<!-- ANCHOR:decision-aligned-rrf-score-normalization-bf8c9347 -->
### Decision 4: Decision: Aligned RRF score normalization to graduated

**Context**: ON to match composite-scoring.ts convention, then updated 6 test files that assumed raw RRF scores

**Timestamp**: 2026-03-01T08:52:44Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Aligned RRF score normalization to graduated

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: ON to match composite-scoring.ts convention, then updated 6 test files that assumed raw RRF scores

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-aligned-rrf-score-normalization-bf8c9347 -->

---

<!-- ANCHOR:decision-scratch-tier-classificationtierstabilitymultiplier-test-d83917b0 -->
### Decision 5: Decision: Added scratch tier (0.5) to CLASSIFICATION_TIER_STABILITY_MULTIPLIER to fix test failure where scratch and normal tiers produced identical retrievability scores under classification decay

**Context**: Decision: Added scratch tier (0.5) to CLASSIFICATION_TIER_STABILITY_MULTIPLIER to fix test failure where scratch and normal tiers produced identical retrievability scores under classification decay

**Timestamp**: 2026-03-01T08:52:44Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Added scratch tier (0.5) to CLASSIFICATION_TIER_STABILITY_MULTIPLIER to fix test failure where scratch and normal tiers produced identical retrievability scores under classification decay

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Added scratch tier (0.5) to CLASSIFICATION_TIER_STABILITY_MULTIPLIER to fix test failure where scratch and normal tiers produced identical retrievability scores under classification decay

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-scratch-tier-classificationtierstabilitymultiplier-test-d83917b0 -->

---

<!-- ANCHOR:decision-denylist-count-summary-actual-3e232779 -->
### Decision 6: Decision: Updated denylist count from 65 to 64 in summary (actual count: 29 common nouns + 20 tech stop words + 15 generic modifiers = 64)

**Context**: Decision: Updated denylist count from 65 to 64 in summary (actual count: 29 common nouns + 20 tech stop words + 15 generic modifiers = 64)

**Timestamp**: 2026-03-01T08:52:44Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Updated denylist count from 65 to 64 in summary (actual count: 29 common nouns + 20 tech stop words + 15 generic modifiers = 64)

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Updated denylist count from 65 to 64 in summary (actual count: 29 common nouns + 20 tech stop words + 15 generic modifiers = 64)

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-denylist-count-summary-actual-3e232779 -->

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
- **Discussion** - 4 actions
- **Verification** - 1 actions
- **Debugging** - 2 actions

---

### Message Timeline

> **User** | 2026-03-01 @ 08:52:44

Executed full feature verification and remediation plan for Hybrid RAG Fusion Refinement. Fixed 3 P0 functional inconsistencies: TM-03 classification decay flag aligned to graduated-ON semantics (composite-scoring.ts), R11 dead SHADOW_PERIOD_MS constant removed from learned-feedback.ts, and co-activation boost chain audited (confirmed NO double boost — decayPerHop and boostFactor are distinct parameters). Fixed P1 score normalization asymmetry by aligning rrf-fusion.ts to graduated-ON. Documented all 50+ SPECKIT_ feature flags in environment_variables.md Section 8 with categories, defaults, sprint origins. Applied 4 P2 code quality fixes: stale comment in channel-representation.ts, BM25 field weight clarifying comment, denylist count corrected to 64 in summary, E2 comment marker added to extraction-adapter.ts. Added missing scratch tier to CLASSIFICATION_TIER_STABILITY_MULTIPLIER. Updated 6 test files to account for graduated-ON normalization producing [0,1] scores. All 7003 tests pass.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/005-core-rag-sprints-0-to-8 --force
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

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1772351564620-b9s50jp72"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion"
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
created_at: "2026-03-01"
created_at_epoch: 1772351564
last_accessed_epoch: 1772351564
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 6
tool_count: 0
file_count: 10
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "decision"
  - "count"
  - "graduated"
  - "summary"
  - "ts"
  - "already"
  - "scratch"
  - "decision aligned"
  - "fusion"
  - "aligned"
  - "because"
  - "updated"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion"
  - "decay per hop"
  - "boost factor"
  - "shadow period ms"
  - "classification tier stability multiplier"
  - "summary"
  - "tm 03"
  - "graduated on"
  - "co activation"
  - "rrf fusion"
  - "channel representation"
  - "extraction adapter"
  - "fsrs scheduler"
  - "pi b1"
  - "bm25 index"
  - "hybrid rag fusion refinement"
  - "scratch tier classification tier"
  - "tier classification tier stability"
  - "merged-small-files pi-b1 merged small"
  - "pi-b1 merged small files"
  - "test files to account"
  - "decayperhop boostfactor distinct parameters"
  - "decision removed shadow period"
  - "removed shadow period dead"
  - "shadow period dead constant"
  - "period dead constant rather"
  - "system"
  - "spec"
  - "kit/140"
  - "hybrid"
  - "rag"
  - "fusion"
  - "refinement"

key_files:
  - ".opencode/.../scoring/(merged-small-files)"
  - ".opencode/.../search/(merged-small-files)"
  - ".opencode/.../extraction/(merged-small-files)"
  - ".opencode/.../config/(merged-small-files)"
  - ".opencode/.../022-hybrid-rag-fusion/(merged-small-files)"
  - ".opencode/.../tests/(merged-small-files)"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion"
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

