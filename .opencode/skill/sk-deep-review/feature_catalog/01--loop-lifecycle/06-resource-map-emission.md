---
title: "Resource Map Emission"
description: "Emits a convergence-time resource-map.md from review delta evidence with a clean opt-out path."
---

# Resource Map Emission

## 1. OVERVIEW

Emits a convergence-time `resource-map.md` from review delta evidence with a clean opt-out path.

This feature gives the review loop a flat path ledger alongside `review-report.md`. Instead of forcing operators to reconstruct file coverage from iteration markdown and JSONL state, synthesis writes a template-shaped `resource-map.md` grouped by category and annotated with per-file P0/P1/P2 counts.

---

## 2. CURRENT REALITY

The live contract is workflow-owned. Review iterations keep using the reducer for registry, dashboard, and strategy refreshes, while synthesis triggers one explicit `--emit-resource-map` reducer pass that reads converged delta files and writes `{artifact_dir}/resource-map.md`.

The emitter is enabled by default through `config.resource_map.emit = true`. Operators can disable the write for a run with `--no-resource-map`, and the reducer will skip cleanly without mutating or partially creating the output file.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Shared script | Normalizes review evidence and renders the ten-category resource map. |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Reducer | Adds the `--emit-resource-map` path and honors `config.resource_map.emit`. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow | Triggers emission during synthesis after the final adjudication pass. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow | Mirrors the same synthesis-time emission path in confirm mode. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Reference | Documents the convergence-to-synthesis emission step and operator opt-out. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Vitest | Covers review-shape normalization, category classification, and deterministic output. |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` | Manual playbook | Verifies synthesis emits the review resource map and that opt-out skips cleanly. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/06-resource-map-emission.md`
- Primary sources: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
