# Iteration 052
## Focus
Reducer design for single source of truth per iteration.

## Questions Evaluated
- Which artifacts should be machine-owned vs analyst-authored?
- How can reducer avoid clobbering analyst narrative while enforcing consistency?

## Evidence
- `.opencode/skill/sk-deep-research/references/state_format.md:346-395`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:419-434`

## Analysis
Machine-owned registry should track active/resolved/disproved findings and question status; analyst-owned iteration narratives remain write-once and descriptive.

## Findings
- Introduce `deep-research-findings.json` and `deep-review-findings.json` as canonical reduced registries.
- Regenerate dashboard metrics and strategy machine sections from reducer output after each iteration append.

## Compatibility Impact
Disk-first reducer maintains non-hook runtime viability and deterministic resumes.

## Next Focus
Define lifecycle branches with concrete archive/fork directory strategy that avoids subfolder chaos.

