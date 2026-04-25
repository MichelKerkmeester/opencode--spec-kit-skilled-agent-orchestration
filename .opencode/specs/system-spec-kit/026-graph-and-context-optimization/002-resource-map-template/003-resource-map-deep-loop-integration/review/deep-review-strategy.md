---
title: Deep Review Strategy
description: Runtime review strategy for 003-resource-map-deep-loop-integration.
---

# Deep Review Strategy - Session Tracking Template

## 2. TOPIC
Audit the resource-map deep-loop integration packet across the shared extractor, both reducers, all four workflow assets, operator-facing docs, focused tests, and the packet's own traceability surfaces.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Do not modify any reviewed source file or packet doc.
- Do not rerun or repair the implementation under review.
- Do not save memory context or commit review artifacts.
- Do not chase unrelated deep-review issues outside the resource-map integration scope.
<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop when the loop converges with evidence, scope, and coverage gates satisfied.
- Stop at iteration 7 if convergence has not been reached earlier.
- Halt early only for timeout, irrecoverable state corruption, or three consecutive dispatch failures.
<!-- /ANCHOR:stop-conditions -->

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Start with the packet's implementation summary to anchor the changed surfaces and the already-known verification caveats.
- Use the reducer and prompt-pack contracts as the canonical schema guard before writing iteration artifacts.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- No failed approaches yet.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` gate emission behind `--emit-resource-map` plus config opt-out rather than always writing. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` gate emission behind `--emit-resource-map` plus config opt-out rather than always writing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` gate emission behind `--emit-resource-map` plus config opt-out rather than always writing.

### `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` emits the resource map through the shared extractor rather than duplicating path logic. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` emits the resource map through the shared extractor rather than duplicating path logic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` emits the resource map through the shared extractor rather than duplicating path logic.

### `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` only imports `node:fs` and `node:path`, rejects traversal-style `../` candidates, and ignores URLs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` only imports `node:fs` and `node:path`, rejects traversal-style `../` candidates, and ignores URLs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` only imports `node:fs` and `node:path`, rejects traversal-style `../` candidates, and ignores URLs.

### `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` correctly scopes the extractor to repo paths and deterministic degradation behavior. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` correctly scopes the extractor to repo paths and deterministic degradation behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` correctly scopes the extractor to repo paths and deterministic degradation behavior.

### `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` explains degraded-row behavior and deterministic fallbacks clearly enough for a follow-on patch. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` explains degraded-row behavior and deterministic fallbacks clearly enough for a follow-on patch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` explains degraded-row behavior and deterministic fallbacks clearly enough for a follow-on patch.

### `checklist_evidence`: fail - completion surfaces cannot be independently verified because the packet simultaneously claims both failure and completion for `T035`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: fail - completion surfaces cannot be independently verified because the packet simultaneously claims both failure and completion for `T035`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail - completion surfaces cannot be independently verified because the packet simultaneously claims both failure and completion for `T035`.

### `checklist_evidence`: pass - no additional code-path drift surfaced beyond `F001`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence`: pass - no additional code-path drift surfaced beyond `F001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pass - no additional code-path drift surfaced beyond `F001`.

### `checklist_evidence`: pass - no unexpected shell-outs or network calls were introduced in the extractor path itself. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: pass - no unexpected shell-outs or network calls were introduced in the extractor path itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pass - no unexpected shell-outs or network calls were introduced in the extractor path itself.

### `checklist_evidence`: pass - the focused test file and README document the current path-only expectations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: pass - the focused test file and README document the current path-only expectations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pass - the focused test file and README document the current path-only expectations.

### `feature_catalog_code`: not applicable at the packet-doc layer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: not applicable at the packet-doc layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not applicable at the packet-doc layer.

### `feature_catalog_code`: pass - feature catalog entries use `{artifact_dir}` correctly. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code`: pass - feature catalog entries use `{artifact_dir}` correctly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass - feature catalog entries use `{artifact_dir}` correctly.

### `feature_catalog_code`: pass - no additional drift beyond the already-recorded command-doc path wording. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: pass - no additional drift beyond the already-recorded command-doc path wording.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass - no additional drift beyond the already-recorded command-doc path wording.

### `feature_catalog_code`: pass - the feature-catalog and playbook entries describe the reducer-owned emission path clearly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: pass - the feature-catalog and playbook entries describe the reducer-owned emission path clearly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass - the feature-catalog and playbook entries describe the reducer-owned emission path clearly.

### `implementation-summary.md` accurately captures the T030/T035 caveats and the surrounding limitations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `implementation-summary.md` accurately captures the T030/T035 caveats and the surrounding limitations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `implementation-summary.md` accurately captures the T030/T035 caveats and the surrounding limitations.

### `playbook_capability`: not applicable at the packet-doc layer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: not applicable at the packet-doc layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: not applicable at the packet-doc layer.

### `playbook_capability`: partial - the playbooks are correct, but the top-level command docs still point operators at root-level locations. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: partial - the playbooks are correct, but the top-level command docs still point operators at root-level locations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial - the playbooks are correct, but the top-level command docs still point operators at root-level locations.

### `playbook_capability`: pass - manual playbook expectations match the actual reducer emission behavior. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: pass - manual playbook expectations match the actual reducer emission behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pass - manual playbook expectations match the actual reducer emission behavior.

### `playbook_capability`: pass - the playbooks point operators at the reducer and YAML surfaces that actually own emission. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: pass - the playbooks point operators at the reducer and YAML surfaces that actually own emission.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pass - the playbooks point operators at the reducer and YAML surfaces that actually own emission.

### `spec_code`: fail - packet success criteria and tasks closure do not match the implementation summary's verification table. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: fail - packet success criteria and tasks closure do not match the implementation summary's verification table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail - packet success criteria and tasks closure do not match the implementation summary's verification table.

### `spec_code`: partial - extractor implementation diverges from the documented review delta example for finding file anchors. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial - extractor implementation diverges from the documented review delta example for finding file anchors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial - extractor implementation diverges from the documented review delta example for finding file anchors.

### `spec_code`: pass - reducers and workflows agree that emission is synthesis-only and opt-out aware. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: pass - reducers and workflows agree that emission is synthesis-only and opt-out aware.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass - reducers and workflows agree that emission is synthesis-only and opt-out aware.

### `spec_code`: pass - reducers only emit through the shared extractor and respect `config.resource_map.emit === false`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: pass - reducers only emit through the shared extractor and respect `config.resource_map.emit === false`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass - reducers only emit through the shared extractor and respect `config.resource_map.emit === false`.

### All four YAML workflow assets wire the emission step into synthesis rather than the per-iteration reducer refresh. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: All four YAML workflow assets wire the emission step into synthesis rather than the per-iteration reducer refresh.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: All four YAML workflow assets wire the emission step into synthesis rather than the per-iteration reducer refresh.

### Both reducers only emit `resource-map.md` when `--emit-resource-map` is requested. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Both reducers only emit `resource-map.md` when `--emit-resource-map` is requested.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Both reducers only emit `resource-map.md` when `--emit-resource-map` is requested.

### No additional packet-doc contradictions surfaced beyond `F002`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No additional packet-doc contradictions surfaced beyond `F002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional packet-doc contradictions surfaced beyond `F002`.

### Review and research feature/playbook entries consistently point at the reducer-owned emission path. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Review and research feature/playbook entries consistently point at the reducer-owned emission path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Review and research feature/playbook entries consistently point at the reducer-owned emission path.

### The feature catalog and playbook entries reference the same implementation anchors and opt-out behavior. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The feature catalog and playbook entries reference the same implementation anchors and opt-out behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The feature catalog and playbook entries reference the same implementation anchors and opt-out behavior.

### The README, feature catalog entries, and playbook entries consistently describe opt-out behavior and the shared extractor boundary. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The README, feature catalog entries, and playbook entries consistently describe opt-out behavior and the shared extractor boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README, feature catalog entries, and playbook entries consistently describe opt-out behavior and the shared extractor boundary.

### The workflow assets themselves consistently use `{artifact_dir}` for the emitted resource map path. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The workflow assets themselves consistently use `{artifact_dir}` for the emitted resource map path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The workflow assets themselves consistently use `{artifact_dir}` for the emitted resource map path.

### The YAML synthesis steps invoke the existing reducer CLI instead of introducing a second shell execution path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The YAML synthesis steps invoke the existing reducer CLI instead of introducing a second shell execution path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The YAML synthesis steps invoke the existing reducer CLI instead of introducing a second shell execution path.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- No ruled-out review angles yet.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None. Proceed to synthesis and remediation planning for the four recorded findings.

<!-- /ANCHOR:next-focus -->

---

<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- `implementation-summary.md` records 19 implementation surfaces plus the packet docs, with T030 passing only through a `--root .` follow-up and T035 still failing under strict validation.
- The review target is a child-phase packet, so the canonical artifact directory is `review/003-resource-map-deep-loop-integration-pt-01/`, not the root packet folder.
- The packet root has no `resource-map.md`; the coverage gate is informationally skipped at init.
- The intended review order is correctness -> security -> traceability -> maintainability, then cross-cutting stabilization passes.
- Files in scope for review:
  1. `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`
  2. `.opencode/skill/system-spec-kit/scripts/resource-map/README.md`
  3. `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts`
  4. `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
  5. `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
  6. `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
  7. `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
  8. `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  9. `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
  10. `.opencode/skill/sk-deep-review/SKILL.md`
  11. `.opencode/skill/sk-deep-research/SKILL.md`
  12. `.opencode/command/spec_kit/deep-review.md`
  13. `.opencode/command/spec_kit/deep-research.md`
  14. `.opencode/skill/sk-deep-review/references/convergence.md`
  15. `.opencode/skill/sk-deep-research/references/convergence.md`
  16. `.opencode/skill/sk-deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md`
  17. `.opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md`
  18. `.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md`
  19. `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/027-resource-map-emission.md`
  20. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/spec.md`
  21. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/plan.md`
  22. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/tasks.md`
  23. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/checklist.md`
  24. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/implementation-summary.md`
<!-- /ANCHOR:known-context -->

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | 0 | Verify implementation and docs against the packet requirements. |
| `checklist_evidence` | core | pending | 0 | Verify packet completion claims against recorded evidence. |
| `skill_agent` | overlay | notApplicable | 0 | Spec-folder review; runtime agent parity is outside this packet's target type. |
| `agent_cross_runtime` | overlay | notApplicable | 0 | Spec-folder review; runtime agent parity is outside this packet's target type. |
| `feature_catalog_code` | overlay | pending | 0 | Confirm feature catalog and playbook additions match the emitted behavior. |
| `playbook_capability` | overlay | pending | 0 | Confirm manual playbook steps map to the reducer/YAML reality. |
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:cross-reference-status -->

---

<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-review/SKILL.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-research/SKILL.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/spec_kit/deep-review.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/spec_kit/deep-research.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-review/references/convergence.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-research/references/convergence.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/027-resource-map-emission.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/spec.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/plan.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/tasks.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/checklist.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/implementation-summary.md` | — | 0 | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:files-under-review -->

---

<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-2026-04-24T15:11:19Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-04-24T15:11:19Z
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->

---
