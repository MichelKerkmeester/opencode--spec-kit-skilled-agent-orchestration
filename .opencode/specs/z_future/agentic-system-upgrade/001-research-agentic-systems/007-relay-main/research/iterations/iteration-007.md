# Iteration 007 — Evidence-Based Completion

Date: 2026-04-09

## Research question
Is Relay's verification-owner-evidence completion pipeline applicable to `system-spec-kit`'s deep-research and orchestration workflows?

## Hypothesis
Relay's completion pipeline matches the way Public already reasons about evidence, but Public's deep-research docs do not express it explicitly.

## Method
Read Relay workflow docs and builder config, then compared them with Public's deep-research command contract.

## Evidence
- Relay workflow configs include channel names, retry strategy, and `notifyChannel` for error handling. [SOURCE: external/packages/sdk/src/workflows/README.md:134-183]
- Relay's workflow docs describe a completion decision pipeline: deterministic verification first, then owner decision, then evidence-based completion, with markers only as optional accelerators. [SOURCE: external/packages/sdk/src/workflows/README.md:210-254]
- The interactive-runner section repeats that the owner decision and evidence pipeline remain active, and that channel messages, artifacts, exit codes, and signals like `WORKER_DONE` count as evidence. [SOURCE: external/packages/sdk/src/workflows/README.md:731-740]
- The builder exposes `notifyChannel` and persists the configured swarm channel into the emitted workflow config. [SOURCE: external/packages/sdk/src/workflows/builder.ts:193-203] [SOURCE: external/packages/sdk/src/workflows/builder.ts:325-365]
- Public's deep-research command defines an iterative loop with state files, dashboards, synthesis, and memory save, but it does not define a comparable evidence/owner completion ladder for iterations or synthesis. [SOURCE: .opencode/command/spec_kit/deep-research.md:117-154]

## Analysis
Relay's workflow runner formalizes something Public currently leaves implicit: a step can complete because deterministic checks passed, because an owner reviewed it, or because the evidence bundle is already sufficient. That aligns well with Public's evidence-heavy culture. The improvement does not require realtime messaging on day one; the first value is documenting the completion ladder so future packet workflows can reuse it consistently.

## Conclusion
confidence: high
finding: Public should lift the completion-decision pattern directly into its deep-research and related packet workflows. The adoption can start as documentation and workflow-contract language before any runtime changes exist.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** decide whether owner judgment in Public maps to the orchestrator, the phase author, or an explicit reviewer role
- **Priority:** should-have (adopt now)

## Counter-evidence sought
Looked for an already-documented completion ladder in Public's deep-research command; found loop phases and outputs, but not a multi-signal completion model.

## Follow-up questions for next iteration
- Would delivery-state tracking strengthen evidence-based completion?
- Should team/fan-out/pipeline modes each have different default evidence rules?
- How much of this belongs in command docs vs. future runtime modules?
