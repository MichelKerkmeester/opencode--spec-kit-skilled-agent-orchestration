# Iteration 009 - Correctness

## Focus
Check whether the packet-local replay prompt still behaves as a correct operational entry point after the packet renumbering and closeout.

## Files Reviewed
- `prompts/deep-research-prompt.md`
- `spec.md`

## Findings
| ID | Severity | Summary | Evidence |
|----|----------|---------|----------|
| DRV-P1-007 | P1 | The packet-local deep-research prompt still invokes the legacy packet path and still frames the work as an unresolved 15-iteration research loop even though the packet root is already marked complete. | [SOURCE: prompts/deep-research-prompt.md:7-9]; [SOURCE: prompts/deep-research-prompt.md:27-41]; [SOURCE: spec.md:52-60] |

## Convergence Check
- New findings ratio: `0.14`
- Dimension coverage: `4 / 4`
- Decision: `continue`
