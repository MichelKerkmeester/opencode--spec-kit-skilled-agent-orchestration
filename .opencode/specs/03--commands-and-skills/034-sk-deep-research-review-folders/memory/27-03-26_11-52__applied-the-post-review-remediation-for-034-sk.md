---
title: "Applied The Post [034-sk-deep-research-review-folders/27-03-26_11-52__applied-the-post-review-remediation-for-034-sk]"
description: "Deep-research now accepts both spec-root aliases at the preflight guard; The shared command entrypoint and.agents wrapper are back in sync; Review backup recovery docs now..."
trigger_phrases:
  - "deep-research alias-root remediation"
  - "review-folder follow-up fixes"
  - "agents deep-research toml sync"
  - "review packet backup docs fix"
  - "specs alias root compatibility"
importance_tier: important
contextType: "implementation"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 10
filesystem_file_count: 10
git_changed_file_count: 0
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":true,"score":0.85,"errors":0,"warnings":3}
---
> **Note:** This session had limited actionable content (quality score: 0/100). 1 noise entries and 0 duplicates were filtered.


# Applied The Post Review Remediation For 034 Sk

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-27 |
| Session ID | session-1774608748837-62fe59e9fd14 |
| Spec Folder | 03--commands-and-skills/034-sk-deep-research-review-folders |
| Channel | main |
| Importance Tier | important |
| Context Type | implementation |
| Total Messages | 4 |
| Tool Executions | 0 |
| Decisions Made | 3 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-27 |
| Created At (Epoch) | 1774608748 |
| Last Accessed (Epoch) | 1774608748 |
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
| Session Status | IN_PROGRESS |
| Completion % | 95% |
| Last Activity | 2026-03-27T10:00:00.000Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Treat specs/ and., Fix the., Keep research-mode storage behavior out of scope while allowing shared compatibility fixes - That preserves the original review-folder scope while accurately recording the small shared-command changes

**Decisions:** 3 decisions recorded

### Pending Work

- [ ] **T000**: Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initializes the review/ subtree successfully. (Priority: P0)

- [ ] **T001**: Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initialize (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 03--commands-and-skills/034-sk-deep-research-review-folders
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 03--commands-and-skills/034-sk-deep-research-review-folders
Last: Keep research-mode storage behavior out of scope while allowing shared compatibility fixes - That preserves the original review-folder scope while accurately recording the small shared-command changes
Next: Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initializes the review/ subtree successfully.
```

**Key Context to Review:**

- Files modified: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml, .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml, .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml

- Check: plan.md, tasks.md, checklist.md

- Last: Keep research-mode storage behavior out of scope while allowing shared...

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml |
| Last Action | Keep research-mode storage behavior out of scope while allowing shared compatibility fixes - That preserves the original review-folder scope while accurately recording the small shared-command changes |
| Next Action | Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initializes the review/ subtree successfully. |
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

**Key Topics:** `shared command` | `specs/ and.opencode/specs/` | `and.opencode/specs/ valid` | `the.agents deep-research` | `deep-research command` | `deep-research wrapper` | `research-mode storage` | `shared deep-research` | `shared compatibility` | `instead documenting` | `compatibility fixes` | `keep research-mode` |

**Tool Calls:** `apply_patch` (1) | `exec_command` (1)

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Deep-research now accepts both spec-root aliases at the preflight guard** - The deep-research auto, confirm, review-auto, and review-confirm YAML workflows now describe spec-folder validation in terms of both specs/ and.

- **The shared command entrypoint and.agents wrapper are back in sync** - The deep-research Markdown entrypoint now searches both alias roots, shows specs-based examples, and documents mode-specific backup behavior, while the.

**Key Files and Their Roles**:

- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` - Widened the shared deep-research research-mode preflight...

- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` - Widened the shared deep-research confirm-mode preflight...

- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` - Aligned the review-mode preflight guard and track-scope...

- `.opencode/command/spec_kit/deep-research.md` - Documentation

- `.agents/commands/spec_kit/deep-research.toml` - Updated the parallel.agents wrapper metadata so it...

- `.opencode/skill/sk-deep-research/references/loop_protocol.md` - Documentation

- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` - Aligned the review-mode confirm preflight guard and...

- `specs/03--commands-and-skills/034-sk-deep-research-review-folders/spec.md` - Documentation

**How to Extend**:

- Apply validation patterns to new input handling

- Maintain consistent error handling approach

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Deep-research now accepts both spec-root aliases at the preflight guard; The shared command entrypoint and.agents wrapper are back in sync; Review backup recovery docs now match the implemented runtime contract

**Key Outcomes**:
- Deep-research now accepts both spec-root aliases at the preflight guard
- The shared command entrypoint and.agents wrapper are back in sync
- Review backup recovery docs now match the implemented runtime contract
- The packet was resynchronized after the remediation pass and validated strictly
- Live runtime proof is still the remaining gap
- Next Steps
- Treat specs/ and.
- Fix the.
- Keep research-mode storage behavior out of scope while allowing shared compatibility fixes - That preserves the original review-folder scope while accurately recording the small shared-command changes

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` | Aligned the review-mode confirm preflight guard and... | Tree-thinning merged 3 small files (spec_kit_deep-research_auto.yaml, spec_kit_deep-research_confirm.yaml, spec_kit_deep-research_review_auto.yaml).  Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml : Widened the shared deep-research research-mode preflight... | Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml : Widened the shared deep-research confirm-mode preflight... | Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml : Aligned the review-mode preflight guard and track-scope... |
| `.opencode/command/spec_kit/(merged-small-files)` | Tree-thinning merged 1 small files (deep-research.md).  Merged from .opencode/command/spec_kit/deep-research.md : Updated the shared deep-research entrypoint to search... |
| `.agents/commands/spec_kit/(merged-small-files)` | Tree-thinning merged 1 small files (deep-research.toml).  Merged from .agents/commands/spec_kit/deep-research.toml : Updated the parallel.agents wrapper metadata so it... |
| `.opencode/skill/sk-deep-research/references/(merged-small-files)` | Tree-thinning merged 1 small files (loop_protocol.md).  Merged from .opencode/skill/sk-deep-research/references/loop_protocol.md : Corrected the shared recovery table so research mode... |
| `specs/03--commands-and-skills/034-sk-deep-research-review-folders/(merged-small-files)` | Tree-thinning merged 3 small files (spec.md, checklist.md, implementation-summary.md).  Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/spec.md : Amended the packet scope and file inventory so the... | Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md : Updated verification evidence so the packet records the... | Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/implementation-summary.md : Refreshed the post-implementation summary to include the... |

<!-- /ANCHOR:summary -->

### Technical Context

| Aspect | Detail |
|--------|--------|
| **scope** | Apply only the reviewed compatibility and documentation fixes needed after the review-folder implementation: shared spec-root alias acceptance, wrapper metadata parity, and mode-specific recovery wording. |
| **verification** | YAML parsing passed for all four deep-research workflow YAMLs, git diff --check passed, the stale reviewed strings were removed by rg sweeps, and strict packet validation passed with 0 errors and 0 warnings. |
| **packet_sync** | The packet was amended so spec.md, plan.md, tasks.md, checklist.md, README.md, and implementation-summary.md all reflect the remediation pass instead of only the original implementation wave. |

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:discovery-deepresearch-now-accepts-both-6fff6bab -->
### IMPLEMENTATION: Deep-research now accepts both spec-root aliases at the preflight guard

The deep-research auto, confirm, review-auto, and review-confirm YAML workflows now describe spec-folder validation in terms of both specs/ and.opencode/specs/ alias roots, which removes the stale.opencode-only gate without changing the underlying research scratch contract or the review packet paths.

**Details:** .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml | .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml | .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml | .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml
<!-- /ANCHOR:discovery-deepresearch-now-accepts-both-6fff6bab -->

<!-- ANCHOR:discovery-shared-command-entrypoint-andagents-691e741a -->
### IMPLEMENTATION: The shared command entrypoint and.agents wrapper are back in sync

The deep-research Markdown entrypoint now searches both alias roots, shows specs-based examples, and documents mode-specific backup behavior, while the.agents deep-research TOML wrapper now exposes:review,:review:auto, and:review:confirm in its public metadata.

**Details:** .opencode/command/spec_kit/deep-research.md | .agents/commands/spec_kit/deep-research.toml | The stale research-only wrapper description was removed.
<!-- /ANCHOR:discovery-shared-command-entrypoint-andagents-691e741a -->

<!-- ANCHOR:implementation-review-backup-recovery-docs-0be95a4a -->
### DOCUMENTATION: Review backup recovery docs now match the implemented runtime contract

The shared loop protocol and the command error table now explicitly distinguish research-mode scratch backups from review-mode preservation of the durable review packet, which removes the operator-facing contradiction flagged during review.

**Details:** .opencode/command/spec_kit/deep-research.md | .opencode/skill/sk-deep-research/references/loop_protocol.md | .opencode/skill/sk-deep-research/README.md
<!-- /ANCHOR:implementation-review-backup-recovery-docs-0be95a4a -->

<!-- ANCHOR:implementation-packet-resynchronized-after-remediation-5e2a5a76 -->
### VERIFICATION: The packet was resynchronized after the remediation pass and validated strictly

The spec, plan, tasks, checklist, README, and implementation-summary were amended so the follow-up compatibility fixes are now recorded inside the packet, and strict packet validation passed again with zero errors and zero warnings.

**Details:** bash.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/03--commands-and-skills/034-sk-deep-research-review-folders --strict | Result: 0 errors, 0 warnings. | git diff --check passed across the touched implementation and packet files.
<!-- /ANCHOR:implementation-packet-resynchronized-after-remediation-5e2a5a76 -->

<!-- ANCHOR:implementation-live-runtime-proof-still-9e807fe8 -->
### FOLLOWUP: Live runtime proof is still the remaining gap

This remediation pass fixed the reviewed drift and documentation mismatches, but it still did not execute a fresh deep-review run or a legacy scratch-state replay fixture, so the runtime migration checks remain deferred.

**Details:** CHK-020 remains deferred. | CHK-021 remains deferred. | Unknown downstream consumers of the former root-level review report remain a compatibility risk.
<!-- /ANCHOR:implementation-live-runtime-proof-still-9e807fe8 -->

<!-- ANCHOR:guide-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initializes the review/ subtree successfully. Replay a legacy scratch-based review session and verify the migration whitelist still rehomes only the approved review artifacts before resume classification. If downstream consumers exist outside the first-party surfaces, replay them against the review packet report location.

**Details:** Next: Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initializes the review/ subtree successfully. | Follow-up: Replay a legacy scratch-based review session and verify the migration whitelist still rehomes only the approved review artifacts before resume classification. | Follow-up: If downstream consumers exist outside the first-party surfaces, replay them against the review packet report location.
<!-- /ANCHOR:guide-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-treat-specs-andopencodespecs-valid-0749a89e -->
### Decision 1: Treat specs/ and.opencode/specs/ as valid alias roots in the shared deep-research command surface

**Context**: Treat specs/ and.opencode/specs/ as valid alias roots in the shared deep-research command surface — The rest of Spec Kit already recognizes both roots, and review mode had become reachable only through an inconsistent sh

**Timestamp**: 2026-03-27T10:52:28.865Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Treat specs/ and.opencode/specs/ as valid alias roots in the shared deep-research command surface

#### Chosen Approach

**Selected**: Treat specs/ and.opencode/specs/ as valid alias roots in the shared deep-research command surface

**Rationale**: The rest of Spec Kit already recognizes both roots, and review mode had become reachable only through an inconsistent shared command path contract.

#### Trade-offs

**Supporting Evidence**:
- The rest of Spec Kit already recognizes both roots, and review mode had become reachable only through an inconsistent shared command path contract.

**Confidence**: 77%

<!-- /ANCHOR:decision-treat-specs-andopencodespecs-valid-0749a89e -->

---

<!-- ANCHOR:decision-theagents-deepresearch-wrapper-instead-4acc7c69 -->
### Decision 2: Fix the.agents deep-research wrapper instead of documenting the drift

**Context**: Fix the.agents deep-research wrapper instead of documenting the drift — The wrapper forwards to the shared command spec, so leaving stale public metadata would keep operator guidance out of sy

**Timestamp**: 2026-03-27T10:52:28.865Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Fix the.agents deep-research wrapper instead of documenting the drift

#### Chosen Approach

**Selected**: Fix the.agents deep-research wrapper instead of documenting the drift

**Rationale**: The wrapper forwards to the shared command spec, so leaving stale public metadata would keep operator guidance out of sync even after the runtime contract was fixed.

#### Trade-offs

**Supporting Evidence**:
- The wrapper forwards to the shared command spec, so leaving stale public metadata would keep operator guidance out of sync even after the runtime contract was fixed.

**Confidence**: 77%

<!-- /ANCHOR:decision-theagents-deepresearch-wrapper-instead-4acc7c69 -->

---

<!-- ANCHOR:decision-keep-researchmode-storage-behavior-6bc8224c -->
### Decision 3: Keep research-mode storage behavior out of scope while allowing shared compatibility fixes

**Context**: Keep research-mode storage behavior out of scope while allowing shared compatibility fixes — That preserves the original review-folder scope while accurately recording the small shared-command changes required to

**Timestamp**: 2026-03-27T10:52:28.865Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Keep research-mode storage behavior out of scope while allowing shared compatibility fixes

#### Chosen Approach

**Selected**: Keep research-mode storage behavior out of scope while allowing shared compatibility fixes

**Rationale**: That preserves the original review-folder scope while accurately recording the small shared-command changes required to fix the reviewed drift.

#### Trade-offs

**Supporting Evidence**:
- That preserves the original review-folder scope while accurately recording the small shared-command changes required to fix the reviewed drift.

**Confidence**: 77%

<!-- /ANCHOR:decision-keep-researchmode-storage-behavior-6bc8224c -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Research** - 8 actions
- **Verification** - 1 actions

---

### Message Timeline

> **User** | 2026-03-27 @ 11:00:00

Apply fixes

---

> **Assistant** | 2026-03-27 @ 11:52:28

Applied the post-review remediation for 034-sk-deep-research-review-folders by widening deep-research spec-folder compatibility to both specs/ and .opencode/specs/ alias roots, syncing the .agents TOML wrapper to expose review-mode suffixes, correcting review-mode backup docs, and resynchronizing the spec packet before revalidating it.

---

> **Assistant** | 2026-03-27 @ 11:52:28

Key decisions: Treat specs/ and .opencode/specs/ as valid alias roots in the shared deep-research command surface; Fix the .agents deep-research wrapper instead of documenting the drift; Keep research-mode storage behavior out of scope while allowing shared compatibility fixes

---

> **Assistant** | 2026-03-27 @ 11:52:28

Next steps: Run a fresh /spec_kit:deep-research:review session against a specs/ packet and confirm it initializes the review/ subtree successfully.; Replay a legacy scratch-based review session and verify the migration whitelist still rehomes only the approved review artifacts before resume classification.; If downstream consumers exist outside the first-party surfaces, replay them against the review packet report location.

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
session_id: "session-1774608748837-62fe59e9fd14"
spec_folder: "03--commands-and-skills/034-sk-deep-research-review-folders"
channel: "main"

# Git Provenance (M-007d)
head_ref: ""
commit_ref: ""
repository_state: "unavailable"
is_detached_head: No

# Classification
importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "implementation"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "procedural"         # episodic|procedural|semantic|constitutional
  half_life_days: 180     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9962           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1.3 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "5ba28d5b06a1ed6bb26b582ef9e618a1b1e59ae6"         # content hash for dedup detection
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
created_at_epoch: 1774608748
last_accessed_epoch: 1774608748
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
  - "shared command"
  - "specs/ and.opencode/specs/"
  - "and.opencode/specs/ valid"
  - "the.agents deep-research"
  - "deep-research command"
  - "deep-research wrapper"
  - "research-mode storage"
  - "shared deep-research"
  - "shared compatibility"
  - "instead documenting"
  - "compatibility fixes"
  - "keep research-mode"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "deep-research alias-root remediation"
  - "review-folder follow-up fixes"
  - "agents deep-research toml sync"
  - "review packet backup docs fix"
  - "specs alias root compatibility"
  - "spec kit deep"
  - "research review auto"
  - "deep research"
  - "spec root"
  - "research mode"
  - "shared command"
  - "review mode"
  - "tree thinning"
  - "confirm mode"
  - "track scope"
  - "fix reviewed drift"
  - "shared deep-research"
  - "preflight guard"
  - "valid alias"
  - "alias roots"
  - "roots shared"
  - "deep-research command"
  - "command surface"
  - "fix the.agents"
  - "the.agents deep-research"
  - "deep-research wrapper"
  - "wrapper instead"
  - "commands"
  - "and"
  - "skills/034"
  - "deep"
  - "research"
  - "review"
  - "folders"

key_files:
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml"
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml"
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml"
  - ".opencode/command/spec_kit/deep-research.md"
  - ".agents/commands/spec_kit/deep-research.toml"
  - ".opencode/skill/sk-deep-research/references/loop_protocol.md"
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/spec.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/implementation-summary.md"

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
