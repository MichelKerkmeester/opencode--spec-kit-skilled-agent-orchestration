# Iteration 038
## Focus
Deep-review artifact naming drift across SKILL, README, references, and YAML.

## Questions Evaluated
- Which surfaces use `deep-review-*` versus `deep-research-*` in review mode?
- Is drift cosmetic or behaviorally significant?

## Evidence
- `.opencode/skill/sk-deep-review/SKILL.md:190-210`
- `.opencode/skill/sk-deep-review/README.md:155-160`
- `.opencode/skill/sk-deep-review/references/state_format.md:19-34`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:83-85`

## Analysis
SKILL describes `deep-review-config.json`/`deep-review-state.jsonl`, while README/references/YAML continue using `deep-research-*` names for review packets.

## Findings
- Drift is behaviorally significant because file paths are runtime inputs for pause/resume/migration and user operations.
- Documentation and executable assets currently encode two competing contracts.

## Compatibility Impact
Without dual-read/single-write migration, renaming can break existing paused sessions.

## Next Focus
Isolate pause sentinel drift and quantify operational risk.

