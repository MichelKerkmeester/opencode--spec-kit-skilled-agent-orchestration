# Implementation Prompt — 003-skill-advisor-fail-open

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open`. The orchestrator (Claude) has authorized this folder for the entire implementation session. DO NOT re-ask Gate 3. Proceed directly to implementation.

**TARGET AUTHORITY**: All write paths under that spec folder AND its declared dependency `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/` are pre-approved. You may also write runtime code under `.opencode/skill/system-spec-kit/mcp_server/`, plugin code under `.opencode/plugins/`, tests under `.opencode/skill/system-spec-kit/mcp_server/tests/`.

You are dispatched to execute the full implementation plan for **skill-advisor release remediation**. This closes 3 P1 release blockers and 15 P2 advisories from the 008/008 deep-review.

## YOUR INPUTS

Read these files in order (source of truth):

1. **Spec**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open/spec.md` — REQ-001..REQ-018, scope, files to change.
2. **Plan**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open/plan.md` — 4-phase sequence with file:line guidance.
3. **Tasks**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open/tasks.md` — T1..T26.
4. **Checklist**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open/checklist.md` — verification gates.
5. **Source review report** (READ-ONLY context): `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/review-report.md` — per-finding evidence at file:line.

## EXECUTION CONTRACT

Execute Phase 1 → Phase 2 → Phase 3 → Phase 4 from the plan sequentially. Each task in `tasks.md` is an atomic action. After completing each task:

1. Mark the task `[x]` in `tasks.md` with a one-line evidence note (file:line touched, command run, test exit code).
2. Mark the corresponding `CHK-*` row in `checklist.md` with `[x]` and an EVIDENCE: file:line block.

After all tasks complete:

3. Author `implementation-summary.md` at `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open/implementation-summary.md` using the L2 template. Include: What Was Built, How It Was Delivered (Phase 1/2/3/4), Key Decisions, Verification (commands + exit codes), Per-finding disposition table for all 18 source findings.
4. Update `_memory.continuity.recent_action` and `completion_pct` in spec.md frontmatter.
5. Run final validator: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open --strict`. Capture exit code.

## CRITICAL RULES

- **Test-driven for P1s**: write the regression test (T2/T6/T7) BEFORE the corresponding fix. Test must initially fail, pass after fix.
- **NO scope creep**: only touch files listed in spec.md §3 "Files to Change". Adjacent code is OUT OF SCOPE.
- **Cite evidence with file:line**: every checklist tick MUST have `EVIDENCE: <path>:<line>` or `EVIDENCE: <command> exit <code>`.
- **Phase order matters**: Phase 1 P1 closures gate the rest; Phase 2 turns Phase 1 scaffolds green; Phase 3+4 batch advisories.
- **Halt and report on failure**: if any test fails after 2 attempted fixes, STOP and write the failure to implementation-summary.md "Known Limitations" rather than making further surgery.
- **Mark complete + verified**: after all tasks done, set spec.md status `complete` and `_memory.continuity.completion_pct: 100`; add a "Verification" line in implementation-summary listing all green commands.

## PHASES SUMMARY (refer to plan.md for details)

- **Phase 1 (T1-T8)**: 3 P1 closures with regression tests. Release-blocking.
- **Phase 2 (T9-T11)**: Live-path corruption recovery + concurrent rebuild safety. Closes REQ-007, REQ-008, completes REQ-003 coverage.
- **Phase 3 (T12-T19)**: Doc / ADR / diagnostic batch (10 advisories).
- **Phase 4 (T20-T24)**: Pattern consolidation (5 advisories — parallelizable with Phase 3).
- **Final (T25-T26)**: Validator + implementation-summary.

## IMPORTANT CONTEXT

- All 3 P1s adversarially confirmed in synthesis (Hunter→Skeptic→Referee).
- The unified advisor runtime is broadly sound; these are boundary conditions, not architectural rewrites.
- `runWithBusyRetry` already exists at `watcher.ts:111` — reuse it, don't duplicate.
- `callerContext` already built at `context-server.ts:925` — thread it, don't re-engineer.
- Existing scoring tests must remain green throughout (no scoring algorithm changes).

GO. Take however many tool calls are needed. Run tests aggressively. Write everything to disk; do not hold state in your head.
