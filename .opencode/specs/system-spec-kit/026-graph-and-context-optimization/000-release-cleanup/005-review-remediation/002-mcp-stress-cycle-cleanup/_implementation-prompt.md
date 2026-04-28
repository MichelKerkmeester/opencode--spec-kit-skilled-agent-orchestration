# Implementation Prompt — 002-mcp-stress-cycle-cleanup

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/002-mcp-stress-cycle-cleanup`. The orchestrator has authorized this folder. DO NOT re-ask Gate 3. Proceed directly to implementation.

**TARGET AUTHORITY**: All write paths under that spec folder AND its declared dependency `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/` are pre-approved. No runtime code changes — docs and JSON sidecars only.

You are dispatched to execute the full implementation plan for the **MCP stress-cycle doc/observability cleanup**. This closes 6 P2 advisories from the 011 deep-review (PASS verdict, hasAdvisories=true). No P0/P1 — this is a tightening pass.

## YOUR INPUTS

Read in order:

1. **Spec**: .../002-mcp-stress-cycle-cleanup/spec.md — REQ-001..REQ-006.
2. **Plan**: .../002-mcp-stress-cycle-cleanup/plan.md — single-batch doc cleanup, 6 steps.
3. **Tasks**: .../002-mcp-stress-cycle-cleanup/tasks.md — T1..T9.
4. **Source review report** (READ-ONLY context): `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/review-report.md` — F-001..F-006 with file:line.

## EXECUTION CONTRACT

Execute T1..T9 from `tasks.md`. Each task is an atomic doc edit (or one JSON sidecar create). After each task:

1. Mark `[x]` in tasks.md with a one-line evidence note.

After all tasks:

2. Author `implementation-summary.md` at .../002-mcp-stress-cycle-cleanup/implementation-summary.md (L1 template — Status, What Was Built, Verification).
3. Update `_memory.continuity.recent_action` and `completion_pct` in spec.md frontmatter to 100.
4. Run validator: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation --strict`. Capture exit code.
5. ALSO run validator for THIS sub-phase: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/002-mcp-stress-cycle-cleanup --strict`.

## CRITICAL RULES

- **No runtime code changes** — docs and JSON sidecars only. If a task seems to require runtime code, STOP and write it to "Known Limitations".
- **Preserve narrative integrity**: when refreshing audit docs (T4) or context-index (T5), do NOT delete content; reorganize and patch.
- **Cite source data**: when authoring `findings-rubric.json` (T6), the per-cell scores and aggregate MUST come from 010-stress-test-rerun-v1-0-2/findings.md actual data, not invented. If the markdown narrative doesn't have the per-cell breakdown, write what IS available and note the gap in Known Limitations.
- **Mark complete + verified**: after all tasks, set spec.md status `complete` and completion_pct to 100.

## TASK SUMMARY (refer to tasks.md for details)

- **T1**: Refresh parent resource-map for 18 children.
- **T2**: Soften "monotonic decay" wording in post-stress research.
- **T3**: Update HANDOVER-deferred to point downstream to 012-018.
- **T4**: Reconcile catalog + playbook impact audits with live state.
- **T5**: Group context-index children by cycle phase.
- **T6**: Author findings-rubric.json sidecar (verdict replayability).
- **T7**: Cross-link sidecar from findings.md.
- **T8-T9**: Validators + implementation-summary.

GO. This is a focused 6-step pass. Should complete in well under 30 tool calls.
