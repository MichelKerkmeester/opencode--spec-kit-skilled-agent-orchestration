---
title: Spec Check Protocol
description: Canonical contract for late-INIT spec.md detection, bounded mutation, advisory locking, and post-synthesis write-back in deep-research.
---

# Spec Check Protocol

Canonical contract for how `/spec_kit:deep-research` inspects and mutates `spec.md` without turning that work into an unbounded side effect.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Define the bounded `spec.md` integration points for deep-research:
- Late-INIT lock acquisition and folder-state detection
- Pre-init seed or context mutation before LOOP starts
- Post-synthesis generated-fence write-back before save or cancellation cleanup

### Scope
This protocol applies only to deep-research-owned `spec.md` mutations:
- Seeded Level 1 `spec.md` creation when no spec exists
- Anchor-bounded pre-init context updates to an existing `spec.md`
- One generated findings block written after synthesis

This protocol does not own the shared intake contract in `.opencode/skill/system-spec-kit/references/intake-contract.md`, nor `/spec_kit:plan` or `/spec_kit:complete` delegation behavior.

### Relation to the Deep-Research Loop
The workflow remains four-phase:
1. INIT resolves canonical paths, acquires the advisory lock, and classifies `folder_state`
2. LOOP runs only after the pre-init spec branch is complete
3. SYNTHESIS compiles `research/research.md` and then performs bounded write-back
4. SAVE handles continuity refresh and lock release

`research/research.md` remains the source of truth. `spec.md` receives only the bounded seed markers, pre-init context note, and the generated findings block described below.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:advisory-lock-lifecycle -->
## 2. ADVISORY LOCK LIFECYCLE

### Lock File
- Path: `{spec_folder}/research/.deep-research.lock`
- Scope: one live deep-research writer per spec folder
- Ownership: acquired by the deep-research workflow, not by the leaf agent

### Lifecycle
1. Resolve canonical research packet paths.
2. Acquire the lock in late INIT before `folder_state` classification.
3. Hold the lock through:
   - pre-init seed or append work
   - every LOOP iteration
   - synthesis compilation
   - post-synthesis generated-block replacement
4. Release the lock only after the save, skip-save, or cancel path has resolved.

### Semantics
- Locking is advisory, not mandatory.
- macOS and BSD follow POSIX advisory lock semantics for `flock()` and `fcntl()` style coordination.
- Lock contention is fail-closed. A second live writer does not merge or override.
- Stale-lock override is confirm-only or explicit recovery-only.

### Required Audit Behavior
- Successful acquisition records the resolved lock path and session lineage.
- Release records whether the workflow ended with save, skip-save, or cancellation cleanup.

---

<!-- /ANCHOR:advisory-lock-lifecycle -->
<!-- ANCHOR:folder-state-classification -->
## 3. FOLDER STATE CLASSIFICATION

`step_detect_spec_present` outputs exactly one `folder_state` value:

| `folder_state` | Meaning | Expected next action |
|----------------|---------|----------------------|
| `no-spec` | `spec.md` does not exist yet | Seed a Level 1 `spec.md` before LOOP |
| `spec-present` | `spec.md` exists and approved host anchors are available | Apply bounded pre-init context updates |
| `spec-just-created-by-this-run` | This run already seeded `spec.md` and can verify the DR seed markers | Do not reseed or duplicate pre-init context |
| `conflict-detected` | Host anchors, markers, or human-authored content make mutation ambiguous | Emit typed audit and halt fail-closed |

### Detection Inputs
- `spec_folder`
- `research_topic`
- `normalized_topic`
- resolved host anchors in `spec.md`
- existing `<!-- DR-SEED:... -->` markers
- existing generated findings fence markers

### Detection Guarantees
- Classification happens after config, JSONL, strategy, and registry exist.
- The result is passed into INIT and SYNTHESIS.
- The workflow records a typed `spec_check_result` audit event before any mutation branch executes.

---

<!-- /ANCHOR:folder-state-classification -->
<!-- ANCHOR:pre-init-branches -->
## 4. PRE-INIT BRANCHES

### `no-spec`
- Create a Level 1 `spec.md` seeded from the research ask.
- Insert tracked seed markers:
  - `<!-- DR-SEED:REQUIREMENTS -->` under Requirements
  - `<!-- DR-SEED:SCOPE -->` under Scope
- Emit `spec_seed_created`.
- Set `folder_state = spec-just-created-by-this-run` before LOOP begins.

### `spec-present`
- Normalize the research topic before any append.
- Append the topic only at bounded host locations:
  - `Open Questions`
  - a compact `Research Context` note
- Do not rewrite adjacent prose or broaden the scope of the packet.
- Emit `spec_preinit_context_added`.

### `spec-just-created-by-this-run`
- Re-check the DR seed markers and continue without reseeding.
- Treat marker verification as a no-op guard, not as another mutation.

### `conflict-detected`
- Emit `spec_mutation_conflict`.
- Halt before LOOP.
- Do not attempt fallback rewrites or inferred merges.

---

<!-- /ANCHOR:pre-init-branches -->
<!-- ANCHOR:post-synthesis-write-back -->
## 5. POST-SYNTHESIS WRITE-BACK

### Timing
Run after `research/research.md` compilation during SYNTHESIS and before config completion or any memory-save branch.

### Write-Back Shape
The workflow writes or replaces exactly one machine-owned fence nested under the chosen host anchor:

```md
<!-- BEGIN GENERATED: deep-research/spec-findings -->
[abridged findings derived from research/research.md]
<!-- END GENERATED: deep-research/spec-findings -->
```

### Contract
- `research/research.md` remains the source of truth.
- The generated block is an abridged sync, not a second canonical narrative.
- The workflow replaces the full block atomically when content changes.
- Interrupted synthesis does not leave a partial block behind; emit `spec_synthesis_deferred` instead.

### Host Anchor Rules
- The host anchor must already exist or be deterministically created by the seed path.
- The generated block must be nested under that one chosen host anchor only.
- The workflow must not create duplicate generated blocks in sibling sections.

---

<!-- /ANCHOR:post-synthesis-write-back -->
<!-- ANCHOR:audit-events -->
## 6. AUDIT EVENTS

All protocol events are appended to `research/deep-research-state.jsonl`.

Every audit payload is typed. At minimum, emit:
- `type`
- `event`
- `timestamp`
- `specPath` or `specFolder`
- the contextual discriminator for the event (`folder_state`, `normalized_topic`, `generatedFence`, `packetIds`, `conflictKind`, or similar)

| Event | Minimum payload schema |
|-------|------------------------|
| `spec_check_result` | `{ "type": "event", "event": "spec_check_result", "folder_state": "...", "normalized_topic": "...", "specPath": "...", "hostAnchor": "...", "timestamp": "..." }` |
| `spec_seed_created` | `{ "type": "spec_mutation", "event": "spec_seed_created", "folder_state": "spec-just-created-by-this-run", "anchors_touched": ["Scope", "Requirements"], "diff_summary": "...", "seed_markers": ["DR-SEED:SCOPE", "DR-SEED:REQUIREMENTS"], "timestamp": "..." }` |
| `spec_preinit_context_added` | `{ "type": "spec_mutation", "event": "spec_preinit_context_added", "folder_state": "spec-present", "anchors_touched": ["Open Questions", "Research Context"], "diff_summary": "...", "normalized_topic": "...", "timestamp": "..." }` |
| `spec_preinit_context_deduped` | `{ "type": "spec_mutation", "event": "spec_preinit_context_deduped", "folder_state": "spec-present", "anchors_touched": ["Open Questions"], "diff_summary": "...", "normalized_topic": "...", "specPath": "...", "timestamp": "..." }` |
| `spec_mutation` | `{ "type": "spec_mutation", "event": "spec_mutation", "phase": "post-synthesis", "anchors_touched": ["<chosen host anchor>"], "diff_summary": "...", "generatedFence": "deep-research/spec-findings", "timestamp": "..." }` |
| `spec_mutation_conflict` | `{ "type": "spec_mutation", "event": "spec_mutation_conflict", "folder_state": "conflict-detected", "reason": "...", "hostAnchor": "...", "specPath": "...", "generatedFence": "deep-research/spec-findings", "conflictKind": "...", "timestamp": "..." }` |
| `spec_synthesis_deferred` | `{ "type": "spec_mutation", "event": "spec_synthesis_deferred", "reason": "...", "generatedFence": "deep-research/spec-findings", "timestamp": "..." }` |

### Audit Requirements
- Every real `spec.md` mutation records `anchors_touched` and `diff_summary`.
- The protocol never relies on prose logs alone.
- Conflict exits and deferred write-back are auditable from JSONL without opening the mutated file.

---

<!-- /ANCHOR:audit-events -->
<!-- ANCHOR:idempotency-rules -->
## 7. IDEMPOTENCY RULES

### Topic Dedupe
- Lowercase, strip punctuation, collapse whitespace, and trim before comparing research topics.
- Re-running with the same `normalized_topic` must no-op instead of appending another pre-init note.
- The shared intake contract (`.opencode/skill/system-spec-kit/references/intake-contract.md` §5-§6) applies the same normalization before writing `feature_description` into `spec.md` Problem Statement or Purpose; equivalent normalized phrases emit `intake_topic_deduped` instead of overwriting the existing prose.

### Marker-Based Placeholder Detection
- Seed behavior depends on deterministic `<!-- DR-SEED:... -->` markers, not fuzzy prose matching.
- If the required seed markers already exist, treat the seed path as already satisfied.
- The shared intake contract used by `/spec_kit:plan --intake-only`, `/spec_kit:plan`, and `/spec_kit:complete` classifies any retained DR seed marker as `placeholder-upgrade` and persists `resume_question_id` plus `reentry_reason` for REQ-011 re-entry.

### Relation-Object Dedupe
- Manual relationship arrays dedupe by `packet_id` within each relation type (`depends_on`, `related_to`, `supersedes`) before emitting `graph-metadata.json`.
- Dedupe outcomes emit `relationship_deduped` with typed payload fields such as `dedupedCount` and `packetIds`.

### Generated-Block Replacement
- The generated findings block is matched by the exact marker pair:
  - `<!-- BEGIN GENERATED: deep-research/spec-findings -->`
  - `<!-- END GENERATED: deep-research/spec-findings -->`
- Same host anchor plus same generated content resolves to a no-op.
- If the existing generated block fails checksum validation or carries an explicit manual-edit marker, emit `spec_mutation_conflict` and halt instead of overwriting.

### Cross-Command Compatibility
- Relation objects shared with sibling intake flows dedupe by `packet_id`.
- This protocol does not create manual relationship edges itself, but it must not reintroduce duplicate relation objects if that metadata is surfaced during a future delegated sync.

---

<!-- /ANCHOR:idempotency-rules -->
<!-- ANCHOR:conflict-exits -->
## 8. CONFLICT EXITS

Fail closed when any of the following is true:
- The chosen host anchor is missing.
- Duplicate DR seed markers are present.
- Duplicate generated fence markers are present.
- Human edits are detected inside the machine-owned generated block.
- The generated block checksum drifts or an explicit manual-edit marker is present inside the existing fence.
- Pre-init append intent conflicts with the semantic purpose of the host section.

### Exit Behavior
1. Emit `spec_mutation_conflict`.
2. Keep existing `spec.md` content unchanged.
3. Stop before LOOP or before SAVE, depending on the phase.
4. Surface the exact blocking reason to the operator.

No silent merge, overwrite, or best-effort repair is allowed on a conflict path.

---
<!-- /ANCHOR:conflict-exits -->
