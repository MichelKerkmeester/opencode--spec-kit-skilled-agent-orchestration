# Iteration 018 — Deterministic Workflow Simulation Tests

Date: 2026-04-10

## Research question
Does Babysitter's testing approach suggest a better test philosophy for `system-spec-kit`'s workflow runtime?

## Hypothesis
Babysitter's tests will prove that deterministic replay and corruption recovery deserve first-class runtime tests, not just schema and parity checks.

## Method
I compared Babysitter's deterministic harness and state-cache tests with `system-spec-kit`'s current deep-research/deep-review reducer and parity tests.

## Evidence
- Babysitter explicitly tests that replaying the same seeded run produces identical journal and state snapshots across resume flows. [SOURCE: external/packages/sdk/src/runtime/__tests__/deterministicHarness.test.ts:26-35] [SOURCE: external/packages/sdk/src/runtime/__tests__/deterministicHarness.test.ts:51-82]
- It also tests corrupted state-cache recovery, journal-head comparison, and normalized legacy snapshot handling. [SOURCE: external/packages/sdk/src/runtime/replay/__tests__/stateCache.test.ts:35-156]
- `system-spec-kit`'s deep-research tests currently emphasize reducer idempotence, registry/dashboard synchronization, and contract parity across multiple mirrored assets. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:225-258] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-100]
- Deep-review tests likewise protect schema stability and mirror parity. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-110] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:14-107]

## Analysis
The current Spec Kit tests are not weak; they are pointed at a different risk. They protect document/runtime parity and reducer contracts. Babysitter reveals the missing half: deterministic runtime simulation. If `system-spec-kit` moves further toward runtime-owned workflow control, it will need tests that can seed a run, force an interruption, resume, and verify identical artifacts and gate transitions. [SOURCE: external/packages/sdk/src/runtime/__tests__/deterministicHarness.test.ts:26-82] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:24-100]

That means Phase 2's architectural recommendations depend on a test shift. A generic loop engine, runtime-owned gates, or a split session/memory model will all be safer if the repo can replay representative workflow runs in a deterministic harness rather than relying only on schema and parity assertions. [SOURCE: external/packages/sdk/src/runtime/replay/__tests__/stateCache.test.ts:35-156] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-110]

## Conclusion
confidence: high

finding: Babysitter's test philosophy suggests `system-spec-kit` should add deterministic workflow simulation tests for command lifecycles, gate transitions, interruption/resume flows, and state repair. The current parity tests are necessary, but not sufficient for the more runtime-driven architecture now under consideration.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/tests/`, `.opencode/command/spec_kit/assets/`
- **Change type:** new tests
- **Blast radius:** medium
- **Prerequisites:** define a minimal fake-run harness for `spec_kit` command workflows and a stable artifact snapshot format
- **Priority:** should-have

## Counter-evidence sought
I looked for existing deterministic end-to-end workflow replay tests in `system-spec-kit` and found reducer/parity coverage, but not seeded interruption/resume simulation comparable to Babysitter's runtime harness. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:225-258] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-110]

## Follow-up questions for next iteration
- Should unattended loops also carry a simple time-based runaway detector?
- If timing guards are added, where should their state live?
- Is Babysitter's compression subsystem solving a central Spec Kit problem, or would importing it mostly add surface area?
