---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Reverse Parent Research/Review Folder Placement"
description: "Verification for the local-owner deep-loop rollback, repo-wide packet migration, and phase-002 rebasing."
trigger_phrases:
  - "013/001 checklist"
  - "reverse parent folders checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-sk-deep-refinement/001-reverse-parent-research-review-folders"
    last_updated_at: "2026-04-24T14:30:20+02:00"
    last_updated_by: "codex"
    recent_action: "Recorded verification evidence for rollback, migration, and packet closure"
    next_safe_action: "Phase 002 can proceed from the restored local-owner contract"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-sk-deep-refinement/001-reverse-parent-research-review-folders/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:reverse-parent-research-review-folders-checklist"
      session_id: "reverse-parent-research-review-folders-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Reverse Parent Research/Review Folder Placement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [Evidence: `spec.md` sections 3-6]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [Evidence: `plan.md` sections 3-5]
- [x] CHK-003 [P1] Historical origin packet and follow-up commits identified [Evidence: `spec.md` Phase Context + `resource-map.md` rollback evidence notes + commit references `81455a4e0f` and `889344059e`]
- [x] CHK-004 [P1] Misplaced packet inventory captured before migration [Evidence: `/tmp/deep-loop-migration-apply.json` recorded `discovered: 86` before relocation]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `review-research-paths.cjs` resolves root, child, nested, and rerun cases to the restored local-owner contract [Evidence: direct Node assertion pass verified root research/review, child research/review, nested review, and rerun reuse cases]
- [x] CHK-011 [P0] Reducers and YAML assets write only to the resolved `{artifact_dir}` [Evidence: reducer reads in `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` plus command YAML paths in `.opencode/command/spec_kit/assets/spec_kit_deep-*_*.yaml`]
- [x] CHK-012 [P1] Live docs, mirrors, and shared assets match the same restored contract [Evidence: updated skill docs, READMEs, mirrors, folder structure reference, and `review_mode_contract.yaml`; direct Node assertion pass verified these surfaces]
- [x] CHK-013 [P1] Migration skips conflicts safely instead of overwriting packet data [Evidence: migration script checks destination existence before rename; applied run reported `conflictCount: 0`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Root-spec deep-research resolves to root-local `research/` [Evidence: direct Node assertion pass on `resolveArtifactRoot(rootSpec, 'research')`]
- [x] CHK-021 [P0] Root-spec deep-review resolves to root-local `review/` [Evidence: direct Node assertion pass on `resolveArtifactRoot(rootSpec, 'review')`]
- [x] CHK-022 [P0] Child-phase and nested runs resolve to local-owner packet folders [Evidence: direct Node assertion pass verified child review/research and nested review packet roots]
- [x] CHK-023 [P0] Existing packet reuse prevents accidental sibling allocation on rerun [Evidence: direct Node assertion pass created an existing child packet and verified resolver reuse]
- [x] CHK-024 [P0] Post-migration scan shows no misplaced child packets under ancestor/root packet folders [Evidence: `/tmp/deep-loop-migration-post.json` reported `remainingMisplacedCount: 0`]
- [x] CHK-025 [P1] Root-owned packets remain in place after migration [Evidence: applied migration moved no packet whose owner matched the container spec; root packet `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/008-runtime-executor-hardening-pt-01` still exists]
- [x] CHK-026 [P1] Phase 002 docs reflect the restored local-owner contract [Evidence: updated `002-resource-map-deep-loop-integration/{spec,plan,tasks,checklist}.md`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Migration does not write outside repo spec roots [Evidence: migration script roots itself at detected specs roots and only moves packets under `.opencode/specs` or `specs`]
- [x] CHK-031 [P0] No packet move overwrites an existing conflicting destination [Evidence: destination existence check plus applied run `conflictCount: 0`]
- [x] CHK-032 [P1] Ownership derivation comes from stored config/state metadata, not guessed folder names alone [Evidence: migration script reads `deep-research-config.json`, `deep-review-config.json`, or JSONL state records via `readPacketOwner()`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Phase 001 packet docs are synchronized [Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `resource-map.md`, and `implementation-summary.md` now all reflect the completed rollback and migration state]
- [x] CHK-041 [P1] `resource-map.md` exists as the rollback ledger for this packet [Evidence: `resource-map.md`]
- [x] CHK-042 [P1] `implementation-summary.md` records migration totals, evidence trail, and verification [Evidence: `implementation-summary.md` sections What Was Built, Verification, and Key Decisions]
- [x] CHK-043 [P2] Historical relocation notes added only where navigation would otherwise break [Evidence: migration rewrote 131 live canonical references while intentionally skipping `iterations/`, `prompts/`, and `logs`; no extra historical note files were needed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Misplaced child packets moved into the owning phase or sub-phase local `research/` or `review/` folder [Evidence: applied migration moved 86 child-owned packets and post-scan found 0 misplaced packets]
- [x] CHK-051 [P1] Packet names and `-pt-NN` identities preserved during migration [Evidence: migration destinations kept each packet's original directory name; direct Node assertion pass verified `destination.endsWith('/{mode}/{packetName}')`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-24
<!-- /ANCHOR:summary -->
