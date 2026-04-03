# Iteration 088
## Focus
Fork guidance and compatibility overlays without core contract bloat.

## Questions Evaluated
- How does autoresearch talk about other platforms without changing its core?
- What does it do when the core repo should stay small?
- What lesson does that offer for internal CLI compatibility?

## Evidence
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:69-81`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:83-88`

## Analysis
The README is explicit that the main repo is optimized for one environment, and that smaller or different platforms should use forks or external guidance. That is a pragmatic compatibility strategy: keep the core clean, document the edge cases, and let alternative environments specialize outside the main line.

The internal deep-research/deep-review system can use the same pattern. Hook and non-hook CLIs should share the canonical lifecycle and packet contract, while environment-specific glue lives in overlays, adapters, or runtime-specific entrypoints. The important part is that the core meaning does not splinter just because the runtime differs.

## Findings
- Compatibility notes belong in documented overlays, not in core semantics.
- Forks are a valid way to support special environments without diluting the main contract.
- A small core is easier to keep stable across multiple runtimes.

## Compatibility Impact
- This is a strong fit for hook/non-hook parity because the shared contract stays simple.
- The internal system should allow adapter variation while preserving one canonical packet model.

## Next Focus
Use the simplicity rule itself as a filter for deciding what should stay in the core and what should be pushed out.
