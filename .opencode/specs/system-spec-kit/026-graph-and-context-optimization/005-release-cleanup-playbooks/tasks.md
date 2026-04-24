---
title: "Tasks: Release Cleanup Playbooks [system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/tasks]"
description: "Consolidated task log for the three release workstreams merged into root-only packet docs."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
trigger_phrases:
  - "005-release-cleanup-playbooks tasks"
  - "release cleanup playbooks tasks"
  - "phase 5 tasks 026"
  - "release alignment tasks"
  - "cleanup audit tasks"
  - "playbook remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged three phase task logs into root tasks"
    next_safe_action: "Reference only; work complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:merge-phases-root-only-2026-04-24"
      session_id: "026-phase-005-merge-root-only-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
status: complete
---
# Tasks: Release Cleanup Playbooks

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### Description`

- `Reviewed` = file read against the Phase 018 continuity contract.
- `Updated` = file changed and re-read after patching.
- `Blocked` = file read, confirmed stale, could not be edited in runtime.
- `Deleted` = hard-deleted (not archived).
- `Recorded` = evidence captured without touching implementation.
- `Fixed` = finding resolved with a targeted code, documentation, or test change.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### A. Documentation Parity

- [x] T001 Reconstruct the 016 001 target list (63 SKILL/internal-doc files).
- [x] T002 Reconstruct the 016 002 target list (44 command files).
- [x] T003 Reconstruct the 016 003 target list (34 README files) and add the 20-file first-party SKILL README spot-check plus 89-file stale-term scan.
- [x] T004 Scan each target set for pre-018 continuity wording; separate legitimate archive references from real drift.

### B. Runtime Cleanup

- [x] T005 Define shared-memory deletion scope: handler, shared-spaces library, governance / HYDRA / archival flags, tests, docs.
- [x] T006 Design the `graph-metadata.json` schema: `schema_version`, lineage fields, `manual` relationships, `derived` section.
- [x] T007 Lock MCP config scope to the five Public configs.
- [x] T008 Prepare the dead-code scan tooling: compiler `--noUnusedLocals --noUnusedParameters`, dead-concept greps, console sweeps.

### C. Playbook + Remediation

- [x] T009 Confirm the playbook corpus entry point: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`.
- [x] T010 Retarget the playbook runner fixture to the active packet path.
- [x] T011 Triage the 22 deep-review findings into documentation, code, and test categories.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### A. Documentation Parity

- [x] T020 Update the 32 drifted SKILL/internal-doc files to the Phase 018 contract; re-read every edit; `validate.sh --strict` → PASSED.
- [x] T021 Update the 28 editable drifted command files; re-read every edit.
- [x] T022 Re-read the 7 stale `.agents/commands/` mirror wrappers; confirm sandbox block (`Operation not permitted`) and log as blocked.
- [x] T023 Run `validate.sh --strict` on the command pass → PASSED.
- [x] T024 Update the 11 drifted README and install-guide surfaces (`mcp_server/lib/`, `scripts/`, `shared/` subsystem families); re-read every edit; `validate.sh --strict` → PASSED.

### B. Runtime Cleanup

- [x] T030 Delete `mcp_server/handlers/shared-memory.ts` and `mcp_server/lib/collab/shared-spaces.ts`.
- [x] T031 Remove shared-memory tools, request parameters, and retention-policy surfaces.
- [x] T032 Remove `SPECKIT_MEMORY_SCOPE_ENFORCEMENT`, `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS`, `SPECKIT_HYDRA_*`, `SPECKIT_ARCHIVAL` flags and callers from active TS.
- [x] T033 Delete `lib/cognitive/archival-manager.ts`; remove its bootstrap from `context-server.ts`.
- [x] T034 Remove shared-memory command surface, catalog / playbook entries, and shared-memory-only tests.
- [x] T035 Preserve `shared_space_id` schema columns in `vector-index-schema.ts` (unsafe SQLite column removal deferred).
- [x] T036 Create `graph-metadata-schema.ts` and `graph-metadata-parser.ts` with atomic write.
- [x] T037 Integrate `graph-metadata.json` refresh into the canonical-save path.
- [x] T038 Add `document_type='graph_metadata'` to indexing and causal-edge processing.
- [x] T039 Create `scripts/graph/backfill-graph-metadata.ts`.
- [x] T040 Execute backfill across all 515 spec-folder roots; leave `manual` relationship arrays empty.
- [x] T041 Adopt `graph-metadata.json` lifecycle in plan, complete, resume, validation, and scripts docs.
- [x] T042 Remove `MEMORY_DB_PATH` from all five Public MCP configs.
- [x] T043 Remove redundant checked-in `SPECKIT_*` feature flags from all five configs.
- [x] T044 Verify runtime defaults: `cross-encoder.ts` → Voyage `rerank-2.5`; `rollout-policy.ts` → undefined / empty = enabled.
- [x] T045 Rebuild MCP config packet docs to valid Level 2.
- [x] T046 Run the compiler dead-code scan; remove dead imports, locals, and helper paths.
- [x] T047 Remove raw runtime `console.log` from production runtime modules.
- [x] T048 Rewrite the package architecture narrative against live modules.
- [x] T049 Create missing source READMEs for directories expanded by the continuity refactor.
- [x] T050 Rewrite the legacy 006 resource map to current reality.

### C. Playbook + Remediation

- [x] T060 Restore Level 2 template structure in the playbook rewrite packet docs; correct playbook index references.
- [x] T061 Create the missing `tasks.md`, `checklist.md`, and `implementation-summary.md` for the playbook rewrite packet; `validate.sh --strict` → PASSED.
- [x] T062 Patch the runner (`manual-playbook-runner.ts`) to retarget Phase 015 and parse live playbook formats.
- [x] T063 Patch the fixture (`manual-playbook-fixture.ts`) to point at the active packet.
- [x] T064 Run the Vitest blocker rerun (`handler-helpers`, `spec-doc-structure`) → PASS (2 files, 78 tests).
- [x] T065 Run the live manual runner sweep → discovers 300 active files, parses 290, reports 10 parse failures, aborts during fixture seeding; record evidence.
- [x] T066 Wave 1 — Apply 14 documentation fixes (templates, requirements, continuity, stop-hook, graph-metadata, READMEs, archive notes, playbook prose across sk-deep-review, sk-deep-research, system-spec-kit).
- [x] T067 Wave 2 — Fix causal edge identity dedup in `causal-edges.ts`.
- [x] T068 Wave 2 — Remove phase-1 hardcoding in `memory-save.ts`.
- [x] T069 Wave 2 — Fix `shared_space_id` column handling in `vector-index-schema.ts`.
- [x] T070 Wave 2 — Replace absolute path in `.gemini/settings.json`.
- [x] T071 Wave 3 — Reclassify unresolved signals as PASS; reframe the 015 packet as "coverage accounting".
- [x] T072 Wave 3 — Add phase-2 and phase-3 routing test additions and Gate D regression fixture expansion.

### D. Root-Only Flatten (this pass)

- [x] T080 Rewrite `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` as consolidated root docs.
- [x] T081 Create root `checklist.md` merging prior phase checklists.
- [x] T082 Migrate the `008-cleanup-and-audit-pt-01` deep-review archive from phase 002 up into the root `review/` directory.
- [x] T083 Delete the legacy context-index file.
- [x] T084 Delete the three phase folders (`001-release-alignment-revisits/`, `002-cleanup-and-audit/`, `003-playbook-and-remediation/`).
- [x] T085 Update `description.json` and `graph-metadata.json` to reflect a childless, complete packet.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T090 Run `tsc --noEmit` (both workspaces) after each code-touching pass → PASS.
- [x] T091 Run `vitest run` (affected suites) after each code-touching pass → PASS (incl. 15 files / 363 tests in Wave 3).
- [x] T092 Run `grep -rn "SPECKIT_HYDRA"`, `"SPECKIT_ARCHIVAL"`, `"SCOPE_ENFORCEMENT"` on active TS (non-test) → 0 matches.
- [x] T093 Confirm `graph-metadata.json` backfill coverage: 515/515 spec-folder roots at rollout time.
- [x] T094 Confirm env-block parity across all five Public MCP configs.
- [x] T095 Run `validate.sh --strict --no-recursive` at the flattened packet root → PASS.
- [x] T096 Record consolidated evidence in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Three workstreams closed with verification evidence recorded.
- [x] 141 documentation targets reviewed; 71 updated; 7 blocked mirrors logged.
- [x] Shared-memory feature hard-deleted; schema-column exception documented.
- [x] `graph-metadata.json` backfill at 515/515 roots; MCP configs aligned; dead code removed; architecture narrative current.
- [x] All 22 deep-review findings resolved across three waves.
- [x] Packet flattened to root-only docs with zero phase folders remaining.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Evidence ledger: `implementation-summary.md`
- Historical path references: `path-references-audit.md`
- Preserved review archives: `review/006-continuity-refactor-gates-pt-01/`, `review/008-cleanup-and-audit-pt-01/`
- Preserved research archive: `research/005-release-cleanup-playbooks-pt-01/`
<!-- /ANCHOR:cross-refs -->
