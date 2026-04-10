# Iteration 012 — Fixed-Shape Retry Packet, Not Level Arbitration

Date: 2026-04-10

## Research question
Should a future retry workflow in `system-spec-kit` reuse the full Level 1/2/3+ spec-folder classification model, or does the external repo point toward a fixed-shape packet for retry state?

## Hypothesis
Retry state should use a fixed packet shape. The Level 1/2/3 model is valuable for durable feature documentation, but it is the wrong control surface for high-churn attempt state.

## Method
I compared Get It Right's small repository and state surface with `system-spec-kit`'s spec creation and validation machinery to see whether retry packets would inherit unnecessary document branching.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:162-177] The external repo ships a fixed artifact set: one workflow, three agent docs, three explanation docs, and no documentation-level branching.
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:73-100] `system-spec-kit`'s implementation workflow is parameterized around Level 1/2/3 required files.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:225-244] Spec creation advertises four documentation levels with different addendums and file expectations.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/create.sh:590-880] Phase mode injects parent maps, handoff tables, child folders, `memory/`, `scratch/`, and description generation for each phase child.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-99] Validation rules and level detection are designed around durable spec docs such as `checklist.md` and `decision-record.md`.
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:531-616] Recursive validation automatically walks child phases and aggregates phase results.

## Analysis
The Level model solves a real problem for long-lived feature work: it makes durable planning and verification artifacts explicit. Retry packets have a different job. They need enough structure to preserve the feedback bridge, objective check results, and attempt history. For that problem, Level arbitration adds branching without adding much signal. If retry packets inherit the full level system, the controller becomes responsible for deciding whether attempts deserve `checklist.md`, `decision-record.md`, phase maps, and recursive validation. The external repo's small surface suggests a cleaner answer: fixed retry artifacts with no level negotiation.

## Conclusion
confidence: high
finding: `system-spec-kit` should keep Level 1/2/3+ for durable feature documentation, but retry-mode state should use a fixed artifact set instead of re-entering documentation-level arbitration.

## Adoption recommendation for system-spec-kit
- **Target file or module:** retry packet conventions plus `create.sh` / `validate.sh` routing rules
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define the canonical retry artifact inventory and tell validators to treat it as a separate mode
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** packet structure is selected through documentation levels and, in phase mode, expanded into parent-child spec documents with recursive validation.
- **External repo's approach:** the workflow assumes one fixed, purpose-built state shape for its retry loop.
- **Why the external approach might be better:** retry packets stay predictable, branch-free, and easier to automate because every attempt uses the same artifact contract.
- **Why system-spec-kit's approach might still be correct:** durable feature work benefits from explicit documentation depth and verification expectations.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** introduce a fixed retry packet shape under the existing phase folder, for example `retry/feedback.md`, `retry/state.jsonl`, `retry/checks/`, and `retry/report.md`, without Level 1/2/3 branching.
- **Blast radius of the change:** medium
- **Migration path:** add retry packet validation as an opt-in mode first; do not disturb existing Level 1/2/3 feature packets.

## Counter-evidence sought
I looked for evidence that attempt-scoped artifacts already benefit from Level 1/2/3 branching and found only feature-planning and completion-oriented uses.

## Follow-up questions for next iteration
- Which retry artifacts are mandatory versus generated views?
- Should retry packets live under `research/`, `scratch/`, or a new sibling folder?
- How should completion promote retry findings into durable spec docs?
