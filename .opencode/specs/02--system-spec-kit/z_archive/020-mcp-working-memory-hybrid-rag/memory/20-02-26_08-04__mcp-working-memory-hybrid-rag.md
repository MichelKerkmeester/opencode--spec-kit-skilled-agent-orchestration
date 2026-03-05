---
title: "To promote a memory to [136-mcp-working-memory-hybrid-rag/20-02-26_08-04__mcp-working-memory-hybrid-rag]"
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
| Session Date | 2026-02-20 |
| Session ID | session-1771571087901-cqa1lv34v |
| Spec Folder | ../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-20 |
| Created At (Epoch) | 1771571087 |
| Last Accessed (Epoch) | 1771571087 |
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
| Session Status | IN_PROGRESS |
| Completion % | 25% |
| Last Activity | 2026-02-20T07:04:47.896Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Run strict documentation validation and HVR checks after each README c, Decision: Reorder MCP README sections to put Quick Start at section 2 and add FA, Technical Implementation Details

**Decisions:** 5 decisions recorded

**Summary:** This session finalized the public release documentation pass for the hybrid memory rollout and aligned release-facing READMEs with the latest memory capabilities. Work included auditing system-spec-ki...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume ../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: ../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/skill/system-spec-kit/README.md, .opencode/skill/system-spec-kit/mcp_server/README.md, .opencode/README.md

- Check: plan.md, tasks.md, checklist.md

- Last: This session finalized the public release documentation pass for the hybrid memo

<!-- /ANCHOR:continue-session -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/skill/system-spec-kit/README.md |
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
| research.md | EXISTS |
| handover.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist
- [`decision-record.md`](./decision-record.md) - Architecture decisions
- [`research.md`](./research.md) - Research findings
- [`handover.md`](./handover.md) - Session handover notes

**Key Topics:** `decision` | `release` | `readme` | `spec` | `mcp` | `sections` | `memory` | `coverage` | `keep` | `system` | `hybrid` | `documentation` | 

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **This session finalized the public release documentation pass for the hybrid memory rollout and...** - This session finalized the public release documentation pass for the hybrid memory rollout and aligned release-facing READMEs with the latest memory capabilities.

- **Technical Implementation Details** - rootCause: Release-facing READMEs had stale counts and incomplete coverage of newly shipped memory capabilities, and one README diverged from updated template section flow.

**Key Files and Their Roles**:

- `.opencode/skill/system-spec-kit/README.md` - Documentation

- `.opencode/skill/system-spec-kit/mcp_server/README.md` - Documentation

- `.opencode/README.md` - Documentation

- `.opencode/skill/system-spec-kit/SKILL.md` - Documentation

- `.opencode/changelog/00--opencode-environment/v2.2.0.1.md` - Documentation

- `.opencode/changelog/01--system-spec-kit/v2.2.24.1.md` - Documentation

- `PUBLIC_RELEASE.md` - Documentation

- `.opencode/skill/system-spec-kit/nodes/gate-3-integration.md` - Documentation

**How to Extend**:

- Use established template patterns for new outputs

- Apply validation patterns to new input handling

**Common Patterns**:

- **Validation**: Input validation before processing

- **Template Pattern**: Use templates with placeholder substitution

- **Graceful Fallback**: Provide sensible defaults when primary method fails

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

This session finalized the public release documentation pass for the hybrid memory rollout and aligned release-facing READMEs with the latest memory capabilities. Work included auditing system-spec-kit and mcp_server READMEs against HVR and the current README template, correcting stale metrics and defaults, documenting typed retrieval contracts and artifact-aware routing, and publishing the v2.2.0.1 public release with tag and changelog updates. A follow-up structural pass added FAQ sections and moved MCP Quick Start to section 2 so both docs match the template flow while retaining excellent validator and DQI scores.

**Key Outcomes**:
- This session finalized the public release documentation pass for the hybrid memory rollout and...
- Decision: Use spec folder 02--system-spec-kit/020-mcp-working-memory-hybrid-rag
- Decision: Patch README content for freshness first (feature coverage, test total
- Decision: Publish a patch release v2.
- Decision: Run strict documentation validation and HVR checks after each README c
- Decision: Reorder MCP README sections to put Quick Start at section 2 and add FA
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/skill/system-spec-kit/README.md` | File modified (description pending) |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | File modified (description pending) |
| `.opencode/README.md` | File modified (description pending) |
| `.opencode/skill/system-spec-kit/SKILL.md` | File modified (description pending) |
| `.opencode/changelog/00--opencode-environment/v2.2.0.1.md` | File modified (description pending) |
| `.opencode/changelog/01--system-spec-kit/v2.2.24.1.md` | File modified (description pending) |
| `PUBLIC_RELEASE.md` | File modified (description pending) |
| `.opencode/skill/system-spec-kit/nodes/gate-3-integration.md` | File modified (description pending) |
| `.opencode/skill/system-spec-kit/nodes/when-to-use.md` | File modified (description pending) |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-session-finalized-public-release-84dda840 -->
### FEATURE: This session finalized the public release documentation pass for the hybrid memory rollout and...

This session finalized the public release documentation pass for the hybrid memory rollout and aligned release-facing READMEs with the latest memory capabilities. Work included auditing system-spec-kit and mcp_server READMEs against HVR and the current README template, correcting stale metrics and defaults, documenting typed retrieval contracts and artifact-aware routing, and publishing the v2.2.0.1 public release with tag and changelog updates. A follow-up structural pass added FAQ sections and moved MCP Quick Start to section 2 so both docs match the template flow while retaining excellent validator and DQI scores.

**Details:** spec 136 documentation alignment | hvr compliance readme | readme template faq requirement | mcp quick start section ordering | public release v2.2.0.1 | typed retrieval contracts | artifact class routing | adaptive hybrid fusion | mutation ledger telemetry | anchor coverage refresh
<!-- /ANCHOR:implementation-session-finalized-public-release-84dda840 -->

<!-- ANCHOR:implementation-technical-implementation-details-2cd0d539 -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: Release-facing READMEs had stale counts and incomplete coverage of newly shipped memory capabilities, and one README diverged from updated template section flow.; solution: Performed targeted documentation audit, patched stale values and missing feature descriptions, removed HVR punctuation violations, added FAQ sections, reordered MCP README sections, then revalidated with validate_document and structure extraction checks.; patterns: Patch in small verifiable batches, validate after each batch, keep release metadata and changelog versions synchronized, and enforce template and HVR compliance before final save.

<!-- /ANCHOR:implementation-technical-implementation-details-2cd0d539 -->

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

<!-- ANCHOR:decision-spec-folder-003-51746768 -->
### Decision 1: Decision: Use spec folder 003

**Context**: system-spec-kit/136-mcp-working-memory-hybrid-rag for context save because the session work was release and documentation closure for spec 136.

**Timestamp**: 2026-02-20T08:04:47Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Use spec folder 003

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: system-spec-kit/136-mcp-working-memory-hybrid-rag for context save because the session work was release and documentation closure for spec 136.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-spec-folder-003-51746768 -->

---

<!-- ANCHOR:decision-patch-readme-content-freshness-fba6b4fc -->
### Decision 2: Decision: Patch README content for freshness first (feature coverage, test totals, anchor coverage, config defaults) before release publication to keep release metadata accurate.

**Context**: Decision: Patch README content for freshness first (feature coverage, test totals, anchor coverage, config defaults) before release publication to keep release metadata accurate.

**Timestamp**: 2026-02-20T08:04:47Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Patch README content for freshness first (feature coverage, test totals, anchor coverage, config defaults) before release publication to keep release metadata accurate.

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Patch README content for freshness first (feature coverage, test totals, anchor coverage, config defaults) before release publication to keep release metadata accurate.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-patch-readme-content-freshness-fba6b4fc -->

---

<!-- ANCHOR:decision-publish-patch-release-v2201-b6203440 -->
### Decision 3: Decision: Publish a patch release v2.2.0.1 with updated changelogs and PUBLIC_RELEASE metadata rather than mutating the already

**Context**: published v2.2.0.0 release artifacts.

**Timestamp**: 2026-02-20T08:04:47Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Publish a patch release v2.2.0.1 with updated changelogs and PUBLIC_RELEASE metadata rather than mutating the already

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: published v2.2.0.0 release artifacts.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-publish-patch-release-v2201-b6203440 -->

---

<!-- ANCHOR:decision-run-strict-documentation-validation-a9c09015 -->
### Decision 4: Decision: Run strict documentation validation and HVR checks after each README change to keep style and structure compliance explicit.

**Context**: Decision: Run strict documentation validation and HVR checks after each README change to keep style and structure compliance explicit.

**Timestamp**: 2026-02-20T08:04:47Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Run strict documentation validation and HVR checks after each README change to keep style and structure compliance explicit.

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Run strict documentation validation and HVR checks after each README change to keep style and structure compliance explicit.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-run-strict-documentation-validation-a9c09015 -->

---

<!-- ANCHOR:decision-reorder-mcp-readme-sections-eccef3fd -->
### Decision 5: Decision: Reorder MCP README sections to put Quick Start at section 2 and add FAQ sections to both READMEs for template alignment.

**Context**: Decision: Reorder MCP README sections to put Quick Start at section 2 and add FAQ sections to both READMEs for template alignment.

**Timestamp**: 2026-02-20T08:04:47Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Reorder MCP README sections to put Quick Start at section 2 and add FAQ sections to both READMEs for template alignment.

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Reorder MCP README sections to put Quick Start at section 2 and add FAQ sections to both READMEs for template alignment.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-reorder-mcp-readme-sections-eccef3fd -->

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
- **Verification** - 4 actions
- **Discussion** - 3 actions

---

### Message Timeline

> **User** | 2026-02-20 @ 08:04:47

This session finalized the public release documentation pass for the hybrid memory rollout and aligned release-facing READMEs with the latest memory capabilities. Work included auditing system-spec-kit and mcp_server READMEs against HVR and the current README template, correcting stale metrics and defaults, documenting typed retrieval contracts and artifact-aware routing, and publishing the v2.2.0.1 public release with tag and changelog updates. A follow-up structural pass added FAQ sections and moved MCP Quick Start to section 2 so both docs match the template flow while retaining excellent validator and DQI scores.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume ../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag", limit: 10 })

# Verify memory file integrity
ls -la ../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js ../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag --force
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
session_id: "session-1771571087901-cqa1lv34v"
spec_folder: "../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag"
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
created_at: "2026-02-20"
created_at_epoch: 1771571087
last_accessed_epoch: 1771571087
expires_at_epoch: 1779347087  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 5
tool_count: 0
file_count: 9
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "decision"
  - "release"
  - "readme"
  - "spec"
  - "mcp"
  - "sections"
  - "memory"
  - "coverage"
  - "keep"
  - "system"
  - "hybrid"
  - "documentation"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "../.opencode/specs/003 system spec kit/136 mcp working memory hybrid rag"
  - "release facing"
  - "artifact aware"
  - "follow up"
  - "mcp working memory hybrid rag"
  - "opencode environment"
  - "gate 3 integration"
  - "when to use"
  - "decision patch readme content"
  - "patch readme content freshness"
  - "readme content freshness first"
  - "content freshness first coverage"
  - "freshness first coverage test"
  - "first coverage test totals"
  - "coverage test totals coverage"
  - "test totals coverage config"
  - "totals coverage config defaults"
  - "coverage config defaults release"
  - "config defaults release publication"
  - "defaults release publication keep"
  - "release publication keep release"
  - "publication keep release metadata"
  - "keep release metadata accurate"
  - "decision run strict documentation"
  - "run strict documentation validation"
  - "strict documentation validation hvr"
  - "../.opencode/specs/003"
  - "system"
  - "spec"
  - "kit/136"
  - "mcp"
  - "working"
  - "memory"
  - "hybrid"
  - "rag"

key_files:
  - ".opencode/skill/system-spec-kit/README.md"
  - ".opencode/skill/system-spec-kit/mcp_server/README.md"
  - ".opencode/README.md"
  - ".opencode/skill/system-spec-kit/SKILL.md"
  - ".opencode/changelog/00--opencode-environment/v2.2.0.1.md"
  - ".opencode/changelog/01--system-spec-kit/v2.2.24.1.md"
  - "PUBLIC_RELEASE.md"
  - ".opencode/skill/system-spec-kit/nodes/gate-3-integration.md"
  - ".opencode/skill/system-spec-kit/nodes/when-to-use.md"

# Relationships
related_sessions:

  []

parent_spec: "../.opencode/specs/02--system-spec-kit/020-mcp-working-memory-hybrid-rag"
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

