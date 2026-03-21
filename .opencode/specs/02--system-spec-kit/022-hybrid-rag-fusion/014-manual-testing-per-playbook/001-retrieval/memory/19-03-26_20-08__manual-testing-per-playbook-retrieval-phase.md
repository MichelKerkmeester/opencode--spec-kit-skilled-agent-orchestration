---
title: "Manual Testing Per Playbook Retrieval Phase"
description: "Yes, two issues need fixing to get validation to exit 0 or 1: 1. SPEC DOC INTEGRITY (exit 2) : 4 broken links to non-existent review protocol.md in spec.md and plan.md 2...."
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/014 manual testing per playbook/001 retrieval"
  - "the broken"
  - "review protocol"
  - "spec_doc_integrity"
  - "evidence_cited"
  - "non existent"
  - "yes two issues fixing"
  - "two issues fixing get"
  - "issues fixing get validation"
  - "fixing get validation exit"
  - "spec doc integrity exit"
  - "doc integrity exit broken"
  - "integrity exit broken links"
  - "exit broken links non-existent"
  - "broken links non-existent spec.md"
  - "links non-existent spec.md plan.md"
  - "evidence cited validator expects"
  - "cited validator expects format"
  - "validator expects format let"
  - "expects format let fix"
  - "first broken links see"
  - "broken links see exact"
  - "links see exact format"
  - "see exact format system"
  - "exact format system spec"
  - "format system spec kit/022"
  - "kit/022"
  - "fusion/014"
  - "manual"
  - "testing"
  - "per"
  - "playbook/001"
  - "retrieval"
importance_tier: "normal"
contextType: "general"
_sourceTranscriptPath: "/Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/96f5b44f-3168-41c6-9c75-4dae971b5579.jsonl"
_sourceSessionId: "96f5b44f-3168-41c6-9c75-4dae971b5579"
_sourceSessionCreated: 1773946631281
_sourceSessionUpdated: 1773947307903
captured_file_count: 0
filesystem_file_count: 10
git_changed_file_count: 9
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":true,"score":0.85,"errors":0,"warnings":3}
---

# Manual Testing Per Playbook Retrieval Phase

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-19 |
| Session ID | session-1773947316901-a9a3bdde43e3 |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval |
| Channel | main |
| Git Ref | main (`6f490d691803`) |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 28 |
| Tool Executions | 59 |
| Decisions Made | 0 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-19 |
| Created At (Epoch) | 1773947316 |
| Last Accessed (Epoch) | 1773947316 |
| Access Count | 1 |

---

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
| Completion % | 100% |
| Last Activity | 2026-03-19T19:08:26.081Z |
| Time in Session | 9m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** **EX-022 PASS** — Bidirectional trace from memory 25370 returned edge 3687 (supp, **EX-021 PASS** — Before-trace showed edge 3687 (supports, strength 0.8). After, Also update the spec.md status from Draft to Complete:

**Summary:** Yes, two issues need fixing to get validation to exit 0 or 1:

1. **SPEC_DOC_INTEGRITY (exit 2)**: 4 broken links to non-existent `review_protocol.md` in spec.md and plan.md
2. **EVIDENCE_CITED (warni...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval
Last: Also update the spec.md status from Draft to Complete:
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: plan.md, .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/checklist.md, .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/implementation-summary.md

- Check: plan.md, tasks.md, checklist.md

- Last: Also update the spec.md status from Draft to Complete:

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | plan.md |
| Last Action | Also update the spec.md status from Draft to Complete: |
| Next Action | Continue implementation |
| Blockers | None |

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

**Key Topics:** `playbook/001 retrieval` | `fusion/014 manual` | `per playbook/001` | `kit/022 hybrid` | `rag fusion/014` | `manual testing` | `spec kit/022` | `system spec` | `testing per` | `hybrid rag` | `retrieval system` | `broken links` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- ****EX-022 PASS** — Bidirectional trace from memory 25370 returned edge 3687 (supp** - EX-022 PASS — Bidirectional trace from memory 25370 returned edge 3687 (supports → 25369) at depth 1.

- ****EX-021 PASS** — Before-trace showed edge 3687 (supports, strength 0.8). After** - EX-021 PASS — Before-trace showed edge 3687 (supports, strength 0.

- **Also update the spec.md status from Draft to Complete:** - Also update the spec.

**Key Files and Their Roles**:

- `plan.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/checklist.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/implementation-summary.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/spec.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/tasks.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/plan.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/spec.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/tasks.md` - Documentation

**How to Extend**:

- Create corresponding test files for new implementations

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Yes, two issues need fixing to get validation to exit 0 or 1:

1. **SPEC_DOC_INTEGRITY (exit 2)**: 4 broken links to non-existent `review_protocol.md` in spec.md and plan.md
2. **EVIDENCE_CITED (warning)**: Validator expects `[EVIDENCE: ...]` or `(verified)` format, not `— *text*`

Let me fix both. First, the broken links — I need to see the exact format:

**Key Outcomes**:
- **EX-022 PASS** — Bidirectional trace from memory 25370 returned edge 3687 (supp
- **EX-021 PASS** — Before-trace showed edge 3687 (supports, strength 0.8). After
- Also update the spec.md status from Draft to Complete:

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `(merged-small-files)` | Tree-thinning merged 1 small files (plan.md).  Merged from plan.md : | title: "Implementation Plan: manual-testing-per-playbook retrieval phase [template:level_1/plan.md]" description: "Phase 001 defines the execution plan for nine retrieval manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for retrieval-focused scenarios." trigger_phrases: - "retrieval execution plan" - "phase 001 manual tests" - "memory retrieval verdict plan" - "hybrid rag retrieval review" im |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/(merged-small-files)` | Tree-thinning merged 4 small files (checklist.md, implementation-summary.md, spec.md, tasks.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/checklist.md : Updated checklist | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/implementation-summary.md : Updated implementation summary | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/spec.md : Updated spec | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/tasks.md : Updated tasks |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/(merged-small-files)` | Tree-thinning merged 3 small files (plan.md, spec.md, tasks.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/plan.md : Updated plan | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/spec.md : Updated spec | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/tasks.md : Updated tasks |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/scratch/(merged-small-files)` | Tree-thinning merged 2 small files (EX-001-evidence.md, EX-002-evidence.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/scratch/EX-001-evidence.md : Updated ex 001 evidence | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/scratch/EX-002-evidence.md : Updated ex 002 evidence |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-ex022-pass-bidirectional-trace-82ef5627 -->
### FEATURE: **EX-022 PASS** — Bidirectional trace from memory 25370 returned edge 3687 (supp

**EX-022 PASS** — Bidirectional trace from memory 25370 returned edge 3687 (supports → 25369) at depth 1. Direction "both", maxDepth 4 confirmed. **EX-023 PASS** — Preflight record 2783 persisted with baseline: knowledge=40, uncertainty=60, context=50, 3 knowledge gaps, specFolder/taskId match. Now EX-024 (postflight, must use same specFolder/taskId as EX-023):

<!-- /ANCHOR:implementation-ex022-pass-bidirectional-trace-82ef5627 -->

<!-- ANCHOR:implementation-ex021-pass-beforetrace-showed-b8fd0ed8 -->
### FEATURE: **EX-021 PASS** — Before-trace showed edge 3687 (supports, strength 0.8). After

**EX-021 PASS** — Before-trace showed edge 3687 (supports, strength 0.8). After `memory_causal_unlink({ edgeId: 3687 })`, after-trace returns "No causal relationships found" — edge confirmed absent. Checkpoint: `pre-ex021-analysis` (ID: 2). --- All 7 scenarios executed with PASS verdicts. Now updating the spec folder documents. ### Evidence Summary | Test ID | Scenario | Verdict | Key Evidence | |---------|----------|---------|-------------| | EX-019 | Causal edge creation | **PASS** | Edge 3687 created (25370→25369, supports, 0.8); visible in drift_why trace | | EX-020 | Causal graph statistics | **PASS** | 3653 edges, 5.74% coverage, 338 sources, 346 targets, health: has_orphans | | EX-021 | Causal edge deletion [DESTRUCTIVE] | **PASS** | Before: edge 3687 present; after unlink: 0 relationships; checkpoint: pre-ex021-analysis | | EX-022 | Causal chain tracing | **PASS** | Bidirectional trace from 25370, depth 4, returned edge 3687 at depth 1 | | EX-023 | Epistemic baseline capture | **PASS** | Record 2783: knowledge=40, uncertainty=60, context=50, 3 gaps | | EX-024 | Post-task learning measurement | **PASS** | LI=33.75, deltas: K+35, U-35, C+30, 2 gaps closed, 1 new | | EX-025 | Learning history | **PASS** | 1 complete cycle, onlyComplete:true, avg LI=33.75 | Now updating tasks.md, checklist.md, and implementation-summary.md:

<!-- /ANCHOR:implementation-ex021-pass-beforetrace-showed-b8fd0ed8 -->

<!-- ANCHOR:implementation-also-specmd-status-draft-8ef2e8a6 -->
### FEATURE: Also update the spec.md status from Draft to Complete:

Also update the spec.md status from Draft to Complete:

<!-- /ANCHOR:implementation-also-specmd-status-draft-8ef2e8a6 -->

<!-- ANCHOR:session-continuation-merged-from-20-17 -->
### Session Continuation (merged from 19-03-26_20-17)

Continuation session upgraded the spec folder from Level 1 to Level 2 and completed full checklist verification.

**Key facts:**
- **Level upgrade:** All 5 doc files updated from `SPECKIT_LEVEL: 1` to Level 2 in HTML comments.
- **Checklist verification:** 20/20 items verified (11 P0 + 7 P1 + 2 P2) — all items confirmed PASS.
- **Memory quality:** Saved as memory #4414 with quality score 88/100.
- **Pipeline:** GPT 5.4 Agent 1 → scratch/pre-flight.md → MCP calls → GPT 5.4 Agent 2 → scratch/post-flight.md → applied 18 exact text replacements to 4 spec files.
- **Files created:** scratch/pre-flight.md, scratch/evidence-raw.md, scratch/post-flight.md.
<!-- /ANCHOR:session-continuation-merged-from-20-17 -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

decision_count: 0

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Iterative Loop** conversation pattern with **20** phase segments across **2** unique phases.

##### Conversation Phases
- **Verification** - 21 actions
- **Debugging** - 1 actions
- **Research** - 16 actions
- **Discussion** - 4 actions
- **Implementation** - 23 actions

---

### Message Timeline

> **Assistant** | 2026-03-19 @ 19:57:11

 → Tracked file history snapshot Tracked file history snapshot Tracked file history snapshot Tracked file history snapshot read read read read read read toolsearch toolsearch toolsearch mcp__spec_kit_memory__memory_causal_stats mcp__spec_kit_memory__memory_list mcp__spec_kit_memory__memory_causal_link mcp__spec_kit_memory__memory_drift_why mcp__spec_kit_memory__memory_drift_why mcp__spec_kit_memory__task_preflight **EX-022 PASS** — Bidirectional trace from memory 25370 returned edge 3687 (supports → 25369) at depth 1.  Direction "both", maxDepth 4 confirmed. Used tools: edit, edit, edit and 45 more.

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: read**
Tool: read

**Tool: read**
Tool: read

**Tool: read**
Tool: read

**Tool: read**
Tool: read

**Tool: read**
Tool: read

**Tool: read**
Tool: read

---

> **User** | 2026-03-19 @ 19:58:29

---

> **User** | 2026-03-19 @ 19:58:48

---

> **User** | 2026-03-19 @ 19:58:58

---

> **User** | 2026-03-19 @ 19:59:07

---

> **User** | 2026-03-19 @ 19:59:20

---

> **User** | 2026-03-19 @ 19:59:30

---

> **User** | 2026-03-19 @ 19:59:47

---

> **User** | 2026-03-19 @ 20:00:00

---

> **User** | 2026-03-19 @ 20:00:29

---

> **User** | 2026-03-19 @ 20:00:34

---

> **User** | 2026-03-19 @ 20:00:38

---

> **User** | 2026-03-19 @ 20:02:04

---

> **User** | 2026-03-19 @ 20:02:47

---

> **User** | 2026-03-19 @ 20:02:58

---

> **User** | 2026-03-19 @ 20:03:25

---

> **Assistant** | 2026-03-19 @ 20:03:32

 → glob glob List contents of 014-manual-testing-per-playbook Check for manual_testing_playbook and feature_catalog directories List manual_testing_playbook directory contents Used tools: glob, glob, bash and 2 more.

**Tool: glob**
Tool: glob

**Tool: glob**
Tool: glob

**Tool: bash**
Tool: bash

**Tool: bash**
Tool: bash

**Tool: bash**
Tool: bash

---

> **User** | 2026-03-19 @ 20:03:58

---

> **Assistant** | 2026-03-19 @ 20:03:58

 → The `review_protocol. md` link is a **pre-existing issue** — the file was never created in `manual_testing_playbook/`.

---

> **Assistant** | 2026-03-19 @ 20:03:59

 → read read Used tools: read, read.

**Tool: read**
Tool: read

**Tool: read**
Tool: read

---

> **User** | 2026-03-19 @ 20:04:13

---

> **Assistant** | 2026-03-19 @ 20:04:13

 → All files are consistent.  Here's the final status: --- ## Execution Complete — Phase 006 Analysis ### Results: 7/7 PASS | Test ID | Scenario | Verdict | |---------|----------|---------| | EX-019 | Causal edge creation | **PASS** | | EX-020 | Causal graph statistics | **PASS** | | EX-021 | Causal edge deletion [DESTRUCTIVE] | **PASS** | | EX-022 | Causal chain tracing | **PASS** | | EX-023 | Epistemic baseline capture | **PASS** | | EX-024 | Post-task learning measurement | **PASS** | | EX-025 | Learning history | **PASS** | ### Files Updated - **tasks.

---

> **User** | 2026-03-19 @ 20:04:57

no bug fixes or refinements needed?

---

> **Assistant** | 2026-03-19 @ 20:05:48

 → read Find evidence and integrity rules Used tools: read, agent.

**Tool: read**
Tool: read

**Tool: agent**
Tool: agent

---

> **User** | 2026-03-19 @ 20:08:14

---

> **Assistant** | 2026-03-19 @ 20:08:14

 → Yes, two issues need fixing to get validation to exit 0 or 1: 1.  **SPEC_DOC_INTEGRITY (exit 2)**: 4 broken links to non-existent `review_protocol. Used tools: grep.

**Tool: grep**
Tool: grep

---

> **User** | 2026-03-19 @ 20:08:26

---

> **Assistant** | 2026-03-19 @ 20:08:27

 → edit Used tools: edit.

**Tool: edit**
Tool: edit

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval --force
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

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1773947316901-a9a3bdde43e3"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval"
channel: "main"

# Git Provenance (M-007d)
head_ref: "main"
commit_ref: "6f490d691803"
repository_state: "dirty"
is_detached_head: No

# Classification
importance_tier: "normal"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "episodic"         # episodic|procedural|semantic|constitutional
  half_life_days: 30     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9772           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "072454ac1cb6f38c5bf02ad81cebf1b03a39ca4f"         # content hash for dedup detection
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
created_at: "2026-03-19"
created_at_epoch: 1773947316
last_accessed_epoch: 1773947316
expires_at_epoch: 1781723316  # 0 for critical (never expires)

# Session Metrics
message_count: 28
decision_count: 0
tool_count: 59
file_count: 10
captured_file_count: 0
filesystem_file_count: 10
git_changed_file_count: 9
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "playbook/001 retrieval"
  - "fusion/014 manual"
  - "per playbook/001"
  - "kit/022 hybrid"
  - "rag fusion/014"
  - "manual testing"
  - "spec kit/022"
  - "system spec"
  - "testing per"
  - "hybrid rag"
  - "retrieval system"
  - "broken links"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/014 manual testing per playbook/001 retrieval"
  - "the broken"
  - "review protocol"
  - "spec_doc_integrity"
  - "evidence_cited"
  - "non existent"
  - "yes two issues fixing"
  - "two issues fixing get"
  - "issues fixing get validation"
  - "fixing get validation exit"
  - "spec doc integrity exit"
  - "doc integrity exit broken"
  - "integrity exit broken links"
  - "exit broken links non-existent"
  - "broken links non-existent spec.md"
  - "links non-existent spec.md plan.md"
  - "evidence cited validator expects"
  - "cited validator expects format"
  - "validator expects format let"
  - "expects format let fix"
  - "first broken links see"
  - "broken links see exact"
  - "links see exact format"
  - "see exact format system"
  - "exact format system spec"
  - "format system spec kit/022"
  - "kit/022"
  - "fusion/014"
  - "manual"
  - "testing"
  - "per"
  - "playbook/001"
  - "retrieval"

key_files:
  - "plan.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/checklist.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/implementation-summary.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/spec.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/tasks.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/plan.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/spec.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/tasks.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/scratch/EX-001-evidence.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/scratch/EX-002-evidence.md"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval"
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

