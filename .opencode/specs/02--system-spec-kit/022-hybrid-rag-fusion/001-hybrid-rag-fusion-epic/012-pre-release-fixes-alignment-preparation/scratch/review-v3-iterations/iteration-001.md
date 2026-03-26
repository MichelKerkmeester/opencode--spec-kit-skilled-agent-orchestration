# Review Iteration 1: D3 Spec-Alignment + D7 Documentation Quality - Root Packet + Phases 002-004

## Focus
Reviewed the root coordination packet (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) plus phase specs `002-indexing-normalization`, `003-constitutional-learn-refactor`, and `004-ux-hooks-automation`. Cross-checked root claims against live child phase docs and a fresh root validator run captured at `/Users/michelkerkmeester/.copilot/session-state/9ee19c96-4e3d-4741-b455-a91188f3ed31/files/validate-root-022.txt`.

## Findings
### P0-001: Root packet falsely presents phase 015 as complete
- Dimension: D3
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:105], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:122], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/018-ux-hooks/spec.md:23-30], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/spec.md:22-30], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/021-remediation-revalidation/spec.md:22-30], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-implement-and-remove-deprecated-features/spec.md:22-31]
- Impact: The root phase map and P0 requirement text tell reviewers that the manual-testing umbrella is finished, but multiple direct child phases are explicitly `Not Started`. That is a release-readiness misstatement, not just a stale note.
- Final severity: P0

### P1-002: Root tree counts are internally contradictory and undercount live child families
- Dimension: D3 + D7
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:20], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:38-39], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:121], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/implementation-summary.md:31], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md:1-3], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md:1-5], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/spec.md:22-30], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/021-remediation-revalidation/spec.md:22-30], [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-implement-and-remove-deprecated-features/spec.md:22-31]
- Impact: The root packet alternates between `119` and `118` total numbered directories, while also understating direct-child families (`001=11`, `007=21`, `015=19`) that already have phase `012`, `022`, and `020-022` packets on disk. This makes the coordination packet unreliable as a source of current tree truth.
- Final severity: P1

### P1-003: Checklist verification claims are stale versus the current validator
- Dimension: D7
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/checklist.md:51-53], [SOURCE: /Users/michelkerkmeester/.copilot/session-state/9ee19c96-4e3d-4741-b455-a91188f3ed31/files/validate-root-022.txt:24-45]
- Impact: The checklist says phase links are valid for all 19 phases and only one warning remains, but the fresh validator run still reports 6 phase-link issues plus the template-header warning (2 warnings total). That leaves the packet overstating closure and can mislead release-readiness reviewers.
- Final severity: P1

## Cross-Reference Results
- Root `spec.md` still enumerates all 19 direct phases in the phase map; I did not find a missing phase entry for `002`, `003`, or `004`.
- Phase statuses for `002`, `003`, and `004` align with their own phase specs (`Complete` in each reviewed phase spec).
- `004-ux-hooks-automation` does have NEW-103+ scenario coverage in the central manual playbook; the defect is the root umbrella status for phase `015`, not the existence of UX-hooks playbook scenarios.

## Ruled Out
- Missing NEW-103+ coverage in the central playbook: not an issue after checking `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`.
- Missing sibling navigation in the reviewed `002`, `003`, and `004` phase specs: not observed in this pass.
- Missing root phase entries for the reviewed phases: not observed.

## Assessment
- Confirmed findings: 3
- New findings ratio: 1.00
