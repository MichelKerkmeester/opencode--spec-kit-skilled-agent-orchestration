# Iteration 018 — Machine-Readable Runtime Observability

Date: 2026-04-10

## Research question
Should `system-spec-kit` add a lightweight machine-readable runtime summary for deep loops, similar to the external repo's emphasis on persisted metrics and model analytics?

## Hypothesis
Yes. The current markdown dashboard is useful for humans, but Phase 2 suggests the local system would benefit from a compact machine-readable summary for automation health, stop reasons, and iteration economics.

## Method
I compared the external loop's persisted metrics model with `system-spec-kit`'s dashboard generation rules. I focused on whether the local system already has a compact machine-readable summary artifact separate from JSONL and markdown.

## Evidence
- `[SOURCE: external/automated-loop/state_tracker.py:52-60]` The external loop maintains aggregated workflow metrics in a dedicated model.
- `[SOURCE: external/automated-loop/state_tracker.py:239-260]` It also computes per-model analytics from cycle history.
- `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:469-499]` The local dashboard is explicitly a markdown artifact generated from JSONL, strategy, and registry data for human review.
- `[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-27]` The local state model already has many artifacts, but no dedicated machine-readable runtime summary surface.

## Analysis
This is one of the cleaner "keep the architecture, improve the interface" findings. The local packet already has sufficient raw data. The problem is that downstream automation, cross-packet audits, and operational dashboards have to parse JSONL and markdown instead of reading a compact status artifact. The external toolkit's metrics discipline suggests a low-risk addition: generate a small machine-readable runtime summary from the existing reducer inputs.

That does not require a loop redesign. It complements the current dashboard rather than replacing it. It also fits well with the other Phase 2 recommendations because a typed runtime summary would make gate profiling, contract tests, and controller extraction easier later.

## Conclusion
confidence: high

finding: `system-spec-kit` should add a machine-readable runtime summary artifact for deep loops, derived from existing JSONL and registry data, so humans keep the markdown dashboard while tools and later phases get a compact operational snapshot.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-deep-research/references/state_format.md`, reducer/dashboard generation surfaces, future `research/deep-research-runtime.json`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** define a stable summary schema with stop reason, iteration counts, answered coverage, active risks, and timing metrics
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The loop already emits rich raw state and a human-readable dashboard, which is enough for manual review.
- **External repo's approach:** The loop also preserves compact metrics models that are easier to consume operationally.
- **Why the external approach might be better:** It lowers the cost of observability and makes later automation less dependent on markdown parsing.
- **Why system-spec-kit's approach might still be correct:** JSONL plus dashboard already contains the truth, so adding another artifact risks redundancy if not tightly derived.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A. Keep the current architecture, but add one derived machine-readable summary artifact.
- **Blast radius of the change:** small
- **Migration path:** Generate the summary from existing reducer outputs only; do not let it become a new source of truth.

## Counter-evidence sought
I looked for an existing local runtime summary artifact separate from JSONL and markdown. I did not find one in the current state format contract.

## Follow-up questions for next iteration
- Which fields are essential enough to make the summary stable across research and review modes?
- Should this artifact be reducer-owned or dashboard-generator-owned?
- Could the summary help future packet-level reporting without parsing each dashboard manually?
