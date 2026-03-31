---
title: "...nds-and-skills/034-sk-deep-research-review-folders/27-03-26_10-52__planned-a-dedicated-review-subfolder-contract-for]"
trigger_phrases:
  - "sk-deep-research review folder"
  - "deep-review scratch output"
  - "spec_kit deep research review mode"
  - "review-report placement"
  - "review_mode_contract review subfolder"
importance_tier: "important"
contextType: "decision"
_sourceSessionCreated: 0
_sourceSessionId: ""
_sourceSessionUpdated: 0
_sourceTranscriptPath: ""
captured_file_count: 10
filesystem_file_count: 10
git_changed_file_count: 0
quality_flags: []
quality_score: 1.00
spec_folder_health: {"pass":true,"score":0.85,"errors":0,"warnings":3}
---
# Planned A Dedicated Review Subfolder Contract For

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-27 |
| Session ID | session-1774605150814-8e09cc03be23 |
| Spec Folder | 03--commands-and-skills/034-sk-deep-research-review-folders |
| Channel | main |
| Importance Tier | important |
| Context Type | planning |
| Total Messages | 4 |
| Tool Executions | 0 |
| Decisions Made | 3 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-27 |
| Created At (Epoch) | 1774605150 |
| Last Accessed (Epoch) | 1774605150 |
| Access Count | 1 |

---

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
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
| Completion % | 95% |
| Last Activity | 2026-03-27T09:32:00.000Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** PLANNING

**Recent:** System-spec-kit defines scratch as disposable temporary space, not the durable home for review packets, Plan review-mode outputs under a dedicated review subtree, Next Steps

**Decisions:** 3 decisions recorded

### Pending Work

- [ ] **T000**: Implement the planned contract updates in review command YAMLs, runtime deep-review agent definitions, skill assets, and reference documentation. (Priority: P0)

- [ ] **T001**: Implement the planned contract updates in review command YAMLs, runtime deep-review agent definition (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 03--commands-and-skills/034-sk-deep-research-review-folders
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 03--commands-and-skills/034-sk-deep-research-review-folders
Last: Next Steps
Next: Implement the planned contract updates in review command YAMLs, runtime deep-review agent definitions, skill assets, and reference documentation.
```

**Key Context to Review:**

- Files modified: specs/03--commands-and-skills/034-sk-deep-research-review-folders/spec.md, specs/03--commands-and-skills/034-sk-deep-research-review-folders/plan.md, specs/03--commands-and-skills/034-sk-deep-research-review-folders/tasks.md

- Check: plan.md, tasks.md, checklist.md

- Last: Next Steps

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | PLANNING |
| Active File | specs/03--commands-and-skills/034-sk-deep-research-review-folders/decision-record.md |
| Last Action | Next Steps |
| Next Action | Implement the planned contract updates in review command YAMLs, runtime deep-review agent definitions, skill assets, and reference documentation. |
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

**Key Topics:** `durable home` | `implement backward-compatible` | `backward-compatible migration` | `existing scratch-based` | `review-mode artifacts` | `review-mode filenames` | `existing review-mode` | `scratch-based review` | `filenames primarily` | `document implement` | `migration existing` | `artifacts instead` |

**Tool Calls:** `exec_command` (1) | `exec_command` (1)

**Exchanges:** 1 exchanges — `Analyze sk-deep-research review mode deeply and produce an auto-mode /spec_kit:plan packet that moves review outputs out of scratch into a dedicated review folder.`

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 1. OVERVIEW

Review mode is contractually routed into scratch across command and skill assets; System-spec-kit defines scratch as disposable temporary space, not the durable home for review packets; Plan review-mode outputs under a dedicated review subtree

**Key Outcomes**:
- Review mode is contractually routed into scratch across command and skill assets
- System-spec-kit defines scratch as disposable temporary space, not the durable home for review packets
- Plan review-mode outputs under a dedicated review subtree
- Next Steps

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `specs/03--commands-and-skills/034-sk-deep-research-review-folders/decision-record.md` | Strategy state |
| `specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md` | Validation checklist aligned to Level 3 spec-kit... | Tree-thinning merged 3 small files (spec.md, plan.md, tasks.md).  Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/spec.md : Strategy state | Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/plan.md : Strategy state | Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/tasks.md : Task breakdown covering command asset updates,... |
| `.opencode/command/spec_kit/assets/(merged-small-files)` | Tree-thinning merged 2 small files (spec_kit_deep-research_review_auto.yaml, spec_kit_deep-research_review_confirm.yaml).  Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml : Updated spec kit deep research review auto | Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml : Updated spec kit deep research review confirm |
| `.opencode/skill/sk-deep-research/assets/(merged-small-files)` | Tree-thinning merged 1 small files (review_mode_contract.yaml).  Merged from .opencode/skill/sk-deep-research/assets/review_mode_contract.yaml : Updated review mode contract |
| `.opencode/agent/(merged-small-files)` | Tree-thinning merged 1 small files (deep-review.md).  Merged from .opencode/agent/deep-review.md : Updated deep review |
| `.opencode/skill/system-spec-kit/references/templates/(merged-small-files)` | Tree-thinning merged 1 small files (template_guide.md).  Merged from .opencode/skill/system-spec-kit/references/templates/template_guide.md : Temporary or disposable work products |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 2. DETAILED CHANGES

<!-- ANCHOR:implementation-review-mode-contractually-routed-39f1dc02 -->
### DISCOVERY: Review mode is contractually routed into scratch across command and skill assets

The deep-review workflow is not merely using scratch incidentally. The review auto and confirm command assets, the shared review_mode_contract asset, the deep_review_strategy seed file, and the deep-review runtime agent all point review state and iteration artifacts into scratch. That means a durable fix must change the cross-file contract rather than patching one output path in isolation.

**Files:** .opencode/agent/deep-review.md, .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml, .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml, .opencode/skill/sk-deep-research/assets/review_mode_contract.yaml
**Details:** spec_kit_deep-research_review_auto.yaml routes config, state, strategy, dashboard, and iteration files into {spec_folder}/scratch/. | spec_kit_deep-research_review_confirm.yaml mirrors the same scratch-based paths. | review_mode_contract.yaml still defines scratch as the review state root. | deep-review agent guidance explicitly names scratch as the allowed artifact location.
<!-- /ANCHOR:implementation-review-mode-contractually-routed-39f1dc02 -->

<!-- ANCHOR:implementation-systemspeckit-defines-scratch-disposable-6a4078a8 -->
### DISCOVERY: System-spec-kit defines scratch as disposable temporary space, not the durable home for review packets

The folder semantics in system-spec-kit make the current review behavior a documentation mismatch as well as an implementation mismatch. Scratch is reserved for temporary or disposable work products, while review-mode outputs are durable audit artifacts that should be resumable and inspectable like research runs. That makes a dedicated review subtree the correct structural fix.

**Files:** .opencode/skill/system-spec-kit/references/structure/folder_structure.md, .opencode/skill/system-spec-kit/references/templates/template_guide.md, .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode
**Details:** template_guide.md describes scratch as temporary or disposable work output. | folder_structure.md keeps scratch separate from durable spec artifacts. | Existing specs already use dedicated research subfolders, which establishes a precedent for mode-specific durable output trees.
<!-- /ANCHOR:implementation-systemspeckit-defines-scratch-disposable-6a4078a8 -->

<!-- ANCHOR:implementation-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Implement the planned contract updates in review command YAMLs, runtime deep-review agent definitions, skill assets, and reference documentation. Add or update regression playbooks so review mode validates the new review subtree and legacy scratch migration behavior. Re-run strict spec validation and the relevant skill or command verification after the implementation pass.

**Details:** Next: Implement the planned contract updates in review command YAMLs, runtime deep-review agent definitions, skill assets, and reference documentation. | Follow-up: Add or update regression playbooks so review mode validates the new review subtree and legacy scratch migration behavior. | Follow-up: Re-run strict spec validation and the relevant skill or command verification after the implementation pass.
<!-- /ANCHOR:implementation-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 3. DECISIONS

<!-- ANCHOR:decision-specfolderreview-durable-home-reviewmode-95429a83 -->
### Decision 1: Use {spec_folder}/review/ as the durable home for review-mode artifacts instead of scratch.

**Context**: Use {spec_folder}/review/ as the durable home for review-mode artifacts instead of scratch. — This keeps durable review artifacts out of scratch, aligns review mode with existing research-folder patterns, and creat

**Timestamp**: 2026-03-27T09:52:30.858Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Use {spec_folder}/review/ as the durable home for review-mode artifacts instead of scratch.

#### Chosen Approach

**Selected**: Use {spec_folder}/review/ as the durable home for review-mode artifacts instead of scratch.

**Rationale**: This keeps durable review artifacts out of scratch, aligns review mode with existing research-folder patterns, and creates a clearer resume/debug surface for review runs.

#### Trade-offs

**Supporting Evidence**:
- This keeps durable review artifacts out of scratch, aligns review mode with existing research-folder patterns, and creates a clearer resume/debug surface for review runs.

**Confidence**: 77%

<!-- /ANCHOR:decision-specfolderreview-durable-home-reviewmode-95429a83 -->

---

<!-- ANCHOR:decision-retain-existing-reviewmode-filenames-bae8fde1 -->
### Decision 2: Retain existing review-mode filenames and primarily change their parent directory.

**Context**: Retain existing review-mode filenames and primarily change their parent directory. — Minimizing filename churn lowers migration risk and keeps downstream references easier to audit during rollout.

**Timestamp**: 2026-03-27T09:52:30.858Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Retain existing review-mode filenames and primarily change their parent directory.

#### Chosen Approach

**Selected**: Retain existing review-mode filenames and primarily change their parent directory.

**Rationale**: Minimizing filename churn lowers migration risk and keeps downstream references easier to audit during rollout.

#### Trade-offs

**Supporting Evidence**:
- Minimizing filename churn lowers migration risk and keeps downstream references easier to audit during rollout.

**Confidence**: 77%

<!-- /ANCHOR:decision-retain-existing-reviewmode-filenames-bae8fde1 -->

---

<!-- ANCHOR:decision-document-backwardcompatible-migration-existing-062314f3 -->
### Decision 3: Document and implement backward-compatible migration for existing scratch-based review state.

**Context**: Document and implement backward-compatible migration for existing scratch-based review state. — Without a migration path, paused or partially completed review runs could become harder to resume or inspect after the c

**Timestamp**: 2026-03-27T09:52:30.858Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Document and implement backward-compatible migration for existing scratch-based review state.

#### Chosen Approach

**Selected**: Document and implement backward-compatible migration for existing scratch-based review state.

**Rationale**: Without a migration path, paused or partially completed review runs could become harder to resume or inspect after the contract switch.

#### Trade-offs

**Supporting Evidence**:
- Without a migration path, paused or partially completed review runs could become harder to resume or inspect after the contract switch.

**Confidence**: 77%

<!-- /ANCHOR:decision-document-backwardcompatible-migration-existing-062314f3 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 4. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Research** - 4 actions

---

### Message Timeline

> **User** | 2026-03-27 @ 10:32:00

Run /spec_kit:plan on /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/03--commands-and-skills/034-sk-deep-research-review-folders in auto mode. Deeply analyze the sk-deep-research skill and related commands and agents. Currently deep research creates research subfolders where it places all the research output but review doesnt have a dedicated folder and ends up dumping it in scratch. I want deep-research --review output placed in a dedicated review subfolder in the target spec.

---

> **Assistant** | 2026-03-27 @ 10:52:30

Planned a dedicated review subfolder contract for sk-deep-research review mode so review artifacts no longer land in scratch.

---

> **Assistant** | 2026-03-27 @ 10:52:30

Key decisions: Adopt a dedicated review subtree; Keep filenames stable where practical; Support legacy scratch sessions during rollout

---

> **Assistant** | 2026-03-27 @ 10:52:30

Next steps: Implement the planned contract updates in review command YAMLs, runtime deep-review agent definitions, skill assets, and reference documentation.; Add or update regression playbooks so review mode validates the new review subtree and legacy scratch migration behavior.; Re-run strict spec validation and the relevant skill or command verification after the implementation pass.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 03--commands-and-skills/034-sk-deep-research-review-folders` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "03--commands-and-skills/034-sk-deep-research-review-folders" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "03--commands-and-skills/034-sk-deep-research-review-folders", limit: 10 })

# Verify memory file integrity
ls -la 03--commands-and-skills/034-sk-deep-research-review-folders/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 03--commands-and-skills/034-sk-deep-research-review-folders --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

<!-- /ANCHOR:recovery-hints -->

---

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1774605150814-8e09cc03be23"
spec_folder: "03--commands-and-skills/034-sk-deep-research-review-folders"
channel: "main"

# Git Provenance (M-007d)
head_ref: ""
commit_ref: ""
repository_state: "unavailable"
is_detached_head: No

# Classification
importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "planning"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "episodic"         # episodic|procedural|semantic|constitutional
  half_life_days: 30     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9772           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1.3 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "b9b49283920157feab2c77d96b37f8dc32934b65"         # content hash for dedup detection
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
created_at: "2026-03-27"
created_at_epoch: 1774605150
last_accessed_epoch: 1774605150
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 4
decision_count: 3
tool_count: 0
file_count: 10
captured_file_count: 10
filesystem_file_count: 10
git_changed_file_count: 0
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "durable home"
  - "implement backward-compatible"
  - "backward-compatible migration"
  - "existing scratch-based"
  - "review-mode artifacts"
  - "review-mode filenames"
  - "existing review-mode"
  - "scratch-based review"
  - "filenames primarily"
  - "document implement"
  - "migration existing"
  - "artifacts instead"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "sk-deep-research review folder"
  - "deep-review scratch output"
  - "spec_kit deep research review mode"
  - "review-report placement"
  - "review_mode_contract review subfolder"
  - "dedicated review packet"
  - "deep-review agent outputs"
  - "scratch vs review folder"
  - "spec folder"
  - "system spec kit"
  - "research folder"
  - "backward compatible"
  - "scratch based"
  - "tree thinning"
  - "commands and skills"
  - "sk deep research review folders"
  - "durable home"
  - "state validation"
  - "home review-mode"
  - "review-mode artifacts"
  - "artifacts instead"
  - "instead scratch"
  - "review runs"
  - "retain existing"
  - "existing review-mode"
  - "review-mode filenames"
  - "filenames primarily"
  - "primarily change"
  - "change parent"
  - "parent directory"
  - "commands"
  - "and"
  - "skills/034"
  - "deep"
  - "research"
  - "review"
  - "folders"

key_files:
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/spec.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/plan.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/tasks.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/decision-record.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md"
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml"
  - ".opencode/skill/sk-deep-research/assets/review_mode_contract.yaml"
  - ".opencode/agent/deep-review.md"
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml"
  - ".opencode/skill/system-spec-kit/references/templates/template_guide.md"

# Relationships
related_sessions:

  []

parent_spec: "03--commands-and-skills/034-sk-deep-research-review-folders"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "voyage-4"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*
