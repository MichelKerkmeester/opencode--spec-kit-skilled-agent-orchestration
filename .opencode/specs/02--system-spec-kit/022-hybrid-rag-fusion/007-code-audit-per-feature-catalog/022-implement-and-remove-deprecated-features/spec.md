---
title: "Implement 3 Deprecated Features + Remove 3 Others"
description: "Wire graph calibration, temporal contiguity, and consumption logger into production. Remove channel attribution, fusion shadow V2, and eval ceiling from entire codebase."
---
# Implement 3 Deprecated Features + Remove 3 Others

<!-- SPECKIT_LEVEL: 3 -->

---

## Scope

### IMPLEMENT (wire into production pipeline)

| # | Feature | Source File | Integration Point | Flag |
|---|---------|-----------|-------------------|------|
| 1 | Graph Calibration Profiles | `lib/search/graph-calibration.ts` | `stage2-fusion.ts` after graph signals (~L635) | `isGraphCalibrationProfileEnabled()` exists |
| 2 | Temporal Contiguity Layer | `lib/cognitive/temporal-contiguity.ts` | `stage1-candidate-gen.ts` vector channel (before fusion) | Must create `isTemporalContiguityEnabled()` |
| 3 | Consumption Logger | `lib/telemetry/consumption-logger.ts` | Handler wiring exists; un-hardcode flag | Change `return false` to `isFeatureEnabled()` |

### REMOVE (delete code, catalog, playbook, all references)

| # | Feature | Source File | Catalog | Playbook |
|---|---------|-----------|---------|----------|
| 4 | Channel Attribution | `lib/eval/channel-attribution.ts` | `09.../11-shadow-scoring-and-channel-attribution.md` | `09.../015-shadow-scoring...md` |
| 5 | Fusion Policy Shadow V2 | `shared/algorithms/fusion-lab.ts` | `11.../23-fusion-policy-shadow-v2.md` | `11.../170-fusion-policy-shadow-v2...md` |
| 6 | Full-Context Ceiling Eval | `lib/eval/eval-ceiling.ts` | `09.../04-full-context-ceiling-evaluation.md` | `09.../008-full-context-ceiling...md` |

---

## Constraints

- All implementations must be feature-flag gated (graduated, default ON)
- Temporal contiguity integrates at Stage 1 (NOT Stage 2 — needs raw vector results)
- Removal must be exhaustive: source, tests, catalog, playbook, index files, READMEs
- Test files importing removed modules must have imports cleaned (not just deleted)
- Existing tests for implemented features must pass after wiring

---

## Delegation Plan

5 GPT-5.4 high cli-codex agents in one parallel wave:

| Agent | Task | Scope |
|-------|------|-------|
| 1 | REMOVE channel attribution | Delete files + clean all refs |
| 2 | REMOVE fusion shadow V2 + eval ceiling | Delete files + clean all refs |
| 3 | IMPLEMENT graph calibration | Wire into Stage 2, update catalog |
| 4 | IMPLEMENT temporal contiguity | Wire into Stage 1, create flag, update catalog |
| 5 | IMPLEMENT consumption logger | Un-hardcode flag, update catalog |

---

## Success Criteria

- [ ] 3 deprecated modules wired into production with feature flags
- [ ] 3 removed modules have zero references in codebase
- [ ] All existing tests pass (vitest)
- [ ] Feature catalog entries updated (3 active, 3 deleted)
- [ ] Testing playbook entries updated (3 deleted)
- [ ] Index files (feature_catalog.md, simple_terms, playbook index) cleaned
