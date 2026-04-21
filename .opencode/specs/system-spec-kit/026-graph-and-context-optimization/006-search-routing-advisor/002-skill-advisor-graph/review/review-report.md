# Deep Review Report: Skill Advisor Graph

## 1. Executive summary

Verdict: **FAIL**. The runtime regression suite passed in the current repository, but the spec packet cannot be considered complete because two P0 blockers remain open: the compiler validation gate currently exits 2 despite being checked complete, and strict recursive packet validation exits 2 with structural/template/integrity failures.

Counts: P0=2, P1=5, P2=2. Security was covered in three passes and produced no open security findings.

## 2. Scope

Review target: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph`.

Write boundary: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/review/**`. Production code, packet docs, metadata, and runtime artifacts outside `review/**` were read-only.

Primary documents reviewed: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, `handover.md`, and child phase packets 001-008. Parent `decision-record.md` was requested but absent.

## 3. Method

The loop ran 10 iterations, rotating dimensions as requested: correctness, security, traceability, maintainability, then repeat. Evidence came from direct file reads and read-only validation commands.

Commands executed for evidence:

- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only` -> exit 2, zero-edge warnings.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health` -> exit 0, status degraded.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` -> 104/104 pass.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` -> exit 2.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| F001 | correctness | Completed compiler validation gate is false in current repo state | open | Root checklist CHK-010 marks `skill_graph_compiler.py --validate-only` complete with evidence "VALIDATION PASSED". |
| F002 | traceability | Strict recursive packet validation fails with active template and integrity errors | open | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 2. |

### P1

| ID | Dimension | Finding | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| F003 | correctness | Advisor health is degraded even though the packet only records graph-loaded success | open | `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health` returns `status: degraded`. |
| F004 | traceability | Parent docs and graph metadata still point at retired skill-advisor runtime paths | open | Root `implementation-summary.md`, `handover.md`, and `graph-metadata.json` reference `.opencode/skill/skill-advisor/scripts/*` files. |
| F005 | traceability | The requested parent decision record is absent and handover references missing review artifacts | open | The target packet root has no `decision-record.md`, although the review request included it in the parent document set to read. |
| F006 | maintainability | Child phase packets mix planned state, implemented runtime state, and incomplete Level 3 scaffolds | open | Phase 006 says SQLite migration is planned and has unchecked tasks, while the repo contains `skill-graph.sqlite` with 21 nodes and advisor health loads from SQLite. |
| F007 | maintainability | Validation and closeout claims are duplicated with stale command paths and obsolete counts | open | Multiple packet docs still claim 44/44 regression cases; the current regression run passes 104/104 total cases with 24/24 P0 cases. |

### P2

| ID | Dimension | Finding | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| F008 | correctness | Parent plan still carries obsolete 20-skill and 2KB targets | open | Root plan Definition of Done says all 20 graph-metadata files pass validation and compiled graph is under 2KB. |
| F009 | traceability | Packet status surfaces disagree between implemented docs and graph metadata | open | Root spec marks status `Implemented`, while root `graph-metadata.json` derived status is `in_progress`. |

## 5. Findings by dimension

### Correctness

- F001 [P0] Completed compiler validation gate is false in current repo state
- F003 [P1] Advisor health is degraded even though the packet only records graph-loaded success
- F008 [P2] Parent plan still carries obsolete 20-skill and 2KB targets

### Security

No open findings. Security controls observed: no shell interpolation in graph auto-compile, JSON/SQLite parsing paths are bounded, derived metadata path traversal checks are present, and conflict penalties require reciprocal declaration when source metadata is available.

### Traceability

- F002 [P0] Strict recursive packet validation fails with active template and integrity errors
- F004 [P1] Parent docs and graph metadata still point at retired skill-advisor runtime paths
- F005 [P1] The requested parent decision record is absent and handover references missing review artifacts
- F009 [P2] Packet status surfaces disagree between implemented docs and graph metadata

### Maintainability

- F006 [P1] Child phase packets mix planned state, implemented runtime state, and incomplete Level 3 scaffolds
- F007 [P1] Validation and closeout claims are duplicated with stale command paths and obsolete counts

## 6. Adversarial self-check for P0

- F001 could be downgraded only if zero-edge warnings are intentionally hard failures and the checklist is updated to say validation is expected to fail. As written, CHK-010 claims exit 0 / VALIDATION PASSED, so the P0 stands.
- F002 could be downgraded only if this packet is not expected to validate recursively. The command auto-enabled recursive validation because child phase folders exist, and the root itself also has errors, so the P0 stands.
- Regression success does not close either P0 because it validates routing behavior, not metadata compiler validity or packet structural integrity.

## 7. Remediation order

1. Fix F001: decide and implement the intended zero-edge policy, then rerun compiler validation until the documented gate is true.
2. Fix F002: repair root and child packet template/anchor/integrity failures until strict validation exits 0 or warning-only 1.
3. Fix F003: resolve health parity for the 20 routable skills plus 21 graph nodes contract.
4. Fix F004 and F005: normalize evidence paths and missing continuity targets.
5. Fix F006-F009: close child phase state drift and refresh metadata/status surfaces.

## 8. Verification suggestions

- Rerun compiler validation and capture the exact exit code and output in the checklist.
- Rerun advisor health and require `status: ok`, or explicitly document accepted degraded conditions.
- Rerun the 104-case regression suite after repair.
- Rerun strict spec validation from the root packet and each repaired child phase.
- Run a scoped path inventory for retired `.opencode/skill/skill-advisor/` evidence paths and update graph metadata after cleanup.

## 9. Appendix

### Iteration list

| Iteration | Dimension | Title | New findings | Delta churn |
| --- | --- | --- | --- | --- |
| 001 | correctness | Correctness pass on executable verification gates | F001, F003, F008 | 0.63 |
| 002 | security | Security pass on graph loading and compiler surfaces | none | 0.00 |
| 003 | traceability | Traceability pass on packet structure and evidence paths | F002, F004, F005 | 0.74 |
| 004 | maintainability | Maintainability pass on child phase closeout state | F006, F007 | 0.52 |
| 005 | correctness | Correctness recheck on runtime behavior versus packet claims | none | 0.00 |
| 006 | security | Security recheck on metadata and conflict handling | none | 0.00 |
| 007 | traceability | Traceability recheck on status and continuity surfaces | F009 | 0.18 |
| 008 | maintainability | Maintainability recheck on docs-as-system shape | none | 0.00 |
| 009 | correctness | Correctness final recheck before synthesis | none | 0.00 |
| 010 | security | Security final recheck and adversarial pass | none | 0.00 |

### Delta churn

- Iterations 001-004 found all P0/P1 blockers.
- Iterations 005-010 mostly rechecked existing findings. Low churn did not permit convergence because open P0 findings block legal stop.
- Stop reason: max iterations reached with P0 blockers open.
