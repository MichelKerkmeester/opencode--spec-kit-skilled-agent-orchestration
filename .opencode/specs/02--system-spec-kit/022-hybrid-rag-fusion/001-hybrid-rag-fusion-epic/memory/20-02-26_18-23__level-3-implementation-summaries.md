---
title: "Level 3 implementation summaries for spec 138"
description: "Created detailed Level 3+ implementation summaries for all three spec 138 workstreams and corrected feature-flag documentation for the final record."
trigger_phrases:
  - "implementation summaries"
  - "skill graph integration"
  - "unified graph intelligence"
  - "feature flags"
  - "isFeatureEnabled"
quality_score: 1.00
quality_flags: []
importance_tier: "normal"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-02-20 |
| Session ID | session-1771608202837-uiaa63he6 |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-20 |
| Created At (Epoch) | 1771608202 |
| Last Accessed (Epoch) | 1771608202 |
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
| Session Status | BLOCKED |
| Completion % | 5% |
| Last Activity | 2026-02-20T17:23:22.826Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Corrected critical documentation error in 003 summary — feature flags, Decision: Each summary includes complete file inventories, decision tables, veri, Technical Implementation Details

**Decisions:** 5 decisions recorded

**Summary:** Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec 138-hybrid-rag-fusion. Workstream A (001-system-speckit-hybrid-rag-fusion) received a 373-line summary co...

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

- Files modified: .opencode/.../001-system-speckit-hybrid-rag-fusion/implementation-summary.md, .opencode/.../002-skill-graph-integration/implementation-summary.md, .opencode/.../002-unified-graph-intelligence/implementation-summary.md

- Check: plan.md, tasks.md, checklist.md

- Last: Created detailed Level 3+ implementation summaries for all three workstream subf

<!-- /ANCHOR:continue-session -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../001-system-speckit-hybrid-rag-fusion/implementation-summary.md |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | Decision: Corrected critical documentation error in 003 summary — feature flags default to enabled ( |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |
| decision-record.md | EXISTS |
| research.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist
- [`decision-record.md`](./decision-record.md) - Architecture decisions
- [`research.md`](./research.md) - Research findings

**Key Topics:** `decision` | `lines` | `summary` | `all` | `existing` | `implementation` | `summaries` | `workstream` | `hybrid` | `rag` | `fusion` | `all three` | 

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Detailed Level 3+ implementation summaries for all three workstream subfolders of spec...** - Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec 138-hybrid-rag-fusion.

- **Technical Implementation Details** - rootCause: Three workstream subfolders had incomplete or outdated implementation summaries that did

**Key Files and Their Roles**:

- `.opencode/.../001-system-speckit-hybrid-rag-fusion/implementation-summary.md` - Documentation

- `.opencode/.../002-skill-graph-integration/implementation-summary.md` - Documentation

- `.opencode/.../002-unified-graph-intelligence/implementation-summary.md` - Documentation

**How to Extend**:

- Use established template patterns for new outputs

- Maintain consistent error handling approach

**Common Patterns**:

- **Template Pattern**: Use templates with placeholder substitution

- **Filter Pipeline**: Chain filters for data transformation

- **Graceful Fallback**: Provide sensible defaults when primary method fails

- **Functional Transforms**: Use functional methods for data transformation

- **Module Pattern**: Organize code into importable modules

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec 138-hybrid-rag-fusion. Workstream A (001-system-speckit-hybrid-rag-fusion) received a 373-line summary covering 5 new modules (MMR Reranker, Evidence Gap Detector, Query Expander, PageRank, Structure-Aware Chunker), 4 pipeline edits, and the two-wave 10-agent parallel orchestration. Workstream B (002-skill-graph-integration) received a 257-line summary covering 9 decomposed skills into 72 graph nodes, SGQS grammar/mapping/parser (3,197 LOC), and graph-enrichment.ts integration. Workstream C (003-unified-graph-intelligence) received a 339-line summary with corrected feature flag documentation (all flags default to enabled via isFeatureEnabled(), not disabled as previously documented). All summaries follow the root implementation-summary.md template format with ANCHOR tags, HVR references, and narrative sections.

**Key Outcomes**:
- Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec...
- Decision: Override all three existing implementation summaries with comprehensiv
- Decision: Used root-level implementation-summary.
- Decision: Parallelized creation using 3 speckit sub-agents for efficiency, each
- Decision: Corrected critical documentation error in 003 summary — feature flags
- Decision: Each summary includes complete file inventories, decision tables, veri
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../001-system-speckit-hybrid-rag-fusion/implementation-summary.md` | ANCHOR tags |
| `.opencode/.../002-skill-graph-integration/implementation-summary.md` | ANCHOR tags |
| `.opencode/.../002-unified-graph-intelligence/implementation-summary.md` | ANCHOR tags |

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

<!-- ANCHOR:implementation-detailed-level-implementation-summaries-ffd67f0d -->
### FEATURE: Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec...

Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec 138-hybrid-rag-fusion. Workstream A (001-system-speckit-hybrid-rag-fusion) received a 373-line summary covering 5 new modules (MMR Reranker, Evidence Gap Detector, Query Expander, PageRank, Structure-Aware Chunker), 4 pipeline edits, and the two-wave 10-agent parallel orchestration. Workstream B (002-skill-graph-integration) received a 257-line summary covering 9 decomposed skills into 72 graph nodes, SGQS grammar/mapping/parser (3,197 LOC), and graph-enrichment.ts integration. Workstream C (003-unified-graph-intelligence) received a 339-line summary with corrected feature flag documentation (all flags default to enabled via isFeatureEnabled(), not disabled as previously documented). All summaries follow the root implementation-summary.md template format with ANCHOR tags, HVR references, and narrative sections.

**Details:** implementation summary | hybrid RAG fusion | workstream summaries | spec 138 | unified graph intelligence | skill graph integration | feature flags default enabled | isFeatureEnabled rollout-policy | D-Wave compliance review | speckit Level 3+ documentation
<!-- /ANCHOR:implementation-detailed-level-implementation-summaries-ffd67f0d -->

<!-- ANCHOR:implementation-technical-implementation-details-a9b2666a -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: Three workstream subfolders had incomplete or outdated implementation summaries that did not match the quality of the root-level synthesis document; solution: Created comprehensive Level 3+ implementation summaries for each subfolder using parallel speckit agents, each reading full context (tasks, checklists, decisions) and following the root summary template; patterns: ANCHOR-tagged markdown with HVR references, narrative sections (What Built, How Delivered, Decisions, Verification, Limitations, File Inventory, Deferred Items), and feature flag correction propagation

<!-- /ANCHOR:implementation-technical-implementation-details-a9b2666a -->

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

<!-- ANCHOR:decision-override-all-three-existing-ebeb708a -->
### Decision 1: Decision: Override all three existing implementation summaries with comprehensive rewrites because existing versions were either thin stubs (002: 125 lines, 003: 158 lines) or needed enhancement (001: 291 lines)

**Context**: Decision: Override all three existing implementation summaries with comprehensive rewrites because existing versions were either thin stubs (002: 125 lines, 003: 158 lines) or needed enhancement (001: 291 lines)

**Timestamp**: 2026-02-20T18:23:22Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Override all three existing implementation summaries with comprehensive rewrites because existing versions were either thin stubs (002: 125 lines, 003: 158 lines) or needed enhancement (001: 291 lines)

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Override all three existing implementation summaries with comprehensive rewrites because existing versions were either thin stubs (002: 125 lines, 003: 158 lines) or needed enhancement (001: 291 lines)

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-override-all-three-existing-ebeb708a -->

---

<!-- ANCHOR:decision-root-afea3835 -->
### Decision 2: Decision: Used root

**Context**: level implementation-summary.md (293 lines) as the quality/format template for consistency across all workstream summaries

**Timestamp**: 2026-02-20T18:23:22Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Used root

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: level implementation-summary.md (293 lines) as the quality/format template for consistency across all workstream summaries

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-root-afea3835 -->

---

<!-- ANCHOR:decision-parallelized-creation-speckit-sub-c77dcdf3 -->
### Decision 3: Decision: Parallelized creation using 3 speckit sub

**Context**: agents for efficiency, each with full context (tasks.md, checklist.md, decision-record.md) for their workstream

**Timestamp**: 2026-02-20T18:23:22Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Parallelized creation using 3 speckit sub

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: agents for efficiency, each with full context (tasks.md, checklist.md, decision-record.md) for their workstream

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-parallelized-creation-speckit-sub-c77dcdf3 -->

---

<!-- ANCHOR:decision-corrected-critical-documentation-error-81eadefc -->
### Decision 4: Decision: Corrected critical documentation error in 003 summary

**Context**: feature flags default to enabled (true) via isFeatureEnabled() from rollout-policy.ts, not disabled as previously stated

**Timestamp**: 2026-02-20T18:23:22Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Corrected critical documentation error in 003 summary

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: feature flags default to enabled (true) via isFeatureEnabled() from rollout-policy.ts, not disabled as previously stated

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-corrected-critical-documentation-error-81eadefc -->

---

<!-- ANCHOR:decision-each-summary-includes-complete-7ccdc746 -->
### Decision 5: Decision: Each summary includes complete file inventories, decision tables, verification evidence, and deferred items for full traceability

**Context**: Decision: Each summary includes complete file inventories, decision tables, verification evidence, and deferred items for full traceability

**Timestamp**: 2026-02-20T18:23:22Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Each summary includes complete file inventories, decision tables, verification evidence, and deferred items for full traceability

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Each summary includes complete file inventories, decision tables, verification evidence, and deferred items for full traceability

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-each-summary-includes-complete-7ccdc746 -->

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
- **Discussion** - 4 actions
- **Verification** - 2 actions
- **Debugging** - 1 actions

---

### Message Timeline

> **User** | 2026-02-20 @ 18:23:22

Created detailed Level 3+ implementation summaries for all three workstream subfolders of spec 138-hybrid-rag-fusion. Workstream A (001-system-speckit-hybrid-rag-fusion) received a 373-line summary covering 5 new modules (MMR Reranker, Evidence Gap Detector, Query Expander, PageRank, Structure-Aware Chunker), 4 pipeline edits, and the two-wave 10-agent parallel orchestration. Workstream B (002-skill-graph-integration) received a 257-line summary covering 9 decomposed skills into 72 graph nodes, SGQS grammar/mapping/parser (3,197 LOC), and graph-enrichment.ts integration. Workstream C (003-unified-graph-intelligence) received a 339-line summary with corrected feature flag documentation (all flags default to enabled via isFeatureEnabled(), not disabled as previously documented). All summaries follow the root implementation-summary.md template format with ANCHOR tags, HVR references, and narrative sections.

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
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic --force
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
session_id: "session-1771608202837-uiaa63he6"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion"
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
created_at_epoch: 1771608202
last_accessed_epoch: 1771608202
expires_at_epoch: 1779384202  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 5
tool_count: 0
file_count: 3
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "decision"
  - "lines"
  - "summary"
  - "all"
  - "existing"
  - "implementation"
  - "summaries"
  - "workstream"
  - "hybrid"
  - "rag"
  - "fusion"
  - "all three"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion"
  - "is feature enabled"
  - "context"
  - "system speckit hybrid rag fusion"
  - "structure aware"
  - "two wave"
  - "skill graph integration"
  - "graph enrichment"
  - "unified graph intelligence"
  - "implementation summary"
  - "decision record"
  - "rollout policy"
  - "decision override three existing"
  - "override three existing implementation"
  - "three existing implementation summaries"
  - "existing implementation summaries comprehensive"
  - "implementation summaries comprehensive rewrites"
  - "summaries comprehensive rewrites existing"
  - "comprehensive rewrites existing versions"
  - "rewrites existing versions either"
  - "existing versions either thin"
  - "versions either thin stubs"
  - "either thin stubs lines"
  - "thin stubs lines lines"
  - "stubs lines lines needed"
  - "lines lines needed enhancement"
  - "system"
  - "spec"
  - "kit/022"
  - "hybrid"
  - "rag"
  - "fusion"
  - "system-spec-kit"
  - "skill"
  - "kit"
  - "readme"
  - "spec kit framework"
  - "unified documentation and memory system that makes ai-assisted development sustainable with enforced documentation and persistent context."
  - "document"
  - "spec kit - mandatory conversation documentation"
  - "unified documentation and context preservation: spec folder workflow (levels 1-3+), core + addendum template architecture (v2.2), validation, and spec kit memory for context preservation. mandatory for all file modifications."
  - "entrypoint"
  - "complexity_decision_matrix"
  - "complexity decision matrix"
  - "quick reference for complexity-based level selection and feature enabling."
  - "asset"
  - "level_decision_matrix"
  - "level decision matrix"
  - "quick reference for selecting the appropriate documentation level using progressive enhancement."
  - "parallel_dispatch_config"
  - "parallel dispatch configuration"
  - "complexity scoring and agent dispatch configuration for parallel task execution."
  - "template_mapping"
  - "template mapping"
  - "complete mapping of documentation levels to templates with copy commands."
  - "config"
  - "configuration files for spec kit's memory system, complexity detection, search and content filtering"
  - "constitutional memory system"
  - "always-surface rules and critical context that must be visible to ai agents on every interaction."
  - "gate-enforcement"
  - "gate enforcement - edge cases & cross-reference"
  - "speckit-exclusivity"
  - "spec documentation agent exclusivity - @speckit only"
  - "index"
  - "install_guide"
  - "spec kit memory mcp server installation guide"
  - "spec kit memory mcp server"
  - "cognitive memory system for ai assistants featuring hybrid search, fsrs-powered decay, causal graphs and session deduplication."
  - "mcp server configuration files"
  - "search-weight reference config and documented active/legacy sections for memory scoring behavior."
  - "mcp server core modules"
  - "configuration, database-state coordination, and shared runtime guards for the spec kit memory mcp server."
  - "mcp server database storage"
  - "runtime sqlite storage for memory index data, vectors, fts, and coordination files."
  - "mcp server formatters"
  - "response formatting for search results, anchor filtering metrics, and safe content shaping."
  - "handlers"
  - "mcp tool handlers for context, search, crud, indexing, checkpoints, learning, and causal graph operations."
  - "hooks"
  - "memory-surface helper functions for context hint extraction and optional auto-surfacing."
  - "mcp server library"
  - "core library modules for search, scoring, cognitive memory and storage."
  - "architecture module"
  - "7-layer mcp architecture with token budgets and document-aware routing after spec 126."
  - "cache module"
  - "tool output caching with ttl, lru eviction, and spec-document-aware invalidation paths."
  - "cognitive subsystem"
  - "research-backed memory decay, retrieval, classification and lifecycle engine with document-aware scoring inputs."
  - "memory and document type configuration"
  - "memory-type decay configuration plus spec 126 document-type inference and defaults."
  - "contracts"
  - "typed contracts for the retrieval pipeline. defines envelopes, traces, and degraded-mode handling for structured, observable retrieval."
  - "errors"
  - "error handling subsystem with custom error classes, recovery hints, and document-aware operation context."
  - "extraction"
  - "post-tool extraction pipeline for automated memory creation. resolves memory ids, orchestrates extraction, and gates pii/secret content before insert."
  - "interfaces"
  - "protocol abstractions for embedding/vector backends, with shared-package migration notes."
  - "learning"
  - "correction tracking that updates stability signals across memory and spec-document entries."
  - "parsing modules"
  - "memory file parsing and trigger matching for the spec kit memory system."
  - "providers modules"
  - "embedding provider abstraction and retry management for the spec kit memory system."
  - "response module"
  - "standardized response envelope for mcp tools: summary, data, hints, meta."
  - "scoring algorithms"
  - "multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
  - "search subsystem"
  - "multi-modal hybrid search architecture combining vector, lexical (bm25/fts5) and graph-based retrieval with reciprocal rank fusion (rrf)."
  - "session layer"
  - "session management for the spec kit memory mcp server. handles session deduplication, crash recovery and context persistence."
  - "storage layer"
  - "persistence layer for the spec kit memory mcp server. handles memory indexing, checkpoints, causal graphs and atomic file operations."
  - "telemetry"
  - "retrieval telemetry for observability and governance. records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs."
  - "utils"
  - "utility functions for output formatting and path security."
  - "validation"
  - "pre-flight quality gates for memory operations: anchor validation, duplicate detection and token budget verification."
  - "mcp server test suite"
  - "vitest-based test suite for cognitive memory and mcp handlers."
  - "tools: dispatch layer"
  - "dispatcher modules that route mcp tool names to typed handler calls."
  - "mcp server utilities"
  - "shared validators, json helpers, batch processing helpers, and db utility functions."
  - "checklist-verification"
  - "checklist verification"
  - "how the checklist acts as an active verification tool for level 2+ specs."
  - "node"
  - "context-preservation"
  - "context preservation"
  - "how generate-context.js preserves conversation state into memory/ folders."
  - "folder-naming-versioning"
  - "folder naming and versioning"
  - "rules for naming and versioning spec folders."
  - "gate-3-integration"
  - "gate 3 integration"
  - "how gate 3 asks the user for spec folder routing before any file changes."
  - "memory-system"
  - "spec kit memory system"
  - "details on the integrated spec kit memory mcp server (vector search, tiers, chunking)."
  - "phase-system"
  - "phase system"
  - "phase decomposition for complex multi-session specifications, splitting large work into parallel child spec folders."
  - "progressive-enhancement"
  - "progressive enhancement levels"
  - "how the 3-level documentation system (core + addendum) scales based on code complexity."
  - "rules"
  - "system-spec-kit rules"
  - "mandatory rules (always, never, escalate) for using the system-spec-kit workflow."
  - "validation-workflow"
  - "validation workflow"
  - "how validate.sh automates the validation of spec folder contents."
  - "when-to-use"
  - "when to use spec kit"
  - "triggers and conditions for when to use the spec kit workflow, including folder requirements and agent exclusivity."
  - "environment_variables"
  - "environment variables reference"
  - "configuration options via environment variables for the spec kit system"
  - "reference"
  - "troubleshooting"
  - "troubleshooting reference"
  - "systematic diagnosis and resolution for semantic memory issues, context retrieval failures, and mcp tool problems."
  - "universal_debugging_methodology"
  - "universal debugging methodology"
  - "stack-agnostic 4-phase debugging approach applicable to any technology."
  - "embedding_resilience"
  - "embedding resilience"
  - "provider fallback chains, graceful degradation, and offline mode for reliable semantic search"
  - "epistemic-vectors"
  - "epistemic vectors reference"
  - "uncertainty tracking framework for measuring knowledge gaps separate from confidence scoring"
  - "memory_system"
  - "memory system reference"
  - "detailed documentation for spec kit memory mcp tools, behavior notes, and configuration"
  - "readme_indexing"
  - "readme indexing pipeline"
  - "how readme files are discovered, weighted, and indexed within the 5-source indexing pipeline alongside memory files, constitutional rules, project readmes, and spec documents."
  - "save_workflow"
  - "memory save workflow"
  - "complete guide to saving conversation context including execution methods, output format, and retrieval."
  - "trigger_config"
  - "trigger configuration"
  - "complete configuration guide for memory trigger phrases and the fast trigger matching system."
  - "folder_routing"
  - "folder routing & alignment"
  - "stateless spec folder routing with alignment scoring for context preservation."
  - "folder_structure"
  - "folder structure reference"
  - "spec folder naming conventions, level requirements, and organization patterns"
  - "phase_definitions"
  - "phase definitions"
  - "phase decomposition system for complex multi-session specifications, providing parallel work stream organization as a behavioral overlay on existing documentation levels."
  - "sub_folder_versioning"
  - "sub-folder versioning"
  - "workflow-assisted pattern for organizing iterative work within existing spec folders using versioned sub-folders and isolated memory context."
  - "level_selection_guide"
  - "level selection guide"
  - "guide to selecting appropriate documentation levels based on task complexity."
  - "level_specifications"
  - "level specifications"
  - "complete specifications for all documentation levels using core + addendum architecture (v2.2)."
  - "template_guide"
  - "template guide"
  - "comprehensive guide to template selection, copying, adaptation, and quality standards using the progressive enhancement model."
  - "template_style_guide"
  - "template style guide"
  - "conventions and standards for system-spec-kit templates ensuring documentation consistency across all spec folders."
  - "decision-format"
  - "structured gate decision format"
  - "standardized format for documenting gate decisions to ensure auditability and traceability"
  - "five-checks"
  - "five checks framework"
  - "evaluation framework for validating significant decisions before implementation"
  - "path_scoped_rules"
  - "path-scoped validation rules"
  - "path-scoped validation system for differentiated validation based on file location, level, and type"
  - "phase_checklists"
  - "phase checklists"
  - "priority-based checklists for each phase of the speckit workflow."
  - "validation_rules"
  - "validation rules reference"
  - "complete reference for all validation rules used by the speckit validation system."
  - "execution_methods"
  - "execution methods reference"
  - "how to execute spec folder operations - validation, completion checking, context saving, and template composition"
  - "quick_reference"
  - "quick reference"
  - "fast lookup for commands, checklists, and troubleshooting using the progressive enhancement model."
  - "rollback-runbook"
  - "rollback runbook: working memory automation"
  - "worked_examples"
  - "worked examples reference"
  - "practical scenarios demonstrating speckit workflows for different documentation levels."
  - "shared library modules"
  - "consolidated typescript modules shared between cli scripts and mcp server for embedding generation and trigger extraction."
  - "embeddings factory"
  - "flexible embeddings system supporting multiple backends with strong fallback and per-profile databases."
  - "folder scoring"
  - "computes composite relevance scores for spec folders based on their memories, used for ranking and resume-recent-work workflows."
  - "shared utilities"
  - "low-level utility functions providing security-hardened path validation and resilient retry logic shared across system-spec-kit."
  - "templates"
  - "system spec kit template architecture and level routing."
  - "addendum templates"
  - "level extension blocks used to compose final level templates."
  - "checklist"
  - "verification checklist: [name]"
  - "plan-level2"
  - "spec-level2"
  - "decision-record"
  - "decision record: [name]"
  - "plan-level3"
  - "spec-level3-guidance"
  - "spec-level3-prefix"
  - "spec-level3-suffix"
  - "spec-level3"
  - "checklist-extended"
  - "plan-level3plus"
  - "spec-level3plus-guidance"
  - "spec-level3plus-suffix"
  - "spec-level3plus"
  - "phase-child-header"
  - "phase-parent-section"
  - "context_template"
  - "session summary"
  - "core templates"
  - "shared base templates used by all documentation levels."
  - "impl-summary-core"
  - "plan-core"
  - "implementation plan: [name]"
  - "spec-core"
  - "feature specification: [name]"
  - "tasks-core"
  - "tasks: [name]"
  - "debug-delegation"
  - "debug delegation report"
  - "template examples"
  - "reference examples showing expected documentation depth by level."
  - "implementation-summary"
  - "plan"
  - "implementation plan: add user authentication"
  - "feature specification: add user authentication"
  - "tasks"
  - "tasks: add user authentication"
  - "verification checklist: add user authentication"
  - "decision record: add user authentication"
  - "handover"
  - "session handover document"
  - "level 1 templates"
  - "baseline documentation templates for low-risk, small-scope changes."
  - "level 2 templates"
  - "verification-focused templates for medium complexity changes."
  - "level 3 templates"
  - "architecture-oriented templates for large or high-risk implementation work."
  - "level 3+ templates"
  - "governance-heavy templates for high-complexity or regulated work."
  - "memory"
  - "memory workflow rules for generated context files in spec folders."
  - "research"
  - "feature research: [your_value_here: feature-name] - comprehensive technical investigation"
  - "scratch directory template"
  - "template and guidelines for the scratch/ subdirectory used for temporary and disposable files during spec folder work."
  - "01-overview"
  - "overview"
  - "02-requirements"
  - "requirements"
  - "03-architecture"
  - "architecture"
  - "04-testing"
  - "testing strategy"
  - "spec-index"
  - "[feature name] - specification index"
  - "mcp-code-mode"
  - "mcp"
  - "code"
  - "mode"
  - "mcp code mode installation guide"
  - "code mode mcp - typescript tool execution"
  - "mcp orchestration via typescript execution for efficient multi-tool workflows with 98.7% context reduction and 60% faster execution."
  - "mcp code mode"
  - "mcp orchestration via typescript execution for efficient multi-tool workflows. use code mode for all mcp tool calls (clickup, notion, figma, webflow, chrome devtools, etc.). provides 98.7% context reduction, 60% faster execution, and type-safe invocation. mandatory for external tool integration."
  - "config_template"
  - "configuration template"
  - "complete .utcp_config.json template for code mode utcp setup with multiple mcp servers."
  - "env_template"
  - "environment variables template"
  - "complete .env file template with placeholders for all mcp server credentials and api tokens."
  - "mcp code mode orchestrator"
  - "how-it-works"
  - "how it works"
  - "the architecture of the utcp typescript execution environment."
  - "project-configuration"
  - "project configuration"
  - "how to configure .utcp_config.json for external mcp tools."
  - "quick-reference"
  - "code snippets and templates for code mode invocations."
  - "code mode rules"
  - "mandatory rules (always, never) for writing code mode scripts."
  - "success-criteria"
  - "success criteria"
  - "definition of done for a successful code mode invocation."
  - "when to use code mode"
  - "when to trigger code mode and when to use native mcp instead."
  - "system architecture - code mode utcp"
  - "architecture, data flow, and execution environment for code mode utcp."
  - "configuration"
  - "configuration guide - .utcp_config.json and environment setup"
  - "configure mcp servers, environment variables, and credentials for code mode utcp."
  - "naming_convention"
  - "tool naming convention - complete guide"
  - "critical naming pattern for mcp tool calls with troubleshooting guide."
  - "tool_catalog"
  - "tool catalog - complete list of available mcp tools"
  - "reference catalog of 170+ tools across 7 mcp servers."
  - "workflows"
  - "workflow examples - complex multi-tool patterns"
  - "five workflow patterns for multi-tool orchestration, error handling, and state persistence."
  - "mcp-figma"
  - "figma"
  - "figma mcp installation guide"
  - "figma mcp"
  - "programmatic access to figma design files through 18 specialized tools via code mode for token-efficient workflows."
  - "figma mcp - design file access"
  - "figma design file access via mcp providing 18 tools for file retrieval, image export, component/style extraction, team management, and collaborative commenting. accessed via code mode for token-efficient workflows."
  - "tool_categories"
  - "tool categories - priority classification"
  - "categorization of all 18 figma mcp tools with priority levels for efficient usage."
  - "core workflow for invoking figma tools via code mode, including naming conventions and examples."
  - "integration-points"
  - "integration points"
  - "prerequisites, code mode dependency, configuration, and cross-tool workflow patterns."
  - "essential commands, common patterns, and troubleshooting for figma mcp tools."
  - "related-resources"
  - "related resources"
  - "reference documents, assets, external links, and related skills for figma mcp."
  - "mandatory always, never, and escalate rules for using figma mcp tools."
  - "smart-routing"
  - "smart routing"
  - "intent-based resource routing logic for loading figma skill references on demand."
  - "completion gates and validation checkpoints for figma mcp operations."
  - "when to use"
  - "activation triggers, use cases, and when not to use the figma mcp skill."
  - "quick_start"
  - "quick start - figma mcp"
  - "get started with figma mcp in 5 minutes covering prerequisites, verification, and first commands."
  - "tool_reference"
  - "figma tool reference - complete guide"
  - "complete documentation for all 18 figma mcp tools, organized by category with priority levels and usage guidance."
  - "mcp-chrome-devtools"
  - "chrome"
  - "devtools"
  - "chrome devtools installation guide"
  - "chrome devtools orchestrator with intelligent routing between cli (bdg) and mcp (code mode) approaches."
  - "chrome devtools orchestrator - cli + mcp integration"
  - "chrome devtools orchestrator providing intelligent routing between cli (bdg) and mcp (code mode) approaches. cli prioritized for speed and token efficiency; mcp fallback for multi-tool integration scenarios."
  - "cli chrome devtools - example scripts"
  - "production-ready bash scripts for browser debugging, testing and automation using browser-debugger-cli (bdg)"
  - "chrome devtools orchestrator"
  - "cli-approach"
  - "cli approach"
  - "cli (bdg) approach for browser debugging: installation, discovery, session management, and commands"
  - "core architecture overview comparing cli, mcp, and framework approaches for chrome devtools"
  - "framework integration, related skills, tool usage guidelines, and external tool dependencies"
  - "mcp-approach"
  - "mcp approach"
  - "mcp (code mode) approach for chrome devtools: configuration, isolated instances, tool invocation, and session cleanup"
  - "cheat sheet of essential cli commands, mcp tool patterns, and error handling templates"
  - "routing-decision"
  - "routing decision"
  - "decision logic for selecting between cli (bdg) and mcp (code mode) approaches"
  - "mandatory always, never, and escalate rules for chrome devtools operations"
  - "smart routing logic for resource loading: intent scoring, loading levels, and routing pseudocode"
  - "completion checklist and quality targets for chrome devtools workflows"
  - "activation triggers, use cases, and exclusion criteria for the chrome devtools orchestrator skill"
  - "cdp_patterns"
  - "cdp patterns & command examples"
  - "chrome devtools protocol patterns, workflows, and unix composability examples for bdg."
  - "session_management"
  - "advanced session management"
  - "patterns for browser session lifecycle, concurrency, resumption, and state persistence with bdg."
  - "troubleshooting guide"
  - "error resolution guide for common bdg issues with diagnostic steps and solutions."
  - "sk-code--full-stack"
  - "full"
  - "stack"
  - "changelog"
  - "stack-agnostic development orchestrator guiding developers through implementation, debugging, and verification phases with automatic stack detection via marker files"
  - "code workflows - stack-agnostic development orchestrator"
  - "stack-agnostic development orchestrator guiding developers through implementation, testing, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge."
  - "code_quality_checklist"
  - "code quality checklist"
  - "universal validation checklist for code quality and style compliance across all stacks."
  - "debugging_checklist"
  - "systematic debugging checklist"
  - "universal step-by-step checklist for investigating technical issues across all stacks."
  - "verification_checklist"
  - "verification checklist"
  - "universal checklist for verifying work before claiming completion across all stacks."
  - "core development lifecycle: implementation, testing/debugging, and verification phases"
  - "knowledge base structure, naming conventions, tool usage, external resources, and related skills"
  - "always/never/escalate rules for implementation, testing/debugging, and verification phases"
  - "stack detection via marker files, intent classification, resource routing, and load-level selection"
  - "completion gates, quality checks, and quick reference for all three development phases"
  - "activation triggers, use cases, phase overview, and when not to use this skill"
  - "api_design"
  - "api design guidelines - http controllers and endpoint patterns"
  - "standards for designing http controllers and endpoints in backend systems, covering fiber/gofiber implementation patterns, request/response handling, authentication, and authorization."
  - "database_patterns"
  - "database patterns - gorm repository and transaction patterns"
  - "guidelines for working with databases in backend systems, covering the generic repository pattern, transaction management, entity definitions, and query patterns using gorm."
  - "database_patterns_gorm_type_mappings"
  - "gorm type mappings & database types"
  - "critical reference for go-to-postgresql type mappings in gorm entities, database migrations, and type safety for postgresql."
  - "deployment"
  - "deployment guide - ci/cd workflows and deployment patterns"
  - "ci/cd workflows, versioning strategy, and deployment patterns for backend systems using github actions, ecr/s3 artifacts, and gitops deployment."
  - "di_configuration"
  - "dependency injection configuration - di system patterns and debugging"
  - "di configuration structure, json nesting rules, token-to-key mapping, and debugging configuration errors in backend systems."
  - "domain_layers"
  - "domain layers architecture - generic service pattern and transaction management"
  - "understanding the layered architecture pattern used across all domains in backend systems, focusing on the generic service pattern, transaction management, and entity-to-model boundaries."
  - "go_standards"
  - "go code standards - backend system coding conventions"
  - "mandatory go coding conventions for backend projects defining project structure, naming conventions, layered architecture patterns, and code organization standards."
  - "infrastructure_events"
  - "infrastructure events - event system architecture"
  - "event system architecture, sqs producers/consumers, message packs, and event routing for asynchronous communication between microservices via aws sqs."
  - "microservice_bootstrap_architecture"
  - "microservice bootstrap architecture - di-driven bootstrap and registry system"
  - "modern microservice bootstrap pattern, registry hierarchy, configuration-di mapping, and old-to-new migration patterns for backend systems."
  - "models_vs_entities_and_adapters"
  - "models vs entities - adapter boundary architecture"
  - "defines the architectural boundary between database entities and business models, establishing where adapter patterns must be used to convert internal data structures to external api contracts."
  - "testing_strategy"
  - "testing strategy - go testing patterns for backend systems"
  - "go testing patterns, test types, mocking, and best practices for backend systems including unit tests, integration tests, table-driven tests, and e2e infrastructure."
  - "validator_registration"
  - "validator registration - enum and custom validation patterns"
  - "how to register validators for enum types and custom validation rules across microservices and lambdas in backend systems."
  - "async_patterns"
  - "async patterns - promise and async/await best practices"
  - "mandatory async/await patterns for node.js backend projects defining promise handling, error management, concurrent operations, streams, and event emitter patterns."
  - "express_patterns"
  - "express patterns - route organization and middleware design"
  - "mandatory express.js patterns for backend projects defining route organization, middleware design, request validation, response formatting, error handling, and authentication patterns."
  - "nodejs_standards"
  - "node.js code standards - backend system coding conventions"
  - "mandatory node.js/typescript coding conventions for backend projects defining project structure, configuration, logging, error handling, and code organization standards."
  - "testing strategy - jest configuration and test patterns"
  - "mandatory testing patterns for node.js backend projects defining jest configuration, unit testing, integration testing with supertest, mocking strategies, database testing, and ci/cd integration."
  - "api_patterns"
  - "api patterns"
  - "next.js route handlers, trpc integration, api design patterns, error responses, authentication patterns, and api middleware."
  - "component_architecture"
  - "component architecture"
  - "server components vs client components, composition patterns, props handling, compound components, render props, and component organization patterns for react 19 and next.js 14+."
  - "data_fetching"
  - "data fetching"
  - "react query / tanstack query patterns, swr patterns, next.js server actions, error handling, loading states, optimistic updates, and cache invalidation strategies."
  - "forms_validation"
  - "forms & validation"
  - "react hook form setup, zod schema validation, form state management, error display patterns, multi-step forms, and file upload handling."
  - "react_nextjs_standards"
  - "react/next.js standards"
  - "next.js 14+ app router conventions, typescript configuration, file naming patterns, directory organization, and environment configuration for production applications."
  - "state_management"
  - "state management"
  - "react context patterns, zustand setup, jotai atomic state, redux toolkit integration, server vs client state separation, and form state management patterns."
  - "react testing library patterns, jest configuration, playwright e2e tests, msw for api mocking, component testing patterns, and integration test strategies."
  - "expo-patterns"
  - "expo patterns"
  - "a practical guide to working with expo in a react native codebase, explaining what patterns exist, why they exist, and how to use them day-to-day."
  - "mobile_testing"
  - "mobile testing"
  - "testing recommendations, framework setup, and patterns for react native/expo projects."
  - "native-modules"
  - "native modules"
  - "a practical guide to the native integrations in a react native/expo app, explaining how to use each integration, common setup issues, and troubleshooting."
  - "navigation-patterns"
  - "navigation patterns"
  - "a practical guide to navigation in a react native/expo app, explaining how to add screens, navigate between them, and avoid common pitfalls."
  - "performance-optimization"
  - "performance optimization"
  - "a practical guide to keeping a react native/expo app fast and responsive, explaining when to optimize, how to profile issues, and what patterns actually matter."
  - "react-hooks-patterns"
  - "react hooks patterns"
  - "a practical guide to creating and using custom hooks in a react native/expo codebase, explaining when to use each pattern, common mistakes to avoid, and how to create your first hook."
  - "react-native-standards"
  - "react native standards"
  - "a practical guide to building components in a react native/expo codebase, explaining how to create components, why we use certain patterns, and what mistakes to avoid."
  - "async patterns"
  - "a comprehensive guide to swift concurrency including async/await, task and taskgroup, actor isolation, structured concurrency, asyncsequence, error handling, and combine integration for modern ios development."
  - "mvvm_architecture"
  - "mvvm architecture"
  - "a comprehensive guide to implementing mvvm architecture with swiftui, including @observable patterns, viewmodel design, dependency injection, protocol-oriented design, and combine integration for ios 17+ applications."
  - "persistence_patterns"
  - "persistence patterns"
  - "a comprehensive guide to data persistence in ios including swiftdata for ios 17+, core data patterns for legacy code, userdefaults, keychain access, file system operations, and cloudkit integration basics."
  - "swift_standards"
  - "swift standards"
  - "a comprehensive guide to swift 5.9+ project structure, xcode organization, swift package manager, naming conventions, code organization patterns, and api design guidelines for ios development."
  - "swiftui_patterns"
  - "swiftui patterns"
  - "a comprehensive guide to swiftui view composition, state management, navigation patterns, custom modifiers, and modern ios 17+ swiftui features for building production-ready ios applications."
  - "a comprehensive guide to testing swift and swiftui applications including xctest fundamentals, unit testing viewmodels, ui testing with xcuitest, mocking and stubbing patterns, test doubles, and snapshot testing."
  - "sk-code--opencode"
  - "opencode"
  - "multi-language code standards for opencode system code (javascript, typescript, python, shell, json/jsonc) with language detection routing, universal patterns and quality checklists"
  - "code standards - opencode system code"
  - "multi-language code standards for opencode system code (javascript, typescript, python, shell, json/jsonc) with language detection routing, universal patterns, and quality checklists."
  - "config_checklist"
  - "config file quality checklist"
  - "quality validation checklist for json and jsonc configuration files in the opencode development environment."
  - "javascript_checklist"
  - "javascript code quality checklist"
  - "quality validation checklist for javascript code in the opencode development environment."
  - "python_checklist"
  - "python code quality checklist"
  - "quality validation checklist for python code in the opencode development environment."
  - "shell_checklist"
  - "shell code quality checklist"
  - "quality validation checklist for bash scripts in the opencode development environment."
  - "typescript_checklist"
  - "typescript code quality checklist"
  - "quality validation checklist for typescript code in the opencode development environment."
  - "universal_checklist"
  - "universal code quality checklist"
  - "language-agnostic quality checks that apply to all code files in the opencode development environment."
  - "core workflow steps, key pattern categories, and evidence-based pattern sources for opencode code standards"
  - "framework integration, skill differentiation table, and related resources for opencode code standards"
  - "language-detection"
  - "language detection"
  - "quick language identification table mapping file extensions and keywords to resource loading paths"
  - "file header templates, naming matrix, error handling patterns, and comment patterns for all supported languages"
  - "always/never/escalate rules for opencode system code across all supported languages"
  - "language detection router with weighted intent scoring, resource domains, and loading levels"
  - "quality gates, priority levels, and completion checklist for opencode code standards"
  - "activation triggers, keyword matching, and scope boundaries for the opencode code standards skill"
  - "config quick reference"
  - "fast lookup for json/jsonc configuration patterns and common structures in opencode."
  - "style_guide"
  - "config style guide"
  - "formatting standards and conventions for json and jsonc configuration files in the opencode development environment."
  - "quality_standards"
  - "javascript quality standards"
  - "module organization, error handling, documentation, and security patterns for javascript files."
  - "javascript quick reference"
  - "copy-paste templates, naming cheat sheet, and common patterns for javascript development."
  - "javascript style guide"
  - "formatting standards and naming conventions for javascript files in the opencode development environment."
  - "python quality standards"
  - "code quality requirements, validation rules, and best practices for python scripts in the opencode development environment."
  - "python quick reference"
  - "fast lookup for python coding patterns, naming conventions, and common structures in opencode."
  - "python style guide"
  - "coding conventions and formatting standards for python scripts in the opencode development environment."
  - "alignment_verification_automation"
  - "alignment verification automation"
  - "code_organization"
  - "code organization - file structure and module principles"
  - "file structure principles, module organization concepts, and import ordering standards for opencode system code."
  - "universal_patterns"
  - "universal patterns - cross-language code standards"
  - "patterns applicable to all languages in opencode system code including naming principles, commenting philosophy, and reference comment patterns."
  - "shell quality standards"
  - "code quality requirements, validation rules, and best practices for bash scripts in the opencode development environment."
  - "shell quick reference"
  - "fast lookup for bash scripting patterns, syntax, and common structures in opencode."
  - "shell style guide"
  - "coding conventions and formatting standards for bash scripts in the opencode development environment."
  - "typescript quality standards"
  - "type system patterns, error handling, documentation, async patterns, and tsconfig baseline for typescript files in the opencode development environment."
  - "typescript quick reference"
  - "copy-paste templates, naming cheat sheet, and common patterns for typescript development in opencode."
  - "typescript style guide"
  - "formatting standards and naming conventions for typescript files in the opencode development environment."
  - "workflows-code--web-dev"
  - "web"
  - "dev"
  - "code workflows - web development orchestrator"
  - "orchestrator guiding developers through implementation, debugging, and verification phases for web development projects (webflow, vanilla js)"
  - "code workflows - development orchestrator"
  - "orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)"
  - "validation checklist for javascript and css code quality and style compliance."
  - "step-by-step checklist for investigating frontend technical issues"
  - "browser verification checklist"
  - "checklist for verifying work in browser before claiming completion"
  - "debugging-workflow"
  - "debugging workflow"
  - "phase 2 systematic debugging framework with root cause tracing and error recovery"
  - "development lifecycle overview, phase transitions, and phase 0 research methodology"
  - "implementation-workflow"
  - "implementation workflow"
  - "phase 1 implementation patterns and phase 1.5 code quality gate for frontend development"
  - "common commands, cdn version workflow, external documentation links, and related skills"
  - "always/never/escalate rules for all development phases: implementation, code quality, debugging, and verification"
  - "intent scoring, resource discovery, and smart loading logic for routing requests to the right resources"
  - "phase completion checklists, performance targets, and quality gates for all development phases"
  - "verification-workflow"
  - "verification workflow"
  - "phase 3 mandatory browser verification, testing matrix, and completion gate"
  - "debugging_workflows"
  - "debugging workflows - phase 2"
  - "systematic debugging with four-phase investigation, root cause tracing, and performance profiling."
  - "error_recovery"
  - "error recovery workflows"
  - "recovery procedures for common deployment and build failures"
  - "cdn_deployment"
  - "cdn deployment guide"
  - "complete workflow for deploying minified javascript to cloudflare r2 cdn."
  - "minification_guide"
  - "javascript minification guide"
  - "safe minification workflow for webflow projects with verification to prevent breaking functionality."
  - "animation_workflows"
  - "animation workflows - phase 1 implementation"
  - "css-first animation guide with motion.dev integration for complex sequences and scroll-triggered effects."
  - "browser scheduling apis and patterns for non-blocking code execution."
  - "css_patterns"
  - "css patterns - webflow implementation reference"
  - "comprehensive css patterns for webflow development including state machines, validation architecture, accessibility, and design token systems."
  - "focus_management"
  - "focus management - accessibility patterns"
  - "focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs."
  - "form_upload_workflows"
  - "form upload workflows"
  - "complete architecture reference for the filepond-to-r2 file upload pipeline, including cloudflare worker proxy, state management, and webflow integration."
  - "implementation_workflows"
  - "implementation workflows - phase 1"
  - "three specialized workflows for writing robust frontend code with proper timing, validation, and cache management."
  - "observer_patterns"
  - "observer patterns reference"
  - "browser observer apis for reactive dom watching, visibility detection, and scroll-triggered behaviors."
  - "performance_patterns"
  - "performance optimization patterns - phase 1 integration"
  - "performance optimization checklist covering animations, assets, requests, and core web vitals budgets."
  - "security_patterns"
  - "security patterns - owasp top 10 integration"
  - "security hardening patterns covering xss prevention, csrf protection, and input validation."
  - "swiper_patterns"
  - "swiper.js integration patterns"
  - "production-tested swiper.js configurations for carousels and marquees with intersectionobserver autoplay control, accessibility, and webflow integration."
  - "third_party_integrations"
  - "third-party library integrations"
  - "reference guide for integrating external javascript libraries in webflow projects, with production-tested patterns."
  - "webflow_patterns"
  - "webflow platform patterns - development guide"
  - "complete platform constraints and collection list patterns for webflow development."
  - "cwv_remediation"
  - "core web vitals remediation guide"
  - "actionable remediation patterns for lcp, fcp, tbt, and cls issues in webflow sites with custom javascript."
  - "resource_loading"
  - "resource loading patterns"
  - "resource hints and loading strategies for optimal performance in webflow sites."
  - "third_party"
  - "third-party performance optimization"
  - "deferral patterns for analytics, tag managers, and consent scripts to reduce main thread blocking."
  - "webflow_constraints"
  - "webflow performance constraints"
  - "platform-imposed limitations on performance optimization and available workarounds."
  - "multi_agent_patterns"
  - "multi-agent research patterns"
  - "10-agent specialization model for comprehensive codebase analysis and performance audits."
  - "code_quality_standards"
  - "code quality standards"
  - "quality patterns for initialization, error handling, validation, async operations, and performance"
  - "code_style_enforcement"
  - "code style enforcement"
  - "enforcement rules, validation prompts, and remediation instructions for code quality standards (javascript + css)"
  - "code_style_guide"
  - "code style guide"
  - "naming conventions, formatting, comments, and visual organization standards for frontend development"
  - "code workflows quick reference"
  - "quick-access cheat sheet with decision trees, code snippets, css patterns, and verification checklists."
  - "shared_patterns"
  - "shared patterns - cross-workflow standards"
  - "common patterns for devtools usage, logging, testing, error handling, and browser compatibility."
  - "performance_checklist"
  - "performance verification checklist"
  - "before/after verification protocol for performance optimization work using pagespeed insights."
  - "verification_workflows"
  - "verification workflows - phase 3 (mandatory)"
  - "browser verification requirements for all completion claims - no exceptions."
  - "sk-doc"
  - "documentation"
  - "workflows documentation"
  - "unified markdown and opencode component specialist providing document quality enforcement, content optimization, component creation workflows, ascii flowcharts and install guides"
  - "documentation creation specialist - unified markdown & component management"
  - "unified markdown and opencode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ascii flowcharts and install guides."
  - "frontmatter_templates"
  - "yaml frontmatter templates"
  - "templates and validation rules for yaml frontmatter across all document types in the opencode ecosystem."
  - "install_guide_template"
  - "install guide creation - templates and standards"
  - "templates for creating consistent, ai-friendly installation guides for mcp servers, plugins, cli tools, and development dependencies."
  - "llmstxt_templates"
  - "llms.txt templates"
  - "templates and patterns for creating effective llms.txt files that help ai assistants understand projects."
  - "readme_template"
  - "readme creation - templates and standards"
  - "templates for creating comprehensive, ai-optimized readme files with consistent structure and progressive disclosure."
  - "approval_workflow_loops"
  - "approval workflow with loops - multiple reviewers and revision cycles"
  - "decision_tree_flow"
  - "decision tree flow example - complex branching and conditional logic"
  - "parallel_execution"
  - "parallel execution example - simultaneous tasks with synchronization"
  - "simple_workflow"
  - "simple workflow example - linear sequential process"
  - "system_architecture_swimlane"
  - "system architecture flow (swimlane) - multi-tier system interaction"
  - "user_onboarding"
  - "user onboarding flow example - complete multi-step journey"
  - "agent_template"
  - "agent template - specialist agent structure"
  - "command_template"
  - "command template - opencode slash commands"
  - "templates and best practices for creating production-quality slash commands in opencode with proper frontmatter and structure."
  - "skill_asset_template"
  - "skill asset file templates"
  - "templates and guidelines for creating asset files in ai agent skills."
  - "skill_graph_index_template"
  - "skill graph index template"
  - "base template for writing the index.md entry point of a skill graph."
  - "skill_graph_node_template"
  - "skill graph node template"
  - "base template for writing one node in a skill graph."
  - "skill_md_template"
  - "skill.md file templates - creation guide"
  - "templates and guidelines for creating effective skill.md files for ai agent skills with complete scaffolds and section guidance."
  - "skill_reference_template"
  - "skill reference file templates"
  - "comprehensive templates for creating effective reference files for ai agent skills with workflows, decision logic, and validation checkpoints."
  - "documentation creation specialist"
  - "mode-component-creation"
  - "component creation mode"
  - "workflows for creating skills, agents, and commands in opencode."
  - "mode-document-quality"
  - "document quality mode"
  - "how the document quality index (dqi) pipeline uses extract_structure.py to evaluate readmes, specs, and knowledge docs."
  - "mode-flowchart-creation"
  - "flowchart creation mode"
  - "patterns and syntax for generating ascii flowcharts for workflows and decision trees."
  - "workflows documentation rules"
  - "mandatory rules (always, never, escalate) separated by modes (quality, skills, flowcharts, etc.)."
  - "intent scoring and resource loading logic for the documentation workflows."
  - "definition of document quality index (dqi), and checklists for completing documentation tasks."
  - "when to use workflows documentation"
  - "triggers for document validation, readme creation, component scaffolding, and flowchart generation."
  - "core_standards"
  - "core standards - structure and validation rules"
  - "filename conventions, document type detection, and structural validation rules for markdown documentation."
  - "hvr_rules"
  - "human voice rules (hvr) - writing standards reference"
  - "linguistic standards that eliminate detectable ai patterns and enforce natural human writing across all documentation."
  - "install_guide_standards"
  - "install guide standards - phase-based installation documentation"
  - "standards for clear, reliable install guides with phase-based validation checkpoints."
  - "optimization"
  - "optimization - transformation patterns for ai-friendly docs"
  - "16 proven patterns for converting documentation into ai-friendly question-answering format."
  - "markdown optimizer - quick reference"
  - "one-page cheat sheet for commands, quality gates, and transformation patterns."
  - "skill_creation"
  - "skill creation workflow"
  - "complete guide for creating, validating, and distributing ai agent skills with bundled resources."
  - "validation - quality assessment and gates"
  - "quality gates, dqi scoring, and improvement recommendations for markdown documentation."
  - "document quality workflows - mode 1 reference"
  - "execution modes, validation patterns, and phase interactions for mode 1 document quality workflows."
  - "sk-git"
  - "git"
  - "git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
  - "git workflows - git development orchestrator"
  - "commit_message_template"
  - "commit message template"
  - "templates and examples for writing professional commit messages following conventional commits specification."
  - "pr_template"
  - "pull request template"
  - "templates and examples for creating professional pull requests with clear summaries and test plans."
  - "worktree_checklist"
  - "worktree creation checklist"
  - "step-by-step checklist for creating git worktrees safely and reliably."
  - "git workflows - skill graph"
  - "commit-workflow"
  - "commit workflow"
  - "commit creation process: staging, artifact filtering, and conventional commits formatting"
  - "github-integration"
  - "github integration"
  - "github mcp integration for remote operations: prs, issues, ci/cd, and repository management"
  - "core git development lifecycle: workspace setup, commit, and integration phases"
  - "always/never/escalate rules governing git workflow behavior"
  - "intent routing logic with weighted scoring, resource loading levels, and disambiguation"
  - "completion gates and quality checks for workspace setup, commits, and integration"
  - "activation triggers, use cases, and when not to use the sk-git skill"
  - "work-completion"
  - "work completion"
  - "pr creation, branch cleanup, merge strategies, and finish workflow"
  - "workspace-setup"
  - "workspace setup"
  - "git worktree setup, workspace choice enforcement, and branch management"
  - "commit_workflows"
  - "git commit - detailed workflow reference"
  - "complete workflow documentation for professional commit practices with conventional commits."
  - "finish_workflows"
  - "git finish - detailed workflow reference"
  - "complete workflow documentation for completing development work with structured integration options."
  - "git workflows - quick reference"
  - "one-page cheat sheet for git-worktrees, git-commit, and git-finish workflows."
  - "shared patterns - cross-workflow reference"
  - "common patterns, commands, and conventions used across all git workflows."
  - "worktree_workflows"
  - "git worktrees - detailed workflow reference"
  - "complete workflow documentation for creating isolated git workspaces with minimal branching."
  - "skill.md"
  - "env_template.md"
  - "config_template.md"
  - "full architecture details"
  - "operational workflows"
  - "configuration.md"
  - "naming_convention.md"
  - "tool_catalog.md"
  - "workflows.md"
  - "architecture.md"
  - "references/tool_reference.md"
  - "references/quick_start.md"
  - "assets/tool_categories.md"
  - "install guide"
  - "tool_reference.md"
  - "quick_start.md"
  - "references/memory/readme_indexing.md"
  - "mcp_server/readme.md"
  - "rollback runbook"
  - "references/memory/memory_system.md"
  - "references/validation/validation_rules.md"
  - "references/validation/five-checks.md"
  - "../sk-code--opencode/skill.md"
  - "../sk-doc/skill.md"
  - "level_specifications.md"
  - "template_guide.md"
  - "save_workflow.md"
  - "quick_reference.md"
  - "sub_folder_versioning.md"
  - "memory_system.md"
  - "epistemic-vectors.md"
  - "validation_rules.md"
  - "level_decision_matrix.md"
  - "template_mapping.md"
  - "parallel_dispatch_config.md"
  - "complexity_decision_matrix.md"
  - "progressive enhancement"
  - "folder naming & versioning"
  - "readme_indexing.md"
  - "embedding_resilience.md"
  - "level_selection_guide.md"
  - "embeddings/readme.md"
  - "install_guide.md"
  - "session_management.md"
  - "troubleshooting.md"
  - "cdp_patterns.md"
  - "debugging_checklist.md"
  - "verification_checklist.md"
  - "code_quality_checklist.md"
  - "go_standards.md"
  - "domain_layers.md"
  - "models_vs_entities_and_adapters.md"
  - "database_patterns_gorm_type_mappings.md"
  - "database_patterns.md"
  - "microservice_bootstrap_architecture.md"
  - "di_configuration.md"
  - "api_design.md"
  - "testing_strategy.md"
  - "nodejs_standards.md"
  - "express_patterns.md"
  - "async_patterns.md"
  - "react-native-standards.md"
  - "react-hooks-patterns.md"
  - "navigation-patterns.md"
  - "performance-optimization.md"
  - "swift_standards.md"
  - "swiftui_patterns.md"
  - "mvvm_architecture.md"
  - "persistence_patterns.md"
  - "universal_checklist.md"
  - "javascript_checklist.md"
  - "typescript_checklist.md"
  - "python_checklist.md"
  - "shell_checklist.md"
  - "config_checklist.md"
  - "style_guide.md"
  - "quality_standards.md"
  - "observer_patterns.md"
  - "implementation_workflows.md"
  - "code_style_enforcement.md"
  - "debugging_workflows.md"
  - "verification_workflows.md"
  - "error_recovery.md"
  - "minification_guide.md"
  - "cdn_deployment.md"
  - "performance_patterns.md"
  - "animation_workflows.md"
  - "webflow_patterns.md"
  - "security_patterns.md"
  - "form_upload_workflows.md"
  - "resource_loading.md"
  - "third_party.md"
  - "webflow_constraints.md"
  - "cwv_remediation.md"
  - "code_style_guide.md"
  - "code_quality_standards.md"
  - "shared_patterns.md"
  - "skill_creation.md"
  - "skill_graph_index_template.md"
  - "skill_graph_node_template.md"
  - "agent_template.md"
  - "command_template.md"
  - "install_guide_standards.md"
  - "hvr_rules.md"
  - "frontmatter_templates.md"
  - "install_guide_template.md"
  - "skill_md_template.md"
  - "skill_reference_template.md"
  - "skill_asset_template.md"
  - "mode 1: document quality"
  - "mode 2: component creation"
  - "mode 3: flowchart creation"
  - "optimization.md"
  - "validation.md"
  - "core_standards.md"
  - "worktree_workflows.md"
  - "commit_workflows.md"
  - "finish_workflows.md"
  - "commit_message_template.md"
  - "pr_template.md"

key_files:
  - ".opencode/.../001-system-speckit-hybrid-rag-fusion/implementation-summary.md"
  - ".opencode/.../002-skill-graph-integration/implementation-summary.md"
  - ".opencode/.../002-unified-graph-intelligence/implementation-summary.md"

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

