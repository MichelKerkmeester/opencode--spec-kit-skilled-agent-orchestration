# Iteration 016 — Gitignored Run-State as a Lightweight Overlay

## Research question
What can `system-spec-kit` selectively adopt from Ralph's gitignored working-file model without collapsing back to Ralph's minimal continuity stack?

## Hypothesis
Ralph's strongest low-risk overlay is not branch tracking but its use of explicitly local, non-source-of-truth run-state files that can be discarded or rolled forward without confusing the archival record.

## Method
Examined Ralph's ignored working files and archive behavior, then compared them with `system-spec-kit`'s handover and memory-save expectations.

## Evidence
- Ralph treats `prd.json`, `progress.txt`, and `.last-branch` as generated working files rather than committed source-of-truth documents. [SOURCE: external/.gitignore:1-7]
- The loop uses those files operationally: `ralph.sh` reads them, resets `progress.txt` when a new branch starts, and archives prior run state when needed. [SOURCE: external/ralph.sh:42-80]
- `system-spec-kit`'s handover and memory guidance focus on durable artifacts that are either indexed or intended for explicit continuation, not on a disposable run-local state layer. [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:20-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:146-152]

## Analysis
This is a useful simplification cue: not every continuity artifact needs to be canonical. Ralph makes it safe to have local execution-state files because they are explicitly operational and clearly outside the long-term record. `system-spec-kit` could benefit from the same distinction for long autonomous loops. The key is scoping: the lightweight overlay should live in a clearly non-authoritative place and should feed richer artifacts rather than compete with them.

## Conclusion
confidence: medium

finding: `system-spec-kit` should prototype a gitignored or clearly ephemeral run-state overlay for long autonomous workflows so next-iteration continuity does not always require handover or indexed memory reads.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** choose a standard location such as `scratch/` and document that it is non-authoritative
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for a clearly documented non-authoritative continuity layer in current `system-spec-kit` references and found durable handover and memory-save flows instead. [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:97-117] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:173-239]

## Follow-up questions for next iteration
- Does Ralph's thin failure model become dangerous once run-state is ephemeral and unindexed?
- How should `system-spec-kit` phrase task-sizing guidance when different runtimes have different handoff behavior?
- Could visual lifecycle docs make these layers easier for operators to understand?
