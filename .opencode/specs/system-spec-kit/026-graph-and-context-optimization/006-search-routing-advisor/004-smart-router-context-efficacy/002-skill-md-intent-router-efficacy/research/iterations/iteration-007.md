# Iteration 007: V5 Compliance Gap

## Focus Question(s)

V5 - compare the routing pattern's predicted load discipline with observed skill resource breadth in logs.

## Tools Used

- Python cross-file aggregation from V3
- Manual review of high-resource examples printed from the scan

## Sources Queried

- `.opencode/specs/**/research/iterations/iteration-*.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/sk-deep-research/SKILL.md`

## Findings

- The logs contain examples of broad resource usage that exceed a typical one-intent route, especially around `system-spec-kit`.
- One research iteration cited `system-spec-kit` plus many resources such as `environment_variables.md`, `troubleshooting.md`, `memory_system.md`, `save_workflow.md`, `trigger_config.md`, `folder_routing.md`, `sub_folder_versioning.md`, `level_specifications.md`, `template_guide.md`, `template_style_guide.md`, `phase_checklists.md`, `execution_methods.md`, and `quick_reference.md`.
- That breadth is not necessarily wrong for broad research tasks, but it shows that the prose router alone does not reliably limit resource fan-out.
- The strongest defensible compliance estimate from current artifacts is "needs-harness"; the repository lacks transcript-level Read-call logs that pair each prompt with each resource read.
- Observationally, tier compliance appears partial: agents often cite selected resources, but broad preload or broad citation still occurs in complex packets.

## Novelty Justification

This connected the deterministic tier model to actual artifact behavior and clarified why a percentage compliance estimate would overclaim.

## New-Info-Ratio

0.50

## Next Iteration Focus

V8 UNKNOWN fallback safety.
