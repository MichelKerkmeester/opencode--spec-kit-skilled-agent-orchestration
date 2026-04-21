# Iteration 006 - Prior Artifact Survey for Skill Reads

## Focus Questions

V7, V1

## Tools Used

- `find` for iteration corpus count
- Python scan over prior `iteration-*.md`
- `rg` for `SKILL.md`, `skill advisor`, and advisor brief mentions

## Sources Queried

- `.opencode/specs/**/research/iterations/iteration-*.md`
- `.opencode/specs/**/research/research.md`
- `.opencode/specs/**/implementation-summary.md`

## Findings

- The repository contains 994 prior deep-research iteration files under `.opencode/specs/**/research/iterations/`. (sourceStrength: primary)
- A text scan found 250 of those 994 iteration files mention `SKILL.md`, and 197 mention a repository skill path such as `.opencode/skill/.../SKILL.md`. This is a coarse proxy, not a transcript-level read counter. (sourceStrength: primary)
- Only 7 iteration files mention `skill advisor`, and none mention the exact `Advisor:` brief string. This is expected because most prior artifacts predate Phase 020 or are not hook-transcript logs. (sourceStrength: primary)
- The prior-artifact survey suggests agents frequently cite or read skill files during research, but it cannot distinguish mandatory skill loads, source citations, external repository skill reads, or post-hoc documentation. (sourceStrength: moderate)
- V7 should therefore be called `prototype-later`: evidence supports a likely reduction opportunity, but not a confirmed behavior change in live assistants. (sourceStrength: moderate)

## Novelty Justification

This pass added empirical repository-wide artifact counts for SKILL.md mentions and clarified why they are only a proxy for actual runtime reads.

## New Info Ratio

0.54

## Next Iteration Focus

Analyze the OpenCode plugin reference implementation for V8.
