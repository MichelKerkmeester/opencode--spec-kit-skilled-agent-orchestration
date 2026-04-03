# Iteration 081
## Focus
Autoresearch's core contract: one mutable file, one fixed metric, one lightweight instruction surface.

## Questions Evaluated
- What is the smallest useful mutable surface in this repo?
- How does the repo keep research diffs reviewable and comparable?
- What should the internal deep-research/deep-review system copy from this shape?

## Evidence
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:11-17`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/README.md:63-65`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:11-17`
- `.opencode/specs/03--skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/autoresearch-master/program.md:23-37`

## Analysis
The repo succeeds because it deliberately narrows the mutable surface: the agent edits `train.py`, the human edits `program.md`, and the rest is treated as stable infrastructure. That is a strong anti-drift pattern. The fixed 5-minute metric window gives the whole loop a stable comparison frame, while the "single file to modify" rule keeps diffs easy to inspect.

For the internal system, this suggests a similar discipline: keep the core packet state narrow, make the lifecycle contract explicit, and avoid scattering behavior across too many surfaces. A compact surface is not just simpler; it is easier to resume, fork, review, and migrate safely.

## Findings
- A small mutable surface is a real quality feature, not just a convenience.
- A fixed metric only works well when the rest of the loop is kept stable.
- `program.md` functions like a lightweight skill file, which is a good mental model for internal agent instructions.

## Compatibility Impact
- This pattern is naturally compatible with hook and non-hook CLIs because it depends on files, not runtime magic.
- The internal system should mirror this by making disk artifacts the source of truth and keeping runtime adapters thin.

## Next Focus
Study how branch identity and result logging turn that narrow surface into an actual experiment ledger.
