# Agent Brief — T-A `detect_changes` MCP Wiring Decision

You are an autonomous implementation agent. **No conversation context.** This brief is everything you need.

## Your role

Decide and execute: should `detect_changes` be wired as a callable MCP tool OR marked internal-only across all docs? Implement the chosen path consistently. Closes findings R-007-2 and R-007-14.

## Read first

1. **This batch's tasks:** `010/007-review-remediation/tasks.md` (T-A section)
2. **Phase plan:** `010/007-review-remediation/plan.md` §2 T-A
3. **Spec:** `010/007-review-remediation/spec.md` §3 (Files to Change → T-A row)
4. **Source review reports:** `010/002/review/review-report.md` (Iter 3 finding) + `010/006/review/review-report.md` (Iters 1/3)
5. **Existing code:**
   - `mcp_server/code_graph/handlers/detect-changes.ts` (the handler)
   - `mcp_server/code_graph/handlers/index.ts` (registry)
   - `mcp_server/code_graph/tools/code-graph-tools.ts` (dispatcher: TOOL_NAMES + switch)
   - `mcp_server/tool-schemas.ts` (JSON schemas)
   - `mcp_server/schemas/tool-input-schemas.ts` (Zod validators)
   - `010/decision-record.md` ADR-012-003 (route/tool/shape DEFERRED)

## Worktree

- Path: `../010-007-A`
- Detached HEAD at `bdd3c831d`

## The decision

Pick **one** of:

### Option WIRE (recommended if quick to ship)
- Add `detect_changes` to `TOOL_NAMES` in `code-graph-tools.ts`
- Add a switch case dispatching to `handleDetectChanges`
- Add JSON schema entry in `tool-schemas.ts` for the new tool
- Add Zod validator entry in `schemas/tool-input-schemas.ts`
- Add to allowed-parameter ledger
- Verify via `tsc --noEmit` clean

### Option INTERNAL (if scope-conservative)
- Update all 6 umbrella docs to mark `detect_changes` as "internal handler — MCP tool registration deferred per ADR-012-003"
- Update `010/006/INSTALL_GUIDE.md` smoke test to exercise the handler programmatically (not via MCP), OR remove the smoke test
- Update `010/002/spec.md` requirement R-002-8 to reflect handler-only registration

## Files you may touch

| File | If WIRE | If INTERNAL |
|------|---------|-------------|
| `mcp_server/code_graph/tools/code-graph-tools.ts` | MODIFY | — |
| `mcp_server/tool-schemas.ts` | MODIFY | — |
| `mcp_server/schemas/tool-input-schemas.ts` | MODIFY | — |
| `mcp_server/code_graph/handlers/index.ts` | MODIFY (no-op confirmation) | — |
| `/README.md` | sync mention | sync as internal |
| `.opencode/skill/system-spec-kit/SKILL.md` | sync mention | sync as internal |
| `.opencode/skill/system-spec-kit/README.md` | sync mention | sync as internal |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | add new tool entry | mark internal |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | smoke test fixed | smoke test rewritten |
| `010/006/feature_catalog/03--discovery/04-detect-changes-preflight.md` | update | update |
| `010/006/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` | update | update |
| `010/007-review-remediation/implementation-summary.md` | populate "Findings Closed → R-007-2/14" with decision + evidence | same |

## Files you may NOT touch

- Any other 010 sub-phase implementation-summary.md or checklist.md (T-B owns those)
- Any other code under `mcp_server/` outside the 4 listed above
- Test files (T-D/T-E own those)
- 010 phase-root spec/plan/tasks/checklist (frozen)

## Hard rules

1. **Decide first, then execute.** Record the decision and rationale in `010/007/implementation-summary.md` before making changes.
2. **Be consistent.** Every doc surface must reflect the chosen path. No mixed messaging.
3. **No new features.** Just wire what exists or mark it internal.
4. **`tsc --noEmit` must be clean** after WIRE changes.
5. **Fail closed.** If you discover the wiring is more involved than expected (e.g., requires new schema infrastructure), fall back to Option INTERNAL and document why.

## Success criteria

- [ ] R-007-2 decision recorded with rationale in `implementation-summary.md`
- [ ] R-007-14 chosen path synced across the affected files
- [ ] `cd mcp_server && tsc --noEmit` exit 0
- [ ] All references to `detect_changes` in docs are consistent (all "callable" OR all "internal")
- [ ] Commit on detached HEAD with message: `feat(010/007/T-A): wire detect_changes as MCP tool` OR `docs(010/007/T-A): mark detect_changes as internal handler`

## Output contract

- Write changes only in worktree `../010-007-A`
- Commit locally; orchestrator handles merge
- Print at end: `EXIT_STATUS=DONE | decision=<WIRE|INTERNAL> | files_changed=<N>`
