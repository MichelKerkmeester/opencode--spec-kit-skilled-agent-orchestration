# Iteration 014: Baseline Context Without Reopening 021/001

## Focus Question(s)

V3/V5 refinement - relate current observations to known baseline context without re-analyzing the advisor-hook packet.

## Tools Used

- Current V3 scan output only
- User-provided known context

## Sources Queried

- User-provided known context for Phase 021/001
- Current V3 scan of `.opencode/specs/**/research/iterations/iteration-*.md`

## Findings

- The request context says prior advisor-hook research found 250 of 994 iteration files mention `SKILL.md`.
- The current scan, using the requested `.opencode/specs/**/research/iterations/iteration-*.md` pattern at this point in the repo, found 1,014 files, with 200 files mentioning a concrete `.opencode/skill/.../SKILL.md` path.
- The counts are not directly contradictory: pattern scope, repo growth, wildcard treatment, and whether generic `SKILL.md` mentions count can change totals.
- This iteration did not reopen or re-analyze 021/001; it only uses the prior number as context supplied by the user.
- Both baselines agree on the directional point: skill docs are frequently referenced in deep-loop artifacts.

## Novelty Justification

This reconciled baseline numbers while respecting the boundary against reopening the advisor-hook research.

## New-Info-Ratio

0.11

## Next Iteration Focus

Evidence strength and overclaim prevention.
