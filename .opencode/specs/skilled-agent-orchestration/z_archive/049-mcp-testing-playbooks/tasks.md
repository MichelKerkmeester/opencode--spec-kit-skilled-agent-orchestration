---
title: "Tasks: MCP Testing Playbooks for Four Skills"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "049 tasks"
  - "mcp playbook tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/049-mcp-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored Level-3 task breakdown across 6 phases"
    next_safe_action: "Author checklist.md verification matrix"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-bootstrap-2026-04-26"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---

# Tasks: MCP Testing Playbooks for Four Skills

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Scaffold spec 049

- [x] T001 Create spec.md with 4-skill matrix and 12 sections (`spec.md`)
- [x] T002 Create plan.md with 6 phases and CM-first sequence (`plan.md`)
- [x] T003 Create tasks.md (this file) (`tasks.md`)
- [ ] T004 Create checklist.md with P0/P1/P2 verification (`checklist.md`)
- [ ] T005 Create decision-record.md with ADR-001..ADR-005 (`decision-record.md`)
- [ ] T006 Create research.md with Phase-1 test-data inventory (`research.md`)
- [ ] T007 Run `generate-description.js` to create `description.json` and backfill `graph-metadata.json` (`description.json`, `graph-metadata.json`)
- [ ] T008 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` and confirm exit 0

---

## Phase 2: Author CM playbook (mcp-code-mode, ~26 scenarios)

- [ ] T010 Create folder structure: 7 category folders under `.opencode/skill/mcp-code-mode/manual_testing_playbook/`
- [ ] T011 Author root `manual_testing_playbook.md` with 6 global sections + 7 per-category summary sections + AUTOMATED TEST CROSS-REFERENCE + FEATURE FILE INDEX
- [ ] T012 [P] Author `01--core-tools/` (4 files): CM-001 list_tools, CM-002 search_tools, CM-003 tool_info, CM-004 call_tool_chain
- [ ] T013 [P] Author `02--manual-namespace-contract/` (3 files): CM-005, CM-006, CM-007
- [ ] T014 [P] Author `03--env-var-prefixing/` (3 files): CM-008, CM-009, CM-010
- [ ] T015 [P] Author `04--multi-tool-workflows/` (3 files): CM-011, CM-012, CM-013
- [ ] T016 [P] Author `05--clickup-and-chrome-via-cm/` (3 files): CM-014, CM-015, CM-016
- [ ] T017 [P] Author `06--third-party-via-cm/` (4 files): CM-017, CM-018, CM-019, CM-020
- [ ] T018 [P] Author `07--recovery-and-config/` (6 files): CM-021..CM-026
- [ ] T019 Run `validate_document.py` on CM root; iterate until exit 0
- [ ] T020 Verify CM ID count (root index) == per-feature file count (`find ... | wc -l`)
- [ ] T021 Freeze CM-001..CM-026 IDs (no renumbering after this point)

---

## Phase 3: Author BDG playbook (mcp-chrome-devtools, ~22 scenarios)

- [ ] T030 Create folder structure: 6 category folders under `.opencode/skill/mcp-chrome-devtools/manual_testing_playbook/`
- [ ] T031 Author root `manual_testing_playbook.md`
- [ ] T032 [P] Author `01--cli-bdg-lifecycle/` (4 files): BDG-001..BDG-004
- [ ] T033 [P] Author `02--protocol-discovery/` (3 files): BDG-005..BDG-007
- [ ] T034 [P] Author `03--dom-and-screenshot/` (3 files): BDG-008..BDG-010
- [ ] T035 [P] Author `04--console-and-network/` (3 files): BDG-011..BDG-013
- [ ] T036 [P] Author `05--mcp-parallel-instances/` (5 files): BDG-014..BDG-018 — must reference CM-005..CM-007 for naming and CM-014 for ClickUp via CM pattern
- [ ] T037 [P] Author `06--recovery-and-failure/` (4 files): BDG-019..BDG-022
- [ ] T038 Run `validate_document.py` on BDG root; iterate until exit 0
- [ ] T039 Verify BDG ID count == per-feature file count
- [ ] T040 Verify all `CM-NNN` references in BDG-014..BDG-018 resolve to existing CM scenarios

---

## Phase 4: Author CU playbook (mcp-clickup, ~25 scenarios)

- [ ] T050 Create folder structure: 6 category folders under `.opencode/skill/mcp-clickup/manual_testing_playbook/`
- [ ] T051 Author root `manual_testing_playbook.md`
- [ ] T052 [P] Author `01--cli-cu-install-and-auth/` (4 files): CU-001..CU-004
- [ ] T053 [P] Author `02--discovery-and-readonly/` (6 files): CU-005..CU-010
- [ ] T054 [P] Author `03--task-mutation-cli/` (6 files): CU-011..CU-016
- [ ] T055 [P] Author `04--mcp-bulk-and-fields/` (3 files): CU-017..CU-019 — reference CM-011 (sequential chain) and CM-012 (Promise.all parallel)
- [ ] T056 [P] Author `05--mcp-enterprise/` (4 files): CU-020..CU-023
- [ ] T057 [P] Author `06--recovery-and-rate-limits/` (4 files): CU-024..CU-027
- [ ] T058 Run `validate_document.py` on CU root; iterate until exit 0
- [ ] T059 Verify CU ID count == per-feature file count
- [ ] T060 Verify all `CM-NNN` references resolve

---

## Phase 5: CCC audit (mcp-coco-index, audit-only)

- [ ] T070 Read existing `mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md` + all 23 per-feature files
- [ ] T071 Diff against Phase-1 test-data inventory in research.md (refresh_index race, daemon socket health, env-var precedence, voyage_code_3 reset cycle, doctor.sh / ensure_ready.sh wrappers, COCOINDEX_CODE_ROOT_PATH override)
- [ ] T072 Record gap inventory in research.md `## CCC Audit (YYYY-MM-DD)` section — explicit `[]` if no gaps
- [ ] T073 [P] If 1-3 gaps confirmed, append per-feature files at next free numeric slot in matching existing categories (preserve all 23 existing IDs)
- [ ] T074 If files appended, run `validate_document.py` on CCC root; confirm still exit 0
- [ ] T075 Verify CCC root playbook byte-unchanged unless explicit gap-driven update (no prose freshening)

---

## Phase 6: Verification + completion

- [ ] T080 Cross-skill reference audit: grep all `CM-NNN` and `CCC-NNN` references in BDG/CU files; verify each resolves
- [ ] T081 Vague-prompt grep: search for "test it", "run it", "check stuff", "validate it" across all per-feature files; result must be empty
- [ ] T082 Unique-ID check per playbook: `awk` dedup; 0 duplicates required
- [ ] T083 Per-feature contract check: every file has both frontmatter keys + 5 H2 sections + ≥2 failure-triage steps
- [ ] T084 V7 smoke: execute CM-001 (local list_tools) end-to-end; capture evidence
- [ ] T085 V7 smoke: execute BDG-001 (real Chrome lifecycle) end-to-end; capture evidence (SKIP if no browser)
- [ ] T086 V7 smoke: execute CU-001 (live ClickUp install/version) end-to-end; capture evidence (SKIP if no token)
- [ ] T087 V7 smoke: execute CCC-001 (existing index search) end-to-end; capture evidence
- [ ] T088 Spec strict validate: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` exits 0
- [ ] T089 Fill `implementation-summary.md` with per-task evidence + V7 smoke verdicts + per-skill scenario counts
- [ ] T090 Memory save: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<spec-049-data>' .opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/`
- [ ] T091 Verify `description.json` and `graph-metadata.json` refreshed (new `last_updated_at` timestamp)

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] V1-V8 verification matrix all GREEN (see checklist.md)
- [ ] V7 smoke evidence captured for all 4 selected scenarios (PASS/FAIL/SKIP with rationale)

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Research / CCC audit findings**: See `research.md`
