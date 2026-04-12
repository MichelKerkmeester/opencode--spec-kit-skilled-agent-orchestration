---
title: "Tasks: Phase 2 — Single-Owner Metadata Fixes"
description: "Execution tasks for PR-3 and PR-4 in Phase 2. Task format: T2xx [P?] Description."
trigger_phrases:
  - "phase 2 tasks"
  - "single-owner metadata tasks"
  - "pr-3 tasks"
  - "pr-4 tasks"
importance_tier: important
contextType: planning
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/002-single-owner-metadata"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Phase 2 — Single-Owner Metadata Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T2xx [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] **T201** Identify the D4 `importance_tier` SSOT owner inside the PR-3 owner set and document the deferral contract in implementation notes.
  Rationale: PR-3 freezes the D4 owner set to `frontmatter-migration.ts:1112-1183`, `session-extractor.ts:607-612`, and `post-save-review.ts:279-289`, while the research says the repair should be a writer-synchronization and SSOT change first. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1156-1156] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:191-192]

- [ ] **T202** Modify `frontmatter-migration.ts:1112-1183` so the managed-frontmatter rewrite emits both frontmatter and bottom metadata tier from the same resolved value.
  Scope anchor: D4 remediation row and D4 fix proposal. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:125-128]

- [ ] **T203** Modify `session-extractor.ts:607-612` to surface the authoritative resolved `importanceTier` contract used by Phase 2.
  Scope anchor: PR-3 owner map plus the phase-level SSOT decision. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1156-1156]

- [ ] **T204** Modify `post-save-review.ts:279-289` to assert on frontmatter-vs-metadata drift instead of checking payload-vs-frontmatter only.
  Scope anchor: D4 owner summary and reviewer blind-spot finding. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:67-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-005.md:15-16]

- [ ] **T205 [P]** Install the F-AC4 fixture and run `generate-context.js --json` against it to prove frontmatter ↔ metadata parity after the PR-3 changes.
  Scope anchor: F-AC4 verification route. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:83-83]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T206** Design the `≤10 LOC` provenance-only insertion at `workflow.ts:658-659,877-923`.
  Scope anchor: PR-4 owner map and the iteration-18 accepted patch shape. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1157-1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:197-198]

- [ ] **T207** Build the stubbed git seam required for F-AC6 deterministic replay.
  Scope anchor: testing recommendation that D7 must use a harness-controlled seam instead of live repo state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1518-1518]

- [ ] **T208** Install the F-AC6 fixture and verify JSON-mode provenance population without summary contamination.
  Scope anchor: D7 verification and explicit rejection of wholesale capture-branch reuse. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:86-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1538-1538]

- [ ] **T209** Confirm the provenance patch remains within the accepted tiny-patch bound using `git diff --stat`.
  Scope anchor: iteration-18 reduction to a six-line insertion and parent requirement that PR-4 stay `≤10 LOC`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:197-198] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:78-78]

- [ ] **T210** Run a no-regression check proving JSON-mode summary content remains unchanged after the D7 patch.
  Scope anchor: provenance-only, no-summary-mutation requirement. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:67-70]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T211** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/002-single-owner-metadata --strict`.
  Scope anchor: each phase must validate independently before integration. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]

- [ ] **T212** Capture evidence that F-AC4 and F-AC6 are both green and attach the reviewer drift assertion result.
  Scope anchor: Phase 2 → Phase 3 handoff gate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:198-198]

- [ ] **T213** Draft release-note language that Phase 2 fixed D4 and D7, with D7 called out as JSON-mode-specific.
  Scope anchor: operational recommendation for release notes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1531-1531]

- [ ] **T214** Save or refresh memory context so the importance-tier SSOT decision is documented for later phases.
  Scope anchor: phase-level handoff hygiene after a single-owner decision. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]

- [ ] **T215** Update the parent `PHASE DOCUMENTATION MAP` status row for `002-single-owner-metadata` from `Pending` to `Complete` after all phase evidence is attached.
  Scope anchor: parent packet owns aggregate progress tracking. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:177-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-188]
<!-- /ANCHOR:phase-3 -->

---

### Task Dependencies

| Task | Depends On | Reason |
|------|------------|--------|
| `T202` | `T201` | Serializer work should follow the explicit D4 owner decision. |
| `T204` | `T202`, `T203` | Reviewer drift assertions should lock to the final serialized shape. |
| `T205` | `T202`, `T204` | F-AC4 is not meaningful until serialization and review are both updated. |
| `T206` | `T205` | PR-4 follows PR-3 in the parent dependency sequence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1164-1164] |
| `T208` | `T206`, `T207` | F-AC6 needs both the patch and the stubbed seam. |
| `T215` | `T211`, `T212`, `T213`, `T214` | Parent status changes only after phase evidence is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-188] |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All `T201-T215` tasks are marked `[x]`
- [ ] F-AC4 evidence attached
- [ ] F-AC6 evidence attached
- [ ] Reviewer drift assertion is installed
- [ ] `validate.sh` exit code is `0`
- [ ] Parent phase-map roll-up completed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent Research**: `../research/research.md`
<!-- /ANCHOR:cross-refs -->

---

### Definition of Done

- [ ] PR-3 lands as a single-owner metadata synchronization change, not a scattered cleanup.
- [ ] PR-4 lands as a provenance-only insertion with deterministic seam-backed proof.
- [ ] No later-phase work is required to explain or justify the Phase 2 implementation.
- [ ] Child-doc evidence is sufficient for the parent Phase 2 -> Phase 3 handoff row. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:198-199]

---

### Verification Commands

| Command | Purpose |
|---------|---------|
| `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<fixture>' <spec-folder>` | Replay F-AC4 through the JSON-mode save path after the PR-3 changes. |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/002-single-owner-metadata --strict` | Validate the child folder before roll-up. |
| `git diff --stat` | Prove the D7 patch stayed within the accepted `≤10 LOC` bound. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:197-198] |

These commands are execution-time references only. They do not expand phase scope beyond PR-3 and PR-4.
