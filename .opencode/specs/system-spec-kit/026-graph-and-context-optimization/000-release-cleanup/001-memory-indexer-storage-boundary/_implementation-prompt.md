# Implementation Prompt — 001-memory-indexer-storage-boundary

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary`. The orchestrator (Claude) has authorized this folder for the entire implementation session. DO NOT re-ask Gate 3. Proceed directly to implementation.

**TARGET AUTHORITY**: All write paths in this prompt are pre-approved under that spec folder AND its declared dependency `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/`. You may also write runtime code under `.opencode/skill/system-spec-kit/mcp_server/`, scripts under `.opencode/skill/system-spec-kit/scripts/memory/`, tests under `.opencode/skill/system-spec-kit/mcp_server/tests/`, and the listed feature catalog + playbook docs.

You are dispatched to execute the full implementation plan for the **memory-indexer storage-boundary remediation**. This closes one P1 and 13 P2 findings from the 005 deep-review.

## YOUR INPUTS

Read these files in order (they are the source of truth):

1. **Spec**: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary/spec.md` — REQ-001..REQ-015, scope, files to change.
2. **Plan**: .../001-memory-indexer-storage-boundary/plan.md — 3-phase sequence with file:line guidance.
3. **Tasks**: .../001-memory-indexer-storage-boundary/tasks.md — T1..T26.
4. **Checklist**: .../001-memory-indexer-storage-boundary/checklist.md — verification gates.
5. **Source review report** (READ-ONLY context): `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md` — per-finding evidence.

## EXECUTION CONTRACT

Execute Phase 1 → Phase 2 → Phase 3 from the plan sequentially. Each task in `tasks.md` is an atomic action. After completing each task:

1. Mark the task `[x]` in `tasks.md` with a one-line evidence note (file:line touched, command run, test exit code).
2. Mark the corresponding `CHK-*` row in `checklist.md` with `[x]` and an EVIDENCE: file:line block.

After all tasks complete:

6. Author `implementation-summary.md` at .../001-memory-indexer-storage-boundary/implementation-summary.md using the L2 template (`.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md` if it exists; otherwise the L3 template). Include: What Was Built, How It Was Delivered (Phase 1/2/3), Key Decisions, Verification (commands + exit codes), Known Limitations.
7. Update `_memory.continuity.recent_action` and `completion_pct` in spec.md frontmatter.
8. Run final validator: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary --strict`. Capture exit code in implementation-summary.md.

## CRITICAL RULES

- **NO scope creep**: only touch files listed in spec.md §3 "Files to Change". Adjacent code is OUT OF SCOPE.
- **Test-driven**: write the regression test (T9) BEFORE wiring the SSOT predicate to checkpoint restore (T4). The test must initially fail against the unfixed code, then pass after T4.
- **Run tests after each major wire-up**: after T4 wire to checkpoints.ts, run `npx vitest run tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/checkpoint-restore-readme-poisoning.vitest.ts` and confirm both green before moving on.
- **Cite evidence with file:line**: every checklist tick MUST have `EVIDENCE: <path>:<line>` or `EVIDENCE: <command> exit <code>`.
- **NEVER bypass invariants**: when migrating call sites to the new SSOT predicate, ensure the new predicate's behavior covers the old predicate's behavior PLUS the README exclusion.
- **Mark complete + verified**: per the autonomous-completion pattern, after all tasks done, mark spec.md status `complete` and `_memory.continuity.completion_pct: 100`; add a "Verification" line in implementation-summary listing all green commands.
- **Halt and report on failure**: if any test fails after 2 attempted fixes, STOP and write the failure to implementation-summary.md "Known Limitations" rather than making further surgery. Do NOT silently skip a failing test.

## PHASES SUMMARY (refer to plan.md for details)

- **Phase 1 (T1-T10)**: SSOT predicate `isIndexableConstitutionalMemoryPath()` + 7 call-site swaps + regression test. Closes P1-001 + REQ-012.
- **Phase 2 (T11-T15)**: stable error code, walker warnings response fields, chunking helper guard. Closes P2-003, P2-004, P2-005.
- **Phase 3 (T16-T24)**: docs / ADR / runtime trace / test fixture cleanup. Closes P2-001, P2-002, P2-006..P2-013.
- **Final (T25-T26)**: validator + implementation-summary.md.

## IMPORTANT CONTEXT

- Source verdict was CONDITIONAL with adversarially-confirmed P1 (Hunter→Skeptic→Referee).
- The P1 is a real correctness issue: poisoned checkpoints can preserve constitutional README rows. The fix promotes README distinction into shared SSOT.
- The 13 P2 are mostly doc drift + observability; they cluster around the post-merge identity drift (010 → 005 packet renumber).
- 005-memory-indexer-invariants/checklist.md CHK-T15 (live MCP rescan) is OUT OF SCOPE — it's a packet-level operator gate, not a code fix.

GO. Take however many tool calls are needed. Run tests aggressively. Write everything to disk; do not hold state in your head.
