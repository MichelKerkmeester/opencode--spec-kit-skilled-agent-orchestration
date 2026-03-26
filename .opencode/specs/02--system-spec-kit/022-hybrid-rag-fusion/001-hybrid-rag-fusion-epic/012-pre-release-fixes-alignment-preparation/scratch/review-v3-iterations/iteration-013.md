# Iteration 013 Review

Scope: child packets `012-query-intelligence` through `022-implement-and-remove-deprecated-features` under `015-manual-testing-per-playbook`

Dimensions: `D4 Completeness` + `D7 Documentation Quality`

## Findings

### P1-001 [P1] The final three child packets (`020`-`022`) are placeholder specs, not complete manual-testing packets, and they are not backed by the canonical playbook inventory

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/` (directory listing)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/021-remediation-revalidation/` (directory listing)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-implement-and-remove-deprecated-features/` (directory listing)
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/spec.md:32-58`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/021-remediation-revalidation/spec.md:32-58`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/022-implement-and-remove-deprecated-features/spec.md:36-57`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:14-33`
- Evidence: Each of `020`, `021`, and `022` contains only `spec.md` and `description.json`; they do not include the expected Level 2 execution artifacts (`plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) that the executed phase packets around them already carry.
- Evidence: Their scenario rows are not mapped to canonical playbook files under `manual_testing_playbook/20--*`, `21--*`, or `22--*`. Instead, the packets point at `../../007-code-audit-per-feature-catalog/...` and define custom `PB-020-*`, `PB-021-*`, and `PB-022-*` IDs derived from audit/meta-work, not from the manual-testing playbook.
- Evidence: The canonical playbook root still enumerates only `01--retrieval/` through `19--feature-flag-reference/` as source artifacts. There is no canonical `20`, `21`, or `22` playbook category in the source-of-truth list.
- Risk: Release-readiness reviewers cannot treat `020`-`022` as completed manual-testing phases. They have no execution packet, no verdict coverage, and no canonical playbook traceability, yet they now sit inside the same parent tree as executed playbook-backed phases.
- Recommendation: Either remove/archive `020`-`022` from `015-manual-testing-per-playbook` and track them under a separate audit/remediation parent, or formally extend the canonical playbook and add the full Level 2 document set plus verdict evidence before counting them in release readiness.

### P1-002 [P1] `013-memory-quality-and-indexing` falsely reports a fully verified checklist even though new P1 follow-up items remain unchecked

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing/checklist.md:154-163`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing/checklist.md:173-178`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing/implementation-summary.md:40-46,87`
- Evidence: The checklist summary says `P1 Items | 7/7` verified and stamps a `Verification Date` of `2026-03-22`.
- Evidence: Immediately after that summary, the same checklist appends new unchecked follow-up items, including three unresolved P1 checks: `CHK-102`, `CHK-104`, and `CHK-105`.
- Evidence: The implementation summary still presents the packet as complete, with `34` exact IDs, `34 PASS`, `0 PARTIAL`, `0 FAIL`, and `Coverage: 34/34 exact IDs executed`.
- Risk: A release reviewer reading the summary block or implementation summary will conclude the packet is fully closed, even though the packet itself now carries open P1 verification work added after the summary was frozen.
- Recommendation: Recompute the verification summary after adding follow-up checks, or move the new follow-up items into a separate explicitly deferred section that does not contradict the packet's claimed completion state.

### P1-003 [P1] Six executed second-half packets still self-report `Not Started`, extending the umbrella/child status drift into phases `012`-`019`

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/012-query-intelligence/spec.md:27-31`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/012-query-intelligence/implementation-summary.md:24-29`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing/spec.md:22-29`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing/implementation-summary.md:40-46,87`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/015-retrieval-enhancements/spec.md:22-26`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/015-retrieval-enhancements/implementation-summary.md:23-27,53-55`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/017-governance/spec.md:22-26`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/017-governance/implementation-summary.md:23-27,47-49`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/018-ux-hooks/spec.md:21-25`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/018-ux-hooks/implementation-summary.md:54-61`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/019-feature-flag-reference/spec.md:22-26`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/019-feature-flag-reference/implementation-summary.md:33-48`
- Evidence: `spec.md` still says `Not Started` for `012`, `013`, `015`, `017`, `018`, and `019`.
- Evidence: Those same folders carry execution artifacts that read as completed work: `012` says `Complete — 10/10 scenarios verdicted`; `013` reports `34 PASS` and `34/34 exact IDs executed`; `015` reports `11/11 (100%)`; `017` reports `5/5 PASS`; `018` reports `Coverage | 11/11 (100%)`; and `019` says all 8 scenarios returned PASS with `Pass Rate: 8/8 (100%)`.
- Risk: The second half of the packet is still not status-coherent. A reviewer cannot trust the top-level metadata in `spec.md` without cross-reading `implementation-summary.md` and `checklist.md`, which defeats the packet's role as release evidence.
- Recommendation: Normalize status semantics across each phase packet so `spec.md`, `checklist.md`, and `implementation-summary.md` all express the same execution state. Until then, the parent packet should not advertise completion.

### P2-001 [P2] `019` and `020` reuse the same `feature-flag-reference` slug, creating ambiguous folder naming inside one parent packet

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/019-feature-flag-reference/description.json:2-14`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/description.json:2-15`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/019-feature-flag-reference/spec.md:38-43`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/020-feature-flag-reference/spec.md:40-44`
- Evidence: Both packets use the same `folderSlug` value, `feature-flag-reference`, in `description.json`.
- Evidence: The specs are only distinguished by prose qualifiers (`feature-flag-reference phase` vs `feature-flag-reference audit phase`), while the actual directory names differ only by numeric prefix.
- Risk: Human reviewers and any tooling that keys off folder slug or short-name semantics can easily conflate the executed playbook-backed Phase `019` with the new audit-derived placeholder Phase `020`.
- Recommendation: Rename `020` to a unique slug such as `020-feature-flag-reference-audit` (and update metadata references) if it remains in this tree at all.

## Sweep Notes

| Check | Result | Notes |
|---|---|---|
| Required docs present for each child? | Mixed | `012`-`019` have the expected Level 2 packet set. `020`-`022` contain only `spec.md` and `description.json`, so they are incomplete as review packets. |
| Are verdicts documented? | Mixed | `012`-`019` document final verdict coverage. `020`-`022` have no `implementation-summary.md` or checklist evidence, so they provide no verdict trail. |
| Are scenarios traceable to the canonical playbook? | Mixed | `012`-`019` map to the canonical `manual_testing_playbook/12--...` through `19--...` categories. `020`-`022` are traceable only to `007-code-audit-per-feature-catalog`, while the canonical playbook root still stops at `19`. |
| Any `Not Started` phases while the parent packet says `Complete`? | Yes | Status drift persists across executed packets `012`, `013`, `015`, `017`, `018`, `019`, and the newly added placeholder phases `020`, `021`, `022` are also `Not Started`. |
| Any checklist summary drift? | Yes | `013-memory-quality-and-indexing` says `P1 7/7` verified, but later adds unchecked P1 follow-up items. |
| Duplicate folder names/slugs? | Yes | `019-feature-flag-reference` and `020-feature-flag-reference` share the same slug and near-identical labeling. |

## Review Summary

- Files reviewed: child packets `012` through `022` plus the canonical playbook root
- Overall assessment: `REQUEST_CHANGES`
- Main blockers: non-canonical/incomplete `020`-`022` packets, stale execution status across executed second-half phases, and `013`'s incorrect checklist summary
