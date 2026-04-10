# Iteration 044
## Focus
Context-prime output contract parity.

## Questions Evaluated
- Is structural context represented equally across runtime-specific context-prime definitions?
- Can resume consumers rely on a common output schema?

## Evidence
- `.opencode/agent/context-prime.md:130-134`
- `.codex/agents/context-prime.md:129-133`

## Analysis
OpenCode context-prime includes a dedicated "Structural Context" section in the Prime Package template; Codex variant omits it in equivalent output block.

## Findings
- Prime Package schema diverges for structural context.
- Downstream tooling that expects one schema risks partial parsing/feature degradation.

## Compatibility Impact
Non-hook recovery quality can vary by runtime profile, even with same underlying memory servers.

## Next Focus
Deep dive external Auto-Deep-Research runtime behaviors for reusable reliability patterns.

