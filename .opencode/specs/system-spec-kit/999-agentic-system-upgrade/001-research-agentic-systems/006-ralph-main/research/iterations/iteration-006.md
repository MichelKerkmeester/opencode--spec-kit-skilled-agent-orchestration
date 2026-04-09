# Iteration 006 — Bash Spine vs YAML Stack

## Research question
What does Ralph gain from keeping orchestration in Bash, and should `system-spec-kit` introduce a similarly minimal wrapper?

## Hypothesis
Bash is valuable here as a tiny coordination shell, not as a full workflow engine.

## Method
Used `external/ralph.sh` as the authoritative runtime, then compared its size and responsibilities with `system-spec-kit`'s deep-research command entrypoint and YAML workflow.

## Evidence
- Ralph's entire runtime loop fits in a short Bash script: parse tool/iteration args, archive old state, initialize progress, spawn the tool, check for `<promise>COMPLETE</promise>`, and either continue or exit. [SOURCE: external/ralph.sh:7-35] [SOURCE: external/ralph.sh:42-80] [SOURCE: external/ralph.sh:82-113]
- The README positions `ralph.sh` as the main loop and keeps everything else as prompts, skills, or example data files. [SOURCE: external/README.md:122-145]
- `system-spec-kit`'s deep-research command explicitly uses a Markdown setup phase plus a YAML workflow with initialization, loop, synthesis, and save phases. [SOURCE: .opencode/command/spec_kit/deep-research.md:7-23] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-174]
- The auto YAML manages config/state files, lineage, convergence checks, reducer-owned artifacts, and dispatch context construction. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:96-207] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-320]

## Analysis
Bash buys Ralph transparency and very low setup overhead. You can read the entire runtime in one file and reason about every branch. `system-spec-kit` needs more machinery because it supports validation gates, lineage, memory, and multiple lifecycle phases. Replacing that stack with Bash would throw away real capability. But Ralph does show that a thin wrapper can be useful when the operator wants a low-friction overnight loop that just calls existing contracts.

## Conclusion
confidence: medium

finding: `system-spec-kit` should not rewrite its workflow stack into Bash, but it could benefit from a small wrapper script that invokes existing validated commands in a Ralph-like loop for narrow autonomous cases. The wrapper should remain a shell over current contracts, not a second orchestration system.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/fresh-loop.sh`
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** define which existing commands it is allowed to wrap and how stop conditions are reported
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for places where Ralph's Bash runtime handled state recovery, memory retrieval, or validation quality with the same depth as `system-spec-kit` and found none; the Bash script stays intentionally minimal. [SOURCE: external/ralph.sh:42-113]

## Follow-up questions for next iteration
- Does `system-spec-kit` already have a better answer than Ralph for restart/archive isolation?
- If a wrapper exists, should it be phase-aware or only task-aware?
- How should a thin wrapper interact with memory saves and handover creation?
