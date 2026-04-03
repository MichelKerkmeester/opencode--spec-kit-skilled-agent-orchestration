# Iteration 070
## Focus
Portable lessons from Auto-Deep-Research-main for the internal research/review system.

## Questions Evaluated
- What should we copy from this repo?
- What should we avoid copying?
- How does this repo help our hook and non-hook CLI compatibility goals?

## Evidence
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/README.md:21-118`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/core.py:38-163`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:320-486`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:575-834`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/cli.py:109-206`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/registry.py:70-177`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/flow/types.py:15-99`

## Analysis
This repo is excellent at packaging, compatibility bridging, sub-agent handoff, retries, and readable logging. It is not built to preserve a research or review lineage across sessions as a first-class packet state. That means we should copy the portability machinery, the explicit handoff patterns, and the retry discipline, but not the implicit state model. Our internal system needs a disk-first lineage graph, canonical findings registry, and deterministic reducer so both hook and non-hook CLIs can continue the same work without guessing.

## Findings
- The best ideas here are runtime portability and explicit handoff.
- The main thing to avoid is letting execution logs stand in for durable research state.
- A disk-first packet model still fits the strongest parts of this repo and keeps both CLI families compatible.

## Compatibility Impact
This repo reinforces the direction we already chose: keep disk artifacts canonical, make runtime adapters explicit, and let hooks improve convenience rather than define correctness.

## Next Focus
Use these external lessons to write implementation tasks for lineage, reducer, and parity gates.
