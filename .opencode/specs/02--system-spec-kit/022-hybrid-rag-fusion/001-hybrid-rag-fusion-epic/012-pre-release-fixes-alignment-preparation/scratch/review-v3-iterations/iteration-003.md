# Review Iteration 3: D5 Cross-Ref Integrity + D6 Patterns - 005-Architecture-Audit + 010-Template-Compliance-Enforcement

## Focus
Reviewed the full `005-architecture-audit` and `010-template-compliance-enforcement` phase folders, including packet docs plus auxiliary `memory/` and `scratch/` evidence. Cross-checked direct-phase navigation against the live `022-hybrid-rag-fusion` root packet contract and compared `010`'s spec/plan/tasks/checklist for pattern consistency.

## Findings
### P1-001: Phase 005 no longer follows the root direct-phase navigation contract
- Dimension: D5 + D6
- Evidence: [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:123-124`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md:31-40`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/spec.md:24-31`]
- Impact: The root packet says direct-child specs should expose a parent link plus explicit neighboring phase references, and `010` still follows that form. `005`'s metadata block stops at `Branch`, so reviewers can enter the packet from the root map but cannot navigate back to the root or adjacent phases using the validator-friendly pattern the family now expects.
- Final severity: P1

### P1-002: Evidence-trace links inside 005/010 auxiliary artifacts resolve to nonexistent files
- Dimension: D5
- Evidence: [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md:26`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md:101-104`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/20-03-26_15-26__architecture-audit.md:170-176`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent-output-iter-003-codex-A1.md:1-10`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/cross-ai-review-2026-03-05/codex-alpha-implementation-integrity.md:4-12`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/memory/22-03-26_19-22__deep-research-on-speckit-template-compliance.md:139-145`]
- Impact: `005` explicitly treats `scratch/` and `memory/` as critical dependencies and promises traceable supporting evidence, but its generated memory docs point to `./spec.md`, `./plan.md`, etc. from inside `memory/`, and archived scratch outputs contain malformed absolute-path markdown links. `010` repeats the same generator drift with `./research.md`, so evidence breadcrumbs in both packets do not actually resolve to the cited docs.
- Final severity: P1

### P1-003: Phase 010's live packet contract is internally contradictory
- Dimension: D5 + D6
- Evidence: [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/spec.md:42-43`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/spec.md:61-65`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/spec.md:87-99`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/spec.md:106-109`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/plan.md:31-32`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/plan.md:42-49`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/plan.md:58-65`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/plan.md:85-88`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/plan.md:99-102`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/tasks.md:85-90`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/checklist.md:33-35`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/checklist.md:73-76`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/research.md:525-563`]
- Impact: The spec now defines a **2-layer** design and explicitly removes the pre-commit hook from scope, but the plan/checklist/research-backed execution model still describe a **3-layer** rollout with hook installation, `.speckit-enforce.yaml` promotion to `block`, and hook-trigger tests. The packet also cross-references nonexistent `REQ-010` and `SC-004`, so release reviewers cannot tell which requirements and success criteria are authoritative.
- Final severity: P1

## Cross-Reference Results
- `010-template-compliance-enforcement/spec.md` still has valid direct-phase metadata navigation: `Parent Spec`, `Predecessor`, and `Successor` all point to existing 022 neighbors.
- Both target folders contain the expected top-level packet docs for their stated levels; this pass did not find a missing `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, or `implementation-summary.md`.
- `005-architecture-audit` core packet docs are structurally stronger than its auxiliary evidence layer: the broken markdown links I found were concentrated in `memory/` and `scratch/`, not in the top-level packet docs themselves.

## Ruled Out
- No phase-status drift was found between the 022 root phase map and the target phase status values for `005` (`Complete`) and `010` (`Draft`).
- `010` does not have a broken parent/sibling metadata path; its direct phase-navigation fields resolve correctly.
- Neither target packet is missing its required top-level companion docs for the level it claims.

## Assessment
- Confirmed findings: 3
- New findings ratio: 1.00
