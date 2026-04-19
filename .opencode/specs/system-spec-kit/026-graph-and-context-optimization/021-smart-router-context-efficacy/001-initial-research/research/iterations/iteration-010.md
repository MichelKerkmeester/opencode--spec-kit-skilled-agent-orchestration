# Iteration 010 - Per-Question Decision Draft

## Focus Questions

V1-V10

## Tools Used

- Evidence synthesis from iterations 1-9
- Decision matrix drafting

## Sources Queried

- `research/iterations/iteration-001.md` through `iteration-009.md`
- Phase 020 hook reference and validation playbook
- Advisor measurement script output from iteration 2

## Findings

- V1 baseline should be `adopt-now` for static measurement as a useful upper-bound method, but it must be labeled inferred, not direct transcript telemetry. (sourceStrength: moderate)
- V2 with-hook steering should be `adopt-now` at the hook-surface level because renderer and runtime parity evidence are strong; assistant compliance remains out of scope for Phase 020 tests. (sourceStrength: moderate)
- V3 savings quantification should be `adopt-now` for projected savings and `prototype-later` for real latency/token telemetry. (sourceStrength: moderate)
- V4 miss-rate should be `prototype-later`: corpus parity is good, but label drift and override behavior require a dedicated labeled evaluation harness and transcript review. (sourceStrength: moderate)
- V5 adversarial should be `adopt-now` for existing renderer protections and `prototype-later` for expanded adversarial fixtures. (sourceStrength: moderate)
- V6 cross-runtime should be `adopt-now` for visible-text parity; registration completeness and real runtime observation remain follow-up. (sourceStrength: moderate)
- V7 skip-SKILL.md should be `prototype-later`: repository artifact scan suggests agents often cite/read skill files, but no hook-era telemetry proves reduction. (sourceStrength: moderate)
- V8/V9 plugin architecture and design should be `adopt-now` as a follow-up design, with implementation in a later packet. V10 risks should be `adopt-now` because mitigations are clear and mostly already exist. (sourceStrength: moderate)

## Novelty Justification

This pass transformed evidence into the first complete V1-V10 adopt/prototype/reject draft.

## New Info Ratio

0.42

## Next Iteration Focus

Refine quantification limitations and latency assumptions.
