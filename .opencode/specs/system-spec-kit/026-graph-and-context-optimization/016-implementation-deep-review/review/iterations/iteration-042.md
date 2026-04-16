# Iteration 42 - maintainability - advisor

## Dispatcher
- iteration: 42 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:29:04.121Z

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
- None.

### P2 Findings
- **The two harnesses duplicate the same local infrastructure instead of sharing one helper, which creates easy drift points.** `load_advisor_module()` is implemented twice (`.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:43-51`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:38-46`) and `ensure_parent_dir()` is duplicated as well (`.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:207-212`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:169-174`). The copies are nearly identical today, so any future change to import isolation, module naming, or report-path handling must be applied manually in both places.
- **Dataset-shape validation is split across the two scripts and already diverges in operator-facing behavior.** The bench loader silently drops rows whose `"prompt"` is missing or blank (`.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:54-69`), while the regression harness accepts any parsed object and only later dereferences `case["prompt"]` directly in `evaluate_case()` (`.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:49-61`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:68-70`). That means the same malformed dataset family is diagnosed in two different ways, which makes the JSONL schema contract harder to reason about and maintain.

## Traceability Checks
- `skill_advisor_bench.py` still matches its advertised high-level contract: it emits subprocess, in-process, and batch latency/throughput summaries with explicit pass/fail gates. The maintainability issue is that this contract is implemented with script-local helpers instead of a shared harness utility.
- `skill_advisor_regression.py` still enforces the intended routing gates (`top1_accuracy`, `command_bridge_fp_rate`, `p0_pass_rate`) against the shipped fixture. I did not find a separate automated test module for the harness itself, so the long-term maintenance risk is concentrated in these hand-maintained loader/metric paths.

## Confirmed-Clean Surfaces
- `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:161-194` - batch-mode temp-file cleanup is correctly enclosed in `finally`, so repeated benchmark runs do not obviously leak scratch files.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:246-273` - the benchmark report keeps gate booleans and the aggregate `overall_pass` explicit, which makes failures easy to inspect without reverse-engineering raw metrics.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:215-246` - regression failures are preserved verbatim in the JSON report instead of being collapsed into a summary count, so debugging failing cases remains straightforward.

## Next Focus
- If iteration 43 stays on the advisor subset, inspect the remaining runtime/cache scripts for the same pattern of duplicated local helpers and schema validation drift, especially around file discovery and health/report generation.
