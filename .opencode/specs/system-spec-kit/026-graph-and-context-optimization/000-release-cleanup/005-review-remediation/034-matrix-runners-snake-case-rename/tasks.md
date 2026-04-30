---
title: "Tasks: 047 matrix_runners Snake Case Rename"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for the runtime folder rename, reference replacement, packet docs, and verification commands."
trigger_phrases:
  - "034-matrix-runners-snake-case-rename"
  - "matrix_runners rename"
  - "kebab-to-snake convention"
  - "mcp_server folder convention"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/034-matrix-runners-snake-case-rename"
    last_updated_at: "2026-04-29T22:47:36+02:00"
    last_updated_by: "codex"
    recent_action: "Completed tasks"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners"
      - "rename-log.md"
    session_dedup:
      fingerprint: "sha256:047-matrix-runners-snake-case-rename-tasks"
      session_id: "034-matrix-runners-snake-case-rename"
      parent_session_id: "033-release-readiness-synthesis-and-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 047 matrix_runners Snake Case Rename

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read system-spec-kit instructions and Level 2 templates. [EVIDENCE: templates loaded before authored docs]
- [x] T002 Inspect current runner files and reference surface. [EVIDENCE: `rg -l` found 57 affected text files before packet docs]
- [x] T003 Confirm spec folder exists. [EVIDENCE: packet folder contained `logs/iter-001.log` and `research/prompts/iteration-001.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Attempt git-aware rename. [EVIDENCE: `git mv` failed on `.git/index.lock` sandbox permission]
- [x] T005 Move runtime directory with filesystem fallback. [EVIDENCE: only `.opencode/skill/system-spec-kit/mcp_server/matrix_runners` remains]
- [x] T006 Replace literal old folder references. [EVIDENCE: 301 references replaced across 57 text files before packet docs]
- [x] T007 Update matrix adapter test imports. [EVIDENCE: imports now use `../matrix_runners/...`]
- [x] T008 Update runner README self-reference. [EVIDENCE: `mcp_server/matrix_runners/README.md` references `matrix_runners/`]
- [x] T009 Create packet metadata docs. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`]
- [x] T010 Create rename log. [EVIDENCE: `rename-log.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run MCP server build. [EVIDENCE: `npm run build` exit 0]
- [x] T012 Run matrix adapter smoke tests. [EVIDENCE: `npx vitest run matrix-adapter` exit 0, 5 files and 10 tests passed]
- [x] T013 Run final old-path grep. [EVIDENCE: final `grep -rln` returned no output]
- [x] T014 Run strict packet validator. [EVIDENCE: final `validate.sh --strict` exit 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual and automated verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Rename log**: See `rename-log.md`
<!-- /ANCHOR:cross-refs -->
