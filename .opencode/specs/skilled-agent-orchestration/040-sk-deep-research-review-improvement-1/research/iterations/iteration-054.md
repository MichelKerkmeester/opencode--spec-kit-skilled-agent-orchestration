# Iteration 054
## Focus
Review naming unification and sentinel migration window.

## Questions Evaluated
- Which names should be canonical after migration?
- How to preserve in-flight sessions during transition?

## Evidence
- `.opencode/skill/sk-deep-review/SKILL.md:190-210`
- `.opencode/skill/sk-deep-review/README.md:155-160`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:83-85,307-310`

## Analysis
Two viable options exist: converge everything to `deep-research-*` or to `deep-review-*`. Given current command assets, converging to `deep-review-*` offers clearer mental model but requires broader migration.

## Findings
- Use dual-read/single-write: read both naming families and both sentinel names; write only canonical names once chosen.
- Emit migration event and deprecation warnings for legacy references.

## Compatibility Impact
Minimizes breakage during phased rollout across docs, commands, and playbooks.

## Next Focus
Define parity gate suite across runtime mirrors and command/skill docs.

