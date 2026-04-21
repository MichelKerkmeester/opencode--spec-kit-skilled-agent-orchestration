# Iteration 010: V10 Measurement Harness

## Focus Question(s)

V10 - design an instrumented harness to measure actual Read-call compliance.

## Tools Used

- Synthesis from V1-V9
- Settings/hook surface review
- Corpus and metrics review

## Sources Queried

- `.claude/settings.local.json`
- `.gemini/settings.json`
- `.codex/config.toml`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- `.opencode/skill/*/SKILL.md`

## Findings

- The harness should log every tool read against `.opencode/skill/<skill>/{SKILL.md,references/**,assets/**}` with prompt id, selected skill, predicted intents, allowed resources, actual resources, and elapsed time.
- Prediction should be computed by a real parser for Smart Routing aliases: `INTENT_SIGNALS`, `INTENT_MODEL`, `LANGUAGE_KEYWORDS`, `TASK_SIGNALS`, `LOADING_LEVELS`, `LOAD_LEVELS`, `DEFAULT_RESOURCE`, and `DEFAULT_RESOURCES`.
- The denominator should be prompt-skill pairs, not only prompts, because a prompt can legitimately invoke multiple skills.
- The output should classify each read as `always`, `conditional_expected`, `on_demand_expected`, `extra`, `missing_expected`, or `unknown_unparsed`.
- The harness must distinguish injected context from tool-read context; otherwise "prompt brief saved tokens" and "assistant still read SKILL.md" collapse into one metric.
- A live harness is required before claiming a numeric compliance percentage.

## Novelty Justification

This converted the measurement gap into an executable telemetry design.

## New-Info-Ratio

0.28

## Next Iteration Focus

Router-shape edge cases and parser limitations.
