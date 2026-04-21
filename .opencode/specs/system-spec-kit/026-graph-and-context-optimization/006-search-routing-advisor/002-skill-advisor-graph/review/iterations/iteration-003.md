# Iteration 003: traceability

## State Read

- Prior iterations considered: 001-002
- Registry before pass: 3 open finding(s)
- Focus dimension: traceability

## Scope Reviewed

- spec.md
- plan.md
- tasks.md
- checklist.md
- implementation-summary.md
- description.json
- graph-metadata.json
- handover.md
- memory/13-04-26_18-25__completed-20-iteration-deep-review-via-gpt-5-4.md
- 001-research-findings-fixes/{spec,plan,tasks,checklist,implementation-summary}.md
- 002-manual-testing-playbook/{spec,plan,tasks,checklist,decision-record}.md
- 003-skill-advisor-packaging/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md
- Additional implementation and child packet evidence listed in `deep-review-strategy.md`

## Findings

### F002 [P0] Strict recursive packet validation fails with active template and integrity errors

Dimension: traceability

Evidence:
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 2.
- Root packet errors include missing required anchors, template header deviations, handover links to missing markdown files, and continuity freshness drift.
- Recursive child validation reports additional Level 3 gaps, including missing `decision-record.md` in phases 006 and 008 plus many missing anchors/template sections.

Impact: The review target is not a structurally valid completed spec packet, so memory retrieval, handover, and future phase work can route through broken or stale surfaces.

Remediation: Run a dedicated packet-repair pass before claiming completion: restore active templates/anchors, fix missing handover targets, add required Level 3 files, and rerun strict validation to exit 0 or warning-only 1.

### F004 [P1] Parent docs and graph metadata still point at retired skill-advisor runtime paths

Dimension: traceability

Evidence:
- Root `implementation-summary.md`, `handover.md`, and `graph-metadata.json` reference `.opencode/skill/skill-advisor/scripts/*` files.
- Those paths do not exist in the current repo; live files are under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/*`.
- Direct file lookup found `skill_advisor.py`, `skill_graph_compiler.py`, `skill-graph.json`, and regression fixtures only under the `system-spec-kit/mcp_server/skill-advisor` package.

Impact: Evidence links and memory metadata lead future agents to nonexistent files, making verification and repair unnecessarily brittle.

Remediation: Normalize parent docs, graph metadata, handover, and child packet references to the live package path or use a documented alias if one is intentionally supported.

### F005 [P1] The requested parent decision record is absent and handover references missing review artifacts

Dimension: traceability

Evidence:
- The target packet root has no `decision-record.md`, although the review request included it in the parent document set to read.
- Strict validation reports `handover.md` references missing markdown files including `iteration-010.md`, old `011-skill-advisor-graph/...` paths, and old playbook paths.
- A saved memory entry lists `../decision-record.md` and `./review/review-report.md` as canonical sources, but the root decision record and prior review report were not present before this run.

Impact: The packet continuity ladder points to unavailable material, so recovery can replay stale context or fail to reconstruct the design decisions behind the current state.

Remediation: Add or intentionally omit a parent decision record with documented rationale, then repair handover links to current packet-relative paths and existing review artifacts.


## Dimension Assessment

The traceability pass found the largest gap: strict recursive packet validation fails, parent evidence paths point to retired locations, and recovery surfaces reference missing parent/review artifacts.

Evidence highlights:
- Strict validator exits 2 with root and recursive errors.
- Root docs and graph metadata cite `.opencode/skill/skill-advisor/scripts/*`, while live files are under system-spec-kit/mcp_server/skill-advisor.
- Parent `decision-record.md` was absent before this review packet was written.

## Delta

- New finding IDs: F002, F004, F005
- Severity-weighted newFindingsRatio: 0.74
- Convergence note: New material finding(s) keep the loop active.
