# Iteration 007

- Dimension: Traceability
- Focus: Active command assets outside agent docs
- State read first: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`

## Findings

### P1

- **NF002 - Active command docs and review/research workflows still advertise retired memory/shared surfaces.** `memory/README.txt` still tells operators to check `specs/**/memory/` and use `/memory:manage shared member`, `memory/learn.md`, `memory/save.md`, and `memory/search.md` still list `/memory:manage shared`, `memory/manage.md` still claims a four-source pipeline that includes legacy spec memory artifacts, and the deep-review/deep-research auto+confirm YAMLs still verify save success by checking `{spec_folder}/memory/*.md`. These are active operator-facing assets that no longer match the canonical continuity contract. [SOURCE: .opencode/command/memory/README.txt:318-323] [SOURCE: .opencode/command/memory/learn.md:501-505] [SOURCE: .opencode/command/memory/save.md:536-541] [SOURCE: .opencode/command/memory/search.md:768-772] [SOURCE: .opencode/command/memory/manage.md:264-271] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863-871] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995-1003] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644-652] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822-830]

## Notes

- This is distinct from F003: the stale guidance lives in command assets rather than runtime agent manuals.

## Next Focus

Iteration 008 will return to maintainability and inspect tests/README residue for dead references introduced by the remediation.
