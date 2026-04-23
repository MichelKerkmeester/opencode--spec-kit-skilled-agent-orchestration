## Iteration 03
### Focus
Trace the Copilot large-prompt wrapper path and identify why it remains a stuck-wrapper risk instead of a fully-hardened executor branch.

### Findings
- The Phase 019 plan explicitly required a large-prompt fallback that references the rendered prompt file with `@path`, and the YAML now contains that branch, but the implementation summary still records only command-shape testing rather than a live dispatch proof. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/plan.md:108-127; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md:77-80,180-199]
- The wrapper path depends on Copilot honoring `@PROMPT_PATH` inside a natural-language prompt string; that behavior is noted in YAML as an assumption, not an invariant backed by runtime validation. [Evidence: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:538-551]
- The prior 30-iteration executor research identified the Copilot `@path` fallback as still unshipped hardening, which means the current packet closed the syntax branch but did not close the operational evidence gap. [Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-pt-01/research.md:57-60,199-201,229-230]
- `cli-matrix.vitest.ts` only mirrors the YAML string shape; it never proves that the wrapper path actually writes iteration artifacts under a real Copilot invocation. [Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:8-160]

### New Questions
- Should the Copilot branch switch to an explicit file-ingestion primitive instead of natural-language `@path` indirection?
- Do we need a packet-local smoke test that forces the `>16384` path and verifies artifact writes?
- Is the 16 KB threshold itself grounded in Copilot limits, or is it only a shell-arg heuristic?

### Status
converging
