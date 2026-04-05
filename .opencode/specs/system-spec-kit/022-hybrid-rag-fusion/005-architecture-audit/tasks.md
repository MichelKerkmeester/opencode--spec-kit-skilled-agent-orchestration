---
title: "Tasks: Architecture Audit [template:level_3/tas [system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/tasks]"
description: "Recovered task map for the completed scripts-versus-mcp_server architecture audit."
trigger_phrases:
  - "architecture audit tasks"
  - "boundary remediation tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Architecture Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

The detailed root task bodies were replaced by the later coordination rewrite. This restored file preserves the recoverable completed task ranges and later addenda from archived review notes, ADRs, and self-audit evidence instead of inventing exact lost wording.

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the edit belongs to the standalone architecture-audit root docs.
- Re-read the target file before modifying it.
- Prefer ADRs, archived review notes, and self-audit evidence over reconstruction by memory.

### Task Execution Rules

| Rule | Expectation |
|------|-------------|
| Scope lock | Restore only the requested root docs and remove stale coordination references |
| Evidence first | Keep recoverable architecture-audit content; summarize only where exact prose is lost |
| No stale routing | Do not reintroduce child-folder routing or former coordination language |
| Honest limits | Say when later task detail is preserved only as a verified range or summary |

### Status Reporting Format
- State which root docs were restored.
- Note which task ranges are directly recoverable versus summarized from surviving evidence.
- Include validation or residual warnings.

### Blocked Task Protocol
- Stop and report if surviving evidence contradicts the recovered phase or task map.
- Stop and report if validation requires expanding scope beyond the requested cleanup.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Recovered Audit Baseline

- [x] `T000` Audit scaffolding and prerequisite infrastructure
- [x] `T001-T006` Boundary contract publication and discoverability improvements
- [x] `T007-T014` Structural cleanup across scripts/runtime seams
- [x] `T013a-T013c` Split cleanup tasks used to break out handler/helper work
- [x] `T018-T020` Sidecar cleanup and documentation-gap remediation discovered during Phase 2
- [x] `T015-T017` Enforcement automation for the architecture boundary
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Recovered Core Audit Expansion

- [x] `T021-T045` Triple-review remediation and evidence backfill
- [x] `T046-T049` Additional enforcement hardening after review remediation
- [x] `T050-T073` Code and documentation alignment work discovered during audit follow-up
- [x] `T074-T090` Merged work from former `030-architecture-boundary-remediation`
- [x] `T091-T099` Strict-pass closure for remaining documentation and architecture drift
- [x] `T100-T104` Root-save naming regression fixes
- [x] `T105-T109` Collector-path naming follow-up fixes
- [x] `T110-T114` Explicit CLI target routing fixes
- [x] `T115-T118` Guard rail for invalid phase-folder targeting
- [x] `T119-T123` Indexed direct-save render and quality closure
- [x] `T124-T129` README audit and documentation coverage follow-up preserved in surviving audit artifacts
- [x] `T130-T132` Symlink removal and canonical path restoration preserved in ADR-007
- [x] `T133-T135` Source-dist alignment enforcement preserved in ADR-008
- [x] `T140-T152` Later completed follow-up block explicitly referenced by the 2026-03-21 self-audit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Recovered Verification Notes

- [x] Recovered task ranges remain aligned with the restored standalone architecture-audit scope
- [x] Stale parent-coordination and child-phase routing tasks are removed from the root task file
- [x] Later addenda are preserved as verified ranges where exact root wording was overwritten
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All recoverable architecture-audit task ranges are represented as completed
- [x] No stale phase-decomposition or parent-coordination tasks remain
- [x] The root task file now reads as a completed standalone architecture audit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
