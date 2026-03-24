# Iteration 4: Q3 Convergence Threshold Validation

## Focus
Validate whether the current review-mode convergence logic still behaves correctly after the Q2 simplification from 7 review dimensions to 4, using replay data from the real review runs in spec `012` and spec `013` plus the archived v1 threshold proposals. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:28-32] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:62] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:89-220]

## Replay Method
1. Replayed the actual `newFindingsRatio` sequences from the completed review runs in spec `012` and spec `013`. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:2-8] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl:2-6]
2. Replayed the live review-mode contract exactly as currently documented: `convergenceThreshold = 0.10`, `stuckThreshold = 2`, rolling stop at `< 0.08`, MAD weight `0.25`, dimension coverage weight `0.45`, and stop score `> 0.60`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:31-34] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:193-198] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:681-737] [SOURCE: .opencode/skill/sk-deep-research/references/quick_reference.md:236-280]
3. Ran the replay twice per dataset: once with the current 7-dimension coverage accounting, and once with the Q2 simplified 4-dimension mapping (`correctness`, `security`, `traceability`, `maintainability`). This 4-dimension replay is an inference from the Q2 mapping already recorded in strategy. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:62]
4. Tested threshold-only variants, then tested one structural variant: delay the coverage stop vote until one post-coverage stabilization pass has occurred.

## Findings
1. The current review-mode thresholds were never empirically calibrated; they were carried forward from archived v1 proposal work. v1 recommended rolling stop at `0.08`, 100% dimension coverage, and heavier emphasis on coverage than MAD, while a later v1 synthesis still described a reused `convergenceThreshold = 0.10`. That means the current contract already mixes at least two proposal layers rather than one validated baseline. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:91-109] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:166-220] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-005.md:92-99]
2. Replaying the live 7-dimension contract against the real runs produces plausible stop behavior, but it also exposes a tension in spec `012`: run 5 is a clean combined pass at `0.0`, yet run 6 still finds a real late P2 at `0.06`. Under the current 7-dimension contract this does not prematurely STOP at run 5 because only `6/7` dimensions are covered there, and run 6 records the late documentation-quality finding `P2-010`. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:6-8] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/iteration-006.md:22-23] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/iteration-006.md:57-60]
3. The 4-dimension simplification changes convergence behavior materially even when the ratios stay identical. In spec `012`, collapsing `spec-alignment`, `completeness`, and `cross-ref-integrity` into `traceability`, and collapsing `patterns` plus `documentation-quality` into `maintainability`, makes the unchanged algorithm hit full coverage one iteration earlier. That causes a false STOP at run 5 because rolling average, MAD, and coverage all vote stop simultaneously. This is the core empirical regression introduced by the reduced taxonomy. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:62] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:5-7]
4. Threshold-only refits are insufficient for the simplified model. Once spec `012` reaches 4/4 simplified dimensions at run 5, the live stop conditions all align: `rollingAvg = 0.05`, latest ratio is within the MAD floor, and coverage is already `1.0`. Changing only `rolling` or only the consensus threshold cannot prevent that early STOP without also delaying the correct run-4 STOP in spec `013`. This is an inference from the replay grid, not a literal repo fact. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:5-7] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl:4-6] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:702-737]
5. The smallest calibrated change that fits both real runs is structural, not purely numeric: let dimension coverage vote STOP only after one post-coverage stabilization pass, and decouple stuck/no-progress from rolling stop. With `rollingAvg < 0.08` preserved, a dedicated no-progress threshold of `0.05`, and coverage only voting stop after one additional pass beyond first full coverage, spec `012` continues through run 5 and stops at run 6, while spec `013` still stops at run 4. That keeps the simplification without losing the late-finding behavior visible in `012`. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:681-737] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:5-8] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl:4-6]

## Proposed Calibration
### Recommended replay harness
- Use a deterministic JSONL replay over completed review sessions as the first validation layer. Inputs should be: iteration order, `newFindingsRatio`, `findingsCount`, per-iteration dimensions completed, and final synthesis reason. That is enough to regression-test convergence behavior without inventing synthetic data too early. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:2-8] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl:2-6]
- Seed the replay corpus with both archived v1 proposal cases and real review runs, but treat the real runs as the calibration target and the v1 archive as prior-art context only. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:91-220]

### Thresholds and gates to keep
- Keep rolling-stop threshold at `< 0.08`. The real runs do not provide evidence that this specific cutoff is the failure mode. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:93-110] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:702-707]
- Keep composite consensus threshold at `> 0.60`. The replay regression comes from coverage arriving earlier, not from the vote threshold itself. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:732-737]
- Keep MAD weight reduced relative to research mode; the real runs still use it effectively as a late-pass confirmation signal in spec `013`. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl:5-6] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md:166-171]

### Thresholds and gates to change
- Split the current overloaded `convergenceThreshold` concept into:
  - `rollingStopThreshold = 0.08`
  - `noProgressThreshold = 0.05` for stuck counting only

  The live config currently reuses `0.10` for convergence/no-progress bookkeeping, but spec `012` shows a real late finding at `0.06`; treating that as "no progress" is too aggressive once the taxonomy is simplified. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:34] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:197-198] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:7]
- Replace `coverage >= 1.0` as an immediate stop vote with `coverage >= 1.0 AND coverageAge >= 1`. In other words: first full-coverage pass proves breadth; the next pass proves stability. This is the calibration that resolves the 4-dimension replay regression without breaking spec `013`. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:721-737] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl:6-8] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl:4-6]
- Leave `stuckThreshold = 2` only if the new `noProgressThreshold = 0.05` split is added. If the implementation insists on reusing one numeric threshold for both rolling stop and stuck detection, then `stuckThreshold` should be re-fit upward to `3` to avoid false stuck recovery after the first full-coverage clean pass. This is a replay-based recommendation rather than a literal current contract requirement. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:688-689] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:197-198]

## Ruled Out
- Re-fitting only the rolling threshold while leaving coverage as an immediate stop vote.
- Re-fitting only the composite stop-score threshold while leaving coverage and stuck logic unchanged.
- Keeping one shared threshold for both "rolling convergence" and "no-progress/stuck" in the simplified 4-dimension model.

## Sources Consulted
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-research-state.jsonl`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/iteration-006.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/deep-research-state.jsonl`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/013-memory-generation-quality/scratch/iteration-004.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-005.md`

## Assessment
- `newInfoRatio`: `0.56`
- Addressed: `Q3`
- Answered this iteration: `Q3`. We now have an empirical replay method, a concrete regression caused by the 7 -> 4 dimension collapse, and a calibrated fix that preserves both observed review-run endpoints.

## Reflection
- Worked: replaying the real JSONL traces was much more informative than inventing synthetic ratios first.
- Worked: comparing the same ratios under 7-dimension and 4-dimension coverage made it obvious that coverage timing, not just threshold tuning, is the fragile part.
- Failed: threshold-only grid search did not produce a safe fix for both real runs.
- Caution: the replay corpus is still small, so the next implementation pass should codify the replay harness and add more historical review sessions before treating these numbers as final forever.

## Recommended Next Focus
Q4: redesign cross-reference verification so it becomes machine-verifiable loop state instead of appendix prose. In particular:
1. Decide which cross-reference checks belong in the core review contract versus target-specific overlays.
2. Define how cross-reference results should be stored in JSONL/strategy/dashboard state.
3. Specify which checks should gate convergence versus only enrich the final review report.
