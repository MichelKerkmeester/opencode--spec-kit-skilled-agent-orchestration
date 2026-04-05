# Iteration 087
## Focus
Fixed preprocessing and immutable evaluation as the trust boundary.

## Questions Evaluated
- What parts of autoresearch are intentionally off-limits?
- Why is the metric comparable across runs?
- What does this imply for the internal deep-research/deep-review packet model?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:30-32`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:38-45`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:91-113`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:141-203`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/prepare.py:343-365`

## Analysis
prepare.py makes the evaluation contract very clear: context length, time budget, and eval token count are fixed; data download and tokenizer training are one-time prep; `evaluate_bpb` is the immutable scorekeeper. That is the kind of hard boundary a research loop needs if it wants comparisons to mean anything.

For the internal system, this maps directly to canonical review and research scoring. If the evaluation surface shifts casually, then every follow-on conclusion becomes suspect. The packet should therefore treat its own reducer and findings registry as fixed metric infrastructure, not as prose that can drift on the side.

## Findings
- Fixed preprocessing helps preserve comparability.
- The eval function is the real trust anchor, not the training loop.
- One-time prep plus immutable scoring is a strong pattern for any iterative system.

## Compatibility Impact
- The metric contract is portable because it is file-based and deterministic.
- The internal system should copy the immutability principle even if it cannot copy the exact training setup.

## Next Focus
Look at how the README handles platform forks and smaller-compute advice without bloating the core repo.
