---
title: "Implemented 034 Sk [034-sk-deep-research-review-folders/27-03-26_11-29__implemented-034-sk-deep-research-review-folders]"
description: "Review workflows now treat review/ as the durable packet; Legacy review state migration is bounded and conflict-safe; Runtime deep-review agents were synchronized across providers"
trigger_phrases:
  - "sk-deep-research review folder implementation"
  - "deep-review review subfolder"
  - "spec_kit deep-research review migration"
  - "review packet contract"
  - "legacy scratch-to-review migration"
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

# Implemented 034 Sk Deep Research Review Folders

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-27 |
| Session ID | session-1774607393856-33a5dadca278 |
| Spec Folder | 03--commands-and-skills/034-sk-deep-research-review-folders |
| Channel | main |
| Importance Tier | important |
| Context Type | implementation |
| Total Messages | 4 |
| Tool Executions | 0 |
| Decisions Made | 3 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-27 |
| Created At (Epoch) | 1774607393 |
| Last Accessed (Epoch) | 1774607393 |
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
| Last Activity | 2026-03-27T09:00:00.000Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Use review/ as the canonical durable home for deep-review artifacts - This aligns review mode with system-spec-kit scratch semantics and matches the durable packet pattern already used for deep resear, Keep review-mode basenames stable while relocating the parent directory - The scope stays focused on the storage contract change and avoids creating a second compatibility variable through filename ch, Use bounded migration instead of broad scratch cleanup - This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions.

**Decisions:** 3 decisions recorded

### Pending Work

- [ ] **T000**: Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folder}/review/. (Priority: P0)

- [ ] **T001**: Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folde (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 03--commands-and-skills/034-sk-deep-research-review-folders
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 03--commands-and-skills/034-sk-deep-research-review-folders
Last: Use bounded migration instead of broad scratch cleanup - This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions.
Next: Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folder}/review/.
```

**Key Context to Review:**

- Files modified: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml, .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml, .opencode/agent/deep-review.md

- Check: plan.md, tasks.md, checklist.md

- Last: Use bounded migration instead of broad scratch cleanup - This protects...

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | specs/03--commands-and-skills/034-sk-deep-research-review-folders/README.md |
| Last Action | Use bounded migration instead of broad scratch cleanup - This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions. |
| Next Action | Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folder}/review/. |
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

**Key Topics:** `deep-review artifacts` | `review-mode basenames` | `review/ canonical` | `canonical durable` | `stable relocating` | `relocating parent` | `bounded migration` | `migration instead` | `home deep-review` | `keep review-mode` | `basenames stable` | `scratch cleanup` |

**Tool Calls:** `spawn_agent` (1) | `apply_patch` (1) | `exec_command` (1)

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Review workflows now treat review/ as the durable packet** - The review auto and confirm command YAMLs were updated together so config, JSONL state, strategy, dashboard, iteration markdown, pause sentinel, and final review output all live under {spec_folder}/review/ instead of scratch/.

- **Legacy review state migration is bounded and conflict-safe** - Review initialization now migrates only the approved legacy review artifacts from scratch and the former spec-root report into canonical review/ locations, while preserving unrelated scratch files and halting if canonical and legacy state conflict.

- **Runtime deep-review agents were synchronized across providers** - The canonical OpenCode agent plus the Claude, Codex, and Gemini runtime variants now all instruct deep-review to read and write review/ artifacts only, keeping the runtime contract aligned across supported providers.

**Key Files and Their Roles**:

- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` - Moved the auto review workflow onto the review packet,...

- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` - Aligned the confirm review workflow with the new review...

- `.opencode/agent/deep-review.md` - Agent definition

- `.opencode/command/spec_kit/deep-research.md` - Documentation

- `.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md` - Documentation

- `specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md` - Documentation

- `.claude/agents/deep-review.md` - Agent definition

- `.codex/agents/deep-review.toml` - Agent definition

**How to Extend**:

- Create corresponding test files for new implementations

- Apply validation patterns to new input handling

**Common Patterns**:

- **Validation**: Input validation before processing

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Review workflows now treat review/ as the durable packet; Legacy review state migration is bounded and conflict-safe; Runtime deep-review agents were synchronized across providers

**Key Outcomes**:
- Review workflows now treat review/ as the durable packet
- Legacy review state migration is bounded and conflict-safe
- Runtime deep-review agents were synchronized across providers
- Docs, references, and playbooks were swept to the new contract
- Strict packet closeout passed after bookkeeping sync
- Live runtime verification remains the explicit open gap
- Next Steps
- Use review/ as the canonical durable home for deep-review artifacts - This aligns review mode with system-spec-kit scratch semantics and matches the durable packet pattern already used for deep resear
- Keep review-mode basenames stable while relocating the parent directory - The scope stays focused on the storage contract change and avoids creating a second compatibility variable through filename ch
- Use bounded migration instead of broad scratch cleanup - This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions.

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/command/spec_kit/assets/(merged-small-files)` | Tree-thinning merged 2 small files (spec_kit_deep-research_review_auto.yaml, spec_kit_deep-research_review_confirm.yaml).  Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml : Updated spec kit deep research review auto | Merged from .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml : Updated spec kit deep research review confirm |
| `.opencode/agent/(merged-small-files)` | Tree-thinning merged 1 small files (deep-review.md).  Merged from .opencode/agent/deep-review.md : Updated deep review |
| `.opencode/command/spec_kit/(merged-small-files)` | Tree-thinning merged 1 small files (deep-research.md).  Merged from .opencode/command/spec_kit/deep-research.md : Synchronized the command entrypoint documentation so... |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/(merged-small-files)` | Tree-thinning merged 1 small files (015-pause-sentinel-halts-between-iterations.md).  Merged from .opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md : Updated the shared pause playbook so review mode uses... |
| `specs/03--commands-and-skills/034-sk-deep-research-review-folders/(merged-small-files)` | Tree-thinning merged 1 small files (checklist.md).  Merged from specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md : Updated checklist |
| `.claude/agents/(merged-small-files)` | Tree-thinning merged 1 small files (deep-review.md).  Merged from .claude/agents/deep-review.md : Updated deep review |
| `.codex/agents/(merged-small-files)` | Tree-thinning merged 1 small files (deep-review.toml).  Merged from .codex/agents/deep-review.toml : Updated deep review |
| `.gemini/agents/(merged-small-files)` | Tree-thinning merged 1 small files (deep-review.md).  Merged from .gemini/agents/deep-review.md : Updated deep review |
| `.opencode/skill/sk-deep-research/assets/(merged-small-files)` | Tree-thinning merged 1 small files (review_mode_contract.yaml).  Merged from .opencode/skill/sk-deep-research/assets/review_mode_contract.yaml : Changed the shared review-mode asset contract so the... |

<!-- /ANCHOR:summary -->

### Technical Context

| Aspect | Detail |
|--------|--------|
| **scope** | Implement only the review-mode durable folder relocation, legacy migration handling, parity sync, and packet closeout within 034-sk-deep-research-review-folders. |
| **verification** | YAML parse passed, git diff --check passed, strict spec validation passed, and targeted scratch-reference sweeps showed only deliberate legacy-migration inputs remaining. |
| **delegation** | Runtime parity and docs sync were delegated successfully; packet closeout ultimately landed in the target spec folder after the delegate response arrived. |

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:architecture-review-workflows-now-treat-b710b4d6 -->
### IMPLEMENTATION: Review workflows now treat review/ as the durable packet

The review auto and confirm command YAMLs were updated together so config, JSONL state, strategy, dashboard, iteration markdown, pause sentinel, and final review output all live under {spec_folder}/review/ instead of scratch/.

**Files:** .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml, .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml
**Details:** .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml | .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml | State paths, pause checks, synthesis outputs, and completion summaries now point at the review packet.
<!-- /ANCHOR:architecture-review-workflows-now-treat-b710b4d6 -->

<!-- ANCHOR:implementation-legacy-review-state-migration-1001e87e -->
### IMPLEMENTATION: Legacy review state migration is bounded and conflict-safe

Review initialization now migrates only the approved legacy review artifacts from scratch and the former spec-root report into canonical review/ locations, while preserving unrelated scratch files and halting if canonical and legacy state conflict.

**Details:** Whitelist includes config, JSONL, strategy, dashboard, iteration files, pause sentinel, and the former root report. | Migration is scoped to the current spec folder and does not rename the deep-research basenames. | .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml | .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml
<!-- /ANCHOR:implementation-legacy-review-state-migration-1001e87e -->

<!-- ANCHOR:implementation-runtime-deepreview-agents-synchronized-68bbf779 -->
### IMPLEMENTATION: Runtime deep-review agents were synchronized across providers

The canonical OpenCode agent plus the Claude, Codex, and Gemini runtime variants now all instruct deep-review to read and write review/ artifacts only, keeping the runtime contract aligned across supported providers.

**Files:** .claude/agents/deep-review.md, .codex/agents/deep-review.toml, .gemini/agents/deep-review.md, .opencode/agent/deep-review.md
**Details:** .opencode/agent/deep-review.md | .claude/agents/deep-review.md | .codex/agents/deep-review.toml | .gemini/agents/deep-review.md
<!-- /ANCHOR:implementation-runtime-deepreview-agents-synchronized-68bbf779 -->

<!-- ANCHOR:files-docs-references-playbooks-swept-38671cee -->
### DOCUMENTATION: Docs, references, and playbooks were swept to the new contract

The command guide, skill docs, quick references, convergence and state-format docs, review-mode playbooks, and shared pause or resume playbooks were updated so operators see the same durable review packet layout that the runtime now uses.

**Details:** .opencode/command/spec_kit/deep-research.md | .opencode/skill/sk-deep-research/SKILL.md | .opencode/skill/sk-deep-research/README.md | .opencode/skill/sk-deep-research/manual_testing_playbook/07--review-mode/039-review-report-synthesis-has-all-sections.md | .opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md
<!-- /ANCHOR:files-docs-references-playbooks-swept-38671cee -->

<!-- ANCHOR:implementation-strict-packet-closeout-passed-4327e23b -->
### VERIFICATION: Strict packet closeout passed after bookkeeping sync

The spec packet initially failed strict validation because checklist and implementation-summary entries mentioned bare markdown filenames that the validator treated as missing packet-local references; after rewriting those references and refreshing the evidence sections, strict validation passed cleanly.

**Files:** specs/03--commands-and-skills/034-sk-deep-research-review-folders/README.md, specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md, specs/03--commands-and-skills/034-sk-deep-research-review-folders/implementation-summary.md, specs/03--commands-and-skills/034-sk-deep-research-review-folders/tasks.md
**Details:** bash.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/03--commands-and-skills/034-sk-deep-research-review-folders --strict | Result: 0 errors, 0 warnings. | tasks.md, checklist.md, implementation-summary.md, and packet README now reflect the implemented state.
<!-- /ANCHOR:implementation-strict-packet-closeout-passed-4327e23b -->

<!-- ANCHOR:implementation-live-runtime-verification-remains-90f01bf7 -->
### FOLLOWUP: Live runtime verification remains the explicit open gap

The packet intentionally leaves the fresh review-session write check and the legacy scratch-state replay check open because this session validated contract surfaces and packet integrity but did not execute a live deep-review run.

**Details:** CHK-020 and CHK-021 remain open by design. | Unknown downstream consumers of the former spec-root review report were not replayed end to end.
<!-- /ANCHOR:implementation-live-runtime-verification-remains-90f01bf7 -->

<!-- ANCHOR:guide-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folder}/review/. Replay a legacy scratch-based review session and verify the migration whitelist rehomes only approved review artifacts before resume classification. If downstream consumers exist outside the first-party surfaces, validate that they now read the final report from the review packet.

**Details:** Next: Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folder}/review/. | Follow-up: Replay a legacy scratch-based review session and verify the migration whitelist rehomes only approved review artifacts before resume classification. | Follow-up: If downstream consumers exist outside the first-party surfaces, validate that they now read the final report from the review packet.
<!-- /ANCHOR:guide-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-review-canonical-durable-home-f091fbec -->
### Decision 1: Use review/ as the canonical durable home for deep-review artifacts

**Context**: Use review/ as the canonical durable home for deep-review artifacts — This aligns review mode with system-spec-kit scratch semantics and matches the durable packet pattern already used for d

**Timestamp**: 2026-03-27T10:29:53.888Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Use review/ as the canonical durable home for deep-review artifacts

#### Chosen Approach

**Selected**: Use review/ as the canonical durable home for deep-review artifacts

**Rationale**: This aligns review mode with system-spec-kit scratch semantics and matches the durable packet pattern already used for deep research output.

#### Trade-offs

**Supporting Evidence**:
- This aligns review mode with system-spec-kit scratch semantics and matches the durable packet pattern already used for deep research output.

**Confidence**: 77%

<!-- /ANCHOR:decision-review-canonical-durable-home-f091fbec -->

---

<!-- ANCHOR:decision-keep-reviewmode-basenames-stable-fec51e0e -->
### Decision 2: Keep review-mode basenames stable while relocating the parent directory

**Context**: Keep review-mode basenames stable while relocating the parent directory — The scope stays focused on the storage contract change and avoids creating a second compatibility variable through filen

**Timestamp**: 2026-03-27T10:29:53.888Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Keep review-mode basenames stable while relocating the parent directory

#### Chosen Approach

**Selected**: Keep review-mode basenames stable while relocating the parent directory

**Rationale**: The scope stays focused on the storage contract change and avoids creating a second compatibility variable through filename churn.

#### Trade-offs

**Supporting Evidence**:
- The scope stays focused on the storage contract change and avoids creating a second compatibility variable through filename churn.

**Confidence**: 77%

<!-- /ANCHOR:decision-keep-reviewmode-basenames-stable-fec51e0e -->

---

<!-- ANCHOR:decision-bounded-migration-instead-broad-6a338c9a -->
### Decision 3: Use bounded migration instead of broad scratch cleanup

**Context**: Use bounded migration instead of broad scratch cleanup — This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions.

**Timestamp**: 2026-03-27T10:29:53.888Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Use bounded migration instead of broad scratch cleanup

#### Chosen Approach

**Selected**: Use bounded migration instead of broad scratch cleanup

**Rationale**: This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions.

#### Trade-offs

**Supporting Evidence**:
- This protects unrelated temporary scratch files and avoids silently merging contradictory review sessions.

**Confidence**: 77%

<!-- /ANCHOR:decision-bounded-migration-instead-broad-6a338c9a -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Research** - 9 actions
- **Verification** - 1 actions

---

### Message Timeline

> **User** | 2026-03-27 @ 10:00:00

run /spec_kit:implement on: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/03--commands-and-skills/034-sk-deep-research-review-folders delegate up to 3 sub-agents

---

> **Assistant** | 2026-03-27 @ 11:29:53

Implemented 034-sk-deep-research-review-folders by moving deep-review durable artifacts into {spec_folder}/review/, adding bounded legacy scratch-to-review migration, synchronizing runtime and documentation contracts, and closing the packet with strict validation while leaving live runtime replay as the remaining verification gap.

---

> **Assistant** | 2026-03-27 @ 11:29:53

Key decisions: Use review/ as the canonical durable home for deep-review artifacts; Keep review-mode basenames stable while relocating the parent directory; Use bounded migration instead of broad scratch cleanup

---

> **Assistant** | 2026-03-27 @ 11:29:53

Next steps: Run a fresh deep-review session and confirm it initializes durable state directly inside {spec_folder}/review/.; Replay a legacy scratch-based review session and verify the migration whitelist rehomes only approved review artifacts before resume classification.; If downstream consumers exist outside the first-party surfaces, validate that they now read the final report from the review packet.

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
session_id: "session-1774607393856-33a5dadca278"
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
  fingerprint_hash: "10e02f416fe36d183b7520bab5cfd3cc7f7a3c07"         # content hash for dedup detection
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
created_at_epoch: 1774607393
last_accessed_epoch: 1774607393
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
  - "deep-review artifacts"
  - "review-mode basenames"
  - "review/ canonical"
  - "canonical durable"
  - "stable relocating"
  - "relocating parent"
  - "bounded migration"
  - "migration instead"
  - "home deep-review"
  - "keep review-mode"
  - "basenames stable"
  - "scratch cleanup"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "sk-deep-research review folder implementation"
  - "deep-review review subfolder"
  - "spec_kit deep-research review migration"
  - "review packet contract"
  - "legacy scratch-to-review migration"
  - "conflict safe"
  - "deep review"
  - "system spec kit"
  - "review mode"
  - "durable packet"
  - "canonical durable"
  - "durable home"
  - "home deep-review"
  - "deep-review artifacts"
  - "keep review-mode"
  - "review-mode basenames"
  - "basenames stable"
  - "stable relocating"
  - "relocating parent"
  - "parent directory"
  - "bounded migration"
  - "migration instead"
  - "instead broad"
  - "broad scratch"
  - "scratch cleanup"
  - "mode with system"
  - "artifacts aligns"
  - "aligns review"
  - "mode system-spec-kit"
  - "commands"
  - "and"
  - "skills/034"
  - "deep"
  - "research"
  - "review"
  - "folders"

key_files:
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml"
  - ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml"
  - ".opencode/agent/deep-review.md"
  - ".opencode/command/spec_kit/deep-research.md"
  - ".opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md"
  - "specs/03--commands-and-skills/034-sk-deep-research-review-folders/checklist.md"
  - ".claude/agents/deep-review.md"
  - ".codex/agents/deep-review.toml"
  - ".gemini/agents/deep-review.md"
  - ".opencode/skill/sk-deep-research/assets/review_mode_contract.yaml"

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
