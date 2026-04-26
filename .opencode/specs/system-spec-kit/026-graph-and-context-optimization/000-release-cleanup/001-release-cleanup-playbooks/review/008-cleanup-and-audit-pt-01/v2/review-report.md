# Review Report

## 1. Executive Summary

- Session classification: fresh follow-up
- Scope: remediation follow-up audit for shared-memory retirement across runtime, packet docs, agents, commands, playbooks, and tests
- Iterations completed: 10 of 10
- Verdict: FAIL
- Stop reason: max_iterations with prior findings still open
- Severity counts: 0 P0 / 4 P1 / 1 P2
- Release readiness state: in-progress

The follow-up review confirms that the original runtime blocker is fixed: the shipped parser/save/discovery path no longer accepts or discovers `specs/**/memory/*.md`, and the lifecycle playbook examples from F004 are repaired. The packet still fails because F002 and F003 remain open, and the remediation also left new active command/workflow drift that still points operators at retired `memory/` and shared-space surfaces.

## 2. Planning Trigger

This packet still routes to remediation planning because the release narrative and active operator guidance are not yet consistent with the shipped runtime. The remaining work is smaller than the original FAIL packet, but it still spans changelog truth-sync plus agent/command cleanup.

## 3. Prior Finding Closure Status

| Finding | Prior Severity | Status | Rationale |
|---------|----------------|--------|-----------|
| F001 | P0 | **closed** | The shipped runtime now rejects legacy `memory/` paths and no longer discovers them in startup/indexing flows. The remaining create-agent/command drift is tracked as new follow-up work, not as a reopened runtime acceptance path. |
| F002 | P1 | **open** | `spec.md`, `checklist.md`, and runtime now match the drop-with-fallback story, but the changelog still claims existing databases auto-drop the column so no orphan columns remain. |
| F003 | P1 | **open** | Orchestrate/speckit cleanup landed only partway; active write/handover/speckit docs still advertise `memory/*.md` or `/memory:manage shared`. |
| F004 | P2 | **closed** | The targeted lifecycle playbooks now use canonical spec docs, and the defensive `05--lifecycle/` sweep did not surface the retired `specs/<target-spec>/memory/*.md` examples again. |

## 4. Active Finding Registry

### P1

- **F002 - Shared-space column retirement story still disagrees between release artifacts and shipped runtime.** The runtime and packet docs describe a best-effort startup `DROP COLUMN` with an older-SQLite no-op fallback, but the changelog still promises an unconditional auto-drop that leaves no orphan columns. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:65-68] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md:53-53] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534-1542] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94-94] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:257-258]
- **F003 - Cross-runtime agent docs still advertise retired memory/shared workflows.** OpenCode, Claude, and Gemini write docs still describe `memory/*.md` as continuity artifacts, Codex write still routes `memory/*.md` as a live document type, Codex speckit still lists `/memory:manage shared`, and Codex handover still renders `memory/*.md` as session context. [SOURCE: .opencode/agent/write.md:89-89] [SOURCE: .opencode/agent/write.md:230-231] [SOURCE: .claude/agents/write.md:89-89] [SOURCE: .claude/agents/write.md:230-231] [SOURCE: .gemini/agents/write.md:89-89] [SOURCE: .gemini/agents/write.md:230-231] [SOURCE: .codex/agents/write.toml:208-215] [SOURCE: .codex/agents/speckit.toml:538-539] [SOURCE: .codex/agents/handover.toml:221-225]
- **NF001 - Create-agent workflows still emit and index retired `specs/**/memory/*.md` artifacts.** The public create-agent YAMLs still write `memory_file` outputs under the retired spec-memory path and immediately pass that path to `memory_save`, which the runtime now rejects. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:568-578] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:649-666] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976]
- **NF002 - Command docs and review/research workflows still advertise retired memory/shared surfaces.** `memory/README.txt`, `memory/learn.md`, `memory/save.md`, `memory/search.md`, and `memory/manage.md` still point to `specs/**/memory/` or `/memory:manage shared`, and the deep-review/deep-research auto+confirm workflows still verify save success by checking `{spec_folder}/memory/*.md`. [SOURCE: .opencode/command/memory/README.txt:318-323] [SOURCE: .opencode/command/memory/learn.md:501-505] [SOURCE: .opencode/command/memory/save.md:536-541] [SOURCE: .opencode/command/memory/search.md:768-772] [SOURCE: .opencode/command/memory/manage.md:264-271] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863-871] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995-1003] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644-652] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822-830]

### P2

- **NF003 - `context-server.vitest.ts` still mocks the removed `findMemoryFiles` export.** The live parser README documents that the legacy discovery surface was removed, but the context-server test harness still mocks the deleted helper on both import specifiers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:907-908] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:46-46]

## 5. Dimension Coverage Summary

| Dimension | Verdict | Coverage Summary |
|-----------|---------|------------------|
| Correctness | CONDITIONAL | Runtime path retirement is correct, but create-agent workflows still route users into invalid retired memory paths. |
| Security | PASS | No live shared-memory governance, auth, or scope-enforcement residue remained after the cleanup. |
| Traceability | FAIL | The changelog, agent docs, and command assets still do not consistently describe the shipped continuity contract. |
| Maintainability | CONDITIONAL | Lifecycle playbooks are fixed, but stale test hooks and workflow verification checks remain. |

## 6. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | fail | Runtime and packet spec/checklist align, but release/command/agent artifacts still drift from shipped behavior. |
| checklist_evidence | pass | CHK-013 now matches the runtime's drop-with-fallback behavior. |
| skill_agent | notApplicable | The target is a track audit, not a single skill contract review. |
| agent_cross_runtime | fail | Active runtime agent variants still disagree on continuity and shared-memory guidance. |
| feature_catalog_code | pass | No new feature-catalog residue was needed to explain the failing verdict. |
| playbook_capability | pass | The targeted lifecycle playbooks now reflect canonical spec-document inputs. |

## 7. Recommendations / Remediation Workstreams

1. **Truth-sync the release story**
   - Rewrite the v3.4.0.0 shared-space column note so it matches the runtime and packet docs: startup drop attempt, silent no-op fallback on older SQLite.
2. **Finish the active agent cleanup**
   - Remove `memory/*.md` continuity guidance from write/handover docs and scrub `/memory:manage shared` from the remaining Codex agent assets.
3. **Repair command workflows and operator docs**
   - Update create-agent auto/confirm outputs away from `specs/**/memory/*.md`.
   - Remove retired `memory/` and shared-space references from `memory/*.md` command docs.
   - Replace `{spec_folder}/memory/*.md` save checks in deep-review/deep-research workflows with the canonical generated-support-artifact surface.
4. **Clean stale tests**
   - Remove the dead `findMemoryFiles` mocks from `context-server.vitest.ts`.

## 8. Deferred / Clean Areas

- Clean: the shipped runtime parser/save/indexing path no longer accepts or discovers legacy spec-memory files. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1263-1299] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-229]
- Clean: no new security-relevant shared-memory scope or auth residue surfaced in runtime/supporting packages. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534-1548]
- Clean: the two playbook files named in F004 now use canonical spec-doc inputs rather than `memory/` examples. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:19-19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:19-19]

## 9. Audit Appendix

- Dimension coverage: 4 of 4
- Closure status: F001 closed, F002 open, F003 open, F004 closed
- New findings introduced by the remediation: NF001, NF002, NF003
- Focused verification run: `npm run typecheck && npx vitest run tests/memory-parser-extended.vitest.ts tests/full-spec-doc-indexing.vitest.ts tests/vector-index-schema-migration-refinements.vitest.ts` completed successfully during this review
