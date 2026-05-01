# Iteration 009 — Headless Internal Runner

Date: 2026-04-09

## Research question
Would a built-in internal harness or headless runner materially improve CI and overnight Spec Kit workflows?

## Hypothesis
Babysitter's built-in internal harness will map well onto `system-spec-kit`'s overnight research, validation-first packet work, and CI-style automation needs.

## Method
I reviewed Babysitter's internal-harness story and capability model, then compared that with `system-spec-kit`'s current script inventory and command surfaces.

## Evidence
- Babysitter documents an `internal` harness that runs processes without an external AI coding agent and still uses the same event-sourced journal. [SOURCE: external/README.md:148-164]
- The harness capability model explicitly includes `Programmatic`, `SessionBinding`, `StopHook`, `Mcp`, and `HeadlessPrompt`, which makes headless execution a first-class design concern rather than a one-off script path. [SOURCE: external/packages/sdk/src/harness/types.ts:17-29] [SOURCE: external/packages/sdk/src/harness/types.ts:76-90]
- Harness discovery always reports the `internal` harness as installed, even if no external harness CLI is present. [SOURCE: external/packages/sdk/src/harness/discovery.ts:209-237]
- `system-spec-kit` has strong script tooling for validation, memory save, and related operations, but those are discrete CLIs rather than a single headless workflow runner. [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:25-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:90-118]

## Analysis
Babysitter shows that headless orchestration becomes much more useful when it is treated as the same workflow engine, not as a separate automation path. That matters for `system-spec-kit` because overnight research, phase validation, and packet recovery are already automation-heavy and would benefit from a runner that can execute the same workflow contract in CI or unattended sessions. [SOURCE: external/README.md:148-164] [SOURCE: external/packages/sdk/src/harness/discovery.ts:209-237]

Today, `system-spec-kit` has excellent building blocks but not a unified runner surface. The likely win is a small internal runner for a few command workflows, not a full Babysitter clone. [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:25-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:90-118]

## Conclusion
confidence: medium

finding: `system-spec-kit` should prototype a headless internal runner for one or two high-value workflows, especially deep research and strict validation packets. The goal is not general agent orchestration; it is reliable unattended execution of already-defined Spec Kit workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/`, `.opencode/command/spec_kit/`, and related workflow assets
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** decide which workflow contracts are safe for unattended execution and how runtime manifests resolve active harness context
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing unified headless workflow runner in `system-spec-kit` and found only individual scripts plus markdown/YAML command definitions. [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:25-28] [SOURCE: .opencode/skill/system-spec-kit/scripts/README.md:90-118]

## Follow-up questions for next iteration
- What lifecycle hooks would a headless runner need to expose for auditing and metrics?
- Should headless execution emit the same journal events proposed in iteration 001?
- Which existing hook surfaces in `system-spec-kit` are too narrow for that role?
