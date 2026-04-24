## Iteration 06

### Focus

This iteration stayed on threshold drift, but moved from runtime branches into the validator itself. The key question was whether the public validation tool measures the same thresholds and gates that the runtime hooks and promotion docs describe, or whether it can "pass" while representing a different quality bar.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-02.md`
- `iteration-05.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`

### Findings

- The public validator uses a default aggregate pass threshold of `0.7` for both full-corpus and holdout slices, because both calls to `countSlice()` use the helper's default instead of a separate holdout threshold [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:231-243] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:287-291].
- The package README describes stricter promotion gates of `>= 75%` full-corpus and `>= 72.5%` holdout, so the public validation output and the documented promotion gate thresholds are currently not aligned [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:150-158].
- The runtime brief path applies per-prompt `0.8` confidence and `0.35` uncertainty filtering before a recommendation is rendered, but `advisor_validate` does not expose those effective prompt-time thresholds in its public output, so validator "pass" and hook-time "passes threshold" are not directly comparable [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:120-135] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:72-76].

### Evidence

> function countSlice(correct: number, total: number, threshold = 0.7): {
>   const percentage = total > 0 ? Number((correct / total).toFixed(4)) : 0;
>   return {
>     percentage,
>     passed: percentage >= threshold, [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:231-240]

> const fullSlice = countSlice(full.correct, corpus.length);
> const holdoutSlice = countSlice(holdoutResult.correct, holdout.length); [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:287-291]

> 1. Full-corpus top-1 >= 75%.
> 2. Holdout top-1 >= 72.5%.
> 3. Gold-none UNKNOWN count must not increase.
> 4. Safety slice (adversarial + sanitization). [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:152-155]

### Negative Knowledge

- I did not find a separate holdout threshold wired into `advisor_validate`; both slices currently share the same `0.7` helper default.
- This round did not prove the validator is useless; it proved the validator's public pass bar is not the same thing as prompt-time or promotion-time thresholding.

### New Questions

#### Threshold Drift

- Should `advisor_validate` publish the effective prompt-time thresholds alongside aggregate slice thresholds?
- Is the `0.7` default intentional technical debt or an accidental carry-over from an earlier baseline?

#### Recommendation Quality

- How much live-hook behavior can actually be inferred from this offline validator today?

#### Telemetry

- Is there any shipped runtime signal that could bridge validator outputs back to accepted or corrected recommendations?

### Status

new-territory
