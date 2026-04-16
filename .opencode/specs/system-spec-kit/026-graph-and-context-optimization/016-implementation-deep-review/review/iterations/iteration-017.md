# Iteration 17 - correctness - advisor

## Dispatcher
- iteration: 17 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:57:15.486Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-config.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-state.jsonl
- .opencode/skill/skill-advisor/scripts/skill_advisor_bench.py
- .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py
- .opencode/skill/skill-advisor/scripts/skill_advisor.py
- .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`skill_advisor_bench.py` mis-parses valid prompts that start with `-`, so one-shot subprocess measurements can fail or benchmark different input than the other modes.** In `benchmark_subprocess`, the harness injects each dataset prompt directly as the next argv token (`skill_advisor_bench.py:106-115`), but the advisor CLI defines the prompt as an optional positional after several flags (`skill_advisor.py:1972-1995`). Without inserting a `--` separator, prompts such as `--health check routing` or `--batch-file looks wrong` are treated as CLI options by `argparse`; batch mode and in-process mode still treat the same text as prompt content, so the three benchmark modes no longer evaluate the same workload.

```json
{
  "claim": "The benchmark harness cannot safely benchmark arbitrary prompt datasets because subprocess mode treats hyphen-leading prompt text as CLI flags.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:106-115",
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:1972-1995"
  ],
  "counterevidenceSought": "I checked whether the harness inserted a `--` sentinel, shell-quoted the prompt, or normalized hyphen-leading prompts before spawning the advisor; it does none of those things.",
  "alternativeExplanation": "The intended benchmark datasets may only contain plain natural-language prompts that never begin with `-`.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 if benchmark datasets are formally constrained to non-hyphen-leading prompts and that restriction is enforced at load time."
}
```

2. **`skill_advisor_regression.py` makes `overall_pass` unreachable for any filtered/custom dataset that contains zero P0 rows.** `compute_metrics` hard-codes `p0_pass_rate` to `0.0` when no P0 cases are present (`skill_advisor_regression.py:122-153`), and `main` always enforces `metrics["p0_pass_rate"] >= args.min_p0_pass_rate` with a default threshold of `1.0` (`skill_advisor_regression.py:187-189,215-222`). As a result, a perfectly passing P1-only dataset, or any future mode/filter that yields no P0 cases, is forced to fail its top-level gate even though no P0 expectations were violated.

```json
{
  "claim": "The regression harness incorrectly fails datasets that contain no P0 cases by treating the absence of P0 rows as a 0% P0 pass rate.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:122-153",
    ".opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:187-189",
    ".opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:215-222"
  ],
  "counterevidenceSought": "I looked for a guard that skips the P0 gate when `p0_total == 0`, or a CLI restriction that rejects datasets/modes without P0 coverage, and found neither.",
  "alternativeExplanation": "The harness may be intended only for the shipped mixed-priority fixture, where at least one P0 row is always expected.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade to P2 if the tool contract is explicitly limited to datasets that always include P0 rows and the CLI validates that precondition."
}
```

### P2 Findings
- **These harnesses appear to have no direct automated coverage, which is why the CLI-only failure modes above can slip through.** A repo-wide search under `.opencode/skill/**/tests/**/*.{py,ts,js}` found no test references to `skill_advisor_bench.py` or `skill_advisor_regression.py`, so issues in their argv/gating logic are not exercised by the current suite.

## Traceability Checks
- `skill_advisor_bench.py` advertises a generic `--dataset <jsonl-path>` benchmark flow, but the subprocess runner only honors that contract for prompts that do not begin with `-`; batch and in-process paths accept a broader prompt domain than one-shot mode.
- `skill_advisor_regression.py` also presents itself as a generic dataset-driven regression runner, yet its default gate logic effectively assumes the selected dataset always contains P0 rows. That implementation detail is not reflected in the CLI surface.

## Confirmed-Clean Surfaces
- `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:161-194` - batch-mode temp file cleanup is correctly wrapped in `finally`, so repeated runs do not obviously leak scratch files.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:231-234` and `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:49-61` - both harnesses fail clearly on empty/malformed JSONL input instead of silently continuing with partial data.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2008-2039` - the CLI correctly rejects `--batch-file` plus `--batch-stdin` together and surfaces file-read errors for batch input.

## Next Focus
- Inspect `skill_advisor.py` and any surrounding tests for CLI-only branches that the direct-function regression harness never exercises, especially semantic-hit parsing, auto-semantic search, and command-bridge routing under unusual prompt text.
