---
title: "Implementat [skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification/plan]"
description: "Plan for phase 004 under packet 041, focused on promotion-path proof and second-target repeatability."
trigger_phrases:
  - "recursive agent promotion verification plan"
  - "041 phase 004 plan"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/004-sk-recursive-agent-promotion-verification"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Recursive Agent Promotion Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs, JSON evidence, Node.js verification scripts |
| **Framework** | `sk-improve-agent` + `sk-doc` + system-spec-kit validation |
| **Storage** | Phase-local `improvement/` evidence plus root packet docs |
| **Testing** | `score-candidate.cjs`, `run-benchmark.cjs`, `promote-candidate.cjs`, `rollback-candidate.cjs`, `validate_document.py`, `validate.sh --strict` |

### Overview
This phase proves that the agent-improver system can exercise a real guarded promotion path without leaving the canonical target mutated at the end of the run. It also closes the missing repeatability evidence for `context-prime`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing promotion and rollback scripts are present
- [x] Existing handover and context-prime benchmark outputs are available as reusable baseline artifacts
- [x] The parent packet already defines continuation through a new `004-*` phase

### Definition of Done
- [x] A `candidate-better` handover score exists in the phase-local runtime
- [x] Both target profiles have repeatability artifacts in phase `004`
- [x] Promotion and rollback artifacts exist and the restored file matches the backup
- [x] Root `041` and phase `004` pass strict validation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification phase with packet-local runtime evidence

### Key Components
- **Scorer calibration**: a narrow handover scoring tweak in `score-candidate.cjs`
- **Phase-local runtime**: `improvement/` config, manifest, candidate, benchmarks, archive, promotion, and rollback artifacts
- **Canonical target under test**: `.opencode/agent/handover.md`, promoted briefly and then restored
- **Second-target repeatability evidence**: `context-prime` benchmark reruns plus `repeatability.json`

### Data Flow
Create a phase-local runtime, score a stronger handover candidate against the current canonical baseline, generate repeatability artifacts for both profiles, run guarded promotion, validate the promoted target, roll it back to the backup, then update the packet hierarchy to record the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the new `004-sk-improve-agent-promotion-verification/` phase folder
- [x] Create a phase-local `improvement/` runtime rooted in this phase
- [x] Copy the needed manifest, charter, strategy, and baseline benchmark outputs into the phase-local runtime

### Phase 2: Verification Runtime

- [x] Calibrate the handover scorer narrowly so a structurally stronger candidate can win
- [x] Create a phase-local handover candidate for promotion verification
- [x] Generate handover and context-prime repeatability artifacts in the new phase

### Phase 3: Guarded Promotion Proof

- [x] Score the handover candidate as `candidate-better`
- [x] Promote the candidate through the shipped guardrails
- [x] Validate the promoted handover target
- [x] Roll back to the archived backup and confirm the restored file matches it

### Phase 4: Packet Sync

- [x] Update parent packet `041` to include phase `004`
- [x] Add the new phase to `.opencode/specs/descriptions.json`
- [x] Re-run the packet validators and supporting document checks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Prompt scoring | Handover candidate vs canonical baseline | `node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` |
| Benchmark repeatability | Handover and context-prime baseline outputs | `node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` plus repeatability JSON generation |
| Promotion path | Canonical handover target | `promote-candidate.cjs` and `rollback-candidate.cjs` |
| Validation | Promoted handover file and candidate file | `validate_document.py --type agent` |
| Packet Validation | Root `041` and phase `004` | `validate.sh --strict` |
| Parsing | Registry metadata and phase evidence JSON | `python3` JSON parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `score-candidate.cjs` | Internal | Green | No truthful `candidate-better` artifact can be produced |
| `promote-candidate.cjs` and `rollback-candidate.cjs` | Internal | Green | The guarded control path cannot be proven |
| Phase `002` baseline benchmark outputs | Internal | Green | Phase-local repeatability setup would need to be rebuilt from scratch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Promotion succeeds but rollback proof fails, or the canonical target cannot be shown to match the backup.
- **Procedure**: Restore from the archived backup immediately, compare the restored file directly to the backup, and keep the phase open until the no-net-drift proof is captured.

Future agent-improver work should continue as `005-*` and later child phases under `041-sk-improve-agent-loop/`.
<!-- /ANCHOR:rollback -->

---
