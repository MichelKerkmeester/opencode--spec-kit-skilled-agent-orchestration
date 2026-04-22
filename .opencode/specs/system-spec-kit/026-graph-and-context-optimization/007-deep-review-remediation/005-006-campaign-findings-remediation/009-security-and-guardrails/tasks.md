---
title: "Tasks: 009-security-and-guardrails Security and Guardrails Remediation"
description: "Task ledger for 009-security-and-guardrails Security and Guardrails Remediation."
trigger_phrases:
  - "tasks 009 security and guardrails security and guardrails remediation"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/009-security-and-guardrails"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed security and guardrails remediation"
    next_safe_action: "Orchestrator review and commit"
    completion_pct: 100
---
# Tasks: 009-security-and-guardrails Security and Guardrails Remediation
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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm consolidated findings source is readable. Evidence: consolidated-findings.md:429-443 lists Theme 9 and CF-183/CF-186.
- [x] T002 [P0] Verify severity counts against the source report. Evidence: consolidated-findings.md:532 reports Security and Guardrails P0=0, P1=2, P2=0.
- [x] T003 [P1] Identify target source phases before implementation edits. Evidence: review-report.md:73-77 cites query.ts, scan.ts, and skill-graph-db.ts for F-003/F-007.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] [P1] CF-183: [F-003] skill_graph_query leaks nested sourcePath and contentHash in several response shapes _(dimension: security)_ Source phase: 002-skill-advisor-graph/006-skill-graph-sqlite-migration. Evidence: query.ts:187-210 recursively redacts sourcePath/contentHash before response serialization; skill-graph-handlers.vitest.ts:52-83 proves all query response shapes omit internal fields.
- [x] T011 [P] [P1] CF-186: [F-007] skill_graph_scan can erase the live graph when pointed at an empty workspace directory _(dimension: security)_ Source phase: 002-skill-advisor-graph/006-skill-graph-sqlite-migration. Evidence: skill-graph-db.ts:504-521 preserves the existing graph for empty scans; skill-graph-handlers.vitest.ts:90-115 proves an empty custom root leaves live nodes intact.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 [P0] Run strict packet validation. Evidence: validate.sh --strict --no-recursive exited 0 with RESULT: PASSED, Errors: 0, Warnings: 0.
- [x] T901 [P1] Update graph metadata after implementation. Evidence: graph-metadata.json:27-44 records complete status and current code/test evidence surfaces.
- [x] T902 [P1] Add implementation summary closeout evidence. Evidence: implementation-summary.md:1 documents closeout status and verification output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly deferred
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed through targeted vitest, typecheck, build, and strict validation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
