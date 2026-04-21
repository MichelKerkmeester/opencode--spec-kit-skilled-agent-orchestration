# Review Report

## 1. Executive Summary

- Session classification: fresh
- Scope: memory system deprecation completion across runtime, scripts, agents, playbooks, and packet evidence
- Iterations completed: 20 of 20
- Verdict: FAIL
- Stop reason: max_iterations with active P0
- Severity counts: 1 P0 / 2 P1 / 1 P2
- Release readiness state: release-blocking

The review confirms that the shared-memory governance surface is largely gone and the resume ladder now uses handover.md, _memory.continuity, and canonical spec docs. The failure is driven by the older standalone memory surface still surviving on live save and indexing paths, plus traceability drift in packet docs and runtime manuals.

## 2. Planning Trigger

A remediation packet is required before the retirement can be treated as complete because F001 is release-blocking and F002-F003 are active P1 truth-synchronization issues. The next planning work should target runtime retirement first, then document and playbook cleanup.

## 3. Active Finding Registry

### P0
- F001 - Legacy specs/**/memory save and indexing support remains live. The live save contract still accepts specs/**/memory/*.md, the parser returns true for those paths, startup indexing still scans them, and recovery hints/tests still teach the same surface. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:958-987] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1260-1299] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:223-229]

### P1
- F002 - Shared-space column retirement story is internally inconsistent. The cleanup packet says shared_space_id stays, the changelog says it drops on startup, and the runtime performs a best-effort drop with an older-SQLite fallback that keeps the column. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:65-68] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md:50-53] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:92-94] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534-1542]
- F003 - Cross-runtime agent docs still advertise retired memory and shared-memory workflows. OpenCode, Claude, Gemini, and Codex copies still treat memory/ as a live spec-folder exception, and Codex still lists /memory:manage shared plus memory/*.md handover inputs. [SOURCE: .opencode/agent/orchestrate.md:356-366] [SOURCE: .claude/agents/orchestrate.md:356-366] [SOURCE: .gemini/agents/orchestrate.md:356-366] [SOURCE: .opencode/agent/speckit.md:26-30] [SOURCE: .claude/agents/speckit.md:26-30] [SOURCE: .gemini/agents/speckit.md:26-30] [SOURCE: .codex/agents/orchestrate.toml:811-817] [SOURCE: .codex/agents/handover.toml:16-17] [SOURCE: .codex/agents/handover.toml:53-54]

### P2
- F004 - Manual testing playbook still uses retired specs/<target-spec>/memory examples. The reviewed lifecycle scenarios still teach deprecated input paths in their prompt and command text. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:30] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/097-async-ingestion-job-lifecycle-p0-3.md:35] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:19] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:30] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/144-advisory-ingest-lifecycle-forecast.md:35]

## 4. Remediation Workstreams

1. Runtime retirement completion
   - Remove specs/**/memory acceptance from memory_save contracts, parser helpers, startup discovery, recovery hints, and representative tests.
2. Shared-space column truth sync
   - Decide whether the supported runtime story is keep, drop, or best-effort drop with fallback, then align packet docs, checklist evidence, and changelog wording to that reality.
3. Cross-runtime docs and playbook cleanup
   - Remove memory/ and /memory:manage shared guidance from OpenCode, Claude, Codex, and Gemini agent manuals, then update lifecycle playbook examples to canonical spec-document inputs.

## 5. Spec Seed

- Seed A: Retire legacy memory-path compatibility from memory_save and startup indexing.
- Seed B: Reconcile shared_space_id migration semantics across packet docs, checklist evidence, changelog, and vector-index-schema.ts.
- Seed C: Scrub cross-runtime agent and playbook guidance that still advertises memory/ or shared-memory flows.

## 6. Plan Seed

1. Remove live acceptance of specs/**/memory/*.md from tool schema descriptions, path validation, parser helpers, startup discovery, recovery hints, and save/index tests.
2. Decide and document the supported shared_space_id migration behavior, then align packet docs and changelog text to match the runtime.
3. Update OpenCode, Claude, Codex, and Gemini agent manuals plus the lifecycle playbook so all operator guidance points at canonical packet docs only.
4. Rerun this deep review or an equivalent release audit after the cleanup to clear F001-F004.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | fail | Runtime legacy memory support and the shared_space_id story diverge from packet claims. |
| checklist_evidence | fail | CHK-013 certifies a schema exception story that is no longer the whole truth. |
| skill_agent | fail | Agent manuals still advertise retired memory/ and shared-memory workflows. |
| agent_cross_runtime | fail | The same stale guidance exists in OpenCode, Claude, Codex, and Gemini variants. |
| feature_catalog_code | pass | No additional feature-catalog residue was needed to explain the failing verdict. |
| playbook_capability | fail | Lifecycle playbooks still teach deprecated memory-path inputs. |

## 8. Deferred Items

- F004 remains advisory relative to the blocking runtime and traceability work, but it should be cleaned up in the same remediation cycle.
- Sampled packet memory directories under .opencode/specs/system-spec-kit were either empty or clearly historical, so they were not promoted to findings in this run.

## 9. Audit Appendix

- Dimension coverage: 4 of 4
- Blocked convergence reason: active P0 plus manual 20-iteration cap
- Clean areas observed during the review:
  - No live shared_memory_enable, shared_memory_status, shared_space_upsert, or shared_space_membership_set registrations were needed to explain any active issue.
  - No live sharedSpaceId request plumbing or deleted governance flags surfaced in the active runtime sweep.
  - The resume ladder itself follows handover.md -> _memory.continuity -> canonical spec docs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:76-85]
  - Canonical save routing resolves target packet docs before merge. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1198-1264]
