---
title: "Tasks: Task 01 — README Audit & Alignment [task-01-readme-alignment/tasks]"
description: "Task Format: T### Description (file path)"
trigger_phrases:
  - "tasks"
  - "task"
  - "readme"
  - "audit"
  - "alignment"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Task 01 — README Audit & Alignment

<!-- SPECKIT_LEVEL: 3+ -->
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

**Task Format**: `T### Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: P0 High-Priority READMEs

- [ ] T001 Audit `.opencode/README.md` statistics table (counts: agents, skills, commands, templates, tests)
- [ ] T002 Audit `.opencode/skill/system-spec-kit/README.md` (5 sources, 7 intents, schema v13, document-type scoring, check-placeholders.sh, upgrade-level.sh)
- [ ] T003 Audit `.opencode/skill/system-spec-kit/mcp_server/README.md` (same as T002 + includeSpecDocs parameter)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: P1 Medium-Priority READMEs

### mcp_server/lib/ READMEs (17 files)
- [ ] T004 Audit `mcp_server/lib/README.md` (7 intents reference)
- [ ] T005 Audit `mcp_server/lib/search/README.md` (7 intents, find_spec + find_decision)
- [ ] T006 Audit `mcp_server/lib/scoring/README.md` (document-type scoring multipliers)
- [ ] T007 Audit `mcp_server/lib/storage/README.md` (causal chains, spec document edges)
- [ ] T008 Audit `mcp_server/lib/config/README.md` (document types, schema v13)
- [ ] T009 Audit `mcp_server/tests/README.md` (test count, spec126 tests)
- [ ] T010-T020 Audit remaining 11 mcp_server/lib/ sub-directory READMEs

### scripts/ READMEs (16 files)
- [ ] T021 Audit `scripts/README.md` (upgrade-level.sh, check-placeholders.sh, check-anchors.sh)
- [ ] T022 Audit `scripts/spec/README.md` (same script listing)
- [ ] T023 Audit `scripts/core/README.md` (subfolder-utils.ts, memory-indexer.ts)
- [ ] T024 Audit `scripts/tests/README.md` (test-upgrade-level.sh, test-subfolder-resolution.js)
- [ ] T025 Audit `scripts/memory/README.md` (generate-context.ts subfolder handling)
- [ ] T026-T036 Audit remaining 11 scripts/ sub-directory READMEs

### templates/ READMEs (10 files)
- [ ] T037 Audit `templates/README.md` (template count, anchor tag conventions)
- [ ] T038-T046 Audit remaining 9 templates/ sub-directory READMEs

### shared/ READMEs (4 files)
- [ ] T047 Audit `shared/README.md` (normalization.ts updates)
- [ ] T048-T050 Audit remaining 3 shared/ sub-directory READMEs

### Global skill READMEs
- [ ] T051 Audit `.opencode/skill/README.md` (9 skills, cross-references current)
- [ ] T052 Audit `.opencode/install_guides/README.md` (Node modules relocation spec 120)

### Workflow skill READMEs (6 files)
- [ ] T053 Audit `sk-doc/README.md`
- [ ] T054 Audit `sk-code--opencode/README.md`
- [ ] T055 Audit `workflows-code--web-dev/README.md`
- [ ] T056 Audit `sk-code--full-stack/README.md`
- [ ] T057 Audit `sk-git/README.md`
- [ ] T058 Audit `mcp-chrome-devtools/README.md`

### MCP skill READMEs (2 files)
- [ ] T059 Audit `mcp-code-mode/README.md`
- [ ] T060 Audit `mcp-figma/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: P2 Low-Priority Compliance

- [ ] T061 Check all 60+ system-spec-kit READMEs for anchor tag pairs (scan for ANCHOR comment markers)
- [ ] T062 Check for HVR violations (no three-item inline lists, no superlatives)
- [ ] T063 Check for YAML frontmatter presence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation

- [ ] T064 Populate changes.md with all audit findings
- [ ] T065 Add before/after text for each change
- [ ] T066 Mark priority (P0/P1/P2) for each change
- [ ] T067 Verify no placeholder text remains in changes.md
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 67 tasks marked `[x]`
- [ ] changes.md has specific file paths and line content
- [ ] Each change has before/after text
- [ ] No placeholder text in changes.md
- [ ] All P0 items complete, P1 items complete or user-approved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Task 01 breakdown: 67 tasks across 4 phases
Systematic README audit from P0 → P1 → P2 → Documentation
-->
