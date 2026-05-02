## Dimension: correctness

## Files Reviewed

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12` - classification requirements used for the R5 pass.
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:25` - instance-only opt-out limits; all three targets remain class/cross-consumer/matrix checks.
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36` - producer, consumer, algorithm, matrix, and hostile-env inventory protocol.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/prompts/iteration-001.md:7` - cycle-3 verification scope for P1-A/P1-B/P1-C.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deep-review-state.jsonl:1` - active review state currently contains only the generation-3 config record.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review_archive/round-2-final-20260502T214111Z/deep-review-strategy.md:24` - targeted dimensions identify correctness, security, traceability, and maintainability re-checks.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review_archive/round-2-final-20260502T214111Z/deep-review-strategy.md:63` - three cycle-3 P1 remediations claimed for live strategy, copied-command execution, and affected surface hints.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review_archive/round-2-final-20260502T214111Z/deep-review-strategy.md:100` - next-focus checklist requires confirming live strategy, both plan workflows, command-shaped handling, and sk-code-review schema docs.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review_archive/round-2-final-20260502T214111Z/deep-review-strategy.md:121` - archived strategy claims the live strategy was restored in the active review root.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:215` - auto plan FIX ADDENDUM imports Planning Packet finding classes and affected surface hints.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:220` - auto plan treats imported Planning Packet fields as inert data and forbids executing or rerunning copied commands, including `activeFindings[].scopeProof`.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:576` - auto plan writing rule repeats the copied-command ban and command-shaped/shell-shaped detector.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:221` - confirm plan FIX ADDENDUM imports Planning Packet finding classes and affected surface hints.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:226` - confirm plan treats imported Planning Packet fields as inert data and forbids executing or rerunning copied commands, including `activeFindings[].scopeProof`.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:625` - confirm plan writing rule repeats the copied-command ban and command-shaped/shell-shaped detector.
- `.opencode/skill/sk-code-review/SKILL.md:313` - sk-code-review output contract includes finding class and scope proof fields.
- `.opencode/skill/sk-code-review/SKILL.md:321` - sk-code-review output contract now includes `affectedSurfaceHints`.
- `.opencode/skill/sk-code-review/references/review_core.md:75` - shared finding schema section.
- `.opencode/skill/sk-code-review/references/review_core.md:88` - shared finding schema now includes `affectedSurfaceHints`.

## Findings by Severity

### P0

None.

### P1

1. **RUN3-ITER1-P1-001 - Live strategy file is still absent from the active review root.**
   - Evidence: the archived cycle-3 strategy says the fix must restore live `review/deep-review-strategy.md` and even marks `skill_agent` as "Live strategy restored in active review root" (`review_archive/round-2-final-20260502T214111Z/deep-review-strategy.md:100`, `:121`), but the active `review/` inventory has no `deep-review-strategy.md`; `review/deep-review-state.jsonl` contains only the generation-3 config at line 1.
   - Class: `matrix/evidence`.
   - Same-class producer inventory: strategy producer/consumer surfaces are the archived strategy copy, active review root, and resume-facing state files. The archived copy exists, but the required live producer path does not.
   - Cross-consumer flow: resume/re-check instructions require the live file in `review/`; leaving it only in `review_archive/` means consumers of the active review root cannot read the restored strategy.
   - Matrix completeness: active-vs-archived axis is incomplete; archived strategy present, active strategy missing.
   - Recommendation: restore or regenerate `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deep-review-strategy.md` from the round-2 final strategy and keep it in the active review root.

### P2

None.

## Verdict -- FAIL

FAIL - P1-B and P1-C are fixed at the claimed cross-consumer/schema locations, but P1-A remains open because the live `review/deep-review-strategy.md` file is still missing from the active review root.
