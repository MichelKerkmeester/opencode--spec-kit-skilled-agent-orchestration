---
title: "Checklist: Implement + Remove Deprecated Features"
---
# Checklist

## P0 — Must Pass

- [ ] `channel-attribution.ts` deleted and zero imports remain
- [ ] `fusion-lab.ts` deleted and zero imports remain
- [ ] `eval-ceiling.ts` deleted and zero imports remain
- [ ] `applyCalibrationProfile()` called in `stage2-fusion.ts`
- [ ] `vectorSearchWithContiguity()` called in `stage1-candidate-gen.ts`
- [ ] `isConsumptionLogEnabled()` checks env var (not hardcoded false)
- [ ] All vitest tests pass

## P1 — Should Pass

- [ ] 3 feature catalog entries deleted (channel attribution, fusion V2, ceiling)
- [ ] 3 testing playbook entries deleted
- [ ] `feature_catalog.md` index cleaned (3 sections removed)
- [ ] `feature_catalog_in_simple_terms.md` cleaned
- [ ] `manual_testing_playbook.md` index cleaned
- [ ] 3 feature catalog entries updated (graph calibration, temporal contiguity, consumption logger)
- [ ] `lib/eval/README.md` cleaned
- [ ] `shared/algorithms/index.ts` barrel export cleaned
- [ ] `isTemporalContiguityEnabled()` added to `search-flags.ts`
- [ ] All 3 implemented features are feature-flag gated
