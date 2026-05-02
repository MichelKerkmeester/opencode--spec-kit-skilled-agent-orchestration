# 049 Continuation Playbook

This packet (049) closes the 78 remaining findings from packet 046's deep research across 10 sub-phase children. Sub-phase 010 (cli-orchestrator-drift) was completed end-to-end as the worked-pilot. The other 9 sub-phases (001-009) are scaffolded with template stubs and need real implementation per their spec.md.

## Status snapshot (2026-05-01)

| Sub-phase | Findings | Status | Notes |
|-----------|---------:|--------|-------|
| 001-code-graph-consistency | 9 | scaffolded | F-002-A2-01..03, F-014-C4-01..04, F-004-A4-02..03 |
| 002-deep-loop-workflow-state | 5 | scaffolded | F-010-B5-01..04, F-019-D4-01 |
| 003-advisor-quality | 8 | scaffolded | F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01 |
| 004-validation-and-memory | 13 | scaffolded | F-008-B3-01..02, F-009-B4-01..05, F-005-A5-01..06 |
| 005-resource-leaks-silent-errors | 5 | scaffolded | F-003-A3-01..03, F-004-A4-01, F-004-A4-04 |
| 006-architecture-cleanup | 15 | scaffolded | F-016-D1-01..08, F-017-D2-01..03, F-018-D3-01..04 |
| 007-topology-build-boundary | 6 | scaffolded | F-019-D4-02..03, F-020-D5-01..04 |
| 008-search-quality-tuning | 5 | scaffolded | F-011-C1-01..05 |
| 009-test-reliability | 6 | scaffolded | F-015-C5-01..06 |
| **010-cli-orchestrator-drift** | **6** | **DONE** | **F-007-B2-01..06 closed in this session** |

Total: 78 findings; 6 closed; 72 remaining.

## How to resume

For each remaining sub-phase, dispatch a fresh-context Task-tool agent with this prompt template:

```
You are a LEAF agent at depth 1. You MUST NOT dispatch sub-agents or use the Task tool to create sub-tasks. Execute your work directly using your available tools. If you cannot complete the task alone, return what you have and escalate to the orchestrator.

Goal: Close the findings assigned to sub-phase NNN of packet 049 deep-research-finding-remediation.

Your packet path: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/NNN-<name>/

Source of truth for findings: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements/research/research.md

Your assigned findings: <list IDs from the table in 049/spec.md §5>

Steps (run sequentially, do NOT skip verification):
1. Read research.md and your sub-phase's current spec.md to learn the exact finding IDs and recommended fixes.
2. Re-read each finding's cited file:line in the live codebase to confirm the bug still exists at the cited location. If line numbers drifted (likely if packets 047/048 also touched the file), locate the new line by surrounding context and document the drift in your implementation-summary.md.
3. Author your sub-phase's full spec/plan/tasks/checklist (use sub-phase 010 as the template — see ../../010-cli-orchestrator-drift/ for the complete shape). Use Level 2 docs (5 spec files: spec, plan, tasks, checklist, implementation-summary).
4. Apply each fix as a surgical edit. For P1 product-code findings, also add a stress test that would have failed against the pre-fix code. Mirror packet 048's `sa-NNNb` describe-block convention (add to an existing stress file, do NOT create new files unless you must).
5. Run targeted vitest after each fix to confirm no regression: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run <changed-test-file>` 
6. Once all your assigned findings are closed: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <your-packet-path> --strict` — must exit 0.
7. Update implementation-summary.md with a "Findings closed" table containing one row per finding (ID, file, line range, fix description, evidence reference).
8. From repo root, commit with message format `fix(026/049/NNN): <category> remediation (M findings)` listing each finding ID in the body. Push to origin main immediately.
9. Return a JSON summary: { "sub_phase": "NNN-<name>", "findings_closed": [...], "deferred": [{"id": "...", "reason": "..."}], "files_modified": [...], "commit_hash": "...", "stress_baseline": "<before>", "stress_after": "<after>" }.

Hard constraints:
- Stay on `main`. Do not create feature branches.
- Never pass `service_tier=fast` to codex CLI.
- Never close a finding with a comment-only fix — every fix is real product code, schema, doc, or test change.
- For findings whose "real fix" requires architecture work beyond surgical scope (e.g. F-016-D1-06 splitting watcher), apply the minimal surgical step and document the larger refactor as deferred in implementation-summary §Known Limitations.
- For findings already remediated by adjacent packets (047, 048), document as "already remediated by NNN" and skip without claiming new credit.
- Do NOT modify files outside your sub-phase's declared scope.

When done, the orchestrator will run npm run stress to confirm no regression and then proceed to the next wave.
```

## Wave plan

- **Wave 1 (parallel, no overlap):** 002, 004, 008, 009 — four independent sub-phases (010 already done)
- **Wave 2 (parallel, no overlap with Wave 1):** 001, 003, 005, 007 — four sub-phases. Sub-phases 001/005 share `mcp_server/skill_advisor/lib/daemon/watcher.ts` — sequence them within the wave or use a single agent for both
- **Wave 3 (sequential after Waves 1-2):** 006 — architecture cleanup, biggest blast radius. Touches scorer files (003 territory) — must run after Wave 2

Between waves: master orchestrator runs `cd .opencode/skill/system-spec-kit/mcp_server && npm run stress` to confirm no regression before dispatching the next wave.

## Final assembly

After Wave 3 completes:
1. Update parent `049/spec.md` Phase Documentation Map status column to "Complete" for each sub-phase.
2. Author parent-level summary (this can be a brief addendum to the parent spec.md or a new file in parent root — but lean-trio policy means heavy docs live in the children).
3. Confirm `npm run stress` exit 0 / 56+ files / 163+ tests.
4. Confirm `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <049-path> --strict` exits 0 across all 11 packets (parent + 10 children).
5. Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` against the parent to refresh `description.json` and `graph-metadata.json`.
6. Final push to origin main.

## Known concerns

1. **Stress regression risk.** Sub-phases 001, 005, 006 touch daemon-layer code. Each must add stress tests that would have failed pre-fix and confirm `npm run stress` stays green. Wave master runs stress between waves.
2. **Architectural overreach risk.** F-016-D1-06 (split watcher service from reindex/generation orchestration) is far beyond surgical scope. Sub-phase 006 should make the minimal extraction step (e.g., extract `processSkill()` queue management into a separate module without changing public contract) and defer the full split to a follow-on packet.
3. **Schema dedup risk.** Sub-phase 006 F-018-D3-01..04 (trust-state, lifecycle status, advisor brief, MCP tool schemas) requires deriving schemas from a single tuple per concept. Done correctly this is mechanical; done incorrectly it cascades into many import path changes. Do one schema at a time, run the targeted vitest after each, validate, commit.
4. **Test reliability vs CI behavior.** Sub-phase 009 F-015-C5-02 ("split correctness from benchmark-only performance telemetry") requires deciding whether perf assertions stay in the stress run or move to a benchmark-only run. The research.md §15 open question is unanswered. Default for now: keep correctness assertions in stress, move latency budgets behind an env flag (`SPECKIT_BENCHMARK_PERF=1`).

## Key file paths

- Source of truth for findings: `046-system-deep-research-bugs-and-improvements/research/research.md`
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Stress script: `cd .opencode/skill/system-spec-kit/mcp_server && npm run stress`
- Memory save: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<inline-json>' <spec-folder>`
- Worked-pilot example: `049-.../010-cli-orchestrator-drift/` (full Level 2 doc set, six surgical edits, traceability markers)
