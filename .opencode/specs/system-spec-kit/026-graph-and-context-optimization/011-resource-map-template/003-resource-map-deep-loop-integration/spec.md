---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
title: "Feature Specification: Resource Map Integration for sk-deep-review and sk-deep-research"
description: "Teach the two autonomous deep-loop skills to emit a resource-map.md at convergence, aggregated from per-iteration evidence already captured in delta files. Review version carries findings counts; research version carries citation counts. Zero new scan cost; high reviewer value."
trigger_phrases:
  - "026/013 resource map deep loop"
  - "resource map deep-review integration"
  - "resource map deep-research integration"
  - "convergence-time resource map"
  - "iteration evidence aggregation"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration"
    last_updated_at: "2026-04-24T14:30:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Shipped resource-map integration + sk-doc DQI alignment + tree sync"
    next_safe_action: "Monitor first autonomous run carrying resource-map.md"
    blockers: []
    completion_pct: 100
    status: "complete"
    open_questions: []
    answered_questions:
      - "Emission happens at convergence (not per-iteration) so partial state never shows misleading coverage."
      - "Review map carries findings counts; research map carries citation counts — distinct shapes under one template."
      - "Shared extractor lives under scripts/resource-map/ and both skills call it from reduce-state.cjs."
      - "resource_map_present persists in deep-research-config.json and deep-review-config.json so iterations read the flag without re-detecting."
      - "{artifact_dir} is the canonical resolver-output variable across agent definitions, READMEs, state schemas, dashboards, command YAMLs — replaces mixed {spec_folder}/research|review|{review_root}|{research_root}."
      - "Spec packet files (spec/plan/tasks/checklist) stay out of sk-doc DQI lift per loose-enforcement rule for in-progress spec docs."
---
# Feature Specification: Resource Map Integration for sk-deep-review and sk-deep-research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 013 of 013 |
| **Predecessor** | 001-reverse-parent-research-review-folders |
| **Successor** | None |
| **Handoff Criteria** | Shared evidence extractor lands under `scripts/resource-map/`; both `sk-deep-review/scripts/reduce-state.cjs` and `sk-deep-research/scripts/reduce-state.cjs` invoke it at convergence; both YAML workflows (auto + confirm) include the emission step; both SKILL.md surfaces document the new output; both feature_catalog and manual_testing_playbook gain entries; typecheck clean; vitests pass; validate.sh --strict on this packet exits 0. |
<!-- /ANCHOR:metadata -->

### Phase Context

This is the second child packet under `011-resource-map-template`. Phase 001 restores the local-owner artifact contract for deep-research and deep-review packets. This phase builds on that restored contract by making the two autonomous deep-loop skills (`sk-deep-research` and `sk-deep-review`) emit a filled `resource-map.md` at convergence beside the actual resolved packet artifacts. The aggregated map carries dimension-specific signals: review maps include P0/P1/P2 findings-per-file counts; research maps include citation counts per file. Both shapes share the same ten-category skeleton so reviewers can read them without learning two templates.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Autonomous deep-loop runs produce rich evidence across 5–15 iterations, but the output surface is split between iteration markdown files (dense, per-cycle) and `research.md` or `review-report.md` (narrative synthesis). Reviewers still have no flat, scannable "what did this loop actually touch" view. Re-running the 005/009 path-references-audit after every deep loop is manual and repetitive. The `resource-map.md` template from phase 012 is the right shape, but there is no automation that fills it from the data the loops already capture.

### Purpose

Auto-emit a filled `resource-map.md` at convergence for every `/spec_kit:deep-research` and `/spec_kit:deep-review` run. Reuse evidence already present in per-iteration delta JSON (no extra scan, no extra tokens). Add dimension-specific signals (findings counts for review, citation counts for research) that turn the flat path catalog into a coverage map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New shared helper: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` that ingests an array of per-iteration delta JSON objects and emits a filled `resource-map.md` string.
- Helper supports two input shapes: `review` deltas (with `findings[]` carrying `{ severity, file, line }`) and `research` deltas (with `findings[]` carrying `{ source_paths[], citations[] }`).
- Dimension-specific column additions on the review shape: extra `Findings (P0/P1/P2)` column. On the research shape: extra `Citations (N iterations)` column.
- Integration call from `sk-deep-review/scripts/reduce-state.cjs` at convergence, writing to the resolved local-owner `{artifact_dir}/resource-map.md`.
- Integration call from `sk-deep-research/scripts/reduce-state.cjs` at convergence, writing to the resolved local-owner `{artifact_dir}/resource-map.md`.
- YAML workflow updates: `spec_kit_deep-research_auto.yaml`, `spec_kit_deep-research_confirm.yaml`, `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml` — all four gain a post-convergence step that triggers emission, guarded by `config.resource_map.emit: true` (default on).
- SKILL.md updates for both skills documenting the new output surface.
- `.opencode/command/spec_kit/deep-research.md` + `deep-review.md` — brief mentions of the convergence-time resource-map output.
- References updates: `sk-deep-research/references/convergence.md`, `sk-deep-review/references/convergence.md` — note the new emission step.
- Feature catalog entries: `sk-deep-research/feature_catalog/` and `sk-deep-review/feature_catalog/` — one entry each.
- Manual testing playbook entries: `sk-deep-research/manual_testing_playbook/` and `sk-deep-review/manual_testing_playbook/` — one entry each.
- Vitest coverage for the shared extractor: fixtures with both review and research delta shapes; snapshot assertions for the emitted markdown.
- Level 2 packet docs for this phase.

### Out of Scope

- Changing convergence math, severity weighting, or iteration budget semantics.
- Modifying the LEAF agent contracts for `@deep-research` / `@deep-review`.
- Backfilling `resource-map.md` into historical research/review folders.
- Emission of a per-iteration (non-convergence) resource-map. (An optional `emit_interim: true` hook is a P2 defer.)
- Integration with non-deep-loop skills (e.g. `/spec_kit:plan`) — phase 012 already made the template available for any packet; phase 013 is scoped to the two autonomous loops.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Create | Shared evidence extractor. Handles both review and research delta shapes. |
| `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` | Create | Short doc covering the extractor's input/output contract. |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Modify | Call the extractor at convergence; write to the resolved local-owner `{artifact_dir}/resource-map.md`. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Call the extractor at convergence; write to the resolved local-owner `{artifact_dir}/resource-map.md`. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add convergence-emission step; add `resource_map.emit` config flag (default true). |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Same. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Same. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Same. |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Document the new output surface + opt-out flag. |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Same. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Brief mention of the output. |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Brief mention of the output. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Note the new emission step in the convergence sequence. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Same. |
| `.opencode/skill/sk-deep-review/feature_catalog/**/resource-map-emission.md` | Create | Feature catalog entry. |
| `.opencode/skill/sk-deep-research/feature_catalog/**/resource-map-emission.md` | Create | Feature catalog entry. |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/**/resource-map-emission.md` | Create | Playbook scenario. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/**/resource-map-emission.md` | Create | Playbook scenario. |
| `.opencode/skill/system-spec-kit/scripts/tests/resource-map-extractor.vitest.ts` | Create | Vitest coverage for extractor. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/*` | Create | Level 2 packet docs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared evidence extractor exists and handles both review and research delta shapes. | `extract-from-evidence.cjs` exports a function `emitResourceMap({ shape, deltas, packet, scope }) -> string`; vitest covers both shapes with snapshot assertions. |
| REQ-002 | Convergence in `sk-deep-review` emits `resource-map.md` beside the actual review packet outputs. | After `/spec_kit:deep-review :auto` converges on a test packet, the resolved local-owner `{artifact_dir}/resource-map.md` exists beside `review-report.md` with at least one category populated and a `Findings (P0/P1/P2)` column. |
| REQ-003 | Convergence in `sk-deep-research` emits `resource-map.md` beside the actual research packet outputs. | After `/spec_kit:deep-research :auto` converges on a test packet, the resolved local-owner `{artifact_dir}/resource-map.md` exists beside `research.md` with at least one category populated and a `Citations` column. |
| REQ-004 | Opt-out works. | Setting `config.resource_map.emit: false` in the YAML config or passing `--no-resource-map` skips emission cleanly. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | SKILL.md surfaces for both skills document the new output. | Each SKILL.md mentions `resource-map.md` in its outputs section + states the opt-out flag. |
| REQ-006 | Command MD + convergence references describe the behavior. | `deep-research.md`, `deep-review.md`, and the two `convergence.md` references each mention the new emission step. |
| REQ-007 | Feature catalog and manual testing playbook each carry a matching entry. | Four new entries (2 skills × {feature_catalog, manual_testing_playbook}) following neighbor-entry formats. |
| REQ-008 | Extractor correctly categorizes paths using the phase-012 ten-category skeleton. | Snapshot tests cover: README, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta. Unknown extensions land in a deterministic fallback category. |
| REQ-009 | Review shape attributes P0/P1/P2 findings correctly. | A file with two P0 + one P1 finding shows `P0=2 P1=1 P2=0`. Files with zero findings are listed under `Status: Validated` (in-scope but clean). |
| REQ-010 | Research shape shows per-iteration citation counts. | A file cited across 3 iterations shows `Citations: 3`. Citations deduplicate per iteration. |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Interim (per-iteration) emission behind `emit_interim: true`. | When enabled, the resource-map is refreshed after each iteration with a "partial" marker. |
| REQ-012 | Hot-path detection in research shape. | Files cited in ≥3 iterations auto-promoted to a `Hot Paths` summary block at the top. |
| REQ-013 | Coverage summary line in the `Summary` block. | Review map shows `Coverage: files_with_findings / total_files_touched`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operators running `/spec_kit:deep-review :auto` or `/spec_kit:deep-research :auto` get a `resource-map.md` alongside the narrative output in the same resolved local-owner packet with zero additional configuration.
- **SC-002**: The emitted map reuses evidence captured during the loop; no new scan cost is added and no external calls are triggered at convergence.
- **SC-003**: The review and research map shapes share the ten-category skeleton but carry dimension-specific columns, so a reviewer can read both without relearning the format.
- **SC-004**: Opt-out (`--no-resource-map` / `emit: false`) works cleanly with no partial writes.
- **SC-005**: `validate.sh --strict` on this packet exits 0; mcp_server typecheck + vitest stay green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Evidence extraction misclassifies paths because iteration delta shapes vary across executors (native vs cli-codex vs cli-copilot). | Medium | Define a single normalized evidence shape consumed by the extractor; adapters per executor inside `reduce-state.cjs` normalize before passing. |
| Risk | Convergence-time emission races with other reduce-state.cjs writes (iteration JSONL, review-report.md). | Medium | Emit resource-map.md AFTER all other convergence writes finish, in a single final step; never inside the per-iteration reducer. |
| Risk | Extractor produces a malformed `resource-map.md` if delta files are missing or truncated. | Medium | Defensive parsing with per-delta try/catch; skip bad deltas and record a `degraded: true` note in the emitted map's Summary block. |
| Dependency | Phase 001 local-owner rollback | High | Phase 002 must emit beside the restored local-owner packet paths before runtime wiring can be trusted. |
| Dependency | Phase 012 `resource-map.md` template shape is stable. | High | Phase 012 is locked; any future changes to the template must stay backward compatible with the extractor's output. |
| Dependency | `resolveArtifactRoot(specFolder, 'research'|'review')` from shared/review-research-paths.cjs. | Low | Supplies the canonical local-owner convergence target. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Convergence emission adds <100ms wall-clock on a 10-iteration run (evidence aggregation is O(deltas × findings), small constants).
- **NFR-P02**: No additional MCP calls, no file-system scans outside the packet's own `research/deltas/` or `review/deltas/`.

### Security
- **NFR-S01**: Extractor is pure string/JSON; no network, no shell-outs.

### Reliability
- **NFR-R01**: Emission is idempotent — re-running `/spec_kit:deep-review` on the same converged state produces byte-identical `resource-map.md` (modulo timestamp).
- **NFR-R02**: If a delta file is malformed, the run continues and logs a `degraded` marker rather than failing convergence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero iterations (loop aborted before first iteration): emission is skipped and a note lands in logs.
- Single-iteration loop: map is emitted with one row set; still valid.
- Iteration with zero findings / zero citations: executor rows are still present but the Findings/Citations column shows `0`.
- Phase-child loops: emission targets the child phase or sub-phase's resolved local-owner `{artifact_dir}`, never a parent/root packet.

### Error Scenarios
- Delta JSON missing required fields: skip the delta, log warning, mark map as `degraded: true`.
- `resource-map.md` already exists at the target path (from a prior run): overwrite with a new generation; a `created_at` header preserves the first run's timestamp.
- Disk write failure: convergence succeeds, map emission is reported as failed, and the exit code reflects a warning (not a hard error).

### State Transitions
- Loop paused mid-run and resumed: emission only fires on true convergence, not on resume. Partial state during resume never leaves a stale map.
- Loop reaches max iterations without convergence: map is still emitted and marked `converged: false, exhausted: true` in the Summary block.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 1 new script + ~4 YAML edits + ~2 script integrations + ~8 doc updates + test fixtures. |
| Risk | 9/25 | No runtime behavior change in the loop itself; net-new emission step with clean opt-out. |
| Research | 7/20 | Phase 012 template shape is locked; delta shapes already exist; mostly plumbing. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the extractor live under `scripts/resource-map/` (new folder) or `scripts/memory/` alongside `generate-context.js`? Leaning toward a new dedicated folder for cohesion — confirm during plan phase.
- Should the research shape also distinguish `Analyzed` (read during an iteration) from `Cited` (referenced in the final synthesis)? Adds value but doubles the column count — P2 defer candidate.
<!-- /ANCHOR:questions -->
