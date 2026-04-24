# Iteration 8: Status Normalization and Review-Flag Gaps

## Focus
Finish RQ-6 by checking whether existing backfill review flags catch the observed status drift and normalization issues.

## Findings
1. Backfill only flags `ambiguous_status` when metadata says `planned` and neither `spec.md` nor `plan.md` contains a frontmatter status matching `(planned|complete|in_progress|blocked)`. It does not inspect markdown status tables or `implementation-summary.md` presence. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:120-133]
2. The corpus contains three non-canonical stored status tokens: `Complete`, `In Progress`, and `review`, which shows casing and vocabulary are not normalized at write time. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. The dominant failure mode is still silent false-`planned`, not exotic tokens. That means review-flag coverage is narrower than the real semantic status problem. [INFERENCE: based on backfill review rules plus the 259 planned-with-implementation-summary mismatches]

## Ruled Out
- Assuming existing backfill review flags are a complete safety net for status quality.

## Dead Ends
- Chasing rare casing drift before addressing the far larger planned-vs-implementation mismatch.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:120-133`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.5`
- Questions addressed: `RQ-6`
- Questions answered: `RQ-6`

## Reflection
- What worked and why: Pairing live status counts with the review-flag code showed exactly where the guardrail stops.
- What did not work and why: Status normalization issues are real, but they are secondary compared with frontmatter blindness.
- What I would do differently: Propose a single normalized status enum and a stronger fallback hierarchy in the final report.

## Recommended Next Focus
Finish the quantitative picture with cap distributions and stale `last_save_at` analysis.
