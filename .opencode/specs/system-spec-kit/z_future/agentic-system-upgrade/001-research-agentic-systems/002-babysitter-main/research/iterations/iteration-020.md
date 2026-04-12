# Iteration 020 — Do Not Import Babysitter's Compression Stack Whole

Date: 2026-04-10

## Research question
Should `system-spec-kit` adopt Babysitter's four-layer compression subsystem as a major architecture move?

## Hypothesis
The answer will be no: Babysitter's compression stack is real and useful, but it belongs closer to the harness/runtime boundary than to `system-spec-kit`'s workflow core.

## Method
I compared Babysitter's built-in compression layers and configuration surface with `system-spec-kit`'s current context-budget handling and architectural priorities.

## Evidence
- Babysitter positions compression as a built-in runtime subsystem with automatic plugin registration and four distinct layers: user prompt, command output, SDK context, and process-library cache. [SOURCE: external/README.md:395-425] [SOURCE: external/packages/sdk/src/compression/config.ts:7-82]
- The density-filter implementation is a generalized sentence-level compressor with deduplication and configurable reduction targets. [SOURCE: external/packages/sdk/src/compression/density-filter.ts:45-89]
- `system-spec-kit` already has explicit context-budget management rules in the orchestrator, including collection patterns, wave sizing, and file-based overflow handling, but those are workflow-orchestration policies rather than harness-level compression hooks. [SOURCE: .opencode/agent/orchestrate.md:621-724]
- Phase 2's strongest signals from Babysitter are elsewhere: runtime-enforced gates, a cleaner memory split, a generic iteration engine, and workflow-owned validation.

## Analysis
Compression is valuable, but the fit is wrong at the `system-spec-kit` layer. Babysitter can integrate it cleanly because Babysitter is the runtime and harness shell. `system-spec-kit` is a workflow and governance framework layered across multiple runtimes. Importing a four-layer compression subsystem directly into Spec Kit would blur that boundary and add another major surface to maintain. [SOURCE: external/README.md:395-425] [SOURCE: .opencode/agent/orchestrate.md:621-724]

The more disciplined move is to keep compression as an optional harness/runtime concern and let `system-spec-kit` focus on deterministic workflow control. If later work shows a real Spec Kit-specific context bottleneck, the project can borrow measurements, thresholds, or APIs from Babysitter without importing the entire subsystem. [SOURCE: external/packages/sdk/src/compression/config.ts:7-82] [SOURCE: external/packages/sdk/src/compression/density-filter.ts:45-89]

## Conclusion
confidence: medium

finding: `system-spec-kit` should **not** adopt Babysitter's compression subsystem wholesale. The subsystem is better treated as a harness/runtime feature, while Spec Kit should spend its architectural budget on deterministic workflow control and simplification.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Manage context pressure through orchestration policy and output-shaping rules, not through a built-in multi-layer compression engine. [SOURCE: .opencode/agent/orchestrate.md:621-724]
- **External repo's approach:** Run a harness-integrated compression stack with per-layer configuration, toggles, and automatic activation. [SOURCE: external/README.md:395-425] [SOURCE: external/packages/sdk/src/compression/config.ts:7-82]
- **Why the external approach might be better:** It can reduce token usage automatically and consistently across runtime surfaces.
- **Why system-spec-kit's approach might still be correct:** Spec Kit is not the primary runtime shell, so importing harness-level compression would add maintenance and architectural coupling in the wrong layer.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep Spec Kit's current workflow-layer budget controls and only expose a small optional interface for runtime-provided compression metrics if a harness offers them.
- **Blast radius of the change:** small
- **Migration path:** none required beyond documentation of the boundary

## Adoption recommendation for system-spec-kit
- **Target file or module:** none; keep current architecture and revisit only if harness-level compression needs a light integration contract
- **Change type:** rejected
- **Blast radius:** large if misapplied
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that compression is a more urgent Spec Kit problem than workflow determinism, validation factoring, memory shape, or gate UX, and did not find it in this phase. Babysitter's compression story is strong, but it is not the most leveraged transfer for this repo right now. [SOURCE: external/README.md:395-425]

## Follow-up questions for next iteration
- Which Phase 2 findings deserve top placement in the merged priority queue?
- How should the combined report explain the difference between "keep this architecture" and "still borrow one narrow pattern from it"?
- Which packet should own the first prototype if the team chooses to act on the workflow-profile and memory-split recommendations?
