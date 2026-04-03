# Iteration 089
## Focus
The simplicity criterion as a real decision rule.

## Questions Evaluated
- Is simplicity just a slogan here, or an actual selection rule?
- When should a change be rejected even if it improves the metric slightly?
- What does that mean for the internal system's redesign work?

## Evidence
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:33-37`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:63-65`

## Analysis
Autoresearch is unusually honest about tradeoffs: tiny gains that add ugly complexity are not worth it, and deleting code while keeping or improving results is a win. That is the right kind of bias for a research system. The best architecture is not the one with the most features; it is the one that keeps the loop comprehensible and the results meaningful.

For the internal deep-research/deep-review system, this means new abstractions should only survive if they improve lineage clarity, recovery, or cross-surface parity. If an addition makes the system harder to resume, harder to compare, or harder to keep in sync, the metric improvement is probably not worth the maintenance cost.

## Findings
- Simplicity is being used as a hard filter, not a decorative slogan.
- Removing complexity is valuable when it preserves outcome quality.
- A research system should prefer clarity and recoverability over feature accumulation.

## Compatibility Impact
- Simpler contracts are easier to mirror across CLIs and runtime profiles.
- The internal system should treat contract simplicity as part of compatibility, not separate from it.

## Next Focus
Integrate all lessons into one final external-repo synthesis for the internal packet.
