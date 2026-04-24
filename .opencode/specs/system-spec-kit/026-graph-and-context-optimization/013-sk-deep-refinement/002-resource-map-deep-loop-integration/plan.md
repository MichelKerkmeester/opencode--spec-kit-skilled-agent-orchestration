---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
title: "Implementation Plan: Resource Map Deep-Loop Integration"
description: "Author a shared evidence extractor, wire it into both deep-loop reducers and YAML workflows at convergence, update SKILL + command surfaces, and add vitest coverage."
trigger_phrases:
  - "026/013 deep loop plan"
  - "deep loop resource map plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-resource-map-deep-loop-integration"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan"
    next_safe_action: "Begin Phase 1"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Resource Map Deep-Loop Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS Node (shared extractor) + TypeScript (vitest) + YAML (workflows) + Markdown (docs) |
| **Framework** | system-spec-kit skill system + sk-deep-review + sk-deep-research |
| **Storage** | Filesystem only — reads iteration deltas, writes resource-map.md |
| **Testing** | Vitest snapshot coverage for the extractor; manual run of `/spec_kit:deep-research :auto` and `/spec_kit:deep-review :auto` on a test packet for end-to-end verification |

### Overview

Build a shared evidence extractor under `.opencode/skill/system-spec-kit/scripts/resource-map/` that accepts an array of normalized per-iteration delta objects and emits a filled `resource-map.md` string. Wire the extractor into the convergence step of both `sk-deep-review/scripts/reduce-state.cjs` and `sk-deep-research/scripts/reduce-state.cjs`. Extend the four YAML workflow assets to expose an opt-out flag. Add SKILL/command/references doc updates and feature-catalog + playbook entries. No change to convergence math, LEAF agent contracts, or iteration semantics.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 012 template is landed and tested (prerequisite).
- [x] Delta shapes for review and research are documented (inspect existing `deltas/delta-NN.json` in any completed loop).
- [x] `resolveArtifactRoot()` signature known.

### Definition of Done

- [ ] Vitest snapshot coverage for extractor (both shapes) is green.
- [ ] Manual `/spec_kit:deep-review :auto` on a fixture packet emits a non-empty `resource-map.md` with correct findings counts.
- [ ] Manual `/spec_kit:deep-research :auto` on a fixture packet emits a non-empty `resource-map.md` with correct citation counts.
- [ ] `--no-resource-map` flag cleanly skips emission.
- [ ] `validate.sh --strict` on this packet exits 0.
- [ ] mcp_server typecheck + focused vitest stay green.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reuse-don't-rescan: convergence-time aggregation of evidence already captured in per-iteration delta JSON. Single shared extractor with shape adapters. Emission is a dedicated post-convergence step (never inside the per-iteration reducer).

### Key Components

- **`extract-from-evidence.cjs` (new)**: pure CJS module exporting `emitResourceMap({ shape, deltas, packet, scope, createdAt }) -> string`. Takes normalized evidence, categorizes each path via the phase-012 ten-category taxonomy, computes per-file findings/citation counts, renders the template.
- **`reduce-state.cjs` (sk-deep-review)**: convergence branch calls the extractor with `shape: 'review'` and writes to `{review_root}/resource-map.md`.
- **`reduce-state.cjs` (sk-deep-research)**: convergence branch calls the extractor with `shape: 'research'` and writes to the resolved local-owner `{artifact_dir}/resource-map.md`.
- **YAML `resource_map` config block**: adds `resource_map: { emit: true }` default under `config:` in all four YAML workflow assets.
- **`--no-resource-map` CLI flag**: passed through by the command MD files to the YAML config at dispatch time.
- **Test fixtures**: synthetic delta arrays covering both shapes, with expected map snapshots.

### Data Flow

```
iteration 01..NN deltas (JSON) ──► reduce-state.cjs (per-iter JSONL append)
                                        │
                         convergence detected │
                                        ▼
                         adapter: normalize delta shape
                                        ▼
                         extract-from-evidence.cjs
                                        ▼
                         resource-map.md written to resolved {artifact_dir}/
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inspect completed deltas from packet 012's review loop (or any prior loop) to confirm delta shape fields.
- [ ] Confirm `resolveArtifactRoot()` signature for review vs research.
- [ ] Decide extractor folder location (scripts/resource-map/ vs scripts/memory/).
- [ ] Draft normalized evidence type shared by both skills.

### Phase 2: Core Implementation
- [ ] Write `extract-from-evidence.cjs` with both shape adapters.
- [ ] Write `scripts/resource-map/README.md` documenting the input/output contract.
- [ ] Write vitest fixtures + snapshots under `scripts/tests/resource-map-extractor.vitest.ts`.
- [ ] Wire `sk-deep-review/scripts/reduce-state.cjs` convergence branch to call the extractor.
- [ ] Wire `sk-deep-research/scripts/reduce-state.cjs` convergence branch to call the extractor.
- [ ] Update all four YAML assets with the `resource_map` config block + post-convergence step.
- [ ] Update SKILL.md × 2 with the new output surface.
- [ ] Update command MD × 2 with a brief mention.
- [ ] Update convergence.md references × 2.
- [ ] Create feature_catalog entries × 2 (neighbor-format).
- [ ] Create manual_testing_playbook entries × 2 (neighbor-format).

### Phase 3: Verification
- [ ] Run the vitest: `npx vitest run tests/resource-map-extractor.vitest.ts` → exit 0.
- [ ] Run `cd mcp_server && npm run typecheck` → exit 0 (sanity).
- [ ] Manual dispatch of `/spec_kit:deep-review :auto` on a tiny fixture packet; confirm map output shape.
- [ ] Manual dispatch of `/spec_kit:deep-research :auto` on a tiny fixture packet; confirm map output shape.
- [ ] Test opt-out: `/spec_kit:deep-review :auto --no-resource-map` produces no map file.
- [ ] `bash validate.sh --strict` on this packet → exit 0.
- [ ] Grep every updated surface for `resource-map.md` — coverage check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Extractor shape adapters + categorization | Vitest (snapshot) |
| Integration | End-to-end dispatch of each deep-loop command | Manual run on a fixture packet |
| Manual | Opt-out, edge cases (zero iterations, max-iterations exhaustion) | Bash + visual inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 012 `resource-map.md` template | Internal | Green | Cannot land without stable template shape |
| `resolveArtifactRoot()` helper | Internal | Green | Required to locate convergence write target |
| Existing `reduce-state.cjs` convergence branch | Internal | Green | Extractor hooks in here |
| cli-copilot / cli-codex executor kinds | External | Green | Needed only for integration tests (optional) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: extractor produces malformed maps; YAML changes break existing loops; opt-out flag fails.
- **Procedure**: `git restore scripts/resource-map/ sk-deep-review/ sk-deep-research/ command/spec_kit/assets/spec_kit_deep-research_*.yaml command/spec_kit/assets/spec_kit_deep-review_*.yaml command/spec_kit/deep-research.md command/spec_kit/deep-review.md`. Remove phase 013 packet folder.
- **No data migration**, no schema change, no DB impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 rollback complete + phase 012 landed | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Core Implementation | Medium | 4-6 hours (extractor + tests + 14 surface edits) |
| Verification | Low | 1 hour |
| **Total** | | **~6-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Snapshot vitest passes before merge.
- [ ] Dry-run convergence on fixture packet produces expected map.
- [ ] Opt-out flag path exercised.

### Rollback Procedure
1. `git restore` all files listed under `Files to Change` in spec.md.
2. Remove the phase 013 folder.
3. No redeploy needed (content-only + script additions).
4. Notify no one — this is an additive feature that users can opt into.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
