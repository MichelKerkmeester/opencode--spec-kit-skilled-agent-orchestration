# Iteration 4 - inventory - commands+advisor

## Dispatcher
- iteration: 4 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:25:31.952Z

## Files Reviewed
- .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml
- .opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh
- .opencode/skill/skill-advisor/scripts/init-skill-graph.sh
- .opencode/skill/skill-advisor/scripts/skill_advisor.py
- .opencode/skill/skill-advisor/scripts/skill_advisor_bench.py
- .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py
- .opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py
- .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py
- .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Invalid `--semantic-hits/--cocoindex-hits` payloads are accepted as success-shaped input instead of failing fast.** `skill_advisor.py:2014-2021 (main)` prints an error when the supplied JSON is malformed or not an array, but leaves `pre_computed_hits` as `None`; `skill_advisor.py:2057-2074 (main)` then falls back to normal routing and still exits `0`. That means callers providing corrupted precomputed evidence get a nominally successful answer built from different inputs than they asked for.

```json
{
  "claim": "skill_advisor.py silently ignores invalid --semantic-hits/--cocoindex-hits input and still returns success.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:2014-2021",
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:2057-2074"
  ],
  "counterevidenceSought": "I looked for a later non-zero return or hard error path after the parse/type-check failure and did not find one.",
  "alternativeExplanation": "The fallback could be intentional best-effort behavior to keep the CLI responsive even when precomputed hits are malformed.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade to P2 if the CLI contract explicitly says invalid semantic-hit payloads are advisory and may be ignored."
}
```

2. **`skill_graph_compiler.py --validate-only` can pass while malformed metadata is being dropped, and `init-skill-graph.sh` trusts that pass to export a partial graph.** `skill_graph_compiler.py:69-75 (discover_graph_metadata)` downgrades unreadable or malformed `graph-metadata.json` files to warnings and excludes them from `all_metadata`; `skill_graph_compiler.py:590-649 (main)` validates only the parsed subset and returns `0` when `total_errors == 0`; `init-skill-graph.sh:53-57` treats that status as good enough to export JSON. A broken metadata file can therefore disappear from the compiled graph instead of blocking initialization.

```json
{
  "claim": "Malformed skill graph metadata does not fail validation and can be silently omitted from the exported graph.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:69-75",
    ".opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:590-649",
    ".opencode/skill/skill-advisor/scripts/init-skill-graph.sh:53-57"
  ],
  "counterevidenceSought": "I checked whether parse warnings were converted into total_errors later in main() or whether init-skill-graph.sh performed an additional integrity check before export; neither happens.",
  "alternativeExplanation": "The compiler may be intentionally tolerant so one bad file does not block the entire graph pipeline.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade to P2 if partial graph export is an explicit design goal and downstream consumers are documented to tolerate missing skills after parse warnings."
}
```

### P2 Findings
- **`top1_accuracy` is inflated by excluding empty-result failures from its denominator.** `skill_advisor_regression.py:125-155 (compute_metrics)` only counts cases toward `top1_cases` when `item["top"] is not None`, so `expect_result=true` failures with no recommendation hurt `failed_cases` but not the headline accuracy metric.
- **The implement workflow assets contradict themselves about whether `implementation-summary.md` is mandatory for Level 1.** `spec_kit_implement_auto.yaml:285,441-442,471` and `spec_kit_implement_confirm.yaml:286,493-494,523` simultaneously say the file is a MUST/required completion artifact and only "MANDATORY for Level 2+" / "Strongly recommended for Level 1", which creates prompt-level ambiguity for Level 1 runs.

## Traceability Checks
- Deprecated `/spec_kit:start` does **not** appear to be shipped anymore in the reviewed command assets: there are no `spec_kit_start_*.yaml` files under `.opencode/command/spec_kit/assets`, and the live command docs point intake to `/spec_kit:plan --intake-only`.
- The resume command assets match the intended canonical recovery ladder: both reviewed resume variants prioritize handover/continuity/spec-doc recovery before `session_bootstrap()` / `memory_context()`, which is consistent with the packet's resume-first design.

## Confirmed-Clean Surfaces
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` - no stale `/spec_kit:start` routing, and the recovery order is internally consistent.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` - reviewed sections keep the target read-only, constrain lineage modes, and do not expose obvious unsafe shell interpolation beyond controlled placeholders.
- `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh` - quoted paths, fail-fast missing-file handling, and deterministic drift detection look solid.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` - cache/frontmatter helpers are narrow, side-effect free, and do not introduce obvious path traversal or mutation bugs.

## Next Focus
- Iteration 5 should inspect the remaining command/runtime wiring around debug + deep-research and any tests or fixtures that are supposed to catch CLI error-path regressions like the two advisor failures above.
