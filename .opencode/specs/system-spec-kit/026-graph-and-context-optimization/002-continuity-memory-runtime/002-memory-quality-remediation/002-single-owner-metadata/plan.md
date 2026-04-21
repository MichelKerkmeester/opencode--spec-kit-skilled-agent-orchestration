---
title: "Implementation Plan: Phase 2 — Single-Owner Metadata Fixes"
description: "Execution plan for PR-3 importance-tier SSOT consolidation and PR-4 provenance-only JSON-mode enrichment, using the parent research packet as the implementation authority."
trigger_phrases:
  - "phase 2 implementation plan"
  - "pr-3"
  - "pr-4"
  - "importance-tier ssot plan"
  - "provenance-only injection plan"
importance_tier: important
contextType: planning
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/002-single-owner-metadata"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Phase 2 — Single-Owner Metadata Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This phase implements the P1 metadata corrections defined by PR-3 and PR-4 in the parent PR train. PR-3 repairs D4 by collapsing the importance-tier write surface into one authoritative resolver plus deferring consumers, and PR-4 repairs D7 by adding the already-approved provenance-only JSON-mode insertion in `workflow.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1157]

The plan deliberately keeps both fixes small. D4 is framed as a writer-synchronization problem rather than a broad metadata cleanup, and D7 is framed as a tiny workflow patch rather than a capture-mode redesign. That scope discipline is the main safety mechanism for the phase. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198]

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript scripts under `.opencode/skill/system-spec-kit/scripts/` |
| **Primary Runtime** | `generate-context.js` JSON-mode pipeline plus managed-frontmatter rewrite and post-save review |
| **Testing** | Fixture replay, targeted unit coverage, stubbed git seam, `validate.sh` |
| **Phase Exit** | F-AC4 green, F-AC6 green, reviewer drift assertion installed, phase docs validate cleanly |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] PR-3 and PR-4 are the only active implementation scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1157]
- [ ] The D4 owner decision is documented as one resolver plus consumers. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]
- [ ] F-AC4 and F-AC6 fixtures are identified before code edits begin. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518]

### Definition of Done

- [ ] F-AC4 green
- [ ] F-AC6 green with stubbed git seam
- [ ] Reviewer drift assertion installed
- [ ] Provenance patch verified at `≤10 LOC`
- [ ] Child folder `validate.sh` exit code `0`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-authority metadata resolution with consumer-only serialization and review.

### Key Components

- **Tier Resolver Surface**: `session-extractor.ts:607-612` becomes the phase’s canonical `importanceTier` source. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156]
- **Serializer Surface**: `frontmatter-migration.ts:1112-1183` emits both rendered tier locations from the resolved value. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83]
- **Reviewer Surface**: `post-save-review.ts:279-289` verifies that both rendered locations stay in sync. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67]
- **Provenance Injection Surface**: `workflow.ts:658-659,877-923` receives the D7 JSON-mode-only insertion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1157-1157]

### Data Flow

JSON payload -> tier resolution -> frontmatter/metadata serialization -> post-save drift assertion, while JSON-mode provenance flows through the tiny `workflow.ts` insertion that calls the existing git extractor and copies only provenance fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1490-1492]
<!-- /ANCHOR:architecture -->

---

### Technical Approach

### D4 owner model

The plan treats Phase 2 as a single-owner consolidation pass. The parent research says D4 is a two-writer defect and recommends fixing the authoritative writer relationship first, with reviewer repair second. Within the PR-3 owner set, this plan assigns `session-extractor.ts:607-612` as the canonical importance-tier resolver, because that file is the only PR-3 surface dedicated to producing a tier value rather than rewriting an already-rendered document or reviewing a saved file. `frontmatter-migration.ts` becomes an emission consumer of the resolved tier, and `post-save-review.ts` becomes a detection consumer. This is a planning decision derived from the research owner map and architecture notes, not a claim that the code already behaves that way. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1471-1474]

The resulting D4 data flow should be:

1. `session-extractor.ts` resolves the authoritative tier.
2. `frontmatter-migration.ts` serializes both frontmatter and bottom metadata from that resolved tier.
3. `post-save-review.ts` asserts that the two serialized locations still agree after save.

That sequence is aligned with the research statement that the repair should land as a writer synchronization and SSOT extraction first, rather than as scattered patches across every tier mention site. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1509-1509]

### D7 patch model

The D7 technical approach is fixed by the parent packet: do not reuse `enrichCapturedSessionData()` wholesale; call the existing git extractor from the JSON-mode path and copy only the four provenance fields that the template already consumes. The accepted patch shape is a six-line insertion after Step 3.5, and the plan should preserve that narrowness unless live implementation proves an unavoidable minimal deviation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:43-58]

The D7 proof surface is equally fixed: F-AC6 must run through a stubbed git seam. The plan must not use live repository state as its correctness oracle because the parent testing recommendations explicitly require a harness-controlled seam for this acceptance criterion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518]

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: PR-3 — D4 importance-tier SSOT

**Goal**: eliminate the two-writer tier model and make every rendered `importance_tier` come from one resolved value. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1471-1474]

**Strategy**:

1. Freeze the canonical tier contract in `session-extractor.ts:607-612`. The implementation should make this surface the owner of resolved tier selection for the phase’s execution path so later file-level consumers do not recalculate the value from different heuristics. This owner choice is mandated by the child packet, not claimed as existing code truth. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156]
2. Update `frontmatter-migration.ts:1112-1183` so the managed-frontmatter rewrite emits both the top frontmatter tier and the bottom metadata tier from the same resolved value instead of rewriting only frontmatter. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:125-128]
3. Upgrade `post-save-review.ts:279-289` from payload-vs-frontmatter-only checking to an explicit frontmatter-vs-metadata drift assertion so the saved file cannot silently preserve a split-tier state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:205-205]
4. Install the F-AC4 divergent fixture and replay it through `generate-context.js --json` so the implementation proves both serialization parity and reviewer detection. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83]

**Deferral contract**:

- `session-extractor.ts` owns resolution.
- `frontmatter-migration.ts` owns serialization from the resolved value.
- `post-save-review.ts` owns detection if serialized outputs drift.

The important part is that neither consumer becomes a second independent authority for tier inference. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]

### Phase 2: PR-4 — D7 provenance-only injection

**Goal**: fill `head_ref`, `commit_ref`, `repository_state`, and detached-HEAD state for JSON-mode saves without reusing the wider capture-enrichment path. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:86-86] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1490-1492]

**Strategy**:

1. Keep the existing capture-mode gate and Step 3.5 flow intact; do not back-propagate JSON mode into `enrichCapturedSessionData()`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:73-73] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538]
2. Add the already-accepted `!isCapturedSessionMode` insertion adjacent to Step 3.5 so JSON-mode saves call the existing git extractor and copy only provenance fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:43-58]
3. Preserve the extractor’s existing degradation contract for detached HEAD, shallow history, and non-git environments instead of reimplementing git shell logic in `workflow.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:60-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:83-83]
4. Build and exercise the stubbed git seam so F-AC6 is deterministic and captures a no-summary-contamination assertion at the same time. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:67-70]

**Explicit rejection**:

The plan must not reuse `enrichCapturedSessionData()` wholesale for JSON mode. The research rejected that option because it would merge spec-folder observations, decisions, file descriptions, trigger phrases, recent context, and summary text, which is outside the defect and risks content contamination. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:67-70]

### Phase 3: Validation + Roll-up

Use the two acceptance fixtures, patch-size proof, and child-folder validation as the only completion gate. Parent phase-map status changes happen after this phase-local evidence is complete, not before. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
<!-- /ANCHOR:phases -->

---

### File:Line Change List

| PR | File / Lines | Change | Why |
|----|--------------|--------|-----|
| PR-3 | `scripts/extractors/session-extractor.ts:607-612` | Define or surface the authoritative resolved tier for the phase’s SSOT contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] | Keeps resolution separate from later serialization and review. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] |
| PR-3 | `scripts/lib/frontmatter-migration.ts:1112-1183` | Emit frontmatter and bottom metadata tier from the same resolved value. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] | Removes the frontmatter-only rewrite shape that caused D4. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:67-67] |
| PR-3 | `scripts/core/post-save-review.ts:279-289` | Add direct frontmatter-vs-metadata drift assertion. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] | Converts reviewer coverage from advisory payload-vs-frontmatter only into the phase’s required parity check. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:15-16] |
| PR-4 | `scripts/core/workflow.ts:658-659` | Preserve capture-mode gate and add JSON-mode-only provenance path beside it. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:54-54] | Fixes the gate-placement bug without rewriting capture behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-007.md:6-11] |
| PR-4 | `scripts/core/workflow.ts:877-923` | Install the ≤10-LOC provenance-only insertion after Step 3.5. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1157-1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198] | Fills git provenance for JSON mode while preserving authored summary text. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:70-78] |
| PR-4 | F-AC6 harness | Add stubbed git seam and deterministic replay coverage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] | Prevents live repo state from becoming the correctness oracle. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-018.md:72-78] |

---

### Order of Operations

1. Confirm the child spec, plan, tasks, and checklist are aligned with the parent packet and validate cleanly before code work begins. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
2. Implement the D4 owner decision first: lock the authoritative tier resolver surface, then make the managed-frontmatter serializer consume that resolved value. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192]
3. Add the reviewer drift assertion after the serializer change so F-AC4 can prove both serialization and detection in one pass. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83]
4. Install the F-AC4 divergent fixture and run `generate-context.js --json` against it before moving to D7, because PR-3 owns the single-writer contract that later reviewer evidence depends on. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-198]
5. Implement the D7 provenance-only insertion exactly next to the capture-only enrichment branch, keeping the patch within the already accepted tiny shape. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198]
6. Build the stubbed git seam and run F-AC6 before any packet-level roll-up, because live git state is not an acceptable verification substitute. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518]
7. Run phase-local validation and then update the parent phase-map status only after all phase checks are green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]

This order intentionally keeps D4 before D7 because the parent dependency DAG sequences `PR-3 → PR-4`, and the research explicitly recommends preserving that staged rollout so D4, D7, and D5 do not drag refactor work forward prematurely. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1164-1164] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1523]

---

### Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| `frontmatter-migration.ts` remains a second authority instead of a consumer | High | Lock the owner contract in the plan first and verify parity with F-AC4 rather than treating the serializer as independent logic. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:191-192] |
| Reviewer patch only checks payload-vs-frontmatter again and misses metadata-block drift | High | Require an explicit frontmatter-vs-metadata assertion and make it part of F-AC4 evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-005.md:15-16] |
| D7 patch expands into capture-mode behavior reuse | High | Keep the implementation pinned to the provenance-only insertion and reject wholesale `enrichCapturedSessionData()` reuse. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1538-1538] |
| D7 verification passes only because of local repo state | Medium | Use the required stubbed git seam for F-AC6 and treat live state as diagnostic only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] |
| JSON-mode fix regresses capture mode | Medium | Preserve the existing capture gate and add the new path only for `!isCapturedSessionMode`; run a no-regression sanity check on JSON-mode path expectations. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-025.md:31-31] |
| Phase scope expands into PR-5/PR-6/PR-9 work | Medium | Treat the PR train as the hard boundary and reject any implementation detail that requires later-phase refactors to ship. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1162] |

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### F-AC4

- Create or install the divergent-tier fixture that reproduces a frontmatter-vs-metadata split.
- Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` or the equivalent fixture harness path.
- Assert that the saved file’s frontmatter and bottom `## MEMORY METADATA` block agree on `importance_tier`.
- Assert that the post-save reviewer emits the new drift check when the two locations are forced apart. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:83-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:198-205]

### F-AC6

- Add the stubbed git seam so `extractGitContext()` output can be controlled by the harness.
- Replay the JSON-mode save path through the `workflow.ts` insertion.
- Assert `head_ref`, `commit_ref`, and `repository_state` populate from the stubbed seam.
- Assert authored summary content is unchanged.
- Confirm the patch size stays within the research-approved `≤10 LOC` bound via `git diff --stat`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:197-198]

### Phase validation

- Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/002-single-owner-metadata --strict`.
- Reconfirm child-doc synchronization after implementation.
- Record evidence for parent phase-map roll-up once the phase checklist is fully green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| PR-3 owner map | Internal | Ready | Without it, the phase cannot freeze the D4 authority split. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1156-1156] |
| PR-4 owner map | Internal | Ready | Without it, the provenance insertion could drift out of the accepted tiny patch surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1157-1157] |
| Stubbed git seam | Test harness | Required | Without it, F-AC6 becomes nondeterministic. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1518-1518] |
| Child-folder validation | Process | Required | Without independent validation, the parent handoff rule is not met. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190] |
<!-- /ANCHOR:dependencies -->

---

## 7. ROLLBACK PLAN

Phase 2 is a bounded single-owner metadata pass inside the 9-PR train. It should land after the P0 foundation phase and before the behavior-sensitive D3/D2 work, exactly as the parent PR train specifies. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1154-1159]

**Roll-forward criteria**:

- F-AC4 green
- F-AC6 green
- Reviewer drift assertion installed
- `validate.sh` exit 0 for the child folder
- Parent phase map updated from `Pending` to `Complete` after the implementation evidence is attached [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-198]

**Rollback triggers**:

- The D4 change still permits two competing tier authorities
- The D7 patch grows beyond the accepted tiny insertion
- JSON-mode provenance fix mutates summary or observation content
- F-AC6 depends on live git state instead of the stubbed seam

<!-- ANCHOR:rollback -->
### Rollback Plan

1. Revert the D4 serializer and reviewer changes together if F-AC4 still shows split-tier output after the owner-lock pass.
2. Revert the D7 insertion immediately if summary or observation content mutates or the patch cannot stay within the accepted `≤10 LOC` bound.
3. Hold the parent phase-map update until the child folder validates cleanly and both fixtures are green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
<!-- /ANCHOR:rollback -->

**Post-phase handoff**:

Once Phase 2 closes, Phase 3 may start on the D3/D2 sanitization-precedence work using the parent handoff gate. Phase 2 should not carry any open-ended SaveMode refactor or reviewer-wide guardrail work forward. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-199] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162]
